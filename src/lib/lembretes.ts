import { Platform } from 'react-native';
import type { Medication } from '../store/storage';
import { doses, foiTomada, horaCurta } from './medicacao';

/**
 * Lembretes de medicação, agendados no próprio aparelho.
 *
 * São notificações locais: o celular guarda a fila e dispara sozinho, sem
 * servidor e sem conexão. É o que permite ao app avisar a hora do remédio
 * continuando a não enviar nada para lugar nenhum.
 *
 * No navegador isso não existe — a versão web do app roda para teste, e lá a
 * tela funciona mas o alarme não toca. As funções então não fazem nada, em vez
 * de quebrar a tela.
 */

const naoSuportado = Platform.OS === 'web';

/* O módulo é carregado sob demanda: no bundle web ele não tem o que fazer, e
   importá-lo no topo traria o custo para todas as telas. */
const modulo = async () => (naoSuportado ? null : await import('expo-notifications'));

/** Quantos lembretes cabem na fila. O iOS aceita 64 pendentes por aplicativo. */
const LIMITE = 60;

/** Pede a permissão de notificação. Devolve se ela foi concedida. */
export async function pedirPermissao(): Promise<boolean> {
  const N = await modulo();
  if (!N) return false;
  const atual = await N.getPermissionsAsync();
  if (atual.granted) return true;
  const pedida = await N.requestPermissionsAsync();
  return pedida.granted;
}

/** Se a paciente já autorizou os lembretes. */
export async function temPermissao(): Promise<boolean> {
  const N = await modulo();
  if (!N) return false;
  return (await N.getPermissionsAsync()).granted;
}

/**
 * Refaz a fila inteira a partir dos remédios cadastrados.
 *
 * Cancelar tudo e reagendar é mais simples — e mais confiável — do que tentar
 * casar cada lembrete com a alteração que o motivou. A fila é pequena e o
 * custo, imperceptível.
 */
export async function reagendar(meds: Medication[]): Promise<number> {
  const N = await modulo();
  if (!N) return 0;
  if (!(await temPermissao())) return 0;

  await N.cancelAllScheduledNotificationsAsync();

  const agora = Date.now();
  const fila = meds
    .flatMap((m) =>
      doses(m)
        .filter((d) => d.getTime() > agora && !foiTomada(m, d))
        .map((quando) => ({ m, quando })),
    )
    .sort((a, b) => a.quando.getTime() - b.quando.getTime())
    .slice(0, LIMITE);

  for (const { m, quando } of fila) {
    await N.scheduleNotificationAsync({
      content: {
        title: 'Hora do seu remédio',
        body: `${m.name} — ${horaCurta(quando)}`,
        sound: true,
        data: { medicationId: m.id },
      },
      trigger: { type: N.SchedulableTriggerInputTypes.DATE, date: quando },
    });
  }
  return fila.length;
}

/** Apaga todos os lembretes pendentes. */
export async function cancelarTudo(): Promise<void> {
  const N = await modulo();
  if (!N) return;
  await N.cancelAllScheduledNotificationsAsync();
}

/**
 * Faz o aviso aparecer mesmo com o app aberto. Sem isto, a paciente que
 * estivesse lendo o app na hora da dose não veria nada.
 */
export async function configurarExibicao(): Promise<void> {
  const N = await modulo();
  if (!N) return;
  N.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export const lembretesDisponiveis = !naoSuportado;

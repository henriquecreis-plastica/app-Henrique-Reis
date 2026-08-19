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

  /* Cada remédio leva a sua parte da fila.
     Sem isso, um item frequente domina: compressas de 2 em 2 horas por 4 dias
     são 48 doses, e as primeiras 60 notificações em ordem de tempo seriam
     quase só elas — o antibiótico de 12/12h ficaria sem lembrete nenhum. */
  const pendentes = meds
    .filter((m) => !m.silent)
    .map((m) => ({
      m,
      doses: doses(m).filter((d) => d.getTime() > agora && !foiTomada(m, d)),
    }))
    .filter((x) => x.doses.length > 0);

  if (!pendentes.length) return 0;

  const cota = Math.max(2, Math.floor(LIMITE / pendentes.length));

  /* Um aviso por horário, não por remédio.
     Numa prescrição de Face HD, às 8h vencem cinco itens ao mesmo tempo: cinco
     notificações seguidas viram ruído, e ruído ensina a paciente a descartar
     tudo sem ler — inclusive o do antibiótico. Um aviso que diz "5 itens agora"
     e lista quais resolve o mesmo com um toque só. */
  const porHorario = new Map<number, Medication[]>();
  for (const { m, doses: ds } of pendentes) {
    for (const quando of ds.slice(0, cota)) {
      /* Ao minuto: doses do mesmo minuto são a mesma ida ao armarinho. */
      const chave = Math.floor(quando.getTime() / 60_000) * 60_000;
      porHorario.set(chave, [...(porHorario.get(chave) ?? []), m]);
    }
  }

  const fila = [...porHorario.entries()].sort((a, b) => a[0] - b[0]).slice(0, LIMITE);

  for (const [instante, remedios] of fila) {
    const quando = new Date(instante);
    const nomes = [...new Set(remedios.map((m) => m.name))];
    await N.scheduleNotificationAsync({
      content: {
        title:
          nomes.length === 1
            ? 'Hora do seu remédio'
            : `${nomes.length} itens agora — ${horaCurta(quando)}`,
        body: nomes.length === 1 ? `${nomes[0]} — ${horaCurta(quando)}` : nomes.join(' · '),
        sound: true,
        data: { at: instante },
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

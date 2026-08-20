import { Alert, Linking, Platform } from 'react-native';
import { clinic } from '../theme';

async function open(url: string, fallbackMessage: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    abrirNaWeb(url);
    return;
  }

  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Não foi possível abrir', fallbackMessage);
  }
}

/**
 * Abrir um endereço no navegador — o que só é simples no aplicativo instalado.
 *
 * `tel:` não é uma página: quem atende é o próprio sistema, e o navegador só
 * entrega o número quando a navegação parte da página atual. Pedido em aba
 * nova, o toque não faz absolutamente nada — foi o que aconteceu ao testar o
 * botão de ligar pelo link de demonstração.
 *
 * Um endereço https é o contrário: melhor em aba nova, para a paciente não
 * perder o app de vista. Só que a aba nova é bloqueada quando a página roda
 * dentro de uma moldura sem permissão de abrir janelas — e é bloqueada em
 * silêncio, sem erro que se possa capturar. Por isso `window.open` vai sem
 * `noopener`: com ele o navegador devolve null mesmo quando deu certo, e null
 * é justamente o sinal de bloqueio que interessa aqui. A ligação com a página
 * de origem é cortada logo depois, que é o que `noopener` garantiria.
 *
 * Bloqueada a aba, resta abrir no lugar: sair do app incomoda menos do que um
 * botão que não responde.
 */
function abrirNaWeb(url: string) {
  if (!/^https?:/i.test(url)) {
    window.location.href = url;
    return;
  }

  let aba: Window | null = null;
  try {
    aba = window.open(url, '_blank');
  } catch {
    aba = null;
  }

  if (aba) {
    aba.opener = null;
    return;
  }
  window.location.href = url;
}

export function openWhatsApp(message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return open(
    `https://wa.me/${clinic.whatsapp}${text}`,
    'Verifique se o WhatsApp está instalado no seu aparelho.',
  );
}

export function callPhone(number: string = clinic.phone) {
  const scheme = Platform.OS === 'ios' ? 'telprompt' : 'tel';
  return open(`${scheme}:${number}`, `Ligue para ${number}.`);
}

export function openLink(url: string) {
  return open(url, url);
}

/** Mensagem pré-preenchida com o contexto da paciente, para agilizar o atendimento. */
export function buildContextMessage(params: {
  name?: string;
  procedure: string;
  day: number;
  subject?: string;
}) {
  const who = params.name ? `Sou ${params.name}. ` : '';
  const about = params.subject ? ` Preciso de orientação sobre: ${params.subject}.` : '';
  return `Olá! ${who}Estou no ${params.day}º dia de pós-operatório de ${params.procedure}.${about}`;
}

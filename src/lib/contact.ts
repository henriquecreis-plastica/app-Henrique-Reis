import { Alert, Linking, Platform } from 'react-native';
import { clinic } from '../theme';

async function open(url: string, fallbackMessage: string) {
  /**
   * No navegador, abrir por um <a> em vez de `Linking.openURL`, que por baixo
   * chama `window.open`. A diferença aparece quando a página está dentro de
   * uma moldura — é o caso do link de demonstração: ali `window.open` é
   * bloqueado e o toque não faz nada, enquanto o clique num link é
   * reconhecido e abre normalmente. Em aba própria os dois funcionam igual.
   */
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }

  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Não foi possível abrir', fallbackMessage);
  }
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

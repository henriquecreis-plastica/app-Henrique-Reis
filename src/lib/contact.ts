import { Alert, Linking, Platform } from 'react-native';
import { clinic } from '../theme';

async function open(url: string, fallbackMessage: string) {
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

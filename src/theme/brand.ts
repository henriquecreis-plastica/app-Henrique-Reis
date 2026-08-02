/**
 * ------------------------------------------------------------------
 * IDENTIDADE VISUAL — ponto único de configuração da marca
 * ------------------------------------------------------------------
 * Este é o único arquivo que precisa ser alterado para alinhar 100%
 * o app com o site www.plasticahenrique.com.
 *
 * Como ajustar:
 *  1. Cores  -> substitua os HEX em `palette` pelos do site.
 *  2. Logo   -> troque `assets/logo.png` (fundo transparente, 1024px de
 *               largura) e `assets/icon.png` (1024x1024).
 *  3. Dados  -> atualize `clinic` com telefone/WhatsApp e endereço reais.
 *
 * Nenhuma outra parte do código guarda cor ou texto institucional.
 */

export const palette = {
  /** Verde profundo — cor institucional principal (cabeçalhos, botões). */
  primary: '#0F2E2C',
  primaryDeep: '#08201F',
  primarySoft: '#1C4542',

  /** Dourado suave — cor de destaque, detalhes e acentos. */
  accent: '#C4A265',
  accentSoft: '#E8DAC0',

  /** Neutros quentes — fundo e superfícies. */
  bg: '#FBF9F6',
  surface: '#FFFFFF',
  surfaceAlt: '#F3EFE9',
  border: '#E6DFD5',

  /** Texto. */
  text: '#1A2422',
  textMuted: '#6B7674',
  textOnDark: '#F6F2EC',
  textOnDarkMuted: '#B8C4C1',

  /** Semáforo clínico — usado na triagem de sintomas. */
  normal: '#2E7D5B',
  normalBg: '#E7F3ED',
  attention: '#B77816',
  attentionBg: '#FBF0DC',
  urgent: '#B3261E',
  urgentBg: '#FBE9E7',
} as const;

/** Dados institucionais exibidos no app. Confirme antes de publicar. */
export const clinic = {
  doctor: 'Dr. Henrique Reis',
  fullName: 'Dr. Henrique César dos Reis',
  crm: 'CRM/SC 17913 · RQE 17450',
  titles: [
    'Membro Especialista da Sociedade Brasileira de Cirurgia Plástica',
    'Membro da ISAPS — International Society of Aesthetic Plastic Surgery',
  ],
  city: 'Florianópolis · SC',
  site: 'https://www.plasticahenrique.com',
  instagram: 'https://www.instagram.com/dr.henriquereis/',
  instagramHandle: '@dr.henriquereis',

  /** TODO: substituir pelos números reais da clínica antes de publicar. */
  whatsapp: '5548999999999',
  phone: '+554899999999',
  address: 'Florianópolis — SC',

  /** Telefone de emergência do serviço (24h). */
  emergency: '+554899999999',
} as const;

export type Palette = typeof palette;

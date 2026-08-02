/**
 * ------------------------------------------------------------------
 * IDENTIDADE VISUAL — ponto único de configuração da marca
 * ------------------------------------------------------------------
 * Este é o único arquivo que precisa ser alterado para ajustar cores e
 * dados institucionais do app.
 *
 * O logo oficial está em `assets/`, nas variações geradas a partir do
 * arquivo original: lockup completo, assinatura e monograma, cada um em
 * preto e em branco. O componente `src/components/Logo.tsx` escolhe a
 * variação certa para cada fundo.
 *
 * Nenhuma outra parte do código guarda cor ou texto institucional.
 */

export const palette = {
  /** Verde Tiffany — a cor da marca. Usada em cheio no cartão principal. */
  tiffany: '#0ABAB5',
  tiffanyLight: '#7FE3DC',
  tiffanyWash: '#E4F6F4',

  /**
   * Teal profundo derivado do Tiffany. É o que sustenta texto branco com
   * contraste adequado — o Tiffany puro é claro demais para isso.
   */
  primary: '#0E5C58',
  primaryDeep: '#083F3C',
  primarySoft: '#12716C',

  /** Destaques. `accentInk` é a versão legível sobre fundo claro. */
  accent: '#0ABAB5',
  accentInk: '#0A716E',
  accentSoft: '#E4F6F4',

  /** Neutros com leve viés frio, para acompanhar o Tiffany. */
  bg: '#F7FAF9',
  surface: '#FFFFFF',
  surfaceAlt: '#EDF6F5',
  border: '#DBE9E7',

  /** Texto. */
  text: '#12211F',
  textMuted: '#5E706E',
  textOnDark: '#F2FAF9',
  textOnDarkMuted: '#B2D4D1',
  /** Texto sobre o verde Tiffany em cheio. */
  textOnTiffany: '#053331',
  textOnTiffanyMuted: '#0A544F',

  /** Semáforo clínico — deliberadamente fora da paleta da marca. */
  normal: '#177A5C',
  normalBg: '#E6F4EC',
  attention: '#AF7415',
  attentionBg: '#FBF1DE',
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

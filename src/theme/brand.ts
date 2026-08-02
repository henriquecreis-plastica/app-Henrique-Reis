/**
 * ------------------------------------------------------------------
 * IDENTIDADE VISUAL — ponto único de configuração da marca
 * ------------------------------------------------------------------
 * A identidade tem três cores: verde Tiffany, branco e preto.
 *
 *   Preto    — o preto do logotipo. Texto, botões de ação e ênfase.
 *   Branco   — o fundo. É o que dá o ar do consultório.
 *   Tiffany  — o acento. Marca onde a paciente está e o que está em ordem.
 *
 * Duas variações do mesmo verde existem por acessibilidade, não por estilo:
 * `tiffanyDeep` é o Tiffany escurecido, usado quando ele precisa carregar
 * texto pequeno sobre branco (o tom puro não atinge contraste suficiente).
 *
 * O logotipo nunca é recolorido — veja `src/components/Logo.tsx`.
 */

const TIFFANY = '#0ABAB5';
const TIFFANY_DEEP = '#067F7B';
const INK = '#111111';

export const palette = {
  // --- As três cores da identidade ---
  tiffany: TIFFANY,
  tiffanyDeep: TIFFANY_DEEP,
  tiffanyWash: '#E6F7F6',
  tiffanyLine: '#A6E4DF',
  ink: INK,
  white: '#FFFFFF',

  // --- Papéis na interface ---
  /** Ação principal e ênfase: o preto do logotipo. */
  primary: INK,
  /** Acento da marca. */
  accent: TIFFANY,
  /** Acento legível sobre branco — para texto pequeno e ícones. */
  accentInk: TIFFANY_DEEP,
  accentSoft: '#E6F7F6',

  bg: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceAlt: '#F3F3F3',
  border: '#E7E7E7',

  text: INK,
  textMuted: '#6B6B6B',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: '#C6C6C6',
  /** Sobre o Tiffany em cheio, o texto é preto — nunca branco. */
  textOnTiffany: '#062E2C',
  textOnTiffanyMuted: '#0A4E4B',

  /**
   * Semáforo clínico. O Tiffany assume o nível "esperado": em um app cujo
   * acento já significa "está tudo no seu curso", acrescentar um verde
   * separado só criaria ruído. Âmbar e vermelho ficam reservados para as
   * duas escalas em que a paciente precisa agir.
   */
  normal: TIFFANY_DEEP,
  normalBg: '#E6F7F6',
  attention: '#A2680C',
  attentionBg: '#FCF0DA',
  urgent: '#C0271F',
  urgentBg: '#FCE9E7',
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

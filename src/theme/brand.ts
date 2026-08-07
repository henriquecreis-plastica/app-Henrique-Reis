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
  site: 'https://www.plasticahenrique.com',
  instagram: 'https://www.instagram.com/dr.henriquereis/',
  instagramHandle: '@dr.henriquereis',
  /**
   * Canal do YouTube. O link vai limpo, sem o parâmetro de rastreio que o
   * app do YouTube acrescenta ao compartilhar.
   */
  youtube: 'https://www.youtube.com/@plasticahenrique',
  youtubeHandle: '@plasticahenrique',

  /** WhatsApp da clínica, no formato internacional sem sinais. */
  whatsapp: '5548991450910',
  phone: '+5548991450910',

  address: 'Av. Mauro Ramos, 1970 — salas 501 e 502',
  addressComplement: 'Centro · Florianópolis — SC',
  /** Consulta de mapa aberta ao tocar no endereço. */
  addressQuery: 'Avenida Mauro Ramos, 1970, Centro, Florianópolis, SC',

  /** Urgências atendidas pelo mesmo número da clínica. */
  emergency: '+5548991450910',

  /**
   * Link direto de avaliação, obtido no Perfil da Empresa no Google. Abre a
   * janela de avaliação já apontando para a ficha da clínica, sem passos
   * intermediários. Se a ficha for recriada, o link precisa ser gerado de
   * novo em "Peça avaliações".
   */
  googleReview:
    'https://search.google.com/local/writereview' +
    '?placeid=ChIJ8xbXrhY4J5URO9mS1ao-5o0' +
    '&source=g.page.m.ia._&laa=nmx-review-solicitation-ia2',
} as const;

export type Palette = typeof palette;

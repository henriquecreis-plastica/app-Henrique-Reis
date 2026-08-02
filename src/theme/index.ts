import { Platform, TextStyle } from 'react-native';
import { palette } from './brand';

export { palette, clinic } from './brand';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

/**
 * O logo usa uma sem serifa geométrica leve, com espaçamento largo. Os títulos
 * seguem o mesmo espírito: peso leve e caixa alta reservada para os rótulos.
 */
const sans = Platform.select({
  ios: 'System',
  android: 'sans-serif-light',
  default: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
});

export const type = {
  /** Títulos institucionais — leves e amplos, como o logotipo. */
  display: {
    fontFamily: sans,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '300',
    color: palette.text,
    letterSpacing: -0.2,
  } as TextStyle,
  title: {
    fontFamily: sans,
    fontSize: 22,
    lineHeight: 29,
    fontWeight: '400',
    color: palette.text,
    letterSpacing: -0.1,
  } as TextStyle,
  heading: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    color: palette.text,
  } as TextStyle,
  body: {
    fontSize: 15,
    lineHeight: 23,
    color: palette.text,
  } as TextStyle,
  bodyMuted: {
    fontSize: 15,
    lineHeight: 23,
    color: palette.textMuted,
  } as TextStyle,
  small: {
    fontSize: 13,
    lineHeight: 19,
    color: palette.textMuted,
  } as TextStyle,
  /**
   * Rótulo em caixa alta com tracking largo — ecoa o "cirurgia plástica" do
   * logotipo. Usa o tom escuro do Tiffany para ter contraste sobre o branco.
   */
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: palette.accentInk,
  } as TextStyle,
};

export const shadow = {
  card: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOpacity: 0.06,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 2 },
    default: { boxShadow: '0 6px 18px rgba(0,0,0,0.06)' },
  }) as object,
};

/** Cores do semáforo clínico por nível de gravidade. */
export const severity = {
  normal: {
    label: 'Esperado',
    color: palette.normal,
    bg: palette.normalBg,
    icon: 'checkmark-circle' as const,
  },
  attention: {
    label: 'Atenção',
    color: palette.attention,
    bg: palette.attentionBg,
    icon: 'alert-circle' as const,
  },
  urgent: {
    label: 'Contato imediato',
    color: palette.urgent,
    bg: palette.urgentBg,
    icon: 'warning' as const,
  },
} as const;

export type Severity = keyof typeof severity;

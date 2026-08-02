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

const serif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia, "Times New Roman", serif',
});

export const type = {
  /** Títulos institucionais — serifada, transmite o tom do site. */
  display: {
    fontFamily: serif,
    fontSize: 30,
    lineHeight: 36,
    color: palette.text,
    letterSpacing: -0.4,
  } as TextStyle,
  title: {
    fontFamily: serif,
    fontSize: 22,
    lineHeight: 28,
    color: palette.text,
    letterSpacing: -0.2,
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
  /** Rótulo em caixa alta com tracking largo — assinatura visual da marca. */
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: palette.accent,
  } as TextStyle,
};

export const shadow = {
  card: Platform.select({
    ios: {
      shadowColor: '#1A2422',
      shadowOpacity: 0.06,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 2 },
    default: { boxShadow: '0 6px 18px rgba(26,36,34,0.07)' },
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

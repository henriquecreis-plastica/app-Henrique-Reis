import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { palette, radius, severity, shadow, spacing, type, type Severity } from '../theme';

export function Card({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  const content = <View style={[styles.card, style]}>{children}</View>;
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {content}
    </Pressable>
  );
}

export function Overline({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[type.overline, style]}>{children}</Text>;
}

export function SectionHeader({
  overline,
  title,
  description,
}: {
  overline?: string;
  title: string;
  description?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      {overline ? <Overline>{overline}</Overline> : null}
      <Text style={type.title}>{title}</Text>
      {description ? <Text style={type.bodyMuted}>{description}</Text> : null}
    </View>
  );
}

export function SeverityBadge({ level, compact }: { level: Severity; compact?: boolean }) {
  const s = severity[level];
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }, compact && styles.badgeCompact]}>
      <Ionicons name={s.icon} size={compact ? 12 : 14} color={s.color} />
      <Text style={[styles.badgeText, { color: s.color }, compact && { fontSize: 11 }]}>
        {s.label}
      </Text>
    </View>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  style,
  disabled,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  const v = buttonVariants[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: v.bg, borderColor: v.border },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={17} color={v.fg} /> : null}
      <Text style={[styles.buttonText, { color: v.fg }]}>{label}</Text>
    </Pressable>
  );
}

const buttonVariants = {
  primary: { bg: palette.primary, fg: palette.textOnDark, border: palette.primary },
  secondary: { bg: palette.surface, fg: palette.primary, border: palette.border },
  danger: { bg: palette.urgent, fg: '#FFFFFF', border: palette.urgent },
  ghost: { bg: 'transparent', fg: palette.primary, border: 'transparent' },
} as const;

export function Chip({
  label,
  selected,
  onPress,
  icon,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.pressed,
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={13} color={selected ? palette.textOnDark : palette.textMuted} />
      ) : null}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

/** Lista com marcador em traço fino, usada em todos os conteúdos de orientação. */
export function Bullets({
  items,
  color,
  textColor,
}: {
  items: string[];
  /** Cor do marcador. */
  color?: string;
  /** Cor do texto — necessária sobre fundos escuros. */
  textColor?: string;
}) {
  return (
    <View style={{ gap: spacing.sm }}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <View style={[styles.bulletDash, color ? { backgroundColor: color } : null]} />
          <Text style={[type.body, styles.bulletText, textColor ? { color: textColor } : null]}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    padding: spacing.lg,
    ...shadow.card,
  },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.4 },
  sectionHeader: { gap: spacing.xs, marginBottom: spacing.md },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  badgeCompact: { paddingHorizontal: 7, paddingVertical: 3 },
  badgeText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.2 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 15,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  buttonText: { fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: 11,
    borderRadius: radius.pill,
    backgroundColor: palette.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
  },
  chipSelected: { backgroundColor: palette.ink, borderColor: palette.ink },
  chipText: { fontSize: 13, fontWeight: '600', color: palette.textMuted },
  chipTextSelected: { color: palette.textOnDark },
  bulletRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  bulletDash: {
    width: 10,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: palette.accentInk,
    marginTop: 11,
    borderRadius: 2,
  },
  bulletText: { flex: 1 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.border,
    marginVertical: spacing.lg,
  },
});

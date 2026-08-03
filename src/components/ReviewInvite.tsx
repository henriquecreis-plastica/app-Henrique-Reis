import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { openLink } from '../lib/contact';
import { clinic, palette, radius, spacing, type } from '../theme';
import { Button, Overline } from './ui';

/**
 * Convite para avaliar a clínica no Google.
 *
 * Momento importa: pedir avaliação nos primeiros dias, quando a paciente está
 * inchada, dolorida e sem ver resultado, é pedir no pior momento possível —
 * para ela e para a clínica. Na tela inicial o convite só aparece a partir do
 * 30º dia (ver `MIN_DAY`), e pode ser dispensado. Na tela de contato fica
 * sempre disponível, para quem quiser avaliar por iniciativa própria.
 */

/** Dia de pós-operatório a partir do qual o convite pode aparecer. */
export const MIN_DAY = 30;

export function ReviewInvite({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.flex}>
          <Overline>Nos ajude a divulgar nosso trabalho</Overline>
        </View>
        {onDismiss ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dispensar convite de avaliação"
            onPress={onDismiss}
            hitSlop={12}
            style={({ pressed }) => pressed && { opacity: 0.5 }}
          >
            <Ionicons name="close" size={18} color={palette.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <Text style={[type.body, styles.text]}>
        Se a sua experiência com a nossa equipe foi boa, uma avaliação no Google ajuda outras
        pacientes a nos encontrar. Leva menos de um minuto.
      </Text>

      <View style={styles.stars}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Ionicons key={i} name="star" size={17} color={palette.tiffany} />
        ))}
      </View>

      <Button
        label="Avaliar no Google"
        icon="logo-google"
        variant="secondary"
        onPress={() => openLink(clinic.googleReview)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.tiffanyWash,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.tiffanyLine,
    padding: spacing.lg,
    gap: spacing.md,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  flex: { flex: 1 },
  text: { lineHeight: 22 },
  stars: { flexDirection: 'row', gap: 4 },
});

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette, radius, spacing, type } from '../theme';
import { Button, Overline } from './ui';

/**
 * Convite para ligar os lembretes de retorno.
 *
 * Aparece uma vez, e tarde: só depois de a recuperação estar concluída (ver
 * `diaMinimo`). Oferecer um retorno futuro a quem ainda está contando os dias
 * do curativo é falar do assunto errado na semana errada — e ensina a paciente
 * que a tela inicial tem recado de clínica, quando é onde ela procura o sinal
 * de alarme.
 *
 * Pode ser dispensado, e não volta.
 */

/** Multiplicador sobre as semanas de recuperação do procedimento. */
export const diaMinimo = (semanasDeRecuperacao: number): number => semanasDeRecuperacao * 7;

export function RetornoInvite({ onDismiss }: { onDismiss: () => void }) {
  const router = useRouter();
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.flex}>
          <Overline>Daqui para a frente</Overline>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dispensar convite de lembretes de retorno"
          onPress={onDismiss}
          hitSlop={12}
          style={({ pressed }) => pressed && { opacity: 0.5 }}
        >
          <Ionicons name="close" size={18} color={palette.textMuted} />
        </Pressable>
      </View>

      <Text style={[type.body, styles.text]}>
        Todo procedimento tem um prazo em que vale reavaliar. Se você quiser, o aplicativo guarda
        essas datas e avisa quando chegarem.
      </Text>

      <Button
        label="Ver os lembretes"
        icon="notifications-outline"
        variant="secondary"
        onPress={() => router.push('/retornos')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surfaceAlt,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  flex: { flex: 1 },
  text: { lineHeight: 22 },
});

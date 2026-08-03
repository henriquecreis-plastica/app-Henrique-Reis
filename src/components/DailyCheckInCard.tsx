import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { procedureById } from '../data/procedures';
import { checkInFor, expectsCheckIn, todayIso } from '../domain/checkin';
import { usePatient } from '../store/patient';
import { palette, radius, spacing, type } from '../theme';
import { Overline } from './ui';

/**
 * Chamada para o registro diário na tela inicial.
 *
 * Só aparece dentro da janela em que o registro é cobrado — depois disso, a
 * paciente já não precisa fotografar todo dia e o cartão sairia de cena
 * sozinho, sem virar cobrança sem propósito.
 */
export function DailyCheckInCard() {
  const router = useRouter();
  const { profile, postOpDay } = usePatient();
  const kind = procedureById(profile.procedure).kind;

  if (!expectsCheckIn(postOpDay, kind)) return null;

  const hoje = checkInFor(profile.checkIns, todayIso());
  const feito = !!hoje;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={feito ? 'Ver ou refazer o registro de hoje' : 'Fazer o registro de hoje'}
      onPress={() => router.push('/check-in')}
      style={({ pressed }) => [styles.card, feito && styles.cardDone, pressed && { opacity: 0.8 }]}
    >
      {hoje?.photoUri ? (
        <Image source={{ uri: hoje.photoUri }} style={styles.thumb} resizeMode="cover" />
      ) : (
        <View style={[styles.thumb, styles.thumbEmpty]}>
          <Ionicons
            name={feito ? 'checkmark' : 'camera-outline'}
            size={22}
            color={feito ? palette.accentInk : palette.textMuted}
          />
        </View>
      )}

      <View style={styles.flex}>
        <Overline>{feito ? 'Registro enviado' : 'Registro de hoje'}</Overline>
        <Text style={[type.body, styles.text]}>
          {feito
            ? 'Obrigado. Toque para revisar ou refazer.'
            : 'Uma foto e duas perguntas rápidas — é assim que acompanhamos a sua evolução.'}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={palette.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    borderWidth: 1.5,
    borderColor: palette.tiffany,
  },
  cardDone: { borderWidth: StyleSheet.hairlineWidth, borderColor: palette.border },
  flex: { flex: 1 },
  text: { marginTop: 2 },
  thumb: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: palette.surfaceAlt },
  thumbEmpty: { alignItems: 'center', justifyContent: 'center' },
});

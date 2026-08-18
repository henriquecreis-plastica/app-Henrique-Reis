import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionHeader } from '../../src/components/ui';
import { VideoList } from '../../src/components/VideoList';
import { careGuides } from '../../src/data/care';
import { appliesToAny, procedureById, procedureKindOf, procedureNames } from '../../src/data/procedures';
import { usePatient } from '../../src/store/patient';
import { palette, radius, spacing, type } from '../../src/theme';

export default function Cuidados() {
  const router = useRouter();
  const { procedureIds } = usePatient();
  const procedure = procedureById(procedureIds[0]);
  const kind = procedureKindOf(procedureIds);
  const combinada = procedureIds.length > 1;

  const guides = careGuides.filter(
    (g) =>
      (!g.kinds || g.kinds.includes(kind)) &&
      appliesToAny(g.procedures, procedureIds),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SectionHeader
          overline="Cuidados"
          title={kind === 'ambulatorial' ? 'Guias do seu tratamento' : 'Guias do seu pós-operatório'}
          description={
            kind === 'ambulatorial'
              ? 'Orientações práticas para os dias que seguem o procedimento.'
              : 'Orientações práticas para o dia a dia da recuperação.'
          }
        />

        <View style={styles.procedureCard}>
          <Ionicons name={combinada ? 'git-merge-outline' : procedure.icon} size={22} color={palette.accent} />
          <View style={styles.flex}>
            <Text style={styles.procedureLabel}>{combinada ? 'Suas cirurgias' : 'Seu procedimento'}</Text>
            <Text style={styles.procedureName}>{procedureNames(procedureIds)}</Text>
          </View>
        </View>

        <VideoList />

        <View style={styles.grid}>
          {guides.map((g) => (
            <Pressable
              key={g.id}
              accessibilityRole="button"
              onPress={() => router.push(`/cuidado/${g.id}`)}
              style={({ pressed }) => [styles.tile, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.tileIcon}>
                <Ionicons name={g.icon} size={20} color={palette.primary} />
              </View>
              <Text style={styles.tileTitle}>{g.title}</Text>
              <Text style={type.small} numberOfLines={2}>
                {g.subtitle}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  procedureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: palette.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  procedureLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: palette.textOnDarkMuted,
  },
  procedureName: { fontSize: 16, fontWeight: '700', color: palette.textOnDark, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: {
    width: '47.6%',
    flexGrow: 1,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    padding: spacing.lg,
    gap: 6,
  },
  tileIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: palette.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  tileTitle: { fontSize: 14.5, fontWeight: '700', color: palette.text },
});

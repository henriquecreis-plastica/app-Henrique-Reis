import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip, SectionHeader, SeverityBadge } from '../../src/components/ui';
import { groupLabels, symptoms, type SymptomGroup } from '../../src/data/symptoms';
import { usePatient } from '../../src/store/patient';
import { palette, radius, severity, spacing, type, type Severity } from '../../src/theme';

const severityOrder: Severity[] = ['urgent', 'attention', 'normal'];

/** Remove acentos para que a busca funcione com ou sem acentuação. */
const normalize = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function Normal() {
  const router = useRouter();
  const { profile } = usePatient();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<SymptomGroup | null>(null);
  const [level, setLevel] = useState<Severity | null>(null);

  /** Só mostra sintomas gerais ou específicos do procedimento da paciente. */
  const relevant = useMemo(
    () => symptoms.filter((s) => !s.procedures || s.procedures.includes(profile.procedure)),
    [profile.procedure],
  );

  const availableGroups = useMemo(() => {
    const set = new Set<SymptomGroup>();
    relevant.forEach((s) => s.groups.forEach((g) => set.add(g)));
    return (Object.keys(groupLabels) as SymptomGroup[]).filter((g) => set.has(g));
  }, [relevant]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return relevant
      .filter((s) => (group ? s.groups.includes(group) : true))
      .filter((s) => (level ? s.severity === level : true))
      .filter((s) => {
        if (!q) return true;
        const haystack = normalize(
          [s.title, s.summary, ...(s.keywords ?? []), ...s.why].join(' '),
        );
        return haystack.includes(q);
      })
      .sort(
        (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity),
      );
  }, [relevant, query, group, level]);

  const counts = useMemo(() => {
    return severityOrder.map((lvl) => ({
      level: lvl,
      count: relevant.filter((s) => s.severity === lvl).length,
    }));
  }, [relevant]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          overline="É normal?"
          title="O que esperar e o que não ignorar"
          description="Encontre o que você está sentindo e veja se faz parte da recuperação ou se é hora de nos procurar."
        />

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={palette.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar: inchaço, febre, dor, cicatriz..."
            placeholderTextColor={palette.textMuted}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 ? (
            <Pressable accessibilityLabel="Limpar busca" onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={palette.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {/* Legenda-filtro do semáforo clínico */}
        <View style={styles.legendRow}>
          {counts.map(({ level: lvl, count }) => {
            const s = severity[lvl];
            const active = level === lvl;
            return (
              <Pressable
                key={lvl}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setLevel(active ? null : lvl)}
                style={({ pressed }) => [
                  styles.legendCard,
                  { backgroundColor: s.bg },
                  active && { borderColor: s.color },
                  pressed && { opacity: 0.75 },
                ]}
              >
                <Ionicons name={s.icon} size={18} color={s.color} />
                <Text style={[styles.legendCount, { color: s.color }]}>{count}</Text>
                <Text style={[styles.legendLabel, { color: s.color }]}>{s.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          <Chip label="Tudo" selected={group === null} onPress={() => setGroup(null)} />
          {availableGroups.map((g) => (
            <Chip
              key={g}
              label={groupLabels[g].label}
              icon={groupLabels[g].icon}
              selected={group === g}
              onPress={() => setGroup(group === g ? null : g)}
            />
          ))}
        </ScrollView>

        {results.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="help-circle-outline" size={34} color={palette.textMuted} />
            <Text style={[type.body, styles.emptyText]}>
              Não encontramos esse sintoma na nossa lista.
            </Text>
            <Text style={[type.small, styles.emptyText]}>
              Na dúvida, fale com a equipe pelo WhatsApp na aba Contato.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {results.map((s) => (
              <Pressable
                key={s.id}
                accessibilityRole="button"
                onPress={() => router.push(`/sintoma/${s.id}`)}
                style={({ pressed }) => [
                  styles.item,
                  { borderLeftColor: severity[s.severity].color },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <View style={styles.itemHead}>
                  <Text style={styles.itemTitle}>{s.title}</Text>
                  <SeverityBadge level={s.severity} compact />
                </View>
                <Text style={type.small} numberOfLines={2}>
                  {s.summary}
                </Text>
                <View style={styles.itemFoot}>
                  <Ionicons name="time-outline" size={13} color={palette.textMuted} />
                  <Text style={styles.itemWhen}>{s.when}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: palette.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 15, color: palette.text },
  legendRow: { flexDirection: 'row', gap: spacing.sm },
  legendCard: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  legendCount: { fontSize: 19, fontWeight: '700' },
  legendLabel: { fontSize: 10.5, fontWeight: '700', letterSpacing: 0.2, textAlign: 'center' },
  chipRow: { gap: spacing.sm, paddingVertical: 2, paddingRight: spacing.lg },
  list: { gap: spacing.sm },
  item: {
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    borderLeftWidth: 3,
    padding: spacing.lg,
    gap: 6,
  },
  itemHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  itemTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: palette.text },
  itemFoot: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  itemWhen: { ...type.small, fontSize: 12 },
  empty: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl },
  emptyText: { textAlign: 'center' },
});

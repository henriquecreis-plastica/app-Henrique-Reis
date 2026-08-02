import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bullets, Card, Overline, SectionHeader } from '../../src/components/ui';
import { procedureById } from '../../src/data/procedures';
import { phaseForDay, phases, procedureMilestones } from '../../src/data/timeline';
import { usePatient } from '../../src/store/patient';
import { palette, radius, spacing, type } from '../../src/theme';

export default function Recuperacao() {
  const { profile, postOpDay } = usePatient();
  const procedure = procedureById(profile.procedure);
  const current = phaseForDay(Math.max(postOpDay, 0));
  const [openId, setOpenId] = useState<string>(current.id);
  const milestones = procedureMilestones[profile.procedure] ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SectionHeader
          overline="Linha do tempo"
          title="Sua recuperação, fase a fase"
          description={`Referências para ${procedure.name.toLowerCase()}. Cada organismo tem seu ritmo — pequenas variações são normais.`}
        />

        {phases.map((phase) => {
          const isCurrent = phase.id === current.id;
          const isPast = postOpDay > phase.to;
          const open = openId === phase.id;

          return (
            <View key={phase.id} style={styles.timelineRow}>
              {/* Trilho vertical da linha do tempo */}
              <View style={styles.rail}>
                <View
                  style={[
                    styles.dot,
                    isPast && styles.dotPast,
                    isCurrent && styles.dotCurrent,
                  ]}
                >
                  {isPast ? <Ionicons name="checkmark" size={11} color="#FFF" /> : null}
                </View>
                <View style={[styles.railLine, (isPast || isCurrent) && styles.railLineActive]} />
              </View>

              <View style={styles.phaseCol}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: open }}
                  onPress={() => setOpenId(open ? '' : phase.id)}
                  style={({ pressed }) => [
                    styles.phaseCard,
                    isCurrent && styles.phaseCardCurrent,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={styles.phaseHead}>
                    <Ionicons
                      name={phase.icon}
                      size={18}
                      color={isCurrent ? palette.accent : palette.textMuted}
                    />
                    <View style={styles.flex}>
                      <Text style={[styles.phaseLabel, isCurrent && styles.phaseLabelCurrent]}>
                        {phase.label}
                      </Text>
                      {isCurrent ? <Text style={styles.phaseNow}>Você está aqui</Text> : null}
                    </View>
                    <Ionicons
                      name={open ? 'chevron-up' : 'chevron-down'}
                      size={17}
                      color={isCurrent ? palette.textOnDarkMuted : palette.textMuted}
                    />
                  </View>

                  {open ? (
                    <View style={styles.phaseBody}>
                      <Text style={[type.body, isCurrent && { color: palette.textOnDarkMuted }]}>
                        {phase.summary}
                      </Text>

                      <PhaseBlock
                        title="O que é esperado"
                        items={phase.expect}
                        color={palette.normal}
                        onDark={isCurrent}
                      />
                      <PhaseBlock
                        title="O que fazer"
                        items={phase.todo}
                        color={palette.accent}
                        onDark={isCurrent}
                      />
                      <PhaseBlock
                        title="O que evitar"
                        items={phase.avoid}
                        color={palette.attention}
                        onDark={isCurrent}
                      />
                    </View>
                  ) : null}
                </Pressable>
              </View>
            </View>
          );
        })}

        {milestones.length ? (
          <Card style={styles.milestones}>
            <Overline>Marcos de {procedure.name.toLowerCase()}</Overline>
            <View style={{ height: spacing.md }} />
            {milestones.map((m) => {
              const reached = postOpDay >= m.day;
              return (
                <View key={m.day} style={styles.milestoneRow}>
                  <View style={[styles.milestoneDay, reached && styles.milestoneDayReached]}>
                    <Text style={[styles.milestoneDayText, reached && { color: palette.textOnDark }]}>
                      D{m.day}
                    </Text>
                  </View>
                  <Text style={[type.body, styles.flex, reached && { color: palette.textMuted }]}>
                    {m.text}
                  </Text>
                </View>
              );
            })}
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function PhaseBlock({
  title,
  items,
  color,
  onDark,
}: {
  title: string;
  items: string[];
  color: string;
  onDark: boolean;
}) {
  return (
    <View style={styles.block}>
      <Text style={[styles.blockTitle, { color: onDark ? palette.textOnDark : palette.text }]}>
        {title}
      </Text>
      <Bullets
        items={items}
        color={color}
        textColor={onDark ? palette.textOnDarkMuted : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  timelineRow: { flexDirection: 'row', gap: spacing.md },
  rail: { width: 22, alignItems: 'center' },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: palette.border,
    backgroundColor: palette.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  dotPast: { backgroundColor: palette.normal, borderColor: palette.normal },
  dotCurrent: { backgroundColor: palette.accent, borderColor: palette.accent },
  railLine: { flex: 1, width: 2, backgroundColor: palette.border, marginVertical: 4 },
  railLineActive: { backgroundColor: palette.accentSoft },
  phaseCol: { flex: 1, paddingBottom: spacing.md },
  phaseCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    padding: spacing.lg,
  },
  phaseCardCurrent: { backgroundColor: palette.primary, borderColor: palette.primary },
  phaseHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  phaseLabel: { fontSize: 15, fontWeight: '700', color: palette.text },
  phaseLabelCurrent: { color: palette.textOnDark },
  phaseNow: { fontSize: 11, fontWeight: '700', color: palette.accent, letterSpacing: 1, marginTop: 2 },
  phaseBody: { gap: spacing.lg, marginTop: spacing.lg },
  block: { gap: spacing.sm },
  blockTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },
  milestones: { marginTop: spacing.lg },
  milestoneRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  milestoneDay: {
    minWidth: 42,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: palette.surfaceAlt,
    alignItems: 'center',
  },
  milestoneDayReached: { backgroundColor: palette.normal },
  milestoneDayText: { fontSize: 12, fontWeight: '700', color: palette.textMuted },
});

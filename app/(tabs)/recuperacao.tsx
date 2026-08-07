import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bullets, Card, Overline, SectionHeader } from '../../src/components/ui';
import { procedureById } from '../../src/data/procedures';
import { phaseForDay, phasesFor, procedureMilestones } from '../../src/data/timeline';
import { usePatient } from '../../src/store/patient';
import { palette, radius, spacing, type } from '../../src/theme';

export default function Recuperacao() {
  const { profile, postOpDay } = usePatient();
  const procedure = procedureById(profile.procedure);
  const current = phaseForDay(Math.max(postOpDay, 0), procedure.kind);
  const phases = phasesFor(procedure.kind);
  const [openId, setOpenId] = useState<string>(current.id);
  const milestones = procedureMilestones[profile.procedure] ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SectionHeader
          overline="Linha do tempo"
          title={
            procedure.kind === 'ambulatorial'
              ? 'Seu tratamento, fase a fase'
              : 'Sua recuperação, fase a fase'
          }
          description={`Referências para ${procedure.name.toLowerCase()}. Cada pessoa tem seu ritmo — pequenas variações são normais.`}
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
                      color={isCurrent ? palette.accentInk : palette.textMuted}
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
                      color={palette.textMuted}
                    />
                  </View>

                  {open ? (
                    <View style={styles.phaseBody}>
                      <Text style={type.bodyMuted}>{phase.summary}</Text>

                      {/* Os três marcadores usam as cores da identidade:
                          Tiffany para o que é esperado, preto para o que
                          fazer, âmbar para o que evitar. */}
                      <PhaseBlock title="O que é esperado" items={phase.expect} color={palette.accentInk} />
                      <PhaseBlock title="O que fazer" items={phase.todo} color={palette.ink} />
                      <PhaseBlock title="O que evitar" items={phase.avoid} color={palette.attention} />
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
            {/* Os marcos são a parte do app que mais cria expectativa de data.
                A ressalva fica aqui, junto dos números, e não só no topo. */}
            <Text style={styles.milestoneNote}>
              Os dias são referências, não prazos. Estar um pouco à frente ou atrás disso é
              comum — quem avalia a sua evolução é a equipe, no retorno.
            </Text>
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function PhaseBlock({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      <Bullets items={items} color={color} />
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
  dotPast: { backgroundColor: palette.accentInk, borderColor: palette.accentInk },
  dotCurrent: { backgroundColor: palette.tiffany, borderColor: palette.tiffany },
  railLine: { flex: 1, width: 2, backgroundColor: palette.border, marginVertical: 4 },
  railLineActive: { backgroundColor: palette.tiffanyLine },
  phaseCol: { flex: 1, paddingBottom: spacing.md },
  phaseCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    padding: spacing.lg,
  },
  phaseCardCurrent: { borderColor: palette.tiffany, borderWidth: 1.5 },
  phaseHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  phaseLabel: { fontSize: 15, fontWeight: '700', color: palette.text },
  phaseLabelCurrent: { color: palette.text },
  phaseNow: {
    fontSize: 10.5,
    fontWeight: '700',
    color: palette.textOnTiffany,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    backgroundColor: palette.tiffany,
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.sm,
    overflow: 'hidden',
    marginTop: 4,
  },
  phaseBody: { gap: spacing.lg, marginTop: spacing.lg },
  block: { gap: spacing.sm },
  blockTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3, color: palette.text },
  milestones: { marginTop: spacing.lg },
  milestoneRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  milestoneDay: {
    minWidth: 42,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: palette.surfaceAlt,
    alignItems: 'center',
  },
  milestoneDayReached: { backgroundColor: palette.accentInk },
  milestoneNote: {
    fontSize: 12.5,
    lineHeight: 18,
    color: palette.textMuted,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
  },
  milestoneDayText: { fontSize: 12, fontWeight: '700', color: palette.textMuted },
});

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '../../src/components/Logo';
import { MIN_DAY, ReviewInvite } from '../../src/components/ReviewInvite';
import { Bullets, Card, Overline } from '../../src/components/ui';
import { procedureById } from '../../src/data/procedures';
import { phaseForDay, procedureMilestones } from '../../src/data/timeline';
import { usePatient } from '../../src/store/patient';
import { palette, radius, spacing, type } from '../../src/theme';

export default function Today() {
  const router = useRouter();
  const { profile, postOpDay, toggleTask, isTaskDone, save } = usePatient();
  const procedure = procedureById(profile.procedure);
  const isPreOp = postOpDay < 0;
  const isOffice = procedure.kind === 'ambulatorial';
  /* A fase vem do percurso certo: antes do procedimento as orientações são de
     preparo, e um tratamento de consultório não segue a escala da cirurgia. */
  const phase = phaseForDay(postOpDay, procedure.kind);

  const progress = useMemo(() => {
    const totalDays = procedure.recoveryWeeks * 7;
    return Math.min(Math.max(postOpDay / totalDays, 0), 1);
  }, [postOpDay, procedure.recoveryWeeks]);

  const nextMilestone = useMemo(() => {
    const list = procedureMilestones[profile.procedure] ?? [];
    return list.find((m) => m.day > postOpDay);
  }, [profile.procedure, postOpDay]);

  const greeting = profile.name ? `Olá, ${profile.name}` : 'Olá';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Logo variant="signature" width={132} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ajustar meus dados"
            onPress={() => router.push('/(tabs)/contato')}
            hitSlop={10}
          >
            <Ionicons name="person-circle-outline" size={26} color={palette.textMuted} />
          </Pressable>
        </View>

        {/* ----- Cartão principal: onde a paciente está na recuperação ----- */}
        <View style={styles.hero}>
          <Overline style={{ color: palette.textOnTiffanyMuted }}>{greeting}</Overline>
          {isPreOp ? (
            <>
              <Text style={styles.heroDay}>
                Faltam {Math.abs(postOpDay)} {Math.abs(postOpDay) === 1 ? 'dia' : 'dias'}
              </Text>
              <Text style={styles.heroPhase}>
                {isOffice ? 'para o seu ' : 'para a sua '}
                {procedure.name.toLowerCase()}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.heroDay}>
                {postOpDay === 0
                  ? isOffice
                    ? 'Foi hoje'
                    : 'Dia da cirurgia'
                  : `${postOpDay}º dia`}
              </Text>
              <Text style={styles.heroPhase}>
                {postOpDay === 0
                  ? procedure.name
                  : `${isOffice ? 'depois do procedimento' : 'de pós-operatório'} · ${phase.label}`}
              </Text>
            </>
          )}

          {isPreOp ? null : (
            <View
              style={styles.progressTrack}
              accessibilityRole="progressbar"
              accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
            >
              <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
            </View>
          )}
          <Text style={styles.heroFoot}>
            {isPreOp
              ? `Marcado para ${formatDate(profile.surgeryDate)}`
              : isOffice
                ? `${procedure.name} · resultado final em torno de ${procedure.recoveryWeeks} semanas`
                : `${procedure.name} · recuperação estimada em ${procedure.recoveryWeeks} semanas`}
          </Text>
        </View>

        {/* ----- Acesso rápido ao que é urgente ----- */}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/emergencia')}
          style={({ pressed }) => [styles.alertBar, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="warning" size={20} color={palette.urgent} />
          <View style={styles.flex}>
            <Text style={styles.alertTitle}>Algo não parece certo?</Text>
            <Text style={type.small}>Veja os sinais de alerta e fale com a equipe</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={palette.textMuted} />
        </Pressable>

        {/* ----- O que esperar ----- */}
        <Card>
          <Overline>{isPreOp ? 'O que esperar' : 'O que é esperado agora'}</Overline>
          <Text style={[type.heading, styles.cardTitle]}>{phase.label}</Text>
          <Text style={[type.bodyMuted, styles.cardIntro]}>{phase.summary}</Text>
          <Bullets items={phase.expect.slice(0, 4)} color={palette.normal} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver linha do tempo completa"
            onPress={() => router.push('/(tabs)/recuperacao')}
            style={styles.cardLink}
            hitSlop={8}
          >
            <Text style={styles.cardLinkText}>Ver linha do tempo completa</Text>
            <Ionicons name="arrow-forward" size={15} color={palette.accentInk} />
          </Pressable>
        </Card>

        {/* ----- Checklist do dia ----- */}
        <Card>
          <Overline>{isPreOp ? 'Sua preparação' : 'Sua rotina de hoje'}</Overline>
          <Text style={[type.heading, styles.cardTitle]}>
            {phase.todo.filter((_, i) => isTaskDone(`${phase.id}-${postOpDay}-${i}`)).length} de{' '}
            {phase.todo.length} concluídos
          </Text>
          <View style={styles.checklist}>
            {phase.todo.map((task, i) => {
              const key = `${phase.id}-${postOpDay}-${i}`;
              const done = isTaskDone(key);
              return (
                <Pressable
                  key={key}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: done }}
                  onPress={() => toggleTask(key)}
                  style={({ pressed }) => [styles.taskRow, pressed && { opacity: 0.6 }]}
                >
                  <Ionicons
                    name={done ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={done ? palette.normal : palette.border}
                  />
                  <Text style={[type.body, styles.flex, done && styles.taskDone]}>{task}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* ----- Evitar ----- */}
        <Card style={styles.avoidCard}>
          <Overline style={{ color: palette.attention }}>Evite nesta fase</Overline>
          <View style={styles.cardTitleSpacer} />
          <Bullets items={phase.avoid} color={palette.attention} />
        </Card>

        {/* ----- Específico do procedimento ----- */}
        <Card>
          <Overline>Atenção especial · {procedure.name}</Overline>
          <View style={styles.cardTitleSpacer} />
          <Bullets items={procedure.highlights} />
        </Card>

        {nextMilestone ? (
          <Card style={styles.milestone}>
            <Ionicons name="flag-outline" size={20} color={palette.accentInk} />
            <View style={styles.flex}>
              <Text style={styles.milestoneDay}>
                Em {nextMilestone.day - postOpDay}{' '}
                {nextMilestone.day - postOpDay === 1 ? 'dia' : 'dias'}
              </Text>
              <Text style={type.body}>{nextMilestone.text}</Text>
            </View>
          </Card>
        ) : null}

        {postOpDay >= MIN_DAY && !profile.reviewDismissed ? (
          <ReviewInvite onDismiss={() => save({ reviewDismissed: true })} />
        ) : null}

        <Text style={styles.footnote}>
          As informações deste aplicativo são orientações gerais e não substituem a avaliação
          médica individual.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  /* O único bloco em verde Tiffany cheio: é o que a paciente abre primeiro. */
  hero: {
    backgroundColor: palette.tiffany,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.xs,
  },
  heroDay: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '600',
    color: palette.textOnTiffany,
    marginTop: spacing.sm,
    letterSpacing: -0.6,
  },
  heroPhase: { fontSize: 15, color: palette.textOnTiffanyMuted },
  progressTrack: {
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(5,51,49,0.16)',
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: palette.primary, borderRadius: 4 },
  heroFoot: { fontSize: 12, color: palette.textOnTiffanyMuted, marginTop: spacing.sm },
  alertBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: palette.urgentBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(179,38,30,0.2)',
  },
  alertTitle: { fontSize: 15, fontWeight: '700', color: palette.urgent },
  cardTitle: { marginTop: spacing.sm },
  cardTitleSpacer: { height: spacing.md },
  cardIntro: { marginTop: spacing.xs, marginBottom: spacing.lg },
  cardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.lg,
  },
  cardLinkText: { fontSize: 14, fontWeight: '700', color: palette.primary },
  checklist: { gap: spacing.md, marginTop: spacing.lg },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  taskDone: { color: palette.textMuted, textDecorationLine: 'line-through' },
  avoidCard: { backgroundColor: palette.attentionBg, borderColor: 'rgba(183,120,22,0.18)' },
  milestone: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  milestoneDay: { ...type.small, fontWeight: '700', color: palette.accentInk, marginBottom: 2 },
  footnote: {
    ...type.small,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
});

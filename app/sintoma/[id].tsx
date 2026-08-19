import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bullets, Button, Card, Overline, SeverityBadge } from '../../src/components/ui';
import { VideoList } from '../../src/components/VideoList';
import { procedureNames } from '../../src/data/procedures';
import { symptomById } from '../../src/data/symptoms';
import { buildContextMessage, callPhone, openWhatsApp } from '../../src/lib/contact';
import { usePatient } from '../../src/store/patient';
import { voltar } from '../../src/lib/navegar';
import { clinic, palette, radius, severity, spacing, type } from '../../src/theme';

export default function SymptomDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile, procedureIds, postOpDay } = usePatient();
  const symptom = symptomById(String(id));

  if (!symptom) {
    return (
      <View style={styles.missing}>
        <Text style={type.body}>Orientação não encontrada.</Text>
        <Button label="Voltar" variant="secondary" onPress={() => voltar(router, '/(tabs)/normal')} />
      </View>
    );
  }

  const s = severity[symptom.severity];
  const isUrgent = symptom.severity === 'urgent';
  const contextMessage = buildContextMessage({
    name: profile.name,
    procedure: procedureNames(procedureIds),
    day: Math.max(postOpDay, 0),
    subject: symptom.title,
  });

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
        <View style={[styles.header, { backgroundColor: s.bg }]}>
          <SeverityBadge level={symptom.severity} />
          <Text style={[type.title, styles.title]}>{symptom.title}</Text>
          <View style={styles.whenRow}>
            <Ionicons name="time-outline" size={14} color={s.color} />
            <Text style={[styles.when, { color: s.color }]}>{symptom.when}</Text>
          </View>
        </View>

        <Card style={[styles.summaryCard, { borderLeftColor: s.color }]}>
          <Text style={[type.body, styles.summary]}>{symptom.summary}</Text>
        </Card>

        <Card>
          <Overline>Por que acontece</Overline>
          <View style={styles.spacer} />
          <Bullets items={symptom.why} />
        </Card>

        {/* O vídeo entra depois do "por que acontece" e antes do "o que
            fazer": a paciente já entendeu o que é e ainda não agiu. Em
            orientação de urgência ele não aparece — ali o que vale é ligar. */}
        {isUrgent ? null : <VideoList symptom={symptom.id} />}

        <Card style={isUrgent ? styles.actionUrgent : undefined}>
          <Overline style={isUrgent ? { color: palette.urgent } : undefined}>
            {isUrgent ? 'O que fazer agora' : 'O que fazer'}
          </Overline>
          <View style={styles.spacer} />
          <Bullets items={symptom.action} color={s.color} />
        </Card>

        {isUrgent ? (
          <View style={styles.ctaGroup}>
            <Button
              label="Ligar para a clínica"
              icon="call"
              variant="danger"
              onPress={() => callPhone(clinic.emergency)}
            />
            <Button
              label="Falar no WhatsApp"
              icon="logo-whatsapp"
              variant="secondary"
              onPress={() => openWhatsApp(contextMessage)}
            />
          </View>
        ) : (
          <Button
            label="Tirar dúvida com a equipe"
            icon="logo-whatsapp"
            variant="secondary"
            onPress={() => openWhatsApp(contextMessage)}
          />
        )}

        <Text style={styles.footnote}>
          Esta orientação é geral. Se algo fugir do que está descrito aqui, ou se você estiver em
          dúvida, entre em contato com a equipe.
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, padding: spacing.xl },
  header: { borderRadius: radius.lg, padding: spacing.xl, gap: spacing.sm },
  title: { marginTop: spacing.xs },
  whenRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  when: { fontSize: 12.5, fontWeight: '600' },
  summaryCard: { borderLeftWidth: 3 },
  summary: { fontSize: 16, lineHeight: 25 },
  spacer: { height: spacing.md },
  actionUrgent: { backgroundColor: palette.urgentBg, borderColor: 'rgba(179,38,30,0.2)' },
  ctaGroup: { gap: spacing.sm },
  footnote: { ...type.small, textAlign: 'center', paddingHorizontal: spacing.md },
});

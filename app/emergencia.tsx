import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Overline } from '../src/components/ui';
import { procedureById } from '../src/data/procedures';
import { symptoms } from '../src/data/symptoms';
import { buildContextMessage, callPhone, openWhatsApp } from '../src/lib/contact';
import { usePatient } from '../src/store/patient';
import { clinic, palette, radius, spacing, type } from '../src/theme';

export default function Emergencia() {
  const router = useRouter();
  const { profile, postOpDay } = usePatient();

  const urgentList = useMemo(
    () =>
      symptoms.filter(
        (s) =>
          s.severity === 'urgent' &&
          (!s.procedures || s.procedures.includes(profile.procedure)),
      ),
    [profile.procedure],
  );

  const message = buildContextMessage({
    name: profile.name,
    procedure: procedureById(profile.procedure).name,
    day: Math.max(postOpDay, 0),
  });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <View style={styles.hero}>
        <Ionicons name="warning" size={26} color={palette.urgent} />
        <Text style={[type.title, styles.heroTitle]}>Sinais que exigem contato imediato</Text>
        <Text style={type.bodyMuted}>
          Se você tem qualquer um dos sinais abaixo, não espere o próximo retorno. Fale com a
          equipe ou procure um pronto-socorro.
        </Text>
      </View>

      <View style={styles.ctas}>
        <Button
          label="Ligar para a emergência"
          icon="call"
          variant="danger"
          onPress={() => callPhone(clinic.emergency)}
        />
        <Button
          label="Falar no WhatsApp"
          icon="logo-whatsapp"
          variant="secondary"
          onPress={() => openWhatsApp(message)}
        />
      </View>

      <Card>
        <Overline style={{ color: palette.urgent }}>Procure atendimento se houver</Overline>
        <View style={styles.list}>
          {urgentList.map((s) => (
            <Pressable
              key={s.id}
              accessibilityRole="button"
              onPress={() => router.push(`/sintoma/${s.id}`)}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
            >
              <Ionicons name="alert-circle" size={18} color={palette.urgent} />
              <Text style={[type.body, styles.flex]}>{s.title}</Text>
              <Ionicons name="chevron-forward" size={16} color={palette.textMuted} />
            </Pressable>
          ))}
        </View>
      </Card>

      <Card style={styles.info}>
        <Text style={[type.small, styles.infoText]}>
          Ao procurar um pronto-socorro, informe qual cirurgia você realizou, a data e as
          medicações em uso. Leve o contato da nossa equipe com você.
        </Text>
      </Card>

      <Button label="Voltar" variant="ghost" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  flex: { flex: 1 },
  hero: {
    backgroundColor: palette.urgentBg,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  heroTitle: { marginTop: spacing.xs },
  ctas: { gap: spacing.sm },
  list: { marginTop: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
  },
  info: { backgroundColor: palette.surfaceAlt },
  infoText: { lineHeight: 20 },
});

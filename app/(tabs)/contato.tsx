import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogoMark, Wordmark } from '../../src/components/Logo';
import { Button, Card, Divider, Overline } from '../../src/components/ui';
import { procedureById } from '../../src/data/procedures';
import { buildContextMessage, callPhone, openLink, openWhatsApp } from '../../src/lib/contact';
import { usePatient } from '../../src/store/patient';
import { clinic, palette, radius, spacing, type } from '../../src/theme';

export default function Contato() {
  const router = useRouter();
  const { profile, postOpDay, reset } = usePatient();
  const [showData, setShowData] = useState(false);
  const procedure = procedureById(profile.procedure);

  const message = buildContextMessage({
    name: profile.name,
    procedure: procedure.name,
    day: Math.max(postOpDay, 0),
  });

  const confirmReset = () => {
    Alert.alert(
      'Alterar meus dados',
      'Você voltará para as perguntas iniciais e poderá informar novamente o procedimento e a data da cirurgia.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Alterar',
          style: 'destructive',
          onPress: async () => {
            await reset();
            router.replace('/onboarding');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.brand}>
          <LogoMark size={56} color={palette.accent} />
          <Wordmark />
          <Text style={styles.crm}>{clinic.crm}</Text>
        </View>

        <View style={styles.ctas}>
          <Button label="WhatsApp da clínica" icon="logo-whatsapp" onPress={() => openWhatsApp(message)} />
          <Button
            label="Ligar para a clínica"
            icon="call-outline"
            variant="secondary"
            onPress={() => callPhone()}
          />
          <Button
            label="Sinais de alerta"
            icon="warning-outline"
            variant="secondary"
            onPress={() => router.push('/emergencia')}
          />
        </View>

        <Card>
          <Overline>Atendimento</Overline>
          <View style={styles.spacer} />
          <InfoRow icon="location-outline" label="Endereço" value={clinic.address} />
          <InfoRow
            icon="logo-instagram"
            label="Instagram"
            value={clinic.instagramHandle}
            onPress={() => openLink(clinic.instagram)}
          />
          <InfoRow
            icon="globe-outline"
            label="Site"
            value="plasticahenrique.com"
            onPress={() => openLink(clinic.site)}
          />
        </Card>

        <Card>
          <Overline>Sobre o cirurgião</Overline>
          <View style={styles.spacer} />
          <Text style={type.body}>{clinic.fullName}</Text>
          <View style={{ height: spacing.md }} />
          {clinic.titles.map((t) => (
            <View key={t} style={styles.titleRow}>
              <Ionicons name="ribbon-outline" size={15} color={palette.accent} />
              <Text style={[type.small, styles.flex]}>{t}</Text>
            </View>
          ))}
        </Card>

        <Card>
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowData(!showData)}
            style={styles.dataHeader}
          >
            <View style={styles.flex}>
              <Overline>Meus dados</Overline>
              <Text style={[type.body, { marginTop: spacing.xs }]}>
                {procedure.name} · {postOpDay < 0 ? 'pré-operatório' : `${postOpDay}º dia`}
              </Text>
            </View>
            <Ionicons
              name={showData ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={palette.textMuted}
            />
          </Pressable>

          {showData ? (
            <>
              <Divider />
              <InfoRow icon="person-outline" label="Nome" value={profile.name || 'Não informado'} />
              <InfoRow
                icon="calendar-outline"
                label="Data da cirurgia"
                value={formatDate(profile.surgeryDate)}
              />
              <View style={{ height: spacing.md }} />
              <Button label="Alterar meus dados" variant="secondary" onPress={confirmReset} />
            </>
          ) : null}
        </Card>

        <Text style={styles.disclaimer}>
          Este aplicativo oferece orientações gerais de pós-operatório e não substitui a consulta
          médica. Em caso de emergência, procure o pronto-socorro mais próximo.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const body = (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={17} color={palette.textMuted} />
      <View style={styles.flex}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[type.body, onPress && styles.link]}>{value}</Text>
      </View>
      {onPress ? <Ionicons name="open-outline" size={15} color={palette.textMuted} /> : null}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable accessibilityRole="link" onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.6 }}>
      {body}
    </Pressable>
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
  brand: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  crm: { ...type.small, letterSpacing: 0.4 },
  ctas: { gap: spacing.sm },
  spacer: { height: spacing.md },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: palette.textMuted,
    marginBottom: 2,
  },
  link: { color: palette.primary, fontWeight: '600' },
  titleRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', paddingVertical: 5 },
  dataHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  disclaimer: {
    ...type.small,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: 19,
  },
});

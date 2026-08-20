import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '../../src/components/Logo';
import { ReviewInvite } from '../../src/components/ReviewInvite';
import { VideoRow } from '../../src/components/VideoList';
import { videosSobre } from '../../src/data/videos';
import { Button, Card, Divider, Overline } from '../../src/components/ui';
import { eventNoun, procedureKindOf, procedureNames } from '../../src/data/procedures';
import { buildContextMessage, callPhone, openLink, openWhatsApp } from '../../src/lib/contact';
import { usePatient } from '../../src/store/patient';
import { clinic, palette, radius, spacing, type } from '../../src/theme';

export default function Contato() {
  const router = useRouter();
  const { profile, procedureIds, postOpDay, reset } = usePatient();
  const [showData, setShowData] = useState(false);
  const kind = procedureKindOf(procedureIds);
  const nomes = procedureNames(procedureIds);

  const message = buildContextMessage({
    name: profile.name,
    procedure: nomes,
    day: Math.max(postOpDay, 0),
  });

  const confirmReset = () => {
    Alert.alert(
      'Apagar meus dados',
      'Isso remove do aparelho seu nome, o procedimento, a data e o progresso das rotinas. Não dá para desfazer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
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
          <Logo variant="full" width={236} />
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
          <InfoRow
            icon="call-outline"
            label="Telefone e WhatsApp"
            value={clinic.phoneLabel}
            onPress={() => callPhone()}
          />
          <InfoRow
            icon="location-outline"
            label="Endereço"
            value={clinic.address}
            hint={clinic.addressComplement}
            onPress={() => openLink(mapsUrl(clinic.addressQuery))}
          />
          <InfoRow
            icon="logo-instagram"
            label="Instagram"
            value={clinic.instagramHandle}
            onPress={() => openLink(clinic.instagram)}
          />
          <InfoRow
            icon="logo-youtube"
            label="Vídeos no YouTube"
            value={clinic.youtubeHandle}
            hint="Dr. Henrique Reis explicando os principais temas"
            onPress={() => openLink(clinic.youtube)}
          />
          <InfoRow
            icon="globe-outline"
            label="Site"
            value="plasticahenrique.com"
            onPress={() => openLink(clinic.site)}
          />
        </Card>

        <Card>
          <Overline>Sobre o cirurgião e a equipe</Overline>
          <View style={styles.spacer} />
          <Text style={type.body}>{clinic.fullName}</Text>
          <View style={{ height: spacing.md }} />
          {clinic.titles.map((t) => (
            <View key={t} style={styles.titleRow}>
              <Ionicons name="ribbon-outline" size={15} color={palette.accentInk} />
              <Text style={[type.small, styles.flex]}>{t}</Text>
            </View>
          ))}
          {/* O vídeo institucional entra aqui dentro, e não num cartão só
              dele: é a mesma coisa que os títulos acima estão contando. */}
          {videosSobre().map((v) => (
            <VideoRow key={v.id} video={v} dividido />
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
                {nomes} ·{' '}
                {postOpDay < 0
                  ? `ainda não ${kind === 'ambulatorial' ? 'realizado' : 'realizada'}`
                  : `${postOpDay}º dia`}
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
                label={`Data d${eventNoun(kind) === 'cirurgia' ? 'a cirurgia' : 'o procedimento'}`}
                value={formatDate(profile.surgeryDate)}
              />
              <View style={{ height: spacing.md }} />
              <Button
                label="Editar meus dados"
                icon="create-outline"
                variant="secondary"
                onPress={() => router.push('/meus-dados')}
              />
              <View style={{ height: spacing.sm }} />
              <Text style={styles.privacy}>
                Seus dados ficam salvos apenas neste aparelho. Nada é enviado para a clínica pelo
                aplicativo.
              </Text>
              <View style={{ height: spacing.md }} />
              <Button label="Apagar meus dados" variant="ghost" onPress={confirmReset} />
            </>
          ) : null}
        </Card>

        <ReviewInvite />

        <View style={styles.legalRow}>
          <Button
            label="Termos de uso"
            variant="ghost"
            onPress={() => router.push('/documento/termos')}
          />
          <Button
            label="Política de privacidade"
            variant="ghost"
            onPress={() => router.push('/documento/privacidade')}
          />
        </View>

        <Text style={styles.disclaimer}>
          Este aplicativo oferece orientações gerais de acompanhamento e não substitui a consulta
          médica. Em caso de emergência, procure o pronto-socorro mais próximo.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Abre o endereço no app de mapas padrão do aparelho. */
function mapsUrl(query: string) {
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
}

function InfoRow({
  icon,
  label,
  value,
  hint,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  hint?: string;
  onPress?: () => void;
}) {
  const body = (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={17} color={palette.textMuted} />
      <View style={styles.flex}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[type.body, onPress && styles.link]}>{value}</Text>
        {hint ? <Text style={type.small}>{hint}</Text> : null}
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
  privacy: { ...type.small, lineHeight: 18 },
  legalRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
  disclaimer: {
    ...type.small,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: 19,
  },
});

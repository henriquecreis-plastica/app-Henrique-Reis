import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bullets, Button, Card, Overline } from '../../src/components/ui';
import { careById } from '../../src/data/care';
import { procedureById } from '../../src/data/procedures';
import { buildContextMessage, openWhatsApp } from '../../src/lib/contact';
import { usePatient } from '../../src/store/patient';
import { palette, radius, spacing, type } from '../../src/theme';

/**
 * As marcas dos protocolos da clínica. Entram como foram entregues — cada uma
 * com a sua cor — e por isso ficam sobre branco, que é onde ambas se leem.
 */
const brandArt = {
  'face-hd': require('../../assets/face-hd.png'),
  'hr-recovery': require('../../assets/hr-recovery.png'),
} as const;

export default function CareDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile, postOpDay } = usePatient();
  const guide = careById(String(id));

  if (!guide) {
    return (
      <View style={styles.missing}>
        <Text style={type.body}>Guia não encontrado.</Text>
        <Button label="Voltar" variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
        {guide.brand ? (
          <View style={styles.brandHeader}>
            <Image
              source={brandArt[guide.brand]}
              style={styles.brandArt}
              resizeMode="contain"
              accessibilityLabel={guide.title}
            />
            <Text style={styles.brandSub}>{guide.subtitle}</Text>
          </View>
        ) : (
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name={guide.icon} size={24} color={palette.accent} />
            </View>
            <Text style={[type.title, styles.headerTitle]}>{guide.title}</Text>
            <Text style={styles.headerSub}>{guide.subtitle}</Text>
          </View>
        )}

        {guide.sections.map((section) => (
          <Card key={section.heading}>
            <Overline>{section.heading}</Overline>
            <View style={styles.spacer} />
            <Bullets items={section.items} />
          </Card>
        ))}

        <Button
          label="Tirar dúvida com a equipe"
          icon="logo-whatsapp"
          variant="secondary"
          onPress={() =>
            openWhatsApp(
              buildContextMessage({
                name: profile.name,
                procedure: procedureById(profile.procedure).name,
                day: Math.max(postOpDay, 0),
                subject: guide.title,
              }),
            )
          }
        />

        <Text style={styles.footnote}>
          Orientações gerais. Sempre siga as instruções específicas entregues na sua alta.
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, padding: spacing.xl },
  header: { backgroundColor: palette.primary, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.sm },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  brandHeader: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  brandArt: { width: 208, height: 68 },
  brandSub: { ...type.bodyMuted, textAlign: 'center' },
  headerTitle: { color: palette.textOnDark },
  headerSub: { fontSize: 14, color: palette.textOnDarkMuted },
  spacer: { height: spacing.md },
  footnote: { ...type.small, textAlign: 'center', paddingHorizontal: spacing.md },
});

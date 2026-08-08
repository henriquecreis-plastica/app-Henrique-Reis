import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bullets, Button, Card, Overline } from '../../src/components/ui';
import { legalById } from '../../src/data/legal';
import { palette, radius, spacing, type } from '../../src/theme';

/** Termos de uso e política de privacidade, exigidos pelas duas lojas. */
export default function Documento() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const doc = legalById(String(id));

  if (!doc) {
    return (
      <View style={styles.missing}>
        <Text style={type.body}>Documento não encontrado.</Text>
        <Button label="Voltar" variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: doc.title }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
        <View>
          <Text style={[type.title, styles.title]}>{doc.title}</Text>
          <Text style={type.small}>Última revisão em {doc.updatedAt}</Text>
        </View>

        <Card style={styles.introCard}>
          <Text style={[type.body, styles.intro]}>{doc.intro}</Text>
        </Card>

        {doc.sections.map((s) => (
          <Card key={s.heading}>
            <Overline>{s.heading}</Overline>
            <View style={styles.spacer} />
            {s.paragraphs.map((p) => (
              <Text key={p} style={[type.body, styles.paragraph]}>
                {p}
              </Text>
            ))}
            {s.items ? <Bullets items={s.items} /> : null}
          </Card>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, padding: spacing.xl },
  title: { marginBottom: 4 },
  introCard: { backgroundColor: palette.accentSoft, borderRadius: radius.lg },
  intro: { color: palette.textOnTiffany, fontWeight: '600' },
  paragraph: { marginBottom: spacing.md },
  spacer: { height: spacing.md },
});

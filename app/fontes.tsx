import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Overline } from '../src/components/ui';
import {
  FONTES_ATUALIZADAS_EM,
  autoria,
  grupos,
  ressalva,
  type Fonte,
} from '../src/data/fontes';
import { openLink } from '../src/lib/contact';
import { palette, radius, spacing, type } from '../src/theme';

/**
 * De onde vem o conteúdo clínico do aplicativo.
 *
 * Existe porque a Apple exige, na diretriz 1.4.1, que app com informação de
 * saúde cite as fontes com link e que a citação seja fácil de achar. Por isso
 * o acesso não está escondido aqui dentro: cada aba de conteúdo termina com
 * um link para esta tela.
 */
export default function Fontes() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <View>
        <Text style={[type.title, styles.title]}>Fontes e referências</Text>
        <Text style={type.small}>Conteúdo revisado em {FONTES_ATUALIZADAS_EM}</Text>
      </View>

      <Card style={styles.autoriaCard}>
        <Overline>{autoria.titulo}</Overline>
        <View style={styles.spacer} />
        {autoria.paragrafos.map((p) => (
          <Text key={p} style={[type.body, styles.paragrafo]}>
            {p}
          </Text>
        ))}
      </Card>

      {grupos.map((g) => (
        <Card key={g.heading}>
          <Overline>{g.heading}</Overline>
          <Text style={[type.body, styles.intro]}>{g.intro}</Text>
          <View style={styles.lista}>
            {g.fontes.map((f) => (
              <FonteRow key={f.url} fonte={f} />
            ))}
          </View>
        </Card>
      ))}

      <Text style={styles.ressalva}>{ressalva}</Text>
    </ScrollView>
  );
}

/**
 * Uma fonte, com o endereço à vista.
 *
 * O domínio aparece escrito mesmo sendo tocável: numa tela cuja função é
 * provar procedência, ver para onde o link leva antes de tocar vale mais do
 * que a economia de uma linha.
 */
function FonteRow({ fonte }: { fonte: Fonte }) {
  const dominio = fonte.url.replace(/^https?:\/\//, '');

  return (
    <Pressable
      onPress={() => openLink(fonte.url)}
      accessibilityRole="link"
      accessibilityLabel={`Abrir o site de ${fonte.entidade}`}
      style={({ pressed }) => [styles.fonte, pressed && styles.fontePressed]}
    >
      <View style={styles.fonteTexto}>
        <Text style={styles.fonteEntidade}>{fonte.entidade}</Text>
        {fonte.sigla ? <Text style={styles.fonteSigla}>{fonte.sigla}</Text> : null}
        <Text style={styles.fontePapel}>{fonte.papel}</Text>
        <Text style={styles.fonteUrl}>{dominio}</Text>
      </View>
      <Ionicons name="open-outline" size={17} color={palette.accentInk} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  title: { marginBottom: 4 },
  autoriaCard: { backgroundColor: palette.accentSoft, borderRadius: radius.lg },
  spacer: { height: spacing.md },
  paragrafo: { marginBottom: spacing.md, color: palette.textOnTiffany },
  intro: { marginTop: spacing.md, color: palette.textMuted },
  lista: { marginTop: spacing.md, gap: spacing.sm },
  fonte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    backgroundColor: palette.surfaceAlt,
  },
  fontePressed: { opacity: 0.6 },
  fonteTexto: { flex: 1, gap: 2 },
  fonteEntidade: { fontSize: 14.5, fontWeight: '700', color: palette.text },
  fonteSigla: { fontSize: 12, fontWeight: '600', color: palette.textMuted },
  fontePapel: { fontSize: 13, lineHeight: 19, color: palette.text, marginTop: 4 },
  fonteUrl: { fontSize: 12, fontWeight: '600', color: palette.accentInk, marginTop: 4 },
  ressalva: {
    ...type.small,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
});

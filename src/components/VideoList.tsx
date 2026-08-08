import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { videos } from '../data/videos';
import { procedureById } from '../data/procedures';
import { openLink } from '../lib/contact';
import { usePatient } from '../store/patient';
import { Card, Overline } from './ui';
import { palette, radius, spacing, type } from '../theme';

/**
 * Vídeos do canal, filtrados pelo procedimento da paciente. Não renderiza nada
 * quando não há vídeo para o caso dela — é o que permite ir acrescentando
 * vídeos aos poucos, sem deixar uma seção vazia nas telas de quem ainda não
 * tem nenhum.
 *
 * A miniatura do YouTube não é usada de propósito: ela viria de um servidor
 * externo, o que faria o app buscar imagem na rede a cada abertura e não
 * funcionaria sem conexão.
 */
export function VideoList({ apenasPreOp = false }: { apenasPreOp?: boolean }) {
  const { profile } = usePatient();
  const procedure = procedureById(profile.procedure);

  const meus = videos.filter(
    (v) =>
      (!apenasPreOp || v.preOp) &&
      (!v.kinds || v.kinds.includes(procedure.kind)) &&
      (!v.procedures || v.procedures.includes(profile.procedure)),
  );

  if (!meus.length) return null;

  return (
    <Card>
      <Overline>
        {apenasPreOp ? 'Enquanto espera' : 'Em vídeo, com o Dr. Henrique Reis'}
      </Overline>
      <View style={{ height: spacing.md }} />
      {meus.map((v, i) => (
        <Pressable
          key={v.id}
          accessibilityRole="link"
          accessibilityLabel={`${v.title}. ${v.summary}. Abre no YouTube.`}
          onPress={() => openLink(v.url)}
          style={({ pressed }) => [
            styles.row,
            i > 0 && styles.rowDivided,
            pressed && { opacity: 0.7 },
          ]}
        >
          <View style={styles.play}>
            <Ionicons name="play" size={15} color={palette.textOnDark} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.title}>{v.title}</Text>
            <Text style={type.small}>{v.summary}</Text>
          </View>
          <Ionicons name="open-outline" size={17} color={palette.textMuted} />
        </Pressable>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  rowDivided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
  },
  play: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
  },
  title: { fontSize: 14.5, fontWeight: '700', color: palette.text, marginBottom: 2 },
});

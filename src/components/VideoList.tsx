import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { videosFor, type Video } from '../data/videos';
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
export function VideoList({
  apenasPreOp = false,
  guide,
}: {
  apenasPreOp?: boolean;
  /** Quando informado, mostra os vídeos daquele guia em vez da lista geral. */
  guide?: string;
}) {
  const { profile } = usePatient();
  const procedure = procedureById(profile.procedure);

  const meus = videosFor({
    procedure: profile.procedure,
    kind: procedure.kind,
    guide,
    apenasPreOp,
  });

  if (!meus.length) return null;

  return (
    <Card>
      <Overline>
        {apenasPreOp ? 'Enquanto espera' : 'Em vídeo, com o Dr. Henrique Reis'}
      </Overline>
      <View style={{ height: spacing.md }} />
      {meus.map((v, i) => (
        <VideoRow key={v.id} video={v} dividido={i > 0} />
      ))}
    </Card>
  );
}

/**
 * Uma linha de vídeo. Fica separada para poder ser usada dentro de um cartão
 * que já existe — é o caso do vídeo institucional, que mora no cartão sobre o
 * cirurgião e não merece um cartão só para ele.
 */
export function VideoRow({ video, dividido = false }: { video: Video; dividido?: boolean }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${video.title}. ${video.summary}. Abre no YouTube.`}
      onPress={() => openLink(video.url)}
      style={({ pressed }) => [
        styles.row,
        dividido && styles.rowDivided,
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={styles.play}>
        <Ionicons name="play" size={15} color={palette.textOnDark} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.title}>{video.title}</Text>
        <Text style={type.small}>{video.summary}</Text>
      </View>
      <Ionicons name="open-outline" size={17} color={palette.textMuted} />
    </Pressable>
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

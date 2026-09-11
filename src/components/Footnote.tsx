import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { palette, spacing, type } from '../theme';

/**
 * O rodapé que fecha as abas de conteúdo.
 *
 * O aviso de que o app não substitui a avaliação médica já existia em algumas
 * telas. O link para as fontes é o que a diretriz 1.4.1 da Apple exige, com
 * uma condição que decide o formato: a citação precisa ser fácil de achar.
 * Guardá-la só numa tela de ajuda não cumpre — por isso ela fecha toda aba
 * que apresenta conteúdo clínico, no mesmo lugar em todas.
 */
export function Footnote({ aviso }: { aviso: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.aviso}>{aviso}</Text>
      <Link href="/fontes" style={styles.link}>
        Fontes e referências deste conteúdo
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.sm, gap: spacing.sm, alignItems: 'center' },
  aviso: { ...type.small, textAlign: 'center', paddingHorizontal: spacing.lg },
  link: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.accentInk,
    textAlign: 'center',
    paddingVertical: spacing.xs,
  },
});

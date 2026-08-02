import React from 'react';
import { Image, StyleSheet, View, type ImageStyle, type StyleProp } from 'react-native';

/**
 * Logotipo oficial, nas variações geradas a partir do arquivo original.
 * `onDark` troca para a versão branca — o logo original é preto e some
 * sobre os fundos escuros do app.
 */

const sources = {
  full: {
    dark: require('../../assets/logo.png'),
    light: require('../../assets/logo-white.png'),
    ratio: 1738 / 756,
  },
  signature: {
    dark: require('../../assets/logo-mark.png'),
    light: require('../../assets/logo-mark-white.png'),
    ratio: 1738 / 432,
  },
  monogram: {
    dark: require('../../assets/logo-monogram.png'),
    light: require('../../assets/logo-monogram-white.png'),
    ratio: 492 / 432,
  },
} as const;

type Variant = keyof typeof sources;

/**
 * @param variant  `full` lockup completo · `signature` a assinatura com o
 *                 traço estendido · `monogram` só as letras "hr"
 * @param width    largura desejada; a altura acompanha a proporção original
 */
export function Logo({
  variant = 'full',
  width,
  onDark = false,
  style,
}: {
  variant?: Variant;
  width: number;
  onDark?: boolean;
  style?: StyleProp<ImageStyle>;
}) {
  const s = sources[variant];
  return (
    <Image
      source={onDark ? s.light : s.dark}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="Dr. Henrique Reis — Cirurgia Plástica"
      style={[{ width, height: width / s.ratio }, style]}
    />
  );
}

/** Assinatura compacta usada na barra superior das telas internas. */
export function LogoMark({ width = 118, onDark = false }: { width?: number; onDark?: boolean }) {
  return (
    <View style={styles.markBox}>
      <Logo variant="signature" width={width} onDark={onDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  markBox: { justifyContent: 'center' },
});

import React from 'react';
import { Image, type ImageStyle, type StyleProp } from 'react-native';

/**
 * Logotipo oficial da clínica.
 *
 * A arte nunca é recolorida nem redesenhada: aparece sempre em preto, como
 * foi entregue. Por isso o logo só é usado sobre fundos claros — branco,
 * papel ou o verde Tiffany.
 */

const sources = {
  /** Lockup completo: assinatura + nome + "cirurgia plástica". */
  full: { file: require('../../assets/logo.png'), ratio: 1738 / 756 },
  /** Assinatura com o traço estendido. */
  signature: { file: require('../../assets/logo-mark.png'), ratio: 1738 / 432 },
  /** Apenas as letras "hr". */
  monogram: { file: require('../../assets/logo-monogram.png'), ratio: 480 / 432 },
} as const;

type Variant = keyof typeof sources;

/**
 * @param variant  qual recorte do logotipo exibir
 * @param width    largura desejada; a altura acompanha a proporção original
 */
export function Logo({
  variant = 'full',
  width,
  style,
}: {
  variant?: Variant;
  width: number;
  style?: StyleProp<ImageStyle>;
}) {
  const s = sources[variant];
  return (
    <Image
      source={s.file}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="Dr. Henrique Reis — Cirurgia Plástica"
      style={[{ width, height: width / s.ratio }, style]}
    />
  );
}

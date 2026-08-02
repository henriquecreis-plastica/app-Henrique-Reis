import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { palette } from '../theme';

/**
 * Monograma HR usado como marca do app.
 *
 * Substituição pelo logo oficial: troque este componente por
 * `<Image source={require('../../assets/logo.png')} />` mantendo a mesma
 * assinatura de props — nenhuma tela precisa ser alterada.
 */
export function LogoMark({ size = 44, color = palette.accent }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Circle cx={32} cy={32} r={30.5} stroke={color} strokeWidth={1.25} fill="none" />
      {/* H */}
      <Path d="M20 22 V42 M20 32 H31 M31 22 V42" stroke={color} strokeWidth={2.2} strokeLinecap="round" fill="none" />
      {/* R */}
      <Path
        d="M37 42 V22 h5.5a5.5 5.5 0 0 1 0 11H37 m5 0 l5 9"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function Wordmark({
  color = palette.text,
  accent = palette.accent,
  align = 'center',
}: {
  color?: string;
  accent?: string;
  align?: 'center' | 'flex-start';
}) {
  return (
    <View style={[styles.wordmark, { alignItems: align }]}>
      <Text style={[styles.name, { color }]}>DR. HENRIQUE REIS</Text>
      <View style={[styles.rule, { backgroundColor: accent }]} />
      <Text style={[styles.sub, { color: accent }]}>CIRURGIA PLÁSTICA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wordmark: { gap: 6 },
  name: { fontSize: 15, fontWeight: '600', letterSpacing: 3.2 },
  rule: { height: StyleSheet.hairlineWidth, width: 46, opacity: 0.8 },
  sub: { fontSize: 9, fontWeight: '600', letterSpacing: 3.4 },
});

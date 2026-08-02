import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Logo } from '../src/components/Logo';
import { palette } from '../src/theme';
import { usePatient } from '../src/store/patient';

/**
 * Qualquer rota desconhecida cai aqui e volta para o início do app, no ponto
 * certo: onboarding para quem ainda não se cadastrou, área principal para
 * quem já usou. Também é o que garante que o app abra corretamente quando
 * servido a partir de uma URL com caminho próprio, como na demonstração web.
 */
export default function NotFound() {
  const { profile, loading } = usePatient();

  if (loading) {
    return (
      <View style={styles.splash}>
        <Logo variant="full" width={230} />
        <ActivityIndicator color={palette.accent} />
      </View>
    );
  }

  return <Redirect href={profile.onboarded ? '/(tabs)' : '/onboarding'} />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    backgroundColor: palette.surface,
  },
});

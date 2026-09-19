import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Logo } from '../src/components/Logo';
import { palette } from '../src/theme';
import { usePatient } from '../src/store/patient';

export default function Index() {
  const { profile, loading } = usePatient();

  if (loading) {
    return (
      <View style={styles.splash}>
        <Logo variant="full" width={230} />
        <ActivityIndicator color={palette.accent} />
      </View>
    );
  }

  // O aceite vem antes do cadastro: nada do app aparece sem ele.
  if (!profile.termsAcceptedAt) return <Redirect href="/orientacoes" />;

  /* O código de acesso só é pedido a quem ainda não terminou o cadastro.
     Quem já usa o aplicativo entrou antes de o código existir, e muitas
     dessas pacientes estão em pós-operatório agora: trancar a porta na frente
     delas seria tirar, no meio da recuperação, o que elas já tinham. */
  if (!profile.accessGrantedAt && !profile.onboarded) return <Redirect href="/acesso" />;

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

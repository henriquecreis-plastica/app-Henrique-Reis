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
        <Logo variant="full" width={230} onDark />
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
    backgroundColor: palette.primary,
  },
});

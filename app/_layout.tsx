import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { palette } from '../src/theme';
import { PatientProvider } from '../src/store/patient';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PatientProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: palette.bg },
            headerTintColor: palette.primary,
            headerTitleStyle: { fontWeight: '700', fontSize: 16 },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: palette.bg },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="orientacoes" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="meus-dados"
            options={{ title: 'Meus dados', presentation: 'modal' }}
          />
          <Stack.Screen name="sintoma/[id]" options={{ title: 'Orientação' }} />
          <Stack.Screen name="cuidado/[id]" options={{ title: 'Cuidados' }} />
          <Stack.Screen
            name="emergencia"
            options={{ title: 'Preciso de ajuda', presentation: 'modal' }}
          />
        </Stack>
      </PatientProvider>
    </SafeAreaProvider>
  );
}

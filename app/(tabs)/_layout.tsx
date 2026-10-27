import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '../../src/theme';

/**
 * Altura da barra sem contar a borda do aparelho.
 *
 * O que vem somado a ela é `insets.bottom`, e isso não é refinamento: desde o
 * SDK 54 o Android desenha o aplicativo de ponta a ponta, por baixo da barra
 * de navegação do sistema. Altura fixa deixava os ícones escondidos atrás dos
 * botões do Android — e os rótulos, cortados.
 *
 * No iPhone com faixa inferior a conta dá os mesmos 86 de antes.
 */
const ALTURA_CONTEUDO = Platform.OS === 'ios' ? 52 : 58;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.accentInk,
        tabBarInactiveTintColor: palette.textMuted,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: palette.border,
          height: ALTURA_CONTEUDO + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hoje',
          tabBarIcon: ({ color, size }) => <Ionicons name="today-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recuperacao"
        options={{
          title: 'Evolução',
          tabBarIcon: ({ color, size }) => <Ionicons name="analytics-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="normal"
        options={{
          title: 'É normal?',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-checkmark-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cuidados"
        options={{
          title: 'Cuidados',
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contato"
        options={{
          title: 'Contato',
          tabBarIcon: ({ color, size }) => <Ionicons name="call-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

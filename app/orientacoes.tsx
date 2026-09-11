import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '../src/components/Logo';
import { Button } from '../src/components/ui';
import { usePatient } from '../src/store/patient';
import { palette, radius, spacing, type } from '../src/theme';

/**
 * Primeira tela do aplicativo, antes de qualquer cadastro.
 *
 * O app já traz o mesmo aviso no rodapé da tela inicial, em cada orientação e
 * na tela de contato, mas ali ele é nota de rodapé — lido depois, ou não lido.
 * Aqui ele é a única coisa na tela, e a paciente precisa confirmar para
 * seguir. É o que estabelece, antes de tudo, a hierarquia entre o que a equipe
 * diz e o que o aplicativo diz.
 */
const PONTOS = [
  {
    icon: 'book-outline' as const,
    text:
      'Este aplicativo é uma ferramenta complementar de acompanhamento. As informações são gerais e não substituem as orientações individualizadas fornecidas pelo Dr. Henrique Reis e sua equipe.',
  },
  {
    icon: 'people-outline' as const,
    text:
      'Em caso de divergência, prevalecem sempre as orientações fornecidas diretamente pela equipe.',
  },
  {
    icon: 'alert-circle-outline' as const,
    text:
      'Em situações de urgência ou emergência, não aguarde resposta pelo aplicativo: procure atendimento médico imediatamente.',
  },
];

export default function Orientacoes() {
  const router = useRouter();
  const { profile, save } = usePatient();

  const aceitar = async () => {
    await save({ termsAcceptedAt: new Date().toISOString() });
    router.replace(profile.onboarded ? '/(tabs)' : '/onboarding');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.logo}>
          <Logo variant="full" width={210} />
        </View>

        <Text style={[type.title, styles.title]}>Orientações importantes</Text>

        <View style={styles.list}>
          {PONTOS.map((p) => (
            <View key={p.icon} style={styles.item}>
              <View style={styles.itemIcon}>
                <Ionicons name={p.icon} size={19} color={palette.accentInk} />
              </View>
              <Text style={styles.itemText}>{p.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {/* As lojas pedem que os dois documentos estejam acessíveis, e a tela
            de aceite é onde faz mais sentido oferecê-los. As fontes entram na
            mesma linha porque esta é a primeira tela do app: é onde a citação
            exigida pela diretriz 1.4.1 fica mais fácil de achar. */}
        <View style={styles.links}>
          <Link href="/documento/termos" style={styles.link}>
            Termos de uso
          </Link>
          <Text style={styles.linkSep}>·</Text>
          <Link href="/documento/privacidade" style={styles.link}>
            Privacidade
          </Link>
          <Text style={styles.linkSep}>·</Text>
          <Link href="/fontes" style={styles.link}>
            Fontes
          </Link>
        </View>
        <Button label="Li e compreendi" icon="checkmark" onPress={aceitar} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xl, gap: spacing.xl },
  logo: { alignItems: 'center', paddingTop: spacing.xxl, paddingBottom: spacing.md },
  title: { textAlign: 'center' },
  list: { gap: spacing.md },
  item: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    padding: spacing.lg,
  },
  itemIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: palette.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: { flex: 1, fontSize: 14.5, lineHeight: 21, color: palette.text },
  links: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  link: { fontSize: 13, fontWeight: '600', color: palette.accentInk },
  linkSep: { fontSize: 13, color: palette.textMuted },
  footer: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
    backgroundColor: palette.bg,
  },
});

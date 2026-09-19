import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '../src/components/Logo';
import { Button } from '../src/components/ui';
import { codigoValido } from '../src/data/acesso';
import { callPhone, openWhatsApp } from '../src/lib/contact';
import { usePatient } from '../src/store/patient';
import { clinic, palette, radius, spacing, type } from '../src/theme';

/**
 * O código que a equipe entrega na alta.
 *
 * Vem depois do aceite das orientações e antes do cadastro: a paciente
 * confirma que leu os avisos, prova que é da clínica, e só então informa o
 * procedimento e a data.
 *
 * A tela tem uma regra que vale mais do que a porta: ela nunca pode deixar
 * uma paciente operada sem conseguir falar com alguém. Quem perdeu o cartão,
 * quem recebeu o código por telefone e anotou errado, quem está com dor às
 * três da manhã — todas precisam de uma saída daqui que leve à equipe, não a
 * um beco. Por isso o contato fica na própria tela, e não atrás do código.
 */
export default function Acesso() {
  const router = useRouter();
  const { profile, save } = usePatient();
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState(false);

  const entrar = async () => {
    if (!codigoValido(codigo)) {
      setErro(true);
      return;
    }
    await save({ accessGrantedAt: new Date().toISOString() });
    router.replace(profile.onboarded ? '/(tabs)' : '/onboarding');
  };

  const pedirCodigo = () =>
    openWhatsApp(
      'Olá! Baixei o aplicativo de pós-operatório e preciso do código de acesso, por favor.',
    );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logo}>
            <Logo variant="full" width={200} />
          </View>

          <Text style={[type.title, styles.titulo]}>Código de acesso</Text>
          <Text style={styles.explicacao}>
            Este aplicativo é das pacientes do {clinic.doctor}. A equipe entrega o código na sua
            alta, junto com as orientações.
          </Text>

          <TextInput
            style={[styles.campo, erro && styles.campoErro]}
            value={codigo}
            onChangeText={(t) => {
              setCodigo(t);
              if (erro) setErro(false);
            }}
            placeholder="Digite o código"
            placeholderTextColor={palette.textMuted}
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="off"
            spellCheck={false}
            returnKeyType="go"
            onSubmitEditing={entrar}
            accessibilityLabel="Código de acesso"
          />

          {erro ? (
            <View style={styles.erroLinha}>
              <Ionicons name="alert-circle" size={16} color={palette.urgent} />
              <Text style={styles.erroTexto}>
                Este código não confere. Confira o cartão da alta — maiúscula, espaço e hífen não
                fazem diferença.
              </Text>
            </View>
          ) : (
            <Text style={styles.dica}>
              Não precisa se preocupar com maiúscula, espaço ou hífen.
            </Text>
          )}

          <View style={styles.acao}>
            <Button label="Entrar" icon="arrow-forward" onPress={entrar} />
          </View>

          {/* A saída. Ninguém que já operou pode ficar sem conseguir falar com
              a equipe por causa de um cartão perdido. */}
          <View style={styles.ajuda}>
            <Text style={styles.ajudaTitulo}>Não tem o código?</Text>
            <Text style={styles.ajudaTexto}>
              Fale com a equipe — a gente te passa na hora.
            </Text>
            <View style={styles.ajudaBotoes}>
              <Pressable style={styles.ajudaBotao} onPress={pedirCodigo}>
                <Ionicons name="logo-whatsapp" size={17} color={palette.accentInk} />
                <Text style={styles.ajudaBotaoTexto}>WhatsApp</Text>
              </Pressable>
              <Pressable style={styles.ajudaBotao} onPress={() => callPhone()}>
                <Ionicons name="call-outline" size={16} color={palette.accentInk} />
                <Text style={styles.ajudaBotaoTexto}>Ligar</Text>
              </Pressable>
            </View>
            <Text style={styles.ajudaUrgencia}>
              Em urgência, não espere resposta pelo aplicativo: procure atendimento médico
              imediatamente.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  flex: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  logo: { alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.xl },
  titulo: { textAlign: 'center' },
  explicacao: {
    fontSize: 15,
    lineHeight: 22,
    color: palette.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  campo: {
    backgroundColor: palette.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    color: palette.text,
  },
  campoErro: { borderColor: palette.urgent, backgroundColor: palette.urgentBg },
  dica: {
    ...type.small,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  erroLinha: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    marginTop: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  erroTexto: { flex: 1, fontSize: 13, lineHeight: 19, color: palette.urgent },
  acao: { marginTop: spacing.xl },
  ajuda: {
    marginTop: spacing.xxl,
    paddingTop: spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
    alignItems: 'center',
  },
  ajudaTitulo: { fontSize: 15, fontWeight: '700', color: palette.text },
  ajudaTexto: { ...type.small, marginTop: 4, textAlign: 'center' },
  ajudaBotoes: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  ajudaBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.tiffanyLine,
    backgroundColor: palette.accentSoft,
  },
  ajudaBotaoTexto: { fontSize: 14, fontWeight: '600', color: palette.accentInk },
  ajudaUrgencia: {
    ...type.small,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
});

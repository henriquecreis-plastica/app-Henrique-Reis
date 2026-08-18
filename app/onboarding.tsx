import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '../src/components/Logo';
import {
  DateFields,
  ProcedurePicker,
  dateProblem,
  emptyDate,
  formStyles,
  toIsoDate,
  type DateParts,
} from '../src/components/SurgeryForm';
import { Button, Card } from '../src/components/ui';
import { eventNoun, procedureKindOf, type ProcedureId } from '../src/data/procedures';
import { usePatient } from '../src/store/patient';
import { clinic, palette, spacing, type } from '../src/theme';

type Step = 0 | 1 | 2;

const stepTitles = ['Boas-vindas', 'Seus dados', 'Data'];

export default function Onboarding() {
  const router = useRouter();
  const { save } = usePatient();
  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState('');
  const [escolhidos, setEscolhidos] = useState<ProcedureId[]>([]);
  const [date, setDate] = useState<DateParts>(emptyDate);

  const iso = toIsoDate(date);
  const dateReady = !!iso && !dateProblem(date);
  const noun = escolhidos.length ? eventNoun(procedureKindOf(escolhidos)) : 'cirurgia';

  const setRelativeDay = (offsetDays: number) => {
    const t = new Date();
    t.setDate(t.getDate() - offsetDays);
    setDate({
      day: String(t.getDate()),
      month: String(t.getMonth() + 1),
      year: String(t.getFullYear()),
    });
  };

  const finish = async () => {
    if (!escolhidos.length || !iso || !dateReady) return;
    await save({
      name: name.trim(),
      procedure: escolhidos[0],
      procedures: escolhidos,
      surgeryDate: iso,
      onboarded: true,
    });
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={styles.progressRow}
          accessibilityRole="progressbar"
          accessibilityLabel={`Passo ${step + 1} de 3: ${stepTitles[step]}`}
        >
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.progressBar, i <= step && styles.progressBarActive]} />
          ))}
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 0 && (
            <View style={styles.welcome}>
              <Logo variant="full" width={252} />
              <Text style={[type.display, styles.welcomeTitle]}>
                Seu pós-operatório, acompanhado de perto.
              </Text>
              <Text style={[type.bodyMuted, styles.center]}>
                Este aplicativo reúne as orientações da nossa equipe para você saber, a cada dia, o
                que é esperado na sua recuperação e quando precisa nos procurar.
              </Text>
              <View style={styles.welcomePoints}>
                {[
                  { icon: 'calendar-outline' as const, text: 'Orientações do seu dia de pós-operatório' },
                  { icon: 'shield-checkmark-outline' as const, text: 'O que é normal e o que não é' },
                  { icon: 'chatbubbles-outline' as const, text: 'Contato direto com a equipe' },
                ].map((p) => (
                  <View key={p.text} style={styles.welcomePoint}>
                    <Ionicons name={p.icon} size={19} color={palette.accentInk} />
                    <Text style={type.body}>{p.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {step === 1 && (
            <View style={styles.stepBody}>
              <Text style={type.title}>Como podemos te chamar?</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Seu primeiro nome"
                placeholderTextColor={palette.textMuted}
                style={formStyles.input}
                accessibilityLabel="Seu primeiro nome"
                autoCapitalize="words"
                returnKeyType="done"
              />
              <Text style={[type.title, styles.spacedTitle]}>O que você realizou?</Text>
              <ProcedurePicker value={escolhidos} onChange={setEscolhidos} />
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepBody}>
              <Text style={type.title}>
                {noun === 'cirurgia' ? 'Quando foi a sua cirurgia?' : 'Quando foi o seu procedimento?'}
              </Text>
              <Text style={type.bodyMuted}>
                Usamos essa data para mostrar as orientações certas para o seu dia. Se ainda não
                aconteceu, informe a data marcada.
              </Text>

              <View style={styles.dateBlock}>
                <DateFields value={date} onChange={setDate} />
              </View>

              <View style={styles.quickRow}>
                <Button
                  label="Foi hoje"
                  variant="secondary"
                  onPress={() => setRelativeDay(0)}
                  style={styles.flex}
                />
                <Button
                  label="Foi ontem"
                  variant="secondary"
                  onPress={() => setRelativeDay(1)}
                  style={styles.flex}
                />
              </View>

              <Card style={styles.disclaimer}>
                <Ionicons name="information-circle-outline" size={20} color={palette.accentInk} />
                <Text style={[type.small, styles.flex]}>
                  As orientações do aplicativo são gerais e não substituem a avaliação do
                  {' '}{clinic.doctor} ou de sua equipe. Em caso de dúvida ou sinal de alerta, entre em
                  contato.
                </Text>
              </Card>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step === 0 && <Button label="Começar" icon="arrow-forward" onPress={() => setStep(1)} />}
          {step === 1 && (
            <>
              <Button
                label="Continuar"
                icon="arrow-forward"
                onPress={() => setStep(2)}
                disabled={!escolhidos.length}
              />
              {!escolhidos.length ? (
                <Text style={styles.hint}>Escolha o procedimento para continuar</Text>
              ) : null}
              <Button label="Voltar" variant="ghost" onPress={() => setStep(0)} />
            </>
          )}
          {step === 2 && (
            <>
              <Button
                label="Ver minhas orientações"
                icon="checkmark"
                onPress={finish}
                disabled={!dateReady}
              />
              {!dateReady ? <Text style={styles.hint}>Informe dia, mês e ano</Text> : null}
              <Button label="Voltar" variant="ghost" onPress={() => setStep(1)} />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  flex: { flex: 1 },
  progressRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  progressBar: { flex: 1, height: 3, borderRadius: 3, backgroundColor: palette.border },
  progressBarActive: { backgroundColor: palette.tiffany },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.lg },
  welcome: { alignItems: 'center', gap: spacing.lg, paddingTop: spacing.xl },
  welcomeTitle: { textAlign: 'center', marginTop: spacing.md },
  center: { textAlign: 'center' },
  welcomePoints: { gap: spacing.md, marginTop: spacing.lg, alignSelf: 'stretch' },
  welcomePoint: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepBody: { gap: spacing.md },
  spacedTitle: { marginTop: spacing.lg },
  dateBlock: { marginTop: spacing.sm },
  quickRow: { flexDirection: 'row', gap: spacing.md },
  disclaimer: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    backgroundColor: palette.surfaceAlt,
    marginTop: spacing.sm,
  },
  footer: {
    padding: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
    backgroundColor: palette.bg,
  },
  hint: { ...type.small, textAlign: 'center' },
});

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
import { LogoMark, Wordmark } from '../src/components/Logo';
import { Button, Card } from '../src/components/ui';
import { procedures, type ProcedureId } from '../src/data/procedures';
import { usePatient } from '../src/store/patient';
import { clinic, palette, radius, spacing, type } from '../src/theme';

type Step = 0 | 1 | 2;

export default function Onboarding() {
  const router = useRouter();
  const { save } = usePatient();
  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState('');
  const [procedure, setProcedure] = useState<ProcedureId | null>(null);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const isoDate = useMemo(() => {
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);
    if (!d || !m || !y || year.length !== 4) return null;
    if (m < 1 || m > 12 || d < 1 || d > 31) return null;
    const date = new Date(y, m - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }, [day, month, year]);

  const setToday = (offsetDays = 0) => {
    const t = new Date();
    t.setDate(t.getDate() - offsetDays);
    setDay(String(t.getDate()));
    setMonth(String(t.getMonth() + 1));
    setYear(String(t.getFullYear()));
  };

  const finish = async () => {
    if (!procedure || !isoDate) return;
    await save({
      name: name.trim(),
      procedure,
      surgeryDate: isoDate,
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
        <View style={styles.progressRow}>
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
              <LogoMark size={72} color={palette.accent} />
              <Wordmark />
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
                    <Ionicons name={p.icon} size={19} color={palette.accent} />
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
                style={styles.input}
                autoCapitalize="words"
                returnKeyType="next"
              />
              <Text style={[type.title, styles.spacedTitle]}>Qual procedimento você realizou?</Text>
              <View style={styles.procedureList}>
                {procedures.map((p) => {
                  const selected = procedure === p.id;
                  return (
                    <Pressable
                      key={p.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => setProcedure(p.id)}
                      style={({ pressed }) => [
                        styles.procedure,
                        selected && styles.procedureSelected,
                        pressed && { opacity: 0.7 },
                      ]}
                    >
                      <Ionicons
                        name={p.icon}
                        size={20}
                        color={selected ? palette.accent : palette.textMuted}
                      />
                      <View style={styles.flex}>
                        <Text style={[styles.procedureName, selected && styles.procedureNameSel]}>
                          {p.name}
                        </Text>
                        <Text
                          style={[
                            type.small,
                            selected && { color: palette.textOnDarkMuted },
                          ]}
                        >
                          {p.short}
                        </Text>
                      </View>
                      {selected ? (
                        <Ionicons name="checkmark-circle" size={20} color={palette.accent} />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepBody}>
              <Text style={type.title}>Quando foi a sua cirurgia?</Text>
              <Text style={type.bodyMuted}>
                Usamos essa data para mostrar as orientações certas para o seu dia de recuperação.
              </Text>

              <View style={styles.dateRow}>
                <DateField label="Dia" value={day} onChange={setDay} maxLength={2} />
                <DateField label="Mês" value={month} onChange={setMonth} maxLength={2} />
                <DateField label="Ano" value={year} onChange={setYear} maxLength={4} flex={1.4} />
              </View>

              <View style={styles.quickRow}>
                <Button label="Foi hoje" variant="secondary" onPress={() => setToday(0)} style={styles.flex} />
                <Button label="Foi ontem" variant="secondary" onPress={() => setToday(1)} style={styles.flex} />
              </View>

              <Card style={styles.disclaimer}>
                <Ionicons name="information-circle-outline" size={20} color={palette.primary} />
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
                disabled={!procedure}
              />
              <Button label="Voltar" variant="ghost" onPress={() => setStep(0)} />
            </>
          )}
          {step === 2 && (
            <>
              <Button
                label="Ver minhas orientações"
                icon="checkmark"
                onPress={finish}
                disabled={!isoDate}
              />
              <Button label="Voltar" variant="ghost" onPress={() => setStep(1)} />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function DateField({
  label,
  value,
  onChange,
  maxLength,
  flex = 1,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  flex?: number;
}) {
  return (
    <View style={{ flex }}>
      <Text style={styles.dateLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, ''))}
        keyboardType="number-pad"
        maxLength={maxLength}
        placeholder={'0'.repeat(maxLength)}
        placeholderTextColor={palette.border}
        style={[styles.input, styles.dateInput]}
      />
    </View>
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
  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: 3,
    backgroundColor: palette.border,
  },
  progressBarActive: { backgroundColor: palette.accent },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.lg },
  welcome: { alignItems: 'center', gap: spacing.lg, paddingTop: spacing.xl },
  welcomeTitle: { textAlign: 'center', marginTop: spacing.md },
  center: { textAlign: 'center' },
  welcomePoints: { gap: spacing.md, marginTop: spacing.lg, alignSelf: 'stretch' },
  welcomePoint: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepBody: { gap: spacing.md },
  spacedTitle: { marginTop: spacing.lg },
  input: {
    backgroundColor: palette.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: 16,
    color: palette.text,
  },
  procedureList: { gap: spacing.sm },
  procedure: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: palette.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
  },
  procedureSelected: { backgroundColor: palette.primary, borderColor: palette.primary },
  procedureName: { fontSize: 15, fontWeight: '700', color: palette.text },
  procedureNameSel: { color: palette.textOnDark },
  dateRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  dateLabel: {
    ...type.small,
    marginBottom: 6,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  dateInput: { textAlign: 'center', fontSize: 20, fontWeight: '600' },
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
});

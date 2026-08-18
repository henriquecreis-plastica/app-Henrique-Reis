import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  DateFields,
  ProcedurePicker,
  dateProblem,
  formStyles,
  toDateParts,
  toIsoDate,
  type DateParts,
} from '../src/components/SurgeryForm';
import { Button } from '../src/components/ui';
import { eventNoun, procedureKindOf, type ProcedureId } from '../src/data/procedures';
import { usePatient } from '../src/store/patient';
import { palette, spacing, type } from '../src/theme';

/**
 * Edição dos dados já cadastrados. Antes, corrigir a data exigia apagar o
 * perfil e refazer o cadastro, o que também descartava o progresso da
 * paciente. Aqui nada é perdido: só os campos alterados são salvos.
 */
export default function MeusDados() {
  const router = useRouter();
  const { profile, procedureIds, save } = usePatient();

  const [name, setName] = useState(profile.name);
  const [escolhidos, setEscolhidos] = useState<ProcedureId[]>(procedureIds);
  const [date, setDate] = useState<DateParts>(toDateParts(profile.surgeryDate));

  const iso = toIsoDate(date);
  const ready = !!iso && !dateProblem(date) && escolhidos.length > 0;
  const noun = eventNoun(procedureKindOf(escolhidos.length ? escolhidos : procedureIds));

  const submit = async () => {
    if (!iso || !ready) return;
    await save({
      name: name.trim(),
      procedure: escolhidos[0],
      procedures: escolhidos,
      surgeryDate: iso,
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={type.bodyMuted}>
          Alterar estes dados atualiza as orientações do app. Seu progresso é mantido.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Seu primeiro nome"
            placeholderTextColor={palette.textMuted}
            style={formStyles.input}
            accessibilityLabel="Seu primeiro nome"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Data d{noun === 'cirurgia' ? 'a cirurgia' : 'o procedimento'}</Text>
          <DateFields value={date} onChange={setDate} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Procedimento</Text>
          <ProcedurePicker value={escolhidos} onChange={setEscolhidos} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Salvar alterações" icon="checkmark" onPress={submit} disabled={!ready} />
        <Button label="Cancelar" variant="ghost" onPress={() => router.back()} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.xl },
  field: { gap: spacing.sm },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: palette.accentInk,
  },
  footer: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
    backgroundColor: palette.bg,
  },
});

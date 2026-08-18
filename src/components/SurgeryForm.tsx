import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  combinableProcedures,
  procedures,
  type ProcedureId,
  type ProcedureKind,
} from '../data/procedures';
import { palette, radius, spacing, type } from '../theme';

/**
 * Campos compartilhados entre o cadastro inicial e a edição posterior dos
 * dados. Manter um só componente garante que as duas telas validem a data
 * exatamente da mesma forma.
 */

export interface DateParts {
  day: string;
  month: string;
  year: string;
}

export const emptyDate: DateParts = { day: '', month: '', year: '' };

export function toDateParts(iso: string): DateParts {
  const [y, m, d] = iso.split('-');
  return y && m && d ? { day: String(Number(d)), month: String(Number(m)), year: y } : emptyDate;
}

/** Converte para ISO e valida. Retorna `null` quando a data ainda não é válida. */
export function toIsoDate({ day, month, year }: DateParts): string | null {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!d || !m || year.length !== 4) return null;
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Mensagem de erro em linguagem de paciente, ou `null` quando está tudo certo. */
export function dateProblem(parts: DateParts): string | null {
  const { day, month, year } = parts;
  if (!day && !month && !year) return null;
  if (!day || !month || year.length !== 4) return null;
  if (Number(month) > 12) return 'O mês precisa estar entre 1 e 12.';
  if (toIsoDate(parts) === null) return 'Essa data não existe. Confira o dia e o mês.';

  const iso = toIsoDate(parts)!;
  const diffDays = Math.round(
    (Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`)) /
      86_400_000,
  );
  if (diffDays > 365) return 'Essa data está a mais de um ano no futuro. Confira o ano.';
  if (diffDays < -1825) return 'Essa data está a mais de cinco anos atrás. Confira o ano.';
  return null;
}

export function DateFields({
  value,
  onChange,
}: {
  value: DateParts;
  onChange: (v: DateParts) => void;
}) {
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);
  const problem = useMemo(() => dateProblem(value), [value]);

  const setPart = (key: keyof DateParts, raw: string, next?: React.RefObject<TextInput | null>) => {
    const digits = raw.replace(/\D/g, '');
    onChange({ ...value, [key]: digits });
    // Avança sozinho quando o campo enche — evita três toques desnecessários.
    const full = (key === 'year' && digits.length === 4) || (key !== 'year' && digits.length === 2);
    if (full && next?.current) next.current.focus();
  };

  return (
    <View style={{ gap: spacing.sm }}>
      <View style={styles.dateRow}>
        <Field
          label="Dia"
          value={value.day}
          onChangeText={(t) => setPart('day', t, monthRef)}
          maxLength={2}
          invalid={!!problem}
        />
        <Field
          ref={monthRef}
          label="Mês"
          value={value.month}
          onChangeText={(t) => setPart('month', t, yearRef)}
          maxLength={2}
          invalid={!!problem}
        />
        <Field
          ref={yearRef}
          label="Ano"
          value={value.year}
          onChangeText={(t) => setPart('year', t)}
          maxLength={4}
          flex={1.4}
          invalid={!!problem}
        />
      </View>
      {problem ? (
        <View style={styles.problemRow}>
          <Ionicons name="alert-circle" size={15} color={palette.urgent} />
          <Text style={styles.problemText}>{problem}</Text>
        </View>
      ) : null}
    </View>
  );
}

const Field = React.forwardRef<
  TextInput,
  {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    maxLength: number;
    flex?: number;
    invalid?: boolean;
  }
>(({ label, value, onChangeText, maxLength, flex = 1, invalid }, ref) => (
  <View style={{ flex }}>
    <Text style={styles.dateLabel}>{label}</Text>
    <TextInput
      ref={ref}
      value={value}
      onChangeText={onChangeText}
      keyboardType="number-pad"
      maxLength={maxLength}
      accessibilityLabel={label}
      placeholder={'0'.repeat(maxLength)}
      placeholderTextColor={palette.border}
      style={[styles.input, styles.dateInput, invalid && styles.inputInvalid]}
    />
  </View>
));
Field.displayName = 'Field';

const groupTitles: Record<ProcedureKind, string> = {
  cirurgico: 'Cirurgias',
  ambulatorial: 'Procedimentos de consultório',
};

const kindOrder: ProcedureKind[] = ['cirurgico', 'ambulatorial'];

/**
 * Com dezessete opções, a lista corrida vira uma parede. Separar por tipo dá
 * à paciente um ponto de referência antes de procurar o nome exato.
 *
 * A seleção é uma lista porque operar mama e abdome no mesmo tempo cirúrgico é
 * rotina na clínica. No caso comum ela tem um item só, e a tela se comporta
 * como sempre se comportou: escolher uma cirurgia troca a anterior.
 */
export function ProcedurePicker({
  value,
  onChange,
}: {
  value: ProcedureId[];
  onChange: (ids: ProcedureId[]) => void;
}) {
  const combinaveis = useMemo(() => combinableProcedures(), []);
  const [combinando, setCombinando] = useState(value.length > 1);

  const escolherUm = (id: ProcedureId) => {
    setCombinando(false);
    onChange([id]);
  };

  const alternar = (id: ProcedureId) =>
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);

  /* Ao entrar no modo combinado, o que já estava escolhido vira a primeira
     marcação — ela não deve ter de escolher de novo o que já disse. */
  const entrarCombinada = () => {
    setCombinando(true);
    onChange(value.filter((id) => combinaveis.some((p) => p.id === id)));
  };

  return (
    <View style={styles.groups}>
      {kindOrder.map((kind) => {
        /* Combinar é conceito de centro cirúrgico: não faz sentido somar uma
           aplicação de toxina a uma abdominoplastia. */
        if (combinando && kind === 'ambulatorial') return null;
        const daVez = combinando
          ? combinaveis
          : procedures.filter((p) => p.kind === kind);

        return (
        <View key={kind} style={styles.group}>
          <Text style={styles.groupTitle}>{groupTitles[kind]}</Text>
          <View style={styles.list}>
            {kind === 'cirurgico' ? (
              <>
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected: combinando }}
                  accessibilityLabel="Cirurgia combinada. Mais de uma cirurgia no mesmo dia."
                  onPress={entrarCombinada}
                  style={({ pressed }) => [
                    styles.procedure,
                    combinando && styles.procedureSelected,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Ionicons
                    name="git-merge-outline"
                    size={20}
                    color={combinando ? palette.textOnTiffany : palette.textMuted}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.procedureName, combinando && { color: palette.textOnTiffany }]}
                    >
                      Cirurgia combinada
                    </Text>
                    <Text
                      style={[type.small, combinando && { color: palette.textOnTiffanyMuted }]}
                    >
                      Mais de uma cirurgia no mesmo dia
                    </Text>
                  </View>
                  {combinando ? (
                    <Ionicons name="checkmark-circle" size={20} color={palette.textOnTiffany} />
                  ) : null}
                </Pressable>

                {combinando ? (
                  <Text style={styles.combinadaAjuda}>
                    {value.length < 2
                      ? 'Marque todas as cirurgias que você fez no mesmo dia — pelo menos duas.'
                      : 'Você vai receber as orientações, os marcos e os sinais de alerta de todas as cirurgias marcadas.'}
                  </Text>
                ) : null}
              </>
            ) : null}

            {daVez.map((p) => {
                const selected = combinando ? value.includes(p.id) : value[0] === p.id;
                return (
                  <Pressable
                    key={p.id}
                    accessibilityRole={combinando ? 'checkbox' : 'radio'}
                    accessibilityState={{ selected, checked: selected }}
                    accessibilityLabel={[p.name, p.short, p.note].filter(Boolean).join('. ')}
                    onPress={() => (combinando ? alternar(p.id) : escolherUm(p.id))}
                    style={({ pressed }) => [
                      styles.procedure,
                      selected && styles.procedureSelected,
                      combinando && styles.procedureCombinavel,
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <Ionicons
                      name={p.icon}
                      size={20}
                      color={selected ? palette.textOnTiffany : palette.textMuted}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.procedureName, selected && { color: palette.textOnTiffany }]}
                      >
                        {p.name}
                      </Text>
                      <Text style={[type.small, selected && { color: palette.textOnTiffanyMuted }]}>
                        {p.short}
                      </Text>
                      {/* O aviso só existe onde dois procedimentos se parecem
                          e a escolha errada troca todo o conteúdo. Vem na cor
                          do resto e entre parênteses: é uma ressalva de leitura,
                          não um alerta — em laranja ele dominava o cartão e
                          fazia a paciente achar que havia algo errado. */}
                      {p.note ? (
                        <Text
                          style={[
                            styles.procedureNote,
                            selected && { color: palette.textOnTiffanyMuted },
                          ]}
                        >
                          ({p.note})
                        </Text>
                      ) : null}
                    </View>
                    {selected ? (
                      <Ionicons name="checkmark-circle" size={20} color={palette.textOnTiffany} />
                    ) : combinando ? (
                      <Ionicons name="ellipse-outline" size={20} color={palette.border} />
                    ) : null}
                  </Pressable>
                );
              })}
          </View>
        </View>
        );
      })}
    </View>
  );
}

export const formStyles = StyleSheet.create({
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
});

const styles = StyleSheet.create({
  input: formStyles.input,
  inputInvalid: { borderColor: palette.urgent, borderWidth: 1 },
  dateRow: { flexDirection: 'row', gap: spacing.md },
  dateLabel: {
    ...type.small,
    marginBottom: 6,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  dateInput: { textAlign: 'center', fontSize: 20, fontWeight: '600' },
  problemRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  problemText: { ...type.small, color: palette.urgent, flex: 1 },
  groups: { gap: spacing.xl },
  group: { gap: spacing.sm },
  groupTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: palette.accentInk,
  },
  list: { gap: spacing.sm },
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
  procedureSelected: { backgroundColor: palette.tiffany, borderColor: palette.tiffany },
  /* Recuadas, as opções da combinação se leem como filhas do cartão
     "Cirurgia combinada", e não como uma segunda lista solta. */
  procedureCombinavel: { marginLeft: spacing.lg },
  combinadaAjuda: {
    ...type.small,
    marginLeft: spacing.lg,
    marginBottom: spacing.xs,
  },
  procedureNote: {
    fontSize: 11.5,
    lineHeight: 16,
    color: palette.textMuted,
    marginTop: 4,
  },
  procedureName: { fontSize: 15, fontWeight: '700', color: palette.text },
});

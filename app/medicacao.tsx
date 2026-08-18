import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { formStyles } from '../src/components/SurgeryForm';
import { Button, Card, Overline } from '../src/components/ui';
import { lembretesDisponiveis, pedirPermissao } from '../src/lib/lembretes';
import {
  dosesDeHoje,
  encerrado,
  foiTomada,
  horaCurta,
  resumoEsquema,
  terminaEm,
} from '../src/lib/medicacao';
import { openLink } from '../src/lib/contact';
import { usePatient } from '../src/store/patient';
import type { Medication } from '../src/store/storage';
import { voltar } from '../src/lib/navegar';
import { palette, radius, spacing, type } from '../src/theme';

/**
 * Os remédios da prescrição e os lembretes de cada dose.
 *
 * Quem digita é a paciente, ou a equipe na alta — o app não lê receita. Um
 * remédio interpretado errado de um PDF viraria lembrete em horário errado, e
 * esse é o tipo de erro que ninguém percebe até a dose ser tomada fora de hora.
 */
export default function Medicacao() {
  const router = useRouter();
  const { profile, medications, saveMedications, save } = usePatient();
  const [editando, setEditando] = useState<Medication | 'novo' | null>(null);

  const [ativos, terminados] = useMemo(
    () => [medications.filter((m) => !encerrado(m)), medications.filter((m) => encerrado(m))],
    [medications],
  );

  const marcarDose = async (m: Medication, dose: Date) => {
    const iso = dose.toISOString();
    const takenAt = foiTomada(m, dose)
      ? m.takenAt.filter((t) => Math.abs(new Date(t).getTime() - dose.getTime()) >= 60_000)
      : [...m.takenAt, iso];
    await saveMedications(medications.map((x) => (x.id === m.id ? { ...x, takenAt } : x)));
  };

  const remover = (m: Medication) => {
    const apagar = () => saveMedications(medications.filter((x) => x.id !== m.id));
    if (Platform.OS === 'web') {
      apagar();
      return;
    }
    Alert.alert('Remover remédio', `Deseja remover ${m.name} e os seus lembretes?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: apagar },
    ]);
  };

  if (editando) {
    return (
      <Formulario
        inicial={editando === 'novo' ? null : editando}
        onCancelar={() => setEditando(null)}
        onSalvar={async (m) => {
          const lista =
            editando === 'novo'
              ? [...medications, m]
              : medications.map((x) => (x.id === m.id ? m : x));
          await saveMedications(lista);
          if (lembretesDisponiveis) await pedirPermissao().then(() => saveMedications(lista));
          setEditando(null);
        }}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Meus remédios' }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
        <Text style={type.bodyMuted}>
          Cadastre o que você está tomando e o aplicativo avisa a cada dose. Tudo fica salvo apenas
          neste aparelho.
        </Text>

        {!lembretesDisponiveis ? (
          <View style={styles.aviso}>
            <Ionicons name="information-circle" size={18} color={palette.attention} />
            <Text style={styles.avisoTexto}>
              No navegador os horários aparecem, mas o alarme não toca. Os lembretes funcionam no
              aplicativo instalado.
            </Text>
          </View>
        ) : null}

        {ativos.length === 0 ? (
          <Card>
            <Overline>Nenhum remédio cadastrado</Overline>
            <View style={{ height: spacing.sm }} />
            <Text style={type.bodyMuted}>
              Tenha a receita em mãos e cadastre um por vez. Leva menos de um minuto cada.
            </Text>
          </Card>
        ) : (
          ativos.map((m) => (
            <Card key={m.id}>
              <View style={styles.linhaTopo}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.nome}>{m.name}</Text>
                  <Text style={type.small}>{resumoEsquema(m)}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Editar ${m.name}`}
                  onPress={() => setEditando(m)}
                  hitSlop={10}
                >
                  <Ionicons name="create-outline" size={20} color={palette.textMuted} />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remover ${m.name}`}
                  onPress={() => remover(m)}
                  hitSlop={10}
                >
                  <Ionicons name="trash-outline" size={20} color={palette.textMuted} />
                </Pressable>
              </View>

              <View style={{ height: spacing.md }} />
              <Overline>Hoje</Overline>
              <View style={styles.doses}>
                {dosesDeHoje(m).map((d) => {
                  const tomada = foiTomada(m, d);
                  return (
                    <Pressable
                      key={d.toISOString()}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: tomada }}
                      accessibilityLabel={`Dose das ${horaCurta(d)}${tomada ? ', tomada' : ''}`}
                      onPress={() => marcarDose(m, d)}
                      style={[styles.dose, tomada && styles.doseTomada]}
                    >
                      <Ionicons
                        name={tomada ? 'checkmark-circle' : 'ellipse-outline'}
                        size={16}
                        color={tomada ? palette.textOnTiffany : palette.textMuted}
                      />
                      <Text style={[styles.doseHora, tomada && { color: palette.textOnTiffany }]}>
                        {horaCurta(d)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {terminaEm(m) ? (
                <Text style={[type.small, { marginTop: spacing.md }]}>
                  Último dia em {terminaEm(m)!.toLocaleDateString('pt-BR')}
                </Text>
              ) : null}
            </Card>
          ))
        )}

        <Button label="Adicionar remédio" icon="add" onPress={() => setEditando('novo')} />

        {terminados.length ? (
          <Card>
            <Overline>Já encerrados</Overline>
            <View style={{ height: spacing.sm }} />
            {terminados.map((m) => (
              <View key={m.id} style={styles.linhaTopo}>
                <Text style={[type.body, styles.encerrado]}>{m.name}</Text>
                <Pressable accessibilityRole="button" onPress={() => remover(m)} hitSlop={10}>
                  <Ionicons name="trash-outline" size={18} color={palette.textMuted} />
                </Pressable>
              </View>
            ))}
          </Card>
        ) : null}

        {/* ----- Receita digital ----- */}
        <Card>
          <Overline>Sua receita</Overline>
          <View style={{ height: spacing.sm }} />
          <Text style={type.bodyMuted}>
            Se a equipe te enviou a receita digital, guarde o link aqui para encontrá-la sempre.
          </Text>
          <View style={{ height: spacing.md }} />
          <TextInput
            value={profile.prescriptionUrl ?? ''}
            onChangeText={(t) => save({ prescriptionUrl: t.trim() })}
            placeholder="Cole aqui o link da receita"
            placeholderTextColor={palette.textMuted}
            style={formStyles.input}
            accessibilityLabel="Link da receita digital"
            autoCapitalize="none"
            keyboardType="url"
          />
          {profile.prescriptionUrl ? (
            <>
              <View style={{ height: spacing.md }} />
              <Button
                label="Abrir minha receita"
                icon="document-text-outline"
                variant="secondary"
                onPress={() => openLink(profile.prescriptionUrl!)}
              />
            </>
          ) : null}
        </Card>

        <Text style={styles.rodape}>
          Os lembretes são um apoio para não esquecer. Em caso de dúvida sobre dose ou horário,
          vale sempre o que está na receita e o que a equipe orientou.
        </Text>

        <Button label="Voltar" variant="ghost" onPress={() => voltar(router, '/(tabs)')} />
      </ScrollView>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Cadastro de um remédio
 * ------------------------------------------------------------------ */

const INTERVALOS = [4, 6, 8, 12, 24];
const DURACOES: (number | null)[] = [3, 5, 7, 10, null];

/** Agora, arredondado para os cinco minutos seguintes. */
const agoraRedondo = (): Date => {
  const d = new Date();
  d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5, 0, 0);
  return d;
};

function Formulario({
  inicial,
  onSalvar,
  onCancelar,
}: {
  inicial: Medication | null;
  onSalvar: (m: Medication) => void;
  onCancelar: () => void;
}) {
  const primeira = inicial ? new Date(inicial.startAt) : agoraRedondo();
  const [name, setName] = useState(inicial?.name ?? '');
  const [everyHours, setEveryHours] = useState(inicial?.everyHours ?? 8);
  const [days, setDays] = useState<number | null>(inicial?.days ?? 5);
  const [hora, setHora] = useState(String(primeira.getHours()).padStart(2, '0'));
  const [minuto, setMinuto] = useState(String(primeira.getMinutes()).padStart(2, '0'));

  const horaValida = Number(hora) >= 0 && Number(hora) <= 23 && hora.length > 0;
  const minutoValido = Number(minuto) >= 0 && Number(minuto) <= 59 && minuto.length > 0;
  const pronto = name.trim().length > 1 && horaValida && minutoValido;

  const salvar = () => {
    if (!pronto) return;
    const inicio = new Date();
    inicio.setHours(Number(hora), Number(minuto), 0, 0);
    onSalvar({
      id: inicial?.id ?? `med-${Date.now()}`,
      name: name.trim(),
      everyHours,
      days: days ?? undefined,
      startAt: inicio.toISOString(),
      takenAt: inicial?.takenAt ?? [],
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: inicial ? 'Editar remédio' : 'Novo remédio' }} />
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View>
            <Text style={styles.rotulo}>Nome do remédio</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Como está na receita — ex.: Dipirona 1g"
              placeholderTextColor={palette.textMuted}
              style={formStyles.input}
              accessibilityLabel="Nome do remédio"
              autoCapitalize="sentences"
            />
          </View>

          <View>
            <Text style={styles.rotulo}>De quantas em quantas horas</Text>
            <View style={styles.chips}>
              {INTERVALOS.map((h) => (
                <Chip
                  key={h}
                  label={h === 24 ? '1x ao dia' : `${h}h`}
                  ativo={everyHours === h}
                  onPress={() => setEveryHours(h)}
                />
              ))}
            </View>
          </View>

          <View>
            <Text style={styles.rotulo}>Primeira dose de hoje</Text>
            <View style={styles.horaLinha}>
              <TextInput
                value={hora}
                onChangeText={(t) => setHora(t.replace(/\D/g, '').slice(0, 2))}
                style={[formStyles.input, styles.horaCampo]}
                keyboardType="number-pad"
                accessibilityLabel="Hora"
                maxLength={2}
              />
              <Text style={styles.doisPontos}>:</Text>
              <TextInput
                value={minuto}
                onChangeText={(t) => setMinuto(t.replace(/\D/g, '').slice(0, 2))}
                style={[formStyles.input, styles.horaCampo]}
                keyboardType="number-pad"
                accessibilityLabel="Minuto"
                maxLength={2}
              />
            </View>
          </View>

          <View>
            <Text style={styles.rotulo}>Por quantos dias</Text>
            <View style={styles.chips}>
              {DURACOES.map((d) => (
                <Chip
                  key={String(d)}
                  label={d === null ? 'Contínuo' : `${d} dias`}
                  ativo={days === d}
                  onPress={() => setDays(d)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.rodapeBotoes}>
          <Button label="Salvar" icon="checkmark" onPress={salvar} disabled={!pronto} />
          {!pronto ? <Text style={styles.dica}>Informe o nome e um horário válido</Text> : null}
          <Button label="Cancelar" variant="ghost" onPress={onCancelar} />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

function Chip({ label, ativo, onPress }: { label: string; ativo: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: ativo }}
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.chip, ativo && styles.chipAtivo]}
    >
      <Text style={[styles.chipTexto, ativo && { color: palette.textOnTiffany }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  linhaTopo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  nome: { fontSize: 16, fontWeight: '700', color: palette.text },
  encerrado: { flex: 1, color: palette.textMuted, textDecorationLine: 'line-through' },
  doses: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  dose: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    backgroundColor: palette.surfaceAlt,
  },
  doseTomada: { backgroundColor: palette.tiffany, borderColor: palette.tiffany },
  doseHora: { fontSize: 14, fontWeight: '600', color: palette.text },
  aviso: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    backgroundColor: palette.attentionBg,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  avisoTexto: { flex: 1, fontSize: 13.5, lineHeight: 20, color: palette.attention, fontWeight: '600' },
  rotulo: {
    ...type.small,
    marginBottom: 6,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  chipAtivo: { backgroundColor: palette.tiffany, borderColor: palette.tiffany },
  chipTexto: { fontSize: 14, fontWeight: '600', color: palette.text },
  horaLinha: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  horaCampo: { width: 78, textAlign: 'center', fontSize: 20, fontWeight: '600' },
  doisPontos: { fontSize: 22, fontWeight: '700', color: palette.textMuted },
  rodape: { ...type.small, textAlign: 'center', paddingHorizontal: spacing.md },
  rodapeBotoes: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
    backgroundColor: palette.bg,
  },
  dica: { ...type.small, textAlign: 'center' },
});

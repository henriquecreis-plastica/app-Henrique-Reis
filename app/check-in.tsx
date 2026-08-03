import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button, Card, Overline } from '../src/components/ui';
import { procedureById } from '../src/data/procedures';
import { symptoms } from '../src/data/symptoms';
import { feelingLabels, todayIso, type Feeling } from '../src/domain/checkin';
import { usePatient } from '../src/store/patient';
import { storage } from '../src/store/storage';
import { palette, radius, severity, spacing, type } from '../src/theme';

/**
 * Registro do dia: foto, como a paciente está e o que ela quer relatar.
 *
 * A ordem das perguntas é intencional. A foto vem primeiro porque é a parte
 * concreta; "como você está" logo depois, enquanto ela ainda está atenta; a
 * lista de sintomas por último, opcional, para não sugerir que ela deveria
 * estar sentindo aquilo tudo.
 */
export default function CheckIn() {
  const router = useRouter();
  const { profile, postOpDay, saveCheckIn } = usePatient();
  const procedure = procedureById(profile.procedure);

  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [pain, setPain] = useState<number | null>(null);
  const [reported, setReported] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  /** Sintomas que a paciente pode marcar — só os que se aplicam ao caso dela. */
  const marcaveis = symptoms
    .filter(
      (s) =>
        s.severity !== 'normal' &&
        (!s.kinds || s.kinds.includes(procedure.kind)) &&
        (!s.procedures || s.procedures.includes(profile.procedure)),
    )
    .slice(0, 12);

  const pick = async (from: 'camera' | 'galeria') => {
    const permission =
      from === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permissão necessária',
        from === 'camera'
          ? 'Autorize o acesso à câmera nas configurações do aparelho para registrar a foto.'
          : 'Autorize o acesso às fotos nas configurações do aparelho.',
      );
      return;
    }

    const result =
      from === 'camera'
        ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });

    if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
  };

  const submit = async () => {
    if (!feeling) return;
    setSaving(true);
    try {
      const stored = photoUri ? await storage.putPhoto(photoUri) : undefined;
      await saveCheckIn({
        date: todayIso(),
        day: postOpDay,
        feeling,
        pain: pain ?? undefined,
        reportedSymptomIds: reported,
        photoUri: stored,
        note: note.trim() || undefined,
        createdAt: new Date().toISOString(),
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={type.bodyMuted}>
          {postOpDay}º dia · {procedure.name}
        </Text>

        {/* ----- Foto ----- */}
        <Card>
          <Overline>Foto de hoje</Overline>
          <Text style={[type.small, styles.help]}>
            Boa luz, mesma distância e mesmo ângulo todos os dias. É o que permite comparar a
            evolução.
          </Text>

          {photoUri ? (
            <View style={styles.previewBox}>
              <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="cover" />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Remover foto"
                onPress={() => setPhotoUri(undefined)}
                style={styles.removePhoto}
                hitSlop={8}
              >
                <Ionicons name="close" size={16} color={palette.white} />
              </Pressable>
            </View>
          ) : null}

          <View style={styles.photoActions}>
            <Button
              label={photoUri ? 'Refazer' : 'Tirar foto'}
              icon="camera-outline"
              variant="secondary"
              onPress={() => pick('camera')}
              style={styles.flex}
            />
            <Button
              label="Da galeria"
              icon="images-outline"
              variant="secondary"
              onPress={() => pick('galeria')}
              style={styles.flex}
            />
          </View>
        </Card>

        {/* ----- Como está ----- */}
        <Card>
          <Overline>Como você está hoje?</Overline>
          <View style={styles.feelings}>
            {(['bem', 'mais_ou_menos', 'preocupada'] as Feeling[]).map((f) => {
              const on = feeling === f;
              return (
                <Pressable
                  key={f}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  onPress={() => setFeeling(f)}
                  style={({ pressed }) => [
                    styles.feeling,
                    on && styles.feelingOn,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Ionicons
                    name={
                      f === 'bem'
                        ? 'happy-outline'
                        : f === 'mais_ou_menos'
                          ? 'remove-circle-outline'
                          : 'sad-outline'
                    }
                    size={22}
                    color={on ? palette.textOnTiffany : palette.textMuted}
                  />
                  <Text style={[styles.feelingText, on && { color: palette.textOnTiffany }]}>
                    {feelingLabels[f]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* ----- Dor ----- */}
        <Card>
          <Overline>Sua dor hoje, de 0 a 10</Overline>
          <Text style={[type.small, styles.help]}>0 é sem dor, 10 é a pior dor imaginável.</Text>
          <View style={styles.painRow}>
            {Array.from({ length: 11 }, (_, i) => i).map((n) => {
              const on = pain === n;
              return (
                <Pressable
                  key={n}
                  accessibilityRole="radio"
                  accessibilityLabel={`Dor ${n}`}
                  accessibilityState={{ selected: on }}
                  onPress={() => setPain(n)}
                  style={({ pressed }) => [
                    styles.painDot,
                    on && styles.painDotOn,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={[styles.painText, on && { color: palette.textOnTiffany }]}>{n}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* ----- Sintomas ----- */}
        <Card>
          <Overline>Está sentindo algo disto?</Overline>
          <Text style={[type.small, styles.help]}>
            Opcional. Marque só o que estiver acontecendo com você.
          </Text>
          <View style={styles.symptoms}>
            {marcaveis.map((s) => {
              const on = reported.includes(s.id);
              const cor = severity[s.severity];
              return (
                <Pressable
                  key={s.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  onPress={() =>
                    setReported((prev) =>
                      prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id],
                    )
                  }
                  style={({ pressed }) => [
                    styles.symptom,
                    on && { backgroundColor: cor.bg, borderColor: cor.color },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Ionicons
                    name={on ? 'checkbox' : 'square-outline'}
                    size={18}
                    color={on ? cor.color : palette.border}
                  />
                  <Text style={[type.body, styles.flex]}>{s.title}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* ----- Observação ----- */}
        <Card>
          <Overline>Quer contar mais alguma coisa?</Overline>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Opcional"
            placeholderTextColor={palette.textMuted}
            multiline
            style={styles.noteInput}
            accessibilityLabel="Observação"
          />
        </Card>

        <Text style={styles.footnote}>
          Este registro fica no seu aparelho. Se algo estiver preocupando você, não espere o
          retorno — fale com a equipe.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={saving ? 'Salvando...' : 'Enviar registro de hoje'}
          icon="checkmark"
          onPress={submit}
          disabled={!feeling || saving}
        />
        {!feeling ? <Text style={styles.hint}>Responda como você está hoje</Text> : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  flex: { flex: 1 },
  help: { marginTop: spacing.xs, marginBottom: spacing.md },
  previewBox: { marginBottom: spacing.md },
  preview: { width: '100%', height: 220, borderRadius: radius.md, backgroundColor: palette.surfaceAlt },
  removePhoto: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(17,17,17,0.72)',
    borderRadius: radius.pill,
    padding: 6,
  },
  photoActions: { flexDirection: 'row', gap: spacing.sm },
  feelings: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  feeling: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  feelingOn: { backgroundColor: palette.tiffany, borderColor: palette.tiffany },
  feelingText: { fontSize: 12.5, fontWeight: '600', color: palette.textMuted, textAlign: 'center' },
  painRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  painDot: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  painDotOn: { backgroundColor: palette.tiffany, borderColor: palette.tiffany },
  painText: { fontSize: 14, fontWeight: '700', color: palette.textMuted },
  symptoms: { gap: spacing.sm },
  symptom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  noteInput: {
    marginTop: spacing.md,
    minHeight: 88,
    textAlignVertical: 'top',
    backgroundColor: palette.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 15,
    color: palette.text,
  },
  footnote: { ...type.small, textAlign: 'center', paddingHorizontal: spacing.md },
  footer: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
    backgroundColor: palette.bg,
  },
  hint: { ...type.small, textAlign: 'center' },
});

import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Button, Card, Divider, Overline } from '../src/components/ui';
import { lembretesDisponiveis, pedirPermissao } from '../src/lib/lembretes';
import { voltar } from '../src/lib/navegar';
import { dataPorExtenso, retornosMarcados } from '../src/lib/retorno';
import { usePatient } from '../src/store/patient';
import { clinic, palette, radius, spacing, type } from '../src/theme';

/**
 * Lembretes de retorno.
 *
 * A tela existe antes de o primeiro aviso existir: a paciente vê a lista
 * inteira, com as datas, e só então decide. É exigência das duas lojas para
 * qualquer aviso que parta da clínica e não do tratamento — e é o mínimo, já
 * que alguns deles chegam daqui a dois anos.
 */
export default function Retornos() {
  const router = useRouter();
  const { profile, procedureIds, retornosAtivos, setRetornosAtivos } = usePatient();
  const [salvando, setSalvando] = useState(false);

  const marcados = useMemo(
    () => retornosMarcados(procedureIds, profile.surgeryDate),
    [procedureIds, profile.surgeryDate],
  );
  const futuros = marcados.filter((m) => !m.vencido);

  const alternar = async (ligar: boolean) => {
    setSalvando(true);
    try {
      /* A permissão do sistema é pedida no momento em que ela liga, e não na
         abertura do app: pedir antes de haver o que avisar é o pedido que se
         recusa por reflexo. */
      if (ligar && lembretesDisponiveis) await pedirPermissao();
      await setRetornosAtivos(ligar);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Lembretes de retorno' }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
        <Text style={type.bodyMuted}>
          Todo procedimento tem um prazo em que vale reavaliar. Se você quiser, o aplicativo guarda
          essas datas e avisa quando chegarem — para você conversar com a nossa equipe, se fizer
          sentido para você naquele momento.
        </Text>

        <Card>
          <View style={styles.linhaSwitch}>
            <View style={styles.flex}>
              <Text style={type.body}>Quero receber os lembretes</Text>
              <Text style={[type.small, styles.hint]}>
                Você pode desligar quando quiser, aqui mesmo.
              </Text>
            </View>
            <Switch
              value={retornosAtivos}
              onValueChange={alternar}
              disabled={salvando}
              trackColor={{ true: palette.primary }}
            />
          </View>

          <Divider />

          <View style={styles.aviso}>
            <Ionicons name="lock-closed-outline" size={15} color={palette.textMuted} />
            <Text style={[type.small, styles.flex]}>
              Os lembretes são marcados no seu próprio aparelho. A clínica não recebe nada, e o
              aplicativo continua sem enviar seus dados para lugar nenhum.
            </Text>
          </View>
        </Card>

        {!lembretesDisponiveis ? (
          <Card style={styles.nota}>
            <Text style={type.small}>
              No navegador os avisos não tocam. No aplicativo instalado, sim.
            </Text>
          </Card>
        ) : null}

        {futuros.length ? (
          <Card>
            <Overline>O que você vai receber</Overline>
            <View style={styles.lista}>
              {futuros.map(({ retorno, quando }) => (
                <View key={retorno.id} style={styles.item}>
                  <Text style={styles.data}>{dataPorExtenso(quando)}</Text>
                  <Text style={type.body}>{retorno.title}</Text>
                  <Text style={[type.small, styles.hint]}>{retorno.body}</Text>
                  <Text style={[type.small, styles.porque]}>{retorno.porque}</Text>
                </View>
              ))}
            </View>
          </Card>
        ) : (
          <Card>
            <Text style={type.small}>
              Não há datas futuras para o seu procedimento. Se quiser conversar sobre qualquer
              coisa, fale com a equipe pelo WhatsApp — {clinic.phoneLabel}.
            </Text>
          </Card>
        )}

        <Text style={styles.rodape}>
          Nenhum lembrete substitui uma consulta. A indicação de qualquer novo procedimento depende
          de avaliação médica.
        </Text>

        <Button label="Voltar" variant="ghost" onPress={() => voltar(router, '/(tabs)/contato')} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  flex: { flex: 1 },
  linhaSwitch: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  hint: { marginTop: 2 },
  aviso: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  nota: { backgroundColor: palette.surfaceAlt },
  lista: { marginTop: spacing.md, gap: spacing.lg },
  item: { gap: 3 },
  data: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: palette.accentInk,
  },
  porque: { color: palette.textMuted, fontStyle: 'italic' },
  rodape: { ...type.small, textAlign: 'center', paddingHorizontal: spacing.md, lineHeight: 19 },
});

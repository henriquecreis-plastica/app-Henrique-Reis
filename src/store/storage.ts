import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ProcedureId } from '../data/procedures';

/**
 * Fronteira entre o app e onde os dados moram.
 *
 * Hoje existe uma implementação só, que grava no aparelho — e é assim que o
 * app vai para as lojas: nada sai do celular da paciente. Se um dia houver
 * servidor, entra uma segunda implementação desta mesma interface e nenhuma
 * tela precisa mudar.
 *
 * Por isso os métodos são assíncronos mesmo sendo locais: a assinatura já é a
 * de uma chamada de rede.
 */

/**
 * Um remédio da prescrição, como a paciente o cadastrou.
 *
 * O app não lê receita: quem digita é ela ou a equipe, na alta. Um remédio
 * lido errado de um PDF geraria lembrete em horário errado, e aqui o erro
 * silencioso tem consequência clínica.
 */
export interface Medication {
  id: string;
  /** "Dipirona 1g", "Cefalexina 500mg" — como está na receita. */
  name: string;
  /** Intervalo entre doses, em horas. */
  everyHours: number;
  /** Data e hora da primeira dose, em ISO local. */
  startAt: string;
  /** Por quantos dias tomar. Ausente = uso contínuo, sem data para parar. */
  days?: number;
  /** Horários de doses já tomadas, em ISO. */
  takenAt: string[];
}

export interface PatientRecord {
  name: string;
  /**
   * O procedimento principal. Continua existindo, e é sempre o primeiro da
   * lista, para que um registro gravado antes da cirurgia combinada continue
   * abrindo sem migração.
   */
  procedure: ProcedureId;
  /**
   * Todos os procedimentos do mesmo tempo cirúrgico. Ausente nos registros
   * antigos, quando equivale a `[procedure]`.
   */
  procedures?: ProcedureId[];
  surgeryDate: string;
  doneTasks: string[];
  onboarded: boolean;
  reviewDismissed: boolean;
  /**
   * Data e hora em que a paciente confirmou ter lido as orientações de uso.
   * Guardar o momento, e não só um sim, é o que permite pedir um novo aceite
   * caso o texto mude — e deixa registro de qual versão ela viu.
   */
  termsAcceptedAt?: string;
  /** Os remédios cadastrados, com os horários de cada um. */
  medications?: Medication[];
  /**
   * Endereço da receita digital. O app guarda o link e o abre; não lê o
   * conteúdo nem o envia para lugar nenhum.
   */
  prescriptionUrl?: string;
}

export interface PatientStorage {
  load(): Promise<PatientRecord | null>;
  save(record: PatientRecord): Promise<void>;
  clear(): Promise<void>;
}

const KEY = '@plasticahenrique/patient-v2';

export class LocalPatientStorage implements PatientStorage {
  async load(): Promise<PatientRecord | null> {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as PatientRecord) : null;
    } catch {
      // Registro corrompido: o app segue com o padrão e refaz o cadastro.
      return null;
    }
  }

  async save(record: PatientRecord): Promise<void> {
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(record));
    } catch {
      // Falha de escrita não deve interromper o uso do app.
    }
  }

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(KEY).catch(() => {});
  }
}

export const storage: PatientStorage = new LocalPatientStorage();

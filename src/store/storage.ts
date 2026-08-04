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

export interface PatientRecord {
  name: string;
  procedure: ProcedureId;
  surgeryDate: string;
  doneTasks: string[];
  onboarded: boolean;
  reviewDismissed: boolean;
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

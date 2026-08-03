import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CheckIn } from '../domain/checkin';
import type { ProcedureId } from '../data/procedures';

/**
 * Fronteira entre o app e onde os dados moram.
 *
 * Hoje existe uma implementação só, que grava no aparelho. Quando houver
 * servidor e painel da equipe, entra uma segunda implementação desta mesma
 * interface e nenhuma tela precisa mudar — é o ponto de troca.
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
  checkIns: CheckIn[];
}

export interface PatientStorage {
  load(): Promise<PatientRecord | null>;
  save(record: PatientRecord): Promise<void>;
  clear(): Promise<void>;
  /**
   * Envia a foto e devolve a referência a ser guardada no registro.
   *
   * Local: devolve o próprio URI do arquivo no aparelho.
   * Remoto: subiria o arquivo e devolveria a chave no armazenamento.
   */
  putPhoto(localUri: string): Promise<string>;
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

  async putPhoto(localUri: string): Promise<string> {
    // No aparelho a foto já está onde precisa estar.
    return localUri;
  }
}

/**
 * Esqueleto da implementação com servidor, para deixar explícito o que muda.
 * Não é usada — existe como contrato do que a próxima etapa precisa entregar.
 *
 * ```ts
 * export class RemotePatientStorage implements PatientStorage {
 *   constructor(private api: ApiClient, private patientId: string) {}
 *   load()  { return this.api.get(`/pacientes/${this.patientId}`); }
 *   save(r) { return this.api.put(`/pacientes/${this.patientId}`, r); }
 *   clear() { return this.api.delete(`/pacientes/${this.patientId}`); }
 *   async putPhoto(uri: string) {
 *     const { uploadUrl, key } = await this.api.post('/fotos/upload-url');
 *     await this.api.upload(uploadUrl, uri);   // envio direto ao armazenamento
 *     return key;                              // o registro guarda a chave
 *   }
 * }
 * ```
 */
export const storage: PatientStorage = new LocalPatientStorage();

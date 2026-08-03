import type { ProcedureKind } from '../data/procedures';

/**
 * Registro diário da paciente. É a unidade de informação que faz o app deixar
 * de ser um manual e virar acompanhamento: sem ela, a clínica não tem o que
 * olhar.
 *
 * Neste protótipo o registro fica no aparelho. O formato já é o que seria
 * enviado ao servidor — por isso os campos são serializáveis e a foto é
 * referenciada por URI, não embutida.
 */
export interface CheckIn {
  /** Data do registro em ISO (YYYY-MM-DD). Uma por dia. */
  date: string;
  /** Dia de pós-operatório em que o registro foi feito. */
  day: number;
  /** Como a paciente respondeu à pergunta do dia. */
  feeling: Feeling;
  /** Dor de 0 a 10, quando informada. */
  pain?: number;
  /** Sintomas que ela marcou, por id de `symptoms`. */
  reportedSymptomIds: string[];
  /** URI local da foto. No servidor viraria a chave do arquivo armazenado. */
  photoUri?: string;
  /** Observação livre da paciente. */
  note?: string;
  /** Momento do registro, em ISO completo. */
  createdAt: string;
}

export type Feeling = 'bem' | 'mais_ou_menos' | 'preocupada';

export const feelingLabels: Record<Feeling, string> = {
  bem: 'Bem',
  mais_ou_menos: 'Mais ou menos',
  preocupada: 'Preocupada',
};

/**
 * Até quando o registro diário é cobrado.
 *
 * Cobrar foto todo dia para sempre faria o painel encher de pendências
 * irrelevantes e a paciente desistir. A janela cobre o período em que uma
 * intercorrência ainda muda a conduta.
 */
export function checkInWindow(kind: ProcedureKind): number {
  return kind === 'ambulatorial' ? 7 : 14;
}

export function expectsCheckIn(day: number, kind: ProcedureKind): boolean {
  return day >= 0 && day <= checkInWindow(kind);
}

export const todayIso = (): string => new Date().toISOString().slice(0, 10);

export const checkInFor = (checkIns: CheckIn[], date: string): CheckIn | undefined =>
  checkIns.find((c) => c.date === date);

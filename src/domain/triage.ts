import { symptomById } from '../data/symptoms';
import type { ProcedureKind } from '../data/procedures';
import { checkInFor, expectsCheckIn, todayIso, type CheckIn } from './checkin';

/**
 * Triagem — o cérebro compartilhado entre o app e o painel da equipe.
 *
 * Fica aqui, e não no painel, por um motivo prático: se a regra viver em dois
 * lugares, um dia eles divergem, e a paciente vê "esperado" no celular
 * enquanto a clínica vê vermelho na tela. Uma função só, um resultado só.
 *
 * A regra é deliberadamente conservadora. Num painel clínico, o erro caro é o
 * falso negativo: um vermelho a mais custa um telefonema, um vermelho a menos
 * custa uma intercorrência não vista.
 */

export type TriageLevel = 'vermelho' | 'amarelo' | 'verde';

export type TriageReasonCode =
  | 'sintoma_urgente'
  | 'paciente_preocupada'
  | 'dor_alta'
  | 'dor_crescente'
  | 'sintoma_atencao'
  | 'sem_registro_hoje'
  | 'sem_registro_ha_dias'
  | 'em_dia';

export interface TriageReason {
  code: TriageReasonCode;
  /** Frase pronta para a equipe ler no painel. */
  label: string;
}

export interface TriageResult {
  level: TriageLevel;
  reasons: TriageReason[];
  /** Frase única para a linha da lista. */
  headline: string;
}

export interface TriageInput {
  procedureKind: ProcedureKind;
  /** Dia de pós-operatório hoje. */
  day: number;
  checkIns: CheckIn[];
  /** Permite fixar a data nos testes e no painel de demonstração. */
  today?: string;
}

/** Dor a partir da qual o caso sobe para vermelho. */
const DOR_ALTA = 8;
/** Aumento de dor entre registros consecutivos que liga o amarelo. */
const SALTO_DE_DOR = 3;

export function triage({
  procedureKind,
  day,
  checkIns,
  today = todayIso(),
}: TriageInput): TriageResult {
  const reasons: TriageReason[] = [];
  const ordered = [...checkIns].sort((a, b) => a.date.localeCompare(b.date));
  const recentes = ordered.filter((c) => diffDays(c.date, today) <= 2);

  // --- Vermelho ---
  const urgentes = recentes.flatMap((c) =>
    c.reportedSymptomIds
      .map((id) => symptomById(id))
      .filter((s) => s?.severity === 'urgent')
      .map((s) => s!.title),
  );
  if (urgentes.length) {
    reasons.push({
      code: 'sintoma_urgente',
      label: `Relatou: ${[...new Set(urgentes)].join(' · ')}`,
    });
  }

  if (recentes.some((c) => c.feeling === 'preocupada')) {
    reasons.push({ code: 'paciente_preocupada', label: 'Respondeu que está preocupada' });
  }

  const dorAlta = recentes.find((c) => (c.pain ?? 0) >= DOR_ALTA);
  if (dorAlta) {
    reasons.push({ code: 'dor_alta', label: `Dor ${dorAlta.pain} de 10` });
  }

  // --- Amarelo ---
  const atencao = recentes.flatMap((c) =>
    c.reportedSymptomIds
      .map((id) => symptomById(id))
      .filter((s) => s?.severity === 'attention')
      .map((s) => s!.title),
  );
  if (atencao.length) {
    reasons.push({
      code: 'sintoma_atencao',
      label: `Relatou: ${[...new Set(atencao)].join(' · ')}`,
    });
  }

  const crescente = dorEmAlta(ordered);
  if (crescente) {
    reasons.push({
      code: 'dor_crescente',
      label: `Dor subiu de ${crescente.de} para ${crescente.para}`,
    });
  }

  if (expectsCheckIn(day, procedureKind)) {
    const ultimo = ordered[ordered.length - 1];
    const diasSemRegistro = ultimo ? diffDays(ultimo.date, today) : day + 1;
    if (!checkInFor(ordered, today)) {
      reasons.push(
        diasSemRegistro >= 2
          ? {
              code: 'sem_registro_ha_dias',
              label: `Sem registro há ${diasSemRegistro} dias`,
            }
          : { code: 'sem_registro_hoje', label: 'Ainda não enviou a foto de hoje' },
      );
    }
  }

  const level: TriageLevel = reasons.some((r) => VERMELHOS.has(r.code))
    ? 'vermelho'
    : reasons.length
      ? 'amarelo'
      : 'verde';

  if (level === 'verde') {
    reasons.push({ code: 'em_dia', label: 'Evoluindo dentro do esperado' });
  }

  return { level, reasons, headline: ordenar(reasons, level)[0].label };
}

const VERMELHOS = new Set<TriageReasonCode>([
  'sintoma_urgente',
  'paciente_preocupada',
  'dor_alta',
]);

/** O motivo mais grave primeiro — é o que a equipe lê na linha da lista. */
function ordenar(reasons: TriageReason[], level: TriageLevel): TriageReason[] {
  const peso: Record<TriageReasonCode, number> = {
    sintoma_urgente: 0,
    dor_alta: 1,
    paciente_preocupada: 2,
    sintoma_atencao: 3,
    dor_crescente: 4,
    sem_registro_ha_dias: 5,
    sem_registro_hoje: 6,
    em_dia: 7,
  };
  const lista = level === 'verde' ? reasons : reasons.filter((r) => r.code !== 'em_dia');
  return [...lista].sort((a, b) => peso[a.code] - peso[b.code]);
}

/** Dor que subiu de forma relevante entre os dois últimos registros. */
function dorEmAlta(ordered: CheckIn[]): { de: number; para: number } | null {
  const comDor = ordered.filter((c) => typeof c.pain === 'number');
  if (comDor.length < 2) return null;
  const [anterior, ultimo] = comDor.slice(-2);
  const de = anterior.pain!;
  const para = ultimo.pain!;
  return para - de >= SALTO_DE_DOR ? { de, para } : null;
}

function diffDays(from: string, to: string): number {
  return Math.round(
    (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000,
  );
}

export const triageColors: Record<TriageLevel, { label: string; emoji: string }> = {
  vermelho: { label: 'Requer contato', emoji: '🔴' },
  amarelo: { label: 'Acompanhar', emoji: '🟡' },
  verde: { label: 'Em dia', emoji: '🟢' },
};

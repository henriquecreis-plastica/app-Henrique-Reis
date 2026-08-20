import { retornosFor, type Retorno } from '../data/retornos';
import type { ProcedureId } from '../data/procedures';
import type { Aviso } from './lembretes';

/**
 * Quando cada lembrete de retorno cai, a partir da data do procedimento.
 *
 * Separado do conteúdo de propósito: a tela precisa mostrar as datas antes de
 * a paciente aceitar — aceitar sem saber o que vai chegar não é aceitar.
 */

/** Horário do aviso. De manhã, num horário em que a clínica atende. */
const HORA = 10;

export interface RetornoMarcado {
  retorno: Retorno;
  quando: Date;
  /** Já passou: a paciente instalou o app depois da data, ou faz tempo. */
  vencido: boolean;
}

/** A data em que um aviso cai, considerando o dia do procedimento. */
function dataDe(isoDate: string, afterDays: number): Date {
  const [y, m, d] = isoDate.split('-').map(Number);
  const quando = new Date(y ?? 2000, (m ?? 1) - 1, d ?? 1);
  quando.setDate(quando.getDate() + afterDays);
  quando.setHours(HORA, 0, 0, 0);
  return quando;
}

/** Todos os retornos dos procedimentos dela, em ordem de data. */
export function retornosMarcados(ids: ProcedureId[], surgeryDate: string): RetornoMarcado[] {
  const agora = Date.now();
  return retornosFor(ids)
    .map((retorno) => {
      const quando = dataDe(surgeryDate, retorno.afterDays);
      return { retorno, quando, vencido: quando.getTime() <= agora };
    })
    .sort((a, b) => a.quando.getTime() - b.quando.getTime());
}

/**
 * Os avisos a agendar no aparelho.
 *
 * Só os que ainda estão por vir: disparar hoje o lembrete de um ano que passou
 * há três meses não é lembrete, é engano — e chegaria todos de uma vez para
 * quem instalou o app tarde.
 */
export function avisosDeRetorno(ativo: boolean, ids: ProcedureId[], surgeryDate: string): Aviso[] {
  if (!ativo) return [];
  return retornosMarcados(ids, surgeryDate)
    .filter((m) => !m.vencido)
    .map(({ retorno, quando }) => ({
      id: retorno.id,
      quando,
      title: retorno.title,
      body: retorno.body,
    }));
}

/** "12 de março de 2027" — como a data aparece na lista. */
export function dataPorExtenso(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

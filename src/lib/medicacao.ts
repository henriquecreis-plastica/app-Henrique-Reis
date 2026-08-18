import type { Medication } from '../store/storage';

/**
 * Os horários de um remédio e o agendamento dos lembretes.
 *
 * Tudo aqui é cálculo puro sobre o que a paciente cadastrou. O app não lê
 * receita nem consulta serviço nenhum: um horário errado, deduzido de um PDF,
 * viraria um lembrete errado, e esse é um erro que ninguém percebe até a dose
 * ser tomada fora de hora.
 */

const HORA = 3_600_000;

/** Todas as doses previstas para o remédio, da primeira à última. */
export const doses = (m: Medication): Date[] => {
  const inicio = new Date(m.startAt).getTime();
  if (!Number.isFinite(inicio) || m.everyHours <= 0) return [];
  /* Sem data para parar, projeta trinta dias: é o bastante para a tela e para
     a fila de lembretes, e evita gerar lista infinita de uso contínuo. */
  const totalHoras = (m.days ?? 30) * 24;
  const quantas = Math.max(1, Math.ceil(totalHoras / m.everyHours));
  return Array.from({ length: quantas }, (_, i) => new Date(inicio + i * m.everyHours * HORA));
};

const mesmoInstante = (a: Date, b: string) => Math.abs(a.getTime() - new Date(b).getTime()) < 60_000;

/** Se aquela dose já foi marcada como tomada. */
export const foiTomada = (m: Medication, dose: Date): boolean =>
  m.takenAt.some((t) => mesmoInstante(dose, t));

/** As doses de hoje, na ordem. */
export const dosesDeHoje = (m: Medication): Date[] => {
  const hoje = new Date().toDateString();
  return doses(m).filter((d) => d.toDateString() === hoje);
};

/** A próxima dose ainda não tomada, de todos os remédios. */
export const proximaDose = (
  meds: Medication[],
  agora = new Date(),
): { med: Medication; quando: Date } | null => {
  const candidatas = meds.flatMap((m) =>
    doses(m)
      .filter((d) => d.getTime() >= agora.getTime() - 30 * 60_000 && !foiTomada(m, d))
      .slice(0, 1)
      .map((quando) => ({ med: m, quando })),
  );
  return candidatas.sort((a, b) => a.quando.getTime() - b.quando.getTime())[0] ?? null;
};

/** O dia em que o remédio termina, ou `null` no uso contínuo. */
export const terminaEm = (m: Medication): Date | null => {
  if (!m.days) return null;
  const fim = new Date(m.startAt);
  fim.setDate(fim.getDate() + m.days);
  return fim;
};

/** Se o tratamento com aquele remédio já acabou. */
export const encerrado = (m: Medication, agora = new Date()): boolean => {
  const fim = terminaEm(m);
  return !!fim && fim.getTime() < agora.getTime();
};

export const horaCurta = (d: Date): string =>
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

/** "a cada 8 horas · por 5 dias" — como a paciente lê o esquema. */
export const resumoEsquema = (m: Medication): string => {
  const intervalo = m.everyHours === 24 ? '1 vez ao dia' : `a cada ${m.everyHours} horas`;
  return m.days ? `${intervalo} · por ${m.days} ${m.days === 1 ? 'dia' : 'dias'}` : `${intervalo} · uso contínuo`;
};

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
  /* Remédio de alívio não tem hora marcada: quem decide é o sintoma. */
  if (m.asNeeded) return [];
  const inicio = new Date(m.startAt);
  if (!Number.isFinite(inicio.getTime())) return [];
  /* Sem data para parar, projeta trinta dias: é o bastante para a tela e para
     a fila de lembretes, e evita gerar lista infinita de uso contínuo. */
  const dias = m.days ?? 30;

  /* Prescrito por horários do dia — "4 vezes ao dia" — em vez de intervalo. */
  if (m.timesOfDay?.length) {
    const lista: Date[] = [];
    for (let d = 0; d < dias; d++) {
      for (const hhmm of m.timesOfDay) {
        const [h, min] = hhmm.split(':').map(Number);
        if (!Number.isFinite(h) || !Number.isFinite(min)) continue;
        const dose = new Date(inicio);
        dose.setDate(inicio.getDate() + d);
        dose.setHours(h, min, 0, 0);
        lista.push(dose);
      }
    }
    return lista.sort((a, b) => a.getTime() - b.getTime());
  }

  if (m.everyHours <= 0) return [];
  const quantas = Math.max(1, Math.ceil((dias * 24) / m.everyHours));
  return Array.from(
    { length: quantas },
    (_, i) => new Date(inicio.getTime() + i * m.everyHours * HORA),
  );
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

/* ------------------------------------------------------------------ *
 * Remédios de alívio
 *
 * Para eles a pergunta da paciente não é "quando devo tomar" — é "já posso
 * tomar de novo?". Com dor, e sem saber a resposta, ou ela toma antes da hora
 * ou aguenta mais do que precisaria.
 * ------------------------------------------------------------------ */

/** A última dose registrada, ou `null` se ainda não tomou nenhuma. */
export const ultimaDose = (m: Medication): Date | null => {
  const marcos = m.takenAt.map((t) => new Date(t).getTime()).filter(Number.isFinite);
  return marcos.length ? new Date(Math.max(...marcos)) : null;
};

/** A partir de quando ela pode repetir. `null` quando ainda não tomou nenhuma. */
export const liberadaEm = (m: Medication): Date | null => {
  const ultima = ultimaDose(m);
  return ultima ? new Date(ultima.getTime() + m.everyHours * HORA) : null;
};

/** Se já passou o intervalo mínimo desde a última dose. */
export const podeTomar = (m: Medication, agora = new Date()): boolean => {
  const liberada = liberadaEm(m);
  return !liberada || liberada.getTime() <= agora.getTime();
};

/** Registra que ela tomou uma dose agora. */
export const registrarDose = (m: Medication, quando = new Date()): Medication => ({
  ...m,
  takenAt: [...m.takenAt, quando.toISOString()],
});

/** "a cada 8 horas · por 5 dias" — como a paciente lê o esquema. */
export const resumoEsquema = (m: Medication): string => {
  const prazo = m.days ? `por ${m.days} ${m.days === 1 ? 'dia' : 'dias'}` : 'uso contínuo';
  const semAlarme = m.silent ? ' · sem alarme' : '';
  if (m.timesOfDay?.length && !m.asNeeded) {
    const n = m.timesOfDay.length;
    const quantas = n === 1 ? '1 vez ao dia' : `${n} vezes ao dia`;
    return `${quantas} · ${m.timesOfDay.join(', ')} · ${prazo}${semAlarme}`;
  }
  const intervalo = m.everyHours === 24 ? '1 vez ao dia' : `a cada ${m.everyHours} horas`;
  if (m.asNeeded) {
    const minimo =
      m.everyHours === 24
        ? 'no máximo 1 vez ao dia'
        : `no mínimo ${m.everyHours} horas entre as doses`;
    return m.days ? `Se precisar · ${minimo} · por até ${m.days} dias` : `Se precisar · ${minimo}`;
  }
  return m.days ? `${intervalo} · por ${m.days} ${m.days === 1 ? 'dia' : 'dias'}` : `${intervalo} · uso contínuo`;
};

import type { ProcedureId } from './procedures';

/**
 * As prescrições padrão da clínica.
 *
 * A paciente sai da cirurgia com uma receita de dez ou doze itens. Cadastrar
 * um por um, anestesiada e com dor, é pedir para ela desistir no terceiro. Aqui
 * ela escolhe a prescrição do procedimento dela, confere a lista e confirma.
 *
 * O que o app cria é sempre o que o cirurgião prescreveu — mas continua sendo
 * ela quem confirma, e ela pode desmarcar o que não recebeu ou não comprou.
 */

export interface PrescriptionItem {
  /** Como está na receita. */
  name: string;
  /**
   * Intervalo em horas. Nos de horário fixo é quando tomar; nos de alívio, o
   * mínimo entre uma dose e a seguinte.
   */
  everyHours: number;
  /** Só quando há sintoma — dor, constipação. Não gera alarme. */
  asNeeded?: true;
  /** Por quantos dias. Ausente = uso contínuo. */
  days?: number;
  /** Hora sugerida da primeira dose, em "HH:MM". */
  suggestedTime?: string;
  /**
   * Horários fixos do dia, para o que é prescrito como "4 vezes ao dia". Manda
   * sobre `everyHours` — e é o que evita agendar lavagem nasal às 2 da manhã.
   */
  timesOfDay?: string[];
  /**
   * Começa só depois de tantos dias de pós-operatório — o que espera a
   * retirada dos pontos ou do taping.
   */
  startsAfterDays?: number;
  /** A orientação da receita, mostrada na conferência. */
  note?: string;
}

export interface Prescription {
  id: string;
  title: string;
  procedures: ProcedureId[];
  items: PrescriptionItem[];
}

export const prescriptions: Prescription[] = [
  {
    id: 'face-hd',
    title: 'Prescrição padrão — Face HD Concept',
    procedures: ['face_hd'],
    items: [
      /* ---- dor: nada dispara sozinho, e o app informa quando libera ---- */
      {
        name: 'Novalgina 1g (Dipirona)',
        everyHours: 6,
        asNeeded: true,
        note: 'Tomar 1 comprimido de 6/6h se dor',
      },
      {
        name: 'Toragesic 10mg (sublingual)',
        everyHours: 8,
        asNeeded: true,
        days: 4,
        note: 'Aplicar 1 comprimido embaixo da língua até de 8/8h, se dor forte, por até 4 dias',
      },
      {
        name: 'Paco (Paracetamol + codeína)',
        everyHours: 6,
        asNeeded: true,
        note: 'Tomar 1 comprimido a cada 6 horas, se dor muito forte',
      },
      {
        name: 'Tamarine',
        everyHours: 24,
        asNeeded: true,
        note: '1 a 2 cápsulas ao dia, após a última refeição, se constipação',
      },

      /* ---- horário fixo ---- */
      {
        name: 'Cefadroxila 500mg (antibiótico)',
        everyHours: 12,
        days: 7,
        suggestedTime: '08:00',
        note: 'Tomar 1 cápsula VO de 12/12h por 7 dias — 14 cápsulas ao todo',
      },
      {
        name: 'Vitamina C 1g',
        everyHours: 24,
        timesOfDay: ['08:00'],
        note: 'Tomar 1 comprimido pela manhã — uso contínuo',
      },
      {
        /* A receita diz "a cada 2 horas". Distribuído nas horas acordadas: de 2
           em 2 horas o dia inteiro incluiria compressa às 4 da manhã, quando o
           que a paciente precisa é dormir. */
        name: 'Compressas de gaze com soro gelado',
        everyHours: 2,
        days: 4,
        timesOfDay: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        note: 'A cada 2 horas, por 4 dias',
      },
      {
        name: 'Hyabak 0,15% (colírio)',
        everyHours: 4,
        timesOfDay: ['07:00', '10:00', '13:00', '16:00', '19:00', '22:00'],
        note: 'Pingar 1 gota em cada olho, 6 vezes ao dia',
      },
      {
        name: 'Regencel (pomada oftálmica)',
        everyHours: 24,
        days: 7,
        timesOfDay: ['22:00'],
        note: 'Colocar uma tira dentro do olho na hora de dormir, por 7 dias',
      },
      {
        name: 'Bepantol Derma Regenerador Labial',
        everyHours: 8,
        timesOfDay: ['08:00', '14:00', '20:00'],
        note: 'Aplicar nos lábios 3 vezes ao dia',
      },
      {
        name: 'Cicaplast Baume B5',
        everyHours: 24,
        timesOfDay: ['21:00'],
        note: 'Aplicar no rosto à noite',
      },

      /* ---- começam depois, quando sai o taping e os pontos ---- */
      {
        name: 'Payot Complexo de Vitamina C (sérum)',
        everyHours: 24,
        timesOfDay: ['08:00'],
        startsAfterDays: 7,
        note: 'Aplicar no rosto pela manhã, depois de retirar o taping',
      },
      {
        name: 'Kelo-cote gel',
        everyHours: 24,
        timesOfDay: ['21:00'],
        startsAfterDays: 10,
        note: 'Aplicar nas feridas depois da retirada dos pontos',
      },
    ],
  },
  {
    id: 'rinoplastia',
    title: 'Prescrição padrão — Rinoplastia',
    procedures: ['rinoplastia'],
    items: [
      /* ---- dor ---- */
      {
        name: 'Novalgina 1g (Dipirona)',
        everyHours: 4,
        asNeeded: true,
        note: 'Tomar 1 comprimido de 4/4h se dor',
      },
      {
        name: 'Toragesic 10mg (sublingual)',
        everyHours: 8,
        asNeeded: true,
        days: 4,
        note: 'Aplicar 1 comprimido embaixo da língua até de 8/8h, se dor forte, por até 4 dias',
      },
      {
        name: 'Paco (Paracetamol + codeína)',
        everyHours: 6,
        asNeeded: true,
        note: 'Tomar 1 comprimido a cada 6 horas, se dor muito forte',
      },

      /* ---- horário fixo ---- */
      {
        name: 'Clavulin BD (antibiótico)',
        everyHours: 12,
        days: 7,
        suggestedTime: '08:00',
        note: 'Tomar 1 comprimido VO de 12/12h por 7 dias',
      },
      {
        name: 'Aturgyl 0,5mg/mL (solução nasal)',
        everyHours: 8,
        days: 5,
        /* De 8 em 8 horas a partir das 8h cairia à meia-noite. Começando às 7h,
           as três doses ficam em 07h, 15h e 23h — o intervalo é o mesmo. */
        suggestedTime: '07:00',
        note: 'Aplicar 3 gotas em cada narina, de 8/8h, por 5 dias',
      },
      {
        name: 'Rinosoro Jet XT (lavagem nasal)',
        everyHours: 6,
        timesOfDay: ['08:00', '12:00', '16:00', '20:00'],
        note: 'Lavar o nariz 4 vezes ao dia',
      },
      {
        name: 'Avamys (spray nasal)',
        everyHours: 12,
        timesOfDay: ['08:00', '20:00'],
        note: 'Aplicar 1 jato em cada nariz 2 vezes ao dia, até acabar o frasco',
      },
      {
        name: 'Vitamina C 1g',
        everyHours: 24,
        timesOfDay: ['08:00'],
        note: 'Tomar 1 comprimido pela manhã — uso contínuo',
      },
    ],
  },
];

/** A prescrição padrão dos procedimentos da paciente, se houver alguma. */
export const prescriptionFor = (ids: ProcedureId[]): Prescription | null =>
  prescriptions.find((p) => ids.some((id) => p.procedures.includes(id))) ?? null;

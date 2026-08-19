import type { ProcedureId } from './procedures';

/**
 * As prescrições padrão da clínica.
 *
 * A paciente sai da cirurgia com uma receita de oito a treze itens. Cadastrar
 * um por um, anestesiada e com dor, é pedir para ela desistir no terceiro. Aqui
 * ela escolhe a prescrição do procedimento dela, confere a lista e confirma.
 *
 * O que o app propõe é o que o cirurgião prescreve — mas quem confirma é ela, e
 * ela desmarca o que não recebeu ou não comprou.
 */

export interface PrescriptionItem {
  /** Como está na receita. */
  name: string;
  /**
   * Intervalo em horas. Nos de horário fixo é quando tomar; nos de alívio, o
   * mínimo entre uma dose e a seguinte.
   */
  everyHours: number;
  /** Só quando há sintoma — dor, náusea, constipação. Não gera alarme. */
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
  /** Entra na rotina do dia sem disparar alarme. */
  silent?: true;
  /**
   * Começa só depois de tantos dias de pós-operatório — o que espera a
   * retirada dos pontos ou do taping.
   */
  startsAfterDays?: number;
  /**
   * Vem desmarcado. É o caso das alternativas, que valem para parte das
   * pacientes: quem tem alergia à dipirona leva paracetamol no lugar, e marcar
   * os dois por padrão criaria lembrete duplicado de analgésico.
   */
  defaultOff?: true;
  /** A orientação da receita, mostrada na conferência. */
  note?: string;
}

export interface Prescription {
  id: string;
  title: string;
  procedures: ProcedureId[];
  items: PrescriptionItem[];
}

/* ------------------------------------------------------------------ *
 * Itens que se repetem entre as prescrições
 * ------------------------------------------------------------------ */

const NOVALGINA_4H: PrescriptionItem = {
  name: 'Novalgina 1g (Dipirona)',
  everyHours: 4,
  asNeeded: true,
  note: 'Tomar 1 comprimido de 4/4h se dor',
};

/** Substitui a dipirona em quem tem alergia. Por isso vem desmarcado. */
const PARACETAMOL_ALERGIA: PrescriptionItem = {
  name: 'Paracetamol 750mg',
  everyHours: 6,
  asNeeded: true,
  defaultOff: true,
  note: 'Só para quem tem alergia à dipirona, no lugar da Novalgina — 1 comprimido VO de 6/6h',
};

const TORAGESIC: PrescriptionItem = {
  name: 'Toragesic 10mg (sublingual)',
  everyHours: 8,
  asNeeded: true,
  days: 4,
  note: 'Aplicar 1 comprimido embaixo da língua até de 8/8h, se dor forte, por até 4 dias',
};

const PACO: PrescriptionItem = {
  name: 'Paco (Paracetamol + codeína)',
  everyHours: 6,
  asNeeded: true,
  note: 'Tomar 1 comprimido a cada 6 horas, se dor muito forte',
};

const TAMARINE: PrescriptionItem = {
  name: 'Tamarine',
  everyHours: 24,
  asNeeded: true,
  note: '1 a 2 cápsulas ao dia, após a última refeição, se constipação',
};

const VONAU: PrescriptionItem = {
  name: 'Vonau 4mg (ondansetrona)',
  everyHours: 8,
  asNeeded: true,
  note: 'Tomar 1 a 2 comprimidos VO de 8/8h se náusea ou vômito',
};

const CEFADROXILA: PrescriptionItem = {
  name: 'Cefadroxila 500mg (antibiótico)',
  everyHours: 12,
  days: 7,
  suggestedTime: '08:00',
  note: 'Tomar 1 cápsula VO de 12/12h por 7 dias — 14 cápsulas ao todo',
};

const VITAMINA_C: PrescriptionItem = {
  name: 'Vitamina C 1g',
  everyHours: 24,
  timesOfDay: ['08:00'],
  note: 'Tomar 1 comprimido pela manhã — uso contínuo',
};

/* Em jejum, uma hora antes de comer: por isso 7h, e não junto do resto às 8h. */
const PANTOPRAZOL: PrescriptionItem = {
  name: 'Pantoprazol 20mg',
  everyHours: 24,
  timesOfDay: ['07:00'],
  note: 'Tomar 1 comprimido pela manhã em jejum, ao menos 60 minutos antes de comer',
};

/*
 * Compressa não é remédio de tomar, e de 2 em 2 horas seriam oito alarmes por
 * dia durante quatro dias. Alarme demais ensina a paciente a ignorar todos, e é
 * o do antibiótico que ela não pode perder — então este entra na rotina do dia,
 * visível, mas sem tocar. A madrugada fica de fora: o que ela precisa às 4 da
 * manhã é dormir.
 */
const COMPRESSAS: PrescriptionItem = {
  name: 'Compressas de gaze com soro gelado',
  everyHours: 2,
  days: 4,
  timesOfDay: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
  silent: true,
  note: 'A cada 2 horas enquanto estiver acordada, por 4 dias',
};

/*
 * Cicatriz, e não ferida operatória: começa no 21º dia, quando a cicatriz já
 * está fechada, e vale para as cirurgias que deixam cicatriz a tratar.
 */
const KELOCOTE: PrescriptionItem = {
  name: 'Kelo-cote gel',
  everyHours: 12,
  timesOfDay: ['08:00', '20:00'],
  startsAfterDays: 21,
  note: 'Aplicar nas cicatrizes 2 vezes ao dia, a partir do 21º dia',
};

const HYABAK: PrescriptionItem = {
  name: 'Hyabak 0,15% (colírio)',
  everyHours: 4,
  timesOfDay: ['07:00', '10:00', '13:00', '16:00', '19:00', '22:00'],
  note: 'Pingar 1 gota em cada olho, 6 vezes ao dia',
};

/* De 8 em 8 horas a partir das 7h fecha em 07h, 15h e 23h — começando às 8h, a
   terceira dose cairia à meia-noite. */
const REGENCEL: PrescriptionItem = {
  name: 'Regencel (pomada oftálmica)',
  everyHours: 8,
  days: 7,
  timesOfDay: ['07:00', '15:00', '23:00'],
  note: 'Colocar uma tira dentro do olho de 8/8h, por 7 dias',
};

/** A base das cirurgias de corpo e mama, sem o adesivo de buprenorfina. */
const CORPO_BASE: PrescriptionItem[] = [
  NOVALGINA_4H,
  PARACETAMOL_ALERGIA,
  TORAGESIC,
  PACO,
  VONAU,
  TAMARINE,
  CEFADROXILA,
  VITAMINA_C,
  PANTOPRAZOL,
];

const RESTIVA_10: PrescriptionItem = {
  name: 'Restiva 10mg (adesivo)',
  everyHours: 168,
  days: 7,
  suggestedTime: '08:00',
  defaultOff: true,
  note: 'Alternativa ao adesivo de 20mcg/h, em parte das pacientes — marque apenas se for o da sua receita',
};

/* Um adesivo por semana. A troca da semana seguinte é condicional, e por isso
   não vira lembrete: agendar a segunda aplicação sugeriria mais um opioide a
   quem talvez já não tenha dor. */
const RESTIVA_20: PrescriptionItem = {
  name: 'Restiva 20mcg/h (adesivo)',
  everyHours: 168,
  days: 7,
  suggestedTime: '08:00',
  note: 'Aplicar na pele e manter por 7 dias. Trocar na semana seguinte apenas se a dor persistir, conforme a equipe',
};

export const prescriptions: Prescription[] = [
  {
    /* Separada da lipo porque só estas duas deixam cicatriz longa a tratar com
       o Kelo-cote; o resto da prescrição é idêntico. */
    id: 'abdome',
    title: 'Prescrição padrão — abdominoplastia e pós-bariátrica',
    procedures: ['abdominoplastia', 'pos_bariatrica'],
    items: [RESTIVA_10, RESTIVA_20, ...CORPO_BASE, KELOCOTE],
  },
  {
    id: 'lipo',
    title: 'Prescrição padrão — lipoescultura e Lipo HD',
    procedures: ['lipoescultura', 'lipo_hd'],
    items: [RESTIVA_10, RESTIVA_20, ...CORPO_BASE],
  },
  {
    id: 'mama-otoplastia',
    title: 'Prescrição padrão — mama e otoplastia',
    procedures: [
      'mastopexia',
      'mamoplastia_aumento',
      'mamoplastia_redutora',
      'ginecomastia',
      'otoplastia',
    ],
    items: [...CORPO_BASE, KELOCOTE],
  },
  {
    id: 'blefaroplastia',
    title: 'Prescrição padrão — Blefaroplastia',
    procedures: ['blefaroplastia'],
    items: [
      NOVALGINA_4H,
      PARACETAMOL_ALERGIA,
      TORAGESIC,
      PACO,
      CEFADROXILA,
      VITAMINA_C,
      PANTOPRAZOL,
      COMPRESSAS,
      HYABAK,
      REGENCEL,
    ],
  },
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
      PARACETAMOL_ALERGIA,
      TORAGESIC,
      PACO,
      TAMARINE,

      /* ---- horário fixo ---- */
      CEFADROXILA,
      VITAMINA_C,
      COMPRESSAS,
      HYABAK,
      REGENCEL,
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
      KELOCOTE,
    ],
  },
  {
    id: 'rinoplastia',
    title: 'Prescrição padrão — Rinoplastia',
    procedures: ['rinoplastia'],
    items: [
      NOVALGINA_4H,
      PARACETAMOL_ALERGIA,
      TORAGESIC,
      PACO,
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
      VITAMINA_C,
      KELOCOTE,
    ],
  },
];

/**
 * A prescrição padrão dos procedimentos da paciente, se houver alguma.
 *
 * Em cirurgia combinada vale a do primeiro procedimento que tiver uma — ela
 * confere a lista de qualquer modo, e pode acrescentar o que faltar.
 */
export const prescriptionFor = (ids: ProcedureId[]): Prescription | null => {
  for (const id of ids) {
    const achada = prescriptions.find((p) => p.procedures.includes(id));
    if (achada) return achada;
  }
  return null;
};

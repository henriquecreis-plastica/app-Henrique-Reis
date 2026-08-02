import type { IconName, ProcedureId } from './procedures';

export interface Phase {
  id: string;
  label: string;
  /** Faixa em dias de pós-operatório (inclusiva). */
  from: number;
  to: number;
  icon: IconName;
  summary: string;
  /** O que é esperado sentir/ver nesta fase. */
  expect: string[];
  /** Ações da paciente nesta fase. */
  todo: string[];
  /** O que evitar nesta fase. */
  avoid: string[];
}

/**
 * Conteúdo do período que antecede a cirurgia. Sem isto, quem cadastra uma
 * data futura recebe as orientações do 1º dia de pós-operatório — instruções
 * que ainda não fazem sentido para ela.
 */
export const preOpPhase: Phase = {
  id: 'pre',
  label: 'Antes da cirurgia',
  from: -3650,
  to: -1,
  icon: 'calendar-outline',
  summary:
    'A preparação influencia diretamente a recuperação. Estas são as orientações gerais para os dias que antecedem a cirurgia.',
  expect: [
    'Ansiedade e sono irregular na véspera são comuns',
    'A equipe confirma horário, jejum e local do procedimento',
    'Exames e avaliação pré-anestésica precisam estar em dia',
  ],
  todo: [
    'Seguir o tempo de jejum exatamente como orientado',
    'Confirmar com a equipe quais medicamentos manter ou suspender',
    'Organizar acompanhante para a alta e para os primeiros dias',
    'Deixar em casa a cinta ou o sutiã cirúrgico, medicações e curativos',
    'Preparar refeições e o lugar onde vai descansar',
  ],
  avoid: [
    'Anti-inflamatórios, suplementos e chás sem liberação da equipe',
    'Bebida alcoólica nas 48 horas anteriores',
    'Cigarro — parar antes da cirurgia melhora a cicatrização',
    'Depilação ou qualquer procedimento estético na área a ser operada',
  ],
};

export const phases: Phase[] = [
  {
    id: 'p1',
    label: 'Primeiras 48 horas',
    from: 0,
    to: 2,
    icon: 'moon-outline',
    summary:
      'Fase de repouso protegido. O corpo está reagindo à cirurgia e ao anestésico. Sonolência, mal-estar e desconforto são esperados.',
    expect: [
      'Dor controlável com a medicação prescrita',
      'Inchaço aumentando — o pico costuma ser no 2º ou 3º dia',
      'Sensação de peso, aperto ou queimação na área operada',
      'Cansaço, sonolência e pouca vontade de comer',
      'Pequena saída de líquido rosado nos curativos',
    ],
    todo: [
      'Tomar os remédios nos horários certos, sem esperar a dor chegar',
      'Levantar da cama apenas acompanhada, devagar e em duas etapas',
      'Movimentar os pés e as pernas na cama de hora em hora',
      'Beber água ao longo do dia',
      'Manter a malha, cinta ou sutiã cirúrgico o tempo todo',
    ],
    avoid: [
      'Ficar totalmente parada na cama por muitas horas',
      'Dirigir ou tomar decisões importantes (efeito da anestesia)',
      'Molhar os curativos',
      'Fumar ou consumir bebida alcoólica',
    ],
  },
  {
    id: 'p2',
    label: 'Dias 3 a 7',
    from: 3,
    to: 7,
    icon: 'sunny-outline',
    summary:
      'O pico do inchaço e dos roxos acontece agora e começa a ceder. A dor costuma diminuir bastante a partir do 4º dia.',
    expect: [
      'Roxos escurecendo antes de clarear — isso é normal',
      'Inchaço assimétrico: um lado pode inchar mais que o outro',
      'Coceira leve e sensação de fisgadas ou choques',
      'Áreas dormentes ao redor das cicatrizes',
      'Intestino preso por causa dos analgésicos',
    ],
    todo: [
      'Caminhar dentro de casa, várias vezes ao dia e por poucos minutos',
      'Iniciar a drenagem linfática se já liberada pela equipe',
      'Comparecer ao primeiro retorno para revisão dos curativos',
      'Manter alimentação rica em proteína e fibras',
      'Dormir na posição orientada para a sua cirurgia',
    ],
    avoid: [
      'Esforço físico, agachar e pegar peso',
      'Banho de imersão, piscina, mar e sauna',
      'Passar cremes ou pomadas por conta própria na cicatriz',
      'Comparar o resultado com fotos — ainda é muito cedo',
    ],
  },
  {
    id: 'p3',
    label: 'Semanas 2 e 3',
    from: 8,
    to: 21,
    icon: 'walk-outline',
    summary:
      'Fase de retomada gradual. A maioria das pacientes já se sente bem em casa e muitas voltam a atividades leves.',
    expect: [
      'Melhora clara da dor — desconforto pontual ainda ocorre',
      'Roxos amarelando e desaparecendo',
      'Cicatriz avermelhada e um pouco elevada',
      'Endurecimento e nódulos sob a pele nas áreas lipoaspiradas',
      'Cansaço no fim do dia',
    ],
    todo: [
      'Retomar o trabalho leve, se liberada pela equipe',
      'Manter a compressão conforme orientado',
      'Seguir com a drenagem linfática na frequência indicada',
      'Hidratar a pele ao redor da cicatriz (não sobre os pontos)',
    ],
    avoid: [
      'Academia, corrida e qualquer exercício de impacto',
      'Sol direto sobre a cicatriz',
      'Relações sexuais e esforços intensos sem liberação',
      'Abandonar a cinta ou o sutiã cirúrgico mais cedo',
    ],
  },
  {
    id: 'p4',
    label: 'Semanas 4 a 6',
    from: 22,
    to: 42,
    icon: 'fitness-outline',
    summary:
      'Retorno progressivo à rotina. O inchaço continua diminuindo, mas de forma mais lenta e discreta.',
    expect: [
      'Inchaço que oscila ao longo do dia e piora à noite',
      'Cicatriz ainda vermelha — o clareamento leva meses',
      'Sensibilidade voltando aos poucos, com formigamento',
      'Contorno corporal começando a se definir',
    ],
    todo: [
      'Retomar exercícios leves apenas após liberação médica',
      'Iniciar tratamento de cicatriz se indicado pela equipe',
      'Usar protetor solar sobre a cicatriz sempre que exposta',
      'Manter peso estável e boa hidratação',
    ],
    avoid: [
      'Voltar à musculação pesada por conta própria',
      'Bronzeamento natural ou artificial',
      'Massagens fortes sobre a área operada sem orientação',
    ],
  },
  {
    id: 'p5',
    label: 'Meses 2 e 3',
    from: 43,
    to: 90,
    icon: 'trending-up-outline',
    summary:
      'A forma já se aproxima do resultado, mas a cicatriz entra na fase em que mais precisa de cuidado.',
    expect: [
      'Cicatriz podendo ficar mais espessa e avermelhada — fase esperada',
      'Inchaço residual, principalmente no fim do dia',
      'Sensibilidade quase normal na maior parte das áreas',
      'Retorno pleno às atividades físicas quando liberada',
    ],
    todo: [
      'Manter o tratamento da cicatriz com disciplina',
      'Protetor solar diário na cicatriz exposta',
      'Comparecer aos retornos de acompanhamento',
      'Registrar fotos de evolução para comparar com calma',
    ],
    avoid: [
      'Interromper o cuidado com a cicatriz por achar que já está bom',
      'Sol sem proteção',
      'Ganho ou perda de peso rápidos',
    ],
  },
  {
    id: 'p6',
    label: 'Meses 4 a 12',
    from: 91,
    to: 3650,
    icon: 'ribbon-outline',
    summary:
      'Fase de maturação. A cicatriz clareia e amolece, e o resultado final se consolida ao longo do primeiro ano.',
    expect: [
      'Cicatriz clareando progressivamente até ficar mais clara e plana',
      'Contorno definitivo se estabelecendo',
      'Pequenas áreas de dormência que podem levar até 1 ano para normalizar',
    ],
    todo: [
      'Manter protetor solar sobre a cicatriz por 12 meses',
      'Vida ativa e peso estável para preservar o resultado',
      'Manter os retornos anuais de acompanhamento',
    ],
    avoid: [
      'Sol direto na cicatriz sem proteção — é o que mais escurece a marca',
      'Tabagismo, que prejudica a qualidade da cicatriz',
    ],
  },
];

/** Marcos adicionais específicos por procedimento, exibidos na linha do tempo. */
export const procedureMilestones: Partial<Record<ProcedureId, { day: number; text: string }[]>> = {
  mamoplastia_aumento: [
    { day: 2, text: 'Mamas altas e endurecidas — elas descem naturalmente em semanas' },
    { day: 30, text: 'As próteses começam a acomodar e o formato se naturaliza' },
    { day: 90, text: 'Formato próximo do definitivo' },
  ],
  mastopexia: [
    { day: 14, text: 'Retirada de pontos conforme orientação da equipe' },
    { day: 60, text: 'Cicatrizes entram na fase de maior cuidado' },
  ],
  mamoplastia_redutora: [
    { day: 14, text: 'Revisão das cicatrizes no encontro em T' },
    { day: 90, text: 'Sensibilidade dos mamilos costuma retornar' },
  ],
  abdominoplastia: [
    { day: 7, text: 'Postura ereta é retomada gradualmente' },
    { day: 21, text: 'Cinta pode passar a ser usada por período parcial, se liberado' },
    { day: 60, text: 'Retorno a exercícios abdominais, quando liberada' },
  ],
  lipoescultura: [
    { day: 21, text: 'Fase de maior endurecimento — a drenagem faz diferença aqui' },
    { day: 90, text: 'Contorno definido, com inchaço residual mínimo' },
  ],
  rinoplastia: [
    { day: 7, text: 'Retirada do curativo ou splint nasal' },
    { day: 30, text: 'Nariz ainda inchado, principalmente na ponta' },
    { day: 365, text: 'Resultado definitivo da ponta nasal' },
  ],
  face: [
    { day: 10, text: 'Retirada dos pontos conforme orientação' },
    { day: 30, text: 'Aparência social recuperada na maioria dos casos' },
  ],
  blefaroplastia: [
    { day: 5, text: 'Retirada dos pontos das pálpebras' },
    { day: 21, text: 'Roxos resolvidos na maioria das pacientes' },
  ],
  otoplastia: [
    { day: 7, text: 'Troca do curativo pela faixa elástica' },
    { day: 30, text: 'Faixa apenas para dormir, conforme orientação' },
  ],
  ginecomastia: [
    { day: 30, text: 'Endurecimento sob a aréola começa a ceder' },
    { day: 60, text: 'Liberação progressiva de exercícios de peito' },
  ],
  pos_bariatrica: [
    { day: 14, text: 'Retirada de drenos e pontos conforme evolução' },
    { day: 90, text: 'Cicatrizes longas entram em maturação' },
  ],
};

export const phaseForDay = (day: number): Phase =>
  phases.find((p) => day >= p.from && day <= p.to) ?? phases[phases.length - 1];

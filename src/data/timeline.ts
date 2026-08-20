import { appliesToProcedure, type IconName, type ProcedureId, type ProcedureKind } from './procedures';

/**
 * Uma linha de orientação dentro de uma fase.
 *
 * As fases são compartilhadas por todas as cirurgias, e a maior parte do que
 * elas dizem vale para qualquer uma. Mas algumas linhas não: falar de "áreas
 * lipoaspiradas" para quem fez rinoplastia é desinformação, e foi o que o app
 * fazia. Uma linha pode então declarar a quem ela serve.
 */
export type PhaseItem =
  | string
  | {
      text: string;
      /** Só estes procedimentos veem a linha. */
      procedures?: ProcedureId[];
      /** Todos veem, menos estes. */
      exceto?: ProcedureId[];
    };

export interface Phase {
  id: string;
  label: string;
  /** Faixa em dias de pós-operatório (inclusiva). */
  from: number;
  to: number;
  icon: IconName;
  summary: string;
  /** O que é esperado sentir/ver nesta fase. */
  expect: PhaseItem[];
  /** Ações da paciente nesta fase. */
  todo: PhaseItem[];
  /** O que evitar nesta fase. */
  avoid: PhaseItem[];
}

/**
 * Cirurgias sem peça compressiva de corpo.
 *
 * Cada uma tem o seu curativo, e a palavra importa: splint é do nariz, faixa é
 * da orelha, mentoneira é do rosto. Dizer as três juntas faz a paciente
 * procurar no corpo dela uma coisa que ela não tem.
 */
const SEM_CINTA: ProcedureId[] = ['rinoplastia', 'blefaroplastia', 'otoplastia', 'face_hd', 'face'];

/**
 * Cirurgias em que há área lipoaspirada e a drenagem linfática faz parte da
 * rotina. É a lista que decide quem ouve falar de endurecimento e nódulos.
 */
const COM_LIPO: ProcedureId[] = [
  'lipoescultura',
  'lipo_hd',
  'abdominoplastia',
  'ginecomastia',
  'pos_bariatrica',
];

/** As linhas desta fase que valem para os procedimentos da paciente. */
export const phaseItems = (items: PhaseItem[], ids: ProcedureId[]): string[] =>
  items
    .filter((item) => {
      if (typeof item === 'string') return true;
      if (item.procedures) return ids.some((id) => appliesToProcedure(item.procedures, id));
      if (item.exceto) return ids.some((id) => !appliesToProcedure(item.exceto, id));
      return true;
    })
    .map((item) => (typeof item === 'string' ? item : item.text));

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
    { text: 'Deixar em casa a cinta ou o sutiã cirúrgico, medicações e curativos', exceto: SEM_CINTA },
    { text: 'Deixar em casa as medicações e os curativos indicados pela equipe', procedures: SEM_CINTA },
    'Preparar refeições e o lugar onde vai descansar',
  ],
  avoid: [
    'Anti-inflamatórios, suplementos e chás sem liberação da equipe',
    'Bebida alcoólica nas 48 horas anteriores',
    'Cigarro — parar antes da cirurgia melhora a cicatrização',
    'Depilação ou qualquer procedimento estético na área a ser operada',
  ],
};

/**
 * Percurso dos procedimentos de consultório. A escala é outra: o que na
 * cirurgia leva semanas, aqui se resolve em dias — e o que importa acompanhar
 * é o resultado aparecendo, não a rotina sendo retomada.
 */
export const officePhases: Phase[] = [
  {
    id: 'a1',
    label: 'Primeiras 24 horas',
    from: 0,
    to: 0,
    icon: 'time-outline',
    summary:
      'O período em que os cuidados fazem mais diferença. A maior parte das orientações vale só para hoje.',
    expect: [
      'Vermelhidão e pequeno inchaço nos pontos de aplicação',
      'Sensação de ardência ou calor local',
      'Pontinhos de sangue ou roxos começando a aparecer',
    ],
    todo: [
      'Manter a cabeceira elevada para dormir',
      'Compressa fria por alguns minutos, se orientado',
      'Beber água e manter a pele limpa',
    ],
    avoid: [
      'Massagear, apertar ou esfregar a área tratada',
      'Exercício físico, sauna, sol forte e bebida alcoólica',
      'Maquiagem sobre a área, salvo liberação',
      'Deitar de bruços ou abaixar a cabeça por longos períodos',
    ],
  },
  {
    id: 'a2',
    label: 'Dias 2 a 7',
    from: 1,
    to: 7,
    icon: 'sunny-outline',
    summary:
      'Fase em que o inchaço e as marcas cedem. É cedo demais para julgar o resultado.',
    expect: [
      'Roxos escurecendo antes de clarear',
      'Inchaço assimétrico — um lado pode estar mais inchado',
      'Pequenas irregularidades ao toque',
      'Sensibilidade ao encostar na região',
    ],
    todo: [
      'Manter hidratação da pele e protetor solar',
      'Seguir a orientação de massagem, se houver — em alguns tratamentos ela faz parte',
      'Retomar a rotina normalmente',
    ],
    avoid: [
      'Exposição solar sem proteção',
      'Procedimentos estéticos na mesma área sem liberação',
      'Concluir qualquer coisa sobre o resultado',
    ],
  },
  {
    id: 'a3',
    label: 'Semanas 2 a 4',
    from: 8,
    to: 28,
    icon: 'eye-outline',
    summary:
      'Na maioria dos tratamentos os sinais iniciais já reduziram bastante, e o que você vê começa a ser o resultado. O tempo varia conforme o procedimento realizado.',
    expect: [
      'Sinais do procedimento bem menos visíveis do que nos primeiros dias',
      'Resultado se acomodando e ficando mais harmônico',
      'Pequenas assimetrias que ainda podem se ajustar',
      'Após laser e Morpheus, a pele pode seguir rosada por mais tempo',
    ],
    todo: [
      'Comparecer à avaliação de retorno, quando marcada',
      'Levar suas dúvidas e observações anotadas',
      'Manter protetor solar diário',
    ],
    avoid: [
      'Pedir retoque antes da avaliação — o resultado ainda está se definindo',
      'Bronzeamento',
    ],
  },
  {
    id: 'a4',
    label: 'A partir do 2º mês',
    from: 29,
    to: 3650,
    icon: 'trending-up-outline',
    summary:
      'Na maioria das pacientes o resultado já está estável, embora cada tratamento tenha o seu próprio tempo. A partir daqui o que conta é manutenção e acompanhamento.',
    expect: [
      'Efeito estável, dentro da duração esperada para o tratamento',
      'Em bioestimuladores, ganho progressivo até cerca de 3 meses',
      'Após laser e Morpheus, textura e firmeza podem seguir evoluindo por alguns meses',
    ],
    todo: [
      'Combinar com a equipe quando será a manutenção',
      'Manter cuidado diário com a pele e proteção solar',
    ],
    avoid: ['Deixar passar muito do prazo de manutenção, se o objetivo é manter o resultado'],
  },
];

/** Orientações para quem ainda vai realizar um procedimento de consultório. */
export const preOpOfficePhase: Phase = {
  id: 'pre-a',
  label: 'Antes do procedimento',
  from: -3650,
  to: -1,
  icon: 'calendar-outline',
  summary: 'Alguns cuidados simples nos dias anteriores reduzem inchaço e roxos.',
  expect: [
    'O procedimento é feito no consultório, com anestésico local ou tópico',
    'Você sai andando e retoma a rotina no mesmo dia, com restrições leves',
  ],
  todo: [
    'Avisar a equipe sobre medicamentos, suplementos e histórico de herpes',
    'Chegar sem maquiagem na região a ser tratada',
    'Programar o procedimento com folga antes de eventos importantes',
  ],
  avoid: [
    'Anti-inflamatórios, ômega 3, vitamina E e ginkgo nos dias anteriores, salvo orientação',
    'Bebida alcoólica nas 24 horas anteriores',
    'Sol intenso e pele bronzeada ou irritada no dia',
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
      { text: 'Manter a malha, cinta ou sutiã cirúrgico o tempo todo', exceto: SEM_CINTA },
      {
        text: 'Manter o curativo e o splint nasal exatamente como a equipe orientou',
        procedures: ['rinoplastia'],
      },
      {
        text: 'Manter a faixa elástica exatamente como a equipe orientou',
        procedures: ['otoplastia'],
      },
      {
        text: 'Manter os curativos das pálpebras exatamente como a equipe orientou',
        procedures: ['blefaroplastia'],
      },
      {
        text: 'Manter a mentoneira e o taping exatamente como a equipe orientou',
        procedures: ['face_hd'],
      },
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
      { text: 'Iniciar a drenagem linfática se já liberada pela equipe', procedures: COM_LIPO },
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
      { text: 'Endurecimento e nódulos sob a pele nas áreas lipoaspiradas', procedures: COM_LIPO },
      'Cansaço no fim do dia',
    ],
    todo: [
      'Retomar o trabalho leve, se liberada pela equipe',
      { text: 'Manter a compressão conforme orientado', exceto: SEM_CINTA },
      { text: 'Seguir com a drenagem linfática na frequência indicada', procedures: COM_LIPO },
      'Hidratar a pele ao redor da cicatriz (não sobre os pontos)',
    ],
    avoid: [
      'Academia, corrida e qualquer exercício de impacto',
      'Sol direto sobre a cicatriz',
      'Relações sexuais e esforços intensos sem liberação',
      { text: 'Abandonar a cinta ou o sutiã cirúrgico mais cedo', exceto: SEM_CINTA },
      { text: 'Retirar o curativo ou o splint nasal antes do tempo orientado', procedures: ['rinoplastia'] },
      { text: 'Retirar a faixa elástica antes do tempo orientado', procedures: ['otoplastia'] },
      { text: 'Retirar os curativos das pálpebras antes do tempo orientado', procedures: ['blefaroplastia'] },
      { text: 'Retirar a mentoneira ou o taping antes do tempo orientado', procedures: ['face_hd'] },
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
      { text: 'Contorno corporal começando a se definir', exceto: SEM_CINTA },
      {
        text: 'Formato ainda mudando à medida que o inchaço cede — é cedo para julgar',
        procedures: SEM_CINTA,
      },
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
      { text: 'Contorno se aproximando do resultado final', exceto: SEM_CINTA },
      { text: 'Formato se aproximando do resultado final', procedures: SEM_CINTA },
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
    { day: 90, text: 'Formato próximo do final na maioria das pacientes' },
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
    { day: 14, text: 'Postura totalmente ereta, conforme a orientação da equipe' },
    { day: 21, text: 'Cinta pode passar a ser usada por período parcial, se liberado' },
    { day: 60, text: 'Retorno a exercícios abdominais, quando liberada' },
  ],
  lipo_hd: [
    { day: 21, text: 'Fase de maior endurecimento — quando indicada, a drenagem ajuda nesta fase' },
    { day: 90, text: 'Maior parte da recuperação concluída; a definição segue melhorando' },
    { day: 180, text: 'Resultado do enxerto já estabelecido, quando houve GRAFT' },
    { day: 365, text: 'Resultado final do contorno — entre 6 e 12 meses, conforme cada paciente' },
  ],
  lipoescultura: [
    { day: 21, text: 'Fase de maior endurecimento — a drenagem faz diferença aqui' },
    { day: 90, text: 'Contorno já definido na maioria das pacientes, com inchaço residual' },
  ],
  rinoplastia: [
    { day: 7, text: 'Retirada do curativo ou splint nasal' },
    { day: 30, text: 'Nariz ainda inchado, principalmente na ponta' },
    { day: 365, text: 'Ponta nasal próxima do resultado final' },
  ],
  face_hd: [
    { day: 0, text: 'Fisioterapia e taping começam ainda no hospital' },
    { day: 10, text: 'Retirada dos pontos conforme orientação' },
    { day: 15, text: 'Fim do uso da mentoneira, conforme orientação' },
    { day: 30, text: 'Rosto mais desinchado, porém ainda longe do resultado final' },
    { day: 180, text: 'Rosto próximo do resultado final' },
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
  toxina: [
    { day: 4, text: 'O efeito começa a aparecer' },
    { day: 15, text: 'Efeito completo — é quando se avalia a necessidade de retoque' },
    { day: 120, text: 'Época habitual de reavaliar a manutenção' },
  ],
  preenchimento: [
    { day: 3, text: 'Pico do inchaço, já começando a ceder' },
    { day: 15, text: 'Inchaço resolvido — o que se vê agora é o resultado' },
    { day: 30, text: 'Avaliação de retorno e eventual complemento' },
  ],
  bioestimulador: [
    { day: 5, text: 'Fim do período de massagem orientada, se indicado' },
    { day: 30, text: 'Primeiros sinais de ganho de colágeno' },
    { day: 90, text: 'Resultado da sessão estabelecido na maioria das pacientes' },
  ],
  laser_co2: [
    { day: 3, text: 'Início da descamação — não retirar as casquinhas' },
    { day: 7, text: 'Pele renovada, ainda rosada' },
    { day: 30, text: 'Vermelhidão bem reduzida; maquiagem liberada há semanas' },
    { day: 90, text: 'Textura e firmeza já estabelecidas na maioria das pacientes' },
  ],
  morpheus: [
    { day: 7, text: 'As marquinhas em grade costumam ter clareado bastante' },
    { day: 30, text: 'Firmeza começa a aparecer; em algumas pacientes as marcas ainda são visíveis' },
    { day: 90, text: 'Resultado da sessão estabelecido na maioria das pacientes' },
  ],
};

/** Fase correspondente ao dia, no percurso certo para o tipo de procedimento. */
export const phaseForDay = (day: number, kind: ProcedureKind = 'cirurgico'): Phase => {
  if (day < 0) return kind === 'ambulatorial' ? preOpOfficePhase : preOpPhase;
  const list = kind === 'ambulatorial' ? officePhases : phases;
  return list.find((p) => day >= p.from && day <= p.to) ?? list[list.length - 1];
};

/** Todas as fases do percurso, para a linha do tempo. */
export const phasesFor = (kind: ProcedureKind): Phase[] =>
  kind === 'ambulatorial' ? officePhases : phases;

/**
 * Os marcos de todos os procedimentos da paciente, em ordem de dia.
 *
 * Numa cirurgia combinada os marcos se somam — quem operou mama e abdome tem
 * retirada de pontos e retomada da postura, cada um no seu dia. Textos
 * idênticos entre dois procedimentos aparecem uma vez só; quando caem no mesmo
 * dia com textos diferentes, os dois ficam, porque são cuidados distintos.
 */
export const milestonesFor = (ids: ProcedureId[]): { day: number; text: string }[] => {
  const vistos = new Set<string>();
  return ids
    .flatMap((id) => procedureMilestones[id] ?? [])
    .filter((m) => !vistos.has(m.text) && vistos.add(m.text))
    .sort((a, b) => a.day - b.day);
};

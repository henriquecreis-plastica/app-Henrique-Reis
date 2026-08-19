import type { Ionicons } from '@expo/vector-icons';

/**
 * Os dois percursos que o app precisa distinguir. Uma paciente de toxina
 * botulínica não usa cinta, não faz drenagem e volta à rotina no mesmo dia —
 * aplicar a ela a linha do tempo de uma abdominoplastia seria desinformação.
 */
export type ProcedureKind = 'cirurgico' | 'ambulatorial';

export type ProcedureId =
  | 'mamoplastia_aumento'
  | 'mastopexia'
  | 'mamoplastia_redutora'
  | 'abdominoplastia'
  | 'lipo_hd'
  | 'lipoescultura'
  | 'rinoplastia'
  | 'face_hd'
  /**
   * Não é mais escolhível: a cirurgia de face da clínica é o Face HD Concept.
   * O id continua existindo como etiqueta do conteúdo de face, herdado pelo
   * Face HD — assim as 62 orientações não precisaram ser reetiquetadas.
   */
  | 'face'
  | 'blefaroplastia'
  | 'otoplastia'
  | 'ginecomastia'
  | 'pos_bariatrica'
  | 'toxina'
  | 'preenchimento'
  | 'bioestimulador'
  | 'laser_co2'
  | 'morpheus'
  | 'outro';

export type IconName = keyof typeof Ionicons.glyphMap;

export interface Procedure {
  id: ProcedureId;
  name: string;
  /** Descrição curta usada na seleção do onboarding. */
  short: string;
  icon: IconName;
  kind: ProcedureKind;
  /**
   * Nos cirúrgicos, semanas até a rotina estar retomada. Nos ambulatoriais,
   * semanas até o resultado se consolidar — o texto muda conforme o tipo.
   */
  recoveryWeeks: number;
  /** Pontos de atenção específicos deste procedimento. */
  highlights: string[];
  /**
   * Aviso extra na seleção, para procedimentos que se confundem entre si. Só
   * aparece onde a escolha errada muda o conteúdo que a paciente vai receber.
   */
  note?: string;
  /**
   * Como o nome entra no meio de uma frase. Os procedimentos comuns viram
   * minúscula ("referências para rinoplastia"); os que são marca da clínica
   * mantêm a grafia própria.
   */
  brandName?: true;
}

export const procedures: Procedure[] = [
  {
    id: 'mamoplastia_aumento',
    name: 'Mamoplastia de aumento',
    short: 'Prótese de silicone',
    icon: 'heart-outline',
    kind: 'cirurgico',
    recoveryWeeks: 6,
    highlights: [
      'Sutiã cirúrgico em tempo integral, inclusive para dormir',
      'Dormir de barriga para cima nas primeiras semanas',
      'Não levantar os braços acima dos ombros no primeiro mês',
    ],
  },
  {
    id: 'mastopexia',
    name: 'Mastopexia',
    short: 'Levantamento das mamas, com ou sem prótese',
    icon: 'heart-outline',
    kind: 'cirurgico',
    recoveryWeeks: 6,
    highlights: [
      'Sutiã cirúrgico em tempo integral',
      'Cicatrizes exigem proteção solar rigorosa por 12 meses',
      'Evitar esforço com os braços no primeiro mês',
      'Não levantar os braços acima dos ombros no primeiro mês',
    ],
  },
  {
    id: 'mamoplastia_redutora',
    name: 'Mamoplastia redutora',
    short: 'Redução das mamas',
    icon: 'heart-outline',
    kind: 'cirurgico',
    recoveryWeeks: 6,
    highlights: [
      'Sutiã cirúrgico em tempo integral',
      'Pequenos pontos podem abrir no encontro das cicatrizes — é comum',
      'Alteração temporária da sensibilidade dos mamilos é esperada',
    ],
  },
  {
    id: 'abdominoplastia',
    name: 'Abdominoplastia',
    short: 'Abdominoplastia ou lipoabdominoplastia',
    icon: 'body-outline',
    kind: 'cirurgico',
    recoveryWeeks: 8,
    highlights: [
      'Andar levemente curvada nas duas primeiras semanas protege a cicatriz',
      'Cinta compressiva em tempo integral',
      'Movimentar as pernas na cama desde o 1º dia previne trombose',
    ],
  },
  {
    id: 'lipoescultura',
    name: 'Lipoescultura',
    short: 'Lipoaspiração convencional, com ou sem enxertia de gordura',
    icon: 'body-outline',
    kind: 'cirurgico',
    recoveryWeeks: 6,
    highlights: [
      'Cinta compressiva 24h por dia',
      'Drenagem linfática quando indicada pela equipe',
      'Endurecimento e irregularidades nos primeiros meses são esperados',
    ],
  },
  {
    id: 'lipo_hd',
    name: 'Lipo HD Concept',
    short: 'Lipoaspiração de alta definição, com ou sem GRAFT',
    note: 'Marque só se o Lipo HD Concept foi o planejamento combinado na sua consulta. Se a sua cirurgia foi uma lipoaspiração convencional, escolha Lipoescultura.',
    icon: 'barbell-outline',
    kind: 'cirurgico',
    brandName: true,
    recoveryWeeks: 6,
    highlights: [
      'Cinta conforme a orientação da equipe — não aperte nem ajuste por conta própria',
      'Drenagem linfática e fisioterapia ajudam a preservar a definição',
      'Caminhadas curtas desde cedo, conforme orientação',
      'Se houve enxertia: evite pressão sobre a área enxertada',
      'Endurecimento e assimetrias nas primeiras semanas são esperados',
    ],
  },
  {
    id: 'rinoplastia',
    name: 'Rinoplastia',
    short: 'Cirurgia do nariz',
    icon: 'happy-outline',
    kind: 'cirurgico',
    recoveryWeeks: 8,
    highlights: [
      'Nariz entupido por algumas semanas é esperado',
      'Não assoar o nariz nem usar óculos de armação pesada por 45 dias',
      'O resultado final leva 12 meses para se definir',
    ],
  },
  {
    id: 'face_hd',
    name: 'Face HD Concept',
    short: 'Planejamento completo de rejuvenescimento facial',
    icon: 'sparkles-outline',
    kind: 'cirurgico',
    brandName: true,
    recoveryWeeks: 8,
    highlights: [
      'Mentoneira por 15 dias — pode retirar para comer e tomar banho',
      'Não molhar o taping (bandagem)',
      'Dormir com a cabeceira elevada reduz muito o inchaço',
      'Dormência na frente das orelhas e no pescoço é esperada',
      'Fisioterapia e drenagem são parte essencial e aceleram a recuperação',
    ],
  },
  {
    id: 'blefaroplastia',
    name: 'Blefaroplastia',
    short: 'Cirurgia das pálpebras',
    icon: 'eye-outline',
    kind: 'cirurgico',
    recoveryWeeks: 3,
    highlights: [
      'Roxo ao redor dos olhos é esperado e some em 2 a 3 semanas',
      'Compressas geladas nos olhos nos primeiros dias',
      'Fita de micropore fechando os olhos por 2 semanas — previne olho seco e lacrimejamento',
      'Usar a pomada e o colírio prescritos',
      'Evitar telas e leitura prolongada nos primeiros dias',
    ],
  },
  {
    id: 'otoplastia',
    name: 'Otoplastia',
    short: 'Cirurgia das orelhas',
    icon: 'ear-outline',
    kind: 'cirurgico',
    recoveryWeeks: 3,
    highlights: [
      'Faixa elástica conforme orientação, principalmente para dormir',
      'Evitar dormir de lado sobre as orelhas',
      'Dor súbita e intensa em uma orelha precisa ser avaliada',
    ],
  },
  {
    id: 'ginecomastia',
    name: 'Correção de ginecomastia',
    short: 'Cirurgia da mama masculina',
    icon: 'body-outline',
    kind: 'cirurgico',
    recoveryWeeks: 5,
    highlights: [
      'Malha compressiva em tempo integral',
      'Endurecimento sob a aréola por alguns meses é esperado',
      'Evitar exercícios de peito por 6 a 8 semanas',
    ],
  },
  {
    id: 'pos_bariatrica',
    name: 'Cirurgia pós-bariátrica',
    short: 'Retirada de excesso de pele',
    icon: 'body-outline',
    kind: 'cirurgico',
    recoveryWeeks: 10,
    highlights: [
      'Cicatrizes longas exigem cuidado e paciência redobrados',
      'Manter a suplementação vitamínica orientada pelo seu médico',
      'Drenos podem permanecer por mais tempo que em outras cirurgias',
    ],
  },
  {
    id: 'toxina',
    name: 'Toxina botulínica',
    short: 'Botox — rugas de expressão',
    icon: 'sparkles-outline',
    kind: 'ambulatorial',
    recoveryWeeks: 2,
    highlights: [
      'O efeito começa em 3 a 5 dias e se completa em 15',
      'Não deitar, não abaixar a cabeça e não fazer exercício nas primeiras 4 horas',
      'Não massagear nem esfregar a região no primeiro dia',
    ],
  },
  {
    id: 'preenchimento',
    name: 'Preenchimento',
    short: 'Ácido hialurônico',
    icon: 'water-outline',
    kind: 'ambulatorial',
    recoveryWeeks: 4,
    highlights: [
      'Inchaço e roxos nos primeiros dias são esperados',
      'Dor forte com palidez ou manchas arroxeadas na pele exige contato imediato',
      'O resultado final aparece depois que o inchaço passa, por volta de 15 dias',
    ],
  },
  {
    id: 'bioestimulador',
    name: 'Bioestimulador de colágeno',
    short: 'Estímulo de colágeno em sessões',
    icon: 'layers-outline',
    kind: 'ambulatorial',
    recoveryWeeks: 12,
    highlights: [
      'A massagem no período orientado faz parte do tratamento',
      'O resultado é progressivo: aparece entre 4 e 12 semanas',
      'Pequenos nódulos que aparecem semanas depois devem ser avaliados',
    ],
  },
  {
    id: 'laser_co2',
    name: 'Laser de CO₂',
    short: 'Laser fracionado ablativo',
    icon: 'flash-outline',
    kind: 'ambulatorial',
    recoveryWeeks: 8,
    highlights: [
      'A pele fica como uma queimadura de sol e descama entre o 3º e o 7º dia',
      'Hidratar sempre e nunca retirar as casquinhas',
      'Protetor solar rigoroso — é o que evita manchas',
    ],
  },
  {
    id: 'morpheus',
    name: 'Morpheus',
    short: 'Microagulhamento com radiofrequência',
    icon: 'grid-outline',
    kind: 'ambulatorial',
    recoveryWeeks: 10,
    highlights: [
      'As marquinhas em grade costumam sumir em uma semana, mas podem levar mais',
      'O resultado é progressivo e costuma exigir mais de uma sessão',
      'Protetor solar diário desde o dia seguinte',
    ],
  },
  {
    id: 'outro',
    name: 'Outro procedimento',
    short: 'Orientações gerais do pós-operatório',
    icon: 'medkit-outline',
    kind: 'cirurgico',
    recoveryWeeks: 6,
    highlights: [
      'Siga as orientações específicas entregues na sua alta',
      'Em caso de dúvida, fale com a equipe',
    ],
  },
];

export const procedureById = (id: ProcedureId): Procedure =>
  procedures.find((p) => p.id === id) ?? procedures[procedures.length - 1];

/**
 * Como o app se refere ao que a paciente fez. Chamar de "cirurgia" quem fez
 * uma aplicação de toxina soa errado e assusta sem motivo.
 */
export const eventNoun = (kind: ProcedureKind): string =>
  kind === 'ambulatorial' ? 'procedimento' : 'cirurgia';

/**
 * Procedimentos que reaproveitam o conteúdo de outro. O Face HD Concept é um
 * planejamento construído sobre a cirurgia de face, então quem o realizou
 * precisa de tudo o que vale para ela — sem que o catálogo tenha uma segunda
 * cópia de cada orientação, que sairia do ar na primeira correção.
 *
 * O que é exclusivo do Face HD (lipoenxertia, pescoço profundo, laser
 * associado) fica no guia próprio, onde cabe a ressalva de que nem toda
 * paciente faz todas as etapas.
 */
const conteudoHerdado: Partial<Record<ProcedureId, ProcedureId[]>> = {
  face_hd: ['face'],
  lipo_hd: ['lipoescultura'],
};

/** O nome como ele entra no meio de uma frase. */
export const inlineName = (p: Procedure): string =>
  p.brandName ? p.name : p.name.toLowerCase();

/** O procedimento e aqueles cujo conteúdo ele também recebe. */
export const contentIds = (id: ProcedureId): ProcedureId[] => [
  id,
  ...(conteudoHerdado[id] ?? []),
];

/** Se um item de conteúdo restrito a certos procedimentos vale para este. */
export const appliesToProcedure = (list: ProcedureId[] | undefined, id: ProcedureId): boolean =>
  !list || contentIds(id).some((p) => list.includes(p));

/* ------------------------------------------------------------------ *
 * Cirurgia combinada
 *
 * Operar mama e abdome no mesmo tempo cirúrgico é rotina na clínica, e uma
 * paciente assim precisa das duas orientações. Escolher só a "principal"
 * esconderia dela metade dos sinais de alarme — que é justamente o que o app
 * existe para mostrar.
 *
 * O modelo é simples: em vez de um procedimento, o perfil guarda uma lista. O
 * caso comum é uma lista de um item, e todo o resto do app não precisou saber
 * a diferença.
 * ------------------------------------------------------------------ */

/** Quais procedimentos podem entrar numa combinação. */
export const combinableProcedures = (): Procedure[] =>
  procedures.filter((p) => p.kind === 'cirurgico' && p.id !== 'outro');

/** Se o item de conteúdo vale para qualquer um dos procedimentos da paciente. */
export const appliesToAny = (list: ProcedureId[] | undefined, ids: ProcedureId[]): boolean =>
  !list || ids.some((id) => appliesToProcedure(list, id));

/**
 * O nome do que ela fez. Em combinação, todos os nomes — a paciente precisa
 * se reconhecer na tela, e "cirurgia combinada" sozinho não diz qual foi a
 * dela.
 */
export const procedureNames = (ids: ProcedureId[]): string =>
  ids.map((id) => procedureById(id).name).join(' + ');

/** Cirúrgico manda: basta uma cirurgia na lista para o percurso ser o dela. */
export const procedureKindOf = (ids: ProcedureId[]): ProcedureKind =>
  ids.some((id) => procedureById(id).kind === 'cirurgico') ? 'cirurgico' : 'ambulatorial';

/** Numa combinação, quem governa o prazo é a cirurgia de recuperação mais longa. */
export const recoveryWeeksOf = (ids: ProcedureId[]): number =>
  Math.max(...ids.map((id) => procedureById(id).recoveryWeeks));

/**
 * Os pontos de atenção de todas as cirurgias, sem repetir. Várias compartilham
 * orientações quase idênticas — "cinta compressiva em tempo integral" aparece
 * em três — e repeti-las faria a lista parecer maior do que o cuidado real.
 */
export const highlightsOf = (ids: ProcedureId[]): string[] => [
  ...new Set(ids.flatMap((id) => procedureById(id).highlights)),
];

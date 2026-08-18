import type { ProcedureId, ProcedureKind } from './procedures';

export interface Video {
  id: string;
  title: string;
  /** Uma linha sobre o que a paciente vai encontrar ali. */
  summary: string;
  /** Link do YouTube, sem o parâmetro de rastreio do compartilhamento. */
  url: string;
  /** Se preenchido, o vídeo só aparece para estes procedimentos. */
  procedures?: ProcedureId[];
  /** Se preenchido, restringe ao tipo de percurso. Ausente = vale para todos. */
  kinds?: ProcedureKind[];
  /**
   * Vídeo que faz mais sentido antes do procedimento. Além de aparecer em
   * Cuidados como os outros, sobe para a tela Hoje enquanto a data ainda não
   * chegou — é quando a paciente tem tempo de assistir e pouca coisa para ler.
   */
  preOp?: true;
  /**
   * Id de um guia de cuidados. Vídeo assim não entra na lista geral: ele mora
   * dentro do guia, que é onde a paciente chega já com a dúvida na cabeça.
   */
  guide?: string;
  /**
   * Vídeo institucional, sobre o cirurgião e não sobre um procedimento. Mora
   * no cartão "Sobre o cirurgião", na tela de contato.
   */
  sobre?: true;
  /**
   * Ids de orientações de "É normal?". Também sai da lista geral: ele aparece
   * dentro da orientação, que é onde a paciente chega assustada procurando
   * exatamente aquilo.
   */
  symptoms?: string[];
}

/**
 * Vídeos do canal do Dr. Henrique Reis, exibidos conforme o procedimento da
 * paciente. Aparecem como link: abrem no app do YouTube ou no navegador, sem
 * player embutido — o que manteria o pacote leve e a revisão das lojas
 * simples, sem conteúdo de terceiros dentro do app.
 *
 * Para acrescentar um vídeo, basta uma entrada aqui. Nenhuma tela muda.
 *
 * TÍTULOS PROVISÓRIOS: os vídeos de lipo, facelift e rinoplastia vieram da
 * clínica em lote, sem o título de cada um. A numeração é minha e serve só
 * para distingui-los na lista — precisa ser trocada pelos títulos reais.
 */
export const videos: Video[] = [
  {
    id: 'trajetoria',
    title: 'Trajetória e formação',
    summary: 'A história e a formação do Dr. Henrique Reis',
    url: 'https://youtu.be/0mpbFyMmWis',
    sobre: true,
  },
  {
    id: 'equipe',
    title: 'Nossa equipe cirúrgica',
    summary: 'Quem está com você no centro cirúrgico',
    url: 'https://youtu.be/ogH2sXFSd3E',
    sobre: true,
  },
  {
    id: 'geral',
    title: 'Tudo sobre a cirurgia plástica',
    summary: 'Uma visão geral — bom de assistir antes de operar',
    url: 'https://youtu.be/pB5Qkz9VQho',
    kinds: ['cirurgico'],
    preOp: true,
  },
  {
    id: 'pos_operatorio',
    title: 'Pós-operatório de plástica',
    summary: 'Como conduzimos a sua recuperação',
    url: 'https://youtu.be/xE_qYgZT8e0',
    kinds: ['cirurgico'],
    guide: 'hr_recovery',
  },
  {
    id: 'preciso_saber',
    title: 'O que eu preciso saber para fazer cirurgia plástica',
    summary: 'O que considerar antes de decidir e de marcar',
    url: 'https://youtu.be/PVj7A3YBv98',
    kinds: ['cirurgico'],
    preOp: true,
  },
  {
    id: 'centro_cirurgico',
    title: 'Como é por dentro do centro cirúrgico',
    summary: 'Onde a sua cirurgia acontece, por dentro',
    url: 'https://youtu.be/Jhb_WlXkHfw',
    kinds: ['cirurgico'],
    preOp: true,
  },
  {
    id: 'combinadas',
    title: 'Cirurgias combinadas',
    summary: 'Quando faz sentido reunir mais de um procedimento',
    url: 'https://youtu.be/EpP4ETweqy8',
    kinds: ['cirurgico'],
  },
  {
    id: 'inverno',
    title: 'Cirurgia plástica no inverno',
    summary: 'Por que a estação influencia na escolha da data',
    url: 'https://youtu.be/g6My7N-sXXs',
    kinds: ['cirurgico'],
    preOp: true,
  },
  {
    id: 'mitos',
    title: 'Mitos e verdades da cirurgia plástica',
    summary: 'O que se fala por aí e o que a prática mostra',
    url: 'https://youtu.be/CJyWBW8CyHs',
    kinds: ['cirurgico'],
  },
  {
    id: 'harmonizacao',
    title: 'Harmonização facial',
    summary: 'Toxina, preenchimento e o que cada um faz',
    url: 'https://youtu.be/Pn71kYdBkP4',
    procedures: ['toxina', 'preenchimento', 'bioestimulador'],
  },
  {
    id: 'botox',
    title: 'Botox',
    summary: 'Como age a toxina botulínica e o que esperar dela',
    url: 'https://youtu.be/iAkeneffGpg',
    procedures: ['toxina'],
  },
  {
    id: 'morpheus',
    title: 'Morpheus — vídeo 1',
    summary: 'Como funciona o tratamento e o que esperar dele',
    url: 'https://youtu.be/I2-r8eElMF8',
    procedures: ['morpheus'],
  },
  {
    id: 'morpheus_2',
    title: 'Morpheus — vídeo 2',
    summary: 'Dr. Henrique Reis fala sobre o tratamento',
    url: 'https://youtu.be/MOqbQayLHBM',
    procedures: ['morpheus'],
  },
  {
    id: 'fibrose_seroma',
    title: 'Fibrose e seroma',
    summary: 'Por que acontecem e como são tratados',
    url: 'https://youtu.be/FVNBljo2oPM',
    kinds: ['cirurgico'],
    symptoms: ['endurecimento', 'seroma'],
  },
  {
    id: 'exercicio',
    title: 'Cirurgia plástica e exercício físico',
    summary: 'Quando voltar e por que a pressa atrapalha',
    url: 'https://youtu.be/mQEhepALp30',
    kinds: ['cirurgico'],
    guide: 'rotina',
  },
  {
    id: 'malhas',
    title: 'Nossas malhas personalizadas',
    summary: 'Como a malha é feita para você e como usá-la',
    url: 'https://youtu.be/RzUG5nskTKg',
    kinds: ['cirurgico'],
    guide: 'compressao',
  },
  {
    id: 'cicatriz',
    title: 'A cicatriz da cirurgia plástica',
    summary: 'Como ela evolui e o que realmente ajuda',
    url: 'https://youtu.be/WCwsu0EgoTM',
    kinds: ['cirurgico'],
    guide: 'cicatriz',
  },
  {
    id: 'protese',
    title: 'Prótese de silicone',
    summary: 'A mamoplastia de aumento, do planejamento ao resultado',
    url: 'https://youtu.be/P8LSqgT_LW8',
    procedures: ['mamoplastia_aumento'],
  },
  {
    id: 'mastopexia',
    title: 'Mastopexia com prótese',
    summary: 'Como é a cirurgia, do planejamento ao resultado',
    url: 'https://youtu.be/5RLtz_8A-bU',
    procedures: ['mastopexia'],
  },
  {
    id: 'mastopexia_sem_protese',
    title: 'Mastopexia sem prótese',
    summary: 'O levantamento das mamas sem uso de implante',
    url: 'https://youtu.be/u2nFFnwiXBk',
    procedures: ['mastopexia'],
  },
  {
    id: 'mamoplastia_redutora',
    title: 'Mamoplastia redutora',
    summary: 'A redução das mamas, do planejamento ao resultado',
    url: 'https://youtu.be/g-BBGZph6xQ',
    procedures: ['mamoplastia_redutora'],
  },
  {
    id: 'pos_bariatrica',
    title: 'Cirurgia pós-bariátrica',
    summary: 'A retirada do excesso de pele depois da grande perda de peso',
    url: 'https://youtu.be/Eh__d2vjhK4',
    procedures: ['pos_bariatrica'],
  },
  {
    id: 'ginecomastia',
    title: 'Ginecomastia',
    summary: 'A cirurgia da mama masculina, do planejamento ao resultado',
    url: 'https://youtu.be/aBmEN_YV8_g',
    procedures: ['ginecomastia'],
  },
  {
    id: 'otoplastia',
    title: 'Otoplastia',
    summary: 'A cirurgia das orelhas, do planejamento ao resultado',
    url: 'https://youtu.be/RDSSnaRloEE',
    procedures: ['otoplastia'],
  },
  {
    id: 'blefaroplastia',
    title: 'Blefaroplastia',
    summary: 'A cirurgia das pálpebras, do planejamento ao resultado',
    url: 'https://youtu.be/n-bvGxN_O0M',
    procedures: ['blefaroplastia'],
  },
  {
    id: 'abdominoplastia',
    title: 'Abdominoplastia',
    summary: 'Como é a cirurgia, do planejamento ao resultado',
    url: 'https://youtu.be/dPUpOOxFRr8',
    procedures: ['abdominoplastia'],
  },
  {
    id: 'rinoplastia_1',
    title: 'Rinoplastia — vídeo 1',
    summary: 'Dr. Henrique Reis fala sobre a cirurgia do nariz',
    url: 'https://youtu.be/9CLobhNmmvE',
    procedures: ['rinoplastia'],
  },
  {
    id: 'rinoplastia_2',
    title: 'Rinoplastia — vídeo 2',
    summary: 'Dr. Henrique Reis fala sobre a cirurgia do nariz',
    url: 'https://youtu.be/2ncYLc1kOdg',
    procedures: ['rinoplastia'],
  },
  {
    id: 'rinoplastia_3',
    title: 'Rinoplastia — vídeo 3',
    summary: 'Dr. Henrique Reis fala sobre a cirurgia do nariz',
    url: 'https://youtu.be/KQmuGYKhaH8',
    procedures: ['rinoplastia'],
  },
  {
    id: 'facelift_1',
    title: 'Facelift — parte 1',
    summary: 'Dr. Henrique Reis explica o rejuvenescimento facial cirúrgico',
    url: 'https://youtu.be/8ZIfYre0uKU',
    procedures: ['face_hd'],
  },
  {
    id: 'facelift_2',
    title: 'Facelift — parte 2',
    summary: 'Continuação, com o que esperar da recuperação',
    url: 'https://youtu.be/5OwJWMBMo20',
    procedures: ['face_hd'],
  },
  {
    id: 'bodytite',
    title: 'BodyTite na prática, no centro cirúrgico',
    summary: 'A tecnologia em uso durante a cirurgia',
    url: 'https://youtu.be/fgwiOcY0YUQ',
    procedures: ['lipo_hd', 'lipoescultura'],
    guide: 'tecnologias',
  },
  {
    id: 'bodytite_retracao',
    title: 'O que é o BodyTite',
    summary: 'Como ele age na retração da pele',
    url: 'https://youtu.be/Cd4TBH1Bwy4',
    procedures: ['lipo_hd', 'lipoescultura'],
    guide: 'tecnologias',
  },
  {
    id: 'lipo_1',
    title: 'Lipoaspiração e lipoenxertia — parte 1',
    summary: 'Dr. Henrique Reis explica como a cirurgia é planejada e feita',
    url: 'https://youtu.be/YUS3MWIf75w',
    procedures: ['lipo_hd', 'lipoescultura'],
  },
  {
    id: 'lipo_2',
    title: 'Lipoaspiração e lipoenxertia — parte 2',
    summary: 'Continuação, com o que esperar do resultado e da recuperação',
    url: 'https://youtu.be/JR4c_UespyI',
    procedures: ['lipo_hd', 'lipoescultura'],
  },
];

/**
 * Seleciona os vídeos de uma tela.
 *
 * Sem `guide`, devolve os da lista geral — os que não pertencem a um guia
 * específico. Com `guide`, devolve só os daquele guia. É o que garante que
 * nenhum vídeo apareça duas vezes para a mesma paciente.
 */
export const videosFor = ({
  procedures,
  kind,
  guide,
  symptom,
  apenasPreOp = false,
}: {
  /** Os procedimentos da paciente — mais de um em cirurgia combinada. */
  procedures: ProcedureId[];
  kind: ProcedureKind;
  guide?: string;
  symptom?: string;
  apenasPreOp?: boolean;
}): Video[] =>
  videos.filter(
    (v) =>
      v.guide === guide &&
      (symptom ? v.symptoms?.includes(symptom) : !v.symptoms) &&
      !v.sobre &&
      (!apenasPreOp || v.preOp) &&
      (!v.kinds || v.kinds.includes(kind)) &&
      (!v.procedures || procedures.some((p) => v.procedures!.includes(p))),
  );

/** Vídeos institucionais, exibidos no cartão sobre o cirurgião. */
export const videosSobre = (): Video[] => videos.filter((v) => v.sobre);

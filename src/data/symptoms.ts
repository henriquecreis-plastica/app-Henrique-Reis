import type { Severity } from '../theme';
import type { IconName, ProcedureId, ProcedureKind } from './procedures';

export type SymptomGroup =
  | 'geral'
  | 'dor'
  | 'inchaco'
  | 'cicatriz'
  | 'emocional'
  | 'mama'
  | 'abdome'
  | 'nariz'
  | 'olhos'
  | 'pele';

export interface Symptom {
  id: string;
  title: string;
  severity: Severity;
  groups: SymptomGroup[];
  /** Quando costuma acontecer. Aparece como legenda no card. */
  when: string;
  /** Frase curta de resposta — o que a paciente precisa entender primeiro. */
  summary: string;
  /** Por que acontece. */
  why: string[];
  /** O que fazer. */
  action: string[];
  /** Se preenchido, o sintoma só aparece para estes procedimentos. */
  procedures?: ProcedureId[];
  /**
   * Se preenchido, restringe ao tipo de percurso. Ausente = vale para todos.
   * Sem isso, quem fez toxina botulínica receberia orientação sobre dreno,
   * cinta e ponto que abriu.
   */
  kinds?: ProcedureKind[];
  /** Termos extras para a busca. */
  keywords?: string[];
}

export const groupLabels: Record<SymptomGroup, { label: string; icon: IconName }> = {
  geral: { label: 'Geral', icon: 'pulse-outline' },
  dor: { label: 'Dor', icon: 'flash-outline' },
  inchaco: { label: 'Inchaço e roxos', icon: 'water-outline' },
  cicatriz: { label: 'Cicatriz', icon: 'bandage-outline' },
  emocional: { label: 'Emocional', icon: 'happy-outline' },
  mama: { label: 'Mamas', icon: 'heart-outline' },
  abdome: { label: 'Abdome', icon: 'body-outline' },
  nariz: { label: 'Nariz', icon: 'triangle-outline' },
  olhos: { label: 'Olhos', icon: 'eye-outline' },
  pele: { label: 'Pele', icon: 'color-palette-outline' },
};

export const symptoms: Symptom[] = [
  // ----------------------------------------------------------------
  // URGENTE — contato imediato com a equipe / pronto-socorro
  // ----------------------------------------------------------------
  {
    id: 'falta_de_ar',
    kinds: ['cirurgico'],
    title: 'Falta de ar ou dor no peito',
    severity: 'urgent',
    groups: ['geral'],
    when: 'Qualquer momento do pós-operatório',
    summary:
      'Procure atendimento de emergência agora. Não espere para ver se melhora e não dirija até o hospital.',
    why: [
      'Pode indicar um coágulo que se deslocou para o pulmão, uma complicação rara mas grave.',
      'Também pode estar ligado a alterações cardíacas ou respiratórias que precisam de avaliação imediata.',
    ],
    action: [
      'Ligue para o SAMU (192) ou vá ao pronto-socorro mais próximo agora',
      'Avise a equipe do Dr. Henrique pelo contato de urgência',
      'Informe no atendimento a cirurgia realizada e a data',
    ],
    keywords: ['respirar', 'sufoco', 'peito', 'coração', 'embolia'],
  },
  {
    id: 'dor_panturrilha',
    kinds: ['cirurgico'],
    title: 'Dor e inchaço em apenas uma perna',
    severity: 'urgent',
    groups: ['geral', 'dor'],
    when: 'Mais frequente nas primeiras 2 semanas',
    summary:
      'Dor forte na batata da perna, com inchaço, calor ou vermelhidão em apenas um lado precisa de avaliação hoje.',
    why: [
      'Pode ser trombose venosa profunda — um coágulo na circulação da perna.',
      'Quanto mais cedo tratada, mais simples é a resolução.',
    ],
    action: [
      'Entre em contato com a equipe imediatamente',
      'Não massageie a perna e não aplique calor',
      'Procure um pronto-socorro se não conseguir contato rápido',
    ],
    keywords: ['trombose', 'panturrilha', 'perna inchada', 'coágulo'],
  },
  {
    id: 'febre_alta',
    kinds: ['cirurgico'],
    title: 'Febre acima de 38 °C',
    severity: 'urgent',
    groups: ['geral'],
    when: 'A partir do 3º dia é o sinal mais relevante',
    summary:
      'Febre alta, especialmente com calafrios ou piora da dor, precisa ser comunicada no mesmo dia.',
    why: [
      'Pode ser o primeiro sinal de infecção na área operada.',
      'Nas primeiras 48 horas, uma temperatura levemente elevada pode ser apenas reação à cirurgia — mas acima de 38 °C sempre deve ser avaliada.',
    ],
    action: [
      'Meça a temperatura e anote o horário',
      'Entre em contato com a equipe informando o valor',
      'Não inicie antibiótico por conta própria',
    ],
    keywords: ['febre', 'calafrio', 'temperatura', 'infecção'],
  },
  {
    id: 'sangramento_ativo',
    kinds: ['cirurgico'],
    title: 'Sangramento que encharca o curativo',
    severity: 'urgent',
    groups: ['cicatriz'],
    when: 'Mais comum nas primeiras 48 horas',
    summary:
      'Sangue vivo em quantidade, que encharca o curativo rapidamente ou escorre, exige contato imediato.',
    why: [
      'Pequenas manchas rosadas ou avermelhadas no curativo são esperadas.',
      'Às vezes o curativo da lipoaspiração sangra um pouco ou sai um líquido vermelho claro — isso é normal.',
      'Sangramento contínuo pode indicar um vaso que voltou a sangrar.',
    ],
    action: [
      'Faça compressão firme sobre o local com um pano limpo',
      'Ligue para a equipe imediatamente',
      'Vá ao pronto-socorro se o sangramento não parar com a compressão',
    ],
    keywords: ['sangue', 'sangrando', 'curativo encharcado'],
  },
  {
    id: 'hematoma',
    kinds: ['cirurgico'],
    title: 'Um lado inchou muito mais, de repente',
    severity: 'urgent',
    groups: ['inchaco', 'mama'],
    when: 'Geralmente nas primeiras 72 horas',
    summary:
      'Aumento rápido e assimétrico de volume, com dor forte e endurecimento, precisa ser avaliado no mesmo dia.',
    why: [
      'Pode ser um hematoma — acúmulo de sangue que às vezes precisa ser drenado.',
      'Quanto mais cedo tratado, menor o impacto no resultado final.',
    ],
    action: [
      'Entre em contato com a equipe agora',
      'Mantenha a compressão e evite qualquer esforço',
      'Fotografe os dois lados para mostrar a diferença',
    ],
    keywords: ['hematoma', 'inchou de repente', 'assimétrico', 'endurecido'],
  },
  {
    id: 'infeccao',
    kinds: ['cirurgico'],
    title: 'Vermelhidão que se espalha, calor e pus',
    severity: 'urgent',
    groups: ['cicatriz'],
    when: 'Mais comum entre o 4º e o 10º dia',
    summary:
      'Vermelhidão que aumenta a cada dia, pele quente, dor crescente ou secreção com pus e mau cheiro indicam infecção.',
    why: [
      'Uma borda rosada fina na cicatriz é esperada nos primeiros dias.',
      'O que preocupa é a vermelhidão que se espalha, associada a dor que piora em vez de melhorar.',
    ],
    action: [
      'Fotografe a área com boa luz e envie para a equipe',
      'Entre em contato no mesmo dia',
      'Não aplique pomadas ou produtos caseiros sobre a ferida',
    ],
    keywords: ['pus', 'secreção', 'infecção', 'vermelho', 'cheiro ruim'],
  },
  {
    id: 'necrose',
    kinds: ['cirurgico'],
    title: 'Pele escurecida, arroxeada ou preta na cicatriz',
    severity: 'urgent',
    groups: ['cicatriz'],
    when: 'Entre o 3º e o 14º dia',
    summary:
      'Área da pele que fica escura, endurecida e não clareia precisa ser avaliada rapidamente.',
    why: [
      'Pode indicar sofrimento de circulação naquela região da pele.',
      'Quanto antes acompanhada, menor o impacto na cicatriz final.',
    ],
    action: [
      'Fotografe e envie para a equipe hoje',
      'Não retire crostas nem esfregue o local',
      'Mantenha a área limpa e seca conforme orientado',
    ],
    keywords: ['necrose', 'preto', 'roxo escuro', 'pele morrendo'],
  },
  {
    id: 'dor_incontrolavel',
    kinds: ['cirurgico'],
    title: 'Dor que não melhora com a medicação',
    severity: 'urgent',
    groups: ['dor'],
    when: 'Qualquer momento',
    summary:
      'Dor forte que piora a cada dia, ou que a medicação prescrita não alivia, não é parte esperada da recuperação.',
    why: [
      'A dor do pós-operatório deve diminuir progressivamente a partir do 3º ou 4º dia.',
      'Dor que aumenta pode sinalizar hematoma, infecção ou compressão excessiva.',
    ],
    action: [
      'Confira se está tomando os remédios nos horários certos',
      'Verifique se a cinta ou o sutiã não estão apertados demais',
      'Entre em contato com a equipe se a dor persistir',
    ],
    keywords: ['dor forte', 'não passa', 'piorando'],
  },
  {
    id: 'vomito_persistente',
    kinds: ['cirurgico'],
    title: 'Vômitos que não param ou não conseguir beber água',
    severity: 'urgent',
    groups: ['geral'],
    when: 'Primeiras 48 horas, geralmente',
    summary:
      'Enjoo leve após a anestesia é comum. Vômitos repetidos por mais de algumas horas exigem contato.',
    why: [
      'Impede a tomada correta dos medicamentos e leva à desidratação.',
      'Pode ser reação a um dos remédios prescritos, que talvez precise ser trocado.',
    ],
    action: [
      'Entre em contato com a equipe para ajuste da medicação',
      'Tente pequenos goles de água gelada enquanto aguarda',
      'Procure atendimento se não conseguir ingerir líquidos por mais de 6 horas',
    ],
    keywords: ['vômito', 'enjoo', 'náusea', 'desidratação'],
  },
  {
    id: 'visao',
    title: 'Perda de visão ou dor forte no olho',
    severity: 'urgent',
    groups: ['olhos'],
    procedures: ['blefaroplastia', 'face'],
    when: 'Qualquer momento após a cirurgia',
    summary:
      'Queda da visão, visão dupla persistente ou dor ocular intensa é uma emergência oftalmológica.',
    why: ['Situação rara, mas que precisa de avaliação em caráter imediato.'],
    action: [
      'Procure um pronto-socorro oftalmológico agora',
      'Avise a equipe pelo contato de urgência',
    ],
    keywords: ['visão', 'enxergar', 'olho', 'cego'],
  },
  {
    id: 'sangramento_nasal',
    title: 'Sangramento pelo nariz que não para',
    severity: 'urgent',
    groups: ['nariz'],
    procedures: ['rinoplastia'],
    when: 'Primeiras 2 semanas',
    summary:
      'Pequenas manchas de sangue são esperadas. Sangramento contínuo por mais de 15 minutos precisa de avaliação.',
    why: ['A mucosa nasal está cicatrizando e pode sangrar com esforço, calor ou pressão.'],
    action: [
      'Sente-se, incline a cabeça levemente para a frente e comprima a base do nariz',
      'Aplique compressa fria na testa e na nuca',
      'Entre em contato com a equipe se não parar em 15 minutos',
    ],
    keywords: ['sangramento nasal', 'epistaxe', 'nariz sangrando'],
  },

  // ----------------------------------------------------------------
  // ATENÇÃO — avaliar e comunicar no próximo contato
  // ----------------------------------------------------------------
  {
    id: 'abertura_ponto',
    kinds: ['cirurgico'],
    title: 'Um ponto abriu ou a cicatriz separou um pouco',
    severity: 'attention',
    groups: ['cicatriz'],
    when: 'Entre o 7º e o 21º dia',
    summary:
      'Pequenas aberturas em pontos de maior tensão são relativamente comuns e costumam fechar sozinhas com curativo.',
    why: [
      'Os encontros de cicatrizes, como o "T" da mama e as extremidades do abdome, sofrem mais tensão.',
      'Na maioria das vezes a resolução é apenas com cuidado local.',
    ],
    action: [
      'Fotografe e envie para a equipe',
      'Mantenha a área limpa e seca',
      'Evite qualquer esforço que estique a região',
    ],
    keywords: ['ponto abriu', 'deiscência', 'abriu a cicatriz'],
  },
  {
    id: 'seroma',
    kinds: ['cirurgico'],
    title: 'Inchaço mole que "balança" ao toque',
    severity: 'attention',
    groups: ['inchaco', 'abdome'],
    when: 'Entre a 2ª e a 6ª semana',
    summary:
      'Acúmulo de líquido localizado, com sensação de bolsa d’água, deve ser avaliado — a drenagem no consultório é simples.',
    why: [
      'É o seroma: líquido que o corpo produz no espaço criado pela cirurgia.',
      'É uma intercorrência comum e na maioria das vezes resolvida em consulta.',
    ],
    action: [
      'Agende avaliação com a equipe',
      'Mantenha a cinta compressiva com rigor',
      'Não tente drenar ou pressionar o local por conta própria',
    ],
    keywords: ['seroma', 'líquido', 'bolsa d’água', 'balança'],
  },
  {
    id: 'saida_liquido',
    kinds: ['cirurgico'],
    title: 'Saída de líquido amarelado pela cicatriz',
    severity: 'attention',
    groups: ['cicatriz'],
    when: 'Da 2ª à 6ª semana',
    summary:
      'Líquido claro ou amarelo-citrino, sem cheiro, geralmente é seroma drenando sozinho. Se tiver pus ou odor, trate como urgente.',
    why: ['O corpo encontra uma saída natural para o líquido acumulado.'],
    action: [
      'Troque o curativo e registre a quantidade por dia',
      'Comunique a equipe no mesmo dia',
      'Observe cor e cheiro — secreção esbranquiçada com odor exige contato imediato',
    ],
    keywords: ['líquido', 'drenando', 'amarelo', 'saindo água'],
  },
  {
    id: 'intestino_preso',
    kinds: ['cirurgico'],
    title: 'Intestino preso há mais de 3 dias',
    severity: 'attention',
    groups: ['geral'],
    when: 'Primeira semana',
    summary:
      'Muito frequente por causa dos analgésicos e do repouso. Vale ajustar antes que gere desconforto abdominal.',
    why: [
      'Analgésicos derivados de opioides reduzem o trânsito intestinal.',
      'A menor movimentação e a mudança na alimentação contribuem.',
    ],
    action: [
      'Aumente a ingestão de água e fibras',
      'Caminhe dentro de casa com frequência',
      'Peça à equipe a orientação de um laxante leve — não use por conta própria',
    ],
    keywords: ['constipação', 'prisão de ventre', 'não evacuo'],
  },
  {
    id: 'tontura',
    kinds: ['cirurgico'],
    title: 'Tontura ao levantar',
    severity: 'attention',
    groups: ['geral'],
    when: 'Primeira semana',
    summary:
      'Comum ao mudar de posição, principalmente com pouca ingestão de líquidos. Se houver desmaio, comunique a equipe.',
    why: [
      'Queda de pressão ao levantar, efeito de medicações e menor ingestão de alimentos.',
    ],
    action: [
      'Levante em duas etapas: sente-se, aguarde um minuto e só então fique de pé',
      'Nunca levante sozinha nos primeiros dias',
      'Aumente a ingestão de água e comunique a equipe se houver desmaio',
    ],
    keywords: ['tontura', 'desmaio', 'pressão baixa', 'vista escura'],
  },
  {
    id: 'alergia',
    title: 'Manchas vermelhas pelo corpo ou coceira intensa',
    severity: 'attention',
    groups: ['geral'],
    when: 'Primeiros dias, após iniciar as medicações',
    summary:
      'Pode ser reação alérgica a algum medicamento. Se houver inchaço nos lábios, na língua ou falta de ar, é emergência.',
    why: ['Antibióticos e analgésicos estão entre as causas mais comuns de alergia medicamentosa.'],
    action: [
      'Fotografe as manchas e comunique a equipe',
      'Não suspenda a medicação sem orientação, exceto se houver sinais graves',
      'Procure emergência se houver falta de ar ou inchaço no rosto',
    ],
    keywords: ['alergia', 'manchas', 'urticária', 'coceira forte'],
  },
  {
    id: 'cicatriz_elevada',
    kinds: ['cirurgico'],
    title: 'Cicatriz grossa, elevada e muito vermelha',
    severity: 'attention',
    groups: ['cicatriz'],
    when: 'A partir da 6ª semana',
    summary:
      'Cicatriz que engrossa e cresce além da linha original merece avaliação — o tratamento precoce funciona muito melhor.',
    why: [
      'Algumas pessoas têm tendência a cicatriz hipertrófica ou queloide.',
      'Existem tratamentos eficazes, e quanto antes iniciados, melhor o resultado.',
    ],
    action: [
      'Fotografe e leve ao retorno',
      'Mantenha proteção solar rigorosa',
      'Siga o tratamento de cicatriz indicado pela equipe',
    ],
    keywords: ['queloide', 'hipertrófica', 'cicatriz grossa', 'alta'],
  },
  {
    id: 'assimetria_tardia',
    kinds: ['cirurgico'],
    title: 'Assimetria que persiste após 3 meses',
    severity: 'attention',
    groups: ['inchaco', 'mama'],
    when: 'A partir do 3º mês',
    summary:
      'Pequenas diferenças entre os lados são normais e definitivas em qualquer corpo. Diferença marcante após 3 meses deve ser conversada no retorno.',
    why: [
      'Nas primeiras semanas a assimetria quase sempre é apenas inchaço desigual.',
      'Após a estabilização, o que persiste pode ser avaliado com calma.',
    ],
    action: [
      'Leve suas dúvidas e fotos ao retorno',
      'Evite conclusões antes de 3 a 6 meses',
    ],
    keywords: ['assimetria', 'diferente', 'um lado maior', 'torto'],
  },
  {
    id: 'contratura',
    title: 'Mama endurecendo e mudando de formato',
    severity: 'attention',
    groups: ['mama'],
    procedures: ['mamoplastia_aumento', 'mastopexia'],
    when: 'A partir do 3º mês',
    summary:
      'Endurecimento progressivo, com a mama subindo ou ficando mais redonda e dolorida, deve ser avaliado.',
    why: [
      'Pode ser contratura capsular, uma reação da cápsula que o corpo forma ao redor da prótese.',
      'É pouco frequente e tem tratamento.',
    ],
    action: [
      'Agende avaliação',
      'Compare com fotos de meses anteriores',
    ],
    keywords: ['contratura', 'endureceu', 'prótese dura', 'subiu'],
  },
  {
    id: 'formigamento_cinta',
    kinds: ['cirurgico'],
    title: 'Formigamento ou dormência causados pela cinta',
    severity: 'attention',
    groups: ['geral'],
    when: 'Enquanto usar a compressão',
    summary:
      'Cinta ou malha apertada demais pode comprimir nervos e prejudicar a circulação. Ela deve comprimir, não sufocar.',
    why: [
      'A compressão certa é firme e confortável — você deve conseguir passar dois dedos entre a cinta e a pele.',
    ],
    action: [
      'Afrouxe ou troque para o tamanho adequado',
      'Comunique a equipe se o sintoma persistir sem a cinta',
      'Procure atendimento se a pele ficar pálida, fria ou roxa',
    ],
    keywords: ['cinta apertada', 'formigamento', 'dormência', 'malha'],
  },

  // ----------------------------------------------------------------
  // ESPERADO — faz parte da recuperação
  // ----------------------------------------------------------------
  {
    id: 'inchaco',
    kinds: ['cirurgico'],
    title: 'Inchaço',
    severity: 'normal',
    groups: ['inchaco'],
    when: 'Pico entre o 2º e o 5º dia; melhora progressiva por meses',
    summary:
      'É a resposta natural do corpo ao trauma cirúrgico e o sintoma mais duradouro da recuperação.',
    why: [
      'O inchaço aumenta até o 3º dia, depois começa a ceder de forma lenta.',
      'Oscila durante o dia: melhor pela manhã, pior à noite e em dias quentes.',
      'Pode levar de 3 a 6 meses para desaparecer por completo.',
    ],
    action: [
      'Mantenha a compressão conforme orientado',
      'Faça a drenagem linfática na frequência indicada',
      'Reduza o sal e mantenha boa hidratação',
      'Descanse com a área operada elevada quando possível',
    ],
    keywords: ['edema', 'inchada', 'inchado', 'retenção'],
  },
  {
    id: 'roxos',
    kinds: ['cirurgico'],
    title: 'Roxos e manchas amareladas',
    severity: 'normal',
    groups: ['inchaco'],
    when: 'Do 2º ao 21º dia',
    summary:
      'As equimoses escurecem antes de clarear, passando por roxo, verde e amarelo até sumir.',
    why: [
      'É sangue que se espalhou pelos tecidos e está sendo reabsorvido pelo corpo.',
      'Podem migrar para baixo por efeito da gravidade — roxos que "descem" são esperados.',
    ],
    action: [
      'Nenhuma medida especial é necessária',
      'Evite anti-inflamatórios por conta própria',
      'Comunique se aparecerem roxos novos após a 3ª semana',
    ],
    keywords: ['equimose', 'roxo', 'hematoma pequeno', 'manchas'],
  },
  {
    id: 'dormencia',
    kinds: ['cirurgico'],
    title: 'Dormência na área operada',
    severity: 'normal',
    groups: ['geral'],
    when: 'Desde o 1º dia, até 6 a 12 meses',
    summary:
      'Perda de sensibilidade ao redor das cicatrizes é esperada e recupera aos poucos.',
    why: [
      'Pequenos nervos da pele são atravessados durante a cirurgia e se regeneram lentamente.',
      'A volta da sensibilidade vem acompanhada de formigamento e fisgadas — é um bom sinal.',
    ],
    action: [
      'Tenha atenção redobrada com bolsa quente ou fria: a pele dormente queima sem avisar',
      'Aguarde a recuperação natural, que pode levar até um ano',
    ],
    keywords: ['dormente', 'sem sensibilidade', 'anestesiado'],
  },
  {
    id: 'fisgadas',
    kinds: ['cirurgico'],
    title: 'Fisgadas, choques e agulhadas',
    severity: 'normal',
    groups: ['dor'],
    when: 'Da 2ª semana ao 6º mês',
    summary: 'São sinais da regeneração dos nervos. Costumam ser rápidas e passageiras.',
    why: [
      'Os nervos em recuperação disparam sensações momentâneas.',
      'Tendem a ficar mais frequentes por algumas semanas e depois diminuem.',
    ],
    action: [
      'Nenhuma medida específica é necessária',
      'Se forem intensas e constantes, comente no retorno',
    ],
    keywords: ['choque', 'fisgada', 'agulhada', 'pontada'],
  },
  {
    id: 'reabsorcao_enxerto',
    kinds: ['cirurgico'],
    procedures: ['lipo_hd', 'lipoescultura', 'face_hd'],
    title: 'A área enxertada parece ter perdido volume',
    severity: 'normal',
    groups: ['inchaco'],
    when: 'Do 1º ao 6º mês',
    summary:
      'Parte da gordura enxertada é naturalmente reabsorvida pelo organismo nos primeiros meses. Isso é esperado e já entra no planejamento da cirurgia.',
    why: [
      'Nem toda a gordura transferida se integra: o corpo reabsorve uma parte ao longo das primeiras semanas.',
      'O volume que permanece depois desse período tende a se manter.',
      'O inchaço inicial também dá a impressão de um volume maior do que o que vai ficar.',
    ],
    action: [
      'Evite pressão sobre a área enxertada nas primeiras semanas',
      'Siga as orientações de posição para dormir e para sentar',
      'Não massageie a região enxertada sem orientação da equipe',
      'Avalie o resultado do enxerto entre 3 e 6 meses, no retorno',
    ],
    keywords: ['enxerto', 'graft', 'perdeu volume', 'gordura enxertada', 'reabsorção', 'diminuiu'],
  },
  {
    id: 'endurecimento',
    kinds: ['cirurgico'],
    title: 'Endurecimento e nódulos sob a pele',
    severity: 'normal',
    groups: ['inchaco'],
    when: 'Da 3ª semana ao 3º mês',
    summary:
      'Áreas endurecidas, irregulares ou com pequenos caroços fazem parte da fase de fibrose e amolecem com o tempo.',
    why: [
      'O organismo forma tecido de reparo, que é firme no início e depois amolece.',
      'É especialmente comum após lipoaspiração.',
    ],
    action: [
      'Mantenha a drenagem linfática e a compressão',
      'Não massageie com força por conta própria',
      'Comente no retorno se um endurecimento crescer ou doer muito',
    ],
    keywords: ['fibrose', 'caroço', 'duro', 'nódulo', 'irregular'],
  },
  {
    id: 'coceira',
    kinds: ['cirurgico'],
    title: 'Coceira na cicatriz',
    severity: 'normal',
    groups: ['cicatriz'],
    when: 'Da 2ª semana ao 3º mês',
    summary: 'Coceira leve acompanha a cicatrização e costuma indicar que a pele está se reparando.',
    why: ['A liberação de histamina e a pele ressecada durante a cicatrização causam prurido.'],
    action: [
      'Hidrate a pele ao redor — nunca sobre pontos ainda fechados',
      'Não coce nem retire crostas',
      'Comunique se vier acompanhada de manchas vermelhas espalhadas',
    ],
    keywords: ['coceira', 'coçando', 'prurido'],
  },
  {
    id: 'cicatriz_vermelha',
    kinds: ['cirurgico'],
    title: 'Cicatriz vermelha e endurecida',
    severity: 'normal',
    groups: ['cicatriz'],
    when: 'Do 1º ao 3º mês',
    summary:
      'A cicatriz fica mais vermelha e elevada antes de clarear. Esse é o caminho normal da maturação.',
    why: [
      'A fase inflamatória da cicatrização dura semanas e é seguida pela remodelação.',
      'O clareamento completo pode levar de 12 a 18 meses.',
    ],
    action: [
      'Protetor solar sobre a cicatriz sempre que houver exposição',
      'Siga o tratamento de cicatriz indicado',
      'Tenha paciência — julgar a cicatriz antes de 6 meses não faz sentido',
    ],
    keywords: ['cicatriz', 'vermelha', 'marca', 'clarear'],
  },
  {
    id: 'cansaco',
    kinds: ['cirurgico'],
    title: 'Cansaço e falta de energia',
    severity: 'normal',
    groups: ['geral'],
    when: 'Primeiras 2 a 4 semanas',
    summary:
      'O corpo está direcionando energia para a cicatrização. Cansar-se rápido é esperado.',
    why: [
      'A cirurgia, a anestesia e a menor alimentação reduzem a disposição.',
      'A recuperação da energia é gradual e não linear: há dias melhores e piores.',
    ],
    action: [
      'Respeite o descanso e evite comparar sua evolução com a de outras pacientes',
      'Mantenha alimentação rica em proteína',
      'Volte às atividades por etapas',
    ],
    keywords: ['cansada', 'sem energia', 'fraqueza', 'moleza'],
  },
  {
    id: 'blues',
    kinds: ['cirurgico'],
    title: 'Tristeza ou arrependimento nos primeiros dias',
    severity: 'normal',
    groups: ['emocional'],
    when: 'Entre o 3º e o 10º dia',
    summary:
      'Muitas pacientes passam por uma fase de baixa emocional. É um fenômeno conhecido e passageiro.',
    why: [
      'Cansaço, dor, inchaço, dependência de outras pessoas e o efeito das medicações se somam.',
      'Nessa fase o corpo ainda está inchado e o resultado não é visível — o que alimenta a insegurança.',
    ],
    action: [
      'Saiba que quase todas as pacientes passam por isso e melhora em poucos dias',
      'Converse com a equipe e com pessoas próximas',
      'Procure ajuda se a tristeza for intensa ou durar mais de 2 semanas',
    ],
    keywords: ['triste', 'chorando', 'arrependida', 'ansiedade', 'depressão'],
  },
  {
    id: 'sono',
    kinds: ['cirurgico'],
    title: 'Dificuldade para dormir',
    severity: 'normal',
    groups: ['geral', 'emocional'],
    when: 'Primeiras 3 semanas',
    summary:
      'Dormir numa posição diferente da habitual, com cinta e desconforto, atrapalha o sono no início.',
    why: ['A posição imposta pela cirurgia e o próprio desconforto fragmentam o sono.'],
    action: [
      'Use travesseiros de apoio para manter a posição orientada',
      'Evite cafeína no fim do dia',
      'Peça orientação à equipe antes de usar qualquer indutor de sono',
    ],
    keywords: ['insônia', 'não durmo', 'sono'],
  },
  {
    id: 'apetite',
    kinds: ['cirurgico'],
    title: 'Falta de apetite',
    severity: 'normal',
    groups: ['geral'],
    when: 'Primeira semana',
    summary: 'Comum nos primeiros dias. O importante é manter hidratação e proteína.',
    why: ['Efeito residual da anestesia, das medicações e da menor atividade física.'],
    action: [
      'Prefira refeições pequenas e frequentes',
      'Priorize proteína: ovos, carnes magras, iogurte, leguminosas',
      'Beba água ao longo de todo o dia',
    ],
    keywords: ['sem fome', 'não como', 'apetite'],
  },
  {
    id: 'liquido_rosado',
    kinds: ['cirurgico'],
    title: 'Líquido rosado no curativo',
    severity: 'normal',
    groups: ['cicatriz'],
    when: 'Primeiros 3 a 5 dias',
    summary:
      'Manchas rosadas ou avermelhadas claras no curativo são esperadas nos primeiros dias.',
    why: ['É a mistura de líquido da cicatrização com pequena quantidade de sangue.'],
    action: [
      'Troque o curativo conforme orientado',
      'Comunique se o volume aumentar ou se o líquido ficar espesso e com odor',
    ],
    keywords: ['curativo', 'rosado', 'melado'],
  },
  {
    id: 'peso_balanca',
    kinds: ['cirurgico'],
    title: 'Ganho de peso na balança',
    severity: 'normal',
    groups: ['geral', 'inchaco'],
    when: 'Primeiras 3 semanas',
    summary:
      'É comum pesar mais depois da cirurgia. É retenção de líquido, não gordura.',
    why: [
      'O organismo retém líquido como parte da resposta inflamatória.',
      'Esse peso se resolve conforme o inchaço cede.',
    ],
    action: [
      'Evite se pesar nas primeiras semanas',
      'Mantenha hidratação e reduza o sal',
    ],
    keywords: ['peso', 'balança', 'engordei', 'retenção'],
  },
  {
    id: 'menstruacao',
    kinds: ['cirurgico'],
    title: 'Alteração no ciclo menstrual',
    severity: 'normal',
    groups: ['geral'],
    when: 'Primeiro e segundo ciclos após a cirurgia',
    summary: 'Atraso ou adiantamento da menstruação após a cirurgia é frequente.',
    why: ['Estresse cirúrgico e medicações podem alterar temporariamente o ciclo.'],
    action: [
      'Nenhuma medida necessária — costuma normalizar no ciclo seguinte',
      'Comente no retorno se persistir por mais de dois ciclos',
    ],
    keywords: ['menstruação', 'ciclo', 'atraso'],
  },

  // ------- Específicos por procedimento -------
  {
    id: 'mama_alta',
    title: 'Mamas altas, duras e com formato estranho',
    severity: 'normal',
    groups: ['mama'],
    procedures: ['mamoplastia_aumento', 'mastopexia'],
    when: 'Primeiras 4 a 8 semanas',
    summary:
      'No começo as mamas ficam altas e firmes. Elas descem e naturalizam com o tempo — o processo é gradual.',
    why: [
      'O músculo e os tecidos ainda estão contraídos e a prótese precisa acomodar.',
      'O formato só se define por volta do 3º mês.',
    ],
    action: [
      'Use o sutiã cirúrgico conforme orientado',
      'Não julgue o resultado antes de 3 meses',
    ],
    keywords: ['mama alta', 'dura', 'quadrada', 'prótese alta'],
  },
  {
    id: 'mamilo_sensibilidade',
    title: 'Mamilos sem sensibilidade ou muito sensíveis',
    severity: 'normal',
    groups: ['mama'],
    procedures: ['mamoplastia_aumento', 'mastopexia', 'mamoplastia_redutora', 'ginecomastia'],
    when: 'Do 1º dia ao 6º mês',
    summary:
      'A sensibilidade dos mamilos costuma oscilar entre dormência e hipersensibilidade antes de normalizar.',
    why: ['Os nervos da região são delicados e se recuperam ao longo de meses.'],
    action: [
      'Proteja com curativo macio se o contato com o tecido incomodar',
      'Comente no retorno se não houver melhora após 6 meses',
    ],
    keywords: ['mamilo', 'aréola', 'sensível', 'dormente'],
  },
  {
    id: 'postura_curvada',
    title: 'Não conseguir ficar em pé totalmente ereta',
    severity: 'normal',
    groups: ['abdome'],
    procedures: ['abdominoplastia', 'pos_bariatrica'],
    when: 'Primeiros 7 a 14 dias',
    summary:
      'Andar levemente curvada é esperado e até desejável no início — protege a cicatriz do abdome.',
    why: ['A pele do abdome foi tracionada e precisa de alguns dias para acomodar.'],
    action: [
      'Ande curvada de forma suave nos primeiros dias',
      'Endireite a postura progressivamente a partir da 2ª semana',
      'Evite forçar a posição ereta antes do tempo',
    ],
    keywords: ['curvada', 'postura', 'ereta', 'abdome puxando'],
  },
  {
    id: 'nariz_entupido',
    title: 'Nariz entupido e respiração difícil',
    severity: 'normal',
    groups: ['nariz'],
    procedures: ['rinoplastia'],
    when: 'Primeiras 3 a 6 semanas',
    summary:
      'A obstrução nasal é esperada nas primeiras semanas e melhora conforme o inchaço interno cede.',
    why: ['A mucosa interna do nariz também incha e leva semanas para desinchar.'],
    action: [
      'Use soro fisiológico conforme orientado',
      'Não assoe o nariz até liberação',
      'Durma com a cabeceira elevada',
    ],
    keywords: ['nariz entupido', 'respirar pelo nariz', 'obstruído'],
  },
  {
    id: 'nariz_inchado',
    title: 'Ponta do nariz ainda grossa e inchada',
    severity: 'normal',
    groups: ['nariz'],
    procedures: ['rinoplastia'],
    when: 'Até 12 meses',
    summary:
      'A ponta do nariz é a última região a desinchar. O resultado final costuma levar cerca de 12 meses, e o ritmo varia de pessoa para pessoa.',
    why: ['A pele da ponta nasal é mais espessa e retém inchaço por muito mais tempo.'],
    action: [
      'Evite conclusões antes de 1 ano',
      'Siga as orientações de massagem apenas se indicadas pela equipe',
    ],
    keywords: ['ponta do nariz', 'grosso', 'inchado', 'bulboso'],
  },
  {
    id: 'olhos_secos',
    title: 'Olhos secos, ardendo ou lacrimejando',
    severity: 'normal',
    groups: ['olhos'],
    procedures: ['blefaroplastia', 'face'],
    when: 'Primeiras 3 semanas',
    summary:
      'Ressecamento e lacrimejamento alternados são comuns após cirurgia das pálpebras.',
    why: ['O inchaço altera temporariamente o fechamento das pálpebras e o filme lacrimal.'],
    action: [
      'Use a pomada e o colírio prescritos, nos horários orientados',
      'Fita de micropore fechando os olhos por 2 semanas, como orientado — é o que previne o ressecamento',
      'Compressas geladas nos primeiros dias',
      'Evite ambientes com ar-condicionado e vento direto',
      'Reduza o tempo de tela nos primeiros dias',
    ],
    keywords: ['olho seco', 'ardendo', 'lacrimejando', 'colírio'],
  },
  {
    id: 'orelha_dor',
    title: 'Desconforto e sensibilidade nas orelhas',
    severity: 'normal',
    groups: ['dor'],
    procedures: ['otoplastia'],
    when: 'Primeiras 2 semanas',
    summary:
      'Sensibilidade ao toque e incômodo com a faixa são esperados. Dor forte e súbita em uma orelha, não.',
    why: ['A cartilagem remodelada fica sensível por alguns dias.'],
    action: [
      'Use a faixa conforme orientado, sem apertar demais',
      'Evite dormir sobre as orelhas',
      'Comunique a equipe se houver dor intensa em apenas um lado',
    ],
    keywords: ['orelha', 'faixa', 'dor na orelha'],
  },
  // ----------------------------------------------------------------
  // PROCEDIMENTOS DE CONSULTÓRIO — urgente
  // ----------------------------------------------------------------
  {
    id: 'oclusao_vascular',
    kinds: ['ambulatorial'],
    procedures: ['preenchimento', 'bioestimulador'],
    title: 'Dor forte com pele branca ou manchada',
    severity: 'urgent',
    groups: ['pele', 'dor'],
    when: 'Durante ou nas primeiras horas e dias após a aplicação',
    summary:
      'Dor intensa e desproporcional, pele esbranquiçada ou com manchas arroxeadas em desenho de renda: ligue agora. O atendimento nas primeiras horas reduz muito o risco de sequela.',
    why: [
      'Pode indicar que o produto comprimiu ou entrou em um vaso, reduzindo a circulação daquela área da pele.',
      'É raro, mas o tempo importa muito: existe uma substância que dissolve o preenchimento e é usada para tratar essa situação.',
    ],
    action: [
      'Ligue para a equipe imediatamente, a qualquer hora',
      'Fotografe a área com boa luz enquanto aguarda o retorno',
      'Não massageie, não aplique gelo e não espere para ver se melhora',
    ],
    keywords: ['oclusão', 'vascular', 'branca', 'pálida', 'renda', 'livedo', 'isquemia'],
  },
  {
    id: 'visao_preenchimento',
    kinds: ['ambulatorial'],
    procedures: ['preenchimento', 'bioestimulador'],
    title: 'Alteração da visão após a aplicação',
    severity: 'urgent',
    groups: ['olhos'],
    when: 'Durante ou logo após a aplicação',
    summary:
      'Visão embaçada, visão dupla, um ponto escuro ou dor forte no olho é emergência. Procure atendimento agora.',
    why: [
      'Complicação rara, mas que exige avaliação oftalmológica imediata.',
      'Quanto mais rápido o atendimento, maior a chance de reverter.',
    ],
    action: [
      'Procure um pronto-socorro oftalmológico imediatamente',
      'Avise a equipe pelo contato de urgência no caminho',
      'Informe qual produto foi aplicado e em que região',
    ],
    keywords: ['visão', 'enxergar', 'vista', 'olho', 'cego', 'embaçado'],
  },
  {
    id: 'toxina_disfagia',
    kinds: ['ambulatorial'],
    procedures: ['toxina'],
    title: 'Dificuldade para engolir, falar ou respirar',
    severity: 'urgent',
    groups: ['geral'],
    when: 'Da primeira à segunda semana',
    summary: 'Muito raro, mas exige atendimento imediato. Não espere para ver se melhora sozinho.',
    why: ['Pode indicar difusão da toxina para além da região tratada.'],
    action: [
      'Procure um pronto-socorro agora',
      'Avise a equipe e informe a data da aplicação',
    ],
    keywords: ['engolir', 'falar', 'respirar', 'disfagia', 'voz'],
  },
  {
    id: 'infeccao_pele',
    kinds: ['ambulatorial'],
    title: 'Área quente, muito vermelha, com pus ou febre',
    severity: 'urgent',
    groups: ['pele'],
    when: 'Do 2º ao 10º dia',
    summary:
      'Vermelhidão que aumenta a cada dia, calor, dor crescente, secreção amarelada ou febre indicam infecção e precisam ser avaliados hoje.',
    why: [
      'Vermelhidão nas primeiras 48 horas é esperada; o que preocupa é a que se espalha e piora.',
      'O tratamento precoce reduz o risco de complicações e de marca na pele.',
    ],
    action: [
      'Fotografe com boa luz e envie para a equipe hoje',
      'Meça a temperatura e informe o valor',
      'Não passe pomadas nem produtos por conta própria',
    ],
    keywords: ['infecção', 'pus', 'quente', 'inflamado', 'febre'],
  },
  {
    id: 'bolha_queimadura',
    kinds: ['ambulatorial'],
    procedures: ['laser_co2', 'morpheus'],
    title: 'Bolha, ferida aberta ou dor que aumenta',
    severity: 'urgent',
    groups: ['pele'],
    when: 'Nas primeiras 72 horas',
    summary:
      'Bolhas, pele em carne viva ou dor que piora em vez de melhorar precisam ser avaliadas rapidamente.',
    why: [
      'Ardência e aspecto de queimadura solar são esperados; bolha e ferida aberta, não.',
      'A avaliação precoce reduz o risco de a pele ficar marcada.',
    ],
    action: [
      'Fotografe e envie para a equipe hoje',
      'Não estoure bolhas e não retire pele solta',
      'Mantenha a hidratação prescrita até receber orientação',
    ],
    keywords: ['bolha', 'queimadura', 'ferida', 'carne viva'],
  },

  // ----------------------------------------------------------------
  // PROCEDIMENTOS DE CONSULTÓRIO — atenção
  // ----------------------------------------------------------------
  {
    id: 'ptose_toxina',
    kinds: ['ambulatorial'],
    procedures: ['toxina'],
    title: 'Pálpebra ou sobrancelha caída',
    severity: 'attention',
    groups: ['olhos'],
    when: 'Entre o 3º e o 15º dia',
    summary:
      'É incomum, temporário e reversível. Comunique a equipe: em muitos casos há um colírio que ameniza enquanto passa.',
    why: [
      'A toxina pode atingir levemente um músculo vizinho ao tratado.',
      'O efeito é sempre passageiro e melhora ao longo de algumas semanas.',
    ],
    action: [
      'Envie uma foto de frente com o rosto relaxado e outra levantando a sobrancelha',
      'Agende avaliação com a equipe',
      'Evite massagear a região',
    ],
    keywords: ['pálpebra caída', 'ptose', 'sobrancelha', 'olho caído'],
  },
  {
    id: 'assimetria_ambulatorial',
    kinds: ['ambulatorial'],
    procedures: ['toxina', 'preenchimento'],
    title: 'Um lado ficou diferente do outro',
    severity: 'attention',
    groups: ['pele'],
    when: 'A partir do 15º dia',
    summary:
      'Antes de 15 dias o efeito ainda está se completando e a diferença costuma se resolver sozinha. Depois disso, o ajuste é simples.',
    why: [
      'A musculatura dos dois lados do rosto raramente é idêntica, e nem sempre responde igual.',
      'Pequenos retoques fazem parte do tratamento e costumam ser feitos na avaliação de retorno.',
    ],
    action: [
      'Aguarde completar 15 dias antes de avaliar',
      'Leve fotos ao retorno, com a expressão em repouso e em movimento',
    ],
    keywords: ['assimetria', 'torto', 'um lado', 'diferente', 'retoque'],
  },
  {
    id: 'nodulo_tardio',
    kinds: ['ambulatorial'],
    procedures: ['bioestimulador', 'preenchimento'],
    title: 'Caroço que persiste ou aparece semanas depois',
    severity: 'attention',
    groups: ['pele'],
    when: 'Da 3ª semana em diante',
    summary:
      'Nódulos palpáveis devem ser mostrados à equipe. Costumam ter tratamento, e quanto antes avaliados, mais simples a conduta.',
    why: [
      'Nos primeiros dias, irregularidades ao toque são esperadas e somem sozinhas.',
      'Nódulos que persistem ou surgem semanas ou meses depois — às vezes após uma infecção ou vacina — têm conduta própria.',
    ],
    action: [
      'Marque avaliação e mostre exatamente onde está',
      'Não tente desfazer o nódulo apertando por conta própria',
      'Avise se houve infecção recente, gripe ou vacinação',
    ],
    keywords: ['nódulo', 'caroço', 'bolinha', 'endurecido', 'tardio'],
  },
  {
    id: 'herpes',
    kinds: ['ambulatorial'],
    procedures: ['laser_co2', 'morpheus', 'preenchimento'],
    title: 'Bolhinhas agrupadas com ardência',
    severity: 'attention',
    groups: ['pele'],
    when: 'Do 2º ao 7º dia',
    summary:
      'Pode ser herpes reativado pelo procedimento. Precisa de medicação logo no início — avise a equipe hoje.',
    why: [
      'Quem já teve herpes labial pode reativá-lo após laser ou aplicação na região da boca.',
      'O tratamento iniciado nas primeiras horas costuma encurtar o quadro e reduzir o risco de marca.',
    ],
    action: [
      'Fotografe e envie para a equipe no mesmo dia',
      'Não estoure as bolhinhas',
      'Avise sempre, em procedimentos futuros, que já teve herpes',
    ],
    keywords: ['herpes', 'bolhinhas', 'ardência', 'lábio'],
  },
  {
    id: 'mancha_escura',
    kinds: ['ambulatorial'],
    procedures: ['laser_co2', 'morpheus'],
    title: 'Manchas escuras aparecendo depois',
    severity: 'attention',
    groups: ['pele'],
    when: 'Da 2ª semana ao 3º mês',
    summary:
      'Escurecimento da pele tratada costuma estar ligado à exposição solar e tem tratamento. Comunique no retorno.',
    why: [
      'A pele recém-tratada reage ao sol produzindo mais pigmento.',
      'É mais frequente em peles mais morenas e quando a proteção solar falha.',
    ],
    action: [
      'Reforce o protetor solar e reaplique ao longo do dia',
      'Comunique a equipe para avaliar tratamento clareador',
      'Evite exposição solar direta até a avaliação',
    ],
    keywords: ['mancha', 'escureceu', 'hiperpigmentação'],
  },
  {
    id: 'espinhas_pos_laser',
    kinds: ['ambulatorial'],
    procedures: ['laser_co2', 'morpheus'],
    title: 'Espinhas ou bolinhas brancas após o tratamento',
    severity: 'attention',
    groups: ['pele'],
    when: 'Da 2ª à 4ª semana',
    summary:
      'Acontece com alguma frequência, geralmente ligado aos cremes da recuperação. Comente no retorno para ajustar os produtos.',
    why: [
      'Cremes muito oclusivos usados na cicatrização podem obstruir os poros.',
      'A renovação acelerada da pele também favorece pequenos cistos superficiais.',
    ],
    action: [
      'Não espreme nem cutuca',
      'Leve ao retorno a lista dos produtos que está usando',
    ],
    keywords: ['espinha', 'acne', 'milium', 'bolinha branca', 'cravo'],
  },

  // ----------------------------------------------------------------
  // PROCEDIMENTOS DE CONSULTÓRIO — esperado
  // ----------------------------------------------------------------
  {
    id: 'inchaco_ambulatorial',
    kinds: ['ambulatorial'],
    title: 'Inchaço no local aplicado',
    severity: 'normal',
    groups: ['inchaco', 'pele'],
    when: 'Pico em 24 a 72 horas; resolve em cerca de 15 dias',
    summary:
      'É a reação natural da pele. O inchaço dos primeiros dias não é o seu resultado — ele ainda vai sair.',
    why: [
      'A aplicação provoca uma reação inflamatória leve e temporária.',
      'Nos lábios e ao redor dos olhos o inchaço é mais evidente e também mais rápido de resolver.',
    ],
    action: [
      'Compressa fria nas primeiras 24 horas, se orientado',
      'Dormir com a cabeceira elevada',
      'Reduzir o sal e manter boa hidratação',
      'Evitar avaliar o resultado antes de 15 dias',
    ],
    keywords: ['inchado', 'inchaço', 'edema', 'lábio inchado'],
  },
  {
    id: 'roxos_ambulatorial',
    kinds: ['ambulatorial'],
    title: 'Roxos nos pontos de aplicação',
    severity: 'normal',
    groups: ['inchaco', 'pele'],
    when: 'Do 1º ao 14º dia',
    summary:
      'Muito comum, principalmente ao redor dos olhos e nos lábios. Some sozinho e pode ser coberto com maquiagem após 24 horas.',
    why: [
      'A agulha pode atingir pequenos vasos da pele, sem nenhuma consequência.',
      'Anti-inflamatórios, ômega 3 e álcool nos dias anteriores aumentam a chance de roxo.',
    ],
    action: [
      'Compressa fria nas primeiras 24 horas',
      'Maquiagem corretiva liberada após 24 horas, salvo outra orientação',
      'Avisar antes do próximo procedimento se costuma marcar com facilidade',
    ],
    keywords: ['roxo', 'hematoma', 'mancha roxa', 'equimose'],
  },
  {
    id: 'toxina_demora',
    kinds: ['ambulatorial'],
    procedures: ['toxina'],
    title: 'Ainda não vejo efeito nenhum',
    severity: 'normal',
    groups: ['pele'],
    when: 'Primeiros dias',
    summary:
      'O efeito começa entre o 3º e o 5º dia e se completa por volta do 15º. Antes disso, é cedo.',
    why: [
      'A toxina age gradualmente sobre a musculatura, não de forma imediata.',
      'O tempo até o efeito completo varia de pessoa para pessoa.',
    ],
    action: [
      'Aguarde 15 dias antes de avaliar',
      'Se ao completar 15 dias o efeito estiver aquém do esperado, agende a avaliação de retoque',
    ],
    keywords: ['sem efeito', 'não fez efeito', 'demora', 'quando aparece'],
  },
  {
    id: 'peso_testa',
    kinds: ['ambulatorial'],
    procedures: ['toxina'],
    title: 'Sensação de peso na testa e dor de cabeça leve',
    severity: 'normal',
    groups: ['geral', 'pele'],
    when: 'Primeiras duas semanas',
    summary:
      'Sensação de peso ou pressão na testa é comum enquanto a musculatura se adapta. Passa sozinha.',
    why: [
      'A musculatura da testa deixa de trabalhar como antes e o corpo leva alguns dias para se acostumar.',
      'Dor de cabeça leve nas primeiras 48 horas também é descrita com frequência.',
    ],
    action: [
      'Analgésico simples, se necessário e liberado pela equipe',
      'Comunicar se a dor for forte ou durar mais de três dias',
    ],
    keywords: ['peso', 'testa', 'dor de cabeça', 'pressão', 'cefaleia'],
  },
  {
    id: 'pele_laser',
    kinds: ['ambulatorial'],
    procedures: ['laser_co2', 'morpheus'],
    title: 'Pele vermelha, ardida e descamando',
    severity: 'normal',
    groups: ['pele'],
    when: 'Do 1º ao 7º dia',
    summary:
      'A pele fica com aspecto de queimadura de sol, forma casquinhas finas e descama. É exatamente o esperado.',
    why: [
      'O laser provoca uma renovação controlada da pele; a descamação é essa troca acontecendo.',
      'A ardência é mais forte nas primeiras 48 horas e melhora rápido.',
    ],
    action: [
      'Hidratar com o creme indicado, quantas vezes for preciso',
      'Compressa fria nas primeiras horas, se orientado',
      'Nunca puxar casquinha nem esfregar a pele — é o que evita mancha e marca',
      'Protetor solar assim que liberado, sem exceção',
    ],
    keywords: ['descamando', 'casquinha', 'ardendo', 'vermelha', 'queimadura de sol'],
  },
  {
    id: 'grade_morpheus',
    kinds: ['ambulatorial'],
    procedures: ['morpheus'],
    title: 'Marquinhas em grade na pele',
    severity: 'normal',
    groups: ['pele'],
    when: 'Do 1º dia até algumas semanas',
    summary:
      'O desenho quadriculado de pontinhos é a marca do aparelho. Na maioria das pacientes some entre o 2º e o 7º dia, mas pode levar semanas — e há casos em que passa de 30 dias.',
    why: [
      'Cada pontinho corresponde a uma microagulha, e a pele leva o seu tempo para uniformizar a cor.',
      'Quanto mais profundo o ajuste do aparelho, mais tempo as marcas costumam levar.',
      'Pele mais morena e exposição solar prolongam bastante esse período.',
      'Demorar não significa que algo deu errado — é uma variação individual.',
    ],
    action: [
      'Manter a pele hidratada e limpa',
      'Protetor solar todos os dias: é o que mais acelera o desaparecimento das marcas',
      'Maquiagem liberada geralmente após 24 a 48 horas, conforme orientação',
      'Comunicar a equipe se as marcas escurecerem em vez de clarear',
    ],
    keywords: ['grade', 'quadriculado', 'pontinhos', 'marquinhas'],
  },
  {
    id: 'pele_rosada',
    kinds: ['ambulatorial'],
    procedures: ['laser_co2', 'morpheus'],
    title: 'Pele rosada por semanas',
    severity: 'normal',
    groups: ['pele'],
    when: 'Da 2ª semana ao 3º mês',
    summary:
      'Depois da descamação a pele fica rosada por um bom tempo. Faz parte, e a maquiagem cobre bem.',
    why: [
      'A pele nova é mais fina e mais irrigada, e vai clareando conforme amadurece.',
      'Quanto mais profundo o tratamento, mais tempo leva para perder o tom rosado.',
    ],
    action: [
      'Protetor solar todos os dias, inclusive nublado',
      'Maquiagem liberada assim que a pele estiver fechada',
      'Evitar ácidos e esfoliantes até liberação',
    ],
    keywords: ['rosada', 'vermelhidão', 'rosa', 'eritema'],
  },
  {
    id: 'sensibilidade_toque',
    kinds: ['ambulatorial'],
    title: 'Área sensível ou dolorida ao toque',
    severity: 'normal',
    groups: ['dor', 'pele'],
    when: 'Primeiros 3 a 7 dias',
    summary:
      'Sensibilidade ao encostar, mastigar ou deitar sobre a região é esperada e passa em poucos dias.',
    why: ['A pele e os tecidos ao redor reagem à aplicação e ficam temporariamente sensíveis.'],
    action: [
      'Analgésico simples, se necessário e liberado',
      'Evitar pressionar a região e dormir sobre ela',
      'Comunicar se a dor for forte, crescente ou vier com mudança de cor da pele',
    ],
    keywords: ['dolorido', 'sensível', 'dói ao tocar'],
  },
  {
    id: 'irregularidade_inicial',
    kinds: ['ambulatorial'],
    procedures: ['preenchimento', 'bioestimulador'],
    title: 'Sinto pequenas irregularidades ao toque',
    severity: 'normal',
    groups: ['pele'],
    when: 'Primeiras 2 semanas',
    summary:
      'Nos primeiros dias é comum sentir o produto ao apalpar. Ele se acomoda e a sensação desaparece.',
    why: [
      'O produto ainda está se distribuindo e há inchaço por cima dele.',
      'A avaliação do contorno só faz sentido depois de 30 dias.',
    ],
    action: [
      'Seguir a orientação de massagem quando houver — em alguns tratamentos ela faz parte do protocolo',
      'Não massagear por conta própria quando não houver essa orientação',
      'Levar a observação ao retorno se persistir após 3 semanas',
    ],
    keywords: ['irregular', 'sinto o produto', 'caroço', 'ondulado'],
  },
];

export const symptomById = (id: string) => symptoms.find((s) => s.id === id);

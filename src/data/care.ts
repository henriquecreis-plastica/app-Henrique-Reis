import type { IconName, ProcedureId, ProcedureKind } from './procedures';

export interface CareSection {
  heading: string;
  /** Texto corrido, para o que não é lista de ações. */
  paragraphs?: string[];
  items?: string[];
}

export interface CareGuide {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  sections: CareSection[];
  /** Se preenchido, o guia só aparece para estes procedimentos. */
  procedures?: ProcedureId[];
  /**
   * Aparece para todos, menos estes. É para quando um procedimento tem a sua
   * própria versão da orientação: a blefaroplastia não lê a massagem geral
   * porque tem a das pálpebras, que é outra técnica.
   */
  exceto?: ProcedureId[];
  /** Se preenchido, restringe ao tipo de percurso. Ausente = vale para todos. */
  kinds?: ProcedureKind[];
  /**
   * Ressalva destacada no topo do guia. Existe para os guias cujo conteúdo é
   * naturalmente lido como regra — prazos, tempo de uso, frequência — e onde a
   * orientação da equipe precisa aparecer acima do texto, não abaixo dele.
   */
  note?: string;
  /**
   * Guias que são protocolos da clínica e têm marca própria. A arte entra no
   * lugar do título, como foi entregue — não é recolorida nem redesenhada.
   */
  brand?: 'face-hd' | 'lipo-hd' | 'hr-recovery';
}

export const careGuides: CareGuide[] = [
  {
    id: 'hr_recovery',
    kinds: ['cirurgico'],
    brand: 'hr-recovery',
    title: 'HR Recovery Protocol',
    subtitle: 'Sua recuperação começa nas primeiras horas, ainda no hospital',
    icon: 'pulse-outline',
    sections: [
      {
        heading: 'O que já está incluído na sua cirurgia',
        items: [
          'Avaliação individual da fisioterapeuta ainda durante a internação',
          'Fisioterapia intra-hospitalar, iniciada nas primeiras horas',
          'Taping — bandagens terapêuticas, aplicadas quando indicadas',
          'Malhas compressivas e meia elástica',
          'Acompanhamento com o Dr. Henrique Reis por até seis meses',
          'Suporte da equipe para dúvidas durante todo o processo',
        ],
      },
      {
        heading: 'Para que serve',
        items: [
          'A fisioterapia precoce ajuda a retomar os movimentos com segurança e traz mais conforto nas primeiras horas',
          'O taping auxilia no controle do inchaço e das equimoses',
          'O acompanhamento próximo torna a recuperação mais previsível — e permite agir cedo quando algo foge do esperado',
        ],
      },
      {
        heading: 'Planos de acompanhamento',
        items: [
          'Essential: 5 sessões de fisioterapia pós-operatória',
          'Advanced: 10 sessões, com acompanhamento mais próximo',
          'Elite: 15 sessões, com acompanhamento intensivo',
          'Conforme o plano e a indicação, podem incluir drenagem linfática, manutenção do taping e laser para a cicatrização',
        ],
      },
      {
        heading: 'Bom saber',
        items: [
          'A equipe recomenda os planos, mas a contratação é opcional',
          'O cuidado inicial acima faz parte da sua cirurgia, tendo você contratado um plano ou não',
          'Cada recuperação é única: o protocolo é adaptado a você e ao procedimento realizado',
          'Para conhecer os planos e valores, fale com a equipe',
        ],
      },
    ],
  },
  {
    id: 'face_hd',
    kinds: ['cirurgico'],
    procedures: ['face_hd'],
    brand: 'face-hd',
    title: 'Seu Face HD Concept',
    subtitle: 'Cada planejamento é individual — vale para você o que foi combinado na sua consulta',
    icon: 'sparkles-outline',
    sections: [
      {
        heading: 'O que o planejamento considera',
        items: [
          'O rosto é tratado como um conjunto: pele, gordura, músculos, ligamentos e pescoço',
          'O planejamento pode reunir lifting profundo, pescoço profundo, lipoenxertia, laser de CO₂, pálpebras e lip lift',
          'Nem toda paciente faz todas as etapas — as orientações abaixo valem para as que fizeram parte do seu caso',
        ],
      },
      {
        heading: 'Face e pescoço',
        items: [
          'Mentoneira por 15 dias — pode retirar para se alimentar e tomar banho',
          'Não molhar o taping (bandagem)',
          'Fisioterapia e drenagem são parte essencial e aceleram a recuperação',
          'Dormir de barriga para cima, com a cabeceira elevada — é o que mais reduz o inchaço',
          'Evitar movimentos bruscos de virar ou flexionar o pescoço nos primeiros dias',
          'Sensação de repuxo, dormência e formigamento na frente das orelhas e no pescoço é esperada',
          'O pescoço costuma ser a última região a desinchar',
        ],
      },
      {
        heading: 'Se houve lipoenxertia',
        items: [
          'Evitar pressão sobre as áreas que receberam gordura, inclusive apoio de óculos quando for o caso',
          'Parte do volume aplicado é reabsorvida nas primeiras semanas — isso é esperado e já entra no planejamento',
          'Não massagear as áreas enxertadas por conta própria',
        ],
      },
      {
        heading: 'Se o laser de CO₂ fez parte',
        items: [
          'A pele descama nos primeiros dias — não retirar as casquinhas',
          'Hidratar conforme orientado e usar protetor solar assim que liberado',
          'Vermelhidão que dura semanas é esperada e clareia aos poucos',
          'Sem ácidos, esfoliantes, vitamina C ou retinol até liberação',
        ],
      },
    ],
  },
  {
    id: 'lipo_hd',
    kinds: ['cirurgico'],
    procedures: ['lipo_hd'],
    brand: 'lipo-hd',
    title: 'Sua Lipo HD Concept',
    subtitle: 'Não é uma lipo mais forte — é um planejamento de contorno',
    icon: 'barbell-outline',
    sections: [
      {
        heading: 'O que é a Lipo HD',
        items: [
          'Mais do que retirar gordura, ela esculpe os contornos naturais do seu corpo',
          'A gordura é removida de forma estratégica, preservando transições suaves e evidenciando cintura, linhas abdominais, dorso e contornos',
          'O objetivo não é um aspecto artificial, e sim um resultado natural e proporcional ao seu biotipo',
          'Cada planejamento respeita a sua anatomia, a qualidade da sua pele e os seus objetivos',
        ],
      },
      {
        heading: 'O que é o GRAFT',
        items: [
          'É a sua própria gordura, retirada na lipoaspiração e preparada para ser enxertada onde falta volume',
          'As regiões mais comuns são glúteos, quadris (hip dips), abdome (UGRAFT®) e peitoral',
          'Por usar tecido do seu corpo, o aspecto e o toque são naturais',
          'Nem toda cirurgia inclui enxertia: vale para você o que foi combinado na consulta',
        ],
      },
      {
        heading: 'Se houve enxertia de gordura',
        items: [
          'Evite pressão sobre a área enxertada nas primeiras semanas',
          'Siga com rigor as orientações de posição para dormir e para sentar',
          'Não massageie a região enxertada sem orientação da equipe',
          'Mantenha boa hidratação e alimentação ao longo de toda a recuperação',
        ],
      },
      {
        heading: 'Por que os cuidados pesam mais aqui',
        items: [
          'São os mesmos da lipoaspiração convencional, mas é o que preserva a definição obtida na cirurgia',
          'Cinta conforme a orientação — sem apertar nem ajustar por conta própria',
          'Drenagem linfática e fisioterapia no cronograma indicado',
          'Caminhadas curtas e frequentes desde cedo, que também previnem trombose',
          'Alimentação rica em proteína e boa hidratação',
          'Volta aos exercícios de forma gradual, respeitando os prazos da equipe',
          'Sem sol direto enquanto houver roxos ou cicatriz recente',
        ],
      },
      {
        heading: 'O resultado leva tempo',
        items: [
          'Nas primeiras semanas há inchaço, endurecimento e assimetrias temporárias — tudo esperado',
          'A definição melhora progressivamente conforme o inchaço cede',
          'A maior parte da recuperação acontece nos primeiros 3 meses',
          'Quando houve enxertia, o resultado do enxerto se define entre 3 e 6 meses',
          'O resultado final costuma ser observado entre 6 e 12 meses, conforme cada paciente',
        ],
      },
    ],
  },
  {
    id: 'tecnologias',
    kinds: ['cirurgico'],
    procedures: ['lipo_hd', 'lipoescultura'],
    title: 'BodyTite® e Morpheus8®',
    subtitle: 'Tecnologia para potencializar o contorno corporal e o tratamento da flacidez',
    icon: 'radio-outline',
    sections: [
      {
        heading: 'O que são',
        paragraphs: [
          'O BodyTite® e o Morpheus8® são tecnologias que utilizam radiofrequência para complementar o tratamento do contorno corporal e da flacidez.',
          'Na cirurgia plástica, podem ser utilizados isoladamente em casos selecionados, mas são frequentemente associados à lipoaspiração ou lipoescultura, de acordo com a indicação de cada paciente.',
        ],
      },
      {
        heading: 'O que é o BodyTite®',
        paragraphs: [
          'O BodyTite® utiliza radiofrequência assistida aplicada nos tecidos abaixo da pele. Durante o procedimento, a energia é administrada de forma controlada, promovendo aquecimento dos tecidos e contração das fibras de colágeno.',
          'Quando associado à lipoaspiração, pode contribuir para uma melhor acomodação da pele ao novo contorno corporal, especialmente em regiões que apresentam algum grau de flacidez.',
          'Pode ser utilizado em áreas como abdômen, braços, coxas, costas, flancos e região submentoniana (papada), sempre conforme avaliação médica individual.',
        ],
      },
      {
        heading: 'E o Morpheus8®',
        paragraphs: [
          'O Morpheus8® atua de maneira diferente e complementar. A tecnologia combina microagulhamento com radiofrequência, levando energia a diferentes profundidades da pele e dos tecidos.',
          'O objetivo é estimular a remodelação do colágeno e melhorar progressivamente características como firmeza, textura e qualidade da pele.',
          'Em alguns planejamentos cirúrgicos, BodyTite® e Morpheus8® podem ser associados à lipoaspiração na mesma cirurgia, permitindo tratar não apenas o excesso de gordura e o contorno, mas também aspectos relacionados à flacidez e à qualidade da pele.',
        ],
      },
      {
        heading: 'Como é a recuperação',
        paragraphs: [
          'Nos primeiros dias é esperado apresentar inchaço, sensibilidade e áreas arroxeadas, especialmente quando o tratamento é realizado junto à lipoaspiração. A intensidade e a duração desses sintomas variam conforme a região tratada, a extensão do procedimento e as características individuais.',
        ],
        items: [
          'Utilizar a malha ou cinta compressiva pelo período orientado pela equipe',
          'Manter os curativos conforme orientação',
          'Realizar fisioterapia pós-operatória e/ou drenagem linfática quando indicadas',
          'Evitar esforço físico e exercícios até a liberação médica',
          'Evitar exposição solar direta nas áreas com equimoses ou marcas do tratamento',
          'Manter boa hidratação e alimentação adequada',
          'Não aplicar cremes, medicamentos ou realizar outros tratamentos na região sem orientação',
          'Comparecer às consultas de acompanhamento programadas',
        ],
      },
      {
        heading: 'O tempo da retração',
        paragraphs: [
          'A retração da pele não é imediata. Ela acontece de forma gradual, à medida que o colágeno é remodelado, e pode continuar evoluindo até cerca de nove meses depois da cirurgia.',
          'Por isso, o contorno que você vê nos primeiros meses ainda não é o resultado final — nessa fase o inchaço também interfere no que o espelho mostra. Avaliar cedo demais costuma gerar uma frustração que o tempo desfaz.',
        ],
      },
      {
        heading: 'Quando o Morpheus8® é utilizado',
        paragraphs: [
          'Podem permanecer por alguns dias vermelhidão, edema, sensibilidade e pequenos pontos ou crostas superficiais nas áreas tratadas. É importante não manipular essas regiões e seguir as orientações de cuidados com a pele.',
        ],
      },
      {
        heading: 'Importante',
        paragraphs: [
          'BodyTite® e Morpheus8® não substituem a retirada cirúrgica de pele quando existe flacidez importante. A escolha entre lipoaspiração isolada, associação de tecnologias ou uma cirurgia com retirada de pele depende da anatomia, do grau de flacidez e dos objetivos de cada paciente.',
          'Assim como qualquer procedimento médico, essas tecnologias apresentam possíveis riscos e intercorrências, incluindo alterações de sensibilidade, irregularidades, alterações de pigmentação, seromas e, mais raramente, lesões térmicas da pele e dos tecidos.',
          'A indicação deve ser sempre individualizada, após avaliação médica, considerando benefícios, limitações e riscos de cada opção.',
        ],
      },
    ],
  },
  {
    id: 'compressao',
    kinds: ['cirurgico'],
    note:
      'A peça, o tempo de uso e as pausas mudam conforme o procedimento. Vale sempre o que foi orientado para você na alta.',
    title: 'Cinta, malha e sutiã cirúrgico',
    subtitle: 'O tempo de uso e o modelo são definidos para o seu procedimento',
    icon: 'shirt-outline',
    sections: [
      {
        heading: 'Por que usar',
        items: [
          'Ajuda a reduzir o inchaço e o desconforto',
          'Contribui para a pele se acomodar ao novo contorno',
          'A peça, o tempo de uso e as pausas variam conforme o procedimento — siga o que foi orientado para você',
        ],
      },
      {
        heading: 'Como usar',
        items: [
          'Use pelo tempo e nos períodos que a equipe orientou para o seu caso',
          'Não aperte, ajuste nem troque de tamanho por conta própria',
          'Deve ficar firme e confortável, nunca a ponto de doer ou marcar fundo',
          'Tenha duas peças para revezar durante a lavagem',
        ],
      },
      {
        heading: 'Sinais de que está errada',
        items: [
          'Marcas profundas, dor ou formigamento',
          'Dificuldade para respirar fundo',
          'Pele pálida, fria ou arroxeada abaixo da peça',
        ],
      },
    ],
  },
  {
    id: 'taping',
    kinds: ['cirurgico'],
    /* Onde a fisioterapeuta aplica a bandagem: face e as cirurgias de contorno
       corporal. Quem não sai do centro cirúrgico com tape não precisa ler
       sobre não molhar uma coisa que não tem. */
    procedures: [
      'face_hd',
      'lipoescultura',
      'lipo_hd',
      'abdominoplastia',
      'ginecomastia',
      'pos_bariatrica',
    ],
    title: 'Taping pós-operatório',
    subtitle: 'A bandagem elástica aplicada pela fisioterapeuta, e como cuidar dela',
    icon: 'bandage-outline',
    sections: [
      {
        heading: 'O que é',
        paragraphs: [
          'O taping é uma bandagem elástica aplicada pela fisioterapeuta ainda no momento da cirurgia ou logo após o procedimento. Ele faz parte dos cuidados iniciais e pode auxiliar na recuperação, sempre de acordo com a indicação da equipe.',
        ],
      },
      {
        heading: 'Quais são os benefícios',
        paragraphs: ['Quando bem indicado, o taping pode contribuir para:'],
        items: [
          'Auxiliar no controle do inchaço',
          'Favorecer a drenagem dos líquidos',
          'Reduzir áreas de maior tensão',
          'Proporcionar mais conforto durante os primeiros dias',
          'Ajudar na adaptação dos tecidos no período inicial da recuperação',
        ],
      },
      {
        heading: 'Quanto tempo ele permanece',
        paragraphs: [
          'Em geral, a bandagem permanece por aproximadamente 6 a 7 dias. Esse período pode variar conforme a cirurgia, a evolução do inchaço e a resposta da pele.',
          'Em algumas situações, poderá ser retirada antes pela fisioterapeuta ou pela equipe. Dependendo da necessidade, uma nova aplicação poderá ser realizada durante o acompanhamento pós-operatório.',
        ],
      },
      {
        heading: 'Cuidados importantes',
        items: [
          'Não molhe o taping durante o banho — a umidade diminui a aderência e favorece irritações na pele',
          'Não utilize secador, cremes, óleos ou pomadas sobre a bandagem',
          'Não puxe, recorte, reposicione ou retire o taping por conta própria',
          'Use roupas confortáveis e tenha cuidado para não prender ou tracionar as pontas da bandagem',
          'Se alguma extremidade começar a descolar, não tente colá-la novamente — entre em contato com a equipe para receber orientação',
          'A retirada deve ser feita conforme a orientação da fisioterapeuta ou da equipe responsável',
        ],
      },
      {
        heading: 'Quando entrar em contato',
        paragraphs: ['Avise a equipe se perceber:'],
        items: [
          'Coceira intensa ou persistente',
          'Ardência, dor ou desconforto importante',
          'Vermelhidão que se estende além da bandagem',
          'Pele muito sensível, irritada ou machucada',
          'Bandagem molhada, muito solta ou completamente descolada',
        ],
      },
      {
        heading: 'Cada recuperação é única',
        paragraphs: [
          'O taping é um cuidado complementar e não substitui as demais orientações pós-operatórias.',
          'O tempo de permanência, a retirada e a eventual reaplicação serão definidos individualmente durante o acompanhamento.',
        ],
      },
    ],
  },
  {
    id: 'curativo',
    kinds: ['cirurgico'],
    title: 'Curativos, banho e higiene',
    subtitle: 'Como cuidar da ferida no dia a dia',
    icon: 'water-outline',
    sections: [
      {
        heading: 'Banho',
        items: [
          'Primeiro banho conforme liberação da equipe, geralmente entre o 1º e o 3º dia',
          'Água morna, banho rápido e de chuveiro',
          'Não esfregue a cicatriz — deixe a água escorrer sobre ela',
          'Seque dando leves toques com toalha limpa, sem friccionar',
        ],
      },
      {
        heading: 'Curativo',
        items: [
          'Lave bem as mãos antes e depois da troca',
          'Use apenas os produtos indicados pela equipe',
          'Não aplique pomadas, álcool, água oxigenada ou receitas caseiras',
          'Não retire crostas nem fios de pontos por conta própria',
        ],
      },
      {
        heading: 'Proibido até liberação',
        items: [
          'Banho de imersão, banheira, piscina, mar, lagoa e sauna',
          'Bronzeamento e exposição solar direta na cicatriz',
          'Depilação na área operada',
        ],
      },
    ],
  },
  {
    id: 'medicacao',
    kinds: ['cirurgico'],
    title: 'Medicações e controle da dor',
    subtitle: 'A dor bem controlada acelera a recuperação',
    icon: 'medkit-outline',
    sections: [
      {
        heading: 'Regras principais',
        items: [
          'Tome os remédios nos horários prescritos, sem esperar a dor aparecer',
          'Não altere nem interrompa nenhum tratamento sem orientação da equipe, mesmo se estiver bem',
          'Não use anti-inflamatórios por conta própria — alguns aumentam sangramento',
          'Evite qualquer suplemento ou chá sem consultar a equipe',
        ],
      },
      {
        heading: 'Cuidados com o estômago',
        items: [
          'Tome os medicamentos sempre após alguma refeição, ainda que leve',
          'Enjoo persistente deve ser comunicado para ajuste da prescrição',
        ],
      },
      {
        heading: 'Quando comunicar',
        items: [
          'Dor que piora a cada dia em vez de melhorar',
          'Dor que não cede com a medicação prescrita',
          'Qualquer reação nova após iniciar um medicamento',
        ],
      },
    ],
  },
  {
    id: 'drenagem',
    kinds: ['cirurgico'],
    note:
      'Nem toda paciente precisa de drenagem. A indicação, o início e a frequência são definidos pela equipe conforme o seu caso.',
    title: 'Drenagem linfática',
    subtitle: 'Quando indicada, é a equipe que define início e frequência',
    icon: 'hand-left-outline',
    sections: [
      {
        heading: 'Para que serve',
        items: [
          'Quando indicada, pode auxiliar no controle do inchaço e no conforto da recuperação',
          'Costuma ajudar no manejo da fibrose, que deixa o contorno irregular',
          'Nem toda paciente precisa, e o protocolo varia conforme o procedimento e o seu caso',
        ],
      },
      {
        heading: 'Como fazer',
        items: [
          'Início e frequência são definidos pela equipe, caso a caso',
          'Sempre com profissional habilitado em pós-operatório de cirurgia plástica',
          'A manobra é suave — drenagem dolorida não é drenagem linfática',
        ],
      },
      {
        heading: 'Atenção',
        items: [
          'Não permita massagem forte sobre a área operada nas primeiras semanas',
          'Informe o profissional sobre a data e o tipo da sua cirurgia',
        ],
      },
    ],
  },
  {
    id: 'repouso',
    kinds: ['cirurgico'],
    title: 'Repouso, posição e movimento',
    subtitle: 'Repouso não é ficar parada',
    icon: 'bed-outline',
    sections: [
      /* A orientação de caminhar é a que mais se perde na tradução.
         "Repouso" a paciente entende como cama, e é justamente ficar parada que
         forma o coágulo. Por isso aqui ela vem com número, lugar e a permissão
         explícita da escada — sem isso, cada paciente inventa o próprio limite,
         e inventa sempre para menos. */
      {
        heading: 'Caminhar desde o primeiro dia',
        paragraphs: [
          'Caminhar é a orientação mais importante desta fase — mais do que qualquer pomada ou curativo. É o que mantém o sangue circulando nas pernas, e é a principal prevenção de trombose.',
        ],
        items: [
          'Caminhe dentro de casa várias vezes ao dia, desde o primeiro dia',
          'Poucos minutos de cada vez, aumentando aos poucos conforme você se sentir',
          'Subir escadas está liberado — vá devagar e apoiada no corrimão',
          'Nas primeiras vezes, levante da cama acompanhada: sente-se na beirada, espere passar a tontura e só então fique de pé',
          'Entre uma caminhada e outra, movimente os pés e as pernas na cama a cada hora',
        ],
      },
      {
        heading: 'Como dormir',
        items: [
          'Mamas: de barriga para cima, com o tronco levemente elevado',
          'Abdome: de barriga para cima, com travesseiro sob os joelhos',
          'Face, nariz e pálpebras: cabeceira elevada, sem deitar de lado',
          'Orelhas: de barriga para cima, sem pressionar as orelhas',
        ],
      },
      {
        heading: 'Evitar nas primeiras semanas',
        items: [
          'Pegar peso, incluindo crianças e sacolas de compras',
          'Agachar, esticar-se para alcançar objetos altos e dirigir',
          'Ficar muito tempo na mesma posição, sentada ou deitada',
        ],
      },
    ],
  },
  {
    id: 'primeiras-horas',
    kinds: ['ambulatorial'],
    title: 'As primeiras 24 horas',
    subtitle: 'É aqui que os cuidados fazem diferença',
    icon: 'time-outline',
    sections: [
      {
        heading: 'Hoje, evite',
        items: [
          'Massagear, apertar ou esfregar a área tratada',
          'Exercício físico, sauna, banho muito quente e sol forte',
          'Bebida alcoólica',
          'Maquiagem sobre a área, salvo liberação da equipe',
          'Deitar de bruços ou ficar muito tempo de cabeça baixa',
        ],
      },
      {
        heading: 'Ajuda a reduzir inchaço e roxo',
        items: [
          'Compressa fria por alguns minutos, se orientado — nunca gelo direto na pele',
          'Dormir com a cabeceira elevada na primeira noite',
          'Beber bastante água e reduzir o sal',
        ],
      },
      {
        heading: 'Depois de toxina botulínica',
        items: [
          'Permanecer com a cabeça erguida nas primeiras 4 horas',
          'Contrair a musculatura tratada algumas vezes ao longo do dia, se orientado',
          'Não se deitar nem fazer exercício nesse período',
        ],
      },
    ],
  },
  {
    id: 'resultado',
    kinds: ['ambulatorial'],
    title: 'Quando o resultado aparece',
    subtitle: 'Cada tratamento tem o seu tempo',
    icon: 'hourglass-outline',
    sections: [
      {
        heading: 'Referências habituais',
        items: [
          'Toxina botulínica: começa em 3 a 5 dias e se completa em 15',
          'Preenchimento: o resultado aparece quando o inchaço sai, por volta de 15 dias',
          'Bioestimulador: ganho progressivo entre 4 e 12 semanas, geralmente em mais de uma sessão',
          'Laser de CO₂: pele renovada em 7 dias; textura e firmeza evoluem por até 3 meses',
          'Morpheus: firmeza aparece a partir de 30 dias e evolui por até 3 meses',
        ],
      },
      {
        heading: 'Por que não julgar antes',
        items: [
          'Nos primeiros dias o que você vê é inchaço, não resultado',
          'Assimetrias iniciais costumam se resolver sozinhas',
          'A avaliação de retoque é feita no retorno, com o efeito já completo',
        ],
      },
      {
        heading: 'Manutenção',
        items: [
          'Toxina: em geral a cada 4 a 6 meses',
          'Preenchimento e bioestimulador: conforme o produto e a resposta de cada pele',
          'Laser e Morpheus: em protocolos de sessões, com intervalos definidos pela equipe',
        ],
      },
    ],
  },
  {
    id: 'pele-pos-laser',
    kinds: ['ambulatorial'],
    procedures: ['laser_co2', 'morpheus'],
    title: 'Cuidados com a pele após o laser',
    subtitle: 'A recuperação da pele em uma semana',
    icon: 'color-palette-outline',
    sections: [
      {
        heading: 'Dia a dia',
        items: [
          'Dias 1 e 2: ardência e inchaço, pele parecendo queimada de sol',
          'Dias 3 a 5: casquinhas finas e descamação',
          'Dias 6 e 7: pele nova, rosada e sensível',
          'A partir daí: o tom rosado clareia ao longo de semanas',
        ],
      },
      {
        heading: 'O que fazer',
        items: [
          'Lavar com água fria ou morna e sabonete suave, sem esfregar',
          'Hidratar com o creme indicado, quantas vezes for necessário',
          'Secar com toques leves, com toalha limpa e macia',
          'Protetor solar assim que liberado, reaplicado ao longo do dia',
          'Fronha limpa todos os dias na primeira semana',
        ],
      },
      {
        heading: 'O que não fazer',
        items: [
          'Puxar ou esfregar as casquinhas — é o que mais causa mancha e marca',
          'Usar ácidos, esfoliantes, vitamina C ou retinol até liberação',
          'Piscina, mar, sauna e academia até a pele fechar',
          'Qualquer exposição solar direta nas primeiras semanas',
        ],
      },
      {
        heading: 'Avise a equipe se',
        items: [
          'Aparecerem bolhinhas agrupadas com ardência (pode ser herpes)',
          'A dor aumentar em vez de diminuir',
          'Surgir área muito vermelha, quente ou com secreção',
        ],
      },
    ],
  },
  {
    id: 'depois-injetaveis',
    kinds: ['ambulatorial'],
    procedures: ['preenchimento', 'bioestimulador', 'toxina'],
    title: 'Depois de injetáveis',
    subtitle: 'Preenchimento, bioestimulador e toxina',
    icon: 'medical-outline',
    sections: [
      {
        heading: 'Massagem',
        items: [
          'Só massageie se a equipe orientou — em bioestimuladores costuma fazer parte do protocolo, com dias e frequência definidos',
          'Em preenchimento e toxina, a regra geral é não massagear',
          'Na dúvida, pergunte antes de fazer',
        ],
      },
      {
        heading: 'Rotina',
        items: [
          'Atividade física liberada em geral após 24 a 48 horas',
          'Evitar sauna, banho muito quente e sol intenso nos primeiros dias',
          'Adiar limpeza de pele, depilação e outros procedimentos na área por cerca de 2 semanas',
          'Avisar qualquer profissional que for tratar seu rosto sobre o produto aplicado',
        ],
      },
      {
        heading: 'Sinais que exigem contato imediato',
        items: [
          'Dor forte e desproporcional na região',
          'Pele esbranquiçada ou com manchas arroxeadas em desenho de renda',
          'Qualquer alteração da visão',
        ],
      },
    ],
  },
  {
    id: 'alimentacao',
    kinds: ['cirurgico'],
    title: 'Alimentação e hidratação',
    subtitle: 'A cicatrização depende do que você come',
    icon: 'nutrition-outline',
    sections: [
      {
        heading: 'Priorize',
        items: [
          'Proteína em todas as refeições: ovos, peixes, carnes magras, iogurte, leguminosas',
          'Frutas e verduras variadas, pela vitamina C e pelo zinco',
          'De 2 a 3 litros de água por dia, salvo orientação diferente',
          'Fibras para evitar a prisão de ventre causada pelos analgésicos',
        ],
      },
      {
        heading: 'Reduza ou evite',
        items: [
          'Sal e alimentos ultraprocessados, que pioram a retenção de líquido',
          'Álcool até a liberação — interfere na cicatrização e nas medicações',
          'Cigarro e vape: o tabagismo é o fator que mais compromete a cicatriz',
        ],
      },
    ],
  },
  {
    id: 'prineo',
    kinds: ['cirurgico'],
    /* Só as cirurgias de incisão longa recebem a cola. Quem não a tem não
       precisa ler sobre não molhar uma tela que não está lá. */
    procedures: [
      'abdominoplastia',
      'pos_bariatrica',
      'mastopexia',
      'mamoplastia_redutora',
      'mamoplastia_aumento',
    ],
    title: 'Cuidados com a cola cirúrgica Prineo',
    subtitle: 'Uma camada de proteção sobre a incisão, até por volta do 21º dia',
    icon: 'shield-outline',
    sections: [
      {
        heading: 'O que é',
        paragraphs: [
          'Nas cirurgias em que foi aplicado, o Prineo funciona como uma camada de proteção sobre a incisão. Ele é formado por uma delicada tela associada a uma cola cirúrgica e deve permanecer no local durante as primeiras semanas da recuperação.',
          'Nos primeiros dias, o Prineo poderá estar coberto pelo taping. Durante esse período, siga as orientações específicas de cuidado com a bandagem e evite molhá-la.',
        ],
      },
      {
        heading: 'Após a retirada do taping',
        paragraphs: [
          'Quando o taping for retirado, o Prineo poderá ser molhado normalmente durante o banho. Deixe a água escorrer suavemente sobre a região, sem esfregar, utilizar buchas ou direcionar um jato forte para a cicatriz.',
          'Depois do banho, seque delicadamente com uma toalha limpa, apenas pressionando sobre a região, sem friccionar. Enquanto o Prineo estiver presente, evite banheira, piscina, mar ou qualquer situação em que a cicatriz permaneça submersa.',
        ],
      },
      {
        heading: 'O que não aplicar',
        paragraphs: [
          'Não passe cremes, hidratantes, pomadas, óleos, álcool, antissépticos ou qualquer outro produto sobre o Prineo. Essas substâncias podem reduzir a aderência da cola e fazer com que a tela se solte antes do momento adequado.',
          'Também não puxe, não esfregue e não tente retirar a tela por conta própria.',
        ],
      },
      {
        heading: 'Se alguma ponta descolar',
        paragraphs: [
          'Com o passar dos dias, é possível que pequenas bordas comecem a se desprender. Isso geralmente faz parte do processo e não significa que exista algum problema com a cicatriz.',
          'Caso uma ponta esteja solta ou incomodando, avise nossa equipe. A parte que já estiver completamente descolada poderá ser cuidadosamente aparada com uma tesoura limpa, sem puxar a região que permanece aderida à pele.',
        ],
      },
      {
        heading: 'Retirada',
        paragraphs: [
          'O Prineo costuma ser retirado por volta de 21 dias após a cirurgia, de acordo com a evolução da cicatrização. Aguarde a orientação da nossa equipe para realizar a retirada no momento adequado.',
          'Caso perceba coceira intensa, irritação importante ou formação de pequenas bolhas ao redor da cola, entre em contato conosco para receber orientação.',
          'O Prineo não precisa de cuidados complexos. Basta protegê-lo, mantê-lo limpo e não interferir em sua aderência até o momento da retirada.',
        ],
      },
    ],
  },
  {
    id: 'massagem-palpebras',
    kinds: ['cirurgico'],
    /* Quem fez Face HD também operou as pálpebras, e recebe as duas massagens:
       esta e a das demais cicatrizes do rosto. */
    procedures: ['blefaroplastia', 'face_hd'],
    title: 'Massagem das pálpebras',
    subtitle: 'A partir de 30 dias, manhã e noite',
    icon: 'eye-outline',
    sections: [
      {
        heading: 'Como fazer',
        paragraphs: [
          'A partir de 30 dias, com as cicatrizes já fechadas, massageie as cicatrizes das pálpebras — as superiores e as inferiores.',
        ],
        items: [
          'Deslize sempre de dentro para fora, no sentido do canto do olho para a lateral',
          'Use uma pressão um pouco mais firme do que a das outras cicatrizes',
          '20 movimentos em cada pálpebra',
          'Duas vezes ao dia: de manhã e à noite',
        ],
      },
      {
        heading: 'Antes de começar',
        paragraphs: [
          'A pele das pálpebras é fina e a cicatriz precisa estar completamente fechada, sem nenhum ponto de abertura. Se ainda houver alguma área cicatrizando, aguarde a liberação da nossa equipe.',
          'Lave bem as mãos antes de encostar na região.',
        ],
      },
      {
        heading: 'O que esperar',
        paragraphs: [
          'Um leve desconforto no começo é comum e melhora conforme a cicatriz amadurece. Nunca force a ponto de machucar a pele ou de deixar a região irritada.',
          'Se aparecer vermelhidão que não passa, dor ou qualquer alteração na visão, interrompa e fale com a equipe.',
        ],
      },
    ],
  },
  {
    id: 'massagem-cicatriz',
    kinds: ['cirurgico'],
    /* A blefaroplastia tem a sua própria massagem, com outra técnica. */
    exceto: ['blefaroplastia'],
    title: 'Massagem das cicatrizes',
    subtitle: 'A partir de 30 dias, com a cicatriz já fechada',
    icon: 'hand-left-outline',
    sections: [
      {
        heading: 'Por que massagear',
        paragraphs: [
          'A cicatriz continua se transformando por vários meses após a cirurgia. A massagem faz parte desse processo de cuidado e ajuda a manter o tecido mais macio, flexível e bem adaptado aos planos profundos.',
        ],
      },
      {
        heading: 'Quando começar',
        paragraphs: [
          'Em geral, a massagem pode ser iniciada por volta de 30 dias após a cirurgia, desde que a cicatriz esteja completamente fechada, com a pele íntegra e sem nenhum ponto de abertura ou deiscência.',
          'Caso ainda exista alguma pequena área em cicatrização, aguarde a liberação da nossa equipe antes de começar.',
        ],
      },
      {
        heading: 'Como realizar',
        items: [
          'Lave bem as mãos',
          'Aplique uma pequena quantidade do hidratante recomendado pela equipe',
          'Posicione a ponta dos dedos diretamente sobre a cicatriz',
          'Faça movimentos circulares pequenos e lentos, percorrendo toda a sua extensão',
          'A pressão deve ser firme o suficiente para movimentar a cicatriz e a pele sobre os tecidos mais profundos — não apenas deslizar superficialmente',
        ],
      },
      {
        heading: 'A pressão certa',
        paragraphs: [
          'Um leve desconforto ou sensibilidade durante a massagem pode acontecer e tende a melhorar conforme a cicatriz amadurece. A pressão pode ser aumentada progressivamente, sempre respeitando o limite tolerável e sem machucar a pele.',
        ],
      },
      {
        heading: 'Frequência',
        paragraphs: [
          'Realize a massagem por aproximadamente 5 minutos, duas vezes ao dia, ou conforme a orientação individual da nossa equipe.',
          'Mais importante do que aplicar força excessiva é manter uma pressão firme, cuidadosa e regular. Com o tempo, esse pequeno hábito pode contribuir para uma cicatriz mais macia, móvel e confortável.',
          'Cada cicatriz tem seu próprio ritmo. Constância e cuidado fazem parte de uma boa recuperação.',
        ],
      },
    ],
  },
  {
    id: 'cicatriz',
    kinds: ['cirurgico'],
    title: 'Cuidados com a cicatriz',
    subtitle: 'O primeiro ano define o resultado da marca',
    icon: 'bandage-outline',
    sections: [
      {
        heading: 'Linha do tempo da cicatriz',
        items: [
          'Até 3 semanas: fechamento — apenas higiene e curativo',
          'De 1 a 3 meses: fica mais vermelha e elevada, é a fase esperada',
          'De 3 a 12 meses: clareia, amolece e se aplana progressivamente',
        ],
      },
      {
        heading: 'O que realmente ajuda',
        items: [
          'Protetor solar FPS 50 sobre a cicatriz, reaplicado, por 12 meses',
          'Fitas ou géis de silicone, quando indicados pela equipe',
          'Hidratação da pele ao redor, após o fechamento completo',
          'Não fumar',
        ],
      },
      {
        heading: 'O que não fazer',
        items: [
          'Usar receitas caseiras, óleos ou pomadas não prescritas',
          'Expor a cicatriz ao sol, mesmo com o dia nublado',
          'Puxar crostas ou esfregar a região',
        ],
      },
    ],
  },
  {
    id: 'rotina',
    kinds: ['cirurgico'],
    note:
      'Os prazos abaixo são referências gerais, não uma autorização. Quem libera cada atividade é a equipe, caso a caso — na dúvida, pergunte antes de retomar.',
    title: 'Volta à rotina e exercícios',
    subtitle: 'Referências gerais — sua liberação é individual',
    icon: 'fitness-outline',
    sections: [
      {
        heading: 'Referências habituais',
        items: [
          'Trabalho em casa ou de escritório: de 7 a 15 dias',
          'Dirigir: a partir de 2 semanas, sem uso de analgésico forte',
          'Caminhada leve: a partir da 2ª ou 3ª semana',
          'Exercícios de baixo impacto: a partir de 30 a 45 dias',
          'Musculação e impacto: a partir de 60 dias',
          'Praia, piscina e mar: após liberação, em geral após 30 dias',
        ],
      },
      {
        heading: 'Regra de ouro',
        items: [
          'Nenhuma atividade deve ser retomada sem liberação da equipe',
          'Se doer ou inchar mais depois, você avançou rápido demais — recue um passo',
        ],
      },
    ],
  },
  {
    id: 'viagem',
    kinds: ['cirurgico'],
    note:
      'São recomendações gerais. Confirme com a equipe antes de comprar passagem.',
    title: 'Viagens e deslocamentos',
    subtitle: 'Planeje antes de comprar passagem',
    icon: 'airplane-outline',
    sections: [
      {
        heading: 'Recomendações',
        items: [
          'Evite voos nas primeiras 2 a 3 semanas, salvo liberação',
          'Em viagens longas, levante e caminhe a cada hora',
          'Use a meia de compressão, se prescrita',
          'Mantenha boa hidratação durante o trajeto',
          'Leve seus medicamentos e o contato da equipe na bagagem de mão',
        ],
      },
    ],
  },
];

export const careById = (id: string) => careGuides.find((c) => c.id === id);

import type { IconName, ProcedureId, ProcedureKind } from './procedures';

export interface CareSection {
  heading: string;
  items: string[];
}

export interface CareGuide {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  sections: CareSection[];
  /** Se preenchido, o guia só aparece para estes procedimentos. */
  procedures?: ProcedureId[];
  /** Se preenchido, restringe ao tipo de percurso. Ausente = vale para todos. */
  kinds?: ProcedureKind[];
  /**
   * Guias que são protocolos da clínica e têm marca própria. A arte entra no
   * lugar do título, como foi entregue — não é recolorida nem redesenhada.
   */
  brand?: 'face-hd' | 'hr-recovery';
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
    id: 'compressao',
    kinds: ['cirurgico'],
    title: 'Cinta, malha e sutiã cirúrgico',
    subtitle: 'A compressão é parte do resultado, não um detalhe',
    icon: 'shirt-outline',
    sections: [
      {
        heading: 'Por que usar',
        items: [
          'Reduz o inchaço e ajuda o corpo a reabsorver líquido',
          'Mantém a pele acomodada no novo contorno',
          'Diminui a chance de seroma e melhora o conforto',
        ],
      },
      {
        heading: 'Como usar',
        items: [
          'Em tempo integral nas primeiras semanas, inclusive para dormir',
          'Retire apenas para o banho, salvo orientação diferente',
          'Deve ficar firme e confortável — você deve conseguir passar dois dedos entre a peça e a pele',
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
          'Não suspenda o antibiótico antes do fim, mesmo se estiver bem',
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
    title: 'Drenagem linfática',
    subtitle: 'Quando indicada pela equipe',
    icon: 'hand-left-outline',
    sections: [
      {
        heading: 'Para que serve',
        items: [
          'Quando indicada, ajuda a reduzir o inchaço e a sensação de peso',
          'Contribui no manejo da fibrose, que deixa o contorno irregular',
          'Nem toda paciente precisa: quem indica, e a partir de quando, é a equipe',
        ],
      },
      {
        heading: 'Como fazer',
        items: [
          'Só começa depois da liberação da equipe — habitualmente entre o 2º e o 5º dia',
          'Sempre com profissional habilitado em pós-operatório de cirurgia plástica',
          'Frequência habitual: 3 a 5 sessões na primeira semana, reduzindo depois',
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
      {
        heading: 'Movimento desde o primeiro dia',
        items: [
          'Movimente pés e pernas na cama a cada hora enquanto estiver acordada',
          'Caminhe dentro de casa por poucos minutos, várias vezes ao dia',
          'A movimentação precoce é a principal prevenção de trombose',
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

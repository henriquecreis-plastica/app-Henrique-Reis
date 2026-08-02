import type { IconName, ProcedureId } from './procedures';

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
}

export const careGuides: CareGuide[] = [
  {
    id: 'compressao',
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
    title: 'Drenagem linfática',
    subtitle: 'Um dos fatores que mais influenciam o resultado',
    icon: 'hand-left-outline',
    sections: [
      {
        heading: 'Para que serve',
        items: [
          'Acelera a saída do líquido acumulado e reduz o inchaço',
          'Previne e trata a fibrose, que deixa o contorno irregular',
          'Melhora o conforto e a sensação de peso',
        ],
      },
      {
        heading: 'Como fazer',
        items: [
          'Início conforme liberação da equipe, em geral entre o 2º e o 5º dia',
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
    id: 'alimentacao',
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

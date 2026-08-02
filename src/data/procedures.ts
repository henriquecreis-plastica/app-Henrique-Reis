import type { Ionicons } from '@expo/vector-icons';

export type ProcedureId =
  | 'mamoplastia_aumento'
  | 'mastopexia'
  | 'mamoplastia_redutora'
  | 'abdominoplastia'
  | 'lipoescultura'
  | 'rinoplastia'
  | 'face'
  | 'blefaroplastia'
  | 'otoplastia'
  | 'ginecomastia'
  | 'pos_bariatrica'
  | 'outro';

export type IconName = keyof typeof Ionicons.glyphMap;

export interface Procedure {
  id: ProcedureId;
  name: string;
  /** Descrição curta usada na seleção do onboarding. */
  short: string;
  icon: IconName;
  /** Semanas até a recuperação social/rotina considerada estabelecida. */
  recoveryWeeks: number;
  /** Pontos de atenção específicos deste procedimento. */
  highlights: string[];
}

export const procedures: Procedure[] = [
  {
    id: 'mamoplastia_aumento',
    name: 'Mamoplastia de aumento',
    short: 'Prótese de silicone',
    icon: 'heart-outline',
    recoveryWeeks: 6,
    highlights: [
      'Sutiã cirúrgico em tempo integral, inclusive para dormir',
      'Dormir de barriga para cima nas primeiras semanas',
      'Não levantar os braços acima da cabeça nos primeiros dias',
    ],
  },
  {
    id: 'mastopexia',
    name: 'Mastopexia',
    short: 'Levantamento das mamas, com ou sem prótese',
    icon: 'heart-outline',
    recoveryWeeks: 6,
    highlights: [
      'Sutiã cirúrgico em tempo integral',
      'Cicatrizes exigem proteção solar rigorosa por 12 meses',
      'Evitar esforço com os braços nas primeiras 3 semanas',
    ],
  },
  {
    id: 'mamoplastia_redutora',
    name: 'Mamoplastia redutora',
    short: 'Redução das mamas',
    icon: 'heart-outline',
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
    recoveryWeeks: 8,
    highlights: [
      'Andar levemente curvada nos primeiros dias protege a cicatriz',
      'Cinta compressiva em tempo integral',
      'Movimentar as pernas na cama desde o 1º dia previne trombose',
    ],
  },
  {
    id: 'lipoescultura',
    name: 'Lipoescultura',
    short: 'Lipoaspiração e enxertia de gordura',
    icon: 'body-outline',
    recoveryWeeks: 6,
    highlights: [
      'Cinta compressiva 24h por dia',
      'Drenagem linfática é parte essencial do resultado',
      'Endurecimento e irregularidades nos primeiros meses são esperados',
    ],
  },
  {
    id: 'rinoplastia',
    name: 'Rinoplastia',
    short: 'Cirurgia do nariz',
    icon: 'happy-outline',
    recoveryWeeks: 8,
    highlights: [
      'Nariz entupido por algumas semanas é esperado',
      'Não assoar o nariz nem usar óculos de armação pesada',
      'O resultado final leva de 6 a 12 meses para se definir',
    ],
  },
  {
    id: 'face',
    name: 'Cirurgia de face',
    short: 'Ritidoplastia / facelifting',
    icon: 'happy-outline',
    recoveryWeeks: 8,
    highlights: [
      'Dormir com a cabeceira elevada reduz muito o inchaço',
      'Dormência na frente das orelhas e no pescoço é esperada',
      'Compressa fria apenas nas primeiras 48 horas',
    ],
  },
  {
    id: 'blefaroplastia',
    name: 'Blefaroplastia',
    short: 'Cirurgia das pálpebras',
    icon: 'eye-outline',
    recoveryWeeks: 3,
    highlights: [
      'Roxo ao redor dos olhos é esperado e some em 2 a 3 semanas',
      'Olho seco ou lacrimejante é comum no início',
      'Evitar telas e leitura prolongada nos primeiros dias',
    ],
  },
  {
    id: 'otoplastia',
    name: 'Otoplastia',
    short: 'Cirurgia das orelhas',
    icon: 'ear-outline',
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
    recoveryWeeks: 10,
    highlights: [
      'Cicatrizes longas exigem cuidado e paciência redobrados',
      'Manter a suplementação vitamínica orientada pelo seu médico',
      'Drenos podem permanecer por mais tempo que em outras cirurgias',
    ],
  },
  {
    id: 'outro',
    name: 'Outro procedimento',
    short: 'Orientações gerais do pós-operatório',
    icon: 'medkit-outline',
    recoveryWeeks: 6,
    highlights: [
      'Siga as orientações específicas entregues na sua alta',
      'Em caso de dúvida, fale com a equipe',
    ],
  },
];

export const procedureById = (id: ProcedureId): Procedure =>
  procedures.find((p) => p.id === id) ?? procedures[procedures.length - 1];

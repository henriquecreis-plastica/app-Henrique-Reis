import { clinic } from '../theme';

/**
 * As fontes do conteúdo clínico do aplicativo.
 *
 * A Apple recusou a versão 1.0 pela diretriz 1.4.1 com uma frase específica:
 * o app apresenta informação de saúde sem citar de onde ela vem, e as
 * citações precisam ser fáceis de encontrar. Não bastava um aviso dizendo que
 * o conteúdo é do médico — era preciso dizer em que ele se apoia, com link.
 *
 * A fonte primária é a própria clínica: o que está no app é o protocolo de
 * pós-operatório que o Dr. Henrique Reis usa nas pacientes dele. As entidades
 * abaixo são a literatura de referência em que esse protocolo se apoia, e é
 * isso que cada bloco declara — nem mais, nem menos. Nenhuma delas endossa
 * este aplicativo, e o texto diz isso.
 *
 * ATENÇÃO ANTES DE REENVIAR: confirme que cada endereço abre. Foram usados os
 * domínios institucionais, que mudam pouco, justamente para reduzir o risco —
 * mas um link morto numa tela de fontes é pior do que não ter a tela.
 */

export interface Fonte {
  /** Nome da entidade, como ela se apresenta. */
  entidade: string;
  /** Sigla ou nome curto, para a linha de baixo. */
  sigla?: string;
  url: string;
  /** O que esta fonte sustenta no app. Específico, não genérico. */
  papel: string;
}

export interface GrupoDeFontes {
  heading: string;
  intro: string;
  fontes: Fonte[];
}

/** Data da última revisão do conteúdo clínico, exibida no topo da tela. */
export const FONTES_ATUALIZADAS_EM = '7 de setembro de 2026';

export const autoria = {
  titulo: 'Quem escreveu este conteúdo',
  paragrafos: [
    `Todo o conteúdo clínico deste aplicativo foi escrito e é mantido por ${clinic.fullName}, cirurgião plástico, ${clinic.crm}. Os dois registros são verificáveis na consulta pública do Conselho Federal de Medicina.`,
    'O que você lê aqui é o protocolo de pós-operatório da própria clínica: as mesmas orientações entregues na alta e nas consultas de retorno, organizadas por procedimento e por fase da recuperação.',
    'As entidades listadas abaixo são a literatura de referência em que esse protocolo se apoia. Nenhuma delas revisou ou endossa este aplicativo.',
  ],
};

export const grupos: GrupoDeFontes[] = [
  {
    heading: 'Sociedades de cirurgia plástica',
    intro:
      'Orientam as condutas de pós-operatório, os prazos de recuperação e os marcos de cada procedimento descritos na aba Evolução.',
    fontes: [
      {
        entidade: 'Sociedade Brasileira de Cirurgia Plástica',
        sigla: 'SBCP',
        url: 'https://www.cirurgiaplastica.org.br',
        papel:
          'Referência nacional de conduta. O Dr. Henrique Reis é membro especialista da sociedade.',
      },
      {
        entidade: 'International Society of Aesthetic Plastic Surgery',
        sigla: 'ISAPS',
        url: 'https://www.isaps.org',
        papel:
          'Referência internacional em cirurgia estética. O Dr. Henrique Reis é membro da sociedade.',
      },
      {
        entidade: 'American Society of Plastic Surgeons',
        sigla: 'ASPS',
        url: 'https://www.plasticsurgery.org',
        papel:
          'Guias de recuperação e de segurança da paciente por procedimento, em linguagem para o público.',
      },
    ],
  },
  {
    heading: 'Referências públicas de saúde',
    intro:
      'Sustentam o que o app descreve como esperado, como sinal de atenção e como motivo de contato imediato na aba É normal?.',
    fontes: [
      {
        entidade: 'MedlinePlus — National Library of Medicine',
        sigla: 'NIH, Estados Unidos',
        url: 'https://medlineplus.gov',
        papel:
          'Cuidados após cirurgia, cicatrização, sinais de infecção e de trombose, em material revisado para pacientes.',
      },
      {
        entidade: 'National Health Service',
        sigla: 'NHS, Reino Unido',
        url: 'https://www.nhs.uk',
        papel:
          'Recuperação após procedimentos, cuidado com feridas e quando procurar atendimento.',
      },
    ],
  },
  {
    heading: 'Registro profissional',
    intro: 'Onde confirmar quem responde pelo conteúdo.',
    fontes: [
      {
        entidade: 'Conselho Federal de Medicina',
        sigla: 'CFM',
        url: 'https://portal.cfm.org.br',
        papel: `Consulta pública de registro médico. ${clinic.crm}.`,
      },
    ],
  },
];

export const ressalva =
  'Nenhum material geral substitui a avaliação individual. Em caso de divergência entre o que está no aplicativo e o que a equipe orientou para o seu caso, prevalece sempre a orientação da equipe.';

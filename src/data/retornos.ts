import type { ProcedureId } from './procedures';

/**
 * Lembretes de retorno.
 *
 * Todo procedimento tem um prazo em que faz sentido reavaliar: a toxina perde
 * efeito, o preenchimento se reabsorve, o laser costuma pedir mais de uma
 * sessão. Quem operou some da clínica justamente quando estaria pronta para
 * cuidar do resto — não por falta de vontade, mas porque ninguém lembra de uma
 * data que não está anotada em lugar nenhum.
 *
 * O app já sabe o que ela fez e quando. Anotar essa data é a única coisa que
 * falta, e é local: nada é enviado para a clínica.
 *
 * ── Sobre o texto ──────────────────────────────────────────────────────────
 *
 * Nenhum aviso oferece desconto, preço, promoção ou "condição especial". A
 * publicidade médica no Brasil não permite (Resolução CFM 2.336/2023), e o
 * app leva o nome e o CRM do cirurgião na tela de abertura. O convite é para
 * conversar e reavaliar — que é o que de fato precisa acontecer antes de
 * qualquer novo procedimento.
 *
 * O tom também é decidido, e não só regulatório: quem abre este app abriu
 * para saber se o inchaço é normal. Um aviso que soa como anúncio gasta a
 * confiança que faz o app ser aberto quando o sinal é de alarme.
 */

export interface Retorno {
  id: string;
  /** A quais procedimentos o aviso pertence. */
  procedures: ProcedureId[];
  /** Dias após o procedimento. */
  afterDays: number;
  /** Título do aviso — é o que aparece na tela bloqueada. */
  title: string;
  /** Uma frase, também na notificação. */
  body: string;
  /**
   * Por que este é o prazo. Só aparece na tela de lembretes, onde ela pode
   * conferir o que vai receber antes de aceitar.
   */
  porque: string;
}

/** Cirurgias — os avisos gerais valem para todas. */
const CIRURGIAS: ProcedureId[] = [
  'mamoplastia_aumento',
  'mastopexia',
  'mamoplastia_redutora',
  'abdominoplastia',
  'lipoescultura',
  'lipo_hd',
  'rinoplastia',
  'face_hd',
  'blefaroplastia',
  'otoplastia',
  'ginecomastia',
  'pos_bariatrica',
];

const MES = 30;
const ANO = 365;

export const retornos: Retorno[] = [
  {
    id: 'toxina-4-meses',
    procedures: ['toxina'],
    afterDays: 4 * MES,
    title: 'Sua toxina completa 4 meses',
    body: 'É por volta desta época que o efeito começa a ceder. Se quiser reavaliar, fale com a nossa equipe.',
    porque:
      'O efeito da toxina botulínica costuma durar de 4 a 6 meses. Reaplicar antes de a musculatura voltar por completo é o que mantém o resultado constante.',
  },
  {
    id: 'preenchimento-1-ano',
    procedures: ['preenchimento'],
    afterDays: ANO,
    title: 'Faz um ano do seu preenchimento',
    body: 'O ácido hialurônico costuma manter o resultado por cerca de um ano. Vale reavaliar com a equipe.',
    porque:
      'O ácido hialurônico é reabsorvido aos poucos pelo organismo. Em torno de um ano é quando a maioria das pacientes percebe a diferença.',
  },
  {
    id: 'laser-co2-1-mes',
    procedures: ['laser_co2'],
    afterDays: MES,
    title: 'Seu laser de CO₂ completa 1 mês',
    body: 'A pele já se recuperou. É o momento de avaliar se vale uma nova sessão.',
    porque:
      'O laser de CO₂ costuma ser feito em mais de uma sessão. Um mês é o intervalo mínimo para a pele estar recuperada e pronta para a seguinte, se ela for indicada.',
  },
  {
    id: 'morpheus-1-mes',
    procedures: ['morpheus'],
    afterDays: MES,
    title: 'Seu Morpheus completa 1 mês',
    body: 'O tratamento costuma ser feito em sessões. Vale conversar com a equipe sobre a próxima.',
    porque:
      'O Morpheus é planejado em série, e o resultado é progressivo a cada sessão.',
  },
  {
    id: 'bioestimulador-2-anos',
    procedures: ['bioestimulador'],
    afterDays: 2 * ANO,
    title: 'Faz dois anos do seu bioestimulador',
    body: 'O colágeno estimulado sustenta o resultado por cerca de dois anos. É um bom momento para reavaliar.',
    porque:
      'O bioestimulador não some de uma vez: o colágeno formado vai se renovando mais devagar com o tempo. Em torno de dois anos é quando costuma valer um novo estímulo.',
  },
  {
    id: 'cirurgia-3-meses',
    procedures: CIRURGIAS,
    afterDays: 3 * MES,
    title: 'Três meses de cirurgia',
    body: 'Com a recuperação concluída, é a fase em que dá para cuidar da pele e das cicatrizes. Converse com a equipe sobre o que faz sentido para você.',
    porque:
      'Aos três meses a cicatrização já avançou o suficiente para que tratamentos de pele e de cicatriz possam ser considerados — o que não era possível nas primeiras semanas.',
  },
  {
    id: 'cirurgia-1-ano',
    procedures: CIRURGIAS,
    afterDays: ANO,
    title: 'Faz um ano da sua cirurgia',
    body: 'O resultado já está definido. Se alguma outra coisa te incomoda, o Dr. Henrique está à disposição para conversar.',
    porque:
      'Um ano é quando o resultado de uma cirurgia plástica se considera definitivo. É também o intervalo habitual de uma reavaliação de rotina.',
  },
];

/** Os avisos que pertencem aos procedimentos da paciente, sem repetir. */
export const retornosFor = (ids: ProcedureId[]): Retorno[] =>
  retornos.filter((r) => ids.some((id) => r.procedures.includes(id)));

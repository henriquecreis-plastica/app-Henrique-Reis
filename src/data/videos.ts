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
}

/**
 * Vídeos do canal do Dr. Henrique Reis, exibidos conforme o procedimento da
 * paciente. Aparecem como link: abrem no app do YouTube ou no navegador, sem
 * player embutido — o que manteria o pacote leve e a revisão das lojas
 * simples, sem conteúdo de terceiros dentro do app.
 *
 * Para acrescentar um vídeo, basta uma entrada aqui. Nenhuma tela muda.
 */
export const videos: Video[] = [
  {
    id: 'geral',
    title: 'Tudo sobre a cirurgia plástica',
    summary: 'Uma visão geral — bom de assistir antes de operar',
    url: 'https://youtu.be/pB5Qkz9VQho',
    kinds: ['cirurgico'],
    preOp: true,
  },
  {
    id: 'mastopexia',
    title: 'Mastopexia com prótese',
    summary: 'Como é a cirurgia, do planejamento ao resultado',
    url: 'https://youtu.be/5RLtz_8A-bU',
    procedures: ['mastopexia'],
  },
  {
    id: 'abdominoplastia',
    title: 'Abdominoplastia',
    summary: 'Como é a cirurgia, do planejamento ao resultado',
    url: 'https://youtu.be/dPUpOOxFRr8',
    procedures: ['abdominoplastia'],
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

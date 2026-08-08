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

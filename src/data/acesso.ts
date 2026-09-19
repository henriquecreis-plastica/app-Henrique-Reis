/**
 * O código de acesso que a clínica entrega na alta.
 *
 * ------------------------------------------------------------------
 * O QUE ISTO É, E O QUE NÃO É
 * ------------------------------------------------------------------
 * É um porteiro, não uma fechadura. O código é conferido dentro do próprio
 * aparelho, sem servidor — o que mantém o app funcionando offline e não muda
 * nada do que foi declarado às lojas sobre privacidade.
 *
 * A consequência honesta é que quem sabe abrir o pacote do aplicativo
 * consegue extrair o código. O guardado aqui é embaralhado justamente para
 * que ele não apareça numa busca de texto simples, mas isso atrasa o curioso,
 * não impede o determinado.
 *
 * O que ele de fato resolve: filtra quem baixou por curiosidade, sinaliza que
 * o aplicativo é das pacientes da clínica, e dá à equipe uma conversa a mais
 * na alta — que é quando a paciente mais precisa ouvir como usar.
 *
 * ------------------------------------------------------------------
 * COMO TROCAR O CÓDIGO
 * ------------------------------------------------------------------
 * Os códigos não ficam escritos aqui em texto: ficam as suas assinaturas.
 * Para gerar a assinatura de um código novo, rode na pasta do projeto:
 *
 *     node scripts/gerar-codigo.js MEUCODIGO
 *
 * e cole o resultado na lista `ASSINATURAS`. Vale mais de um código ao mesmo
 * tempo — é o que permite aposentar um antigo sem derrubar quem já entrou,
 * ou dar códigos diferentes por período.
 *
 * Trocar o código NÃO expulsa ninguém: quem já entrou continua dentro, porque
 * o que fica guardado no aparelho é a data da liberação, não o código.
 */

/**
 * Tira do que a paciente digitou tudo o que é ruído: espaço, hífen, acento e
 * maiúscula. "hr 2026", "HR-2026" e "Hr2026" são o mesmo código — e precisam
 * ser, porque quem digita está no primeiro dia de pós-operatório.
 */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();
}

/** Embaralha o código para que ele não apareça legível dentro do aplicativo. */
export function assinar(texto: string): string {
  const base = normalizar(texto);
  let a = 0x811c9dc5;
  let b = 0x01000193;
  for (let i = 0; i < base.length; i++) {
    const c = base.charCodeAt(i);
    a = Math.imul(a ^ c, 16777619) >>> 0;
    b = Math.imul(b + c, 2246822519) >>> 0;
    b = ((b << 13) | (b >>> 19)) >>> 0;
  }
  return a.toString(36) + '-' + b.toString(36);
}

/**
 * As assinaturas dos códigos aceitos.
 *
 * O código em si nunca é escrito aqui, e não deve ser escrito em lugar nenhum
 * do repositório: ele é público, e um código anotado num comentário estaria à
 * vista de qualquer um. O que a equipe precisa saber fica com a equipe.
 */
const ASSINATURAS: string[] = [
  '1qc6ko4-17kw5kj',
  'dw7bcs-g05msk',
];

export function codigoValido(texto: string): boolean {
  const base = normalizar(texto);
  if (base.length < 4) return false;
  return ASSINATURAS.includes(assinar(base));
}

/**
 * Gera a assinatura de um código de acesso, para colar em src/data/acesso.ts.
 *
 *     node scripts/gerar-codigo.js RECUPERA2026
 *
 * A conta é a mesma de `assinar()` em src/data/acesso.ts. Se um dia aquela
 * mudar, esta precisa mudar junto — por isso as duas estão comentadas uma
 * apontando para a outra.
 */
function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();
}

function assinar(texto) {
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

const entrada = process.argv.slice(2).join(' ');
if (!entrada) {
  console.error('Uso: node scripts/gerar-codigo.js MEUCODIGO');
  process.exit(1);
}
const base = normalizar(entrada);
if (base.length < 4) {
  console.error('O código precisa de pelo menos 4 letras ou números.');
  process.exit(1);
}
console.log('');
console.log('  Código      ', base, '   (a paciente pode digitar com espaço, hífen ou minúscula)');
console.log('  Assinatura  ', `'${assinar(base)}',`);
console.log('');
console.log('  Cole a linha da assinatura na lista ASSINATURAS de src/data/acesso.ts');
console.log('');

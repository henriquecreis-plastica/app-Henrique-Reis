/**
 * Gera as páginas públicas dos termos de uso e da política de privacidade.
 *
 * As duas lojas exigem um endereço público para a política de privacidade —
 * um link que abra num navegador, sem instalar o aplicativo. Estas páginas são
 * feitas para serem hospedadas em plasticahenrique.com, e saem da mesma fonte
 * que alimenta as telas do app, para que as duas versões nunca divirjam.
 *
 *   npx tsc --ignoreConfig src/data/legal.ts --outDir /tmp/dataout \
 *     --module commonjs --target es2020 --skipLibCheck --esModuleInterop
 *   node scripts/gerar-legal-html.js
 */
const fs = require('fs');
const path = require('path');

const { legalDocs } = require('/tmp/dataout/legal.js');

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const CLINICA = 'Dr. Henrique César dos Reis · CRM/SC 17913 · RQE 17450';

const pagina = (doc) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(doc.title)} — Aplicativo Dr. Henrique Reis</title>
<meta name="description" content="${esc(doc.intro)}">
<style>
  :root{--tiffany:#067F7B;--ink:#111;--muted:#6B6B6B;--line:#E7E7E7;--surface:#fff;--bg:#FAFAFA;--wash:#E6F7F6}
  @media (prefers-color-scheme:dark){
    :root{--tiffany:#4FD6D0;--ink:#F1F1F1;--muted:#9C9C9C;--line:#2A2A2A;--surface:#151515;--bg:#0C0C0C;--wash:#0B2E2C}
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:400 16px/1.7 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
       -webkit-font-smoothing:antialiased}
  .wrap{max-width:720px;margin:0 auto;padding:40px 20px 80px}
  .eyebrow{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--tiffany)}
  h1{font-size:32px;font-weight:400;line-height:1.2;margin:10px 0 6px}
  .data{color:var(--muted);font-size:14px;margin:0 0 28px}
  .resumo{background:var(--wash);border-radius:12px;padding:16px 18px;font-weight:600;margin:0 0 32px}
  h2{font-size:14px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;
     color:var(--tiffany);margin:36px 0 10px}
  p{margin:0 0 14px}
  ul{margin:0 0 14px;padding-left:20px}
  li{margin-bottom:6px}
  footer{margin-top:56px;padding-top:20px;border-top:1px solid var(--line);
         color:var(--muted);font-size:14px}
  a{color:var(--tiffany)}
</style>
</head>
<body>
<div class="wrap">
  <p class="eyebrow">Aplicativo de pós-operatório</p>
  <h1>${esc(doc.title)}</h1>
  <p class="data">Última revisão em ${esc(doc.updatedAt)}</p>
  <p class="resumo">${esc(doc.intro)}</p>
  ${doc.sections
    .map(
      (s) => `<h2>${esc(s.heading)}</h2>
  ${s.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('\n  ')}
  ${s.items ? `<ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}`,
    )
    .join('\n  ')}
  <footer>${esc(CLINICA)}<br>Avenida Mauro Ramos, 1970 — salas 501 e 502 · Centro · Florianópolis — SC</footer>
</div>
</body>
</html>
`;

const dir = path.join(__dirname, '..', 'docs', 'publico');
fs.mkdirSync(dir, { recursive: true });
for (const doc of legalDocs) {
  const destino = path.join(dir, `${doc.id}.html`);
  fs.writeFileSync(destino, pagina(doc));
  console.log('gerado', destino);
}

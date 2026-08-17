/**
 * Empacota o export web do Expo num único arquivo HTML autocontido, para
 * hospedar no site da clínica.
 *
 * Diferente do pacote usado como Artifact, este gera um documento HTML
 * completo — com <head> próprio, porque aqui não há host que injete um.
 *
 * Uso:
 *   npx expo export --platform web
 *   node scripts/empacotar-web.js
 *
 * Sobe o arquivo gerado em public_html/app/index.html, o que dá o endereço
 * https://www.plasticahenrique.com/app/
 */
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const DIST = path.join(RAIZ, 'dist');
const SAIDA = path.join(RAIZ, 'docs/publico/index.html');

const mime = (p) =>
  ({ '.ttf': 'font/ttf', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' })[
    path.extname(p).toLowerCase()
  ] || 'application/octet-stream';

const dataUri = (arquivo) =>
  `data:${mime(arquivo)};base64,${fs.readFileSync(arquivo).toString('base64')}`;

if (!fs.existsSync(DIST)) {
  console.error('dist/ não existe — rode antes: npx expo export --platform web');
  process.exit(1);
}

const entrada = fs
  .readdirSync(path.join(DIST, '_expo/static/js/web'))
  .find((f) => f.endsWith('.js'));
let bundle = fs.readFileSync(path.join(DIST, '_expo/static/js/web', entrada), 'utf8');

/* Só a família de ícones que o app realmente carrega; as demais somariam
   megabytes de fonte que ninguém pede. */
const MANTER_FONTE = /Ionicons/;
const refs = [...new Set(bundle.match(/\/assets\/[A-Za-z0-9@._\/-]+\.(ttf|png|jpg|ico)/g) || [])];
let embutidos = 0;

for (const ref of refs) {
  const arquivo = path.join(DIST, ref.replace(/^\//, ''));
  if (!fs.existsSync(arquivo)) continue;
  if (ref.endsWith('.ttf') && !MANTER_FONTE.test(ref)) continue;
  bundle = bundle.split(ref).join(dataUri(arquivo));
  embutidos++;
}

/* Impede que o parser de HTML encerre o <script> cedo demais. */
bundle = bundle.replace(/<\/script/gi, '<\\/script');

const icone = dataUri(path.join(RAIZ, 'assets/icon.png'));

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

<!-- Página de teste: não deve aparecer em busca nem ser seguida por robôs. -->
<meta name="robots" content="noindex, nofollow">

<title>Dr. Henrique Reis — Seu pós-operatório</title>
<meta name="description" content="Aplicativo de acompanhamento do pós-operatório para pacientes do Dr. Henrique César dos Reis.">

<!-- Adicionada à tela de início, a página abre sem barra de navegador e
     com o ícone do app, que é como a paciente vai usar de verdade. -->
<meta name="theme-color" content="#FBF9F6">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Dr. Henrique Reis">
<link rel="apple-touch-icon" href="${icone}">
<link rel="icon" href="${icone}">

<style>
  /* O app comita numa identidade clara e quente por decisão de produto.
     O que se adapta ao tema do leitor é apenas a moldura ao redor. */
  :root {
    --surround: #EFEAE2;
    --surround-edge: rgba(15, 46, 44, 0.14);
    --hint: #6B7674;
  }
  @media (prefers-color-scheme: dark) {
    :root { --surround: #0A1817; --surround-edge: rgba(196, 162, 101, 0.18); --hint: #7E8C89; }
  }

  html, body { height: 100%; }
  body { margin: 0; overflow: hidden; background: var(--surround); }

  /* No celular o app ocupa a tela inteira, como no aparelho. */
  #root {
    position: fixed;
    inset: 0;
    display: flex;
    background: #FBF9F6;
    overflow: hidden;
  }

  /* Em telas largas ele aparece na proporção de um celular, centralizado,
     com espaço reservado embaixo para a legenda. */
  @media (min-width: 700px) and (min-height: 720px) {
    #root {
      inset: auto;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-top: -20px;
      width: 400px;
      height: min(860px, calc(100vh - 96px));
      border-radius: 34px;
      border: 1px solid var(--surround-edge);
      box-shadow: 0 30px 70px rgba(8, 32, 31, 0.22);
    }
  }

  #hint {
    display: none;
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    margin: 0;
    text-align: center;
    font: 500 12px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    letter-spacing: 0.02em;
    color: var(--hint);
    pointer-events: none;
  }
  @media (min-width: 700px) and (min-height: 720px) { #hint { display: block; } }
</style>
</head>
<body>
<div id="root"></div>
<p id="hint">Abra no celular para usar como a paciente usa</p>
<noscript>Este aplicativo precisa de JavaScript ativado.</noscript>
<script>
  /* A página é servida a partir de uma URL com caminho próprio, então o app
     navega em memória e nunca reescreve a barra de endereço — assim o link
     continua válido ao recarregar e ao compartilhar. */
  history.pushState = function () {};
  history.replaceState = function () {};
</script>
<script>${bundle}</script>
</body>
</html>
`;

fs.writeFileSync(SAIDA, html);
console.log(
  `gerado ${SAIDA} — ${embutidos} arquivos embutidos, ${(fs.statSync(SAIDA).size / 1e6).toFixed(2)} MB`,
);

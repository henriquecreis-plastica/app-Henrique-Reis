const fs = require('fs');
const C = JSON.parse(fs.readFileSync('/tmp/dataout/conteudo.json', 'utf8'));

const nomeProc = Object.fromEntries(C.procedures.map((p) => [p.id, p.name]));
const NIVEL = {
  urgent: { rot: 'Contato imediato', cls: 'v' },
  attention: { rot: 'Atenção', cls: 'a' },
  normal: { rot: 'Esperado', cls: 'g' },
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ul = (arr) => `<ul>${arr.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

function aplicaA(x) {
  const p = [];
  if (x.kinds) p.push(x.kinds.includes('cirurgico') ? 'somente cirurgias' : 'somente procedimentos de consultório');
  if (x.procedures) p.push('apenas ' + x.procedures.map((id) => nomeProc[id] || id).join(', '));
  return p.length ? p.join(' · ') : 'todos os procedimentos';
}

const fase = (f) => `
  <article class="bloco">
    <h3>${esc(f.label)}</h3>
    <p class="resumo">${esc(f.summary)}</p>
    <h4>O que é esperado</h4>${ul(f.expect)}
    <h4>O que fazer</h4>${ul(f.todo)}
    <h4>O que evitar</h4>${ul(f.avoid)}
  </article>`;

const secoes = [];

secoes.push(`<section id="procedimentos"><h2>1. Procedimentos</h2>
${['cirurgico', 'ambulatorial'].map((k) => `
  <h3 class="grupo">${k === 'cirurgico' ? 'Cirurgias' : 'Procedimentos de consultório'}</h3>
  ${C.procedures.filter((p) => p.kind === k).map((p) => `
    <article class="bloco">
      <h3>${esc(p.name)}</h3>
      <p class="meta">“${esc(p.short)}” · ${k === 'cirurgico'
        ? `recuperação estimada em ${p.recoveryWeeks} semanas`
        : `resultado final em torno de ${p.recoveryWeeks} semanas`}</p>
      <h4>Atenção especial na tela inicial</h4>${ul(p.highlights)}
    </article>`).join('')}`).join('')}
</section>`);

secoes.push(`<section id="linha-do-tempo"><h2>2. Linha do tempo</h2>
  <h3 class="grupo">Cirurgias</h3>
  ${fase(C.preOpPhase)}${C.phases.map(fase).join('')}
  <h3 class="grupo">Procedimentos de consultório</h3>
  ${fase(C.preOpOfficePhase)}${C.officePhases.map(fase).join('')}
</section>`);

secoes.push(`<section id="marcos"><h2>3. Marcos por procedimento</h2>
${Object.entries(C.milestones).map(([id, lista]) => `
  <article class="bloco">
    <h3>${esc(nomeProc[id] || id)}</h3>
    <table><tbody>${lista.map((m) =>
      `<tr><th>D${m.day}</th><td>${esc(m.text)}</td></tr>`).join('')}</tbody></table>
  </article>`).join('')}
</section>`);

secoes.push(`<section id="sintomas"><h2>4. O que é normal e o que não é</h2>
${['urgent', 'attention', 'normal'].map((n) => {
  const lista = C.symptoms.filter((s) => s.severity === n);
  return `<h3 class="grupo ${NIVEL[n].cls}">${NIVEL[n].rot} — ${lista.length} orientações</h3>
  ${lista.map((s) => `
    <article class="bloco ${NIVEL[n].cls}">
      <h3>${esc(s.title)}</h3>
      <p class="meta"><span class="chip ${NIVEL[n].cls}">${NIVEL[n].rot}</span> ${esc(s.when)} · ${esc(aplicaA(s))}</p>
      <p class="resumo forte">${esc(s.summary)}</p>
      <h4>Por que acontece</h4>${ul(s.why)}
      <h4>O que fazer</h4>${ul(s.action)}
    </article>`).join('')}`;
}).join('')}
</section>`);

secoes.push(`<section id="cuidados"><h2>5. Guias de cuidados</h2>
${C.care.map((g) => `
  <article class="bloco">
    <h3>${esc(g.title)}</h3>
    <p class="meta">“${esc(g.subtitle)}” · ${esc(aplicaA(g))}</p>
    ${g.sections.map((s) => `<h4>${esc(s.heading)}</h4>${ul(s.items)}`).join('')}
  </article>`).join('')}
</section>`);

const AVISOS = [
  ['No cadastro inicial', 'As orientações do aplicativo são gerais e não substituem a avaliação do Dr. Henrique Reis ou de sua equipe. Em caso de dúvida ou sinal de alerta, entre em contato.'],
  ['No rodapé da tela inicial', 'As informações deste aplicativo são orientações gerais e não substituem a avaliação médica individual.'],
  ['Ao final de cada orientação de sintoma', 'Esta orientação é geral. Se algo fugir do que está descrito aqui, ou se você estiver em dúvida, entre em contato com a equipe.'],
  ['Ao final de cada guia de cuidados', 'Orientações gerais. Sempre siga as instruções específicas entregues na sua alta.'],
  ['Na tela de contato', 'Este aplicativo oferece orientações gerais de acompanhamento e não substitui a consulta médica. Em caso de emergência, procure o pronto-socorro mais próximo.'],
  ['Na tela de sinais de alerta', 'Ao procurar um pronto-socorro, informe qual procedimento você realizou, a data e as medicações em uso. Leve o contato da nossa equipe com você.'],
  ['Sobre privacidade, em Meus dados', 'Seus dados ficam salvos apenas neste aparelho. Nada é enviado para a clínica pelo aplicativo.'],
];
secoes.push(`<section id="avisos"><h2>6. Avisos exibidos no aplicativo</h2>
${AVISOS.map(([onde, texto]) => `
  <article class="bloco"><h3>${esc(onde)}</h3><p class="resumo">${esc(texto)}</p></article>`).join('')}
</section>`);

const html = `<title>Conteúdo clínico para revisão — Dr. Henrique Reis</title>
<style>
  :root{--tiffany:#067F7B;--ink:#111;--muted:#6B6B6B;--line:#E7E7E7;--surface:#fff;--bg:#FAFAFA;
        --v:#B3261E;--vw:#FCE9E7;--a:#9A6209;--aw:#FCF0DA;--gw:#E6F7F6;}
  @media (prefers-color-scheme:dark){:root{--ink:#F1F1F1;--muted:#9C9C9C;--line:#2A2A2A;--surface:#151515;--bg:#0C0C0C;
        --tiffany:#4FD6D0;--v:#F0857C;--vw:#2C1311;--a:#E0A94A;--aw:#2A2010;--gw:#0B2E2C;}}
  :root[data-theme="dark"]{--ink:#F1F1F1;--muted:#9C9C9C;--line:#2A2A2A;--surface:#151515;--bg:#0C0C0C;
        --tiffany:#4FD6D0;--v:#F0857C;--vw:#2C1311;--a:#E0A94A;--aw:#2A2010;--gw:#0B2E2C;}
  :root[data-theme="light"]{--ink:#111;--muted:#6B6B6B;--line:#E7E7E7;--surface:#fff;--bg:#FAFAFA;
        --tiffany:#067F7B;--v:#B3261E;--vw:#FCE9E7;--a:#9A6209;--aw:#FCF0DA;--gw:#E6F7F6;}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:400 16px/1.65 ui-serif,Georgia,"Times New Roman",serif;-webkit-font-smoothing:antialiased}
  .wrap{max-width:760px;margin:0 auto;padding:32px 20px 96px}
  .sans{font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
  .eyebrow{font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;font-weight:700;
           letter-spacing:2px;text-transform:uppercase;color:var(--tiffany)}
  h1{font-size:34px;font-weight:400;line-height:1.15;margin:8px 0 12px}
  h2{font-family:ui-sans-serif,system-ui,sans-serif;font-size:24px;font-weight:700;
     margin:64px 0 8px;padding-top:20px;border-top:2px solid var(--ink)}
  h3.grupo{font-family:ui-sans-serif,system-ui,sans-serif;font-size:13px;font-weight:700;
           letter-spacing:1.6px;text-transform:uppercase;color:var(--tiffany);margin:36px 0 12px}
  h3.grupo.v{color:var(--v)} h3.grupo.a{color:var(--a)}
  .bloco{background:var(--surface);border:1px solid var(--line);border-radius:12px;
         padding:20px 22px;margin:0 0 14px}
  .bloco.v{border-left:4px solid var(--v)} .bloco.a{border-left:4px solid var(--a)}
  .bloco.g{border-left:4px solid var(--tiffany)}
  .bloco h3{font-family:ui-sans-serif,system-ui,sans-serif;font-size:18px;font-weight:700;margin:0 0 6px}
  .bloco h4{font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;font-weight:700;
            letter-spacing:1.4px;text-transform:uppercase;color:var(--tiffany);margin:20px 0 6px}
  .meta{font-family:ui-sans-serif,system-ui,sans-serif;font-size:13px;color:var(--muted);margin:0 0 10px}
  .resumo{margin:0} .forte{font-weight:600}
  ul{margin:0;padding-left:20px} li{margin-bottom:5px}
  .chip{display:inline-block;font-size:11px;font-weight:700;padding:2px 8px;border-radius:99px;margin-right:6px}
  .chip.v{background:var(--vw);color:var(--v)} .chip.a{background:var(--aw);color:var(--a)}
  .chip.g{background:var(--gw);color:var(--tiffany)}
  table{width:100%;border-collapse:collapse;font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px}
  th{text-align:left;width:64px;color:var(--tiffany);font-weight:700;padding:6px 0;vertical-align:top}
  td{padding:6px 0;vertical-align:top}
  .alerta{background:var(--aw);color:var(--a);border-radius:10px;padding:14px 16px;margin:24px 0;
          font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;font-weight:600}
  nav{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:16px 20px;margin:28px 0 8px;
      font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px}
  nav ol{margin:0;padding-left:20px} nav li{margin-bottom:4px}
  nav a{color:var(--ink)} a{color:var(--tiffany)}
  footer{margin-top:64px;padding-top:20px;border-top:1px solid var(--line);
         font-family:ui-sans-serif,system-ui,sans-serif;font-size:13px;color:var(--muted)}
</style>

<div class="wrap">
  <p class="eyebrow">Henrique Reis · Cirurgia Plástica</p>
  <h1>Conteúdo clínico do aplicativo</h1>
  <p class="meta">Tudo o que a paciente lê, extraído automaticamente do aplicativo em ${new Date().toLocaleDateString('pt-BR')} · ${C.procedures.length} procedimentos · ${C.symptoms.length} orientações de sintomas · ${C.care.length} guias de cuidados</p>

  <div class="alerta">Este conteúdo ainda não foi validado clinicamente. Nenhuma paciente deve recebê-lo antes da sua revisão e aprovação.</div>

  <nav>
    <ol>
      <li><a href="#procedimentos">Procedimentos</a></li>
      <li><a href="#linha-do-tempo">Linha do tempo</a></li>
      <li><a href="#marcos">Marcos por procedimento</a></li>
      <li><a href="#sintomas">O que é normal e o que não é</a></li>
      <li><a href="#cuidados">Guias de cuidados</a></li>
      <li><a href="#avisos">Avisos exibidos no aplicativo</a></li>
    </ol>
  </nav>

  ${secoes.join('\n')}

  <footer>
    <p>Para marcar correções, há uma versão em Word no repositório: <code>docs/conteudo-clinico-para-revisao.docx</code>, com uma linha de anotação abaixo de cada bloco.</p>
    <p>O conteúdo vive em quatro arquivos de texto simples — <code>src/data/procedures.ts</code>, <code>timeline.ts</code>, <code>symptoms.ts</code> e <code>care.ts</code> — e pode ser editado sem mexer em nenhuma tela.</p>
  </footer>
</div>`;

fs.writeFileSync('/tmp/claude-0/-home-user-app-Henrique-Reis/addcd0c5-ad64-5fde-84ab-ace7fc08167e/scratchpad/revisao.html', html);
console.log('gerado revisao.html', (html.length / 1024).toFixed(0) + 'KB');

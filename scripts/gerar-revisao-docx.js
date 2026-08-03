const fs = require('fs');
const d = require('/home/user/app-Henrique-Reis/node_modules/docx');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, LevelFormat,
  TableOfContents, Footer, PageNumber,
} = d;

const C = JSON.parse(fs.readFileSync('/tmp/dataout/conteudo.json', 'utf8'));

const TIFFANY = '067F7B';
const INK = '111111';
const CINZA = '6B6B6B';
const VERM = 'B3261E';
const AMBAR = '9A6209';

const nomeProc = Object.fromEntries(C.procedures.map((p) => [p.id, p.name]));
const NIVEL = {
  urgent: { rot: 'CONTATO IMEDIATO', cor: VERM },
  attention: { rot: 'ATENÇÃO', cor: AMBAR },
  normal: { rot: 'ESPERADO', cor: TIFFANY },
};

// ---------- blocos reutilizáveis ----------
const espaco = (n = 120) => new Paragraph({ spacing: { after: n }, children: [] });

const rotulo = (t, cor = TIFFANY) =>
  new Paragraph({
    spacing: { before: 240, after: 80 },
    children: [new TextRun({ text: t.toUpperCase(), bold: true, size: 17, color: cor, characterSpacing: 30 })],
  });

const corpo = (t, opts = {}) =>
  new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: t, size: 21, ...opts })] });

const itens = (arr) =>
  arr.map((t) => new Paragraph({ numbering: { reference: 'marcadores', level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: t, size: 21 })] }));

/** Linha de anotação para o revisor escrever a correção. */
const linhaRevisao = () =>
  new Paragraph({
    spacing: { before: 100, after: 240 },
    border: { bottom: { style: BorderStyle.DOTTED, size: 4, color: 'C8C8C8', space: 4 } },
    children: [new TextRun({ text: 'Correção: ', italics: true, size: 17, color: 'AAAAAA' })],
  });

const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, spacing: { after: 240 }, children: [new TextRun({ text: t, size: 34, bold: true, color: INK })] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 360, after: 140 }, children: [new TextRun({ text: t, size: 26, bold: true, color: INK })] });
const h3 = (t, cor = INK) => new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 280, after: 100 }, children: [new TextRun({ text: t, size: 23, bold: true, color: cor })] });

const nota = (t) =>
  new Paragraph({
    spacing: { before: 100, after: 200 },
    shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' },
    children: [new TextRun({ text: t, size: 19, italics: true, color: CINZA })],
  });

// ---------- capa ----------
const capa = [
  espaco(2400),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'HENRIQUE REIS · CIRURGIA PLÁSTICA', bold: true, size: 20, color: TIFFANY, characterSpacing: 60 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'Aplicativo de pós-operatório', size: 48, color: INK })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: 'Conteúdo clínico completo para revisão médica', size: 24, color: CINZA })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Gerado a partir do aplicativo em ${new Date().toLocaleDateString('pt-BR')}`, size: 19, color: CINZA })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1200 }, children: [new TextRun({ text: `${C.procedures.length} procedimentos · ${C.symptoms.length} orientações de sintomas · ${C.care.length} guias de cuidados`, size: 19, color: CINZA })] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    shading: { type: ShadingType.CLEAR, fill: 'FCF0DA' },
    spacing: { before: 200, after: 200 },
    children: [new TextRun({ text: 'Este conteúdo ainda não foi validado clinicamente. Nenhuma paciente deve recebê-lo antes da sua revisão e aprovação.', bold: true, size: 20, color: AMBAR })],
  }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------- como revisar ----------
const comoRevisar = [
  new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 200 }, children: [new TextRun({ text: 'Como revisar este documento', size: 34, bold: true, color: INK })] }),
  corpo('Todo o texto abaixo é exatamente o que a paciente lê no aplicativo, extraído automaticamente dos arquivos de conteúdo. Nada aqui é resumo ou paráfrase.'),
  corpo('Abaixo de cada bloco há uma linha pontilhada "Correção:" para você escrever o que deve mudar. Pode também usar o controle de alterações do Word, ou simplesmente marcar e devolver — qualquer forma serve.'),
  rotulo('O que mais precisa do seu olhar'),
  ...itens([
    'Prazos: liberação de exercícios, início e frequência da drenagem, tempo de compressão, retirada de pontos.',
    'Condutas que variam entre serviços: primeiro banho, uso de dreno, protocolo de massagem em bioestimulador.',
    'Limiares dos sinais de alerta: o que sobe para "contato imediato" e o que fica em "atenção".',
    'Linguagem: se alguma frase assusta mais do que informa, ou informa menos do que deveria.',
  ]),
  rotulo('Onde cada parte vive no código'),
  corpo('Se preferir editar direto, os arquivos são de texto simples e não exigem mexer em nenhuma tela:'),
  ...itens([
    'src/data/procedures.ts — procedimentos e pontos de atenção',
    'src/data/timeline.ts — fases da recuperação e marcos',
    'src/data/symptoms.ts — o que é normal e o que não é',
    'src/data/care.ts — guias de cuidados',
  ]),
  new Paragraph({ spacing: { before: 400 }, children: [] }),
  new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { after: 160 }, children: [new TextRun({ text: 'Sumário', size: 26, bold: true, color: INK })] }),
  new TableOfContents('Sumário', { hyperlink: true, headingStyleRange: '1-2' }),
];

// ---------- parte 1: procedimentos ----------
const parteProcedimentos = [h1('1. Procedimentos')];
for (const tipo of ['cirurgico', 'ambulatorial']) {
  parteProcedimentos.push(h2(tipo === 'cirurgico' ? 'Cirurgias' : 'Procedimentos de consultório'));
  for (const p of C.procedures.filter((x) => x.kind === tipo)) {
    parteProcedimentos.push(h3(p.name));
    parteProcedimentos.push(corpo(`Descrição na seleção: "${p.short}"`, { color: CINZA, size: 19 }));
    parteProcedimentos.push(
      corpo(
        tipo === 'cirurgico'
          ? `Recuperação estimada exibida: ${p.recoveryWeeks} semanas`
          : `Resultado final exibido: em torno de ${p.recoveryWeeks} semanas`,
        { color: CINZA, size: 19 },
      ),
    );
    parteProcedimentos.push(rotulo('Atenção especial mostrada na tela inicial'));
    parteProcedimentos.push(...itens(p.highlights));
    parteProcedimentos.push(linhaRevisao());
  }
}

// ---------- fases ----------
function blocosFase(f) {
  const b = [h3(f.label)];
  b.push(corpo(f.summary));
  b.push(rotulo('O que é esperado'));
  b.push(...itens(f.expect));
  b.push(rotulo('O que fazer'));
  b.push(...itens(f.todo));
  b.push(rotulo('O que evitar'));
  b.push(...itens(f.avoid));
  b.push(linhaRevisao());
  return b;
}

const parteFases = [h1('2. Linha do tempo')];
parteFases.push(h2('Cirurgias'));
parteFases.push(nota('A paciente vê a fase correspondente ao dia dela em destaque, e pode abrir as demais.'));
parteFases.push(...blocosFase(C.preOpPhase));
for (const f of C.phases) parteFases.push(...blocosFase(f));

parteFases.push(h2('Procedimentos de consultório'));
parteFases.push(nota('Escala menor: o que na cirurgia leva semanas, aqui se resolve em dias.'));
parteFases.push(...blocosFase(C.preOpOfficePhase));
for (const f of C.officePhases) parteFases.push(...blocosFase(f));

// ---------- marcos ----------
const parteMarcos = [h1('3. Marcos por procedimento')];
parteMarcos.push(nota('Aparecem na linha do tempo e na tela inicial, como contagem para o próximo marco.'));
for (const [id, lista] of Object.entries(C.milestones)) {
  parteMarcos.push(h3(nomeProc[id] || id));
  const linhas = [
    new TableRow({
      children: ['Dia', 'O que a paciente lê'].map((t, i) =>
        new TableCell({
          width: { size: i === 0 ? 1100 : 7900, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: 'EFEFEF' },
          children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 19 })] })],
        }),
      ),
    }),
    ...lista.map((m) =>
      new TableRow({
        children: [
          new TableCell({ width: { size: 1100, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: `D${m.day}`, size: 20, bold: true })] })] }),
          new TableCell({ width: { size: 7900, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: m.text, size: 20 })] })] }),
        ],
      }),
    ),
  ];
  parteMarcos.push(new Table({ columnWidths: [1100, 7900], width: { size: 9000, type: WidthType.DXA }, rows: linhas }));
  parteMarcos.push(linhaRevisao());
}

// ---------- sintomas ----------
function aplicaA(s) {
  const partes = [];
  if (s.kinds) partes.push(s.kinds.includes('cirurgico') ? 'somente cirurgias' : 'somente procedimentos de consultório');
  if (s.procedures) partes.push('apenas: ' + s.procedures.map((id) => nomeProc[id] || id).join(', '));
  return partes.length ? partes.join(' · ') : 'todos os procedimentos';
}

const parteSintomas = [h1('4. O que é normal e o que não é')];
parteSintomas.push(nota('É a parte mais consultada do aplicativo. Cada item traz o nível, quando acontece, a resposta curta, por que acontece e o que fazer.'));
for (const nivel of ['urgent', 'attention', 'normal']) {
  const lista = C.symptoms.filter((s) => s.severity === nivel);
  parteSintomas.push(h2(`${NIVEL[nivel].rot} — ${lista.length} orientações`));
  for (const s of lista) {
    parteSintomas.push(h3(s.title, NIVEL[nivel].cor));
    parteSintomas.push(corpo(`Quando: ${s.when}  |  Aplica-se a: ${aplicaA(s)}`, { color: CINZA, size: 19 }));
    parteSintomas.push(corpo(s.summary, { bold: true }));
    parteSintomas.push(rotulo('Por que acontece'));
    parteSintomas.push(...itens(s.why));
    parteSintomas.push(rotulo('O que fazer'));
    parteSintomas.push(...itens(s.action));
    parteSintomas.push(linhaRevisao());
  }
}

// ---------- cuidados ----------
const parteCuidados = [h1('5. Guias de cuidados')];
for (const g of C.care) {
  parteCuidados.push(h3(g.title));
  parteCuidados.push(corpo(`"${g.subtitle}"  |  Aplica-se a: ${aplicaA(g)}`, { color: CINZA, size: 19 }));
  for (const sec of g.sections) {
    parteCuidados.push(rotulo(sec.heading));
    parteCuidados.push(...itens(sec.items));
  }
  parteCuidados.push(linhaRevisao());
}

// ---------- avisos ----------
const parteAvisos = [
  h1('6. Avisos exibidos no aplicativo'),
  nota('Textos fixos, mostrados independentemente do procedimento.'),
  h3('No cadastro inicial'),
  corpo('As orientações do aplicativo são gerais e não substituem a avaliação do Dr. Henrique Reis ou de sua equipe. Em caso de dúvida ou sinal de alerta, entre em contato.'),
  linhaRevisao(),
  h3('No rodapé da tela inicial'),
  corpo('As informações deste aplicativo são orientações gerais e não substituem a avaliação médica individual.'),
  linhaRevisao(),
  h3('Ao final de cada orientação de sintoma'),
  corpo('Esta orientação é geral. Se algo fugir do que está descrito aqui, ou se você estiver em dúvida, entre em contato com a equipe.'),
  linhaRevisao(),
  h3('Ao final de cada guia de cuidados'),
  corpo('Orientações gerais. Sempre siga as instruções específicas entregues na sua alta.'),
  linhaRevisao(),
  h3('Na tela de contato'),
  corpo('Este aplicativo oferece orientações gerais de acompanhamento e não substitui a consulta médica. Em caso de emergência, procure o pronto-socorro mais próximo.'),
  linhaRevisao(),
  h3('Na tela de sinais de alerta'),
  corpo('Ao procurar um pronto-socorro, informe qual procedimento você realizou, a data e as medicações em uso. Leve o contato da nossa equipe com você.'),
  linhaRevisao(),
  h3('No registro diário'),
  corpo('Este registro fica no seu aparelho. Se algo estiver preocupando você, não espere o retorno — fale com a equipe.'),
  linhaRevisao(),
  h3('Sobre privacidade, em Meus dados'),
  corpo('Seus dados ficam salvos apenas neste aparelho. Nada é enviado para a clínica pelo aplicativo.'),
  linhaRevisao(),
];

// ---------- documento ----------
const doc = new Document({
  creator: 'Aplicativo de pós-operatório — Dr. Henrique Reis',
  title: 'Conteúdo clínico para revisão',
  numbering: {
    config: [
      {
        reference: 'marcadores',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 360, hanging: 240 } } } },
        ],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 21, color: INK } },
    },
  },
  sections: [
    {
      properties: { page: { margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Conteúdo para revisão médica · página ', size: 16, color: CINZA }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: CINZA }),
              ],
            }),
          ],
        }),
      },
      children: [
        ...capa,
        ...comoRevisar,
        ...parteProcedimentos,
        ...parteFases,
        ...parteMarcos,
        ...parteSintomas,
        ...parteCuidados,
        ...parteAvisos,
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  const out = '/home/user/app-Henrique-Reis/docs/conteudo-clinico-para-revisao.docx';
  fs.writeFileSync(out, buf);
  console.log('gerado', out, (buf.length / 1024).toFixed(0) + 'KB');
});

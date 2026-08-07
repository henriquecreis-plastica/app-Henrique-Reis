/**
 * Reúne o conteúdo clínico dos arquivos de dados num único JSON, que é o que
 * os geradores do documento de revisão consomem.
 *
 * Depende dos arquivos já compilados para CommonJS:
 *
 *   npx tsc --ignoreConfig src/data/*.ts --outDir /tmp/dataout \
 *     --module commonjs --target es2020 --skipLibCheck --esModuleInterop
 *   node scripts/extrair-conteudo.js
 */
const fs = require('fs');

const OUT = '/tmp/dataout';
const procedures = require(`${OUT}/data/procedures.js`);
const timeline = require(`${OUT}/data/timeline.js`);
const symptoms = require(`${OUT}/data/symptoms.js`);
const care = require(`${OUT}/data/care.js`);

const conteudo = {
  procedures: procedures.procedures,
  preOpPhase: timeline.preOpPhase,
  phases: timeline.phases,
  preOpOfficePhase: timeline.preOpOfficePhase,
  officePhases: timeline.officePhases,
  milestones: timeline.procedureMilestones,
  symptoms: symptoms.symptoms,
  care: care.careGuides,
};

fs.writeFileSync(`${OUT}/conteudo.json`, JSON.stringify(conteudo, null, 2));
console.log(
  `conteudo.json: ${conteudo.procedures.length} procedimentos, ` +
    `${conteudo.symptoms.length} sintomas, ${conteudo.care.length} guias`,
);

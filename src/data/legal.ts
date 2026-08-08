/**
 * Termos de uso e política de privacidade.
 *
 * Ficam aqui, e não num PDF solto, por três razões: as lojas exigem que os
 * dois estejam acessíveis dentro do aplicativo; a mesma fonte gera a versão
 * pública que precisa ficar hospedada num endereço próprio; e assim eles
 * envelhecem junto com o app, revisados no mesmo lugar que o resto do texto.
 *
 * ESTES TEXTOS PRECISAM DE REVISÃO JURÍDICA. Foram escritos a partir do que o
 * aplicativo de fato faz — nada aqui descreve tratamento de dado que não
 * exista no código — mas descrever corretamente não é o mesmo que redigir um
 * documento com validade jurídica.
 */

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  items?: string[];
}

export interface LegalDocument {
  id: 'termos' | 'privacidade';
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
}

/** Data da última revisão, exibida no topo dos dois documentos. */
const ATUALIZADO_EM = '8 de agosto de 2026';

export const termos: LegalDocument = {
  id: 'termos',
  title: 'Termos de uso',
  updatedAt: ATUALIZADO_EM,
  intro:
    'Estes termos explicam para que serve este aplicativo, o que ele faz e o que ele não faz. Ao usá-lo, você concorda com o que está descrito aqui.',
  sections: [
    {
      heading: 'O que é este aplicativo',
      paragraphs: [
        'Este é um aplicativo de acompanhamento para pacientes do Dr. Henrique César dos Reis (CRM/SC 17913 · RQE 17450). Ele reúne orientações gerais sobre o período que antecede e o que sucede procedimentos de cirurgia plástica, organizadas conforme o procedimento realizado e o dia em que você está.',
        'O conteúdo é informativo e educativo. Foi revisado e aprovado pelo Dr. Henrique Reis.',
      ],
    },
    {
      heading: 'O aplicativo não substitui atendimento médico',
      paragraphs: [
        'As informações aqui são gerais e não consideram as particularidades do seu caso. Elas não constituem diagnóstico, prescrição, laudo ou orientação individualizada.',
        'Em caso de divergência entre o que está no aplicativo e o que a equipe orientou diretamente a você, prevalece sempre a orientação da equipe.',
        'Em situação de urgência ou emergência, não aguarde resposta pelo aplicativo: procure atendimento médico imediatamente ou vá ao pronto-socorro mais próximo.',
      ],
    },
    {
      heading: 'Uso pessoal',
      paragraphs: [
        'O aplicativo é de uso pessoal. As orientações que você vê são selecionadas a partir do procedimento e da data que você informou, e podem não se aplicar a outra pessoa, ainda que ela tenha feito o mesmo procedimento.',
      ],
    },
    {
      heading: 'As informações que você digita',
      paragraphs: [
        'Você informa o seu nome, o procedimento realizado e a data. Esses dados ficam guardados apenas no seu aparelho e servem para o aplicativo mostrar o conteúdo certo para o seu momento.',
        'A exatidão dessas informações é sua responsabilidade: uma data errada faz o aplicativo mostrar orientações de outra fase da recuperação.',
        'Detalhes sobre o tratamento desses dados estão na Política de privacidade.',
      ],
    },
    {
      heading: 'Conteúdo e propriedade',
      paragraphs: [
        'Os textos, a identidade visual, as marcas e os vídeos são de titularidade do Dr. Henrique Reis e de sua clínica, e estão protegidos pela legislação aplicável.',
        'Você pode usar o conteúdo para o seu acompanhamento pessoal. Não é permitido reproduzir, distribuir ou usar comercialmente o material sem autorização por escrito.',
      ],
    },
    {
      heading: 'Links para serviços de terceiros',
      paragraphs: [
        'O aplicativo abre links para WhatsApp, YouTube, Instagram, mapas e para a página de avaliação no Google. Ao tocar em qualquer um deles, você sai do aplicativo e passa a se relacionar com esses serviços, cada um com os seus próprios termos e políticas.',
        'Não temos controle sobre esses serviços nem sobre o que eles coletam.',
      ],
    },
    {
      heading: 'Disponibilidade e mudanças',
      paragraphs: [
        'O conteúdo pode ser atualizado a qualquer momento, inclusive para refletir mudanças de conduta da equipe. O aplicativo pode ficar temporariamente indisponível por manutenção ou por questões técnicas das lojas.',
        'Alterações relevantes nestes termos serão apresentadas no aplicativo para nova confirmação.',
      ],
    },
    {
      heading: 'Limites de responsabilidade',
      paragraphs: [
        'O aplicativo é uma ferramenta complementar de acompanhamento. Não nos responsabilizamos por decisões tomadas exclusivamente com base no conteúdo apresentado aqui, sem a avaliação da equipe.',
        'Também não nos responsabilizamos por indisponibilidade de serviços de terceiros, nem por perda de informações causada por remoção do aplicativo, troca de aparelho ou falha do dispositivo — os dados ficam apenas no seu aparelho e não temos cópia deles.',
      ],
    },
    {
      heading: 'Menores de 18 anos',
      paragraphs: [
        'Pacientes menores de 18 anos devem usar o aplicativo acompanhados por quem detenha a sua guarda ou responsabilidade legal.',
      ],
    },
    {
      heading: 'Legislação aplicável',
      paragraphs: [
        'Estes termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de Florianópolis — SC para dirimir questões dele decorrentes.',
      ],
    },
    {
      heading: 'Dúvidas',
      paragraphs: [
        'Fale com a equipe pelo WhatsApp ou pelo telefone da clínica, disponíveis na tela de contato.',
      ],
    },
  ],
};

export const privacidade: LegalDocument = {
  id: 'privacidade',
  title: 'Política de privacidade',
  updatedAt: ATUALIZADO_EM,
  intro:
    'Resumo em uma frase: tudo o que você informa fica guardado apenas no seu aparelho, e o aplicativo não envia nada para a clínica nem para ninguém.',
  sections: [
    {
      heading: 'Quem é o responsável',
      paragraphs: [
        'Dr. Henrique César dos Reis — CRM/SC 17913 · RQE 17450. Avenida Mauro Ramos, 1970, salas 501 e 502, Centro, Florianópolis — SC.',
        'Contato para assuntos de privacidade: pelo WhatsApp ou telefone da clínica, disponíveis na tela de contato do aplicativo.',
      ],
    },
    {
      heading: 'Quais informações o aplicativo guarda',
      paragraphs: ['Apenas o que você digita ou marca dentro dele:'],
      items: [
        'O nome pelo qual você quer ser chamada',
        'O procedimento realizado e a data',
        'Os itens que você marca como concluídos na rotina do dia',
        'A confirmação de que leu as orientações de uso, com data e hora',
      ],
    },
    {
      heading: 'Onde essas informações ficam',
      paragraphs: [
        'No armazenamento do próprio aparelho, na área reservada ao aplicativo. Elas não são enviadas por rede, não passam por servidor nosso e não ficam em nuvem.',
        'Na prática, isso significa que nem a clínica tem acesso a elas: se você trocar de celular, os dados não vão junto, e se apagar o aplicativo, eles somem com ele.',
      ],
    },
    {
      heading: 'O aplicativo não coleta e não compartilha',
      paragraphs: ['Para não deixar dúvida sobre o que não acontece aqui:'],
      items: [
        'Não há cadastro, login, e-mail ou senha',
        'Não há coleta de localização, contatos, fotos, câmera ou microfone',
        'Não há ferramentas de análise de uso, publicidade ou rastreamento',
        'Nenhum dado é vendido, cedido ou compartilhado com terceiros',
      ],
    },
    {
      heading: 'Informações de saúde',
      paragraphs: [
        'O procedimento realizado e a data são informações relacionadas à sua saúde, e a lei brasileira as trata como dados pessoais sensíveis. É exatamente por isso que o aplicativo foi construído para mantê-las apenas no seu aparelho, sob o seu controle, sem transmissão.',
      ],
    },
    {
      heading: 'Quando você sai do aplicativo',
      paragraphs: [
        'Ao tocar no WhatsApp, no YouTube, no Instagram, no mapa ou no link de avaliação do Google, você é levada para fora do aplicativo. A partir daí valem as políticas de privacidade desses serviços, sobre as quais não temos controle.',
        'A mensagem de WhatsApp que abre já preenchida com o seu nome, procedimento e dia de pós-operatório é apenas um texto sugerido: nada é enviado até que você toque em enviar.',
      ],
    },
    {
      heading: 'Como apagar os seus dados',
      paragraphs: [
        'A qualquer momento, em Contato → Meus dados → Apagar meus dados. A remoção é imediata e definitiva no aparelho.',
        'Desinstalar o aplicativo também apaga tudo. Como não temos cópia, não há nada a solicitar da nossa parte.',
      ],
    },
    {
      heading: 'Seus direitos',
      paragraphs: [
        'A Lei Geral de Proteção de Dados assegura a você o direito de confirmar a existência de tratamento, acessar, corrigir, eliminar e portar os seus dados, entre outros.',
        'Como os dados deste aplicativo ficam somente no seu aparelho e podem ser vistos, corrigidos e apagados por você a qualquer momento, esses direitos se exercem diretamente na tela Meus dados. Se ainda assim quiser falar conosco a respeito, use os contatos da clínica.',
      ],
    },
    {
      heading: 'Crianças e adolescentes',
      paragraphs: [
        'O aplicativo é destinado a pacientes da clínica. Menores de 18 anos devem usá-lo acompanhados por quem detenha a sua guarda ou responsabilidade legal.',
      ],
    },
    {
      heading: 'Mudanças nesta política',
      paragraphs: [
        'Se esta política mudar de forma relevante, o aplicativo apresentará o novo texto para leitura e confirmação. A data da última revisão está no topo desta página.',
      ],
    },
  ],
};

export const legalDocs: LegalDocument[] = [termos, privacidade];

export const legalById = (id: string): LegalDocument | undefined =>
  legalDocs.find((d) => d.id === id);

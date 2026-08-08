# App de Pós-Operatório — Dr. Henrique Reis

Protótipo funcional de aplicativo para pacientes, com foco em orientações de
pós-operatório. Roda em **iOS** e **Android** a partir do mesmo código
(React Native + Expo) e também no navegador para demonstração.

---

## O que o app faz

O app parte de duas informações — **qual procedimento** e **qual a data** — e a
partir daí personaliza tudo o que a paciente vê.

| Tela | Função |
| --- | --- |
| **Hoje** | Mostra em que dia do pós-operatório a paciente está, o que é esperado nesta fase, a rotina do dia em formato de checklist, o que evitar e os pontos de atenção do procedimento dela. Se o procedimento ainda não aconteceu, mostra a contagem regressiva e as orientações de preparo. |
| **Evolução** | Linha do tempo com o que esperar, o que fazer e o que evitar em cada fase, mais os marcos específicos do procedimento. Seis fases nas cirurgias (48h → 12 meses), quatro nos procedimentos de consultório (24h → 2º mês). |
| **É normal?** | O coração do app. Catálogo de sintomas classificado em três níveis — **Esperado**, **Atenção** e **Contato imediato** — com busca por texto (funciona com ou sem acento) e filtros por área do corpo. |
| **Cuidados** | Guias práticos conforme o percurso. Nas cirurgias: compressão, curativos, medicação, drenagem, repouso, alimentação, cicatriz, rotina e viagens. Nos procedimentos de consultório: as primeiras 24 horas, quando o resultado aparece, cuidados com a pele após o laser e o que observar depois de injetáveis. |
| **Contato** | WhatsApp com mensagem já preenchida (nome, procedimento e dia de pós-op), telefone, Instagram, site e dados do cirurgião. Também é onde a paciente edita ou apaga os próprios dados. |
| **Sinais de alerta** | Tela de acesso rápido, disponível de qualquer lugar do app, com os sinais que exigem contato imediato e os botões de emergência. |

O conteúdo é filtrado por procedimento: uma paciente de rinoplastia vê "nariz
entupido" e "sangramento nasal"; uma de abdominoplastia vê "postura curvada" e
"seroma"; uma de preenchimento vê o sinal de oclusão vascular e a alteração de
visão, que são as urgências do procedimento dela.

### Dois percursos

O app distingue **cirurgias** de **procedimentos de consultório**, porque a
escala é outra: o que na cirurgia leva semanas, num preenchimento se resolve em
dias. Cada tipo tem a sua linha do tempo, os seus guias de cuidado e os seus
sinais de alerta — quem fez toxina botulínica não recebe orientação sobre
cinta, dreno ou ponto que abriu.

### Conteúdo clínico incluído

- **12 cirurgias**: Face HD Concept, Lipo HD Concept, mamoplastia de aumento,
  mastopexia, mamoplastia redutora, abdominoplastia, lipoescultura,
  rinoplastia, blefaroplastia, otoplastia, ginecomastia e pós-bariátrica.
- **5 procedimentos de consultório**: toxina botulínica, preenchimento com
  ácido hialurônico, bioestimulador de colágeno, laser de CO₂ e Morpheus.
- **63 orientações de sintomas** classificadas em esperado, atenção e contato
  imediato, cada uma com quando acontece, por que acontece e o que fazer.
- **6 fases de recuperação** para as cirurgias e **4 fases** para os
  procedimentos de consultório, mais marcos por procedimento.
- **16 guias de cuidados**, exibidos conforme o percurso — entre eles o
  **HR Recovery Protocol** e os guias do **Face HD Concept** e da
  **Lipo HD Concept**.
- **Vídeos do canal**, em `src/data/videos.ts`, filtrados por procedimento e
  exibidos na aba Cuidados. Abrem no YouTube; acrescentar um vídeo é uma
  entrada no arquivo, sem tocar em nenhuma tela. Quem não tem vídeo para o seu
  caso não vê seção vazia.

---

## Como rodar

```bash
npm install
npx expo start
```

- **No celular**: instale o app **Expo Go** (iOS ou Android) e escaneie o
  QR Code que aparece no terminal. É a forma mais rápida de ver o protótipo
  rodando de verdade.
- **No navegador**: `npm run web`.
- **Build de web estático** (para hospedar uma demonstração): `npm run build:web`,
  que gera a pasta `dist/`.

Para publicar nas lojas, o caminho é `eas build` (Expo Application Services) —
gera o `.ipa` para a App Store e o `.aab` para o Google Play.

---

## Identidade visual

O app usa o logotipo oficial e o verde Tiffany como cor de marca.

### Protocolos da clínica

Três guias têm arte de marca: **HR Recovery Protocol**, que aparece para toda
paciente cirúrgica, e **Face HD Concept** e **Lipo HD Concept**, que aparecem
só para quem realizou aquele planejamento. As artes vêm dos arquivos originais
e são preparadas por `scripts/submarcas.py`:

```bash
python3 scripts/submarcas.py face-hd.png hr-recovery.png lipo-hd.png
```

A clínica entrega os arquivos de dois jeitos: uns com fundo transparente,
outros achatados sobre preto. O script reconhece os dois — no segundo caso, o
quanto cada pixel tem de branco é exatamente o quanto ele tem de opacidade, e
é assim que o "HR" volta a ficar recortado.

O lockup original traz um "HR" em branco acima do bloco colorido, que sobre o
fundo claro do app simplesmente desaparecia. Por orientação da clínica, ele é
desenhado na cor do próprio bloco — o verde do Face HD, o azul do Recovery
Protocol. Nenhuma cor nova entra na identidade. O script também descarta o fio
de contorno branco que abraça a arte: ele existe para fundos escuros e, se
fosse repintado junto, viraria uma moldura que a marca não tem.

**O Face HD Concept substituiu "Cirurgia de face" na seleção** — é assim que a
clínica opera o rejuvenescimento facial. O id `face` continua existindo em
`src/data/procedures.ts`, mas apenas como etiqueta do conteúdo de face, que o
Face HD herda via `conteudoHerdado`: assim as 62 orientações não precisaram ser
reetiquetadas, e uma correção feita ali vale para o procedimento novo. O que é
exclusivo dele — mentoneira, taping, lipoenxertia, laser associado — está no
guia próprio, onde cabe a ressalva de que nem toda paciente faz todas as
etapas.

A **Lipo HD Concept** segue o mesmo desenho: herda o conteúdo da lipoescultura
e tem guia próprio, que separa o que é a Lipo HD do que é o GRAFT — a confusão
mais comum entre as pacientes, que costumam entender o procedimento como "uma
lipo mais forte".

Diferente do Face HD, ela **convive** com a lipoescultura na seleção, porque
são cirurgias distintas e a paciente precisa saber qual foi a dela. As duas
aparecem lado a lado, a convencional primeiro, e a Lipo HD carrega um `note`
— o único do app — dizendo para marcá-la apenas se foi esse o planejamento
combinado. É o campo a usar sempre que dois procedimentos se parecerem e a
escolha errada trocar todo o conteúdo que a paciente recebe.

### Logotipo

As variações em `assets/` são geradas a partir do arquivo original enviado
pela clínica, pelo script `scripts/logo.py`.

**O logotipo nunca é recolorido nem redesenhado.** Aparece sempre em preto,
como foi entregue — por isso só é usado sobre fundos claros: branco, papel ou
o verde Tiffany.

| Arquivo | Uso |
| --- | --- |
| `logo.png` | Lockup completo — abertura, carregamento e tela de contato |
| `logo-mark.png` | Assinatura com o traço — barra superior da tela Hoje |
| `logo-monogram.png` | Só as letras "hr" — ícone e favicon |
| `icon.png` | Ícone do app: assinatura preta sobre o Tiffany |
| `splash-icon.png` | Lockup preto sobre fundo branco |

A única concessão é o ícone: um quadrado não comporta um lockup de proporção
4:1 de forma legível, então nele entra a assinatura. Para usar o lockup
inteiro, troque `monogram` por `full` na linha que gera `icon.png` no script.

Para regerar tudo a partir de um novo arquivo de logo:

```bash
pip install Pillow numpy
python3 scripts/logo.py caminho/para/o/logo.png
```

As telas pedem só `variant` e `width` a
[`src/components/Logo.tsx`](src/components/Logo.tsx) — não existe caminho no
código para recolorir a arte.

### Cores

Todas em [`src/theme/brand.ts`](src/theme/brand.ts). A identidade tem três
cores, e só três:

| Token | Hex | Papel |
| --- | --- | --- |
| `tiffany` | `#0ABAB5` | O acento. Marca onde a paciente está e o que está em ordem. |
| `ink` | `#111111` | O preto do logotipo. Texto, botões de ação e ênfase. |
| `white` | `#FFFFFF` | O fundo. É o que dá o ar do consultório. |
| `tiffanyDeep` | `#067F7B` | O mesmo verde escurecido. Existe por acessibilidade: o tom puro não atinge contraste suficiente para texto pequeno sobre branco. |

Onde cada um aparece:

- **Tiffany em cheio** só no cartão de abertura da tela Hoje — o primeiro
  bloco que a paciente vê. Conteúdo longo fica sobre branco, onde se lê melhor.
- **Preto** nos botões de ação, no texto e no cartão do procedimento.
- **Semáforo clínico**: o Tiffany assume o nível "esperado". Em um app cujo
  acento já significa "está no seu curso", um verde separado só criaria ruído.
  Âmbar e vermelho ficam reservados para os dois níveis em que é preciso agir.

Os títulos seguem o logotipo: sem serifa, peso leve, e caixa alta com
espaçamento largo apenas nos rótulos — o mesmo tratamento do "cirurgia
plástica" da marca.

### Dados institucionais

Ficam no objeto `clinic`, em `src/theme/brand.ts`: WhatsApp, telefone,
endereço, Instagram, YouTube, site e títulos. O botão de WhatsApp abre a conversa com
o número da clínica e a mensagem já preenchida com nome, procedimento e dia
de pós-operatório; o endereço abre o mapa.

Um ponto ainda em aberto: `emergency` aponta para o mesmo número da clínica.
Se houver um plantão 24h com número próprio, é ali que ele entra — é o número
que os botões de urgência discam.

---

## Revisão médica

O conteúdo clínico foi redigido a partir de orientações consolidadas de
pós-operatório em cirurgia plástica e escrito em linguagem de paciente. Ele
**precisa da sua revisão e aprovação antes de ir ao ar** — tanto no mérito
quanto nos prazos, que devem refletir a sua conduta.

Os pontos que provavelmente você vai querer ajustar primeiro:

- Prazos de liberação em `src/data/care.ts` (guia "Volta à rotina e exercícios").
- Início e frequência da drenagem linfática.
- Tempo de uso da compressão por procedimento.
- Marcos de retirada de pontos em `src/data/timeline.ts`.

### Documento de revisão

Em `docs/` há duas versões de todo o conteúdo clínico, geradas automaticamente
a partir dos próprios arquivos de dados — não são resumo nem paráfrase:

- `conteudo-clinico-para-revisao.docx` — para marcar correções, com uma linha
  de anotação abaixo de cada bloco.
- `conteudo-clinico-para-revisao.html` — para ler no celular ou no navegador.

Para regerar depois de editar o conteúdo:

```bash
npx tsc --ignoreConfig src/data/*.ts --outDir /tmp/dataout \
  --module commonjs --target es2020 --skipLibCheck --esModuleInterop
node -e "…"   # ver scripts/gerar-revisao-*.js
npm install --no-save docx
node scripts/gerar-revisao-docx.js
node scripts/gerar-revisao-html.js
```

Todo o conteúdo está em arquivos de dados separados do código, em português e
em texto simples — dá para editar sem mexer em nenhuma tela:

```
src/data/procedures.ts   procedimentos e pontos de atenção
src/data/timeline.ts     fases da recuperação e marcos
src/data/symptoms.ts     o que é normal e o que não é
src/data/care.ts         guias de cuidados
src/data/videos.ts       vídeos do canal, por procedimento
```

O app exibe aviso de que as orientações são gerais e não substituem a avaliação
médica no onboarding, no rodapé da tela inicial, em cada orientação e na tela de
contato.

---

## Estado atual e próximos passos

Este é um **protótipo**: funciona de ponta a ponta, mas guarda os dados apenas
no aparelho (`AsyncStorage`), sem cadastro nem servidor.

### Registro diário e painel da equipe, adiados

Chegaram a ser construídos — registro diário com foto no app, motor de
triagem e uma demonstração do painel com a fila de pacientes em vermelho,
amarelo e verde. Foram retirados para que a primeira versão chegue às lojas
mais leve.

A decisão tem ganho imediato: **sem câmera e sem foto, o app não pede
nenhuma permissão sensível e nada sai do aparelho da paciente.** Isso
encurta a revisão da App Store, simplifica a declaração de privacidade das
duas lojas e mantém a LGPD num patamar trivial — não há dado pessoal
sensível sendo tratado.

Nada se perdeu. Para trazer de volta:

```bash
git revert --no-commit 3851039   # registro diário, triagem e painel
```

Antes de reativar, duas decisões da clínica precisam estar fechadas:
consentimento específico para armazenar foto de área operada (LGPD, art. 11)
e a rotina de plantão — quem olha o painel, em que horário e em quanto tempo
responde.

### Próxima etapa

O que faria sentido acrescentar:

- **Notificações**: lembretes de medicação, de retorno e de troca de fase.
- **Área da equipe**: a clínica cadastra a cirurgia e a data, e a paciente
  apenas entra com um código — elimina o erro de digitação e permite
  personalizar as orientações caso a caso.
- **Conteúdo em vídeo**: você explicando as orientações principais.
- **Termos de uso e política de privacidade**: exigidos pela App Store e pelo
  Google Play, especialmente em app de saúde.

---

## Stack

Expo SDK 57 · React Native 0.86 · Expo Router · TypeScript (strict) ·
AsyncStorage · react-native-svg

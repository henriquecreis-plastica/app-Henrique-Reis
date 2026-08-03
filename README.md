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
| **Hoje** | Mostra em que dia do pós-operatório a paciente está, o que é esperado nesta fase, a rotina do dia em formato de checklist, o que evitar e os pontos de atenção do procedimento dela. Se a cirurgia ainda não aconteceu, mostra a contagem regressiva e as orientações de preparo. |
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

- **11 cirurgias**: mamoplastia de aumento, mastopexia, mamoplastia redutora,
  abdominoplastia, lipoescultura, rinoplastia, cirurgia de face,
  blefaroplastia, otoplastia, ginecomastia e pós-bariátrica.
- **5 procedimentos de consultório**: toxina botulínica, preenchimento com
  ácido hialurônico, bioestimulador de colágeno, laser de CO₂ e Morpheus.
- **62 orientações de sintomas** classificadas em esperado, atenção e contato
  imediato, cada uma com quando acontece, por que acontece e o que fazer.
- **6 fases de recuperação** para as cirurgias e **4 fases** para os
  procedimentos de consultório, mais marcos por procedimento.
- **13 guias de cuidados**, exibidos conforme o percurso.

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
endereço, Instagram, site e títulos. O botão de WhatsApp abre a conversa com
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

Todo o conteúdo está em arquivos de dados separados do código, em português e
em texto simples — dá para editar sem mexer em nenhuma tela:

```
src/data/procedures.ts   procedimentos e pontos de atenção
src/data/timeline.ts     fases da recuperação e marcos
src/data/symptoms.ts     o que é normal e o que não é
src/data/care.ts         guias de cuidados
```

O app exibe aviso de que as orientações são gerais e não substituem a avaliação
médica no onboarding, no rodapé da tela inicial, em cada orientação e na tela de
contato.

---

## Estado atual e próximos passos

Este é um **protótipo**: funciona de ponta a ponta, mas guarda os dados apenas
no aparelho (`AsyncStorage`), sem cadastro nem servidor.

O que faria sentido acrescentar numa próxima etapa:

- **Notificações**: lembretes de medicação, de retorno e de troca de fase.
- **Diário de fotos**: registro da evolução, com comparação lado a lado.
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

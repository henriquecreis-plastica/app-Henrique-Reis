# App de Pós-Operatório — Dr. Henrique Reis

Protótipo funcional de aplicativo para pacientes, com foco em orientações de
pós-operatório. Roda em **iOS** e **Android** a partir do mesmo código
(React Native + Expo) e também no navegador para demonstração.

---

## O que o app faz

O app parte de duas informações — **qual procedimento** e **qual a data da
cirurgia** — e a partir daí personaliza tudo o que a paciente vê.

| Tela | Função |
| --- | --- |
| **Hoje** | Mostra em que dia do pós-operatório a paciente está, o que é esperado nesta fase, a rotina do dia em formato de checklist, o que evitar e os pontos de atenção do procedimento dela. |
| **Evolução** | Linha do tempo em 6 fases (48h → 12 meses), com o que esperar, o que fazer e o que evitar em cada uma, mais os marcos específicos do procedimento. |
| **É normal?** | O coração do app. Catálogo de sintomas classificado em três níveis — **Esperado**, **Atenção** e **Contato imediato** — com busca por texto (funciona com ou sem acento) e filtros por área do corpo. |
| **Cuidados** | Nove guias práticos: compressão, curativos e banho, medicação, drenagem linfática, repouso e posição para dormir, alimentação, cicatriz, volta à rotina e viagens. |
| **Contato** | WhatsApp com mensagem já preenchida (nome, procedimento e dia de pós-op), telefone, Instagram, site e dados do cirurgião. |
| **Sinais de alerta** | Tela de acesso rápido, disponível de qualquer lugar do app, com os sinais que exigem contato imediato e os botões de emergência. |

O conteúdo é filtrado por procedimento: uma paciente de rinoplastia vê
"nariz entupido" e "sangramento nasal"; uma de abdominoplastia vê "postura
curvada" e "seroma". Sintomas gerais aparecem para todas.

### Conteúdo clínico incluído

- **12 procedimentos**: mamoplastia de aumento, mastopexia, mamoplastia
  redutora, abdominoplastia, lipoescultura, rinoplastia, cirurgia de face,
  blefaroplastia, otoplastia, ginecomastia, pós-bariátrica e "outro".
- **35 sintomas** classificados — 11 de contato imediato, 10 de atenção e 14
  esperados —, cada um com quando acontece, por que acontece e o que fazer.
- **6 fases de recuperação** e marcos por procedimento.

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

## Como colocar a identidade visual definitiva

Não consegui baixar o CSS e o logo de `plasticahenrique.com` a partir deste
ambiente — a rede aqui bloqueia o domínio. As cores e o monograma "HR" atuais
são uma interpretação do tom do site (verde profundo + dourado, tipografia
serifada nos títulos), não os valores oficiais.

Ajustar isso é rápido, porque tudo está centralizado em **um único arquivo**:
[`src/theme/brand.ts`](src/theme/brand.ts).

1. **Cores** — substitua os HEX em `palette` pelos do site.
2. **Logo** — troque o componente `LogoMark` em `src/components/Logo.tsx` por
   um `<Image source={require('../../assets/logo.png')} />`, mantendo as mesmas
   props. Nenhuma tela precisa ser alterada.
3. **Ícone do app** — substitua `assets/icon.png` (1024×1024).

### Dados que precisam ser preenchidos antes de publicar

Em `src/theme/brand.ts`, o objeto `clinic` está com **telefone, WhatsApp e
endereço como valores de exemplo** (`5548999999999`). Eles precisam ser
substituídos pelos reais — os botões de contato e emergência dependem deles.

Os dados profissionais (CRM/SC 17913, RQE 17450, títulos, Instagram) vieram das
páginas públicas do site e valem uma conferência.

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

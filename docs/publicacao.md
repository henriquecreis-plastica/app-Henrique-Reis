# Publicar nas lojas

Guia da submissão do aplicativo à App Store e ao Google Play. O que já está
pronto no repositório, o que depende de você e as respostas exatas dos
formulários das lojas.

---

## O que já está pronto

| Item | Onde |
| --- | --- |
| Ícone, splash e ícone adaptativo do Android | `assets/` |
| Identificadores de pacote | `app.json` — `com.plasticahenrique.pacientes` |
| Perfis de build | `eas.json` |
| Termos de uso e política de privacidade, dentro do app | `src/data/legal.ts` |
| Mesmos documentos em página pública, para hospedar | `docs/publico/` |
| Capturas de tela nos tamanhos exigidos | `docs/lojas/` |
| Textos da ficha da loja | mais abaixo, neste documento |

**O aplicativo é só de celular.** `supportsTablet` está desligado no
`app.json` — com ele ligado, a Apple exigiria capturas de iPad e o app teria
de ser testado nessa tela também.

---

## 1. Antes de tudo: hospedar a política de privacidade

As duas lojas pedem um **endereço público** para a política de privacidade —
um link que abra no navegador, sem instalar nada. Sem ele a submissão não
avança.

Suba os dois arquivos de `docs/publico/` no site da clínica, por exemplo em:

```
https://www.plasticahenrique.com/app/privacidade
https://www.plasticahenrique.com/app/termos
```

São páginas HTML prontas, sem dependência externa. Depois de publicá-las, me
avise o endereço final: ele precisa ser citado também nas fichas das lojas.

---

## 2. Contas de desenvolvedor

Isto eu não consigo fazer por você — exige documento, cartão e assinatura.

### Apple Developer Program — US$ 99/ano

Em [developer.apple.com/programs](https://developer.apple.com/programs/).

Duas formas:

- **Como pessoa física**: mais rápido, aprovação em horas ou poucos dias. O
  app aparece na loja com o seu nome completo.
- **Como empresa**: o app aparece com o nome da clínica, que é o que você
  provavelmente quer. Exige **número D-U-N-S** da empresa, gratuito, obtido em
  [developer.apple.com/enroll/duns-lookup](https://developer.apple.com/enroll/duns-lookup/).
  Se a clínica ainda não tiver, a emissão leva de 5 a 14 dias — **é o item de
  maior prazo de todo o processo, então comece por ele.**

### Google Play Console — US$ 25, pagamento único

Em [play.google.com/console](https://play.google.com/console/).

Contas criadas a partir de 2023 passam por **verificação de identidade**, e
contas de empresa exigem também verificação do CNPJ. Some alguns dias.

---

## 3. Ficha da loja

Textos prontos para copiar.

**Nome do app**
```
Dr. Henrique Reis
```

**Subtítulo (App Store, 30 caracteres)**
```
Seu pós-operatório
```

**Descrição curta (Google Play, 80 caracteres)**
```
Orientações do seu pós-operatório, dia a dia, com a equipe do Dr. Henrique Reis.
```

**Descrição completa**
```
Este aplicativo é para pacientes do Dr. Henrique César dos Reis, cirurgião
plástico em Florianópolis.

Ele responde a pergunta que mais aparece no pós-operatório: isso que estou
sentindo é normal?

O QUE VOCÊ ENCONTRA

• Hoje — em que dia da recuperação você está, o que é esperado nesta fase e a
  rotina do dia em forma de checklist.
• Evolução — a linha do tempo da sua recuperação, fase a fase, com os marcos
  do seu procedimento.
• É normal? — catálogo de sintomas classificado em três níveis: esperado,
  atenção e contato imediato. Com busca e filtros por área do corpo.
• Cuidados — guias práticos de compressão, curativos, medicação, drenagem,
  cicatriz, alimentação e volta à rotina.
• Contato — WhatsApp com a mensagem já preenchida, telefone e endereço.
• Vídeos do Dr. Henrique Reis, exibidos conforme o seu procedimento.

FEITO PARA O SEU CASO

Você informa o procedimento e a data, e o aplicativo mostra apenas o que se
aplica a você. Quem fez uma rinoplastia não recebe orientação sobre cinta;
quem fez um preenchimento vê os sinais de alerta do próprio procedimento.

SEUS DADOS FICAM NO SEU APARELHO

Não há cadastro, login nem senha. O aplicativo não pede acesso a câmera,
fotos, localização ou contatos, e não envia nada para a clínica nem para
terceiros. Tudo o que você digita fica guardado apenas no seu celular, e você
pode apagar quando quiser.

IMPORTANTE

Este aplicativo é uma ferramenta complementar de acompanhamento. As
informações são gerais e não substituem as orientações individualizadas da
equipe. Em caso de divergência, prevalece o que a equipe orientou. Em urgência
ou emergência, procure atendimento médico imediatamente.
```

**Palavras-chave (App Store, 100 caracteres)**
```
pós-operatório,cirurgia plástica,recuperação,paciente,cuidados,pós-op,estética
```

**Categoria**: Medicina (App Store) · Medicina (Google Play)

**Classificação indicativa**: informe que o app trata de temas médicos e de
saúde, sem conteúdo sexual, violento ou de jogos. Deve resultar em
**Livre / 4+**.

---

## 4. Formulários de privacidade

Aqui é onde a decisão de não enviar nada para fora compensa: as respostas são
quase todas "não".

### App Store — App Privacy

Escolha **"Não, não coletamos dados deste app"** (*Data Not Collected*).

A justificativa: o aplicativo não transmite nada. Nome, procedimento e data
ficam no armazenamento local do aparelho, sem qualquer envio. Segundo as
regras da Apple, dados que permanecem apenas no dispositivo e não saem dele
não configuram coleta.

### Google Play — Data safety

- Coleta de dados: **Não**
- Compartilhamento de dados: **Não**
- Dados criptografados em trânsito: **não se aplica** (não há trânsito)
- Usuário pode solicitar exclusão: **Sim** — dentro do app, em Contato → Meus
  dados → Apagar meus dados

### Google Play — questionário de apps de saúde

O Google faz perguntas adicionais quando a categoria é Medicina. As respostas:

- O app **não** é um dispositivo médico e **não** oferece diagnóstico,
  prescrição ou tratamento.
- É material informativo produzido por médico registrado, para pacientes da
  própria clínica.
- O responsável pelo conteúdo é o Dr. Henrique César dos Reis, CRM/SC 17913,
  RQE 17450.

Se pedirem comprovação, o registro no CRM e o endereço da clínica bastam.

---

## 5. Gerar e enviar

```bash
npm install -g eas-cli
eas login
eas build:configure

# gera os arquivos que as lojas recebem
eas build --platform ios --profile production
eas build --platform android --profile production

# envia
eas submit --platform ios --latest
eas submit --platform android --latest
```

Na primeira execução o EAS pergunta sobre credenciais e certificados —
responda **sim** para deixar que ele gere e gerencie tudo. É o caminho que
evita a parte mais confusa da publicação na Apple.

---

## 6. Revisão

- **Google Play**: normalmente algumas horas a 2 dias na primeira submissão.
- **App Store**: 1 a 3 dias.

App de saúde costuma receber pedido de esclarecimento na primeira submissão.
Os dois motivos mais comuns, e o que responder:

**"O app faz alegações médicas?"** — Não. É material informativo de
acompanhamento, produzido e revisado por médico registrado, para pacientes da
própria clínica. Não oferece diagnóstico nem prescrição, e exibe aviso nesse
sentido na primeira abertura e em todas as telas de conteúdo.

**"Quem é o responsável pelo conteúdo?"** — Dr. Henrique César dos Reis,
CRM/SC 17913, RQE 17450, Avenida Mauro Ramos 1970, salas 501 e 502,
Florianópolis — SC. A Apple pode pedir uma declaração em papel timbrado
confirmando que o app é operado pela clínica.

---

## 7. Antes de tudo isso: teste com pacientes reais

Recomendação forte, antes de qualquer conta paga.

```bash
npx expo start
```

A paciente instala o **Expo Go** (gratuito, nas duas lojas), aponta a câmera
para o QR Code e usa o aplicativo de verdade. Sem loja, sem espera, sem custo.

Com três ou quatro pacientes em uma semana você descobre o que ninguém enxerga
de dentro: se o cadastro é claro, se elas encontram o que procuram, se o tom
está certo. Ajustar nessa fase custa uma linha de texto; depois de publicado,
custa uma nova submissão.

---

## Ordem sugerida

1. Solicitar o **D-U-N-S** da clínica, se for conta de empresa — é o mais demorado.
2. Hospedar as duas páginas de `docs/publico/` no site.
3. Testar com pacientes pelo Expo Go.
4. Abrir as contas de desenvolvedor.
5. Revisão jurídica dos termos e da política.
6. `eas build` e `eas submit`.

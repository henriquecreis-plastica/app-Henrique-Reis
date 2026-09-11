# Revisão da Apple — respostas prontas

Documento de trabalho. Guarda o texto em inglês para colar no App Store
Connect e o histórico do que a Apple já perguntou.

---

## 1. O que aconteceu no build 1.0.0 (2)

A Apple recusou a **compilação beta** (TestFlight) com Guideline 2.1(a) e
pediu **usuário e senha de demonstração**. O texto dela indica onde ela
espera encontrá-los:

> Select the "Sign-in required" box → Enter demo credentials in the
> "User Name" and "Password" fields

Ou seja: em algum momento a caixa **"Sign-in required"** foi marcada em
**TestFlight → Test Information → Beta App Review Information**. Com ela
marcada, o revisor abre o app procurando uma tela de senha, não encontra,
e manda esta mensagem automática.

O app não tem login. Não há cadastro, conta, e-mail, senha nem código de
acesso em lugar nenhum do código — a única menção à palavra "senha" no
projeto está na política de privacidade, dizendo justamente que não existe.

**Não é preciso gerar build novo.** Test Information é editável sem nova
submissão.

### A correção, em ordem

1. App Store Connect → **My Apps** → o app → aba **TestFlight**
2. **Test Information** → rolar até **Beta App Review Information**
3. **Desmarcar** a caixa **"Sign-in required"** (em português, *"Requer
   início de sessão"*). Os campos de usuário e senha somem.
4. Colar o texto da seção 2 no campo **Notes** / *Notas*.
5. **Save**.
6. Responder à mensagem da Apple com o mesmo texto da seção 2.

7. Conferir a **mesma caixa na revisão da loja**: aba **Distribution** →
   **App Review Information**. É um campo separado do TestFlight. Se
   estiver marcada ali também, a versão da App Store vai levar a mesma
   recusa — desmarcar e colar as mesmas notas.

O passo 7 é o que evita repetir tudo isso daqui a alguns dias.

---

## 2. Texto para colar (Notes e resposta à Apple)

> Thank you for the review.
>
> **This app has no sign-in of any kind.** There is no account, no user
> name, no password, no access code, no invitation and no purchase.
> Nothing in the app is gated. We are therefore unable to provide demo
> credentials, because there is no login screen to enter them into. We
> have unchecked the "Sign-in required" box in Beta App Review Information
> to reflect this.
>
> **The app is fully offline.** It makes no network requests, contacts no
> server, and uses no third-party service and no AI. All content ships
> inside the binary and all data stays on the device. It works in airplane
> mode.
>
> **Every feature is reachable from a fresh install in under a minute:**
>
> 1. On first launch the app shows *"Orientações importantes"*, a medical
>    disclaimer. Tap the button at the bottom: **"Li e compreendi"**
>    ("I have read and understood").
> 2. A three-step setup appears. Step 1: welcome — tap **"Continuar"**.
>    Step 2: type any name, then tap one procedure in the list (for
>    example *"Rinoplastia"*). Step 3: enter a date — the shortcut buttons
>    fill in a recent one — then tap the final button.
> 3. All five tabs are now open and fully populated: **Hoje** (Today),
>    **Evolução** (recovery timeline), **É normal?** (symptom guide),
>    **Cuidados** (care guides) and **Contato** (contact).
>
> There is no other state the app can be in. What you see after these
> three steps is the complete app.
>
> **Language.** The app is in Brazilian Portuguese. It is written for the
> patients of one clinic in Florianópolis, Brazil. The content is
> identical in every country and does not change by region.
>
> **Notifications.** The permission is requested only if the user opens
> *"Meus remédios"* (medication reminders) or *"Lembretes de retorno"*
> (follow-up reminders) and chooses to create a reminder. Declining it
> blocks no part of the app.
>
> **Regulated content.** The clinical content was written and is
> maintained by Dr. Henrique César dos Reis, plastic surgeon, CRM/SC
> 17913, RQE 17450, Avenida Mauro Ramos 1970, rooms 501 and 502,
> Florianópolis, SC, Brazil. Both numbers are verifiable in the public
> registry of the Brazilian Federal Council of Medicine
> (portal.cfm.org.br). The app is informational follow-up material for the
> clinic's own patients. It does not diagnose and does not prescribe, and
> states so on first launch and on every content screen.
>
> If a specific screen still could not be reached, please tell us which
> one, and on which device and iOS version, so that we can reproduce it.

A Apple diz na mensagem que **vídeo de demonstração não serve** para este
caso. Por isso a resposta não oferece vídeo: ela afirma que não existe
login e mostra o caminho até o conteúdo.

---

## 4. Guideline 1.4.1 — a recusa da App Store, e o que foi feito

**Versão 1.0: Rejeitado em 03/09.** O texto da Apple é curto e específico:

> The app includes medical information but does not include citations for
> the medical information. Specifically, the app provides health or
> medical references in the **Evolucao** without citations, such as links
> to sources for this information.
>
> **Next Steps:** Include citations in the app of the sources of the
> recommendations or information, such as links to those sources. The
> citations to the sources should be easy for the user to find.

Não é sobre dose de medicamento, nem sobre a triagem de sintomas. É sobre
**procedência**: o app afirma o que esperar em cada fase da recuperação e
não dizia em que isso se apoia. A Apple citou a aba Evolução porque foi
onde ela olhou, mas a exigência vale para todo o conteúdo clínico.

### O que foi implementado

- **`src/data/fontes.ts`** — a autoria (Dr. Henrique Reis, CRM e RQE, com
  o CFM como registro verificável) e seis entidades de referência, cada
  uma com o endereço e uma frase dizendo **o que ela sustenta no app**.
  Citação genérica não cumpre a diretriz; a Apple quer ver a ligação.
- **`app/fontes.tsx`** — a tela, com cada fonte tocável e o domínio
  escrito à vista. Numa tela cuja função é provar procedência, ver para
  onde o link leva antes de tocar vale mais que a linha economizada.
- **`src/components/Footnote.tsx`** — o rodapé compartilhado. A diretriz
  diz *"easy for the user to find"*, e é isso que decide o formato: o
  link fecha **todas** as abas de conteúdo, no mesmo lugar em cada uma,
  em vez de morar numa tela de ajuda.
- **`app/orientacoes.tsx`** — Fontes entra ao lado de Termos e
  Privacidade na primeira tela do app, antes do cadastro.

Sete arquivos alterados, três criados. `tsc --noEmit` limpo e
`expo export` gerando o pacote com os seis endereços dentro.

### Antes de reenviar: confirmar os links

Foram usados os domínios institucionais, que mudam pouco — SBCP, ISAPS,
ASPS, MedlinePlus, NHS e CFM. Ainda assim **abra os seis e confirme**.
Um link morto na tela de fontes é pior do que não ter a tela, e é o tipo
de coisa que a revisão testa.

Se quiser apontar cada um para uma página específica em vez do domínio,
melhor ainda — mas aí a escolha é clínica, e é sua.

### Texto para a resposta à Apple

> Thank you for the detailed feedback.
>
> We have added citations throughout the app, as requested.
>
> A new "Fontes e referências" ("Sources and references") screen states
> who wrote the clinical content — Dr. Henrique Cesar dos Reis, plastic
> surgeon, CRM/SC 17913, RQE 17450, verifiable in the public registry of
> the Brazilian Federal Council of Medicine — and lists the reference
> bodies the clinic's post-operative protocol draws on, each with a
> tappable link and a line explaining what that source supports in the
> app: the Brazilian Society of Plastic Surgery (SBCP), ISAPS, the
> American Society of Plastic Surgeons, MedlinePlus (US National Library
> of Medicine), the UK National Health Service, and the Brazilian Federal
> Council of Medicine.
>
> To make the citations easy to find, as the guideline requires, the link
> is not confined to that screen. It closes every content tab — Hoje,
> Evolucao, E normal?, Cuidados and Contato — in the same position on
> each, and it also appears on the app's very first screen, next to the
> Terms of Use and Privacy Policy, before any setup.
>
> The screen also states plainly that none of these organizations
> reviewed or endorses the app, and that general material never replaces
> individual medical assessment.

---

## 5. Histórico

**28/08 — App Store, Guideline 2.1 (Information Needed).** Questionário
padrão para app de saúde na primeira submissão: sete perguntas sobre
login, conta, compra, conteúdo de usuário, aparelhos testados, função e
público, configuração, serviços externos, variação por país e responsável
clínico. Respondido em 29/08, em inglês, com vídeo de tela. Depois da
resposta o app volta sozinho para *Waiting for Review*, sem nova submissão.

**Build 1.0.0 (2) — Beta App Review (TestFlight), Guideline 2.1(a).**
Pedido de conta de demonstração, causado pela caixa "Sign-in required"
marcada em Beta App Review Information. Resolvido em Test Information, sem
build novo. Vale lembrar que a revisão do TestFlight é trilha separada da
revisão da App Store: uma compilação beta recusada não recusa o app na
loja.

# Revisão da Apple — respostas prontas

Documento de trabalho. Guarda o texto em inglês para colar no App Store
Connect e o histórico do que a Apple já perguntou.

---

## 1. Notas de revisão (App Review Notes)

Cola no App Store Connect em **App Review Information → Notes**, e também
como resposta quando a Apple disser que não conseguiu acessar o app.

> **No login, no account, no paywall.**
> This app has no sign-in, no account creation, no access code and no
> purchase of any kind. Nothing is gated. A demo account is therefore not
> needed and not possible — there is nothing to log in to.
>
> **Fully offline.**
> The app makes no network requests. It contacts no server, uses no
> third-party service and no AI. All content ships inside the binary and
> all patient data stays on the device. It works in airplane mode.
>
> **How to reach every screen from a fresh install (about 30 seconds):**
> 1. On first launch the app shows *"Orientações importantes"* — a medical
>    disclaimer. Tap the button at the bottom: **"Li e compreendi"**
>    ("I have read and understood").
> 2. A three-step setup appears. Step 1: welcome — tap **"Continuar"**.
>    Step 2: type any name, then tap one procedure in the list (for example
>    *"Rinoplastia"*). Step 3: enter a date — the shortcut buttons fill in a
>    recent date — then tap the final button.
> 3. All five tabs are now open: **Hoje** (Today), **Evolução** (Recovery
>    timeline), **É normal?** (Is this normal?), **Cuidados** (Care guides)
>    and **Contato** (Contact).
>
> **Language.** The app is in Brazilian Portuguese. It is written for the
> patients of one clinic in Florianópolis, Brazil. The content is identical
> in every country and does not change by region.
>
> **Notifications.** The permission is requested only if the user opens
> *"Meus remédios"* (medication reminders) or *"Lembretes de retorno"*
> (follow-up reminders) and chooses to create a reminder. Declining it
> blocks no part of the app.
>
> **Regulated content.** The clinical content was written and is maintained
> by Dr. Henrique César dos Reis, plastic surgeon, CRM/SC 17913, RQE 17450,
> Avenida Mauro Ramos 1970, rooms 501 and 502, Florianópolis, SC, Brazil.
> Both registration numbers are verifiable in the public registry of the
> Brazilian Federal Council of Medicine (portal.cfm.org.br). The app is
> informational follow-up material for the clinic's own patients. It does
> not diagnose, does not prescribe, and states so on first launch and on
> every content screen.

---

## 2. Se a Apple disser que não conseguiu acessar o app

Mensagem: *"We were unable to successfully access all or part of the app."*

Vale colar as notas acima e acrescentar:

> Could you please tell us which screen you were unable to access, and on
> which device and iOS version? The app has no login and no gated content,
> so we would like to reproduce the problem. We are happy to provide a
> screen recording of the full flow.

Se a Apple responder que o app **fechou sozinho ou ficou em branco**, aí é
defeito de verdade no build: pedir o *crash log* em App Store Connect e
gerar um build novo. Nada disso se resolve na resposta escrita.

---

## 3. Histórico

**28/08 — App Store, Guideline 2.1 (Information Needed).** Questionário
padrão para app de saúde na primeira submissão: sete perguntas sobre login,
conta, compra, conteúdo de usuário, aparelhos testados, função e público,
configuração, serviços externos, variação por país e responsável clínico.
Respondido em 29/08, em inglês, com vídeo de tela. Depois da resposta o app
volta sozinho para *Waiting for Review*, sem nova submissão.

**Build 1.0.0 (2) — Beta App Review, Guideline 2.1(a).** *"We have started
your beta app's review, but we were unable to successfully access all or
part of the app."*

Duas coisas que importam aqui:

- É a **revisão do TestFlight**, não a da App Store. As duas correm em
  trilhas separadas: uma compilação beta recusada não recusa o app na loja.
- O app não tem login, não tem conteúdo bloqueado e não faz uma única
  chamada de rede. Não existe nada a que o revisor pudesse ficar sem
  acesso — o que sobra é ou o mesmo pedido de informação de 28/08, ou o
  build tendo fechado no aparelho dele.

Por isso a resposta começa perguntando qual tela e qual aparelho: sem isso
não dá para separar os dois casos.

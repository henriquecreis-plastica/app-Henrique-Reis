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

## 4. A recusa que importa: Guideline 1.4.1 — Safety: Physical Harm

**Versão 1.0 da App Store: Rejeitado.** Esta é a recusa séria — a do
TestFlight é secundária diante dela.

A 1.4.1 é a diretriz de dano físico. O trecho que quase certamente foi
aplicado aqui:

> Apps that calculate medication dosages must be submitted by the
> manufacturer of the drug, a hospital, university, health insurance
> company, pharmacy, or other approved entity, or receive approval by the
> FDA or one of its international counterparts.

### Onde o app encosta nisso

A tela **"Meus remédios"** traz o botão *"Usar a prescrição padrão"*, que
carrega a receita da clínica já pronta: **22 itens**, com dose, via e
intervalo escritos por extenso. Entre eles:

- **Paco (paracetamol + codeína)** — opioide
- **Restiva 10mg e 20mcg/h (adesivo)** — buprenorfina, controlada
- **Toragesic 10mg**, **Novalgina 1g**, **Vonau 4mg**
- **Cefadroxila 500mg** e **Clavulin BD** — antibióticos

O app não calcula dose: ele reproduz a prescrição da clínica e agenda
lembrete. Mas do lado de fora a distinção é fina, e opioide com horário
sugerido é o tipo de coisa que a revisão da Apple trata como risco.

### Os dois caminhos

**A — Tirar a prescrição pronta do app.** A paciente digita o que o
médico dela receitou; o app só lembra do horário. Deixa de ser fonte de
dose e passa a ser agenda. É o caminho que costuma passar, e não depende
de negociar com a Apple.

**B — Enquadrar a clínica na exceção.** A própria 1.4.1 permite envio por
*hospital, universidade, plano de saúde, farmácia ou outra entidade
aprovada*. Exige que a conta de desenvolvedor seja da **clínica como
organização**, não pessoa física, e normalmente uma declaração em papel
timbrado. Se a conta for individual, este caminho não se sustenta.

Os dois não se excluem. O mais seguro é fazer A e responder citando B.

### Antes de decidir

Falta ler o texto integral da Apple em **Visualizar envio**. A 1.4.1 tem
outra ponta possível — a tela **"É normal?"**, que classifica sintoma em
*esperado / atenção / contato imediato*, pode ser lida como triagem. O
remédio para cada uma é diferente, então não dá para escrever a resposta
sem saber qual delas foi.

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

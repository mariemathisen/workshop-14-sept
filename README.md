# Workshop

Denne workshopen handler om hvordan du bygger teknisk forståelse mens du jobber
agentisk med Claude Code. Målet for workshopen er ikke å gå fortere, det er å
forstå koden vi er med på å lage, godt nok til å stå inne for den samtidig som
vi bygger teknisk forståelse.

I løpet av workshopen skal dere legge til én feature i en kodebase dere ikke har
sett før. Applikasjonen er en liten bookingtjeneste for møterom, og featuren
dere skal legge til er gjentakende booking, altså at en bruker kan opprette en
serie bookinger i stedet for én. Hva som kreves av featuren står i steg 2.

I workshopen er denne jobben delt i fem steg som til slutt gjør at denne nye
featuren blir lagt til:

1. **Bli kjent med kodebasen.**
2. **Planlegg** arbeidet.
3. **Utfør** -- implementer featuren.
4. **Test** -- skriv testene.
5. **Quiz før PR** -- forbered dere på å levere.

Hvert steg introduserer en teknikk hvor man baserer seg på Claude Code, men selv
er deltakende i utviklingsprosessen.

> 💡 **Tips:** Spørsmål om språket og rammeverket stiller dere med `/btw`, en
> innebygget kommando i Claude Code for et sidespørsmål. Den avbryter ikke det
> agenten holder på med, og kan ikke lese filer.

---

## Steg 1: Bli kjent med kodebasen

Dette steget går ut på å orientere seg i kodebasen. Dere får en kort
introduksjon til hva applikasjonen gjør, men der stopper hjelpen -- resten
finner dere selv. Det er lesingen deres, ikke sammendraget, som sitter igjen
etterpå. Verktøyet er `/orienter`, en kommando som ligger i dette repoet. Vil
dere lage slike kommandoer selv, står det forklart i
[dokumentasjonen om skills](https://code.claude.com/docs/en/skills).

### Om `/orienter`

Svaret har to deler. Først en intro på maks 150 ord: hva applikasjonen gjør,
hva som er kjernen i den, hvilket arkitekturmønster koden følger, og hva dere
trenger for å kjøre den -- i prosa, uten filnavn og linjenumre. Deretter
hoveddelen, som er oppgavene dere skal gjøre selv.

> ℹ️ **Merk:** Kommandoen er read-only. Ikke be den om endringer, og ikke skriv
> `/orienter og fiks X`.

### Fremgangsmåte

1. **Få appen til å kjøre.**

   ```bash
   npm install
   npm run dev
   ```

   Åpne frontend-adressen i nettleseren og sjekk at dere ser data.

2. **Kjør orienteringen.** Start Claude Code i rotmappa av repoet:

   ```bash
   cd roombooking   # rotmappa av repoet dere klonet
   claude
   ```

   Skriv så `/orienter` i Claude Code, og les hele svaret før dere gjør noe
   annet.

3. **Gjennomfør oppgavene `/orienter` gir dere.** Selv, i editoren og i
   nettleseren.

> ❗ **Viktig:** Ikke be Claude gjøre oppgavene for dere. Poenget er at dere
> selv finner fram i koden -- svarene står ikke i intro-en, og å lete dem fram
> er halve læringen.

Dere er ferdige når oppgavene er gjort. Ingenting skal leveres. Det dere sitter
igjen med er kjennskap til kodebasen, og det er grunnlaget steg 2 hviler på: en
plan bygget på gjetninger blir en dårlig plan.

---

## Steg 2: Planlegg

Her bestemmer dere hvordan featuren skal løses. Steget finnes fordi de tekniske
valgene skal tas bevisst, av dere, før noe som helst blir skrevet. Kravene til
featuren står i
[docs/workshop/feature-gjentakende-booking.md](docs/workshop/feature-gjentakende-booking.md).

> ⚠️ **Pass på:** Ingenting implementeres her. Når Claude Code spør om planen
> skal settes ut i livet, svarer dere nei -- featuren skrives i steg 3.

### Fremgangsmåte

1. **Skriv gruppas egen plan, på papir.** Bruk arket
   `docs/workshop/utskrifter/steg-2-gruppens-plan.md`. Ingen prompt, ingen
   agent.
2. **Kjør `/planlegg`.** Gå inn i plan mode først -- Shift+Tab, eller skriv
   `/plan`. Agenten lager sin egen plan uten å ha sett deres.
3. **Sammenlign planene.** Først dere imellom, så sammen med agenten. Dette er
   den viktigste delen, og den skal ha mest tid.
4. **Lag grenen deres.** Gå ut av plan mode med Shift+Tab -- ikke ved å
   godkjenne planen, det starter implementasjonen. Så
   `git checkout -b <gruppenavn>`.
5. **Lås planen.** Be agenten skrive planen dere landet på til
   `plans/ferdig-plan.md`, og les gjennom fila. Det er deres plan som skal stå
   der -- ikke agentens, og ikke den ene eller den andre avskrevet, men det dere
   faktisk skal gjøre. Har dere endret mening om noe underveis, skriv kort
   hvorfor.
6. **Plenum.**

### Hvorfor deres egen plan kommer først

Det er ikke tungvint med vilje: en agent som får en ferdig plan å forholde seg
til, forankrer seg i den og bekrefter den i stedet for å tenke selv. Derfor skal
den ikke se planen deres før svaret fra `/planlegg` står på skjermen. Etter det
er uavhengigheten sikret, og da tar dere diskusjonen med den også.

### Hva planen skal inneholde

Planen har formatkrav, ikke innholdskrav. Den er en liste over beslutninger dere
mener må tas, og for hver: hva dere velger, og hva valget bygger på -- det dere
har lest i koden, eller "antatt" hvis dere ikke har sjekket.

Dere får ingen liste over hva som må besvares. Å finne ut hvilke beslutninger
som hører hjemme er oppgaven.

### Sammenligningen

To planer som spriker er hele læringen i steget. Snakk først sammen: hvor er de
uenige, og hvilken uenighet betyr egentlig noe? Ta så diskusjonen med agenten --
«her er det vi kom fram til» -- og iterer videre.

> 💡 **Tips:** En agent som blir spurt «hva synes du om vårt forslag?» har en
> sterk tendens til å si seg enig. Spør heller hva som taler *imot* valget
> deres, eller hva som går galt hvis dere tar feil. Da får dere en motstemme i
> stedet for et ekko.

Dere er ferdige når dere kan si grunnen til hver beslutning, ikke når agenten
slutter å foreslå forbedringer.

> ℹ️ **Merk:** Plan mode lagrer sitt eget notat under `~/.claude/plans/`. Det
> er Claude Code som gjør det, ikke kommandoen, og notatet blir aldri tracket
> av git -- ikke fordi det er ignorert, men fordi git bare ser filer som ligger
> inne i repoet.

---

## Steg 3: Utfør

Nå implementeres featuren. Agenten kommer til å skrive mesteparten av koden, og
det er meningen -- poenget er ikke hvem som taster, men at valgene underveis er
deres. Målet er ikke at dere skal ha skrevet featuren for hånd, men at dere
etterpå kan forklare hva som ble lagt til og hvorfor det ser ut som det gjør.
Det er et helt annet sted å komme til enn enter-enter-enter.

### Fremgangsmåte

1. **Bytt output style.** Åpne `.claude/settings.local.json`. Slik ser den ut
   nå:

   ```json
   {
     "outputStyle": "Explanatory"
   }
   ```

   Bytt den ut med dette:

   ```json
   {
     "outputStyle": "Learning"
   }
   ```

   Det er bare dette ene feltet som endres. Den eneste tingen som kan gå galt
   her, er en skrivefeil i JSON-en.

2. **Start Claude Code på nytt** og kjør `claude -c`, så beholder dere
   konteksten fra steg 1 og 2.

3. **Lim inn prompten:**

   ```
   Planen min ligger i plans/ferdig-plan.md og skal implementeres nå.

   Vi jobber i biter. For hver bit:
   - Jeg avgrenser. Foreslå ikke en avgrensning selv.
   - Før du skriver noe: hvilke valg tvinger biten fram som planen ikke avgjør?
     Still dem som spørsmål. Ikke anbefal noe.
   - Legg TODO(human) der jeg lærer mest om denne kodebasen og valgene i den --
     altså i beregning, vilkår og regler. Ikke i boilerplate, mapping eller
     syntaks. Én per bit.
   - Resten skriver du, etter eksisterende mønster i koden.
   - Når biten er ferdig: to linjer om hva som ble endret og hvilket valg det
     uttrykker. Ikke skriv tester underveis.

   Når alle bitene er ferdige: spør meg hvilke tilfeller som skal testes, og
   skriv testene for det jeg svarer. Ikke foreslå tilfellene selv.
   ```

4. **Jobb bit for bit.** Dere avgrenser hver bit, dere svarer på spørsmålene
   agenten stiller før den skriver, og dere fyller ut `TODO(human)` før dere går
   videre til neste.

5. **Svar på hva som skal testes.** Når alle bitene er ferdige spør agenten
   hvilke tilfeller testene skal dekke. Tilfellene er deres, testkoden er
   agentens.

> ℹ️ **Merk:** Hvordan jobben stykkes opp i biter, bestemmer dere selv. Det er
> en del av utviklerjobben, og det finnes ingen fasit.

### `TODO(human)` er deres del

Agenten skriver rammen rundt og lar ett hull stå tomt -- i en beregning, et
vilkår eller en regel, altså der dere må ha forstått kodebasen for å skrive noe
riktig. Den stopper og venter: den går ikke videre av seg selv før hullet er
fylt ut.

> 💡 **Tips:** Står dere fast, finnes det to veier som ikke gir dere svaret
> gratis. `/btw` for språk og syntaks -- den kan ikke lese koden deres, og kan
> derfor ikke skrive hullet for dere. Eller be agenten forklare koden som
> allerede står der, ikke foreslå hva som skal stå i hullet.

Agenten legger selv ved en «Guidance»-del når den overleverer en TODO; les den
som momenter å vurdere, ikke som en oppskrift.

Steget slutter når alle TODO-ene er fylt ut og testene er skrevet. Ta med
`git diff` og testfila videre til steg 4.

---

## Steg 4: Test

Her ser dere om det faktisk virker. Både i testene og i grensesnittet, for de
svarer ikke alltid det samme. Dette steget gjør dere uten agenten, og det er
kort med vilje.

### Fremgangsmåte

1. **Kjør testene.** Forsøk så å få noen av dem til å feile -- endre koden de
   tester, og se at de faktisk sier fra. Sett koden tilbake etterpå.
2. **Åpne frontenden og utfør featuren manuelt.**

> ❗ **Viktig:** En test som står grønn uansett hva dere gjør med koden, tester
> ingenting.

---

## Steg 5: Quiz før PR

Siste sjekk før endringen sendes fra dere. Kan dere ikke forklare den i egne
ord, er dere ikke klare til å sende den.

### Fremgangsmåte

1. **Kjør `/quiz`** og svar muntlig. Å slå opp i koden underveis er helt greit
   -- det er sånn man jobber.
2. **Skriv PR-beskrivelsen selv**, i egne ord. Den skal si hva som ble lagt til,
   hvilke valg dere tok, og hva som eventuelt ikke er dekket.

> ❗ **Viktig:** Ikke be agenten formulere PR-beskrivelsen, og ikke let i
> chat-loggen etter hva den sa underveis. Det er deres forståelse som skal stå
> på prøve her.

---

## Hvor Claude Code legger tingene sine

Kommandoene i denne workshopen ligger i repoet, men det er ikke det eneste
stedet Claude Code leter. Plasseringen er i praksis en beslutning om hvem
artefakten tilhører:

| Hvor | Hva | Følger med ved kloning |
| --- | --- | --- |
| `.claude/skills/` | Kommandoer som hører til dette prosjektet | Ja |
| `~/.claude/skills/` | Dine egne kommandoer, i alle repoer du jobber i | Nei |
| `.claude/settings.json` | Innstillinger for prosjektet | Ja |
| `.claude/settings.local.json` | Dine egne innstillinger for dette prosjektet | Normalt ikke |
| `~/.claude/plans/` | Notatene plan mode lagrer | Nei |

Alt som ligger under `~/.claude/` er utenfor repoet, og blir derfor aldri
tracket av git. Ikke fordi det er ignorert, men fordi git bare ser filer som
ligger inne i mappa du klonet.

Det er derfor planer havner i hjemmekatalogen: en plan er et arbeidsnotat
knyttet til deg i øyeblikket, den er utdatert så snart koden er skrevet, og to
utviklere på samme repo vil uansett ha ulike planer. En kommando er det motsatte
-- den beskriver hvordan nettopp dette prosjektet skal jobbes med, og da vil du
at neste person som kloner skal få den. `settings.local.json` er her et unntak
fra regelen: den er normalt personlig, men i dette repoet er den committet med
vilje, fordi steg 3 forutsetter at dere finner den ferdig.

---

## Kodebasen: Room booking

En liten bookingtjeneste for møterom. Du ser hvilke rom som finnes og hva som
allerede er booket i dem, og du kan opprette en ny booking for ett rom i et gitt
tidsrom. Backend håndhever reglene for når en booking er gyldig, blant annet at
to bookinger i samme rom ikke kan overlappe hverandre.

## Krav

- Node 22.12 eller nyere (`node --version`). Databasen bruker Nodes innebygde
  `node:sqlite`, som krever Node 22.5+, og frontend-verktøyet krever 22.12+.
- Ingenting annet. Ingen Docker, ingen miljøvariabler, ingen kontoer eller
  nøkler.

## Kom i gang

```bash
npm install
npm run dev
```

`npm run dev` starter backend på http://localhost:3000 og frontend på
http://localhost:5173. Åpne frontend-adressen i nettleseren.

Databasefila (`server/data/bookings.db`) opprettes og fylles med noen rom og
bookinger første gang backend starter. Vil du begynne på nytt, slett fila og
start på nytt:

```bash
rm -rf server/data
npm run dev
```

## Tester

```bash
npm test
```

Testene kjører med Nodes innebygde testkjører mot en database i minnet. De
starter hele API-et og går mot det over HTTP, så en test dekker hele veien fra
rute til database. Testene ligger i `server/test/`.

Du kan også typesjekke alt:

```bash
npm run typecheck
```

Linting og formatering gjøres med Biome:

```bash
npm run lint     # sjekker
npm run format   # retter det som kan rettes automatisk
```

## Slik er repoet satt opp

Backenden ligger i `server/`, frontenden i `web/`. Frontenden er React med Vite,
og dev-serveren proxyer `/api` videre til backend, så de to deler adresse i
nettleseren.

Feil fra API-et kommer som JSON på formen
`{ "error": { "code": "...", "message": "..." } }`, og frontenden viser
meldingen som den er.

Hvordan koden ellers henger sammen -- lagene, endepunktene og skjemaet -- finner
dere selv. Det er det steg 1 handler om.

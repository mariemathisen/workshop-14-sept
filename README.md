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
3. **Utfør**, implementer featuren.
4. **Test**, skriv testene.
5. **Quiz før PR**, forbered dere på å levere.

Hvert steg introduserer en teknikk hvor man baserer seg på Claude Code, men selv
er deltakende i utviklingsprosessen.

> <div style="height:1px"></div>
>
> 💡 **Tips:** Spørsmål om språket og rammeverket stiller dere med `/btw`, en
> innebygget kommando i Claude Code for et sidespørsmål. Den avbryter ikke det
> agenten holder på med. Den kan ikke lese filer selv, men den ser det agenten
> allerede har lest.
>
> <div style="height:1px"></div>

---

## Før vi starter

Sjekk versjonene dine i god tid før workshopen, ikke mens den pågår. Kjør disse
fire i et terminalvindu, hvor som helst. Du trenger ikke å ha klonet repoet
ennå:

```bash
node --version      # v22.12.0 eller nyere
npm --version       # 10 eller nyere, følger med Node
git --version       # hvilken som helst nyere versjon
claude --version    # nyeste, oppdater med `claude update`
```

Node er den som faktisk stopper deg: er den for gammel, starter verken backend
eller frontend. Hvorfor akkurat 22.12 står under [Krav](#krav).

> <div style="height:1px"></div>
>
> ⚠️ **Pass på:** `claude --version` må svare med et versjonsnummer. Gjør den
> ikke det, er ikke Claude Code installert. Se
> [installasjonsveiledningen](https://code.claude.com/docs/en/quickstart).
> Start den så én gang med `claude` og sjekk at du er logget inn, så du ikke
> bruker workshoptid på innlogging. `claude doctor` sier fra om installasjonen
> er sunn.
>
> <div style="height:1px"></div>

---

## Steg 1: Bli kjent med kodebasen

Dette steget går ut på å orientere seg i kodebasen. Dere får en kort
introduksjon til hva applikasjonen gjør, men der stopper hjelpen. Resten
finner dere selv. Det er lesingen deres, ikke sammendraget, som sitter igjen
etterpå. Verktøyet er `/orienter`, en kommando som ligger i dette repoet. Vil
dere lage slike kommandoer selv, står det forklart i
[dokumentasjonen om skills](https://code.claude.com/docs/en/skills).

### Om `/orienter`

Svaret har to deler. Først en intro på maks 150 ord: hva applikasjonen gjør,
hva som er kjernen i den, hvilket arkitekturmønster koden følger, og hva dere
trenger for å kjøre den. Alt i prosa, uten filnavn og linjenumre. Deretter
hoveddelen, som er oppgavene dere skal gjøre selv.

> <div style="height:1px"></div>
>
> ℹ️ **Merk:** Kommandoen er read-only. Ikke be den om endringer, og ikke skriv
> `/orienter og fiks X`.
>
> <div style="height:1px"></div>

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

> <div style="height:1px"></div>
>
> ❗ **Viktig:** Ikke be Claude gjøre oppgavene for dere. Poenget er at dere
> selv finner fram i koden. Svarene står ikke i intro-en, og å lete dem fram
> er halve læringen.
>
> <div style="height:1px"></div>

Dere er ferdige når oppgavene er gjort. Ingenting skal leveres. Det dere sitter
igjen med er kjennskap til kodebasen, og det er grunnlaget steg 2 hviler på: en
plan bygget på gjetninger blir en dårlig plan.

---

## Steg 2: Planlegg

Her bestemmer dere hvordan featuren skal løses. Steget finnes fordi de tekniske
valgene skal tas bevisst av dere, før noe som helst blir skrevet. Kravene til
featuren står i
[docs/workshop/feature-gjentakende-booking.md](docs/workshop/feature-gjentakende-booking.md).

### Fremgangsmåte

#### 1. Skriv gruppas egen plan utenfor repoet

På papir, i Notater på Mac-en, eller et hvilket som helst dokument som ikke
ligger i kodebasen.

Planen skal inneholde fremgangsmåten deres for å implementere featuren. Det vil
si hva som må legges til hvor, i tillegg til valg dere tar, tekniske eller
rettet mot domenet. For hvert valg: skriv hva det bygger på, enten det dere
har lest i koden, eller "antatt" hvis dere ikke har sjekket.

Fem til sju punkter. Hold dem korte, og nummerer dem.

#### 2. Kjør `/planlegg`

Kommandoen leser kravfila for featuren og lager agentens egen plan for hvordan
den skal implementeres, uten å spørre dere om noe og uten å ha sett planen
deres. Den planen er det dere etterpå skal sammenlikne med deres egen.

> <div style="height:1px"></div>
>
> ##### Hva er `/planlegg`?
>
> I likhet med `/orienter` er det bare en skill jeg har laget på forhånd,
> lagret i `.claude/skills/planlegg/SKILL.md`. Skriver dere kommandoen, får
> agenten den teksten som instruks.
>
> Dere kunne skrevet den samme beskjeden selv, enten som en prompt eller som en
> egen skill. Poenget her er at alle gruppene får nøyaktig den samme.
>
> <div style="height:1px"></div>

> <div style="height:1px"></div>
>
> ##### Hva `/planlegg` produserer
>
> Det samme dere selv skrev i punkt 1: fremgangsmåten, altså hva som må legges
> til hvor, og valgene som tas underveis, med hva hvert valg bygger på, lest i
> koden eller antatt. Fem til sju korte, nummererte punkter.
>
> Formatene er like med vilje. To lister som ser like ut kan legges ved siden av
> hverandre og sammenlignes punkt for punkt.
>
> <div style="height:1px"></div>

> <div style="height:1px"></div>
>
> ##### Plan mode som alternativ fremgangsmåte
>
> Claude Code har en modus der agenten får lese filer og foreslå, men er
> avskåret fra å endre noe på disk. Den slås på med Shift+Tab, eller ved å
> skrive `/plan`.
>
> Dette steget kunne vært gjort i plan mode i stedet. Vi lar den stå av i dag fordi
> den passer en arbeidsform der agenten eier planen og dere godkjenner den.
> Her er det omvendt: planen er deres, og agentens forslag er noe dere skal
> være uenige med.
>
> I vanlig arbeid er modusen et fint verktøy, og verdt å kjenne til:
> [dokumentasjonen om permission modes](https://code.claude.com/docs/en/permission-modes#analyze-before-you-edit-with-plan-mode).
>
> <div style="height:1px"></div>

> <div style="height:1px"></div>
>
> ##### ⚠️ Pass på
>
> Ingenting skal implementeres i dette steget. Agenten kommer til å tilby det, men featuren skal skrives i steg 3.
>
> <div style="height:1px"></div>

#### 3. Sammenlign planene

Først dere imellom, så sammen med agenten. Hvor spriker deres plan fra agentens plan, hva tror dere blir det beste totale forslaget. 

Ta så diskusjonen med agenten: «her er det vi kom fram til» og iterer til dere er fornøyde.

> <div style="height:1px"></div>
>
> ##### 💡 Tips
>
> En agent som blir spurt «hva synes du om vårt forslag?» har en sterk tendens
> til å si seg enig. Spør heller hva som taler *imot* valget deres, eller hva
> som går galt hvis dere tar feil. Da får dere en motstemme i stedet for et
> ekko.
>
> <div style="height:1px"></div>

#### 4. Lag branchen deres

```bash
git checkout -b <gruppenavn>
```

#### 5. Lås planen

Be agenten skrive planen dere landet på til `plans/ferdig-plan.md`, og les
gjennom fila.

---

## Steg 3: Utfør

Når dere har landet på en plan, er neste steg å implementere featuren. Agenten
kommer til å skrive mesteparten av koden, og det er meningen, men valgene
underveis er deres. Målet er ikke at dere skal ha skrevet featuren for hånd, men
at dere etterpå kan forklare hva som ble lagt til og hvorfor det ser ut som det
gjør.

### Fremgangsmåte

1. **Bytt output style til Learning.** Åpne `.claude/settings.local.json`. Slik
   ser den ut nå:

   ```json
   {
     "outputStyle": "Explanatory",
     "promptSuggestionEnabled": false
   }
   ```

   Endre `outputStyle` til `"Learning"`, og la den andre nøkkelen stå:

   ```json
   {
     "outputStyle": "Learning",
     "promptSuggestionEnabled": false
   }
   ```

   > <div style="height:1px"></div>
   >
   > ##### Hva Learning er
   >
   > En av output-stilene som følger med Claude Code. En output style endrer
   > hvordan agenten svarer, ikke hva den kan.
   >
   > `Learning` forklarer valgene sine underveis, og lar med vilje ett hull stå
   > igjen i koden, markert `TODO(human)`, som dere fyller ut selv. Fram til
   > nå har dere brukt `Explanatory`, som forklarer like mye, men skriver alt
   > selv.
   >
   > <div style="height:1px"></div>

2. **Sjekk at stilen slår inn.** Send en melding og se om svaret har endret
   form. Har det ikke det, start Claude Code på nytt med `claude -c`. Da
   leses innstillingen på nytt, og dere beholder konteksten fra steg 1 og 2.

3. **Lim inn prompten:**

   ```
   Planen min ligger i plans/ferdig-plan.md og skal implementeres nå.

   Vi jobber oss gjennom planen del for del. Jeg bestemmer hvor vi starter, og
   hva neste del blir når vi er ferdige med den forrige. Foreslå ikke en
   oppdeling selv.

   For hver del:
   - Før du skriver noe: hvilke valg tvinger delen fram som planen ikke avgjør?
     Still det som spørsmål. Ikke anbefal noe.
   - Legg TODO(human) der jeg lærer mest om denne kodebasen og valgene i den,
     altså i beregning, vilkår og regler. Ikke i boilerplate, mapping eller
     syntaks. Én per del.
   - Resten skriver du, etter eksisterende mønster i koden.
   - Når delen er ferdig: to linjer om hva som ble endret og hvilket valg det
     uttrykker. Ikke skriv tester underveis.

   Når alle delene er ferdige: spør meg hvilke tilfeller som skal testes, og
   skriv testene for det jeg svarer. Ikke foreslå tilfellene selv.
   ```

4. **Jobb del for del.** Dere bestemmer hvor neste del starter og slutter, dere
   svarer på spørsmålene agenten stiller før den skriver, og dere fyller ut
   `TODO(human)` før dere går videre.

   > <div style="height:1px"></div>
   >
   > ##### `TODO(human)` er deres del
   >
   > Agenten skriver rammen rundt og lar ett hull stå tomt i en beregning, et
   > vilkår eller en regel, altså der dere må ha forstått kodebasen for å
   > skrive noe riktig. Den går ikke videre før hullet er fylt ut.
   >
   > Den legger ved en «Guidance»-del når den overleverer en TODO. Les den som
   > momenter å vurdere, ikke som en oppskrift.
   >
   > <div style="height:1px"></div>

   > <div style="height:1px"></div>
   >
   > ##### 💡 Tips
   >
   > Står dere fast, finnes det to veier som ikke gir svaret gratis: `/btw` for
   > språk og syntaks, eller be agenten forklare koden som allerede står der,
   > ikke foreslå hva som skal stå i hullet.
   >
   > <div style="height:1px"></div>

5. **Svar på hva som skal testes.** Når alle delene er ferdige spør agenten
   hvilke tilfeller testene skal dekke. Tilfellene er deres, testkoden er
   agentens.

> <div style="height:1px"></div>
>
> ℹ️ **Merk:** Hvordan jobben deles opp, bestemmer dere selv. Det er
> en del av utviklerjobben, og det finnes ingen fasit.
>
> <div style="height:1px"></div>

Steget slutter når alle TODO-ene er fylt ut og testene er skrevet.

---

## Steg 4: Test

Her ser dere om det faktisk virker. Både i testene og i grensesnittet, for de
svarer ikke alltid det samme. Dette steget gjør dere uten agenten, og det er
kort med vilje.

### Fremgangsmåte

1. **Kjør testene.** Forsøk så å få noen av dem til å feile ved å endre
   koden de tester, og se at de faktisk sier fra. Sett koden tilbake etterpå.
2. **Åpne frontenden og utfør featuren manuelt.**

> <div style="height:1px"></div>
>
> ❗ **Viktig:** En test som står grønn uansett hva dere gjør med koden, tester
> ingenting.
>
> <div style="height:1px"></div>

---

## Steg 5: Quiz før PR

Siste sjekk før endringen sendes fra dere. Kan dere ikke forklare den i egne
ord, er dere ikke klare til å sende den.

### Fremgangsmåte

1. **Kjør `/quiz`** og svar muntlig. Å slå opp i koden underveis er helt greit,
   det er sånn man jobber.

   > <div style="height:1px"></div>
   >
   > ##### Hvorfor inputfeltet er tomt
   >
   > Claude Code foreslår vanligvis din neste melding i grått i inputfeltet, og
   > Tab fyller den inn. Under quizen ville det gitt dere svaret før dere rakk
   > å tenke. Derfor står `promptSuggestionEnabled: false` i
   > `.claude/settings.local.json` i dette repoet. Den gjelder hele økta, ikke
   > bare dette steget. Det er med vilje: i steg 3 stiller agenten spørsmål
   > dere skal svare på selv, før den skriver noe.
   >
   > <div style="height:1px"></div>

2. **Sett output style tilbake.** Sett `outputStyle` i
   `.claude/settings.local.json` tilbake til `"Explanatory"`. La de andre
   nøklene i fila stå.

   > <div style="height:1px"></div>
   >
   > ##### Hvorfor det har noe å si
   >
   > Fila er tracket av git i dette repoet. Blir `Learning` stående, følger den
   > med i PR-en, og neste som kloner får feil utgangspunkt for steg 3.
   >
   > <div style="height:1px"></div>

3. **Skriv PR-beskrivelsen selv**, i egne ord. Den skal si hva som ble lagt til,
   hvilke valg dere tok, og hva som eventuelt ikke er dekket.

> <div style="height:1px"></div>
>
> ❗ **Utfordring:** Ikke be agenten formulere PR-beskrivelsen, og ikke let i
> chat-loggen etter hva den sa underveis. Det er deres forståelse som skal stå
> på prøve her.
>
> <div style="height:1px"></div>

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
utviklere på samme repo vil uansett ha ulike planer. En kommando er det motsatte,
for den beskriver hvordan nettopp dette prosjektet skal jobbes med, og da vil du
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

`npm run dev` starter backend på http://localhost:3001 og frontend på
http://localhost:3000. Åpne frontend-adressen i nettleseren.

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

Hvordan koden ellers henger sammen, altså lagene, endepunktene og skjemaet, finner
dere selv. Det er det steg 1 handler om.

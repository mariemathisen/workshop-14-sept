# Workshop: Claude Code i en ukjent kodebase

Denne workshopen handler om hvordan du bygger teknisk forståelse mens du jobber
agentisk med Claude Code. Målet er ikke å gå fortere, og ikke å lære et verktøy
å kjenne -- det er å forstå koden du er med på å lage, godt nok til å stå inne
for den.

Dere skal legge til én feature i en kodebase dere ikke har sett før:
gjentakende booking, altså at en bruker kan opprette en serie bookinger i stedet
for én. Hva som kreves av featuren står i steg 2.

Jobben er delt i fem steg som til sammen er én sammenhengende oppgave. Hvert
steg introduserer en teknikk, og teknikkene læres ved å gjøre jobben, ikke ved
å bli forklart.

To kjøreregler gjelder hele veien. Spørsmål om språket og rammeverket stiller
dere med `/btw` -- en innebygget kommando i Claude Code for et sidespørsmål, som
ikke avbryter det agenten holder på med. Den kan ikke lese filer, og det er
poenget: spørsmål om denne kodebasen besvarer dere ved å åpne filen selv. Og
ingen påstand om koden teller før noen har vist fil:linje.

Node-kravet, oppstart av appen og kjøring av testene står nederst i denne fila.

## Steg 1: Bli kjent med kodebasen

Orientering før dybde. Dere skal skaffe dere et kart over hva som finnes i
kodebasen, og så lese koden selv i stedet for å nøye dere med et sammendrag av
den.

Se [docs/workshop/steg-1-orientering.md](docs/workshop/steg-1-orientering.md).

## Steg 2: Planlegg

Her bestemmer dere hvordan featuren skal løses. Steget finnes fordi de tekniske
valgene skal tas bevisst, av dere, før noe som helst blir skrevet.

Se [docs/workshop/steg-2-planlegging.md](docs/workshop/steg-2-planlegging.md).

## Steg 3: Utfør

Nå implementeres featuren. Agenten kommer til å skrive mesteparten av koden, og
det er meningen -- poenget er ikke hvem som taster, men at valgene underveis er
deres.

Målet med steget er ikke at dere skal ha skrevet featuren for hånd. Det er at
dere har tatt noen tekniske valg bevisst, og at dere etterpå kan forklare hva
som ble lagt til og hvorfor det ser ut som det gjør. Det er et helt annet sted
å komme til enn enter-enter-enter.

**Oppsett -- gjør dette før dere starter steget.** Åpne
`.claude/settings.local.json`.
Slik ser den ut nå:

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

Det er bare dette ene feltet som endres. Den eneste tingen som kan gå galt her,
er en skrivefeil i JSON-en. Start så Claude Code på nytt og kjør `claude -c`, så
beholder dere konteksten fra steg 1 og 2.

**Prompten.** Lim inn denne, med deres eget filnavn i første linje:

```
Planen min ligger i plans/<gruppenavn>.md og skal implementeres nå.

Vi jobber i biter. For hver bit:
- Jeg avgrenser. Foreslå ikke en avgrensning selv.
- Før du skriver noe: hvilke valg tvinger biten fram som planen ikke avgjør?
  Still dem som spørsmål med fil:linje. Ikke anbefal noe.
- Legg TODO(human) der jeg lærer mest om denne kodebasen og valgene i den --
  altså i beregning, vilkår og regler. Ikke i boilerplate, mapping eller
  syntaks. Én per bit.
- Resten skriver du, etter eksisterende mønster i koden.
- Når biten er ferdig: to linjer om hva som ble endret og hvilket valg det
  uttrykker. Ikke skriv tester underveis.

Når alle bitene er ferdige: spør meg hvilke tilfeller som skal testes, og
skriv testene for det jeg svarer. Ikke foreslå tilfellene selv.
```

**`TODO(human)` er deres del.** Agenten skriver rammen rundt og lar ett hull stå
tomt -- i en beregning, et vilkår eller en regel, altså der dere må ha forstått
kodebasen for å skrive noe riktig. Den stopper og venter: den går ikke videre av
seg selv før hullet er fylt ut. Fyll det ut selv, og gjør det før dere går til
neste bit.

Står dere fast, finnes det to veier som ikke gir dere svaret gratis. `/btw` for
språk og syntaks -- den kan ikke lese koden deres, og kan derfor ikke skrive
hullet for dere. Eller be agenten forklare koden som allerede står der, ikke
foreslå hva som skal stå i hullet. Agenten legger selv ved en «Guidance»-del når
den overleverer en TODO; les den som momenter å vurdere, ikke som en oppskrift.

Hvordan jobben stykkes opp i biter, bestemmer dere selv. Det er en del av
utviklerjobben, og det finnes ingen fasit.

Spørsmålene agenten stiller før hver bit skal besvares av dere, ikke av den
selv. Spørsmål om språket og rammeverket går til `/btw`; spørsmål om denne
kodebasen besvarer dere ved å åpne filen.

Steget slutter når alle TODO-ene er fylt ut og testene er skrevet. Ta med
`git diff` og testfila videre til steg 4.

## Steg 4: Test

Her ser dere om det faktisk virker. Både i testene og i grensesnittet, for de
svarer ikke alltid det samme.

Dette steget gjør dere uten agenten, og det er kort med vilje. To ting:

1. Kjør testene. Forsøk så å få noen av dem til å feile -- endre koden de
   tester, og se at de faktisk sier fra. En test som står grønn uansett,
   tester ingenting. Sett koden tilbake etterpå.
2. Åpne frontenden og utfør featuren manuelt.

## Steg 5: Quiz før PR

Siste sjekk før endringen sendes fra dere. Kan dere ikke forklare den i egne
ord, er dere ikke klare til å sende den.

Kjør `/quiz` og svar muntlig. Å slå opp i koden underveis er helt greit -- det
er sånn man jobber. Å lete i chat-loggen etter hva agenten sa, er ikke poenget.

Til slutt skriver dere PR-beskrivelsen selv, i egne ord. Ikke be agenten
formulere den. Den skal si hva som ble lagt til, hvilke valg dere tok, og hva
som eventuelt ikke er dekket.

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

## Slik er repoet satt opp

Backenden ligger i `server/`, frontenden i `web/`. Frontenden er React med Vite,
og dev-serveren proxyer `/api` videre til backend, så de to deler adresse i
nettleseren.

Feil fra API-et kommer som JSON på formen
`{ "error": { "code": "...", "message": "..." } }`, og frontenden viser
meldingen som den er.

Hvordan koden ellers henger sammen -- lagene, endepunktene og skjemaet -- finner
dere selv. Det er det steg 1 handler om.

# Room booking

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

## Slik henger koden sammen

En request går gjennom fire lag, og hvert lag har sitt eget ansvar:

| Lag | Mappe | Ansvar |
| --- | --- | --- |
| Rute | `server/src/routes/` | Kobler HTTP-metode og sti til en controller |
| Controller | `server/src/controllers/` | Leser request, kaller service, skriver respons |
| Service | `server/src/services/` | Forretningsreglene |
| Repository | `server/src/repositories/` | SQL-spørringene, og oversettelse mellom rad og objekt |
| Base | `server/src/db/` | Databasetilkobling, skjema og seed-data |

En POST mot `/api/bookings` går altså `routes/bookingRoutes.ts` →
`controllers/bookingController.ts` → `services/bookingService.ts` →
`repositories/bookingRepository.ts` → `db/database.ts`.

Feil kastes som feilklassene i `server/src/errors.ts`. De fanges av
`server/src/middleware/errorHandler.ts`, som gjør dem om til en HTTP-status og
et JSON-svar på formen `{ "error": { "code": "...", "message": "..." } }`.
Frontenden viser meldingen som den er.

### Endepunkter

| Metode | Sti | Beskrivelse |
| --- | --- | --- |
| GET | `/api/rooms` | Alle rom |
| GET | `/api/rooms/:id` | Ett rom |
| GET | `/api/rooms/:id/bookings` | Bookingene i ett rom |
| GET | `/api/bookings` | Alle bookinger |
| POST | `/api/bookings` | Oppretter en booking |

### Database

Skjemaet ligger i `server/src/db/schema.sql` og består av tabellene `rooms` og
`bookings`. Tidspunkter lagres som ISO 8601-tekst i UTC.

### Frontend

React med Vite, i `web/`. Den henter rom og bookinger fra API-et, viser dem, og
sender inn skjemaet som en POST. Dev-serveren proxyer `/api` videre til backend,
så frontend og backend deler adresse i nettleseren.

---

## Workshop

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

Fordel tre roller i gruppa, og behold dem gjennom hele workshopen: én sitter ved
tastaturet, én er kildefører og avviser enhver påstand som ikke er belagt med
fil:linje, og én er motstemme og skal ha minst én innvending i hvert steg. Bytt
på hvem som sitter ved tastaturet mellom stegene.

To kjøreregler gjelder hele veien. Spørsmål om språket og rammeverket stiller
dere med `/btw`; spørsmål om denne kodebasen besvarer dere ved å åpne filen. Og
ingen påstand om koden teller før noen har vist fil:linje.

Tidene på stegene er veiledende. Det er helt greit å ikke bli ferdig.

### Steg 1: Bli kjent med kodebasen

Orientering før dybde. Dere skal skaffe dere et kart over hva som finnes i
kodebasen, og så lese koden selv i stedet for å nøye dere med et sammendrag av
den.

Se [docs/workshop/steg-1-orientering.md](docs/workshop/steg-1-orientering.md).

### Steg 2: Planlegg

Her bestemmer dere hvordan featuren skal løses. Steget finnes fordi de tekniske
valgene skal tas bevisst, av dere, før noe som helst blir skrevet.

Se [docs/workshop/steg-2-planlegging.md](docs/workshop/steg-2-planlegging.md).

### Steg 3: Utfør

Nå implementeres featuren. Agenten kommer til å skrive mesteparten av koden, og
det er meningen -- poenget er ikke hvem som taster, men at valgene underveis er
deres.

Målet med steget er ikke at dere skal ha skrevet featuren for hånd. Det er at
dere har tatt noen tekniske valg bevisst, og at dere etterpå kan forklare hva
som ble lagt til og hvorfor det ser ut som det gjør. Det er et helt annet sted
å komme til enn enter-enter-enter.

**Oppsett -- gjør dette i pausen før steget.** Åpne `.claude/settings.local.json`.
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
Planen min ligger i plans/<gruppe>.md og skal implementeres nå.

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

Hvordan jobben stykkes opp i biter, bestemmer dere selv. Det er en del av
utviklerjobben, og det finnes ingen fasit.

Rollene fra steg 2 gjelder fortsatt: én ved tastaturet, én kildefører som
avviser påstander uten fil:linje, én motstemme som skal ha minst én innvending.
Den som satt ved tastaturet i steg 2, sitter ikke der nå. Spørsmål om språket og
rammeverket går til `/btw`; spørsmål om denne kodebasen besvarer dere ved å åpne
filen.

Dere har 45 minutter og styrer tiden selv. Fasilitatorene roper når det er gått
halvveis og når det er ti minutter igjen. Det er en klokke, ikke en plan.

Steget slutter når testene er skrevet. Ta med `git diff` og testfila videre til
steg 4.

### Steg 4: Test

Her ser dere om det faktisk virker. Både i testene og i grensesnittet, for de
svarer ikke alltid det samme.

Dette steget gjør dere uten agenten, og det er kort med vilje. To ting:

1. Kjør testene, og se etter at de faktisk tester det de skal.
2. Åpne frontenden og utfør featuren manuelt.

### Steg 5: Quiz før PR

Siste sjekk før endringen sendes fra dere. Kan dere ikke forklare den i egne
ord, er dere ikke klare til å sende den.

Kjør `/quiz` og svar muntlig. Bytt på hvem som svarer, spørsmål for spørsmål.
Å slå opp i koden underveis er helt greit -- det er sånn man jobber. Å lete i
chat-loggen etter hva agenten sa, er ikke poenget.

De siste fem minuttene skriver dere PR-beskrivelsen selv, i egne ord. Ikke be
agenten formulere den. Den skal si hva som ble lagt til, hvilke valg dere tok,
og hva som eventuelt ikke er dekket.

Sett av rundt 20 minutter på hele steget.

### Hvor Claude Code legger tingene sine

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

**Ta med dere kommandoene.** Kopier `.claude/skills/orienter/` til
`~/.claude/skills/`, så har dere `/orienter` i alle repoer dere jobber i
framover -- uten å committe noe i teamets kodebase, og uten å spørre noen om
lov. Det samme gjelder `/quiz`. Ingen av dem vet noe om denne kodebasen.

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

_Fylles inn._

### Steg 3: Utfør

Nå implementeres featuren. Agenten kommer til å skrive mesteparten av koden, og
det er meningen -- poenget er ikke hvem som taster, men at valgene underveis er
deres.

_Fylles inn._

### Steg 4: Test

Her ser dere om det faktisk virker. Både i testene og i grensesnittet, for de
svarer ikke alltid det samme.

_Fylles inn._

### Steg 5: Quiz før PR

Siste sjekk før endringen sendes fra dere. Kan dere ikke forklare den i egne
ord, er dere ikke klare til å sende den.

_Fylles inn._

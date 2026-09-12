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

### Steg 1: Bli kjent med kodebasen

Se [docs/workshop/steg-1-orientering.md](docs/workshop/steg-1-orientering.md).

### Steg 2: Planlegg

_Fylles inn._

### Steg 3: Utfør

_Fylles inn._

### Steg 4: Test

_Fylles inn._

### Steg 5: Quiz før PR

_Fylles inn._

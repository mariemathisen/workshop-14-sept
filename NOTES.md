# Tekniske notater

Dette dokumentet er for deg som holder workshopen, ikke for deltakerne. Det
beskriver hvordan kodebasen er satt sammen, hva som er verifisert, og hvilke
avvik du bør kjenne til. Featuren som skal legges til under workshopen er
bevisst ikke nevnt noe sted her — dokumentet kan derfor ligge i repoet uten å
røpe noe, men flytt det gjerne ut hvis du vil være helt trygg.

## Versjoner og hvorfor

| Valg | Versjon | Begrunnelse |
| --- | --- | --- |
| Node | 22.12 eller nyere | `node:sqlite` krever 22.5+, Vite 8 krever 22.12+. Nedre grense blir 22.12 |
| Express | 5.2 | Stabil, ingen sårbarheter i avhengighetskjeden |
| Vite | 8.3 | — |
| React | 19.3 | — |
| TypeScript | 5.9 | Ikke 7.x, for å unngå overraskelser under workshopen |
| tsx | 4.23 | Kjører TypeScript direkte, prebygget binær, ingen kompilering |
| Database | `node:sqlite` | Innebygd i Node, ingen native bygg, ingen ekstra avhengighet |

`npm audit` gir null sårbarheter. Det er verdt å kjøre `npm install` på nytt noen
dager før workshopen og sjekke at det fortsatt stemmer.

### Hvorfor tsx og ikke Nodes egen TypeScript-støtte

Node 22.22 kan kjøre `.ts`-filer uten hjelp, men type-stripping er først slått på
som standard fra 22.18. Deltakere på 22.12–22.17 ville trengt et ekstra flagg.
`tsx` fjerner den fellen. Den er prebygget og krever ingen kompilator.

Importene i backend skriver full filendelse (`./errors.ts`), som er konvensjonen
når Node kjører TypeScript direkte. `allowImportingTsExtensions` og
`rewriteRelativeImportExtensions` i `server/tsconfig.json` gjør at `tsc` godtar
det samme.

### Hvorfor npm workspaces

`npm install` i rota installerer begge prosjektene. `npm run dev` kjører
`scripts/dev.mjs`, som starter begge med `child_process.spawn` og prefikser
utskriften med `[server]` og `[web]`. Det er skrevet for hånd nettopp for å slippe
en avhengighet som `concurrently`, slik at installasjonen blir så liten som mulig.

## Slik er backend bygget

```
routes/ → controllers/ → services/ → repositories/ → db/
```

Hvert lag kjenner bare laget under seg. Det er fire mapper, to filer i hver
(én for rom, én for bookinger), slik at mønsteret er lett å gjenkjenne når man
har sett halvparten.

| Fil | Ansvar |
| --- | --- |
| `src/index.ts` | Kobler til databasen, initialiserer den, starter serveren |
| `src/app.ts` | Setter opp Express, monterer rutene, 404 og feilhåndtering |
| `src/config.ts` | Port og filstier |
| `src/errors.ts` | `AppError` med subklasser som bærer HTTP-status og feilkode |
| `src/middleware/errorHandler.ts` | Oversetter feil til JSON-respons |
| `src/controllers/params.ts` | Parser numeriske rute-parametre |
| `src/db/database.ts` | Tilkoblingen, med `getDatabase()` som resten av koden bruker |
| `src/db/initialize.ts` | Kjører skjemaet, seeder hvis `rooms` er tom |
| `src/db/seed.ts` | Seed-dataene |

Databasetilkoblingen er en modul-singleton. Det gjør at repositories kan kalle
`getDatabase()` uten at man må tre en tilkobling gjennom alle lagene, og det
gjør at testene kan bytte hele databasen mellom to tester uten å starte serveren
på nytt.

### Reglene for å opprette en booking

Alle ligger i `services/bookingService.ts`, i denne rekkefølgen:

1. Tittel og navn kan ikke være tomme etter trimming → 400
2. Tidspunktene må være gyldige ISO 8601 → 400
3. Slutt må være etter start → 400
4. Maks 8 timer (`MAX_DURATION_HOURS`) → 400
5. Rommet må finnes → 404
6. Ingen overlapp i samme rom → 409

Skallet på requesten valideres et lag lenger ute, i
`controllers/bookingController.ts`: at feltene finnes og har riktig JSON-type.
Skillet er at controlleren sjekker formen på dataene, servicen sjekker om de gir
mening.

Feilsvaret ser slik ut, uansett hvilken regel som slo til:

```json
{ "error": { "code": "BOOKING_CONFLICT", "message": "Skogen already has a booking that overlaps the selected time" } }
```

Frontenden viser `message` som den er, rett under knappen i skjemaet.

### Overlapp

Spørringen ligger i `repositories/bookingRepository.ts`, i `findOverlapping`:

```sql
WHERE room_id = ? AND starts_at < ? AND ends_at > ?
```

To bookinger overlapper hvis den ene starter før den andre slutter, og slutter
etter at den andre startet. Strenge ulikheter betyr at en booking kan begynne
nøyaktig når den forrige slutter. Det finnes en egen test for akkurat det
grensetilfellet.

Spørringen sammenligner tekst. Den er bare riktig fordi servicen normaliserer
alle tidspunkter til ISO 8601 i UTC (`toISOString()`) før de lagres, slik at alle
strengene har samme lengde og format. Hvis noen begynner å lagre lokal tid eller
et annet format, slutter sammenligningen å virke. Skjemaet har en
`CHECK (starts_at < ends_at)` som en siste sperre, men den fanger ikke overlapp.

### Tidssoner

Databasen og API-et bruker UTC gjennomgående. Frontenden konverterer begge veier:
`datetime-local`-feltene leses som lokal tid og sendes som UTC, og
`Intl.DateTimeFormat` viser dem tilbake i brukerens tidssone. Deltakere som
curler API-et direkte vil se andre klokkeslett enn de ser i grensesnittet. Det er
verdt å nevne, for det er en klassisk kilde til forvirring.

### Seed-data

`db/seed.ts` legger inn fire rom (Fjorden, Skogen, Kaia, Loftet) og fire
bookinger. Bookingene bruker relative datoer — i dag og i morgen, på faste
klokkeslett — slik at grensesnittet alltid viser noe realistisk uansett når
workshopen holdes. Seeding skjer bare hvis `rooms`-tabellen er tom.

Nullstill slik:

```bash
rm -rf server/data
npm run dev
```

### Testene

`npm test` kjører Nodes innebygde testkjører via tsx, med spec-rapportøren.
Tolv tester, rundt ett sekund.

Oppsettet ligger i `test/support/testServer.ts`. `startTestApi()` starter hele
Express-appen på en tilfeldig ledig port og gir tilbake `get`, `post`, `reset` og
`close`. Testene går altså over ekte HTTP, gjennom alle fire lag, mot en database
i minnet. Ingen database-fil opprettes av testkjøringen.

`reset()` lukker databasen og bygger en ny i minnet med seed-data. Den kalles i
`beforeEach`, så hver test starter likt. Node kjører hver testfil i sin egen
prosess, så filene påvirker ikke hverandre.

Testen `creates a booking` i `test/bookings.test.ts` er skrevet for å kopieres:
den bruker `bookingPayload()`-helperen med overstyringer, poster, sjekker status
og felter, og verifiserer til slutt at bookingen faktisk dukker opp på rommet.
Testene for datoer bruker faste tidspunkter i 2030, slik at de aldri kolliderer
med seed-dataene.

### Frontend

React 19 med Vite, i `web/`. Tre komponenter og en API-klient. Dev-serveren
proxyer `/api` til port 3001, så nettleseren ser alt på samme origin og slipper
CORS.

`api.ts` kaster `ApiError` med meldingen fra serveren. `BookingForm` fanger den
og viser den. Ved suksess kaller den `onCreated`, som laster rom og bookinger på
nytt i `App`. Ingen state-bibliotek, ingen router — det er med vilje, siden
frontenden ikke skal røres under workshopen.

## Hva som er verifisert

Kjørt fra helt rent utgangspunkt: slettet `node_modules`, `package-lock.json` og
databasefila først.

- `npm install` — null sårbarheter, ingen native bygg
- `npm run dev` — begge prosessene starter, databasefila opprettes og seedes
- `npm test` — 12 grønne på ca. ett sekund
- `npm run typecheck` — rent i begge workspaces

API-et testet gjennom Vite-proxyen, altså samme vei som nettleseren går:

| Handling | Resultat |
| --- | --- |
| `GET /api/rooms` | 4 rom |
| `GET /api/bookings` | 4 bookinger, sortert på starttid |
| `POST /api/bookings` gyldig | 201 med hele objektet |
| `POST /api/bookings` overlappende | 409, `BOOKING_CONFLICT`, tydelig melding |
| `POST /api/bookings` ukjent rom | 404, `NOT_FOUND` |

Frontenden er verifisert headless: bundelen ble bygget, lastet i jsdom mot en
kjørende backend, og skjemaet ble fylt ut og sendt inn programmatisk. Den viste
alle fire rom med bookingene sine, opprettet en booking som dukket opp i lista
med bekreftelsesmelding, og viste feilmeldingen fra API-et ved overlapp uten å
legge til noe. Verktøyene for den sjekken er ryddet bort igjen.

## Avvik og kjente begrensninger

1. **18 TypeScript-filer i backend, ikke 16.** Den ene ekstra er
   `controllers/params.ts`. `test/support/testServer.ts` kommer i tillegg, men
   ligger utenfor `src/`.
2. **Node-kravet ble 22.12, ikke 22.5.** Vite 8 setter grensen, ikke databasen.
3. **Én devDependency for å kjøre TypeScript:** `tsx`. Se begrunnelsen over.
4. **Ikke testet i en ekte nettleser.** jsdom-kjøringen dekker data, logikk og
   feilhåndtering, men ikke at CSS-en ser riktig ut. Ta ett øyekast før dere
   kjører workshopen.
5. **Portene 3001 og 3000 er hardkodet** i `server/src/config.ts` og
   `web/vite.config.ts`. Frontend ligger på 3000 fordi det er porten folk
   forventer; backend måtte derfor flytte til 3001. Backend-porten kan
   overstyres med `PORT`, men da må proxyen i Vite endres tilsvarende. Verdt å
   sjekke at ingen deltakere har noe annet kjørende på de portene.

## Til deg som fasiliterer

Noen holdepunkter som er nyttige å kjenne til når gruppene begynner å lete:

- **Den korteste veien gjennom stacken** er `GET /api/rooms`: fire filer fra rute
  til SQL. Fin å be gruppene spore først.
- **Der det faktisk skjer noe** er `services/bookingService.ts`. Hvis en gruppe
  bare har lest én fil, bør det være den.
- **Repositoryet er det eneste stedet som kjenner SQL.** Ingen spørringer
  lekker oppover. Det er et poeng man kan la gruppene oppdage selv ved å søke
  etter `SELECT` i kodebasen.
- **Feilhåndteringen går via unntak, ikke returverdier.** Servicen kaster,
  middlewaren oversetter. Det er ingen `try`/`catch` i controllerne, og det
  forvirrer ofte folk som er vant til noe annet.
- **Testene er den raskeste måten å forstå reglene på.** Åtte av tolv tester
  handler om hva som er lov når man oppretter en booking.

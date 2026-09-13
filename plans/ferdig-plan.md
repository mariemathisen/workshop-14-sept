# Ferdig plan: gjentakende booking

En bruker skal kunne opprette en serie bookinger i stedet for én. Serien er hel
eller ingenting: kolliderer én forekomst, opprettes ingen, og brukeren får vite
hvilken dato som kolliderte.

## Avgjorte valg

- **Ukedagen utledes av startdatoen**, den er ikke et eget felt. Skjemaet velger
  dato direkte, så ukedagen følger av brukerens valg og kan ikke motsi
  startdatoen.
- **Serielengden er et eget `repeatUntil`-felt ved siden av `endsAt`**, ikke en
  overlasting av `endsAt`. `endsAt` beholder da én betydning overalt. Betyr det
  «seriens slutt» på ett endepunkt og «møtets slutt» på et annet, kan servicen
  ikke lenger kjøre `MAX_DURATION_HOURS` på rå payload, og
  `CHECK (starts_at < ends_at)` i `schema.sql` mister mening.
- **`repeatUntil` er et fullt ISO-tidsstempel**, ikke `YYYY-MM-DD`. Backend
  sammenligner det mot `startsAt`; en ren dato måtte tolkes i en tidssone først,
  og valget av tidssone ville vært en ny kilde til én-av-feil. Frontenden sender
  siste øyeblikk av den lokale dagen brukeren valgte -- ikke startklokkeslettet
  på den datoen, som ville forskjøvet seg en time og mistet siste forekomst når
  en serie krysser en sommertidsovergang.
- **Ny type `NewBookingSeries = NewBooking & { repeatUntil }`.** `NewBooking`
  røres ikke, så ingen eksisterende kall endrer betydning.
- **`bookingService.ts` forblir én flat fil**, med delt validering i en ny
  `bookingValidation.ts` ved siden av. Det bevarer mønsteret «to symmetriske
  filer per mappe». En mappe ville dessuten tvunget importen i
  `bookingController.ts:3` til `bookingService/index.ts`, siden
  `server/tsconfig.json` bruker `moduleResolution: NodeNext`, som ikke gjør
  mappeoppslag.
- **`repeatUntil` før `startsAt` avvises alltid** med 400, og frontenden
  blokkerer submit. Stille å tolke det som «da blir det ett møte» skjuler en feil
  brukeren gjorde.
- **Reglene for serien kjører før reglene for den enkelte bookingen.** En
  ugyldig sluttdato meldes tilbake før tittel og klokkeslett vurderes.
- **Kollisjonsmeldingen navngir datoen slik den ser ut i Norge**, formatert
  `nb-NO` med `timeZone: 'Europe/Oslo'` oppgitt eksplisitt. Uten tidssonen ville
  serveren brukt sin egen -- typisk UTC -- og navngitt feil dag for kveldsmøter.
- **En serie kan spenne over maks 26 uker**, målt i hele uker mellom `startsAt`
  og `repeatUntil`. Grensen håndheves i servicen og speiles av `max` på
  sluttdato-feltet i skjemaet.
- **Controlleren eier formatet på `repeatUntil`** (`z.iso.datetime()`), servicen
  eier betydningen. `insertMany` med tom liste svarer 400, ikke 500.
- **Databaseskjemaet er uendret**, ingen `series_id`. Sletting og endring av
  serier er utenfor scope i kravfila.

## Plan

- **Skriv om skjemaet i `web/src/components/BookingForm.tsx`.** De to
  `datetime-local`-feltene erstattes av én `type="date"` for møtedatoen og to
  `type="time"` for fra og til. `startsAt` bygges av dato + fra-klokkeslett,
  `endsAt` av *samme* dato + til-klokkeslett. Ny state `recurring` (checkbox); er
  den på, vises en `type="date"` for når serien slutter, og submit går mot
  `api.createBookingSeries`. Under feltet vises det avledede: «Every Tuesday, 5
  bookings.»
  *Valget:* ulovlige tilstander gjøres uttrykksløse — man kan ikke lenger be om
  et møte fra mandag til onsdag ved et uhell, og ukedagen blir entydig. `endsAt`
  bygges likt uansett om `recurring` er på, så `handleSubmit` har bare én gren
  som faktisk skiller seg. Prisen er at møter over midnatt ikke kan uttrykkes;
  bevisst bytte. Native `type="time"` framfor en `select` med faste slots, slik
  at vi slipper å anta en granularitet.

- **Valider sluttdatoen i frontenden, i samme fil.** `min={date}` på
  sluttdato-feltet, pluss en avledet `seriesEndsTooEarly` som både deaktiverer
  knappen, kaster ut av `handleSubmit` og viser en melding. Antall forekomster
  regnes ut på kalenderen — `Date.UTC(år, måned, dag)` for begge datoene,
  differanse i hele uker pluss én — ikke på klokka.
  *Valget:* `min` alene holder ikke, siden feltet kan fylles ved liming eller
  autofyll. Kalenderaritmetikk framfor `Date`-differanse fordi lokal tid har døgn
  på 23 og 25 timer to ganger i året, og tellingen ellers bommer med én forekomst
  i akkurat de ukene. *Lest i koden:* ingen annen validering i skjemaet i dag, så
  dette er det første tilfellet der frontenden avviser noe selv.

- **Legg til CSS i `web/src/styles.css`.** En `.checkbox`-regel som setter
  `display: flex` og `align-items: center` for checkbox + tekst side om side, og
  en `.form-hint` i dempet farge for det avledede.
  *Valget:* nødvendig fordi `label` er `display: grid` (linje 145) og stabler alt
  inni vertikalt — en checkbox der får boksen over teksten. `.form-message`
  (linje 186) gir margin og skriftstørrelse, men ingen farge, så `.form-hint`
  legges ved siden av `.form-error` og `.form-confirmation` i samme mønster.
  *Lest i koden.*

- **Utvid `web/src/api.ts` og begge `types.ts`-filene.** Ny
  `createBookingSeries(series): Promise<Booking[]>` som POSTer til
  `/api/bookings/series` med samme felter som en vanlig booking pluss
  `repeatUntil`, bygget over den eksisterende `request`-helperen slik at
  `ApiError` og feilmeldingen fra serveren oppfører seg som før.
  `NewBookingSeries` legges til i både `web/src/types.ts` og
  `server/src/types.ts`. Bekreftelsen leses av lengden på arrayen serveren
  returnerte.
  *Valget:* frontenden regner aldri ut forekomstene selv — den sender én request
  og stoler på svaret. Bygger på at all annen domenelogikk ligger i servicen; en
  parallell utregning ville vært en ny kilde til avvik. De to `types.ts`-filene
  er håndkopier av hverandre — ingen delt pakke i workspacet — så de holdes i
  synk manuelt, som i dag.

- **Ny rute og controller.** `server/src/routes/bookingRoutes.ts` utvides med
  `post('/series', bookingController.createSeries)`.
  `server/src/controllers/bookingController.ts` får `createSeries` og et
  `newBookingSeriesSchema = newBookingSchema.extend({ repeatUntil: z.iso.datetime() })`.
  Svarer 201 med arrayen.
  *Valget:* eget endepunkt framfor et flagg på `POST /api/bookings`. Bygger på at
  dagens endepunkt returnerer ett objekt — både `api.createBooking` i
  `web/src/api.ts` og testen `creates a booking` leser `response.body.roomId`
  direkte, og ville brukket av et array-svar. `.extend()` framfor å gjenta
  feltene, slik at de to skjemaene ikke kan drive fra hverandre. Controlleren
  sjekker bare formen; at `repeatUntil` er et gyldig tidspunkt og ligger etter
  `startsAt` hører hjemme i servicen.

- **Trekk felles validering ut i `server/src/services/bookingValidation.ts`.** Ny
  fil med `MAX_DURATION_HOURS`, `MAX_SERIES_WEEKS`, `parseTimestamp` og en
  `validateBooking(input)` som gjør trimming, ISO-parsing, `endsAt > startsAt`,
  varighetsgrensen og `getRoom` — i nøyaktig samme rekkefølge som i dag — og
  returnerer `{ room, booking }` med normaliserte UTC-tidspunkter.
  `createBooking` blir et tynt kall til den.
  *Valget:* dele framfor å duplisere reglene. Bygger på at alle seks reglene i
  dag bor i `bookingService.ts` — en serie som validerte litt annerledes ville
  vært en stille divergens. Overlapp blir liggende igjen i servicen, fordi det er
  den ene regelen som krever databasen og som en serie må kjøre for alle
  forekomster før noen skrives. At de tolv eksisterende testene forblir grønne
  uten endring er kriteriet refaktoreringen måles mot.

- **`createBookingSeries` i `server/src/services/bookingService.ts`.** Kaller
  `validateBooking` på første forekomst, så alle seks reglene gjelder uendret.
  Parser `repeatUntil`, avviser den hvis den ligger før `startsAt`, og genererer
  forekomster på `startsAt + n × 7 døgn` så lenge starten er `<= repeatUntil`.
  Over `MAX_SERIES_WEEKS = 26` gir `ValidationError`.
  *Valgene:* steget er 7 døgn i UTC fordi hele lagret er UTC, og
  tekstsammenligningen i `findOverlapping` krever uniformt format (*lest i
  koden*). Konsekvensen tas bevisst: en serie som krysser en sommertidsovergang
  forskyver lokalt klokkeslett med én time. Grensen 52 er *antatt*. At
  `repeatUntil` sammenlignes mot forekomstens *start* og ikke slutt, gjør grensen
  uavhengig av møtelengden.

- **Alt-eller-ingenting: sjekk alle først, skriv så.** Alle forekomstene sjekkes
  mot `bookingRepository.findOverlapping` i løkke før noe skrives. Første treff
  kaster `BookingConflictError` med datoen i teksten — «Fjorden already has a
  booking that overlaps 2026-10-26». Går alle klart, skrives de av en ny
  `insertMany(bookings: NewBooking[])` i
  `server/src/repositories/bookingRepository.ts`: `BEGIN`, gjenbruk av `insert`
  per rad, `COMMIT`, og `ROLLBACK` i en `catch` før feilen kastes videre.
  *Valgene:* gjenbruke `BookingConflictError` framfor en ny feilklasse, siden
  `middleware/errorHandler.ts` og `web/src/api.ts` allerede plukker opp status og
  `message` generisk — 409 og `BOOKING_CONFLICT` er riktig betydning, det eneste
  som manglet var datoen (*lest i koden*). Enkeltbookingens melding beholdes
  uendret; bare serien navngir en dato. Transaksjonen ligger i repositoryet fordi
  det er det eneste laget som kjenner SQL. De to mekanismene løser hvert sitt
  problem: løkka gir brukeren riktig feilmelding før noe skjer, transaksjonen
  redder oss hvis noe uventet ryker mellom to `INSERT`-er. Forekomstene kan ikke
  kollidere med hverandre, siden maks varighet er 8 timer og avstanden er 7 døgn.

# Steg 1: Orientering

Dere skal bli kjent med en kodebase dere aldri har sett før, og selv verifisere
det dere får vite om den. Verktøyet dere bruker er `/orienter` -- en
slash-kommando i dette repoet som ber Claude tegne et kart over koden. Dere
bruker kartet, og så sjekker dere at det stemmer.

## Oppgaven

1. **Få appen til å kjøre.** `npm install`, deretter `npm run dev`. Åpne
   frontend-adressen i nettleseren og sjekk at dere ser data.
2. **Kjør orienteringen.** Start Claude Code i rotmappa av repoet og skriv
   `/orienter`. Les hele svaret før dere gjør noe annet.
3. **Legg merke til hva som er antatt.** Svaret skiller mellom det Claude har
   lest i koden og det den antar. Antakelsene er kandidater til å være feil.
4. **Gjør de fire oppgavene svaret avsluttes med.** Selv, i editoren og i
   nettleseren. De står beskrevet under.

Dere er ferdige når de fire oppgavene er gjort. Det er ikke noe dokument som
skal leveres -- det dere sitter igjen med er kjennskap til kodebasen.

## Hva `/orienter` gjør, og hvorfor

Kommandoen ber Claude om å svare på seks ting: hva applikasjonen gjør, hvilke
lag en request går gjennom, hvilke entiteter og endepunkter som finnes, hvor
skrivereglene bor, og hvordan appen og testene kjøres.

Den finnes fordi orientering kommer før dybde. Når dere åpner et ukjent repo,
er fristelsen å hoppe rett til filen dere tror dere skal endre. Da bygger dere
på gjetninger. Kommandoen tvinger fram et oversiktsbilde først, og den ber om
svar dere kan etterprøve -- fil:linje og konkrete navn, ikke generelle
forklaringer av rammeverket.

Svaret er begrenset til 300 ord. Det er med vilje: et kart skal være kort nok
til å leses i ett jafs.

## Den er read-only

Kommandoen endrer ingenting, og den skal ikke brukes til å be om endringer.
Ikke skriv `/orienter og fiks X`. Forslag til løsninger, ny kode og oppstartede
oppgaver hører ikke hjemme i dette steget -- det kommer i steg 2 og 3.

## De fire sluttoppgavene er obligatoriske

Hvert svar avsluttes med fire oppgaver dere skal gjøre selv: kjøre appen i
nettleseren og notere path, request-body og statuskode; åpne to av filene og
sjekke at linjenumrene stemmer; skrive av én linje kode ordrett fra filen der
reglene håndheves; og velge én skriveoperasjon dere vil følge i dybden.

Ikke be Claude gjøre dem for dere. Poenget er at dere selv verifiserer kartet
mot terrenget -- det er slik dere oppdager når en modell tar feil. Det er dette
grunnlaget steg 2 hviler på: der skal dere planlegge en endring i koden, og en
plan bygget på gjetninger blir en dårlig plan.

## Hvor kommandoen ligger

Fila er `.claude/skills/orienter/SKILL.md`, og den er sjekket inn i repoet.
Dere får kommandoen ved kloning, uten oppsett.

Innholdet nevner ingen begreper fra dette domenet. Den forutsetter bare at den
ser på en webtjeneste med database, og spør om lag, entiteter, skjema og
skriveoperasjoner. Derfor kan mappa kopieres rett inn i et hvilket som helst
annet repo og brukes der -- teknikken er poenget, ikke denne kodebasen.

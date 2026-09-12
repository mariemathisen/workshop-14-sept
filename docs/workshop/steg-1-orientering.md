# Steg 1: Orientering

## Hva `/orienter` er

`/orienter` er en slash-kommando som ligger i dette repoet. Den ber Claude om å
tegne et kart over kodebasen: hva applikasjonen gjør, hvilke lag en request går
gjennom, hvilke entiteter og endepunkter som finnes, hvor skrivereglene bor, og
hvordan appen og testene kjøres.

Den finnes fordi orientering kommer før dybde. Når du åpner et repo du aldri har
sett før, er fristelsen å hoppe rett til filen du tror du skal endre. Da bygger
du på gjetninger. Kommandoen tvinger fram et oversiktsbilde først, og den ber om
svar du kan etterprøve -- fil:linje og konkrete navn, ikke generelle forklaringer
av rammeverket.

## Hvordan du bruker den

Start Claude Code i rotmappa av repoet og skriv:

```
/orienter
```

Svaret er begrenset til 300 ord. Det er med vilje: et kart skal være kort nok til
å leses i ett jafs.

## Den er read-only

Kommandoen endrer ingenting, og den skal ikke brukes til å be om endringer.
Ikke skriv `/orienter og fiks X`. Forslag til løsninger, ny kode og oppstartede
oppgaver hører ikke hjemme i dette steget -- det kommer i steg 2 og 3.

## De fire sluttoppgavene er obligatoriske

Hvert svar avsluttes med fire oppgaver du skal gjøre selv: kjøre appen i
nettleseren og notere path, request-body og statuskode; åpne to av filene og
sjekke at linjenumrene stemmer; skrive av én linje kode ordrett fra filen der
reglene håndheves; og velge én skriveoperasjon du vil følge i dybden.

Ikke be Claude gjøre dem for deg. Poenget er at du selv verifiserer kartet mot
terrenget -- det er slik du oppdager når en modell tar feil. Neste steg i
workshopen bygger direkte på notatene dine herfra, særlig valget av
skriveoperasjon.

## Hvor kommandoen ligger

Fila er `.claude/skills/orienter/SKILL.md`, og den er sjekket inn i repoet. Du
får kommandoen ved kloning, uten oppsett.

Innholdet nevner ingen begreper fra dette domenet. Den forutsetter bare at den
ser på en webtjeneste med database, og spør om lag, entiteter, skjema og
skriveoperasjoner. Derfor kan du kopiere mappa rett inn i et hvilket som helst
annet repo og bruke den der -- teknikken er poenget, ikke denne kodebasen.

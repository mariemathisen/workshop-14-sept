# Steg 1: Orientering

Du skal bli kjent med en kodebase du aldri har sett før, og selv verifisere det
du får vite om den. Verktøyet du bruker er `/orienter` -- en slash-kommando i
dette repoet som ber Claude tegne et kart over koden. Du bruker kartet, og så
sjekker du at det stemmer.

## Oppgaven

Ha et notatdokument åpent ved siden av -- du skal skrive underveis, og notatene
brukes i steg 2.

1. **Få appen til å kjøre.** `npm install`, deretter `npm run dev`. Åpne
   frontend-adressen i nettleseren og sjekk at du ser data.
2. **Kjør orienteringen.** Start Claude Code i rotmappa av repoet og skriv
   `/orienter`. Les hele svaret før du gjør noe annet.
3. **Marker hva som er antatt.** Svaret skiller mellom det Claude har lest i
   koden og det den antar. Noter deg antakelsene -- de er kandidater til å være
   feil.
4. **Gjør de fire oppgavene svaret avsluttes med.** Selv, i editoren og i
   nettleseren. De står beskrevet under.
5. **Skriv ned ett spørsmål** du sitter igjen med om kodebasen. Du tar det med
   til steg 2.

Du er ferdig når du har notert: path, request-body og statuskode fra
nettverksfanen; resultatet av linjenummer-sjekken; den avskrevne kodelinja;
valgt skriveoperasjon med begrunnelse; og spørsmålet ditt.

## Hva `/orienter` gjør, og hvorfor

Kommandoen ber Claude om å svare på seks ting: hva applikasjonen gjør, hvilke
lag en request går gjennom, hvilke entiteter og endepunkter som finnes, hvor
skrivereglene bor, og hvordan appen og testene kjøres.

Den finnes fordi orientering kommer før dybde. Når du åpner et ukjent repo, er
fristelsen å hoppe rett til filen du tror du skal endre. Da bygger du på
gjetninger. Kommandoen tvinger fram et oversiktsbilde først, og den ber om svar
du kan etterprøve -- fil:linje og konkrete navn, ikke generelle forklaringer av
rammeverket.

Svaret er begrenset til 300 ord. Det er med vilje: et kart skal være kort nok
til å leses i ett jafs.

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

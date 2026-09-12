# Feature: gjentakende booking

Dette er kravene til featuren dere skal legge til. De sier hva brukeren skal
kunne gjøre og hva systemet skal svare -- ingenting om hvordan det bygges. Det
er opp til dere.

## Hva brukeren skal kunne gjøre

En bruker skal kunne opprette en serie bookinger i stedet for én av gangen.
Brukeren velger rom, starttidspunkt, hvilken ukedag serien skal falle på, og
hvor mange uker den skal vare. Resultatet er en booking i det valgte rommet på
den ukedagen, til det tidspunktet, i det antallet uker brukeren ba om.

Dette skal kunne gjøres fra bookingskjemaet i nettleseren. Både backend og
frontend er altså i scope. Hvordan arbeidet fordeler seg mellom dem, er en av
beslutningene dere skal ta.

## Hva systemet skal svare

En serie er enten hel eller ingenting. Kolliderer én av forekomstene i serien
med en booking som allerede finnes, skal ingen av forekomstene opprettes -- heller
ikke de som isolert sett ville gått fint. Brukeren skal få vite hvilken dato som
kolliderte.

## Utenfor scope

Å slette en serie er ikke en del av denne oppgaven. Det samme gjelder å endre
en serie etter at den er opprettet.

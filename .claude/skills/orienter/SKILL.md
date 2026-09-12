---
name: orienter
description: Førstegangs-orientering i en ukjent kodebase. Read-only, ingen endringer.
disable-model-invocation: true
---

Brukeren har aldri sett denne kodebasen før. Ikke endre noe, ikke foreslå
løsninger, ikke skriv kode, ikke start oppgaver.

Svar på dette, i denne rekkefølgen:

1) Hva gjør denne applikasjonen? Tre setninger, i domenets egne ord.
2) Hvilke lag går en request gjennom, fra inngang til database? Navngi hvert
   lag med én representativ fil.
3) Hvilke ressurser/entiteter håndterer applikasjonen, og hvor er de definert?
   fil:linje. Hvor ligger databaseskjemaet eller migrasjonene?
4) Hvilke endepunkter finnes? Metode, path, fil:linje. Marker hvilke som skriver.
5) Hvilken av skriveoperasjonene har flest regler eller validering knyttet til
   seg, og hvor ligger de reglene? fil:linje.
6) Hvordan kjøres appen og testene, og hvor ligger testene?

Maks 300 ord totalt. Ikke forklar rammeverket eller språket.
Marker tydelig hva du har lest i koden og hva du antar.

Avslutt alltid med denne listen, ordrett, uten å utføre punktene selv:

  Nå gjør du dette selv -- ikke spør meg om noe av det:
  1. Åpne appen i nettleseren, utfør hovedhandlingen, og noter path,
     request-body og statuskode fra nettverksfanen.
  2. Åpne to av filene jeg viste til og sjekk at linjenumrene stemmer.
  3. Skriv av én linje kode ordrett fra filen der reglene håndheves.
  4. Velg én skriveoperasjon du vil følge i dybden, og skriv ned hvorfor.

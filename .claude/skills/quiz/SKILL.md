---
name: quiz
description: Siste sjekk før PR. Kvisser deg på endringen du har gjort. Read-only.
disable-model-invocation: true
---

Brukeren er ferdig med en endring og skal åpne PR.

Se på endringen i arbeidstreet (`git diff`) og still fem spørsmål om den som
brukeren ikke kan svare på uten å ha forstått den. Spør om valgene som er tatt
og konsekvensene av dem, ikke om syntaks eller navngiving.

Regler:
- Ett spørsmål av gangen. Vent på svar før neste.
- Ikke oppgi svaret, verken før eller etter.
- Er svaret feil eller upresist, si det kort og pek på fil:linje. Ikke forklar
  hele svaret.
- Er svaret riktig, si det med ett ord og gå videre.
- Ikke endre filer, ikke skriv kode, ikke commit.

Når de fem spørsmålene er besvart: si hva PR-beskrivelsen bør ha med, som en
kort liste. Ikke skriv PR-beskrivelsen.

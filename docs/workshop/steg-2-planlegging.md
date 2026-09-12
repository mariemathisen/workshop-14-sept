# Steg 2: Planlegging

Nå vet dere hva som finnes i kodebasen. I dette steget bestemmer dere hvordan
featuren skal løses -- før én linje kode er skrevet. Kravene står i
[feature-gjentakende-booking.md](feature-gjentakende-booking.md).

Ingenting skal implementeres her. Når Claude Code til slutt spør om planen skal
settes ut i livet, svarer dere nei -- featuren skrives i steg 3.

## Oppgaven

Dere lager to planer, uavhengig av hverandre, og sammenligner dem.

Først skriver gruppa sin egen plan, på papir, uten agenten. Deretter lager
agenten sin plan uten å ha sett deres. Det er ikke tungvint med vilje: en agent
som får en ferdig plan å forholde seg til, forankrer seg i den og bekrefter den
i stedet for å tenke selv. To planer som spriker er hele læringen i steget --
uenighetene er det dere skal snakke om.

Når begge planene finnes, tar dere diskusjonen med agenten også. Da er
uavhengigheten allerede sikret, og den kan ikke lenger forankre seg i deres
tenkning.

Planen har formatkrav, ikke innholdskrav. Den er en liste over beslutninger dere
mener må tas, og for hver: hva dere velger, og hva valget bygger på -- fil:linje
hvis dere har lest det i koden, "antatt" hvis ikke. Dere får ingen liste over
hva som må besvares. Å finne ut hvilke beslutninger som hører hjemme er
oppgaven.

## Rekkefølgen

1. Gruppas egen plan, på papir. Ingen prompt, ingen agent.
2. `/planlegg`
3. Sammenlign de to planene -- først dere imellom, så sammen med agenten. Dette
   er den viktigste delen, og den skal ha mest tid.
4. Lås den planen dere lander på i `plans/`
5. Plenum

## Slik kjører dere `/planlegg`

Gå inn i plan mode først -- Shift+Tab, eller skriv `/plan`. Så `/planlegg`.

Når plan mode er ferdig, spør Claude Code om planen skal settes ut i livet. Svar
nei og bli i plan mode. Som nevnt over: ingenting implementeres i dette steget.

Agenten skal ikke se planen deres før den har laget sin egen. Ikke lim den inn,
ikke referer til den, ikke spør om den er enig -- ikke før svaret fra
`/planlegg` står på skjermen. Kommandoen er read-only: den skriver ingen kode og
oppretter ingen filer.

Til orientering: plan mode lagrer sitt eget notat utenfor repoet, under
`~/.claude/plans/`. Det er Claude Code som gjør det, ikke kommandoen. Notatet
blir aldri tracket av git -- ikke fordi det er ignorert, men fordi git bare ser
filer som ligger inne i repoet, og dette ligger i hjemmekatalogen din.

## Sammenligningen

Snakk først sammen uten agenten: hvor er planene uenige, og hvilken uenighet
betyr egentlig noe? En plan som velger annerledes enn dere er ikke feil fordi
den er annerledes.

Ta så diskusjonen med agenten. «Her er det vi kom fram til» -- og la den svare.
Den kommer ofte med et justert forslag, og da kan dere iterere videre eller si
dere fornøyde.

Ett forbehold: en agent som blir spurt «hva synes du om vårt forslag?» har en
sterk tendens til å si seg enig. Spør heller hva som taler *imot* valget deres,
eller hva som går galt hvis dere tar feil. Da får dere en motstemme i stedet for
et ekko.

Dere er ferdige når dere kan si grunnen til hver beslutning -- ikke når agenten
slutter å foreslå forbedringer.

## Lås planen

Gå ut av plan mode med Shift+Tab. Ikke ved å godkjenne planen: det starter
implementasjonen, og den hører til steg 3.

Be så agenten skrive planen dere landet på til
`plans/gruppe-<nr>-gjentakende-booking.md`. Les gjennom fila før dere går
videre. Det er deres plan som skal stå der, ikke agentens.

## Kjøreregler

Spørsmål om språket og rammeverket stiller dere med `/btw`. Spørsmål om denne
kodebasen besvarer dere ved å åpne filen. Ingen påstand om koden teller før noen
har vist fil:linje -- det gjelder agentens påstander også, og planen dens er full
av dem.

## Hvor filene ligger

- Kravene: `docs/workshop/feature-gjentakende-booking.md`
- Arket dere fyller ut: `docs/workshop/utskrifter/steg-2-gruppens-plan.md`
- Kommandoen: `.claude/skills/planlegg/SKILL.md`
- Den låste planen: `plans/gruppe-<nr>-gjentakende-booking.md`

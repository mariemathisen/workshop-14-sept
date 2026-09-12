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

Planen har formatkrav, ikke innholdskrav. Den er en liste over beslutninger dere
mener må tas, og for hver: hva dere velger, og hva valget bygger på -- fil:linje
hvis dere har lest det i koden, "antatt" hvis ikke. Dere får ingen liste over
hva som må besvares. Å finne ut hvilke beslutninger som hører hjemme er
oppgaven.

## Tidsplan (25 min)

| Tid | Hva |
| --- | --- |
| 7 min | Gruppas egen plan, på papir. Ingen prompt, ingen agent. |
| 5 min | `/planlegg` |
| 9 min | Sammenlign de to planene |
| 2 min | Lås planen i `plans/` |
| 2 min | Plenum |

## Slik kjører dere `/planlegg`

Gå inn i plan mode først -- Shift+Tab, eller skriv `/plan`. Så `/planlegg`.

Når plan mode er ferdig, spør Claude Code om planen skal settes ut i livet. Svar
nei og bli i plan mode. Som nevnt over: ingenting implementeres i dette steget.

Agenten skal aldri få se gruppas plan. Ikke lim den inn, ikke referer til den,
ikke spør om agenten er enig i den. Kommandoen er read-only: den skriver ingen
kode og oppretter ingen filer.

Til orientering: plan mode lagrer sitt eget notat utenfor repoet, under
`~/.claude/plans/`. Det er Claude Code som gjør det, ikke kommandoen. Notatet
blir aldri tracket av git -- ikke fordi det er ignorert, men fordi git bare ser
filer som ligger inne i repoet, og dette ligger i hjemmekatalogen din.

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

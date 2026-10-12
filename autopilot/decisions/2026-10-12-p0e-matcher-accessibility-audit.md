# P0E tillgänglighetsgrind – val i partnerguider (2026-10-12)

## Verifierad källobservation
Läsning av `main` (spotdata-commit `c7e0322`) och senast gröna GitHub Actions visar att de nya P0D/P0E-sidfamiljerna och 11-rutters Cloudflare Pages/egen-domän CSS/JS-filidentitet redan är levererade enligt `release-context.json`. Ingen ny grön/lime-migrering behövs utan visuell evidens. Öppna PR vid granskningen: inga. Den aktiva observationen `/elavtal/kvartspris/` lämnas orörd till tidigast 18 oktober.

**Kvarstående konkret användarproblem:** I `components/GuidedPartnerMatchers.tsx` (bredband, el, försäkring och lån) och `components/MobilePartnerMatcher.tsx` syns val som `selected` enbart via CSS. Valbara knappar saknar `aria-pressed`, så tangentbords-/skärmläsaranvändare får inte konsekvent besked om vilket svar som är aktivt. `CategoryJourney.tsx` och `HomeDecisionExplorer.tsx` har redan korrekt `aria-pressed` och visar avsedd produktstandard. Detta gäller befintliga guide-matchers, inte en ny produktfunktion.

## Avgränsad plan och alternativ
- **Status quo:** inga kodrisker men bristen kvarstår.
- **Valt:** lägg `aria-pressed` på befintliga 16 valknappar i de två matcher-komponenterna, utan att ändra data, styling, rangordning, partner-URL eller SEO. Lägg Chromium-test som verifierar valt/ovalt efter tangentbord och klick på representativa guider i fem kategorier och flera bredder; kör full Build, kommersiell regression och Linux-WebKit. Kontrollera verkliga skärmbilder och tangentbordsfokus.
- **Alternativ:** bygg om till radiogrupper, men det är större ingrepp utan påvisat behov och ska inte göras nu.

## Blockerare och verifieringskrav
GitHub-kopplingens skrivkontroll blockerade försök att uppdatera `GuidedPartnerMatchers.tsx` och `AffiliateTracking.tsx` under körningen. Därför är **ingen funktionskod ändrad, ingen PR för kod skapad, ingen ny Build/WebKit för en kodändring körd och ingen ny Cloudflare-version verifierad**. Återförsök ska inte kringgå verktygets kontroll. Detta dokument registrerar felet för nästa behöriga operator.

Ingen organisk konverteringsförbättring eller godkänd affiliateintäkt är verifierad; all-network approved SEK = UNKNOWN. Fysisk iPhone = UNTESTED. Nästa genomförandegrind: säker skrivåtkomst, exakt komponentändring, testad PR, screenshotgranskning och först därefter eventuell merge. Inga kostnader, annonser, avtal eller nya widgets.

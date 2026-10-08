# Beslut: interaktivt, tryggt och enkelt – 2026-10-08

**Ägarbeslut:** Ta design- och interaktionsinspiration från Lyst, The Zebra och KAYAK och omsätt den i Sänk Kostnaden. Inspiration gäller **principer, inte varumärken, utseendekopior eller obevisade konverteringsresultat**.

## Tre principer
1. **Lyst – interaktionsglädje:** Snabb, synlig feedback när man väljer. En varm, premium och tydlig upplevelse, men undvik gimmickar, affärsmässig spelifiering och tunga animationer.
2. **The Zebra – låg friktion:** Fråga bara när svaret förändrar vägen vidare. Användarna kan nå relevanta partners utan pris-/kunskapstest. Förklara att priser och faktisk tillgänglighet kontrolleras hos jämförelsetjänster eller leverantörer.
3. **KAYAK – två nivåer:** En tydlig direktjämförelse plus frivillig fördjupning för den som vill ha underlag. Omedelbar väg till återförsäljare/marknad utan att ange många detaljfält.

## Principer som inte får försämras
- Huvudmål: **långsiktigt godkänd affiliateintäkt per relevant besökare**, begränsat av korrekthet, transparens och förtroende.
- Samma URL:er, canonical, H1-intent, guideinternlänkar, indexeringsstatus och tracking/subid/clickref. Nya bilder ska inte försämra LCP/CWV.
- Lägg inte till kostnadsuppskattningar, prissortering, besparingar eller partnerrekommendationer utan kontrollerbara data.
- 360, 390, 430, 1024 och 1440 px; tangentbord, riktiga pekytor, textkontrast, reduced motion, visuellt före/efter och verkliga länkar.
- Följ experiment med kvalificerat trafiksample; kalla inte färre klick eller förbättrad affiliateintäkt för fakta utan mätning.

## Leverans i PR #71 – **första avgränsade slice**
Startsidan: fyra höga statiska hjälpkort ersätts med ett kompakt interaktivt ämnesval, aktuell väg till jämförelse och separat länk till trefrågetest. Den som inte vet väljer Kostnadskollen. Alla fyra SEO-relevanta tester är kvar som faktiska HTML-länkar. Ny CSS-modul bygger på befintligt token-system, responsiva minsta klickytor och minskad rörelse. Kategorival och väg mäts utan personliga ekonomiska uppgifter.

**Status:** Gren/PR skapad. Tills både Build och full commercial smoke har passerat, visuella screenshots kontrollerats och PR har mergats är detta **inte live**.

## Prioriterade följande slices
1. **Kostnadskollen (/app/)** – förfina animation av rätt svar och övergången från ett svar till verkligt relevant nästa steg; bevara nyligen korrigerad sanningsenlig tidig återkoppling och säkerhetslogik.
2. **Kategorihubbarna** – konsekvent en-fråga-först, märk tydligt jämförelsetjänst kontra direktleverantör; avancerad filtrering frivillig. Partnerlogotyp endast med verifierad kvalitet/behörighet eller tydligt varumärkestextalternativ.
3. **Jämförelsekort och verktyg** – genomtänkta användarval, bättre pris-/villkorspresentation, högst ett fokus-CTA per steg och fällbara detaljer. Ingen skenbar realtidsjämförelse.
4. **P0D plattformsdesign** – samordnad typografi, navigering och kortsystem, mät kontrast och sidupplevelse från verkliga screenshots. Behåll skog/gräddvit/lime men välj konsekvent avstånd, radier och motion.

Ändra inte alla sidfamiljer samtidigt. Varje slice ska ha eget PR, QA, rollback och kontroll av SEO, partnerlänkar och riktiga användarflöden.

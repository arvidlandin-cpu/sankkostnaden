# Sänk Kostnaden – Autopilot

## Ägarbeslut 14 oktober 2026: en samlad dygnsrapport

Ägaren har godkänt skarp publicering av Kostnadskartan och beställt en enda daglig rapport med underbyggda agentuppdrag vid behov. `.github/workflows/autopilot-control.yml` är huvudjobbet **Sänk Kostnaden dygnsrapport**. Det är planerat till **09:00 Europe/Stockholm**; två UTC-slots med tidszonsgrind ger en insamling per dygn även vid vintertid. GitHub kan starta scheman försenat.

Huvudjobbet verifierar den aktuella main-release som egen domän faktiskt serverar, kontrollerar 63 etablerade sidors SEO, hämtar GA4/Search Console och respektive affiliatenätverk en gång samt granskar partnerhälsa. Aggregerad provision härleds från dessa redan hämtade rapporter. De fem fristående datarapporternas överlappande scheman har tagits bort; manuell diagnostik och separata tekniska tester/prisfeeds finns kvar.

Ägarens enda rapport publiceras i jobbets GitHub-sammanfattning och som `daily-report.md`/`daily-report.json` i artefakten `sankkostnaden-autopilot`. Legacy `decision.json` och `summary.md` behålls för kompatibilitet. Rapporten skiljer organisk trafik, inkommande Google-klick, utgående partnerklick och nätverksgodkänd provision; visar verkliga källperioder/aktualitet och markerar saknad data som UNKNOWN. Rullande 30-dagarstal är inte gårdagens förändring. Full provision är UNKNOWN när ett aktivt nätverk saknar verifierad rapport.

**GitHub-jobbet kör automatiska kontroller och en regelstyrd rapport, inte självstartande AI-agenter.** Den gamla ChatGPT-uppgiften omkring kl. 09 kan inte läsas, ändras eller stängas av med verktygen i denna session. För faktisk schemalagd AI-uppföljning ska en enda sådan operatör använda [det färdiga dagliga operatörsbriefet](autopilot/DAILY_OPERATING_BRIEF_2026-10-14.md), läsa huvudrapporten och därefter delegera endast motiverade uppdrag. Den gamla chattuppgiften är inte bevisat ersatt förrän dess schema/instruktion faktiskt har uppdaterats i tjänsten som äger den.

Senare ägarbeslut om Kostnadskartan och marinblå/varmvit/blå identitet gäller framför historiska fotografiska designstatusar nedan. Se `autopilot/decisions/2026-10-14-cost-map-implementation.md` och `autopilot/decisions/2026-10-14-seo-continuity.md`. Produktens visuella godkännande, verifierad egen domän och faktisk trafik/intäkt är skilda bevis.

## Historiskt designbeslut 2026-10-10
Detta är tidigare problem- och beslutshistorik. Aktuell riktning och leveransstatus ovan samt `OWNER_VISUAL_DIRECTION_2026-10-14.md` gäller före äldre prioriteringar. Läs `autopilot/UNIFIED_PRODUCT_DESIGN_2026-10-10.md`. Ägaren rapporterade att nuvarande blå huvudsidor och gröna undersidor/verktyg känns som en sönderhackad, ofärdig produkt långt från det godkända premiumkonceptet. Detta är ett **verifierat, ännu öppet P0D-kvalitetsproblem**. Kör inte fler fristående mikro-UX-widgetar i stället för helhetlig sammanhängande design; en förberedd BRF-meddelandefunktion på `growth/brf-insurance-board-template-20261010` är PAUSAD och inte publicerad. Godkänd identitet: varmvit, marinblå rubriker, klarblå primär handling, sparsamma pasteller; inte gamla skogsgrön/lime. Dela upp designfamiljer i reversibla PR med faktiskt granskade skärmbilder 360/390/430/1024/1440, Build, full Chromium+WebKit, kontrast, SEO och korrekt affiliate. Rapportera aldrig att sajten är sammanhållen enbart för att några PR är mergade. Tillväxtintäktsmålet är oförändrat och gratisanskaffning fortsätter parallellt.


## North star

Autopiloten optimerar för **långsiktigt godkänd affiliateintäkt per relevant besökare**. Trafik, ranking, CTR och affiliate-klick är delmål, inte slutmål.

## Aktuellt läge 2026-10-09

**Ägarinstruktion för slutproduktens kvalitet:** läs `autopilot/PRODUCT_FINISHING_STANDARD_2026-10-09.md` och följ kvalitetsgrindarna för syfte, svenska, partnerresa, verifierade tal, mobil visuell QA, SEO och faktisk intäkt vid varje kommande förbättring. Sluta inte vid en snygg men ofärdig första iteration.

Varje operativ AI-genomgång ska läsa `autopilot/release-context.json`, aktuell `main`, `autopilot/MASTERPLAN_EXECUTION_2026-10-08.md`, senaste rapporter och öppna PR. GitHubs schemalagda kontroll är en **regelstyrd datakontroll**, inte en AI som automatiskt läser varje chatt, programmerar eller verifierar Cloudflare. Nya releaser ska föras in i release-registret och i masterplanens journal, med tydlig skillnad mellan *merged*, *CI-godkänd*, *verifierad publicering* och *affärseffekt*. Befintlig produkt- och konverteringsplan får inte nollställas av ett nytt designförslag.

## Två lager

1. **GitHub Actions = sensorer + skyddsräcken.** Den hämtar GA4, Search Console, Adtraction, Addrevenue och partnerhälsa, reducerar allt till ett maskinläsbart beslutspaket och stoppar aggressiva ändringar när signalen är för svag.
2. **Schemalagd AI-operatör = operativ projektledare när en sådan uppgift faktiskt är aktiverad.** Den läser senaste beslutspaketet, kontrollerar aktuell kod och pågående experiment och får genomföra tillåtna lågriskåtgärder utan att fråga ägaren mellan varje steg. GitHub-schemat startar inte denna operatör.

Ingen extern AI-API-nyckel behövs i GitHub och ingen ny betald SaaS krävs.

## Autonomt tillåtet

- reparera mätning, attribution och tydliga tekniska fel;
- genomföra ett avgränsat snippet-test när Search Console-signalen passerar tröskeln;
- genomföra ett avgränsat CRO-test när organisk funnel-data har tillräckligt stickprov;
- testa, QA:a, skapa PR och slå ihop reversibla lågriskändringar när kontrollerna passerar;
- utvärdera pågående experiment när minsta observationstid har gått och behålla, justera eller återställa utifrån data.

## Ska eskaleras till ägaren

Nya betaltjänster, betald annonsering, nya partneravtal, större borttagning av kategorier/erbjudanden, juridik/compliance och breda SEO-ombyggnader.

## Guardrails

- Högst två oberoende, avgränsade tillväxtinitiativ samtidigt enligt `autopilot/policy.json`, aldrig samma kategori, flöde eller sökfråga.
- Ett aktivt experiment får inte störas av nya SEO/CRO-tester innan utvärderingsgrinden.
- Teknisk mätning och attribution får repareras även när ett experiment pågår.
- Låg trafik betyder **vänta**, inte fylla sajten med fler ändringar.
- Ingen rå persondata, order-ID, klick-ID eller privata API-uppgifter får lagras i artefakterna.
- Om källdata saknas eller blir gammal ska autopiloten markera läget som degraderat/blockerat i stället för att gissa.

## Daglig rytm

GitHub samlar källorna och publicerar en rapport enligt schemat 09:00 Europe/Stockholm ovan. En separat aktiverad AI-operatör läser därefter den färdiga rapporten och skickar en enda daglig sammanfattning enligt ägarens senaste instruktion. Motiverade tillåtna åtgärder följer evidensen; om underlag saknas anges det öppet. Kritiska verifierade fel larmas separat. Denna session har inte aktiverat eller ersatt någon ChatGPT-uppgift.

## Tillstånd

`autopilot/state.json` är den lilla permanenta journalen för pågående experiment och senaste autonoma åtgärd. När ChatGPT genomför ett nytt experiment ska filen uppdateras i samma ändring så att nästa körning känner till spärren.

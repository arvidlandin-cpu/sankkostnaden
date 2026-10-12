# BINDANDE ÄGARBESLUT 2026-10-12 — P0F RADIKAL PREMIUMSKALA

## Prioritet och ursprung
Detta beslut är SENARE än P0D (10 okt) och P0E (11 okt), och styr nästa visuella genomförande. Ägaren visade aktuella skärmdumpar 12 oktober av startsida och kategori-/partnersidorna för bredband, försäkring och ekonomi. Bedömningen: den blå paletten och interaktionerna har förbättrats, men sajten är fortfarande för liten, för försiktig, för smal och för uppbyggd av likvärdiga småkort. **Ägaren vill uttryckligen ta riktningen längre, inte göra fler marginella finjusteringar.**

**Ingen AI får tolka tidigare tekniskt genomförd P0D/P0E eller grönt CI som att det visuella slutmålet godkänts.** Första luftigare premiumkonceptet från 8–9 oktober är riktning, inte ett facit med påhittade erbjudanden. Målbilden är en verklig, användbar och trovärdig beslutsprodukt med redaktionell känsla och tydlig väg till verifierade partners.

## Konkreta P0F-gränssnittsbeslut
1. **Startsida:** markant större hero och typografi; en verkligt framträdande användbar vägvals-panel; kategori-korten om från fem små jämnstarka radkort till en redaktionell komposition med två större och tre tydliga kort. Behåll alla fem SEO-länkar och mobilens snabba val.
2. **Kategorisidor:** bredare desktopcanvas och väsentligt större rubriker, bättre behandlat fotografi, starkare huvudhandling, ett gemensamt stort snabbvalsblock. Inga nya dubbla wizardsteg.
3. **Resultat/partners:** större verkliga partner- och resultatkort med tydlig hierarki; skilj jämförelsetjänst från direkt leverantör; märk sponsring; behåll befintlig sortering, urval, klickref/subID/EPI och alla partnerlänkar.
4. **Rytm:** växla mellan luftig varmvit/ljusblå, stora fotografiska valkort och marinblå resultatpaneler; variation med mening, inte ett fält av tunna likvärdiga boxar.
5. **Mobil:** stora tappytor utan horisontellt scrollspill, men inte desktoputtryck nedskalat till oläslighet. QA 360/390/430/1024/1440px med riktiga skärmbilder. Fysisk iPhone fortsätter UNTESTED tills det kan styrkas.

**Visuell evidens:** skärmdumpar från ägaren har mycket breda tomma marginaler och komprimerade mittkolumner. Webbläsarens zoomnivå kan också påverka proportionerna, därför ska nytt QA göras i **100 % browser zoom** och vid dokumenterade faktiska viewportbredder; dra inte säkra grundorsaksslutsatser ur enbart en zoomad skärmdump.

## Implementering startad 12 oktober
- Gren: `design/p0f-bold-premium-desktop-20261012`
- Kodområden: `HomeHero.module.css`, `HomeDecisionExplorer.module.css`, `Home.module.css`, `CategoryPremium.module.css`, `CategoryJourney.module.css`, `ElectricityMarketGateway.module.css`.
- Är detta en isolerad widget? **Nej.** Sex befintliga layoutfiler i en sammanhängande produktresa, inga nya formulär, leverantörsuppgifter eller externa tjänster.
- **Status vid dokumentets tillkomst: kod på gren, ej visuellt eller produktionsgodkänd.** Build, kommersiell regression, screenshots och Pages/live asset verification måste genomföras innan `shipped`.
- Operatörsregel: **ingen parallell CSS-ombyggnad av samma filer medan denna PR är öppen**. Om QA misslyckas, rätta på samma PR. Ingen massredesign i `global.css`.

## Icke förhandlingsbart affärs-/säkerhetskontrakt
Behåll SEO URL, canonical, H1-intent, rubrikfakta, befintliga internlänkar, partner-url, sponsrad rel och klicksubID/EPI, skydd av besökardata, WCAG-fokus och reduced motion. Kvartsprisguidens scoped observation fortsätter enligt state till tidigast 18 oktober; försäkringssnipptestet från 7 oktober är annullerat. Inga nya annonser, kostnader, avtal, Google Drive eller massutskick. Högst två **oberoende tillväxtinitiativ** — denna visuella kvalitetssäkring påstås inte ha skapat organisk konverteringsvinst.

## Exakt releasegrind
1. PR är skapad mot senast kontrollerad main; diff kontrollerad, inga kodkonflikter.
2. GitHub Build, check, export och kommersiell Chromium/WebKit-regression godkända.
3. Faktiska desktop 1440/1920 och mobil 360/390/430 skärmbilder granskas kritiskt: typografi, rubrikradbrytning, topbar, långt partnernamn, mobil dock, resultat, footer, externa affiliatelänkar.
4. PR merge separat från lyckad Cloudflare Pages deploy, och denna separat från faktiskt serverade produktfiler på domänen. Verifiera egen-domänens klientfiler innan något kallas live.
5. Slutligt visuellt ägargodkännande **ej automatiskt** från CI. Organiskt beteende/approved affiliate provision separat; om oläst nätverksdata: **UNKNOWN**, aldrig 0 kr.


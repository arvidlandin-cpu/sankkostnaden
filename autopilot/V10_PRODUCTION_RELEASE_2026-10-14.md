# V10 production release candidate — 2026-10-14

## Riktning
Ägarens krav är ett sammanhållet kommersiellt, lekfullt, intuitivt gränssnitt där 1–2 klick räcker till relevant partner. V10 implementerar samma interaktiva partner- och beslutssystem på startsida och alla fem kategori-hubbar; befintliga guider och verktyg med långsvansad SEO bibehålls.

- Inspirationsprinciper: Lyst (glädje och grafisk belöning), KAYAK (snabbfilter och synliga alternativ), The Zebra (friktionsfri vägledning utan tvingande profil).
- P0 kärna: väljer område → aktiva partners visas omedelbart → frivilliga snabbfilter visar relevant undergrupp → extern partner med synlig annonsmärkning.
- Varje länk använder befintliga `getActivePartners`, `trackingUrl`, `data-partner` och sponsor-rel. AffiliateTracking förblir intakt. Ingen jämförelse hävdar realtidspriser eller garanterade besparingar.
- På mobil visas en bottom CTA endast när ett aktivt val finns, och gammal `MobileQuickBar` tas bort på startsidan för att undvika överlagrad navigation.
- Förstasidans tidigare generiska HomeHero ersätts; befintlig editorial/foto-/guidekatalog ligger kvar som fördjupning. På huvudhubbarnas ersätts de fragmenterade vägarna CategoryJourney + CategorySpotlight av en gemensam V10-lane; gamla ankare mot full marknads-/partners-sektion finns fortfarande som id för äldre länkar, medan hero-CTAs leder till snabbvägen.
- Övriga 60+ SEO-sidor, titel, canonicals, partnerprogram och Cloudflare Pages kvar, utan migrationskrav eller ny kostnad.

## Leveransstandard
Publicera ENDAST när grundläggande bygg, site/integrity/export, V10 riktiga Chromium-resor, extern annonsspårning, visuella mobilbilder och publika routes har granskats. Befintliga V5-låsta pixel- och texttester kan behöva anpassas till V10-kontrakt; markera sanningsenligt vilka som är legacy och vilka regressioner som är verkliga.

## Osäkerheter
Ingen konstruktion kan ärligt lova absolut felfrihet eller garanterat gillande/affiliateintäkt. PostHog är anslutet men har ännu inga ingesterade händelser (ej bevis på live-konvertering). Fullständig användarvalidering kräver riktiga personer och trafik. Inga nya prenumerationer.

# Sänk Kostnaden — komplett Codex-överlämning 2026-10-14

Den här filen för vidare **kodbas, strategi, affär, drift, designbeslut och nästa uppdrag** till en fristående Codex-session. Den överför inte automatiskt ChatGPT-chattens historik eller bilagor; det nödvändiga beslutsunderlaget finns i repo-dokumenten.

## Repository och sann driftstatus
- **GitHub:** https://github.com/arvidlandin-cpu/sankkostnaden
- **Skarp webb:** https://sankkostnaden.se/
- **Plattform:** Next.js 15 / React 19 / TypeScript / statisk export, GitHub Actions, **Cloudflare Pages**. Behåll allt detta. Ingen Google Drive, flytt till AppDeploy eller betalservice.
- **Main-snapshot vid överlämning:** d89738fef31fd828886eaf62288a10f926846895 (2026-10-14, efter kvartsspottimprisuppdatering). **Hämta alltid ny HEAD före arbete**.
- **PR #167/#168** gav V10-start och återställd elkvartsprisgraf. **PR #169** (gemensam ny beslutsresa, SHA 495c046) och **PR #170** (fyra synliga bokstavliga '\\n'-radbrytningsfel, SHA e8e9326) är mergade och Pages-checkar har varit framgångsrika. Detta bevisar INTE slutgodkänd verklig visuell kvalitet, exakt senast serverad custom-domain SHA, fysisk iPhone eller konverteringsförbättring.
- **Öppen prototyp:** PR #166, prototype/v6-one-decision-journey-20261013, är draft vid handoff. Dubbelimplementera/merga inte utan att kontrollera vad den innehåller. Kontrollera fler nya PRs från 08:00 operatör och 09:00 datapilot.
- **autopilot/release-context.json** är daterad 13 okt och innehåller äldre SHA. Historik, inte automatiskt sann live-status. Synka endast med verifierad GH/Pages/egen-domän.
- Cloudflare **Workers Builds** har haft oberoende fel; skilj strikt från Pages. Inga nya licenser/prenumerationer.

## Mission och kundnytta
Bygg Sveriges mest användbara fria no-login följeslagare för hushållets löpande kostnader. Målgrupp: vanliga besökare som tror att de betalar för mycket men inte kan sina avtal. Kategorier: bredband, elavtal, mobil, försäkring (hem/djur/resa), ekonomi (lån/total kostnad), hushållsverktyg och faktaguider. Låg tröskel, lekfullhet och förtroende. Enkel väg med 0–2 nyttiga val, avancerad väg med frivillig exakt kostnadskalkyl baserad på besökarens egna uppgifter. Transparent relevant partnerhjälp i 0–2 klick; aldrig tillverka priser, personliga offerter, automatiska besparingar, recensioner eller topp-rankningar.

**North star:** långsiktigt **nätverksgodkänd affiliateprovision per relevant besökare** (inte Google-visningar eller ofiltrerade klick). Separera organiska riktiga sessioner, sponsrade utgående spårade klick och bekräftad provision; om ett nätverks godkända status saknas är TOTAL = UNKNOWN. Bevara giltiga partners, trackingUrl, EPI/subID, sponsorrel, annonsmärkning, prisgrund och sekretess.

## SENASTE bindande ägarfeedback och nästa uppdrag
Ägaren bedömer fortfarande sajten som ofullständig efter dagar av V10-mikrojusteringar. **Premiumblå huvudvyer blandas med äldre gröna/lime ytor**, bilder känns som generiskt stockmaterial, människor finns på nästan alla bilder utan tydligt syfte, för många text- och komponentblock är överflödiga. Ägaren kräver systemmässigt och redaktionellt genomarbetad helhet. Bevara avtalad **marinblå + varmvit/sand + klarblå** premiumidentitet; inför inget godtyckligt nytt färgtema. Grönt bara för meningsfull status. Färre mänskliga poser. Varje bild, CTA och rad måste kunna motiveras. **Genomför och granska i detalj före publicering**, hellre större sammanhängande refaktor än små patchar som inte förändrar användarresan.

**Läs:** autopilot/OWNER_VISUAL_DIRECTION_2026-10-14.md. Den är senare än äldre designförslag (P0D/P0E/P0G/V10). Benchmarka Lyst (lekfull upptäckt), The Zebra (enkel uppgiftsväg), KAYAK (jämförelsedjup) men hävda inte deras kommersiella framgång utan data eller att vi har deras live-prisfeeds.

**Arbetsordning:** read-only audit av verkligt renderade mobilsidor → färg-/token- och bildinventering per sidfamilj → bygg gemensam identitet och bild-/textbeslut → sammanhängande implementering → full journey-QA (riktiga beräkningar och partnerhandoff) → bygg, kommersiell regression, verkliga screenshots → merge, Pages, verifiering egen domän → kort exakt leveransrapport. Ingen isolerad ny widget/feature som substitut för att göra detta ordentligt.

## Viktig kod- och sidkarta
- Startsida / V10: pages/index.tsx, components/V10Experience.tsx, styles/V10Experience.module.css, styles/Home.module.css.
- Kategorier: pages/bredband.tsx, elavtal.tsx, mobil.tsx, forsakring.tsx, pages/ekonomi/index.tsx; styles/CategoryPremium.module.css, components/CategoryHeroPhoto.tsx.
- Guider: components/IntentGuide.tsx, EditorialGuideHero.tsx, GuideReadingFlow.tsx, DecisionGateway.tsx; styles/EditorialGuide.module.css.
- Spotlight: components/CategorySpotlight.tsx, styles/CategorySpotlight.module.css.
- Beräkning: pages/verktyg/*, components/experiments/FirstYearCostCalculator.tsx, ElectricityCostCalculator, FamilyMobileCost, CondoInsuranceCheck, QuotedLoanTotals m.fl. **Behåll korrekt kalkyllogik och befintlig resultathantering**.
- Grundfärger: styles/design-tokens.css, global.css och gamla *.module.css (många gamla gröna regler; verifiera computed style innan sanering).
- Partner och mätning: lib/partners.ts, lib/clientAttribution.ts, övrig affiliatefunktionalitet. Ändra ej godtyckligt.
- Media: Pexels URL/HTML-img/srcSet i page-/hero-komponenter. Bildrevision inkluderar licens, verklig visuell effekt, mobilcrop och prestanda.

## Besluts- och skyddsdokument (prioriterad läsning)
- **Senast:** autopilot/OWNER_VISUAL_DIRECTION_2026-10-14.md och AGENTS.md.
- **Affär och execution:** autopilot/PRODUCT_EXCELLENCE.md, MASTERPLAN_EXECUTION_2026-10-08.md, PRODUCT_FINISHING_STANDARD_2026-10-09.md, UNIFIED_PRODUCT_DESIGN_2026-10-10.md, VISUAL_UX_ROADMAP_2026-10-09.md. Äldre “inte färdigt” är tidsmarkerade historiska statusar.
- **13-fälts beslut:** autopilot/STRATEGY_AND_EVIDENCE_STANDARD.md; autopilot/PLAYBOOK.md, policy.json (max 2 oberoende growthexperiment, max 6 filer/automatiskt scope, SEO cooldown) och state.json. För varje relevant release: user job, daterad konkurrentobservation, egen evidens, alternativ, hypotes, påståendens källor, UI-hierarki, affiliatekedja, attribution, reversering, QA/merge/deploy.
- **Marknad och bevis:** autopilot/COMPETITOR_INTELLIGENCE.md, faktiska aktuella GA4/GSC/networkrapporter och relevant publik förstahandskälla. Utgå inte från oförändrade 8-oktoberobservationer som live-data.
- **Drift:** autopilot/release-context.json (stale), GitHub merge/checks/actions/artifacts, Pages deploy och verklig custom-domain asset-identitet.
- **Bildhistorik:** autopilot/ASSET_BRAND_EXPERIENCE_P0G_2026-10-12.md.

## Aktiva experiment / growth
- state.json har **kvartspris-one-click-utility-20261010** på **/elavtal/kvartspris/**, tidigaste review **18 oktober 2026 11:00 lokal**. Ändra inte kohort/DOM/events eller orsaka analyspåverkan i otillåtna experiment. Ett av max två oberoende initiativ används.
- Försäkringens snippetförsök 7 oktober **avbröts**; inget 15 oktober-lås.
- Fortsätt opportunistiskt med relevanta **helt gratis** distributionsmöjligheter utan spam/massmail/köpt trafik. Inga ogrundade vinnare/organiska trafikrekord från QA.
- Både designoperatör och 08/09-dataflöden kan jobba parallellt; undvik att duplicera deras källfiler och experimentscope.

## Bevis- och releasegrind
- `npm install` → `npm run check` → `npm run check:integrity` → `npm run build` → `npm run check:export`.
- Playwright relevanta tester inkl tests/v10-unified-journey.spec.ts, tests/production-commercial-smoke.spec.ts, tests/mobile-webkit-core.spec.ts samt workflow .github/workflows/commercial-regression-smoke.yml. Egen QA med ?qa=1, inga verkliga annonsklick.
- Granska faktiska 360/390/430/1024/1440/1920-screenshots av **hela mobila användarresan**: första fold, kategori, guide, verktyg, resultat, annonserad partner, tillbaka. Bildkvalitet/crop/LCP, kontrast, 44px touch, WCAG, riktiga beräkningar och semantiska texter. Linux WebKit är inte fysisk iPhone.
- Check-pass + merge ≠ slutligt visuellt ägargodkännande. QA + välgrundad visuell granskning först; kontrollera sedan Pages deploy och separat vad den egna domänen faktiskt serverar. Approved commission UNKNOWN tills bekräftad komplett data.

## Startuppdrag för Codex
Open repo arvidlandin-cpu/sankkostnaden on the latest main. Read AGENTS.md, autopilot/CODEX_HANDOFF_2026-10-14.md and autopilot/OWNER_VISUAL_DIRECTION_2026-10-14.md. Take ownership of the complete sitewide premium design, content and imagery coherence problem; audit actual rendered mobile journeys and all categories/guides/calculators/results/partner exits, not just isolated cards. Keep approved navy/warm white/blue palette, remove unjustified green page backgrounds, curate or remove generic human stock images, and justify every image/text/CTA. Implement one cohesive product experience in policy-compliant slices with 13-field evidence where material. Preserve real affiliate tracking, SEO, pricing, privacy and the kvartspris experiment. Run actual browser+WebKit+commercial QA and visually inspect before/after screenshots, then publish safely on existing GitHub + Cloudflare Pages only after passing QA and verify custom domain. Report only significant releases, proof and blockers; no new paid services or repetitive small-PR loop.

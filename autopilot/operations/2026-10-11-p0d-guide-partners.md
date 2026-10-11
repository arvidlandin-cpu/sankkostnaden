# P0D designjournal – guide → partnerkort, 2026-10-11

**Ägarbeslut:** `autopilot/UNIFIED_PRODUCT_DESIGN_2026-10-10.md` gäller. Status: **UNDER QA – INTE HELT KLART**.

## Scope
Sammanhängande premiumyta i fem existerande guidefamiljer (El, Bredband, Mobil, Försäkring, Ekonomi): rubriker, ljusblå panel, marinblå text, klarblå affiliate-CTA, sponsormärkning minst 12px och reduced-motion. Leverantörernas egna färger i varumärkesmarkeringar är inte en alternativ sajtpalett.

## Verifiering före merge
- Baslinje: GitHub PR #117, `commercial-regression-smoke` artifact från 2026-10-10 (16 routes, 390/1440 och prioriterade 360/430/1024).
- Efter: nytt `sitewide-design-contract` med 25 skärmbilder, 360/390/430/1024/1440 för en guide per kategori, plus sponsorlänk, fokus och reduced-motion.
- Kör Build, check/integrity/export, full Chromium + WebKit. Bedöm faktiska bilder före merge; endast grönt och konfliktfritt PR får sammanfogas.

## Begränsningar och nästa steg
Inga nya widgets, priser, partnerlänkar, provisioner eller SEO-URL:er. Befintlig `global.css` innehåller fortfarande gammal grön designskuld och måste migreras stegvis efter visuell QA. Kvartsprisexperimentet lämnas oförändrat. Cloudflare exakt deploy-SHA och verklig godkänd affiliateintäkt är **UNKNOWN** tills separat verifierade.

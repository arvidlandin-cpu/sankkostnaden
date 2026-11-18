# Sänk Kostnaden 6.0 — första fungerande prototyp (avskild från produktion)

Datum: 2026-10-13. Issue: #165. Ägarens tydliga feedback: befintlig användarresa och interaktivitet är otillräcklig. Detta är en **hypotes att testas**, inte en bestämd designriktning.

## Val av verktyg och arkitektur
- GitHub kvar som enda kod- och versionskälla och Cloudflare Pages kvar som bygg-/hostingplattform.
- Använd redan ansluten GitHub-koppling och gratis Playwright/Actions först. MagicPath är upptäckt och föreslaget i ChatGPT, men ännu **inte installerat** och kräver användarens egna anslutning; ingen trials/betalmetod.
- Isolerad Next.js-rutt /experiments/beslutsresa-v6/, `noindex,nofollow`, ingen länk från startsidan och inga nya betal- eller spårningstjänster. PR hålls som utkast och **får inte mergas till main enbart för att testerna är gröna**.

## Koncept: två klick till ett relevant nästa steg
1. Besökaren väljer ett mänskligt mål: osäker på pris, vill jämföra, vill hitta startpunkt.
2. Besökaren väljer en av fyra kostnadskategorier.
3. Ett verkligt, begripligt nästa steg visas omedelbart, med förklaring och en enda primär handling mot **befintlig intern guide/jämförelseväg**.
4. Endast frivillig extra fråga för mer precision. Svar påverkar rekommendationen på riktigt. Användaren kan backa och börja om.
5. Inga okända priser, falska besparingar, rankinganspråk eller direkta kommersiella länkar i själva experimentprototypen.

## Förhållande till externa data och SEO
- Prototypevent spåras inte. Inga nya GA4-data manipuleras eller eventuella skärmbilder behandlas som faktiska användartester.
- Existerande canonical, metadata, partner-URL/attribution, kategori- och guidelandningssidor samt SEO-kohorten /elavtal/kvartspris/ lämnas orörda.
- Detta prototypeexperiment har inget statistiskt säkerställt bättre affärsutfall. Sådan evidens kräver verkliga användare och konsekvent instrumentering.

## Kontroll
- Source/integrity/export, Chromium 390/1440 första skärm och fullskärmsresor, 12 variationskombinationer, noindex och inga externa partnerklick.
- Separat UX-arbete utvärderar mobilens första handling, uppgiftsframgång, valtydlighet, faktisk friktion och hur relevant jämförelse/partner nås efter klick.
- Ingen ändring av Cloudflare domän eller hosting. PR-granskning före någon produktionsexponering.

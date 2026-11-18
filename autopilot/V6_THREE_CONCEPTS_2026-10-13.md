# Sänk Kostnaden V6 — tre skilda, klickbara prototyper (2026-10-13)

Föräldraärende #165; experiment-PR #166; branch `prototype/v6-one-decision-journey-20261013`.

**Teknik:** befintlig Next.js 15 + React 19-kod i GitHub; samma Cloudflare Pages som tidigare. Inget nytt betalt verktyg, ingen ny datakälla. MagicPath finns installerat i ChatGPT, men saknar exponerade användbara anropsverktyg i den aktuella chattsessionen; förväxla inte installerat plugin med att design faktiskt skapats där. Prototyperna är implementerade med GitHub-kopplingen.

| Riktning | Testadress (PR-preview när byggt) | Primär väg |
| --- | --- | --- |
| A: En fråga i taget | `/experiments/beslutsresa-v6/` | mål → kategori → förklarat internt nästa steg; frivillig precision |
| B: Visuell kostnadskarta | `/experiments/kostnadskarta-v6/` | välj utgift → egen kostnad → levande månads-/årskarta → relevant kategori |
| C: Direktjämförelse | `/experiments/snabbjamfor-v6/` | välj kategori → verkliga aktiva partneralternativ → valfritt behovsfilter |
| Samlad förhandsvisning | `/experiments/v6-koncept/` | jämför alla koncept sida vid sida |

## Produkthypoteser
- **A** sänker beslutsångest hos lågkunskapsbesökare, men kan kännas som en guide som tar flera klick.
- **B** förmedlar kontroll och blir roligare att utforska, men kräver mer egen inmatning och **kan inte säga vad någon faktiskt kan spara**. Siffrorna kommer enbart från användaren och lagras inte.
- **C** visar faktisk nästa handling snabbast för köp-/bytesklara besökare, men kan kännas alltför kommersiell eller kräva ytterligare kontext. Partnerurval hämtas enbart från `lib/partners.ts` med active status och giltig trackingUrl; inga fabricerade rabatter.

## Isolering / QA
- Samtliga testvägar noindex,nofollow,noarchive. Ingen navigationslänk från publik startsida.
- Preview har fungerande verkliga länkar till befintliga egna innehållsvägar. Endast C har direkta affiliate-utgångar, märkta `rel=sponsored nofollow noopener`, med etablerade `data-partner`-attribut för befintlig attribution.
- Behåll rådande GitHub/Cloudflare Pages-flöde, inga domänändringar, inga experimenttjänster och ingen kostnad.
- Playwright: 390px och 1440px i Chromium + regression. Efter skärmbildsgranskning: kontrollera att ingen mobil bottom-bar skymmer interaktioner och att faktiska CTA/länkar fungerar.
- OBS: Teknisk QA räcker inte för en produktvinnare. Gör uppgiftsbaserade användartester, särskilt för ovana mobilanvändare. Mät tid till användbart svar, felvägar, avbrutna steg, förståelse/tillit, val av nästa steg och meningsfull partnertrafik. Trafiken är för låg för statistiska A/B-påståenden.

**Dra inte slutsatsen att A, B eller C är bäst förrän användaren faktiskt fått prova dem och riktiga användarobservationer finns. Ingen merge till main enbart på gröna automatiska tester.**

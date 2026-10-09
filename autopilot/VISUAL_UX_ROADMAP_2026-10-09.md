# Sänk Kostnaden 2.0 – visuell design och genomförandeplan
**Datum:** 2026-10-09 · **Status:** beslutad designriktning, inte implementerad som helhet.
**Prioritet:** P0D-designspåret i `autopilot/MASTERPLAN_EXECUTION_2026-10-08.md`; ersätter tidigare hypotetiskt förslag att nödvändigtvis behålla skogsgrön/lime som huvudsaklig visuell identitet.
**Källor:** användarens bildfeedback 8–9 okt 2026, `autopilot/DESIGN_SYSTEM_AUDIT_2026-10-08.md`, `autopilot/decisions/2026-10-08-lyst-zebra-kayak-ux.md` och nuvarande kod i `pages/index.tsx`, `components/HomeHero.tsx`, `pages/elavtal.tsx`, `components/ElectricityMarketGateway.tsx`.

## Beslutad produktupplevelse
Inspireras av **första, mer premium bildförslaget** och den senaste 6-panels-skissen, inte den mycket avskalade rena mobil-wizardvarianten. Visa mindre åt gången än i första designen. Skandinaviskt, välkomnande, modernt, lätt och trovärdigt.
- Visuell målbild: ljus/varmvit bas, mörkblå rubriker, en primär klarblå knapp, återhållna pastellkort, mjuk radius och luft. Sätt exakta tokens efter kontrast-/screenshottest, inte från bildgenerering. En relevant hero-/miljöbild med verifierad användningsrätt; inte foton på varje komponent.
- Startsida: en tydlig huvudidé, en primär CTA, 4 lättlästa kostnadsområden och åtkomst till ekonomi som femte område. Ingen samtidig dubbelexponering av kategorival och samma val i guiderna. Det som redan finns under andra folden förblir tillgängligt, men kan komprimeras. Prioritera första 390px-skärmen.
- Flöden: en meningsfull fråga åt gången med större klickytor (minst 44px), progresstillstånd där det faktiskt finns ett längre flöde, tydlig tillbaka-/hoppa över-funktion, frivillig avancerad väg. Max 1 dominerande CTA per vy. Enkelhet först, inte fler frågor för dramaturgins skull.
- **El som första fullständiga kategori-pilot.** Fråga först efter *avsikt* – `Jämför aktuella elavtal` eller `Jag har redan två erbjudanden`; om man behöver hjälp med avtalsform visas frivillig väg. Ingen obligatorisk bostadstyp-/kWh-fråga när svaren inte påverkar faktiskt tillgängliga erbjudanden; kWh/boende får användas i separat märkt rådgivning/egen årskostnadskalkyl.
- Resultat: skilj tydligt på jämförelsetjänsten Elskling och enskilda elbolag inklusive Tibber. Snabb rekommenderad *väg vidare*, inte prisrankning eller personligt billigaste avtal. Visa upp till tre lättlästa *vägar* i första vyn och tillgång till hela aktiva partnerlistan längre ned/expanderbart. Aldrig påhittade priser, energiförbrukning, betyg, besparingar, belöningsetiketter eller påstådda verifierade användarsiffror. Partnerlogotyper bara med kvalitet/rättigheter; annars textfallback. Allt sponsrat märks.
- Jämförbar källa krävs för riktiga prislistor. En statisk affiliatekatalog med länkar räcker inte som underlag för 892 kr/mån eller `bäst val` i visualiseringarna.
- Enhetliga navigations-, kort-, CTA-, disclosure- och typografikomponenter i gemensamma designtokens. Inte en engångsomskrivning av 66kB `global.css`.

## Leveransordning och kriterier
| Etapp | Bedömd arbetsinsats | Scope | Klar när |
| --- | --- | --- | --- |
| 0: baslinje och designgrund | 1–2 effektiva dagar | riktiga screenshots 360/390/430/1024/1440; välj typografi, färger och komponenter; skissa start/el i desktop och mobil | före/efter är visuellt granskat och färger klarar kontrastkraven |
| 1: hem + /app/ | 2–4 dagar | bygg ett gemensamt toppfält, hero och kategorival; anpassa existerande Kostnadskollen utan att förstöra dess redan korrekta tidiga svar | första skärm tydlig på mobil, ingen dubblerad kategori-guide, fungerande partner-/guidevägar |
| 2: /elavtal/ | 3–5 dagar | intention → jämförelsetjänst/direktleverantör eller exakt årskostnadsverktyg; renare partnerkort och tillgänglig full partnerlista | riktig Adtraction EPI/EPI2-klickspårning och alla aktiva länkar, inga falska livepriser, fungerande tillbaka/vet ej |
| 3: resterande områden | 5–8 dagar | bredband adressberoende, mobil surf/familj, försäkring boende/djur, ekonomi säkert och neutralt; sedan guider/kalkylatorer | gemensam visuell identitet och relevanta kategoriunika flöden, inga förlorade SEO-sidor |
| 4: kontinuerligt | parallellt | mät kvalificerat beteende, UX-fel och godkänd partnerintäkt | data rapporteras utan att test/ägarklick räknas som kunder |

**Samlad grov uppskattning: 11–19 effektiva arbetsdagar (~2–4 veckor beroende på QA/feedback).** Detta är inte ett löfte om datum eller bakgrundsleverans. Första användbara designversionen ska kunna levereras separat före helheten.

## Implementeringsregler och stoppskydd
- GitHub + Cloudflare Pages i nuvarande Next.js static export-arkitektur. Ingen ny betaltjänst, AI-API eller prisdataleverantör krävs för den visuella ombyggnaden.
- Eget avgränsat PR per sida/sidfamilj; review med verkliga renderingar innan merge. Kontrollera koden och aktuella öppna PR, undvik konflikt/överlappning med tillväxtexperiment. Följ nuvarande `autopilot/state.json` och dokumentera varje PR med status.
- Bevara URL-struktur, befintlig kanonisering, indexerade texters ämnesintention, guideinternlänkar, H1/metadata, affiliate-deeplinks, sponsorrel, sub-ID-klickref, integritet och faktiska partnerrelationer.
- För varje PR: Next build, check/integrity/export, Playwright-funktion på 360/390/430/1024/1440, skärmbild före/efter, inga horisontella överflöden, WCAG-fokus/kontrast/reduced motion, motsvarande full kommersiell regression och verifierad Cloudflare-deploy. Separat återställbar rollback.
- Prestandabudget: undvik stor hero-bild som försämrar mobil LCP; mät Core Web Vitals/Lighthouse mot före efter. Ingen stor CSS-rensning på alla sidor samtidigt.
- Intäktsmätning: relevant organisk session → första användbara resultat → partnerexponering → *kvalificerat* utgående klick med spårning → godkänd affär/ersättning. Kontrollera QA-trafik och GA4/GSC-data separat. Med låg trafik ska ingen konverteringsvinnare hittas på falsk statistisk säkerhet.
- Trafik/SEO-spåret fortsätter parallellt: nytt utseende skapar inte i sig organisk trafik.

## Nästa operationella steg
Starta etapp 0 utifrån produktionssajten och kod, skapa ett *verkligt koddrivet* före/efter på 390px och 1440px för hem och el. Därefter separat begränsat implementerings-PR för start + /app/. Börja inte med att göra allt pixelidentiskt med AI-mockuper; de innehåller påhittade erbjudandedata och grafiska proportioner som inte motsvarar mobilwebben.

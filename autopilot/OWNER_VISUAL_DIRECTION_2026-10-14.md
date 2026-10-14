# BINDANDE ÄGARBESLUT 2026-10-14 — visuell disciplin, meningsfulla bilder och text

**Status EJ GODKÄND.** Ägaren har sett V10 och delar av senare redesign; nya premiumblå sidor blandas fortfarande med äldre skogsgröna/lime-moduler och toner i guider/verktyg. Foton upplevs som generiska arkivbilder. Nästan alla bilder visar människor trots att motivet sällan stödjer beslutsuppgiften. Ägaren avvisar fler små ändringar av marginaler/knappar när helheten förblir inkonsekvent. Senaste beslutet: genomför ett samlat visuellt, redaktionellt och produktmässigt kvalitetslyft; kontrollera i detalj före publicering.

## Visuell grund — inte en ny godtycklig stil
- Behåll marinblå/varmvit-sand/återhållsam klarblå premiumidentitet. Samma typografiska hierarki, spacing, navigering, CTA, focus och resultatytor över hela användarresan.
- Grönt endast för en faktisk semantisk statusmarkering (t.ex. uppnått/ok). Inga gröna hero-/guide-/kalkylatorbakgrunder, skogsgröna rubriksystem eller slumpmässiga gröna knappar. Leverantörernas legitima varumärkesfärger och korrekt status/prisindikation kan vara undantag om de dokumenteras.
- Sluta stapla nya blå CSS-overrides ovanpå gamla gröna stilar. Gå via semantiska tokens och delade sidfamiljer med kontrollerad regression. Undvik blind massersättning som kan påverka meningsfulla externa färger.

## Varje bild måste ha ett arbete
För varje faktisk bild: (1) vilken fråga eller känsla stödjer den? (2) hur knyter motivet an till sidans beslut? (3) varför är bilden bättre än ingen bild? (4) är den skarp/croppad rätt vid 390 och 1440 px? (5) kontrollerad licens/källa och prestanda/LCP? Om ett svar är svagt: ta bort eller byt. Använd mycket färre bilder med människor. Om personer behövs, välj äkta, situationsrelevanta ögonblick snarare än poserade leenden. Mer redaktionella miljöer, väsentliga föremål, verifierade datavisualiseringar och grafiskt egna uttryck; aldrig falska prisgrafer eller personliga offerter.

Motivriktning per sida:
- **Startsida:** tilltalande egen premiumidentitet och snabb överblick/valfrihet. Den interaktiva beslutsytan är primär; inget obligatoriskt stort familjefoto, onödigt dubblerat gallerifoto eller image-per-card-system.
- **Bredband:** adressberoende utbud, uppkopplat hem, router/nätverk eller relevant arbetsmiljö. Inte generisk leende familj vid laptop. Budskap: rätt kapacitet/tillgänglighet/årskostnad.
- **El:** ljus, hemmets riktiga energianvändning, ärlig tids-/prisvariation; real SE1–SE4 spotgraf är mer användbar än människor med kaffekoppar. Aldrig låtsad energibesparing.
- **Mobil:** en genuin användningssituation, relevant smartphone/datatäckning, inte poserat porträtt. Visa att surf/nät/hel familjekostnad påverkar valet.
- **Försäkring:** hem/nyckel/cykel/vardagsföremål/husdjur, det som faktiskt kan behöva skydd. Inga implicit garanterade skydd.
- **Ekonomi:** överblick, kontrakt, ordning, effektiv ränta och totalkostnad. Hellre funktionellt visuellt exempel än anonym person med kaffe.
- **Guider/verktyg:** ett korrekt exempel, diagram, begriplig beräkningsyta eller ingen bild om bilden annars fördröjer första nyttiga handlingen.

## Text- och komponentrevision
Ta bort överflödiga rubriker, upprepningar, blommiga sloganer, luddiga etiketter, dubbla CTA och långa formulär innan någon ny gimmick byggs. Varje block ska besvara vad användaren får, varför det spelar roll, hur valet fungerar, vad som händer efter klick och om länken är sponsrad. Visa konsekvenser och alternativ så att en ovan användare får nytta med 0–2 tryck. Håll möjlighet att fylla i verkliga pris-/avtalsuppgifter separat och frivillig.

## Faktiska kontrollkandidater — verifiera i renderingen
- Färg: styles/design-tokens.css (några ljusa toner är grönaktiga), styles/Home.module.css (historiska skogsgröna regler även om sena overrides finns), styles/EditorialGuide.module.css, styles/CategorySpotlight.module.css, styles/CategoryPremium.module.css, styles/global.css och specialist-kalkylatorernas CSS.
- Bild: pages/index.tsx (fem galleri- och principbilder), components/CategoryHeroPhoto.tsx, components/EditorialGuideHero.tsx, components/CategorySpotlight.tsx och äldre assets. Se asset-inventering i autopilot/ASSET_BRAND_EXPERIENCE_P0G_2026-10-12.md.
- Kontrollkandidater är **inte** bevis för hur varje sida faktiskt ser ut nu. Mät computed style och inspektera riktiga screenshots innan ändring.

## Arbetsordning och releasegrind
1. Inventera alla sidfamiljer och en hel mobilresa från startsida via kategori, guide, beräknat resultat till sponsrad partner. Spåra bakgrunds- och accentfärger, dubbla komponenter, bildkälla och kopians syfte.
2. Dokumentera för varje större synligt block: behåll/ta bort/omforma och varför. Designa **ett sammanhållet system** före komponentdetaljer.
3. Implementera återanvändbara tokens, sidfamiljer och redaktionell bild- och textrevision i tekniskt säkra, policyenliga avgränsningar. Det är EN sammanhållen produktleverans, inte en tävling i antal PR.
4. Kör build/check/integrity/export + relevanta Chromium/WebKit-regressioner. Bildgranska hela resor i 360/390/430/1024/1440/1920, före/efter, första fold, fokus, 44px klickytor, kontrast, rörelse, responsiva bildbeskärningar, sponsor-handoff, kalkylmatematik, SEO och inga overflow.
5. Publicera först efter verklig **visuell** granskning, inte endast gröna tester. Kontrollera Pages och custom domain separat. Dokumentera att fysisk iPhone och godkända nätverksintäkter är UNKNOWN/UNTESTED om det inte finns riktiga bevis.
6. Ägaren ska se tydlig skillnad i helhetsupplevelsen, inte ännu en marginell designuppdatering. Informera främst om viktig leverans/blockerare.

**Värdeprincip:** varje detalj — bild, text, färg, avstånd och interaktion — måste finnas av ett uttalat skäl.

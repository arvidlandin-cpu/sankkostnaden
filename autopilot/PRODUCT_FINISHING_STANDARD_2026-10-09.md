## SENASTE BINDANDE ÄGARBESLUT 2026-10-12 – P0F RADIKAL PREMIUMSKALA

Läs [autopilot/BOLD_PREMIUM_SCALE_2026-10-12.md](BOLD_PREMIUM_SCALE_2026-10-12.md) först. Ägarens aktuella produktskärmdumpar visar att blå P0D och P0E-interaktionerna inte räcker: gör helheten större, mer redaktionell, bredare och mindre småkortig. Denna P0F-revision är under arbete i `design/p0f-bold-premium-desktop-20261012`, ännu inte godkänd eller live. Undvik CSS-krock med pågående P0F-PR, kontrollera Build/kommersiell regression, riktiga screenshots och Pages-domän separat. Approved provision = UNKNOWN utan verifierade nätverksdata.

# Sänk Kostnaden — produktkvalitet och kontinuerlig färdigställning

## NYTT BINDANDE ÄGARBESLUT 2026-10-11 – P0E UPPLEVELSE FÖRST

**Läs [autopilot/EXPERIENCE_FIRST_2026-10-11.md](EXPERIENCE_FIRST_2026-10-11.md) först.** P0D färg- och tokensanering blev tekniskt klar men ÄGAREN bedömde den resulterande sajten som för textig och för lite interaktiv. Den äldre satsen ”bygg inte mer design” syftade på att inte duplicera P0D CSS, **inte** att ägaren accepterat UX som färdig. Nya prioriteten är synlig livfull beslutsprodukt: startsida, fem kategorier, progressiva faktaguider, klickbara vägval och premiumrytm. PR #125–129 mergade (Build + kommersiell regression godkända) och faktiskt screenshotgranskade. PR #130 och #131 är mergade efter Build, full kommersiell regression och visuell 390px-granskning. Ändra inte attribution eller SEO. Approved nätverksintäkt = **UNKNOWN** tills alla aktiva nätverk rapporterar.

**Ägarinstruktion 2026-10-09:** Arbeta vidare genom alla kategorier mot en sammanhållen färdig produkt, inte separata "v1"-verktyg. Granska regelbundet copy, design och varje interaktion: har den ett faktiskt syfte för besökaren eller leder den bara till mer text/fler klick?

## Quality gates, i ordning
1. **Besökarens mål på fem sekunder** – förstahandsvyn ska klart besvara "Vad kan jag göra här?" och ha en begriplig primär handling. Inga funktionsmässigt meningslösa element, dubbla vägval eller distraherande badges.
2. **Färre men bättre steg** – inget obligatoriskt konsumtions-, pris- eller personuppgiftsfält om uppgiften inte ändrar svaret; tillåt vet inte/hoppa över och valfri fördjupning; visa användbart resultat tidigt.
3. **Praktisk affärsnytta** – minst en användbar väg till rätt verifierad jämförelsetjänst/direktpartner, sponsring tydlig, subID/clickref/EPI på rätt partner utan att bryta ad-network-attribution. Separera eget verktyg från prisofferter.
4. **Språkgranskning på riktig svenska** – varje rubrik och CTA ska vara kort, naturlig, specifik och begriplig för lågkunskapsbesökare. Undvik "live", "billigast", "bäst", "garanterad besparing" när det inte kan styrkas. Städa bort dubblerad brödtext, tekniskt språk och onödiga formulär. Kontrollera korrekt stavning och grammatik.
5. **Verklig datakvalitet** – visa bara verifierade tal, år/tidsfönster och källor. Elspotpris är exklusive skatt/nät/moms/påslag och inte ett leverantörserbjudande. Visa prisfel och saknad data tydligt, aldrig syntetiska "aktuella" priser.
6. **Premiumdesign som en enhet** – samma blå/marinblå/varmvit skala, konsekventa ytor/CTA/typografi, ett tydligt fokus per vy, väl valda visuella element med rättigheter; mobil först. Undvik page-level färgblandning av gamla gröna kort och nya blå komponenter.
7. **QA/SEO-skydd** – 360/390/430/1024/1440 px, fokus/tab/ARIA/kontrast/reduced-motion, Core Web Vitals/LCP, riktiga screenshots före/efter, inga horisontella överflöden. Behåll viktiga indexed URLs, canonical, sökintention, H1-ämne, metadata, internlänkar och partnerlänkar. Separera branch/testpass från verifierad Cloudflare-version.
8. **Mät verklig effekt** – organisk trafik via GSC, relevant väg till första resultat, partnerklick och godkända affiliateaffärer; ägar/QA-klick är inte kundkonverteringar. Resultat och arbetshypoteser rapporteras separat.

## Produktscope / fortsättningsordning
- **Elavtal:** PR #74/#75/#77 prisuppgifter och simulator, #79 hela landningssidans blå formspråk. Behåll existerande Elskling/Tibber/övriga länkar. Kontrollera live publicering, full visuell läsbarhet, språkliga förbättringar och användarväg till affär; implementera justeringar när verklig QA indikerar.
- **Startsida:** befintlig V5 hero och målval; PR #83 gör hushållsverktyg frivilliga och minskar redundant innehåll. Följ upp om startsida och meny nu känns lättnavigerade på 390px och att riktiga partnerklick prioriteras.
- **Bredband:** första riktiga jämförelsevägen bör vara adressbaserat utbud hos partner, sedan valfria hastighetsfrågor/årskostnadsverktyg. Ingen in-house live-adresstäckning utan tillförlitlig källa.
- **Mobil:** enkel surf-/familjeprofil + korta vägar till aktiva partners. Prislistor bara med källor; total förstaårskostnad baserad på ifyllda villkor.
- **Försäkring:** boendeform, tydligt försäkringsskydd och relevant nästa steg; förklara tillägg och självrisk utan att påstå personlig täckning/ersättning. Ingen överdriven rådgivningsautomatik.
- **Ekonomi/lån:** lägst friktion men särskilt tydliga belopp, risker, annonsmärkning och osäkerhet. Inte lender-ranking på provision.
- **Guider och gemensamt skal:** rensa duplication och tekniskt språk; SEO-bevara innehåll och internlänkar, men håll den affärsmässiga navigeringen begriplig.

## Arbetsmetod
Repetera för varje områdessida: inventera live sida och kod → identifiera besökarens enda första jobb → prioritera saknade/duplicerade funktioner → implementera avgränsad ändring → verifiera riktiga desktop/mobil screenshots och interaktivt beteende → kommersiell regression → merge → kontrollera Cloudflare + spårning → uppdatera release-context/masterplan → mät utfall. Ingen stor ombyggnad av hela global.css i ett PR och ingen tyst omstart av tidigare genomförda lösningar.

**Viktigt:** Den här kvalitetspolicyn innebär inte att allt är färdigt eller att AI-arbete kan pågå i bakgrunden utan en aktiv körning/schemalagd automation. Verifiera status efter varje arbetsomgång och rapportera vilka kriterier som faktiskt återstår. Ingen generell "helt klar"-flagga sätts förrän kategorierna klarar dessa gates.

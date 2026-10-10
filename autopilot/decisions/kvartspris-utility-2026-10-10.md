# Beslut 2026-10-10 – kvartspris: ett klick till användbart nästa steg
**Status:** Beslut före kodändring. Åtgärd `CONTENT_UTILITY_UPGRADE`, en existerande URL `/elavtal/kvartspris/`. **Ingen prisranking, extern kampanj eller ny SEO-sida.**
**Ägarens godkända masterplan:** max två helt oberoende scoped experiment; `autopilot/state.json` saknade aktiva experiment vid beslutet. Det avbrutna försäkrings-snippettestet 7 oktober är inte aktivt.

## 1. Målgrupp och problem
Svensk lågkunskapsbesökare som söker hur kvartspris fungerar och undrar om man själv kan dra fördel av att styra elbil, värme eller varmvatten. Besökaren saknar ofta uppgift om kWh och påslag. Hen vill förstå *vilket nästa steg som är rimligt* utan en lång kalkyl och utan att få ett falskt löfte om kronor.

## 2. Daterade förstahandsobservationer hos andra (2026-10-10)
- **Energimarknadsinspektionen / Elpriskollen:** https://ei.se/konsument/el/elavtal/olika-avtalstyper/kan-kvartsprisavtal-vara-bra-for-dig och https://elpriskollen.se/sidor/vilket-avtal-ska-jag-valja.html förklarar skillnad mot månadspris, möjligheten att flytta stor förbrukning och att egen konsumtionsprofil styr utfallet. Officiell webbplats kan visa nationell prisjämförelse som vi saknar.
- **Tibber:** https://tibber.com/se/kvartspris visar kort väg från kvartsprisförklaring till ett specifikt avtal och beskriver automatiserad elbilsladdning/värmestyrning. Deras produkt, kampanjpåståenden och jämförelseutfall är leverantörens egna; vår sajt saknar en verifierad realtidsfeed för elhandelsavtal.
- **Vår egen sida:** `pages/elavtal/kvartspris.tsx` har förklaring och partnerkort men ingen *kort en-klick-fråga* som skiljer på stor flyttbar last och endast små vardagslaster. Vår befintliga 5-frågetjänst på `/elavtal/vilket-elavtal-passar-mig/` svarar på en bredare, annan fråga och får inte kopieras.

## 3. Evidens kontra hypotes
**Observerat:** GSC datum 2026-09-10–2026-10-06: `/elavtal/kvartspris/` cirka 156 visningar, 0 klick, snittposition ~21,7. Frågan “kvartspris el” har 52 visningar, 0 klick, position ~19,7; “vad menas med kvartspris på el” har 28 visningar, 0 klick, position ~9,1 över 3 olika dagar. Inga tillräckliga organiska sidbesök/kvalificerade partnerklick för CRO-konklusion. **Hypotes:** konkret, lättdelad egen beslutshjälp gör den befintliga guiden mer användbar och på sikt mer sök-/länkvärdig. Det är inte ett påstående om uppnådd effekt eller Googles rankinglogik.

## 4. Vår nulägeskedja
Google-visning → (nästan ingen organisk sidklick) → informativ text → allmänt partnerurval via bevarad `IntentGuide` och `PartnerOffers` → spårade affiliatelänkar → godkänd transaktion. Tidigaste observerade hindret är kvalificerade besök, inte bevisad kommersiell friktion. GSC/GA4 blandar historiska perioder; Direct/test ska inte kallas kundtrafik. Godkänd aktuell provision: **UNKNOWN** (direkt nätverksavstämning saknas).

## 5. Tre genomförbara val
- **Status quo:** inget nytt; tryggt för SEO men uppfyller inte besökarens personliga beslutsfråga på sidan.
- **Alternativ A – ny kvartspris-mikrosida:** avvisas; tunn duplicering, crawl-risk och konkurrerande canonical.
- **Alternativ B – kopiera 5-frågeguiden / lägg in beräknat besparingsbelopp:** avvisas; dubbel UX, hög friktion eller falsk precision utan lastprofil och elhandelspris.
- **Valt – liten befintlig sidhjälp:** 1 första val om flyttbar större förbrukning ger direkt nytta, med 1 frivilligt följdval om priskänslighet. Ingen kWh, personuppgift, inlogg eller kalkyl.

## 6. Falsifierbar mekanism
Färre steg från “vad betyder kvartspris” till rimligt nästa beslut. Mät event per faktisk användarsession och kanal samt kvalificerade senare länkklick. Falsifieras om verkliga användare inte använder hjälpen eller om sökexponering och webb-kvalitet försämras utan kompenserande nytta.

## 7. Innehålls- och erbjudandesanning
Regulatorn förklarar varför flyttbar stor last är relevant och att kvartspris kan bli dyrare om man använder mycket el vid dyr tid. Elhandelspåslag, fast avgift, moms och eventuell effektavgift ska kontrolleras. Ingen personlig besparing, framtidsprognos, garanterad prisnivå, kvartsprislista, bolagsranking, logotyp eller ny affiliate-tracking publiceras.

## 8. UI-hierarki och tillgänglighet
Bevara sidans H1, title, meta-description, canonical, relaterade interna länkar och befintlig partnersektion. Befintlig `DecisionGateway` fortsätter visa riktiga jämförelseval utan frågekrav. En liten navy/varmvit panel efter sidans korta sammanfattning ger huvudfrågan som tre stora kort/knappar; resultat uppdateras efter 1 klick; *frivillig* andra fråga avslutar nyansering. Neutrala CTA till befintliga `/elavtal/jamfor-elavtal/` och `#guide-partners`. Läsvänligt på 360/390/430/1024/1440, ARIA pressed, tangentbordsfokus och begripligt resultat.

## 9. Intäktskedjan
Möjlig påverkan: *sök-/referensrelevans* → *bättre begriplighet* → *mer relevanta interna jämförelsesteg* → *korrekt sponsormärkt partnerklick*. **Ej bevisad:** Google-klickökning, bättre partnerkonvertering, godkända köp eller faktisk provision. Kommission ändrar varken valens ordning eller resultatutformning.

## 10. Baslinje och mätning
Baslinje GSC för sidan: 156 impressions, 0 clicks, pos ~21,7 till senast komplett 2026-10-06. GA4 organiska sessions på denna specifika URL är för få/UNKNOWN. Nytt händelsenamn: `quarter_price_decision_answer`, med *endast* `question`, `answer`, `source` och befintligt session-ID; inga personliga kostnader. Separera organisk från QA/test/Direct och före/efter lansering. För SEO-bedömning minst 7 kompletta GSC-dagar efter release och minst 30 nya relevanta visningar; om otillräckligt data fortsätt observera utan att blockera orelaterade arbeten.

## 11. Risk, skydd och återställning
Enbart komponent+modul-CSS+den befintliga guidesidan+tester+detta beslut+scoped experimentstate (max sex filer). Påverkar inte globala kategoriflöden, affiliatehref, metataggar eller schema. Testa full Chromium-regression, ny riktad interaktion, WebKit 360/390/430, 1024/1440, internt länkcheck, integritet. Återställ genom revert av PR vid tekniska eller förtroenderelaterade problem. Fysisk iPhone och Cloudflare exakt SHA är fortfarande separata okända till dess verifierade.

## 12. Beslut och behörighet
**EXECUTE small bounded reversible original-content utility** – masterplangodkänt, utan extern kostnad/avtal/lagändring/massutskick. Inga andra aktiva growth-initiativ enligt `state.json` vid start; endast detta exakta SEO-URL-scope reserveras tills minsta uppföljningsdata finns. Ingen kalenderbroms på andra helt oberoende områden.

## 13. Verifierare och beslut efter utfall
Verifiera *först* PR green Build, Chromium, WebKit och relevant screenshots. Merga enbart vid grön och konfliktfri QA. Efter merge bekräfta att prod-sidan verkligen visar ny panel utan att förväxla route HTTP 200 med bevis på exakt Cloudflare SHA. Jämför senare kvalificerad organisk query→page, användare som utnyttjar nyttan, sponsorklick med korrekt clickref, och **godkänd SEK** efter nätverksavstämning. Bedöm KEEP / REASSESS / INSUFFICIENT_DATA; skriv enbart beständigt bevisade lärdomar till ledger.

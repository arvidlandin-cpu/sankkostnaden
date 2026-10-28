# Firecrawl: konkurrens och upptäckbarhet — 28 oktober 2026

## Omfattning och verifierade källor
- Firecrawl webbsökning och läsning av publika sajter: [Elskling](https://www.elskling.se/), [Compricer el](https://www.compricer.se/el/), [Compricer hem](https://www.compricer.se/forsakring/hem/), [Elpriskollen](https://elpriskollen.se/), [Konsumenternas försäkringsjämförelse](https://www.konsumenternas.se/konsumentstod/jamforelser/boendeforsakringar/jamfor-hemforsakringar/).
- Firecrawl crawl av sankkostnaden.se, 60 URL:er, 28 oktober 2026: samtliga returnerade HTTP 200. Detta testar INTE Google-indexering, samtliga klickmål eller verklig konvertering. Webbplatsen har fler sidor än de 60 som ingick.
- Firecrawl bekräftade läsbara meta-taggar, index/follow och innehåll för /forsakring/hemforsakring-bostadsratt/ och /elavtal/byta-elavtal/. Verktyget /verktyg/byteskalender/ ger 200 men anger noindex,nofollow; det är inte bedömt som ett fel utan ytterligare SEO-beslut.
- GitHub [dygnsrapport 27 oktober](https://github.com/arvidlandin-cpu/sankkostnaden/actions/runs/40514843553), GA4-period 27 september–26 oktober: 12 organiska sessioner och 2 organiska utgående partnerklick, 4 nya organiska användare. GSC (samma 30-dagarsperiod): 2 313 sökvisningar, 3 Google-sökklick totalt; /forsakring/hemforsakring-bostadsratt/ 610 visningar, 0 klick och medelposition 26,7. Sökfrågan ”hemförsäkring bostadsrätt” 267 visningar och 0 klick (position 26,6); ”hemförsäkring bostadsrätt pris” 92 och 0 (position 21,2); ”jämför elavtal” 58 och 0 (position 29,4). Sökfrågor och sidrader är olika dimensioner och får inte adderas. Total godkänd affiliateintäkt UNKNOWN p.g.a. otillräcklig Tradedoubler-täckning. Siffrorna avser en 30-dagarsperiod, inte ett dygn.
- Windsor.ai-connectorerna GA4, GSC och Adtraction är anslutna men direktläsning är blockerad: 3 anslutna konton på gratisplan med 1-kontosgräns. Verktyget returnerar konstruerade nollor; de används INTE som trafikdata. Ingen prenumeration köptes eller konto kopplades bort.

## Benchmark (observerat kontra hypotes)
| Källa | Observerad funktion | Vår relevanta fördel / begränsning |
| --- | --- | --- |
| Elskling | Snabb jämförelseprocess, utgår från förbrukning och postnummer, partneravtal, visar pris hos dem. | Vi kan förklara hela årskostnaden före hänvisning, men har inte ett eget live-offertflöde. |
| Compricer el | Flera bolag med profiler och möjlighet att teckna i deras flöde. | Vi visar godkända samarbetspartners, inte en heltäckande prisranking. |
| Compricer hem | Konkreta försäkringsbolag, skydd, förtroendesignaler och tydlig köpväg. | Vi kan ge neutral skyddskoll och ärlig kriteriejämförelse, men saknar egna personliga offerter. |
| Elpriskollen | Oberoende eljämförelse med postnummer som första fråga. | Vi får inte kalla en begränsad partnerkatalog en oberoende heltäckande jämförelse. |
| Konsumenternas | Djup jämförelse av försäkringsvillkor och produkter. | Vår snabbkontroll kan guida noviser; får inte efterlikna expertpoäng utan metod och källa. |

Designmönster är endast observationer. Inga konkurrentsiffror visar faktisk konvertering eller bevisar kausalitet.

## Beslutsunderlag enligt 13-fältsstandard

1. **Användare/job:** Novis som vill jämföra el eller hemförsäkring och söker en tydlig väg från start till relevanta val.
2. **Konkurrenter:** Se fem daterade länkar ovan. Konkurrenternas liveofferter och marknadstäckning kan vi inte påstå oss ha.
3. **Oberoende slutsats:** Hypotes att enklare upptäckt av våra befintliga, mer köpintensiva jämförelseguider minskar onödiga navigeringssteg; ingen effektbevisning.
4. **Våra data:** 60/60 genomlästa crawl-URL:er returnerade 200. GitHub-perioden visar 12 organiska sessioner och 2 organiska partnerklick; GSC-rapportens query- och sidaggregeringar är tillgängliga per 27 oktober, men en direkt verifierad komplett query→page-kombination för 28 oktober är UNKNOWN. Starkast signal i GSC: bostadsrättsguiden med 610 sökvisningar och 0 klick, medelposition 26,7. Besökare är inte samma sak som händelser.
5. **Alternativ:** A) oförändrat (svagare direktnavigering i guidebibliotek), B) ny hero/redesign (för stor störning), C) två befintliga kommersiella jämförelser länkas direkt från befintliga guidebiblioteket (valt).
6. **Hypotes:** Crawlbara textlänkar till redan fungerande /elavtal/jamfor-elavtal/ och /forsakring/jamfor-hemforsakring/ förbättrar upptäckbarheten för människor och sökmotorer utan ny sida/CTA-modul. Kräver eftermätning.
7. **Sanning i innehåll:** Länktexter beskriver redan existerande guider; inga pris-, prisranking- eller sparpåståenden görs.
8. **UI-hierarki:** Länkar placeras inne i befintligt kollapsat bibliotek “Fler guider och jämförelser”, inte som ytterligare heroyta, extra steg eller helt ny widget. Ingen ny knapp i första folden.
9. **Intäktskedja:** Intern navigering → relevant jämförelseguide → existerande märkt partnerlänk → nätverksgodkänd affär. Effekten av denna länkreparation på någon del är UNKNOWN.
10. **Mätning:** Behåll befintliga GA4 event, affiliate_click, UTM, EPI/subID och kvalitetsfilter. Följ organisk sidlandning, användare och partnerklick i ordning; avvakta verifierade GSC-query→page. Inga påhittade mål eller dagsbaserade tolkningar av rullande 30 dagar.
11. **Risk/rollback:** Enbart två interna länkar till existerande HTTP 200-sidor. Inga ändringar i kvartspris, partner-URL:er, priser, samtycke, CSS eller analys. Rollback genom revert av denna enda navigationsändring. Kontrollera mobilt, länkarnas faktiska mål och kommersiell regression.
12. **Beslut:** Genomför endast denna avgränsade navigeringsreparation som liten risk, inte ett nytt SEO-/CRO-experiment. Inga paid medier, externa meddelanden eller SaaS-uppgraderingar. Ägaren har bett om genomförande av Firecrawl-fynd.
13. **Verifiering:** PR-check och frontend-build, kommersiell QA, sedan verklig Pages-release/egen domän som separat steg. Jämför med nästa kompletta GSC-data: BRF-sidans visningar/klick/position och el-jämförelsens exakta query→page-signaler. Klara resultat av denna PR och total godkänd provision är UNKNOWN, även om historisk GSC-data finns i GitHub-rapporten.

## Nästa arbete, i ordning
1. Återställ tillförlitlig direktåtkomst till GA4/GSC **utan** att ta betalda abonnemang eller koppla bort nödvändiga konton på eget initiativ; alternativt fortsätt från GitHub-artefaktens förstapartsrapporter.
2. Hämta färsk query→page med fullständiga dagar och identifiera EN befintlig guide med verifierad efterfrågan samt konkret täckningslucka; starta inte samtidigt SEO-test som överlappar aktiv kvartsprisobservation.
3. Granska riktiga organiska besökares väg till märkt partnerlänk och nätverksgodkänd affär (samma period, inga QA-testklick). Ingen godkänd intäkt antas.
4. Gör en separat visuell mobil- och kommersiell QA på 360/390/430 före varje riktig produktrelease. Färre CTA, ingen ogrundad prislista, ingen ny generisk bild.
5. Ingen utgående outreach, inte heller BRF-pilot. Inga köp, nya partners eller indiskriminata SEO-omskrivningar.

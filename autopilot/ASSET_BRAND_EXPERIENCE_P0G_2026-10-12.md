# P0G — Visual Assets, Partner Identity & Signature Experience (2026-10-12)

## Bindande senare ägarbeslut
Ägarens nya skärmdumpar 12 okt visar pixeliga och generiska bilder, för svaga partnerlogotyper, långa kortmattor och frånvaro av starka verkliga produktupplevelser. **Genomför P0G.1–4 utan ytterligare klartecken** enligt detta dokument, efter P0F. Detta ersätter inte tidigare affärs-/säkerhetskrav.

## Faktisk implementering i denna gren
1. **P0G.1:** De fem äldre `/design/card-*.webp` på startsidan har ersatts med fem större tematiska, gratislicensierade originalfotografier från Pexels, med responsivt `srcSet` upp till 1800px samt riktiga Lucide-vektorikoner separat från bildmaterialet. Alla fem kategorihero-sektioner har högupplösta Pexels-bilder upp till 2500px och mer genomtänkt övertoning. Bildernas dimension/responsivitet, nätverksåtkomst och licenssidor bör kontrolleras även i framtida QA.
2. **P0G.2:** Ny `PartnerIdentity` med skarp HTML-text för leverantörsnamn samt tydligt dekorativ UI-monogram, inte utsträckta små Google-favicons som kan uppfattas som grumliga falska logotyper. Används i fyra marknadssektioner, äldre guided matchers, mobile matcher, partner directory och ekonomispotlight. *Monogrammen är inte officiella varumärkeslogotyper.* Tibber-feature använder en vektorlogotyp från Wikimedia Commons (ursprung Tibber, public domain/simple geometry men fortsatt varumärkesrätt) med synlig fallback när den inte kan hämtas. Utan verifierade licenser/varumärkesrättigheter används inte andras fulla logo pack.
3. **P0G.3:** Ett nytt gemensamt `CategorySpotlight` som visar fem **kategoriunika** interaktiva vägval som faktiskt leder till olika hjälpvyer: bredband (vardag/samtidigt), el (kvartspris/avtalsform), mobil (wifi/mycket surf), försäkring (hem/djur), ekonomi (lån/hushåll). En fråga i en snygg redaktionell feature — inget obligatoriskt formulär. Faktiskt interaktivt, inte påhittat kundpris.
4. **El/Tibber:** Framträdande Tibber-feature med sanningsenlig sponsormärkning, original Adtraction affiliate URL och fortsatt klick-EPI via delegerad attribution. Texten säger tydligt att den separata kvartsprisgrafen bygger på självständig spotdata och **inte är Tibbers elpris/offert**. Den redan implementerade riktiga `ElectricitySpotPrices`-grafen har flyttats från gateway till signaturdelen så att grafen inte dubbleras.
5. **P0G.4:** Större varierad indigo/navy-vägvalsytor, separata partnerkort, sektioner och guidetexter. Befintliga kategoriguider och partnerlistor ligger kvar oförändrade efter features. Samtliga fem kategorier följer: hero → snabbstart → signatur/insight → partner/jämförelse → guide.

## Gränser
Inga fabricerade spotpriser, personliga premier, mobilsurfbehov, besparingslöften eller prisrankingar. Partnerlistor fortsatt alfabetiska / relevansbaserade som före P0G. Inga ändringar av trackade partnerlänkar, deras rel, subID/EPI-biblioteket, SEO metadata/canonical, textindexering, prisflöde eller beräkningsformler. Inga annonser, betaltjänster, nya program, Google Drive eller massutskick. Kvartsprisguidens separata test observeras till tidigast 18 okt; försäkringssnippettet annullerat. Approved provision **UNKNOWN** tills pålitlig partnernätverksrapportering finns.

## Stoppgrind / QA
Gren `design/p0g-assets-brand-insights-20261012` är bara källkod tills PR och byggtest passerar, och ännu inte produktionsverifierad. Granska verkligt renderade screenshots 360/390/430/1024/1440 och Pexels-fotons `naturalWidth`. Använd 100 % browserzoom. Fysisk iPhone = UNTESTED. Val av frågealternativ måste byta nyttig kopia + navigeringsväg utan overflow, WCAG focus. Testa officiell Tibber-bild/varumärkessynlighet även på nät där externa SVG blockeras. **CI≠visuell kvalitetsacceptans; merge≠Pages deploy; Pages deploy≠egen-domän serverad SHA.** Verifiera dessa separat och rapportera sanningsenligt.

## Bildmanifest – verifierat mot källsidor 12 oktober
Bilderna kommer från Pexels, får enligt Pexels licens användas kommersiellt utan obligatorisk attribuering; varumärken och avbildade personer får aldrig framställas som sponsorer. Vi lämnar ändå foto-ID och källsidor för framtida asset-QA. Upplösningen måste kontrolleras i **riktig Chromium vid körning** innan release; ett foto-ID i koden är inte bevis på att bilden laddas i besökarens webbläsare.

| Plats | Pexels-ID | Motiv/källa |
|---|---|---|
| Startsida Bredband | 36777855 | Scandinavian living room, Curtis Adams – https://www.pexels.com/photo/modern-scandinavian-living-room-with-natural-light-36777855/ |
| Startsida El, el hero | 2962066 | Minimalist pendant light, Athena Sandrini – https://www.pexels.com/photo/brown-pendant-lamp-2962066/ |
| Startsida Mobil | 8067709 | Smartphone, vardagsliv – https://www.pexels.com/photo/a-person-holding-a-smartphone-8067709/ |
| Startsida Försäkring | 27175807 | Familj i vardagsrum – https://www.pexels.com/photo/cozy-family-moment-in-a-modern-living-room-27175807/ |
| Startsida Ekonomi | 16139628 | Laptop och kalkylator – https://www.pexels.com/photo/computer-with-financial-calculator-16139628/ |
| Hero Bredband | 37834298 | Modern Scandinavian interior, Margo Evardson – https://www.pexels.com/photo/modern-scandinavian-style-living-room-interior-37834298/ |
| Hero Mobil | 20838370 | Hands with smartphone, coffee – https://www.pexels.com/photo/person-using-smartphone-while-having-coffee-20838370/ |
| Hero Försäkring | 28949489 | Woman and Golden Retriever at home – https://www.pexels.com/photo/warm-home-scene-woman-and-golden-retriever-28949489/ |
| Hero Ekonomi | 16098002 | Financial planning desk, Jakub Zerdzicki – https://www.pexels.com/photo/counting-bills-accountant-table-with-glasses-and-calculator-top-view-16098002/ |

Tibber SVG: https://commons.wikimedia.org/wiki/File:Tibber_logo.svg (varumärkesskyddad trots angivet public-domain-verk). Tillåt inte påstående om partnerns formella stöd utöver existerande affiliateprogram.

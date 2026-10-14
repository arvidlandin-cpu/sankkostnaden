# Kostnadskartan — första sammanhängande implementationen

Beslutsdatum: 2026-10-14, Europe/Stockholm. Utgångspunkt: main `c8c20b2`, enligt koordinatorns kontroll. Ägaren har uttryckligen valt alternativ 03 och begärt en minnesvärd upplevelse som kan bidra till relevanta besök och partneraffärer. Konceptunderlag: `/workspace/visual-proposal-v3/github-delivery/UNDERLAG.md`. Detta dokument skiljer godkänd designriktning från ännu obevisad affärseffekt.

## 1. Målgrupp och uppgift

Svenska hushåll som misstänker att återkommande avtal kostar för mycket men saknar pris, förbrukning eller avtalsdetaljer. Startsidan ska hjälpa besökaren välja ett kostnadsområde och nå ett begripligt nästa steg med 0–2 meningsfulla val, utan inloggning. Den som har egna siffror ska kunna nå befintliga verktyg. Finansspåret ska hjälpa till att förstå ränta och totalkostnad, inte uppmana till nya lån.

## 2. Konkurrentobservationer och kunskapsgräns

Underlaget daterat 14 oktober anger The Zebra, https://www.thezebra.com/, som visuellt granskad i tidigare sparade skärmbilder. Det ger en referens för en tydlig jämförelseuppgift; någon ny fullständig livegenomgång eller kausal effektmätning är inte gjord här. Exakta aktuella steg och skärmar är därför UNKNOWN.

Apple, https://www.apple.com/; Airbnb, https://www.airbnb.com/; Wise, https://wise.com/; och MoneySavingExpert, https://www.moneysavingexpert.com/, försöktes öppnas under konceptarbetet men stoppades före sidladdning med CONNECT-fel/403. Wirecutter, https://www.nytimes.com/wirecutter/, är en referens från tidigare kännedom. Deras aktuella gränssnitt är inte verifierade observationer. Önskvärda principer är visuell precision, kontextuella val, begriplig kostnadsförklaring och redaktionella avvägningar. Kravet på två aktuella observerade referenser är därmed inte uppfyllt; luckan dokumenteras och motiverar inga påståenden om konkurrenternas resultat. Ägarens uttryckliga konceptval och egen produktfeedback är beslutets grund.

Sänk Kostnaden har inte verifierade realtidspriser, personlig offertmotor eller adressbaserat erbjudandeutbud och får inte låna sådana anspråk från jämförelsesajter.

## 3. Självständig slutsats

Observerat: ägaren har valt en egen illustrerad kostnadskarta med nästa-steg-panel. Hypotetisk mekanism: rumslig överblick och konsekventa textval kan göra kostnadsområden lättare att förstå och komma ihåg; en tydlig panel kan minska osäkerheten om nästa handling. Bevisad prestationsförbättring: UNKNOWN. Varken internationella referenser, konceptbilden eller fungerande tester bevisar fler organiska besök, bättre konvertering eller provision.

## 4. Egen evidens

`pages/index.tsx` innehåller startsidans metadata, Organization/WebSite-schema, fem kategorier, guidebibliotek och vägar till befintliga hushållsverktyg. `components/V10Experience.tsx` har redan kategorival och partnersteg. Befintliga guider som `/bredband/100-100/` och `/forsakring/hemforsakring-bostadsratt/` länkar till förstaårskalkyl respektive skyddskoll. Duplicerade verktyg behövs inte för denna leverans.

Ägarens dokumenterade kritik gäller splittrad visuell identitet, generiska personbilder och små isolerade förbättringar. Godkänd identitet är marinblå, varmvit/sand och klarblå. Aktuell matchande GSC-baseline, verkliga kvalificerade organiska starter, komplett nätverksgodkänd provision och provision per relevant besökare: UNKNOWN. Historiska GSC-tal i repot är inte en aktuell startsidebaslinje.

`lib/clientAttribution.ts` och `components/AffiliateTracking.tsx` har befintliga session-/klickidentifierare, nätverksdekoration och händelser. Kodens existens bevisar inte komplett rapportering eller godkända affärer.

## 5. Alternativ och prioritering

Status quo: behåll nuvarande startsida. Lägst förändringsrisk, men lämnar ägarens dokumenterade helhetsproblem olöst. Alternativ A: bygg uppskattade koncept 02. Rimligt men inte det senaste uttryckliga valet. Alternativ B: en rent textledd start utan kartillustration. Enkelt och lätt, men prövar inte den av ägaren efterfrågade egna visuella identiteten. Valt: en avgränsad sammanhängande startsida enligt koncept 03, med egen lokal illustration, tillgängliga kategorival och verkliga nästa steg. Genomför nu eftersom riktningen är godkänd; begränsa omfattningen för att kunna kvalitetsgranska utan att ändra resten av affärsfunktionen.

## 6. Specifik hypotes och omfattning

På `/` kan fem tydligt benämnda kostnadsval och en konsekvent nästa-steg-panel minska risken att användaren fastnar innan en relevant guide, ett verktyg eller partneralternativ. Observerbart: en besökare kan utan avtalsuppgifter välja område och nå ett fungerande relevant nästa steg; ändrat kategorival uppdaterar korrekt innehåll och destination. Hypotesen faller på uppgiftsnivå om kartan orsakar otydlighet, tangentbordslås eller felaktig destination. Affärseffekt förblir oprövad tills tillräcklig verklig data finns. Ingen ny separat A/B-kohort eller ett ytterligare test i samma tratt introduceras.

## 7. Sanning i innehåll och erbjudanden

Illustrationen är en orienteringshjälp, inte mätning av besökarens hem eller ekonomi. Inga uppfunna priser, personliga offerter, besparingar, recensioner, kundantal eller topprankningar. Partneridentitet, tjänstetyp, destination och tracking ska komma från befintlig konfiguration; aktuella villkor och tillgänglighet kontrolleras hos partnern. Skilj jämförelsetjänst från direktleverantör och märk sponsrade handlingar nära länken. Lokal bild ska sakna inbakade priser, partnerlogotyper och vilseledande datavisualisering. Beräkningar fortsätter använda befintlig verklig kalkyllogik.

## 8. UI-hierarki

Första vyn förklarar vad besökaren kan göra och visar fem kostnadsområden. Dator kan använda kartans rumsliga etiketter; mobil ska ha en egen läsbar komposition med tydliga textbaserade val före bilddetaljer. Kartans handlingar måste ha samma tydliga innebörd som textalternativen. Nästa-steg-panelen ska göra vald kategori, nyttan och destinationen begripliga; inga krav på personuppgifter. Aktivt val, synligt fokus, pekytor, kontrast och skärmläsarnamn ska granskas. Behåll sökbara guider och relevanta vanliga länkar i HTML; bilden får inte vara enda navigationen.

## 9. Intäktskedja och förvärv

Relevant upptäckt → startsida eller befintlig indexerbar guide → begripligt beslut/verktyg → relevant märkt partnerklick → verklig transaktion → nätverksgodkänd provision. Denna leverans kan påverka orientering och övergång till användbar hjälp eller partner; den skapar inte automatiskt sökefterfrågan eller godkända affärer.

Förvärvsstrategin i denna del är att bevara befintliga indexerbara guider, deras sökintentioner och startsidans relevanta internlänkar samt säkerställa fungerande mätning. Inga massproducerade SEO-sidor, nya betalkanaler, avtal, köpt trafik eller oauktoriserad kontakt med andra. Ytterligare distribution och innehållsprioritering behöver färska förstahandsdata och ett separat välgrundat scope. North star är långsiktig nätverksgodkänd provision per relevant besökare; aktuell baseline är UNKNOWN.

## 10. Attribution och mätplan

Bevara global `affiliate_click`, `partner_impression`, partneridentitet, kategori/intent/placement, lokal klickidentifierare och giltiga EPI/subID/clickRef-parametrar. Startsidans befintliga kategorihändelse får inte brytas oavsiktligt; slutliga ändringar och eventuella kompletteringar ska verifieras i implementationens tester. Undvik dubbla event. Filtrera ägar-/QA-trafik med befintlig produktionsdomänkontroll och `?qa=1`; testa aldrig genom verkliga utgående sponsrade klick.

Baslinjeperiod och aktuella kvalificerade organiska deltagare: UNKNOWN. Före effektjämförelse behövs ett daterat före-/efteruttag med samma kanaldefinition och releasetid. Rapportera söktrafik, relevanta utgångar och godkänd provision separat. Som minsta diagnostiska granskningsnivå används befintlig policy: minst sju kompletta observationsdagar och minst 25 organiska starter respektive 25 organiska partnerexponeringar för berörda trattsignaler; detta är ingen statistisk bevisgräns. Kommersiella slutsatser kräver nätverksverifierade mogna utfall och täckning från alla aktiva nätverk, annars är total provision UNKNOWN. Ingen kalenderdag tvingar fram en vinnare när underlaget saknas.

## 11. Risker och reversering

Bevara canonical, title/description-sökord, Organization/WebSite-schema, befintliga guide-URL:er, partnerattribution, sponsorrel och privatlivsskydd. Lokal illustrerad tillgång ska ha rimlig filstorlek och stabila mått; kontrollera bildladdning, läsbarhet och layout vid sex skärmbredder. Visuell framgång kan inte härledas enbart från ingen overflow.

`autopilot/state.json` anger ett aktivt försök på `/elavtal/kvartspris/`, med tidigaste review 18 oktober 2026 kl. 11:00 Europe/Stockholm. Ändra inte dess DOM, händelser, kohort eller SEO. Tolka inte generell webbplatsförändring som kausalt resultat för det försöket. Försäkringssnippetförsöket är avbrutet. Behåll högst två oberoende tillväxtförsök och inget överlappande tratttest. Håll denna implementation inom policyns sex filer per autonom åtgärd, inklusive beslut, bild och test. Reversera vid behov med en riktad revert av denna leverans; ändra inte orelaterade samtidiga arbeten.

## 12. Beslut och behörighet

GENOMFÖR den första sammanhängande startsidedelen enligt ägarens uttryckliga godkännande av koncept 03. Detta är en ägarbeställd produkt-/designimplementation, inte lansering av ett nytt oberoende growth-experiment. Att kalla den design befriar inte från skyddet för befintliga experiment eller från kraven på sanning och mätbarhet. Ändra inte experimentstate eller starta ett separat samma-tratt-test. Förväntad omedelbar lärdom är om konceptet fungerar som verklig tillgänglig navigation med korrekt kommersiell handoff. Förvärvs- och intäktseffekt är fortsatt UNKNOWN.

## 13. Verifiering och beslut efter release

Status när detta beslut skrivs: implementation, QA, merge, Pages-deploy, verifierad egen domän och kommersiellt utfall är PENDING. Koordinatorn kompletterar med faktiskt körda resultat; detta dokument påstår inga ännu osedda kontroller.

Kör `npm run check`, `npm run check:integrity`, `npm run build` och `npm run check:export`. Testa meningsfullt kategori → uppdaterad panel → befintlig guide/verktyg → korrekt resultat → relevant märkt partnerdestination, utan ett verkligt annonsklick. Kontrollera ändrat val, tangentbord/fokus, sponsormärkning, attribut och event. Granska riktiga skärmbilder på 360, 390, 430, 1024, 1440 och 1920 px samt relevanta Chromium-/WebKit-/kommersiella regressioner. Bekräfta att startsidans metadata, schema och interna länkar består och att det skyddade försöket inte ändrats.

Efter godkänd QA ska merge, Cloudflare Pages och vad egen domän faktiskt serverar redovisas som separata verifierade tillstånd. Linux WebKit är inte fysisk iPhone. Fortsätt observera nyttan och verklig trafik; behåll om sant, tillgängligt och användbart, reversera vid materiell regression. Uppdatera learning ledger först med faktiska resultat och avstå vinnarpåståenden från små klicktal eller avsaknad av jämförbar baseline.

## Sammanhängande fortsättning: kategorier och guider

Efter den första sexfilsdelen förs samma godkända identitet vidare i en separat avgränsad ändring av CategoryHeroPhoto, CategoryPremium och EditorialGuideHero/EditorialGuide samt detta beslut. Kategorierna återanvänder den lokala illustrationen; fakta- och beslutsstödsrutter får en textledd introduktion utan generiska personbilder. Originalrubriker, kanoniska adresser, brödtext, kalkyllogik och partnerdestinationer bevaras. Inga nya kategorier, affiliatenätverk eller SEO-sidor införs. Ändringen ska göra hela den valda resan sammanhängande och minska onödig bildnedladdning före den första användbara handlingen.

De här sidfamiljerna används inte av den skyddade kvartsprisguiden. Inga globala stilmallar, experimentdata eller kvartsprisfiler ändras. CategoryPremium.topbar används även av /app/ och harmoniserar där endast sidhuvudet. Före leverans ska de slutliga renderingarna och relevanta befintliga användarflödena verifieras; teknisk QA är skild från faktisk trafiktillväxt och nätverksgodkänd provision.

### Första verifieringsomgången

Build, check och check:integrity passerade. Den första statiska exportens nya Chromium-svit passerade 12/12 testfall inklusive verkliga intentresultat, alla aktiva partnerlänkar, sponsormärkning, exakta djuplänkar, intern navigation, tangentbord/fokus, utan JavaScript och sex skärmbredder. Bildgranskningen hittade en för lång desktop-panel; partnerlistan har därför gjorts progressiv och layouten har korrigerats. Mobilens illustration läggs efter de fem primära kostnadsvalen. Dessa sista ändringar och fortsättningen till kategorier/guider ska verifieras i slutbygget.

WebKit-nedladdning stoppades av miljöns nätverksproxy med HTTP403 även vid utökat nätverkstest. TLS- och paketverifiering har bevarats. WebKit ska köras i befintlig GitHub Actions-miljö där Playwright redan installeras; lokalt Chromium ersätter inte detta resultat.

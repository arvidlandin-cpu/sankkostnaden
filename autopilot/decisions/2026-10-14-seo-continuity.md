# Teknisk reparation: bevara avsedda sidtitlar i statisk HTML

Datum: 2026-10-14, Europe/Stockholm. Typ: TECHNICAL_FIX. Detta avgränsade beslut kompletterar [Kostnadskartans implementationsbeslut](2026-10-14-cost-map-implementation.md).

## Användarens fråga och faktisk defekt

Ägaren vill behålla befintlig Google-indexering när den godkända designen publiceras. En läsande kontroll av faktisk `out/` hittade 32 av 71 HTML-filer med tom `<title>`, bland annat alla fem kategoriindex och flera guider. Startsidan har korrekt titel. De tomma titlarna finns också i `.next/server/pages/`, alltså före kopieringen till statisk export. Källkodens avsedda titlar finns kvar; source-baserade kontroller kunde därför passera trots den felaktiga HTML-utmatningen.

Jämförelsebygget av basversion `c8c20b2` är genomfört med samma Node 22.16.0, Next 15.5.27 och React 19.3.0 som redesignen. Även det innehåller exakt 32 tomma titlar av 71 HTML-filer. Felet kan alltså reproduceras utan redesignen med dessa installerade beroenden; detta bevisar inte vilken React-version eller HTML produktionen tidigare serverade. Basbygget gjordes i en lokal arkivkopia, utan att byta checkout eller skapa worktree.

## Orsak och vald reparation

Koordinatorn har reproducerat att React 19.3 `renderToStaticMarkup` ger `<title></title>` när title-elementet har två barn, medan ett enda template-string-barn ger den avsedda texten. Valet är att ändra endast sex använda title-källor: de fem kategorihubbarna och `components/IntentGuide.tsx`. Varje titel ska bli ett enda strängbarn med exakt samma avsedda titeltext som före reparationen. Detta återställer befintlig metadataavsikt; det är inte en ny sökords- eller snippetstrategi.

Alternativen är att behålla defekten, göra en bred ramverksändring eller reparera de berörda title-elementen. Den lokala serialiseringsrättningen väljs för liten yta, tydlig reproduktion och enkel kontroll i slutlig HTML. Ändringen ska kunna återställas med riktad revert utan att röra övrigt arbete.

## Omfattning, SEO och experimentskydd

Behåll godkänt koncept 03. Inga URL-byten, redirects, nya indexerbara sidor eller ändrade sökintentioner. Befintlig avsedd titeltext, description, canonical, robots, schema, sitemap och guidecopy ska bestå. Startsidan har vanliga serverrenderade HTML-länkar till samtliga fem kategorier och befintligt guidebibliotek; kartans JavaScript-knappar ersätter inte dessa länkar.

Den gemensamma guidekomponenten återställer även kvartsprisguidens avsedda titel i head. Guidens DOM/body, beräkningar, händelser, kohort och experimentstate ska inte ändras. Titlarnas reparation är en möjlig störfaktor vid senare SEO-observation: annotera releasetid och tolka inte efterföljande trafik-/CTR-skillnader som ett isolerat utfall av det pågående kvartsprisförsöket. Tidigaste tidigare fastställda review är fortsatt 18 oktober 2026 kl. 11:00 Europe/Stockholm. Ingen ny experimentkohort, inget nytt SEO-experiment och ingen vinnartolkning införs.

## Verifiering och begränsningar

Basversionens faktiska export ska jämföras med den reparerade exporten. Kontrollera alla exporterade HTML-filer: meningsfulla sidtitlar för de avsedda indexerbara sidorna, exakt förväntad text på de berörda kategorierna och guiderna samt oförändrade canonical-/robots-värden och befintliga internlänkar. Kontrollera att title-reparationens diff inte ändrar brödtext, skyddade händelser eller experimentstate. Kör relevanta befintliga bygg-/integritets-/exportkontroller och en meningsfull kontroll av den konkreta serialiseringsdefekten; source-title-existens ensam räcker inte.

Direkt produktionshämtning och försök att nå Googles dokumentation från den lokala miljön har blockerats av nätverksproxyn med CONNECT403. Ett färskt GSC-uttag har inte gjorts i denna leverans. Aktuell Google-indexeringsstatus och trafik-/rankingeffekt är inte verifierade. Extern HTTP-verifiering via GitHub redovisas separat nedan. Ingen ranking- eller indexeringsgaranti ges. Att avsedda metadata återställs är ett tekniskt utfall, inte bevis för mer trafik eller godkänd provision.

## Genomförda skydd och faktiska kontroller

`tests/fixtures/seo-continuity-baseline.json` lagrar de 63 etablerade indexerbara adressernas canonical, avsedda titel, description, robots, guide-H1 och strukturerade data från basbygget. De 32 titelåterställningarna har kontrollerats oberoende mot ursprunglig og:title och befintligt varumärkessuffix; övriga 31 titlar matchar basversionens HTML. Startsides-H1 undantas uttryckligen eftersom koncept 03 avsiktligt ändrar den synliga rubriken.

`npm run check:export` kontrollerar nu den faktiska HTML-utmatningen, inklusive metadatajämförelse, bevarade redirects, robots.txt, eventuella blockerande exporterade HTTP-headerregler och statisk nåbarhet från startsidan. Ett bortfall ger felkod och stoppar befintliga bygg-/regressionsjobb. Kontrollens underlag är bevarade källor och byggd HTML, inte Googles aktuella index.

Basbygget hade också tre etablerade guider som inte gick att nå via vanliga HTML-länkar från startsidan: fiber, sänk fasta kostnader och se över abonnemang/avtal. De får tre relevanta länkar i befintligt guidebibliotek. Inga nya sidor eller URL:er skapades och ingen artikelcopy ändrades.

Faktiska lokala resultat: check, integrity och slutbygge passerar. Exportkontrollen passerar för 71 HTML-sidor, 2 032 interna länkar/ankare och samtliga 63 indexerbara adresser. Inga tomma titlar återstår. Kvartsprisguidens renderade body före första script är identisk med basbygget; endast avsedd head-titel repareras.

Gaten har dessutom utsatts för tio verkliga skador i en tillfällig exportkopia: tom titel, fel canonical-domän, noindex, borttagen sitemapadress, borttagen internlänk, saknad JSON-LD, ändrad guide-H1, global robots-blockering, global X-Robots-Tag noindex och förlorad redirect. Alla tio stoppades; giltig export passerade både före och efter. [Maskinläsbart lokalt underlag](../evidence/cost-map-2026-10-14/seo-preflight.json).

Den nya läsande GitHub-kontrollen `SEO release continuity` har [passerat för `151c120`](https://github.com/arvidlandin-cpu/sankkostnaden/actions/runs/38619795150). Från GitHubs oberoende runner kontrollerades previewens 63 adresser mot exakta titlar/beskrivningar/canonical och dess noindex-header. Fyra representativa produktionssidor gav HTTP200, självcanonical och ingen noindex i HTTP eller HTML; produktionens robots tillät Googlebot och dess sitemap innehöll samtliga 63 adresser. Nätfel skulle ge synligt fel, inte märkas lyckade. Jobbet publicerar ingenting och bevisar inte Googles faktiska index eller sökpositioner. Den lokala proxyns CONNECT403 är därmed inte längre ett hinder för just denna HTTP-verifiering via CI.

[Build check för `151c120`](https://github.com/arvidlandin-cpu/sankkostnaden/actions/runs/38619795126) är godkänd med nya exportgaten. Den riktade lokala Chromium-omkörningen passerar 6/6, inga hoppade över: alla fem kategorier/partnerurval, klickattribution efter filtrering, reservnavigation utan JavaScript, bostadsrättsguiden, 100/100-guiden och kvartsprisens riktiga handlingar/händelser. Även den [fulla kommersiella Chromium-/WebKit-körningen för samma commit](https://github.com/arvidlandin-cpu/sankkostnaden/actions/runs/38619795033) är godkänd med Success, 5 min 48 s. Produktionsjobbet är avsiktligt hoppat över på granskningsgrenen; den separat läsande SEO-kontrollen ovan täcker de redovisade externa HTTP-signalerna.

Main och produktionsdomänen är inte ändrade. En eventuell kommande skarp publicering ska få en daterad uppföljning i befintlig GSC/GA4-process. Ingen massbegäran om omindexering, inga nya parallella SEO-experiment och inget antagande om garanterat oförändrade positioner följer av designbytet.

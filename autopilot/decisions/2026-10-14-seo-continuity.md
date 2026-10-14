# Teknisk reparation: bevara avsedda sidtitlar i statisk HTML

Datum: 2026-10-14, Europe/Stockholm. Typ: TECHNICAL_FIX. Detta avgränsade beslut kompletterar [Kostnadskartans implementationsbeslut](2026-10-14-cost-map-implementation.md).

## Användarens fråga och faktisk defekt

Ägaren vill behålla befintlig Google-indexering när den godkända designen publiceras. En läsande kontroll av faktisk `out/` hittade 32 av 71 HTML-filer med tom `<title>`, bland annat alla fem kategoriindex och flera guider. Startsidan har korrekt titel. De tomma titlarna finns också i `.next/server/pages/`, alltså före kopieringen till statisk export. Källkodens avsedda titlar finns kvar; source-baserade kontroller kunde därför passera trots den felaktiga HTML-utmatningen.

Jämförelsebygge av basversion `c8c20b2`: PENDING när detta beslut skrivs. Defektens existens i aktuell export är verifierad; det är ännu inte fastställt här om redesignen introducerade den eller om den redan fanns i basversionen. Basbyggets plats dokumenteras i `/workspace/cost-map-evidence/seo-baseline-path.txt`.

## Orsak och vald reparation

Koordinatorn har reproducerat att React 19.3 `renderToStaticMarkup` ger `<title></title>` när title-elementet har två barn, medan ett enda template-string-barn ger den avsedda texten. Valet är att ändra endast sex använda title-källor: de fem kategorihubbarna och `components/IntentGuide.tsx`. Varje titel ska bli ett enda strängbarn med exakt samma avsedda titeltext som före reparationen. Detta återställer befintlig metadataavsikt; det är inte en ny sökords- eller snippetstrategi.

Alternativen är att behålla defekten, göra en bred ramverksändring eller reparera de berörda title-elementen. Den lokala serialiseringsrättningen väljs för liten yta, tydlig reproduktion och enkel kontroll i slutlig HTML. Ändringen ska kunna återställas med riktad revert utan att röra övrigt arbete.

## Omfattning, SEO och experimentskydd

Behåll godkänt koncept 03. Inga URL-byten, redirects, nya indexerbara sidor eller ändrade sökintentioner. Befintlig avsedd titeltext, description, canonical, robots, schema, sitemap och guidecopy ska bestå. Startsidan har vanliga serverrenderade HTML-länkar till samtliga fem kategorier och befintligt guidebibliotek; kartans JavaScript-knappar ersätter inte dessa länkar.

Den gemensamma guidekomponenten återställer även kvartsprisguidens avsedda titel i head. Guidens DOM/body, beräkningar, händelser, kohort och experimentstate ska inte ändras. Titlarnas reparation är en möjlig störfaktor vid senare SEO-observation: annotera releasetid och tolka inte efterföljande trafik-/CTR-skillnader som ett isolerat utfall av det pågående kvartsprisförsöket. Tidigaste tidigare fastställda review är fortsatt 18 oktober 2026 kl. 11:00 Europe/Stockholm. Ingen ny experimentkohort, inget nytt SEO-experiment och ingen vinnartolkning införs.

## Verifiering och begränsningar

Basversionens faktiska export ska jämföras med den reparerade exporten. Kontrollera alla exporterade HTML-filer: meningsfulla sidtitlar för de avsedda indexerbara sidorna, exakt förväntad text på de berörda kategorierna och guiderna samt oförändrade canonical-/robots-värden och befintliga internlänkar. Kontrollera att title-reparationens diff inte ändrar brödtext, skyddade händelser eller experimentstate. Kör relevanta befintliga bygg-/integritets-/exportkontroller och en meningsfull kontroll av den konkreta serialiseringsdefekten; source-title-existens ensam räcker inte.

Produktionshämtning, GSC-åtkomst och försök att nå Googles dokumentation har blockerats av miljöns nätverksproxy med CONNECT403 enligt koordinatorns kontroll. Aktuell Google-indexeringsstatus, live-serverad titel och trafik-/rankingeffekt är därför inte verifierade här. Ingen ranking- eller indexeringsgaranti ges. Att avsedda metadata återställs är ett tekniskt utfall, inte bevis för mer trafik eller godkänd provision.

Status vid upprättande: baselinejämförelse, slutlig QA, release och verifierad egen domän PENDING. Koordinatorn kompletterar med faktiska resultat och releasetid innan affärs- eller experimentuppföljning.

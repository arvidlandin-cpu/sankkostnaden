# P0O — Hela sajtens foto- och bildkvalitet: verklig inventering

**Datum:** 13 oktober 2026. **Status:** automatisk käll- och renderingsrevision föreslagen; produkten får inte förklaras visuellt slutgodkänd enbart av PASS. **Scope:** enbart tester, read-only QA och evidens; **inga** nya bilder, färger, CTA, spårningslänkar eller SEO-förändringar.

## Ägarens målkänsla / uttrycklig kvalitetsribba

Mänsklig, trovärdig, naturlig vardagsvärme, intressanta men stillsamma fotografier och **mjukt tonad integration bakom riktiga HTML-rubriker och klickbara vägval**. Marinblå text/varmvitt med sparsam grön naturaccent och klarblå enda primär CTA. Ingen kopierad konkurrent, fiktiv besparing, avbildad person presenterad som kund eller produktgarant. Motivet ska vara relevant för hushållets faktiska jobb och mångsidigt utan urval efter etnicitet/demografi. Undvik repetitiva bildbyråserier som ger känslan av mall. Foton får inte skymma första nyttiga val eller skapa extra scroll.

## Nuvarande observerade bildkällor (per 13 okt main efter P0N #155)

- Startsida hero: **39997379**; fem kort Bredband **4260743**, El **3875175**, Mobil **8067709**, Försäkring **28949489**, Ekonomi **16098002**; redaktionell “varför vi finns” **4473625**.
- Kategorihero `CategoryHeroPhoto`: Bredband **4008771**, El **3875141**, Mobil **5901387**, Försäkring **28949489**, Ekonomi **6964105**.
- Gemensamma faktaguider `EditorialGuideHero`: Bredband **4260743**, El **8055828**, Mobil **4254149**, Försäkring **27177239**, Ekonomi **6964105**. Kvartsprisguidens egen kohort skyddas och behåller tidigare mall.
- Tre progressiva behovsverktyg `SmartSelector`: Bredband **4008771**, El **3875160**, Mobil **4254149**.
- **Observerad upprepning mellan sidsteg:** Försäkring **28949489** på startsidans kort och kategorins hero, bredband **4260743** kort+faktaguider och **4008771** kategori+verktyg, mobil **4254149** faktaguide+verktyg, ekonomi **6964105** kategori+faktaguider. All återanvändning är inte fel; avgör i faktisk reskontext om samma bild stör eller ger igenkänning.
- **Tekniskt misstänkt dubbellager:** `CategoryHeroPhoto` renderar verkliga `<img>` i fem kategoriheros **samtidigt som** `styles/CategoryPremium.module.css` lägger `background-image: url(...)` under samma bildbehållare. Det kan ladda två externa foton för en enda visuell yta. Kodobservation är inte i sig bevis på två faktiska HTTP-hämtningar. Kontrollera browser network + CSS-beräknad bakgrund.

## 13-fälts grundbeslut för QA och eventuell senare intervention

1. **Målgrupp/nytta:** svensk nybörjare ska känna en sammanhållen, varm, begriplig och trovärdig produkt från första skärm till resultat/partner.
2. **Observation och källor:** P0I godkänd bildriktning `P0I_APPROVED_PHOTO_DIRECTION_2026-10-12.md`, P0G bildinventarium (historisk), P0M fotojourney/PR #153, P0N #155, faktiska source-ref ovan; Playwright screenshot- och CDN-originaltester #38399199342/38404856463 var avgränsade, inte full sitewide fotogranskning.
3. **Observation/hypotes separerade:** koden har tydlig ID-återanvändning och CSS+img-lager. Möjlig visuell monotonitet/prestandaförlust är hypotes tills användarresans verkliga skärmbilder och resursanrop verifierats.
4. **Befintligt bevis:** P0M live CSS/JS/photo ID-verifierat 10/10; P0N live CSS/JS verifierat 10/10; ingen fysisk iPhone, ingen ägarsign-off av hela bildresan; approved provision UNKNOWN.
5. **Alternativ:** A fortsätt byta enskilda bilder subjektivt, risk för fragmentering; B enbart kontroll av 5 hero, missar faktaguider/verktyg; **C vald:** full source-route-fotoinventering på 390/1440 samt 15 sidfamiljsrepresentativa äkta helsides-/förstaskärmsbilder, renderad CSS och faktiska browser image requests.
6. **Falsifierbar hypotes:** efter korrekt inventering går det att peka ut varje verkligt bildmisslyckande, upprepad bild inom resan och dubbel nedladdad hero. Om faktisk laddning eller kontrast inte styrks lämnas det som UNKNOWN och åtgärd får inte påstås färdig.
7. **Sanning/varumärken:** dekorativt stockfoto är ej kundintyg, inte logotyp/leverantörscitat. Kontroller av fri Pexels-källa; använd inte nedladdad font/medieasset från dolda källor. Ingen påhittad prisdata.
8. **Visuell hierarki:** foto får förstärka relevant hushållsberättelse och tonas i aktuell marinblå/varmvita sidfamilj; aldrig konkurrera med primär CTA eller manipulera konsumentens riskbedömning.
9. **Helhetsresa/intäkt:** organiskt sök → förstå nytta → välj kategori → guide/verktyg → ärligt resultat → märkt partner. Foto är stöd, inte primärt värde; ingen mätbar inkomst utan nätverkens godkända rapporter.
10. **Mätning:** verkliga bildresursanrop, `naturalWidth`, skärmgeometri och mängd unika foto-ID, faktiska 390/1440-skärmbilder. GA4 organisk trafik, lokala taggade clickevents, officiell GODKÄND provision redovisas alltid separat eller UNKNOWN.
11. **Risk/kostnad:** CDN kan ge temporära 429/flakiness, full-page JPG kan bli stora, bildscreenshot i CI är ej mänsklig visuell acceptans, Chrome desktop ≠ riktig iPhone. Kostnadsfri befintlig GitHub Actions-körning, inga externa tjänster/avtal.
12. **Avgränsat scope:** `tests/p0o-sitewide-photo-audit.spec.ts`, `.github/workflows/p0o-sitewide-photo-audit.yml`, detta beslut. Endast test; inga ändringar i bildfiler, css eller användarflöde, `/elavtal/kvartspris/` förblir experimentmässigt skyddad.
13. **QA/rollback:** Build/check/integrity/export samt riktig Chromium på **varje vanlig TSX-sida** i 390 och 1440; inventera `img`, computed CSS-bakgrunder, requests, trasiga eagerbilder, overflow; generera 15 sidfamiljers screenshotpar och JSON. Vid brist/fel: åtgärda instrumentering eller dokumentera defekt. Utför **separat** 13-fältsproduktbeslut för en verklig förbättring efter källbelagd bildprestanda/estetik. Återställ test-PR utan produktpåverkan om opålitlig.

## Bedömningsprotokoll efter Action-körning
- **Tekniskt verifierbart:** unik lista foto-ID för varje sidas viewport, bilder som lyckats laddas, dator/mobil, faktiskt begärda dubbletter och skärmspill.
- **Visuellt mänskligt krav:** granska riktiga screenshotartefakter i normal 100%-zoom med fyra dimensioner: naturlighet, relevant vardagsscen, upprepning i kundresan och mjuk inblandning utan block eller oskärpa.
- **Slutstatus:** `SOURCE_AUDITED`, `BROWSER_LOAD_VERIFIED`, `SUBJECTIVE_PENDING` separat. Märk aldrig alla bilder som visuellt rätt utan att faktiskt ha tittat på hela materialet.

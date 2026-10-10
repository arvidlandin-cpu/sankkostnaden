# 2026-10-10 · Beslut före ändring: Fråga BRF-styrelsen om försäkringsskydd

**Status före kod:** EXECUTE ett avgränsat originalverktyg i befintlig bostadsrättskoll, ej ny SEO-landningssida. **Scope:** `/forsakring/hemforsakring-bostadsratt/`, `components/CondoInsuranceCheck.tsx`, dess egna CSS och befintliga tester. Den pågående kvartsprisobservationen på `/elavtal/kvartspris/` berör en annan kategori, URL, sökkohort och helt annan affiliatefunnel. Max två enligt `policy.json`, ingen datumspärr från ett avbrutet försäkringssnipptest.

## 1. Användare / faktiskt behov
En svensk bostadsrättsinnehavare söker hemförsäkring eller bostadsrättstillägg och vet inte om föreningen redan har ett kollektivt bostadsrättstillägg. Besökaren ska kunna ta ett säkert första steg utan att ange personnummer, styrelseadress eller försäkringspremie. **Efter ett val** ger befintliga CondoInsuranceCheck redan en användbar försiktig kontrollista; problem kvarstår att omsätta ”fråga styrelsen” i en färdig, korrekt förfrågan.

## 2. Två+ primära konkurrens- och myndighetsobservationer, 2026-10-10
1. **Konsumenternas Försäkringsbyrå**, https://www.konsumenternas.se/forsakringar/boendeforsakringar/bostadsrattsforsakringar/ — förklarar personligt respektive kollektivt bostadsrättstillägg, hemförsäkringens fortsatta behov och skadeanmälan. Oberoende offentlig konsumentvägledning, men ingen personlig försäkringsrådgivning/avtalsdata levereras till vår sida.
2. **Folksam**, https://www.folksam.se/forsakringar/hemforsakring/bostadsrattsforsakring/bostadsrattstillagg — beskriver att styrelsen ska tillfrågas om föreningens kollektiva skydd och aktuella villkor, maxbelopp och självrisk. Leverantören kan erbjuda verklig personlig offert efter uppgifter – en förmåga vi saknar och inte imiterar.
3. **Compricer**, https://www.compricer.se/nyheter/artikel/bostadsrattstillagg--sa-funkar-det/ — beskriver risken för dubbla tillägg och när villkor ändå kan göra ett eget tillägg relevant; erbjuder externa prisjämförelser. Artikeln är äldre; inga aktuella prisangivelser återanvänds.

## 3. Separera observation från slutsats
**Sett:** `/forsakring/hemforsakring-bostadsratt/` har redan `CondoInsuranceCheck` med fråga Ja/Nej/Vet inte om kollektivt skydd, frivillig fråga om egen hemförsäkring och en allmän kontrollista. Det saknas en färdig fråga att skicka till BRF-styrelsen. **Hypotes:** ett tydligt kopierbart meddelande låter fler lösa frågan praktiskt och ökar sidans särskilda originalnytta/delbarhet. Ingen mätbar organisk, affiliate- eller provisionsökning har bevisats.

## 4. Våra faktiska data
GSC 2026-09-10–2026-10-06: `/forsakring/hemforsakring-bostadsratt/` **246 impressions, 0 klick, snittposition 29,7**. Frågor ”hemförsäkring bostadsrätt” 123 visningar/0 klick, ”hemförsäkring bostadsrätt pris” 41/0. GA4 har 25 Organic Search-sessioner på sajten 2026-09-10–10-09, men **0 verifierade organiska besökare till just denna landning**, så CRO-evaluering får inte göras. Godkända affiliateprovisioner är **UNKNOWN** eftersom nätverkens autentiserade rapporter saknas; Adtraction via Windsor.ai nekades med AdvertiserUser/AffiliateUser-rollfel.

## 5. Meningsfulla alternativ och varför nu
- **Status quo:** Besökaren får ett korrekt men generellt ”fråga styrelsen”, vilket kräver egen formulering och riskerar att vissa centrala villkor glöms.
- **Alternativ A, ny BRF-SEO-guide:** avvisas: duplicerar en redan rankande sida och adderar crawl-/canonical-risk utan mer användarnytta.
- **Alternativ B, fråga efter namn, adress, försäkringsbelopp och automatiskt e-posta:** avvisas på grund av onödiga personuppgifter, avtal och utskick.
- **Valt alternativ:** förstärk **befintligt** `CondoInsuranceCheck` med en färdig **generisk** förfrågan som kan kopieras med ett klick, direkt efter svaret Ja/Vet inte på kollektivt skydd. Användaren kan se texten före kopiering, och skickar den själv via valfri kanal. Om föreningen saknar tillägg visas **ingen** onödig styrelseförfrågan. Första användbara råd fortsatt efter ett klick.

## 6. Avgränsad, falsifierbar mekanism
Sökexponering → möjligt relevant besök → ett val som ger verklig skyddsvägledning → frivillig kopiera färdig BRF-fråga → kontrollera faktiskt skydd → först därefter visa och välja redan befintlig relevant partner. Mät om verktyget används och om kvalitativ begriplighet ökar; dokumentera även nollresultat när giltiga organiska kohorter finns.

## 7. Källsanning, integritet och försäkringssäkerhet
Frågan ska nämna **om** kollektivt skydd finns, försäkringsgivare/villkor, vad som omfattas, självrisk/åldersavdrag/maxersättning/undantag och skadeanmälan. Inga allmänna krav på personnummer, personliga belopp, lägenhetsnummer eller styrelsemejladress. Ingen unik prisuppgift eller försäkringsrekommendation, ingen automatisk kommunikation. **Avsluta aldrig befintligt skydd på denna generella vägledning**; ha kvar vanlig hemförsäkring och kontakta berörda försäkringsbolag för behov/omfattning.

## 8. Precis UX-hierarki och mål
Befintlig H1, meta, canonical och sidstrukturen `IntentGuide` skyddas. Befintliga Ja/Nej/Vet inte-kort ger tidigt resultat; endast efter Ja/Vet inte läggs en kort BRF-åtgärd till. Knapp ”Kopiera frågan till styrelsen” är 1 frivilligt klick efter det första svaret. Valfri ”Visa texten” som `details`, och tydligt felmeddelande plus markerbar text om clipboard inte är tillgängligt. Ingen uppmaning att skicka nu eller byta försäkring. Harmonisering av redan isolerad grön CSS till ägargodkänd marinblå/varmvit sker i samma komponent utan globaleffekt. Minst 48px knappar, fokusindikator, läsbarhet, 360/390/430/1024/1440px.

## 9. Affärsmekanism
Lågkunskapsnytta → bättre beslutsberedskap och potentiellt trovärdigare återbesök → rättjämförda hemförsäkringsvillkor hos faktiskt aktiva partners. Inga ändringar av partnerrankning, affiliate-URL, subID, sponsormärkning, pris eller urval. Kopiering är **inte** intäkt; tillgodoräkna endast senare godkända SEK per verkligt relevant organisk besökare.

## 10. Instrumentering / sample
`condo_board_request_copied` vid verifierad kopiering med endast abstrakta parametrar `source:condo_insurance_guide` och `collective: yes|unknown`; aldrig text, namn, mejladress, personuppgifter eller belopp. Låg GA4-sample och GSC-fördröjning anges öppet. Organisk data, Direct och `?qa=1` hålls isär. Kvalitet kan bedömas direkt via test; SEO-effekt kräver minst sju fullständiga GSC-dagar och minst 30 nya sidvisningar efter produktionsbekräftelse, partner-CRO kräver policy `minPagePartnerImpressions=30` och `minPagePartnerUsers=8`.

## 11. Risk, test och rollback
Säkerhets-/compliance-risk är att ”dubbelförsäkring” tolkas som säkert skäl att säga upp avtal; bevara explicit försiktighetsråd. Browser clipboard kan vara låst; visa fallback med synlig markerbar text och korrekt tillstånd. Ingen ny exfiltrering. QA Build, 69 routes, canonicals, 63 indexable, 38 aktiva partners, 360–1440 screenshots, 251+ Chromium och 22 WebKit; kontrollera CSS kontrast/klickyta och källor. Om kod/SEO/partner regressar: revert enskild PR.

## 12. Ägarbeslut och scope
**EXECUTE** inom befintlig godkänd masterplan, `CONTENT_UTILITY_UPGRADE`; andra, oberoende aktiva spåret för bostadsrättsförsäkringsinformation, ingen delad URL/funnel/query/cohort med kvartspris. Dokumentera i `state.json` före merge. Ingen betaltjänst, inget nytt avtal, ingen masskommunikation eller automatiskt mejl. Ingen kalenderbroms på oberoende underliggande efterforskning.

## 13. Verifiering och slutsats senare
PR med detta beslutsprotokoll ska innehålla scoped implementation och regressionsfall för 1-klick-råd, Ja/Nej/Vet inte, kopierbar fråga, fallbacks, nej-gren utan knappar, innehåll, dataLayer-integritet, sponsorlänkar och fokus/viewport. Merge **endast** efter grön Build och kommersiell Playwright Chromium + WebKit; bekräfta live UI separat från GitHub SHA (Cloudflare API saknas). Efter tillräcklig organisk data: utvärdera KEEP/REASSESS/INSUFFICIENT och godkänd SEK. Skriv aldrig ”konverteringsvinst” från ett klarat QA-test.

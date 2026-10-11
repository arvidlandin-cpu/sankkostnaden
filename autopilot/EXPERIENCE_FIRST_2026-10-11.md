# Ägarbeslut: P0E – levande beslutssajt framför textdriven infosajt

**Beslutat 2026-10-11, senare än P0D 2026-10-10. Bindande för designoperatör och daglig masterplan.**

## Varför ytterligare ett designlyft?
P0D:s marinblå/varmvita färgmigrering och stora skärmbildstester gjorde tidigare spretiga grön/blå sidfamiljer tekniskt sammanhängande. Ägaren konstaterade efter genomgång 11 oktober att detta fortfarande INTE motsvarade den visuellt interaktiva målbilden inspirerad av Lyst, The Zebra och KAYAK. Webbplatsen kändes fortfarande för mycket som en traditionell text- och guidesajt, med för svag upplevelse och för många ord innan första meningsfulla steg. **Ingen får återigen förklara P0D färgkonsistens eller gröna CI som bevis för att själva upplevelsen är färdig.**

## Fem prioriterade resultat, inte fem separata widgetfabriker
1. **Startsida:** En interaktiv, trygg förstaupplevelse med synliga valkort, respons på mikrobeslut, en huvudsaklig CTA och visuellt varierad rytm. Textmängden minskas genom att befintliga vägval konsolideras, utan att sökbara kategori-URL:er försvinner.
2. **Fem kategorier:** Bredband, el, mobil, försäkring och ekonomi får högst ett dominerande vägval i hero. En levande hjälp-/jämför-/förstå-deck ger direkt relevant nästa steg, utan extra frågor som inte ändrar matchningen. Partners kan nås utan formulär.
3. **Långa guider:** Behåll ursprungliga fakta och SEO/H2/metadata serverrenderade, men låt besökaren börja med lättlästa nummer-/faktakort och klicka upp det den vill fördjupa sig i. Kort snabbstart före fakta; inte hundratals pixlar extra komprimerbar copy.
4. **Beslutsvägar:** Jag vet inte var jag ska börja / Jag vill jämföra nu / Jag vill förstå först ska mynna ut i **verkliga interna verktyg eller korrekt märkta partnerhand-offs**, inte skenbar prisranking eller avsiktslösa animationsval. Inga påståenden om besparingslyft.
5. **Premiumkänsla:** Samma marinblå/varmvit/klara blå tokens, läsbara kontraster, medveten typografisk hierarki, stora valkort med meningsfull respons, gott om luft och mobilprioritet. Legitima varumärkesfärger/semantiska elprisindikatorer behålls.

## Teknisk och kommersiell kvalitetsgrind
- Fem viewportstorlekar 360/390/430/1024/1440 där det behövs; riktiga skärmbilder **visuellt granskade**, inte bara existenskontrollerade.
- Full Build plus kommersiell Chromium- och Linux-WebKit-regression, tillgängliga klickytor/tangentbord/fokus, reduced-motion, noll horisontellt overflow. Fysisk iPhone fortfarande **UNTESTED** tills kostnadsfri tillgång finns.
- Ändra inte SEO-URL/canonical/H1-intent/metadata, redan rankande internlänkar eller verifierad sponsrad attribution/subID/EPI. Aldrig påhittade offerter, live-priser, produktbetyg, personliga besparingar eller utvald billigaste leverantör utan källa.
- Mät faktisk organisk nytta och GODKÄND nätverksprovision separat från UI-test; om data saknas använd **UNKNOWN**, inte 0 kr.
- Ingen Google Drive, ingen ny betaltjänst, ingen annons, inga massutskick.
- Kvartsprisens aktiva scope-observation och upphävt försäkringssnipptest får inte oavsiktligt återstartas eller blockerar alla andra kvalitetsändringar.

## Faktiskt genomförda leveranser, inte upplevd konvertering
- **#125** – interaktivt startsideläge synligt i hero, mindre upprepad text och visuellt beslutskort. Build och omfattande regression godkända, mobil/desktop-bilder granskade, mergad.
- **#126** – trevägsvalet hjälp/jämför/förstå med omedelbar respons i samtliga fem kategorier. Build, regression och mobil/desktop-skärmbilder godkända, mergad.
- **#127** – generiska IntentGuide-sidor får SSR-takeawaykort, FAQ-liknande öppningsbara steg och bibehållna fakta/H2 samt partnerlänkar. Build och regression godkända, mergad.
- **#128** – fyra egna hushållsguider får interaktiva checklistor/progress som uppdateras lokalt; årskollen, årsöversikt, automatiska avtal, sänk fasta kostnader. Build och regression godkända, mergad. Särskild mobil-CTA-kontrast åtgärdad i release.
- **#129** – stor mörkblå guide-gateway ersatt av kompakt tvåvalsräls så användbara takeaways nås tidigare. 390/1440 screenshots granskade; Build/regression godkända, mergad.
- **#130** – årskollens redundanta '6 steg'-panel tas bort så besökaren får **själva sexpunktschecklistan först**. Build, kommersiell regression och mobilgranskning godkända, mergad.
- **#131** – dubbla hjälplänkar i alla fem kategoriheroer borttagna; de finns kvar i levande deck. Build, regression och 390px-bild granskade, mergad.

**Designoperatörens handoff:** PR #125–#131 är mergade, men kontrollera alltid senaste CI, faktiskt Pages-publicerad commit och serverat liveinnehåll. Duplicera inte redan mergat #125–131 och bygg inte en ny separat wizard eller extra menyer. Nästa pass granskar faktisk 390px resa: hem → kategori → guide/verktyg → relevant sponsrad handoff. Åtgärda bara verifierat friktions- eller textväggsproblem efter komponenternas QA. Separera CI, merge, lyckad Pages-deploy, live-domänens faktisk serverade assets och verklig kommersiell effekt.

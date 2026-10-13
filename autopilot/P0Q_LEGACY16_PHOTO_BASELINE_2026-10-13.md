# P0Q — Verklig bildundersökning av 16 äldre sidor, innan designändring

**Datum:** 2026-10-13. **Status:** QA-KANDIDAT, ENBART AVBILDNING. Noll frontendkod och noll SEO-/partnermutation.

## Faktiskt observerat / urval
P0O:s fullständiga Chromium-rendering 67 sidvägar × 390/1440 på `main` efter P0N (#157, Action #38429400126), och P0P-kontrafaktiskt test (#159, Action #38431834908), identifierade **16 unika sidvägar** där den gamla identiska CSS-bakgrunden har Pexels-ID `7019025`, utan någon riktig `<img>` i webbplatsens egna fotoelement. Spännet omfattar **10 kommersiella/guideartiklar, fem förtroende- och policysidor samt ett hushållsverktyg**. Bara vissa av de 16 ingick i föregående skärmbildssampling; denna PR tillför förstaskärms- och helsidesskärmbilder för **alla 16** i både 390 och 1440 bredd. Ingen subjektiv bedömning av kvalitet kan göras utifrån ID-inventering ensam.

## 13 fält innan eventuell faktisk produktåtgärd
1. **Användarjobb:** nybörjare ska snabbt förstå varför sidan finns, få rätt nästa handling och möta ett sammanhållet varmt premiummanus.
2. **Källbevis:** P0O JSON och real Chromium vid 390/1440; 16 vägar med ID 7019025 och CSS-bakgrund, inga riktiga foto-`img` på dessa rutter.
3. **Observation/hypotes:** generisk återanvändning är bevisad; att den uppfattas som dålig, irrelevant eller långsam är ännu *hypotes* tills riktiga skärmbilder granskats.
4. **Mätdata:** 67/67 rutter ×2 tekniskt granskade; organisk kvalificerad trafik, faktiska affiliatekonverteringar och nätverksgodkänd SEK påverkan **UNKNOWN**.
5. **Alternativ:** A byt till 16 olika okontrollerade stockfoton (avvisas), B ta bort alla foton inkl relevanta guides (avvisas), **C valt:** dokumentera alla sidtyper i 100%-rendering och gör nästa beslut per användarbehov med stor behärskning.
6. **Verifierbar leverans:** artefakten ska innehålla förstaskärm och full sida per ny route i 390/1440 = 64 nya JPG, plus P0O ursprungliga 15 representativa (31 total); inga bildrequest-fel eller overflow och exakt 134/134 sid/vypar godkända.
7. **Faktakvalitet:** inga påhittade besparingar, priser, produktbud, kundfoton eller nätverksprovisioner. Inga källans produktfakta ändras.
8. **Visuellt kontrakt:** ägarens varma naturliga foton mjukt mot varmvitt, marinblå redaktionell typografi, tydliga primärvägar; legal/policy kan behöva mer återhållsam textdesign.
9. **Kundresa:** content/trust → kategori/verktyg → meningsfullt resultat → transparent partner, utan att juridisk sida behandlas som säljlandning.
10. **Teknisk mätning:** samma deterministiska källbuild, browser viewport, CSS image computed, eager photo/nätverkslogg, artefakter och manuellt kvalitetsprotokoll.
11. **Risk/kostnad:** högst kortare Actions-körning och större bevisarkiv, inga nya betaltjänster. Extern Pexels CDN kan vara volatil; kategorier och kohorter får inte påverkas.
12. **Exakt scope:** endast ändrat `captureRoutes` i `tests/p0o-sitewide-photo-audit.spec.ts`, detta QA-beslut och befintligt foto-Actions-arbetsflöde utan ändring. All produkterad kod orörd. Skydda `/elavtal/kvartspris/` och tidigare avbrutet försäkringsexperiment.
13. **QA/rollback:** kör Build/integrity/export och P0O 134/134, ladda ned bildbevisen och bedöm 16 sidors förstaskärm/hel sida med korrekt zoom innan ny avgränsad PR. Om misslyckat, korrigera test/bevis; återställ enbart captureRoutes för rollback.

## Föreslagen nästa beslutspunkt efter bildbevis
Tänk två sidfamiljer, *inte* en universell ny bild: jämförelse-/konsumentguider behöver relevant miljö, tydlig första handling och responsivt foto; förtroende-/policy-/legalsidor ska kunna vara nästan bildfria, lugna och lättlästa. Hushållsverktyget bedöms efter faktisk första interaktion. Endast om originalfångster bekräftar behovet skapas en separat liten produkt-PR med full regression och egen-domänkontroll; ingen programmatisk utbyte av 16 bilder utan visuell läsning.

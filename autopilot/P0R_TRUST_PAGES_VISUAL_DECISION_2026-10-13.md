# P0R — Förtroendesidor utan säljbilder: sammanhållen premiumdesign

**13 oktober 2026 · KANDIDAT före QA.** Detta är en avgränsad designförändring, inte nytt innehåll, pris- eller tillväxtförsök.

1. **Användarjobb.** Besökare vill förstå sajten, hur affiliatelänkar fungerar, integritet och cookies, samt jämförelseprinciper. Behovet är läsbarhet och trovärdighet, inte köp.
2. **Källbelagd defekt.** P0Q 16-sidors Chromium-capture #38433814334 390/1440 visar att `/affiliate/`, `/cookies/`, `/integritet/`, `/om/`, `/sa-jamfor-vi/` använder samma stora mörkblå vardagsrumsfoto `7019025`, samma tyngd som kommersiella landningssidor trots helt andra läsuppgifter. P0O source-ID verifierade samma återanvändning.
3. **Hypotes skiljd från observation.** Bildens upprepning och 100 %-rendering är verifierad. Att ny redaktionell typografi känns mer förtroendeingivande är visuell hypotes och kräver riktig skärmbildsbedömning, inte ett konverteringslöfte.
4. **Utfall och intäkt.** Godkända affiliateprovisioner, kvalificerade organiska sessioner och faktisk konverteringsskillnad är **UNKNOWN**. Inga sådana anspråk.
5. **Tre val.** A byt alla fem till fem stockbilder (avvisas: bildinflation), B behåll samma säljlika hero (avvisas: upplevd splittring), C **valt:** tydligt scoped varmvit/navy redaktionell textmasthead utan extern foto-CDN.
6. **Falsifierbart.** På 390/1440 ska dessa fem ha äkta första- och helsidesbilder, rätt H1/canonical/back, inga externa CSS-hero-fotoanrop, behaglig radbredd och ingen overflow; andra sidor ska vara orörda.
7. **Konsumentfakta.** Samtliga rubriker, brödtext, policyuppgifter, källhänvisningar och eventuella upplysningar lämnas exakt oförändrade; inga påhittade garanties eller kundcitat.
8. **Uttryck.** Varmt #faf6ef, marinblå text #172946, svag naturgrön rubrikmarkör, subtilt ljus i ytan men inga stora färgblock och inga foton som antyder kund.
9. **Resa.** Besökaren kan läsa transparent redaktionell information och återgå till startsidan via befintligt ankare. Inga partnerknappar tillagda på policy.
10. **Mätmetod.** Riktig Playwright med båda skärmarna och full regressionssvit Chromium/WebKit, 20 screenshots; foto-ID och asset identitet efter release kontrolleras separat om sammanslagen.
11. **Risk och reversibilitet.** Global CSS orörd. Ny `TrustPages.module.css` klass används explicit på endast fem sidor; enkel återställning av fem klassnamn och modulen. Inga nya tjänster eller kostnader.
12. **Scope.** Dessa fem TSX, ett nytt CSS module, ett nytt test och workflow, detta beslut. Inga SEO-metadatataggar, inga partner/tracking, inga el/kvartspris, inga ändrade nedre artikeltexter eller mobildock.
13. **QA-gate.** `npm run check`, `check:integrity`, Next build/export, full befintlig kommersiell Chromium+Linux WebKit, riktade 390/1440 screenshot, kontroll att faktiskt CSS väljs/visas och att ursprungliga policytexten får plats. Merge först efter lyckad verklig bildgranskning. Ingen effektmätning här.

**Efter P0R:** Separat beslut om de tio äldre kommersiella guiderna och hushållsverktyget; aldrig blanda policy- och partnerresor i en universell visuell mall.

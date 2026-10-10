# BINDANDE — Sänk Kostnaden: sammanhållen premiumprodukt
**Ägarbeslut 2026-10-10. Status: P0D SITEWIDE-DESIGNSKULD ÖPPEN.**
**Senare och mer specifikt än** 2026-10-08 `DESIGN_SYSTEM_AUDIT_2026-10-08.md` (som föreslog grön/lime) och senare än enstaka framgångsrika kategori-PR. Ingen AI får tolka de gröna källfärgerna som ett fortsatt godkänt alternativ.

## 1. Beslutet, med användarens faktiska problem
Ägaren har besökt produktionssajten och sett en sönderhackad helhet: blå premiumhuvudsidor leder till äldre gröna kalkylatorer/undersidor med olika knappar, resultatytor och typografier. Produkten är ännu **inte** visuellt sammanhållen och ser **inte** ut som de designkoncept som godkändes den 8–9 oktober. Tidigare svar med antal PR eller gröna tester utgör **inte** ett produktkvalitetsintyg.

**Målbild — ej ny redesign:** första, lugnare premiumkonceptet med mycket luft och mindre informationsbelastning: varmvit/ljust neutral bas, marinblå rubriker/resultatområden, klarblå primär handling, skonsamma pasteller, tydlig typografi, lätt upplevd interaktivitet. Inspireras av **Lyst** (rolig navigation/lekfull precision), **The Zebra** (små intuitiva val som leder till relevanta partners utan formulärvägg) och **KAYAK** (snabböversikt följt av frivillig korrekt fördjupning). Ingen av dem är tillåtelse att kopiera varumärke eller påstådda priser.

## 2. Tekniskt konstaterad designskuld (kod granskad 2026-10-10)
- `styles/design-tokens.css` importeras på ALLA sidor via `pages/_app.tsx`, men innehåller fortfarande `--sk-canvas:#f7f8f5`, `--sk-ink:#17201b`, `--sk-accent:#dff46a`, `--sk-action:#17201b`, `--sk-focus:#426a36`. Detta är en **felaktig global källa**, inte en medveten kategorifärg.
- `styles/global.css` (~67,9 kB) sätter `body` till den gamla paletten och har många hårdkodade skogsgröna/lime-regler, trots senare blå overrides för mobilnavigation. Den får **inte** globalt sök-och-ersättas okontrollerat.
- Äldre CSS-moduler har bokstavliga skogsgröna/resultatlime-färger: `styles/FamilyMobileCost.module.css` (~7,6 kB), `FirstYearCostCalculator.module.css` (~6,6 kB), `ElectricityCostCalculator.module.css` (~8 kB), `SwitchCalendar.module.css` (~4,2 kB), `CondoInsuranceCheck.module.css` (~2,9 kB), `QuotedLoanTotals.module.css` (~4,2 kB), `ElectricitySensitivity.module.css` (~3,8 kB). `styles/App.module.css` (~30,6 kB) blandar stora mängder gammal grön och nya blå overrides.
- Blåare referenskomponenter finns redan: `styles/HomeHero.module.css`, `styles/QuarterPriceDecision.module.css` och nyare kategori-hubbar. Skillnaden på samma besökarresa är bekräftad i källan och av ägarens faktiska produktionstest.
- `pages/_app.tsx` har ännu `meta theme-color=#17201b`, som inte motsvarar blått toppfält/OS-theme.
- `autopilot/DESIGN_SYSTEM_AUDIT_2026-10-08.md` har ett **inaktuellt** förslag att behålla grön identitet. Detta dokument är historisk forskning; denna specifika aktuella ägarinstruktion och `VISUAL_UX_ROADMAP_2026-10-09.md` **har företräde**.
- WebKit-körningar på Linux är **inte** fysisk iPhone. Nytt screenshot-bevarande i PR #104 gör faktiska renderingar synliga, men grönt no-overflow-test ≠ sammanhållen visuell kvalitet. Cloudflare exakt aktiv deploy-SHA är fortfarande UNKNOWN.

## 3. Definitivt komponent- och tokenkontrakt (P0D)
Alla ytor ska använda **semantiska tokens**, inte egna paletter per kategori:
- `--sk-canvas`: varmvit/ljus neutral. `--sk-surface`: vit. `--sk-surface-soft`: dämpat blått/neutral.
- `--sk-ink`: mörk marinblå. `--sk-ink-muted`: tydlig blågrå lästext. `--sk-line`: diskret blågrå kant.
- `--sk-action`: klarblå *enda visuellt dominerande CTA* och `--sk-action-ink`: vit. `--sk-focus`: tydligt blått, 3px + offset för tangentbord.
- `--sk-accent`: sparsamt pastellfärg för icke-kommersiell hjälpsam markering — inte färg för provision eller falsk vinnarstatus.
- Även följande semantiska tokens tillåts vid behov: navy-resultatpanel, ljusblått aktivt val, mörk text på ljusa panels, varningsmeddelande med begriplig text, disabled neutralt; undvik palettbyten mellan sidtyper.
- Radius, shadow och spacing återanvänds från befintliga tokens; inga godtyckliga stora gradienter/skuggor, 9px mikrotekster eller limefärgade stora primärknappar kvar på kritiska flöden.
- Minst 44px verkliga klickytor, normalt 48px, läsbara stödtexter ≥12px och kroppstext 14–16px. Responsivt 360/390/430/1024/1440 utan horisontellt spill. Bevara redovisad källa, osäkerhet och sponsor-rel.

## 4. En sammanhängande RESA, inte fristående PR-troféer
På 390px, följ **Startsida → vald kategori → relevant guide → beslut/verktyg → resultat → relevanta sponsormärkta partners**. Varje steg ska:
1. Kännas som **samma produkt** (palett, toppfält/meny/footer, H1/H2, kort, input, val, resultatyta, kommersiell CTA/avslut).
2. Omedelbart visa en begriplig nytta inom 0–2 meningsfulla val och ha en klar primär handling per skärm; fråga inte bara för att skapa en wizard.
3. Ha fullt fungerande frivilligt exakt läge när användaren faktiskt har uppgifter; bevara prisaritmetik.
4. Skilja egen vägledning från faktisk leverantörsprisjämförelse. Aldrig påhittade sparsummor, priser, betyg, logos, prisranking eller garantier.
5. Göra oberoende jämförelsetjänst respektive enskild leverantör begripligt; tydlig sponsring och befintligt fungerande clickref/subID.
6. Behålla SEO-URL, titel, H1, canonical, search-intent, internlänkar och tillgänglighetssemantik när det är en *visuell* rättning.

## 5. Fast prioriterad designsystemmigrering (alla etapper måste slutföras)
**P0: kontrakt och visuell inventering.** Tagga varje faktisk sidfamilj *Blå/coherent*, *Mixed*, *Legacy green* eller *UNVERIFIED*. Mät källa/tokens + granska faktiska screenshots på 390 och 1440; 360/430/1024 QA. Dokumentera före/efter **sida för sida**. Ingen ny framtida AI-mockupp ska ersätta verklig rendering.
**P1: global foundation och kritisk användarresa.** Uppdatera semantiska tokens, OS-theme och existerande kritiska gränssnittsytor i små reversibla förändringar. Bevara CSS-specificitet och jämför faktiska bilder; *inte* 68kB global.css-blindrensning.
**P2: de verkliga specialistverktygen.** Migrera `FamilyMobileCost`, `FirstYearCostCalculator`, `ElectricityCostCalculator`, `SwitchCalendar`, `QuotedLoanTotals`, `CondoInsuranceCheck`, `ElectricitySensitivity` och andra identifierade moduler till samma komponentklasser/färger/CTA/typografi; arbeta per sammanhängande sidfamilj så att ingen besökare följer blått → grönt.
**P3: app/kategori/guide/resten.** Rensa äldre gröna globala regler och `App.module.css` **endast** när relevanta visuella tester och kodbevakning skyddar tidigare beteende. Upprepa mobilförstasida, partnerhänvisning och resultatsteg för minst en sida i varje kategori.
**P4: avsluta designskulden först efter VERIFIERING.** Granska konsekvent 360/390/430/1024/1440 och verkliga screenshots, tangentbord/fokus, kontrast och läsbarhet. Hela sajtens design måste vara sammanhållen, inte bara startsidan; samtliga kritiska moduler ska ha bytt bort legacy green. Slutstatus först efter verifierat publicerat innehåll och bred visuell granskning. Logga kvarstående hårdkodning som skuld, inte som 'klart'.

**Affärsspåret går parallellt:** den stora flaskhalsen är kvalificerad organisk trafik, fortfarande få Google-klick utanför `/` och `/app/`. Färsk godkänd affiliateprovision kräver faktiskt network-side data och kan vara UNKNOWN. Utveckla endast riktiga kostnadsfria målgruppsvägar utan massutskick/betaltjänster; gör inte ännu ett generiskt informationskort medan P0D blockerar helhet.

## 6. Scopekontroll och skydd för pågående arbete
- **P0D är en visuell kvalitetssanering, inte ett uppmätt CRO-vinnarexperiment**. Bokför inte redesign som garanterad ökad godkänd provision. Max två oberoende experiment enligt `policy.json`, och ändra inte `/elavtal/kvartspris/` som har en aktiv avgränsad innehållsobservation utan separat riskprövning.
- En förberedd isolerad **BRF-förfrågefunktion på branchen `growth/brf-insurance-board-template-20261010`** är uttryckligen **PAUSAD** före PR/merge (inte live). En ny styrelsemeddelandeknapp är inte rätt lösning på den större bristen; återuppta bara efter att berörd försäkringssidfamilj ser sammanhållen ut.
- Fullt 13-fälts evidensbeslut före större material UX-/säljändring; minst status quo + två verkliga alternativ, risker och rollback. En ren semantisk designkorrigering kräver beslutad målbild, scope och verklig verifiering; blanda inte in ranking/prisbeslut.
- Varje visual-PR måste ha Build, check/integrity/export, 360/390/430/1024/1440 Playwright, bilder sparade via CI och **granskade**, screenshotjämförelse för berörda sidor, 22 WebKit tests, fortsatt korrekt kalkylaritmetik och affiliate-clickref/rel. Merga bara om QA är grön och visuell helhet stärks.
- Fråga ägaren enbart vid kostnad, juridisk/partneravtalsförändring eller materiellt nytt koncept. Den här designriktningen är redan godkänd. **Rapportera faktisk leverans och kvarvarande skuld — aldrig 'hela sajten färdig' från ett smalt PR.**

## 7. Nästa operativa operation – inte ännu en fristående widget
1. Migrera det globalt importerade `styles/design-tokens.css` från grön till marinblå/varmvit och rätta därefter representative specialistverktyg genom **samma tokens** (först låne- och familjemobil/BRF-verktyg med separat QA).
2. Stoppa inflöde av nya gröna CSS i CI med linter/test för migrerade moduler; inte blockera hela den stora äldre CSS-basen innan migration.
3. Granska screenshots över faktisk resa före/efter och visa rimlig helhet, uppdatera statuskartan per sidfamilj, därefter fortsätt till nästa grupp utan nytt ägarbeslut.

# Driftbeslut 2026-10-20 — verifiera publicerade kvartspriser

## 1. Målgrupp och uppgift
Svenska hushåll behöver korrekta kvartsprisdata; driftoperatören ska veta om den publicerade sajten faktiskt visar samma priser som den senaste GitHub-uppdateringen.

## 2. Referenser och kunskapsgräns
Bindande produktdesign, policy.json, spot-price-refresh.yml, spotPriceFeed.mjs, release-context och Issues #164/#172. Cloudflares privata byggloggar är inte tillgängliga i denna anslutning; den historiska orsaken till 19 oktober-försöket kan därför inte fastslås.

## 3. Självständig slutsats
Den misslyckade Pages-publiceringen för d178978 den 19 oktober följdes den 20 oktober av lyckad Cloudflare Pages-check för 9e90d09. Ett separat Workers Builds-check misslyckas även för den lyckade Pages-commiten och är ett sedan 13 oktober känt annat driftspår (#164). Utvärdera inte en röd Workers-check som bevis på nedtid för Pages.

## 4. Egen evidens
GitHub check-runs för 9e90d0982747aef596eebc6fc205fa7af6d2a302: Cloudflare Pages conclusion=success, title Deployed successfully, immutable preview https://a6ab365f.sankkostnaden.pages.dev. Workers Builds conclusion=failure. GitHub committed latest.json för 20 oktober har SE1–SE4 med 96 kontinuerliga kvartstider i varje område, giltig spot-enhet och explicita exklusioner av moms, elskatt, nätavgift och leverantörsavgift. Detta bevisar inte i sig vad egen domän serverar.

## 5. Alternativ och prioritet
A) Status quo: enbart Pages-check; låg kodrisk men fel på egen domän eller gammal cache kan missas. B) Vald: ett smalt, läsande GitHub Actions-verifieringsjobb efter prisuppdateringar, som matchar exakt Pages-commit, preview och egen domän. C) Flytta prisdata eller skapa ny driftstack; oproportionerlig risk och eventuellt ny tjänst. Inga förändringar av Workers-projektet från GitHub utan identifierad Cloudflare-konfiguration.

## 6. Hypotes och avgränsning
Om dagens datacache når både preview och egen domän ska en automatisk kontroll ge PASS för exakt samma JSON; annars ett ärligt driftfel. En grön Cloudflare Pages-check ensam får inte längre beskrivas som bevis för färsk domäncache. Ingen prisförändring, UX-ändring eller kommersiellt experiment.

## 7. Innehålls- och beräkningssanning
Verifiera SE1–SE4 kvartsvärden, DST-dagslängd (92/96/100), kontinuitet, källa och uttryckliga exklusioner. Lägg inte till schabloniserade påslag eller påhittade elleverantörsofferter. Källa är Elpriset just nu.se spotdatakälla.

## 8. Visuell och funktionell hierarki
Ingen sidkod eller CSS ändras. Godkänt marinblått/varmvitt koncept och användarresan lämnas orörda. Workflow skriver bara verifiering till GitHub Actions, inte UI.

## 9. Intäktskedja
Ingen påverkan på registrerade affiliatelänkar, sponsorrel, EPI, subID eller partnerordning. Det här är inget intäktsexperiment. GODKÄND provision kvarstår UNKNOWN utan nätverksledger.

## 10. Mätning
Separata indikatorer: publicerad Pages-commit, verklig preview-JSON, verklig domän-JSON och GitHub testresultat. Fail om den egna domänen inte får samma prisdata inom begränsad tid. Ingen organisk trafik eller sponsorklick härleds av driftskontrollen.

## 11. Risk och rollback
Läsande kontroll med endast contents:read och checks:read, inga betalverktyg/hemligheter utöver GitHub standard-token. Risk: övergående CDN-fördröjning/nätverksfel ger falskt rött test; därför begränsade återförsök och tydlig feltext. Rollback: revert av en workflowfil. Max sex filer per scope hålls.

## 12. Beslut
Genomför en isolerad automatiserad driftkontroll och öppna PR. Merga först efter att CI har visat att källformatet passerar på PR. Stäng incident #172 när återhämtningen är korrekt dokumenterad. Håll separat konfigurationsproblem #164 öppet tills Cloudflares faktiska Workers-koppling avaktiverats eller lagats av behörig åtkomst.

## 13. Verifiering och uppföljning
PR-grind: befintlig Build/check/integrity/export plus nytt format-test. Main-grind: exakt Cloudflare Pages success-check följt av JSON-likhet på immutable preview och sankkostnaden.se. Separera användbar Pages-release från röda Workers Builds. Rapportera inget live-PASS innan det faktiskt gått igenom. Inga förändringar av /elavtal/kvartspris/-kohort eller historiskt avbrutet försäkringstest.

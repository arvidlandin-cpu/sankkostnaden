# P0S — En sammanhållen design för de sista elva äldre sidorna

Datum: 2026-10-13. Status: QA-kandidat, inte produktionspublicerad innan kontroll.

**Källobservation:** P0Q #160 visade att exakt tio äldre guider samt Hushållskostnadskollen fortfarande använde identiskt CSS-bakgrundsfoto (Pexels 7019025). P0R #162 avgränsade redan fem policy/förtroendesidor och är sammanslagen. Allt detta kan kontrolleras i verkliga Chromiumbilder, inte bara genom kod.

**Användarjobb:** En nybörjare ska förstå sidan och hitta första användbara åtgärden utan att behöva läsa en stor, mörk säljruta. Teknikanvändaren ska se bara relevanta kategorier innan han/hon har valt att fylla i belopp.

**Tre alternativ:** (A) elva olika stockbilder avvisas; (B) samma foto behålls avvisas; (C) vald: använd redan kontrollerad bildfamilj i bredband/el (Pexels 4260743/8055828 via äkta srcset), en lugn ljus textmasthead för fyra hushållsguider och en mer lättanvänd kategoriväljare i verktyget. Foto i verktyg tillför inget till användarens jobb.

**Exakt scope:** tre bredbandsguider, tre elguider, fyra hushållsguider, ett hushållsverktyg, en explicit scoped CSS-modul och fotografikomponent. Ingen global CSS. Alla canonical/meta/schema/partnertrackers, CTA-mål, uppgifter, beräkningar, återstående nyckelfunktioner och pågående /elavtal/kvartspris/ observation orörda.

**Visuell kvalitetshypotes:** Varmvit, marinblå och dämpat grön huvudpalett; tydlig läsbarhet; mindre mörka block; relevant foto enbart för kommersiella guider. Uttrycket kan godkännas först efter verklig desktop/mobil screenshotgranskning.

**Regressionsskydd:** npm check, integrity, Next build, export, redan existerande Chromium/WebKit commercial smoke + ny separat P0S-riktad Playwright för 11×390/1440 och interaktion i hushållsverktyget. Varje filversion och partnerlink ska bevaras; QA får inte klicka outbound.

**Mätning:** Affiliateintäkter, faktiska relevanta sessioner, SEO-positioner och konvertering före/efter är okända. Ingen icke-verifierad effekt utlovas. Inga nya betaltjänster.

**Stop/rollback:** Merge ej tillåten om byggnad, kommersiell regression, bilder, canonical, kategoriväljare eller mobil-overflow fallerar. Separat git revert av P0S återställer tidigare utseende utan datamigration.

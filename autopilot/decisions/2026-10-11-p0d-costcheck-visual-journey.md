# P0D Kostnadskollen — beslut 2026-10-11

1. Krav: varmvit/navy/blå design, inga gamla limeytor.
2. Bevis: main-run 38112168428, artifact 11691808125, bilden p0d-costcheck-early-chromium-390.png visar grön resultatetikett.
3. Besökare: hushåll som söker första begripliga kontrollpunkt.
4. Resa: startsida → app → första svar → väg vidare → fullständigt resultat.
5. Status quo: äldre grön grund-CSS döljs av sena blå overrides.
6. Alternativ: total omskrivning av App.module.css, hög risk.
7. Valt: avgränsad tokenmigrering och konsekvent blå resultat/CTA.
8. Risk: specificitet, mobil, kontrast, fokus.
9. Partners: ingen ändring av affiliate-URL, sponsorrel, EPI eller sortering.
10. SEO: canonical, H1, URL och innehåll oförändrade.
11. QA: Build, Chromium/WebKit, fem bredder, före/efter-bilder.
12. Affär: visuell QA är inte godkänd provision eller konverteringsbevis.
13. Rollback: revert PR vid regression; fortsätt sedan med kvarvarande global.css och guider.

P0D helhet förblir öppen tills samtliga sidfamiljer granskats.

# Visual direction decision — homepage v1, 2026-10-08

Owner instruction: move AI design forward IMMEDIATELY after deep comparative analysis. Scope: semantic tokens, homepage hero readability, main CTA hierarchy and small navigation typography. Overall site redesign is NOT complete.

## Sources and current state

- Current code inspected 2026-10-08: HomeHero has a strong photo-led dark hero and white task card. Card offers Kostnadskollen and five category links, all previously similar white buttons; multiple mobile descriptions were 8.8–10.5px. Home.module.css had 9px tool labels. Category pages, guide pages and app currently have several independently defined tokens/navigation treatments.
- Elskling (https://www.elskling.se/, observed 2026-10-08): one obvious primary price-comparison journey, clear promise and trust proof; unlike our site it has live quotes and may collect contact details. Do NOT mimic its quote capabilities.
- Bredbandsval (https://www.bredbandsval.se/, observed 2026-10-08): clear address-search-first call to action, identifiable providers and concrete price/service descriptions. We lack their address/offer feed; the transferable lesson is decisive hierarchy.
- Compricer electricity (https://www.compricer.se/el/, observed 2026-10-08): begins with simple housing-type choices and progressively requests exact invoice data. The lesson is progressive disclosure, not a verified conversion benchmark.
- The old user screenshot showed hidden provider lists, overlapping modules and tiny caption text; category code was rebuilt in later PRs. Do not claim that outdated screenshot depicts today's live page.
- GSC/GA4 baseline was 35 Google clicks/22 organic sessions and last approved commission zero; traffic is too low for conversion causal claims.

## Two full alternative architectures compared

**A. Restrained editorial page** — headline, a single main CTA, optional categories on the next screen. Less density, calm and distinctive, but categories are harder to access for users who already know their task.

**B. Compact decision dashboard (selected incremental deployment)** — preserve existing two-column desktop stage and white task panel, emphasize Kostnadskollen as sole dominant lime action, keep five separate neutral category routes, increase mobile text and reduce unsupported personalized-savings promises. Better preserves direct access and current SEO without drastic behavior changes, but mobile fold/density requires screenshot review. Neither architecture is claimed to be empirically best.

## Thirteen design and QA decision gates

1. **User:** A beginner suspects overpayment but may not know costs/contract terms; expert needs direct category access.
2. **Purpose:** Exactly one visually strong initial decision, with five clearly secondary optional choices.
3. **Correct copy:** One question now gives provisional next step; no price/savings/winner implied.
4. **Colors:** Existing forest #17201b, warm-white #f7f8f5 and accent #dff46a; semantic CSS roles, not ad hoc greens.
5. **Type:** Inter/system, HomeHero secondary small text >=12px on mobile, no forced decorative diminutive labels.
6. **Interaction:** Primary button >=66px; secondary category routes 54-56px with accessible names.
7. **Mobile:** At 360, 390 and 430px, inspect actual line wraps, proof strip density, first-action visibility and overflow.
8. **Desktop:** At 1024 and 1440px, preserve usable two-column hero and route legibility.
9. **Focus/accessibility:** Outline visible independent of background color; test computed CSS and keyboard focus. Full contrast study still outstanding.
10. **SEO:** Preserve existing route, H1, canonical, title, image resources, major content intent and current indexation.
11. **Trust:** Inform visitors that there are no fetched personal prices at our site; do not invent supplier logos, prices, approval scores or social proof.
12. **Commercial hypothesis:** Better hierarchy could improve relevant subsequent decisions, tagged qualified partner clicks and approved affiliate income, but that effect is UNKNOWN until there are real users.
13. **Verifier:** Design-token import, Playwright screenshot capture 360/390/430/1024/1440, computed font test, main CTA color test, all five category routes, focus and no-overflow checks, existing commercial regression, static build and SEO integrity. Small reversible PR.

## Explicit remaining work

Once CI is green, retrieve and subjectively review real latest-run screenshots; full cross-page visual inventory; visual A/B mockups of editorial vs task dashboard; unified navigation, spacing, cards, disclosure, verified logo treatment and accessibile contrast across homepage, app, five categories and original guides/tools. Do not call masterplan's design phase complete until reviewed screenshots and all page-family QA pass. Keep qualified acquisition work active independently.

## Real rendered screenshot review added 2026-10-08

GitHub Actions previous category artifacts were downloaded and inspected at 390px and 1440px. Current homepage design-v1 screenshots were captured from the branch as full-page Chromium artifacts (workflow run 37755772391) and manually inspected at 390px and 1440px. Observations:
- Desktop has **three separate direct-category navigation locations** in the first two screens: top nav, five rows inside hero card, and visually rich "Populära jämförelser" category cards immediately below hero. The redundancy needs further user-based assessment on desktop; no automatic removal where immediate direct paths might matter.
- Mobile has the **same five categories repeated** in the hero card, in an always-visible fixed bottom navigation and again below the hero in popular cards. The fixed bottom dock overlays the area-list portion as the visitor scrolls, while useful proof/content starts late. This is an observed visual duplication problem, not merely a source-code guess.
- Therefore use a **mobile-only simplification** up to 600px: hide five redundant hero-category rows and the related divider but keep all 5 categories immediately visible and clickable in the persistent bottom bar, explain that route next to the main CTA, and keep category-image links lower in the page. Desktop retains category rows while further direct-journey evidence is gathered. This shortens the mobile journey and makes the single main task prominent without making category alternatives inaccessible.
- Regression assertion checks all five bottom bar direct URLs visible at 360/390/430, corresponding duplicate hero links hidden, main CTA visible, and no horizontal overflow.
- Important: screenshot captures are actual browser renders on the build branch, not proof of live Cloudflare deployment or validated conversion uplift. Re-capture after merge and audit all other page families separately.

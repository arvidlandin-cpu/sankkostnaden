> **HISTORISKT DOKUMENT — INAKTUELL GRÖN REKOMMENDATION.** Ägarens senare beslut 2026-10-09 och förnyade uttryckliga överstyrning 2026-10-10 väljer marinblå, klarblå, varmvit design, inte skogsgrön/lime. Aktuell bindande källa: [UNIFIED_PRODUCT_DESIGN_2026-10-10.md](UNIFIED_PRODUCT_DESIGN_2026-10-10.md). Längre ned bevaras 8 okt-auditen som historiskt forskningsunderlag men dess färgrekommendation får inte återinföras.

# Design-system audit — Sänk Kostnaden, 2026-10-08

**Status: SOURCE/CSS AUDIT COMPLETE, LIVE VISUAL EVALUATION AND REDESIGN NOT COMPLETE.** This report is the immediate design branch of the owner's approved masterplan. It must not be reported as proof that every actual screen looks good. No production styling was changed by this documentation.

## Observed from the current source, not invented visual claims

1. **A workable brand palette already exists.** `styles/global.css` uses surface #f7f8f5, body ink #17201b, lime accent #dff46a. `HomeHero.module.css` uses dark full-photo hero with strong overlay, cream card and green-yellow accents. `styles/ElectricityMarketGateway.module.css`, shared across the newly rebuilt electricity/broadband/mobile/insurance hubs, also uses #1b2c23, #eef6e5, #e0efca and other neighboring colors, with hardcoded component-specific shadow/radius/font choices.
2. **Multiple UI systems coexist.** Home navigation is in `styles/Home.module.css`; category/guide navigation is in `styles/global.css`; Kostnadskollen has a separate `styles/App.module.css` and distinct page structure. Shared category market cards provide *some* consistency, but the product does not yet have one design-token source, one consistent reusable navigation, or a documented typographic scale.
3. **Large style surface and overrides.** `styles/global.css` is ~66 KB and contains many component- and breakpoint-specific rules. Repeated hardcoded color/size tokens make later rebranding, accessibility review and QA expensive. This is a maintainability observation, not proof of a broken rendered layout.
4. **Potential legibility issue to verify in screenshots.** In `HomeHero.module.css`, mobile category secondary labels and card hint are ~9.5px and proof-strip small labels reach 8.8px. The current yellow/green/gray-on-cream and over-photo variants need objective contrast checks and real device reading tests; automated no-overflow tests alone do not establish good readability.
5. **Visual density and hierarchy to scrutinize.** On mobile the homepage hero includes a lead, a white start card, primary Kostnadskollen path, five category rows and a four-part proof strip. Category pages display up to 12 logo links plus guidance cards; all options being visible is a product win but can also create an excessive vertical page. The design must make the primary decision obvious without suppressing real partner transparency.
6. **Logos are not complete verified brand assets.** Current hubs commonly render 48px frames with favicon URLs from Google's public favicon service; these may be small, inconsistent, visually unfamiliar or broken. Do not promise official high-resolution logos without checking rights and authenticity. Ensure a graceful brand-text fallback.
7. **No proven commercial visual winner.** Responsive Playwright assertions have tested major flows, but the P0 visual QA ledger still calls for human review of screenshots at 360/390/430/1024/1440 and whole-page comparative evaluation. Actual visual appeal and sales uplift cannot be derived from passing CSS/overflow tests.

## Recommendation: make the brand more premium, calm and clear — not louder

**Keep the existing recognizable dark-forest, warm-white and restrained lime identity.** Replace inconsistent minor shades with a semantic design system, not random category-specific themes. This is a proposal, subject to the actual visual audit. The lime accent is high-energy and should be reserved for one principal action/focus/signal per screen, not all cards. Warm whites and high-contrast dark text build trust. Avoid finance-claim urgency signals and overdecorating educational sections.

Candidate tokens for phase 1 (not yet deployed):
- Ink `#17201b` — main headings, high-legibility text, solid-primary button background.
- Canvas `#f7f8f5` — neutral backdrop.
- Surface `#ffffff` — decision cards/forms.
- Highlight `#dff46a` — important emphasis and active choice when contrast verified.
- Muted text — candidate `#55645a`, verify WCAG contrast at rendered font size.
- Borders `#dce4d9`; faint surface `#f2f6ec`.
- Systematic radii (8, 12, 18 px) and spacing (4/8px base scale) with intentional page-level exceptions; reduced shadows/gradients in comparisons.
- Font Inter/system, scale for H1/H2/H3/body/notes; **avoid customer-action microcopy below 12px** on mobile where feasible.

## Why the design must exist

- Primary users have low contract/pricing knowledge: they should understand the service on the FIRST 360px screen. One main promise and one main next action. Follow-up paths are secondary, not 5 competing luminous CTAs.
- User trust depends on restrained but high-quality typography, truthful content, legible disclaimers and recognisable brands.
- Partner options should be clearly visible **without** visually suggesting that every partner is equally suited or that brand order is a live-price winner.
- A design system must make the experience recognizably Sänk Kostnaden from home to category to guides/tools to partner exit, even when those screens differ in their actual task.
- Every color/emphasis/button/component must have a documented functional purpose. Color should identify action/state, not commission level.

## Required complete verification before design can be marked DONE

1. Capture **real rendered screenshots** from latest deployed main, not branch mocks, for homepage, /app/, /elavtal/, /bredband/, /mobil/, /forsakring/, /ekonomi/, representative tool and guide. Each at 360, 390, 430, 1024, 1440 widths (desktop screenshots not substitutes for actual iPhone testing). Record screenshot location and deployment SHA; sample below and above the fold.
2. Audit first-screen message, main action count, view hierarchy and readability. Pay attention to dark photo overlay / white start card, 5 category choices, trust strip, small captions, component vertical length, transparent commercial labels and topbar.
3. Perform keyboard tab/focus, target size, contrast and link functionality checks, including non-text and hover/pressed states; run Lighthouse/axe where available. Avoid claiming AA until measured.
4. Benchmark dated comparable leading Swedish sites and one original out-of-category service for readability, time to first answer, partner visibility, density, reassuring trust and mobile funnel; note whether conclusions are observation or unverified hypothesis. Do not copy brand/trademark layouts.
5. Prototype **two coherent page-family approaches**: A) restrained editorial/guided assistant for first-screen novice, B) concise decision dashboard/transparent provider directory. Show actual **before vs after** at 390 and 1440, then choose per user job, not aesthetics alone.
6. Implement a **single reusable token system** in a dedicated CSS or theme module, migrate navigation/body/CTA typography/spacing/colors in controlled slices; refactor hardcoded duplicates, but preserve individual page SEO, tracking, performance and business semantics.
7. Prioritize **homepage + /app/** first, as baseline GSC indicates these together received 33 of 35 Google clicks; next newly rebuilt category hubs and partner-card presentation; then guides/calculators. Finish /ekonomi/ consumer journey safely.
8. Confirm partner names/logo treatments in 48px frames have verified asset rights or readable no-logo fallback. A favicon alone is not an official brand logo.
9. Validate mobile breakpoints, visual snapshot comparisons, contrast, keyboard and real links in automated CI; manually review non-obvious subjective problems.
10. Include an audit trail for each PR: user problem, comparator, original before/after, reasoning for colors, hierarchy/typography/logo/screen composition, limits, QA evidence, rollback, and actual qualified-traffic/revenue metrics **only** when substantiated.

## Acceptance criterion and sequencing

The design work is complete only when **all critical page families share coherent tokens, navigation, type hierarchy, trust/disclosure and clear mobile-first action design**, final real screenshots and accessibility checks are reviewed, and no partner tracking/SEO regression occurs. Approval of a visual architecture does not require waiting for new traffic; however any claimed conversion superiority or approved revenue improvement requires real qualified data.

**Execution priority:** P0 visual and product design audit is open and should be actively undertaken in parallel with *at least one* independent high-quality traffic-acquisition workstream. Do not defer audience growth until redesign finishes. Avoid unvalidated massive sitewide CSS changes in a single release. Record status in `MASTERPLAN_EXECUTION_2026-10-08.md`.

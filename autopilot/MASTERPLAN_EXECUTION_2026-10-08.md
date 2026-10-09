# APPROVED Masterplan — execution program, Sänk Kostnaden

**Approval:** user explicitly said "kör masterplan" on 2026-10-08 following comprehensive analysis. Product target: best attainable Swedish no-login consumer cost decision companion for low-knowledge households, with durable long-term **approved affiliate revenue per relevant visitor**, truthful offers and trustworthy discoverability. This file is the current **implementation ledger**, not a second proposal. Keep it updated as milestones complete.

Read also: `autopilot/PRODUCT_EXCELLENCE.md`, `STRATEGY_AND_EVIDENCE_STANDARD.md`, `PLAYBOOK.md`, `COMPETITOR_INTELLIGENCE.md`, `policy.json`, `state.json`, `opportunities.json`, and current GSC/GA4/network reports. The original user-approved full analysis is available in the conversation as `Sank_Kostnaden_Totalanalys_Masterplan_2026-10-08.md`; this repo ledger captures the operational milestones and requirements independently.

## Release sync 2026-10-09 — READ BEFORE ANY NEXT STEP

The source of truth for shipped/ongoing work is **`autopilot/release-context.json` plus current `main` code**, not this document's Oct 8 baseline or ChatGPT memory alone. The automated decision packet now includes a release summary. The last *confirmed* main application release in this snapshot is `a067020d`. Quality CI succeeded for latest main at review; Cloudflare production version and real approved affiliate conversion after release remain unverified.

- [x] PR #71: homepage goal explorer / guided first question, avoiding duplicated category cards. [x] PR #72: Tibber SE Adtraction link; active electricity program count changed to **13** (Elskling comparison + 12 direct suppliers). Never turn supplier directory into unsourced price ranking.
- [x] PR #73: approved design plan changes *proposed final identity* to calm warm-white, dark-blue/blue with restrained pastels and more whitespace; detailed implementation across home /app/ categories is **not yet shipped**. Lyst / The Zebra / KAYAK remain inspiration, not conversion evidence.
- [x] PR #74: real automatic quarter-hour market spot-price feed for SE1–SE4, with first Oct 9 fetch confirmed 96 periods per area, no API credential; price is **spot only**, not user quote or retailer ranking.
- [x] **PR #77, 2026-10-09 Elpriskollen 5.0:** Rebuilt spot viewer using actual 15-minute bars and exact quarter slider, quickest upcoming continuous two-hour cheap window and honest optional day-specific shift simulation using consecutive two-hour windows. Visual QA inspected generated 390/1440px screenshots; branch Next build and 188 Playwright browser cases green. Removed duplicate contract-guidance box below widget while retaining guide CTA if feed is missing. Existing partner links, canonical and SEO pages untouched. All sitewide visual modernization remains open. Subsequent scheduled refreshes require monitoring.
- [x] PR #75: day-specific expandable 0–10 kWh consumption-shift scenario using actual quarter-hour spot prices and a disclosed eight-cheapest/eight-most-expensive-quarter illustration. Not a forecast, not annual savings, not a full bill calculation. CI build and commercial smoke green.
- [ ] Verify Cloudflare current publication for PR #77 (not only a green branch test), refreshed API JSON, dates and actual 15-min chart/mobile functionality without claiming success from merge alone. [ ] Complete human visual/accessibility checks and publish design changes in bounded PRs. [ ] Track real qualified organic traffic, EPI/subID partner attribution and **approved** revenue; all commercial uplift remains UNKNOWN.
- [ ] Open PR #48 is a distinct *hypothetical* quarter-hour explainer and remains **unmerged**; review redundancy with newly shipped PR #75 before making changes. Avoid parallel changes to the same electricity journey.
- These releases **do not** supersede existing SEO, affiliate fairness or evidence-first gates. Do not duplicate completed features or restart old PRs. New price-data visualization must remain optional within the low-friction partner journey.

## Baseline verified on 2026-10-08

- 30-day GSC: 1,265 impressions, 35 Google clicks, avg position 38.6; 26 clicks /app/, 7 homepage, **2 other content page clicks**.
- GA4: 369 total sessions; 22 organic search sessions, 11 organic active users.
- Affiliate networks: **0 approved transactions and 0 kr approved revenue**. Adtraction after attribution deployment 4 clicks / 2 correctly tagged, too little for conversion optimization. Old/test-heavy network-click totals cannot stand in for qualified organic visitors.
- 37 active affiliate programs encoded across el(12), bredband(3), mobil(10), forsakring(9), ekonomi(3). Coverage is NOT the whole Swedish market; static partnerRankScore is NOT a live price ranking.
- User feedback: hidden logo inventory, tiny logos, redundant choice panels and nearly identical provider cards. Source code confirms 2 direct cards, a matching question, 3 proposed cards, and a collapsed 12-brand directory in the former electricity matcher.
- Commercially meaningful unknowns: actual unique organic partner-exposure rates, real approved EPC, relative competitor conversion and full quote-feed availability.

## Phase status and owner-decision gates

### P0 — Quality and verification

- [x] Fix incorrect regression assertion searching random session ID digits in serialized analytics event; replace with event-key safety inspection. **PR #49**, merged to main 2026-10-08, branch Build and full commercial browser suite green.
- [ ] Record reference screenshots / visual judgment for real production mobile (360/390/430) and desktop (1024/1440) after each major design ship; automated overflow alone is insufficient proof of visual quality. Compare first-screen clarity, tap/keyboard access, contrast, actual supplier branding.
- [ ] Inventory active partner URL health, redirect destinations, tagged click identifiers, brand-logo usage permission/quality and coverage by category; fail rather than invent logo/offer information.
- [ ] Continue checking post-merge Build, full commercial regression, BrowserStack/live production routes for PR #57 and PR #58. Branch tests green; track real deploy and partner click attribution before declaring commercial success.

### P0D — Sitewide visual design, layout, identity and readability (**audit started, release outstanding**)

**Uppdaterad visuell målbild 2026-10-09:** ägarens bildfeedback väljer en lugn, luftig blå/mörkblå premiumkänsla från första designkonceptet (färre samtidiga element), framför tidigare skogsgrön/lime-hypotes. Se **`autopilot/VISUAL_UX_ROADMAP_2026-10-09.md`** för 4-stegs operativ designplan, skarpa godkännandekriterier och första pilot. Detta uppdaterar designriktningen, inte redan levererade produkt- eller SEO-beslut.

- [x] Completed initial **source-level** comparison of homepage, Kostnadskollen, global CSS and four newly rebuilt category hubs. Found inconsistent independent navigation/layout systems, hardcoded near-identical green shades, microcopy under 12px on mobile, dense homepage entry card, favicon-based partner 'logos' and incomplete real screenshot review. Details and source-backed reasoning in `autopilot/DESIGN_SYSTEM_AUDIT_2026-10-08.md`.
- [ ] Take real production screenshots across home, /app/, 5 categories, original tools and guides at 360/390/430/1024/1440; conduct **subjective visual** first-screen, typography, tap/keyboard, contrast and partner-brand review. Screen overflow tests alone do not prove quality.
- [ ] Develop one consistent design-token and navigation/CTA/type system **using approved dark-navy/blue/warm-white/pastel direction from the Oct 9 visual roadmap**, with unified card and disclosure patterns. Do not simply increase all buttons or blindly duplicate category pages.
- [ ] Prototype coherent page-family design alternatives and demonstrate mobile/desktop before-after before large styling changes. Roll out in measured slices (homepage and /app/ first, then categories, then tools and guides), with complete QA.
- [ ] Validate logo asset rights and quality; favicon is not the same as a reliable brand logo. Keep legible text fallback and honest sponsorship labels.
- [ ] Continue nonpaid qualified acquisition and revenue tracking in parallel; design must not become an excuse to remain invisible to users.

### P0E — Progressive, interactive tools + early qualified partner options (**owner approved; implementation prioritized**)

- [x] Audit current empty-form complexity and real screenshots of electricity 2-offer calculator and family mobile total-cost calculator; also inspected first-year mobile/broadband, household, loan and specialist tools. **Implementation contract:** `autopilot/PROGRESSIVE_UX_COMMERCIAL_MASTERPLAN_2026-10-08.md`.
- [x] **P1 electricity (PR #64, 2026-10-08):** choose **have two real offers?** first; no-offer route goes straight to an eligible real comparator; yes-offer route progressively reveals only prices and necessary fees, with clear assumptions and exact calculations. Partner selection accessible without completing the form.
- [x] **P2 family mobile (PR #65, 2026-10-08):** persons + have real prices? first; no-price route yields relevant family-provider options and checklist; exact quoted cost input optional and progressive; never invent discount.
- [x] **P3 shared first-year comparison (PR #66, 2026-10-08)** mobile/broadband: progressive campaign/fee fields, no-obligation partner route, correct network/availability caveats.
- [x] **P4 household cost map (PR #67, 2026-10-08):** select few known bills, known subtotal, optional other categories; preserve privacy and /app/ handoff.
- [x] **P5 specialist loan/insurance/contract UX (loan PR #68, insurance coverage PR #51, 2026-10-08):** example first where suitable, safe exact mode, relevant partner CTA only after true fit and clearly marked sponsorship.
- [x] P6 targeted specialist audit on 2026-10-08: `SwitchCalendar` has 2 inputs + 1 unit select, `CondoInsuranceCheck` uses three click options without inputs, and `ElectricitySensitivity` offers an immediate illustrative result. No redundant new wizard is justified. `CostRealityCheck` is a secondary specialist guide utility; optional campaign entry is already progressive. Keep observing before restructuring.
- [x] Source-level validation and full branch Build/commercial regression passed for PRs #64–#68; required click-first, first useful value and privacy-safe analytics tests were added for all changed calculators. **Actual approved affiliate income remains unverified.**
- [ ] Complete post-main live Cloudflare Pages, real iPhone/browser screenshot, 360/390/430/1024/1440 visual read-through, accessibility contrast, partner clickref and approved-sale validation after final PR #67 deployment. CI/overflow is not a substitute for subjective visual QA.

### P1A — Electricity product category (**shipped to main in PR #50**)

- [x] Replace hidden/quiz-gated electricity partner journey with coherent direct/comparison split on /elavtal/. 1 actual compare service (Elskling), 11 named direct suppliers alphabetically, all actual existing affiliate links; no fake price ranking.
- [x] Distinct novice guide and precise annual-cost calculator route. No duplicated mandatory quiz.
- [x] Evidence/decision file in `autopilot/decisions/2026-10-08-masterplan-electricity-journey.md`; branch complete commercial regression and Build successful at merge.
- [ ] Verify deployed site after Cloudflare production propagation and later qualify actual organic click/approved revenue. Do NOT call this experiment a conversion win yet.

### P1B — Bostadsrätt insurance original utility (**shipped to main in PR #51, independent category**)

- [x] Add two-step coverage checklist to existing /forsakring/hemforsakring-bostadsratt/ answering whether association has collective bostadsrättstillägg and whether visitor has ordinary home insurance.
- [x] Every result provides conservative next checks; never advise cancelling private coverage automatically; cite Konsumenternas and make assumptions explicit. No invented premium, savings or advice on a named insurer.
- [x] Existing H1, canonical, SEO guide path, no overflow, keyboard buttons and source links verified; full branch commercial regression and Build passed. Merged as PR #51 (2026-10-08). Post-main prod check pending.
- Evidence in `autopilot/decisions/2026-10-08-masterplan-condo-coverage-check.md`.

### P2 — Kostnadskollen as signature no-data entry (**shipped to main in PR #53**)

- [x] /app/ now returns a clearly **provisional, truthful relevant next step after first informative answer**, optionally deepened with other categories. No guessed cross-category savings or ranking. Shipped PR #53 (2026-10-08).
- [x] One relevant category help action and optional deepening path; original cost values remain local-only, added events include category and progress but no price data.
- [x] A warning leads to a guide, not a fabricated offer ranking; fit=0 gets no pressure to click an affiliate partner. Exact eligibility/prices remain with providers.
- [x] Build, full commercial regression and real iPhone QA passed on main for PR #53; 360/390/430px and both positive/no-clear-signal flows tested. Existing /app/ canonical, storage and complete 4/4 result retained. Commercial outcome still UNKNOWN.

### P3 — Cohesive, category-specific remaining journeys (**broadband, mobile and insurance shipped; finance tool shipped, finance hub remains**)

- [x] Broadband: address-first category rebuilt in PR #55, main merge 2026-10-08. Bredbandsval as a true address-based comparison service; Ownit and Internetport as two direct, visibly separate active suppliers. No pretend internal feed; distinct speed guide and exact first-year cost calculator; affiliate disclosures and mobile QA; branch Build and full Commercial regression green. **Commercial effect unknown until real organic users and approved outcomes.**
- [x] Mobile shipped in PR #57: single-plan surf guidance or family total cost path, all 10 approved providers immediately visible in alphabetical order, no fake live ranking. Added verified Hallon family-shared-data intent. Green branch Build and commercial smoke, confirmed merged to main 2026-10-08. Revenue effect unknown.
- [x] Insurance shipped in PR #58: four distinct paths for home, pet, travel and claims, 9 unique active partners visibly accessible with honest role and personal-price limitations. Green branch Build and commercial smoke, merged to main 2026-10-08. Approved revenue effect unknown.
- [x] Finance utility shipped in PR #59: illustrative, user-editable full-term repayment comparison on /ekonomi/jamfor-privatlan/, no invented APR or bank quotes, lower-monthly/higher-total warning, invalid missing-residual protection and privacy-safe analytics. Branch Build and commercial Playwright regression green, merged 2026-10-08. Commercial effect unknown.
- [ ] Next product scope: assess entire /ekonomi/ category journey (visible active loan partners, consumer safety, effective APR/SEKKI and debt counselling context); no commission-driven loan promotion. Requires separate evidence and QA.
- [ ] Apply consistent navigation, typography, design tokens, accessible logo treatment and commercial transparency **only when each user task benefits**, not blind replication of electricity layout.
- [ ] Build sitewide partner metadata layer with verified provider role, source/freshness, logo rights, actual offers when sourced, separately stored affiliate compensation (not ranking data).

### P4 — Traffic engine (parallel ongoing; do not wait for Google)

- [ ] **Highest-impact growth dependency:** keep doing daily source-backed competitor scanning and evaluate legitimate ways to distribute existing original consumer utilities to real audiences (BRF collective-coverage check, electricity fee-tradeoff tool, family mobile first-year cost, credit total-repayment explanation), without spam or paying for reach. Record audience, source URL and actual eligible referrals separately from QA traffic.
- [ ] Improve and distribute *original tools and reference-quality pages* with realistic high-intent GSC demand: condo insurance, kvartspris, real-electric-cost explanation, household finance. Answer exact question first; don't create scaled thin variants.
- [ ] Research and prepare relevant ethical non-paid distribution: BRF/consumer groups with genuinely useful original checklist, electricity decision/math explainer, suitable Swedish niche guides, industry listings, mention-worthy primary-source analysis. No unsolicited bulk spam, paid backlinks or pretending institutional endorsements.
- [ ] Keep existing canonical URLs, internal context links, organic-indexation stability; QA changes on existing pages. New microsites, paid media, integrations or external contracts only after user approval.

### P5 — Verified optimization and compounding learning

- [ ] Follow relevant organic unique users and source → first useful answer → partner exposure → qualified tagged click → approved transaction and actual SEK; verify partner-network IDs. Exclude owner/QA traffic where possible; don't call 100 old network clicks 100 customers.
- [ ] Separate objective quality tests (can validate immediately) and commercial effect (requires real cohorts). No made-up uplift rates, arbitrary payout-first rankings, synthetic reviews, fake live prices.
- [ ] Retire failed assumptions and update versioned source/competitor evidence. No mandatory week-long wait between **unrelated** scope improvements; max 2 independent initiatives, no same page/category/funnel interference.

## Execution cadence

Daily operations (~09:00 local): read this file, check fresh reports and green production verification, execute smallest **highest-impact coherent chunk** with PR + QA and update this ledger. Daily market radar (~10:00 local): examine competitor positioning and uncaptured high-intent searches, produce source-backed new growth opportunities, prepare distribution that can bring in real audiences independently of Google index maturation. Work should not be a daily report or an endless sequence of brand/logo tweaks.

## Risk gates

- Any unsupported current price, cheapest claim, hidden commission-led ranking, nonexisting affiliation, false consumer guarantee: block.
- Any broken clickRef/EPI/subID, leak of private price into events, SEO canonical/href regressions, mobile overflow or untested shared component: block.
- Any paid campaign/subscription, new partner contract, deceptive review, changes involving legal obligations: owner approval required.
- Never describe **planned** or **partly deployed** phases as complete. Every merged release is a quality milestone, not an approved-revenue milestone.

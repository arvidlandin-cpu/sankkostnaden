# APPROVED Masterplan — execution program, Sänk Kostnaden

**Approval:** user explicitly said "kör masterplan" on 2026-10-08 following comprehensive analysis. Product target: best attainable Swedish no-login consumer cost decision companion for low-knowledge households, with durable long-term **approved affiliate revenue per relevant visitor**, truthful offers and trustworthy discoverability. This file is the current **implementation ledger**, not a second proposal. Keep it updated as milestones complete.

Read also: `autopilot/PRODUCT_EXCELLENCE.md`, `STRATEGY_AND_EVIDENCE_STANDARD.md`, `PLAYBOOK.md`, `COMPETITOR_INTELLIGENCE.md`, `policy.json`, `state.json`, `opportunities.json`, and current GSC/GA4/network reports. The original user-approved full analysis is available in the conversation as `Sank_Kostnaden_Totalanalys_Masterplan_2026-10-08.md`; this repo ledger captures the operational milestones and requirements independently.

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

### P3 — Cohesive, category-specific remaining journeys (**broadband, mobile and insurance shipped; finance in progress**)

- [x] Broadband: address-first category rebuilt in PR #55, main merge 2026-10-08. Bredbandsval as a true address-based comparison service; Ownit and Internetport as two direct, visibly separate active suppliers. No pretend internal feed; distinct speed guide and exact first-year cost calculator; affiliate disclosures and mobile QA; branch Build and full Commercial regression green. **Commercial effect unknown until real organic users and approved outcomes.**
- [x] Mobile shipped in PR #57: single-plan surf guidance or family total cost path, all 10 approved providers immediately visible in alphabetical order, no fake live ranking. Added verified Hallon family-shared-data intent. Green branch Build and commercial smoke, confirmed merged to main 2026-10-08. Revenue effect unknown.
- [x] Insurance shipped in PR #58: four distinct paths for home, pet, travel and claims, 9 unique active partners visibly accessible with honest role and personal-price limitations. Green branch Build and commercial smoke, merged to main 2026-10-08. Approved revenue effect unknown.
- [ ] Finance in QA: add clearly illustrative loan total-repayment calculator on existing /ekonomi/jamfor-privatlan/ without inventing effective APR or lender quotes. Separate full finance hub assessment still pending. No lower-monthly-equals-savings inference, no fabricated approval odds.
- [ ] Apply consistent navigation, typography, design tokens, accessible logo treatment and commercial transparency **only when each user task benefits**, not blind replication of electricity layout.
- [ ] Build sitewide partner metadata layer with verified provider role, source/freshness, logo rights, actual offers when sourced, separately stored affiliate compensation (not ranking data).

### P4 — Traffic engine (parallel ongoing; do not wait for Google)

- [ ] Deep public competitor mapping every day with dated first-party source links; benchmark first-screen UI, offer truth, information required, customer intent, mobile, trust and actual proprietary pricing capacity.
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

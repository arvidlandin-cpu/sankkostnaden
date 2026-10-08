# Decision record – partner visibility and choice clarity

**Prepared 2026-10-08; research/preparation only. No growth deployment authorized while the current snippet test is active.**

## 1. Audience/job

First-time Swedish consumer who wants to check an electricity bill but does not know consumption, agreement type or available providers. They should recognize trustworthy provider alternatives, understand the differences between a quote-comparison service and an individual supplier, and be able to continue without a premature commitment or fictitious savings claim.

## 2. Competitor observation with dated sources

- **Elskling**, https://www.elskling.se/ (inspected 2026-10-08): concise promise, single prominent form, consumption-aware offer positioning and trust signals. Has live comparison capability we cannot emulate from static affiliate URLs.
- **Bredbandsval.se**, https://www.bredbandsval.se/ (inspected 2026-10-08): visible operator logos, address-led qualification, clear 3-step decision path and total-cost explanation. Address-backed availability capability does not transfer automatically to electricity.
- **Elpriskollen**, https://elpriskollen.se/ (inspected 2026-10-08): very clear 3-step postcode/annual consumption/agreement process backed by regulator-provided price data. Affiliate site cannot claim equivalent independent nationwide ranking.

Observed patterns are not proof of their conversion rates; no competitor A/B or revenue data was accessed.

## 3. What we infer – not what we know

**Observation:** current /elavtal/ UX has a direct strip of 2 links, 1-choice matcher, 3 near-identical recommendation cards after selection and an all-partners `<details>` collapsed directory. Brand favicon icons are small, and recommendation scores use static relevance/priority – **not price comparison**.

**Hypothesis:** making recognizable partner identities and provider roles more visible, consolidating redundant decision surfaces, and exposing the rest without a hidden wall may reduce confusion and lift qualified referral click-through. **Not demonstrated.** More logos alone could create choice overload.

## 4. Our data

- Owner screenshot 2026-10-08 and source audit `components/GuidedPartnerMatchers.tsx`, `styles/global.css`, `lib/partners.ts`.
- Commercial by-page organic events are instrumented but the qualified visitor sample is currently insufficient for a meaningful conversion claim. Repeat partner impression event counts are not independent person counts.
- Affiliate-approved revenue presently too sparse to judge card order or payout optimization. Read current GSC/GA4 in the actual pilot PR; do not copy these baseline figures without refresh.

## 5. Alternatives

- **A: Status quo** – keep two direct cards → matcher → top-three → collapsed twelve. Safe but the owner-observed confusion remains.
- **B: Show all partners as a large immediately visible logo wall** – highest apparent breadth but may overwhelm mobile visitors and offers almost no decision reason.
- **C: Simplify and explain (preferred bounded pilot)** – one strong promise; distinguish comparison service from individual suppliers; 2–3 clearly differentiated, prominent brands; quick help path; compact accessible full partner overview with clear disclosure; no unsupported product pricing.

C is preferred on user-comprehension and reversibility grounds, but is **a proposed experiment**, not a proven winner.

## 6. Falsifiable hypothesis

Relative to the previous UI, a bounded mobile-first version of C increases *qualified organic unique affiliate-click users relative to eligible partner-exposure users* on /elavtal/ without violating offer truth, usability or trust. Keep partner relevance stable; do not treat raw impressions/event-count ratios or owner tests as statistically reliable.

## 7. Source truth

Partner brands/domains/status/intent must derive from validated `lib/partners.ts`. Do not claim current lowest price, cheapest supplier, personalized comparison, price differences or special exclusive discounts. If displaying any price, source directly from actual provider and record retrieval date, price period, exclusions and required customer eligibility. Use permitted logos or text wordmarks. Sponsored links visible.

## 8. UI hierarchy

1. One clear headline about the *user's job* and no false savings number.
2. Immediate simple choice: "Jämför erbjudanden" or "Hjälp mig välja" only if different useful outcomes; avoid redundant repeated paths.
3. Distinct partner options (comparison service and eligible individual suppliers labeled truthfully) with legible logos/name, specific source-supported reason and CTA.
4. Clearly visible compact "Alla aktiva alternativ" affordance with brands visible enough to discover; no giant offer wall.
5. Optional cost context/first-year calculator if useful before outbound.
6. Mobile testing on 360/390/430px, keyboard/voiceover labels, above-fold priority and tap targets.

## 9. Revenue chain

Effect would be on *relevant landing → informed partner choice → tagged click*. Organic discovery remains scarce. **Do not claim this UX alone creates incoming traffic**, and do not select suppliers solely on payout. Future approved transaction data is the only commercial confirmation.

## 10. Measurement / thresholds

Refresh baseline for /elavtal/ organic only, partner_impression / affiliate_click by page, distinct-user coverage, outbound EPI/clickRef, valid tagged clicks, time-to-qualified-next-action and key usability/QA outcomes. Exclude self-tests. Current policy requires sufficient unique organic samples before CRO verdict; if there is not enough signal, keep observing rather than force a conclusion. On pilot start record one specific intervention, timestamp, expected direction, review at >=7 complete days and sample threshold; do not compare contaminated rolling windows.

## 11. Risk and reversibility

Risks: perceived artificial ranking, choice overload, partner-logo licensing, CLS/page performance, losing content/navigation SEO, breaking affiliate tracking and confusing price-comparison vs provider role. Keep exact SEO content/canonical and known working links where feasible. Implement a small component/CSS change on one URL, QA and easily revert commit.

## 12. Decision

**PREPARE, DON'T DEPLOY.** The active `SEO_SNIPPET_TEST` began 2026-10-07, earliest review 2026-10-15T08:30+02:00. Research competing options, fresh data and source-backed differentiators now. After the experiment gate clears, reprioritize against original calculator/content utility opportunities using measured search demand and commercial relevance. If the pilot is still best, implement only the smallest unit following policy and update state first.

## 13. Verifier

Required before any merge: user-meaning audit, current partner eligibility/links, accessible mobile screenshots, keyboard interaction, paid disclosure, price/ranking truth, analytics event coverage, EPI/clickRef, build/regression tests and reversible release. After minimum post-change cohort sample, report KEEP / REASSESS / KEEP_OBSERVING with approved transactions when available, and update learning ledger only with supported findings.

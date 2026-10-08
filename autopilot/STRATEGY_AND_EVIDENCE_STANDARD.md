# Sänk Kostnaden – evidence-first product and growth standard

This document is a **binding decision gate** for all planned changes to landing pages, navigation, partner display, sales surfaces, ranking, calculators, SEO, content, conversion paths, and distribution channels. It takes precedence over pressure to deploy something merely because a competitor has it or traffic is slow. Read alongside `PLAYBOOK.md`, `policy.json`, current experiment state, competitor intelligence and the learning ledger.

## Product mission and distinct market position

Build the most useful Swedish **consumer-cost decision companion for people who suspect they pay too much but cannot easily explain their existing contracts, costs or consumption**. Deliver useful progress before requiring lots of data. The solution is not a generic collection of affiliate logo cards, thin SEO articles, fabricated live comparisons or an imitation of incumbents' quote systems.

North star: **long-term approved affiliate revenue per relevant visitor**, conditional on real usefulness, eligibility, tracking correctness and consumer trust. Google impressions, total sessions, CTR, clicks and completion rate are diagnostics, not proof of value. When nearly no qualified organic traffic exists, audience acquisition / discoverability is likely the binding constraint; continue product-market research and preparing high-quality distribution assets even when growth experiments are locked.

Distinctive promise: **Understand what to change → compare on a fair basis → reach a genuinely relevant provider or independent comparison → know what to verify before committing**. Keep at least two genuinely usable paths:
- **Easy:** "Jag vet inte vad jag betalar" — 0–2 plain-language questions, useful next step without bills or technical knowledge; clearly disclose what cannot be determined.
- **Detailed:** "Jag vet mitt avtal eller pris" — optional consumption/fees/address/contract inputs, realistic first-year or total-cost calculation with assumptions exposed. Do not represent illustrative calculations as live personal quotes.

## No-random-decision gate

Before a growth/product implementation, document an **evidence-backed decision record**, in the PR and/or a durable repository file, with every field below. Missing facts must be marked UNKNOWN, never inferred:

1. **Audience / job:** exact visitor profile, search intent and problem to solve; which part of user uncertainty is reduced?
2. **Competitor observation:** 2+ relevant current first-party/public examples (where realistically available), dated URLs, what each displays and the observable steps/screens. Name competitor advantages we *cannot* currently match (for example, live offers or real-time address data).
3. **Independent inference:** explicitly distinguish *observed design*, *hypothesized mechanism* and *proven performance*. Never present competitor layouts, anecdotal reviews or claimed conversion percentages as causal evidence.
4. **Our evidence:** current matching page/component, GSC query→page, GA4 channel/cohort, partner coverage, approved commissions, user-feedback/screenshot, instrumentation completeness and sample limitations.
5. **Choice set:** status quo and 2 plausible alternatives; why the selected version beats each for this audience and **why now**, given competing revenue opportunities.
6. **Specific hypothesis:** one reasoned mechanism, one page or bounded cohort, and a falsifiable observable outcome. No vague "more modern / more conversion-friendly".
7. **Content / offer truth:** source and freshness of each price, discount, terms, coverage, feature, savings claim, quote, logo and endorsement. Unsupported means omit/qualify. No fabricated rankings or expert profiles.
8. **UI hierarchy:** above-the-fold value proposition, number/meaning of actions, brand discoverability, primary CTA, decision-help route, cognitive load, readability and mobile keyboard/tap support.
9. **Revenue chain:** relevant discovery → landing → useful decision → qualified partner click → approved transaction. Explain which transition this change can influence and **what cannot yet be measured**.
10. **Attribution and measurement:** existing events, page/channel/placement, tagged click identifiers, exclusion of owner/test traffic, minimum organic sample, baseline period and review date.
11. **Trade-offs and reversibility:** performance, a11y, privacy, SEO, existing experiment/cooldown, brand/affiliate compliance, trust, effort, deployment and rollback.
12. **Decision:** execute / research more / wait / reject, owner permissions, expected learning and why. For experimental changes, check policy's concurrent capacity and avoid overlapping scopes and update state before production.
13. **Verifier after release:** actual QA, compare eligible cohorts, approved outcomes when mature, keep/revert/continue reason, learning ledger update. Never conclude success from tiny clicks.

An idea can remain a research result without a deploy. For routine technical fixes, the record can be abbreviated to defect evidence, scope, risk, tests and verification, but not omitted.

## Page-level product jobs: architecture must serve intent

| Page or mode | User question | Immediate value | Responsible next step |
| --- | --- | --- | --- |
| Category landing | "Betalar jag för mycket?" | Show what matters, real partner breadth, one easy way to act | Match needs or inspect clearly labeled active providers |
| Commercial comparison | "Vilka alternativ passar?" | Fair criteria, provider-type distinctions and relevant options | Go to *current partner offer*; don't imply in-house live price ranking |
| Specific info query | "Vad betyder detta / gäller det mig?" | Direct answer, original example/tool, explanation of trade-offs | Contextual comparison CTA only when helpful |
| Calculator | "Hur skiljer sig min totalkostnad?" | Assumption-driven 12-month / comparable cost, transparent missing inputs | Appropriate verified provider or partner comparison |
| /app/ cost check | "Jag har ingen överblick" | Very-low-friction route plus opt-in detailed path | 1 next useful action and relevant options, not multiple competing CTA walls |

## Partner merchandising: visibility without deception

- Show recognizable relevant brands **early**, using permitted assets or accessible text wordmarks with real partner names. Measure visual legibility on 360px, 390px, 430px and desktop. Partner logos cannot replace a reason to choose.
- Distinguish "jämförelsetjänst" from "enskild leverantör". Do not assign "förslag 1" / "bäst" / "billigast" as though backed by price data when partnerRankScore is static intent + priority.
- Promote **2–3 meaningfully distinguishable, context-relevant alternatives**, not a commission-ranked wall. Make all active alternatives discoverable with an easy overview. No gratuitous extra "choose how to compare" layer if the answer doesn't change usefulness.
- Each card: identifiable provider, one verifiable differentiator or reason for this user's intent, precise CTA ("Se aktuellt pris hos ..."), clear new-tab behavior when relevant, truthful uncertainty, sponsored disclosure.
- Prices and savings claims require current source and comparable method. Differentiate "estimated first-year cost" from provider price quote. Do not scrape/republish competitor offers beyond permissions.
- Partner ranking follows fit/eligibility and comparable verified total cost where available. Payout matters **only after** relevance and data gates, not as disguised content prioritization.

## Research and distribution beyond passive GSC waiting

Daily market research is useful even with zero traffic. Look for real underserved jobs and current search opportunities; evaluate gaps in competitors' onboarding, decision aids, honest cost comparisons, mobile readability, category handoffs and seller friction. Consider lawful, relevant non-SEO acquisition (original shareable calculators, useful research, partner/referral collaborations where permitted, directory inclusion, direct outreach needing owner approval). Do **not** spam communities, imply endorsement, mass-generate backlinks, or buy media automatically.

The site must earn a reason to be linked or shared: original calculator, consumer checklist, credible method, verified dataset or concise explainers genuinely better than existing offerings. Document distribution channel, expected audience fit, cost, ownership and instrumentation. Unowned competitor traffic/SEO estimates are hypotheses, not first-party measurement.

## Priority and review rules

Triage by **expected approved revenue potential × reachability of the relevant audience × actual information/partner capability**, tempered by confidence, trust, effort and risk. Do not present made-up weighted scores as facts. Score only when definitions and supporting inputs are recorded; otherwise use explicit relative comparisons (high/medium/low confidence).

At every daily scan: add or update dated evidence, retire stale claims, identify *one* most decision-relevant learning and choose either a bounded next step or documented no-action. Audit across categories rather than assuming one electricity-page pattern is universally right. Review the revenue chain monthly as data matures. Multiple independent changes can proceed under the concurrent slot limit; never launch two changes that share a target URL, main funnel, user cohort, tracking baseline or acquisition query because their effects could not be separated. Market research and design preparation always continue.

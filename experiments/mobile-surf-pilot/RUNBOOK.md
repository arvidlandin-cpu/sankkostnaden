# Mobile surf pilot – live runbook

Updated: 2026-10-06

## Current phase

**Commercial pilot authorized by the owner on 2026-10-06. No commercial outcome or A/B winner established.**

The isolated route is live and intentionally unlinked:

- `/experiments/mobile-surf-pilot/`
- `noindex,nofollow,noarchive`
- excluded from sitemap
- no entry from SEO-protected pages
- production publishing path: GitHub -> Cloudflare Pages

The owner confirmed on 2026-10-06 that Hallon/Adtraction verification, including the previously requested commercial/EPI checks, had already been completed. This is owner confirmation; no new API verification, transaction or commission is claimed. Do not reopen the completed verification gate.

## Recruitment link

For voluntary external usability participants with their own mobile subscription and a genuine intention to review it, use:

`https://sankkostnaden.se/experiments/mobile-surf-pilot/?src=invite_v1`

Do not force a variant in recruitment. Assignment must remain 50/50 before answers and persist locally.

Do not recruit through protected SEO pages. Do not use paid traffic without a separate budget decision.

## Usability phase

Purpose: detect confusion, wrong product/destination, broken handoff, disclosure problems, and mobile defects. It does not prove revenue uplift.

Target:
- 5–10 voluntary external participants
- own mobile subscription
- genuine mobile-review intent
- no family/senior/phone-purchase promise

Stop immediately if any participant reports:
- wrong merchant/product/destination
- misleading claim or unclear ad disclosure
- broken CTA, mobile layout or assignment persistence
- affiliate link without the expected EPI fields
- unexpected routing from a non-matched profile

Success to advance from usability:
- no blocking defect
- no false match
- no material confusion about why Hallon is shown
- A and B both complete on real devices
- GA4 receives production-host pilot events after QA traffic isolation

## Commercial verification record

The owner has confirmed the previously required checks below. Network outcomes must still be reconciled manually, since Adtraction is not connected to Windsor:

1. Hallon/channel relationship is confirmed active in Adtraction.
2. Current payment basis, commission/currency, cookie/attribution window and applicable terms are documented.
3. Correct final destination is confirmed.
4. An actual EPI click can be found/read back in Adtraction or an allowed export/interface.
5. Transaction status and provision can later be reconciled to the EPI click key.
6. QA/preview traffic is excluded from the production measurement set.
7. Recruitment source, active recruitment window and review date are fixed before outcomes are inspected.

No fabricated order or test purchase is allowed.

## Measurement contract

Primary future KPI:

**approved net affiliate revenue / assigned relevant measurable participant**

Diagnostic chain:

assignment -> flow start -> completion -> matched profile -> partner impression -> outbound click -> Adtraction transaction -> pending/approved/rejected -> net commission

GA4 arm-specific events:
- `pilot_assignment_a|b`
- `pilot_flow_start_a|b`
- `pilot_flow_completion_a|b`
- `pilot_compare_open_a|b`
- `pilot_partner_impression_a|b`
- `pilot_affiliate_click_a|b`

The global `affiliate_click` remains the canonical outbound click event.

## Data hygiene

Exclude from commercial interpretation:
- localhost / 127.0.0.1
- bs-local.com
- Cloudflare preview hosts
- URLs carrying `?qa=1`
- automated BrowserStack/Playwright sessions
- owner smoke-test traffic where identifiable

Historical pilot-path GA4 activity from before QA isolation on 2026-10-04 is contaminated by automation and must not be treated as real participants.

## Decision discipline

The first external usability participants are qualitative validation, not a winner test.

When the commercial gate is complete:
- freeze partner/product, questions, scoring, A/B behavior and recruitment source
- no partner re-ranking during the test
- no new questions, price calculator, cross-sell or SEO content in the experiment
- record start timestamp and a maximum active recruitment window before looking at outcomes
- wait for the network's approval process before judging the primary KPI
- report an inconclusive result when sample/conversion maturity is insufficient rather than forcing a winner

Any move from this isolated recruited population into organic traffic on the existing surf guide requires a separate decision.

## Commercial rollout – 2026-10-06

- Dedicated entry: `https://sankkostnaden.se/experiments/mobile-surf-pilot/?src=live_v1`.
- Start: first successful Cloudflare Pages deployment of this rollout commit on 2026-10-06. Use its deployment timestamp as the cohort cutoff.
- Active recruitment window: deployment through 2026-10-20 23:59 Europe/Stockholm; review on 2026-10-21. This is a review window, not an automated shutdown.
- Distribution: direct URL only. No paid campaign, messages to third parties or links from protected pages are authorized by this release.
- `src=invite_v1` stays usability data. `src=live_v1` is the dedicated commercial cohort. Direct/unknown sources are reported separately rather than silently pooled.
- Production host alone does not prove a real participant. Exclude owner tests, QA, forced variants and automation. Assignment events are visits, not deduplicated participants.
- All 2026-10-04 historical pilot activity remains excluded; 2026-10-05 and pre-deployment activity remains pre-launch/usability.
- Questions, scoring, 50/50 allocation, partner, EPI structure and A/B handoff are frozen.
- Measure approved net commission per relevant assigned participant only after manually reconciled network outcomes mature. Missing network revenue is unknown, not zero.

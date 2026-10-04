# Mobile surf pilot – live runbook

Updated: 2026-10-04

## Current phase

**Smoke test / usability only. Not yet a commercial A/B conclusion.**

The isolated route is live and intentionally unlinked:

- `/experiments/mobile-surf-pilot/`
- `noindex,nofollow,noarchive`
- excluded from sitemap
- no entry from SEO-protected pages
- production publishing path: GitHub -> Cloudflare Pages

A real Hallon destination click has been manually verified by the owner. The click destination works. This does **not** yet prove that Adtraction has persisted the EPI reference or that a later transaction can be reconciled end-to-end.

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

## Commercial start gate

Do **not** call the experiment commercially live until all are true:

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

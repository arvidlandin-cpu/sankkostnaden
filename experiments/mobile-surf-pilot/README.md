# Mobile surf pilot

Status: private, build-gated experiment branch. No production merge/deploy is authorized by this file.

The route is generated only when `ENABLE_MOBILE_SURF_PILOT=true`. It is `noindex,nofollow,noarchive`, is not in the sitemap, and no SEO-protected page links to it.

## Frozen baseline

- main commit: `0204778f9b3a75026771dbacee5828abb4224dfd`
- production surf guide blob: `006b96b7435d678232a4f3c4f3225f03743be569`
- production surf guide and `/app/` remain unchanged

## Experiment

- A: low surf + own subscription -> internal comparison step -> Hallon partner card
- B: low surf + own subscription -> same Hallon partner card directly in result
- other profiles behave identically in A and B
- assignment is 50/50 before answers and is persisted locally

Hallon is selected from the existing active `mobil + data` registry. The pilot does not claim Hallon is the economically best mobile partner; it is one controlled, already-configured path for the first handoff test.

## Attribution without Adtraction API access

The pilot uses the existing Hallon tracking URL and appends only Adtraction's documented EPI fields:

- `epi` = random local click id
- `epi2` = experiment variant
- `epi3` = `surf_low_own`
- `epi4` = result placement
- `epi5` = `msv1`

The same random click id is saved locally before outbound navigation. The existing global affiliate tracker is extended on this branch to retain explicit partner identity when EPI query parameters are present and to include `local_click_id`, experiment id and experiment variant in the GA4 `affiliate_click` event.

No purchase or conversion is fabricated. Until direct API access is available, Adtraction transaction/approval/provision is reconciled manually against EPI in the network interface/export.

## Safety

- no price promise is hard-coded in the CTA
- CTA disclosure says it is an ad link and that current terms must be checked with the operator
- no-match never fabricates a partner
- changing answers away from the pilot segment removes the partner card
- experiment remains outside sitemap and index
- rollback is simply not to merge/deploy the branch

## Automated QA

`.github/workflows/mobile-surf-pilot-qa.yml` checks:

- existing route, integrity, build and export checks
- A and B at 360, 390 and 430 CSS px
- EPI parameters and explicit partner metadata
- changed-answer regression
- no-match state
- local click-id persistence
- screenshots

Real iPhone/Safari remains a pre-live QA item.

## Measurement

Primary future KPI:

**approved net affiliate revenue / assigned relevant measurable participant**

Diagnostics:

assignment -> answers -> profile -> partner shown -> unique outbound click -> Adtraction transaction -> approved/rejected/pending -> net commission

The API integration is optional for launch of a small exploratory pilot because EPI can be reconciled manually. API automation can be added later without changing the experiment definition.

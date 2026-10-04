# Mobile surf pilot

Status: live as an isolated smoke-test route on production after explicit approval on 2026-10-04.

The route is available at `/experiments/mobile-surf-pilot/`, is `noindex,nofollow,noarchive`, is not in the sitemap, and no SEO-protected page links to it. The pilot is intentionally discoverable only by direct URL during the smoke-test phase.

## Frozen baseline

- pre-pilot main commit: `0204778f9b3a75026771dbacee5828abb4224dfd`
- production surf guide blob at pilot design time: `006b96b7435d678232a4f3c4f3225f03743be569`
- production surf guide and `/app/` were not changed by the pilot launch

## Experiment

- A: low surf + own subscription -> internal comparison step -> Hallon partner card
- B: low surf + own subscription -> same Hallon partner card directly in result
- other profiles behave identically in A and B
- assignment is 50/50 before answers and is persisted locally

Hallon is selected from the existing active `mobil + data` registry. The pilot does not claim Hallon is the economically best mobile partner; it is one controlled, already-configured path for the first handoff test.

## Attribution without Adtraction API access

The pilot uses the existing Hallon tracking URL and appends Adtraction EPI fields:

- `epi` = random local click id
- `epi2` = experiment variant
- `epi3` = `surf_low_own`
- `epi4` = result placement
- `epi5` = `msv1`

The same random click id is saved locally before outbound navigation. The global affiliate tracker retains explicit partner identity when EPI query parameters are present and includes `local_click_id`, experiment id and experiment variant in the GA4 `affiliate_click` event.

No purchase or conversion is fabricated. Until direct API access is available, Adtraction transaction/approval/provision is reconciled manually against EPI in the network interface/export.

## Safety

- no price promise is hard-coded in the CTA
- CTA disclosure says it is an ad link and that current terms must be checked with the operator
- no-match never fabricates a partner
- changing answers away from the pilot segment removes the partner card
- experiment remains outside sitemap and is explicitly noindex
- global mobile quick bar is hidden only on the pilot route so it cannot cover the first question
- rollback is to revert/remove the isolated experiment route and pilot-specific tracking changes

## Automated QA

`.github/workflows/mobile-surf-pilot-qa.yml` checks:

- existing route, integrity, build and export checks
- A and B at 360, 390 and 430 CSS px
- EPI parameters and explicit partner metadata
- changed-answer regression
- no-match state
- local click-id persistence
- screenshots

Real iPhone/Safari QA is also green through BrowserStack for the pilot preview on:
- iPhone SE 2022 / iOS 15
- iPhone 15 Pro / iOS 17
- iPhone 15 Pro Max / iOS 17

The main production build, Cloudflare Pages deploy and real-iPhone QA were green after merge. The separate legacy Workers build can fail independently and is not the production publishing path; production is GitHub -> Cloudflare Pages.

## Measurement

Primary future KPI:

**approved net affiliate revenue / assigned relevant measurable participant**

Diagnostics:

assignment -> answers -> profile -> partner shown -> unique outbound click -> Adtraction transaction -> approved/rejected/pending -> net commission

During the one-person smoke test, the purpose is only to validate the chain end-to-end. No A/B conclusion is drawn from one participant. API automation can be added later without changing the experiment definition.

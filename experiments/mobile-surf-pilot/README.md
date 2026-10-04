# Mobile surf pilot

Status: private technical prototype only. No production launch is authorized.

The route is generated only when ENABLE_MOBILE_SURF_PILOT=true. It is noindex/nofollow, is not in the sitemap, and no SEO-protected page links to it.

Frozen baseline:
- main commit: 0204778f9b3a75026771dbacee5828abb4224dfd
- production surf guide blob: 006b96b7435d678232a4f3c4f3225f03743be569
- the production surf guide itself is unchanged

Experiment:
- A: low surf + own subscription -> internal frozen comparison view -> partner candidate
- B: low surf + own subscription -> same partner candidate directly in result; comparison remains available
- other profiles behave the same in A and B
- assignment is 50/50 before answers and is persisted locally

Commercial status:
The code registry currently resolves Hallon as the highest-relevance active mobil/data candidate. The prototype does not render an active partner URL. Commercial output stays locked until the exact product relationship, commercial terms, final destination and transaction attribution are verified.

QA telemetry:
The prototype sends no GA4 events. Test events are kept only in window.__SK_MOBILE_SURF_PILOT_EVENTS__ and a browser CustomEvent.

Automated QA covers:
- existing route/integrity/build/export checks
- A and B at 360, 390 and 430 CSS px
- changed answers
- no-match behavior
- confirmation that there is no active sponsored CTA
- screenshots

Still required before any live test:
- real iPhone/Safari
- current product/destination verification
- end-to-end click-to-transaction reference verification
- clean separation of QA traffic
- explicit recruitment and measurement plan
- a later, separate approval to start a commercial test

Rollback:
Do not enable or deploy the pilot. If a later test is authorized, the experiment flag must be the first kill switch. Protected production pages remain unchanged.

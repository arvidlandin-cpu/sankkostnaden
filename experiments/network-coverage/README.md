# Affiliate network coverage

The partner-health audit classifies active outbound links without requesting the affiliate tracking URLs themselves.

Current supported attribution joins:

- **Adtraction** – verified `epi=<local_click_id>` and `epi2=<funnel_session_id>`
- **Addrevenue** – verified outbound `r=<local_click_id>`, exposed as `clickRef` in transaction reporting
- **Tradedoubler** – network is identified, but Sänk Kostnaden does not append a sub-ID until a current publisher-side parameter and reporting join are verified from authoritative documentation/account data
- **Other** – no attribution join is assumed

Bredbandsval.se program 390345 is a Tradedoubler program. Its current Sänk Kostnaden tracking URL is classified as Tradedoubler by the documented program ID/link pattern.

The audit reports network counts, attribution coverage, tracking-link review age and tracking-host DNS. It never performs HTTP requests to affiliate click URLs, so the audit cannot create artificial partner clicks.

This is deliberately conservative: an unknown or unverified network reference remains unknown instead of being guessed.

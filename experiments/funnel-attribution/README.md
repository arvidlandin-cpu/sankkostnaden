# Funnel attribution v2

Status: safe first-party funnel attribution with verified network click references.

## What this adds

Commercial tool events, partner impressions and outbound affiliate clicks share a random `funnel_session_id` for the current browser session.

Every affiliate click receives a unique `local_click_id`. The latest click context is kept in sessionStorage so the funnel can be debugged without persisting calculator inputs.

For tracking-link formats that have now been verified against current network documentation, the same random local click ID is also passed to the affiliate network:

- **Adtraction:** `epi=<local_click_id>`
- **Addrevenue:** `clickRef=<local_click_id>`

Adtraction deeplinks keep the destination `url` parameter last, as required by Adtraction's EPI documentation. Unsupported or unverified tracking formats are left unchanged.

## Why this is safe

The IDs are random and are not derived from names, email addresses, phone numbers, contract dates, household costs or other calculator inputs.

The original DOM link is restored immediately after the click event. Only the actual outbound click receives the supported network reference.

## Measurement

Shared event parameter:
- `funnel_session_id`

Affiliate click parameters:
- `local_click_id`
- `affiliate_network`
- `network_click_reference`

Existing dimensions remain:
- partner
- category
- intent
- placement
- page path
- partner position / result rank when available

## Conversion joining

Adtraction documents that EPI is attached to transactions/statistics and can therefore be used to identify which link produced a conversion.

Addrevenue exposes `clickRef` on click/event and transaction reporting. The production links now send the same `local_click_id` through that field.

This creates the intended chain:

`tool event -> commercial continue -> affiliate_click(local_click_id) -> network click reference -> transaction/conversion`

Actual approved-conversion ingestion still requires authenticated network reporting/API access and is a separate reporting step.

## Privacy

Exact household costs in Kostnadskollen remain local. The session/click identifiers are random measurement IDs only. Cookie/privacy copy describes that a supported affiliate network can receive the random click ID as a click reference.

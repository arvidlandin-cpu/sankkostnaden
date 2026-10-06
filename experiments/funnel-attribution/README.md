# Funnel attribution v1

Status: safe first-party funnel attribution.

## What this adds

Commercial tool events, partner impressions and outbound affiliate clicks now share a random `funnel_session_id` for the current browser session.

Every affiliate click also receives a unique `local_click_id`. The latest click context is kept in sessionStorage so the funnel can be debugged without persisting the user's calculator inputs.

The IDs are random and are not derived from names, email addresses, phone numbers, contract dates or household costs.

## What this does not do

This version deliberately does **not** append `epi`, `clickRef`, `subid`, `r` or other network-specific parameters to affiliate URLs.

Reason: the active portfolio spans several networks and redirect formats. A guessed parameter could break attribution or commission. Network-level approved-conversion joining must only be enabled after the exact supported parameter and reporting field are verified for that network/program.

Until that verification exists, the reliable chain is:

`tool event -> commercial continue -> affiliate_click(local_click_id + funnel_session_id)`

Approved conversion/revenue remains network-side and is not yet joined to the local click ID.

## Measurement

Shared event parameter:
- `funnel_session_id`

Affiliate click parameter:
- `local_click_id`

Existing dimensions remain:
- partner
- category
- intent
- placement
- page path
- partner position / result rank when available

## Privacy

Exact household costs in Kostnadskollen remain local. The session/click identifiers are random measurement IDs only. Cookie/privacy copy has been updated to describe the sessionStorage use.

## Next attribution gate

For each affiliate network:
1. verify the supported outbound sub-ID/click-reference parameter,
2. verify that the same value is returned in transaction/approved-conversion reporting,
3. test one partner end-to-end,
4. only then roll it out across that network.

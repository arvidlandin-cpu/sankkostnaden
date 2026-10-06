# Funnel attribution v3

Status: first-party funnel attribution + verified Adtraction EPI + verified Addrevenue clickRef join.

## First-party measurement

Commercial tool events, partner impressions and outbound affiliate clicks share a random `funnel_session_id` for the current browser session.

Every affiliate click receives a unique `local_click_id`. The latest click context is kept in sessionStorage so the funnel can be debugged without persisting calculator inputs.

The IDs are random and are not derived from names, email addresses, phone numbers, contract dates or household costs.

## Adtraction

For tracking links that match Adtraction's documented `/t/t?a=...&as=...&t=2&tk=1` structure, Sänk Kostnaden appends:

- `epi=<local_click_id>`
- `epi2=<funnel_session_id>`

Adtraction documents EPI as its sub-ID function and states that EPI data is connected to conversions generated through the tracking link. Up to five EPI values are supported.

For Adtraction deeplinks, the destination `url` parameter is kept last.

If a link already contains `epi`, the global attribution layer leaves it untouched. This protects isolated experiments that manage their own EPI values.

## Addrevenue

For links that match the current Addrevenue tracking structure:

`https://addrevenue.io/t?a=...&c=...`

Sänk Kostnaden appends:

- `r=<local_click_id>`

The value is the click reference for the outbound click and is intended to be available as `clickRef` on Addrevenue conversion/transaction data.

The implementation is deliberately narrow:
- only host `addrevenue.io`
- only path `/t`
- only links containing both affiliate `a` and channel/campaign `c`
- an existing `r` value is never overwritten

We do not send the browser session ID to Addrevenue. The local click reference is enough to join an approved network conversion back to the first-party click, and the click already carries the `funnel_session_id` inside analytics.

This creates the chain:

`tool event -> commercial continue -> affiliate_click(local_click_id + funnel_session_id) -> Addrevenue r/clickRef -> transaction`

## Networks not yet modified

Any tracking format that is not explicitly recognized remains unchanged. This includes custom partner redirects such as Bredbandsval until a supported click-reference format has been verified.

The rule remains: do not guess network-specific query parameters.

## Analytics

Shared event parameter:
- `funnel_session_id`

Affiliate click parameters:
- `local_click_id`
- `affiliate_network`
- `network_click_tagged`
- `network_tag_reason`

Existing dimensions remain:
- partner
- category
- intent
- placement
- page path
- partner position / result rank when available

## Privacy

Exact household costs remain local in the relevant tools. The session/click identifiers are random measurement IDs only.

## QA gates

The automated attribution suite verifies that:

1. calculator events and outbound Adtraction clicks share a funnel session,
2. Adtraction `epi` equals the local click ID,
3. Adtraction `epi2` equals the funnel session ID,
4. Adtraction deeplink `url` remains last,
5. repeat Adtraction clicks get fresh references,
6. pre-existing Adtraction EPI is preserved,
7. Addrevenue `r` equals the local click ID,
8. pre-existing Addrevenue `r` is preserved,
9. unsupported network links are not modified,
10. session storage contains no raw calculator values.

## Next measurement gate

Once real approved transactions are available, join them to `local_click_id` and calculate:

- approved conversion rate per partner and placement,
- approved revenue per relevant visit,
- approved revenue per affiliate click,
- tool-complete -> partner-click -> approved-conversion funnel.

Do not optimize partner order from commission alone. Relevance remains the primary display criterion.

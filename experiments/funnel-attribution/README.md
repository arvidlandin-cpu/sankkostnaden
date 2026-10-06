# Funnel attribution v2

Status: first-party funnel attribution + verified Adtraction EPI join.

## First-party measurement

Commercial tool events, partner impressions and outbound affiliate clicks share a random `funnel_session_id` for the current browser session.

Every affiliate click receives a unique `local_click_id`. The latest click context is kept in sessionStorage so the funnel can be debugged without persisting calculator inputs.

The IDs are random and are not derived from names, email addresses, phone numbers, contract dates or household costs.

## Adtraction: enabled after documentation verification

Verified 2026-10-06 against Adtraction's current EPI documentation.

For tracking links that match Adtraction's documented `/t/t?a=...&as=...&t=2&tk=1` structure, Sänk Kostnaden now appends:

- `epi=<local_click_id>`
- `epi2=<funnel_session_id>`

Adtraction documents EPI as its sub-ID function and states that EPI data is connected to conversions generated through the tracking link. Up to five EPI values are supported.

For Adtraction deeplinks, the destination `url` parameter is kept last as required by Adtraction's documentation.

This gives the measurement chain:

`tool event -> commercial continue -> affiliate_click -> Adtraction EPI -> transaction/conversion`

A new local click ID and EPI are generated for every normal outbound click.

## Existing EPI values

If a link already contains `epi`, the global attribution layer leaves it untouched. This protects isolated experiments such as the mobile surf pilot that manage their own Adtraction EPI values.

## Networks not yet modified

Addrevenue and other tracking formats are deliberately unchanged.

Addrevenue's current API documentation confirms that transactions/events can carry custom `subids`, but the public material reviewed so far does not provide a sufficiently explicit outbound tracking-link parameter format for us to alter production links safely.

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

1. the calculator and outbound Adtraction click share the same funnel session,
2. the Adtraction `epi` equals the local click ID,
3. `epi2` equals the funnel session ID,
4. deeplink `url` remains last,
5. repeat clicks get fresh EPI values,
6. pre-existing EPI is preserved,
7. unsupported network links are not modified,
8. session storage contains no raw calculator values.

## Next network gate

For each remaining network:
1. verify the exact outbound sub-ID parameter from authoritative documentation or the network account,
2. verify the same value is available on transaction/approved-conversion reporting,
3. test one link end-to-end,
4. only then enable URL decoration for that network.

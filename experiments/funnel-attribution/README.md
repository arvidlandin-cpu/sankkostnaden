# Funnel attribution v3

Status: first-party funnel attribution + verified Adtraction EPI and Addrevenue clickRef joins.

## First-party measurement

Commercial tool events, partner impressions and outbound affiliate clicks share a random `funnel_session_id` for the current browser session.

Every affiliate click receives a unique `local_click_id`. The latest click context is kept in sessionStorage so the funnel can be debugged without persisting calculator inputs.

The IDs are random and are not derived from names, email addresses, phone numbers, contract dates or household costs.

## Adtraction

Verified 2026-10-06 against Adtraction's current EPI documentation.

For tracking links that match Adtraction's documented `/t/t?a=...&as=...&t=2&tk=1` structure, Sänk Kostnaden appends:

- `epi=<local_click_id>`
- `epi2=<funnel_session_id>`

Adtraction documents EPI as its sub-ID function and states that EPI data is connected to conversions generated through the tracking link. For deeplinks, the destination `url` parameter remains last.

## Addrevenue

Verified 2026-10-06 against Addrevenue's current tracking and API documentation.

For tracking links that match `https://addrevenue.io/t?a=...&c=...`, Sänk Kostnaden appends:

- `clickRef=<local_click_id>`

Addrevenue documents `clickRef` as the click reference originating from the affiliate link and exposes `clickRef` on events and transactions. This lets approved transaction reporting be joined back to the corresponding local affiliate click without sending calculator inputs.

No guessed `r`, `subid` or other undocumented outbound parameter is used.

## Existing references

If an Adtraction link already contains `epi`, or an Addrevenue link already contains `clickRef`, the global attribution layer leaves that value untouched. This protects isolated experiments and manually tagged links.

## Measurement chain

The intended chain is now:

`tool event -> commercial continue -> affiliate_click(local_click_id + funnel_session_id) -> network reference -> transaction/conversion`

For Adtraction the join key is `epi`. For Addrevenue the join key is `clickRef`.

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

Exact household costs remain local in the relevant tools. Network click references contain only random measurement IDs.

## QA gates

The automated attribution suite verifies that:

1. calculator events and outbound clicks share one funnel session,
2. Adtraction `epi` equals the local click ID,
3. Adtraction `epi2` equals the funnel session ID,
4. Adtraction deeplink `url` remains last,
5. Addrevenue `clickRef` equals the local click ID,
6. existing EPI/clickRef values are preserved,
7. repeat clicks get fresh local IDs,
8. session storage contains no raw calculator values.

## Next reporting gate

The next step is authenticated approved-conversion ingestion:

1. obtain/read network reporting access,
2. pull transactions with status and network reference,
3. join `epi` / `clickRef` to local click IDs,
4. calculate approved affiliate revenue per relevant visitor and per funnel,
5. only then use revenue performance to adjust commercial exposure.

# Affiliate revenue report v1

Status: reporting infrastructure prepared for production.

## Goal

Measure the business KPI that matters: approved affiliate revenue, while preserving the existing relevance-first partner ranking.

The report pulls transactions directly from the two networks where Sänk Kostnaden now has a verified click-reference join:

- Adtraction: outbound `epi=<local_click_id>`
- Addrevenue: outbound `r=<local_click_id>`, returned in reporting as `clickRef`

## Credentials

The workflow reads two optional GitHub Actions secrets:

- `ADTRACTION_API_TOKEN`
- `ADDREVENUE_API_TOKEN`

Secrets are never written to the report, repository or browser bundle.

If a token is missing, that network is marked as not configured and the workflow still completes.

## Data sources

### Adtraction

`POST https://api.adtraction.net/v2/partner/transactions/`

Authentication: `X-Token` header.

The report requests all transaction statuses for the chosen date range and reads program, commission, currency, status and click EPI.

### Addrevenue

`GET https://addrevenue.io/api/v2/transactions`

Authentication: Bearer token.

The report follows the API's pagination links and reads advertiser/program, commission, currency, status and `clickRef`.

## Privacy

Raw order IDs, transaction IDs and complete click-reference values are not persisted in the report artifact.

The artifact contains only aggregates:
- approved transaction count
- pending transaction count
- denied/claim counts
- approved commission
- pending commission
- number of transactions whose click reference matches Sänk Kostnadens random `clk_...` format
- partner/program breakdown

## Status mapping

Adtraction:
- 1 = approved
- 2 = pending
- 4 = claim
- 5 = denied

Addrevenue:
- approved / paidOut = approved
- new / delayed = pending
- denied = denied

## Schedule

The workflow is prepared to run daily at 05:17 UTC and can also be triggered manually with a custom report window.

Until the API secrets are configured it produces only a configuration-status report.

## Next step after credentials

Once real transactions arrive, use the network click references together with GA4 affiliate-click counts to calculate:

- approved revenue per affiliate click
- approved conversion rate per partner
- approved revenue per relevant visitor
- tool-complete -> partner-click -> approved-conversion performance

Do not reorder partners from commission alone. User relevance remains the primary ranking rule.

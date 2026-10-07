# Addrevenue performance report v1

Status: direct Addrevenue API reporting prepared for production.

## Purpose

Combine Addrevenue's aggregated click statistics with detailed transaction status data so Sänk Kostnaden can measure:

- network clicks
- approved, pending and denied transactions
- approved commission
- approved revenue per click
- approved conversion rate
- transaction matching to Sänk Kostnaden's local click reference
- advertiser/program performance

## Data sources

The job calls Addrevenue API v2 using the repository secret `ADDREVENUE_API_TOKEN`:

- `GET /stats?groupBy=advertiser,program`
- `GET /transactions`

Authentication is a Bearer token in the Authorization header.

## Attribution rollout baseline

The click-reference implementation was merged to production on 2026-10-06 at 14:37:00 UTC. Coverage is evaluated only on transactions from that point onward, so historical conversions do not create a false failure signal.

Fewer than three post-rollout transactions are classified as `no_signal`.

## Privacy

Raw order IDs, clickRef values, sub-ID values and click/transaction identifiers are used only in memory. The persisted JSON and Markdown artifacts contain aggregates only.

## Missing credential behavior

If `ADDREVENUE_API_TOKEN` is missing, the workflow still succeeds and reports that the connector is not configured. This keeps production CI green until the token is added.

## Schedule

Runs daily at 05:37 UTC and can also be run manually with a custom reporting window.

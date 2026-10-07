# Adtraction performance report v2

Status: direct Adtraction partner API reporting with click-level attribution aggregation.

## Purpose

Measure the commercial chain without exposing raw identifiers:

- Adtraction clicks
- share of clicks tagged by Sänk Kostnaden with `epi=clk_...`
- distinct funnel sessions tagged with `epi2=fs_...`
- approved, pending and denied transactions
- approved commission
- approved revenue per Adtraction click
- approved conversion rate
- partner/program breakdown

## Data sources

The job calls the Adtraction partner API directly with the repository secret `ADTRACTION_API_TOKEN`:

- `POST /v2/partner/clicks/`
- `POST /v2/partner/transactions/`

The API token is sent only in the `X-Token` request header.

## Privacy

Raw click IDs, funnel-session IDs, order IDs and transaction identifiers are used only in memory during aggregation. The JSON and Markdown artifacts contain counts and rates only.

## Schedule

Runs daily at 05:27 UTC, can be run manually with a custom inclusive reporting window, and runs on changes to the report implementation.

## Interpretation

Revenue and conversion metrics are descriptive. Partner ordering on the live site must continue to prioritize user relevance, suitability and trust; commission alone must not determine ranking.

# Kostnadsprioriteraren v5

Status: commercial household funnel on `commercial/cost-prioritizer-v5`.

## Goal

Connect Hushållskostnadskollen with Kostnadskollen so a user can move from actual household costs to a prioritized review order without re-entering amounts.

## Privacy

Exact monthly costs remain in the browser via localStorage. GA4 receives:
- whether a cost was entered
- selected fit/risk answer
- selected hypothetical scenario percentage
- resulting top category

GA4 does not receive the user's exact monthly costs or total monthly cost from this flow.

## Ranking

Priority is intentionally not a market-price claim.

1. User-reported warning signal / fit answer ranks first.
2. Monthly cost only breaks otherwise equal categories.
3. 5%, 10% and 20% savings figures are explicitly labelled scenarios, not forecasts.

## Handoff

`/verktyg/hushallskostnadskollen/` writes the four comparable monthly amounts locally and links to `/app/?src=hushallskostnadskollen`.

`/app/` loads those amounts and asks one low-friction question per category before showing the final order and existing partner/guide paths.

## SEO

Both existing indexed URLs keep their current title, H1, canonical and robots settings. No new indexed URL is created.

## QA

- local transfer between tools
- scenario arithmetic
- analytics privacy guard
- metadata preservation
- 360/390/430 px overflow
- full integrity/build/export
- real-iPhone route coverage

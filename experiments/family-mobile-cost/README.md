# Familjekostnad mobil v2

Status: commercial upgrade on `commercial/family-mobile-cost-v2`.

## Goal

Turn the existing indexed calculator `/mobil/lonar-sig-familjeabonnemang/` into a true first-year household comparison without creating a competing URL.

The page keeps its existing title, H1, canonical and indexability.

## Calculation

For 2–5 people:

Separate annual cost:
`sum of each person's monthly price × 12`

Family annual cost:
`campaign family monthly total × campaign months + regular family monthly total × remaining months + one-time fees`

Family monthly totals are derived from:
- main subscription price
- price per extra user
- number of extra users

## Commercial handoff

After a completed comparison the user can continue to active mobile partners tagged with `family` intent.

The calculator never claims that a partner is cheapest. Prices are user-entered and actual surf, network, EU usage, binding and terms must still be checked.

## Measurement

- `family_mobile_cost_ready`
- `family_mobile_cost_continue`

Tracked parameters include number of people, outcome, campaign months and annual difference. No names, phone numbers or individual identifiers are collected.

## SEO

`/mobil/familjeabonnemang/` links to the calculator through a focused utility card.

Protected metadata remains unchanged on both indexed pages.

## QA

- first-year arithmetic
- family partner handoff
- canonical/robots/H1 preservation
- guide-to-calculator link
- 360 / 390 / 430 px overflow
- full site integrity/build/export

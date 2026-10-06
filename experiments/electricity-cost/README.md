# Elavtalskostnad v1

Status: commercial utility on `commercial/electricity-cost-tool-v1`.

## Goal

Let a user compare two electricity-trading offers on exactly the same annual consumption without pretending to forecast future market prices.

Route:

`/verktyg/elavtalskostnad/`

The utility is intentionally `noindex,nofollow,noarchive` and absent from the sitemap.

## Inputs

- annual consumption in kWh
- comparable electricity-trading price in öre/kWh for each offer
- fixed monthly fee
- total discount during the 12-month comparison period

## Calculation

`annual kWh × entered öre/kWh / 100 + monthly fee × 12 − discount`

The result is the electricity-trading contract calculation only. Grid fees, energy tax and other costs outside the electricity-trading agreement are not included.

For variable and quarter-hour prices the calculation is a snapshot based on the price figure the user enters, not a forecast.

## Commercial flow

Entry points:
- `/elavtal/jamfor-elavtal/`
- `/elavtal/billigaste-elavtalet/`
- `/elavtal/rorligt-elpris/`

After a complete comparison the user can continue to the existing electricity partner matcher.

## Measurement and privacy

Events:
- `electricity_cost_ready`
- `electricity_cost_continue`

Analytics receives source, broad consumption band, winner and broad difference band. Exact kWh, prices, fees and calculated totals are not sent in these events.

## SEO

The three indexed entry pages keep their existing title, H1, canonical and robots settings. No new indexable URL is introduced.

## QA

- annual-cost arithmetic
- incomplete-comparison guard
- electricity partner handoff
- analytics privacy guard
- metadata preservation
- 360 / 390 / 430 px overflow
- full integrity/build/export
- real-iPhone route coverage

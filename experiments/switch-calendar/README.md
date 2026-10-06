# Byteskalender v1

Status: commercial utility prepared on `commercial/switch-calendar-v1`.

## Goal

Help a user plan when to act before switching electricity or broadband without pretending to interpret the user's contract.

Route:

`/verktyg/byteskalender/`

The route is intentionally `noindex,nofollow,noarchive` and absent from the sitemap during the current indexing phase.

## Inputs

- category: electricity or broadband
- contract mode: fixed end date or rolling until cancelled
- date from the user's own contract/planning
- notice period entered by the user
- notice unit: days or months

## Outputs

- calculated action/cancellation date
- calculated final contract/service date
- planning point for a new start the following day

Month arithmetic clamps to the final valid date in the target month. Example: 31 January + 1 month becomes 28 February, or 29 in a leap year.

## Accuracy boundary

This is a planning calculator, not legal or contractual interpretation. Providers can count notice periods differently and contracts can include binding periods, automatic renewal, termination fees or special rules. The UI tells the user to verify the calculated dates against the actual contract/provider before ordering a replacement service.

No exact contract dates are sent to GA4.

## Commercial flow

After a completed calculation, users can continue to:
- the existing ElectricityPartnerMatcher, or
- the existing BroadbandPartnerMatcher.

Partner impressions/clicks continue to use the global affiliate tracking.

## Measurement

- `switch_calendar_ready`
- `switch_calendar_continue`

Event parameters include category, contract mode, notice unit/value and deadline state, but not the user's exact dates.

## Initial integration

The first indexed entry point is `/elavtal/byta-elavtal/`. Its title, H1, canonical and robots settings remain unchanged.

## QA

- existing site + integrity checks
- static build/export
- fixed-date math
- rolling-date math
- broadband handoff
- canonical/noindex rules
- 360 / 390 / 430 px overflow
- existing byta-elavtal canonical preserved

# First-year cost calculator v1

Status: isolated prototype on `feature/first-year-cost-v1`.

## Purpose

Create a reusable calculation primitive for comparing subscription offers on a common 12-month basis without touching protected SEO pages.

The prototype route is:

`/experiments/forstaarskostnad/`

It is intentionally:
- `noindex,nofollow,noarchive`
- absent from the sitemap
- unlinked from protected SEO pages
- based only on user-entered values
- free from live price or partner claims

## V1 calculation

For each alternative:

`campaign price × campaign months + regular price × remaining months + monthly extras × 12 + one-time fees`

Output:
- total first-year cost
- effective monthly cost
- first-year difference between two alternatives

Campaign months are capped at 12 and all negative/invalid values are treated as zero.

## Scope

V1 is suitable for fixed-price subscription comparisons such as mobile and broadband.

Electricity needs a later adapter that includes annual consumption and variable price/påslag. Do not present this v1 formula as a complete electricity-cost comparison.

## QA gate

Before merge:
- existing site checks pass
- static build/export passes
- calculator arithmetic passes
- 360 / 390 / 430 px have no horizontal overflow
- route remains noindex and outside sitemap

## Rollout rule

Do not add links from indexed SEO pages in this branch. Integration into production guides is a separate decision after QA and UX review.

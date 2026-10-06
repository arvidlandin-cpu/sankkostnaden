# First-year cost calculator v1

Status: commercial mobile flow prepared on `commercial/first-year-cost-mobile-v1`.

## Purpose

Create a reusable calculation primitive for comparing subscription offers on a common 12-month basis without changing SEO metadata or canonical structure.

Routes:

- Prototype: `/experiments/forstaarskostnad/`
- Commercial mobile tool: `/verktyg/forstaarskostnad/`

Both remain intentionally `noindex,nofollow,noarchive` in this phase.

## Commercial flow

The indexed page:

`/mobil/billigaste-mobilabonnemanget/`

links to the commercial calculator without changing its title, H1, canonical or robots directives.

The commercial calculator:

1. lets the user enter two offers,
2. calculates both over the same 12-month period,
3. only compares once both alternatives contain price data,
4. shows the first-year difference,
5. hands off to the existing active mobile partner matcher,
6. keeps affiliate disclosure and global affiliate click/impression tracking intact.

The tool does not claim that any partner is the cheapest. It does not fetch or hard-code live prices.

## V1 calculation

For each alternative:

`campaign price × campaign months + regular price × remaining months + monthly extras × 12 + one-time fees`

Output:
- total first-year cost
- effective monthly cost
- first-year difference between two alternatives

Campaign months are capped at 12 and negative/invalid values are treated as zero.

## Important review fix before commercial rollout

The prototype originally treated an empty second offer as a zero-cost offer and could therefore describe it as cheaper. Commercial v1 blocks comparison until both offers have price data.

## Measurement

Commercial calculator emits:
- `first_year_cost_ready` when two offers become comparable
- `first_year_cost_continue` when the user continues to the mobile partner matcher

Partner impressions and outbound affiliate clicks remain measured by the global `AffiliateTracking` component.

## Scope

V1 is suitable for fixed-price subscription comparisons such as mobile and broadband.

Electricity needs a later adapter that includes annual consumption and variable price/påslag. Do not present this v1 formula as a complete electricity-cost comparison.

## QA gate

Before merge:
- existing site checks pass
- static build/export passes
- commercial handoff passes
- empty-offer regression passes
- 360 / 390 / 430 px have no horizontal overflow
- commercial route remains noindex
- existing mobile comparison canonical metadata remains unchanged

After merge:
- main build must pass
- real-iPhone BrowserStack QA must pass on the commercial calculator route

## SEO rule

Do not add the calculator route to the sitemap or index it until the current crawl/indexing phase has stabilized and a separate SEO decision has been made.

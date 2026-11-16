# Kvartspris utility review — 2026-11-16

## Decision

Close the scoped observation as **REASSESS_NOT_PROVEN**.

The observation met its minimum review gate, but the available evidence does not establish that the utility change caused the weaker search exposure. Do not call it a winner or a causal loser. Do not roll back automatically.

This review changes only experiment administration. The live page, DOM, events, SEO fields, affiliate links, EPI/subID handling and disclosure remain unchanged.

## Verified evidence

Primary source: [Google organic performance workflow run 43727956596](https://github.com/arvidlandin-cpu/sankkostnaden/actions/runs/43727956596), generated 2026-11-15 with data through 2026-11-14.

- Final post cohort: 2026-10-11 through 2026-11-13, 34 complete days, 31 page impressions, 0 clicks, average position 82.806.
- Historical baseline in state: 2026-09-10 through 2026-10-06, 156 page impressions, 0 clicks, average position 21.7.
- The periods are not equivalent in duration or search conditions, so the difference is observational and not a causal estimate.
- Exact query→page row for `kvartspris el` in the 30-day all-state report: 8 impressions, 0 clicks, average position 92.25.
- Google URL Inspection: PASS, indexed, Google-selected canonical matches; last crawl reported 2026-10-30.
- Public GA4 rows do not verify an organic content landing or organic affiliate-click user for this page.
- Network-approved total transactions and commission: **UNKNOWN** because the complete cross-network match is unavailable. The available Adtraction and Addrevenue rows show 0 approved transactions and 0 SEK; Tradedoubler coverage is missing.

## Interpretation

The experiment cleared the mechanical sample gate but produced no verified organic click, no attributable organic partner-click user and no verified network-approved income. Search position is materially weaker than the historical reference, yet the data cannot isolate the page change from index maturity, query mix or broader search movement.

Outcome: reassess the utility and search fit only when new query→page or real-user evidence identifies a specific gap. No further product work is authorized by this review.

## Executed

- Removed the kvartspris observation from `activeExperiments`.
- Left the BRF price-example observation as the sole active experiment.
- Preserved the live kvartspris implementation and affiliate chain unchanged.

## Not executed

- No page, component, DOM, event, title, metadata, canonical, structured-data or affiliate-link change.
- No homepage work.
- No external contact, paid traffic, new partner agreement or distribution post.
- No revenue claim.

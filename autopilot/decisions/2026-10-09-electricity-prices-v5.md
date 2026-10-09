# Elpriskollen 5.0 — redesign decision, 2026-10-09

## Trigger and evidence
Owner feedback: original electricity tool works but visually and functionally feels like version 1.0 rather than a premium 5.0 product. Source-level audit against `components/ElectricitySpotPrices.tsx` and screenshot direction in `autopilot/VISUAL_UX_ROADMAP_2026-10-09.md`.
The previous module displayed **24 hourly averages** while the API already delivers **92, 96 or 100 quarter-hour market prices**, obscuring real within-hour variation. It used two disconnected sliders with no immediate next-action context and 8 individually cheapest/dearest quarters that may be scattered across the day. The actual React code, not artistic mockups, is the observed baseline.

## User job
"I have a quarter-hour price electricity contract or am considering one. What is the actual price now, when is a practical cheaper window, and could moving some demand theoretically make a difference?" Low-knowledge consumers should get value without needing to know annual kWh.

## Outside reference / inference
- Lyst, `https://www.lyst.com/`: progressive interactive discovery motivates clear, immediate interaction, but fashion playfulness is not proof of energy-product conversion.
- The Zebra, `https://www.thezebra.com/`: fewer upfront questions and next-action clarity are relevant, but the platform has commercial offers/feeds we do **not**.
- KAYAK, `https://www.kayak.com/`: progressive comparison depth is relevant; we cannot imitate the platform's verified live travel price ranking with our **spot price feed**.
These are established project inspirations, **not fresh independent audited screenshots or performance evidence**.

## Options and decision
- A: keep hourly chart and disclosure-only scenario (safe but poor product clarity).
- B: cosmetic blue recolor (improves presentation without repairing false conceptual affordances).
- **C: implement exact 15-minute spot visual + upcoming continuous two-hour window + transparent optional scenario + a relevant informational next action.** Selected because it resolves user decision friction using already validated existing data, no cost or new partner contract.

## Concrete changes
- Use each real 15-minute price in the graph; selected quarter and slider are exact. This preserves 23h/25h daylight-saving days rather than flattening to 24 hours.
- Highlight **cheapest upcoming full 2h period** if it exists, or cheapest continuous 2h period of the selected day. Never label a past window "upcoming".
- Compare **continuous** 2h high vs low blocks in the shift simulator (instead of scattered 8 quarter-hour points); 0–10kWh slider and quick presets, visually quiet/optional.
- Blue/navy premium surface, accessible hierarchy, legible selected price, keyboard focus, clear first-screen reading order; avoid repeating existing supplier directory and preserving one immediate useful action.
- Guide users to compare contract types, not unsourced cheap-provider rankings.
- Keep source links and legal distinctions: **spot price excluding VAT/network/tax/markups, not a retail quote, bill or guaranteed saving**.
- Do not touch existing Elskling, Tibber or other 12 direct supplier tracking URLs/SEO structure.

## Decision gates
- Local Next static build, integrity checks, normal commercial smoke.
- Functional controls (area, day, future window, 15-min selection, guidance, math, DST), no data false-positives.
- Responsive 360/390/430/1024/1440, keyboard, reduced-motion, visually reviewed screenshots *before merging*. Check network attribution unchanged and latest date remains visible.
- Actual cloud production SHA, user engagement / click-through and *approved* affiliate revenue are separate verifier stages, not part of implementation success.

## Evidence / unknowns
No meaningful organic conversion dataset yet to compare old/new purchase rates. Source data collected via scheduled GitHub Actions from Elpriset just nu.se, not the individual supplier retail prices. Paid tools and duplicate UI PR #48 are **not** prerequisites; never merge overlapping speculative illustration unexamined.

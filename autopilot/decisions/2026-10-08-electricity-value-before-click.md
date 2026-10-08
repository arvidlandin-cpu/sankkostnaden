# Decision: Make the first cost insight immediate

Date: 2026-10-08. Action: CONTENT_UTILITY_UPGRADE. Scope: **only** `/elavtal/billigaste-elavtalet/` plus independent utility component, CSS, pure arithmetic and QA. This is a shipped incremental product improvement with measurement, **not** an A/B experiment requiring a calendar hold.

1. **Audience / user job.** A Swedish consumer searches for "billigaste elavtalet" but does not know whether a low unit price or lower fixed monthly fee is worth more. No contract data required to receive a useful concrete explanation.

2. **Current competitor observation.** Public sources catalogued 2026-10-08 in `COMPETITOR_INTELLIGENCE.md`: Elskling https://www.elskling.se/ moves toward personal electric offers; Elpriskollen https://elpriskollen.se/ requests consumption and agreement type for actual national price comparisons. Both can do price-comparison steps our website cannot honestly replicate without licensed live price data. Our original contribution is a lightweight transparent *trade-off demonstration before referring out*.

3. **Observation versus inference.** Observable: current /billigaste/ page requires visiting `/verktyg/elavtalskostnad/` then entering both offers to see a numerical result. Hypothesis: a one-screen break-even example helps low-information visitors understand why fixed fees matter before external comparison. **Unproven:** higher organic CTR, retention, partner click or approved commission.

4. **Our evidence.** Latest previous 30-day GSC for page ≈119 impressions, 0 clicks and weak ranking; associated query "billigaste elavtalet" 38 impressions at average position ≈20, 0 clicks. This is a small sample, not a performance proof. Code inspection: page previously exposed the full calculator as a linked card; calculator needs annual kWh plus complete price details for 2 offers; partner matcher already follows below. Organic revenue still unproven.

5. **Alternatives.** (A) Leave content and linked tool unchanged: lowest effort but value only after another navigation. (B) Embed full 2-offer calculator: complete, but 7 fields and bulky mobile UI impede beginners. (C) **Chosen:** embed a simple 3-input sensitivity example, with 2,000/5,000/20,000-kWh selectable examples and clear deep link to full tool. C gives value before knowing provider prices without pretending to compare the market.

6. **Falsifiable hypothesis.** Users who encounter the new inline calculation will more often choose an appropriate informed next step (full calculator or eligible partner comparison) than before. Observe `electricity_sensitivity_used`, `electricity_sensitivity_to_calculator`, `electricity_cost_ready`, downstream tagged partner clicks, organic sessions and eventually approved commission. Conversion effect is UNKNOWN until enough real traffic exists.

7. **Truth of content/claims.** Default lower variable price = illustrative 5 öre/kWh; default higher fixed fee = illustrative 30 kr/month; users can modify either. Annual arithmetic: `kWh × öre / 100 − månadsavgift × 12`. Break-even if the variable-price difference is positive. No partner brand, live quote, discounted period, "billigast" claim or inferred cost saving is attributed to a real supplier. Elnät, energiskatt, discount, contract term and taxes need separate comparison.

8. **Page hierarchy.** Immediately after the two existing primary action paths, show the value proposition + one sample selector + two cost differences and netto + direct deep link to full precision calculator. Keep existing informational content and relevant active partners further down. Mobile: 360/390/430 px stack; labels, accessible buttons and inputs. Desktop grid distinct.

9. **Revenue logic.** Better content utility could improve external distribution or later organic engagement. The direct quantifiable next step is full-cost calculator use then qualified partner click. More usefulness is not automatically more revenue: approved affiliate yield is still north star and no numerical forecast is claimed.

10. **Measurement.** One descriptive GA4 start event only on deliberate tool use; consumption band but never raw kWh / cost numbers. The full-calculator link has an additional click event and an existing `src=billigaste_elavtalet` source parameter. Before period: organic volume too small for any causal uplift inference. Audit after enough days/qualified sessions; test-owner traffic excluded where identifiable.

11. **Safety/reversal.** Preserve the existing SEO title/H1/canonical and existing partner links. Reuse `lib/electricityCost` banding, provide clearly labeled examples, avoid live price/affiliate source claims. Pure helper and independent CSS module make rollback narrow. Static build, Playwright content/calculation/mobile tests and commercial regression QA required.

12. **Decision / why now.** **SHIP**, at no additional SaaS cost, because value is immediately visible, small and reversible; there are no active experiments according to `state.json`. The owner explicitly cancelled an unrelated SEO test and asked to accelerate product quality. This release will not reinstate a global waiting lock. The companion partner-brand redesign is a separate next move requiring its own evidence.

13. **Verifier.** Before merge check formula with 5,000 kWh, 5 öre/kWh, 30 kr/month: variable saving 250 kr, fee +360 kr, net **110 kr higher**; with 20,000 kWh: net **640 kr lower**; break even 7,200 kWh. Check route canonical, link target, privacy-safe GA4 event, 360/390/430px no overflow, build/SEO integrity, commercial regression. After rollout, monitor real organic visitor cohorts, eligible partner clicks and approved revenue; no "experiment winner" assertion and no embargo on independent improvements.

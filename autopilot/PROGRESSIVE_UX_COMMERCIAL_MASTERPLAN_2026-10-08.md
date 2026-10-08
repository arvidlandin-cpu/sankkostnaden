# Sänk Kostnaden — less typing, earlier usefulness, truthful partner handoff
**Approved owner direction: 2026-10-08. Execution status: priority tool rebuilds implemented and merged. Full post-production visual/design and commercial performance verification still open.**

## Implementation ledger (2026-10-08)
- **P1 electricity:** PR #64, merged; true comparator path before detailed price form, explicit exact fee confirmation.
- **P2 family mobile:** PR #65, merged; two-click start, active family partner choice, optional full-price calculation.
- **P3 shared mobile/broadband first-year costs:** PR #66, merged; early qualified category next step, ordinary-price quick comparison, exact campaign and fee entry optional.
- **P4 household cost map:** PR #67, merged; category-choice first, only *entered* known subtotal, local preserved-cost handoff.
- **P5 loan:** PR #68, merged; immediate illustrative same-principal repayment lesson, detailed real-offer fields on demand.
- **P6 source audit:** SwitchCalendar, CondoInsuranceCheck and ElectricitySensitivity already have manageable progressive/click-first tasks; no gratuitous rebuild. Secondary CostRealityCheck has optional campaign fields; monitor as a distinct specialist tool.
- **Quality:** full branch Build and commercial regression suites passed at merge for #64–#68. Mobile width tests and price-free pathways added. Actual live production screenshots, accessibility/branding judgement, affiliate-click IDs, qualified visitor flow and *approved revenue* are separate remaining work, not claimed as accomplished. Full sitewide visual design system project P0D remains separate and open.



The owner has inspected rendered screenshots of `/verktyg/elavtalskostnad/` and `/mobil/lonar-sig-familjeabonnemang/` and explicitly rejected the spreadsheet-like, dense, blank-form experience. The same principle applies sitewide: **one plain-language task, 0–2 low-knowledge clicks to first relevant value, and visible contextually appropriate eligible partner next steps without demanding exact input.** Optional *exact mode* retains trustworthy complete cost calculation for people with real offers.

This is a more specific implementation standard than the 2026-10-08 overall product masterplan or older autonomous opportunity backlog. It does NOT justify price invention, aggressive click tricks, fake saving estimates, commission-led rankings or paid traffic. North star remains *long-term approved affiliate income per relevant visitor*, constrained by actual usefulness and trust.

## Audit of existing source and screenshots — observed vs unproved

| Route / component | Current observed friction | Better first action | Qualified partner handoff and caveat | Rank |
|---|---|---|---|---|
| `/verktyg/elavtalskostnad/` / `ElectricityCostCalculator` | Screenshot shows annual kWh plus *two* offer cards, each with a name, kWh price, fixed fee and discount, before an initially disabled calculate button; partner area only after computed result. | Ask: **Har du två aktuella erbjudanden?** *Nej → direkt väg till verklig jämförelsetjänst*. *Ja → använd actual kWh if known or choose illustrative usage with confirmation, then progressive A/B quote entry*. | Elskling is a multi-provider comparator; named direct electric companies remain alternatives. Do not infer accurate winner from missing fees. An illustration is an illustration. | **P1** |
| `/mobil/lonar-sig-familjeabonnemang/` / `FamilyMobileCost` | Screenshot shows 2–5 people selector plus several separate bills and main/extra promotional/ordinary fee inputs all at once. Family partner list is gated until complete comparison. | First choose household size; then **Har du priserna?** *Nej → what to check + family-relevant active operator path*. *Ja → family total/month inputs progressively and optional exact campaign/fee details*. | Show real family-relevant approved partners early; distinguish pooled vs per-person data where sourced; do not invent family pricing or present unsourced saving. | **P2** |
| `/verktyg/forstaarskostnad-bredband/`, `/verktyg/forstaarskostnad/` / shared `FirstYearCostCalculator` | Two offer names and many campaign/regular/extra fee fields; useful 12-month result depends on full quote entry. | Start with one offer's ordinary monthly amount, then a second (if known); ask whether campaign fees apply only if applicable. Advanced full-year calculation optional. | Broadband: availability first at Bredbandsval; mobile: surf/network relevance first. Partners available even without calculations, never pretend to quote same-date live prices. | **P3** |
| `/verktyg/hushallskostnadskollen/` | Eight categories and monthly input rows are presented in one long form, despite visitor knowing only some bills; Cost prioritizer is already simpler. | Let visitor select 1–2 areas and choose **vet inte** or input approximate price; reveal more on demand. Show verified subtotal only for filled costs, no guessed household total. | Next action links to existing `/app/` or relevant category. Prioritize by user’s risk/warning signal, not just biggest amount. | **P4** |
| `/ekonomi/jamfor-privatlan/` / `QuotedLoanTotals` | Two extensive loan panels plus principal, instalment, months, monthly fee and setup fee; default illustrative numbers are present but user edit feels dense. | Start from two plainly labeled sample choices: **Lägre månadsbetalning** versus **lägre totalbelopp**, reveal math immediately. Optional enter real offer values. | Conservative total credit + effective APR/SEKKI context first; never pressure a visitor to borrow or call a lower monthly amount a saving. | **P5** |
| `/verktyg/byteskalender/`, category `CostRealityCheck`, `ElectricitySensitivity`, `CondoInsuranceCheck` | Mixed complexity. Smaller specialist guidance already demonstrates progressive choices; validate which need simplification rather than change all for activity. | Prefer relevant contract type, short choice and instant result. Do not create duplicate wizards for functions already straightforward. | Outbound partner context must follow confirmed intent; user can stop with informational value. | P6 audit |
| Category hubs `/elavtal/`, `/bredband/`, `/mobil/`, `/forsakring/`, `/ekonomi/` and `/app/` | Broad overviews recently rebuilt and `/app/` made one-question-first in PR #62. Keep these tested gains; review first fold/partner visibility and do not gratuitously repeat previous work. | A clear beginner action and *immediately visible separate direct-compare shortcut*. | Big readable brand identity, label true multi-provider comparator vs single supplier, alphabetic transparent full roster. | Continual QA |

**Not known / do not claim:** measured bounce/dropoff on the specific calculators, relative conversion rates, typical kWh for any individual dwelling, live supplier prices, actual family discounts, which lender approves, user savings in SEK without exact numbers, or any realized commercial lift. Visual input is the user-supplied desktop screenshots; mobile/fold/accessibility must be tested on production.

## Shared UX contract — every relevant page

1. **No wall of empty controls:** maximum one prominent decision/question in the initial viewport; answer options as large radio/card choices where sensible. Keep small data requirements optional.
2. **First usefulness within two actions:** a relevant next step, a truthful illustration with explicit assumptions, or an immediately available real comparison service. Do NOT show 'save X kr' from rough presets unless mathematically labeled a scenario with explicit inputs.
3. **Two legitimate paths:** **Snabb hjälp** requiring little/no exact data, and **Jämför exakt** to enter real offers. Let users switch either way without losing entered data.
4. **Progressive disclosure:** only ask a question whose answer changes the recommendation or calculation; hide campaign months, bonuses, fees or extra household members until needed. Names like 'Alternativ A' must be optional to edit.
5. **Immediate responsive reaction:** after every real choice update a short progress/meaningful explanation; restrained animation and focus, **no fake scoring, gamification of debt/insurance, confetti or time pressure**.
6. **Qualified partners before exhaustive forms:** surface a plainly labeled external comparator/one or two relevant real operator links near early value, plus an easily findable all-active partner roster. Partner links must be available without completing a calculator. A click is voluntary; no impersonation of an internal live price engine.
7. **Context not commission:** identify *comparison service* vs *individual provider*, category, intended buyer/job, check current conditions and sponsored disclosure; ranking based on user needs and verified data, never invisible payout weights. Do not put a direct supplier like E.ON/Bixia forward as if it compares the whole electricity market.
8. **Visual cleanliness:** shared forest/warm-white/lime theme, one dominant CTA per step, 14–16px actual instructional text, >=44px touch targets, legible real brand names. Desktop content max ~760–960px for forms (unless two-pane comparison adds real clarity), mobile 360/390/430.
9. **Accessibility/state:** keyboard/ARIA group labels, focus visible, no auto-advance before reading, preserved inputs on back/forward within the widget, explanatory empty/unknown choices, screen-reader announcements for true results. Respect reduced motion.
10. **Data integrity:** no price, kWh, insurance policy, names or loan amounts sent to GA4. Events use event type/step/abstract category and small non-identifying answer bands when necessary. Existing `family_mobile_cost_ready` currently emits `annual_difference` and campaign_months; audit and restrict numeric analytics data before rollout as a privacy-sensitive improvement.
11. **Money:** show what price categories are included, omitted, and exact/illustrative status; never project tariff savings with unknown fees, never misstate 'lowest monthly' as 'lowest full term'; source actual comparator data only if available with permissions.
12. **SEO/internal links:** preserve current canonical, title/H1 intent and indexed landing guide links; avoid creating many thin pages. Keep direct provider referral paths correctly tagged with EPI/subID/clickref.
13. **Commercial measurement:** `flow_started` → `first_useful_result_seen` → `partner_options_viewed` → *tagged, qualified outbound click* → *approved transaction/commission*. Segment organic vs owner QA and synthetic legacy network clicks. Prefer uniqueness/qualified journeys, do not treat event counts as unique users or a sale.
14. **QA/rollback:** one coherent bounded change per family, Playwright 360/390/430/1024/1440, flow with no values + valid exact data + missing fee + reset/back + screen reader label checks + all approved link clickref preservation; screenshot review and complete commercial regression; release only when green, rollback if misleading or SEO/partner tagging breaks.

## Ordered shipping plan with objective acceptance criteria

### PR A — Electricity comparison: choose the job before asking for data (P1)

- Keep existing exact `lib/electricityCost.ts` arithmetic.
- First ask **Har du två erbjudanden redan?** options `Ja, jämför dem` and `Nej, visa aktuella avtal`.
- **No:** immediately show a clear **Jämför aktuella elavtal hos Elskling** sponsored link, plus non-gated direct-supplier route and simple cost-tradeoff explanation. Never tell the user they must know kWh.
- **Yes:** one optional consumption entry (preset examples clearly *illustrative, not actual home predictions*) followed by the two offer price fields, with fees/discount in an explicit `Fler detaljer` section; if fee data absent, result must be clearly partial rather than declare a verified full-year cheapest. Do not silently assume unknown mandatory fees are zero in final full-cost claim.
- Exact mode remains for documented prices; partner link is in the same useful screen after result, not several viewport lengths below.
- Tests: no-offer route yields real partner immediately, exact two-offer 12-month calculation unchanged, optional-fee omission never produces an unqualified 'cheapest' claim, affiliate event/IDs present, 5 viewports.

### PR B — Family mobile: one household choice first (P2)

- Step 1: 2/3/4/5 people. Then ask if the user has *actual comparable prices*. If not, show surf/network/family-structure checklist and **verified family-relevant partners** promptly.
- If yes, ask a single aggregate current-household amount or separately priced members; compare to actual full family offer only if available. Full 2–5 separate member, main/extra, promo months/fees stays in optional detailed mode with same math.
- Result labels distinguish quote-based **beräknad årsskillnad** from generic illustration or incomplete information. Active partners never locked behind completing every bill field.
- Tests: 2–5 family count, no-price partner path, direct comparison math (existing baselines), shared vs per-user data caveat, 360px no overflow and tags.

### PR C — Shared mobile/broadband first-year calculator (P3)

- Separate `Vet du priserna?` mode from instant real provider route.
- Ask monthly ordinary price first, then whether campaign and fees apply, and reveal only relevant inputs.
- Keep source category-specific (broadband must do address check externally; mobile coverage/surf). Cover default no-campaign/no-fee and valid promotional exact tests; maintain current indexed/noindex behavior.

### PR D — Hushållskostnadskollen (P4)

- Keep 8 underlying categories for optional detailed totals, but let user start with one named bill and disclose more categories gradually.
- After 1 filled cost, show only *known* subtotal and accessible next category; tie to `/app/` category warning priority correctly.
- Never invent total household spend from incomplete input or recommend reducing essential cover without assessing needs.

### PR E — Loan and insurance/contract specialist audit (P5/P6)

- Make first loan interaction an example-based illustration with exact data optional; preserve effective-APR caveat and no inappropriate credit marketing.
- For `SwitchCalendar`, insurance and other widgets, simplify only where a user actually must enter unnecessary fields. Don't compromise legal/coverage safety.

## Validation and business loop

- Every PR has a dated 13-point evidence decision note: screenshots, user job, alternatives, why each visible control exists, truthful partner intent, SEO/commission mechanics, required proof, next measurement and rollback.
- Pilot focus first: electricity; **only once it passes deterministic QA**, continue to independent family tool. No generic 15-Oct wait and no untested sitewide simultaneous CSS rewriting.
- Audit daily: real unique first-answer starts, partner options exposed, eligible referral clicks with network IDs and eventually **approved commission**, plus new qualified audience sources. If CTR rises but approved income/trust suffers, investigate rather than declare success.
- Remain proactive about ethical non-paid acquisition simultaneously. An elegant tool with no real users is not an accomplished business goal.

**Ready for execution:** owner has approved this sitewide direction. The AI operations scheduler must read this plan each day, implement the next uncompleted scoped PR, apply real QA, and mark status honestly. This document is an implementation contract, **not evidence the redesign is already live**.

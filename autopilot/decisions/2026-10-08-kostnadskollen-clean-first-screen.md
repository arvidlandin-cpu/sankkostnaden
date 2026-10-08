# Kostnadskollen: clean one-question-first redesign (2026-10-08)

**Owner direct feedback:** New full-desktop screenshot shows a wall of controls/text before a visitor can answer. This is a legitimate observed design defect, even though earlier functional QA passed. This release is within the owner-approved product-excellence masterplan and builds on design PR #62, rather than introducing an overlapping unreviewed experiment.

## Evidence from the owner's actual screenshot

Observed from live /app/ at about 1,428px viewport: enormous dark introduction, backlink + year badge, duplicated CTA, three statistic cards (0/4, dash, 4 left), four side navigation tabs, full question card with separate 1-question score bubble, three compact text choice pills, a disabled 'Välj ett svar' control, and an unfinished result area beginning with 'Slutför 4 områden till'. All visible before a user benefits from the service. Multiple competing focal points and repeated progress/remaining counts create high cognitive load; the first question occupies only a minority of the viewport. This is the **specific defect to fix**, not an ungrounded generic desire for prettier styling.

Current source confirms excessive hierarchy: `pages/app.tsx` hero/heroStats + CTA, progressRail, questionTop/scoreOrb, optionalCost, quickPath, cardActions, results/explain; `styles/App.module.css` accumulates 1,000+ lines of responsive/legacy overrides and dense 9–11px captions. The observed source and screenshot together support simplification immediately, even when real traffic sample cannot show a conversion improvement yet.

## Options considered

A. **Decorate existing dashboard** with smaller hero and brighter buttons while retaining all controls. Rejected: no fundamental reduction in choice overload; visual hierarchy stays fragmented.

B. **Pure one-question wizard that removes all navigation and information until four answers.** Rejected: would recreate the previously fixed forced four-answer gate, harm low-knowledge and expert visitors, and potentially hide real immediate affiliate handoff.

C. **Selected: calm editorial introduction and one primary task at a time.** The existing SEO H1 remains but becomes a compact white/background headline. Directly underneath is one question with three large radio-like choices. Empty statistics and duplicate start button are removed; prior household costs show only if they actually exist; category navigation is one optional 'Byt område' expander; an empty result and methodology text are no longer in the initial view. After a response, original immediate guidance, quick partner route where relevant, full 4/4 result, cost math and attribution remain. Actual commercial effect UNKNOWN.

## Exact product/visual rationale

1. **Audience:** Beginners with little knowledge should be able to choose the closest answer without reading product methodology or knowing a contract amount; people who know their target may opt to switch area.
2. **First-screen job:** H1 + one-line explanation + accessible question choices; no zero-value dashboard and no grey disabled action for a new visitor.
3. **Primary interaction:** three tall full-width cards, 56px minimum, 14–15px text, 20px selection indicators, keyboard focus and explicit aria-pressed.
4. **Progress disclosure:** small status, no repeated 0/4 charts; area switch is optional, with currently active area restored and reversible.
5. **Optional precision:** 'Lägg till månadskostnad' remains collapsed unless user had provided a value. Previous household-cost data still shows as factual summary only when nonzero, with no analytic leak.
6. **First useful result:** no result section exists before an answer. After one response the existing provisional next step remains, with related attribution/partner route available on strong signal and no pressured purchase on 'all good'.
7. **Methodology:** user can open a collapsed 'Så fungerar Kostnadskollen' after interacting; all original truth/disclosure about hypothetical savings remains.
8. **Color:** neutral warm white canvas, dark text, restrained lime selection; no ornamental dark hero consuming half a screen. Continue semantic token system introduced in PR #62.
9. **Desktop:** centered ~800px editorial question panel at 1024/1440, avoiding excessively stretched tiny choice pills and empty metric boxes.
10. **Mobile:** 360/390/430px one-column question, no horizontal scroll, legible text, 44px+ actionable controls, stage navigation behind single optional button, no sticky duplicate start CTA.
11. **SEO/analytics:** preserve route, title, H1, canonical, serialized local storage, initial response GA4 event, category intent, quick path attribution, optional cost and full answer/results logic; remove purely navigational `cost_check_hero_start_click` because the redundant hero CTA is removed.
12. **Commercial mechanism:** reduce time-to-first-useful-answer and make subsequent relevant partner comparison more likely **as an unvalidated hypothesis**; no fabricated conversion, saving or approved revenue metrics, no new affiliate program.
13. **Verifier:** Build/static export/integrity, prefilled-data transfer, no-unearned-commission/ads, one early result from 1 answer, all four complete flow, no forced CTA for fit0, quick partner for fit2, privacy event, 360/390/430/1024/1440 responsive screenshot, text/target sizes and open 'Byt område'; compare before/after subjective live render before declaring design work completed. Rollback in one PR.

This is a focused, deliberately cohesive **first-screen redesign**. It does not mark the entire sitewide design masterplan complete. Further work on /app/ below-the-fold results should be tied to observed visitor behavior and visual QA, not random embellishments.

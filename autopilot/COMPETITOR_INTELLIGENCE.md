# Sänk Kostnaden – competitor intelligence and differentiated opportunity map

**First research sweep: 2026-10-08.** These are publicly visible site observations, not verified audits of conversion rate, traffic, software internals, user outcomes or actual commission economics. URLs are first-party source links. Treat vendor claims as **claims by the vendor**, not independently verified results. Reread active pages on future sweeps and record material differences.

## Competitive patterns observed

| Model / observed source | What is visibly strong | Constraints / opportunity for Sänk Kostnaden | Testable implication |
| --- | --- | --- | --- |
| **Elskling**: https://www.elskling.se/ and https://www.elskling.se/jamfor/elavtal | Immediately promises consumption-relevant electric plans; prominent short-form journey; explicit benefits and trust; postcode and contact-entry workflow lead to live offers/partner exchange. | Can obtain individualized offers, unlike our direct affiliate list. Requires more information up front. **Our gap:** explain total cost/contract changes before asking for identity, and route onward to a legitimate quote service when needed. Do not falsely imply we have equivalent live prices. | On an existing relevant URL, test whether a genuinely useful *no-personal-data first-step* and transparent referral beats multiple unexplained partner choices. |
| **Bredbandsval.se**: https://www.bredbandsval.se/ and https://www.bredbandsval.se/om-oss | Address-first search, large recognizable operator set, simple compare-to-order steps, first-year/longer-term cost explanation, trust/social proof and current prices linked to actual address. | Has real operator/address coverage and private order data. We cannot replicate that without licensed feeds/integrations. **Our gap:** before address entry, help choose sensible speed and explain promo vs total year cost, then disclose redirection into actual address search. | Make speed/cost advice and the comparison-service logo/CTA visible with honest "kontrollera på din adress"; measure qualified click to actual comparison. |
| **Compricer insurance**: https://www.compricer.se/forsakring/hem/ | Owns price-quote journey, shows partner breadth, real individualized offers after user/bostad details, conversion CTA, human-assistance fallback, trust signals and example outcomes. | Needs personal data and underlying insurer quoting relationships. **Our gap:** provide a clear initial checklist, distinguish coverage and deductibles, route to verified quote or insurer; avoid appearing to provide quotes we do not have. | Compare a low-friction guide→quote CTA with a logo-only partner grid only after real organic sample. |
| **Hallon (supplier exemplar)**: https://www.hallon.se/mobilabonnemang | Very visible offer economics: data volume, introductory monthly price, promotional duration, recurring price after promotion and simple cards. | Supplier controls live campaigns and terms; we must not invent or freeze vendor offers. **Our gap:** neutral first-year-cost examples and a consumer-readable "after discount" explanation; link to validated current provider terms. | Put contract-year math next to context-matched provider cards only when inputs and facts permit. |
| **Hedvig (supplier exemplar)**: https://www.hedvig.com/se/forsakringar/hemforsakring and https://www.hedvig.com/ | Clear "se ditt pris" offer, consumer language around coverage/terms, visible reviews and trust framing. | Insurer owns quote engine, product liability and client reviews. We may not borrow their proof as our own. **Our gap:** help visitors choose coverage level and understand uncertainty, then reach genuine personalized quotes. | Better consumer-understanding checks before partner CTA, not fabricated rates/reviews. |
| **Elpriskollen (non-commercial benchmark)**: https://elpriskollen.se/ and https://elpriskollen.se/sidor/om-elpriskollen.html | Regulator-backed nationwide electricity comparison, 3 clear input steps (postcode / annual kWh / agreement type), explicit no-commercial-ranking trust. | Strong data provenance and public-interest mandate. **Our gap:** combine the clarity of minimum-input decision guidance with transparent affiliate referral; never call ourselves authority/independent market coverage when not proven. | Make methodology, affiliate limits and inclusion rules more conspicuous than unsupported "best" ranking labels. |

## Repeatable strategic lessons (interpretations, not causal proof)

1. **Know the user before the card wall.** Competitors' headline value is solving a specific customer job, not leading with categories of logos. We should reveal relevant providers without making a brand wall substitute for utility.
2. **Make the economics legible.** Show introductory *and* regular price, fees, term, and 12-month total when sourced or calculable. If unknown, state "kontrollera aktuellt pris hos partner". Correct comparison context beats false precision.
3. **Turn uncertainty into a differentiated capability.** The buyer often does not know kWh, network technology, insurance coverage, surf needs or interest terms. Offer simple no-identity first answers while showing what information could improve precision.
4. **Borrow mental models, not unsupported advantages.** We cannot assert live nationwide prices, price guarantee, market-wide coverage, thousands of reviews, independent regulator status or proprietary order statistics based on competitor claims.
5. **Friction is contextual.** One extra field can be justified if it changes eligibility or accuracy; one extra "Hur vill du jämföra?" UI choice with little output distinction is likely unnecessary. Treat as a hypothesis until measured.
6. **Commercial surfaces need truth and discoverability.** More visible, recognizable brands can lower uncertainty; dozens of undifferentiated offers can raise it. One hierarchy must connect problem → relevant options → one clear next step.
7. **Distribution advantage must be earned.** A novel, properly sourced calculator, easy shareable explanation, or independent checklist is link-worthy; copied articles or mechanically generated search variations are not.

## Initial product opportunities – research order, not automatic release

**Opportunity A – identity-free guided cost triage (cross-category)**

- Audience: "Jag vet inte ens vad mitt avtal kostar".
- Research validation: inspect /app/ and category entry points for redundant decisions, learn from Elskling/Compricer's questions but do not demand identity before giving basic value.
- Original output: high-confidence *next action* / cost-to-check, not invented savings; optional direct partner visibility.
- Critical uncertainty: onboarding does not automatically produce approved transactions; organic acquisition remains limiting.

**Opportunity B – recognizable brands + honest, differentiated next steps (pilot electricity)**

- Audience: visitor who wants an easy trusted exit to an offer.
- Observed internal issue (owner screenshot and source audit 2026-10-08): direct strip of 2 brands, path-choice panel, 3 cards using nearly identical text, and the rest in a collapsed directory; small icons/labels; static partner order can read like best-price ranking.
- Original output: 2–3 prominent named options with verified distinct roles (price comparison vs individual supplier, suitability), an always discoverable full roster, fewer duplicate choices, mobile legibility, clear affiliate disclosure.
- Measure on qualified organic cohorts and do not confuse page event *counts* with independent visitor counts; unique exposure and click users may need better instrumentation.
- The October 7 insurance snippet experiment was explicitly cancelled October 8; no lingering calendar lock. UX improvement pieces are already shipped in PR #79/#85/#92/#93/#95/#97/#99; collect genuine organic cohorts before new commercial outcome claims.

**Opportunity C – first-year total-cost explainer (electricity + mobile + broadband)**

- Audience: consumers lured by promo prices who cannot compare terms.
- Offer only calculations based on verifiable or entered data; separate illustrative values and real provider prices.
- Win by explicit sensitivity to consumption, intro-period duration, fees and renewal price, not by saying "billigast" without prices.

**Opportunity D – underserved FAQ/utility entry points from SERP landscape**

- Use matched queries and search landing tasks. On existing pages, make utilities and decision support the main content where it fits intent; preserve ranking momentum and avoid scaled thin pages.
- First-party GSC to 2026-10-06: "vad menas med kvartspris på el" has 28 impressions, around position 9.1 over 3 dates and 0 clicks; not enough distinct dates for an early snippet test. Existing guide got an original one-click decision utility in merged PR #103 (2026-10-10). Its search and approved-revenue effect is still UNKNOWN; observe page/query cohorts, not a fake experiment outcome.

## Next ongoing scanning questions

Every day rotate across el, bredband, mobil, försäkring and ekonomi; make a full cross-category pass during each calendar week. For each strongest relevant search-result rival **record dated source URL, precise on-page observation, inferred conversion model, missing evidence, technical barrier, our original possible advantage and which one of our pages/tools can serve that job**. Track changes in offer/copy/entry points when material. Capture mobile steps when possible. Include suppliers, commercial comparison sites, neutral regulators and informational sites; never treat all as directly comparable businesses.

Research topics: hero value proposition, trusted provider discoverability, first action, number/sequence of fields, eligibility/personal-data need, price/fee freshness, CTA specificity, mobile viewport content, social-proof provenance, logo permissibility, SEO intent, original tool utility, referral constraints, source of offer truth, and non-SEO distribution opportunities. Use authenticated access only when legitimately available and do not automate registrations or scrape gated user offers.

**Research output is not permission to deploy.** Propose a documented hypothesis under `STRATEGY_AND_EVIDENCE_STANDARD.md`. Respect `policy.json` and experiment state. Refresh obsolete claims.

## Dated evidence update — 2026-10-10

- **Elpriskollen official guidance:** https://elpriskollen.se/sidor/vilket-avtal-ska-jag-valja.html says per-quarter exchange spot price changes each 15 minutes, potential benefit depends on shifting controllable household consumption, and monthly price averages the month. Our site cannot reproduce its independent market-wide offers. This is a source observation, not a claim that our tool increases conversion.
- **Energimarknadsinspektionen official example:** https://ei.se/konsument/el/elavtal/olika-avtalstyper/kan-kvartsprisavtal-vara-bra-for-dig discusses load shifting for electric vehicles/heating and peak demand; notes that effect fees can complicate scheduling. We intentionally avoid fixed savings % or recommending a particular supplier.
- **Original work delivered:** merged PR #103 adds cautious "Kan kvartspris passa dig?" to existing /elavtal/kvartspris/, first useful result after one answer with only a meaningful optional second question; Build, 257 Chromium and 22 WebKit cases green, 390 and 1440 desktop-engine screenshots inspected; no cloned 5-question generic selector and no made-up bill forecast. Daily genuine organic traffic and approved affiliate revenue remain the bottleneck.
- **Next research:** identify realistic non-paid audiences for shareable decision support, e.g. associations for EV owners and energy consumption where group rules explicitly permit helpful educational tools. Document channel/audience permission before action. No automated mass posting, unsupported regulator endorsement or commercial outreach without owner review.

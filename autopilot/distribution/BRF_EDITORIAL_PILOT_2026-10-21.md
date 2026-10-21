# BRF editorial pilot — 2026-10-21

Status: **PREPARED — NOT APPROVED — NOT SENT**  
Owner approval required before every external message.  
Target page: `/forsakring/hemforsakring-bostadsratt/`  
Independent from: `/elavtal/kvartspris/`

## Delivery boundary

This is one distribution track, not a product experiment. It prepares two concrete editorial approaches and one research-only fallback. It changes no production page, component, analytics event, affiliate URL, EPI/subID, disclosure, SEO field or quarter-price cohort.

## Evidence-backed decision record

1. **Audience / job**  
   A Swedish bostadsrätt member who knows that the association may have collective cover but does not know whether the personal bostadsrättstillägg should remain. The job is to verify cover, deductible and important conditions before changing insurance, while understanding that ordinary home insurance is still a separate need.

2. **Competitor / public observation (checked 2026-10-21)**  
   - [HSB BRF Chauffören](https://www.hsb.se/norr/brf/Chaufforen/boendeinformation/hemforsakring-och-bostadsrattstillagg/) states that its collective add-on means the member does not need an add-on in the personal home insurance.
   - [HSB BRF Kortedala](https://www.hsb.se/goteborg/brf/kortedala/boende/hemforsakring--bostadsrattstillagg/) states that a personal add-on may still have advantages because conditions can differ, and highlights deductible and age-deduction differences.
   - [Riksbyggen's knowledge bank](https://www.riksbyggen.se/kunskapsbanken/lagar-och-regler/forsakringar/) explains that the add-on can be individual or collectively arranged by the association.

   Observable gap: public BRF guidance is context-specific and can lead to different next actions. A short verification checklist is safer and more reusable than a blanket “cancel” or “keep” instruction.

3. **Independent inference**  
   Observed: the public examples give different advice and condition details.  
   Hypothesized mechanism: a neutral checklist is useful editorial material because it helps members ask the association and insurer the right questions.  
   Proven performance: **UNKNOWN**. No click, publication or revenue result is inferred from the examples.

4. **Our evidence**  
   The target page already contains a two-question, no-login `CondoInsuranceCheck`, a checklist, a route to the existing home-insurance comparison and an official consumer source. Its analytics event is `condo_protection_answer` with source `condo_insurance_guide`. Current source-specific referral baseline, unique affiliate-click users and network-approved commission for this pilot are **UNKNOWN** because nothing has been sent or published. This delivery found no unique product-utility gap requiring a page change.

5. **Choice set**  
   - Status quo: wait for organic discovery. Rejected for now because it does not exercise the prepared audience-acquisition path.
   - Build another BRF feature or rewrite the page. Rejected because the existing tool already answers the bounded job and no new utility gap is evidenced.
   - Selected: offer a concise, independently useful member box to verified editorial contexts, with a source-specific tagged link. This is reversible, free and directly tests distribution without disturbing the product or quarter-price experiment.

6. **Specific hypothesis**  
   If an editor serving BRF members publishes the neutral checklist with the tagged target link, then relevant referral users can reach the existing protection check. Observable outcomes are publication status, tagged referral new users, unique users with `affiliate_click`, and later network-approved transactions. No outcome is assumed.

7. **Content / offer truth**  
   The member box makes no price, saving, insurer-ranking or coverage guarantee. It tells readers to verify the association's actual policy and compare conditions before cancelling. The linked site must retain its existing ad-link disclosure. Source freshness was checked on 2026-10-21; editorial reuse must re-check sources if delayed materially.

8. **UI hierarchy**  
   No UI change. The existing page title, explanation, two-question tool, checklist and contextual comparison route remain intact. Mobile, accessibility and keyboard behavior are outside this distribution-only change.

9. **Revenue chain**  
   Editorial context → tagged visit to the BRF guide → useful protection check → optional relevant comparison route → qualified partner click → approved network transaction. This pilot can influence only discovery and tagged visits directly. Publication, partner fit, conversion and commission cannot be controlled or promised.

10. **Attribution and measurement**  
    - Use `utm_medium=referral` so tagged visits remain in the relevant referral channel.
    - Use one unique `utm_source` per editorial context and a shared `utm_campaign=brf_forsakringskoll_2026q4`.
    - Report sessions and new users by tagged source, keeping Direct and unknown separate.
    - Count unique users with `affiliate_click`, not raw event totals.
    - Exclude verified owner/QA traffic.
    - Report network-approved transactions and commission separately; if matching or network data is incomplete, report **UNKNOWN**.
    - Baseline before first send: zero pilot-tagged visits by definition. Review only after a documented publication and sufficient observation; do not treat one click as success.

11. **Trade-offs and reversibility**  
    Editorial acceptance is uncertain and may be zero. A commercial site can reduce acceptance, so the pitch discloses affiliate funding and offers useful copy without requiring endorsement. No paid placement is allowed. The pilot is stopped by not sending further messages; no production rollback is needed.

12. **Decision**  
    **PREPARE, DO NOT SEND.** Two concrete messages are ready below. HSB has an explicitly verified tip route. Bo Bättre has a public editorial tip form but requires sender identity/contact fields that are not available here. Bostadsrätterna remains research-only because the checked magazine page does not explicitly invite external editorial tips.

13. **Verifier after release**  
    After explicit owner approval and a separately recorded send, update the contact log. Verify the exact published URL before marking `published`. Compare tagged referral outcomes to the pre-send zero baseline, then record unique affiliate-click users and approved network outcomes when mature. Update the learning ledger with keep/stop reasoning; never conclude from tiny samples.

## Reusable member box

### Kontrollera detta innan du tar bort bostadsrättstillägget

Har föreningen ett kollektivt bostadsrättstillägg? Be styrelsen om försäkringsbolag och aktuellt villkor. Kontrollera sedan omfattning, självrisk, högsta åldersavdrag, hur vattenskador hanteras och när avtalet senast ändrades. Jämför med ditt eget försäkringsbolag innan du säger upp ett personligt tillägg. Den vanliga hemförsäkringen behövs fortfarande för bland annat lösöre, ansvar och rättsskydd. Sänk Kostnadens kostnadsfria tvåfrågorskoll kräver ingen inloggning och hjälper medlemmen att samla rätt frågor; den avgör inte vilket försäkringsskydd en viss person behöver.

## Concrete message A — Hemma i HSB

Public context: [Hemma i HSB](https://www.hsb.se/stockholm/medlem/bostadsrattsforening/medlemstidning/) explicitly says that the editorial team welcomes tips.  
Public route: `hemmaihsb@hsb.se`  
Status: **PREPARED — NOT APPROVED — NOT SENT**

**Subject:** Redaktionstips: checklista innan medlemmen ändrar bostadsrättstillägget

> Hej redaktionen för Hemma i HSB,
>
> På publika BRF-sidor möter medlemmar olika råd om eget bostadsrättstillägg när föreningen har ett kollektivt skydd. Det rimliga nästa steget beror på föreningens faktiska villkor, självrisk och åldersavdrag.
>
> Därför har vi tagit fram den korta, neutrala medlemsrutan nedan. Ni får gärna använda eller bearbeta den redaktionellt om ämnet passar. Vi begär ingen betald placering.
>
> [Insert the reusable member box above.]
>
> Som komplettering finns en kostnadsfri tvåfrågorskoll utan inloggning:  
> https://sankkostnaden.se/forsakring/hemforsakring-bostadsratt/?utm_source=hemma_i_hsb&utm_medium=referral&utm_campaign=brf_forsakringskoll_2026q4&utm_content=medlemsruta_checklista
>
> Transparens: Sänk Kostnaden är en konsumentinriktad jämförelsesajt som delvis finansieras via annonslänkar på jämförelsesidor. Själva kontrollen rekommenderar inget visst försäkringsbolag.
>
> Vänliga hälsningar,  
> Sänk Kostnaden-redaktionen

Approval must cover this exact text, recipient and sender identity before sending.

## Concrete message B — Bo Bättre

Public context: [Bo Bättre's contact page](https://www.bobattre.se/index.php/contact-us) invites editorial tips and questions about bostadsrätt. The form requests name, address, email and phone.  
Status: **PREPARED — BLOCKED ON OWNER-APPROVED SENDER DETAILS — NOT SENT**

**Subject:** Redaktionstips: fem villkor att kontrollera vid kollektivt bostadsrättstillägg

> Hej Bo Bättre-redaktionen,
>
> En praktisk medlemsfråga saknar ofta ett säkert ja/nej-svar: kan ett eget bostadsrättstillägg tas bort när föreningen har en kollektiv lösning? Publika BRF-råd skiljer sig, eftersom villkor, självrisk och åldersavdrag kan skilja sig.
>
> Vi erbjuder gärna den korta, neutrala faktarutan nedan för redaktionell bearbetning:
>
> [Insert the reusable member box above.]
>
> En kostnadsfri tvåfrågorskoll utan inloggning finns här:  
> https://sankkostnaden.se/forsakring/hemforsakring-bostadsratt/?utm_source=bo_battre&utm_medium=referral&utm_campaign=brf_forsakringskoll_2026q4&utm_content=medlemsruta_checklista
>
> Transparens: Sänk Kostnaden är en konsumentinriktad jämförelsesajt som delvis finansieras via annonslänkar på jämförelsesidor. Själva kontrollen rekommenderar inget visst försäkringsbolag. Ingen betald placering efterfrågas.
>
> Vänliga hälsningar,  
> Sänk Kostnaden-redaktionen

Do not submit the form until the owner has approved this exact text and supplied/approved the required sender details.

## Research-only fallback — Din Bostadsrätt

[Bostadsrätterna's Din Bostadsrätt](https://www.bostadsratterna.se/radgivning/din-bostadsratt) is audience-relevant and publishes member guidance, but the checked page does not explicitly invite external editorial tips. Keep status `researched`; do not use a generic address as implicit permission.

## State transitions

Only move forward, with evidence:

`researched → prepared → approved → sent → published → traffic_outcome`

- `approved`: owner approved exact recipient, text, sender identity and UTM URL.
- `sent`: timestamp and actual route recorded.
- `published`: live URL verified.
- `traffic_outcome`: observation window, source-tagged sessions/new users, unique affiliate-click users, approved transactions and approved commission recorded. Use **UNKNOWN** for unavailable fields.

# P0H – WARM, HUMAN, EDITORIAL PRODUCT REDESIGN
Owner direction 2026-10-12. Latest binding design decision after P0G. Not a cosmetic patch.

## Why this change exists
Owner screenshots from 14:21–14:23, 12 October, show that the existing production homepage and five hubs feel small, pale, repetitive and emotionally empty despite multiple builds and successful CI. The original warmer household/family imagery from the pre-blue period had more human life. **Do not claim P0F/P0G CI satisfied that goal.** Keep working from visibly observed product problems.

The screenshots look **heavily browser-zoomed out**: browser chrome/taskbar remains legible while the whole site and top navbar shrink to a fraction of native desktop scale. This makes a max-width layout appear miniature even when CSS width is normal. Verify desktop UI at **100% browser zoom with Ctrl+0**, actual 1440 and 1920 CSS-pixel viewports. Do not try to compensate for 25%-zoom by making the desktop excessively wide and ruining mobile.

## Product implementation, not just guidance
- Homepage hero rewritten as a full-size **human/candid family photograph** paired with a genuine editorial, warm off-white brand treatment, restrained green supporting accent, and a clearer first action. SEO phrase `Sänk dina fasta kostnader` remains in H1. Existing product explorer kept in a prominent useful white stage below. No fabricated savings.
- Old `Home.module.css` was **replaced** rather than adding another layer to its ~45KB of historic P0D/P0E/P0F CSS overrides. Homepage is editorial 2+3 warm photo cards, responsive and real photo resolution; tools remain optional, guide links retained, principle section is a visually warm household story with real photography. All five link routes preserved.
- All five category heroes now use appropriate high-resolution Pexels **human/warm household images** and a genuinely warm ivory layout rather than washed-out blue product photos. Real artwork is visible on mobile, previously hidden. The layout remains responsive.
- All five category decision decks were rebuilt as **one compact, readable route rail**: fewer competing boxes, 3 functional choices intact including the changed result and scroll-to-dock logic. This eliminates part of the double-component impression without deleting actual functional paths.
- The five P0G insight blocks were redesigned as a **single editorial decision feature** with human imagery and natural language rather than dark-blue miniature dashboards. The Tibber SVG/partner sponsored treatment, separate real quarter-price data and existing affiliate tags remain untouched.
- Site-wide **semantic neutral design tokens** are now warm (canvas, raised/soft surface, lines) while ink remains navy and actionable CTAs remain blue. Guides/tools get a subtler warmth without modifying their logic or SEO.

## New image sources
All photos are Pexels-licensed freely usable for editorial/commercial websites with no implied sponsorship:
- Home: 3875141 family relaxing in living room (Gustavo Fring, family having fun)
- Home category cards: broadband 8055076 family on couch, electricity 8055828 warm family at home, mobile 8067709 smartphone usage, insurance 28949489 dog at home, economy 16098002 financial desk
- Home method story: 4473625 warm mother-and-child bonding
- Category hero: broadband 8055076, electricity 8055828, mobile 5901387 cozy sofa/phone, insurance 28949489 dog, economy 6964105 couple managing household budget
- Editorial insight: broadband 4474041 family and remote work, mobile 4254149 warm video call at home, insurance 27177239 family together, finance 6964105 couple household bills.

Source pages: https://www.pexels.com/photo/happy-family-having-fun-in-living-room-at-home-3875141/ ; https://www.pexels.com/photo/happy-family-inside-their-home-8055828/ ; https://www.pexels.com/photo/couple-looking-at-their-bills-6964105/ . More IDs in CSS/JS and `.github/workflows/p0h-warm-assets.yml`. Photographs are illustration, never testimonials, paid endorsement or guaranteed saving. Pexels license: https://www.pexels.com/license/.

## Hard release contract
- QA screenshots at **100%-zoom**: home and every category at 360,390,430,1024,1440,1920; photos must actually load at readable source resolution, no horizontal overflow, clear contrast/keyboard focus.
- Pass build, metadata, SEO, partner tag/EPI and commercial Chromium + WebKit checks, not just a green CSS unit test.
- Verify Cloudflare Pages and the CSS/JS files actually served on sankkostnaden.se **separately** from PR merge; never assert source SHA based on shared client assets alone.
- The owner has **not** visually approved P0H until actual new screenshots match the warmer magazine/product intent. Manual review remains mandatory.
- All affiliate network-approved commissions remain UNKNOWN unless an authoritative report can be read. No conversion uplift inferred from CI, no paid ads, services, new agreements or bulk email.
- SEO kvartspris guidance observation remains as previously scoped until at least Oct 18; the Oct 7 insurance snippet test remains cancelled.
- Design operator must not parallel-edit HomeHero, Home.module.css, CategoryPremium, CategoryJourney or CategorySpotlight while this PR is active. Read this note first when continuing design.


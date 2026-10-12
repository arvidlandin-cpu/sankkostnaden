# P0I — Approved image treatment / seamless photographic fade (12 Oct 2026)

## Later owner approval, precisely scoped

After P0H's new screenshots, owner requested warmer, more attractive real-life family imagery, softer **transparent fades into copy** rather than photo blocks, and selected the two visual examples shown directly in the conversation as **“mkt bättre”**. This approves the visual direction of these **mockups**, not an undocumented claim that the live site matches every pixel.

We must prioritize:
- Meaningful family/household warmth and believable photography in natural light, without photos posing as customers, testimonials or endorsements.
- Text and imagery appearing to occupy **one seamless surface**, using scrims and gradient masking to protect legibility.
- Real responsive high-resolution source photography and no external-offer claims embedded in decorative images.
- Consistent warm cream, nature green accents, navy ink and clear blue CTA; not reverting to generic cards, washed-out blue gradients or all-over stock-photo walls.
- Responsive composition and high-performing real interactive entry. No fake dashboard UI inserted as an image.
- The visual examples are *directional designs* — screenshots cannot be dropped into the site as rasterized UI, because controls, accessibility and attribution must remain real HTML.

## Implemented in PR #145 (source branch until QA/merge)

1. **Homepage:** Live HTML H1, all CTA links and interactive HomeDecisionExplorer remain intact. Hero now has a full-bleed, high-res family-reading image from Pexels ID `4874926`, with a transparent scrim over the left part behind copy, plus gentle fade into the category chooser below. Previous separate rounded photo tile removed. Hero uses a custom single coherent stylesheet with separate mobile/tablet layouts.
2. **Broadband hero:** Pexels `6995135`: father and children with laptop, visibly tied to connectivity in family life. The photographic layer extends across the hero and uses a higher-opacity fade behind the title. Mobile keeps a real <img> and a separate fade into copy.
3. **Photo variety:** Homepage broadband category tile uses a different warm family scene `7078807`, and broadband insight uses `7117518`, avoiding repeated, unrelated computer/TV images. Other P0H category visuals remain unchanged pending separate evidence; do not randomly replace all assets.
4. Photo delivery audit updated to request and validate all four new IDs before merge; Playwright 390/1024/1440/1920 verifies image load, responsive hero geometry, visual scrim, unchanged interactive broadband choices and no horizontal overflow.
5. Genuine full-page screenshots from 390,1440,1920 still required and a fresh owner visually reviewing them remains the actual **visual acceptance** gate.

## Business / QA boundaries

Preserve search-intent H1 `Sänk dina fasta kostnader`, canonical URLs, working lead pages, sponsored disclosures, partner URLs/clickref/subID/EPI, quarter-price independent spot data, the 18 Oct scoped SEO observation and cancellation of the insurance snippet experiment. No paid assets, ads, new services, fake metrics or conversion uplift claims. Approved affiliate network provision is **UNKNOWN**, never fabricated 0 SEK.

Merge, green build, web-ready CDN images, deployed CSS/JS, exact production SHA and owner aesthetic signoff are separate facts. A photo mockup alone cannot prove implementation. After merge verify production client CSS/JS on sankkostnaden.se before saying P0I is live. Exact origin SHA remains UNKNOWN unless deploy evidence confirms it.

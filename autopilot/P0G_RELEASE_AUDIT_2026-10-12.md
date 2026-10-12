# P0G release acceptance ledger — 2026-10-12

## Verified result

**P0G.1–P0G.4 are code-merged and live product assets have been independently matched, but owner visual sign-off has NOT been granted.**

| Contract | Result | Evidence |
|---|---|---|
| Owner design work | P0G.1–P0G.4 merged | PR #142, squash product code SHA `757379d2423d5def5fb2018f74d96e6ba8e2cfc4` |
| Full commercial Chromium QA | 642 passed | workflow `Commercial regression smoke` run `38243367197` |
| Linux Safari-engine WebKit QA | 22 passed | same workflow; **not a physical iPhone** |
| Build, checks, export, SEO and affiliate integrity | PASS | PR #142 final HEAD `15e51b4da8cec988412cdddfa67e369c5ebc30ce`, Build check `38243367360` |
| New photo and Tibber SVG delivery | PASS | photo/media audit `38233599470`; nine original photo IDs fetched, SVG fetched; responsive home images verified in actual Chromium |
| Live own-domain identity | **PASS — 7/7 routes CSS+real JS exact match** | `P0G product fingerprint vs production` run `38244863679`, completed 2026-10-12 11:48:01 UTC |
| Actual live P0G category features | PASS HTML markers 5/5 | same independent live fingerprint |
| Exact origin-side deployed Git SHA | **UNKNOWN** | client CSS/JS parity cannot prove unique edge origin SHA |
| Physical iPhone | **UNTESTED** | free device QA quota remains unavailable |
| Subjective owner visual acceptance | **PENDING** | real screenshots from current deployed version still need the owner's visual review |
| Approved affiliate provision | **UNKNOWN** | no verified partner-network ledger; never write 0 kr |

## Routes with compiled assets matching live public HTML

`/`, `/bredband/`, `/elavtal/`, `/mobil/`, `/forsakring/`, `/ekonomi/`, `/elavtal/kvartspris/`.

For each route, exported product CSS and real JS filename sets matched the HTML fetched from `https://sankkostnaden.se`. Opaque Next.js `_buildManifest` and `_ssgManifest` are excluded by design. This is production asset verification, NOT inferred from merging or green CI. Five category HTML markers `p0g-insight-*` were independently present.

The verification code is in `scripts/check-p0g-main-live.mjs`. Its workflow `.github/workflows/p0g-live-release-audit.yml` ran read-only against the actual public origin without Cloudflare keys. It has no automatic paid monitoring and can be manually dispatched in future.

## Guardrails for the next design operator

Do **not** redo P0D palette/P0E interaction or P0F scaling, and do not compete with the merged P0G changes. The next product action is *visual inspection* of P0G actual deployment at 100% browser zoom and 1440/1920 desktop and 360/390/430 mobile: image crop, contrast, logo readability, line breaks, content below fold and relevant sponsor CTA placement. Correct only proven deficiencies. `PartnerIdentity` monograms are **decorative UI, not official partner logos**; selective true official-logo upgrades require reliable lawful assets and a real conversion/user-value rationale.

P0G's Tibber SVG wordmark and sponsored partner card are distinct from the independent 15-minute spot-price feed. Do not portray market spot prices as personal Tibber quotes. User preference is high-impact premium editorial design, not more unrelated features or box walls. Preserve all existing affiliate tracking URLs, clickref/subID/EPI capture and disclosure, local SEO and category SEO route intent.

Kvartspris-guide experiment observation remains scoped at least through 18 Oct; the 7 Oct insurance snippet remains cancelled without calendar freeze. Up to two independent growth initiatives per policy. Organic qualified visitors → user value → attributable relevant sponsored click → verified **APPROVED** affiliate provision remains the business goal. No paid services, campaigns or contracts.

## Caveat on SHA terminology

Current **product code** was verified against GitHub merge SHA `757379d...` and deployed client asset fingerprint. A later docs-only PR may advance `main` SHA without changing source product code or verified compiled client assets. Thus `latestVerifiedMainCommit` in the release context denotes this product baseline, not an unverifiable origin SHA.

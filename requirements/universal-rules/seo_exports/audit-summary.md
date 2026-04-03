# SEO Audit Summary

Source basis: `audit.md`, `site-inventory-diagnostic.csv`, `pages_seo_export.csv`, `pages_seo_issues.csv`, current `public/` output.

## Snapshot

- Canonical public routes found: 113
- Shadow or legacy `/calculators/*` routes found: 107
- Routes in navigation but missing generated HTML: 0
- Generated route not present in sitemap: `/homepage-sample/`

## Findings

### Phase 0: Site Inventory

- Route generation is currently driven by `scripts/generate-mpa-pages.js`, `scripts/generate-sitemap.js`, `public/config/navigation.json`, cluster navigation files, and `config/clusters/route-ownership.json`.
- Inventory is complete, but the site still exposes a large duplicate shadow layer under `/calculators/*`.

### Phase 1: Indexability And Crawl Control

- Main canonical pages in the SEO export have canonical tags, H1s, and JSON-LD coverage.
- Crawl leakage is still the main risk: 109 public `/calculators/*` HTML routes are reachable, while `_headers` only adds `noindex` to a small subset.

### Phase 2: URL And Structure Hygiene

- `_redirects` contains explicit slash and legacy cleanup rules for `sample-size`, `countdown-timer`, and `percentage-composition`.
- Legacy `countdown-timer-generator` references still exist in `_redirects`, `_headers`, and route-bundle manifest/comments.

### Phase 3: On-Page SEO Structure

- Biggest issue pattern is metadata quality, not missing tags.
- Current issue counts: `DESC_TOO_SHORT` 33, `DESC_TOO_LONG` 3, `TITLE_H1_MISMATCH` 1.
- The only title/H1 mismatch surfaced is `/math/trigonometry/law-of-sines-cosines/`.

### Phase 4: Content Depth And Intent Match

- 15 exported pages are under 500 words.
- Thin content is concentrated in pricing and salary pages, plus a few hubs.

### Phase 5: Internal Linking And Clusters

- Cluster structure is clear and broad across math, finance, salary, percentage, pricing, and time/date.
- Current orphan-like pages from the generated link graph: `/homepage-sample/`, `/calculators/finance/savings-goal/`, `/calculators/percentage-calculators/commission-calculator/`.

### Phase 6: Technical Performance

- No blocking external JS was found in the generated HTML scan; module scripts are the dominant pattern.
- Real CSS `@import` is still present in the generated fraction calculator route bundle, which is a direct render-blocking risk.

### Phase 7: Structured Data

- Canonical pages in the export show full JSON-LD coverage.
- FAQ schema appears on 70 pages; `SoftwareApplication` appears on 103 pages.

### Phase 9: Content Farm Risk

- The main suppression risk is not duplicate titles or descriptions.
- The higher risk is repeated short-form calculator copy on lower-word-count pages, especially salary and pricing tools.

## Priority Order

1. Lock down `/calculators/*` crawl exposure with broader redirect or noindex coverage.
2. Remove remaining `countdown-timer-generator` references from public-facing routing and bundle metadata.
3. Fix short or long meta descriptions, then resolve the law-of-sines title/H1 mismatch.
4. Expand the thinnest pricing and salary pages first.
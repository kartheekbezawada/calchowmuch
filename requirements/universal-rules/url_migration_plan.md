# Urgent Percentage URL Migration (SEO/SERP + Sitemap Only)

## Summary
This wave performs a percentage-only URL cutover to canonical `-calculator` slugs with full sitemap and SEO/SERP alignment.

Scope guard:
- In scope: URL paths, redirects, canonical links, sitemap, structured-data URLs, and SEO verification.
- Out of scope: unit testing, performance/CWV, functional e2e, cluster regrouping, calculator logic/UI changes.

## Locked Scope
Cluster: `percentage-calculators` only.

Canonical route map:
1. `/percentage-calculators/percent-change/` -> `/percentage-calculators/percent-change-calculator/`
2. `/percentage-calculators/percentage-difference/` -> `/percentage-calculators/percentage-difference-calculator/`
3. `/percentage-calculators/percentage-increase/` -> `/percentage-calculators/percentage-increase-calculator/`
4. `/percentage-calculators/percentage-decrease/` -> `/percentage-calculators/percentage-decrease-calculator/`
5. `/percentage-calculators/percentage-composition/` -> `/percentage-calculators/percentage-composition-calculator/`
6. `/percentage-calculators/reverse-percentage/` -> `/percentage-calculators/reverse-percentage-calculator/`
7. `/percentage-calculators/percent-to-fraction-decimal/` -> `/percentage-calculators/percent-to-fraction-decimal-calculator/`
8. `/percentage-calculators/percentage-finder-calculator/` -> `/percentage-calculators/percentage-finder-calculator/`
9. `/percentage-calculators/percentage-of-a-number/` -> `/percentage-calculators/percentage-of-a-number-calculator/`

Legacy redirect:
- `/math/percentage-increase/` -> `/percentage-calculators/percentage-increase-calculator/`

Not in this wave:
- `commission-calculator`
- `discount-calculator`
- `margin-calculator`
- `markup-calculator`

## SEO Contract
- One canonical URL per migrated calculator.
- Old URLs permanently redirect (301) to canonical URLs.
- Sitemap includes only canonical URLs for migrated routes.
- No duplicate migrated URLs in sitemap.
- Internal links must use canonical migrated URLs.

## Execution Checklist
1. Freeze redirect map for the 9 routes.
2. Move canonical route folders to new slugs.
3. Update navigation/generator/structured-data references.
4. Regenerate pages and sitemap.
5. Add `_redirects` entries for old -> new paths.
6. Run SEO-only verification.
7. Resolve failures and rerun SEO checks.

## SEO-Only Validation Commands
1. `CLUSTER=percentage npm run test:cluster:seo`
2. `CLUSTER=percentage CALC=percent-change npm run test:calc:seo`
3. `CLUSTER=percentage CALC=percentage-difference npm run test:calc:seo`
4. `CLUSTER=percentage CALC=percentage-increase npm run test:calc:seo`
5. `CLUSTER=percentage CALC=percentage-decrease npm run test:calc:seo`
6. `CLUSTER=percentage CALC=percentage-composition npm run test:calc:seo`
7. `CLUSTER=percentage CALC=reverse-percentage npm run test:calc:seo`
8. `CLUSTER=percentage CALC=percent-to-fraction-decimal npm run test:calc:seo`
9. `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:seo`
10. `CLUSTER=percentage CALC=percentage-of-a-number npm run test:calc:seo`
11. `npx playwright test tests_specs/infrastructure/e2e/sitemap-seo.spec.js`

## Manual SEO/SERP Verification
- Old URL returns 301.
- New URL returns 200.
- Canonical equals served new URL.
- JSON-LD URL fields match canonical URL.
- Sitemap has canonical migrated URLs only and no duplicates.

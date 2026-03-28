# Math Table Remediation Log

## Scope Lock

- Date: 2026-03-28
- Release intent: cluster-shared math table semantics and mobile remediation
- Approved scope:
  - `requirements/universal-rules/math-table-remediation-log.md`
  - `requirements/universal-rules/release-signoffs/**`
  - `public/calculators/math/**`
  - `public/math/**`
  - `public/calculators/math/shared/cluster-light.css`
  - `public/calculators/math/log/shared.css`
  - `public/calculators/math/trigonometry/shared.css`
- Forbidden scope:
  - non-math public routes
  - global shared/core files outside approved math prefixes
  - sitemap/navigation/content work unrelated to touched math routes

## Confirmed Issue Groups

- Cluster-wide real tables already exist, but their semantics are incomplete:
  - no `<caption>` elements
  - no `scope="col"` on column headers
  - no `scope="row"` on first-column row labels
- Tables do not always read visually as tables because wrapper framing and mobile overflow treatment are inconsistent.
- Runtime table output also needs normalization:
  - `/math/sample-size/` sensitivity table
  - `/math/calculus/critical-points/` generated result tables
  - `/math/algebra/system-of-equations/` generated matrix tables
- True faux-table conversions found in public math routes so far: none confirmed.

## Route Inventory

- Public math routes with table markup discovered during baseline audit:
  - `/math/algebra/factoring/`
  - `/math/algebra/polynomial-operations/`
  - `/math/algebra/quadratic-equation/`
  - `/math/algebra/slope-distance/`
  - `/math/algebra/system-of-equations/`
  - `/math/basic/`
  - `/math/calculus/critical-points/`
  - `/math/calculus/derivative/`
  - `/math/calculus/integral/`
  - `/math/calculus/limit/`
  - `/math/calculus/series-convergence/`
  - `/math/confidence-interval/`
  - `/math/fraction-calculator/`
  - `/math/log/common-log/`
  - `/math/log/exponential-equations/`
  - `/math/log/log-properties/`
  - `/math/log/log-scale/`
  - `/math/log/natural-log/`
  - `/math/mean-median-mode-range/`
  - `/math/number-sequence/`
  - `/math/permutation-combination/`
  - `/math/probability/`
  - `/math/sample-size/`
  - `/math/standard-deviation/`
  - `/math/statistics/`
  - `/math/statistics/anova/`
  - `/math/statistics/correlation/`
  - `/math/statistics/distribution/`
  - `/math/statistics/hypothesis-testing/`
  - `/math/statistics/regression-analysis/`
  - `/math/trigonometry/inverse-trig/`
  - `/math/trigonometry/law-of-sines-cosines/`
  - `/math/trigonometry/triangle-solver/`
  - `/math/trigonometry/trig-functions/`
  - `/math/trigonometry/unit-circle/`
  - `/math/z-score/`

## Baseline Evidence

- Representative screenshots captured before edits:
  - `tmp/math-table-remediation/baseline/permutation-combination__desktop.png`
  - `tmp/math-table-remediation/baseline/permutation-combination__mobile-390.png`
  - `tmp/math-table-remediation/baseline/sample-size__desktop.png`
  - `tmp/math-table-remediation/baseline/sample-size__mobile-390.png`
  - `tmp/math-table-remediation/baseline/log__common-log__desktop.png`
  - `tmp/math-table-remediation/baseline/log__common-log__mobile-390.png`
  - `tmp/math-table-remediation/baseline/fraction-calculator__desktop.png`
  - `tmp/math-table-remediation/baseline/fraction-calculator__mobile-390.png`
  - `tmp/math-table-remediation/baseline/trigonometry__unit-circle__desktop.png`
  - `tmp/math-table-remediation/baseline/trigonometry__unit-circle__mobile-390.png`
- Baseline semantic inventory:
  - 36 public math routes with table markup
  - 0 captions
  - 0 `scope="col"`
  - 0 `scope="row"`

## Current Milestone

- `completed`: shared table system, semantic normalization, built-route sync, and route audit

## Touched Routes

- All 36 routes listed in the inventory were updated in `public/math/**`.
- Source/runtime remediation was applied for:
  - `public/calculators/math/shared/cluster-light.css`
  - `public/calculators/math/fraction-calculator/calculator.css`
  - `public/calculators/math/calculus/critical-points/module.js`
  - `public/calculators/math/calculus/critical-points/calculator.css`
  - `public/calculators/math/algebra/system-of-equations/module.js`
  - `public/calculators/math/sample-size/module.js`
  - `public/calculators/math/sample-size/calculator.css`
- True faux-table conversions in public math routes: none were required. The cluster issue was semantic/table-presentation debt on real tables.

## Verification Notes

- `npm run lint`: PASS
- `CLUSTER=math npm run test:cluster:unit`: PASS
- `CLUSTER=math npm run test:cluster:e2e`: PASS
- `CLUSTER=math npm run test:cluster:seo`: PASS
- `CLUSTER=math npm run test:cluster:cwv`: PASS
- `CLUSTER=math npm run test:schema:dedupe -- --scope=cluster`: PASS
- `CLUSTER=math npm run test:cluster:contracts`: PASS
- `npm run test:isolation:scope`: PASS
- `npm run test:iss001`: FAIL
  - Failure mode is global/legacy-shell mismatch, not a math-table regression:
    - `.left-nav`, `.center-column`, and `.ads-column` selectors are absent on the tested layout
    - snapshot baseline expects a different full-page shell shape
  - Evidence:
    - `test-results/infrastructure-e2e-iss-des-82101-imensions-during-navigation-chromium/`
    - `test-results/infrastructure-e2e-iss-des-ac836-imensions-during-navigation-chromium/`
    - `test-results/infrastructure-e2e-iss-des-8cbea-imensions-during-navigation-chromium/`
    - `test-results/infrastructure-e2e-iss-des-4ebfc-n-visible-during-navigation-chromium/`
    - `test-results/infrastructure-e2e-iss-des-edb3f-ion---page-layout-stability-chromium/`
- Route audit: PASS
  - `tmp/math-table-remediation/final-audit.json`
  - 36/36 touched routes now have captions, header scopes, the remediation style, and `scrollWidth === clientWidth` at `390px`
- Before/after screenshot evidence:
  - `tmp/math-table-remediation/baseline/`
  - `tmp/math-table-remediation/after/`

## Deferred Items

- Release readiness is blocked only by the failing global `ISS-001` suite.
- Scoped generator regeneration was blocked by an out-of-scope repo issue:
  - `scripts/generate-mpa-pages.js` hard-fails because `requirements/universal-rules/AdSense code snippet.md` is missing
  - To stay inside the approved scope contract, built outputs were synced directly under `public/math/**` instead of widening into generator fixes

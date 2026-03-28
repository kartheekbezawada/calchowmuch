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
- `in_progress`: shared table system and source semantic normalization

## Verification Notes
- Pending

## Deferred Items
- None yet

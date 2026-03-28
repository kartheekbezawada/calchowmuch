# Math UX Remediation Wave Log

## Scope Lock
- End state: `implementation-complete`, not `release-ready`
- Scope: confirmed `/math/**` UX findings only
- Allowed write scope:
  - `requirements/universal-rules/math-ux-remediation-wave-log.md`
  - affected `public/math/**`
  - affected `public/calculators/math/**`
  - shared math route assets only where they remove repeated approved defect patterns
- Forbidden scope:
  - `config/**`
  - `clusters/**`
  - `public/config/**`
  - `public/assets/js/core/**`
  - `scripts/**`
  - `release-signoffs/**`
  - sitemap files
  - non-math routes

## Confirmed Issue Groups
- Repeated CTA visibility regression on math routes whose generic `.calculator-button` depends on undefined `--accent`
- Fraction answer contrast defect in `/math/fraction-calculator/`
- Unit-circle result-card contrast defect in `/math/trigonometry/unit-circle/`
- Sample-size low-contrast supporting labels and preset metadata
- Mobile horizontal overflow at `390px` on approved affected routes

## Touched Routes
- Shared math shell applied across all `public/math/**` pages to restore missing CTA tokens and add shrink-safe flow sizing
- Route-local fixes applied to:
  - `/math/fraction-calculator/`
  - `/math/trigonometry/unit-circle/`
  - `/math/sample-size/`
  - `/math/standard-deviation/`
  - `/math/algebra/factoring/`
  - `/math/algebra/polynomial-operations/`
  - `/math/algebra/slope-distance/`
  - `/math/algebra/system-of-equations/`
  - `/math/calculus/critical-points/`
  - `/math/calculus/derivative/`
  - `/math/calculus/series-convergence/`
  - `/math/log/exponential-equations/`
  - `/math/log/log-scale/`
  - `/math/statistics/correlation/`
  - `/math/statistics/regression-analysis/`
- CTA visibility regression verified on:
  - `/math/calculus/critical-points/`
  - `/math/calculus/series-convergence/`
  - `/math/confidence-interval/`
  - `/math/mean-median-mode-range/`
  - `/math/number-sequence/`
  - `/math/permutation-combination/`
  - `/math/probability/`
  - `/math/standard-deviation/`
  - `/math/statistics/`
  - `/math/statistics/anova/`
  - `/math/statistics/correlation/`
  - `/math/statistics/distribution/`
  - `/math/statistics/hypothesis-testing/`
  - `/math/statistics/regression-analysis/`
  - `/math/z-score/`

## Current Milestone
- All planned remediation waves implemented
- Final verification complete for lint, representative scoped tests, desktop/manual route audit, and `390px` mobile audit
- End state remains `implementation-complete`, not `release-ready`

## Verification Notes
- Final browser audit artifacts:
  - `tmp/math-ux-remediation/final-audit.json`
  - `tmp/math-ux-remediation/_math_fraction-calculator_desktop-final.png`
  - `tmp/math-ux-remediation/_math_fraction-calculator_mobile-final.png`
  - `tmp/math-ux-remediation/_math_trigonometry_unit-circle_desktop-final.png`
  - `tmp/math-ux-remediation/_math_trigonometry_unit-circle_mobile-final.png`
  - `tmp/math-ux-remediation/_math_sample-size_desktop-final.png`
  - `tmp/math-ux-remediation/_math_sample-size_mobile-final.png`
  - `tmp/math-ux-remediation/_math_permutation-combination_desktop-final.png`
  - `tmp/math-ux-remediation/_math_permutation-combination_mobile-final.png`
  - `tmp/math-ux-remediation/_math_algebra_factoring_desktop-final.png`
  - `tmp/math-ux-remediation/_math_algebra_factoring_mobile-final.png`
- Shared CTA verification result:
  - All 15 approved CTA routes now resolve their primary visible `.calculator-button` to `rgb(15, 118, 110)` with white text in `final-audit.json`
- Contrast verification result:
  - `/math/fraction-calculator/` fraction spans in the answer box render as `rgb(248, 251, 255)`
  - `/math/trigonometry/unit-circle/` inner result cards render dark text on light cards and muted titles
  - `/math/sample-size/` preset metadata and section labels now resolve to darker muted values
- Mobile `390px` verification result for approved overflow routes:
  - All 11 approved overflow routes now report `scrollWidth === clientWidth === 390` in `final-audit.json`
- Follow-up residual verification:
  - `/math/standard-deviation/` now reports `scrollWidth === clientWidth === 390`
  - `/math/statistics/correlation/` now reports `scrollWidth === clientWidth === 390`
- Command checks completed:
  - `npm run lint`
  - `CLUSTER=math CALC=fraction-calculator npm run test:calc:unit`
  - `CLUSTER=math CALC=fraction-calculator npm run test:calc:e2e`
  - `CLUSTER=math CALC=fraction-calculator npm run test:calc:cwv`
  - `CLUSTER=math CALC=unit-circle npm run test:calc:unit`
  - `CLUSTER=math CALC=unit-circle npm run test:calc:e2e`
  - `CLUSTER=math CALC=unit-circle npm run test:calc:cwv`
  - `CLUSTER=math CALC=sample-size npm run test:calc:unit`
  - `CLUSTER=math CALC=sample-size npm run test:calc:e2e`
  - `CLUSTER=math CALC=sample-size npm run test:calc:cwv`
  - `CLUSTER=math CALC=permutation-combination npm run test:calc:e2e`
  - `CLUSTER=math CALC=factoring npm run test:calc:e2e`

## Deferred Items
- Scoped SEO wrappers
- Mojibake audit
- Schema dedupe
- Release signoff
- Release-ready evidence

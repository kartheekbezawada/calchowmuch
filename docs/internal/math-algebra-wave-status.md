# Math Algebra Wave Status

## Queue

| Order | Calculator | Route | Status | Release ID | Commit SHA | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | quadratic-equation | /math/algebra/quadratic-equation/ | passed | REL-20260227-006 | d161ad7 | Scoped gates passed |
| 2 | slope-distance | /math/algebra/slope-distance/ | passed | REL-20260227-007 | b6b1036 | Scoped gates passed |
| 3 | factoring | /math/algebra/factoring/ | passed | REL-20260227-008 | 8a754f2 | Scoped gates passed |
| 4 | polynomial-operations | /math/algebra/polynomial-operations/ | passed | REL-20260227-009 | bb687e0 | Scoped gates passed |
| 5 | system-of-equations | /math/algebra/system-of-equations/ | passed | REL-20260227-010 | 1f773ac | Scoped gates passed |

## Shared Baseline

| Item | Status | Evidence |
| :--- | :--- | :--- |
| Internal docs created | done | `docs/internal/math-algebra-release-playbook.md`, `docs/internal/math-algebra-wave-checklists.md`, `docs/internal/math-algebra-wave-status.md` |
| Algebra route-bundle onboarding | done | `scripts/build-route-css-bundles.mjs` |
| Generator override updates | done | `scripts/generate-mpa-pages.js` |
| Bundles/manifests rebuilt | done | `public/assets/css/route-bundles/manifest.json`, `public/config/asset-manifest.json` |

## Final Matrix

| Calculator | Status | Release ID | Commit SHA | Gate Summary | Artifacts |
| :--- | :--- | :--- | :--- | :--- | :--- |
| quadratic-equation | passed | REL-20260227-006 | d161ad7 | lint + scoped unit/e2e/seo/cwv/schema/isolation/contracts | `test-results/performance/scoped-cwv/math/quadratic-equation.json` |
| slope-distance | passed | REL-20260227-007 | b6b1036 | lint + scoped unit/e2e/seo/cwv/schema/isolation/contracts | `test-results/performance/scoped-cwv/math/slope-distance.json` |
| factoring | passed | REL-20260227-008 | 8a754f2 | lint + scoped unit/e2e/seo/cwv/schema/isolation/contracts | `test-results/performance/scoped-cwv/math/factoring.json` |
| polynomial-operations | passed | REL-20260227-009 | bb687e0 | lint + scoped unit/e2e/seo/cwv/schema/isolation/contracts | `test-results/performance/scoped-cwv/math/polynomial-operations.json` |
| system-of-equations | passed | REL-20260227-010 | 1f773ac | lint + scoped unit/e2e/seo/cwv/schema/isolation/contracts | `test-results/performance/scoped-cwv/math/system-of-equations.json` |

## Follow-Up

- None. All 5 algebra waves completed as scoped passes.

## Wave-2 Queue (Right-Side Answer Cards + FAQ10)

| Order | Calculator | Route | Status | Release ID | Commit SHA | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | quadratic-equation | /math/algebra/quadratic-equation/ | passed | REL-20260227-011 | TBD | Right-side answer cards + FAQ 10 + schema parity |
| 2 | slope-distance | /math/algebra/slope-distance/ | passed | REL-20260227-012 | TBD | Right-side answer cards + FAQ 10 + schema parity |
| 3 | factoring | /math/algebra/factoring/ | passed | REL-20260227-013 | TBD | Right-side answer cards + FAQ 10 + schema parity |
| 4 | polynomial-operations | /math/algebra/polynomial-operations/ | passed | REL-20260227-014 | TBD | Right-side answer cards + FAQ 10 + schema parity |
| 5 | system-of-equations | /math/algebra/system-of-equations/ | passed | REL-20260227-015 | TBD | Right-side answer cards + FAQ 10 + schema parity |

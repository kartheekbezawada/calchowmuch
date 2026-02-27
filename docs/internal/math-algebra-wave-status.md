# Math Algebra Wave Status

## Queue

| Order | Calculator | Route | Status | Release ID | Commit SHA | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | quadratic-equation | /math/algebra/quadratic-equation/ | passed | REL-20260227-006 | d161ad7 | Scoped gates passed |
| 2 | slope-distance | /math/algebra/slope-distance/ | passed | REL-20260227-007 | b6b1036 | Scoped gates passed |
| 3 | factoring | /math/algebra/factoring/ | passed | REL-20260227-008 | TBD | Scoped gates passed |
| 4 | polynomial-operations | /math/algebra/polynomial-operations/ | in_progress | TBD | TBD | Wave 4 active |
| 5 | system-of-equations | /math/algebra/system-of-equations/ | pending | TBD | TBD | Awaiting wave 4 |

## Shared Baseline

| Item | Status | Evidence |
| :--- | :--- | :--- |
| Internal docs created | done | `docs/internal/math-algebra-release-playbook.md`, `docs/internal/math-algebra-wave-checklists.md`, `docs/internal/math-algebra-wave-status.md` |
| Algebra route-bundle onboarding | done | `scripts/build-route-css-bundles.mjs` |
| Generator override updates | done | `scripts/generate-mpa-pages.js` |
| Bundles/manifests rebuilt | done | `public/assets/css/route-bundles/manifest.json`, `public/config/asset-manifest.json` |

## Final Matrix (Populate After Wave 5)

| Calculator | Status | Release ID | Commit SHA | Gate Summary | Artifacts |
| :--- | :--- | :--- | :--- | :--- | :--- |
| quadratic-equation | passed | REL-20260227-006 | d161ad7 | lint + scoped unit/e2e/seo/cwv/schema/isolation/contracts | `test-results/performance/scoped-cwv/math/quadratic-equation.json` |
| slope-distance | passed | REL-20260227-007 | b6b1036 | lint + scoped unit/e2e/seo/cwv/schema/isolation/contracts | `test-results/performance/scoped-cwv/math/slope-distance.json` |
| factoring | passed | REL-20260227-008 | TBD | lint + scoped unit/e2e/seo/cwv/schema/isolation/contracts | `test-results/performance/scoped-cwv/math/factoring.json` |
| polynomial-operations | TBD | TBD | TBD | TBD | TBD |
| system-of-equations | TBD | TBD | TBD | TBD | TBD |

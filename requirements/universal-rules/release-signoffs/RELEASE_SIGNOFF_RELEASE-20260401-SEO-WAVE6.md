# Release Sign-Off

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `RELEASE-20260401-SEO-WAVE6` |
| Release Type | `CLUSTER_SHARED` |
| Scope (Global/Cluster/Calc/Route) | `Final consolidation set (Wave 6)` |
| Cluster ID | `pricing, salary, math` |
| Calculator ID (CALC) | `Wave 2 pricing/salary route set plus all governed Wave 5 math routes` |
| Primary Route | `/pricing-calculators/discount-calculator/` |
| Owner | `GitHub Copilot` |
| Date | `2026-04-01` |
| Commit SHA | `a4c92089a8cf93cb054ea7d85e4ca15c3f87af57` |
| Environment | `local workspace (release changes uncommitted)` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Command output |
| Unit | `CLUSTER=pricing npm run test:cluster:unit`; `CLUSTER=salary npm run test:cluster:unit`; `CLUSTER=math npm run test:cluster:unit` | Pass | `tests_specs/pricing/cluster_release/unit.cluster.test.js`; `tests_specs/pricing/cluster_release/contracts.cluster.test.js`; `tests_specs/salary/cluster_release/unit.cluster.test.js`; `tests_specs/salary/cluster_release/contracts.cluster.test.js`; `tests_specs/math/cluster_release/unit.cluster.test.js`; `tests_specs/math/cluster_release/contracts.cluster.test.js` |
| E2E | `CLUSTER=pricing npm run test:cluster:e2e`; `CLUSTER=salary npm run test:cluster:e2e`; `CLUSTER=math npm run test:cluster:e2e` | Pass | `tests_specs/pricing/cluster_release/e2e.cluster.spec.js`; `tests_specs/salary/cluster_release/e2e.cluster.spec.js`; `tests_specs/math/cluster_release/e2e.cluster.spec.js` |
| SEO | `CLUSTER=pricing npm run test:cluster:seo`; `CLUSTER=salary npm run test:cluster:seo`; `CLUSTER=math npm run test:cluster:seo` | Pass | `tests_specs/pricing/cluster_release/seo.cluster.spec.js`; `tests_specs/salary/cluster_release/seo.cluster.spec.js`; `tests_specs/math/cluster_release/seo.cluster.spec.js` |
| Content Quality | `CLUSTER=pricing npm run test:content:quality -- --scope=cluster`; `CLUSTER=salary npm run test:content:quality -- --scope=cluster`; `CLUSTER=math npm run test:content:quality -- --scope=cluster` | Pass | `test-results/content-quality/cluster/pricing/2026-04-01T19-59-34-933Z.json`; `test-results/content-quality/cluster/salary/2026-04-01T19-58-33-855Z.json`; `test-results/content-quality/cluster/math/2026-04-01T19-55-31-612Z.json` |
| CWV | `CLUSTER=pricing npm run test:cluster:cwv`; `CLUSTER=salary npm run test:cluster:cwv`; `CLUSTER=math npm run test:cluster:cwv` | Pass | `tests_specs/pricing/cluster_release/cwv.cluster.spec.js`; `tests_specs/salary/cluster_release/cwv.cluster.spec.js`; `tests_specs/math/cluster_release/cwv.cluster.spec.js` |
| ISS-001 | `npm run test:iss001` | Skipped | Scoped cluster release; not required by the release-mode matrix |
| Schema Dedupe | `CLUSTER=pricing npm run test:schema:dedupe -- --scope=cluster`; `CLUSTER=salary npm run test:schema:dedupe -- --scope=cluster`; `CLUSTER=math npm run test:schema:dedupe -- --scope=cluster` | Pass | `schema_duplicates_report.md`; `schema_duplicates_report.csv` |
| Mojibake | `CLUSTER=pricing npm run test:seo:mojibake -- --scope=cluster`; `CLUSTER=salary npm run test:seo:mojibake -- --scope=cluster`; `CLUSTER=math npm run test:seo:mojibake -- --scope=cluster` | Pass | `seo_mojibake_report.md`; `seo_mojibake_report.csv` |
| Homepage Search Contracts | `npm run test:cluster:contracts` | Pass | Command output: `Homepage search discoverability validation passed.` |
| Cluster Contracts | `npm run test:cluster:contracts` | Pass | Command output: `Cluster contract validation passed.` |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | Command output: `Isolation scope: skipped strict single-calculator artifact check.` and scoped changed-calculator summary with shared contract changes `1` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Final consolidation stayed inside the Wave 2 pricing/salary route set plus the governed Wave 5 `/math/**` route set already touched in prior waves. No URL changes, redirects, or ownership-file edits were introduced. |
| Homepage search verification keyword(s) | Covered by `npm run test:cluster:contracts`, which includes `npm run test:homepage:search:contracts` |
| SEO/schema evidence | Final consolidation combined the Wave 2 pricing/salary metadata/linking fixes with the Wave 5 math explanation normalization and scorer alignment. Evidence paths: `scripts/generate-mpa-pages.js`, `scripts/content-quality-thin-score.mjs`, `tests_specs/infrastructure/unit/content-quality-thin-score.test.js`, `public/pricing-calculators/**/index.html`, `public/salary-calculators/**/index.html`, and `public/math/**/index.html`. |
| CWV artifact (`scoped-cwv` or global) | Current cluster-scoped CWV harness does not persist JSON artifacts under `test-results/`; evidence is the passing cluster CWV specs and command output for pricing, salary, and math. |
| Thin-content artifact (if `calc_exp` / `exp_only`) | Final consolidation artifacts: `test-results/content-quality/cluster/pricing/2026-04-01T19-59-34-933Z.json`, `test-results/content-quality/cluster/salary/2026-04-01T19-58-33-855Z.json`, and `test-results/content-quality/cluster/math/2026-04-01T19-55-31-612Z.json` — all passing with `warn=0` and `fail=0`. |
| Important Notes contract proof (if applicable) | Final Wave 6 proof comes from the passing content-quality artifacts above and the generated outputs that now end with compliant `Important Notes` sections across the touched pricing, salary, and math routes. |
| Pane layout proof (for `calc_exp`) | Representative final-proof routes remain single-pane `calc_exp` pages: `public/pricing-calculators/discount-calculator/index.html`, `public/salary-calculators/salary-calculator/index.html`, and `public/math/trigonometry/unit-circle/index.html` all retain `calculator-page-single` within `panel-span-all`. |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | Cluster-scoped CWV passes, but the current `test:cluster:cwv` harness does not persist machine-readable JSON artifacts under `test-results/`. | Low | Evidence remains the passing cluster CWV specs and command output until the harness adds artifact persistence. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `GitHub Copilot` | `2026-04-01` |

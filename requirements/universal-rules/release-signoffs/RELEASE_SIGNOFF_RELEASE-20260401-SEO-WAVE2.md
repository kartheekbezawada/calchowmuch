# Release Sign-Off

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `RELEASE-20260401-SEO-WAVE2` |
| Release Type | `CLUSTER_SHARED` |
| Scope (Global/Cluster/Calc/Route) | `Route set (Wave 2)` |
| Cluster ID | `pricing, salary` |
| Calculator ID (CALC) | `discount-calculator, salary-calculator, hourly-to-salary-calculator, salary-to-hourly-calculator, annual-to-monthly-salary-calculator, monthly-to-annual-salary-calculator, weekly-pay-calculator, overtime-pay-calculator, raise-calculator, bonus-calculator, inflation-adjusted-salary-calculator` |
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
| Unit | `CLUSTER=pricing npm run test:cluster:unit`; `CLUSTER=salary npm run test:cluster:unit` | Pass | `tests_specs/pricing/cluster_release/unit.cluster.test.js`; `tests_specs/pricing/cluster_release/contracts.cluster.test.js`; `tests_specs/salary/cluster_release/unit.cluster.test.js`; `tests_specs/salary/cluster_release/contracts.cluster.test.js` |
| E2E | `CLUSTER=pricing npm run test:cluster:e2e`; `CLUSTER=salary npm run test:cluster:e2e` | Pass | `tests_specs/pricing/cluster_release/e2e.cluster.spec.js`; `tests_specs/salary/cluster_release/e2e.cluster.spec.js` |
| SEO | `CLUSTER=pricing npm run test:cluster:seo`; `CLUSTER=salary npm run test:cluster:seo` | Pass | `tests_specs/pricing/cluster_release/seo.cluster.spec.js`; `tests_specs/salary/cluster_release/seo.cluster.spec.js` |
| Content Quality | `CLUSTER=pricing npm run test:content:quality -- --scope=cluster`; `CLUSTER=salary npm run test:content:quality -- --scope=cluster` | Pass | `test-results/content-quality/cluster/pricing/2026-04-01T19-59-34-933Z.json`; `test-results/content-quality/cluster/salary/2026-04-01T19-58-33-855Z.json` |
| CWV | `CLUSTER=pricing npm run test:cluster:cwv`; `CLUSTER=salary npm run test:cluster:cwv` | Pass | `tests_specs/pricing/cluster_release/cwv.cluster.spec.js`; `tests_specs/salary/cluster_release/cwv.cluster.spec.js` |
| ISS-001 | `npm run test:iss001` | Skipped | Scoped cluster release; not required by the release-mode matrix |
| Schema Dedupe | `CLUSTER=pricing npm run test:schema:dedupe -- --scope=cluster`; `CLUSTER=salary npm run test:schema:dedupe -- --scope=cluster` | Pass | `schema_duplicates_report.md`; `schema_duplicates_report.csv` |
| Mojibake | `CLUSTER=pricing npm run test:seo:mojibake -- --scope=cluster`; `CLUSTER=salary npm run test:seo:mojibake -- --scope=cluster` | Pass | `seo_mojibake_report.md`; `seo_mojibake_report.csv` |
| Homepage Search Contracts | `npm run test:cluster:contracts` | Pass | Command output: `Homepage search discoverability validation passed.` |
| Cluster Contracts | `npm run test:cluster:contracts` | Pass | Command output: `Cluster contract validation passed.` |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | Command output: changed calculators `discount-calculator, annual-to-monthly-salary-calculator, bonus-calculator, hourly-to-salary-calculator, inflation-adjusted-salary-calculator, monthly-to-annual-salary-calculator, overtime-pay-calculator, raise-calculator, salary-calculator, salary-to-hourly-calculator, weekly-pay-calculator`; shared contract changes `1` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Released routes: `/pricing-calculators/discount-calculator/`, `/salary-calculators/salary-calculator/`, `/salary-calculators/hourly-to-salary-calculator/`, `/salary-calculators/salary-to-hourly-calculator/`, `/salary-calculators/annual-to-monthly-salary-calculator/`, `/salary-calculators/monthly-to-annual-salary-calculator/`, `/salary-calculators/weekly-pay-calculator/`, `/salary-calculators/overtime-pay-calculator/`, `/salary-calculators/raise-calculator/`, `/salary-calculators/bonus-calculator/`, `/salary-calculators/inflation-adjusted-salary-calculator/`. Supporting hub update stayed inside `/salary-calculators/` by adding visible discoverability for the inflation-adjusted salary route in `public/calculators/salary-calculators/content.html`. |
| Homepage search verification keyword(s) | Covered by `npm run test:cluster:contracts`, which includes `npm run test:homepage:search:contracts` |
| SEO/schema evidence | Metadata alignment landed in `scripts/generate-mpa-pages.js`, `public/calculators/pricing-calculators/discount-calculator/module.js`, and `public/calculators/salary-calculators/*/module.js`; route-specific explanation/internal-link upgrades landed in `public/calculators/pricing-calculators/discount-calculator/explanation.html` and `public/calculators/salary-calculators/*/explanation.html`; salary hub discoverability updated in `public/calculators/salary-calculators/content.html`; matching release-spec updates landed in `tests_specs/pricing/discount-calculator_release/seo.calc.spec.js`, `tests_specs/pricing/cluster_release/e2e.cluster.spec.js`, `tests_specs/salary/shared/config.js`, `tests_specs/salary/cluster_release/contracts.cluster.test.js`, and `tests_specs/salary/cluster_release/e2e.cluster.spec.js`; regenerated outputs verified under `public/pricing-calculators/**/index.html` and `public/salary-calculators/**/index.html`. |
| CWV artifact (`scoped-cwv` or global) | Current cluster-scoped CWV harness does not persist JSON artifacts under `test-results/`; evidence is the passing Playwright CWV specs in `tests_specs/pricing/cluster_release/cwv.cluster.spec.js` and `tests_specs/salary/cluster_release/cwv.cluster.spec.js` plus command output. |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/cluster/pricing/2026-04-01T19-59-34-933Z.json` (`pass=4`, `warn=0`, `fail=0`); `test-results/content-quality/cluster/salary/2026-04-01T19-58-33-855Z.json` (`pass=11`, `warn=0`, `fail=0`) |
| Important Notes contract proof (if applicable) | Pricing Important Notes were normalized in the generated route outputs for `/pricing-calculators/commission-calculator/`, `/pricing-calculators/discount-calculator/`, `/pricing-calculators/margin-calculator/`, and `/pricing-calculators/markup-calculator/`; salary routes retain route-specific Important Notes blocks, and `weekly-pay-calculator` FAQ recognition now passes through the scorer contract. |
| Pane layout proof (for `calc_exp`) | Generated routes remain single-pane `calc_exp` pages. Representative proof: `public/pricing-calculators/discount-calculator/index.html` contains `data-route-archetype="calc_exp"` and `calculator-page-single` within `panel-span-all`; `public/salary-calculators/salary-calculator/index.html` contains `data-route-archetype="calc_exp"` and `calculator-page-single` within `panel-span-all`. |

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

# RELEASE_SIGNOFF_REL-20260326-SALARY-CLUSTER-ROLLOUT

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260326-SALARY-CLUSTER-ROLLOUT |
| Release Type | CLUSTER_ROUTE |
| Scope (Global/Cluster/Calc/Route) | Cluster |
| Cluster ID | salary |
| Calculator ID (CALC) | n/a - salary hub plus 10 salary calculators |
| Primary Route | /salary-calculators/ |
| Owner | Codex |
| Date | 2026-03-26 |
| Commit SHA | 8a8d95d9 |
| Environment | Local Linux workspace |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Session terminal pass |
| Unit | `CLUSTER=salary npm run test:cluster:unit` | Pass | `tests_specs/salary/cluster_release/unit.cluster.test.js`; `tests_specs/salary/cluster_release/contracts.cluster.test.js` |
| E2E | `CLUSTER=salary npm run test:cluster:e2e` | Pass | `tests_specs/salary/cluster_release/e2e.cluster.spec.js`; session terminal pass (`1 passed`) |
| SEO | `CLUSTER=salary npm run test:cluster:seo` | Pass | `tests_specs/salary/cluster_release/seo.cluster.spec.js`; `seo_mojibake_report.md`; session terminal pass (`1 passed`) |
| CWV | `CLUSTER=salary npm run test:cluster:cwv` | Pass | `tests_specs/salary/cluster_release/cwv.cluster.spec.js`; `playwright-report/index.html`; session terminal pass (`1 passed`) |
| ISS-001 | Not required for this scoped cluster release per release-scope matrix | Skipped | N/A |
| Schema Dedupe | `CLUSTER=salary npm run test:schema:dedupe -- --scope=cluster` | Pass | `schema_duplicates_report.md`; `schema_duplicates_report.csv` |

Additional scoped governance checks:

- `CLUSTER=salary npm run test:cluster:contracts` - Pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` - Pass (strict single-calculator artifact enforcement skipped because this is an approved shared multi-route cluster rollout)

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Scope recorded in `requirements/universal-rules/salary-calculators-cluster-redesign/ACTION_PAGE.md`; generated outputs updated for `/salary-calculators/`, `/salary-calculators/salary-calculator/`, `/salary-calculators/hourly-to-salary-calculator/`, `/salary-calculators/salary-to-hourly-calculator/`, `/salary-calculators/annual-to-monthly-salary-calculator/`, `/salary-calculators/monthly-to-annual-salary-calculator/`, `/salary-calculators/weekly-pay-calculator/`, `/salary-calculators/overtime-pay-calculator/`, `/salary-calculators/raise-calculator/`, `/salary-calculators/bonus-calculator/`, and `/salary-calculators/commission-calculator/` |
| Homepage search verification keyword(s) | Homepage search discoverability passed via `CLUSTER=salary npm run test:cluster:contracts`; keywords governed in `public/config/navigation.json` and `clusters/salary/config/navigation.json` |
| SEO/schema evidence | `schema_duplicates_report.md`; `schema_duplicates_report.csv`; `seo_mojibake_report.md`; salary SEO smoke passed via `tests_specs/salary/cluster_release/seo.cluster.spec.js` |
| CWV artifact (`scoped-cwv` or global) | Cluster CWV Playwright guard passed; retained report available at `playwright-report/index.html` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | Not part of the required salary cluster gate set for this shared cluster rollout; explanation and FAQ content were implemented on every salary route and verified through E2E/SEO smoke plus generated output review |
| Important Notes contract proof (if applicable) | Salary routes use gross-pay-only disclaimers and keep legal/tax claims out of the result area; evidence in generated outputs under `public/salary-calculators/**/index.html` |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` retains `routeArchetype: calc_exp` and `paneLayout: single` for all 10 salary calculators; generated pages render `calculator-page-single sal-cluster-flow sal-cluster-calc-flow` |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | `commission-calculator` is duplicated across pricing and salary clusters, so scoped generation by `--calc-id commission-calculator` targets both routes. | Low | Use exact route-targeted generation (`--route /salary-calculators/commission-calculator/`) for future salary-only commission rebuilds unless the generator gains cluster-aware calc-id disambiguation. |
| EX-002 | Salary SEO gating emits noisy `jsdom` CSS parse logs from unrelated inline styles during the wider mojibake scan, even though the salary SEO test passes. | Low | Treat the logs as non-blocking noise for this release; if needed, isolate the underlying inline-style parse issue in a separate shared-infrastructure cleanup. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-26 |

# RELEASE_SIGNOFF_REL-20260323-PERCENTAGE-DECREASE-SINGLE-REBUILD

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260323-PERCENTAGE-DECREASE-SINGLE-REBUILD |
| Release Type | CLUSTER_ROUTE |
| Scope (Global/Cluster/Calc/Route) | Single calc within cluster |
| Cluster ID | percentage |
| Calculator ID (CALC) | percentage-decrease |
| Primary Route | /percentage-calculators/percentage-decrease-calculator/ |
| Owner | GitHub Copilot |
| Date | 2026-03-23 |
| Commit SHA | fedbf3bc8c16bcc3b84a8b76c27851de945a22b2 |
| Environment | Local Linux workspace |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Terminal pass |
| Unit | `export CLUSTER=percentage && export CALC=percentage-decrease && npm run test:calc:unit` | Pass | `tests_specs/percentage/percentage-decrease_release/unit.calc.test.js` |
| E2E | `export PW_WEB_SERVER_PORT=3202 && npx playwright test tests_specs/percentage/percentage-decrease_release/e2e.calc.spec.js --workers=1` | Pass | Terminal pass (`Running 2 tests using 1 worker`; `2 passed (2.3m)`) |
| SEO | `export PW_WEB_SERVER_PORT=3201 && npx playwright test tests_specs/percentage/percentage-decrease_release/seo.calc.spec.js --workers=1` | Pass | Terminal pass (`Running 1 test using 1 worker`; `1 passed (2.3m)`) |
| CWV | `export CLUSTER=percentage && export CALC=percentage-decrease && node scripts/run-scoped-tests.mjs --level=calc --type=cwv` | Pass | `test-results/performance/scoped-cwv/percentage/percentage-decrease.json` |
| ISS-001 | Not required for scoped single-calculator release | Skipped | N/A |
| Schema Dedupe | `npm run test:schema:dedupe -- --scope=cluster` | Pass | `schema_duplicates_report.md`; `schema_duplicates_report.csv` |

Additional scoped governance checks:

- `npm run lint:css-import` — Pass
- `npm run scope:route -- --calc=percentage-decrease --files=...` — Pass
- `export CLUSTER=percentage && export CALC=percentage-decrease && node scripts/run-scoped-tests.mjs --level=calc --type=seo` — Pass
- `export CLUSTER=percentage && export CALC=percentage-decrease && node scripts/content-quality-thin-score.mjs --scope=calc` — Pass (`evaluated=1, pass=1, warn=0, fail=0, notApplicable=0`)
- `export CLUSTER=percentage && export CALC=percentage-decrease && node scripts/validate-seo-mojibake.mjs --scope=calc` — Pass (`findings=0`)
- `npm run test:cluster:contracts` — Pass
- `npm run test:percentage:nav-guard` — Pass
- `npm run test:isolation:scope` — Pass (strict single-calculator artifact check skipped because the working tree contains other approved percentage changes outside this rebuild)

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Approved route: `/percentage-calculators/percentage-decrease-calculator/`; explicit `scope:route` pass recorded above |
| SEO/schema evidence | `schema_duplicates_report.md`; `schema_duplicates_report.csv`; `seo_mojibake_report.md`; `seo_mojibake_report.csv`; `test-results/content-quality/scoped/percentage/percentage-decrease.json` |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/scoped-cwv/percentage/percentage-decrease.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/scoped/percentage/percentage-decrease.json` |
| Important Notes contract proof (if applicable) | Calc-scoped thin-content audit passed with `evaluated=1, pass=1, warn=0, fail=0, notApplicable=0` |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` entry for `percentage-decrease` declares `routeArchetype: calc_exp` and `paneLayout: single`; generated HTML contains the single-page calculator layout |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | Percentage cluster grouped Playwright wrapper remains less reliable than direct route-level evidence for scoped releases. | Medium | Use direct route-level Playwright specs as release evidence for single-calculator rebuilds until the grouped harness is corrected. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | GitHub Copilot | 2026-03-23 |

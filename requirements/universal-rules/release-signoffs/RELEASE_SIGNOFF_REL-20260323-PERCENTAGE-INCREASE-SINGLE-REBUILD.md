## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260323-PERCENTAGE-INCREASE-SINGLE-REBUILD |
| Release Type | CLUSTER_ROUTE |
| Scope (Global/Cluster/Calc/Route) | Single calc within cluster |
| Cluster ID | percentage |
| Calculator ID (CALC) | percentage-increase |
| Primary Route | /percentage-calculators/percentage-increase-calculator/ |
| Owner | GitHub Copilot |
| Date | 2026-03-23 |
| Commit SHA | fedbf3bc8c16bcc3b84a8b76c27851de945a22b2 |
| Environment | Local Linux workspace |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Terminal pass |
| Unit | `export CLUSTER=percentage && export CALC=percentage-increase && npm run test:calc:unit` | Pass | `tests_specs/percentage/percentage-increase_release/unit.calc.test.js` |
| E2E | `npx playwright test tests_specs/percentage/percentage-increase_release/e2e.calc.spec.js tests_specs/percentage/percentage-increase_release/seo.calc.spec.js --reporter=line --workers=1` | Pass | Terminal pass (`Running 3 tests using 1 worker`; `3 passed (5.8s)`) |
| SEO | `node scripts/content-quality-thin-score.mjs --scope=route --route=/percentage-calculators/percentage-increase-calculator/` | Pass | `test-results/content-quality/route/percentage-calculators__percentage-increase-calculator/2026-03-23T11-42-59-643Z.json` |
| CWV | `npx playwright test tests_specs/percentage/percentage-increase_release/cwv.calc.spec.js --reporter=line --workers=1` | Pass | Terminal pass (`Running 1 test using 1 worker`; `1 passed (4.3s)`) |
| ISS-001 | Not required for scoped single-calculator release | Skipped | N/A |
| Schema Dedupe | `export CLUSTER=percentage && npm run test:schema:dedupe -- --scope=cluster` | Pass | `schema_duplicates_report.md`; `schema_duplicates_report.csv` |

Additional scoped governance checks:
- `npm run lint:css-import` — Pass
- `npm run scope:route -- --calc=percentage-increase --files=...` — Pass
- `export CLUSTER=percentage && npm run test:cluster:contracts` — Pass
- `npm run test:percentage:nav-guard` — Pass
- `export ALLOW_SHARED_CONTRACT_CHANGE=1 && npm run test:isolation:scope` — Pass (strict single-calculator artifact check skipped because the working tree contains other approved percentage changes outside this rebuild)

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Approved route: `/percentage-calculators/percentage-increase-calculator/`; explicit `scope:route` pass recorded above |
| SEO/schema evidence | `schema_duplicates_report.md`; `schema_duplicates_report.csv`; `test-results/content-quality/route/percentage-calculators__percentage-increase-calculator/2026-03-23T11-42-59-643Z.json` |
| CWV artifact (`scoped-cwv` or global) | Direct CWV Playwright spec run passed in terminal |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/route/percentage-calculators__percentage-increase-calculator/2026-03-23T11-42-59-643Z.json` |
| Important Notes contract proof (if applicable) | Route-level thin-content audit passed with `evaluated=1, pass=1, warn=0, fail=0, notApplicable=0` |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` entry for `percentage-increase` declares `routeArchetype: calc_exp` and `paneLayout: single`; generated HTML contains `panel panel-scroll panel-span-all` and `calculator-page-single` |

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
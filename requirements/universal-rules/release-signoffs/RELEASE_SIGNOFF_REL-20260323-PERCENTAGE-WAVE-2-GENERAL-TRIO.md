## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260323-PERCENTAGE-WAVE-2-GENERAL-TRIO |
| Release Type | CLUSTER_ROUTE |
| Scope (Global/Cluster/Calc/Route) | Calc set within cluster |
| Cluster ID | percentage |
| Calculator ID (CALC) | percentage-increase, percentage-decrease, percentage-difference |
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
| Unit | `export CLUSTER=percentage && export CALC=percentage-increase && npm run test:calc:unit && export CALC=percentage-decrease && npm run test:calc:unit && export CALC=percentage-difference && npm run test:calc:unit` | Pass | `tests_specs/percentage/percentage-increase_release/unit.calc.test.js`; `tests_specs/percentage/percentage-decrease_release/unit.calc.test.js`; `tests_specs/percentage/percentage-difference_release/unit.calc.test.js` |
| E2E | `npx playwright test tests_specs/percentage/percentage-increase_release/e2e.calc.spec.js tests_specs/percentage/percentage-increase_release/seo.calc.spec.js tests_specs/percentage/percentage-decrease_release/e2e.calc.spec.js tests_specs/percentage/percentage-decrease_release/seo.calc.spec.js tests_specs/percentage/percentage-difference_release/e2e.calc.spec.js tests_specs/percentage/percentage-difference_release/seo.calc.spec.js --reporter=line --workers=1` | Pass | Terminal pass (`Running 9 tests using 1 worker`; `9 passed (14.1s)`) |
| SEO | `node scripts/content-quality-thin-score.mjs --scope=route --route=/percentage-calculators/percentage-increase-calculator/`; `node scripts/content-quality-thin-score.mjs --scope=route --route=/percentage-calculators/percentage-decrease-calculator/`; `node scripts/content-quality-thin-score.mjs --scope=route --route=/percentage-calculators/percentage-difference-calculator/`; `node scripts/validate-seo-mojibake.mjs --scope=cluster` | Pass | `test-results/content-quality/route/percentage-calculators__percentage-increase-calculator/2026-03-23T10-45-02-069Z.json`; `test-results/content-quality/route/percentage-calculators__percentage-decrease-calculator/2026-03-23T10-46-07-486Z.json`; `test-results/content-quality/route/percentage-calculators__percentage-difference-calculator/2026-03-23T10-45-47-320Z.json`; `seo_mojibake_report.md`; `seo_mojibake_report.csv` |
| CWV | `npx playwright test tests_specs/percentage/percentage-increase_release/cwv.calc.spec.js tests_specs/percentage/percentage-decrease_release/cwv.calc.spec.js tests_specs/percentage/percentage-difference_release/cwv.calc.spec.js --reporter=line --workers=1` | Pass | `test-results/.last-run.json` |
| ISS-001 | Not required for scoped calc-set release | Skipped | N/A |
| Schema Dedupe | `export CLUSTER=percentage && npm run test:schema:dedupe -- --scope=cluster` | Pass | `schema_duplicates_report.md`; `schema_duplicates_report.csv` |

Additional scoped governance checks:
- `npm run lint:css-import` — Pass
- `npm run scope:route -- --calc=percentage-increase --files=...` — Pass
- `npm run scope:route -- --calc=percentage-decrease --files=...` — Pass
- `npm run scope:route -- --calc=percentage-difference --files=...` — Pass
- `export CLUSTER=percentage && npm run test:cluster:contracts` — Pass
- `npm run test:percentage:nav-guard` — Pass
- `export ALLOW_SHARED_CONTRACT_CHANGE=1 && npm run test:isolation:scope` — Pass (strict single-calculator artifact check skipped because approved work spans 3 calculators)

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Approved wave 2 routes: `/percentage-calculators/percentage-increase-calculator/`, `/percentage-calculators/percentage-decrease-calculator/`, `/percentage-calculators/percentage-difference-calculator/`; explicit `scope:route` passes recorded above |
| SEO/schema evidence | `schema_duplicates_report.md`; `schema_duplicates_report.csv`; `test-results/content-quality/route/percentage-calculators__percentage-increase-calculator/2026-03-23T10-45-02-069Z.json`; `test-results/content-quality/route/percentage-calculators__percentage-decrease-calculator/2026-03-23T10-46-07-486Z.json`; `test-results/content-quality/route/percentage-calculators__percentage-difference-calculator/2026-03-23T10-45-47-320Z.json`; cluster mojibake validation passed in terminal |
| CWV artifact (`scoped-cwv` or global) | Direct CWV Playwright spec run passed; final Playwright status recorded in `test-results/.last-run.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/route/percentage-calculators__percentage-increase-calculator/2026-03-23T10-45-02-069Z.json`; `test-results/content-quality/route/percentage-calculators__percentage-decrease-calculator/2026-03-23T10-46-07-486Z.json`; `test-results/content-quality/route/percentage-calculators__percentage-difference-calculator/2026-03-23T10-45-47-320Z.json` |
| Important Notes contract proof (if applicable) | All 3 route-level thin-content audits passed with no hard flags (`evaluated=1, pass=1, warn=0, fail=0` for each route) |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` entries for `percentage-difference`, `percentage-increase`, and `percentage-decrease` declare `routeArchetype: calc_exp` and `paneLayout: single`; generated HTML contains `panel panel-scroll panel-span-all` and `calculator-page-single` for all 3 routes |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | Percentage cluster grouped Playwright wrapper (`CLUSTER=percentage npm run test:cluster:playwright`) remains unreliable in grouped harness mode relative to direct route-level evidence. | Medium | Follow up in the test harness; direct route Playwright specs were executed for the approved wave 2 routes as release evidence. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | GitHub Copilot | 2026-03-23 |
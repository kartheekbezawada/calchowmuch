## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260322-PERCENTAGE-PILOT-WAVE-1 |
| Release Type | CLUSTER_ROUTE |
| Scope (Global/Cluster/Calc/Route) | Calc set within cluster |
| Cluster ID | percentage |
| Calculator ID (CALC) | percent-change, percentage-of-a-number, percentage-composition |
| Primary Route | /percentage-calculators/percent-change-calculator/ |
| Owner | GitHub Copilot |
| Date | 2026-03-22 |
| Commit SHA | fedbf3bc8c16bcc3b84a8b76c27851de945a22b2 |
| Environment | Local Linux workspace |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Terminal pass |
| Unit | `CLUSTER=percentage CALC=percent-change npm run test:calc:unit`; `CLUSTER=percentage CALC=percentage-of-a-number npm run test:calc:unit`; `CLUSTER=percentage CALC=percentage-composition npm run test:calc:unit` | Pass | `tests_specs/percentage/percent-change_release/unit.calc.test.js`; `tests_specs/percentage/percentage-of-a-number_release/unit.calc.test.js`; `tests_specs/percentage/percentage-composition_release/unit.calc.test.js` |
| E2E | `npx playwright test tests_specs/percentage/percent-change_release/e2e.calc.spec.js tests_specs/percentage/percentage-of-a-number_release/e2e.calc.spec.js tests_specs/percentage/percentage-composition_release/e2e.calc.spec.js --reporter=line --workers=1` | Pass | Terminal pass |
| SEO | `npx playwright test tests_specs/percentage/percent-change_release/seo.calc.spec.js tests_specs/percentage/percentage-of-a-number_release/seo.calc.spec.js tests_specs/percentage/percentage-composition_release/seo.calc.spec.js --reporter=line --workers=1`; `node scripts/content-quality-thin-score.mjs --scope=route --route=/percentage-calculators/percent-change-calculator/`; `node scripts/content-quality-thin-score.mjs --scope=route --route=/percentage-calculators/percentage-of-a-number-calculator/`; `node scripts/content-quality-thin-score.mjs --scope=route --route=/percentage-calculators/percentage-composition-calculator/`; `node scripts/validate-seo-mojibake.mjs --scope=cluster` | Pass | `test-results/content-quality/route/percentage-calculators__percent-change-calculator/2026-03-22T23-29-10-024Z.json`; `test-results/content-quality/route/percentage-calculators__percentage-of-a-number-calculator/2026-03-22T23-29-14-563Z.json`; `test-results/content-quality/route/percentage-calculators__percentage-composition-calculator/2026-03-22T23-29-18-944Z.json` |
| CWV | `npx playwright test tests_specs/percentage/percent-change_release/cwv.calc.spec.js tests_specs/percentage/percentage-of-a-number_release/cwv.calc.spec.js tests_specs/percentage/percentage-composition_release/cwv.calc.spec.js --reporter=line --workers=1` | Pass | `test-results/.last-run.json` |
| ISS-001 | Not required for scoped calc-set release | Skipped | N/A |
| Schema Dedupe | `CLUSTER=percentage npm run test:schema:dedupe -- --scope=cluster` | Pass | `schema_duplicates_report.md`; `schema_duplicates_report.csv` |

Additional scoped governance checks:
- `npm run lint:css-import` — Pass
- `npm run scope:route -- --calc=percent-change --files=...` — Pass
- `npm run scope:route -- --calc=percentage-of-a-number --files=...` — Pass
- `npm run scope:route -- --calc=percentage-composition --files=...` — Pass
- `CLUSTER=percentage npm run test:cluster:contracts` — Pass
- `npm run test:percentage:nav-guard` — Pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — Pass (strict single-calculator check skipped because approved work spans 3 calculators)

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Approved pilot routes: `/percentage-calculators/percent-change-calculator/`, `/percentage-calculators/percentage-of-a-number-calculator/`, `/percentage-calculators/percentage-composition-calculator/`; explicit `scope:route` passes recorded above |
| SEO/schema evidence | `schema_duplicates_report.md`; `schema_duplicates_report.csv`; `test-results/content-quality/route/percentage-calculators__percent-change-calculator/2026-03-22T23-29-10-024Z.json`; `test-results/content-quality/route/percentage-calculators__percentage-of-a-number-calculator/2026-03-22T23-29-14-563Z.json`; `test-results/content-quality/route/percentage-calculators__percentage-composition-calculator/2026-03-22T23-29-18-944Z.json`; cluster mojibake validation passed in terminal |
| CWV artifact (`scoped-cwv` or global) | Direct CWV Playwright spec run passed; final Playwright status recorded in `test-results/.last-run.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/route/percentage-calculators__percent-change-calculator/2026-03-22T23-29-10-024Z.json`; `test-results/content-quality/route/percentage-calculators__percentage-of-a-number-calculator/2026-03-22T23-29-14-563Z.json`; `test-results/content-quality/route/percentage-calculators__percentage-composition-calculator/2026-03-22T23-29-18-944Z.json` |
| Important Notes contract proof (if applicable) | Route-level thin-content artifacts above show `headingOrder.isValid=true` and `importantNotesContract.hasRequiredKeys=true` for all 3 pilot routes |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` entries for `percent-change`, `percentage-of-a-number`, and `percentage-composition` declare `routeArchetype: calc_exp` and `paneLayout: single`; generated HTML contains `panel panel-scroll panel-span-all` and `calculator-page-single` for all 3 routes |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | Percentage cluster grouped Playwright wrapper (`CLUSTER=percentage npm run test:cluster:playwright`) currently fails with zero collected tests in the cluster harness, despite route-level specs passing. | Medium | Follow up in test harness; scoped route Playwright specs were executed directly for the approved pilot routes as release evidence. |
---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | GitHub Copilot | 2026-03-22 |

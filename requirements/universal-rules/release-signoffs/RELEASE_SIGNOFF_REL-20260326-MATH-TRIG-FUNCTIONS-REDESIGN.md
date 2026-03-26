# Release Sign-Off

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260326-MATH-TRIG-FUNCTIONS-REDESIGN` |
| Release Type | `Math calculator redesign` |
| Scope (Global/Cluster/Calc/Route) | `Calc/Route` |
| Cluster ID | `math` |
| Calculator ID (CALC) | `trig-functions` |
| Primary Route | `/math/trigonometry/trig-functions/` |
| Owner | `Codex` |
| Date | `2026-03-26` |
| Commit SHA | `6019939f` |
| Environment | `local workspace` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | `Pass` | task log |
| Unit | `CLUSTER=math CALC=trig-functions npm run test:calc:unit` | `Pass` | task log |
| E2E | `PW_BASE_URL=http://localhost:8001 npm exec playwright test tests_specs/math/trig-functions_release/e2e.calc.spec.js --reporter=line` | `Pass` | `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| SEO | `PW_BASE_URL=http://localhost:8001 npm exec playwright test tests_specs/math/trig-functions_release/seo.calc.spec.js --reporter=line` | `Pass` | `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| CWV | `PW_BASE_URL=http://localhost:8001 SCOPED_CWV_BASE_URL=http://localhost:8001 npm exec playwright test tests_specs/math/trig-functions_release/cwv.calc.spec.js --reporter=line` | `Pass` | task log |
| ISS-001 | `not applicable for this scoped route release` | `Skipped` | n/a |
| Schema Dedupe | `CLUSTER=math CALC=trig-functions npm run test:schema:dedupe -- --scope=calc` | `Pass` | `[schema_duplicates_report.md](/home/kartheek/calchowmuch/schema_duplicates_report.md)` |
| Cluster Contracts | `npm run test:cluster:contracts` | `Pass` | task log |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | `Pass` | task log |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `[math-cluster-migration-checklist.md](/home/kartheek/calchowmuch/docs/internal/math-cluster-migration-checklist.md)` |
| Scoped route proof (target route + scope lock) | `[public/math/trigonometry/trig-functions/index.html](/home/kartheek/calchowmuch/public/math/trigonometry/trig-functions/index.html)` |
| SEO/schema evidence | `[public/math/trigonometry/trig-functions/index.html](/home/kartheek/calchowmuch/public/math/trigonometry/trig-functions/index.html)` and `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| CWV artifact (`scoped-cwv` or global) | task log from direct scoped Playwright CWV spec |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `[public/calculators/math/trigonometry/trig-functions/explanation.html](/home/kartheek/calchowmuch/public/calculators/math/trigonometry/trig-functions/explanation.html)` |
| Important Notes contract proof (if applicable) | `[public/calculators/math/trigonometry/trig-functions/explanation.html](/home/kartheek/calchowmuch/public/calculators/math/trigonometry/trig-functions/explanation.html)` |
| Pane layout proof (for `calc_exp`) | `[public/math/trigonometry/trig-functions/index.html](/home/kartheek/calchowmuch/public/math/trigonometry/trig-functions/index.html)` |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| MATH-TRIG-001 | Navigation still declared `split` for this route at audit time, so the generator blocked the redesign until the pane contract was corrected. | Low | The route navigation contract was updated to `single`, then the route was regenerated and all scoped gates were rerun. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-26` |

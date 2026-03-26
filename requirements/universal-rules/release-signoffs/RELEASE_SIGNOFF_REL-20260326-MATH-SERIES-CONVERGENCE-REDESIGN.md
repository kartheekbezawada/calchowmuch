# Release Sign-Off

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260326-MATH-SERIES-CONVERGENCE-REDESIGN` |
| Release Type | `Math calculator redesign` |
| Scope (Global/Cluster/Calc/Route) | `Calc/Route` |
| Cluster ID | `math` |
| Calculator ID (CALC) | `series-convergence` |
| Primary Route | `/math/calculus/series-convergence/` |
| Owner | `Codex` |
| Date | `2026-03-26` |
| Commit SHA | `8a8d95d9` |
| Environment | `local workspace` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | `Pass` | task log |
| Unit | `CLUSTER=math CALC=series-convergence npm run test:calc:unit` | `Pass` | task log |
| E2E | `PW_BASE_URL=http://localhost:8001 npm exec playwright test tests_specs/math/series-convergence_release/e2e.calc.spec.js --reporter=line` | `Pass` | `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| SEO | `PW_BASE_URL=http://localhost:8001 npm exec playwright test tests_specs/math/series-convergence_release/seo.calc.spec.js --reporter=line` | `Pass` | `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| CWV | `PW_BASE_URL=http://localhost:8001 npm exec playwright test tests_specs/math/series-convergence_release/cwv.calc.spec.js --reporter=line` | `Pass` | task log |
| ISS-001 | `not applicable for this scoped route release` | `Skipped` | n/a |
| Schema Dedupe | `CLUSTER=math CALC=series-convergence npm run test:schema:dedupe -- --scope=calc` | `Pass` | `[schema_duplicates_report.md](/home/kartheek/calchowmuch/schema_duplicates_report.md)` |
| Cluster Contracts | `npm run test:cluster:contracts` | `Pass` | task log |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | `Pass` | task log |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `[math-cluster-migration-checklist.md](/home/kartheek/calchowmuch/docs/internal/math-cluster-migration-checklist.md)` |
| Scoped route proof (target route + scope lock) | `[public/math/calculus/series-convergence/index.html](/home/kartheek/calchowmuch/public/math/calculus/series-convergence/index.html)` |
| SEO/schema evidence | `[public/math/calculus/series-convergence/index.html](/home/kartheek/calchowmuch/public/math/calculus/series-convergence/index.html)` and `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| CWV artifact (`scoped-cwv` or global) | task log from direct scoped Playwright CWV spec |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `[public/calculators/math/calculus/series-convergence/explanation.html](/home/kartheek/calchowmuch/public/calculators/math/calculus/series-convergence/explanation.html)` |
| Important Notes contract proof (if applicable) | `[public/calculators/math/calculus/series-convergence/explanation.html](/home/kartheek/calchowmuch/public/calculators/math/calculus/series-convergence/explanation.html)` |
| Pane layout proof (for `calc_exp`) | `[public/math/calculus/series-convergence/index.html](/home/kartheek/calchowmuch/public/math/calculus/series-convergence/index.html)` |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| MATH-SERIES-CONVERGENCE-001 | The legacy route still depended on an inline init script, which the migrated math shell strips, so the calculator could render without solving on page load. | Medium | The migrated module now self-initializes safely on import and reran the full scoped validation stack successfully. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-26` |

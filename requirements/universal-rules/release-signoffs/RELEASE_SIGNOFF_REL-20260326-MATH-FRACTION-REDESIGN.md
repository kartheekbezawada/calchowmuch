# Release Sign-Off

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260326-MATH-FRACTION-REDESIGN` |
| Release Type | `Math calculator redesign` |
| Scope (Global/Cluster/Calc/Route) | `Calc/Route` |
| Cluster ID | `math` |
| Calculator ID (CALC) | `fraction-calculator` |
| Primary Route | `/math/fraction-calculator/` |
| Owner | `Codex` |
| Date | `2026-03-26` |
| Commit SHA | `6822c39e` |
| Environment | `local workspace` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | `Pass` | task log |
| Unit | `CLUSTER=math CALC=fraction-calculator npm run test:calc:unit` | `Pass` | task log |
| E2E | `PW_BASE_URL=http://localhost:8001 npm exec playwright test tests_specs/math/fraction-calculator_release/e2e.calc.spec.js --reporter=line` | `Pass` | `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| SEO | `PW_BASE_URL=http://localhost:8001 npm exec playwright test tests_specs/math/fraction-calculator_release/seo.calc.spec.js --reporter=line` | `Pass` | `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| CWV | `PW_BASE_URL=http://localhost:8001 SCOPED_CWV_BASE_URL=http://localhost:8001 npm exec playwright test tests_specs/math/fraction-calculator_release/cwv.calc.spec.js --reporter=line` | `Pass` | task log |
| ISS-001 | `not applicable for this scoped route release` | `Skipped` | n/a |
| Schema Dedupe | `CLUSTER=math CALC=fraction-calculator npm run test:schema:dedupe -- --scope=calc` | `Pass` | `[schema_duplicates_report.md](/home/kartheek/calchowmuch/schema_duplicates_report.md)` |
| Cluster Contracts | `npm run test:cluster:contracts` | `Pass` | task log |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | `Pass` | task log |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `[math-cluster-migration-checklist.md](/home/kartheek/calchowmuch/docs/internal/math-cluster-migration-checklist.md)` |
| Scoped route proof (target route + scope lock) | `[public/math/fraction-calculator/index.html](/home/kartheek/calchowmuch/public/math/fraction-calculator/index.html)` |
| SEO/schema evidence | `[public/math/fraction-calculator/index.html](/home/kartheek/calchowmuch/public/math/fraction-calculator/index.html)` and `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| CWV artifact (`scoped-cwv` or global) | task log from direct scoped Playwright CWV spec |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `[public/calculators/math/fraction-calculator/explanation.html](/home/kartheek/calchowmuch/public/calculators/math/fraction-calculator/explanation.html)` |
| Important Notes contract proof (if applicable) | `[public/calculators/math/fraction-calculator/explanation.html](/home/kartheek/calchowmuch/public/calculators/math/fraction-calculator/explanation.html)` |
| Pane layout proof (for `calc_exp`) | `[public/math/fraction-calculator/index.html](/home/kartheek/calchowmuch/public/math/fraction-calculator/index.html)` |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| MATH-FRAC-001 | Isolation scope reported shared-contract mode because the same branch already contains the completed `basic` route migration. | Low | Shared generator and cluster governance changes were validated with `test:cluster:contracts` and the scoped route checks all passed. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-26` |

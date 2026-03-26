# Release Sign-Off

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260326-MATH-BASIC-REDESIGN` |
| Release Type | `Math calculator redesign` |
| Scope (Global/Cluster/Calc/Route) | `Calc/Route` |
| Cluster ID | `math` |
| Calculator ID (CALC) | `basic` |
| Primary Route | `/math/basic/` |
| Owner | `Codex` |
| Date | `2026-03-26` |
| Commit SHA | `6822c39e` |
| Environment | `local workspace` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | `Pass` | task log |
| Unit | `CLUSTER=math CALC=basic npm run test:calc:unit` | `Pass` | task log |
| E2E | `PW_BASE_URL=http://localhost:8001 npm exec playwright test tests_specs/math/basic_release/e2e.calc.spec.js --reporter=line` | `Pass` | `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| SEO | `PW_BASE_URL=http://localhost:8001 npm exec playwright test tests_specs/math/basic_release/seo.calc.spec.js --reporter=line` | `Pass` | `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| CWV | `PW_BASE_URL=http://localhost:8001 SCOPED_CWV_BASE_URL=http://localhost:8001 npm exec playwright test tests_specs/math/basic_release/cwv.calc.spec.js --reporter=line` | `Pass` | task log |
| ISS-001 | `not applicable for this scoped route release` | `Skipped` | n/a |
| Schema Dedupe | `CLUSTER=math CALC=basic npm run test:schema:dedupe -- --scope=calc` | `Pass` | `[schema_duplicates_report.md](/home/kartheek/calchowmuch/schema_duplicates_report.md)` |
| Cluster Contracts | `npm run test:cluster:contracts` | `Pass` | task log |

Note:

- The scoped Playwright wrapper command for `seo` did not surface progress reliably in this environment, so the equivalent direct Playwright spec was run against the same local static server for deterministic output.

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `[math-cluster-migration-checklist.md](/home/kartheek/calchowmuch/docs/internal/math-cluster-migration-checklist.md)` |
| Scoped route proof (target route + scope lock) | `[public/math/basic/index.html](/home/kartheek/calchowmuch/public/math/basic/index.html)` |
| Homepage search verification keyword(s) | `basic calculator` validated through `npm run test:cluster:contracts` homepage-search contract pass |
| SEO/schema evidence | `[public/math/basic/index.html](/home/kartheek/calchowmuch/public/math/basic/index.html)` and `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| CWV artifact (`scoped-cwv` or global) | task log from direct scoped Playwright CWV spec |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `[public/calculators/math/basic/explanation.html](/home/kartheek/calchowmuch/public/calculators/math/basic/explanation.html)` |
| Important Notes contract proof (if applicable) | `[public/calculators/math/basic/explanation.html](/home/kartheek/calchowmuch/public/calculators/math/basic/explanation.html)` |
| Pane layout proof (for `calc_exp`) | `[public/math/basic/index.html](/home/kartheek/calchowmuch/public/math/basic/index.html)` |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| MATH-BASIC-001 | Scoped Playwright wrapper for `seo` did not stream progress in this environment. | Low | Direct Playwright route spec executed successfully against the local static server; investigate wrapper observability before the next route. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-26` |

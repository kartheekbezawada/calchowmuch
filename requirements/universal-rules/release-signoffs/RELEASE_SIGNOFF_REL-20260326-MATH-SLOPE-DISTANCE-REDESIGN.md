# Release Sign-Off

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260326-MATH-SLOPE-DISTANCE-REDESIGN` |
| Release Type | `Math calculator redesign` |
| Scope (Global/Cluster/Calc/Route) | `Calc/Route` |
| Cluster ID | `math` |
| Calculator ID (CALC) | `slope-distance` |
| Primary Route | `/math/algebra/slope-distance/` |
| Owner | `Codex` |
| Date | `2026-03-26` |
| Commit SHA | `b5b1ea95` |
| Environment | `local workspace` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | `Pass` | task log |
| Unit | `CLUSTER=math CALC=slope-distance npm run test:calc:unit` | `Pass` | task log |
| E2E | `PW_BASE_URL=http://localhost:8001 npm exec playwright test tests_specs/math/slope-distance_release/e2e.calc.spec.js --reporter=line` | `Pass` | `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| SEO | `PW_BASE_URL=http://localhost:8001 npm exec playwright test tests_specs/math/slope-distance_release/seo.calc.spec.js --reporter=line` | `Pass` | `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| CWV | `PW_BASE_URL=http://localhost:8001 SCOPED_CWV_BASE_URL=http://localhost:8001 npm exec playwright test tests_specs/math/slope-distance_release/cwv.calc.spec.js --reporter=line` | `Pass` | task log |
| ISS-001 | `not applicable for this scoped route release` | `Skipped` | n/a |
| Schema Dedupe | `CLUSTER=math CALC=slope-distance npm run test:schema:dedupe -- --scope=calc` | `Pass` | `[schema_duplicates_report.md](/home/kartheek/calchowmuch/schema_duplicates_report.md)` |
| Cluster Contracts | `npm run test:cluster:contracts` | `Pass` | task log |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | `Pass` | task log |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `[math-cluster-migration-checklist.md](/home/kartheek/calchowmuch/docs/internal/math-cluster-migration-checklist.md)` |
| Scoped route proof (target route + scope lock) | `[public/math/algebra/slope-distance/index.html](/home/kartheek/calchowmuch/public/math/algebra/slope-distance/index.html)` |
| SEO/schema evidence | `[public/math/algebra/slope-distance/index.html](/home/kartheek/calchowmuch/public/math/algebra/slope-distance/index.html)` and `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| CWV artifact (`scoped-cwv` or global) | task log from direct scoped Playwright CWV spec |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `[public/calculators/math/algebra/slope-distance/explanation.html](/home/kartheek/calchowmuch/public/calculators/math/algebra/slope-distance/explanation.html)` |
| Important Notes contract proof (if applicable) | `[public/calculators/math/algebra/slope-distance/explanation.html](/home/kartheek/calchowmuch/public/calculators/math/algebra/slope-distance/explanation.html)` |
| Pane layout proof (for `calc_exp`) | `[public/math/algebra/slope-distance/index.html](/home/kartheek/calchowmuch/public/math/algebra/slope-distance/index.html)` |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| MATH-SLOPE-001 | Isolation scope reported shared-contract mode because the branch already includes earlier math cluster migrations. | Low | Shared generator and math-cluster governance changes were revalidated with cluster contracts plus the full scoped route gate set. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-26` |

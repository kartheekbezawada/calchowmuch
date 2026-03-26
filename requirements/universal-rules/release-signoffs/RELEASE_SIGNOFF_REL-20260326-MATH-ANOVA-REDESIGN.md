# Release Sign-Off

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260326-MATH-ANOVA-REDESIGN` |
| Release Type | `Math calculator redesign` |
| Scope (Global/Cluster/Calc/Route) | `Calc/Route` |
| Cluster ID | `math` |
| Calculator ID (CALC) | `anova` |
| Primary Route | `/math/statistics/anova/` |
| Owner | `Codex` |
| Date | `2026-03-26` |
| Commit SHA | `481f936f` |
| Environment | `local workspace` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | `Pass` | task log |
| Unit | `CLUSTER=math CALC=anova npm run test:calc:unit` | `Pass` | task log |
| E2E | `npx playwright test tests_specs/math/anova_release/e2e.calc.spec.js` | `Pass` | `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| SEO | `npx playwright test tests_specs/math/anova_release/seo.calc.spec.js` | `Pass` | `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| CWV | `npx playwright test tests_specs/math/anova_release/cwv.calc.spec.js` | `Pass` | task log |
| ISS-001 | `not applicable for this scoped route release` | `Skipped` | n/a |
| Schema Dedupe | `CLUSTER=math CALC=anova npm run test:schema:dedupe -- --scope=calc` | `Pass` | `[schema_duplicates_report.md](/home/kartheek/calchowmuch/schema_duplicates_report.md)` |
| Cluster Contracts | `npm run test:cluster:contracts` | `Pass` | task log |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | `Pass` | task log |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `[math-cluster-migration-checklist.md](/home/kartheek/calchowmuch/docs/internal/math-cluster-migration-checklist.md)` |
| Scoped route proof (target route + scope lock) | `[public/math/statistics/anova/index.html](/home/kartheek/calchowmuch/public/math/statistics/anova/index.html)` |
| SEO/schema evidence | `[public/math/statistics/anova/index.html](/home/kartheek/calchowmuch/public/math/statistics/anova/index.html)` and `[playwright-report/index.html](/home/kartheek/calchowmuch/playwright-report/index.html)` |
| CWV artifact (`scoped-cwv` or global) | task log from direct scoped Playwright CWV spec |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `[public/calculators/math/statistics/anova/explanation.html](/home/kartheek/calchowmuch/public/calculators/math/statistics/anova/explanation.html)` |
| Important Notes contract proof (if applicable) | `[public/calculators/math/statistics/anova/explanation.html](/home/kartheek/calchowmuch/public/calculators/math/statistics/anova/explanation.html)` |
| Pane layout proof (for `calc_exp`) | `[public/math/statistics/anova/index.html](/home/kartheek/calchowmuch/public/math/statistics/anova/index.html)` |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| none | No route-specific exceptions recorded after scoped validation. | Low | n/a |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-26` |

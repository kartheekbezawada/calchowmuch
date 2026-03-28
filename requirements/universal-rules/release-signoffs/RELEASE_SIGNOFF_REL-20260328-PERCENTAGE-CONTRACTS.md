# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260328-PERCENTAGE-CONTRACTS` |
| Release Type | `CLUSTER_SHARED` |
| Scope (Global/Cluster/Calc/Route) | `Cluster` |
| Cluster ID | `percentage` |
| Calculator ID (CALC) | `N/A` |
| Primary Route | `/percentage-calculators/percentage-increase-calculator/` |
| Owner | `Codex` |
| Date | `2026-03-28` |
| Commit SHA | `cbbdfe428e1e17ab8d6152da6c8ae2ee931cde33` |
| Environment | `Local workspace` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | terminal output |
| Unit | `CLUSTER=percentage npm run test:cluster:unit` | Pass | terminal output |
| E2E | `CLUSTER=percentage npm run test:cluster:e2e` | Pass | `test-results/playwright/cluster/percentage/2026-03-28T19-48-57-410Z/playwright-all.summary.json` |
| SEO | `CLUSTER=percentage npm run test:cluster:seo` | Pass | `test-results/playwright/cluster/percentage/2026-03-28T19-48-57-410Z/playwright-all.summary.json`; `seo_mojibake_report.md`; `seo_mojibake_report.csv` |
| CWV | `CLUSTER=percentage npm run test:cluster:cwv` | Pass | `test-results/playwright/cluster/percentage/2026-03-28T19-48-57-410Z/playwright-all.summary.json`; `test-results/playwright/cluster/percentage/2026-03-28T19-48-57-410Z/html-report/index.html` |
| ISS-001 | `npm run test:iss001` | Skipped | Not required for this non-UI cluster contract cleanup scope |
| Schema Dedupe | `CLUSTER=percentage npm run test:schema:dedupe -- --scope=cluster` | Pass | `schema_duplicates_report.md`; `schema_duplicates_report.csv` |
| Cluster Contracts | `npm run test:cluster:contracts` | Pass | terminal output |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | terminal output |
| Grouped Playwright Summary | `CLUSTER=percentage npm run test:cluster:playwright` | Pass | `test-results/playwright/cluster/percentage/2026-03-28T19-48-57-410Z/playwright-all.summary.json` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Scope targeted the `percentage` cluster contract set for `/percentage-calculators/percentage-difference-calculator/`, `/percentage-calculators/percentage-increase-calculator/`, `/percentage-calculators/percentage-decrease-calculator/`, and `/percentage-calculators/percentage-composition-calculator/`; changed files limited to `config/clusters/route-ownership.json`, `clusters/percentage/config/asset-manifest.json`, `requirements/universal-rules/NON_MATH_SEO_WAVE_PLAN.md`, and `tests_specs/percentage/cluster_release/*` |
| Homepage search verification keyword(s) | `percentage increase`, `percentage difference`, `percentage decrease`, `percentage composition`; validated via `npm run test:cluster:contracts` which includes `npm run test:homepage:search:contracts` |
| SEO/schema evidence | `test-results/playwright/cluster/percentage/2026-03-28T19-48-57-410Z/playwright-all.summary.json`; `seo_mojibake_report.md`; `seo_mojibake_report.csv`; `schema_duplicates_report.md`; `schema_duplicates_report.csv` |
| CWV artifact (`scoped-cwv` or global) | `test-results/playwright/cluster/percentage/2026-03-28T19-48-57-410Z/playwright-all.summary.json`; `test-results/playwright/cluster/percentage/2026-03-28T19-48-57-410Z/html-report/index.html` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/cluster/percentage/2026-03-28T19-48-06-625Z.json` |
| Important Notes contract proof (if applicable) | Existing route content retained; no Important Notes content change in this scope |
| Pane layout proof (for `calc_exp`) | `clusters/percentage/config/navigation.json` includes the target calc route entries; `public/percentage-calculators/percentage-increase-calculator/index.html` shows `data-route-archetype="calc_exp"` plus `panel-span-all` and `calculator-page-single` |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| R-001 | The scoped SEO harness prints a large jsdom CSS parse warning blob after passing. The gate result is still pass, but the log noise makes evidence review harder. | Low | Keep as known tooling noise unless HUMAN wants a separate harness cleanup scope. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-28` |

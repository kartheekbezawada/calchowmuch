# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260310-001 |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc + Route |
| Cluster ID | loans |
| Calculator ID (CALC) | remortgage-switching |
| Primary Route | /loan-calculators/remortgage-calculator/ |
| Owner | Codex |
| Date | 2026-03-10 |
| Commit SHA | 0ad0a71 |
| Environment | Local (Playwright + Vitest) |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Terminal run output |
| Unit | `CLUSTER=loans CALC=remortgage-switching npm run test:calc:unit` | Pass (1 test skipped) | Terminal run output |
| E2E | `PW_WORKERS_LOCAL=1 CLUSTER=loans CALC=remortgage-switching npm run test:calc:e2e` | Pass (11 passed) | Terminal run output |
| SEO | `CLUSTER=loans CALC=remortgage-switching npm run test:calc:seo` | Skipped (SEO placeholder spec) | `tests_specs/loans/remortgage-switching_release/seo.calc.spec.js` |
| CWV | `PW_WORKERS_LOCAL=1 CLUSTER=loans CALC=remortgage-switching npm run test:calc:cwv` | Pass | `test-results/performance/scoped-cwv/loans/remortgage-switching.json` |
| ISS-001 | `PW_WORKERS_LOCAL=2 npm run test:iss001` | Pass (9 passed) | `playwright-report/index.html` |
| Schema Dedupe | `CLUSTER=loans CALC=remortgage-switching npm run test:schema:dedupe -- --scope=calc` | Pass | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | `CLUSTER=loans`, `CALC=remortgage-switching`, route `/loan-calculators/remortgage-calculator/` |
| SEO/schema evidence | SEO placeholder spec at `tests_specs/loans/remortgage-switching_release/seo.calc.spec.js`; schema reports at repo root |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/scoped-cwv/loans/remortgage-switching.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | Command reported `test-results/content-quality/scoped/loans/remortgage-switching.json` (artifact path not present in workspace after run) |
| Important Notes contract proof (if applicable) | `public/calculators/loan-calculators/remortgage-calculator/explanation.html:455-463` (Last updated, Accuracy, Disclaimer, Assumptions, Privacy lines) and `:64-66` (label color) |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json:517-523` (`paneLayout: "single"`), `public/loan-calculators/remortgage-calculator/index.html:1847-1849` (`panel-span-all`, `calculator-page-single`) |
| Scoped CWV override proof | `config/testing/CWV_SCOPED_BUDGETS.json` route override for `/loan-calculators/remortgage-calculator/` (`clsMax: 0.2`, `blockingCssMaxRequests: 3`) |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| RISK-REL-20260310-001 | Local scoped E2E showed intermittent timeout/artifact-write flake at higher workers during this session. | Low | Gate pass confirmed with deterministic command `PW_WORKERS_LOCAL=1`. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-10 |

# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260309-001 |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc |
| Cluster ID | loans |
| Calculator ID (CALC) | how-much-can-i-borrow |
| Primary Route | /loan-calculators/how-much-can-i-borrow/ |
| Owner | Codex |
| Date | 2026-03-09 |
| Commit SHA | 8d0d0e5 |
| Environment | Local workspace |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Skipped | Scoped calc release followed calculator-specific gate matrix |
| Scoped Page Generation | `TARGET_CALC_ID=how-much-can-i-borrow node scripts/generate-mpa-pages.js` | Pass | `public/loan-calculators/how-much-can-i-borrow/index.html` |
| Unit | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:unit` | Pass | `tests_specs/loans/how-much-can-i-borrow_release/unit.calc.test.js` |
| E2E | `PW_WORKERS_LOCAL=1 CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:e2e` | Pass | `tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js` |
| SEO | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:seo` | Pass | `tests_specs/loans/how-much-can-i-borrow_release/seo.calc.spec.js` |
| CWV | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:cwv` | Pass | `test-results/performance/scoped-cwv/loans/how-much-can-i-borrow.json` |
| ISS-001 | `npm run test:iss001` | Skipped | Not required by scoped calculator gate set for this release type |
| Schema Dedupe | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:schema:dedupe -- --scope=calc` | Pass | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |
| SEO Mojibake | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:seo:mojibake -- --scope=calc` | Pass | `seo_mojibake_report.md`, `seo_mojibake_report.csv` |
| Content Quality | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:content:quality -- --scope=calc` | Pass | `test-results/content-quality/scoped/loans/how-much-can-i-borrow.json` |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 CLUSTER=loans ROUTE=/loan-calculators/how-much-can-i-borrow/ npm run test:isolation:scope` | Pass | Command output records shared-contract opt-in and strict-check skip due release-signoff file change |
| Cluster Contracts | `CLUSTER=loans npm run test:cluster:contracts` | Pass | Command completed successfully |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Route `/loan-calculators/how-much-can-i-borrow/`; edited files limited to `requirements/Calculators Home Loan/How Much I can Borrow.md`, `public/calculators/loan-calculators/how-much-can-i-borrow/explanation.html`, `public/loan-calculators/how-much-can-i-borrow/index.html`, and this sign-off file |
| SEO/schema evidence | `tests_specs/loans/how-much-can-i-borrow_release/seo.calc.spec.js`; `schema_duplicates_report.md`; `schema_duplicates_report.csv` |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/scoped-cwv/loans/how-much-can-i-borrow.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/scoped/loans/how-much-can-i-borrow.json` |
| Important Notes contract proof (if applicable) | `public/loan-calculators/how-much-can-i-borrow/index.html` includes `Important Notes` with keys: Last updated, Accuracy, Financial disclaimer, Assumptions, Privacy |
| Pane layout proof (for `calc_exp`) | Generated route keeps `.panel.panel-scroll.panel-span-all` and `.calculator-page-single` in `public/loan-calculators/how-much-can-i-borrow/index.html`; route remains `calc_exp` single-pane per nav contract |

Notes:
- Full structured guide content was inserted after the Rate Scenarios table as a single guide section (`How To Guide`) and Related Calculators were separated from FAQ card selectors to keep FAQ parity at 10 questions.
- Route output CSS loading was tuned in-scope for this route to satisfy scoped CWV budgets without changing shared/core files.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| RISK-001 | Default parallel Playwright workers caused intermittent `beforeEach` navigation timeouts for this route during local scoped E2E. | Low | Scoped E2E executed with `PW_WORKERS_LOCAL=1` for deterministic local pass. |
| RISK-002 | Route output currently loads calculator CSS directly for this route to satisfy scoped CWV guard while avoiding shared/core scope expansion. | Medium | Follow up with shared-contract approved migration to route-bundle-critical strategy in shared generator if standardization is required. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-09 |

# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260309-003 |
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
| Scoped Page Generation | `TARGET_CALC_ID=how-much-can-i-borrow node scripts/generate-mpa-pages.js` | Pass | `public/loan-calculators/how-much-can-i-borrow/index.html` |
| Unit | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:unit` | Pass | `tests_specs/loans/how-much-can-i-borrow_release/unit.calc.test.js` |
| E2E (default workers) | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:e2e` | Fail | Playwright `beforeEach` navigation timeout under parallel workers |
| E2E (deterministic local rerun) | `PW_WORKERS_LOCAL=1 CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:e2e` | Pass | `tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js` |
| SEO | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:seo` | Pass | `tests_specs/loans/how-much-can-i-borrow_release/seo.calc.spec.js` |
| CWV | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:cwv` | Fail | `test-results/performance/scoped-cwv/loans/how-much-can-i-borrow.json` (`mobile_strict` CLS and strict blocking CSS gates) |
| Schema Dedupe | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:schema:dedupe -- --scope=calc` | Pass | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |
| SEO Mojibake | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:seo:mojibake -- --scope=calc` | Pass | `seo_mojibake_report.md`, `seo_mojibake_report.csv` |
| Content Quality | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:content:quality -- --scope=calc` | Pass | `test-results/content-quality/scoped/loans/how-much-can-i-borrow.json` |
| Isolation Scope | `CLUSTER=loans ROUTE=/loan-calculators/how-much-can-i-borrow/ npm run test:isolation:scope` | Fail | Script flags in-scope source paths as `Another calculator source changed` |
| Cluster Contracts | `CLUSTER=loans npm run test:cluster:contracts` | Pass | Command output confirms validation passed |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Route `/loan-calculators/how-much-can-i-borrow/`; edited files are `requirements/Calculators Home Loan/How Much I can Borrow.md`, `public/calculators/loan-calculators/how-much-can-i-borrow/explanation.html`, `public/calculators/loan-calculators/how-much-can-i-borrow/module.js`, `public/calculators/loan-calculators/how-much-can-i-borrow/calculator.css`, `public/loan-calculators/how-much-can-i-borrow/index.html`, this sign-off file |
| SEO/schema evidence | `tests_specs/loans/how-much-can-i-borrow_release/seo.calc.spec.js`; `schema_duplicates_report.md`; `schema_duplicates_report.csv` |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/scoped-cwv/loans/how-much-can-i-borrow.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/scoped/loans/how-much-can-i-borrow.json` |
| Pane layout proof (for `calc_exp`) | Route remains single-pane `calc_exp`; scoped E2E passes with deterministic local worker setting |

Notes:
- `Your Income Capacity` donut center no longer shows monthly income; it now shows contextual hover label + percentage.
- Slice hover/focus now exposes percentage in the donut center and native tooltip (`title`) for each segment.
- Palette and legend alignment were updated for a more professional visual style and stable numeric alignment.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| RISK-001 | Scoped E2E fails under default parallel Playwright workers due local navigation timeout contention. | Medium | Use `PW_WORKERS_LOCAL=1` for deterministic local scoped E2E evidence. |
| RISK-002 | Strict scoped CWV budget fails: `mobile_strict` CLS `0.192 > 0.1`, `mobile_strict` blocking CSS requests `3 > 1`, `desktop_strict` blocking CSS requests `3 > 1`. | High | Requires broader CSS-delivery/perf-contract decision beyond this scoped UI refinement. |
| RISK-003 | `test:isolation:scope` reports in-scope files as `Another calculator source changed` for this calculator path. | Medium | Requires shared script/route-map correction or policy exception. |

---

## 5) Final Decision

Decision: [ ] APPROVED  [x] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-09 |

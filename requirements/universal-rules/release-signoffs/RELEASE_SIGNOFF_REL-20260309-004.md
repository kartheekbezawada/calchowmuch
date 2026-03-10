# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260309-004 |
| Release Type | CLUSTER_ROUTE_MULTI_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc |
| Cluster ID | loans |
| Calculator ID (CALC) | remortgage-switching, buy-to-let |
| Primary Route | /loan-calculators/remortgage-calculator/, /loan-calculators/buy-to-let-mortgage-calculator/ |
| Owner | Codex |
| Date | 2026-03-09 |
| Commit SHA | 89b09b7 |
| Environment | Local workspace |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Scoped Page Generation | `TARGET_CALC_ID=remortgage-switching node scripts/generate-mpa-pages.js` | Pass | `public/loan-calculators/remortgage-calculator/index.html` |
| Scoped Page Generation | `TARGET_CALC_ID=buy-to-let node scripts/generate-mpa-pages.js` | Pass | `public/loan-calculators/buy-to-let-mortgage-calculator/index.html` |
| Unit (Remortgage) | `CLUSTER=loans CALC=remortgage-switching npm run test:calc:unit` | Pass (1 skipped placeholder) | `tests_specs/loans/remortgage-switching_release/unit.calc.test.js` |
| Unit (Buy-to-let) | `CLUSTER=loans CALC=buy-to-let npm run test:calc:unit` | Pass | `tests_specs/loans/buy-to-let_release/unit.calc.test.js` |
| E2E (Remortgage) | `PW_WORKERS_LOCAL=1 CLUSTER=loans CALC=remortgage-switching npm run test:calc:e2e` | Pass | `tests_specs/loans/remortgage-switching_release/e2e.calc.spec.js` |
| E2E (Buy-to-let) | `PW_WORKERS_LOCAL=1 CLUSTER=loans CALC=buy-to-let npm run test:calc:e2e` | Pass | `tests_specs/loans/buy-to-let_release/e2e.calc.spec.js` |
| SEO (Remortgage) | `CLUSTER=loans CALC=remortgage-switching npm run test:calc:seo` | Pass (scope placeholder skipped) | `tests_specs/loans/remortgage-switching_release/seo.calc.spec.js` |
| SEO (Buy-to-let) | `CLUSTER=loans CALC=buy-to-let npm run test:calc:seo` | Pass (scope placeholder skipped) | `tests_specs/loans/buy-to-let_release/seo.calc.spec.js` |
| CWV (Remortgage) | `CLUSTER=loans CALC=remortgage-switching npm run test:calc:cwv` | Fail | `test-results/performance/scoped-cwv/loans/remortgage-switching.json` |
| CWV (Buy-to-let) | `CLUSTER=loans CALC=buy-to-let npm run test:calc:cwv` | Fail | `test-results/performance/scoped-cwv/loans/buy-to-let.json` |
| Schema Dedupe (Remortgage) | `CLUSTER=loans CALC=remortgage-switching npm run test:schema:dedupe -- --scope=calc` | Pass | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |
| Schema Dedupe (Buy-to-let) | `CLUSTER=loans CALC=buy-to-let npm run test:schema:dedupe -- --scope=calc` | Pass | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |
| SEO Mojibake (Remortgage) | `CLUSTER=loans CALC=remortgage-switching npm run test:seo:mojibake -- --scope=calc` | Pass | `seo_mojibake_report.md`, `seo_mojibake_report.csv` |
| SEO Mojibake (Buy-to-let) | `CLUSTER=loans CALC=buy-to-let npm run test:seo:mojibake -- --scope=calc` | Pass | `seo_mojibake_report.md`, `seo_mojibake_report.csv` |
| Content Quality (Remortgage) | `CLUSTER=loans CALC=remortgage-switching npm run test:content:quality -- --scope=calc` | Pass (warn only) | `test-results/content-quality/scoped/loans/remortgage-switching.json` |
| Content Quality (Buy-to-let) | `CLUSTER=loans CALC=buy-to-let npm run test:content:quality -- --scope=calc` | Pass (warn only) | `test-results/content-quality/scoped/loans/buy-to-let.json` |
| Isolation Scope (Remortgage route) | `CLUSTER=loans ROUTE=/loan-calculators/remortgage-calculator/ npm run test:isolation:scope` | Pass | Command output (`shared contract changes: 0`) |
| Isolation Scope (Buy-to-let route) | `CLUSTER=loans ROUTE=/loan-calculators/buy-to-let-mortgage-calculator/ npm run test:isolation:scope` | Pass | Command output (`shared contract changes: 0`) |
| Cluster Contracts | `CLUSTER=loans npm run test:cluster:contracts` | Pass | Command output confirms validation passed |
| Lint | `npm run lint` | Pass | ESLint output clean |
| ISS-001 | `PW_WORKERS_LOCAL=1 npm run test:iss001` | Pass | `tests_specs/infrastructure/e2e/iss-design-001.spec.js` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Edited files are limited to remortgage/buy-to-let requirement markdown, calculator explanation/css source, generated route `index.html` for both routes, and this sign-off file |
| SEO/schema evidence | `tests_specs/loans/remortgage-switching_release/seo.calc.spec.js`; `tests_specs/loans/buy-to-let_release/seo.calc.spec.js`; `schema_duplicates_report.md`; `schema_duplicates_report.csv` |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/scoped-cwv/loans/remortgage-switching.json`; `test-results/performance/scoped-cwv/loans/buy-to-let.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/scoped/loans/remortgage-switching.json`; `test-results/content-quality/scoped/loans/buy-to-let.json` |
| Pane layout proof (for `calc_exp`) | Remortgage scoped E2E ISS contract test passes; buy-to-let scoped E2E single-pane structure test passes |

Notes:
- Remortgage related cards no longer use FAQ selector classes, restoring expected FAQ card count contract.
- Both calculators now include full structured guide content plus an Important Notes section directly below FAQs.
- Inline scoped style blocks were added inside each explanation source to keep overflow/styling fixes within approved scope files.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| RISK-001 | Scoped CWV budget fails for both calculators on strict blocking CSS request threshold (`3 > 1`). | High | Requires shared CSS-delivery/perf-contract change outside approved scope (shared shell/head contract). |
| RISK-002 | Remortgage scoped CWV additionally fails desktop CLS strict threshold (`0.171 > 0.1`). | Medium | Requires broader CLS/perf tuning and potentially shared render sequencing review beyond scoped content update. |

---

## 5) Final Decision

Decision: [ ] APPROVED  [x] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-09 |

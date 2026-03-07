# Release Sign-Off (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260306-001 |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Cluster + Single Calculator |
| Cluster ID | loans |
| Calculator ID (CALC) | personal-loan |
| Primary Route | /loan-calculators/personal-loan-calculator/ |
| Owner | Codex |
| Date | 2026-03-06 |
| Commit SHA | 74a6d8b |
| Environment | Local (Playwright + Node) |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/01-lint.log` |
| Lint CSS Import | `npm run lint:css-import` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/02-lint-css-import.log` |
| Cluster Unit | `CLUSTER=loans npm run test:cluster:unit` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/03-cluster-unit.log` |
| Cluster E2E | `CLUSTER=loans npm run test:cluster:e2e` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/04-cluster-e2e.log` |
| Cluster SEO | `CLUSTER=loans npm run test:cluster:seo` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/05-cluster-seo.log` |
| Cluster CWV | `CLUSTER=loans npm run test:cluster:cwv` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/06-cluster-cwv.log` |
| Calc Unit | `CLUSTER=loans CALC=personal-loan npm run test:calc:unit` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/07-calc-unit.log` |
| Calc E2E | `CLUSTER=loans CALC=personal-loan npm run test:calc:e2e` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/08-calc-e2e.log` |
| Calc SEO | `CLUSTER=loans CALC=personal-loan npm run test:calc:seo` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/09-calc-seo.log` |
| Calc CWV | `CLUSTER=loans CALC=personal-loan npm run test:calc:cwv` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/10-calc-cwv.log` |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/11-isolation-scope.log` |
| Cluster Contracts | `CLUSTER=loans npm run test:cluster:contracts` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/12-cluster-contracts.log` |
| Schema Dedupe (calc) | `CLUSTER=loans CALC=personal-loan npm run test:schema:dedupe -- --scope=calc` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/13-schema-dedupe-calc.log` |
| SEO Mojibake (calc) | `CLUSTER=loans CALC=personal-loan npm run test:seo:mojibake -- --scope=calc` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/14-seo-mojibake-calc.log` |
| Content Quality (calc) | `CLUSTER=loans CALC=personal-loan npm run test:content:quality -- --scope=calc` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/15-content-quality-calc.log` |
| ISS-001 | `npm run test:iss001` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/16-iss001.log` |
| ISS Snapshot Refresh | `npx playwright test tests_specs/infrastructure/e2e/iss-design-001.spec.js --update-snapshots` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/16a-iss001-update-snapshots.log` |
| Scoped Page Generation | `REBUILD_ROUTE_BUNDLES=1 TARGET_CALC_ID=personal-loan node scripts/generate-mpa-pages.js` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/04-regenerate-personal-loan.log` |
| Sitemap Generation | `node scripts/generate-sitemap.js` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/17-generate-sitemap.log` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | `public/config/navigation.json` (personal-loan entry at lines ~557-562), `config/testing/test-scope-map.json` (personal-loan mapping) |
| SEO/schema evidence | `requirements/universal-rules/release-signoffs/artifacts/REL-20260306-001/logs/09-calc-seo.log`, `.../13-schema-dedupe-calc.log`, `schema_duplicates_report.md`, `schema_duplicates_report.csv` |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/scoped-cwv/loans/personal-loan.json`, plus `.../logs/10-calc-cwv.log` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/scoped/loans/personal-loan.json`, plus `.../logs/15-content-quality-calc.log` |
| Important Notes contract proof (if applicable) | `public/calculators/loan-calculators/personal-loan-calculator/explanation.html` (`#pl-section-important-notes`) and generated `public/loan-calculators/personal-loan-calculator/index.html` |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` (`paneLayout: single` for personal-loan), generated route has `panel-span-all` + `calculator-page-single` in `public/loan-calculators/personal-loan-calculator/index.html` |
| ISS-001 baseline update evidence | Updated snapshots in `tests_specs/infrastructure/e2e/iss-design-001.spec.js-snapshots/` |

Notes:
- `test:isolation:scope` required shared-contract opt-in because route registration/build-contract files changed.
- ISS-001 initially failed on visual baseline drift and was resolved by approved snapshot refresh.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-ISS-001-BASELINE | Visual snapshot baseline required refresh after route/bundle contract updates. | Low | Baseline updated and ISS-001 re-run passed. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-06 |

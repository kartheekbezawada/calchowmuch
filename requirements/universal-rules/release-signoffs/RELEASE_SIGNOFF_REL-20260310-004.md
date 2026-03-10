# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260310-004 |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc + Route (mortgage scope) |
| Cluster ID | loans |
| Calculator ID (CALC) | home-loan |
| Primary Route | /loan-calculators/mortgage-calculator/ |
| Owner | Codex |
| Date | 2026-03-10 |
| Commit SHA | d08b7e0 |
| Environment | Local workspace |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | ESLint output (`public/assets/js`) |
| Cluster Unit | `CLUSTER=loans npm run test:cluster:unit` | Pass | `tests_specs/loans/cluster_release/unit.cluster.test.js`, `tests_specs/loans/cluster_release/contracts.cluster.test.js` |
| Cluster E2E | `CLUSTER=loans npm run test:cluster:e2e` | Pass | `tests_specs/loans/cluster_release/e2e.cluster.spec.js` |
| Cluster SEO | `CLUSTER=loans npm run test:cluster:seo` | Pass | `tests_specs/loans/cluster_release/seo.cluster.spec.js` |
| Cluster CWV | `CLUSTER=loans npm run test:cluster:cwv` | **Fail (external blocker)** | Fails on `/loan-calculators/buy-to-let-mortgage-calculator/` with `CLS=0.191` (`>0.10`) |
| Calc Unit | `CLUSTER=loans CALC=home-loan npm run test:calc:unit` | Pass | `tests_specs/loans/home-loan_release/unit.calc.test.js` |
| Calc E2E | `CLUSTER=loans CALC=home-loan npm run test:calc:e2e` | Pass | `tests_specs/loans/home-loan_release/e2e.calc.spec.js` |
| Calc SEO | `CLUSTER=loans CALC=home-loan npm run test:calc:seo` | Pass | `tests_specs/loans/home-loan_release/seo.calc.spec.js` |
| Calc CWV | `CLUSTER=loans CALC=home-loan npm run test:calc:cwv` | Pass | `test-results/performance/scoped-cwv/loans/home-loan.json` |
| Isolation Scope | `npm run test:isolation:scope` | Pass (non-blocking strict-check skip) | Command output: no violations, strict single-calculator artifact check skipped |
| Cluster Contracts | `npm run test:cluster:contracts` | Pass | Command output confirms validation passed |
| Schema Dedupe | `CLUSTER=loans CALC=home-loan npm run test:schema:dedupe -- --scope=calc` | Pass | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |
| SEO Mojibake | `CLUSTER=loans CALC=home-loan npm run test:seo:mojibake -- --scope=calc` | Pass | `seo_mojibake_report.md`, `seo_mojibake_report.csv` |
| Thin Content | `CLUSTER=loans CALC=home-loan npm run test:content:quality -- --scope=calc` | Pass (soft warning mode) | `test-results/content-quality/scoped/loans/home-loan.json` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | `CLUSTER=loans`, `CALC=home-loan`, route `/loan-calculators/mortgage-calculator/` |
| SEO/schema evidence | `tests_specs/loans/home-loan_release/seo.calc.spec.js`, `schema_duplicates_report.md`, `schema_duplicates_report.csv` |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/scoped-cwv/loans/home-loan.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/scoped/loans/home-loan.json` |
| Important Notes contract proof (if applicable) | `public/calculators/loan-calculators/mortgage-calculator/explanation.html` contains required lines including refreshed `Last updated: March 2026` |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json:504-506` (`routeArchetype=calc_exp`, `paneLayout=single`) and `public/loan-calculators/mortgage-calculator/index.html:202,204` (`panel-span-all`, `calculator-page-single`) |
| Requested content proof | `public/calculators/loan-calculators/mortgage-calculator/explanation.html:278-301` and `public/loan-calculators/mortgage-calculator/index.html:678-701` include `What does a Mortgage Calculator tell me?`, intent bullets, and `How this calculator helps customers` |

Notes:
- During this session, mortgage content changes were already present in `HEAD` (`d08b7e0`) when gate execution completed; no additional mortgage HTML diffs were pending.
- Per HUMAN direction, scope remained limited to mortgage and no out-of-scope route fixes were applied.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| RISK-REL-20260310-004-1 | Hard gate failure in `CLUSTER=loans npm run test:cluster:cwv` on out-of-scope route `/loan-calculators/buy-to-let-mortgage-calculator/` (`CLS=0.191` > `0.10`). | High | Requires explicit scope expansion to fix buy-to-let CWV, then re-run cluster CWV gate. |
| RISK-REL-20260310-004-2 | `test:isolation:scope` strict single-calculator artifact check was skipped because changed calculators were not detected from current git diff. | Medium | Acceptable for this run (no violation output), but keep an eye on validator signal quality in future scoped releases. |

---

## 5) Final Decision

Decision: [ ] APPROVED  [x] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-10 |

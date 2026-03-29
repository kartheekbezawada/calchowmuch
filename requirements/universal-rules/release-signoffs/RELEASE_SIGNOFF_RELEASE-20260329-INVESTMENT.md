# Release Sign-Off Template (Compact)

> [!IMPORTANT]
> Copy this template to `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md`.

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | RELEASE-20260329-INVESTMENT |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc |
| Cluster ID | finance |
| Calculator ID (CALC) | investment |
| Primary Route | /finance-calculators/investment-calculator/ |
| Owner | Codex (agent) |
| Date | 2026-03-29 |
| Commit SHA | a0524933 |
| Environment | Local workspace |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Command completed successfully on 2026-03-29 |
| Unit | `CLUSTER=finance CALC=investment npm run test:calc:unit` | Pass | `tests_specs/finance/investment_release/unit.calc.test.js` |
| E2E | `CLUSTER=finance CALC=investment npm run test:calc:e2e` | Pass | `tests_specs/finance/investment_release/e2e.calc.spec.js` |
| SEO | `CLUSTER=finance CALC=investment npm run test:calc:seo` | Pass | `tests_specs/finance/investment_release/seo.calc.spec.js`; `seo_mojibake_report.md`; `seo_mojibake_report.csv` |
| CWV | `CLUSTER=finance CALC=investment npm run test:calc:cwv` | Pass | `test-results/performance/scoped-cwv/finance/investment.json` |
| ISS-001 | `npm run test:iss001` | Skipped | Not applicable for scoped single-calculator release |
| Schema Dedupe | `CLUSTER=finance CALC=investment npm run test:schema:dedupe -- --scope=calc` | Pass | `schema_duplicates_report.md`; `schema_duplicates_report.csv` |

Additional required scoped gates:

| Gate | Command | Result | Evidence Path |
| :--- | :--- | :--- | :--- |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 TARGET_ROUTE=/finance-calculators/investment-calculator/ npm run test:isolation:scope` | Pass | Command output: shared-contract opt-in accepted; strict single-calculator artifact check skipped because release touched governed shared-contract files and two support-route explanations |
| Cluster Contracts | `npm run test:cluster:contracts` | Pass | Command output includes `Cluster contract validation passed.` |
| Homepage Search Contracts | `npm run test:cluster:contracts` | Pass | Command output includes `Homepage search discoverability validation passed.` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Route ownership: `config/clusters/route-ownership.json` includes `/finance-calculators/investment-calculator/` with `calculatorId=investment`, `activeOwnerClusterId=finance`, `rollbackTag=pre-investment-calculator-release-20260329` |
| Homepage search verification keyword(s) | Keywords: `investment`, `investment calculator`; governed source row in `public/config/navigation.json`; validated by `npm run test:cluster:contracts` which runs homepage-search discoverability checks |
| SEO/schema evidence | Generated route `public/finance-calculators/investment-calculator/index.html` contains canonical, OG URL, FAQ section, and calculator LD block; dedupe reports at `schema_duplicates_report.md` and `schema_duplicates_report.csv`; mojibake scan reports at `seo_mojibake_report.md` and `seo_mojibake_report.csv` |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/scoped-cwv/finance/investment.json` with `mobile_strict` CLS `0`, LCP `820ms`; `desktop_strict` CLS `0.0058`, LCP `920ms` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | Scoped SEO run emitted `test-results/content-quality/scoped/finance/investment.json` with final summary `pass=1, warn=0, fail=0`; later scoped CWV run cleared other `test-results` outputs, so final pass state is captured here from the successful SEO command output |
| Important Notes contract proof (if applicable) | `public/finance-calculators/investment-calculator/index.html` includes `Last updated`, `Accuracy`, `Disclaimer`, and exact privacy line `All calculations run locally in your browser - no data is stored.` |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` declares `/finance-calculators/investment-calculator/` as `routeArchetype=calc_exp` with `paneLayout=single`; generated route `public/finance-calculators/investment-calculator/index.html` contains `panel-span-all` and `calculator-page-single` |

Notes:
- Route generation executed with `node scripts/generate-mpa-pages.js --route /finance-calculators/investment-calculator/`.
- Full build completed successfully with `npm run build`.
- Sitemap coverage verified in `public/sitemap.xml`.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| RISK-SEO-JSDOM-CSS | Scoped SEO command logs a jsdom `Could not parse CSS stylesheet` warning against bundled inline CSS from unrelated route styles, but the SEO test itself passes and structured-data/mojibake checks remain green. | Low | Treat as existing harness/parser issue; investigate bundled CSS parsing separately if it starts failing gates. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex (agent) | 2026-03-29 |

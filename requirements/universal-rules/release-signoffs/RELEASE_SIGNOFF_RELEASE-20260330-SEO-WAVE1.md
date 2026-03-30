## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `RELEASE-20260330-SEO-WAVE1` |
| Release Type | `CLUSTER_SHARED` |
| Scope (Global/Cluster/Calc/Route) | `Route set (Wave 1)` |
| Cluster ID | `homepage, pricing, salary, time-and-date` |
| Calculator ID (CALC) | `homepage-root, margin-calculator, markup-calculator, commission-calculator, age-calculator` |
| Primary Route | `/` |
| Owner | `Codex` |
| Date | `2026-03-30` |
| Commit SHA | `644bf817` |
| Environment | `local workspace` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Command output |
| Unit | `CLUSTER=pricing CALC=margin-calculator npm run test:calc:unit`<br>`CLUSTER=pricing CALC=markup-calculator npm run test:calc:unit`<br>`CLUSTER=pricing CALC=commission-calculator npm run test:calc:unit`<br>`CLUSTER=salary CALC=commission-calculator npm run test:calc:unit`<br>`CLUSTER=time-and-date CALC=age-calculator npm run test:calc:unit` | Pass | `tests_specs/pricing/margin-calculator_release/unit.calc.test.js`<br>`tests_specs/pricing/markup-calculator_release/unit.calc.test.js`<br>`tests_specs/pricing/commission-calculator_release/unit.calc.test.js`<br>`tests_specs/salary/commission-calculator_release/unit.calc.test.js`<br>`tests_specs/time-and-date/age-calculator_release/unit.calc.test.js` |
| E2E | `npx playwright test tests_specs/infrastructure/e2e/home-shell.spec.js`<br>`CLUSTER=pricing CALC=margin-calculator npm run test:calc:e2e`<br>`CLUSTER=pricing CALC=markup-calculator npm run test:calc:e2e`<br>`CLUSTER=pricing CALC=commission-calculator npm run test:calc:e2e`<br>`CLUSTER=salary CALC=commission-calculator npm run test:calc:e2e`<br>`CLUSTER=time-and-date CALC=age-calculator npm run test:calc:e2e` | Pass | `tests_specs/infrastructure/e2e/home-shell.spec.js`<br>`tests_specs/pricing/margin-calculator_release/e2e.calc.spec.js`<br>`tests_specs/pricing/markup-calculator_release/e2e.calc.spec.js` (`1 skipped` placeholder)<br>`tests_specs/pricing/commission-calculator_release/e2e.calc.spec.js`<br>`tests_specs/salary/shared/factories.js`<br>`tests_specs/time-and-date/age-calculator_release/e2e.calc.spec.js` |
| SEO | `CLUSTER=pricing CALC=margin-calculator npm run test:calc:seo`<br>`CLUSTER=pricing CALC=markup-calculator npm run test:calc:seo`<br>`CLUSTER=pricing CALC=commission-calculator npm run test:calc:seo`<br>`CLUSTER=salary CALC=commission-calculator npm run test:calc:seo`<br>`CLUSTER=time-and-date CALC=age-calculator npm run test:calc:seo` | Pass | `tests_specs/pricing/margin-calculator_release/seo.calc.spec.js`<br>`tests_specs/pricing/markup-calculator_release/seo.calc.spec.js`<br>`tests_specs/pricing/commission-calculator_release/seo.calc.spec.js`<br>`tests_specs/salary/shared/factories.js`<br>`tests_specs/time-and-date/age-calculator_release/seo.calc.spec.js` |
| Content Quality | `CLUSTER=pricing CALC=margin-calculator npm run test:content:quality -- --scope=calc`<br>`CLUSTER=pricing CALC=markup-calculator npm run test:content:quality -- --scope=calc`<br>`CLUSTER=pricing CALC=commission-calculator npm run test:content:quality -- --scope=calc`<br>`CLUSTER=salary CALC=commission-calculator npm run test:content:quality -- --scope=calc`<br>`CLUSTER=time-and-date CALC=age-calculator npm run test:content:quality -- --scope=calc` | Pass | `test-results/content-quality/scoped/pricing/margin-calculator.json`<br>`test-results/content-quality/scoped/pricing/markup-calculator.json`<br>`test-results/content-quality/scoped/pricing/commission-calculator.json`<br>`test-results/content-quality/scoped/salary/commission-calculator.json`<br>`test-results/content-quality/scoped/time-and-date/age-calculator.json` |
| CWV | `CLUSTER=pricing CALC=margin-calculator npm run test:calc:cwv`<br>`CLUSTER=pricing CALC=markup-calculator npm run test:calc:cwv`<br>`CLUSTER=pricing CALC=commission-calculator npm run test:calc:cwv`<br>`CLUSTER=salary CALC=commission-calculator npm run test:calc:cwv`<br>`CLUSTER=time-and-date CALC=age-calculator npm run test:calc:cwv` | Pass | `test-results/performance/scoped-cwv/pricing/margin-calculator.json`<br>`test-results/performance/scoped-cwv/pricing/markup-calculator.json`<br>`test-results/performance/scoped-cwv/pricing/commission-calculator.json`<br>`test-results/performance/scoped-cwv/salary/commission-calculator.json`<br>`test-results/performance/scoped-cwv/time-and-date/age-calculator.json` |
| ISS-001 | `npx playwright test tests_specs/infrastructure/e2e/home-shell.spec.js` | Pass | `HOME-ISS-001` in `tests_specs/infrastructure/e2e/home-shell.spec.js` |
| Schema Dedupe | `CLUSTER=pricing CALC=margin-calculator npm run test:schema:dedupe -- --scope=calc`<br>`CLUSTER=pricing CALC=markup-calculator npm run test:schema:dedupe -- --scope=calc`<br>`CLUSTER=pricing CALC=commission-calculator npm run test:schema:dedupe -- --scope=calc`<br>`CLUSTER=salary CALC=commission-calculator npm run test:schema:dedupe -- --scope=calc`<br>`CLUSTER=time-and-date CALC=age-calculator npm run test:schema:dedupe -- --scope=calc` | Pass | `schema_duplicates_report.md`<br>`schema_duplicates_report.csv` |
| Homepage Search Contracts | `npm run test:homepage:search:contracts` | Pass | Command output: `Homepage search discoverability validation passed.` |
| Cluster Contracts | `npm run test:cluster:contracts` | Pass | Command output: `Cluster contract validation passed.` |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | Command output: changed calculators `commission-calculator, margin-calculator, markup-calculator, age-calculator`; shared contract changes `1` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Wave 1 routes: `/`, `/calculators/`, `/pricing-calculators/`, `/salary-calculators/`, `/pricing-calculators/margin-calculator/`, `/pricing-calculators/markup-calculator/`, `/pricing-calculators/commission-calculator/`, `/salary-calculators/commission-calculator/`, `/time-and-date/age-calculator/` |
| Homepage search verification keyword(s) | Shared discoverability verified by `npm run test:homepage:search:contracts`; homepage regression covered by `HOME-SEARCH-000` in `tests_specs/infrastructure/e2e/home-shell.spec.js` |
| SEO/schema evidence | Source changes in `scripts/generate-mpa-pages.js`, `public/calculators/salary-calculators/content.html`, `public/calculators/pricing-calculators/*/{module.js,explanation.html,index.html}`, `public/calculators/salary-calculators/commission-calculator/{module.js,explanation.html}`, `public/calculators/time-and-date/age-calculator/{module.js,explanation.html}`; generated outputs under `public/**/index.html` |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/scoped-cwv/pricing/margin-calculator.json`<br>`test-results/performance/scoped-cwv/pricing/markup-calculator.json`<br>`test-results/performance/scoped-cwv/pricing/commission-calculator.json`<br>`test-results/performance/scoped-cwv/salary/commission-calculator.json`<br>`test-results/performance/scoped-cwv/time-and-date/age-calculator.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/scoped/pricing/margin-calculator.json` (`warn`, score 85)<br>`test-results/content-quality/scoped/pricing/markup-calculator.json` (`warn`, score 75)<br>`test-results/content-quality/scoped/pricing/commission-calculator.json` (`warn`, score 82)<br>`test-results/content-quality/scoped/salary/commission-calculator.json` (`pass`, score 78)<br>`test-results/content-quality/scoped/time-and-date/age-calculator.json` (`warn`, score 62) |
| Important Notes contract proof (if applicable) | `public/calculators/time-and-date/age-calculator/explanation.html`<br>`public/calculators/salary-calculators/commission-calculator/explanation.html` |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` declares `paneLayout: "single"` for touched calculator routes; generated outputs include `.calculator-page-single` / `.panel-span-all` on touched Wave 1 calculator pages |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | `tests_specs/pricing/markup-calculator_release/e2e.calc.spec.js` remains a placeholder skip, so markup route flow coverage relies on unit, SEO, CWV, and the existing scoped placeholder instead of a full route journey spec. | Low | Replace the placeholder with a real markup E2E scenario in Wave 2 or the final consolidation pass. |
| EX-002 | Thin-content scoring still reports `warn` on pricing margin, pricing markup, pricing commission, and age despite no hard failures. | Low | Use Wave 2 or Wave 6 to deepen those routes further, focusing on explanation depth and support-section completeness. |
| EX-003 | Raw generated HTML for the touched pricing and time-and-date routes still emits fallback static JSON-LD, while full `WebPage` + `FAQPage` graphs are completed at runtime by the route modules. | Medium | Add approved cluster-specific static structured-data builders for pricing and time-and-date in a later generator-scope task if raw-source JSON-LD completeness becomes a release requirement. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-30` |

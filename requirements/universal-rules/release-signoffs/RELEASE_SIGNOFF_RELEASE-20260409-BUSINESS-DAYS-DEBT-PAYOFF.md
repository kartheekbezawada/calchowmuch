# Release Sign-Off

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `RELEASE-20260409-BUSINESS-DAYS-DEBT-PAYOFF` |
| Release Type | `CLUSTER_ROUTE` |
| Scope (Global/Cluster/Calc/Route) | `Calc/Route (2 routes)` |
| Cluster ID | `time-and-date`, `credit-cards` |
| Calculator ID (CALC) | `business-days-calculator`, `debt-payoff-calculator` |
| Primary Route | `/time-and-date/business-days-calculator/`, `/credit-card-calculators/debt-payoff-calculator/` |
| Owner | `Codex` |
| Date | `2026-04-09` |
| Commit SHA | `755b964a` |
| Environment | `local` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | terminal run 2026-04-09 |
| Unit | `CLUSTER=time-and-date CALC=business-days-calculator npm run test:calc:unit` | Pass | `tests_specs/time-and-date/business-days-calculator_release/unit.calc.test.js` |
| Unit | `CLUSTER=credit-cards CALC=debt-payoff-calculator npm run test:calc:unit` | Pass | `tests_specs/credit-cards/debt-payoff-calculator_release/unit.calc.test.js` |
| E2E | `CLUSTER=time-and-date CALC=business-days-calculator npm run test:calc:e2e` | Pass | `tests_specs/time-and-date/business-days-calculator_release/e2e.calc.spec.js` |
| E2E | `CLUSTER=credit-cards CALC=debt-payoff-calculator npm run test:calc:e2e` | Pass | `tests_specs/credit-cards/debt-payoff-calculator_release/e2e.calc.spec.js` |
| SEO | `CLUSTER=time-and-date CALC=business-days-calculator npm run test:calc:seo` | Pass | `tests_specs/time-and-date/business-days-calculator_release/seo.calc.spec.js` |
| SEO | `CLUSTER=credit-cards CALC=debt-payoff-calculator npm run test:calc:seo` | Pass | `tests_specs/credit-cards/debt-payoff-calculator_release/seo.calc.spec.js` |
| CWV | `CLUSTER=time-and-date CALC=business-days-calculator npm run test:calc:cwv` | Pass | command output reported `test-results/performance/scoped-cwv/time-and-date/business-days-calculator.json` |
| CWV | `CLUSTER=credit-cards CALC=debt-payoff-calculator npm run test:calc:cwv` | Pass | command output reported `test-results/performance/scoped-cwv/credit-cards/debt-payoff-calculator.json` |
| Cluster Contracts | `npm run test:cluster:contracts` | Pass | terminal run 2026-04-09 |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | terminal run 2026-04-09 |
| ISS-001 | Not required for calculator-scoped `NEW_BUILD` release | Skipped | release-mode matrix in `requirements/universal-rules/RELEASE_CHECKLIST.md` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | `public/config/navigation.json`, `config/testing/test-scope-map.json`, `public/time-and-date/business-days-calculator/index.html`, `public/credit-card-calculators/debt-payoff-calculator/index.html` |
| Homepage search verification keyword(s) | `business days`, `debt payoff` via `npm run test:cluster:contracts` -> `npm run test:homepage:search:contracts` |
| SEO evidence | `tests_specs/time-and-date/business-days-calculator_release/seo.calc.spec.js`, `tests_specs/credit-cards/debt-payoff-calculator_release/seo.calc.spec.js` |
| CWV artifact (`scoped-cwv` or global) | command output paths above; scoped thin-content artifacts also present at `test-results/content-quality/scoped/time-and-date/business-days-calculator.json` and `test-results/content-quality/scoped/credit-cards/debt-payoff-calculator.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/scoped/time-and-date/business-days-calculator.json`, `test-results/content-quality/scoped/credit-cards/debt-payoff-calculator.json` |
| Important Notes contract proof (if applicable) | `public/calculators/time-and-date/business-days-calculator/explanation.html`, `public/calculators/credit-card-calculators/debt-payoff-calculator/explanation.html` |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` entries with `paneLayout: "single"` plus generated route HTML containing `panel-span-all` and `calculator-page-single` |

Notes:

- Shared contract files were intentionally modified within approved scope: `public/config/navigation.json` and `public/config/asset-manifest.json`. Isolation gate required explicit opt-in via `ALLOW_SHARED_CONTRACT_CHANGE=1`.
- Static public-route metadata was manually aligned after generation so the shipped HTML head matches the intended route SEO.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| RISK-001 | Thin-content audit reported `warn=1` for both routes, but no fail. This is expected tension with a lean business-days page and a newly added debt guide. | Low | Monitor search performance and expand only if CTR/engagement data justifies more depth. |
| RISK-002 | Scoped SEO runs emit a jsdom stylesheet parse warning from existing aggregated CSS blocks outside these routes. The tests still passed. | Low | Treat as existing harness noise unless it starts failing route-level SEO gates. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-04-09 |

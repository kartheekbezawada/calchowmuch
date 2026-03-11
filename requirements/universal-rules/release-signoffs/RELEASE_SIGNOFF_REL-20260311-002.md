# Release Sign-Off — REL-20260311-002

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260311-002 |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc |
| Cluster ID | percentage |
| Calculator ID (CALC) | what-percent-is-x-of-y |
| Primary Route | /percentage-calculators/percentage-finder-calculator/ |
| Owner | Codex |
| Date | 2026-03-11 |
| Commit SHA | 4dcd480 |
| Environment | Local |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Skipped (scoped calc release; shared lint target `public/assets/js` unchanged) | n/a |
| Unit | `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:unit` | Pass | `tests_specs/percentage/what-percent-is-x-of-y_release/unit.calc.test.js` |
| E2E | `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:e2e` | Pass | `tests_specs/percentage/what-percent-is-x-of-y_release/e2e.calc.spec.js` |
| SEO | `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:seo` | Pass | `tests_specs/percentage/what-percent-is-x-of-y_release/seo.calc.spec.js` |
| CWV | `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:cwv` | Pass | `test-results/performance/scoped-cwv/percentage/what-percent-is-x-of-y.json` |
| ISS-001 | `npm run test:iss001` | Skipped (global suite outside locked single-calculator scope) | n/a |
| Schema Dedupe | `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:schema:dedupe -- --scope=calc` | Pass | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Approved scope locked to `/percentage-calculators/percentage-finder-calculator/`; committed file changes limited to `public/calculators/percentage-calculators/percentage-finder-calculator/explanation.html`, `public/calculators/percentage-calculators/percentage-finder-calculator/calculator.css`, `public/calculators/percentage-calculators/percentage-finder-calculator/module.js`, `public/percentage-calculators/percentage-finder-calculator/index.html`, `tests_specs/percentage/what-percent-is-x-of-y_release/e2e.calc.spec.js`, and this sign-off |
| SEO/schema evidence | SEO pass in `tests_specs/percentage/what-percent-is-x-of-y_release/seo.calc.spec.js`; schema dedupe pass from scoped calc run with no parse errors or unresolved duplicates |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/scoped-cwv/percentage/what-percent-is-x-of-y.json` (`pass: true`, blocking CSS requests `0` mobile/desktop after route-head preload fix) |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/scoped/percentage/what-percent-is-x-of-y.json` (`warn=1`, `fail=0`) |
| Important Notes contract proof (if applicable) | Source: `public/calculators/percentage-calculators/percentage-finder-calculator/explanation.html` ends with `Important Notes`; generated route mirrors final section in `public/percentage-calculators/percentage-finder-calculator/index.html` |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` declares `what-percent-is-x-of-y` as `routeArchetype: "calc_exp"` and `paneLayout: "single"`; generated route retains `.panel.panel-scroll.panel-span-all` and `.calculator-page-single` |

Additional implementation evidence:
- Editorial redesign replaced the previous thin explanation with a stronger hierarchy: summary, result meaning, results table, calculator walkthrough, worked example, formula breakdown, FAQs, and final notes.
- Visible FAQ markup migrated from legacy `bor-faq-*` classes to route-local `wpxy-faq-*` classes, and `module.js` FAQ schema was rewritten to match the visible Q/A set.
- Result copy now reads more naturally in the calculator pane while preserving existing validation and calculation behavior.
- Route-head CSS loading in `public/percentage-calculators/percentage-finder-calculator/index.html` was changed to `preload` + `noscript` fallback to satisfy scoped CWV blocking CSS budgets without widening scope to shared generators.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-REL-20260311-002-01 | `npm run scope:route -- --calc=what-percent-is-x-of-y` failed because the repo already contained unrelated out-of-scope dirty files in other clusters/calculators before this release work. | Low | Kept this release’s tracked changes inside the approved five route files plus sign-off; do not use the current scope-validator output as evidence of this route widening scope. |
| EX-REL-20260311-002-02 | Scoped SEO produced a thin-content warning artifact (`warn=1`) even though the SEO suite passed and there were no hard failures. | Low | Treat as follow-up content-hardening work if the percentage cluster undergoes another editorial pass. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-11 |

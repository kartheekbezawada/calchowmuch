# Release Sign-Off — REL-20260311-003

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260311-003 |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc |
| Cluster ID | percentage |
| Calculator ID (CALC) | percentage-of-a-number |
| Primary Route | /percentage-calculators/percentage-of-a-number-calculator/ |
| Owner | Codex |
| Date | 2026-03-11 |
| Commit SHA | 3564397 |
| Environment | Local |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Skipped (scoped calc release; shared lint target unchanged) | n/a |
| Unit | `CLUSTER=percentage CALC=percentage-of-a-number npm run test:calc:unit` | Pass | `tests_specs/percentage/percentage-of-a-number_release/unit.calc.test.js` |
| E2E | `CLUSTER=percentage CALC=percentage-of-a-number npm run test:calc:e2e` | Pass | `tests_specs/percentage/percentage-of-a-number_release/e2e.calc.spec.js` |
| SEO | `CLUSTER=percentage CALC=percentage-of-a-number npm run test:calc:seo` | Pass | `tests_specs/percentage/percentage-of-a-number_release/seo.calc.spec.js` |
| CWV | `CLUSTER=percentage CALC=percentage-of-a-number npm run test:calc:cwv` | Pass | `test-results/performance/scoped-cwv/percentage/percentage-of-a-number.json` |
| ISS-001 | `npm run test:iss001` | Skipped (global suite outside locked single-calculator scope) | n/a |
| Schema Dedupe | `CLUSTER=percentage CALC=percentage-of-a-number npm run test:schema:dedupe -- --scope=calc` | Pass | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Touched files are limited to `public/calculators/percentage-calculators/percentage-of-a-number-calculator/index.html`, `public/percentage-calculators/percentage-of-a-number-calculator/index.html`, `tests_specs/percentage/percentage-of-a-number_release/e2e.calc.spec.js`, and this sign-off |
| SEO/schema evidence | SEO pass from `tests_specs/percentage/percentage-of-a-number_release/seo.calc.spec.js`; schema dedupe pass (`scanned=1`, `parseErrors=0`, `unresolved=0`) |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/scoped-cwv/percentage/percentage-of-a-number.json` (`pass: true`, blocking CSS requests `0` on mobile/desktop profiles) |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/scoped/percentage/percentage-of-a-number.json` (`warn=1`, `fail=0`) |
| Important Notes contract proof (if applicable) | Generated route retains final `Important Notes` section in `public/percentage-calculators/percentage-of-a-number-calculator/index.html` |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` entry for `percentage-of-a-number` remains `routeArchetype: "calc_exp"` and `paneLayout: "single"`; route renders `.panel.panel-scroll.panel-span-all` and `.calculator-page-single` (validated by scoped E2E) |

Additional implementation evidence:
- Root cause for broken UI: route-specific calculator stylesheet was not being loaded in the generated page path.
- Source and generated route now explicitly load `/calculators/percentage-calculators/percentage-of-a-number-calculator/calculator.css` with preload + noscript fallback.
- Scoped E2E now includes a layout guard: `.pon-hero` must compute to `display: grid`, preventing silent style-regression passes.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-REL-20260311-003-01 | `npm run scope:route -- --calc=percentage-of-a-number` reported out-of-scope files tied to previously existing percentage-finder release work in repository history/state, not this calculator diff. | Low | Current working diff is limited to the three scoped calculator files plus this sign-off; continue using calculator-scoped gates as release authority for this change. |
| EX-REL-20260311-003-02 | Scoped SEO produced thin-content warning artifact (`warn=1`) with no hard SEO failure. | Low | Treat as follow-up content-hardening candidate in a dedicated editorial pass. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-11 |

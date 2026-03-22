# Release Sign-Off

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260322-ENERGY-BASED-NAP-SELECTOR-FIX |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc / Route |
| Cluster ID | time-and-date |
| Calculator ID (CALC) | energy-based-nap-selector |
| Primary Route | /time-and-date/energy-based-nap-selector/ |
| Owner | GitHub Copilot |
| Date | 2026-03-22 |
| Commit SHA | 104a011346663a26ae8a21edb48f06ab24184e9c |
| Environment | Local Linux workspace |

Release mode: FIX

Approved scope statement:
- Target calculator: energy-based-nap-selector
- Allowed files: route source HTML/CSS/explanation, generated route HTML, calculator-scoped E2E/SEO tests, release signoff
- Forbidden files: module.js, shared generators, other calculators during this pass, shared/core runtime files
- Scope lock used in validation: CLUSTER=sleep-and-nap CALC=energy-based-nap-selector ROUTE=/time-and-date/energy-based-nap-selector/

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Scoped terminal gate run on 2026-03-22 |
| CSS import guard | `npm run lint:css-import` | Pass | Scoped terminal gate run on 2026-03-22 |
| Unit | `CLUSTER=sleep-and-nap CALC=energy-based-nap-selector npm run test:calc:unit` | Pass | tests_specs/sleep-and-nap/energy-based-nap-selector_release/unit.calc.test.js |
| E2E | `CLUSTER=sleep-and-nap CALC=energy-based-nap-selector npm run test:calc:e2e` | Pass | tests_specs/sleep-and-nap/energy-based-nap-selector_release/e2e.calc.spec.js |
| SEO | `CLUSTER=sleep-and-nap CALC=energy-based-nap-selector npm run test:calc:seo` | Pass | tests_specs/sleep-and-nap/energy-based-nap-selector_release/seo.calc.spec.js |
| CWV | `CLUSTER=sleep-and-nap CALC=energy-based-nap-selector npm run test:calc:cwv` | Pass | test-results/performance/scoped-cwv/sleep-and-nap/energy-based-nap-selector.json |
| ISS-001 | `npm run test:iss001` | Skipped | Not required for this scoped calculator fix release mode |
| Schema Dedupe | `CLUSTER=sleep-and-nap CALC=energy-based-nap-selector npm run test:schema:dedupe -- --scope=calc` | Pass | schema_duplicates_report.md; schema_duplicates_report.csv |
| Cluster contracts | `npm run test:cluster:contracts` | Pass | Scoped terminal gate run on 2026-03-22 |
| Isolation scope | `npm run test:isolation:scope` | Pass | Scoped terminal gate run reported: `Isolation scope passed for calculator energy-based-nap-selector.` |

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | requirements/universal-rules/RELEASE_CHECKLIST.md |
| Scoped route proof (target route + scope lock) | CLUSTER=sleep-and-nap CALC=energy-based-nap-selector ROUTE=/time-and-date/energy-based-nap-selector/ |
| SEO/schema evidence | schema_duplicates_report.md; schema_duplicates_report.csv; tests_specs/sleep-and-nap/energy-based-nap-selector_release/seo.calc.spec.js |
| CWV artifact (`scoped-cwv` or global) | test-results/performance/scoped-cwv/sleep-and-nap/energy-based-nap-selector.json |
| Thin-content artifact (if `calc_exp` / `exp_only`) | No persisted `test-results/content-quality` artifact directory was present in the workspace after the scoped run; validation completed with no blocking thin-content failure observed |
| Important Notes contract proof (if applicable) | public/calculators/time-and-date/energy-based-nap-selector/explanation.html; generated route includes `Important Notes` section in public/time-and-date/energy-based-nap-selector/index.html |
| Pane layout proof (for `calc_exp`) | public/config/navigation.json shows `energy-based-nap-selector` with `routeArchetype: calc_exp` and `paneLayout: single`; generated route contains `calculator-page-single` and `panel-span-all` in public/time-and-date/energy-based-nap-selector/index.html |
| Route ownership proof | config/clusters/route-ownership.json lists `/time-and-date/energy-based-nap-selector/` owned by `time-and-date` |

Implementation summary:
- Rebuilt the route into the same cleaner single-surface planner/results structure used across the repaired sleep-and-nap pages.
- Preserved all existing module hooks, including goal buttons, time input, calculate action, placeholder, error state, primary recommendation card, alternatives list, and warning container.
- Replaced a corrupted concatenated route stylesheet with one clean route-local stylesheet.
- Updated scoped explanation-heading assertions to target the explanation cards instead of injected cluster headings and aligned the scoped SEO test with the current route schema contract.

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| ENAP-FIX-001 | This fix intentionally did not widen scope into `module.js`, so the route continues to emit its current `WebPage` + `FAQPage` schema contract. | Low | Accept for this route fix. Revisit schema expansion separately only if product requirements change. |

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | GitHub Copilot | 2026-03-22 |
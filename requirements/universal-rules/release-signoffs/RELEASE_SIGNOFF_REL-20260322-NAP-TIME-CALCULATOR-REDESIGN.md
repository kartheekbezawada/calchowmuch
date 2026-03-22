# Release Sign-Off

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260322-NAP-TIME-CALCULATOR-REDESIGN |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc / Route |
| Cluster ID | time-and-date |
| Calculator ID (CALC) | nap-time-calculator |
| Primary Route | /time-and-date/nap-time-calculator/ |
| Owner | GitHub Copilot |
| Date | 2026-03-22 |
| Commit SHA | 707a5a080262979020280d3afe19a295a53e9fd8 |
| Environment | Local Linux workspace |

Release mode: REDESIGN

Approved scope statement:
- Target calculator: nap-time-calculator
- Allowed files: route source HTML/CSS/explanation, generated route HTML, calculator-scoped E2E/SEO tests, release signoff
- Forbidden files: module.js, shared generators, other calculators during this pass, shared/core runtime files
- Scope lock used in validation: CLUSTER=sleep-and-nap CALC=nap-time-calculator ROUTE=/time-and-date/nap-time-calculator/

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Scoped terminal gate run on 2026-03-22 |
| CSS import guard | `npm run lint:css-import` | Pass | Scoped terminal gate run on 2026-03-22 |
| Unit | `CLUSTER=sleep-and-nap CALC=nap-time-calculator npm run test:calc:unit` | Pass | tests_specs/sleep-and-nap/nap-time-calculator_release/unit.calc.test.js |
| E2E | `CLUSTER=sleep-and-nap CALC=nap-time-calculator npm run test:calc:e2e` | Pass | tests_specs/sleep-and-nap/nap-time-calculator_release/e2e.calc.spec.js |
| SEO | `CLUSTER=sleep-and-nap CALC=nap-time-calculator npm run test:calc:seo` | Pass | tests_specs/sleep-and-nap/nap-time-calculator_release/seo.calc.spec.js |
| CWV | `CLUSTER=sleep-and-nap CALC=nap-time-calculator npm run test:calc:cwv` | Pass | test-results/performance/scoped-cwv/sleep-and-nap/nap-time-calculator.json |
| ISS-001 | `npm run test:iss001` | Skipped | Not required for this scoped calculator redesign release mode |
| Schema Dedupe | `CLUSTER=sleep-and-nap CALC=nap-time-calculator npm run test:schema:dedupe -- --scope=calc` | Pass | schema_duplicates_report.md; schema_duplicates_report.csv |
| Cluster contracts | `npm run test:cluster:contracts` | Pass | Scoped terminal gate run on 2026-03-22 |
| Isolation scope | `npm run test:isolation:scope` | Pass | Scoped terminal gate run reported: `Isolation scope: skipped strict single-calculator artifact check.` because nap-time-calculator, sleep-time-calculator, and wake-up-time-calculator are changed in the same worktree |

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | requirements/universal-rules/RELEASE_CHECKLIST.md |
| Scoped route proof (target route + scope lock) | CLUSTER=sleep-and-nap CALC=nap-time-calculator ROUTE=/time-and-date/nap-time-calculator/ |
| SEO/schema evidence | schema_duplicates_report.md; schema_duplicates_report.csv; tests_specs/sleep-and-nap/nap-time-calculator_release/seo.calc.spec.js |
| CWV artifact (`scoped-cwv` or global) | test-results/performance/scoped-cwv/sleep-and-nap/nap-time-calculator.json |
| Thin-content artifact (if `calc_exp` / `exp_only`) | Scoped SEO gate reported `test-results/content-quality/scoped/sleep-and-nap/nap-time-calculator.json` with `warn=1` and `fail=0`; no persisted artifact directory was present in the workspace after the run |
| Important Notes contract proof (if applicable) | public/calculators/time-and-date/nap-time-calculator/explanation.html; generated route includes `Important Notes` section in public/time-and-date/nap-time-calculator/index.html |
| Pane layout proof (for `calc_exp`) | public/config/navigation.json shows `nap-time-calculator` with `routeArchetype: calc_exp` and `paneLayout: single`; generated route contains `calculator-page-single` and `panel-span-all` in public/time-and-date/nap-time-calculator/index.html |
| Route ownership proof | config/clusters/route-ownership.json lists `/time-and-date/nap-time-calculator/` owned by `time-and-date` |

Implementation summary:
- Rebuilt the broken nap calculator into a cleaner single-surface planner with a lighter premium visual system.
- Preserved nap style selection, time picker, wake buffer controls, calculation hooks, error state, and result container IDs used by the existing module.
- Replaced corrupted route CSS with a clean route-level stylesheet and simplified the explanation content below the fold.
- Updated scoped E2E and SEO heading selectors so they target the nap explanation cards instead of injected cluster chrome.

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| NAP-REDESIGN-001 | Scoped SEO gate reported thin-content summary `warn=1`, `fail=0` for the route. | Low | Non-blocking for this redesign release. Review explanation density again after the full sleep, wake-up, and nap redesign wave is finalized. |
| NAP-REDESIGN-002 | Isolation scope gate skipped strict single-calculator artifact mode because sleep-time-calculator and wake-up-time-calculator changes are also present in the same uncommitted worktree. | Low | Expected during this one-calculator-at-a-time wave because prior signed-off route changes remain uncommitted. Re-run isolation scope after the wave if a consolidated release artifact is needed. |

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | GitHub Copilot | 2026-03-22 |
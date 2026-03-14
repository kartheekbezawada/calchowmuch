# Release Sign-Off — REL-20260313-002

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260313-002 |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc |
| Cluster ID | time-and-date |
| Calculator ID (CALC) | countdown-timer-generator |
| Primary Route | /time-and-date/countdown-timer/ |
| Owner | Codex |
| Date | 2026-03-13 |
| Commit SHA | a25365d |
| Environment | Local |

---

## 2) Approved Scope Contract

Approved target: `time-and-date` cluster, calculator `countdown-timer-generator`, public route `/time-and-date/countdown-timer/`.

Scope expansion approved by HUMAN during execution:
- Expanded from slug-only route/config/public HTML edits to include shared route-bundle and page-generation tooling required to make the renamed route release-compliant and pass scoped CWV.

Primary implementation areas:
- Countdown source fragments and SEO metadata
- Route ownership/navigation/sitemap/test-scope config
- Generated public countdown route and affected `time-and-date` nav HTML
- Route bundle manifests and generator/bundler support for public slug differing from source folder
- Countdown scoped release specs and this sign-off

---

## 3) Build Summary

- Changed the live public URL from `/time-and-date/countdown-timer-generator/` to `/time-and-date/countdown-timer/` with no redirect.
- Updated canonical, OG/Twitter metadata, FAQ/schema copy, H1, explanation content, and `Important Notes` for the new route.
- Removed the old generated route HTML and created the new generated route HTML at `public/time-and-date/countdown-timer/index.html`.
- Updated route ownership, cluster/public navigation, sitemap, route planner docs, and scoped tests to the new slug while keeping the internal calculator ID and source folder unchanged.
- Added tooling support for routes whose public slug differs from the source folder so the countdown route can use bundled critical/deferred CSS and pass scoped CWV budgets.

---

## 4) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Command output |
| Unit | `CLUSTER=time-and-date CALC=countdown-timer-generator npm run test:calc:unit` | Pass | `tests_specs/time-and-date/countdown-timer-generator_release/unit.calc.test.js` |
| E2E | `CLUSTER=time-and-date CALC=countdown-timer-generator npm run test:calc:e2e` | Pass | `tests_specs/time-and-date/countdown-timer-generator_release/e2e.calc.spec.js` |
| SEO | `CLUSTER=time-and-date CALC=countdown-timer-generator npm run test:calc:seo` | Pass | `tests_specs/time-and-date/countdown-timer-generator_release/seo.calc.spec.js` |
| CWV | `CLUSTER=time-and-date CALC=countdown-timer-generator npm run test:calc:cwv` | Pass | `test-results/performance/scoped-cwv/time-and-date/countdown-timer-generator.json` |
| ISS-001 | Not run | Skipped | Not applicable: no layout/design change and global ISS runs are not default for scoped calc release |
| Schema Dedupe | `CLUSTER=time-and-date CALC=countdown-timer-generator npm run test:schema:dedupe -- --scope=calc` | Pass | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |
| Mojibake | `CLUSTER=time-and-date CALC=countdown-timer-generator npm run test:seo:mojibake -- --scope=calc` | Pass | `seo_mojibake_report.md`, `seo_mojibake_report.csv` |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | Command output |
| Cluster Contracts | `CLUSTER=time-and-date npm run test:cluster:contracts` | Pass | Command output |

---

## 5) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | `config/clusters/route-ownership.json` route `/time-and-date/countdown-timer/` |
| SEO/schema evidence | `tests_specs/time-and-date/countdown-timer-generator_release/seo.calc.spec.js`; `schema_duplicates_report.md`; `schema_duplicates_report.csv`; `seo_mojibake_report.md`; `seo_mojibake_report.csv` |
| CWV artifact | `test-results/performance/scoped-cwv/time-and-date/countdown-timer-generator.json` |
| Thin-content artifact | `test-results/content-quality/scoped/time-and-date/countdown-timer-generator.json` |
| Important Notes contract proof | `public/time-and-date/countdown-timer/index.html` includes final `Important Notes` section with `Last updated`, `Accuracy`, `Disclaimer`, `Assumptions`, and `Privacy` |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` entry for `countdown-timer-generator` has `routeArchetype: "calc_exp"` and `paneLayout: "single"`; `public/time-and-date/countdown-timer/index.html` contains `.panel.panel-scroll.panel-span-all` and `.calculator-page-single` |

---

## 6) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-REL-20260313-002-01 | Thin-content scoring returned `warn` rather than `pass` for the route. | Low | Soft-mode warning only; retained in evidence as non-blocking SEO follow-up. |
| EX-REL-20260313-002-02 | `test:isolation:scope` skipped strict single-calculator artifact validation because the working tree already contains multiple calculator changes and shared-contract edits. | Low | Shared-contract opt-in was used explicitly and this sign-off records the approved release scope. |

---

## 7) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-13 |

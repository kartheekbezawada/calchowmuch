## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `RELEASE-20260330-SEO-WAVE4` |
| Release Type | `CLUSTER_SHARED` |
| Scope (Global/Cluster/Calc/Route) | `Route set (Wave 4)` |
| Cluster ID | `time-and-date, percentage` |
| Calculator ID (CALC) | `sleep-time-calculator, wake-up-time-calculator, nap-time-calculator, power-nap-calculator, energy-based-nap-selector, work-hours-calculator, overtime-hours-calculator, time-between-two-dates-calculator, days-until-a-date-calculator, countdown-timer-generator, birthday-day-of-week, percent-change, percent-to-fraction-decimal, percentage-composition, percentage-decrease, percentage-difference, percentage-increase, percentage-of-a-number, reverse-percentage, what-percent-is-x-of-y` |
| Primary Route | `/time-and-date/sleep-time-calculator/` |
| Owner | `Codex` |
| Date | `2026-03-30` |
| Commit SHA | `11d0b6a55693e80a0ca0ce646905842e40e36edd` |
| Environment | `local workspace` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Command output |
| Unit | `CLUSTER=time-and-date npm run test:cluster:unit`<br>`CLUSTER=percentage npm run test:cluster:unit` | Pass | `tests_specs/time-and-date/cluster_release/unit.cluster.test.js`<br>`tests_specs/percentage/cluster_release/unit.cluster.test.js` |
| E2E | `CLUSTER=time-and-date npm run test:cluster:e2e`<br>`CLUSTER=percentage npm run test:cluster:e2e` | Pass | `tests_specs/time-and-date/cluster_release/e2e.cluster.spec.js`<br>`tests_specs/percentage/cluster_release/e2e.cluster.spec.js` |
| SEO | `CLUSTER=time-and-date npm run test:cluster:seo`<br>`CLUSTER=percentage npm run test:cluster:seo` | Pass | `tests_specs/time-and-date/cluster_release/seo.cluster.spec.js`<br>`tests_specs/percentage/cluster_release/seo.cluster.spec.js`<br>`seo_mojibake_report.md`<br>`seo_mojibake_report.csv` |
| Content Quality | `CLUSTER=time-and-date npm run test:content:quality -- --scope=cluster`<br>`CLUSTER=percentage npm run test:content:quality -- --scope=cluster` | Pass | Command output summaries: `time-and-date evaluated=12, pass=0, warn=12, fail=0`; `percentage evaluated=9, pass=9, warn=0, fail=0` |
| CWV | `CLUSTER=time-and-date npm run test:cluster:cwv`<br>`CLUSTER=percentage npm run test:cluster:cwv` | Pass | `tests_specs/time-and-date/cluster_release/cwv.cluster.spec.js`<br>`tests_specs/percentage/cluster_release/cwv.cluster.spec.js` |
| Schema Dedupe | `CLUSTER=time-and-date npm run test:schema:dedupe -- --scope=cluster`<br>`CLUSTER=percentage npm run test:schema:dedupe -- --scope=cluster` | Pass | `schema_duplicates_report.md`<br>`schema_duplicates_report.csv` |
| Homepage Search Contracts | `npm run test:cluster:contracts` | Pass | Command output: `Homepage search discoverability validation passed.` |
| Cluster Contracts | `npm run test:cluster:contracts` | Pass | Command output: `Cluster contract validation passed.` |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | Command output: changed calculators `percent-change-calculator, percent-to-fraction-decimal-calculator, percentage-composition-calculator, percentage-decrease-calculator, percentage-difference-calculator, percentage-finder-calculator, percentage-increase-calculator, percentage-of-a-number-calculator, reverse-percentage-calculator, birthday-day-of-week, countdown-timer-generator, days-until-a-date-calculator, energy-based-nap-selector, nap-time-calculator, overtime-hours-calculator, power-nap-calculator, sleep-time-calculator, time-between-two-dates-calculator, wake-up-time-calculator, work-hours-calculator`; shared contract changes `1` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Approved Wave 4 scope stayed inside `scripts/generate-mpa-pages.js`, `public/calculators/time-and-date/**`, `public/calculators/percentage-calculators/**`, generated outputs under `public/time-and-date/**` and `public/percentage-calculators/**`, matching release specs under `tests_specs/time-and-date/**`, `tests_specs/sleep-and-nap/**`, and `tests_specs/percentage/**`.<br>Released routes: `/time-and-date/sleep-time-calculator/`, `/time-and-date/wake-up-time-calculator/`, `/time-and-date/nap-time-calculator/`, `/time-and-date/power-nap-calculator/`, `/time-and-date/energy-based-nap-selector/`, `/time-and-date/work-hours-calculator/`, `/time-and-date/overtime-hours-calculator/`, `/time-and-date/time-between-two-dates-calculator/`, `/time-and-date/days-until-a-date-calculator/`, `/time-and-date/countdown-timer/`, `/time-and-date/birthday-day-of-week/`, `/percentage-calculators/percent-change-calculator/`, `/percentage-calculators/percent-to-fraction-decimal-calculator/`, `/percentage-calculators/percentage-composition-calculator/`, `/percentage-calculators/percentage-decrease-calculator/`, `/percentage-calculators/percentage-difference-calculator/`, `/percentage-calculators/percentage-increase-calculator/`, `/percentage-calculators/percentage-of-a-number-calculator/`, `/percentage-calculators/reverse-percentage-calculator/`, `/percentage-calculators/percentage-finder-calculator/` |
| Homepage search verification keyword(s) | Covered by `npm run test:cluster:contracts`, which includes `npm run test:homepage:search:contracts` |
| SEO/schema evidence | Static metadata and related-link copy updated in `scripts/generate-mpa-pages.js`; runtime metadata aligned in `public/calculators/time-and-date/*/module.js` and `public/calculators/percentage-calculators/*/module.js`; time-and-date explanation depth expanded in `public/calculators/time-and-date/*/explanation.html`; approved release-spec updates landed in `tests_specs/time-and-date/*_release/seo.calc.spec.js`, `tests_specs/sleep-and-nap/*_release/seo.calc.spec.js`, and `tests_specs/percentage/*_release/seo.calc.spec.js`; regenerated outputs verified under `public/time-and-date/**/index.html` and `public/percentage-calculators/**/index.html` |
| CWV artifact (`scoped-cwv` or global) | Current cluster-scoped CWV harness does not persist JSON artifacts under `test-results/`; evidence is the passing Playwright CWV specs in `tests_specs/time-and-date/cluster_release/cwv.cluster.spec.js` and `tests_specs/percentage/cluster_release/cwv.cluster.spec.js` plus command output |
| Thin-content artifact (if `calc_exp` / `exp_only`) | Current cluster-scoped content-quality harness reported summary lines in command output but did not persist accessible artifacts in this workspace. Final summaries: `time-and-date evaluated=12, pass=0, warn=12, fail=0`; `percentage evaluated=9, pass=9, warn=0, fail=0`. |
| Important Notes contract proof (if applicable) | Time-and-date explanatory support was expanded in `public/calculators/time-and-date/birthday-day-of-week/explanation.html`, `public/calculators/time-and-date/countdown-timer-generator/explanation.html`, `public/calculators/time-and-date/days-until-a-date-calculator/explanation.html`, `public/calculators/time-and-date/energy-based-nap-selector/explanation.html`, `public/calculators/time-and-date/nap-time-calculator/explanation.html`, `public/calculators/time-and-date/overtime-hours-calculator/explanation.html`, `public/calculators/time-and-date/power-nap-calculator/explanation.html`, `public/calculators/time-and-date/sleep-time-calculator/explanation.html`, `public/calculators/time-and-date/time-between-two-dates-calculator/explanation.html`, `public/calculators/time-and-date/wake-up-time-calculator/explanation.html`, and `public/calculators/time-and-date/work-hours-calculator/explanation.html` |
| Pane layout proof (for `calc_exp`) | Generated outputs remain single-pane `calc_exp` pages. Representative proof: `public/time-and-date/sleep-time-calculator/index.html` contains `data-route-archetype=\"calc_exp\"` and `calculator-page-single` with `panel-span-all`; `public/percentage-calculators/percentage-of-a-number-calculator/index.html` contains `data-route-archetype=\"calc_exp\"` and `calculator-page-single` with `panel-span-all`. |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | `time-and-date` still scores `warn` on all 12 Wave 4 routes in the thin-content harness even after the explanation expansions; there are no hard failures, but the cluster still needs deeper content work. | Low | Carry the remaining depth pass into Wave 6 final consolidation, with time-and-date prioritized ahead of already-clean percentage routes. |
| EX-002 | `jsdom` still emits repeated `Could not parse CSS stylesheet` noise during cluster `seo` and `content-quality` scans because generated routes inline large CSS blocks; all commands still exited successfully. | Low | Keep as a documented harness limitation unless it starts masking real parse failures; address in a later harness-maintenance pass if needed. |
| EX-003 | `/time-and-date/` and `/percentage-calculators/` are not currently governed as active public hub routes in this repo, so Wave 4 could only improve route-level pages and not cluster hub landing pages. | Medium | Treat hub-page SEO for these categories as deferred until those routes become governed public pages under the repo’s route contracts. |
| EX-004 | Cluster-scoped CWV and content-quality commands do not persist machine-readable artifacts in this workspace, so release evidence relies on passing spec paths and command-output summaries instead of stored JSON files. | Medium | Add artifact persistence to the cluster harness if later releases need durable machine-readable evidence beyond command output. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-30` |

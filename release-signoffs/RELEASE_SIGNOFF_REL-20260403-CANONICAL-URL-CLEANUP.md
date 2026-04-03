# Release Sign-off: Canonical URL cleanup for sample size, countdown timer, and percentage composition

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260403-CANONICAL-URL-CLEANUP |
| Release Type | CLUSTER_ROUTE |
| Scope (Global/Cluster/Calc/Route) | Route (3 canonical winners) |
| Cluster ID | math \| percentage \| time-and-date |
| Calculator ID (CALC) | sample-size \| percentage-composition \| countdown-timer |
| Primary Route | /math/sample-size/ \| /percentage-calculators/percentage-composition-calculator/ \| /time-and-date/countdown-timer/ |
| Owner | GitHub Copilot |
| Date | 2026-04-03 |
| Commit SHA | 61851a68da1253f6319eca9111e830369d3c5d81 |
| Environment | Local workspace (Linux) |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | terminal run 2026-04-03 before rebuild |
| Unit | `CLUSTER=math CALC=sample-size npm run test:calc:release` | Pass | `tests_specs/math/sample-size_release/unit.calc.test.js` |
| E2E | `CLUSTER=math CALC=sample-size npm run test:calc:release` | Pass | `test-results/playwright/calc/math/sample-size/2026-04-03T13-38-41-545Z/playwright-all.summary.json` |
| SEO | `CLUSTER=math CALC=sample-size npm run test:calc:release` | Pass | `test-results/playwright/calc/math/sample-size/2026-04-03T13-38-41-545Z/playwright-all.summary.json` |
| CWV | `CLUSTER=math CALC=sample-size npm run test:calc:release` | Pass | `test-results/performance/scoped-cwv/math/sample-size.json` |
| Unit | `CLUSTER=percentage CALC=percentage-composition npm run test:calc:release` | Pass | `tests_specs/percentage/percentage-composition_release/unit.calc.test.js` |
| E2E | `CLUSTER=percentage CALC=percentage-composition npm run test:calc:release` | Pass | `test-results/playwright/calc/percentage/percentage-composition/2026-04-03T13-39-03-941Z/playwright-all.summary.json` |
| SEO | `CLUSTER=percentage CALC=percentage-composition npm run test:calc:release` | Pass | `test-results/playwright/calc/percentage/percentage-composition/2026-04-03T13-39-03-941Z/playwright-all.summary.json` |
| CWV | `CLUSTER=percentage CALC=percentage-composition npm run test:calc:release` | Pass | `test-results/performance/scoped-cwv/percentage/percentage-composition.json` |
| Unit | `CLUSTER=time-and-date CALC=countdown-timer npm run test:calc:release` | Pass | `tests_specs/time-and-date/countdown-timer_release/unit.calc.test.js` |
| E2E | `CLUSTER=time-and-date CALC=countdown-timer npm run test:calc:release` | Pass | `test-results/playwright/calc/time-and-date/countdown-timer/2026-04-03T13-39-50-825Z/playwright-all.summary.json` |
| SEO | `CLUSTER=time-and-date CALC=countdown-timer npm run test:calc:release` | Pass | `test-results/playwright/calc/time-and-date/countdown-timer/2026-04-03T13-39-50-825Z/playwright-all.summary.json` |
| CWV | `CLUSTER=time-and-date CALC=countdown-timer npm run test:calc:release` | Pass | `test-results/performance/scoped-cwv/time-and-date/countdown-timer.json` |
| Homepage Search | `npm run test:homepage:search:contracts` | Pass | included in each `test:calc:release` run |
| Cluster Contracts | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:cluster:contracts` | Pass | terminal scoped gate run 2026-04-03 |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | terminal scoped gate run 2026-04-03 |
| ISS-001 | `npm run test:iss001` | Skipped | not required for this scoped canonical cleanup |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | winners: `/math/sample-size/`, `/percentage-calculators/percentage-composition-calculator/`, `/time-and-date/countdown-timer/`; redirects and noindex protections recorded in `public/_redirects` and `public/_headers` |
| Homepage search verification keyword(s) | `sample size`, `percentage composition`, `countdown timer` via `npm run test:homepage:search:contracts` |
| SEO evidence | `test-results/playwright/calc/math/sample-size/2026-04-03T13-38-41-545Z/playwright-all.summary.json`; `test-results/playwright/calc/percentage/percentage-composition/2026-04-03T13-39-03-941Z/playwright-all.summary.json`; `test-results/playwright/calc/time-and-date/countdown-timer/2026-04-03T13-39-50-825Z/playwright-all.summary.json` |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/scoped-cwv/math/sample-size.json`; `test-results/performance/scoped-cwv/percentage/percentage-composition.json`; `test-results/performance/scoped-cwv/time-and-date/countdown-timer.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | explanation-bearing calc_exp routes validated through scoped SEO/E2E suites for the three winners |
| Important Notes contract proof (if applicable) | present on `/math/sample-size/` and `/time-and-date/countdown-timer/` in generated HTML |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` declares `paneLayout: "single"` for `sample-size`, `percentage-composition`, and `countdown-timer`; generated HTML contains `panel-span-all` and `calculator-page-single` for all three winners |

Notes:

- Legacy public aliases intentionally remain only as redirect targets and noindex header rules for cleanup continuity.
- `/calculators/*` fragment entrypoints for the three affected families are redirected or noindexed and are not canonical winners.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| 1 | Repository contains unrelated pre-existing working tree changes outside this release scope. | Low | Left untouched; this sign-off covers only the canonical cleanup files and scoped test evidence above. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | GitHub Copilot | 2026-04-03 |

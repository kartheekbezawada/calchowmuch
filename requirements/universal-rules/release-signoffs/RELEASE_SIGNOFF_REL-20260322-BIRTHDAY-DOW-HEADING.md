# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260322-BIRTHDAY-DOW-HEADING |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc |
| Cluster ID | time-and-date |
| Calculator ID (CALC) | birthday-day-of-week |
| Primary Route | /time-and-date/birthday-day-of-week/ |
| Owner | GitHub Copilot |
| Date | 2026-03-22 |
| Commit SHA | 997c94cf9170e6a395e9072b6186ec796ad9626b |
| Environment | Local |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | terminal output |
| Unit | `export CLUSTER=time-and-date CALC=birthday-day-of-week && npm run test:calc:unit` | Pass | terminal output |
| E2E | `export CLUSTER=time-and-date CALC=birthday-day-of-week && npm run test:calc:playwright` | Fail | test-results/playwright/calc/time-and-date/birthday-day-of-week/2026-03-22T16-55-00-087Z/playwright-all.summary.json |
| SEO | `export CLUSTER=time-and-date CALC=birthday-day-of-week && npm run test:calc:playwright` | Fail | test-results/playwright/calc/time-and-date/birthday-day-of-week/2026-03-22T16-55-00-087Z/playwright-all.summary.json |
| CWV | `export CLUSTER=time-and-date CALC=birthday-day-of-week && npm run test:calc:playwright` | Pass | test-results/playwright/calc/time-and-date/birthday-day-of-week/2026-03-22T16-55-00-087Z/playwright-all.summary.json |
| ISS-001 | `npm run test:iss001` | Skipped | not required for this scoped calculator release |
| Schema Dedupe | `export CLUSTER=time-and-date CALC=birthday-day-of-week && npm run test:schema:dedupe -- --scope=calc` | Pass | schema_duplicates_report.md; schema_duplicates_report.csv |

Additional required governance gates:

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Isolation Scope | `npm run test:isolation:scope` | Pass | terminal output |
| Cluster Contracts | `npm run test:cluster:contracts` | Pass | terminal output |
| CSS Import Guard | `npm run lint:css-import` | Pass | terminal output |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | requirements/universal-rules/RELEASE_CHECKLIST.md |
| Scoped route proof (target route + scope lock) | public/calculators/time-and-date/birthday-day-of-week/index.html updated to remove the hero `h2`; public/time-and-date/birthday-day-of-week/index.html regenerated with `<section class="birthday-dow-hero" aria-label="Birthday planner">` |
| SEO/schema evidence | schema_duplicates_report.md; schema_duplicates_report.csv; scoped Playwright summary at test-results/playwright/calc/time-and-date/birthday-day-of-week/2026-03-22T16-55-00-087Z/playwright-all.summary.json |
| CWV artifact (`scoped-cwv` or global) | scoped Playwright summary at test-results/playwright/calc/time-and-date/birthday-day-of-week/2026-03-22T16-55-00-087Z/playwright-all.summary.json; cwv.calc.spec.js passed |
| Thin-content artifact (if `calc_exp` / `exp_only`) | not required for this change |
| Important Notes contract proof (if applicable) | public/calculators/time-and-date/birthday-day-of-week/explanation.html contains the `Important Notes` section |
| Pane layout proof (for `calc_exp`) | public/config/navigation.json -> `id: "birthday-day-of-week"`, `paneLayout: "single"`; public/time-and-date/birthday-day-of-week/index.html -> `panel-span-all` and `calculator-page-single` |

Notes:
- Requested change implemented: the visible `Birthday planner` hero heading was removed.
- Accessibility contract preserved by replacing the removed `aria-labelledby` reference with `aria-label="Birthday planner"` on the hero section.
- Scoped Playwright failures are not caused by this heading removal. The generated route currently places `td-cluster-route-switch` and `td-cluster-related` sections inside `#birthday-dow-explanation`, so selectors expecting one `h2` inside that explanation region resolve three headings.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| REL-20260322-BDAY-DOW-01 | Scoped Playwright `E2E` and `SEO` gates fail because `#birthday-dow-explanation` contains extra assembled sections with additional `h2` headings. | Medium | Fix shared route assembly or explanation wrapper boundaries in a separately approved scope, then rerun `test:calc:playwright`. |

---

## 5) Final Decision

Decision: [ ] APPROVED  [x] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | GitHub Copilot | 2026-03-22 |
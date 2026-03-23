# RELEASE_SIGNOFF_REL-20260323-PERCENTAGE-CLUSTER-SHELL-REDESIGN

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260323-PERCENTAGE-CLUSTER-SHELL-REDESIGN |
| Release Type | CLUSTER_ROUTE |
| Scope (Global/Cluster/Calc/Route) | Cluster |
| Cluster ID | percentage |
| Calculator ID (CALC) | n/a - 9 general percentage calculators |
| Primary Route | /percentage-calculators/ |
| Owner | GitHub Copilot |
| Date | 2026-03-23 |
| Commit SHA | fedbf3b |
| Environment | Local Linux workspace |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Terminal pass |
| Unit | `CLUSTER=percentage npm run test:cluster:unit` | Pass | `tests_specs/percentage/cluster_release/unit.cluster.test.js`; `tests_specs/percentage/cluster_release/contracts.cluster.test.js` |
| E2E | `CLUSTER=percentage npm run test:cluster:e2e` | Pass | Terminal pass (`1 passed`) |
| SEO | `CLUSTER=percentage npm run test:cluster:seo` | Pass | Terminal pass (`seo.cluster.spec.js` representative route pass); `seo_mojibake_report.md`; `seo_mojibake_report.csv` |
| CWV | `CLUSTER=percentage npm run test:cluster:cwv` | Pass | Terminal pass (`cwv.cluster.spec.js` pass); `playwright-report/index.html` |
| ISS-001 | Not required for this scoped cluster release per release-scope matrix | Skipped | N/A |
| Schema Dedupe | `CLUSTER=percentage npm run test:schema:dedupe -- --scope=cluster` | Pass | `schema_duplicates_report.md`; `schema_duplicates_report.csv` |

Additional scoped governance checks:

- `npm run lint:css-import` - Pass
- `npm run test:percentage:nav-guard` - Pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` - Pass (strict single-calculator artifact check skipped because this is an approved shared generator + multi-route cluster rollout)
- `npm run test:cluster:contracts` - Pass

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Migrated shell applied to `/percentage-calculators/percent-change-calculator/`, `/percentage-calculators/percentage-difference-calculator/`, `/percentage-calculators/percentage-increase-calculator/`, `/percentage-calculators/percentage-decrease-calculator/`, `/percentage-calculators/percentage-composition-calculator/`, `/percentage-calculators/reverse-percentage-calculator/`, `/percentage-calculators/percent-to-fraction-decimal-calculator/`, `/percentage-calculators/percentage-finder-calculator/`, and `/percentage-calculators/percentage-of-a-number-calculator/` |
| Homepage search verification keyword(s) | Homepage search contract passed via `npm run test:cluster:contracts`; representative keyword coverage includes `percentage` in the governed homepage search suite |
| SEO/schema evidence | `schema_duplicates_report.md`; `schema_duplicates_report.csv`; `seo_mojibake_report.md`; `seo_mojibake_report.csv`; cluster SEO terminal output recorded `Thin-content summary: evaluated=13, pass=6, warn=7, fail=0, notApplicable=0` with zero mojibake findings |
| CWV artifact (`scoped-cwv` or global) | Cluster CWV Playwright guard passed in terminal; retained report available via `playwright-report/index.html` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | Cluster SEO terminal output recorded `evaluated=13, pass=6, warn=7, fail=0, notApplicable=0`; no blocking thin-content failures |
| Important Notes contract proof (if applicable) | Generated pages such as `public/percentage-calculators/percentage-decrease-calculator/index.html`, `public/percentage-calculators/percentage-increase-calculator/index.html`, and `public/percentage-calculators/percentage-of-a-number-calculator/index.html` contain `How to Guide`, `Important Notes`, freshness/privacy notes, and answer-first explanation structure |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` declares the 9 general percentage calculators as `routeArchetype: calc_exp` and `paneLayout: single`; generated routes render `calculator-page-single pct-cluster-flow` in the public percentage HTML |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | Optional exploratory run of `npm run test:iss001` failed because the current ISS-001 suite still snapshots the legacy three-column percentage shell (`left-nav`, `ads-column`, fixed page-height assumptions). | Medium | Non-blocking for this scoped cluster release because `requirements/universal-rules/RELEASE_CHECKLIST.md` reserves global `test:iss001` for full-site releases. Update ISS-001 when the new percentage shell becomes the intended global contract. |
| EX-002 | Isolation scope strict single-calculator artifact enforcement was skipped after explicit shared-contract opt-in because this release legitimately changes `scripts/generate-mpa-pages.js` and multiple approved percentage routes. | Low | Keep cluster sign-off as the authoritative scope record for this rollout. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | GitHub Copilot | 2026-03-23 |
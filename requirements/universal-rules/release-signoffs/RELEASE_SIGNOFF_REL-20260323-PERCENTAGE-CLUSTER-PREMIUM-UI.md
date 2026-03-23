# RELEASE_SIGNOFF_REL-20260323-PERCENTAGE-CLUSTER-PREMIUM-UI

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260323-PERCENTAGE-CLUSTER-PREMIUM-UI |
| Release Type | CLUSTER_ROUTE |
| Scope (Global/Cluster/Calc/Route) | Cluster |
| Cluster ID | percentage |
| Calculator ID (CALC) | n/a - 13 percentage calculators |
| Primary Route | /percentage-calculators/ |
| Owner | GitHub Copilot |
| Date | 2026-03-23 |
| Commit SHA | d78ec51 |
| Environment | Local Linux workspace |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Session terminal pass |
| Unit | `CLUSTER=percentage npm run test:cluster:unit` | Pass | `tests_specs/percentage/cluster_release/unit.cluster.test.js`; `tests_specs/percentage/cluster_release/contracts.cluster.test.js` |
| E2E | `CLUSTER=percentage npm run test:cluster:e2e` | Pass | `tests_specs/percentage/cluster_release/e2e.cluster.spec.js`; session terminal pass (`1 passed`) |
| SEO | `CLUSTER=percentage npm run test:cluster:seo` | Pass | `tests_specs/percentage/cluster_release/seo.cluster.spec.js`; `seo_mojibake_report.md`; `seo_mojibake_report.csv`; `test-results/content-quality/cluster/percentage/2026-03-23T16-07-30-181Z.json` |
| CWV | `CLUSTER=percentage npm run test:cluster:cwv` | Pass | `tests_specs/percentage/cluster_release/cwv.cluster.spec.js`; `playwright-report/index.html`; session terminal pass (`1 passed`) |
| ISS-001 | Not required for this scoped cluster release per release-scope matrix | Skipped | N/A |
| Schema Dedupe | `CLUSTER=percentage npm run test:schema:dedupe -- --scope=cluster` | Pass | `schema_duplicates_report.md`; `schema_duplicates_report.csv` |

Additional scoped governance checks:

- `npm run lint:css-import` - Pass
- `npm run test:cluster:contracts` - Pass
- `npm run test:percentage:nav-guard` - Pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` - Pass (strict single-calculator artifact enforcement skipped because this is an approved shared multi-route cluster rollout)

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Scope recorded in `docs/internal/percentage-cluster-premium-ui-master-plan.md` and completed in `docs/internal/percentage-cluster-premium-ui-job-log.md`; generated routes updated for `/percentage-calculators/percent-change-calculator/`, `/percentage-calculators/percentage-difference-calculator/`, `/percentage-calculators/percentage-increase-calculator/`, `/percentage-calculators/percentage-decrease-calculator/`, `/percentage-calculators/percentage-composition-calculator/`, `/percentage-calculators/reverse-percentage-calculator/`, `/percentage-calculators/percent-to-fraction-decimal-calculator/`, `/percentage-calculators/percentage-finder-calculator/`, `/percentage-calculators/percentage-of-a-number-calculator/`, `/percentage-calculators/commission-calculator/`, `/percentage-calculators/discount-calculator/`, `/percentage-calculators/margin-calculator/`, and `/percentage-calculators/markup-calculator/` |
| Homepage search verification keyword(s) | Homepage search discoverability passed via `npm run test:cluster:contracts`; percentage cluster remains discoverable under governed homepage-search coverage |
| SEO/schema evidence | `schema_duplicates_report.md`; `schema_duplicates_report.csv`; `seo_mojibake_report.md`; `seo_mojibake_report.csv`; `test-results/content-quality/cluster/percentage/2026-03-23T16-07-30-181Z.json` |
| CWV artifact (`scoped-cwv` or global) | Cluster CWV Playwright guard passed; retained report available at `playwright-report/index.html` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | Cluster SEO terminal output recorded `Thin-content summary: evaluated=13, pass=0, warn=13, fail=0, notApplicable=0`; no blocking thin-content failures |
| Important Notes contract proof (if applicable) | Generated pages `public/percentage-calculators/commission-calculator/index.html`, `public/percentage-calculators/discount-calculator/index.html`, `public/percentage-calculators/margin-calculator/index.html`, and `public/percentage-calculators/markup-calculator/index.html` include `Important Notes` sections inside the explanation flow; shared migrated routes also retain answer-first explainer structure |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` retains `routeArchetype: calc_exp` and `paneLayout: single` for the percentage routes in this cluster; generated pages render `calculator-page-single pct-cluster-flow` for commission, discount, margin, and markup |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | Thin-content audit returned warnings for all 13 percentage routes (`evaluated=13, pass=0, warn=13, fail=0, notApplicable=0`) even though the scoped SEO gate passed with zero blocking failures. | Medium | Treat as content-quality follow-up, not a release blocker for this visual-only cluster redesign. |
| EX-002 | Optional ISS-001 still targets legacy percentage-shell layout assumptions and was not part of the required scoped-cluster gate set. | Low | Rebaseline ISS-001 when the new percentage shell becomes the expected global layout contract. |
| EX-003 | Isolation scope strict single-calculator artifact enforcement was skipped under the approved shared-contract flag because this rollout intentionally touched the shared shell and generator. | Low | This signoff is the authoritative scope record for the shared multi-route rollout. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | GitHub Copilot | 2026-03-23 |
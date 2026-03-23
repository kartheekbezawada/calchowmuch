# RELEASE_SIGNOFF_REL-20260323-PRICING-CLUSTER-SPLIT

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260323-PRICING-CLUSTER-SPLIT |
| Release Type | CLUSTER_ROUTE |
| Scope (Global/Cluster/Calc/Route) | Cluster |
| Cluster ID | pricing |
| Calculator ID (CALC) | n/a - commission-calculator, discount-calculator, margin-calculator, markup-calculator |
| Primary Route | /pricing-calculators/ |
| Owner | GitHub Copilot |
| Date | 2026-03-23 |
| Commit SHA | a2cbb9c |
| Environment | Local Linux workspace |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Terminal pass |
| Unit | `CLUSTER=pricing npm run test:cluster:unit` | Pass | `tests_specs/pricing/cluster_release/unit.cluster.test.js`; `tests_specs/pricing/cluster_release/contracts.cluster.test.js` |
| E2E | `CLUSTER=pricing npm run test:cluster:e2e` | Pass | Terminal pass; `tests_specs/pricing/cluster_release/e2e.cluster.spec.js` |
| SEO | `CLUSTER=pricing npm run test:cluster:seo` | Pass | Terminal pass; `tests_specs/pricing/cluster_release/seo.cluster.spec.js`; `seo_mojibake_report.md`; `seo_mojibake_report.csv` |
| CWV | `CLUSTER=pricing npm run test:cluster:cwv` | Pass | Terminal pass (`1 passed`); `tests_specs/pricing/cluster_release/cwv.cluster.spec.js`; `playwright-report/index.html` |
| ISS-001 | Not required for this scoped cluster release per release-scope matrix | Skipped | N/A |
| Schema Dedupe | `CLUSTER=pricing npm run test:schema:dedupe -- --scope=cluster` | Pass | `schema_duplicates_report.md`; `schema_duplicates_report.csv` |

Additional scoped governance checks:

- `npm run build` - Pass
- `npm run test:percentage:nav-guard` - Pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` - Pass (strict single-calculator artifact check skipped because this is an approved shared-contract cluster split)
- `CLUSTER=pricing npm run test:cluster:contracts` - Pass

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Added `/pricing-calculators/`, `/pricing-calculators/commission-calculator/`, `/pricing-calculators/discount-calculator/`, `/pricing-calculators/margin-calculator/`, and `/pricing-calculators/markup-calculator/`; removed generated output for the four legacy `/percentage-calculators/...` pricing routes |
| Homepage search verification keyword(s) | Homepage search contract passed via `npm run test:cluster:contracts`; pricing keywords are governed through `public/config/navigation.json`, `config/clusters/route-ownership.json`, and `clusters/pricing/config/navigation.json` |
| SEO/schema evidence | `schema_duplicates_report.md`; `schema_duplicates_report.csv`; `seo_mojibake_report.md`; `seo_mojibake_report.csv`; cluster SEO run reported `Thin-content summary: evaluated=4, pass=1, warn=3, fail=0, notApplicable=0` with zero mojibake findings |
| CWV artifact (`scoped-cwv` or global) | Cluster CWV Playwright guard passed; retained report available at `playwright-report/index.html` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/cluster/pricing/2026-03-23T18-01-47-305Z.json` |
| Important Notes contract proof (if applicable) | Reused pricing calculator explanation fragments preserve the existing answer-first explanation contract and Important Notes sections on the generated pricing routes |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` declares all four pricing routes as `routeArchetype: calc_exp` and `paneLayout: single`; generated routes under `public/pricing-calculators/*/index.html` render the combined single-pane shell |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | Thin-content scoring reported warnings on 3 of 4 pricing routes, but no blocking failures. | Medium | Keep current content as-is for the route split release; address cluster-specific content enrichment in a follow-up content pass if needed. |
| EX-002 | The retired percentage pricing route folders remain as empty directories in `public/percentage-calculators/` because the environment blocks directory deletion commands. Their `index.html` files were deleted, so the legacy URLs no longer resolve. | Low | Remove the empty directories in a later housekeeping pass if desired. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | GitHub Copilot | 2026-03-23 |
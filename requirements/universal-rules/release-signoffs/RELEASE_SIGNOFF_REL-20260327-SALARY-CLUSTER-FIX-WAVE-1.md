# Release Sign-Off

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260327-SALARY-CLUSTER-FIX-WAVE-1` |
| Release Type | `CLUSTER_ROUTE` |
| Scope (Global/Cluster/Calc/Route) | `Cluster` |
| Cluster ID | `salary` |
| Calculator ID (CALC) | `N/A` |
| Primary Route | `/salary-calculators/` |
| Owner | `Codex` |
| Date | `2026-03-27` |
| Commit SHA | `Pending human merge` |
| Environment | `Local workspace` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | terminal run |
| Unit | `CLUSTER=salary npm run test:cluster:unit` | Pass | `tests_specs/salary/cluster_release/unit.cluster.test.js`, `tests_specs/salary/cluster_release/contracts.cluster.test.js` |
| E2E | `CLUSTER=salary npm run test:cluster:e2e` | Pass | `tests_specs/salary/cluster_release/e2e.cluster.spec.js` |
| SEO | `CLUSTER=salary npm run test:cluster:seo` | Pass | `tests_specs/salary/cluster_release/seo.cluster.spec.js`, `tests_specs/salary/shared/factories.js` |
| CWV | `CLUSTER=salary npm run test:cluster:cwv` | Pass | `tests_specs/salary/cluster_release/cwv.cluster.spec.js` |
| ISS-001 | `npm run test:iss001` | Skipped | Not required for this salary cluster fix wave per release scope |
| Schema Dedupe | `CLUSTER=salary npm run test:schema:dedupe -- --scope=cluster` | Pass | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |
| Cluster Contracts | `CLUSTER=salary npm run test:cluster:contracts` | Pass | terminal run |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | terminal run |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/salary-calculators-cluster-redesign/RELEASE_PLAN.md` |
| Scoped route proof (target route + scope lock) | `requirements/universal-rules/salary-calculators-cluster-redesign/ACTION_PAGE.md` |
| Homepage search verification keyword(s) | Verified by `CLUSTER=salary npm run test:cluster:contracts` |
| SEO/schema evidence | `public/salary-calculators/salary-calculator/index.html`, `public/salary-calculators/bonus-calculator/index.html`, `tests_specs/salary/shared/factories.js`, `schema_duplicates_report.md` |
| CWV artifact (`scoped-cwv` or global) | Cluster CWV Playwright gate passed via `tests_specs/salary/cluster_release/cwv.cluster.spec.js` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | Route explanation expansions in `public/calculators/salary-calculators/*/explanation.html` |
| Important Notes contract proof (if applicable) | Gross-pay disclaimers and methodology blocks added across `public/calculators/salary-calculators/*/index.html` |
| Pane layout proof (for `calc_exp`) | Salary routes remain single-pane in generated outputs under `public/salary-calculators/**` |

Notes:

- Raw-source SEO parity is now enforced in salary SEO tests through `tests_specs/salary/shared/factories.js`.
- Cluster fix wave checklist is logged in `requirements/universal-rules/salary-calculators-cluster-redesign/UX_SEO_IMPROVEMENT_CHECKLIST.md`.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| SALARY-FIX-001 | `TARGET_CALC_ID=commission-calculator` resolves 2 routes because the calc ID is duplicated outside the salary cluster. No out-of-scope diff remained in this release. | Low | Prefer `TARGET_ROUTE=/salary-calculators/commission-calculator/` for future salary-only regeneration. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-27 |

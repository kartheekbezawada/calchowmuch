# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260406-SALARY-CLUSTER-DEFAULTS-NO-SYMBOLS` |
| Release Type | `CLUSTER_SHARED` |
| Scope (Global/Cluster/Calc/Route) | `Cluster` |
| Cluster ID | `salary` |
| Calculator ID (CALC) | `MULTI` |
| Primary Route | `/salary-calculators/` |
| Owner | `Codex` |
| Date | `2026-04-06` |
| Commit SHA | `9cbefbf5a339d97315cab06c32b3b3c482c348e3` |
| Environment | `Local` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | local CLI output |
| Unit | `CLUSTER=salary npm run test:cluster:unit` | Pass | local CLI output |
| E2E | `CLUSTER=salary npm run test:cluster:e2e` | Pass | `playwright-report/index.html` |
| SEO | `CLUSTER=salary npm run test:cluster:seo` | Pass | `playwright-report/index.html` |
| CWV | `CLUSTER=salary npm run test:cluster:cwv` | Pass | `playwright-report/index.html` |
| ISS-001 | `npm run test:iss001` | Skipped | scoped cluster release; not required by approved gate matrix |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Salary cluster only: `/salary-calculators/{annual-to-monthly-salary-calculator,bonus-calculator,commission-calculator,hourly-to-salary-calculator,inflation-adjusted-salary-calculator,monthly-to-annual-salary-calculator,overtime-pay-calculator,raise-calculator,salary-calculator,salary-to-hourly-calculator,weekly-pay-calculator}/` |
| Homepage search verification keyword(s) | `CLUSTER=salary npm run test:cluster:contracts` passed, including homepage search discoverability validation |
| SEO evidence | `CLUSTER=salary npm run test:cluster:seo` passed; thin-content summary reported `evaluated=11, pass=11, warn=0, fail=0, notApplicable=1` in gate output |
| CWV artifact (`scoped-cwv` or global) | `CLUSTER=salary npm run test:cluster:cwv` passed for the salary cluster in gate output |
| Thin-content artifact (if `calc_exp` / `exp_only`) | cluster SEO gate output only; no durable artifact file persisted locally in this workspace |
| Important Notes contract proof (if applicable) | unchanged by this release |
| Pane layout proof (for `calc_exp`) | Generated routes remain single-pane: [salary-calculator](/home/kartheek/calchowmuch/public/salary-calculators/salary-calculator/index.html#L1649), [hourly-to-salary-calculator](/home/kartheek/calchowmuch/public/salary-calculators/hourly-to-salary-calculator/index.html#L1649), [salary-to-hourly-calculator](/home/kartheek/calchowmuch/public/salary-calculators/salary-to-hourly-calculator/index.html#L1649), [weekly-pay-calculator](/home/kartheek/calchowmuch/public/salary-calculators/weekly-pay-calculator/index.html#L1649), [annual-to-monthly-salary-calculator](/home/kartheek/calchowmuch/public/salary-calculators/annual-to-monthly-salary-calculator/index.html#L1649), [monthly-to-annual-salary-calculator](/home/kartheek/calchowmuch/public/salary-calculators/monthly-to-annual-salary-calculator/index.html#L1649), [overtime-pay-calculator](/home/kartheek/calchowmuch/public/salary-calculators/overtime-pay-calculator/index.html#L1649), [raise-calculator](/home/kartheek/calchowmuch/public/salary-calculators/raise-calculator/index.html#L1649), [bonus-calculator](/home/kartheek/calchowmuch/public/salary-calculators/bonus-calculator/index.html#L1649), [commission-calculator](/home/kartheek/calchowmuch/public/salary-calculators/commission-calculator/index.html#L1649), [inflation-adjusted-salary-calculator](/home/kartheek/calchowmuch/public/salary-calculators/inflation-adjusted-salary-calculator/index.html#L1752) |

Notes:

- This release standardizes salary-calculator UI defaults and removes currency symbols from calculator UI values by changing shared salary formatting and route source HTML only.
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` passed with the expected multi-calculator skip note for expanded salary-cluster scope.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| 1 | Long-form explanation examples may still contain currency symbols because this release intentionally targeted calculator UI values and default states only. | Low | Remove `$` from explanation copy in a separate approved content sweep if desired. |
| 2 | SEO gate emits known `jsdom` CSS parse warnings in CLI output, but the gate completed successfully. | Low | Treat as existing tooling noise unless it becomes a failing gate. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-04-06 |

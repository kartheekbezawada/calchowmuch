# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260319-HOME-LOAN-ENHANCEMENT` |
| Release Type | `CLUSTER_REFINEMENT` |
| Scope (Global/Cluster/Calc/Route) | `Cluster` |
| Cluster ID | `loans` |
| Calculator ID (CALC) | `N/A` |
| Primary Route | `/loan-calculators/how-much-can-i-borrow/` |
| Owner | `Codex` |
| Date | `2026-03-19` |
| Commit SHA | `61dce2c1f14226320c1adb44f48467fb183eb54c` |
| Environment | `Local` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Enhancement route logs and final verification in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md) |
| Unit | Scoped equivalents: `CLUSTER=loans CALC=<calculator> npm run test:calc:unit` | Pass | Route-by-route results in [ACTION_PAGE.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md) and [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md) |
| E2E | Scoped equivalents: `CLUSTER=loans CALC=<calculator> npm run test:calc:e2e` | Pass | Route-by-route results in [ACTION_PAGE.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md) and [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md) |
| SEO | Scoped equivalents: `CLUSTER=loans CALC=<calculator> npm run test:calc:seo` | Pass | Route-by-route results in [ACTION_PAGE.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md) and [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md) |
| CWV | Scoped equivalents: `CLUSTER=loans CALC=<calculator> npm run test:calc:cwv` | Pass | Per-route artifacts listed below and logged in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md) |
| Design QA | Route screenshots for routes 1-3 and `CLUSTER=loans CALC=<calculator> npm run test:calc:playwright` where executed | Pass | Enhancement evidence in [ACTION_PAGE.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md) and grouped summaries in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md) |
| Cluster Contracts | `npm run test:cluster:contracts` | Pass | Final verification entry in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md) |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | Final verification entry in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md) |
| ISS-001 | `npm run test:iss001` | Pass | [iss-design-001.spec.js](/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/iss-design-001.spec.js) |
| Schema Dedupe | Scoped equivalents: `CLUSTER=loans CALC=<calculator> npm run test:schema:dedupe -- --scope=calc` | Pass | [schema_duplicates_report.md](/home/kartheek/calchowmuch/schema_duplicates_report.md) |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | [RELEASE_CHECKLIST.md](/home/kartheek/calchowmuch/requirements/universal-rules/RELEASE_CHECKLIST.md) |
| Scoped route proof (target route + scope lock) | [ACTION_PAGE.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md), [DECISION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/DECISION_LOG.md), [DESIGN_SYSTEM.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/DESIGN_SYSTEM.md), [ROLLOUT_PLAN.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/ROLLOUT_PLAN.md), [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md) |
| SEO/schema evidence | Route SEO suites passed for all 8 routes in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md); final schema run reported `changed=0` in [schema_duplicates_report.md](/home/kartheek/calchowmuch/schema_duplicates_report.md) |
| CWV artifact (`scoped-cwv` or global) | [how-much-can-i-borrow.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/how-much-can-i-borrow.json), [home-loan.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/home-loan.json), [remortgage-switching.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/remortgage-switching.json), [offset-calculator.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/offset-calculator.json), [interest-rate-change-calculator.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/interest-rate-change-calculator.json), [loan-to-value.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/loan-to-value.json), [buy-to-let.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/buy-to-let.json), [personal-loan.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/personal-loan.json) |
| Thin-content artifact (if `calc_exp` / `exp_only`) | Pass: [how-much-can-i-borrow.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/how-much-can-i-borrow.json), [offset-calculator.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/offset-calculator.json), [interest-rate-change-calculator.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/interest-rate-change-calculator.json), [loan-to-value.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/loan-to-value.json). Warn only: [home-loan.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/home-loan.json), [remortgage-switching.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/remortgage-switching.json), [buy-to-let.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/buy-to-let.json), [personal-loan.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/personal-loan.json) |
| Design evidence | Screenshots: [desktop.png](/home/kartheek/calchowmuch/test-results/visual/home-loan-enhancement/how-much-can-i-borrow/desktop.png), [mobile.png](/home/kartheek/calchowmuch/test-results/visual/home-loan-enhancement/how-much-can-i-borrow/mobile.png), [desktop.png](/home/kartheek/calchowmuch/test-results/visual/home-loan-enhancement/home-loan/desktop.png), [mobile.png](/home/kartheek/calchowmuch/test-results/visual/home-loan-enhancement/home-loan/mobile.png), [desktop.png](/home/kartheek/calchowmuch/test-results/visual/home-loan-enhancement/remortgage-switching/desktop.png), [mobile.png](/home/kartheek/calchowmuch/test-results/visual/home-loan-enhancement/remortgage-switching/mobile.png). Grouped Playwright: [offset summary](/home/kartheek/calchowmuch/test-results/playwright/calc/loans/offset-calculator/2026-03-19T18-56-13-376Z/playwright-all.summary.json), [rate-change summary](/home/kartheek/calchowmuch/test-results/playwright/calc/loans/interest-rate-change-calculator/2026-03-19T19-13-17-634Z/playwright-all.summary.json), [ltv summary](/home/kartheek/calchowmuch/test-results/playwright/calc/loans/loan-to-value/2026-03-19T19-29-47-862Z/playwright-all.summary.json), [buy-to-let summary](/home/kartheek/calchowmuch/test-results/playwright/calc/loans/buy-to-let/2026-03-19T19-48-11-591Z/playwright-all.summary.json), [personal-loan summary](/home/kartheek/calchowmuch/test-results/playwright/calc/loans/personal-loan/2026-03-19T20-08-05-100Z/playwright-all.summary.json) |
| Interaction contract proof | Shared helper in [cluster-ux.js](/home/kartheek/calchowmuch/public/calculators/loan-calculators/shared/cluster-ux.js) now owns range-fill sync, precise field commits, and mobile result reveal used across the enhancement pass |
| Pane layout proof (for `calc_exp`) | The enhancement pass preserved single-pane `calc_exp` output already recorded in [RELEASE_SIGNOFF_REL-20260319-HOME-LOAN-REDESIGN.md](/home/kartheek/calchowmuch/requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-20260319-HOME-LOAN-REDESIGN.md) and did not change route URLs, archetypes, or pane layout contracts |

Notes:

- Final cluster verification re-ran `npm run lint`, `npm run test:cluster:contracts`, `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope`, and `npm run test:iss001` after the last route closed.
- The enhancement pass kept all work inside the existing Home Loan redesign surface and avoided shared/core asset edits outside the approved Home Loan helper.
- Route interaction changes are now consistent across the cluster: precise entry for primary slider values, no post-load auto-recompute, and explicit mobile answer reveal after Calculate.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | Thin-content scoring returned `warn`, not `fail`, for `home-loan`, `remortgage-switching`, `buy-to-let`, and `personal-loan`. | Low | Included all four artifacts above; no explanation content was removed in the enhancement pass, so this remains a non-blocking editorial follow-up rather than a release failure. |
| EX-002 | Scoped unit suites are repo-level skips for `remortgage-switching`, `offset-calculator`, `interest-rate-change-calculator`, and `loan-to-value`. | Low | Route E2E, SEO, CWV, schema dedupe, cluster contracts, isolation, and ISS-001 all passed; keep unit coverage follow-up separate from this UI enhancement release. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-19` |

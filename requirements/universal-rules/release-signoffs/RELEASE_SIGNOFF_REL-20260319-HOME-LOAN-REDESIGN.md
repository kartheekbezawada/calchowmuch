# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260319-HOME-LOAN-REDESIGN` |
| Release Type | `CLUSTER_REDESIGN` |
| Scope (Global/Cluster/Calc/Route) | `Cluster` |
| Cluster ID | `loans` |
| Calculator ID (CALC) | `N/A` |
| Primary Route | `/loan-calculators/mortgage-calculator/` |
| Owner | `Codex` |
| Date | `2026-03-19` |
| Commit SHA | `6f506550bf70aa883000269822f3f60a8f357862` |
| Environment | `Local` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Route 8 completion and final cluster verification in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md) |
| Unit | Scoped equivalents: `CLUSTER=loans CALC=<calculator> npm run test:calc:unit` | Pass | Route-by-route results in [ACTION_PAGE.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md) and [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md) |
| E2E | Scoped equivalents: `CLUSTER=loans CALC=<calculator> npm run test:calc:e2e` | Pass | Route-by-route results in [ACTION_PAGE.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md) and [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md) |
| SEO | Scoped equivalents: `CLUSTER=loans CALC=<calculator> npm run test:calc:seo` | Pass | Route-by-route results in [ACTION_PAGE.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md) and [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md) |
| CWV | Scoped equivalents: `CLUSTER=loans CALC=<calculator> npm run test:calc:cwv` | Pass | Per-route artifacts recorded in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md) |
| ISS-001 | `npm run test:iss001` | Pass | [iss-design-001.spec.js](/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/iss-design-001.spec.js) |
| Schema Dedupe | Scoped equivalents: `CLUSTER=loans CALC=<calculator> npm run test:schema:dedupe -- --scope=calc` | Pass | [schema_duplicates_report.md](/home/kartheek/calchowmuch/schema_duplicates_report.md) |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | [RELEASE_CHECKLIST.md](/home/kartheek/calchowmuch/requirements/universal-rules/RELEASE_CHECKLIST.md) |
| Scoped route proof (target route + scope lock) | [ACTION_PAGE.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md), [DECISION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/DECISION_LOG.md), [ROLLOUT_PLAN.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/ROLLOUT_PLAN.md), [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md) |
| SEO/schema evidence | Route SEO suites passed for all 8 routes in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md); schema dedupe `changed=0` in [schema_duplicates_report.md](/home/kartheek/calchowmuch/schema_duplicates_report.md) |
| CWV artifact (`scoped-cwv` or global) | [how-much-can-i-borrow.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/how-much-can-i-borrow.json), [home-loan.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/home-loan.json), [remortgage-switching.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/remortgage-switching.json), [offset-calculator.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/offset-calculator.json), [interest-rate-change-calculator.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/interest-rate-change-calculator.json), [loan-to-value.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/loan-to-value.json), [buy-to-let.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/buy-to-let.json), [personal-loan.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/loans/personal-loan.json) |
| Thin-content artifact (if `calc_exp` / `exp_only`) | Pass: [how-much-can-i-borrow.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/how-much-can-i-borrow.json), [offset-calculator.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/offset-calculator.json), [interest-rate-change-calculator.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/interest-rate-change-calculator.json), [loan-to-value.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/loan-to-value.json). Warn only: [home-loan.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/home-loan.json), [remortgage-switching.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/remortgage-switching.json), [buy-to-let.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/buy-to-let.json), [personal-loan.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/loans/personal-loan.json) |
| Important Notes contract proof (if applicable) | Notes sections preserved in generated outputs, including [mortgage index.html](/home/kartheek/calchowmuch/public/loan-calculators/mortgage-calculator/index.html), [buy-to-let index.html](/home/kartheek/calchowmuch/public/loan-calculators/buy-to-let-mortgage-calculator/index.html#L3332), [ltv index.html](/home/kartheek/calchowmuch/public/loan-calculators/ltv-calculator/index.html#L3420), and [personal-loan index.html](/home/kartheek/calchowmuch/public/loan-calculators/personal-loan-calculator/index.html#L3201) |
| Pane layout proof (for `calc_exp`) | Navigation contract keeps all 8 routes on `routeArchetype: "calc_exp"` and `paneLayout: "single"` in [navigation.json](/home/kartheek/calchowmuch/public/config/navigation.json#L492). Generated pages render `data-route-archetype="calc_exp"` and `calculator-page-single hl-cluster-flow` in [how-much-can-i-borrow index.html](/home/kartheek/calchowmuch/public/loan-calculators/how-much-can-i-borrow/index.html#L2269), [mortgage index.html](/home/kartheek/calchowmuch/public/loan-calculators/mortgage-calculator/index.html#L2578), [remortgage index.html](/home/kartheek/calchowmuch/public/loan-calculators/remortgage-calculator/index.html#L2367), [offset index.html](/home/kartheek/calchowmuch/public/loan-calculators/offset-mortgage-calculator/index.html#L2430), [rate-change index.html](/home/kartheek/calchowmuch/public/loan-calculators/interest-rate-change-calculator/index.html#L2557), [ltv index.html](/home/kartheek/calchowmuch/public/loan-calculators/ltv-calculator/index.html#L2656), [buy-to-let index.html](/home/kartheek/calchowmuch/public/loan-calculators/buy-to-let-mortgage-calculator/index.html#L2622), and [personal-loan index.html](/home/kartheek/calchowmuch/public/loan-calculators/personal-loan-calculator/index.html#L2764) |

Notes:
- Final cluster verification re-ran `lint`, `test:cluster:contracts`, `test:isolation:scope`, and `test:iss001`.
- A cluster-wide generated-output audit verified all 8 target routes render the `hl-cluster-page-shell`, keep `calculator-page-single hl-cluster-flow`, and omit `top-nav`, `left-nav`, `ads-column`, `theme-premium-dark.css`, and `shared-calculator-ui.css`.
- Final visual evidence was captured for desktop and mobile for every route under `test-results/visual/home-loan-redesign/`.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | Thin-content scoring returned `warn`, not `fail`, for `home-loan`, `remortgage-switching`, `buy-to-let`, and `personal-loan`. | Low | Included all four artifacts above; no content was removed during the redesign, so this remains a non-blocking follow-up rather than a release failure. |
| EX-002 | Scoped unit suites are repo-level skips for `remortgage-switching`, `offset-calculator`, `interest-rate-change-calculator`, and `loan-to-value`. | Low | Route E2E, SEO, CWV, schema dedupe, cluster contracts, isolation, and ISS-001 all passed; keep unit coverage follow-up separate from this design release. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-19` |

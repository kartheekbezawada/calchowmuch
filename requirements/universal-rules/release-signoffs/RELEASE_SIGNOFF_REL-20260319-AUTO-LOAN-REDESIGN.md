# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260319-AUTO-LOAN-REDESIGN` |
| Release Type | `CLUSTER_REDESIGN` |
| Scope (Global/Cluster/Calc/Route) | `Cluster` |
| Cluster ID | `auto-loans` |
| Calculator ID (CALC) | `N/A` |
| Primary Route | `/car-loan-calculators/car-loan-calculator/` |
| Owner | `Codex` |
| Date | `2026-03-19` |
| Commit SHA | `d1adfbd9e614adee467d7a6558cee0cf36efbf48` |
| Environment | `Local` |
| Release Status | `BLOCKED_BY_OUT_OF_SCOPE_GLOBAL_FAILURES` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Auto Loan scoped route gates | `CLUSTER=auto-loans CALC=<calculator> npm run test:calc:{unit,e2e,seo,cwv}` and `CLUSTER=auto-loans CALC=<calculator> npm run test:schema:dedupe -- --scope=calc` | Pass | [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/EXECUTION_LOG.md) |
| Auto Loan cluster gates | `CLUSTER=auto-loans npm run test:cluster:{unit,e2e,seo,cwv}` plus `npm run test:cluster:contracts`, `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope`, and `CLUSTER=auto-loans npm run test:schema:dedupe -- --scope=cluster` | Pass | [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/EXECUTION_LOG.md) |
| Lint | `npm run lint` | Pass | [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/EXECUTION_LOG.md) |
| Unit | `npm run test` | Pass | [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/EXECUTION_LOG.md) |
| E2E | `npm run test:e2e` | Fail | [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/EXECUTION_LOG.md), [error-context.md](/home/kartheek/calchowmuch/test-results/credit-cards-credit-card-c-0853e-late-donut-and-table-toggle-chromium/error-context.md), [error-context.md](/home/kartheek/calchowmuch/test-results/credit-cards-credit-card-c-360a1-hema-FAQ-parity-and-sitemap-chromium/error-context.md), [error-context.md](/home/kartheek/calchowmuch/test-results/finance-cluster_release-cw-d66a8--satisfy-CLS-LCP-thresholds-chromium/error-context.md), [error-context.md](/home/kartheek/calchowmuch/test-results/finance-effective-annual-r-a28c7-atisfies-CLS-LCP-thresholds-chromium/error-context.md) |
| CWV | `npm run test:cwv:all` | Skipped | Blocked after the out-of-scope global E2E failure; scoped Auto Loan CWV passes are logged in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/EXECUTION_LOG.md) |
| ISS-001 | `npm run test:iss001` | Skipped | Blocked after the out-of-scope global E2E failure |
| Schema Dedupe | `npm run test:schema:dedupe` | Skipped | Blocked after the out-of-scope global E2E failure; scoped Auto Loan schema dedupe passes are logged in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/EXECUTION_LOG.md) |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | [RELEASE_CHECKLIST.md](/home/kartheek/calchowmuch/requirements/universal-rules/RELEASE_CHECKLIST.md) |
| Scoped route proof and scope lock | [ACTION_PAGE.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/ACTION_PAGE.md), [DECISION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/DECISION_LOG.md), [ROLLOUT_PLAN.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/ROLLOUT_PLAN.md), [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/EXECUTION_LOG.md) |
| Dedicated Auto Loan release surface | [test-scope-map.json](/home/kartheek/calchowmuch/config/testing/test-scope-map.json#L244), [README.md](/home/kartheek/calchowmuch/tests_specs/auto-loans/cluster_release/README.md) |
| Route ownership coverage | [route-ownership.json](/home/kartheek/calchowmuch/config/clusters/route-ownership.json#L149) |
| Pane layout proof (for `calc_exp`) | Navigation keeps all 5 target routes on `designFamily: "auto-loans"` and `paneLayout: "single"` in [navigation.json](/home/kartheek/calchowmuch/public/config/navigation.json#L613). Generated outputs render `data-route-archetype="calc_exp"` and `data-design-family="auto-loans"` in [car-loan index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/car-loan-calculator/index.html#L1982), [multiple-car-loan index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/auto-loan-calculator/index.html#L1982), [hire-purchase index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/hire-purchase-calculator/index.html#L1972), [pcp index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/pcp-calculator/index.html#L1994), and [leasing index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/car-lease-calculator/index.html#L1994) |
| Auto Loan shell proof | Generated outputs render the Auto Loan site header in [car-loan index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/car-loan-calculator/index.html#L1984), [multiple-car-loan index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/auto-loan-calculator/index.html#L1984), [hire-purchase index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/hire-purchase-calculator/index.html#L1974), [pcp index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/pcp-calculator/index.html#L1996), and [leasing index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/car-lease-calculator/index.html#L1996) |
| Explanation contract proof | The rebuilt explanation roots render in [car-loan index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/car-loan-calculator/index.html#L2224), [multiple-car-loan index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/auto-loan-calculator/index.html#L2214), [hire-purchase index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/hire-purchase-calculator/index.html#L2195), [pcp index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/pcp-calculator/index.html#L2282), and [leasing index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/car-lease-calculator/index.html#L2256) |
| Scoped Auto Loan CWV and thin-content evidence | Route-by-route pass results and reported scoped artifact paths are recorded in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/EXECUTION_LOG.md) |
| Blocking artifacts for repo-wide gate | [error-context.md](/home/kartheek/calchowmuch/test-results/credit-cards-credit-card-c-0853e-late-donut-and-table-toggle-chromium/error-context.md), [error-context.md](/home/kartheek/calchowmuch/test-results/credit-cards-credit-card-c-360a1-hema-FAQ-parity-and-sitemap-chromium/error-context.md), [error-context.md](/home/kartheek/calchowmuch/test-results/finance-cluster_release-cw-d66a8--satisfy-CLS-LCP-thresholds-chromium/error-context.md), [error-context.md](/home/kartheek/calchowmuch/test-results/finance-effective-annual-r-a28c7-atisfies-CLS-LCP-thresholds-chromium/error-context.md) |

Notes:

- All 5 Auto Loan routes were regenerated and passed their route-level unit, E2E, SEO, CWV, and schema dedupe suites.
- The dedicated `auto-loans` cluster suite also passed unit, E2E, SEO, CWV, contracts, isolation-scope, and cluster schema dedupe.
- Repo-wide approval is blocked only because the required global E2E gate surfaced unrelated failures outside the approved Auto Loan scope.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | `npm run test:e2e` failed outside scope in `credit-card-consolidation` E2E/SEO and Finance CWV suites before the Auto Loan release could complete repo-wide approval. | High | Keep Auto Loan scope locked; expand scope only with explicit approval before touching those unrelated clusters. |
| EX-002 | `npm run test:cwv:all`, `npm run test:iss001`, and `npm run test:schema:dedupe` were not executed after the out-of-scope E2E failure because `AGENTS.md` requires stopping at that boundary. | Medium | Re-run the remaining repo-wide gates only after the unrelated global failures are addressed or the scope is explicitly expanded. |
| EX-003 | Thin-content results for the Auto Loan route-level SEO passes were warn-only, not fail. | Low | Evidence is recorded in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/EXECUTION_LOG.md); no content was removed in this redesign wave. |

---

## 5) Final Decision

Decision: [ ] APPROVED  [x] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-19` |

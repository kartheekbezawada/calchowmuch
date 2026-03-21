# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260319-AUTO-LOAN-POLISH-WAVE-2` |
| Release Type | `CLUSTER_REFINEMENT` |
| Scope (Global/Cluster/Calc/Route) | `Cluster` |
| Cluster ID | `auto-loans` |
| Calculator ID (CALC) | `N/A` |
| Primary Route | `/car-loan-calculators/car-loan-calculator/` |
| Owner | `Codex` |
| Date | `2026-03-19` |
| Commit SHA | `ce1ae0c86a43d6abf859efbfb6f1af931d9a3ca9` |
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
| E2E | `npm run test:e2e` | Fail | [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/EXECUTION_LOG.md), [credit-card e2e](/home/kartheek/calchowmuch/test-results/credit-cards-credit-card-c-0853e-late-donut-and-table-toggle-chromium/error-context.md), [credit-card seo](/home/kartheek/calchowmuch/test-results/credit-cards-credit-card-c-360a1-hema-FAQ-parity-and-sitemap-chromium/error-context.md), [finance cluster cwv](/home/kartheek/calchowmuch/test-results/finance-cluster_release-cw-d66a8--satisfy-CLS-LCP-thresholds-chromium/error-context.md), [finance effective annual rate cwv](/home/kartheek/calchowmuch/test-results/finance-effective-annual-r-a28c7-atisfies-CLS-LCP-thresholds-chromium/error-context.md), [infrastructure recalc](/home/kartheek/calchowmuch/test-results/infrastructure-e2e-button--afa28--only-after-Calculate-click-chromium/error-context.md), [infrastructure iss-nav](/home/kartheek/calchowmuch/test-results/infrastructure-e2e-iss-iss-789e1--Visual-Regression-Contract-chromium/error-context.md), [infrastructure iss-design 82101](/home/kartheek/calchowmuch/test-results/infrastructure-e2e-iss-des-82101-imensions-during-navigation-chromium/error-context.md), [infrastructure iss-design ac836](/home/kartheek/calchowmuch/test-results/infrastructure-e2e-iss-des-ac836-imensions-during-navigation-chromium/error-context.md) |
| CWV | `npm run test:cwv:all` | Skipped | Blocked after the out-of-scope global E2E failure; scoped Auto Loan CWV passes are logged in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/EXECUTION_LOG.md) |
| ISS-001 | `npm run test:iss001` | Skipped | Blocked after the out-of-scope global E2E failure |
| Schema Dedupe | `npm run test:schema:dedupe` | Skipped | Blocked after the out-of-scope global E2E failure; scoped Auto Loan schema dedupe passes are logged in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/EXECUTION_LOG.md) |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | [RELEASE_CHECKLIST.md](/home/kartheek/calchowmuch/requirements/universal-rules/RELEASE_CHECKLIST.md) |
| Scope lock and wave documentation | [ACTION_PAGE.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/ACTION_PAGE.md), [DECISION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/DECISION_LOG.md), [DESIGN_SYSTEM.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/DESIGN_SYSTEM.md), [ROLLOUT_PLAN.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/ROLLOUT_PLAN.md), [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/EXECUTION_LOG.md) |
| Shared Wave 2 interaction contract | [cluster-ux.js](/home/kartheek/calchowmuch/public/calculators/car-loan-calculators/shared/cluster-ux.js), [cluster-light.css](/home/kartheek/calchowmuch/public/calculators/car-loan-calculators/shared/cluster-light.css), [generate-mpa-pages.js](/home/kartheek/calchowmuch/scripts/generate-mpa-pages.js) |
| Pane layout proof (for `calc_exp`) | Auto Loan navigation remains `designFamily: "auto-loans"` and `paneLayout: "single"` in [navigation.json](/home/kartheek/calchowmuch/public/config/navigation.json). Generated outputs continue to render the single-pane `calc_exp` contract in [car-loan index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/car-loan-calculator/index.html), [multiple-car-loan index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/auto-loan-calculator/index.html), [hire-purchase index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/hire-purchase-calculator/index.html), [pcp index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/pcp-calculator/index.html), and [leasing index.html](/home/kartheek/calchowmuch/public/car-loan-calculators/car-lease-calculator/index.html) |
| Route-level Wave 2 proof | Sectioned forms, stale-note previews, assumptions strips, and route-specific decision cards are rendered in [car-loan source](/home/kartheek/calchowmuch/public/calculators/car-loan-calculators/car-loan-calculator/index.html), [multiple-car-loan source](/home/kartheek/calchowmuch/public/calculators/car-loan-calculators/auto-loan-calculator/index.html), [hire-purchase source](/home/kartheek/calchowmuch/public/calculators/car-loan-calculators/hire-purchase-calculator/index.html), [pcp source](/home/kartheek/calchowmuch/public/calculators/car-loan-calculators/pcp-calculator/index.html), and [leasing source](/home/kartheek/calchowmuch/public/calculators/car-loan-calculators/car-lease-calculator/index.html) |
| Explanation simplification proof | Decision-summary blocks now lead the explanation stack in [car-loan explanation](/home/kartheek/calchowmuch/public/calculators/car-loan-calculators/car-loan-calculator/explanation.html), [multiple-car-loan explanation](/home/kartheek/calchowmuch/public/calculators/car-loan-calculators/auto-loan-calculator/explanation.html), [hire-purchase explanation](/home/kartheek/calchowmuch/public/calculators/car-loan-calculators/hire-purchase-calculator/explanation.html), [pcp explanation](/home/kartheek/calchowmuch/public/calculators/car-loan-calculators/pcp-calculator/explanation.html), and [leasing explanation](/home/kartheek/calchowmuch/public/calculators/car-loan-calculators/car-lease-calculator/explanation.html) |
| Scoped Auto Loan CWV artifacts | [car-loan.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/auto-loans/car-loan.json), [multiple-car-loan.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/auto-loans/multiple-car-loan.json), [hire-purchase.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/auto-loans/hire-purchase.json), [pcp-calculator.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/auto-loans/pcp-calculator.json), [leasing-calculator.json](/home/kartheek/calchowmuch/test-results/performance/scoped-cwv/auto-loans/leasing-calculator.json) |
| Thin-content artifacts | [car-loan.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/auto-loans/car-loan.json), [multiple-car-loan.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/auto-loans/multiple-car-loan.json), [hire-purchase.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/auto-loans/hire-purchase.json), [pcp-calculator.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/auto-loans/pcp-calculator.json), [leasing-calculator.json](/home/kartheek/calchowmuch/test-results/content-quality/scoped/auto-loans/leasing-calculator.json) |
| Blocking artifacts for repo-wide gate | [credit-card e2e](/home/kartheek/calchowmuch/test-results/credit-cards-credit-card-c-0853e-late-donut-and-table-toggle-chromium/error-context.md), [credit-card seo](/home/kartheek/calchowmuch/test-results/credit-cards-credit-card-c-360a1-hema-FAQ-parity-and-sitemap-chromium/error-context.md), [finance cluster cwv](/home/kartheek/calchowmuch/test-results/finance-cluster_release-cw-d66a8--satisfy-CLS-LCP-thresholds-chromium/error-context.md), [finance effective annual rate cwv](/home/kartheek/calchowmuch/test-results/finance-effective-annual-r-a28c7-atisfies-CLS-LCP-thresholds-chromium/error-context.md), [infrastructure recalc](/home/kartheek/calchowmuch/test-results/infrastructure-e2e-button--afa28--only-after-Calculate-click-chromium/error-context.md), [infrastructure iss-nav](/home/kartheek/calchowmuch/test-results/infrastructure-e2e-iss-iss-789e1--Visual-Regression-Contract-chromium/error-context.md), [infrastructure iss-design 82101](/home/kartheek/calchowmuch/test-results/infrastructure-e2e-iss-des-82101-imensions-during-navigation-chromium/error-context.md), [infrastructure iss-design ac836](/home/kartheek/calchowmuch/test-results/infrastructure-e2e-iss-des-ac836-imensions-during-navigation-chromium/error-context.md) |

Notes:

- All 5 Auto Loan routes were regenerated and passed their route-level unit, E2E, SEO, CWV, and schema dedupe suites after the Wave 2 polish changes.
- The dedicated `auto-loans` cluster suite also passed unit, E2E, SEO, CWV, contracts, isolation-scope, and cluster schema dedupe.
- Repo-wide approval is blocked only because the required global E2E gate surfaced unrelated failures outside the approved Auto Loan scope.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | `npm run test:e2e` failed outside scope in Credit Card Consolidation, Finance CWV-related suites, and infrastructure guard suites before repo-wide release approval could complete. | High | Keep Auto Loan scope locked; expand scope only with explicit approval before touching those unrelated clusters or infrastructure suites. |
| EX-002 | `npm run test:cwv:all`, `npm run test:iss001`, and `npm run test:schema:dedupe` were not executed after the out-of-scope E2E failure because `AGENTS.md` requires stopping at that boundary. | Medium | Re-run the remaining repo-wide gates only after the unrelated failures are addressed or the scope is explicitly expanded. |
| EX-003 | Thin-content results for the Auto Loan route-level SEO passes remained warn-only, not fail. | Low | The artifacts are listed above and logged in [EXECUTION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/auto-loan-cluster-redesign/EXECUTION_LOG.md); this remains a non-blocking editorial follow-up. |

---

## 5) Final Decision

Decision: [ ] APPROVED  [x] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-19` |

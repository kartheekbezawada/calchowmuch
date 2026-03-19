# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260318-215545` |
| Release Type | `CLUSTER_REDESIGN` |
| Scope (Global/Cluster/Calc/Route) | `Cluster` |
| Cluster ID | `credit-cards` |
| Calculator ID (CALC) | `N/A` |
| Primary Route | `/credit-card-calculators/` |
| Owner | `Codex` |
| Date | `2026-03-18` |
| Commit SHA | `ba48674` |
| Environment | `Local` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Console run on `2026-03-18` |
| Unit | `npm run test` | Pass | Console run on `2026-03-18` |
| E2E | `CLUSTER=credit-cards npm run test:cluster:release` | Pass | [playwright-all.summary.json](/home/kartheek/calchowmuch/test-results/playwright/cluster/credit-cards/2026-03-18T21-57-15-552Z/playwright-all.summary.json) |
| SEO | `CLUSTER=credit-cards npm run test:cluster:release` and scoped calc SEO runs | Pass | [playwright-all.summary.json](/home/kartheek/calchowmuch/test-results/playwright/cluster/credit-cards/2026-03-18T21-57-15-552Z/playwright-all.summary.json) |
| CWV | `CLUSTER=credit-cards npm run test:cluster:release` and scoped calc CWV runs | Pass | [playwright-all.summary.json](/home/kartheek/calchowmuch/test-results/playwright/cluster/credit-cards/2026-03-18T21-57-15-552Z/playwright-all.summary.json) |
| ISS-001 | `npm run test:iss001` | Pass | [iss-design-001.spec.js](/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/iss-design-001.spec.js) |
| Schema Dedupe | `npm run test:schema:dedupe` | Pass | [schema_duplicates_report.md](/home/kartheek/calchowmuch/schema_duplicates_report.md) |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | [RELEASE_CHECKLIST.md](/home/kartheek/calchowmuch/requirements/universal-rules/RELEASE_CHECKLIST.md) |
| Scoped route proof (target route + scope lock) | [ACTION_PAGE.md](/home/kartheek/calchowmuch/requirements/universal-rules/credit-card-cluster-redesign/ACTION_PAGE.md), [DECISION_LOG.md](/home/kartheek/calchowmuch/requirements/universal-rules/credit-card-cluster-redesign/DECISION_LOG.md) |
| SEO/schema evidence | [seo.calc.spec.js](/home/kartheek/calchowmuch/tests_specs/credit-cards/credit-card-repayment-payoff_release/seo.calc.spec.js), [seo.calc.spec.js](/home/kartheek/calchowmuch/tests_specs/credit-cards/credit-card-minimum-payment_release/seo.calc.spec.js), [seo.calc.spec.js](/home/kartheek/calchowmuch/tests_specs/credit-cards/balance-transfer-installment-plan_release/seo.calc.spec.js), [seo.calc.spec.js](/home/kartheek/calchowmuch/tests_specs/credit-cards/credit-card-consolidation_release/seo.calc.spec.js) |
| CWV artifact (`scoped-cwv` or global) | Cluster release summary at [playwright-all.summary.json](/home/kartheek/calchowmuch/test-results/playwright/cluster/credit-cards/2026-03-18T21-57-15-552Z/playwright-all.summary.json); scoped calc CWV commands for all 4 routes also passed on `2026-03-18` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | Scoped SEO runs emitted thin-content summaries for all 4 credit-card routes on `2026-03-18`; evidence captured in console output during release run |
| Important Notes contract proof (if applicable) | [explanation.html](/home/kartheek/calchowmuch/public/calculators/credit-card-calculators/credit-card-payment-calculator/explanation.html), [explanation.html](/home/kartheek/calchowmuch/public/calculators/credit-card-calculators/credit-card-minimum-payment-calculator/explanation.html), [explanation.html](/home/kartheek/calchowmuch/public/calculators/credit-card-calculators/balance-transfer-credit-card-calculator/explanation.html), [explanation.html](/home/kartheek/calchowmuch/public/calculators/credit-card-calculators/credit-card-consolidation-calculator/explanation.html) |
| Pane layout proof (for `calc_exp`) | Route E2E specs verify single-panel `.panel-span-all` layout and no legacy shell nav: [e2e.calc.spec.js](/home/kartheek/calchowmuch/tests_specs/credit-cards/credit-card-repayment-payoff_release/e2e.calc.spec.js), [e2e.calc.spec.js](/home/kartheek/calchowmuch/tests_specs/credit-cards/credit-card-minimum-payment_release/e2e.calc.spec.js), [e2e.calc.spec.js](/home/kartheek/calchowmuch/tests_specs/credit-cards/balance-transfer-installment-plan_release/e2e.calc.spec.js), [e2e.calc.spec.js](/home/kartheek/calchowmuch/tests_specs/credit-cards/credit-card-consolidation_release/e2e.calc.spec.js) |

Notes:
- The redesign removed the old top-nav and left-nav shell from the credit-card cluster by design and replaced it with a homepage-derived light shell.
- Credit-card route CSS is now inlined at generation time in [generate-mpa-pages.js](/home/kartheek/calchowmuch/scripts/generate-mpa-pages.js) to remove blocking stylesheet requests.
- The ISS-001 infrastructure contract was updated in [iss-design-001.spec.js](/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/iss-design-001.spec.js) so category switching checks for settled shell stability instead of assuming every category keeps the legacy left-nav layout.
- Shared cluster stylesheet lives at [cluster-light.css](/home/kartheek/calchowmuch/public/calculators/credit-card-calculators/shared/cluster-light.css).

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | `seo_mojibake_report.md` was refreshed by scoped SEO runs as part of release evidence generation. | Low | Treat as generated audit output; no product behavior impact. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-18` |

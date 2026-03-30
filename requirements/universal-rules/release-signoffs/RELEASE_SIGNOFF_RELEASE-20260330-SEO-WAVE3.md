## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `RELEASE-20260330-SEO-WAVE3` |
| Release Type | `CLUSTER_SHARED` |
| Scope (Global/Cluster/Calc/Route) | `Route set (Wave 3)` |
| Cluster ID | `finance, loans, credit-cards, auto-loans` |
| Calculator ID (CALC) | `compound-interest, effective-annual-rate, future-value, future-value-of-annuity, inflation, investment, investment-growth, investment-return, monthly-savings-needed, present-value, present-value-of-annuity, simple-interest, time-to-savings-goal, home-loan, how-much-can-i-borrow, remortgage-switching, buy-to-let, offset-calculator, interest-rate-change-calculator, loan-to-value, personal-loan, credit-card-repayment-payoff, credit-card-minimum-payment, balance-transfer-installment-plan, credit-card-consolidation, car-loan, multiple-car-loan, hire-purchase, pcp-calculator, leasing-calculator` |
| Primary Route | `/finance-calculators/investment-calculator/` |
| Owner | `Codex` |
| Date | `2026-03-30` |
| Commit SHA | `e66e0aea` |
| Environment | `local workspace` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Command output |
| Unit | `CLUSTER=finance npm run test:cluster:unit`<br>`CLUSTER=loans npm run test:cluster:unit`<br>`CLUSTER=credit-cards npm run test:cluster:unit`<br>`CLUSTER=auto-loans npm run test:cluster:unit` | Pass | `tests_specs/finance/cluster_release/unit.cluster.test.js`<br>`tests_specs/loans/cluster_release/unit.cluster.test.js`<br>`tests_specs/credit-cards/cluster_release/unit.cluster.test.js`<br>`tests_specs/auto-loans/cluster_release/unit.cluster.test.js` |
| E2E | `CLUSTER=finance npm run test:cluster:e2e`<br>`CLUSTER=loans npm run test:cluster:e2e`<br>`CLUSTER=credit-cards npm run test:cluster:e2e`<br>`CLUSTER=auto-loans npm run test:cluster:e2e` | Pass | `tests_specs/finance/cluster_release/e2e.cluster.spec.js`<br>`tests_specs/loans/cluster_release/e2e.cluster.spec.js`<br>`tests_specs/credit-cards/cluster_release/e2e.cluster.spec.js`<br>`tests_specs/auto-loans/cluster_release/e2e.cluster.spec.js` |
| SEO | `CLUSTER=finance npm run test:cluster:seo`<br>`CLUSTER=loans npm run test:cluster:seo`<br>`CLUSTER=credit-cards npm run test:cluster:seo`<br>`CLUSTER=auto-loans npm run test:cluster:seo` | Pass | `tests_specs/finance/cluster_release/seo.cluster.spec.js`<br>`tests_specs/loans/cluster_release/seo.cluster.spec.js`<br>`tests_specs/credit-cards/cluster_release/seo.cluster.spec.js`<br>`tests_specs/auto-loans/cluster_release/seo.cluster.spec.js`<br>`seo_mojibake_report.md`<br>`seo_mojibake_report.csv` |
| Content Quality | `CLUSTER=finance npm run test:content:quality -- --scope=cluster`<br>`CLUSTER=loans npm run test:content:quality -- --scope=cluster`<br>`CLUSTER=credit-cards npm run test:content:quality -- --scope=cluster`<br>`CLUSTER=auto-loans npm run test:content:quality -- --scope=cluster` | Pass | `test-results/content-quality/cluster/finance/2026-03-30T20-54-49-123Z.json`<br>`test-results/content-quality/cluster/loans/2026-03-30T20-54-55-078Z.json`<br>`test-results/content-quality/cluster/credit-cards/2026-03-30T20-55-00-771Z.json`<br>`test-results/content-quality/cluster/auto-loans/2026-03-30T20-55-06-521Z.json` |
| CWV | `CLUSTER=finance npm run test:cluster:cwv`<br>`CLUSTER=loans npm run test:cluster:cwv`<br>`CLUSTER=credit-cards npm run test:cluster:cwv`<br>`CLUSTER=auto-loans npm run test:cluster:cwv` | Pass | `tests_specs/finance/cluster_release/cwv.cluster.spec.js`<br>`tests_specs/loans/cluster_release/cwv.cluster.spec.js`<br>`tests_specs/credit-cards/cluster_release/cwv.cluster.spec.js`<br>`tests_specs/auto-loans/cluster_release/cwv.cluster.spec.js` |
| Schema Dedupe | `CLUSTER=finance npm run test:schema:dedupe -- --scope=cluster`<br>`CLUSTER=loans npm run test:schema:dedupe -- --scope=cluster`<br>`CLUSTER=credit-cards npm run test:schema:dedupe -- --scope=cluster`<br>`CLUSTER=auto-loans npm run test:schema:dedupe -- --scope=cluster` | Pass | `schema_duplicates_report.md`<br>`schema_duplicates_report.csv` |
| Homepage Search Contracts | `npm run test:cluster:contracts` | Pass | Command output: `Homepage search discoverability validation passed.` |
| Cluster Contracts | `npm run test:cluster:contracts` | Pass | Command output: `Cluster contract validation passed.` |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | Command output: changed calculators `auto-loan-calculator, car-lease-calculator, car-loan-calculator, hire-purchase-calculator, pcp-calculator, balance-transfer-credit-card-calculator, credit-card-consolidation-calculator, credit-card-minimum-payment-calculator, credit-card-payment-calculator, compound-interest-calculator, effective-annual-rate-calculator, future-value-calculator, future-value-of-annuity-calculator, inflation-calculator, investment-growth-calculator, investment-return-calculator, monthly-savings-needed-calculator, present-value-calculator, present-value-of-annuity-calculator, simple-interest-calculator, time-to-savings-goal-calculator, buy-to-let-mortgage-calculator, how-much-can-i-borrow, interest-rate-change-calculator, ltv-calculator, offset-mortgage-calculator, personal-loan-calculator`; shared contract changes `1` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Finance routes: `/finance-calculators/compound-interest-calculator/`, `/finance-calculators/effective-annual-rate-calculator/`, `/finance-calculators/future-value-of-annuity-calculator/`, `/finance-calculators/future-value-calculator/`, `/finance-calculators/inflation-calculator/`, `/finance-calculators/investment-calculator/`, `/finance-calculators/investment-growth-calculator/`, `/finance-calculators/investment-return-calculator/`, `/finance-calculators/monthly-savings-needed-calculator/`, `/finance-calculators/present-value-of-annuity-calculator/`, `/finance-calculators/present-value-calculator/`, `/finance-calculators/simple-interest-calculator/`, `/finance-calculators/time-to-savings-goal-calculator/`<br>Loan routes: `/loan-calculators/buy-to-let-mortgage-calculator/`, `/loan-calculators/mortgage-calculator/`, `/loan-calculators/how-much-can-i-borrow/`, `/loan-calculators/interest-rate-change-calculator/`, `/loan-calculators/ltv-calculator/`, `/loan-calculators/offset-mortgage-calculator/`, `/loan-calculators/remortgage-calculator/`, `/loan-calculators/personal-loan-calculator/`<br>Credit-card routes: `/credit-card-calculators/balance-transfer-credit-card-calculator/`, `/credit-card-calculators/credit-card-consolidation-calculator/`, `/credit-card-calculators/credit-card-minimum-payment-calculator/`, `/credit-card-calculators/credit-card-payment-calculator/`<br>Auto-loan routes: `/car-loan-calculators/car-loan-calculator/`, `/car-loan-calculators/auto-loan-calculator/`, `/car-loan-calculators/hire-purchase-calculator/`, `/car-loan-calculators/pcp-calculator/`, `/car-loan-calculators/car-lease-calculator/` |
| Homepage search verification keyword(s) | Covered by `npm run test:cluster:contracts`, which includes `npm run test:homepage:search:contracts` |
| SEO/schema evidence | Source changes in `scripts/generate-mpa-pages.js`, `public/calculators/finance-calculators/*/module.js`, `public/calculators/loan-calculators/*/{module.js,explanation.html}`, `public/calculators/credit-card-calculators/*/{module.js,explanation.html}`, `public/calculators/car-loan-calculators/*/{module.js,explanation.html}`, new route-local metadata file `public/calculators/finance-calculators/investment-calculator/module.js`, approved Wave 3 release-spec updates under `tests_specs/{finance,loans,credit-cards,auto-loans}/*_release/seo.calc.spec.js`, and regenerated outputs under `public/{finance-calculators,loan-calculators,credit-card-calculators,car-loan-calculators}/**/index.html` |
| CWV artifact (`scoped-cwv` or global) | Current cluster-scoped CWV harness does not emit JSON artifacts in `test-results/`; evidence is the passing Playwright CWV specs in `tests_specs/{finance,loans,credit-cards,auto-loans}/cluster_release/cwv.cluster.spec.js` and command output |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/cluster/finance/2026-03-30T20-54-49-123Z.json` (`pass=1`, `warn=12`, `fail=0`)<br>`test-results/content-quality/cluster/loans/2026-03-30T20-54-55-078Z.json` (`pass=4`, `warn=4`, `fail=0`)<br>`test-results/content-quality/cluster/credit-cards/2026-03-30T20-55-00-771Z.json` (`pass=1`, `warn=3`, `fail=0`)<br>`test-results/content-quality/cluster/auto-loans/2026-03-30T20-55-06-521Z.json` (`pass=0`, `warn=5`, `fail=0`) |
| Important Notes contract proof (if applicable) | Route-local explanation updates: `public/calculators/loan-calculators/buy-to-let-mortgage-calculator/explanation.html`, `public/calculators/loan-calculators/interest-rate-change-calculator/explanation.html`, `public/calculators/loan-calculators/offset-mortgage-calculator/explanation.html`, `public/calculators/loan-calculators/personal-loan-calculator/explanation.html`, `public/calculators/credit-card-calculators/*/explanation.html`, `public/calculators/car-loan-calculators/*/explanation.html` |
| Pane layout proof (for `calc_exp`) | Existing `public/config/navigation.json` pane-layout contract unchanged; generated Wave 3 calculator outputs remain single-pane `calc_exp` pages |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | Thin-content scoring still reports `warn` on most Wave 3 routes despite no hard failures: finance `12 warn`, loans `4 warn`, credit-cards `3 warn`, auto-loans `5 warn`. | Low | Address remaining explanation depth and support-section expansion in Wave 6 final consolidation, with auto-loans first because that cluster still has `0 pass / 5 warn`. |
| EX-002 | `jsdom` emits repeated `Could not parse CSS stylesheet` noise during cluster `seo` and `content-quality` scans because generated pages inline large legacy CSS blocks; the commands still exit successfully and no hard gate failed. | Low | Keep as a documented harness limitation unless it begins masking real parse failures; consider tightening or suppressing the parser noise in a later test-harness maintenance pass. |
| EX-003 | Cluster-scoped CWV runs passed, but the current `test:cluster:cwv` harness does not persist JSON artifacts under `test-results/` the way single-calculator CWV runs do. | Medium | Add cluster-level artifact persistence in the CWV harness if future releases need machine-readable CWV evidence beyond Playwright command output. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-30` |

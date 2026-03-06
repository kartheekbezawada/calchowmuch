# Release Sign-Off — REL-20260305-008

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260305-008 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Release Mode** | SCHEMA_DEDUPE_MAINTENANCE |
| **Scope (Global/Target)** | Target |
| **Cluster ID(s)** | loans |
| **Calculator ID (CALC)** | car-loan |
| **Primary Route** | /car-loan-calculators/car-loan-calculator/ |
| **Route Archetype** | calc_exp |
| **Pane Layout Contract** | single |
| **Branch / Tag** | local working tree |
| **Environment** | local |
| **Owner** | Codex |
| **Date** | 2026-03-05 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **I1** | **Metadata** | Title, description, canonical, OG, Twitter, robots, UTF-8 contract validated by scoped SEO spec | Pass |
| **I2** | **Schema** | JSON-LD includes  + ; scoped dedupe command passed | Pass |
| **I4** | **Sitemap** | Route present in sitemap | Pass |
| **MODE-LOCK** | **Execution Mode** | Human-locked SEO+schema only run | Pass |

---

## 3) Evidence & Metrics

### Executed Gates
- 
target generation: 

target route regenerated with:
- 
	target command: 
		tSkipping route bundle rebuild for scoped generation (use REBUILD_ROUTE_BUNDLES=1 to force).
Scoped generation complete for 1 route(s) (route=n/a, calcId=car-loan).
- Scoped SEO gate:
  - 
> calchowmuch@1.0.0 test:calc:seo
> node scripts/run-scoped-tests.mjs --level=calc --type=seo


Running 1 test using 1 worker

  ✓  1 [chromium] › tests_specs/loans/car-loan_release/seo.calc.spec.js:4:3 › Car Loan Calculator SEO › CAR-LOAN-TEST-SEO-1: metadata, headings, FAQ schema, sitemap (1.8s)

  1 passed (2.9s)
Thin-content quality artifact: test-results/content-quality/scoped/loans/car-loan.json
Thin-content summary: evaluated=0, pass=0, warn=0, fail=0, pilotExcluded=1, notApplicable=0
[seo:mojibake] scannedFiles=1 scannedCalculators=1 findings=0
[seo:mojibake] reports: seo_mojibake_report.md, seo_mojibake_report.csv -> Pass
- Scoped schema dedupe gate:
  - 
> calchowmuch@1.0.0 test:schema:dedupe
> node scripts/schema-structured-data-dedupe.mjs --scope=calc

[schema:dedupe] scanned=1 changed=0 parseErrors=0 unresolved=0
[schema:dedupe] reports: schema_duplicates_report.md, schema_duplicates_report.csv -> Pass ()

### Skipped Gates (Mode-Locked)
- 
> calchowmuch@1.0.0 test:calc:unit
> node scripts/run-scoped-tests.mjs --level=calc --type=unit


 RUN  v1.6.1 /home/kartheek/calchowmuch

 ↓ tests_specs/loans/car-loan_release/unit.calc.test.js  (1 test | 1 skipped)

 Test Files  1 skipped (1)
      Tests  1 skipped (1)
   Start at  03:08:51
   Duration  644ms (transform 20ms, setup 0ms, collect 13ms, tests 0ms, environment 300ms, prepare 89ms) (skipped by human request)
- 
> calchowmuch@1.0.0 test:calc:e2e
> node scripts/run-scoped-tests.mjs --level=calc --type=e2e


Running 1 test using 1 worker

  ✓  1 [chromium] › tests_specs/loans/car-loan_release/e2e.calc.spec.js:21:3 › Car Loan Calculator › CAR-LOAN-E2E-1: premium single pane with button-only recalculation and schedule toggles (2.0s)

  1 passed (3.1s) (skipped by human request)
- 
> calchowmuch@1.0.0 test:calc:cwv
> node scripts/run-scoped-tests.mjs --level=calc --type=cwv


Running 1 test using 1 worker

  ✓  1 [chromium] › tests_specs/loans/car-loan_release/cwv.calc.spec.js:7:3 › loans/car-loan cwv guard › calculator route satisfies CLS/LCP thresholds (3.2s)

  1 passed (4.3s)
Scoped CWV budget report written to test-results/performance/scoped-cwv/loans/car-loan.json (skipped by human request)
- Global suites skipped by mode lock:
  - 
> calchowmuch@1.0.0 test
> vitest run


 RUN  v1.6.1 /home/kartheek/calchowmuch

 ✓ tests_specs/math/z-score_release/unit.calc.test.js  (49 tests) 14ms
 ✓ tests_specs/math/confidence-interval_release/unit.calc.test.js  (22 tests) 11ms
 ✓ tests_specs/math/statistics_release/unit.calc.test.js  (34 tests) 13ms
 ✓ tests_specs/math/standard-deviation_release/unit.calc.test.js  (26 tests) 13ms
 ✓ tests_specs/finance/compound-interest_release/unit.calc.test.js  (12 tests) 7ms
 ❯ tests_specs/finance/cluster_release/unit.cluster.test.js  (1 test | 1 failed) 18ms
   ❯ tests_specs/finance/cluster_release/unit.cluster.test.js > Finance static schema source parity guard (SEO-FAQ-SCHEMA-002) > enforces static head schema + robots + JS FAQ parity + visible FAQ parity for /finance-calculators/*
     → compound-interest-calculator: missing module.js file: expected false to be true // Object.is equality
 ✓ tests_specs/finance/investment-growth_release/unit.calc.test.js  (15 tests) 8ms
 ✓ tests_specs/math/fraction-calculator_release/unit.calc.test.js  (25 tests) 9ms
 ✓ tests_specs/percentage/markup-calculator_release/unit.calc.test.js  (18 tests) 10ms
 ✓ tests_specs/math/basic_release/unit.calc.test.js  (31 tests) 10ms
 ✓ tests_specs/finance/investment-return_release/unit.calc.test.js  (31 tests) 33ms
 ✓ tests_specs/infrastructure/unit/stats.test.js  (104 tests) 28ms
 ✓ tests_specs/loans/home-loan_release/unit.calc.test.js  (9 tests) 60ms
 ✓ tests_specs/loans/cluster_release/unit.cluster.test.js  (25 tests) 54ms
 ✓ tests_specs/math/cluster_release/unit.cluster.test.js  (207 tests) 98ms
 ✓ tests_specs/finance/present-value-of-annuity_release/unit.calc.test.js  (6 tests) 6ms
 ✓ tests_specs/percentage/what-percent-is-x-of-y_release/unit.calc.test.js  (19 tests) 9ms
 ✓ tests_specs/infrastructure/unit/schema-structured-data-dedupe.test.js  (7 tests) 27ms
 ✓ tests_specs/infrastructure/unit/math.test.js  (31 tests) 26ms
 ✓ tests_specs/sleep-and-nap/wake-up-time-calculator_release/unit.calc.test.js  (8 tests) 15ms
 ✓ tests_specs/loans/buy-to-let_release/unit.calc.test.js  (5 tests) 10ms
 ✓ tests_specs/credit-cards/cluster_release/unit.cluster.test.js  (11 tests) 17ms
 ✓ tests_specs/loans/how-much-can-i-borrow_release/unit.calc.test.js  (4 tests) 14ms
 ✓ tests_specs/infrastructure/unit/validate.test.js  (21 tests) 10ms
 ✓ tests_specs/percentage/reverse-percentage_release/unit.calc.test.js  (18 tests) 19ms
 ✓ tests_specs/time-and-date/work-hours-calculator_release/unit.calc.test.js  (9 tests) 13ms
 ✓ tests_specs/finance/future-value-of-annuity_release/unit.calc.test.js  (9 tests) 14ms
 ✓ tests_specs/infrastructure/unit/format.test.js  (31 tests) 118ms
 ❯ tests_specs/infrastructure/unit/page-metadata-schema-guard.test.js  (7 tests | 2 failed) 261ms
   ❯ tests_specs/infrastructure/unit/page-metadata-schema-guard.test.js > UI schema guard for FAQPage injection > rejects duplicate BreadcrumbList schema on a single URL
     → expected [Function] to throw an error
   ❯ tests_specs/infrastructure/unit/page-metadata-schema-guard.test.js > UI schema guard for FAQPage injection > rejects duplicate SoftwareApplication schema on a single URL
     → expected [Function] to throw an error
 ✓ tests_specs/infrastructure/unit/content-quality-thin-score.test.js  (7 tests) 139ms
 ✓ tests_specs/time-and-date/overtime-hours-calculator_release/unit.calc.test.js  (7 tests) 7ms
 ✓ tests_specs/percentage/commission-calculator_release/unit.calc.test.js  (6 tests) 7ms
 ✓ tests_specs/finance/simple-interest_release/unit.calc.test.js  (5 tests) 3ms
 ✓ tests_specs/time-and-date/time-between-two-dates-calculator_release/unit.calc.test.js  (5 tests) 15ms
 ✓ tests_specs/percentage/cluster_release/unit.cluster.test.js  (10 tests) 21ms
 ✓ tests_specs/finance/effective-annual-rate_release/unit.calc.test.js  (5 tests) 5ms
 ✓ tests_specs/percentage/discount-calculator_release/unit.calc.test.js  (8 tests) 12ms
 ✓ tests_specs/finance/present-value_release/unit.calc.test.js  (5 tests) 9ms
 ✓ tests_specs/percentage/percentage-difference_release/unit.calc.test.js  (6 tests) 21ms
 ✓ tests_specs/sleep-and-nap/energy-based-nap-selector_release/unit.calc.test.js  (6 tests) 21ms
 ✓ tests_specs/percentage/margin-calculator_release/unit.calc.test.js  (5 tests) 19ms
 ✓ tests_specs/percentage/percentage-decrease_release/unit.calc.test.js  (6 tests) 14ms
 ✓ tests_specs/percentage/percentage-composition_release/unit.calc.test.js  (6 tests) 25ms
 ✓ tests_specs/sleep-and-nap/sleep-time-calculator_release/unit.calc.test.js  (5 tests) 20ms
 ✓ tests_specs/finance/future-value_release/unit.calc.test.js  (4 tests) 20ms
 ✓ tests_specs/time-and-date/countdown-timer-generator_release/unit.calc.test.js  (3 tests) 5ms
 ✓ tests_specs/math/polynomial-operations_release/unit.calc.test.js  (3 tests) 14ms
 ✓ tests_specs/percentage/percent-to-fraction-decimal_release/unit.calc.test.js  (4 tests) 19ms
 ✓ tests_specs/time-and-date/birthday-day-of-week_release/unit.calc.test.js  (4 tests) 9ms
 ✓ tests_specs/sleep-and-nap/nap-time-calculator_release/unit.calc.test.js  (5 tests) 9ms
 ✓ tests_specs/percentage/percentage-of-a-number_release/unit.calc.test.js  (4 tests) 8ms
 ✓ tests_specs/time-and-date/age-calculator_release/unit.calc.test.js  (4 tests) 15ms
 ✓ tests_specs/infrastructure/unit/graph-utils.test.js  (4 tests) 24ms
 ✓ tests_specs/math/probability_release/unit.calc.test.js  (5 tests) 17ms
 ✓ tests_specs/math/slope-distance_release/unit.calc.test.js  (3 tests) 18ms
 ✓ tests_specs/math/quadratic-equation_release/unit.calc.test.js  (4 tests) 35ms
 ✓ tests_specs/percentage/percentage-increase_release/unit.calc.test.js  (5 tests) 11ms
 ✓ tests_specs/time-and-date/days-until-a-date-calculator_release/unit.calc.test.js  (4 tests) 7ms
 ✓ tests_specs/math/system-of-equations_release/unit.calc.test.js  (3 tests) 6ms
 ✓ tests_specs/percentage/percent-change_release/unit.calc.test.js  (5 tests) 14ms
 ❯ tests_specs/sleep-and-nap/cluster_release/contracts.cluster.test.js  (1 test | 1 failed) 10ms
   ❯ tests_specs/sleep-and-nap/cluster_release/contracts.cluster.test.js > sleep-and-nap cluster contracts > scope map contains cluster and calculator route contracts
     → expected undefined to be truthy
 ✓ tests_specs/credit-cards/cluster_release/contracts.cluster.test.js  (1 test) 5ms
 ✓ tests_specs/finance/cluster_release/contracts.cluster.test.js  (1 test) 23ms
 ✓ tests_specs/time-and-date/cluster_release/contracts.cluster.test.js  (1 test) 17ms
 ✓ tests_specs/math/cluster_release/contracts.cluster.test.js  (1 test) 10ms
 ✓ tests_specs/percentage/cluster_release/contracts.cluster.test.js  (1 test) 11ms
 ✓ tests_specs/loans/cluster_release/contracts.cluster.test.js  (1 test) 18ms
 ✓ tests_specs/math/factoring_release/unit.calc.test.js  (3 tests) 12ms
 ↓ tests_specs/credit-cards/credit-card-repayment-payoff_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/credit-cards/balance-transfer-installment-plan_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/loans/interest-rate-change-calculator_release/unit.calc.test.js  (1 test | 1 skipped)
 ✓ tests_specs/math/permutation-combination_release/unit.calc.test.js  (4 tests) 8ms
 ↓ tests_specs/sleep-and-nap/power-nap-calculator_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/credit-cards/credit-card-minimum-payment_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/credit-cards/credit-card-consolidation_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/finance/monthly-savings-needed_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/finance/time-to-savings-goal_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/mean-median-mode-range_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/loans/remortgage-switching_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/exponential-equations_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/law-of-sines-cosines_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/loans/leasing-calculator_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/regression-analysis_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/hypothesis-testing_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/percentage-increase_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/loans/offset-calculator_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/loans/multiple-car-loan_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/time-and-date/cluster_release/unit.cluster.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/series-convergence_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/sleep-and-nap/cluster_release/unit.cluster.test.js  (1 test | 1 skipped)
 ↓ tests_specs/loans/pcp-calculator_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/critical-points_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/number-sequence_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/triangle-solver_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/loans/hire-purchase_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/log-properties_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/trig-functions_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/correlation_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/loans/loan-to-value_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/inverse-trig_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/natural-log_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/distribution_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/sample-size_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/common-log_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/unit-circle_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/derivative_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/loans/car-loan_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/log-scale_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/integral_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/anova_release/unit.calc.test.js  (1 test | 1 skipped)
 ↓ tests_specs/math/limit_release/unit.calc.test.js  (1 test | 1 skipped)

 Test Files  3 failed | 66 passed | 42 skipped (111)
      Tests  4 failed | 961 passed | 42 skipped (1007)
   Start at  03:09:16
   Duration  10.85s (transform 1.64s, setup 18ms, collect 5.16s, tests 1.63s, environment 88.00s, prepare 20.27s)
  - 
> calchowmuch@1.0.0 test:e2e
> playwright test


Running 413 tests using 8 workers

  -    1 [chromium] › tests_specs/credit-cards/balance-transfer-installment-plan_release/e2e.calc.spec.js:4:8 › credit-cards/balance-transfer-installment-plan e2e scope placeholder › migrated test content pending for /credit-card-calculators/balance-transfer-credit-card-calculator/
  ✓    8 [chromium] › tests_specs/credit-cards/cluster_release/seo.cluster.spec.js:6:3 › credit-cards cluster seo smoke › representative route has canonical/title/robots (3.2s)
  ✓    3 [chromium] › tests_specs/credit-cards/balance-transfer-installment-plan_release/seo.calc.spec.js:4:3 › Balance Transfer Credit Card Calculator SEO › BALANCE-TRANSFER-SEO-1: metadata, social tags, schema, and sitemap (3.9s)
  ✓    4 [chromium] › tests_specs/credit-cards/credit-card-consolidation_release/e2e.calc.spec.js:83:3 › Credit Card Consolidation Calculator › CONSOLIDATION-TEST-E2E-2: input edit keeps side/table live and invalid input preserves last valid data (4.2s)
  ✓    7 [chromium] › tests_specs/credit-cards/cluster_release/e2e.cluster.spec.js:6:3 › credit-cards cluster e2e smoke › cluster representative routes load and show H1 (4.5s)
  ✓    5 [chromium] › tests_specs/credit-cards/credit-card-consolidation_release/cwv.calc.spec.js:7:3 › credit-cards/credit-card-consolidation cwv guard › calculator route satisfies CLS/LCP thresholds (5.0s)
  ✓    2 [chromium] › tests_specs/credit-cards/balance-transfer-installment-plan_release/cwv.calc.spec.js:7:3 › credit-cards/balance-transfer-installment-plan cwv guard › calculator route satisfies CLS/LCP thresholds (5.1s)
  ✓   10 [chromium] › tests_specs/credit-cards/credit-card-consolidation_release/e2e.calc.spec.js:109:3 › Credit Card Consolidation Calculator › CONSOLIDATION-TEST-E2E-3: explanation contains required rebuilt sections and 10 FAQs (2.4s)
  ✓    6 [chromium] › tests_specs/credit-cards/credit-card-consolidation_release/e2e.calc.spec.js:15:3 › Credit Card Consolidation Calculator › CONSOLIDATION-TEST-E2E-1: single-panel Home Loan UI with calculate, donut, and table toggle (6.3s)
  ✓   11 [chromium] › tests_specs/credit-cards/credit-card-consolidation_release/seo.calc.spec.js:4:3 › Credit Card Consolidation Calculator SEO › CONSOLIDATION-TEST-SEO-1: metadata, schema, FAQ parity, and sitemap (3.5s)
  ✓   15 [chromium] › tests_specs/credit-cards/credit-card-minimum-payment_release/e2e.calc.spec.js:109:3 › Credit Card Minimum Payment Calculator › MINPAY-TEST-E2E-3: explanation pane contains required sections and 10 FAQs (3.0s)
  ✓   14 [chromium] › tests_specs/credit-cards/credit-card-minimum-payment_release/e2e.calc.spec.js:93:3 › Credit Card Minimum Payment Calculator › MINPAY-TEST-E2E-2: input change keeps outcome visible with updated defaults (3.3s)
  ✓   12 [chromium] › tests_specs/credit-cards/credit-card-minimum-payment_release/cwv.calc.spec.js:7:3 › credit-cards/credit-card-minimum-payment cwv guard › calculator route satisfies CLS/LCP thresholds (4.6s)
  ✓   16 [chromium] › tests_specs/credit-cards/credit-card-minimum-payment_release/seo.calc.spec.js:4:3 › Credit Card Minimum Payment Calculator SEO › MINPAY-TEST-SEO-1: metadata, schema, FAQ parity, and sitemap (3.5s)
  ✓    9 [chromium] › tests_specs/credit-cards/cluster_release/cwv.cluster.spec.js:7:3 › credit-cards cluster cwv guard › cluster routes satisfy CLS/LCP thresholds (10.9s)
  ✓   20 [chromium] › tests_specs/credit-cards/credit-card-repayment-payoff_release/e2e.calc.spec.js:67:3 › Credit Card Repayment Calculator › REPAYMENT-TEST-E2E-3: explanation pane has 10 FAQ items (2.6s)
  ✓   18 [chromium] › tests_specs/credit-cards/credit-card-repayment-payoff_release/e2e.calc.spec.js:4:3 › Credit Card Repayment Calculator › REPAYMENT-TEST-E2E-1: load, nav, calculate, verify results (3.9s)
  ✓   19 [chromium] › tests_specs/credit-cards/credit-card-repayment-payoff_release/e2e.calc.spec.js:50:3 › Credit Card Repayment Calculator › REPAYMENT-TEST-E2E-2: projected horizon remains visible after input change (3.6s)
  ✓   21 [chromium] › tests_specs/credit-cards/credit-card-repayment-payoff_release/seo.calc.spec.js:4:3 › Credit Card Repayment Calculator SEO › REPAYMENT-TEST-SEO-1: metadata, headings, FAQ schema, sitemap (3.1s)
  ✘   17 [chromium] › tests_specs/credit-cards/credit-card-repayment-payoff_release/cwv.calc.spec.js:7:3 › credit-cards/credit-card-repayment-payoff cwv guard › calculator route satisfies CLS/LCP thresholds (5.1s)
  ✓   24 [chromium] › tests_specs/finance/cluster_release/seo.cluster.spec.js:6:3 › finance cluster seo smoke › representative route has canonical/title/robots (2.3s)
  ✘   13 [chromium] › tests_specs/credit-cards/credit-card-minimum-payment_release/e2e.calc.spec.js:12:3 › Credit Card Minimum Payment Calculator › MINPAY-TEST-E2E-1: load, nav, calculate, verify results (8.2s)
  ✓   23 [chromium] › tests_specs/finance/cluster_release/e2e.cluster.spec.js:6:3 › finance cluster e2e smoke › cluster representative routes load and show H1 (3.7s)
  ✓   27 [chromium] › tests_specs/finance/compound-interest_release/seo.calc.spec.js:4:3 › Compound Interest Calculator SEO › CI-TEST-SEO-1: metadata, structured data, sitemap (2.8s)
  ✓   25 [chromium] › tests_specs/finance/compound-interest_release/cwv.calc.spec.js:10:3 › finance/compound-interest cwv guard › calculator route satisfies CLS/LCP thresholds (4.3s)
  ✓   26 [chromium] › tests_specs/finance/compound-interest_release/e2e.calc.spec.js:8:3 › Compound Interest Calculator › CI-TEST-E2E-1: user journey and projection table frequency toggle (4.1s)
  ✓   28 [chromium] › tests_specs/finance/effective-annual-rate_release/e2e.calc.spec.js:8:3 › Effective Annual Rate Calculator › EAR-TEST-E2E-1: user journey and results (2.8s)
  ✓   30 [chromium] › tests_specs/finance/future-value_release/e2e.calc.spec.js:21:3 › Future Value Calculator › FV-TEST-E2E-1: user journey and results (3.4s)
  ✘   22 [chromium] › tests_specs/finance/cluster_release/cwv.cluster.spec.js:7:3 › finance cluster cwv guard › cluster routes satisfy CLS/LCP thresholds (8.2s)
  ✓   32 [chromium] › tests_specs/finance/future-value_release/seo.calc.spec.js:4:3 › Future Value Calculator SEO › FV-TEST-SEO-1: metadata, structured data, sitemap (2.9s)
  ✓   34 [chromium] › tests_specs/finance/effective-annual-rate_release/seo.calc.spec.js:4:3 › Effective Annual Rate Calculator SEO › EAR-TEST-SEO-1: metadata, structured data, sitemap (2.8s)
  ✘   29 [chromium] › tests_specs/finance/future-value_release/cwv.calc.spec.js:7:3 › finance/future-value cwv guard › calculator route satisfies CLS/LCP thresholds (4.3s)
  ✘   31 [chromium] › tests_specs/finance/effective-annual-rate_release/cwv.calc.spec.js:7:3 › finance/effective-annual-rate cwv guard › calculator route satisfies CLS/LCP thresholds (4.3s)
  ✓   35 [chromium] › tests_specs/finance/future-value-of-annuity_release/e2e.calc.spec.js:21:3 › Future Value of Annuity Calculator › FVA-TEST-E2E-1: user journey and results (3.6s)
  ✓   36 [chromium] › tests_specs/finance/future-value-of-annuity_release/seo.calc.spec.js:4:3 › Future Value of Annuity Calculator SEO › FVA-TEST-SEO-1: metadata, structured data, sitemap (2.7s)
  ✘   33 [chromium] › tests_specs/finance/future-value-of-annuity_release/cwv.calc.spec.js:7:3 › finance/future-value-of-annuity cwv guard › calculator route satisfies CLS/LCP thresholds (4.6s)
  -   42 [chromium] › tests_specs/finance/monthly-savings-needed_release/e2e.calc.spec.js:4:8 › finance/monthly-savings-needed e2e scope placeholder › migrated test content pending for /finance-calculators/monthly-savings-needed-calculator/
  ✓   38 [chromium] › tests_specs/finance/investment-growth_release/seo.calc.spec.js:4:3 › Investment Growth Calculator SEO › IG-TEST-SEO-1: metadata, structured data, sitemap (2.5s)
  ✓   37 [chromium] › tests_specs/finance/investment-growth_release/e2e.calc.spec.js:8:3 › Investment Growth Calculator › IG-TEST-E2E-1: user journey and results (2.8s)
  ✓   39 [chromium] › tests_specs/finance/investment-return_release/seo.calc.spec.js:4:3 › Investment Return Calculator SEO › IR-SEO-1 metadata, structured data, and sitemap (2.2s)
  ✓   44 [chromium] › tests_specs/finance/present-value_release/e2e.calc.spec.js:21:3 › Present Value Calculator › PV-TEST-E2E-1: user journey and results (3.3s)
  ✓   47 [chromium] › tests_specs/finance/present-value_release/seo.calc.spec.js:4:3 › Present Value Calculator SEO › PV-TEST-SEO-1: metadata, structured data, sitemap (2.8s)
  ✓   48 [chromium] › tests_specs/finance/monthly-savings-needed_release/seo.calc.spec.js:4:3 › Monthly Savings Needed Calculator SEO › MSN-TEST-SEO-1: metadata, structured data, sitemap (2.7s)
  ✘   40 [chromium] › tests_specs/finance/investment-growth_release/cwv.calc.spec.js:7:3 › finance/investment-growth cwv guard › calculator route satisfies CLS/LCP thresholds (5.0s)
  ✘   41 [chromium] › tests_specs/finance/monthly-savings-needed_release/cwv.calc.spec.js:7:3 › finance/monthly-savings-needed cwv guard › calculator route satisfies CLS/LCP thresholds (4.7s)
  ✓   46 [chromium] › tests_specs/finance/investment-return_release/e2e.calc.spec.js:10:3 › Investment Return Calculator › IR-E2E-1 core flow, advanced mode, table/graph toggles, and button-only behavior (5.0s)
  ✘   43 [chromium] › tests_specs/finance/present-value_release/cwv.calc.spec.js:7:3 › finance/present-value cwv guard › calculator route satisfies CLS/LCP thresholds (5.0s)
  ✘   45 [chromium] › tests_specs/finance/investment-return_release/cwv.calc.spec.js:7:3 › finance/investment-return cwv guard › calculator route satisfies CLS/LCP thresholds (4.9s)
  -   53 [chromium] › tests_specs/finance/time-to-savings-goal_release/e2e.calc.spec.js:4:8 › finance/time-to-savings-goal e2e scope placeholder › migrated test content pending for /finance-calculators/time-to-savings-goal-calculator/
  ✓   50 [chromium] › tests_specs/finance/present-value-of-annuity_release/e2e.calc.spec.js:21:3 › Present Value of Annuity Calculator › PVA-TEST-E2E-1: user journey and results (3.2s)
  -   54 [chromium] › tests_specs/infrastructure/e2e/above-the-fold-mutation.spec.js:19:3 › Above-the-fold mutation guard › Above-the-fold mutation guard
  -   55 [chromium] › tests_specs/infrastructure/e2e/accessibility-ux.spec.js:19:3 › Accessibility UX guard › Keyboard traversal + focus visibility
  -   56 [chromium] › tests_specs/infrastructure/e2e/accessibility-ux.spec.js:38:3 › Accessibility UX guard › Results live region present
  -   57 [chromium] › tests_specs/infrastructure/e2e/accessibility-ux.spec.js:45:3 › Accessibility UX guard › 200% zoom layout sanity (no horizontal overflow)
  ✓   51 [chromium] › tests_specs/finance/present-value-of-annuity_release/seo.calc.spec.js:4:3 › Present Value of Annuity Calculator SEO › PVA-TEST-SEO-1: metadata, structured data, sitemap (2.4s)
  ✓   52 [chromium] › tests_specs/finance/simple-interest_release/seo.calc.spec.js:4:3 › Simple Interest Calculator SEO › SI-TEST-SEO-1: metadata, structured data, sitemap (2.2s)
  ✘   49 [chromium] › tests_specs/finance/present-value-of-annuity_release/cwv.calc.spec.js:7:3 › finance/present-value-of-annuity cwv guard › calculator route satisfies CLS/LCP thresholds (4.1s)
  ✓   64 [chromium] › tests_specs/infrastructure/e2e/gtep-pages-seo.spec.js:59:3 › Privacy page metadata (1.5s)
  ✓   63 [chromium] › tests_specs/finance/time-to-savings-goal_release/seo.calc.spec.js:4:3 › Time to Savings Goal Calculator SEO › TSG-TEST-SEO-1: metadata, structured data, sitemap (2.3s)
  ✓   60 [chromium] › tests_specs/finance/simple-interest_release/e2e.calc.spec.js:8:3 › Simple Interest Calculator › SI-TEST-E2E-1: user journey and calculation output (2.9s)
  ✓   65 [chromium] › tests_specs/infrastructure/e2e/gtep-pages-seo.spec.js:59:3 › Contact page metadata (1.0s)
  ✓   59 [chromium] › tests_specs/finance/simple-interest_release/cwv.calc.spec.js:7:3 › finance/simple-interest cwv guard › calculator route satisfies CLS/LCP thresholds (3.8s)
  ✓   67 [chromium] › tests_specs/infrastructure/e2e/gtep-pages.spec.js:11:3 › Privacy page uses GTEP layout (1.3s)
  ✓   69 [chromium] › tests_specs/infrastructure/e2e/gtep-pages.spec.js:11:3 › Terms page uses GTEP layout (1.3s)
  ✓   68 [chromium] › tests_specs/infrastructure/e2e/gtep-pages-seo.spec.js:59:3 › Terms page metadata (1.3s)
  ✘   61 [chromium] › tests_specs/finance/time-to-savings-goal_release/cwv.calc.spec.js:7:3 › finance/time-to-savings-goal cwv guard › calculator route satisfies CLS/LCP thresholds (4.3s)
  ✓   70 [chromium] › tests_specs/infrastructure/e2e/gtep-pages.spec.js:11:3 › Contact page uses GTEP layout (1.1s)
  ✓   71 [chromium] › tests_specs/infrastructure/e2e/gtep-pages.spec.js:11:3 › FAQs page uses GTEP layout (1.1s)
  -   75 [chromium] › tests_specs/infrastructure/e2e/interaction-guard.spec.js:19:3 › Interaction guard › Long task guard during interaction
  -   76 [chromium] › tests_specs/infrastructure/e2e/interaction-guard.spec.js:104:3 › Interaction guard › Interaction latency proxy (<200ms)
  -   77 [chromium] › tests_specs/infrastructure/e2e/interaction-guard.spec.js:193:3 › Interaction guard › Nav click stability (no layout jumps)
  ✘   58 [chromium] › tests_specs/infrastructure/e2e/button-only-recalc-finance-percentage.spec.js:152:3 › Button-Only Recalculation (Finance + Percentage) › BTN-ONLY-E2E-1: all target calculators update only after Calculate click (6.0s)
  ✓   72 [chromium] › tests_specs/infrastructure/e2e/home-shell.spec.js:4:3 › Official standalone homepage › HOME-MOBILE-001: mobile viewport uses compact cards and disables particle canvas (1.5s)
  ✓   73 [chromium] › tests_specs/infrastructure/e2e/home-shell.spec.js:26:3 › Official standalone homepage › HOME-ISS-001: root route renders standalone cluster cards without calculator shell panes (2.1s)
  ✓   74 [chromium] › tests_specs/infrastructure/e2e/home-shell.spec.js:116:3 › Official standalone homepage › HOME-SEO-002: /calculators/?q= query contract filters results and handles empty matches (2.0s)
  ✓   80 [chromium] › tests_specs/infrastructure/e2e/home-shell.spec.js:80:3 › Official standalone homepage › HOME-SEO-001: homepage has Organization/WebSite/WebPage JSON-LD with SearchAction and no FAQPage (2.4s)
  ✘   66 [chromium] › tests_specs/infrastructure/e2e/gtep-pages-seo.spec.js:59:3 › FAQs page metadata (7.2s)
  ✓   78 [chromium] › tests_specs/infrastructure/e2e/iss/iss-nav-top-001.spec.js:3:1 › ISS-NAV-TOP-001: Top Navigation Visual Regression Contract (6.1s)
  ✓   84 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:126:3 › ISS-001: Layout Stability › scrollbars remain visible during navigation (3.1s)
  ✓   79 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:69:3 › ISS-001: Layout Stability › left navigation pane has stable dimensions during navigation (10.4s)
  ✓   82 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:107:3 › ISS-001: Layout Stability › ads column has stable dimensions during navigation (10.4s)
  -   89 [chromium] › tests_specs/infrastructure/e2e/mobile-ux.spec.js:47:3 › Mobile UX guard › mobile viewport screenshot
  -   90 [chromium] › tests_specs/infrastructure/e2e/mobile-ux.spec.js:62:3 › Mobile UX guard › tap targets are at least 48x48
  ✓   81 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:88:3 › ISS-001: Layout Stability › center column has stable dimensions during navigation (11.1s)
  ✓   91 [chromium] › tests_specs/infrastructure/e2e/route-archetype-contract.spec.js:19:1 › ROUTE-ARCHETYPE-001: all navigation calculators declare archetype/family/layout metadata (599ms)
  ✓   87 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:150:3 › ISS-001: Layout Stability › buttons do not have transform transitions (4.8s)
  ✓   83 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:47:3 › ISS-001: Layout Stability › page shell maintains fixed dimensions during navigation (11.0s)
  ✓   85 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:170:3 › ISS-001: Layout Stability › no layout shift when clicking nav items rapidly (7.8s)
  ✓   95 [chromium] › tests_specs/infrastructure/e2e/sitemap-seo.spec.js:4:3 › Sitemap page SEO baseline › SITEMAP-SEO-1: sitemap xml is reachable and contains canonical URLs (506ms)
  ✓   93 [chromium] › tests_specs/infrastructure/e2e/route-archetype-contract.spec.js:92:1 › ROUTE-ARCHETYPE-003: home route is content_shell with neutral design family (2.2s)
  ✓   86 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:188:3 › ISS-001: Layout Stability › category switching does not cause layout shift (10.0s)
  ✘   88 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:235:3 › ISS-001: Layout Stability › visual regression - page layout stability (5.7s)
  ✓   97 [chromium] › tests_specs/loans/buy-to-let_release/e2e.calc.spec.js:46:3 › Buy-to-Let calculator requirements › BTL-TEST-E2E-1: deposit type shows only selected slider input (4.1s)
  ✓   98 [chromium] › tests_specs/loans/buy-to-let_release/e2e.calc.spec.js:62:3 › Buy-to-Let calculator requirements › BTL-TEST-E2E-2: deposit slider displays update and amount max tracks property price (3.5s)
  ✘   96 [chromium] › tests_specs/loans/buy-to-let_release/cwv.calc.spec.js:7:3 › loans/buy-to-let cwv guard › calculator route satisfies CLS/LCP thresholds (5.2s)
  -  103 [chromium] › tests_specs/loans/buy-to-let_release/seo.calc.spec.js:4:8 › loans/buy-to-let seo scope placeholder › migrated SEO content pending for /loan-calculators/buy-to-let-mortgage-calculator/
  ✓   99 [chromium] › tests_specs/loans/buy-to-let_release/e2e.calc.spec.js:82:3 › Buy-to-Let calculator requirements › BTL-TEST-E2E-3: selected deposit mode drives calculation and syncs inactive control (4.0s)
  ✓  101 [chromium] › tests_specs/loans/buy-to-let_release/e2e.calc.spec.js:149:3 › Buy-to-Let calculator requirements › BTL-TEST-E2E-5: single-pane structure and labels (2.8s)
  ✘   92 [chromium] › tests_specs/infrastructure/e2e/route-archetype-contract.spec.js:40:1 › ROUTE-ARCHETYPE-002: generated body metadata and pane presence match metadata contract (7.5s)
  ✘   94 [chromium] › tests_specs/infrastructure/e2e/sitemap-footer.spec.js:4:3 › Sitemap footer link › SITEMAP-TEST-E2E-1: footer link navigates to sitemap page (8.2s)
  ✓  100 [chromium] › tests_specs/loans/buy-to-let_release/e2e.calc.spec.js:132:3 › Buy-to-Let calculator requirements › BTL-TEST-E2E-4: full user journey with rent increase (4.4s)
  ✓  105 [chromium] › tests_specs/loans/car-loan_release/seo.calc.spec.js:4:3 › Car Loan Calculator SEO › CAR-LOAN-TEST-SEO-1: metadata, headings, FAQ schema, sitemap (3.6s)
  ✓  104 [chromium] › tests_specs/loans/car-loan_release/e2e.calc.spec.js:21:3 › Car Loan Calculator › CAR-LOAN-E2E-1: premium single pane with button-only recalculation and schedule toggles (4.0s)
  ✓  107 [chromium] › tests_specs/loans/cluster_release/seo.cluster.spec.js:6:3 › loans cluster seo smoke › representative route has canonical/title/robots (3.0s)
  ✓  102 [chromium] › tests_specs/loans/buy-to-let_release/e2e.calc.spec.js:105:3 › Buy-to-Let calculator requirements › BTL-TEST-I-1: table updates when rent increase toggles (6.0s)
  ✓  106 [chromium] › tests_specs/loans/car-loan_release/cwv.calc.spec.js:7:3 › loans/car-loan cwv guard › calculator route satisfies CLS/LCP thresholds (4.4s)
  ✓  109 [chromium] › tests_specs/loans/hire-purchase_release/cwv.calc.spec.js:7:3 › loans/hire-purchase cwv guard › calculator route satisfies CLS/LCP thresholds (4.6s)
  ✓  112 [chromium] › tests_specs/loans/hire-purchase_release/seo.calc.spec.js:4:3 › Hire Purchase Calculator SEO › HIRE-PURCHASE-SEO-1: metadata, heading, FAQ schema, sitemap (3.8s)
  ✓  111 [chromium] › tests_specs/loans/hire-purchase_release/e2e.calc.spec.js:21:3 › Hire Purchase Calculator › HIRE-PURCHASE-E2E-1: premium single pane, button-only calculate, and full outputs (5.1s)
  ✓  110 [chromium] › tests_specs/loans/cluster_release/e2e.cluster.spec.js:14:3 › loans cluster e2e smoke › cluster representative routes load with visible H1 and no console errors (5.9s)
  ✓  113 [chromium] › tests_specs/loans/home-loan_release/cwv.calc.spec.js:7:3 › loans/home-loan cwv guard › calculator route satisfies CLS/LCP thresholds (5.1s)
  ✓  114 [chromium] › tests_specs/loans/home-loan_release/e2e.calc.spec.js:9:3 › Home Loan calculator › HOME-LOAN-TEST-E2E-1: calculates and populates merged snapshot outputs (6.9s)
  ✓  116 [chromium] › tests_specs/loans/home-loan_release/e2e.calc.spec.js:88:3 › Home Loan calculator › HOME-LOAN-TEST-E2E-3: renders as single center panel with aligned advanced fields (5.0s)
  ✓  115 [chromium] › tests_specs/loans/home-loan_release/e2e.calc.spec.js:65:3 › Home Loan calculator › HOME-LOAN-TEST-E2E-2: view toggle switches table visibility and header remains sticky (5.1s)
  ✓  117 [chromium] › tests_specs/loans/home-loan_release/seo.calc.spec.js:4:3 › Home Loan calculator SEO › HOME-LOAN-TEST-SEO-1: metadata, schema parity, sitemap, and intent block order (4.5s)
  ✓  119 [chromium] › tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js:66:3 › How Much Can I Borrow Calculator Requirements › BOR-TEST-E2E-1: single-pane layout with no horizontal overflow (4.2s)
  ✓  118 [chromium] › tests_specs/loans/how-much-can-i-borrow_release/cwv.calc.spec.js:7:3 › loans/how-much-can-i-borrow cwv guard › calculator route satisfies CLS/LCP thresholds (4.7s)
  ✘  108 [chromium] › tests_specs/loans/cluster_release/cwv.cluster.spec.js:7:3 › loans cluster cwv guard › cluster routes satisfy CLS/LCP thresholds (11.6s)
  ✓  120 [chromium] › tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js:96:3 › How Much Can I Borrow Calculator Requirements › BOR-TEST-E2E-2: affordability method toggles guided rows (4.4s)
  ✓  123 [chromium] › tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js:158:3 › How Much Can I Borrow Calculator Requirements › BOR-TEST-E2E-5: complete user workflow payment-to-income (4.8s)
  ✓  122 [chromium] › tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js:143:3 › How Much Can I Borrow Calculator Requirements › BOR-TEST-E2E-4: complete user workflow with income multiple (4.9s)
  ✓  121 [chromium] › tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js:117:3 › How Much Can I Borrow Calculator Requirements › BOR-TEST-E2E-3: no currency symbols in results or displays (5.3s)
  ✓  124 [chromium] › tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js:177:3 › How Much Can I Borrow Calculator Requirements › BOR-TEST-E2E-6: error state handling (4.6s)
  ✓  125 [chromium] › tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js:189:3 › How Much Can I Borrow Calculator Requirements › BOR-TEST-E2E-7: layout stability after calculate and method switch (5.1s)
  ✓  128 [chromium] › tests_specs/loans/how-much-can-i-borrow_release/seo.calc.spec.js:4:3 › How Much Can I Borrow Calculator SEO › BOR-TEST-SEO-1: metadata, schema, FAQ parity, sitemap (3.7s)
  ✓  126 [chromium] › tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js:225:3 › How Much Can I Borrow Calculator Requirements › BOR-TEST-E2E-9: scenario table renders with highlighted current rate (5.1s)
  ✓  127 [chromium] › tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js:263:3 › How Much Can I Borrow Calculator Requirements › BOR-TEST-E2E-10: 10 FAQ cards in grid layout (4.5s)
  ✓  130 [chromium] › tests_specs/loans/interest-rate-change-calculator_release/e2e.calc.spec.js:27:3 › Interest Rate Change calculator implementation › RATE-CHANGE-CALC-1: slider badges update live as inputs change (4.3s)
  ✓  129 [chromium] › tests_specs/loans/interest-rate-change-calculator_release/cwv.calc.spec.js:7:3 › loans/interest-rate-change-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (5.1s)
  ✓  132 [chromium] › tests_specs/loans/interest-rate-change-calculator_release/e2e.calc.spec.js:39:3 › Interest Rate Change calculator implementation › RATE-CHANGE-CALC-2: after-months slider reveals and display updates with timing toggle (4.2s)
  ✓  131 [chromium] › tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js:204:3 › How Much Can I Borrow Calculator Requirements › BOR-TEST-E2E-8: capacity bar renders segments after calculation (5.0s)
  -  139 [chromium] › tests_specs/loans/interest-rate-change-calculator_release/seo.calc.spec.js:4:8 › loans/interest-rate-change-calculator seo scope placeholder › migrated SEO content pending for /loan-calculators/interest-rate-change-calculator/
  ✓  135 [chromium] › tests_specs/loans/interest-rate-change-calculator_release/e2e.calc.spec.js:84:3 › Interest Rate Change calculator implementation › RATE-CHANGE-CALC-5: FAQ count and layout stability on mobile (4.1s)
  ✓  134 [chromium] › tests_specs/loans/interest-rate-change-calculator_release/e2e.calc.spec.js:72:3 › Interest Rate Change calculator implementation › RATE-CHANGE-CALC-4: table views both render rows and toggle visibility (4.8s)
  ✓  133 [chromium] › tests_specs/loans/interest-rate-change-calculator_release/e2e.calc.spec.js:49:3 › Interest Rate Change calculator implementation › RATE-CHANGE-CALC-3: calculate fills snapshot and explanation lifetime totals (5.1s)
  ✓  136 [chromium] › tests_specs/loans/interest-rate-change-calculator_release/e2e.calc.spec.js:97:3 › Interest Rate Change calculator route contract › RATE-CHANGE-E2E-1: single-pane route with slider inputs and timing toggle behavior (4.5s)
  ✓  138 [chromium] › tests_specs/loans/interest-rate-change-calculator_release/e2e.calc.spec.js:151:3 › Interest Rate Change calculator route contract › RATE-CHANGE-E2E-3: monthly/yearly table toggle, sticky headers, FAQ count, and no overflow (4.4s)
  ✓  137 [chromium] › tests_specs/loans/interest-rate-change-calculator_release/e2e.calc.spec.js:122:3 › Interest Rate Change calculator route contract › RATE-CHANGE-E2E-2: calculation populates cards, summary, and yearly table by default (4.9s)
  -  146 [chromium] › tests_specs/loans/loan-to-value_release/seo.calc.spec.js:4:8 › loans/loan-to-value seo scope placeholder › migrated SEO content pending for /loan-calculators/ltv-calculator/
  ✓  140 [chromium] › tests_specs/loans/leasing-calculator_release/cwv.calc.spec.js:7:3 › loans/leasing-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.8s)
  ✓  144 [chromium] › tests_specs/loans/loan-to-value_release/e2e.calc.spec.js:14:3 › Loan-to-Value calculator route contract › LTV-E2E-1: single-pane route with merged calculator and explanation (3.0s)
  ✓  142 [chromium] › tests_specs/loans/leasing-calculator_release/seo.calc.spec.js:4:3 › Leasing Calculator SEO › LEASING-SEO-1: metadata, heading, FAQ schema, sitemap (3.7s)
  ✓  145 [chromium] › tests_specs/loans/loan-to-value_release/e2e.calc.spec.js:27:3 › Loan-to-Value calculator route contract › LTV-E2E-2: calculates outputs and toggles LTV table views (4.0s)
  ✓  143 [chromium] › tests_specs/loans/loan-to-value_release/cwv.calc.spec.js:7:3 › loans/loan-to-value cwv guard › calculator route satisfies CLS/LCP thresholds (4.9s)
  ✓  141 [chromium] › tests_specs/loans/leasing-calculator_release/e2e.calc.spec.js:21:3 › Leasing Calculator › LEASING-E2E-1: premium single pane with button-only recalculation, 3-way table toggle, and full outputs (5.7s)
  ✓  147 [chromium] › tests_specs/loans/multiple-car-loan_release/cwv.calc.spec.js:7:3 › loans/multiple-car-loan cwv guard › calculator route satisfies CLS/LCP thresholds (4.4s)
  ✓  148 [chromium] › tests_specs/loans/multiple-car-loan_release/e2e.calc.spec.js:21:3 › Multiple Car Loan Calculator › MULTI-CAR-LOAN-E2E-1: premium single pane with button-only recalculation and full outputs (4.4s)
  ✓  149 [chromium] › tests_specs/loans/multiple-car-loan_release/seo.calc.spec.js:4:3 › Multiple Car Loan Calculator SEO › MULTI-CAR-LOAN-SEO-1: metadata, heading, FAQ schema, sitemap (3.4s)
  ✓  150 [chromium] › tests_specs/loans/offset-calculator_release/cwv.calc.spec.js:7:3 › loans/offset-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.9s)
  ✓  151 [chromium] › tests_specs/loans/offset-calculator_release/e2e.calc.spec.js:40:3 › Offset Calculator Home-Loan Visual Standard › OFFSET-HYBRID-1: renders as single pane without shell Explanation heading (4.1s)
  ✓  152 [chromium] › tests_specs/loans/offset-calculator_release/e2e.calc.spec.js:52:3 › Offset Calculator Home-Loan Visual Standard › OFFSET-HYBRID-2: slider displays update live and mode toggle remains available (4.8s)
  ✓  153 [chromium] › tests_specs/loans/offset-calculator_release/e2e.calc.spec.js:69:3 › Offset Calculator Home-Loan Visual Standard › OFFSET-HYBRID-3: calculate populates result, summary, and snapshot values (5.2s)
  ✓  154 [chromium] › tests_specs/loans/offset-calculator_release/e2e.calc.spec.js:83:3 › Offset Calculator Home-Loan Visual Standard › OFFSET-HYBRID-4: partial mode changes effective balance relative to full mode (5.5s)
  ✓  155 [chromium] › tests_specs/loans/offset-calculator_release/e2e.calc.spec.js:98:3 › Offset Calculator Home-Loan Visual Standard › OFFSET-HYBRID-5: donut and lifetime totals populate from offset data (5.5s)
  -  162 [chromium] › tests_specs/loans/offset-calculator_release/seo.calc.spec.js:4:8 › loans/offset-calculator seo scope placeholder › migrated SEO content pending for /loan-calculators/offset-mortgage-calculator/
  ✓  157 [chromium] › tests_specs/loans/offset-calculator_release/e2e.calc.spec.js:132:3 › Offset Calculator Home-Loan Visual Standard › OFFSET-HYBRID-7: FAQ section contains 10 cards (3.7s)
  ✓  156 [chromium] › tests_specs/loans/offset-calculator_release/e2e.calc.spec.js:114:3 › Offset Calculator Home-Loan Visual Standard › OFFSET-HYBRID-6: monthly/yearly table toggle works and headers are sticky (5.7s)
  ✓  159 [chromium] › tests_specs/loans/offset-calculator_release/e2e.calc.spec.js:147:3 › Offset Calculator Home-Loan Visual Standard › OFFSET-HYBRID-9: no horizontal overflow on desktop and mobile (4.0s)
  ✓  158 [chromium] › tests_specs/loans/offset-calculator_release/e2e.calc.spec.js:138:3 › Offset Calculator Home-Loan Visual Standard › OFFSET-HYBRID-8: output text excludes currency symbols (4.9s)
  ✓  160 [chromium] › tests_specs/loans/offset-calculator_release/e2e.calc.spec.js:156:3 › Offset Calculator Home-Loan Visual Standard › OFFSET-HYBRID-10: validation error appears for zero balance (4.0s)
  ✓  165 [chromium] › tests_specs/loans/pcp-calculator_release/seo.calc.spec.js:4:3 › PCP Calculator SEO › PCP-SEO-1: metadata, heading, FAQ schema, sitemap (3.6s)
  ✓  163 [chromium] › tests_specs/loans/pcp-calculator_release/cwv.calc.spec.js:7:3 › loans/pcp-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.7s)
  ✓  161 [chromium] › tests_specs/loans/offset-calculator_release/e2e.calc.spec.js:170:3 › Offset calculator route contract › ISS-OFFSET-HOMELOAN-VISUAL: single-pane route and interaction contract (5.3s)
  ✓  164 [chromium] › tests_specs/loans/pcp-calculator_release/e2e.calc.spec.js:21:3 › PCP Calculator › PCP-E2E-1: premium single pane with button-only recalculation, 3-way table toggle, and full outputs (5.3s)
  ✓  167 [chromium] › tests_specs/loans/remortgage-switching_release/e2e.calc.spec.js:44:3 › Remortgage / Switching Hybrid Requirements › REMO-HYBRID-1: renders as single pane without Explanation heading (4.1s)
  ✓  168 [chromium] › tests_specs/loans/remortgage-switching_release/e2e.calc.spec.js:69:3 › Remortgage / Switching Hybrid Requirements › REMO-HYBRID-2: removes Additional Fees and uses horizon slider with yearly ticks (3.5s)
  ✘  166 [chromium] › tests_specs/loans/remortgage-switching_release/cwv.calc.spec.js:7:3 › loans/remortgage-switching cwv guard › calculator route satisfies CLS/LCP thresholds (5.3s)
  ✓  169 [chromium] › tests_specs/loans/remortgage-switching_release/e2e.calc.spec.js:85:3 › Remortgage / Switching Hybrid Requirements › REMO-HYBRID-3: calculates and fills all snapshot metrics (4.6s)
  ✓  170 [chromium] › tests_specs/loans/remortgage-switching_release/e2e.calc.spec.js:96:3 › Remortgage / Switching Hybrid Requirements › REMO-HYBRID-4: output text and table values contain no currency symbols (4.5s)
  ✓  174 [chromium] › tests_specs/loans/remortgage-switching_release/e2e.calc.spec.js:154:3 › Remortgage / Switching Hybrid Requirements › REMO-HYBRID-8: FAQ section has 10 Signal Arc style cards (3.2s)
  -  177 [chromium] › tests_specs/loans/remortgage-switching_release/seo.calc.spec.js:4:8 › loans/remortgage-switching seo scope placeholder › migrated SEO content pending for /loan-calculators/remortgage-calculator/
  ✓  171 [chromium] › tests_specs/loans/remortgage-switching_release/e2e.calc.spec.js:113:3 › Remortgage / Switching Hybrid Requirements › REMO-HYBRID-5: horizon slider updates display and monthly row count (4.9s)
  -  179 [chromium] › tests_specs/math/anova_release/e2e.calc.spec.js:4:8 › math/anova e2e scope placeholder › migrated test content pending for /math/statistics/anova/
  -  180 [chromium] › tests_specs/math/anova_release/seo.calc.spec.js:4:8 › math/anova seo scope placeholder › migrated SEO content pending for /math/statistics/anova/
  ✓  173 [chromium] › tests_specs/loans/remortgage-switching_release/e2e.calc.spec.js:143:3 › Remortgage / Switching Hybrid Requirements › REMO-HYBRID-7: validation rejects invalid values with errors (3.8s)
  -  182 [chromium] › tests_specs/math/basic_release/e2e.calc.spec.js:4:8 › math/basic e2e scope placeholder › migrated test content pending for /math/basic/
  -  183 [chromium] › tests_specs/math/basic_release/seo.calc.spec.js:4:8 › math/basic seo scope placeholder › migrated SEO content pending for /math/basic/
  ✓  172 [chromium] › tests_specs/loans/remortgage-switching_release/e2e.calc.spec.js:129:3 › Remortgage / Switching Hybrid Requirements › REMO-HYBRID-6: table toggle switches monthly and yearly views (4.4s)
  ✓  176 [chromium] › tests_specs/loans/remortgage-switching_release/e2e.calc.spec.js:190:3 › Remortgage / Switching Hybrid › ISS-REMORT-HYBRID: single-pane ownership and interaction contract (4.2s)
  ✓  185 [chromium] › tests_specs/math/cluster_release/e2e.cluster.spec.js:6:3 › math cluster e2e smoke › cluster representative routes load and show H1 (3.2s)
  ✓  175 [chromium] › tests_specs/loans/remortgage-switching_release/e2e.calc.spec.js:174:3 › Remortgage / Switching Hybrid Requirements › REMO-HYBRID-10: layout remains stable after calculate and table view switching (4.7s)
  -  189 [chromium] › tests_specs/math/common-log_release/e2e.calc.spec.js:4:8 › math/common-log e2e scope placeholder › migrated test content pending for /math/log/common-log/
  -  190 [chromium] › tests_specs/math/common-log_release/seo.calc.spec.js:4:8 › math/common-log seo scope placeholder › migrated SEO content pending for /math/log/common-log/
  ✓  181 [chromium] › tests_specs/math/basic_release/cwv.calc.spec.js:7:3 › math/basic cwv guard › calculator route satisfies CLS/LCP thresholds (4.1s)
  -  192 [chromium] › tests_specs/math/confidence-interval_release/e2e.calc.spec.js:4:8 › math/confidence-interval e2e scope placeholder › migrated test content pending for /math/confidence-interval/
  -  193 [chromium] › tests_specs/math/confidence-interval_release/seo.calc.spec.js:4:8 › math/confidence-interval seo scope placeholder › migrated SEO content pending for /math/confidence-interval/
  ✓  178 [chromium] › tests_specs/math/anova_release/cwv.calc.spec.js:7:3 › math/anova cwv guard › calculator route satisfies CLS/LCP thresholds (4.7s)
  -  195 [chromium] › tests_specs/math/correlation_release/e2e.calc.spec.js:4:8 › math/correlation e2e scope placeholder › migrated test content pending for /math/statistics/correlation/
  -  196 [chromium] › tests_specs/math/correlation_release/seo.calc.spec.js:4:8 › math/correlation seo scope placeholder › migrated SEO content pending for /math/statistics/correlation/
  ✓  186 [chromium] › tests_specs/loans/remortgage-switching_release/e2e.calc.spec.js:162:3 › Remortgage / Switching Hybrid Requirements › REMO-HYBRID-9: heading is centered and layout has no horizontal overflow (3.7s)
  -  198 [chromium] › tests_specs/math/critical-points_release/e2e.calc.spec.js:4:8 › math/critical-points e2e scope placeholder › migrated test content pending for /math/calculus/critical-points/
  -  199 [chromium] › tests_specs/math/critical-points_release/seo.calc.spec.js:4:8 › math/critical-points seo scope placeholder › migrated SEO content pending for /math/calculus/critical-points/
  ✓  187 [chromium] › tests_specs/math/cluster_release/seo.cluster.spec.js:6:3 › math cluster seo smoke › representative route has canonical/title/robots (1.8s)
  -  201 [chromium] › tests_specs/math/derivative_release/e2e.calc.spec.js:4:8 › math/derivative e2e scope placeholder › migrated test content pending for /math/calculus/derivative/
  -  202 [chromium] › tests_specs/math/derivative_release/seo.calc.spec.js:4:8 › math/derivative seo scope placeholder › migrated SEO content pending for /math/calculus/derivative/
  ✓  188 [chromium] › tests_specs/math/common-log_release/cwv.calc.spec.js:7:3 › math/common-log cwv guard › calculator route satisfies CLS/LCP thresholds (4.0s)
  -  204 [chromium] › tests_specs/math/distribution_release/e2e.calc.spec.js:4:8 › math/distribution e2e scope placeholder › migrated test content pending for /math/statistics/distribution/
  -  205 [chromium] › tests_specs/math/distribution_release/seo.calc.spec.js:4:8 › math/distribution seo scope placeholder › migrated SEO content pending for /math/statistics/distribution/
  ✓  191 [chromium] › tests_specs/math/confidence-interval_release/cwv.calc.spec.js:7:3 › math/confidence-interval cwv guard › calculator route satisfies CLS/LCP thresholds (3.9s)
  -  207 [chromium] › tests_specs/math/exponential-equations_release/e2e.calc.spec.js:4:8 › math/exponential-equations e2e scope placeholder › migrated test content pending for /math/log/exponential-equations/
  -  208 [chromium] › tests_specs/math/exponential-equations_release/seo.calc.spec.js:4:8 › math/exponential-equations seo scope placeholder › migrated SEO content pending for /math/log/exponential-equations/
  ✓  194 [chromium] › tests_specs/math/correlation_release/cwv.calc.spec.js:7:3 › math/correlation cwv guard › calculator route satisfies CLS/LCP thresholds (4.3s)
  ✓  197 [chromium] › tests_specs/math/critical-points_release/cwv.calc.spec.js:7:3 › math/critical-points cwv guard › calculator route satisfies CLS/LCP thresholds (4.1s)
  ✓  200 [chromium] › tests_specs/math/derivative_release/cwv.calc.spec.js:7:3 › math/derivative cwv guard › calculator route satisfies CLS/LCP thresholds (4.0s)
  ✓  184 [chromium] › tests_specs/math/cluster_release/cwv.cluster.spec.js:7:3 › math cluster cwv guard › cluster routes satisfy CLS/LCP thresholds (9.2s)
  ✓  203 [chromium] › tests_specs/math/distribution_release/cwv.calc.spec.js:7:3 › math/distribution cwv guard › calculator route satisfies CLS/LCP thresholds (4.6s)
  -  214 [chromium] › tests_specs/math/fraction-calculator_release/e2e.calc.spec.js:4:8 › math/fraction-calculator e2e scope placeholder › migrated test content pending for /math/fraction-calculator/
  -  215 [chromium] › tests_specs/math/fraction-calculator_release/seo.calc.spec.js:4:8 › math/fraction-calculator seo scope placeholder › migrated SEO content pending for /math/fraction-calculator/
  ✓  211 [chromium] › tests_specs/math/factoring_release/e2e.calc.spec.js:28:3 › math/factoring e2e › invalid expression error state clears snapshot values deterministically (2.1s)
  -  217 [chromium] › tests_specs/math/hypothesis-testing_release/e2e.calc.spec.js:4:8 › math/hypothesis-testing e2e scope placeholder › migrated test content pending for /math/statistics/hypothesis-testing/
  -  218 [chromium] › tests_specs/math/hypothesis-testing_release/seo.calc.spec.js:4:8 › math/hypothesis-testing seo scope placeholder › migrated SEO content pending for /math/statistics/hypothesis-testing/
  ✓  210 [chromium] › tests_specs/math/factoring_release/e2e.calc.spec.js:4:3 › math/factoring e2e › single-pane rendering, right preview panel, and factoring flow (2.6s)
  -  220 [chromium] › tests_specs/math/integral_release/e2e.calc.spec.js:4:8 › math/integral e2e scope placeholder › migrated test content pending for /math/calculus/integral/
  -  221 [chromium] › tests_specs/math/integral_release/seo.calc.spec.js:4:8 › math/integral seo scope placeholder › migrated SEO content pending for /math/calculus/integral/
  ✓  212 [chromium] › tests_specs/math/factoring_release/seo.calc.spec.js:27:3 › math/factoring seo › metadata, explanation contract, FAQ depth, schema parity, and sitemap (2.2s)
  -  223 [chromium] › tests_specs/math/inverse-trig_release/e2e.calc.spec.js:4:8 › math/inverse-trig e2e scope placeholder › migrated test content pending for /math/trigonometry/inverse-trig/
  -  224 [chromium] › tests_specs/math/inverse-trig_release/seo.calc.spec.js:4:8 › math/inverse-trig seo scope placeholder › migrated SEO content pending for /math/trigonometry/inverse-trig/
  ✓  209 [chromium] › tests_specs/math/factoring_release/cwv.calc.spec.js:7:3 › math/factoring cwv guard › calculator route satisfies CLS/LCP thresholds (3.6s)
  -  226 [chromium] › tests_specs/math/law-of-sines-cosines_release/e2e.calc.spec.js:4:8 › math/law-of-sines-cosines e2e scope placeholder › migrated test content pending for /math/trigonometry/law-of-sines-cosines/
  -  227 [chromium] › tests_specs/math/law-of-sines-cosines_release/seo.calc.spec.js:4:8 › math/law-of-sines-cosines seo scope placeholder › migrated SEO content pending for /math/trigonometry/law-of-sines-cosines/
  ✓  206 [chromium] › tests_specs/math/exponential-equations_release/cwv.calc.spec.js:7:3 › math/exponential-equations cwv guard › calculator route satisfies CLS/LCP thresholds (3.8s)
  -  229 [chromium] › tests_specs/math/limit_release/e2e.calc.spec.js:4:8 › math/limit e2e scope placeholder › migrated test content pending for /math/calculus/limit/
  -  230 [chromium] › tests_specs/math/limit_release/seo.calc.spec.js:4:8 › math/limit seo scope placeholder › migrated SEO content pending for /math/calculus/limit/
  ✓  213 [chromium] › tests_specs/math/fraction-calculator_release/cwv.calc.spec.js:7:3 › math/fraction-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.0s)
  -  232 [chromium] › tests_specs/math/log-properties_release/e2e.calc.spec.js:4:8 › math/log-properties e2e scope placeholder › migrated test content pending for /math/log/log-properties/
  -  233 [chromium] › tests_specs/math/log-properties_release/seo.calc.spec.js:4:8 › math/log-properties seo scope placeholder › migrated SEO content pending for /math/log/log-properties/
  ✓  216 [chromium] › tests_specs/math/hypothesis-testing_release/cwv.calc.spec.js:7:3 › math/hypothesis-testing cwv guard › calculator route satisfies CLS/LCP thresholds (4.6s)
  -  235 [chromium] › tests_specs/math/log-scale_release/e2e.calc.spec.js:4:8 › math/log-scale e2e scope placeholder › migrated test content pending for /math/log/log-scale/
  -  236 [chromium] › tests_specs/math/log-scale_release/seo.calc.spec.js:4:8 › math/log-scale seo scope placeholder › migrated SEO content pending for /math/log/log-scale/
  ✓  219 [chromium] › tests_specs/math/integral_release/cwv.calc.spec.js:7:3 › math/integral cwv guard › calculator route satisfies CLS/LCP thresholds (4.2s)
  -  238 [chromium] › tests_specs/math/mean-median-mode-range_release/e2e.calc.spec.js:4:8 › math/mean-median-mode-range e2e scope placeholder › migrated test content pending for /math/mean-median-mode-range/
  -  239 [chromium] › tests_specs/math/mean-median-mode-range_release/seo.calc.spec.js:4:8 › math/mean-median-mode-range seo scope placeholder › migrated SEO content pending for /math/mean-median-mode-range/
  ✓  222 [chromium] › tests_specs/math/inverse-trig_release/cwv.calc.spec.js:7:3 › math/inverse-trig cwv guard › calculator route satisfies CLS/LCP thresholds (4.2s)
  -  241 [chromium] › tests_specs/math/natural-log_release/e2e.calc.spec.js:4:8 › math/natural-log e2e scope placeholder › migrated test content pending for /math/log/natural-log/
  -  242 [chromium] › tests_specs/math/natural-log_release/seo.calc.spec.js:4:8 › math/natural-log seo scope placeholder › migrated SEO content pending for /math/log/natural-log/
  ✓  225 [chromium] › tests_specs/math/law-of-sines-cosines_release/cwv.calc.spec.js:7:3 › math/law-of-sines-cosines cwv guard › calculator route satisfies CLS/LCP thresholds (4.2s)
  -  243 [chromium] › tests_specs/math/number-sequence_release/e2e.calc.spec.js:4:8 › math/number-sequence e2e scope placeholder › migrated test content pending for /math/number-sequence/
  -  244 [chromium] › tests_specs/math/number-sequence_release/seo.calc.spec.js:4:8 › math/number-sequence seo scope placeholder › migrated SEO content pending for /math/number-sequence/
  ✓  228 [chromium] › tests_specs/math/limit_release/cwv.calc.spec.js:7:3 › math/limit cwv guard › calculator route satisfies CLS/LCP thresholds (3.9s)
  -  247 [chromium] › tests_specs/math/percentage-increase_release/e2e.calc.spec.js:4:8 › math/percentage-increase e2e scope placeholder › migrated test content pending for /percentage-calculators/percentage-increase/
  -  248 [chromium] › tests_specs/math/percentage-increase_release/seo.calc.spec.js:4:8 › math/percentage-increase seo scope placeholder › migrated SEO content pending for /percentage-calculators/percentage-increase/
  ✓  231 [chromium] › tests_specs/math/log-properties_release/cwv.calc.spec.js:7:3 › math/log-properties cwv guard › calculator route satisfies CLS/LCP thresholds (4.0s)
  -  250 [chromium] › tests_specs/math/permutation-combination_release/e2e.calc.spec.js:4:8 › math/permutation-combination e2e scope placeholder › migrated test content pending for /math/permutation-combination/
  -  251 [chromium] › tests_specs/math/permutation-combination_release/seo.calc.spec.js:4:8 › math/permutation-combination seo scope placeholder › migrated SEO content pending for /math/permutation-combination/
  ✘  246 [chromium] › tests_specs/math/percentage-increase_release/cwv.calc.spec.js:7:3 › math/percentage-increase cwv guard › calculator route satisfies CLS/LCP thresholds (1.3s)
  ✓  234 [chromium] › tests_specs/math/log-scale_release/cwv.calc.spec.js:7:3 › math/log-scale cwv guard › calculator route satisfies CLS/LCP thresholds (3.9s)
  ✓  237 [chromium] › tests_specs/math/mean-median-mode-range_release/cwv.calc.spec.js:7:3 › math/mean-median-mode-range cwv guard › calculator route satisfies CLS/LCP thresholds (4.0s)
  ✓  240 [chromium] › tests_specs/math/natural-log_release/cwv.calc.spec.js:7:3 › math/natural-log cwv guard › calculator route satisfies CLS/LCP thresholds (4.0s)
  ✓  252 [chromium] › tests_specs/math/polynomial-operations_release/cwv.calc.spec.js:7:3 › math/polynomial-operations cwv guard › calculator route satisfies CLS/LCP thresholds (3.6s)
  -  257 [chromium] › tests_specs/math/probability_release/e2e.calc.spec.js:4:8 › math/probability e2e scope placeholder › migrated test content pending for /math/probability/
  -  258 [chromium] › tests_specs/math/probability_release/seo.calc.spec.js:4:8 › math/probability seo scope placeholder › migrated SEO content pending for /math/probability/
  ✓  245 [chromium] › tests_specs/math/number-sequence_release/cwv.calc.spec.js:7:3 › math/number-sequence cwv guard › calculator route satisfies CLS/LCP thresholds (4.2s)
  ✓  249 [chromium] › tests_specs/math/permutation-combination_release/cwv.calc.spec.js:7:3 › math/permutation-combination cwv guard › calculator route satisfies CLS/LCP thresholds (4.1s)
  ✓  253 [chromium] › tests_specs/math/polynomial-operations_release/e2e.calc.spec.js:28:3 › math/polynomial-operations e2e › division by zero polynomial shows deterministic error snapshot state (2.1s)
  ✓  255 [chromium] › tests_specs/math/polynomial-operations_release/seo.calc.spec.js:27:3 › math/polynomial-operations seo › metadata, explanation contract, FAQ depth, schema parity, and sitemap (2.9s)
  ✓  261 [chromium] › tests_specs/math/quadratic-equation_release/e2e.calc.spec.js:30:3 › math/quadratic-equation e2e › invalid quadratic input shows deterministic error state (2.5s)
  -  264 [chromium] › tests_specs/math/regression-analysis_release/e2e.calc.spec.js:4:8 › math/regression-analysis e2e scope placeholder › migrated test content pending for /math/statistics/regression-analysis/
  -  265 [chromium] › tests_specs/math/regression-analysis_release/seo.calc.spec.js:4:8 › math/regression-analysis seo scope placeholder › migrated SEO content pending for /math/statistics/regression-analysis/
  ✓  262 [chromium] › tests_specs/math/quadratic-equation_release/seo.calc.spec.js:27:3 › math/quadratic-equation seo › metadata, explanation order, FAQ depth, schema parity, and sitemap (2.5s)
  -  266 [chromium] › tests_specs/math/sample-size_release/e2e.calc.spec.js:4:8 › math/sample-size e2e scope placeholder › migrated test content pending for /math/sample-size/
  -  267 [chromium] › tests_specs/math/sample-size_release/seo.calc.spec.js:4:8 › math/sample-size seo scope placeholder › migrated SEO content pending for /math/sample-size/
  ✓  254 [chromium] › tests_specs/math/polynomial-operations_release/e2e.calc.spec.js:4:3 › math/polynomial-operations e2e › single-pane flow, right preview panel, and addition result (3.5s)
  -  270 [chromium] › tests_specs/math/series-convergence_release/e2e.calc.spec.js:4:8 › math/series-convergence e2e scope placeholder › migrated test content pending for /math/calculus/series-convergence/
  -  271 [chromium] › tests_specs/math/series-convergence_release/seo.calc.spec.js:4:8 › math/series-convergence seo scope placeholder › migrated SEO content pending for /math/calculus/series-convergence/
  ✓  260 [chromium] › tests_specs/math/quadratic-equation_release/e2e.calc.spec.js:4:3 › math/quadratic-equation e2e › single-pane render, right preview panel, and happy-path solve (2.9s)
  ✓  259 [chromium] › tests_specs/math/quadratic-equation_release/cwv.calc.spec.js:7:3 › math/quadratic-equation cwv guard › calculator route satisfies CLS/LCP thresholds (4.0s)
  ✓  256 [chromium] › tests_specs/math/probability_release/cwv.calc.spec.js:7:3 › math/probability cwv guard › calculator route satisfies CLS/LCP thresholds (4.4s)
  ✓  273 [chromium] › tests_specs/math/slope-distance_release/e2e.calc.spec.js:4:3 › math/slope-distance e2e › single-pane render, right preview panel, and main calculation (2.9s)
  ✓  274 [chromium] › tests_specs/math/slope-distance_release/e2e.calc.spec.js:30:3 › math/slope-distance e2e › vertical-line edge case updates deterministic snapshot state (2.3s)
  -  277 [chromium] › tests_specs/math/standard-deviation_release/e2e.calc.spec.js:4:8 › math/standard-deviation e2e scope placeholder › migrated test content pending for /math/standard-deviation/
  -  278 [chromium] › tests_specs/math/standard-deviation_release/seo.calc.spec.js:4:8 › math/standard-deviation seo scope placeholder › migrated SEO content pending for /math/standard-deviation/
  ✓  275 [chromium] › tests_specs/math/slope-distance_release/seo.calc.spec.js:27:3 › math/slope-distance seo › metadata, explanation contract, FAQ depth, schema parity, and sitemap (2.2s)
  -  280 [chromium] › tests_specs/math/statistics_release/e2e.calc.spec.js:4:8 › math/statistics e2e scope placeholder › migrated test content pending for /math/statistics/
  -  281 [chromium] › tests_specs/math/statistics_release/seo.calc.spec.js:4:8 › math/statistics seo scope placeholder › migrated SEO content pending for /math/statistics/
  ✓  272 [chromium] › tests_specs/math/slope-distance_release/cwv.calc.spec.js:7:3 › math/slope-distance cwv guard › calculator route satisfies CLS/LCP thresholds (3.6s)
  ✓  269 [chromium] › tests_specs/math/series-convergence_release/cwv.calc.spec.js:7:3 › math/series-convergence cwv guard › calculator route satisfies CLS/LCP thresholds (3.9s)
  ✓  263 [chromium] › tests_specs/math/regression-analysis_release/cwv.calc.spec.js:7:3 › math/regression-analysis cwv guard › calculator route satisfies CLS/LCP thresholds (4.5s)
  ✓  268 [chromium] › tests_specs/math/sample-size_release/cwv.calc.spec.js:7:3 › math/sample-size cwv guard › calculator route satisfies CLS/LCP thresholds (5.0s)
  ✓  284 [chromium] › tests_specs/math/system-of-equations_release/e2e.calc.spec.js:33:3 › math/system-of-equations e2e › 3x3 mode toggles and snapshot state updates (2.7s)
  -  287 [chromium] › tests_specs/math/triangle-solver_release/e2e.calc.spec.js:4:8 › math/triangle-solver e2e scope placeholder › migrated test content pending for /math/trigonometry/triangle-solver/
  -  288 [chromium] › tests_specs/math/triangle-solver_release/seo.calc.spec.js:4:8 › math/triangle-solver seo scope placeholder › migrated SEO content pending for /math/trigonometry/triangle-solver/
  ✓  285 [chromium] › tests_specs/math/system-of-equations_release/seo.calc.spec.js:27:3 › math/system-of-equations seo › metadata, explanation contract, FAQ depth, schema parity, and sitemap (2.5s)
  -  290 [chromium] › tests_specs/math/trig-functions_release/e2e.calc.spec.js:4:8 › math/trig-functions e2e scope placeholder › migrated test content pending for /math/trigonometry/trig-functions/
  -  291 [chromium] › tests_specs/math/trig-functions_release/seo.calc.spec.js:4:8 › math/trig-functions seo scope placeholder › migrated SEO content pending for /math/trigonometry/trig-functions/
  ✓  283 [chromium] › tests_specs/math/system-of-equations_release/e2e.calc.spec.js:4:3 › math/system-of-equations e2e › single-pane rendering, right preview panel, and 2x2 solve flow (3.5s)
  -  293 [chromium] › tests_specs/math/unit-circle_release/e2e.calc.spec.js:4:8 › math/unit-circle e2e scope placeholder › migrated test content pending for /math/trigonometry/unit-circle/
  -  294 [chromium] › tests_specs/math/unit-circle_release/seo.calc.spec.js:4:8 › math/unit-circle seo scope placeholder › migrated SEO content pending for /math/trigonometry/unit-circle/
  ✓  276 [chromium] › tests_specs/math/standard-deviation_release/cwv.calc.spec.js:7:3 › math/standard-deviation cwv guard › calculator route satisfies CLS/LCP thresholds (4.1s)
  -  295 [chromium] › tests_specs/math/z-score_release/e2e.calc.spec.js:4:8 › math/z-score e2e scope placeholder › migrated test content pending for /math/z-score/
  -  296 [chromium] › tests_specs/math/z-score_release/seo.calc.spec.js:4:8 › math/z-score seo scope placeholder › migrated SEO content pending for /math/z-score/
  ✓  282 [chromium] › tests_specs/math/system-of-equations_release/cwv.calc.spec.js:7:3 › math/system-of-equations cwv guard › calculator route satisfies CLS/LCP thresholds (3.8s)
  ✓  279 [chromium] › tests_specs/math/statistics_release/cwv.calc.spec.js:7:3 › math/statistics cwv guard › calculator route satisfies CLS/LCP thresholds (4.1s)
  ✓  286 [chromium] › tests_specs/math/triangle-solver_release/cwv.calc.spec.js:7:3 › math/triangle-solver cwv guard › calculator route satisfies CLS/LCP thresholds (4.4s)
  ✓  300 [chromium] › tests_specs/percentage/cluster_release/seo.cluster.spec.js:6:3 › percentage cluster seo smoke › representative route has canonical/title/robots (2.3s)
  ✓  289 [chromium] › tests_specs/math/trig-functions_release/cwv.calc.spec.js:7:3 › math/trig-functions cwv guard › calculator route satisfies CLS/LCP thresholds (4.4s)
  ✓  292 [chromium] › tests_specs/math/unit-circle_release/cwv.calc.spec.js:7:3 › math/unit-circle cwv guard › calculator route satisfies CLS/LCP thresholds (4.7s)
  ✓  299 [chromium] › tests_specs/percentage/cluster_release/e2e.cluster.spec.js:18:3 › percentage cluster e2e smoke › cluster representative routes load with visible H1 and no console errors (4.0s)
  -  305 [chromium] › tests_specs/percentage/discount-calculator_release/e2e.calc.spec.js:4:8 › percentage/discount-calculator e2e scope placeholder › migrated test content pending for /percentage-calculators/discount-calculator/
  ✓  297 [chromium] › tests_specs/math/z-score_release/cwv.calc.spec.js:7:3 › math/z-score cwv guard › calculator route satisfies CLS/LCP thresholds (4.3s)
  ✓  301 [chromium] › tests_specs/percentage/commission-calculator_release/cwv.calc.spec.js:7:3 › percentage/commission-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.2s)
  ✓  303 [chromium] › tests_specs/percentage/commission-calculator_release/seo.calc.spec.js:4:3 › Commission Calculator SEO › COMM-TEST-SEO-1: metadata, schema, sitemap (2.8s)
  ✓  302 [chromium] › tests_specs/percentage/commission-calculator_release/e2e.calc.spec.js:8:3 › Commission Calculator › COMM-TEST-E2E-1: flat and tiered commission workflows (4.5s)
  ✓  306 [chromium] › tests_specs/percentage/discount-calculator_release/seo.calc.spec.js:4:3 › Discount Calculator SEO › DISC-TEST-SEO-1: metadata, structured data, sitemap (2.9s)
  -  311 [chromium] › tests_specs/percentage/markup-calculator_release/e2e.calc.spec.js:4:8 › percentage/markup-calculator e2e scope placeholder › migrated test content pending for /percentage-calculators/markup-calculator/
  ✓  304 [chromium] › tests_specs/percentage/discount-calculator_release/cwv.calc.spec.js:7:3 › percentage/discount-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.8s)
  ✓  307 [chromium] › tests_specs/percentage/margin-calculator_release/cwv.calc.spec.js:7:3 › percentage/margin-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.7s)
  ✓  298 [chromium] › tests_specs/percentage/cluster_release/cwv.cluster.spec.js:7:3 › percentage cluster cwv guard › cluster routes satisfy CLS/LCP thresholds (9.6s)
  ✓  308 [chromium] › tests_specs/percentage/margin-calculator_release/e2e.calc.spec.js:8:3 › Margin Calculator › MARG-TEST-E2E-1: mode toggle and calculations (3.5s)
  ✓  312 [chromium] › tests_specs/percentage/markup-calculator_release/seo.calc.spec.js:4:3 › Markup Calculator SEO › MARKUP-TEST-SEO-1: metadata, structured data, sitemap (3.0s)
  ✓  310 [chromium] › tests_specs/percentage/markup-calculator_release/cwv.calc.spec.js:7:3 › percentage/markup-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.5s)
  ✓  315 [chromium] › tests_specs/percentage/percent-change_release/seo.calc.spec.js:4:3 › Percent Change Calculator SEO › PCHG-TEST-SEO-1: metadata, schema, sitemap (2.5s)
  ✓  314 [chromium] › tests_specs/percentage/percent-change_release/e2e.calc.spec.js:4:3 › Percent Change Calculator › PCHG-TEST-E2E-1: signed percent, amount, direction, and zero-origin guard (3.5s)
  ✓  313 [chromium] › tests_specs/percentage/percent-change_release/cwv.calc.spec.js:7:3 › percentage/percent-change cwv guard › calculator route satisfies CLS/LCP thresholds (3.8s)
  ✓  317 [chromium] › tests_specs/percentage/percent-to-fraction-decimal_release/e2e.calc.spec.js:4:3 › Percent to Fraction/Decimal Converter › PTFD-TEST-E2E-1: single-pane journey, conversion outputs, and explanation migration contract (2.8s)
  ✓  318 [chromium] › tests_specs/percentage/percent-to-fraction-decimal_release/e2e.calc.spec.js:30:3 › Percent to Fraction/Decimal Converter › PTFD-TEST-E2E-2: handles invalid input guard (2.6s)
  ✓  316 [chromium] › tests_specs/percentage/percent-to-fraction-decimal_release/cwv.calc.spec.js:7:3 › percentage/percent-to-fraction-decimal cwv guard › calculator route satisfies CLS/LCP thresholds (4.4s)
  ✓  319 [chromium] › tests_specs/percentage/percent-to-fraction-decimal_release/seo.calc.spec.js:4:3 › Percent to Fraction/Decimal Converter SEO › PTFD-TEST-SEO-1: metadata, schema, sitemap (2.4s)
  ✘  309 [chromium] › tests_specs/percentage/margin-calculator_release/seo.calc.spec.js:4:3 › Margin Calculator SEO › MARG-TEST-SEO-1: metadata, schema, sitemap (7.8s)
  ✓  322 [chromium] › tests_specs/percentage/percentage-composition_release/e2e.calc.spec.js:29:3 › Percentage Composition Calculator › PCOMP-TEST-E2E-2: add/remove rows and zero-total guard (3.2s)
  ✓  321 [chromium] › tests_specs/percentage/percentage-composition_release/e2e.calc.spec.js:4:3 › Percentage Composition Calculator › PCOMP-TEST-E2E-1: single-pane structure, calculated mode, known mode, and no legacy blocks (3.5s)
  ✓  320 [chromium] › tests_specs/percentage/percentage-composition_release/cwv.calc.spec.js:7:3 › percentage/percentage-composition cwv guard › calculator route satisfies CLS/LCP thresholds (4.0s)
  ✓  323 [chromium] › tests_specs/percentage/percentage-composition_release/seo.calc.spec.js:4:3 › Percentage Composition Calculator SEO › PCOMP-TEST-SEO-1: metadata, schema, sitemap, and migrated explanation parity (2.4s)
  ✓  325 [chromium] › tests_specs/percentage/percentage-decrease_release/e2e.calc.spec.js:4:3 › Percentage Decrease Calculator › PDEC-TEST-E2E-1: single-pane journey, formula output, and migrated explanation UX (2.8s)
  ✓  324 [chromium] › tests_specs/percentage/percentage-decrease_release/cwv.calc.spec.js:7:3 › percentage/percentage-decrease cwv guard › calculator route satisfies CLS/LCP thresholds (4.1s)
  ✓  326 [chromium] › tests_specs/percentage/percentage-decrease_release/seo.calc.spec.js:4:3 › Percentage Decrease Calculator SEO › PDEC-TEST-SEO-1: metadata, schema, sitemap, and migrated explanation parity (2.5s)
  ✓  329 [chromium] › tests_specs/percentage/percentage-difference_release/e2e.calc.spec.js:40:3 › Percentage Difference Calculator › PDIFF-TEST-E2E-2: handles divide-by-zero baseline (2.3s)
  ✓  328 [chromium] › tests_specs/percentage/percentage-difference_release/e2e.calc.spec.js:8:3 › Percentage Difference Calculator › PDIFF-TEST-E2E-1: calculates symmetric percentage difference and renders new explanation UX (2.8s)
  ✓  330 [chromium] › tests_specs/percentage/percentage-difference_release/seo.calc.spec.js:4:3 › Percentage Difference Calculator SEO › PDIFF-TEST-SEO-1: metadata, schema, sitemap, and explanation parity (2.3s)
  ✓  327 [chromium] › tests_specs/percentage/percentage-difference_release/cwv.calc.spec.js:7:3 › percentage/percentage-difference cwv guard › calculator route satisfies CLS/LCP thresholds (4.3s)
  ✓  331 [chromium] › tests_specs/percentage/percentage-decrease_release/e2e.calc.spec.js:30:3 › Percentage Decrease Calculator › PDEC-TEST-E2E-2: handles zero-origin guard (2.9s)
  ✓  334 [chromium] › tests_specs/percentage/percentage-increase_release/e2e.calc.spec.js:30:3 › Percentage Increase Calculator › PINC-TEST-E2E-2: handles zero-origin guard (2.7s)
  ✓  335 [chromium] › tests_specs/percentage/percentage-increase_release/seo.calc.spec.js:4:3 › Percentage Increase Calculator SEO › PINC-TEST-SEO-1: metadata, schema, sitemap, and explanation parity (2.8s)
  ✓  333 [chromium] › tests_specs/percentage/percentage-increase_release/e2e.calc.spec.js:4:3 › Percentage Increase Calculator › PINC-TEST-E2E-1: single-pane journey, formula output, and modern explanation UX (3.4s)
  ✓  332 [chromium] › tests_specs/percentage/percentage-increase_release/cwv.calc.spec.js:7:3 › percentage/percentage-increase cwv guard › calculator route satisfies CLS/LCP thresholds (4.1s)
  ✓  337 [chromium] › tests_specs/percentage/percentage-of-a-number_release/e2e.calc.spec.js:4:3 › Find Percentage of a Number Calculator › PON-TEST-E2E-1: single-pane journey, migration contract, and compute output (3.4s)
  ✓  336 [chromium] › tests_specs/percentage/percentage-of-a-number_release/cwv.calc.spec.js:7:3 › percentage/percentage-of-a-number cwv guard › calculator route satisfies CLS/LCP thresholds (4.3s)
  ✓  338 [chromium] › tests_specs/percentage/percentage-of-a-number_release/e2e.calc.spec.js:29:3 › Find Percentage of a Number Calculator › PON-TEST-E2E-2: invalid input guard text (2.8s)
  ✓  339 [chromium] › tests_specs/percentage/percentage-of-a-number_release/seo.calc.spec.js:4:3 › Find Percentage of a Number Calculator SEO › PON-TEST-SEO-1: metadata, schema, sitemap (2.6s)
  ✓  341 [chromium] › tests_specs/percentage/reverse-percentage_release/e2e_fast.calc.spec.js:22:3 › Reverse Percentage Calculator (fast e2e) › REVPCT-FAST-E2E-1: single-pane journey, formula output, and explanation migration contract (2.4s)
  ✓  342 [chromium] › tests_specs/percentage/reverse-percentage_release/e2e_fast.calc.spec.js:49:3 › Reverse Percentage Calculator (fast e2e) › REVPCT-FAST-E2E-2: input validation and zero-percent guard (2.3s)
  ✓  343 [chromium] › tests_specs/percentage/reverse-percentage_release/e2e.calc.spec.js:4:3 › Reverse Percentage Calculator › REVPCT-TEST-E2E-1: single-pane journey, formula output, and explanation migration contract (3.1s)
  ✓  344 [chromium] › tests_specs/percentage/reverse-percentage_release/e2e.calc.spec.js:29:3 › Reverse Percentage Calculator › REVPCT-TEST-E2E-2: input validation and zero-percent guard (3.0s)
  ✓  345 [chromium] › tests_specs/percentage/reverse-percentage_release/seo.calc.spec.js:4:3 › Reverse Percentage Calculator SEO › REVPCT-TEST-SEO-1: metadata, structured data, sitemap (3.0s)
  ✓  347 [chromium] › tests_specs/percentage/what-percent-is-x-of-y_release/e2e.calc.spec.js:4:3 › What Percent Is X of Y Calculator › WPXY-TEST-E2E-1: single-pane journey, formula output, and explanation migration contract (3.1s)
  ✘  340 [chromium] › tests_specs/percentage/reverse-percentage_release/cwv.calc.spec.js:7:3 › percentage/reverse-percentage cwv guard › calculator route satisfies CLS/LCP thresholds (5.3s)
  ✓  348 [chromium] › tests_specs/percentage/what-percent-is-x-of-y_release/e2e.calc.spec.js:30:3 › What Percent Is X of Y Calculator › WPXY-TEST-E2E-2: input validation and zero-division guard (2.8s)
  ✓  346 [chromium] › tests_specs/percentage/what-percent-is-x-of-y_release/cwv.calc.spec.js:7:3 › percentage/what-percent-is-x-of-y cwv guard › calculator route satisfies CLS/LCP thresholds (5.1s)
  ✓  349 [chromium] › tests_specs/percentage/what-percent-is-x-of-y_release/seo.calc.spec.js:4:3 › What Percent Is X of Y Calculator SEO › WPXY-TEST-SEO-1: metadata, structured data, sitemap (2.6s)
  ✓  352 [chromium] › tests_specs/sleep-and-nap/cluster_release/seo.cluster.spec.js:6:3 › sleep-and-nap cluster seo smoke › representative route has canonical/title/robots (2.0s)
  ✓  351 [chromium] › tests_specs/sleep-and-nap/cluster_release/e2e.cluster.spec.js:6:3 › sleep-and-nap cluster e2e smoke › cluster representative routes load and show H1 (2.8s)
  ✓  353 [chromium] › tests_specs/sleep-and-nap/energy-based-nap-selector_release/e2e.calc.spec.js:4:3 › Energy-Based Nap Selector › ENAP-TEST-E2E-1: route journey and deterministic behavior (4.0s)
  ✓  354 [chromium] › tests_specs/sleep-and-nap/energy-based-nap-selector_release/e2e.calc.spec.js:40:3 › Energy-Based Nap Selector › ENAP-TEST-E2E-2: explanation pane and FAQ count (2.5s)
  ✓  355 [chromium] › tests_specs/sleep-and-nap/energy-based-nap-selector_release/e2e.calc.spec.js:49:3 › Energy-Based Nap Selector › ENAP-TEST-E2E-3: primary recommendation keeps dark-row styling with readable text (3.0s)
  ✘  356 [chromium] › tests_specs/sleep-and-nap/energy-based-nap-selector_release/seo.calc.spec.js:4:3 › Energy-Based Nap Selector SEO › ENAP-TEST-SEO-1: metadata, schema, and sitemap coverage (3.3s)
  ✓  357 [chromium] › tests_specs/sleep-and-nap/nap-time-calculator_release/cwv.calc.spec.js:7:3 › sleep-and-nap/nap-time-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.4s)
  ✓  360 [chromium] › tests_specs/sleep-and-nap/nap-time-calculator_release/seo.calc.spec.js:4:3 › Nap Time Calculator SEO › NAP-TEST-SEO-1: metadata, headings, FAQ schema, sitemap (2.6s)
  ✓  358 [chromium] › tests_specs/sleep-and-nap/energy-based-nap-selector_release/cwv.calc.spec.js:7:3 › sleep-and-nap/energy-based-nap-selector cwv guard › calculator route satisfies CLS/LCP thresholds (4.3s)
  ✓  359 [chromium] › tests_specs/sleep-and-nap/nap-time-calculator_release/e2e.calc.spec.js:6:3 › Nap Time Calculator › NAP-TEST-E2E-1: user journey and outputs (3.0s)
  ✓  350 [chromium] › tests_specs/sleep-and-nap/cluster_release/cwv.cluster.spec.js:7:3 › sleep-and-nap cluster cwv guard › cluster routes satisfy CLS/LCP thresholds (9.5s)
  ✓  361 [chromium] › tests_specs/sleep-and-nap/power-nap-calculator_release/cwv.calc.spec.js:7:3 › sleep-and-nap/power-nap-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.3s)
  ✓  362 [chromium] › tests_specs/sleep-and-nap/power-nap-calculator_release/e2e.calc.spec.js:35:3 › Power Nap Calculator › POWER-NAP-TEST-E2E-2: explanation content and FAQs (2.4s)
  ✓  365 [chromium] › tests_specs/sleep-and-nap/nap-time-calculator_release/e2e.calc.spec.js:36:3 › Nap Time Calculator › NAP-TEST-E2E-2: explanation content and FAQs (2.3s)
  ✓  363 [chromium] › tests_specs/sleep-and-nap/power-nap-calculator_release/e2e.calc.spec.js:44:3 › Power Nap Calculator › POWER-NAP-TEST-E2E-2B: recommended rows keep dark-row styling with readable text (2.7s)
  ✓  364 [chromium] › tests_specs/sleep-and-nap/power-nap-calculator_release/e2e.calc.spec.js:71:3 › Power Nap Calculator › POWER-NAP-TEST-E2E-3: evening warning for late start (2.5s)
  ✓  367 [chromium] › tests_specs/sleep-and-nap/power-nap-calculator_release/seo.calc.spec.js:4:3 › Power Nap Calculator SEO › POWER-NAP-TEST-SEO-1: metadata, headings, FAQ schema, sitemap (3.2s)
  ✓  369 [chromium] › tests_specs/sleep-and-nap/sleep-time-calculator_release/e2e.calc.spec.js:6:3 › Sleep Time Calculator › SLEEP-TEST-E2E-1: user journey and recommendations (3.6s)
  ✓  370 [chromium] › tests_specs/sleep-and-nap/sleep-time-calculator_release/seo.calc.spec.js:4:3 › Sleep Time Calculator SEO › SLEEP-TEST-SEO-1: metadata, headings, FAQ schema, sitemap (3.5s)
  ✓  366 [chromium] › tests_specs/sleep-and-nap/power-nap-calculator_release/e2e.calc.spec.js:4:3 › Power Nap Calculator › POWER-NAP-TEST-E2E-1: user journey and outputs (4.4s)
  ✓  372 [chromium] › tests_specs/sleep-and-nap/wake-up-time-calculator_release/e2e.calc.spec.js:6:3 › Wake-Up Time Calculator › WAKEUP-TEST-E2E-1: user journey and recommendations (3.9s)
  ✓  368 [chromium] › tests_specs/sleep-and-nap/sleep-time-calculator_release/cwv.calc.spec.js:7:3 › sleep-and-nap/sleep-time-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.4s)
  ✓  371 [chromium] › tests_specs/sleep-and-nap/wake-up-time-calculator_release/cwv.calc.spec.js:7:3 › sleep-and-nap/wake-up-time-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.4s)
  ✓  373 [chromium] › tests_specs/sleep-and-nap/wake-up-time-calculator_release/seo.calc.spec.js:4:3 › Wake-Up Time Calculator SEO › WAKEUP-TEST-SEO-1: metadata, headings, FAQ schema, sitemap (2.4s)
  ✓  376 [chromium] › tests_specs/time-and-date/age-calculator_release/e2e.calc.spec.js:4:3 › Age Calculator › AGE-TEST-E2E-1: user journey and results (3.9s)
  ✓  378 [chromium] › tests_specs/time-and-date/age-calculator_release/e2e.calc.spec.js:34:3 › Age Calculator › AGE-TEST-E2E-2: layout stability and content (3.5s)
  ✓  379 [chromium] › tests_specs/time-and-date/age-calculator_release/seo.calc.spec.js:4:3 › Age Calculator SEO › AGE-TEST-SEO-1: metadata, headings, FAQ schema, sitemap (3.2s)
  ✓  375 [chromium] › tests_specs/time-and-date/age-calculator_release/cwv.calc.spec.js:7:3 › time-and-date/age-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.3s)
  ✓  374 [chromium] › tests_specs/sleep-and-nap/sleep-time-calculator_release/e2e.calc.spec.js:29:3 › Sleep Time Calculator › SLEEP-TEST-E2E-1B: left nav includes nap calculator links and navigation works (4.6s)
  ✓  377 [chromium] › tests_specs/sleep-and-nap/wake-up-time-calculator_release/e2e.calc.spec.js:39:3 › Wake-Up Time Calculator › WAKEUP-TEST-E2E-1B: left nav includes nap calculator links and navigation works (4.1s)
  ✓  380 [chromium] › tests_specs/time-and-date/birthday-day-of-week_release/cwv.calc.spec.js:7:3 › time-and-date/birthday-day-of-week cwv guard › calculator route satisfies CLS/LCP thresholds (4.6s)
  ✓  382 [chromium] › tests_specs/time-and-date/birthday-day-of-week_release/e2e.calc.spec.js:23:3 › Birthday Day-of-Week Calculator › BIRTHDAY-DOW-TEST-E2E-2: leap-year handling (3.2s)
  ✓  381 [chromium] › tests_specs/time-and-date/birthday-day-of-week_release/e2e.calc.spec.js:4:3 › Birthday Day-of-Week Calculator › BIRTHDAY-DOW-TEST-E2E-1: user journey and results (3.4s)
  ✓  386 [chromium] › tests_specs/sleep-and-nap/wake-up-time-calculator_release/e2e.calc.spec.js:71:3 › Wake-Up Time Calculator › WAKEUP-TEST-E2E-1C: finance-style accordion groups and link inventory (3.0s)
  ✓  385 [chromium] › tests_specs/sleep-and-nap/sleep-time-calculator_release/e2e.calc.spec.js:61:3 › Sleep Time Calculator › SLEEP-TEST-E2E-2: mode switch resets results (UI-2.6) (3.8s)
  ✘  383 [chromium] › tests_specs/time-and-date/birthday-day-of-week_release/seo.calc.spec.js:4:3 › Birthday Day-of-Week SEO › BIRTHDAY-DOW-TEST-SEO-1: metadata, headings, FAQ schema, sitemap (3.6s)
  ✓  388 [chromium] › tests_specs/time-and-date/cluster_release/seo.cluster.spec.js:6:3 › time-and-date cluster seo smoke › representative route has canonical/title/robots (2.2s)
  ✓  387 [chromium] › tests_specs/time-and-date/cluster_release/e2e.cluster.spec.js:6:3 › time-and-date cluster e2e smoke › cluster representative routes load and show H1 (3.6s)
  ✓  390 [chromium] › tests_specs/sleep-and-nap/wake-up-time-calculator_release/e2e.calc.spec.js:108:3 › Wake-Up Time Calculator › WAKEUP-TEST-E2E-2: calculate-only updates and explanation content (2.9s)
  ✓  391 [chromium] › tests_specs/sleep-and-nap/sleep-time-calculator_release/e2e.calc.spec.js:78:3 › Sleep Time Calculator › SLEEP-TEST-E2E-3: input change resets results (UI-2.6) (2.9s)
  ✓  389 [chromium] › tests_specs/time-and-date/countdown-timer-generator_release/cwv.calc.spec.js:7:3 › time-and-date/countdown-timer-generator cwv guard › calculator route satisfies CLS/LCP thresholds (4.3s)
  ✓  392 [chromium] › tests_specs/time-and-date/countdown-timer-generator_release/e2e.calc.spec.js:38:3 › Countdown Timer Generator › COUNTDOWN-TEST-E2E-2: layout stability and explanation content (2.8s)
  ✓  395 [chromium] › tests_specs/sleep-and-nap/sleep-time-calculator_release/e2e.calc.spec.js:97:3 › Sleep Time Calculator › SLEEP-TEST-E2E-4: explanation content and FAQs (2.7s)
  ✓  384 [chromium] › tests_specs/time-and-date/cluster_release/cwv.cluster.spec.js:7:3 › time-and-date cluster cwv guard › cluster routes satisfy CLS/LCP thresholds (9.9s)
  ✓  394 [chromium] › tests_specs/time-and-date/days-until-a-date-calculator_release/cwv.calc.spec.js:7:3 › time-and-date/days-until-a-date-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.0s)
  ✓  396 [chromium] › tests_specs/time-and-date/countdown-timer-generator_release/e2e.calc.spec.js:4:3 › Countdown Timer Generator › COUNTDOWN-TEST-E2E-1: user journey and results (3.0s)
  ✓  401 [chromium] › tests_specs/time-and-date/overtime-hours-calculator_release/e2e.calc.spec.js:4:3 › Overtime Hours Calculator › OVERTIME-TEST-E2E-1: single shift calculation (3.5s)
  ✓  402 [chromium] › tests_specs/time-and-date/overtime-hours-calculator_release/e2e.calc.spec.js:28:3 › Overtime Hours Calculator › OVERTIME-TEST-E2E-2: input change resets results (UI-2.6) (3.5s)
  ✓  400 [chromium] › tests_specs/time-and-date/overtime-hours-calculator_release/cwv.calc.spec.js:7:3 › time-and-date/overtime-hours-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.3s)
  ✘  393 [chromium] › tests_specs/time-and-date/countdown-timer-generator_release/seo.calc.spec.js:4:3 › Countdown Timer Generator SEO › COUNTDOWN-TEST-SEO-1: metadata, headings, FAQ schema, sitemap (8.0s)
  ✘  397 [chromium] › tests_specs/time-and-date/days-until-a-date-calculator_release/e2e.calc.spec.js:4:3 › Days Until a Date Calculator › DAYS-UNTIL-TEST-E2E-1: user journey and results (6.9s)
  ✓  404 [chromium] › tests_specs/time-and-date/overtime-hours-calculator_release/e2e.calc.spec.js:63:3 › Overtime Hours Calculator › OVERTIME-TEST-E2E-4: explanation content and FAQs (2.6s)
  ✓  403 [chromium] › tests_specs/time-and-date/overtime-hours-calculator_release/e2e.calc.spec.js:47:3 › Overtime Hours Calculator › OVERTIME-TEST-E2E-3: mode switch resets results (UI-2.6) (3.1s)
  ✘  399 [chromium] › tests_specs/time-and-date/days-until-a-date-calculator_release/seo.calc.spec.js:4:3 › Days Until a Date Calculator SEO › DAYS-UNTIL-TEST-SEO-1: metadata, headings, FAQ schema, sitemap (7.1s)
  ✓  406 [chromium] › tests_specs/time-and-date/time-between-two-dates-calculator_release/e2e.calc.spec.js:44:3 › Time Between Two Dates Calculator › DATE-DIFF-TEST-E2E-2: layout stability and content (3.3s)
  ✓  408 [chromium] › tests_specs/time-and-date/time-between-two-dates-calculator_release/e2e.calc.spec.js:4:3 › Time Between Two Dates Calculator › DATE-DIFF-TEST-E2E-1: user journey, validation, results (3.8s)
  ✓  407 [chromium] › tests_specs/time-and-date/time-between-two-dates-calculator_release/cwv.calc.spec.js:7:3 › time-and-date/time-between-two-dates-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.2s)
  ✓  411 [chromium] › tests_specs/time-and-date/work-hours-calculator_release/e2e.calc.spec.js:4:3 › Work Hours Calculator › WORK-HOURS-TEST-E2E-1: single shift calculation (3.4s)
  ✘  405 [chromium] › tests_specs/time-and-date/overtime-hours-calculator_release/seo.calc.spec.js:4:3 › Overtime Hours Calculator SEO › OVERTIME-TEST-SEO-1: metadata, headings, FAQ schema, sitemap (8.1s)
  ✓  410 [chromium] › tests_specs/time-and-date/work-hours-calculator_release/cwv.calc.spec.js:7:3 › time-and-date/work-hours-calculator cwv guard › calculator route satisfies CLS/LCP thresholds (4.1s)
  ✘  409 [chromium] › tests_specs/time-and-date/time-between-two-dates-calculator_release/seo.calc.spec.js:4:3 › Time Between Two Dates Calculator SEO › DATE-DIFF-TEST-SEO-1: metadata, headings, FAQ schema, sitemap (7.4s)
  ✘  413 [chromium] › tests_specs/time-and-date/work-hours-calculator_release/seo.calc.spec.js:4:3 › Work Hours Calculator SEO › WORK-HOURS-TEST-SEO-1: metadata, headings, FAQ schema, sitemap (7.3s)
  ✘  412 [chromium] › tests_specs/time-and-date/work-hours-calculator_release/e2e.calc.spec.js:29:3 › Work Hours Calculator › WORK-HOURS-TEST-E2E-2: weekly totals with daily lines (8.1s)
  ✘  398 [chromium] › tests_specs/time-and-date/days-until-a-date-calculator_release/e2e.calc.spec.js:39:3 › Days Until a Date Calculator › DAYS-UNTIL-TEST-E2E-2: layout stability and content (30.7s)
  ✘   62 [chromium] › tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js:313:3 › Global CWV guard — all calculator routes › UR-TEST-005/006: all calculator routes must satisfy CLS/LCP/INP thresholds in normal and stress modes (18.0m)


  1) [chromium] › tests_specs/credit-cards/credit-card-minimum-payment_release/e2e.calc.spec.js:12:3 › Credit Card Minimum Payment Calculator › MINPAY-TEST-E2E-1: load, nav, calculate, verify results 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveText[2m([22m[32mexpected[39m[2m)[22m failed

    Locator:  locator('#calculator-title')
    Expected: [32m"Credit Card Minimum Payment"[39m
    Received: [31m"Credit Card Minimum Payment[7m Calculator[27m"[39m
    Timeout:  5000ms

    Call log:
    [2m  - Expect "toHaveText" with timeout 5000ms[22m
    [2m  - waiting for locator('#calculator-title')[22m
    [2m    9 × locator resolved to <h1 id="calculator-title">Credit Card Minimum Payment Calculator</h1>[22m
    [2m      - unexpected value "Credit Card Minimum Payment Calculator"[22m


      19 |     await expect(singlePanel.locator(':scope > h3:has-text("Explanation")')).toHaveCount(0);
      20 |
    > 21 |     await expect(page.locator('#calculator-title')).toHaveText('Credit Card Minimum Payment');
         |                                                     ^
      22 |     await expect(page.locator('label[for="cc-min-floor"]')).toHaveText('Lowest Monthly Payment');
      23 |     await expect(page.locator('#calc-cc-min .cc-min-provider-note')).toContainText(
      24 |       "Minimum Payment Rate (%) and Minimum Payment Floor (lowest monthly payment) vary by credit card provider. Check your provider's Terms & Conditions for exact values."
        at /home/kartheek/calchowmuch/tests_specs/credit-cards/credit-card-minimum-payment_release/e2e.calc.spec.js:21:53

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/credit-cards-credit-card-m-85b6e-av-calculate-verify-results-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/credit-cards-credit-card-m-85b6e-av-calculate-verify-results-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/credit-cards-credit-card-m-85b6e-av-calculate-verify-results-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/credit-cards-credit-card-m-85b6e-av-calculate-verify-results-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/credit-cards-credit-card-m-85b6e-av-calculate-verify-results-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [chromium] › tests_specs/credit-cards/credit-card-repayment-payoff_release/cwv.calc.spec.js:7:3 › credit-cards/credit-card-repayment-payoff cwv guard › calculator route satisfies CLS/LCP thresholds 

    Error: CLS exceeded on /credit-card-calculators/credit-card-payment-calculator/

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m0.1[39m
    Received:    [31m0.1071[39m

       at infrastructure/e2e/cwv-scope-helper.js:80

      78 |   }
      79 |
    > 80 |   expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
         |                                                   ^
      81 |   expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
      82 | }
      83 |
        at assertCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:80:51)
        at /home/kartheek/calchowmuch/tests_specs/credit-cards/credit-card-repayment-payoff_release/cwv.calc.spec.js:9:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/credit-cards-credit-card-r-f24ba-atisfies-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/credit-cards-credit-card-r-f24ba-atisfies-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/credit-cards-credit-card-r-f24ba-atisfies-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/credit-cards-credit-card-r-f24ba-atisfies-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/credit-cards-credit-card-r-f24ba-atisfies-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [chromium] › tests_specs/finance/cluster_release/cwv.cluster.spec.js:7:3 › finance cluster cwv guard › cluster routes satisfy CLS/LCP thresholds 

    Error: CLS exceeded on /finance-calculators/effective-annual-rate-calculator/

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m0.1[39m
    Received:    [31m0.2759[39m

       at infrastructure/e2e/cwv-scope-helper.js:80

      78 |   }
      79 |
    > 80 |   expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
         |                                                   ^
      81 |   expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
      82 | }
      83 |
        at assertCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:80:51)
        at /home/kartheek/calchowmuch/tests_specs/finance/cluster_release/cwv.cluster.spec.js:10:7

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/finance-cluster_release-cw-d66a8--satisfy-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/finance-cluster_release-cw-d66a8--satisfy-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/finance-cluster_release-cw-d66a8--satisfy-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/finance-cluster_release-cw-d66a8--satisfy-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/finance-cluster_release-cw-d66a8--satisfy-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4) [chromium] › tests_specs/finance/effective-annual-rate_release/cwv.calc.spec.js:7:3 › finance/effective-annual-rate cwv guard › calculator route satisfies CLS/LCP thresholds 

    Error: CLS exceeded on /finance-calculators/effective-annual-rate-calculator/

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m0.1[39m
    Received:    [31m0.1379[39m

       at infrastructure/e2e/cwv-scope-helper.js:80

      78 |   }
      79 |
    > 80 |   expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
         |                                                   ^
      81 |   expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
      82 | }
      83 |
        at assertCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:80:51)
        at /home/kartheek/calchowmuch/tests_specs/finance/effective-annual-rate_release/cwv.calc.spec.js:9:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/finance-effective-annual-r-a28c7-atisfies-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/finance-effective-annual-r-a28c7-atisfies-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/finance-effective-annual-r-a28c7-atisfies-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/finance-effective-annual-r-a28c7-atisfies-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/finance-effective-annual-r-a28c7-atisfies-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  5) [chromium] › tests_specs/finance/future-value_release/cwv.calc.spec.js:7:3 › finance/future-value cwv guard › calculator route satisfies CLS/LCP thresholds 

    Error: CLS exceeded on /finance-calculators/future-value-calculator/

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m0.1[39m
    Received:    [31m0.1522[39m

       at infrastructure/e2e/cwv-scope-helper.js:80

      78 |   }
      79 |
    > 80 |   expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
         |                                                   ^
      81 |   expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
      82 | }
      83 |
        at assertCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:80:51)
        at /home/kartheek/calchowmuch/tests_specs/finance/future-value_release/cwv.calc.spec.js:9:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/finance-future-value_relea-2bb27-atisfies-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/finance-future-value_relea-2bb27-atisfies-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/finance-future-value_relea-2bb27-atisfies-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/finance-future-value_relea-2bb27-atisfies-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/finance-future-value_relea-2bb27-atisfies-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  6) [chromium] › tests_specs/finance/future-value-of-annuity_release/cwv.calc.spec.js:7:3 › finance/future-value-of-annuity cwv guard › calculator route satisfies CLS/LCP thresholds 

    Error: CLS exceeded on /finance-calculators/future-value-of-annuity-calculator/

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m0.1[39m
    Received:    [31m0.1546[39m

       at infrastructure/e2e/cwv-scope-helper.js:80

      78 |   }
      79 |
    > 80 |   expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
         |                                                   ^
      81 |   expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
      82 | }
      83 |
        at assertCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:80:51)
        at /home/kartheek/calchowmuch/tests_specs/finance/future-value-of-annuity_release/cwv.calc.spec.js:9:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/finance-future-value-of-an-d4d70-atisfies-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/finance-future-value-of-an-d4d70-atisfies-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/finance-future-value-of-an-d4d70-atisfies-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/finance-future-value-of-an-d4d70-atisfies-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/finance-future-value-of-an-d4d70-atisfies-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  7) [chromium] › tests_specs/finance/investment-growth_release/cwv.calc.spec.js:7:3 › finance/investment-growth cwv guard › calculator route satisfies CLS/LCP thresholds 

    Error: CLS exceeded on /finance-calculators/investment-growth-calculator/

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m0.1[39m
    Received:    [31m0.1655[39m

       at infrastructure/e2e/cwv-scope-helper.js:80

      78 |   }
      79 |
    > 80 |   expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
         |                                                   ^
      81 |   expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
      82 | }
      83 |
        at assertCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:80:51)
        at /home/kartheek/calchowmuch/tests_specs/finance/investment-growth_release/cwv.calc.spec.js:9:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/finance-investment-growth_-c5894-atisfies-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/finance-investment-growth_-c5894-atisfies-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/finance-investment-growth_-c5894-atisfies-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/finance-investment-growth_-c5894-atisfies-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/finance-investment-growth_-c5894-atisfies-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  8) [chromium] › tests_specs/finance/investment-return_release/cwv.calc.spec.js:7:3 › finance/investment-return cwv guard › calculator route satisfies CLS/LCP thresholds 

    Error: CLS exceeded on /finance-calculators/investment-return-calculator/

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m0.1[39m
    Received:    [31m0.3227[39m

       at infrastructure/e2e/cwv-scope-helper.js:80

      78 |   }
      79 |
    > 80 |   expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
         |                                                   ^
      81 |   expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
      82 | }
      83 |
        at assertCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:80:51)
        at /home/kartheek/calchowmuch/tests_specs/finance/investment-return_release/cwv.calc.spec.js:9:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/finance-investment-return_-b6bd0-atisfies-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/finance-investment-return_-b6bd0-atisfies-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/finance-investment-return_-b6bd0-atisfies-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/finance-investment-return_-b6bd0-atisfies-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/finance-investment-return_-b6bd0-atisfies-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  9) [chromium] › tests_specs/finance/monthly-savings-needed_release/cwv.calc.spec.js:7:3 › finance/monthly-savings-needed cwv guard › calculator route satisfies CLS/LCP thresholds 

    Error: CLS exceeded on /finance-calculators/monthly-savings-needed-calculator/

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m0.1[39m
    Received:    [31m0.1738[39m

       at infrastructure/e2e/cwv-scope-helper.js:80

      78 |   }
      79 |
    > 80 |   expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
         |                                                   ^
      81 |   expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
      82 | }
      83 |
        at assertCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:80:51)
        at /home/kartheek/calchowmuch/tests_specs/finance/monthly-savings-needed_release/cwv.calc.spec.js:9:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/finance-monthly-savings-ne-b9617-atisfies-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/finance-monthly-savings-ne-b9617-atisfies-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/finance-monthly-savings-ne-b9617-atisfies-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/finance-monthly-savings-ne-b9617-atisfies-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/finance-monthly-savings-ne-b9617-atisfies-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  10) [chromium] › tests_specs/finance/present-value_release/cwv.calc.spec.js:7:3 › finance/present-value cwv guard › calculator route satisfies CLS/LCP thresholds 

    Error: CLS exceeded on /finance-calculators/present-value-calculator/

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m0.1[39m
    Received:    [31m0.1523[39m

       at infrastructure/e2e/cwv-scope-helper.js:80

      78 |   }
      79 |
    > 80 |   expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
         |                                                   ^
      81 |   expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
      82 | }
      83 |
        at assertCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:80:51)
        at /home/kartheek/calchowmuch/tests_specs/finance/present-value_release/cwv.calc.spec.js:9:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/finance-present-value_rele-2be1a-atisfies-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/finance-present-value_rele-2be1a-atisfies-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/finance-present-value_rele-2be1a-atisfies-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/finance-present-value_rele-2be1a-atisfies-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/finance-present-value_rele-2be1a-atisfies-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  11) [chromium] › tests_specs/finance/present-value-of-annuity_release/cwv.calc.spec.js:7:3 › finance/present-value-of-annuity cwv guard › calculator route satisfies CLS/LCP thresholds 

    Error: CLS exceeded on /finance-calculators/present-value-of-annuity-calculator/

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m0.1[39m
    Received:    [31m0.1546[39m

       at infrastructure/e2e/cwv-scope-helper.js:80

      78 |   }
      79 |
    > 80 |   expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
         |                                                   ^
      81 |   expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
      82 | }
      83 |
        at assertCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:80:51)
        at /home/kartheek/calchowmuch/tests_specs/finance/present-value-of-annuity_release/cwv.calc.spec.js:9:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/finance-present-value-of-a-d99ea-atisfies-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/finance-present-value-of-a-d99ea-atisfies-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/finance-present-value-of-a-d99ea-atisfies-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/finance-present-value-of-a-d99ea-atisfies-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/finance-present-value-of-a-d99ea-atisfies-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  12) [chromium] › tests_specs/finance/time-to-savings-goal_release/cwv.calc.spec.js:7:3 › finance/time-to-savings-goal cwv guard › calculator route satisfies CLS/LCP thresholds 

    Error: CLS exceeded on /finance-calculators/time-to-savings-goal-calculator/

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m0.1[39m
    Received:    [31m0.167[39m

       at infrastructure/e2e/cwv-scope-helper.js:80

      78 |   }
      79 |
    > 80 |   expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
         |                                                   ^
      81 |   expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
      82 | }
      83 |
        at assertCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:80:51)
        at /home/kartheek/calchowmuch/tests_specs/finance/time-to-savings-goal_release/cwv.calc.spec.js:9:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/finance-time-to-savings-go-01bc7-atisfies-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/finance-time-to-savings-go-01bc7-atisfies-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/finance-time-to-savings-go-01bc7-atisfies-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/finance-time-to-savings-go-01bc7-atisfies-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/finance-time-to-savings-go-01bc7-atisfies-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  13) [chromium] › tests_specs/infrastructure/e2e/button-only-recalc-finance-percentage.spec.js:152:3 › Button-Only Recalculation (Finance + Percentage) › BTN-ONLY-E2E-1: all target calculators update only after Calculate click › /finance/present-value 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

    Locator: locator('.center-column .panel').first().locator('.result').first()
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
    [2m  - Expect "toBeVisible" with timeout 5000ms[22m
    [2m  - waiting for locator('.center-column .panel').first().locator('.result').first()[22m


      109 |   const calculateButton = pane.locator('button[id$="-calc"]').first();
      110 |
    > 111 |   await expect(result).toBeVisible();
          |                        ^
      112 |   await expect(explanation).toBeVisible();
      113 |   await expect(calculateButton).toBeVisible();
      114 |
        at verifyButtonOnlyRecalculation (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/button-only-recalc-finance-percentage.spec.js:111:24)
        at /home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/button-only-recalc-finance-percentage.spec.js:157:9
        at /home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/button-only-recalc-finance-percentage.spec.js:156:7

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-button--afa28--only-after-Calculate-click-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-button--afa28--only-after-Calculate-click-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/infrastructure-e2e-button--afa28--only-after-Calculate-click-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-button--afa28--only-after-Calculate-click-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/infrastructure-e2e-button--afa28--only-after-Calculate-click-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  14) [chromium] › tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js:313:3 › Global CWV guard — all calculator routes › UR-TEST-005/006: all calculator routes must satisfy CLS/LCP/INP thresholds in normal and stress modes 

    Error: CWV guard failed for 41 route checks. Report: /home/kartheek/calchowmuch/test-results/performance/cls-guard-all-calculators.json
    /car-loan-calculators/auto-loan-calculator/ [normal] cls=0.0593 maxShift=0.0593 lcp=844 inpProxy=104 error=none
    /car-loan-calculators/auto-loan-calculator/ [stress] cls=0.0586 maxShift=0.058 lcp=1876 inpProxy=352 error=none
    /car-loan-calculators/car-lease-calculator/ [normal] cls=0.0599 maxShift=0.0599 lcp=844 inpProxy=328 error=none
    /car-loan-calculators/car-lease-calculator/ [stress] cls=0.062 maxShift=0.0599 lcp=1772 inpProxy=160 error=none
    /car-loan-calculators/car-loan-calculator/ [stress] cls=0 maxShift=0 lcp=988 inpProxy=312 error=none
    /car-loan-calculators/hire-purchase-calculator/ [normal] cls=0.0589 maxShift=0.0583 lcp=996 inpProxy=152 error=none
    /car-loan-calculators/hire-purchase-calculator/ [stress] cls=0.0596 maxShift=0.0583 lcp=2036 inpProxy=184 error=none
    /car-loan-calculators/pcp-calculator/ [normal] cls=0.0673 maxShift=0.0673 lcp=1160 inpProxy=136 error=none
    /car-loan-calculators/pcp-calculator/ [stress] cls=0.068 maxShift=0.0673 lcp=2360 inpProxy=144 error=none
    /credit-card-calculators/balance-transfer-credit-card-calculator/ [normal] cls=0.0705 maxShift=0.0698 lcp=1032 inpProxy=136 error=none

    [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m

    [32m- Expected  -    1[39m
    [31m+ Received  + 4847[39m

    [32m- Array [][39m
    [31m+ Array [[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0593,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 492.578125,[39m
    [31m+               "height": 310.1875,[39m
    [31m+               "left": 731.515625,[39m
    [31m+               "right": 1114.609375,[39m
    [31m+               "top": 182.390625,[39m
    [31m+               "width": 383.09375,[39m
    [31m+               "x": 731.515625,[39m
    [31m+               "y": 182.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 766.796875,[39m
    [31m+               "height": 314.21875,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.546875,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.03125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 549,[39m
    [31m+               "height": 144,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 33.140625,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 838.859375,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 838.859375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 91.09375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 780.90625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 780.90625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-mtg-explanation",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 770.7000000178814,[39m
    [31m+         "value": 0.05934647092606819,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 104,[39m
    [31m+     "lcp": 844,[39m
    [31m+     "maxShift": 0.0593,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/car-loan-calculators/auto-loan-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0586,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1200.300000011921,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 492.578125,[39m
    [31m+               "height": 310.1875,[39m
    [31m+               "left": 731.515625,[39m
    [31m+               "right": 1114.609375,[39m
    [31m+               "top": 182.390625,[39m
    [31m+               "width": 383.09375,[39m
    [31m+               "x": 731.515625,[39m
    [31m+               "y": 182.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 766.796875,[39m
    [31m+               "height": 314.21875,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.546875,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.03125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 549,[39m
    [31m+               "height": 144,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 33.140625,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 838.859375,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 838.859375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 91.09375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 780.90625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 780.90625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-mtg-explanation",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1755.800000011921,[39m
    [31m+         "value": 0.057995427508155464,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 352,[39m
    [31m+     "lcp": 1876,[39m
    [31m+     "maxShift": 0.058,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/car-loan-calculators/auto-loan-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0599,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 510.578125,[39m
    [31m+               "height": 334.1875,[39m
    [31m+               "left": 719.515625,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 176.390625,[39m
    [31m+               "width": 406.484375,[39m
    [31m+               "x": 719.515625,[39m
    [31m+               "y": 176.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 767.140625,[39m
    [31m+               "height": 314.5625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.546875,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.03125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 549,[39m
    [31m+               "height": 144,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 835.125,[39m
    [31m+               "height": 111.625,[39m
    [31m+               "left": 249,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 723.5,[39m
    [31m+               "width": 481.125,[39m
    [31m+               "x": 249,[39m
    [31m+               "y": 723.5,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 775,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 259.515625,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 683,[39m
    [31m+               "width": 470.609375,[39m
    [31m+               "x": 259.515625,[39m
    [31m+               "y": 683,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.slider-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 566.7000000178814,[39m
    [31m+         "value": 0.05990296926399919,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 328,[39m
    [31m+     "lcp": 844,[39m
    [31m+     "maxShift": 0.0599,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/car-loan-calculators/car-lease-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.062,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 59,[39m
    [31m+               "height": 44,[39m
    [31m+               "left": 361.75,[39m
    [31m+               "right": 1003.25,[39m
    [31m+               "top": 15,[39m
    [31m+               "width": 641.5,[39m
    [31m+               "x": 361.75,[39m
    [31m+               "y": 15,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 51,[39m
    [31m+               "height": 28,[39m
    [31m+               "left": 361.75,[39m
    [31m+               "right": 1003.25,[39m
    [31m+               "top": 23,[39m
    [31m+               "width": 641.5,[39m
    [31m+               "x": 361.75,[39m
    [31m+               "y": 23,[39m
    [31m+             },[39m
    [31m+             "selector": "body>div.page>header.site-header>div.site-header-inner>div.header-center",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 669.4000000059605,[39m
    [31m+         "value": 0.001470693222943632,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1344,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 510.578125,[39m
    [31m+               "height": 334.1875,[39m
    [31m+               "left": 719.515625,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 176.390625,[39m
    [31m+               "width": 406.484375,[39m
    [31m+               "x": 719.515625,[39m
    [31m+               "y": 176.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 767.140625,[39m
    [31m+               "height": 314.5625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.546875,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.03125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 549,[39m
    [31m+               "height": 144,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 835.125,[39m
    [31m+               "height": 111.625,[39m
    [31m+               "left": 249,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 723.5,[39m
    [31m+               "width": 481.125,[39m
    [31m+               "x": 249,[39m
    [31m+               "y": 723.5,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 775,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 259.515625,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 683,[39m
    [31m+               "width": 470.609375,[39m
    [31m+               "x": 259.515625,[39m
    [31m+               "y": 683,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.slider-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1647.199999988079,[39m
    [31m+         "value": 0.05990296926399919,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 160,[39m
    [31m+     "lcp": 1772,[39m
    [31m+     "maxShift": 0.0599,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/car-loan-calculators/car-lease-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 709.578125,[39m
    [31m+               "height": 17.1875,[39m
    [31m+               "left": 1059.171875,[39m
    [31m+               "right": 1073.171875,[39m
    [31m+               "top": 692.390625,[39m
    [31m+               "width": 14,[39m
    [31m+               "x": 1059.171875,[39m
    [31m+               "y": 692.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 709.578125,[39m
    [31m+               "height": 17.1875,[39m
    [31m+               "left": 1041.96875,[39m
    [31m+               "right": 1072.96875,[39m
    [31m+               "top": 692.390625,[39m
    [31m+               "width": 31,[39m
    [31m+               "x": 1041.96875,[39m
    [31m+               "y": 692.390625,[39m
    [31m+             },[39m
    [31m+             "selector": "section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list>div.mtg-snapshot-row>strong",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 3683.4000000059605,[39m
    [31m+         "value": 0.000005480855945550826,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 312,[39m
    [31m+     "lcp": 988,[39m
    [31m+     "maxShift": 0,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/car-loan-calculators/car-loan-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0589,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 492.578125,[39m
    [31m+               "height": 310.1875,[39m
    [31m+               "left": 731.515625,[39m
    [31m+               "right": 1114.609375,[39m
    [31m+               "top": 182.390625,[39m
    [31m+               "width": 383.09375,[39m
    [31m+               "x": 731.515625,[39m
    [31m+               "y": 182.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 760.34375,[39m
    [31m+               "height": 307.765625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.828125,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.3125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 549,[39m
    [31m+               "height": 144,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 52.1875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 819.8125,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 819.8125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 113.09375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 758.90625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 758.90625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-mtg-explanation",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 799.7999999821186,[39m
    [31m+         "value": 0.05825568515311618,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 14,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 858,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 858,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 14,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 858,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 858,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 917.3999999761581,[39m
    [31m+         "value": 0.000670417348608838,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 152,[39m
    [31m+     "lcp": 996,[39m
    [31m+     "maxShift": 0.0583,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/car-loan-calculators/hire-purchase-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0596,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1463.5,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 492.578125,[39m
    [31m+               "height": 310.1875,[39m
    [31m+               "left": 731.515625,[39m
    [31m+               "right": 1114.609375,[39m
    [31m+               "top": 182.390625,[39m
    [31m+               "width": 383.09375,[39m
    [31m+               "x": 731.515625,[39m
    [31m+               "y": 182.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 760.34375,[39m
    [31m+               "height": 307.765625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.828125,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.3125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 549,[39m
    [31m+               "height": 144,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 52.1875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 819.8125,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 819.8125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 113.09375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 758.90625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 758.90625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-mtg-explanation",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1881.0999999940395,[39m
    [31m+         "value": 0.05825568515311618,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 14,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 858,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 858,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 14,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 858,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 858,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 3639,[39m
    [31m+         "value": 0.000670417348608838,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 184,[39m
    [31m+     "lcp": 2036,[39m
    [31m+     "maxShift": 0.0583,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/car-loan-calculators/hire-purchase-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0673,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 833.40625,[39m
    [31m+               "height": 380.828125,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.96875,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.453125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 585,[39m
    [31m+               "height": 180,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 492.578125,[39m
    [31m+               "height": 310.1875,[39m
    [31m+               "left": 731.515625,[39m
    [31m+               "right": 1114.609375,[39m
    [31m+               "top": 182.390625,[39m
    [31m+               "width": 383.09375,[39m
    [31m+               "x": 731.515625,[39m
    [31m+               "y": 182.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 835.125,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 744.65625,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 744.65625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 775,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 683,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 683,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.slider-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 815.4000000059605,[39m
    [31m+         "value": 0.06731146102845015,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 136,[39m
    [31m+     "lcp": 1160,[39m
    [31m+     "maxShift": 0.0673,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/car-loan-calculators/pcp-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.068,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1579.4000000059605,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 833.40625,[39m
    [31m+               "height": 380.828125,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.96875,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.453125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 585,[39m
    [31m+               "height": 180,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 492.578125,[39m
    [31m+               "height": 310.1875,[39m
    [31m+               "left": 731.515625,[39m
    [31m+               "right": 1114.609375,[39m
    [31m+               "top": 182.390625,[39m
    [31m+               "width": 383.09375,[39m
    [31m+               "x": 731.515625,[39m
    [31m+               "y": 182.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 835.125,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 744.65625,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 744.65625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 775,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 683,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 683,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.slider-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2176.800000011921,[39m
    [31m+         "value": 0.06731146102845015,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 144,[39m
    [31m+     "lcp": 2360,[39m
    [31m+     "maxShift": 0.0673,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/car-loan-calculators/pcp-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0705,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 633.0999999940395,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 163.703125,[39m
    [31m+               "left": 771.71875,[39m
    [31m+               "right": 1074.859375,[39m
    [31m+               "top": 708.296875,[39m
    [31m+               "width": 303.140625,[39m
    [31m+               "x": 771.71875,[39m
    [31m+               "y": 708.296875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 723.125,[39m
    [31m+               "height": 244.59375,[39m
    [31m+               "left": 771.71875,[39m
    [31m+               "right": 1074.78125,[39m
    [31m+               "top": 478.53125,[39m
    [31m+               "width": 303.0625,[39m
    [31m+               "x": 771.71875,[39m
    [31m+               "y": 478.53125,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-cc-bt>div.calculator-ui.cc-bt-ui>section.cc-bt-hero>aside.cc-bt-preview-panel>div.cc-bt-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 111.734375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 760.265625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 760.265625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-bt-explanation.cc-bt-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 679.3125,[39m
    [31m+               "height": 70.5,[39m
    [31m+               "left": 786.3125,[39m
    [31m+               "right": 1059.453125,[39m
    [31m+               "top": 608.8125,[39m
    [31m+               "width": 273.140625,[39m
    [31m+               "x": 786.3125,[39m
    [31m+               "y": 608.8125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 449.546875,[39m
    [31m+               "height": 38.90625,[39m
    [31m+               "left": 786.3125,[39m
    [31m+               "right": 1059.453125,[39m
    [31m+               "top": 410.640625,[39m
    [31m+               "width": 273.140625,[39m
    [31m+               "x": 786.3125,[39m
    [31m+               "y": 410.640625,[39m
    [31m+             },[39m
    [31m+             "selector": "div.calculator-ui.cc-bt-ui>section.cc-bt-hero>aside.cc-bt-preview-panel>div.cc-bt-preview-main>p#cc-bt-summary.cc-bt-preview-note",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 944.0999999940395,[39m
    [31m+         "value": 0.06984020521213648,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 136,[39m
    [31m+     "lcp": 1032,[39m
    [31m+     "maxShift": 0.0698,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/credit-card-calculators/balance-transfer-credit-card-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0705,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1782.300000011921,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 163.703125,[39m
    [31m+               "left": 771.71875,[39m
    [31m+               "right": 1074.859375,[39m
    [31m+               "top": 708.296875,[39m
    [31m+               "width": 303.140625,[39m
    [31m+               "x": 771.71875,[39m
    [31m+               "y": 708.296875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 723.125,[39m
    [31m+               "height": 244.59375,[39m
    [31m+               "left": 771.71875,[39m
    [31m+               "right": 1074.78125,[39m
    [31m+               "top": 478.53125,[39m
    [31m+               "width": 303.0625,[39m
    [31m+               "x": 771.71875,[39m
    [31m+               "y": 478.53125,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-cc-bt>div.calculator-ui.cc-bt-ui>section.cc-bt-hero>aside.cc-bt-preview-panel>div.cc-bt-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 111.734375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 760.265625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 760.265625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-bt-explanation.cc-bt-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 679.3125,[39m
    [31m+               "height": 70.5,[39m
    [31m+               "left": 786.3125,[39m
    [31m+               "right": 1059.453125,[39m
    [31m+               "top": 608.8125,[39m
    [31m+               "width": 273.140625,[39m
    [31m+               "x": 786.3125,[39m
    [31m+               "y": 608.8125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 449.546875,[39m
    [31m+               "height": 38.90625,[39m
    [31m+               "left": 786.3125,[39m
    [31m+               "right": 1059.453125,[39m
    [31m+               "top": 410.640625,[39m
    [31m+               "width": 273.140625,[39m
    [31m+               "x": 786.3125,[39m
    [31m+               "y": 410.640625,[39m
    [31m+             },[39m
    [31m+             "selector": "div.calculator-ui.cc-bt-ui>section.cc-bt-hero>aside.cc-bt-preview-panel>div.cc-bt-preview-main>p#cc-bt-summary.cc-bt-preview-note",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 3604.5999999940395,[39m
    [31m+         "value": 0.06984020521213648,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 176,[39m
    [31m+     "lcp": 3788,[39m
    [31m+     "maxShift": 0.0698,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/credit-card-calculators/balance-transfer-credit-card-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.096,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 682.1999999880791,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 147.171875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 724.828125,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 724.828125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 167.171875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 704.828125,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 704.828125,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-con-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 22.9375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 849.0625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 849.0625,[39m
    [31m+             },[39m
    [31m+             "selector": "section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-con-explanation.explanation-pane>section.cc-con-exp-section.cc-con-exp-section--lifetime",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 779.9000000059605,[39m
    [31m+         "value": 0.0021084872574234277,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 134.234375,[39m
    [31m+               "left": 272,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 737.765625,[39m
    [31m+               "width": 820.125,[39m
    [31m+               "x": 272,[39m
    [31m+               "y": 737.765625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 147.171875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 724.828125,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 724.828125,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-con-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 698.375,[39m
    [31m+               "height": 276.015625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.578125,[39m
    [31m+               "top": 422.359375,[39m
    [31m+               "width": 300.0625,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 422.359375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 606.796875,[39m
    [31m+               "height": 276.015625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.53125,[39m
    [31m+               "top": 330.78125,[39m
    [31m+               "width": 300.015625,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 330.78125,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-cc-con>div.calculator-ui.cc-con-ui>section.cc-con-hero>aside.cc-con-preview-panel>div.cc-con-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 29.953125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 842.046875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 842.046875,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1083.300000011921,[39m
    [31m+         "value": 0.09322883367119983,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 160,[39m
    [31m+     "lcp": 1164,[39m
    [31m+     "maxShift": 0.0932,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/credit-card-calculators/credit-card-consolidation-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.096,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1892.6000000238419,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 147.171875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 724.828125,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 724.828125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 167.171875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 704.828125,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 704.828125,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-con-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 22.9375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 849.0625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 849.0625,[39m
    [31m+             },[39m
    [31m+             "selector": "section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-con-explanation.explanation-pane>section.cc-con-exp-section.cc-con-exp-section--lifetime",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2055.100000023842,[39m
    [31m+         "value": 0.0021084872574234277,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 134.234375,[39m
    [31m+               "left": 272,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 737.765625,[39m
    [31m+               "width": 820.125,[39m
    [31m+               "x": 272,[39m
    [31m+               "y": 737.765625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 147.171875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 724.828125,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 724.828125,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-con-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 698.375,[39m
    [31m+               "height": 276.015625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.578125,[39m
    [31m+               "top": 422.359375,[39m
    [31m+               "width": 300.0625,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 422.359375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 606.796875,[39m
    [31m+               "height": 276.015625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.53125,[39m
    [31m+               "top": 330.78125,[39m
    [31m+               "width": 300.015625,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 330.78125,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-cc-con>div.calculator-ui.cc-con-ui>section.cc-con-hero>aside.cc-con-preview-panel>div.cc-con-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 29.953125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 842.046875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 842.046875,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 3673.4000000059605,[39m
    [31m+         "value": 0.09322883367119983,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 232,[39m
    [31m+     "lcp": 3772,[39m
    [31m+     "maxShift": 0.0932,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/credit-card-calculators/credit-card-consolidation-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1364,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 46,[39m
    [31m+               "left": 272,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 826,[39m
    [31m+               "width": 820,[39m
    [31m+               "x": 272,[39m
    [31m+               "y": 826,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 167,[39m
    [31m+               "left": 272,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 705,[39m
    [31m+               "width": 820,[39m
    [31m+               "x": 272,[39m
    [31m+               "y": 705,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 115,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 757,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 757,[39m
    [31m+             },[39m
    [31m+             "selector": "section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation>section.cc-payoff-exp-section",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 822,[39m
    [31m+               "height": 16,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 806,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 806,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 701,[39m
    [31m+               "height": 16,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 685,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 685,[39m
    [31m+             },[39m
    [31m+             "selector": "div.calculator-ui.cc-payoff-ui>section.cc-payoff-hero>aside.cc-payoff-preview-panel>div.cc-payoff-preview-main>div#cc-payoff-summary.result-detail",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 680.4000000059605,[39m
    [31m+         "value": 0.017904894367835683,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 679.03125,[39m
    [31m+               "height": 552.03125,[39m
    [31m+               "left": 664.875,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 127,[39m
    [31m+               "width": 461.125,[39m
    [31m+               "x": 664.875,[39m
    [31m+               "y": 127,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 822,[39m
    [31m+               "height": 239,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 583,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 583,[39m
    [31m+             },[39m
    [31m+             "selector": "div.calculator-page-single>div#calc-cc-payoff>div.calculator-ui.cc-payoff-ui>section.cc-payoff-hero>aside.cc-payoff-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 241.171875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 630.828125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 630.828125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 46,[39m
    [31m+               "left": 272,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 826,[39m
    [31m+               "width": 820,[39m
    [31m+               "x": 272,[39m
    [31m+               "y": 826,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 9.578125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 862.421875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 862.421875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "selector": "section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation>section.cc-payoff-exp-section",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 780.6000000238419,[39m
    [31m+         "value": 0.11847095354571391,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 216,[39m
    [31m+     "lcp": 532,[39m
    [31m+     "maxShift": 0.1185,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/credit-card-calculators/credit-card-payment-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1551,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1274.7999999821186,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 331.703125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 540.296875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 540.296875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 167,[39m
    [31m+               "left": 272,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 705,[39m
    [31m+               "width": 820,[39m
    [31m+               "x": 272,[39m
    [31m+               "y": 705,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 482.09375,[39m
    [31m+               "height": 355.09375,[39m
    [31m+               "left": 664.875,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 127,[39m
    [31m+               "width": 461.125,[39m
    [31m+               "x": 664.875,[39m
    [31m+               "y": 127,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 701,[39m
    [31m+               "height": 118,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 583,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 583,[39m
    [31m+             },[39m
    [31m+             "selector": "div.calculator-page-single>div#calc-cc-payoff>div.calculator-ui.cc-payoff-ui>section.cc-payoff-hero>aside.cc-payoff-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 33.875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 838.125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 838.125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "selector": "section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation>div.cc-payoff-faq-grid",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2111.899999976158,[39m
    [31m+         "value": 0.11465881694488196,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 241.171875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 630.828125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 630.828125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 331.703125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 540.296875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 540.296875,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 609.03125,[39m
    [31m+               "height": 125,[39m
    [31m+               "left": 951,[39m
    [31m+               "right": 1091,[39m
    [31m+               "top": 484.03125,[39m
    [31m+               "width": 140,[39m
    [31m+               "x": 951,[39m
    [31m+               "y": 484.03125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 497.09375,[39m
    [31m+               "height": 210,[39m
    [31m+               "left": 951,[39m
    [31m+               "right": 1091,[39m
    [31m+               "top": 287.09375,[39m
    [31m+               "width": 140,[39m
    [31m+               "x": 951,[39m
    [31m+               "y": 287.09375,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-cc-payoff>div.calculator-ui.cc-payoff-ui>section.cc-payoff-hero>aside.cc-payoff-preview-panel>::after",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 33.875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 838.125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 838.125,[39m
    [31m+             },[39m
    [31m+             "selector": "section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation>div.cc-payoff-faq-grid",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 3536,[39m
    [31m+         "value": 0.03983259452696266,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 272,[39m
    [31m+     "lcp": 916,[39m
    [31m+     "maxShift": 0.1147,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/credit-card-calculators/credit-card-payment-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0266,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 138.90625,[39m
    [31m+               "left": 249,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 733.09375,[39m
    [31m+               "width": 877,[39m
    [31m+               "x": 249,[39m
    [31m+               "y": 733.09375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 179.140625,[39m
    [31m+               "left": 249,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 692.859375,[39m
    [31m+               "width": 843,[39m
    [31m+               "x": 249,[39m
    [31m+               "y": 692.859375,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#ci-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 687.078125,[39m
    [31m+               "height": 247.90625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1072.609375,[39m
    [31m+               "top": 439.171875,[39m
    [31m+               "width": 299.09375,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 439.171875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 599.171875,[39m
    [31m+               "height": 126,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1072.609375,[39m
    [31m+               "top": 473.171875,[39m
    [31m+               "width": 299.09375,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 473.171875,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 744.09375,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 751.125,[39m
    [31m+               "top": 652.09375,[39m
    [31m+               "width": 499.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 652.09375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 703.953125,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 611.953125,[39m
    [31m+               "width": 478.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 611.953125,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 662.8999999761581,[39m
    [31m+         "value": 0.023609088569121885,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 117.421875,[39m
    [31m+               "left": 249,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 754.578125,[39m
    [31m+               "width": 877,[39m
    [31m+               "x": 249,[39m
    [31m+               "y": 754.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 138.90625,[39m
    [31m+               "left": 249,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 733.09375,[39m
    [31m+               "width": 877,[39m
    [31m+               "x": 249,[39m
    [31m+               "y": 733.09375,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#ci-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 709.59375,[39m
    [31m+               "height": 35.609375,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1072.9375,[39m
    [31m+               "top": 673.984375,[39m
    [31m+               "width": 299.421875,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 673.984375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 681.484375,[39m
    [31m+               "height": 31.59375,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1072.609375,[39m
    [31m+               "top": 649.890625,[39m
    [31m+               "width": 299.09375,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 649.890625,[39m
    [31m+             },[39m
    [31m+             "selector": "div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list>div.mtg-snapshot-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 672.390625,[39m
    [31m+               "height": 36.609375,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.25,[39m
    [31m+               "top": 635.78125,[39m
    [31m+               "width": 299.734375,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 635.78125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 648.296875,[39m
    [31m+               "height": 32.59375,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1072.609375,[39m
    [31m+               "top": 615.703125,[39m
    [31m+               "width": 299.09375,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 615.703125,[39m
    [31m+             },[39m
    [31m+             "selector": "div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list>div.mtg-snapshot-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 968,[39m
    [31m+         "value": 0.0029713330031748315,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 208,[39m
    [31m+     "lcp": 1076,[39m
    [31m+     "maxShift": 0.0236,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/finance-calculators/compound-interest-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1133,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 622.09375,[39m
    [31m+               "height": 491.09375,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 589,[39m
    [31m+               "height": 192,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 397,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 397,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-effective-annual-rate>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 521.09375,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 751.125,[39m
    [31m+               "top": 429.09375,[39m
    [31m+               "width": 499.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 429.09375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 412,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 320,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 320,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 435.109375,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 349.71875,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 349.71875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 362,[39m
    [31m+               "height": 79,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 283,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 283,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 708.4000000059605,[39m
    [31m+         "value": 0.11325451716210426,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 128,[39m
    [31m+     "lcp": 836,[39m
    [31m+     "maxShift": 0.1133,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/finance-calculators/effective-annual-rate-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1133,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 622.09375,[39m
    [31m+               "height": 491.09375,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 589,[39m
    [31m+               "height": 192,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 397,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 397,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-effective-annual-rate>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 521.09375,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 751.125,[39m
    [31m+               "top": 429.09375,[39m
    [31m+               "width": 499.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 429.09375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 412,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 320,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 320,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 435.109375,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 349.71875,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 349.71875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 362,[39m
    [31m+               "height": 79,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 283,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 283,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1994.9000000059605,[39m
    [31m+         "value": 0.11325451716210426,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 112,[39m
    [31m+     "lcp": 2240,[39m
    [31m+     "maxShift": 0.1133,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/effective-annual-rate-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1806,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 808.984375,[39m
    [31m+               "height": 677.984375,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 247,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 625,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-future-value>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 483.671875,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 393.203125,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 393.203125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 435,[39m
    [31m+               "height": 152,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 283,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 283,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-grid-2-col",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 665.3125,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 579.921875,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 579.921875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 590,[39m
    [31m+               "height": 127,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 463,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 463,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 738.3000000119209,[39m
    [31m+         "value": 0.18056963745620366,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 677,[39m
    [31m+               "height": 18.015625,[39m
    [31m+               "left": 1045.203125,[39m
    [31m+               "right": 1073.203125,[39m
    [31m+               "top": 658.984375,[39m
    [31m+               "width": 28,[39m
    [31m+               "x": 1045.203125,[39m
    [31m+               "y": 658.984375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 677,[39m
    [31m+               "height": 18.015625,[39m
    [31m+               "left": 1064.765625,[39m
    [31m+               "right": 1072.765625,[39m
    [31m+               "top": 658.984375,[39m
    [31m+               "width": 8,[39m
    [31m+               "x": 1064.765625,[39m
    [31m+               "y": 658.984375,[39m
    [31m+             },[39m
    [31m+             "selector": "section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list>div.mtg-snapshot-row>strong",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 848.8000000119209,[39m
    [31m+         "value": 0.0000056293951547634035,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 96,[39m
    [31m+     "lcp": 816,[39m
    [31m+     "maxShift": 0.1806,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/finance-calculators/future-value-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1806,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 808.984375,[39m
    [31m+               "height": 677.984375,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 247,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 625,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-future-value>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 483.671875,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 393.203125,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 393.203125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 435,[39m
    [31m+               "height": 152,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 283,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 283,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-grid-2-col",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 665.3125,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 579.921875,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 579.921875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 590,[39m
    [31m+               "height": 127,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 463,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 463,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2159.2999999821186,[39m
    [31m+         "value": 0.18056963745620366,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 677,[39m
    [31m+               "height": 18.015625,[39m
    [31m+               "left": 1045.203125,[39m
    [31m+               "right": 1073.203125,[39m
    [31m+               "top": 658.984375,[39m
    [31m+               "width": 28,[39m
    [31m+               "x": 1045.203125,[39m
    [31m+               "y": 658.984375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 677,[39m
    [31m+               "height": 18.015625,[39m
    [31m+               "left": 1064.765625,[39m
    [31m+               "right": 1072.765625,[39m
    [31m+               "top": 658.984375,[39m
    [31m+               "width": 8,[39m
    [31m+               "x": 1064.765625,[39m
    [31m+               "y": 658.984375,[39m
    [31m+             },[39m
    [31m+             "selector": "section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list>div.mtg-snapshot-row>strong",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2301.5,[39m
    [31m+         "value": 0.0000056293951547634035,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 40,[39m
    [31m+     "lcp": 2204,[39m
    [31m+     "maxShift": 0.1806,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/future-value-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.181,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 808.984375,[39m
    [31m+               "height": 677.984375,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 259,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 613,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 613,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-future-value-of-annuity>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 634.859375,[39m
    [31m+               "height": 167.78125,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 467.078125,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 467.078125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 578,[39m
    [31m+               "height": 175,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 403,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 403,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 464.1875,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 373.71875,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 373.71875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 435,[39m
    [31m+               "height": 152,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 283,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 283,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-grid-2-col",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2159.300000011921,[39m
    [31m+         "value": 0.18065532709422263,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 462.546875,[39m
    [31m+               "height": 133,[39m
    [31m+               "left": 607.984375,[39m
    [31m+               "right": 769.984375,[39m
    [31m+               "top": 329.546875,[39m
    [31m+               "width": 162,[39m
    [31m+               "x": 607.984375,[39m
    [31m+               "y": 329.546875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 459.546875,[39m
    [31m+               "height": 130,[39m
    [31m+               "left": 633.59375,[39m
    [31m+               "right": 770.59375,[39m
    [31m+               "top": 329.546875,[39m
    [31m+               "width": 137,[39m
    [31m+               "x": 633.59375,[39m
    [31m+               "y": 329.546875,[39m
    [31m+             },[39m
    [31m+             "selector": "div.mtg-form-panel>div.input-grid-2-col>div.input-row.slider-row>div.slider-header>span#fva-periods-display.slider-value",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2330.5999999940395,[39m
    [31m+         "value": 0.0003169457740710956,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 48,[39m
    [31m+     "lcp": 2208,[39m
    [31m+     "maxShift": 0.1807,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/future-value-of-annuity-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1931,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 49,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 823,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 823,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 89,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 783,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 783,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 854,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 837,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 837,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 855,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 855,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 576.1999999880791,[39m
    [31m+         "value": 0.006107435118073416,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 863.96875,[39m
    [31m+               "height": 732.96875,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 191,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 681,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 681,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-investment-growth>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 546.046875,[39m
    [31m+               "height": 289.6875,[39m
    [31m+               "left": 265.484375,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 256.359375,[39m
    [31m+               "width": 464.640625,[39m
    [31m+               "x": 265.484375,[39m
    [31m+               "y": 256.359375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 599,[39m
    [31m+               "height": 392,[39m
    [31m+               "left": 253,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 207,[39m
    [31m+               "width": 839,[39m
    [31m+               "x": 253,[39m
    [31m+               "y": 207,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.ig-slider-grid",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 769.3125,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 751.125,[39m
    [31m+               "top": 677.3125,[39m
    [31m+               "width": 499.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 677.3125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 696,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 604,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 604,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 661.3000000119209,[39m
    [31m+         "value": 0.1870386709386008,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 700,[39m
    [31m+     "maxShift": 0.187,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/finance-calculators/investment-growth-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.187,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 863.96875,[39m
    [31m+               "height": 732.96875,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 191,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 681,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 681,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-investment-growth>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 546.046875,[39m
    [31m+               "height": 289.6875,[39m
    [31m+               "left": 265.484375,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 256.359375,[39m
    [31m+               "width": 464.640625,[39m
    [31m+               "x": 265.484375,[39m
    [31m+               "y": 256.359375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 599,[39m
    [31m+               "height": 392,[39m
    [31m+               "left": 253,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 207,[39m
    [31m+               "width": 839,[39m
    [31m+               "x": 253,[39m
    [31m+               "y": 207,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.ig-slider-grid",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 769.3125,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 751.125,[39m
    [31m+               "top": 677.3125,[39m
    [31m+               "width": 499.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 677.3125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 696,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 604,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 604,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2245.9000000059605,[39m
    [31m+         "value": 0.1870386709386008,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 48,[39m
    [31m+     "lcp": 2284,[39m
    [31m+     "maxShift": 0.187,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/investment-growth-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.328,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 456.65625,[39m
    [31m+               "height": 200.296875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 256.359375,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 256.359375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 573,[39m
    [31m+               "height": 366,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 207,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 207,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.ir-grid",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 679.375,[39m
    [31m+               "height": 548.375,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-investment-return>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 713.65625,[39m
    [31m+               "height": 225.015625,[39m
    [31m+               "left": 266.109375,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 488.640625,[39m
    [31m+               "width": 464.015625,[39m
    [31m+               "x": 266.109375,[39m
    [31m+               "y": 488.640625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 778,[39m
    [31m+               "height": 199,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 579,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 579,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 602.4000000059605,[39m
    [31m+         "value": 0.3280307524605587,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 48,[39m
    [31m+     "lcp": 640,[39m
    [31m+     "maxShift": 0.328,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/finance-calculators/investment-return-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.328,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 456.65625,[39m
    [31m+               "height": 200.296875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 256.359375,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 256.359375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 573,[39m
    [31m+               "height": 366,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 207,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 207,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.ir-grid",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 679.375,[39m
    [31m+               "height": 548.375,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-investment-return>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 713.65625,[39m
    [31m+               "height": 225.015625,[39m
    [31m+               "left": 266.109375,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 488.640625,[39m
    [31m+               "width": 464.015625,[39m
    [31m+               "x": 266.109375,[39m
    [31m+               "y": 488.640625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 778,[39m
    [31m+               "height": 199,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 579,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 579,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2143.800000011921,[39m
    [31m+         "value": 0.3280307524605587,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 56,[39m
    [31m+     "lcp": 2180,[39m
    [31m+     "maxShift": 0.328,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/investment-return-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1864,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 25,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 847,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 847,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 85,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 787,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 787,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 840,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 823,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 823,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 858,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 841,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 841,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 573,[39m
    [31m+         "value": 0.004559781973345804,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 741,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 187,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 685,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 685,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-monthly-savings-needed>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 828.03125,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 742.640625,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 742.640625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 650,[39m
    [31m+               "height": 127,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 523,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 523,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 646.390625,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 261,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 555.921875,[39m
    [31m+               "width": 469.125,[39m
    [31m+               "x": 261,[39m
    [31m+               "y": 555.921875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 495,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 253,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 403,[39m
    [31m+               "width": 839,[39m
    [31m+               "x": 253,[39m
    [31m+               "y": 403,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.slider-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 656.9000000059605,[39m
    [31m+         "value": 0.181800908910083,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 700,[39m
    [31m+     "maxShift": 0.1818,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/finance-calculators/monthly-savings-needed-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1941,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 793.03125,[39m
    [31m+               "height": 662.03125,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 187,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 685,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 685,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-monthly-savings-needed>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 828.03125,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 742.640625,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 742.640625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 650,[39m
    [31m+               "height": 127,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 523,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 523,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 646.390625,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 261,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 555.921875,[39m
    [31m+               "width": 469.125,[39m
    [31m+               "x": 261,[39m
    [31m+               "y": 555.921875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 495,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 253,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 403,[39m
    [31m+               "width": 839,[39m
    [31m+               "x": 253,[39m
    [31m+               "y": 403,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.slider-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2168.7999999821186,[39m
    [31m+         "value": 0.1810072455731212,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 866.609375,[39m
    [31m+               "height": 390.625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.640625,[39m
    [31m+               "top": 475.984375,[39m
    [31m+               "width": 300.125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 475.984375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 713.640625,[39m
    [31m+               "height": 350.46875,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1072.609375,[39m
    [31m+               "top": 363.171875,[39m
    [31m+               "width": 299.09375,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 363.171875,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2268.2999999821186,[39m
    [31m+         "value": 0.013108215649241776,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 2308,[39m
    [31m+     "maxShift": 0.181,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/monthly-savings-needed-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1797,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 770.78125,[39m
    [31m+               "height": 639.78125,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 815,[39m
    [31m+               "height": 250,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 565,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 565,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-present-value>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 483.671875,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 393.203125,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 393.203125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 435,[39m
    [31m+               "height": 152,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 283,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 283,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-grid-2-col",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 571.953125,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 486.5625,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 486.5625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 530,[39m
    [31m+               "height": 127,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 403,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 403,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 664.5999999940395,[39m
    [31m+         "value": 0.1796509854403384,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 56,[39m
    [31m+     "lcp": 708,[39m
    [31m+     "maxShift": 0.1797,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/finance-calculators/present-value-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1797,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 770.78125,[39m
    [31m+               "height": 639.78125,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 815,[39m
    [31m+               "height": 250,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 565,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 565,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-present-value>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 483.671875,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 393.203125,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 393.203125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 435,[39m
    [31m+               "height": 152,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 283,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 283,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-grid-2-col",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 571.953125,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 486.5625,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 486.5625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 530,[39m
    [31m+               "height": 127,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 403,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 403,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2169.300000011921,[39m
    [31m+         "value": 0.1796509854403384,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 56,[39m
    [31m+     "lcp": 2216,[39m
    [31m+     "maxShift": 0.1797,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/present-value-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1811,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 808.984375,[39m
    [31m+               "height": 677.984375,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 259,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 613,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 613,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-present-value-of-annuity>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 654.34375,[39m
    [31m+               "height": 167.78125,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 486.5625,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 486.5625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 578,[39m
    [31m+               "height": 175,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 403,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 403,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 483.671875,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 393.203125,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 393.203125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 435,[39m
    [31m+               "height": 152,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 283,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 283,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-grid-2-col",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2164.699999988079,[39m
    [31m+         "value": 0.1807956808116675,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 482.03125,[39m
    [31m+               "height": 133,[39m
    [31m+               "left": 607.984375,[39m
    [31m+               "right": 769.984375,[39m
    [31m+               "top": 349.03125,[39m
    [31m+               "width": 162,[39m
    [31m+               "x": 607.984375,[39m
    [31m+               "y": 349.03125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 479.03125,[39m
    [31m+               "height": 130,[39m
    [31m+               "left": 633.59375,[39m
    [31m+               "right": 770.59375,[39m
    [31m+               "top": 349.03125,[39m
    [31m+               "width": 137,[39m
    [31m+               "x": 633.59375,[39m
    [31m+               "y": 349.03125,[39m
    [31m+             },[39m
    [31m+             "selector": "div.mtg-form-panel>div.input-grid-2-col>div.input-row.slider-row>div.slider-header>span#pva-periods-display.slider-value",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2305.699999988079,[39m
    [31m+         "value": 0.0003169457740710956,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 40,[39m
    [31m+     "lcp": 2212,[39m
    [31m+     "maxShift": 0.1808,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/present-value-of-annuity-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0797,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 93.21875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 778.78125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 778.78125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 211.09375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 660.90625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 660.90625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#si-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 493.578125,[39m
    [31m+               "height": 311.1875,[39m
    [31m+               "left": 731.515625,[39m
    [31m+               "right": 1114.609375,[39m
    [31m+               "top": 182.390625,[39m
    [31m+               "width": 383.09375,[39m
    [31m+               "x": 731.515625,[39m
    [31m+               "y": 182.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 111.1875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 760.8125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 760.8125,[39m
    [31m+             },[39m
    [31m+             "selector": "div.panel.panel-scroll>div.calculator-page-single>div#si-explanation.explanation-pane>div#loan-mtg-explanation>section.mtg-exp-section",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2131,[39m
    [31m+         "value": 0.07936382182232077,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 440.765625,[39m
    [31m+               "height": 131,[39m
    [31m+               "left": 617,[39m
    [31m+               "right": 769,[39m
    [31m+               "top": 309.765625,[39m
    [31m+               "width": 152,[39m
    [31m+               "x": 617,[39m
    [31m+               "y": 309.765625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 434.765625,[39m
    [31m+               "height": 122,[39m
    [31m+               "left": 645.59375,[39m
    [31m+               "right": 765.59375,[39m
    [31m+               "top": 312.765625,[39m
    [31m+               "width": 120,[39m
    [31m+               "x": 645.59375,[39m
    [31m+               "y": 312.765625,[39m
    [31m+             },[39m
    [31m+             "selector": "div.mtg-form-panel>div.input-grid-2-col>div.input-row.slider-row>div.slider-header>span#si-time-display.slider-value",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2212.199999988079,[39m
    [31m+         "value": 0.00029097498246434414,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 40,[39m
    [31m+     "lcp": 2252,[39m
    [31m+     "maxShift": 0.0794,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/simple-interest-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.2039,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 724.65625,[39m
    [31m+               "height": 593.65625,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 855,[39m
    [31m+               "height": 246,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 609,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 609,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-time-to-savings-goal>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 715.1875,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 629.796875,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 629.796875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 574,[39m
    [31m+               "height": 127,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 447,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 447,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 801.171875,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 751.125,[39m
    [31m+               "top": 709.171875,[39m
    [31m+               "width": 499.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 709.171875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 624,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 532,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 532,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2136.399999976158,[39m
    [31m+         "value": 0.18179470379836438,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 844.609375,[39m
    [31m+               "height": 314.21875,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.546875,[39m
    [31m+               "top": 530.390625,[39m
    [31m+               "width": 300.03125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 530.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 645.265625,[39m
    [31m+               "height": 282.09375,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1072.609375,[39m
    [31m+               "top": 363.171875,[39m
    [31m+               "width": 299.09375,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 363.171875,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 81.828125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 790.171875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 790.171875,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#tsg-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2242.899999976158,[39m
    [31m+         "value": 0.02209166172606522,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 40,[39m
    [31m+     "lcp": 2284,[39m
    [31m+     "maxShift": 0.1818,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/time-to-savings-goal-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1008,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 673,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 199,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 199,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 681,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 583.734375,[39m
    [31m+               "height": 444.734375,[39m
    [31m+               "left": 690.71875,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 139,[39m
    [31m+               "width": 435.28125,[39m
    [31m+               "x": 690.71875,[39m
    [31m+               "y": 139,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 587.734375,[39m
    [31m+               "height": 396.734375,[39m
    [31m+               "left": 750.71875,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 341.28125,[39m
    [31m+               "x": 750.71875,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div.calculator-page-single>div#calc-buy-to-let>div.calculator-ui.btl-ui>section.btl-hero>aside.btl-preview-panel.is-positive",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 178,[39m
    [31m+               "height": 27,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 151,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 151,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 178,[39m
    [31m+               "height": 27,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 151,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 151,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 672,[39m
    [31m+         "value": 0.10076524638559944,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 112,[39m
    [31m+     "lcp": 708,[39m
    [31m+     "maxShift": 0.1008,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/loan-calculators/buy-to-let-mortgage-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0967,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 673,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 199,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 199,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 681,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 178,[39m
    [31m+               "height": 27,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 151,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 151,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 178,[39m
    [31m+               "height": 27,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 151,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 151,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 6.75,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 865.25,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 865.25,[39m
    [31m+             },[39m
    [31m+             "selector": "div.panel.panel-scroll>div.calculator-page-single>div#loan-btl-explanation>section.btl-exp-section.btl-exp-section--summary>h2",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1818.5999999940395,[39m
    [31m+         "value": 0.09667237212460207,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 1868,[39m
    [31m+     "maxShift": 0.0967,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/loan-calculators/buy-to-let-mortgage-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.077,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 777.8125,[39m
    [31m+               "height": 282.1875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 753.1875,[39m
    [31m+               "top": 495.625,[39m
    [31m+               "width": 480.1875,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 495.625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 796.1875,[39m
    [31m+               "height": 269.1875,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 745.1875,[39m
    [31m+               "top": 527,[39m
    [31m+               "width": 493.1875,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 527,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-how-much-can-borrow>div.calculator-ui.borrow-ui>section.borrow-hero>div.borrow-form-panel>section.borrow-section",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 463.625,[39m
    [31m+               "height": 192,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 745.1875,[39m
    [31m+               "top": 271.625,[39m
    [31m+               "width": 472.1875,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 271.625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 527,[39m
    [31m+               "height": 272,[39m
    [31m+               "left": 253,[39m
    [31m+               "right": 745.1875,[39m
    [31m+               "top": 255,[39m
    [31m+               "width": 492.1875,[39m
    [31m+               "x": 253,[39m
    [31m+               "y": 255,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-how-much-can-borrow>div.calculator-ui.borrow-ui>section.borrow-hero>div.borrow-form-panel>section.borrow-section",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 615.578125,[39m
    [31m+               "height": 366.578125,[39m
    [31m+               "left": 779.1875,[39m
    [31m+               "right": 1090,[39m
    [31m+               "top": 249,[39m
    [31m+               "width": 310.8125,[39m
    [31m+               "x": 779.1875,[39m
    [31m+               "y": 249,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 337,[39m
    [31m+               "height": 96,[39m
    [31m+               "left": 777.1875,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 241,[39m
    [31m+               "width": 314.8125,[39m
    [31m+               "x": 777.1875,[39m
    [31m+               "y": 241,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-how-much-can-borrow>div.calculator-ui.borrow-ui>section.borrow-hero>aside.borrow-result-dashboard>div.borrow-metric-grid",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 652.9000000059605,[39m
    [31m+         "value": 0.07695304062705279,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 80,[39m
    [31m+     "lcp": 708,[39m
    [31m+     "maxShift": 0.077,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/loan-calculators/how-much-can-i-borrow/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0777,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 777.8125,[39m
    [31m+               "height": 282.1875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 753.1875,[39m
    [31m+               "top": 495.625,[39m
    [31m+               "width": 480.1875,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 495.625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 796.1875,[39m
    [31m+               "height": 269.1875,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 745.1875,[39m
    [31m+               "top": 527,[39m
    [31m+               "width": 493.1875,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 527,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-how-much-can-borrow>div.calculator-ui.borrow-ui>section.borrow-hero>div.borrow-form-panel>section.borrow-section",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 463.625,[39m
    [31m+               "height": 192,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 745.1875,[39m
    [31m+               "top": 271.625,[39m
    [31m+               "width": 472.1875,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 271.625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 527,[39m
    [31m+               "height": 272,[39m
    [31m+               "left": 253,[39m
    [31m+               "right": 745.1875,[39m
    [31m+               "top": 255,[39m
    [31m+               "width": 492.1875,[39m
    [31m+               "x": 253,[39m
    [31m+               "y": 255,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-how-much-can-borrow>div.calculator-ui.borrow-ui>section.borrow-hero>div.borrow-form-panel>section.borrow-section",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 615.578125,[39m
    [31m+               "height": 366.578125,[39m
    [31m+               "left": 779.1875,[39m
    [31m+               "right": 1090,[39m
    [31m+               "top": 249,[39m
    [31m+               "width": 310.8125,[39m
    [31m+               "x": 779.1875,[39m
    [31m+               "y": 249,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 337,[39m
    [31m+               "height": 96,[39m
    [31m+               "left": 777.1875,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 241,[39m
    [31m+               "width": 314.8125,[39m
    [31m+               "x": 777.1875,[39m
    [31m+               "y": 241,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-how-much-can-borrow>div.calculator-ui.borrow-ui>section.borrow-hero>aside.borrow-result-dashboard>div.borrow-metric-grid",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1716.6000000238419,[39m
    [31m+         "value": 0.0776522022396394,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 631.8125,[39m
    [31m+               "height": 45,[39m
    [31m+               "left": 655.015625,[39m
    [31m+               "right": 741.1875,[39m
    [31m+               "top": 586.8125,[39m
    [31m+               "width": 86.171875,[39m
    [31m+               "x": 655.015625,[39m
    [31m+               "y": 586.8125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 631.8125,[39m
    [31m+               "height": 45,[39m
    [31m+               "left": 664.65625,[39m
    [31m+               "right": 741.1875,[39m
    [31m+               "top": 586.8125,[39m
    [31m+               "width": 76.53125,[39m
    [31m+               "x": 664.65625,[39m
    [31m+               "y": 586.8125,[39m
    [31m+             },[39m
    [31m+             "selector": "div.borrow-form-panel>section.borrow-section>div#bor-multiple-row.input-row.slider-row>div.slider-header>span#bor-multiple-display.slider-value",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2623.300000011921,[39m
    [31m+         "value": 0.000021302128430372528,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 1196,[39m
    [31m+     "maxShift": 0.0777,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/loan-calculators/how-much-can-i-borrow/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.4661,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 199,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 673,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 673,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 179,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 693,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 693,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-remortgage-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 38.875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 833.125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 833.125,[39m
    [31m+             },[39m
    [31m+             "selector": "section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-remortgage-explanation>section.remo-exp-section.remo-exp-section--faq",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 833.125,[39m
    [31m+               "height": 24,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 809.125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 809.125,[39m
    [31m+             },[39m
    [31m+             "selector": "div.panel.panel-scroll>div.calculator-page-single>div#loan-remortgage-explanation>section.remo-exp-section.remo-exp-section--table>div#remo-table-yearly-wrap.table-scroll",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 575.0999999940395,[39m
    [31m+         "value": 0.1270212765957447,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 177.203125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 694.796875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 694.796875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 199,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 673,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 673,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-remortgage-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 582,[39m
    [31m+               "height": 349,[39m
    [31m+               "left": 768.796875,[39m
    [31m+               "right": 1094,[39m
    [31m+               "top": 233,[39m
    [31m+               "width": 325.203125,[39m
    [31m+               "x": 768.796875,[39m
    [31m+               "y": 233,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 559,[39m
    [31m+               "height": 278,[39m
    [31m+               "left": 790.796875,[39m
    [31m+               "right": 1072,[39m
    [31m+               "top": 281,[39m
    [31m+               "width": 281.203125,[39m
    [31m+               "x": 790.796875,[39m
    [31m+               "y": 281,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-remortgage-switching>div.calculator-ui.remo-ui>section.remo-hero>aside.remo-result-dashboard>div.remo-metric-grid",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 72.546875,[39m
    [31m+               "left": 290,[39m
    [31m+               "right": 1075,[39m
    [31m+               "top": 799.453125,[39m
    [31m+               "width": 785,[39m
    [31m+               "x": 290,[39m
    [31m+               "y": 799.453125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "selector": "div.panel.panel-scroll>div.calculator-page-single>div#loan-remortgage-explanation>section.remo-exp-section.remo-exp-section--table>div#remo-table-yearly-wrap.table-scroll",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 644.4000000059605,[39m
    [31m+         "value": 0.33910050809687675,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 80,[39m
    [31m+     "lcp": 384,[39m
    [31m+     "maxShift": 0.3391,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/loan-calculators/remortgage-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1662,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 131.203125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 740.796875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 740.796875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 179,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 693,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 693,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-remortgage-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 582,[39m
    [31m+               "height": 349,[39m
    [31m+               "left": 768.796875,[39m
    [31m+               "right": 1094,[39m
    [31m+               "top": 233,[39m
    [31m+               "width": 325.203125,[39m
    [31m+               "x": 768.796875,[39m
    [31m+               "y": 233,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 559,[39m
    [31m+               "height": 278,[39m
    [31m+               "left": 790.796875,[39m
    [31m+               "right": 1072,[39m
    [31m+               "top": 281,[39m
    [31m+               "width": 281.203125,[39m
    [31m+               "x": 790.796875,[39m
    [31m+               "y": 281,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-remortgage-switching>div.calculator-ui.remo-ui>section.remo-hero>aside.remo-result-dashboard>div.remo-metric-grid",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 603.296875,[39m
    [31m+               "height": 84.703125,[39m
    [31m+               "left": 255,[39m
    [31m+               "right": 772.796875,[39m
    [31m+               "top": 518.59375,[39m
    [31m+               "width": 517.796875,[39m
    [31m+               "x": 255,[39m
    [31m+               "y": 518.59375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 615.703125,[39m
    [31m+               "height": 84.703125,[39m
    [31m+               "left": 255,[39m
    [31m+               "right": 772.796875,[39m
    [31m+               "top": 531,[39m
    [31m+               "width": 517.796875,[39m
    [31m+               "x": 255,[39m
    [31m+               "y": 531,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-remortgage-switching>div.calculator-ui.remo-ui>section.remo-hero>div.remo-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1622.0999999940395,[39m
    [31m+         "value": 0.16236728568530942,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 177.203125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 694.796875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 694.796875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 131.203125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 740.796875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 740.796875,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-remortgage-explanation",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2536.5999999940395,[39m
    [31m+         "value": 0.0038073415945756367,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 1208,[39m
    [31m+     "maxShift": 0.1624,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/loan-calculators/remortgage-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0526,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 873,[39m
    [31m+               "height": 215,[39m
    [31m+               "left": 248,[39m
    [31m+               "right": 1353,[39m
    [31m+               "top": 658,[39m
    [31m+               "width": 1105,[39m
    [31m+               "x": 248,[39m
    [31m+               "y": 658,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main.layout-main--no-ads>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#comm-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 523.296875,[39m
    [31m+               "height": 176.703125,[39m
    [31m+               "left": 932,[39m
    [31m+               "right": 1326,[39m
    [31m+               "top": 346.59375,[39m
    [31m+               "width": 394,[39m
    [31m+               "x": 932,[39m
    [31m+               "y": 346.59375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 503.140625,[39m
    [31m+               "height": 176.703125,[39m
    [31m+               "left": 932,[39m
    [31m+               "right": 1326,[39m
    [31m+               "top": 326.4375,[39m
    [31m+               "width": 394,[39m
    [31m+               "x": 932,[39m
    [31m+               "y": 326.4375,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-commission-calculator>div.calculator-ui.comm-layout>section.comm-hero>aside.comm-answer-deck>div.comm-metrics",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 873,[39m
    [31m+               "height": 1,[39m
    [31m+               "left": 248,[39m
    [31m+               "right": 1353,[39m
    [31m+               "top": 872,[39m
    [31m+               "width": 1105,[39m
    [31m+               "x": 248,[39m
    [31m+               "y": 872,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 638,[39m
    [31m+               "height": 28,[39m
    [31m+               "left": 248,[39m
    [31m+               "right": 1353,[39m
    [31m+               "top": 610,[39m
    [31m+               "width": 1105,[39m
    [31m+               "x": 248,[39m
    [31m+               "y": 610,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main.layout-main--no-ads>section.center-column>div.panel.panel-scroll>div.calculator-page-single>h3",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1930.6000000238419,[39m
    [31m+         "value": 0.052588590532944055,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 40,[39m
    [31m+     "lcp": 812,[39m
    [31m+     "maxShift": 0.0526,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/percentage-calculators/commission-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1909,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 228.4375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 643.5625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 643.5625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 301,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 571,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 571,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#revpct-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 615.5625,[39m
    [31m+               "height": 72,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 543.5625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 543.5625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 543,[39m
    [31m+               "height": 72,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 471,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 471,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 643.5625,[39m
    [31m+               "height": 28,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 615.5625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 615.5625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 571,[39m
    [31m+               "height": 28,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 543,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 543,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>h3",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 574.8000000119209,[39m
    [31m+         "value": 0.013606529109188683,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 705.328125,[39m
    [31m+               "height": 574.328125,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 615.5625,[39m
    [31m+               "height": 253.5625,[39m
    [31m+               "left": 249,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 362,[39m
    [31m+               "width": 877,[39m
    [31m+               "x": 249,[39m
    [31m+               "y": 362,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-reverse-percentage>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 158.671875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 713.328125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 713.328125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 228.4375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 643.5625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 643.5625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#revpct-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 523.0625,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 751.125,[39m
    [31m+               "top": 431.0625,[39m
    [31m+               "width": 499.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 431.0625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 424,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 332,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 332,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 627.6000000238419,[39m
    [31m+         "value": 0.17727810369867447,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 56,[39m
    [31m+     "lcp": 672,[39m
    [31m+     "maxShift": 0.1773,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/percentage-calculators/reverse-percentage-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1921,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1143,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 587.578125,[39m
    [31m+               "height": 456.578125,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 543,[39m
    [31m+               "height": 181,[39m
    [31m+               "left": 249,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 362,[39m
    [31m+               "width": 877,[39m
    [31m+               "x": 249,[39m
    [31m+               "y": 362,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-reverse-percentage>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 276.421875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 595.578125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 595.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 301,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 571,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 571,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#revpct-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 523.0625,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 751.125,[39m
    [31m+               "top": 431.0625,[39m
    [31m+               "width": 499.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 431.0625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 424,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 332,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 332,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1676,[39m
    [31m+         "value": 0.1701491040596649,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 158.671875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 713.328125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 713.328125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 276.421875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 595.578125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 595.578125,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#revpct-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 625.9375,[39m
    [31m+               "height": 161.40625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.859375,[39m
    [31m+               "top": 464.53125,[39m
    [31m+               "width": 300.34375,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 464.53125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 508.1875,[39m
    [31m+               "height": 161.40625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.859375,[39m
    [31m+               "top": 346.78125,[39m
    [31m+               "width": 300.34375,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 346.78125,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 693.328125,[39m
    [31m+               "height": 28,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 665.328125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 665.328125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 575.578125,[39m
    [31m+               "height": 28,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 547.578125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 547.578125,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>h3",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2122.5,[39m
    [31m+         "value": 0.021266017825989768,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 48,[39m
    [31m+     "lcp": 2156,[39m
    [31m+     "maxShift": 0.1701,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/percentage-calculators/reverse-percentage-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+ ][39m

      398 |       violations,
      399 |       `CWV guard failed for ${violations.length} route checks. Report: ${REPORT_PATH}\n${debugMessage}`
    > 400 |     ).toEqual([]);
          |       ^
      401 |   });
      402 | });
      403 |
        at /home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js:400:7

    [31mTest timeout of 30000ms exceeded.[39m

  15) [chromium] › tests_specs/infrastructure/e2e/gtep-pages-seo.spec.js:59:3 › FAQs page metadata ─

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveAttribute[2m([22m[32mexpected[39m[2m)[22m failed

    Locator:  locator('meta[name="description"]')
    Expected: [32m"Find answers about [7mhow C[27malculat[7me How Much calculators work, data[27m assumptions, accuracy, and [7mwhen to verify results with professionals for important decisions[27m."[39m
    Received: [31m"Find answers about [7mc[27malculat[7mor access,[27m assumptions,[7m privacy,[27m accuracy, and [7musage limits on CalcHowMuch[27m."[39m
    Timeout:  5000ms

    Call log:
    [2m  - Expect "toHaveAttribute" with timeout 5000ms[22m
    [2m  - waiting for locator('meta[name="description"]')[22m
    [2m    9 × locator resolved to <meta name="description" content="Find answers about calculator access, assumptions, privacy, accuracy, and usage limits on CalcHowMuch."/>[22m
    [2m      - unexpected value "Find answers about calculator access, assumptions, privacy, accuracy, and usage limits on CalcHowMuch."[22m


      64 |     const descriptionTag = page.locator('meta[name="description"]');
      65 |     await expect(descriptionTag).toHaveCount(1);
    > 66 |     await expect(descriptionTag).toHaveAttribute('content', description);
         |                                  ^
      67 |
      68 |     const canonicalTag = page.locator('link[rel="canonical"]');
      69 |     await expect(canonicalTag).toHaveCount(1);
        at /home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/gtep-pages-seo.spec.js:66:34

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-gtep-pages-seo-FAQs-page-metadata-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-gtep-pages-seo-FAQs-page-metadata-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/infrastructure-e2e-gtep-pages-seo-FAQs-page-metadata-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-gtep-pages-seo-FAQs-page-metadata-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/infrastructure-e2e-gtep-pages-seo-FAQs-page-metadata-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  16) [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:235:3 › ISS-001: Layout Stability › visual regression - page layout stability 

    Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveScreenshot[2m([22m[32mexpected[39m[2m)[22m failed

      83094 pixels (ratio 0.10 of all image pixels) are different.

      Snapshot: layout-initial.png

    Call log:
    [2m  - Expect "toHaveScreenshot(layout-initial.png)" with timeout 5000ms[22m
    [2m    - verifying given screenshot expectation[22m
    [2m  - taking page screenshot[22m
    [2m    - disabled all CSS animations[22m
    [2m  - waiting for fonts to load...[22m
    [2m  - fonts loaded[22m
    [2m  - 83094 pixels (ratio 0.10 of all image pixels) are different.[22m
    [2m  - waiting 100ms before taking screenshot[22m
    [2m  - taking page screenshot[22m
    [2m    - disabled all CSS animations[22m
    [2m  - waiting for fonts to load...[22m
    [2m  - fonts loaded[22m
    [2m  - captured a stable screenshot[22m
    [2m  - 83094 pixels (ratio 0.10 of all image pixels) are different.[22m


      236 |     // Take screenshot after initial load
      237 |     await waitForStableShell(page);
    > 238 |     await expect(page).toHaveScreenshot('layout-initial.png', {
          |                        ^
      239 |       fullPage: true,
      240 |       animations: 'disabled',
      241 |     });
        at /home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/iss-design-001.spec.js:238:24

    attachment #1: layout-initial (image/png) ──────────────────────────────────────────────────────
    Expected: tests_specs/infrastructure/e2e/iss-design-001.spec.js-snapshots/layout-initial-chromium-linux.png
    Received: test-results/infrastructure-e2e-iss-des-edb3f-ion---page-layout-stability-chromium/layout-initial-actual.png
    Diff:     test-results/infrastructure-e2e-iss-des-edb3f-ion---page-layout-stability-chromium/layout-initial-diff.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-iss-des-edb3f-ion---page-layout-stability-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #3: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-iss-des-edb3f-ion---page-layout-stability-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/infrastructure-e2e-iss-des-edb3f-ion---page-layout-stability-chromium/error-context.md

    attachment #5: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-iss-des-edb3f-ion---page-layout-stability-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/infrastructure-e2e-iss-des-edb3f-ion---page-layout-stability-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  17) [chromium] › tests_specs/infrastructure/e2e/route-archetype-contract.spec.js:40:1 › ROUTE-ARCHETYPE-002: generated body metadata and pane presence match metadata contract 

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeTruthy[2m()[22m

    Received: [31mfalse[39m

      75 |         expect(centerPanelCount).toBeGreaterThanOrEqual(2);
      76 |       } else {
    > 77 |         expect(hasExplanationPane).toBeTruthy();
         |                                    ^
      78 |       }
      79 |     } else if (calculator.routeArchetype === 'calc_only') {
      80 |       expect(hasCalcPane).toBeTruthy();
        at /home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/route-archetype-contract.spec.js:77:36

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-route-a-f7a68-nce-match-metadata-contract-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-route-a-f7a68-nce-match-metadata-contract-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/infrastructure-e2e-route-a-f7a68-nce-match-metadata-contract-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-route-a-f7a68-nce-match-metadata-contract-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/infrastructure-e2e-route-a-f7a68-nce-match-metadata-contract-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  18) [chromium] › tests_specs/infrastructure/e2e/sitemap-footer.spec.js:4:3 › Sitemap footer link › SITEMAP-TEST-E2E-1: footer link navigates to sitemap page 

    Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected[39m[2m)[22m failed

    Expected pattern: [32m/\/sitemap\/?$/[39m
    Received string:  [31m"http://localhost:8001/sitemap.xml"[39m
    Timeout: 5000ms

    Call log:
    [2m  - Expect "toHaveURL" with timeout 5000ms[22m
    [2m    9 × unexpected value "http://localhost:8001/sitemap.xml"[22m


      14 |
      15 |     await footerLinks.nth(4).click();
    > 16 |     await expect(page).toHaveURL(/\/sitemap\/?$/);
         |                        ^
      17 |     await expect(page.locator('h1')).toHaveText('Sitemap');
      18 |     const headingCount = await page.locator('h2').count();
      19 |     const linkCount = await page.locator('#sitemap-content a').count();
        at /home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/sitemap-footer.spec.js:16:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-sitemap-69934-k-navigates-to-sitemap-page-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-sitemap-69934-k-navigates-to-sitemap-page-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/infrastructure-e2e-sitemap-69934-k-navigates-to-sitemap-page-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-sitemap-69934-k-navigates-to-sitemap-page-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/infrastructure-e2e-sitemap-69934-k-navigates-to-sitemap-page-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  19) [chromium] › tests_specs/loans/buy-to-let_release/cwv.calc.spec.js:7:3 › loans/buy-to-let cwv guard › calculator route satisfies CLS/LCP thresholds 

    Error: CLS exceeded on /loan-calculators/buy-to-let-mortgage-calculator/

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m0.1[39m
    Received:    [31m0.1483[39m

       at infrastructure/e2e/cwv-scope-helper.js:80

      78 |   }
      79 |
    > 80 |   expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
         |                                                   ^
      81 |   expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
      82 | }
      83 |
        at assertCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:80:51)
        at /home/kartheek/calchowmuch/tests_specs/loans/buy-to-let_release/cwv.calc.spec.js:9:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/loans-buy-to-let_release-c-92710-atisfies-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/loans-buy-to-let_release-c-92710-atisfies-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/loans-buy-to-let_release-c-92710-atisfies-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/loans-buy-to-let_release-c-92710-atisfies-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/loans-buy-to-let_release-c-92710-atisfies-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  20) [chromium] › tests_specs/loans/cluster_release/cwv.cluster.spec.js:7:3 › loans cluster cwv guard › cluster routes satisfy CLS/LCP thresholds 

    Error: CLS exceeded on /car-loan-calculators/hire-purchase-calculator/

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m0.1[39m
    Received:    [31m0.1544[39m

       at infrastructure/e2e/cwv-scope-helper.js:80

      78 |   }
      79 |
    > 80 |   expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
         |                                                   ^
      81 |   expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
      82 | }
      83 |
        at assertCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:80:51)
        at /home/kartheek/calchowmuch/tests_specs/loans/cluster_release/cwv.cluster.spec.js:10:7

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/loans-cluster_release-cwv.-abe45--satisfy-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/loans-cluster_release-cwv.-abe45--satisfy-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/loans-cluster_release-cwv.-abe45--satisfy-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/loans-cluster_release-cwv.-abe45--satisfy-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/loans-cluster_release-cwv.-abe45--satisfy-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  21) [chromium] › tests_specs/loans/remortgage-switching_release/cwv.calc.spec.js:7:3 › loans/remortgage-switching cwv guard › calculator route satisfies CLS/LCP thresholds 

    Error: CLS exceeded on /loan-calculators/remortgage-calculator/

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m0.1[39m
    Received:    [31m0.1003[39m

       at infrastructure/e2e/cwv-scope-helper.js:80

      78 |   }
      79 |
    > 80 |   expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
         |                                                   ^
      81 |   expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
      82 | }
      83 |
        at assertCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:80:51)
        at /home/kartheek/calchowmuch/tests_specs/loans/remortgage-switching_release/cwv.calc.spec.js:9:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/loans-remortgage-switching-808f2-atisfies-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/loans-remortgage-switching-808f2-atisfies-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/loans-remortgage-switching-808f2-atisfies-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/loans-remortgage-switching-808f2-atisfies-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/loans-remortgage-switching-808f2-atisfies-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  22) [chromium] › tests_specs/math/percentage-increase_release/cwv.calc.spec.js:7:3 › math/percentage-increase cwv guard › calculator route satisfies CLS/LCP thresholds 

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeTruthy[2m()[22m

    Received: [31mfalse[39m

       at infrastructure/e2e/cwv-scope-helper.js:50

      48 |   await page.addInitScript(initObserver());
      49 |   const response = await page.goto(route, { waitUntil: 'networkidle', timeout: 120000 });
    > 50 |   expect(response && response.ok()).toBeTruthy();
         |                                     ^
      51 |
      52 |   await page.waitForTimeout(1200);
      53 |
        at measureRouteCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:50:37)
        at /home/kartheek/calchowmuch/tests_specs/math/percentage-increase_release/cwv.calc.spec.js:8:21

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/math-percentage-increase_r-6ffe5-atisfies-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/math-percentage-increase_r-6ffe5-atisfies-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/math-percentage-increase_r-6ffe5-atisfies-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/math-percentage-increase_r-6ffe5-atisfies-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/math-percentage-increase_r-6ffe5-atisfies-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  23) [chromium] › tests_specs/percentage/margin-calculator_release/seo.calc.spec.js:4:3 › Margin Calculator SEO › MARG-TEST-SEO-1: metadata, schema, sitemap 

    Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveTitle[2m([22m[32mexpected[39m[2m)[22m failed

    Expected: [32m"Margin Calculator – Calc[7mHowMuch[27m"[39m
    Received: [31m"Margin Calculator – Calc[7mulate Gross Margin & Profit[27m"[39m
    Timeout:  5000ms

    Call log:
    [2m  - Expect "toHaveTitle" with timeout 5000ms[22m
    [2m    8 × unexpected value "Margin Calculator – Calculate Gross Margin & Profit"[22m


       5 |     await page.goto('/percentage-calculators/margin-calculator/');
       6 |
    >  7 |     await expect(page).toHaveTitle('Margin Calculator – CalcHowMuch');
         |                        ^
       8 |
       9 |     const description = await page.locator('meta[name="description"]').getAttribute('content');
      10 |     expect(description).toBe(
        at /home/kartheek/calchowmuch/tests_specs/percentage/margin-calculator_release/seo.calc.spec.js:7:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/percentage-margin-calculat-716c0-O-1-metadata-schema-sitemap-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/percentage-margin-calculat-716c0-O-1-metadata-schema-sitemap-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/percentage-margin-calculat-716c0-O-1-metadata-schema-sitemap-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/percentage-margin-calculat-716c0-O-1-metadata-schema-sitemap-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/percentage-margin-calculat-716c0-O-1-metadata-schema-sitemap-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  24) [chromium] › tests_specs/percentage/reverse-percentage_release/cwv.calc.spec.js:7:3 › percentage/reverse-percentage cwv guard › calculator route satisfies CLS/LCP thresholds 

    Error: CLS exceeded on /percentage-calculators/reverse-percentage-calculator/

    [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m0.1[39m
    Received:    [31m0.1628[39m

       at infrastructure/e2e/cwv-scope-helper.js:80

      78 |   }
      79 |
    > 80 |   expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
         |                                                   ^
      81 |   expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
      82 | }
      83 |
        at assertCwv (/home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cwv-scope-helper.js:80:51)
        at /home/kartheek/calchowmuch/tests_specs/percentage/reverse-percentage_release/cwv.calc.spec.js:9:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/percentage-reverse-percent-19130-atisfies-CLS-LCP-thresholds-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/percentage-reverse-percent-19130-atisfies-CLS-LCP-thresholds-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/percentage-reverse-percent-19130-atisfies-CLS-LCP-thresholds-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/percentage-reverse-percent-19130-atisfies-CLS-LCP-thresholds-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/percentage-reverse-percent-19130-atisfies-CLS-LCP-thresholds-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  25) [chromium] › tests_specs/sleep-and-nap/energy-based-nap-selector_release/seo.calc.spec.js:4:3 › Energy-Based Nap Selector SEO › ENAP-TEST-SEO-1: metadata, schema, and sitemap coverage 

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoContain[2m([22m[32mexpected[39m[2m) // indexOf[22m

    Expected value: [32m"SoftwareApplication"[39m
    Received array: [31m["WebPage", "FAQPage"][39m

      29 |     const nodeTypes = graph.map((node) => node['@type']);
      30 |     expect(nodeTypes).toContain('WebPage');
    > 31 |     expect(nodeTypes).toContain('SoftwareApplication');
         |                       ^
      32 |     expect(nodeTypes).toContain('BreadcrumbList');
      33 |     expect(nodeTypes).toContain('FAQPage');
      34 |
        at /home/kartheek/calchowmuch/tests_specs/sleep-and-nap/energy-based-nap-selector_release/seo.calc.spec.js:31:23

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/sleep-and-nap-energy-based-f11bf-schema-and-sitemap-coverage-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/sleep-and-nap-energy-based-f11bf-schema-and-sitemap-coverage-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/sleep-and-nap-energy-based-f11bf-schema-and-sitemap-coverage-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/sleep-and-nap-energy-based-f11bf-schema-and-sitemap-coverage-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/sleep-and-nap-energy-based-f11bf-schema-and-sitemap-coverage-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  26) [chromium] › tests_specs/time-and-date/birthday-day-of-week_release/seo.calc.spec.js:4:3 › Birthday Day-of-Week SEO › BIRTHDAY-DOW-TEST-SEO-1: metadata, headings, FAQ schema, sitemap 

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m

    Expected: [32mArrayContaining ["WebPage", "SoftwareApplication", "FAQPage", "BreadcrumbList"][39m
    Received: [31m["WebPage", "FAQPage"][39m

      28 |
      29 |     const types = structuredData['@graph'].map((node) => node['@type']);
    > 30 |     expect(types).toEqual(
         |                   ^
      31 |       expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'])
      32 |     );
      33 |
        at /home/kartheek/calchowmuch/tests_specs/time-and-date/birthday-day-of-week_release/seo.calc.spec.js:30:19

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/time-and-date-birthday-day-4639d-headings-FAQ-schema-sitemap-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/time-and-date-birthday-day-4639d-headings-FAQ-schema-sitemap-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/time-and-date-birthday-day-4639d-headings-FAQ-schema-sitemap-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/time-and-date-birthday-day-4639d-headings-FAQ-schema-sitemap-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/time-and-date-birthday-day-4639d-headings-FAQ-schema-sitemap-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  27) [chromium] › tests_specs/time-and-date/countdown-timer-generator_release/seo.calc.spec.js:4:3 › Countdown Timer Generator SEO › COUNTDOWN-TEST-SEO-1: metadata, headings, FAQ schema, sitemap 

    Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveTitle[2m([22m[32mexpected[39m[2m)[22m failed

    Expected: [32m"Countdown Timer Generator – Count[7md[27mown to Any Date[7m & Time | CalcHowMuch[27m"[39m
    Received: [31m"Countdown Timer Generator – Count[7m D[27mown to Any Date"[39m
    Timeout:  5000ms

    Call log:
    [2m  - Expect "toHaveTitle" with timeout 5000ms[22m
    [2m    9 × unexpected value "Countdown Timer Generator – Count Down to Any Date"[22m


       5 |     await page.goto('/time-and-date/countdown-timer-generator');
       6 |
    >  7 |     await expect(page).toHaveTitle(
         |                        ^
       8 |       'Countdown Timer Generator – Countdown to Any Date & Time | CalcHowMuch'
       9 |     );
      10 |
        at /home/kartheek/calchowmuch/tests_specs/time-and-date/countdown-timer-generator_release/seo.calc.spec.js:7:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/time-and-date-countdown-ti-d0e57-headings-FAQ-schema-sitemap-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/time-and-date-countdown-ti-d0e57-headings-FAQ-schema-sitemap-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/time-and-date-countdown-ti-d0e57-headings-FAQ-schema-sitemap-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/time-and-date-countdown-ti-d0e57-headings-FAQ-schema-sitemap-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/time-and-date-countdown-ti-d0e57-headings-FAQ-schema-sitemap-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  28) [chromium] › tests_specs/time-and-date/days-until-a-date-calculator_release/e2e.calc.spec.js:4:3 › Days Until a Date Calculator › DAYS-UNTIL-TEST-E2E-1: user journey and results 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoContainText[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: locator('#top-nav button.is-active')
    Expected substring: [32m"Time & Date"[39m
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
    [2m  - Expect "toContainText" with timeout 5000ms[22m
    [2m  - waiting for locator('#top-nav button.is-active')[22m


       6 |
       7 |     const topNavActive = page.locator('#top-nav button.is-active');
    >  8 |     await expect(topNavActive).toContainText('Time & Date');
         |                                ^
       9 |
      10 |     const leftActive = page.locator('.fin-nav-item.is-active');
      11 |     await expect(leftActive).toContainText('Days Until a Date Calculator');
        at /home/kartheek/calchowmuch/tests_specs/time-and-date/days-until-a-date-calculator_release/e2e.calc.spec.js:8:32

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/time-and-date-days-until-a-06dd7--1-user-journey-and-results-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/time-and-date-days-until-a-06dd7--1-user-journey-and-results-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/time-and-date-days-until-a-06dd7--1-user-journey-and-results-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/time-and-date-days-until-a-06dd7--1-user-journey-and-results-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/time-and-date-days-until-a-06dd7--1-user-journey-and-results-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  29) [chromium] › tests_specs/time-and-date/days-until-a-date-calculator_release/e2e.calc.spec.js:39:3 › Days Until a Date Calculator › DAYS-UNTIL-TEST-E2E-2: layout stability and content 

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.evaluate: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for locator('.center-column .panel').first()[22m


      41 |
      42 |     const calcPanel = page.locator('.center-column .panel').first();
    > 43 |     const initialHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);
         |                                           ^
      44 |
      45 |     await page.locator('#days-until-calculate').click();
      46 |     const afterHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);
        at /home/kartheek/calchowmuch/tests_specs/time-and-date/days-until-a-date-calculator_release/e2e.calc.spec.js:43:43

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/time-and-date-days-until-a-33838-ayout-stability-and-content-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/time-and-date-days-until-a-33838-ayout-stability-and-content-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/time-and-date-days-until-a-33838-ayout-stability-and-content-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/time-and-date-days-until-a-33838-ayout-stability-and-content-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/time-and-date-days-until-a-33838-ayout-stability-and-content-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  30) [chromium] › tests_specs/time-and-date/days-until-a-date-calculator_release/seo.calc.spec.js:4:3 › Days Until a Date Calculator SEO › DAYS-UNTIL-TEST-SEO-1: metadata, headings, FAQ schema, sitemap 

    Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveTitle[2m([22m[32mexpected[39m[2m)[22m failed

    Expected: [32m"[7mDays Until a Date [27mCalculat[7mor –[27m How M[7many Days Until[27m"[39m
    Received: [31m"Calculat[7me[27m How M[7much | Free Online Calculators & Tools[27m"[39m
    Timeout:  5000ms

    Call log:
    [2m  - Expect "toHaveTitle" with timeout 5000ms[22m
    [2m    9 × unexpected value "Calculate How Much | Free Online Calculators & Tools"[22m


       5 |     await page.goto('/#/time-and-date/days-until-a-date-calculator');
       6 |
    >  7 |     await expect(page).toHaveTitle('Days Until a Date Calculator – How Many Days Until');
         |                        ^
       8 |
       9 |     const description = await page.locator('meta[name="description"]').getAttribute('content');
      10 |     expect(description).toBe(
        at /home/kartheek/calchowmuch/tests_specs/time-and-date/days-until-a-date-calculator_release/seo.calc.spec.js:7:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/time-and-date-days-until-a-c7d66-headings-FAQ-schema-sitemap-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/time-and-date-days-until-a-c7d66-headings-FAQ-schema-sitemap-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/time-and-date-days-until-a-c7d66-headings-FAQ-schema-sitemap-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/time-and-date-days-until-a-c7d66-headings-FAQ-schema-sitemap-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/time-and-date-days-until-a-c7d66-headings-FAQ-schema-sitemap-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  31) [chromium] › tests_specs/time-and-date/overtime-hours-calculator_release/seo.calc.spec.js:4:3 › Overtime Hours Calculator SEO › OVERTIME-TEST-SEO-1: metadata, headings, FAQ schema, sitemap 

    Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveTitle[2m([22m[32mexpected[39m[2m)[22m failed

    Expected: [32m"Overtime Hours Calculator – [7mRegular Hours vs Overtime (Daily & Weekly)[27m"[39m
    Received: [31m"Overtime Hours Calculator – [7mDaily & Weekly | CalcHowMuch[27m"[39m
    Timeout:  5000ms

    Call log:
    [2m  - Expect "toHaveTitle" with timeout 5000ms[22m
    [2m    9 × unexpected value "Overtime Hours Calculator – Daily & Weekly | CalcHowMuch"[22m


       5 |     await page.goto('/time-and-date/overtime-hours-calculator');
       6 |
    >  7 |     await expect(page).toHaveTitle(
         |                        ^
       8 |       'Overtime Hours Calculator – Regular Hours vs Overtime (Daily & Weekly)'
       9 |     );
      10 |
        at /home/kartheek/calchowmuch/tests_specs/time-and-date/overtime-hours-calculator_release/seo.calc.spec.js:7:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/time-and-date-overtime-hou-85337-headings-FAQ-schema-sitemap-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/time-and-date-overtime-hou-85337-headings-FAQ-schema-sitemap-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/time-and-date-overtime-hou-85337-headings-FAQ-schema-sitemap-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/time-and-date-overtime-hou-85337-headings-FAQ-schema-sitemap-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/time-and-date-overtime-hou-85337-headings-FAQ-schema-sitemap-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  32) [chromium] › tests_specs/time-and-date/time-between-two-dates-calculator_release/seo.calc.spec.js:4:3 › Time Between Two Dates Calculator SEO › DATE-DIFF-TEST-SEO-1: metadata, headings, FAQ schema, sitemap 

    Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveTitle[2m([22m[32mexpected[39m[2m)[22m failed

    Expected: [32m"Time Between Two Dates Calculator – Date Difference[7m in Days, Weeks & Months | CalcHowMuch[27m"[39m
    Received: [31m"Time Between Two Dates Calculator – Date Difference"[39m
    Timeout:  5000ms

    Call log:
    [2m  - Expect "toHaveTitle" with timeout 5000ms[22m
    [2m    9 × unexpected value "Time Between Two Dates Calculator – Date Difference"[22m


       5 |     await page.goto('/time-and-date/time-between-two-dates-calculator');
       6 |
    >  7 |     await expect(page).toHaveTitle(
         |                        ^
       8 |       'Time Between Two Dates Calculator – Date Difference in Days, Weeks & Months | CalcHowMuch'
       9 |     );
      10 |
        at /home/kartheek/calchowmuch/tests_specs/time-and-date/time-between-two-dates-calculator_release/seo.calc.spec.js:7:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/time-and-date-time-between-01618-headings-FAQ-schema-sitemap-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/time-and-date-time-between-01618-headings-FAQ-schema-sitemap-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/time-and-date-time-between-01618-headings-FAQ-schema-sitemap-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/time-and-date-time-between-01618-headings-FAQ-schema-sitemap-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/time-and-date-time-between-01618-headings-FAQ-schema-sitemap-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  33) [chromium] › tests_specs/time-and-date/work-hours-calculator_release/e2e.calc.spec.js:29:3 › Work Hours Calculator › WORK-HOURS-TEST-E2E-2: weekly totals with daily lines 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveCount[2m([22m[32mexpected[39m[2m)[22m failed

    Locator:  locator('#work-hours-explanation').locator('h2')
    Expected: [32m1[39m
    Received: [31m7[39m
    Timeout:  5000ms

    Call log:
    [2m  - Expect "toHaveCount" with timeout 5000ms[22m
    [2m  - waiting for locator('#work-hours-explanation').locator('h2')[22m
    [2m    9 × locator resolved to 7 elements[22m
    [2m      - unexpected value "7"[22m


      39 |
      40 |     const explanation = page.locator('#work-hours-explanation');
    > 41 |     await expect(explanation.locator('h2')).toHaveCount(1);
         |                                             ^
      42 |     await expect(explanation.locator('h3')).toHaveCount(4);
      43 |     await expect(explanation.locator('.faq-box')).toHaveCount(10);
      44 |   });
        at /home/kartheek/calchowmuch/tests_specs/time-and-date/work-hours-calculator_release/e2e.calc.spec.js:41:45

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/time-and-date-work-hours-c-70bb1-kly-totals-with-daily-lines-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/time-and-date-work-hours-c-70bb1-kly-totals-with-daily-lines-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/time-and-date-work-hours-c-70bb1-kly-totals-with-daily-lines-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/time-and-date-work-hours-c-70bb1-kly-totals-with-daily-lines-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/time-and-date-work-hours-c-70bb1-kly-totals-with-daily-lines-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  34) [chromium] › tests_specs/time-and-date/work-hours-calculator_release/seo.calc.spec.js:4:3 › Work Hours Calculator SEO › WORK-HOURS-TEST-SEO-1: metadata, headings, FAQ schema, sitemap 

    Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveTitle[2m([22m[32mexpected[39m[2m)[22m failed

    Expected: [32m"Work Hours Calculator – [7mCalculate Shift Hours &[27m Breaks | CalcHowMuch"[39m
    Received: [31m"Work Hours Calculator – [7mWith[27m Breaks | CalcHowMuch"[39m
    Timeout:  5000ms

    Call log:
    [2m  - Expect "toHaveTitle" with timeout 5000ms[22m
    [2m    9 × unexpected value "Work Hours Calculator – With Breaks | CalcHowMuch"[22m


       5 |     await page.goto('/time-and-date/work-hours-calculator');
       6 |
    >  7 |     await expect(page).toHaveTitle(
         |                        ^
       8 |       'Work Hours Calculator – Calculate Shift Hours & Breaks | CalcHowMuch'
       9 |     );
      10 |
        at /home/kartheek/calchowmuch/tests_specs/time-and-date/work-hours-calculator_release/seo.calc.spec.js:7:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/time-and-date-work-hours-c-563e8-headings-FAQ-schema-sitemap-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/time-and-date-work-hours-c-563e8-headings-FAQ-schema-sitemap-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/time-and-date-work-hours-c-563e8-headings-FAQ-schema-sitemap-chromium/error-context.md

    attachment #4: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/time-and-date-work-hours-c-563e8-headings-FAQ-schema-sitemap-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/time-and-date-work-hours-c-563e8-headings-FAQ-schema-sitemap-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  Slow test file: [chromium] › tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js (18.0m)
  Consider running tests from slow files in parallel. See: https://playwright.dev/docs/test-parallel
  34 failed
    [chromium] › tests_specs/credit-cards/credit-card-minimum-payment_release/e2e.calc.spec.js:12:3 › Credit Card Minimum Payment Calculator › MINPAY-TEST-E2E-1: load, nav, calculate, verify results 
    [chromium] › tests_specs/credit-cards/credit-card-repayment-payoff_release/cwv.calc.spec.js:7:3 › credit-cards/credit-card-repayment-payoff cwv guard › calculator route satisfies CLS/LCP thresholds 
    [chromium] › tests_specs/finance/cluster_release/cwv.cluster.spec.js:7:3 › finance cluster cwv guard › cluster routes satisfy CLS/LCP thresholds 
    [chromium] › tests_specs/finance/effective-annual-rate_release/cwv.calc.spec.js:7:3 › finance/effective-annual-rate cwv guard › calculator route satisfies CLS/LCP thresholds 
    [chromium] › tests_specs/finance/future-value_release/cwv.calc.spec.js:7:3 › finance/future-value cwv guard › calculator route satisfies CLS/LCP thresholds 
    [chromium] › tests_specs/finance/future-value-of-annuity_release/cwv.calc.spec.js:7:3 › finance/future-value-of-annuity cwv guard › calculator route satisfies CLS/LCP thresholds 
    [chromium] › tests_specs/finance/investment-growth_release/cwv.calc.spec.js:7:3 › finance/investment-growth cwv guard › calculator route satisfies CLS/LCP thresholds 
    [chromium] › tests_specs/finance/investment-return_release/cwv.calc.spec.js:7:3 › finance/investment-return cwv guard › calculator route satisfies CLS/LCP thresholds 
    [chromium] › tests_specs/finance/monthly-savings-needed_release/cwv.calc.spec.js:7:3 › finance/monthly-savings-needed cwv guard › calculator route satisfies CLS/LCP thresholds 
    [chromium] › tests_specs/finance/present-value_release/cwv.calc.spec.js:7:3 › finance/present-value cwv guard › calculator route satisfies CLS/LCP thresholds 
    [chromium] › tests_specs/finance/present-value-of-annuity_release/cwv.calc.spec.js:7:3 › finance/present-value-of-annuity cwv guard › calculator route satisfies CLS/LCP thresholds 
    [chromium] › tests_specs/finance/time-to-savings-goal_release/cwv.calc.spec.js:7:3 › finance/time-to-savings-goal cwv guard › calculator route satisfies CLS/LCP thresholds 
    [chromium] › tests_specs/infrastructure/e2e/button-only-recalc-finance-percentage.spec.js:152:3 › Button-Only Recalculation (Finance + Percentage) › BTN-ONLY-E2E-1: all target calculators update only after Calculate click 
    [chromium] › tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js:313:3 › Global CWV guard — all calculator routes › UR-TEST-005/006: all calculator routes must satisfy CLS/LCP/INP thresholds in normal and stress modes 
    [chromium] › tests_specs/infrastructure/e2e/gtep-pages-seo.spec.js:59:3 › FAQs page metadata ───
    [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:235:3 › ISS-001: Layout Stability › visual regression - page layout stability 
    [chromium] › tests_specs/infrastructure/e2e/route-archetype-contract.spec.js:40:1 › ROUTE-ARCHETYPE-002: generated body metadata and pane presence match metadata contract 
    [chromium] › tests_specs/infrastructure/e2e/sitemap-footer.spec.js:4:3 › Sitemap footer link › SITEMAP-TEST-E2E-1: footer link navigates to sitemap page 
    [chromium] › tests_specs/loans/buy-to-let_release/cwv.calc.spec.js:7:3 › loans/buy-to-let cwv guard › calculator route satisfies CLS/LCP thresholds 
    [chromium] › tests_specs/loans/cluster_release/cwv.cluster.spec.js:7:3 › loans cluster cwv guard › cluster routes satisfy CLS/LCP thresholds 
    [chromium] › tests_specs/loans/remortgage-switching_release/cwv.calc.spec.js:7:3 › loans/remortgage-switching cwv guard › calculator route satisfies CLS/LCP thresholds 
    [chromium] › tests_specs/math/percentage-increase_release/cwv.calc.spec.js:7:3 › math/percentage-increase cwv guard › calculator route satisfies CLS/LCP thresholds 
    [chromium] › tests_specs/percentage/margin-calculator_release/seo.calc.spec.js:4:3 › Margin Calculator SEO › MARG-TEST-SEO-1: metadata, schema, sitemap 
    [chromium] › tests_specs/percentage/reverse-percentage_release/cwv.calc.spec.js:7:3 › percentage/reverse-percentage cwv guard › calculator route satisfies CLS/LCP thresholds 
    [chromium] › tests_specs/sleep-and-nap/energy-based-nap-selector_release/seo.calc.spec.js:4:3 › Energy-Based Nap Selector SEO › ENAP-TEST-SEO-1: metadata, schema, and sitemap coverage 
    [chromium] › tests_specs/time-and-date/birthday-day-of-week_release/seo.calc.spec.js:4:3 › Birthday Day-of-Week SEO › BIRTHDAY-DOW-TEST-SEO-1: metadata, headings, FAQ schema, sitemap 
    [chromium] › tests_specs/time-and-date/countdown-timer-generator_release/seo.calc.spec.js:4:3 › Countdown Timer Generator SEO › COUNTDOWN-TEST-SEO-1: metadata, headings, FAQ schema, sitemap 
    [chromium] › tests_specs/time-and-date/days-until-a-date-calculator_release/e2e.calc.spec.js:4:3 › Days Until a Date Calculator › DAYS-UNTIL-TEST-E2E-1: user journey and results 
    [chromium] › tests_specs/time-and-date/days-until-a-date-calculator_release/e2e.calc.spec.js:39:3 › Days Until a Date Calculator › DAYS-UNTIL-TEST-E2E-2: layout stability and content 
    [chromium] › tests_specs/time-and-date/days-until-a-date-calculator_release/seo.calc.spec.js:4:3 › Days Until a Date Calculator SEO › DAYS-UNTIL-TEST-SEO-1: metadata, headings, FAQ schema, sitemap 
    [chromium] › tests_specs/time-and-date/overtime-hours-calculator_release/seo.calc.spec.js:4:3 › Overtime Hours Calculator SEO › OVERTIME-TEST-SEO-1: metadata, headings, FAQ schema, sitemap 
    [chromium] › tests_specs/time-and-date/time-between-two-dates-calculator_release/seo.calc.spec.js:4:3 › Time Between Two Dates Calculator SEO › DATE-DIFF-TEST-SEO-1: metadata, headings, FAQ schema, sitemap 
    [chromium] › tests_specs/time-and-date/work-hours-calculator_release/e2e.calc.spec.js:29:3 › Work Hours Calculator › WORK-HOURS-TEST-E2E-2: weekly totals with daily lines 
    [chromium] › tests_specs/time-and-date/work-hours-calculator_release/seo.calc.spec.js:4:3 › Work Hours Calculator SEO › WORK-HOURS-TEST-SEO-1: metadata, headings, FAQ schema, sitemap 
  83 skipped
  296 passed (19.1m)
  - 
> calchowmuch@1.0.0 test:cwv:all
> playwright test tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js --workers=1


Running 1 test using 1 worker

  ✘  1 [chromium] › tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js:313:3 › Global CWV guard — all calculator routes › UR-TEST-005/006: all calculator routes must satisfy CLS/LCP/INP thresholds in normal and stress modes (17.4m)


  1) [chromium] › tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js:313:3 › Global CWV guard — all calculator routes › UR-TEST-005/006: all calculator routes must satisfy CLS/LCP/INP thresholds in normal and stress modes 

    Error: CWV guard failed for 39 route checks. Report: /home/kartheek/calchowmuch/test-results/performance/cls-guard-all-calculators.json
    /car-loan-calculators/auto-loan-calculator/ [normal] cls=0.0586 maxShift=0.058 lcp=1000 inpProxy=80 error=none
    /car-loan-calculators/auto-loan-calculator/ [stress] cls=0.0586 maxShift=0.058 lcp=2020 inpProxy=40 error=none
    /car-loan-calculators/car-lease-calculator/ [normal] cls=0.0599 maxShift=0.0599 lcp=684 inpProxy=56 error=none
    /car-loan-calculators/car-lease-calculator/ [stress] cls=0.0605 maxShift=0.0599 lcp=1712 inpProxy=64 error=none
    /car-loan-calculators/hire-purchase-calculator/ [normal] cls=0.0709 maxShift=0.0581 lcp=680 inpProxy=48 error=none
    /car-loan-calculators/hire-purchase-calculator/ [stress] cls=0.0596 maxShift=0.0583 lcp=1680 inpProxy=56 error=none
    /car-loan-calculators/pcp-calculator/ [normal] cls=0.0673 maxShift=0.0673 lcp=692 inpProxy=64 error=none
    /car-loan-calculators/pcp-calculator/ [stress] cls=0.068 maxShift=0.0673 lcp=1756 inpProxy=40 error=none
    /credit-card-calculators/balance-transfer-credit-card-calculator/ [normal] cls=0.0698 maxShift=0.0698 lcp=696 inpProxy=64 error=none
    /credit-card-calculators/balance-transfer-credit-card-calculator/ [stress] cls=0.0761 maxShift=0.0698 lcp=2784 inpProxy=64 error=none

    [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m

    [32m- Expected  -    1[39m
    [31m+ Received  + 4923[39m

    [32m- Array [][39m
    [31m+ Array [[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0586,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 630.3000000119209,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 492.578125,[39m
    [31m+               "height": 310.1875,[39m
    [31m+               "left": 731.515625,[39m
    [31m+               "right": 1114.609375,[39m
    [31m+               "top": 182.390625,[39m
    [31m+               "width": 383.09375,[39m
    [31m+               "x": 731.515625,[39m
    [31m+               "y": 182.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 766.796875,[39m
    [31m+               "height": 314.21875,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.546875,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.03125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 549,[39m
    [31m+               "height": 144,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 33.140625,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 838.859375,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 838.859375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 91.09375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 780.90625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 780.90625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-mtg-explanation",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 966.1000000238419,[39m
    [31m+         "value": 0.057995427508155464,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 80,[39m
    [31m+     "lcp": 1000,[39m
    [31m+     "maxShift": 0.058,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/car-loan-calculators/auto-loan-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0586,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1434.699999988079,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 492.578125,[39m
    [31m+               "height": 310.1875,[39m
    [31m+               "left": 731.515625,[39m
    [31m+               "right": 1114.609375,[39m
    [31m+               "top": 182.390625,[39m
    [31m+               "width": 383.09375,[39m
    [31m+               "x": 731.515625,[39m
    [31m+               "y": 182.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 766.796875,[39m
    [31m+               "height": 314.21875,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.546875,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.03125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 549,[39m
    [31m+               "height": 144,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 33.140625,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 838.859375,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 838.859375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 91.09375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 780.90625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 780.90625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-mtg-explanation",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1971.800000011921,[39m
    [31m+         "value": 0.057995427508155464,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 40,[39m
    [31m+     "lcp": 2020,[39m
    [31m+     "maxShift": 0.058,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/car-loan-calculators/auto-loan-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0599,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 510.578125,[39m
    [31m+               "height": 334.1875,[39m
    [31m+               "left": 719.515625,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 176.390625,[39m
    [31m+               "width": 406.484375,[39m
    [31m+               "x": 719.515625,[39m
    [31m+               "y": 176.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 767.140625,[39m
    [31m+               "height": 314.5625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.546875,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.03125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 549,[39m
    [31m+               "height": 144,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 835.125,[39m
    [31m+               "height": 111.625,[39m
    [31m+               "left": 249,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 723.5,[39m
    [31m+               "width": 481.125,[39m
    [31m+               "x": 249,[39m
    [31m+               "y": 723.5,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 775,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 683,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 683,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.slider-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 645.5,[39m
    [31m+         "value": 0.05990296926399919,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 56,[39m
    [31m+     "lcp": 684,[39m
    [31m+     "maxShift": 0.0599,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/car-loan-calculators/car-lease-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0605,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1149.2999999821186,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 510.578125,[39m
    [31m+               "height": 334.1875,[39m
    [31m+               "left": 719.515625,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 176.390625,[39m
    [31m+               "width": 406.484375,[39m
    [31m+               "x": 719.515625,[39m
    [31m+               "y": 176.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 767.140625,[39m
    [31m+               "height": 314.5625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.546875,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.03125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 549,[39m
    [31m+               "height": 144,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 835.125,[39m
    [31m+               "height": 111.625,[39m
    [31m+               "left": 249,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 723.5,[39m
    [31m+               "width": 481.125,[39m
    [31m+               "x": 249,[39m
    [31m+               "y": 723.5,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 775,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 259.515625,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 683,[39m
    [31m+               "width": 470.609375,[39m
    [31m+               "x": 259.515625,[39m
    [31m+               "y": 683,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.slider-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1663.5,[39m
    [31m+         "value": 0.05990296926399919,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 1712,[39m
    [31m+     "maxShift": 0.0599,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/car-loan-calculators/car-lease-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0709,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 13.1875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 858.8125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 858.8125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 857.8125,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 840.8125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 840.8125,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 823.8125,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 806.8125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 806.8125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 823.8125,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 806.8125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 806.8125,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 857.8125,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 840.8125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 840.8125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 857.8125,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 840.8125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 840.8125,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 577.7000000178814,[39m
    [31m+         "value": 0.012802541208791207,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 492.578125,[39m
    [31m+               "height": 310.1875,[39m
    [31m+               "left": 731.515625,[39m
    [31m+               "right": 1114.609375,[39m
    [31m+               "top": 182.390625,[39m
    [31m+               "width": 383.09375,[39m
    [31m+               "x": 731.515625,[39m
    [31m+               "y": 182.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 760.34375,[39m
    [31m+               "height": 307.765625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.828125,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.3125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 549,[39m
    [31m+               "height": 144,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 52.1875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 819.8125,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 819.8125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 113.09375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 758.90625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 758.90625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-mtg-explanation",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 645.2000000178814,[39m
    [31m+         "value": 0.058108949468620386,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 48,[39m
    [31m+     "lcp": 680,[39m
    [31m+     "maxShift": 0.0581,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/car-loan-calculators/hire-purchase-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0596,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1141.7000000178814,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 492.578125,[39m
    [31m+               "height": 310.1875,[39m
    [31m+               "left": 731.515625,[39m
    [31m+               "right": 1114.609375,[39m
    [31m+               "top": 182.390625,[39m
    [31m+               "width": 383.09375,[39m
    [31m+               "x": 731.515625,[39m
    [31m+               "y": 182.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 760.34375,[39m
    [31m+               "height": 307.765625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.828125,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.3125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 549,[39m
    [31m+               "height": 144,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 52.1875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 819.8125,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 819.8125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 113.09375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 758.90625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 758.90625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-mtg-explanation",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1638.7000000178814,[39m
    [31m+         "value": 0.05825568515311618,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 14,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 858,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 858,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 14,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 858,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 858,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2485.4000000059605,[39m
    [31m+         "value": 0.000670417348608838,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 56,[39m
    [31m+     "lcp": 1680,[39m
    [31m+     "maxShift": 0.0583,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/car-loan-calculators/hire-purchase-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0673,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 833.40625,[39m
    [31m+               "height": 380.828125,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.96875,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.453125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 585,[39m
    [31m+               "height": 180,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 492.578125,[39m
    [31m+               "height": 310.1875,[39m
    [31m+               "left": 731.515625,[39m
    [31m+               "right": 1114.609375,[39m
    [31m+               "top": 182.390625,[39m
    [31m+               "width": 383.09375,[39m
    [31m+               "x": 731.515625,[39m
    [31m+               "y": 182.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 835.125,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 744.65625,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 744.65625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 775,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 683,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 683,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.slider-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 650.0999999940395,[39m
    [31m+         "value": 0.06728007461325207,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 692,[39m
    [31m+     "maxShift": 0.0673,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/car-loan-calculators/pcp-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.068,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1142.5,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 833.40625,[39m
    [31m+               "height": 380.828125,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.96875,[39m
    [31m+               "top": 452.578125,[39m
    [31m+               "width": 300.453125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 452.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 585,[39m
    [31m+               "height": 180,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 405,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 405,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 492.578125,[39m
    [31m+               "height": 310.1875,[39m
    [31m+               "left": 731.515625,[39m
    [31m+               "right": 1114.609375,[39m
    [31m+               "top": 182.390625,[39m
    [31m+               "width": 383.09375,[39m
    [31m+               "x": 731.515625,[39m
    [31m+               "y": 182.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 835.125,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 744.65625,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 744.65625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 775,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 683,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 683,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.slider-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1711.4000000059605,[39m
    [31m+         "value": 0.06731146102845015,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 40,[39m
    [31m+     "lcp": 1756,[39m
    [31m+     "maxShift": 0.0673,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/car-loan-calculators/pcp-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0698,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 163.703125,[39m
    [31m+               "left": 771.71875,[39m
    [31m+               "right": 1074.859375,[39m
    [31m+               "top": 708.296875,[39m
    [31m+               "width": 303.140625,[39m
    [31m+               "x": 771.71875,[39m
    [31m+               "y": 708.296875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 723.125,[39m
    [31m+               "height": 244.59375,[39m
    [31m+               "left": 771.71875,[39m
    [31m+               "right": 1074.78125,[39m
    [31m+               "top": 478.53125,[39m
    [31m+               "width": 303.0625,[39m
    [31m+               "x": 771.71875,[39m
    [31m+               "y": 478.53125,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-cc-bt>div.calculator-ui.cc-bt-ui>section.cc-bt-hero>aside.cc-bt-preview-panel>div.cc-bt-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 111.734375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 760.265625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 760.265625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-bt-explanation.cc-bt-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 679.3125,[39m
    [31m+               "height": 70.5,[39m
    [31m+               "left": 786.3125,[39m
    [31m+               "right": 1059.453125,[39m
    [31m+               "top": 608.8125,[39m
    [31m+               "width": 273.140625,[39m
    [31m+               "x": 786.3125,[39m
    [31m+               "y": 608.8125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 449.546875,[39m
    [31m+               "height": 38.90625,[39m
    [31m+               "left": 786.3125,[39m
    [31m+               "right": 1059.453125,[39m
    [31m+               "top": 410.640625,[39m
    [31m+               "width": 273.140625,[39m
    [31m+               "x": 786.3125,[39m
    [31m+               "y": 410.640625,[39m
    [31m+             },[39m
    [31m+             "selector": "div.calculator-ui.cc-bt-ui>section.cc-bt-hero>aside.cc-bt-preview-panel>div.cc-bt-preview-main>p#cc-bt-summary.cc-bt-preview-note",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 646.7999999821186,[39m
    [31m+         "value": 0.06984020521213648,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 696,[39m
    [31m+     "maxShift": 0.0698,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/credit-card-calculators/balance-transfer-credit-card-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0761,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 737.875,[39m
    [31m+               "height": 90,[39m
    [31m+               "left": 274,[39m
    [31m+               "right": 396,[39m
    [31m+               "top": 647.875,[39m
    [31m+               "width": 122,[39m
    [31m+               "x": 274,[39m
    [31m+               "y": 647.875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 639.96875,[39m
    [31m+               "height": 210,[39m
    [31m+               "left": 274,[39m
    [31m+               "right": 396,[39m
    [31m+               "top": 429.96875,[39m
    [31m+               "width": 122,[39m
    [31m+               "x": 274,[39m
    [31m+               "y": 429.96875,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-cc-bt>div.calculator-ui.cc-bt-ui>section.cc-bt-hero>div.cc-bt-form-panel>::after",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 527.78125,[39m
    [31m+               "height": 78.65625,[39m
    [31m+               "left": 617.984375,[39m
    [31m+               "right": 729.578125,[39m
    [31m+               "top": 449.125,[39m
    [31m+               "width": 111.59375,[39m
    [31m+               "x": 617.984375,[39m
    [31m+               "y": 449.125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 527.78125,[39m
    [31m+               "height": 78.65625,[39m
    [31m+               "left": 650.078125,[39m
    [31m+               "right": 729.578125,[39m
    [31m+               "top": 449.125,[39m
    [31m+               "width": 79.5,[39m
    [31m+               "x": 650.078125,[39m
    [31m+               "y": 449.125,[39m
    [31m+             },[39m
    [31m+             "selector": "div.cc-bt-form-panel>div.cc-bt-input-grid>div.input-row.slider-row>div.slider-header>span#cc-bt-promo-months-display.slider-value",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 705.9000000059605,[39m
    [31m+         "value": 0.0056544622213315215,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1210,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 163.703125,[39m
    [31m+               "left": 771.71875,[39m
    [31m+               "right": 1074.859375,[39m
    [31m+               "top": 708.296875,[39m
    [31m+               "width": 303.140625,[39m
    [31m+               "x": 771.71875,[39m
    [31m+               "y": 708.296875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 723.125,[39m
    [31m+               "height": 244.59375,[39m
    [31m+               "left": 771.71875,[39m
    [31m+               "right": 1074.78125,[39m
    [31m+               "top": 478.53125,[39m
    [31m+               "width": 303.0625,[39m
    [31m+               "x": 771.71875,[39m
    [31m+               "y": 478.53125,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-cc-bt>div.calculator-ui.cc-bt-ui>section.cc-bt-hero>aside.cc-bt-preview-panel>div.cc-bt-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 111.734375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 760.265625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 760.265625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-bt-explanation.cc-bt-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 679.3125,[39m
    [31m+               "height": 70.5,[39m
    [31m+               "left": 786.3125,[39m
    [31m+               "right": 1059.453125,[39m
    [31m+               "top": 608.8125,[39m
    [31m+               "width": 273.140625,[39m
    [31m+               "x": 786.3125,[39m
    [31m+               "y": 608.8125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 449.546875,[39m
    [31m+               "height": 38.90625,[39m
    [31m+               "left": 786.3125,[39m
    [31m+               "right": 1059.453125,[39m
    [31m+               "top": 410.640625,[39m
    [31m+               "width": 273.140625,[39m
    [31m+               "x": 786.3125,[39m
    [31m+               "y": 410.640625,[39m
    [31m+             },[39m
    [31m+             "selector": "div.calculator-ui.cc-bt-ui>section.cc-bt-hero>aside.cc-bt-preview-panel>div.cc-bt-preview-main>p#cc-bt-summary.cc-bt-preview-note",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2727.5,[39m
    [31m+         "value": 0.06984020521213648,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 2784,[39m
    [31m+     "maxShift": 0.0698,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/credit-card-calculators/balance-transfer-credit-card-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1018,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 154.234375,[39m
    [31m+               "left": 272,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 717.765625,[39m
    [31m+               "width": 820.125,[39m
    [31m+               "x": 272,[39m
    [31m+               "y": 717.765625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 167.171875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 704.828125,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 704.828125,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-con-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 698.375,[39m
    [31m+               "height": 276.015625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.578125,[39m
    [31m+               "top": 422.359375,[39m
    [31m+               "width": 300.0625,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 422.359375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 606.796875,[39m
    [31m+               "height": 276.015625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.53125,[39m
    [31m+               "top": 330.78125,[39m
    [31m+               "width": 300.015625,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 330.78125,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-cc-con>div.calculator-ui.cc-con-ui>section.cc-con-hero>aside.cc-con-preview-panel>div.cc-con-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 22.9375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 849.0625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 849.0625,[39m
    [31m+             },[39m
    [31m+             "selector": "section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-con-explanation.explanation-pane>section.cc-con-exp-section.cc-con-exp-section--lifetime",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 587.5,[39m
    [31m+         "value": 0.09985838212913266,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 134.234375,[39m
    [31m+               "left": 272,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 737.765625,[39m
    [31m+               "width": 820.125,[39m
    [31m+               "x": 272,[39m
    [31m+               "y": 737.765625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 154.234375,[39m
    [31m+               "left": 272,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 717.765625,[39m
    [31m+               "width": 820.125,[39m
    [31m+               "x": 272,[39m
    [31m+               "y": 717.765625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-con-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 4.359375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 867.640625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 867.640625,[39m
    [31m+             },[39m
    [31m+             "selector": "section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-con-explanation.explanation-pane>p",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 621.3000000119209,[39m
    [31m+         "value": 0.0019467275768421432,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 80,[39m
    [31m+     "lcp": 680,[39m
    [31m+     "maxShift": 0.0999,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/credit-card-calculators/credit-card-consolidation-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.096,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56.5,[39m
    [31m+               "height": 39,[39m
    [31m+               "left": 77,[39m
    [31m+               "right": 233.234375,[39m
    [31m+               "top": 17.5,[39m
    [31m+               "width": 156.234375,[39m
    [31m+               "x": 77,[39m
    [31m+               "y": 17.5,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 48.5,[39m
    [31m+               "height": 23,[39m
    [31m+               "left": 77,[39m
    [31m+               "right": 213.6875,[39m
    [31m+               "top": 25.5,[39m
    [31m+               "width": 136.6875,[39m
    [31m+               "x": 77,[39m
    [31m+               "y": 25.5,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-left>div.brand-block",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 596.8999999761581,[39m
    [31m+         "value": 0.000027789839339991313,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1272,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 147.171875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 724.828125,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 724.828125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 167.171875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 704.828125,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 704.828125,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-con-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 22.9375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 849.0625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 849.0625,[39m
    [31m+             },[39m
    [31m+             "selector": "section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-con-explanation.explanation-pane>section.cc-con-exp-section.cc-con-exp-section--lifetime",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1870.3999999761581,[39m
    [31m+         "value": 0.0021084872574234277,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 134.234375,[39m
    [31m+               "left": 272,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 737.765625,[39m
    [31m+               "width": 820.125,[39m
    [31m+               "x": 272,[39m
    [31m+               "y": 737.765625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 147.171875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092.125,[39m
    [31m+               "top": 724.828125,[39m
    [31m+               "width": 819.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 724.828125,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-con-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 698.375,[39m
    [31m+               "height": 276.015625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.578125,[39m
    [31m+               "top": 422.359375,[39m
    [31m+               "width": 300.0625,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 422.359375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 606.796875,[39m
    [31m+               "height": 276.015625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.53125,[39m
    [31m+               "top": 330.78125,[39m
    [31m+               "width": 300.015625,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 330.78125,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-cc-con>div.calculator-ui.cc-con-ui>section.cc-con-hero>aside.cc-con-preview-panel>div.cc-con-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 29.953125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 842.046875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 842.046875,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2800,[39m
    [31m+         "value": 0.09322883367119983,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 40,[39m
    [31m+     "lcp": 2836,[39m
    [31m+     "maxShift": 0.0932,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/credit-card-calculators/credit-card-consolidation-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1364,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 46,[39m
    [31m+               "left": 272,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 826,[39m
    [31m+               "width": 820,[39m
    [31m+               "x": 272,[39m
    [31m+               "y": 826,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 167,[39m
    [31m+               "left": 272,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 705,[39m
    [31m+               "width": 820,[39m
    [31m+               "x": 272,[39m
    [31m+               "y": 705,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 115,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 757,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 757,[39m
    [31m+             },[39m
    [31m+             "selector": "section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation>section.cc-payoff-exp-section",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 822,[39m
    [31m+               "height": 16,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 806,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 806,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 701,[39m
    [31m+               "height": 16,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 685,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 685,[39m
    [31m+             },[39m
    [31m+             "selector": "div.calculator-ui.cc-payoff-ui>section.cc-payoff-hero>aside.cc-payoff-preview-panel>div.cc-payoff-preview-main>div#cc-payoff-summary.result-detail",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 571.4000000059605,[39m
    [31m+         "value": 0.017904894367835683,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 679.03125,[39m
    [31m+               "height": 552.03125,[39m
    [31m+               "left": 664.875,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 127,[39m
    [31m+               "width": 461.125,[39m
    [31m+               "x": 664.875,[39m
    [31m+               "y": 127,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 822,[39m
    [31m+               "height": 239,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 583,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 583,[39m
    [31m+             },[39m
    [31m+             "selector": "div.calculator-page-single>div#calc-cc-payoff>div.calculator-ui.cc-payoff-ui>section.cc-payoff-hero>aside.cc-payoff-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 241.171875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 630.828125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 630.828125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 46,[39m
    [31m+               "left": 272,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 826,[39m
    [31m+               "width": 820,[39m
    [31m+               "x": 272,[39m
    [31m+               "y": 826,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 9.578125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 862.421875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 862.421875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "selector": "section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation>section.cc-payoff-exp-section",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 640.1999999880791,[39m
    [31m+         "value": 0.11847095354571391,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 388,[39m
    [31m+     "maxShift": 0.1185,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/credit-card-calculators/credit-card-payment-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1551,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1137.0999999940395,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 331.703125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 540.296875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 540.296875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 167,[39m
    [31m+               "left": 272,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 705,[39m
    [31m+               "width": 820,[39m
    [31m+               "x": 272,[39m
    [31m+               "y": 705,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 482.09375,[39m
    [31m+               "height": 355.09375,[39m
    [31m+               "left": 664.875,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 127,[39m
    [31m+               "width": 461.125,[39m
    [31m+               "x": 664.875,[39m
    [31m+               "y": 127,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 701,[39m
    [31m+               "height": 118,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 583,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 583,[39m
    [31m+             },[39m
    [31m+             "selector": "div.calculator-page-single>div#calc-cc-payoff>div.calculator-ui.cc-payoff-ui>section.cc-payoff-hero>aside.cc-payoff-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 33.875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 838.125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 838.125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "selector": "section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation>div.cc-payoff-faq-grid",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1761.699999988079,[39m
    [31m+         "value": 0.11465881694488196,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 241.171875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 630.828125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 630.828125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 331.703125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 540.296875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 540.296875,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 609.03125,[39m
    [31m+               "height": 125,[39m
    [31m+               "left": 951,[39m
    [31m+               "right": 1091,[39m
    [31m+               "top": 484.03125,[39m
    [31m+               "width": 140,[39m
    [31m+               "x": 951,[39m
    [31m+               "y": 484.03125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 497.09375,[39m
    [31m+               "height": 210,[39m
    [31m+               "left": 951,[39m
    [31m+               "right": 1091,[39m
    [31m+               "top": 287.09375,[39m
    [31m+               "width": 140,[39m
    [31m+               "x": 951,[39m
    [31m+               "y": 287.09375,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-cc-payoff>div.calculator-ui.cc-payoff-ui>section.cc-payoff-hero>aside.cc-payoff-preview-panel>::after",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 33.875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 838.125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 838.125,[39m
    [31m+             },[39m
    [31m+             "selector": "section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#cc-payoff-explanation.cc-payoff-explanation>div.cc-payoff-faq-grid",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2549.5999999940395,[39m
    [31m+         "value": 0.03983259452696266,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 576,[39m
    [31m+     "maxShift": 0.1147,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/credit-card-calculators/credit-card-payment-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1133,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 245.671875,[39m
    [31m+               "height": 19,[39m
    [31m+               "left": 26,[39m
    [31m+               "right": 47,[39m
    [31m+               "top": 226.671875,[39m
    [31m+               "width": 21,[39m
    [31m+               "x": 26,[39m
    [31m+               "y": 226.671875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 237.21875,[39m
    [31m+               "height": 19,[39m
    [31m+               "left": 26,[39m
    [31m+               "right": 47,[39m
    [31m+               "top": 218.21875,[39m
    [31m+               "width": 21,[39m
    [31m+               "x": 26,[39m
    [31m+               "y": 218.21875,[39m
    [31m+             },[39m
    [31m+             "selector": "div#left-nav-content>div.fin-nav-container>div.fin-nav-group.is-expanded>button.fin-nav-toggle>span.fin-nav-toggle-icon",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 560.3000000119209,[39m
    [31m+         "value": 0.0000028379285744261195,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 622.09375,[39m
    [31m+               "height": 491.09375,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 589,[39m
    [31m+               "height": 192,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 397,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 397,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-effective-annual-rate>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 521.09375,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 751.125,[39m
    [31m+               "top": 429.09375,[39m
    [31m+               "width": 499.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 429.09375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 412,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 320,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 320,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 435.109375,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 349.71875,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 349.71875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 362,[39m
    [31m+               "height": 79,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 283,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 283,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2038,[39m
    [31m+         "value": 0.11325451716210426,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 40,[39m
    [31m+     "lcp": 2196,[39m
    [31m+     "maxShift": 0.1133,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/effective-annual-rate-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1806,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 808.984375,[39m
    [31m+               "height": 677.984375,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 247,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 625,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-future-value>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 483.671875,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 393.203125,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 393.203125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 435,[39m
    [31m+               "height": 152,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 283,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 283,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-grid-2-col",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 665.3125,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 579.921875,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 579.921875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 590,[39m
    [31m+               "height": 127,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 463,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 463,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2153.4000000059605,[39m
    [31m+         "value": 0.18056963745620366,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 677,[39m
    [31m+               "height": 18.015625,[39m
    [31m+               "left": 1045.203125,[39m
    [31m+               "right": 1073.203125,[39m
    [31m+               "top": 658.984375,[39m
    [31m+               "width": 28,[39m
    [31m+               "x": 1045.203125,[39m
    [31m+               "y": 658.984375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 677,[39m
    [31m+               "height": 18.015625,[39m
    [31m+               "left": 1064.765625,[39m
    [31m+               "right": 1072.765625,[39m
    [31m+               "top": 658.984375,[39m
    [31m+               "width": 8,[39m
    [31m+               "x": 1064.765625,[39m
    [31m+               "y": 658.984375,[39m
    [31m+             },[39m
    [31m+             "selector": "section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list>div.mtg-snapshot-row>strong",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2278,[39m
    [31m+         "value": 0.0000056293951547634035,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 48,[39m
    [31m+     "lcp": 2200,[39m
    [31m+     "maxShift": 0.1806,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/future-value-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.181,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 808.984375,[39m
    [31m+               "height": 677.984375,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 259,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 613,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 613,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-future-value-of-annuity>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 634.859375,[39m
    [31m+               "height": 167.78125,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 467.078125,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 467.078125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 578,[39m
    [31m+               "height": 175,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 403,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 403,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 464.1875,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 373.71875,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 373.71875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 435,[39m
    [31m+               "height": 152,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 283,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 283,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-grid-2-col",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2148.0999999940395,[39m
    [31m+         "value": 0.18065532709422263,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 462.546875,[39m
    [31m+               "height": 133,[39m
    [31m+               "left": 607.984375,[39m
    [31m+               "right": 769.984375,[39m
    [31m+               "top": 329.546875,[39m
    [31m+               "width": 162,[39m
    [31m+               "x": 607.984375,[39m
    [31m+               "y": 329.546875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 459.546875,[39m
    [31m+               "height": 130,[39m
    [31m+               "left": 633.59375,[39m
    [31m+               "right": 770.59375,[39m
    [31m+               "top": 329.546875,[39m
    [31m+               "width": 137,[39m
    [31m+               "x": 633.59375,[39m
    [31m+               "y": 329.546875,[39m
    [31m+             },[39m
    [31m+             "selector": "div.mtg-form-panel>div.input-grid-2-col>div.input-row.slider-row>div.slider-header>span#fva-periods-display.slider-value",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2328.4000000059605,[39m
    [31m+         "value": 0.0003169457740710956,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 40,[39m
    [31m+     "lcp": 2196,[39m
    [31m+     "maxShift": 0.1807,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/future-value-of-annuity-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1931,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 49,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 823,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 823,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 89,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 783,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 783,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 854,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 837,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 837,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 855,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 855,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 575.2999999821186,[39m
    [31m+         "value": 0.006107435118073416,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 863.96875,[39m
    [31m+               "height": 732.96875,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 191,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 681,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 681,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-investment-growth>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 546.046875,[39m
    [31m+               "height": 289.6875,[39m
    [31m+               "left": 265.484375,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 256.359375,[39m
    [31m+               "width": 464.640625,[39m
    [31m+               "x": 265.484375,[39m
    [31m+               "y": 256.359375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 599,[39m
    [31m+               "height": 392,[39m
    [31m+               "left": 253,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 207,[39m
    [31m+               "width": 839,[39m
    [31m+               "x": 253,[39m
    [31m+               "y": 207,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.ig-slider-grid",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 769.3125,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 751.125,[39m
    [31m+               "top": 677.3125,[39m
    [31m+               "width": 499.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 677.3125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 696,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 604,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 604,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 661.2999999821186,[39m
    [31m+         "value": 0.1870386709386008,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 696,[39m
    [31m+     "maxShift": 0.187,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/finance-calculators/investment-growth-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1931,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 49,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 823,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 823,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 89,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 783,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 783,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 854,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 837,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 837,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 855,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 855,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2067.9000000059605,[39m
    [31m+         "value": 0.006107435118073416,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 863.96875,[39m
    [31m+               "height": 732.96875,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 191,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 681,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 681,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-investment-growth>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 546.046875,[39m
    [31m+               "height": 289.6875,[39m
    [31m+               "left": 265.484375,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 256.359375,[39m
    [31m+               "width": 464.640625,[39m
    [31m+               "x": 265.484375,[39m
    [31m+               "y": 256.359375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 599,[39m
    [31m+               "height": 392,[39m
    [31m+               "left": 253,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 207,[39m
    [31m+               "width": 839,[39m
    [31m+               "x": 253,[39m
    [31m+               "y": 207,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.ig-slider-grid",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 769.3125,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 751.125,[39m
    [31m+               "top": 677.3125,[39m
    [31m+               "width": 499.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 677.3125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 696,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 604,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 604,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2247.5,[39m
    [31m+         "value": 0.1870386709386008,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 48,[39m
    [31m+     "lcp": 2284,[39m
    [31m+     "maxShift": 0.187,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/investment-growth-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.328,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 456.65625,[39m
    [31m+               "height": 200.296875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 256.359375,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 256.359375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 573,[39m
    [31m+               "height": 366,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 207,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 207,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.ir-grid",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 679.375,[39m
    [31m+               "height": 548.375,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-investment-return>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 713.65625,[39m
    [31m+               "height": 225.015625,[39m
    [31m+               "left": 266.109375,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 488.640625,[39m
    [31m+               "width": 464.015625,[39m
    [31m+               "x": 266.109375,[39m
    [31m+               "y": 488.640625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 778,[39m
    [31m+               "height": 199,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 579,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 579,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2156.2999999821186,[39m
    [31m+         "value": 0.3280307524605587,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 56,[39m
    [31m+     "lcp": 2196,[39m
    [31m+     "maxShift": 0.328,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/investment-return-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1864,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 25,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 847,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 847,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 85,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 787,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 787,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 840,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 823,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 823,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 858,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 841,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 841,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 574.7999999821186,[39m
    [31m+         "value": 0.004559781973345804,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 741,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 187,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 685,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 685,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-monthly-savings-needed>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 828.03125,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 742.640625,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 742.640625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 650,[39m
    [31m+               "height": 127,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 523,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 523,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 646.390625,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 261,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 555.921875,[39m
    [31m+               "width": 469.125,[39m
    [31m+               "x": 261,[39m
    [31m+               "y": 555.921875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 495,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 253,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 403,[39m
    [31m+               "width": 839,[39m
    [31m+               "x": 253,[39m
    [31m+               "y": 403,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.slider-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 659.1999999880791,[39m
    [31m+         "value": 0.181800908910083,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 700,[39m
    [31m+     "maxShift": 0.1818,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/finance-calculators/monthly-savings-needed-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1941,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 793.03125,[39m
    [31m+               "height": 662.03125,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 187,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 685,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 685,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-monthly-savings-needed>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 828.03125,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 742.640625,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 742.640625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 650,[39m
    [31m+               "height": 127,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 523,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 523,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 646.390625,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 261,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 555.921875,[39m
    [31m+               "width": 469.125,[39m
    [31m+               "x": 261,[39m
    [31m+               "y": 555.921875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 495,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 253,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 403,[39m
    [31m+               "width": 839,[39m
    [31m+               "x": 253,[39m
    [31m+               "y": 403,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.slider-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2176.800000011921,[39m
    [31m+         "value": 0.1810072455731212,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 866.609375,[39m
    [31m+               "height": 390.625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.640625,[39m
    [31m+               "top": 475.984375,[39m
    [31m+               "width": 300.125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 475.984375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 713.640625,[39m
    [31m+               "height": 350.46875,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1072.609375,[39m
    [31m+               "top": 363.171875,[39m
    [31m+               "width": 299.09375,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 363.171875,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2273.300000011921,[39m
    [31m+         "value": 0.013108215649241776,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 40,[39m
    [31m+     "lcp": 2312,[39m
    [31m+     "maxShift": 0.181,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/monthly-savings-needed-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1797,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 770.78125,[39m
    [31m+               "height": 639.78125,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 815,[39m
    [31m+               "height": 250,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 565,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 565,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-present-value>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 483.671875,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 393.203125,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 393.203125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 435,[39m
    [31m+               "height": 152,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 283,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 283,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-grid-2-col",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 571.953125,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 486.5625,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 486.5625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 530,[39m
    [31m+               "height": 127,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 403,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 403,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 662.2000000178814,[39m
    [31m+         "value": 0.1796509854403384,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 704,[39m
    [31m+     "maxShift": 0.1797,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/finance-calculators/present-value-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1797,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 770.78125,[39m
    [31m+               "height": 639.78125,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 815,[39m
    [31m+               "height": 250,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 565,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 565,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-present-value>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 483.671875,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 393.203125,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 393.203125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 435,[39m
    [31m+               "height": 152,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 283,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 283,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-grid-2-col",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 571.953125,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 486.5625,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 486.5625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 530,[39m
    [31m+               "height": 127,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 403,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 403,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2154.9000000059605,[39m
    [31m+         "value": 0.1796509854403384,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 40,[39m
    [31m+     "lcp": 2196,[39m
    [31m+     "maxShift": 0.1797,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/present-value-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1808,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 808.984375,[39m
    [31m+               "height": 677.984375,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 259,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 613,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 613,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-present-value-of-annuity>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 654.34375,[39m
    [31m+               "height": 167.78125,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 486.5625,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 486.5625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 578,[39m
    [31m+               "height": 175,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 403,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 403,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 483.671875,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 393.203125,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 393.203125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 435,[39m
    [31m+               "height": 152,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 283,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 283,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-grid-2-col",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 667.5,[39m
    [31m+         "value": 0.1807956808116675,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 40,[39m
    [31m+     "lcp": 712,[39m
    [31m+     "maxShift": 0.1808,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/finance-calculators/present-value-of-annuity-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1811,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 808.984375,[39m
    [31m+               "height": 677.984375,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 259,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 613,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 613,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-present-value-of-annuity>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 654.34375,[39m
    [31m+               "height": 167.78125,[39m
    [31m+               "left": 256,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 486.5625,[39m
    [31m+               "width": 474.125,[39m
    [31m+               "x": 256,[39m
    [31m+               "y": 486.5625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 578,[39m
    [31m+               "height": 175,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 403,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 403,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 483.671875,[39m
    [31m+               "height": 90.46875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 393.203125,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 393.203125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 435,[39m
    [31m+               "height": 152,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 283,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 283,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-grid-2-col",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2179.600000023842,[39m
    [31m+         "value": 0.1807956808116675,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 482.03125,[39m
    [31m+               "height": 133,[39m
    [31m+               "left": 607.984375,[39m
    [31m+               "right": 769.984375,[39m
    [31m+               "top": 349.03125,[39m
    [31m+               "width": 162,[39m
    [31m+               "x": 607.984375,[39m
    [31m+               "y": 349.03125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 479.03125,[39m
    [31m+               "height": 130,[39m
    [31m+               "left": 633.59375,[39m
    [31m+               "right": 770.59375,[39m
    [31m+               "top": 349.03125,[39m
    [31m+               "width": 137,[39m
    [31m+               "x": 633.59375,[39m
    [31m+               "y": 349.03125,[39m
    [31m+             },[39m
    [31m+             "selector": "div.mtg-form-panel>div.input-grid-2-col>div.input-row.slider-row>div.slider-header>span#pva-periods-display.slider-value",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2340.7000000178814,[39m
    [31m+         "value": 0.0003169457740710956,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 40,[39m
    [31m+     "lcp": 2220,[39m
    [31m+     "maxShift": 0.1808,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/present-value-of-annuity-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0794,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 14.1875,[39m
    [31m+               "left": 424.84375,[39m
    [31m+               "right": 508.359375,[39m
    [31m+               "top": 857.8125,[39m
    [31m+               "width": 83.515625,[39m
    [31m+               "x": 424.84375,[39m
    [31m+               "y": 857.8125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 15.1875,[39m
    [31m+               "left": 424.84375,[39m
    [31m+               "right": 508.359375,[39m
    [31m+               "top": 856.8125,[39m
    [31m+               "width": 83.515625,[39m
    [31m+               "x": 424.84375,[39m
    [31m+               "y": 856.8125,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 570.2999999821186,[39m
    [31m+         "value": 0.000022847070025290742,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 93.21875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 778.78125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 778.78125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 211.09375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 660.90625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 660.90625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#si-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 493.578125,[39m
    [31m+               "height": 311.1875,[39m
    [31m+               "left": 731.515625,[39m
    [31m+               "right": 1114.609375,[39m
    [31m+               "top": 182.390625,[39m
    [31m+               "width": 383.09375,[39m
    [31m+               "x": 731.515625,[39m
    [31m+               "y": 182.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 111.1875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 760.8125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 760.8125,[39m
    [31m+             },[39m
    [31m+             "selector": "div.panel.panel-scroll>div.calculator-page-single>div#si-explanation.explanation-pane>div#loan-mtg-explanation>section.mtg-exp-section",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 658.2999999821186,[39m
    [31m+         "value": 0.07936382182232077,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 700,[39m
    [31m+     "maxShift": 0.0794,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/finance-calculators/simple-interest-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0796,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 93.21875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 778.78125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 778.78125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 211.09375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 660.90625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 660.90625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#si-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 493.578125,[39m
    [31m+               "height": 311.1875,[39m
    [31m+               "left": 731.515625,[39m
    [31m+               "right": 1114.609375,[39m
    [31m+               "top": 182.390625,[39m
    [31m+               "width": 383.09375,[39m
    [31m+               "x": 731.515625,[39m
    [31m+               "y": 182.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 389,[39m
    [31m+               "height": 198,[39m
    [31m+               "left": 754.125,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 337.875,[39m
    [31m+               "x": 754.125,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-preview-main",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 111.1875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 760.8125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 760.8125,[39m
    [31m+             },[39m
    [31m+             "selector": "div.panel.panel-scroll>div.calculator-page-single>div#si-explanation.explanation-pane>div#loan-mtg-explanation>section.mtg-exp-section",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2143,[39m
    [31m+         "value": 0.07936382182232077,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 439.765625,[39m
    [31m+               "height": 129,[39m
    [31m+               "left": 618,[39m
    [31m+               "right": 768,[39m
    [31m+               "top": 310.765625,[39m
    [31m+               "width": 150,[39m
    [31m+               "x": 618,[39m
    [31m+               "y": 310.765625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 432.765625,[39m
    [31m+               "height": 118,[39m
    [31m+               "left": 647.59375,[39m
    [31m+               "right": 763.59375,[39m
    [31m+               "top": 314.765625,[39m
    [31m+               "width": 116,[39m
    [31m+               "x": 647.59375,[39m
    [31m+               "y": 314.765625,[39m
    [31m+             },[39m
    [31m+             "selector": "div.mtg-form-panel>div.input-grid-2-col>div.input-row.slider-row>div.slider-header>span#si-time-display.slider-value",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2221.7999999821186,[39m
    [31m+         "value": 0.0002827624503156418,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 40,[39m
    [31m+     "lcp": 2260,[39m
    [31m+     "maxShift": 0.0794,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/simple-interest-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1944,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 101,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 771,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 771,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 855,[39m
    [31m+               "height": 144,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 711,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 711,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 836,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 819,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 819,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 854,[39m
    [31m+               "height": 17,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 837,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 837,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 575.1000000238419,[39m
    [31m+         "value": 0.011115333469721768,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 741,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 263,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 609,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 609,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-time-to-savings-goal>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 715.1875,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 629.796875,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 629.796875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 574,[39m
    [31m+               "height": 127,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 447,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 447,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 801.171875,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 751.125,[39m
    [31m+               "top": 709.171875,[39m
    [31m+               "width": 499.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 709.171875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 624,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 532,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 532,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 659.7000000178814,[39m
    [31m+         "value": 0.18327152038739453,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 700,[39m
    [31m+     "maxShift": 0.1833,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/finance-calculators/time-to-savings-goal-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.2039,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 724.65625,[39m
    [31m+               "height": 593.65625,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 855,[39m
    [31m+               "height": 246,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 609,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 609,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-time-to-savings-goal>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 715.1875,[39m
    [31m+               "height": 85.390625,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 730.125,[39m
    [31m+               "top": 629.796875,[39m
    [31m+               "width": 457.125,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 629.796875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 574,[39m
    [31m+               "height": 127,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 447,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 447,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.pv-toggle-row",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 801.171875,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 751.125,[39m
    [31m+               "top": 709.171875,[39m
    [31m+               "width": 499.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 709.171875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 624,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 532,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 532,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2149.5,[39m
    [31m+         "value": 0.18179470379836438,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 844.609375,[39m
    [31m+               "height": 314.21875,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.546875,[39m
    [31m+               "top": 530.390625,[39m
    [31m+               "width": 300.03125,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 530.390625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 645.265625,[39m
    [31m+               "height": 282.09375,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1072.609375,[39m
    [31m+               "top": 363.171875,[39m
    [31m+               "width": 299.09375,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 363.171875,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 81.828125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 790.171875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 790.171875,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#tsg-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2244.0999999940395,[39m
    [31m+         "value": 0.02209166172606522,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 32,[39m
    [31m+     "lcp": 2284,[39m
    [31m+     "maxShift": 0.1818,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/finance-calculators/time-to-savings-goal-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1008,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 673,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 199,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 199,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 681,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 583.734375,[39m
    [31m+               "height": 444.734375,[39m
    [31m+               "left": 690.71875,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 139,[39m
    [31m+               "width": 435.28125,[39m
    [31m+               "x": 690.71875,[39m
    [31m+               "y": 139,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 587.734375,[39m
    [31m+               "height": 396.734375,[39m
    [31m+               "left": 750.71875,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 341.28125,[39m
    [31m+               "x": 750.71875,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div.calculator-page-single>div#calc-buy-to-let>div.calculator-ui.btl-ui>section.btl-hero>aside.btl-preview-panel.is-positive",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 178,[39m
    [31m+               "height": 27,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 151,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 151,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 178,[39m
    [31m+               "height": 27,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 151,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 151,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 685.5,[39m
    [31m+         "value": 0.10076524638559944,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 80,[39m
    [31m+     "lcp": 736,[39m
    [31m+     "maxShift": 0.1008,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/loan-calculators/buy-to-let-mortgage-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0967,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 673,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 199,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 199,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 681,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 191,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 191,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 178,[39m
    [31m+               "height": 27,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 151,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 151,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 178,[39m
    [31m+               "height": 27,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 151,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 151,[39m
    [31m+             },[39m
    [31m+             "selector": "unknown",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 6.75,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 865.25,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 865.25,[39m
    [31m+             },[39m
    [31m+             "selector": "div.panel.panel-scroll>div.calculator-page-single>div#loan-btl-explanation>section.btl-exp-section.btl-exp-section--summary>h2",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1811.2000000178814,[39m
    [31m+         "value": 0.09667237212460207,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 72,[39m
    [31m+     "lcp": 1860,[39m
    [31m+     "maxShift": 0.0967,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/loan-calculators/buy-to-let-mortgage-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.077,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 777.8125,[39m
    [31m+               "height": 282.1875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 753.1875,[39m
    [31m+               "top": 495.625,[39m
    [31m+               "width": 480.1875,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 495.625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 796.1875,[39m
    [31m+               "height": 269.1875,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 745.1875,[39m
    [31m+               "top": 527,[39m
    [31m+               "width": 493.1875,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 527,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-how-much-can-borrow>div.calculator-ui.borrow-ui>section.borrow-hero>div.borrow-form-panel>section.borrow-section",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 463.625,[39m
    [31m+               "height": 192,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 745.1875,[39m
    [31m+               "top": 271.625,[39m
    [31m+               "width": 472.1875,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 271.625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 527,[39m
    [31m+               "height": 272,[39m
    [31m+               "left": 253,[39m
    [31m+               "right": 745.1875,[39m
    [31m+               "top": 255,[39m
    [31m+               "width": 492.1875,[39m
    [31m+               "x": 253,[39m
    [31m+               "y": 255,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-how-much-can-borrow>div.calculator-ui.borrow-ui>section.borrow-hero>div.borrow-form-panel>section.borrow-section",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 615.578125,[39m
    [31m+               "height": 366.578125,[39m
    [31m+               "left": 779.1875,[39m
    [31m+               "right": 1090,[39m
    [31m+               "top": 249,[39m
    [31m+               "width": 310.8125,[39m
    [31m+               "x": 779.1875,[39m
    [31m+               "y": 249,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 337,[39m
    [31m+               "height": 96,[39m
    [31m+               "left": 777.1875,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 241,[39m
    [31m+               "width": 314.8125,[39m
    [31m+               "x": 777.1875,[39m
    [31m+               "y": 241,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-how-much-can-borrow>div.calculator-ui.borrow-ui>section.borrow-hero>aside.borrow-result-dashboard>div.borrow-metric-grid",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 656.5,[39m
    [31m+         "value": 0.07695304062705279,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 48,[39m
    [31m+     "lcp": 696,[39m
    [31m+     "maxShift": 0.077,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/loan-calculators/how-much-can-i-borrow/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0777,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 777.8125,[39m
    [31m+               "height": 282.1875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 753.1875,[39m
    [31m+               "top": 495.625,[39m
    [31m+               "width": 480.1875,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 495.625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 796.1875,[39m
    [31m+               "height": 269.1875,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 745.1875,[39m
    [31m+               "top": 527,[39m
    [31m+               "width": 493.1875,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 527,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-how-much-can-borrow>div.calculator-ui.borrow-ui>section.borrow-hero>div.borrow-form-panel>section.borrow-section",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 463.625,[39m
    [31m+               "height": 192,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 745.1875,[39m
    [31m+               "top": 271.625,[39m
    [31m+               "width": 472.1875,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 271.625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 527,[39m
    [31m+               "height": 272,[39m
    [31m+               "left": 253,[39m
    [31m+               "right": 745.1875,[39m
    [31m+               "top": 255,[39m
    [31m+               "width": 492.1875,[39m
    [31m+               "x": 253,[39m
    [31m+               "y": 255,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-how-much-can-borrow>div.calculator-ui.borrow-ui>section.borrow-hero>div.borrow-form-panel>section.borrow-section",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 615.578125,[39m
    [31m+               "height": 366.578125,[39m
    [31m+               "left": 779.1875,[39m
    [31m+               "right": 1090,[39m
    [31m+               "top": 249,[39m
    [31m+               "width": 310.8125,[39m
    [31m+               "x": 779.1875,[39m
    [31m+               "y": 249,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 337,[39m
    [31m+               "height": 96,[39m
    [31m+               "left": 777.1875,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 241,[39m
    [31m+               "width": 314.8125,[39m
    [31m+               "x": 777.1875,[39m
    [31m+               "y": 241,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-how-much-can-borrow>div.calculator-ui.borrow-ui>section.borrow-hero>aside.borrow-result-dashboard>div.borrow-metric-grid",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1716.7999999821186,[39m
    [31m+         "value": 0.0776522022396394,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 631.8125,[39m
    [31m+               "height": 45,[39m
    [31m+               "left": 655.015625,[39m
    [31m+               "right": 741.1875,[39m
    [31m+               "top": 586.8125,[39m
    [31m+               "width": 86.171875,[39m
    [31m+               "x": 655.015625,[39m
    [31m+               "y": 586.8125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 631.8125,[39m
    [31m+               "height": 45,[39m
    [31m+               "left": 664.65625,[39m
    [31m+               "right": 741.1875,[39m
    [31m+               "top": 586.8125,[39m
    [31m+               "width": 76.53125,[39m
    [31m+               "x": 664.65625,[39m
    [31m+               "y": 586.8125,[39m
    [31m+             },[39m
    [31m+             "selector": "div.borrow-form-panel>section.borrow-section>div#bor-multiple-row.input-row.slider-row>div.slider-header>span#bor-multiple-display.slider-value",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2599.0999999940395,[39m
    [31m+         "value": 0.000021302128430372528,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 48,[39m
    [31m+     "lcp": 1204,[39m
    [31m+     "maxShift": 0.0777,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/loan-calculators/how-much-can-i-borrow/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.4661,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 199,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 673,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 673,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 179,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 693,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 693,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-remortgage-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 38.875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 833.125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 833.125,[39m
    [31m+             },[39m
    [31m+             "selector": "section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-remortgage-explanation>section.remo-exp-section.remo-exp-section--faq",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 833.125,[39m
    [31m+               "height": 24,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 809.125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 809.125,[39m
    [31m+             },[39m
    [31m+             "selector": "div.panel.panel-scroll>div.calculator-page-single>div#loan-remortgage-explanation>section.remo-exp-section.remo-exp-section--table>div#remo-table-yearly-wrap.table-scroll",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 574.0999999940395,[39m
    [31m+         "value": 0.1270212765957447,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 177.203125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 694.796875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 694.796875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 199,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 673,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 673,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-remortgage-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 582,[39m
    [31m+               "height": 349,[39m
    [31m+               "left": 768.796875,[39m
    [31m+               "right": 1094,[39m
    [31m+               "top": 233,[39m
    [31m+               "width": 325.203125,[39m
    [31m+               "x": 768.796875,[39m
    [31m+               "y": 233,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 559,[39m
    [31m+               "height": 278,[39m
    [31m+               "left": 790.796875,[39m
    [31m+               "right": 1072,[39m
    [31m+               "top": 281,[39m
    [31m+               "width": 281.203125,[39m
    [31m+               "x": 790.796875,[39m
    [31m+               "y": 281,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-remortgage-switching>div.calculator-ui.remo-ui>section.remo-hero>aside.remo-result-dashboard>div.remo-metric-grid",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 72.546875,[39m
    [31m+               "left": 290,[39m
    [31m+               "right": 1075,[39m
    [31m+               "top": 799.453125,[39m
    [31m+               "width": 785,[39m
    [31m+               "x": 290,[39m
    [31m+               "y": 799.453125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "selector": "div.panel.panel-scroll>div.calculator-page-single>div#loan-remortgage-explanation>section.remo-exp-section.remo-exp-section--table>div#remo-table-yearly-wrap.table-scroll",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 644.1999999880791,[39m
    [31m+         "value": 0.33910050809687675,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 88,[39m
    [31m+     "lcp": 384,[39m
    [31m+     "maxShift": 0.3391,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/loan-calculators/remortgage-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1662,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 131.203125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 740.796875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 740.796875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 179,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 693,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 693,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-remortgage-explanation",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 582,[39m
    [31m+               "height": 349,[39m
    [31m+               "left": 768.796875,[39m
    [31m+               "right": 1094,[39m
    [31m+               "top": 233,[39m
    [31m+               "width": 325.203125,[39m
    [31m+               "x": 768.796875,[39m
    [31m+               "y": 233,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 559,[39m
    [31m+               "height": 278,[39m
    [31m+               "left": 790.796875,[39m
    [31m+               "right": 1072,[39m
    [31m+               "top": 281,[39m
    [31m+               "width": 281.203125,[39m
    [31m+               "x": 790.796875,[39m
    [31m+               "y": 281,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-remortgage-switching>div.calculator-ui.remo-ui>section.remo-hero>aside.remo-result-dashboard>div.remo-metric-grid",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 603.296875,[39m
    [31m+               "height": 84.703125,[39m
    [31m+               "left": 255,[39m
    [31m+               "right": 772.796875,[39m
    [31m+               "top": 518.59375,[39m
    [31m+               "width": 517.796875,[39m
    [31m+               "x": 255,[39m
    [31m+               "y": 518.59375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 615.703125,[39m
    [31m+               "height": 84.703125,[39m
    [31m+               "left": 255,[39m
    [31m+               "right": 772.796875,[39m
    [31m+               "top": 531,[39m
    [31m+               "width": 517.796875,[39m
    [31m+               "x": 255,[39m
    [31m+               "y": 531,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-remortgage-switching>div.calculator-ui.remo-ui>section.remo-hero>div.remo-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1612,[39m
    [31m+         "value": 0.16236728568530942,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 177.203125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 694.796875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 694.796875,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 131.203125,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 740.796875,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 740.796875,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#loan-remortgage-explanation",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2523.9000000059605,[39m
    [31m+         "value": 0.0038073415945756367,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 64,[39m
    [31m+     "lcp": 1200,[39m
    [31m+     "maxShift": 0.1624,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/loan-calculators/remortgage-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.0526,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 457,[39m
    [31m+               "height": 18.140625,[39m
    [31m+               "left": 1255.21875,[39m
    [31m+               "right": 1315,[39m
    [31m+               "top": 438.859375,[39m
    [31m+               "width": 59.78125,[39m
    [31m+               "x": 1255.21875,[39m
    [31m+               "y": 438.859375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 457,[39m
    [31m+               "height": 18.140625,[39m
    [31m+               "left": 1281.359375,[39m
    [31m+               "right": 1316.359375,[39m
    [31m+               "top": 438.859375,[39m
    [31m+               "width": 35,[39m
    [31m+               "x": 1281.359375,[39m
    [31m+               "y": 438.859375,[39m
    [31m+             },[39m
    [31m+             "selector": "section.comm-hero>aside.comm-answer-deck>div.comm-metrics>div.comm-metric-row>strong#comm-deck-commission",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 773,[39m
    [31m+         "value": 0.0000163879696408338,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 0,[39m
    [31m+               "height": 0,[39m
    [31m+               "left": 0,[39m
    [31m+               "right": 0,[39m
    [31m+               "top": 0,[39m
    [31m+               "width": 0,[39m
    [31m+               "x": 0,[39m
    [31m+               "y": 0,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 873,[39m
    [31m+               "height": 215,[39m
    [31m+               "left": 248,[39m
    [31m+               "right": 1353,[39m
    [31m+               "top": 658,[39m
    [31m+               "width": 1105,[39m
    [31m+               "x": 248,[39m
    [31m+               "y": 658,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main.layout-main--no-ads>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#comm-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 523.296875,[39m
    [31m+               "height": 176.703125,[39m
    [31m+               "left": 932,[39m
    [31m+               "right": 1326,[39m
    [31m+               "top": 346.59375,[39m
    [31m+               "width": 394,[39m
    [31m+               "x": 932,[39m
    [31m+               "y": 346.59375,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 503.140625,[39m
    [31m+               "height": 176.703125,[39m
    [31m+               "left": 932,[39m
    [31m+               "right": 1326,[39m
    [31m+               "top": 326.4375,[39m
    [31m+               "width": 394,[39m
    [31m+               "x": 932,[39m
    [31m+               "y": 326.4375,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-commission-calculator>div.calculator-ui.comm-layout>section.comm-hero>aside.comm-answer-deck>div.comm-metrics",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 873,[39m
    [31m+               "height": 1,[39m
    [31m+               "left": 248,[39m
    [31m+               "right": 1353,[39m
    [31m+               "top": 872,[39m
    [31m+               "width": 1105,[39m
    [31m+               "x": 248,[39m
    [31m+               "y": 872,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 638,[39m
    [31m+               "height": 28,[39m
    [31m+               "left": 248,[39m
    [31m+               "right": 1353,[39m
    [31m+               "top": 610,[39m
    [31m+               "width": 1105,[39m
    [31m+               "x": 248,[39m
    [31m+               "y": 610,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main.layout-main--no-ads>section.center-column>div.panel.panel-scroll>div.calculator-page-single>h3",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1962.0999999940395,[39m
    [31m+         "value": 0.052588590532944055,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 48,[39m
    [31m+     "lcp": 752,[39m
    [31m+     "maxShift": 0.0526,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/percentage-calculators/commission-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1909,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 228.4375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 643.5625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 643.5625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 301,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 571,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 571,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#revpct-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 615.5625,[39m
    [31m+               "height": 72,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 543.5625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 543.5625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 543,[39m
    [31m+               "height": 72,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 471,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 471,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 643.5625,[39m
    [31m+               "height": 28,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 615.5625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 615.5625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 571,[39m
    [31m+               "height": 28,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 543,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 543,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>h3",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 573.6999999880791,[39m
    [31m+         "value": 0.013606529109188683,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 705.328125,[39m
    [31m+               "height": 574.328125,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 615.5625,[39m
    [31m+               "height": 253.5625,[39m
    [31m+               "left": 249,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 362,[39m
    [31m+               "width": 877,[39m
    [31m+               "x": 249,[39m
    [31m+               "y": 362,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-reverse-percentage>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 158.671875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 713.328125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 713.328125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 228.4375,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 643.5625,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 643.5625,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#revpct-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 523.0625,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 751.125,[39m
    [31m+               "top": 431.0625,[39m
    [31m+               "width": 499.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 431.0625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 424,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 332,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 332,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 625.5,[39m
    [31m+         "value": 0.17727810369867447,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 56,[39m
    [31m+     "lcp": 604,[39m
    [31m+     "maxShift": 0.1773,[39m
    [31m+     "mode": "normal",[39m
    [31m+     "route": "/percentage-calculators/reverse-percentage-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+   Object {[39m
    [31m+     "cls": 0.1921,[39m
    [31m+     "entries": Array [[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1020,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 320,[39m
    [31m+               "x": 1020,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 56,[39m
    [31m+               "height": 38,[39m
    [31m+               "left": 1112.734375,[39m
    [31m+               "right": 1340,[39m
    [31m+               "top": 18,[39m
    [31m+               "width": 227.265625,[39m
    [31m+               "x": 1112.734375,[39m
    [31m+               "y": 18,[39m
    [31m+             },[39m
    [31m+             "selector": "div.page>header.site-header>div.site-header-inner>div.header-right>div.header-search",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1156.9000000059605,[39m
    [31m+         "value": 0.0006438447635548406,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 587.578125,[39m
    [31m+               "height": 456.578125,[39m
    [31m+               "left": 694.125,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 131,[39m
    [31m+               "width": 431.875,[39m
    [31m+               "x": 694.125,[39m
    [31m+               "y": 131,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 543,[39m
    [31m+               "height": 181,[39m
    [31m+               "left": 249,[39m
    [31m+               "right": 1126,[39m
    [31m+               "top": 362,[39m
    [31m+               "width": 877,[39m
    [31m+               "x": 249,[39m
    [31m+               "y": 362,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-reverse-percentage>div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 276.421875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 595.578125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 595.578125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 301,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 571,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 571,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#revpct-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 523.0625,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 751.125,[39m
    [31m+               "top": 431.0625,[39m
    [31m+               "width": 499.125,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 431.0625,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 424,[39m
    [31m+               "height": 92,[39m
    [31m+               "left": 252,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 332,[39m
    [31m+               "width": 840,[39m
    [31m+               "x": 252,[39m
    [31m+               "y": 332,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>div.mtg-form-panel>div.input-row.action-row",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 1709,[39m
    [31m+         "value": 0.1701491040596649,[39m
    [31m+       },[39m
    [31m+       Object {[39m
    [31m+         "sources": Array [[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 158.671875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 713.328125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 713.328125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 872,[39m
    [31m+               "height": 276.421875,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 595.578125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 595.578125,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>div#revpct-explanation.explanation-pane",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 625.9375,[39m
    [31m+               "height": 161.40625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.859375,[39m
    [31m+               "top": 464.53125,[39m
    [31m+               "width": 300.34375,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 464.53125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 508.1875,[39m
    [31m+               "height": 161.40625,[39m
    [31m+               "left": 773.515625,[39m
    [31m+               "right": 1073.859375,[39m
    [31m+               "top": 346.78125,[39m
    [31m+               "width": 300.34375,[39m
    [31m+               "x": 773.515625,[39m
    [31m+               "y": 346.78125,[39m
    [31m+             },[39m
    [31m+             "selector": "div#calc-home-loan>div.calculator-ui.home-loan-ui>section.mtg-hero>aside.mtg-preview-panel>div.mtg-snapshot-list",[39m
    [31m+           },[39m
    [31m+           Object {[39m
    [31m+             "currentRect": Object {[39m
    [31m+               "bottom": 693.328125,[39m
    [31m+               "height": 28,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 665.328125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 665.328125,[39m
    [31m+             },[39m
    [31m+             "previousRect": Object {[39m
    [31m+               "bottom": 575.578125,[39m
    [31m+               "height": 28,[39m
    [31m+               "left": 273,[39m
    [31m+               "right": 1092,[39m
    [31m+               "top": 547.578125,[39m
    [31m+               "width": 819,[39m
    [31m+               "x": 273,[39m
    [31m+               "y": 547.578125,[39m
    [31m+             },[39m
    [31m+             "selector": "main.layout-main>section.center-column>div.panel.panel-scroll>div.calculator-page-single>h3",[39m
    [31m+           },[39m
    [31m+         ],[39m
    [31m+         "startTime": 2116.7000000178814,[39m
    [31m+         "value": 0.021266017825989768,[39m
    [31m+       },[39m
    [31m+     ],[39m
    [31m+     "inpProxy": 56,[39m
    [31m+     "lcp": 2152,[39m
    [31m+     "maxShift": 0.1701,[39m
    [31m+     "mode": "stress",[39m
    [31m+     "route": "/percentage-calculators/reverse-percentage-calculator/",[39m
    [31m+     "status": 200,[39m
    [31m+   },[39m
    [31m+ ][39m

      398 |       violations,
      399 |       `CWV guard failed for ${violations.length} route checks. Report: ${REPORT_PATH}\n${debugMessage}`
    > 400 |     ).toEqual([]);
          |       ^
      401 |   });
      402 | });
      403 |
        at /home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js:400:7

    [31mTest timeout of 30000ms exceeded.[39m

  Slow test file: [chromium] › tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js (17.4m)
  Consider running tests from slow files in parallel. See: https://playwright.dev/docs/test-parallel
  1 failed
    [chromium] › tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js:313:3 › Global CWV guard — all calculator routes › UR-TEST-005/006: all calculator routes must satisfy CLS/LCP/INP thresholds in normal and stress modes 
  - 
> calchowmuch@1.0.0 test:iss001
> playwright test tests_specs/infrastructure/e2e/iss-design-001.spec.js


Running 9 tests using 8 workers

  ✓  2 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:126:3 › ISS-001: Layout Stability › scrollbars remain visible during navigation (3.8s)
  ✓  7 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:150:3 › ISS-001: Layout Stability › buttons do not have transform transitions (5.3s)
  ✓  1 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:170:3 › ISS-001: Layout Stability › no layout shift when clicking nav items rapidly (8.0s)
  ✓  5 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:188:3 › ISS-001: Layout Stability › category switching does not cause layout shift (10.2s)
  ✓  6 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:88:3 › ISS-001: Layout Stability › center column has stable dimensions during navigation (10.2s)
  ✘  9 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:235:3 › ISS-001: Layout Stability › visual regression - page layout stability (5.7s)
  ✓  3 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:107:3 › ISS-001: Layout Stability › ads column has stable dimensions during navigation (10.6s)
  ✓  4 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:47:3 › ISS-001: Layout Stability › page shell maintains fixed dimensions during navigation (10.6s)
  ✓  8 [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:69:3 › ISS-001: Layout Stability › left navigation pane has stable dimensions during navigation (10.5s)


  1) [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:235:3 › ISS-001: Layout Stability › visual regression - page layout stability 

    Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveScreenshot[2m([22m[32mexpected[39m[2m)[22m failed

      83094 pixels (ratio 0.10 of all image pixels) are different.

      Snapshot: layout-initial.png

    Call log:
    [2m  - Expect "toHaveScreenshot(layout-initial.png)" with timeout 5000ms[22m
    [2m    - verifying given screenshot expectation[22m
    [2m  - taking page screenshot[22m
    [2m    - disabled all CSS animations[22m
    [2m  - waiting for fonts to load...[22m
    [2m  - fonts loaded[22m
    [2m  - 83094 pixels (ratio 0.10 of all image pixels) are different.[22m
    [2m  - waiting 100ms before taking screenshot[22m
    [2m  - taking page screenshot[22m
    [2m    - disabled all CSS animations[22m
    [2m  - waiting for fonts to load...[22m
    [2m  - fonts loaded[22m
    [2m  - captured a stable screenshot[22m
    [2m  - 83094 pixels (ratio 0.10 of all image pixels) are different.[22m


      236 |     // Take screenshot after initial load
      237 |     await waitForStableShell(page);
    > 238 |     await expect(page).toHaveScreenshot('layout-initial.png', {
          |                        ^
      239 |       fullPage: true,
      240 |       animations: 'disabled',
      241 |     });
        at /home/kartheek/calchowmuch/tests_specs/infrastructure/e2e/iss-design-001.spec.js:238:24

    attachment #1: layout-initial (image/png) ──────────────────────────────────────────────────────
    Expected: tests_specs/infrastructure/e2e/iss-design-001.spec.js-snapshots/layout-initial-chromium-linux.png
    Received: test-results/infrastructure-e2e-iss-des-edb3f-ion---page-layout-stability-chromium/layout-initial-actual.png
    Diff:     test-results/infrastructure-e2e-iss-des-edb3f-ion---page-layout-stability-chromium/layout-initial-diff.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-iss-des-edb3f-ion---page-layout-stability-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #3: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-iss-des-edb3f-ion---page-layout-stability-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/infrastructure-e2e-iss-des-edb3f-ion---page-layout-stability-chromium/error-context.md

    attachment #5: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/infrastructure-e2e-iss-des-edb3f-ion---page-layout-stability-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/infrastructure-e2e-iss-des-edb3f-ion---page-layout-stability-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  1 failed
    [chromium] › tests_specs/infrastructure/e2e/iss-design-001.spec.js:235:3 › ISS-001: Layout Stability › visual regression - page layout stability 
  8 passed (12.3s)

### Evidence Paths
- Route artifact: 
- Thin-content scoped artifact emitted by SEO runner:  (pilotExcluded summary mode)
- Schema dedupe artifacts:
  - 
  - 
- Playwright SEO artifact path: scoped SEO runner for  uses stdio output and does not emit per-calc JSON artifact path in this mode.

---

## 4) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

SEO + schema scoped release checks are complete for  under human-locked maintenance mode.

# Test & Spec Inventory

> Single source of truth for all test files. Everything lives under `tests_specs/`.

---

## Structure

```
tests_specs/
├── loans/           # Home loan, car loan, hire purchase, leasing, PCP, LTV, etc.
│   ├── unit/        # Vitest — calculation logic
│   └── e2e/         # Playwright — user journeys + SEO
├── credit-cards/    # Consolidation, minimum payment, repayment/payoff
│   ├── unit/
│   └── e2e/
├── finance/         # Compound/simple interest, present/future value, annuity, etc.
│   ├── unit/
│   └── e2e/
├── percentage/      # Commission, discount, margin, markup, percent change, etc.
│   ├── unit/
│   └── e2e/
├── math/            # Algebra, calculus, statistics, probability, sequences, etc.
│   ├── unit/
│   └── e2e/
├── time-and-date/   # Age, birthday, countdown, days-until, work hours, overtime
│   ├── unit/
│   └── e2e/
├── sleep-and-nap/   # Sleep time, wake up, nap time, power nap, energy nap
│   ├── unit/
│   └── e2e/
└── infrastructure/  # Core utils, layout stability, CWV guard, shell, sitemap
    ├── unit/
    └── e2e/
```

---

## How Tests Run

| Runner | Pattern | Command |
|--------|---------|---------|
| Vitest | `tests_specs/**/unit/*.test.js` | `npm run test` |
| Playwright | `tests_specs/**/e2e/*.spec.js` | `npm run test:e2e` |

---

## Loans (4 unit · 21 e2e)

### Unit

| File | Tests |
|------|-------|
| auto-loan-utils.test.js | Auto/car loan utility functions |
| buy-to-let-utils.test.js | Buy-to-let rental yield calculations |
| home-loan.test.js | Home loan EMI + amortization |
| loan-utils.test.js | Shared loan math (monthly payment, schedule) |

### E2E

| File | Tests |
|------|-------|
| balance-transfer-installment-plan.spec.js | Balance transfer user journey |
| balance-transfer-installment-plan-seo.spec.js | Balance transfer SEO/metadata |
| buy-to-let.spec.js | Buy-to-let user journey |
| car-loan-seo.spec.js | Car loan SEO/metadata |
| hire-purchase.spec.js | Hire purchase user journey |
| hire-purchase-seo.spec.js | Hire purchase SEO/metadata |
| home-loan-calculator.spec.js | Home loan user journey |
| how-much-can-borrow.spec.js | Borrowing capacity journey |
| interest-rate-change-calculator.spec.js | Rate change user journey |
| interest-rate-change-calculator-logic.spec.js | Rate change calculator logic |
| leasing-calculator.spec.js | Leasing user journey |
| leasing-calculator-seo.spec.js | Leasing SEO/metadata |
| loan-to-value.spec.js | LTV user journey |
| multiple-car-loan.spec.js | Multi-car loan user journey |
| multiple-car-loan-seo.spec.js | Multi-car loan SEO/metadata |
| offset-calculator.spec.js | Offset mortgage user journey |
| offset-calculator-logic.spec.js | Offset calculator logic |
| pcp-calculator.spec.js | PCP finance user journey |
| pcp-calculator-seo.spec.js | PCP SEO/metadata |
| remortgage-switching.spec.js | Remortgage user journey |
| remortgage-switching-logic.spec.js | Remortgage calculator logic |

---

## Credit Cards (1 unit · 6 e2e)

### Unit

| File | Tests |
|------|-------|
| credit-card-utils.test.js | Payoff, consolidation, balance transfer, minimum payment math |

### E2E

| File | Tests |
|------|-------|
| credit-card-consolidation.spec.js | Consolidation user journey |
| credit-card-consolidation-seo.spec.js | Consolidation SEO/metadata |
| credit-card-minimum-payment.spec.js | Minimum payment user journey |
| credit-card-minimum-payment-seo.spec.js | Minimum payment SEO/metadata |
| credit-card-repayment-payoff.spec.js | Repayment/payoff user journey |
| credit-card-repayment-payoff-seo.spec.js | Repayment/payoff SEO/metadata |

---

## Finance (9 unit · 16 e2e)

### Unit

| File | Tests |
|------|-------|
| compound-interest-calculator.test.js | Compound interest math |
| effective-annual-rate-calculator.test.js | EAR conversion math |
| finance-static-schema-source-parity.test.js | Schema/source JSON-LD parity guard |
| future-value-calculator.test.js | Future value math |
| future-value-of-annuity-calculator.test.js | FV annuity math |
| investment-growth-calculator.test.js | Investment growth projections |
| present-value-calculator.test.js | Present value math |
| present-value-of-annuity-calculator.test.js | PV annuity math |
| simple-interest-calculator.test.js | Simple interest math |

### E2E

| File | Tests |
|------|-------|
| compound-interest-calculator.spec.js | Compound interest journey |
| compound-interest-seo.spec.js | Compound interest SEO |
| effective-annual-rate-calculator.spec.js | EAR journey |
| effective-annual-rate-seo.spec.js | EAR SEO |
| future-value-calculator.spec.js | Future value journey |
| future-value-seo.spec.js | Future value SEO |
| future-value-of-annuity-calculator.spec.js | FV annuity journey |
| future-value-of-annuity-seo.spec.js | FV annuity SEO |
| investment-growth-calculator.spec.js | Investment growth journey |
| investment-growth-seo.spec.js | Investment growth SEO |
| present-value-calculator.spec.js | Present value journey |
| present-value-seo.spec.js | Present value SEO |
| present-value-of-annuity-calculator.spec.js | PV annuity journey |
| present-value-of-annuity-seo.spec.js | PV annuity SEO |
| simple-interest-calculator.spec.js | Simple interest journey |
| simple-interest-seo.spec.js | Simple interest SEO |

---

## Percentage (14 unit · 21 e2e)

### Unit

| File | Tests |
|------|-------|
| commission-calculator.test.js | Commission math |
| discount-calculator.test.js | Discount math |
| margin-calculator.test.js | Margin math |
| markup-calculator.test.js | Markup math |
| percent-change-calculator.test.js | Percent change math |
| percent-to-fraction-decimal-calculator.test.js | Percent ↔ fraction/decimal |
| percentage-calculator.test.js | Core percentage operations |
| percentage-composition-calculator.test.js | Composition math |
| percentage-decrease-calculator.test.js | Decrease math |
| percentage-difference-calculator.test.js | Difference math |
| percentage-increase-calculator.test.js | Increase math |
| percentage-of-a-number-calculator.test.js | X% of Y math |
| reverse-percentage-calculator.test.js | Reverse percentage math |
| what-percent-is-x-of-y-calculator.test.js | What % is X of Y math |

### E2E

| File | Tests |
|------|-------|
| commission-calculator.spec.js | Commission journey |
| commission-calculator-seo.spec.js | Commission SEO |
| discount-calculator-seo.spec.js | Discount SEO |
| margin-calculator.spec.js | Margin journey |
| margin-calculator-seo.spec.js | Margin SEO |
| markup-calculator-seo.spec.js | Markup SEO |
| percent-change-calculator.spec.js | Percent change journey |
| percent-change-calculator-seo.spec.js | Percent change SEO |
| percent-to-fraction-decimal-calculator.spec.js | Percent/fraction journey |
| percent-to-fraction-decimal-calculator-seo.spec.js | Percent/fraction SEO |
| percentage-calculator-logic.spec.js | Percentage calculator logic |
| percentage-composition-seo.spec.js | Composition SEO |
| percentage-decrease-seo.spec.js | Decrease SEO |
| percentage-difference-calculator.spec.js | Difference journey |
| percentage-difference-calculator-seo.spec.js | Difference SEO |
| percentage-increase-calculator.spec.js | Increase journey |
| percentage-increase-calculator-seo.spec.js | Increase SEO |
| percentage-of-a-number-calculator.spec.js | X% of Y journey |
| percentage-of-a-number-calculator-seo.spec.js | X% of Y SEO |
| reverse-percentage-seo.spec.js | Reverse percentage SEO |
| what-percent-is-x-of-y-seo.spec.js | What % is X of Y SEO |

---

## Math (15 unit · 0 e2e)

### Unit

| File | Tests |
|------|-------|
| advanced-statistics.test.js | Advanced stats operations |
| algebra-calculators.test.js | Algebra solver math |
| basic-calculator.test.js | Basic arithmetic |
| calculus.test.js | Derivative/integral math |
| confidence-interval.test.js | Confidence interval math |
| fraction-calculator.test.js | Fraction arithmetic |
| logarithm-calculators.test.js | Log/ln math |
| mmmr-calculator.test.js | Mean/median/mode/range |
| permutation-combination.test.js | nPr/nCr math |
| probability-calculator.test.js | Probability math |
| sequence-calculator.test.js | Arithmetic/geometric sequences |
| standard-deviation.test.js | Standard deviation math |
| statistics-calculator.test.js | General statistics |
| trigonometry-calculators.test.js | Sin/cos/tan math |
| z-score.test.js | Z-score math |

> No E2E specs yet for math calculators.

---

## Time & Date (7 unit · 15 e2e)

### Unit

| File | Tests |
|------|-------|
| age-calculator.test.js | Age calculation math |
| birthday-day-of-week.test.js | Day-of-week math |
| countdown-timer-generator.test.js | Countdown logic |
| days-until-a-date-calculator.test.js | Days-until math |
| overtime-hours-calculator.test.js | Overtime hours math |
| time-between-two-dates-calculator.test.js | Date diff math |
| work-hours-calculator.test.js | Work hours math |

### E2E

| File | Tests |
|------|-------|
| age-calculator.spec.js | Age calculator journey |
| age-calculator-seo.spec.js | Age calculator SEO |
| birthday-day-of-week-calculator.spec.js | Birthday DOW journey |
| birthday-day-of-week-seo.spec.js | Birthday DOW SEO |
| countdown-timer-generator.spec.js | Countdown journey |
| countdown-timer-generator-seo.spec.js | Countdown SEO |
| days-until-a-date-calculator.spec.js | Days-until journey |
| days-until-a-date-seo.spec.js | Days-until SEO |
| overtime-hours-calculator.spec.js | Overtime journey |
| overtime-hours-calculator-seo.spec.js | Overtime SEO |
| overtime-hours-seo.spec.js | Overtime SEO (additional) |
| time-between-two-dates-calculator.spec.js | Date diff journey |
| time-between-two-dates-seo.spec.js | Date diff SEO |
| work-hours-calculator.spec.js | Work hours journey |
| work-hours-seo.spec.js | Work hours SEO |

---

## Sleep & Nap (4 unit · 11 e2e)

### Unit

| File | Tests |
|------|-------|
| energy-based-nap-selector.test.js | Energy nap selection logic |
| nap-time-calculator.test.js | Nap time math |
| sleep-time-calculator.test.js | Sleep cycle math |
| wake-up-time-calculator.test.js | Wake-up time math |

### E2E

| File | Tests |
|------|-------|
| energy-based-nap-selector.spec.js | Energy nap journey |
| energy-based-nap-selector-seo.spec.js | Energy nap SEO |
| nap-time-calculator.spec.js | Nap time journey |
| nap-time-seo.spec.js | Nap time SEO |
| power-nap-calculator.spec.js | Power nap journey |
| power-nap-calculator-seo.spec.js | Power nap SEO |
| sleep-time-calculator.spec.js | Sleep time journey |
| sleep-time-calculator-seo.spec.js | Sleep time SEO |
| sleep-time-seo.spec.js | Sleep time SEO (additional) |
| wake-up-time-calculator.spec.js | Wake-up journey |
| wake-up-time-seo.spec.js | Wake-up SEO |

---

## Infrastructure (6 unit · 11 e2e)

### Unit

| File | Tests |
|------|-------|
| format.test.js | `formatCurrency()`, `formatNumber()`, `formatPercent()` |
| graph-utils.test.js | Chart/graph utility functions |
| math.test.js | Core math helpers |
| page-metadata-schema-guard.test.js | Page metadata + JSON-LD schema guard |
| stats.test.js | Core stats helpers |
| validate.test.js | `toNumber()`, input validation |

### E2E

| File | Tests |
|------|-------|
| button-only-recalc-finance-percentage.spec.js | Finance/percentage trigger contract |
| cls-guard-all-calculators.spec.js | CWV CLS guard — all routes |
| gtep-pages.spec.js | GTEP page contract (no shell) |
| gtep-pages-seo.spec.js | GTEP SEO assertions |
| home-shell.spec.js | Shell layout + nav E2E |
| iss-001-layout-stability.spec.js | ISS-001 layout stability |
| iss-design-001.spec.js | Design contract assertions |
| iss/iss-nav-top-001.spec.js | Top nav stability |
| route-archetype-contract.spec.js | Archetype body-data assertions |
| sitemap-footer.spec.js | Sitemap + footer links |
| sitemap-seo.spec.js | Sitemap SEO assertions |

> Also contains `iss-design-001.spec.js-snapshots/` (2 PNG baseline images).

---

## Summary

| Category | Unit | E2E | Total |
|----------|------|-----|-------|
| Loans | 4 | 21 | 25 |
| Credit Cards | 1 | 6 | 7 |
| Finance | 10 | 16 | 26 |
| Percentage | 14 | 21 | 35 |
| Math | 15 | 0 | 15 |
| Time & Date | 7 | 15 | 22 |
| Sleep & Nap | 4 | 11 | 15 |
| Infrastructure | 6 | 11 | 17 |
| **Total** | **61** | **101** | **162** |

Plus 2 PNG snapshot files → **164 files total**.

---

## Test Type Legend

| Suffix | Runner | Purpose |
|--------|--------|---------|
| `*.test.js` | Vitest | Unit tests — pure computation logic, no browser |
| `*.spec.js` | Playwright | E2E tests — full page in chromium browser |
| `*-seo.spec.js` | Playwright | SEO assertions — metadata, schema, canonical |
| `*-logic.spec.js` | Playwright | Calculator logic specs (browser-based acceptance) |

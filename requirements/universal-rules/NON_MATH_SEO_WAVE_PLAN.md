# Non-Math SEO Wave Plan

## Purpose

This tracker governs the non-math SEO wave. Work is executed category by category, but each
calculator must be completed, regenerated, verified, and logged before the next calculator starts.

## Shared Execution Rules

- Scope excludes all math calculators.
- Default wave type is SEO-first:
  - title
  - meta description
  - schema copy
  - canonical/sitemap/internal-link cleanup
  - explanation upgrades
- Thin-content fixes must follow `requirements/universal-rules/CALCULATOR_BUILD_GUIDE.md`.
- Explanation contract for touched calculator pages:
  - intent-led `H2`
  - short answer-first paragraph
  - one additional short paragraph
  - one scannable list
  - long-form practical guide
  - FAQ
  - Important Notes
- Default verification for SEO-first waves:
  - `CLUSTER=<cluster> CALC=<calc> npm run test:calc:seo`
  - `CLUSTER=<cluster> CALC=<calc> npm run test:schema:dedupe -- --scope=calc`
  - `CLUSTER=<cluster> CALC=<calc> npm run test:seo:mojibake -- --scope=calc`
- Add `CLUSTER=<cluster> CALC=<calc> npm run test:content:quality -- --scope=calc` when the
  explanation guide is materially rewritten.
- Escalate to full scoped calc gates only if work changes layout, CSS, JS, navigation, or route
  contracts.
- Final non-math stress test is run only after all non-math categories are complete.

## Category Order

1. Credit Cards
2. Car Loans
3. Finance
4. Time & Date
5. Percentage
6. Loans

## Wave Tracker

| Category | Order | Status | Notes |
| :--- | :--- | :--- | :--- |
| Credit Cards | 1 | complete | 4 calculators regenerated; scoped SEO/schema/mojibake passed; content quality 3 warns, 1 pass |
| Car Loans | 2 | complete | 5 calculators regenerated; scoped SEO/schema/mojibake passed; content quality 5 warns |
| Finance | 3 | complete | 11 calculators regenerated; scoped SEO/schema/mojibake passed; content quality 11 warns |
| Time & Date | 4 | complete | 12 calculators regenerated; scoped SEO/schema/mojibake passed; content quality 12 warns |
| Percentage | 5 | complete | Route contracts fixed; 13 calculators regenerated; scoped SEO/schema/mojibake passed; content quality 13 warns |
| Loans | 6 | pending | Awaiting scope approval |

## Credit Cards Checklist

| Calculator | Route | CLUSTER | CALC | SEO Issues | Content Scope | Verification | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Credit Card Payment Calculator | `/credit-card-calculators/credit-card-payment-calculator/` | `credit-cards` | `credit-card-repayment-payoff` | `TITLE_TOO_LONG` | metadata + schema + intro guide cleanup | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Credit Card Minimum Payment Calculator | `/credit-card-calculators/credit-card-minimum-payment-calculator/` | `credit-cards` | `credit-card-minimum-payment` | `TITLE_TOO_LONG` | metadata + schema + intro guide cleanup | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Balance Transfer Credit Card Calculator | `/credit-card-calculators/balance-transfer-credit-card-calculator/` | `credit-cards` | `balance-transfer-installment-plan` | `TITLE_TOO_LONG` | metadata + schema + intro guide cleanup | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Credit Card Consolidation Calculator | `/credit-card-calculators/credit-card-consolidation-calculator/` | `credit-cards` | `credit-card-consolidation` | `TITLE_TOO_LONG` | metadata + schema + intro guide cleanup | SEO + schema + mojibake + content quality | complete (`content quality: pass`) |

## Car Loans Checklist

| Calculator | Route | CLUSTER | CALC | SEO Issues | Content Scope | Verification | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Car Loan Calculator | `/car-loan-calculators/car-loan-calculator/` | `loans` | `car-loan` | `TITLE_TOO_LONG`; `LOW_WORD_COUNT` | metadata + schema + guide + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Auto Loan Comparison Calculator | `/car-loan-calculators/auto-loan-calculator/` | `loans` | `multiple-car-loan` | `TITLE_TOO_LONG` | metadata + schema + guide + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Hire Purchase Calculator | `/car-loan-calculators/hire-purchase-calculator/` | `loans` | `hire-purchase` | `TITLE_TOO_LONG` | metadata + schema + guide + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| PCP Calculator | `/car-loan-calculators/pcp-calculator/` | `loans` | `pcp-calculator` | `TITLE_TOO_LONG` | metadata + schema + guide + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Car Lease Calculator | `/car-loan-calculators/car-lease-calculator/` | `loans` | `leasing-calculator` | `TITLE_TOO_LONG` | metadata + schema + guide + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |

## Finance Checklist

| Calculator | Route | CLUSTER | CALC | SEO Issues | Content Scope | Verification | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Present Value Calculator | `/finance-calculators/present-value-calculator/` | `finance` | `present-value` | `DESC_TOO_SHORT` | metadata + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Future Value Calculator | `/finance-calculators/future-value-calculator/` | `finance` | `future-value` | `DESC_TOO_SHORT` | metadata + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Present Value of Annuity Calculator | `/finance-calculators/present-value-of-annuity-calculator/` | `finance` | `present-value-of-annuity` | `TITLE_TOO_LONG` | metadata + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Future Value of Annuity Calculator | `/finance-calculators/future-value-of-annuity-calculator/` | `finance` | `future-value-of-annuity` | `TITLE_TOO_LONG` | metadata + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Simple Interest Calculator | `/finance-calculators/simple-interest-calculator/` | `finance` | `simple-interest` | baseline review | metadata + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Compound Interest Calculator | `/finance-calculators/compound-interest-calculator/` | `finance` | `compound-interest` | `DESC_TOO_LONG` | metadata + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Effective Annual Rate Calculator | `/finance-calculators/effective-annual-rate-calculator/` | `finance` | `effective-annual-rate` | baseline review | metadata + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Investment Growth Calculator | `/finance-calculators/investment-growth-calculator/` | `finance` | `investment-growth` | `DESC_TOO_LONG` | metadata + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Investment Return Calculator | `/finance-calculators/investment-return-calculator/` | `finance` | `investment-return` | `TITLE_TOO_LONG` | metadata + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Time to Savings Goal Calculator | `/finance-calculators/time-to-savings-goal-calculator/` | `finance` | `time-to-savings-goal` | baseline review | metadata + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Monthly Savings Needed Calculator | `/finance-calculators/monthly-savings-needed-calculator/` | `finance` | `monthly-savings-needed` | `TITLE_TOO_LONG`; `DESC_TOO_LONG` | metadata + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |

## Future Category Queue

## Time & Date Checklist

| Calculator | Route | CLUSTER | CALC | SEO Issues | Content Scope | Verification | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Birthday Day-of-Week Calculator | `/time-and-date/birthday-day-of-week/` | `time-and-date` | `birthday-day-of-week` | `MISSING_JSONLD` | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Countdown Timer Generator | `/time-and-date/countdown-timer-generator/` | `time-and-date` | `countdown-timer-generator` | `TITLE_TOO_LONG`; `DESC_TOO_LONG`; `MISSING_JSONLD` | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Days Until a Date Calculator | `/time-and-date/days-until-a-date-calculator/` | `time-and-date` | `days-until-a-date-calculator` | `TITLE_TOO_LONG`; `DESC_TOO_LONG`; `LOW_WORD_COUNT` | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Age Calculator | `/time-and-date/age-calculator/` | `time-and-date` | `age-calculator` | baseline review | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Work Hours Calculator | `/time-and-date/work-hours-calculator/` | `time-and-date` | `work-hours-calculator` | baseline review | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Overtime Hours Calculator | `/time-and-date/overtime-hours-calculator/` | `time-and-date` | `overtime-hours-calculator` | `TITLE_TOO_LONG`; `DESC_TOO_LONG` | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Time Between Two Dates Calculator | `/time-and-date/time-between-two-dates-calculator/` | `time-and-date` | `time-between-two-dates-calculator` | `TITLE_TOO_LONG`; `DESC_TOO_LONG` | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Sleep Time Calculator | `/time-and-date/sleep-time-calculator/` | `sleep-and-nap` | `sleep-time-calculator` | `DESC_TOO_LONG` | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Wake-Up Time Calculator | `/time-and-date/wake-up-time-calculator/` | `sleep-and-nap` | `wake-up-time-calculator` | `TITLE_TOO_LONG`; `DESC_TOO_LONG` | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Nap Time Calculator | `/time-and-date/nap-time-calculator/` | `sleep-and-nap` | `nap-time-calculator` | baseline review | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Power Nap Calculator | `/time-and-date/power-nap-calculator/` | `sleep-and-nap` | `power-nap-calculator` | `DESC_TOO_LONG` | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Energy-Based Nap Selector | `/time-and-date/energy-based-nap-selector/` | `sleep-and-nap` | `energy-based-nap-selector` | `TITLE_TOO_LONG`; `DESC_TOO_LONG`; `MISSING_JSONLD` | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |

### Finance

- `future-value`
- `present-value`
- `compound-interest`
- `investment-growth`
- `investment-return`
- `future-value-of-annuity`
- `present-value-of-annuity`
- `monthly-savings-needed`
- `effective-annual-rate`
- `simple-interest`
- `time-to-savings-goal`

### Time & Date

- `time-and-date`: `birthday-day-of-week`, `countdown-timer-generator`,
  `days-until-a-date-calculator`, `age-calculator`, `work-hours-calculator`,
  `overtime-hours-calculator`, `time-between-two-dates-calculator`
- `sleep-and-nap`: `sleep-time-calculator`, `wake-up-time-calculator`,
  `nap-time-calculator`, `power-nap-calculator`, `energy-based-nap-selector`

### Percentage

- Fix nav/path mismatch first for `percent-change`
- Current repo routing note: `commission-calculator`, `discount-calculator`, `margin-calculator`, and `markup-calculator` now live under the `pricing` cluster at `/pricing-calculators/...`
- Then execute:
  - `percent-change`
  - `what-percent-is-x-of-y`
  - `percentage-of-a-number`
  - `reverse-percentage`
  - `percent-to-fraction-decimal`
  - `percentage-difference`
  - `percentage-increase`
  - `percentage-decrease`
  - `percentage-composition`

## Percentage Checklist

| Calculator | Route | CLUSTER | CALC | SEO Issues | Content Scope | Verification | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Percent Change Calculator | `/percentage-calculators/percent-change-calculator/` | `percentage` | `percent-change` | route mismatch cleanup | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality + nav/contracts | complete (`content quality: warn`) |
| Discount Calculator | `/pricing-calculators/discount-calculator/` | `pricing` | `discount-calculator` | `DESC_TOO_LONG` | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`moved from percentage cluster`) |
| Markup Calculator | `/pricing-calculators/markup-calculator/` | `pricing` | `markup-calculator` | `DESC_TOO_LONG` | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`moved from percentage cluster`) |
| What Percent Is X of Y | `/percentage-calculators/percentage-finder-calculator/` | `percentage` | `what-percent-is-x-of-y` | `TITLE_TOO_LONG`; `DESC_TOO_LONG`; `LOW_WORD_COUNT` | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Find Percentage of a Number | `/percentage-calculators/percentage-of-a-number-calculator/` | `percentage` | `percentage-of-a-number` | `DESC_TOO_SHORT` | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Reverse Percentage Calculator | `/percentage-calculators/reverse-percentage-calculator/` | `percentage` | `reverse-percentage` | `DESC_TOO_LONG` | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Commission Calculator | `/pricing-calculators/commission-calculator/` | `pricing` | `commission-calculator` | baseline review | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`moved from percentage cluster`) |
| Margin Calculator | `/pricing-calculators/margin-calculator/` | `pricing` | `margin-calculator` | baseline review | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`moved from percentage cluster`) |
| Percent to Fraction/Decimal | `/percentage-calculators/percent-to-fraction-decimal-calculator/` | `percentage` | `percent-to-fraction-decimal` | baseline review | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Percentage Difference Calculator | `/percentage-calculators/percentage-difference-calculator/` | `percentage` | `percentage-difference` | baseline review | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Percentage Increase Calculator | `/percentage-calculators/percentage-increase-calculator/` | `percentage` | `percentage-increase` | baseline review | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Percentage Decrease Calculator | `/percentage-calculators/percentage-decrease-calculator/` | `percentage` | `percentage-decrease` | baseline review | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |
| Percentage Composition Calculator | `/percentage-calculators/percentage-composition-calculator/` | `percentage` | `percentage-composition` | baseline review | metadata + schema + intro guide cleanup + notes | SEO + schema + mojibake + content quality | complete (`content quality: warn`) |

### Loans

- `personal-loan`
- `home-loan`
- `loan-to-value`
- `interest-rate-change-calculator`
- `how-much-can-i-borrow`
- `remortgage-switching`
- `buy-to-let`
- `offset-calculator`

## Final Stress Test

- Required capability: `npm run test:cwv:non-math`
- Purpose: run the CWV normal + stress guard across non-math calculators only
- Report target: `test-results/performance/cls-guard-non-math-calculators.json`

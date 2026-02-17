# REL-20260217-001 Status Update (2026-02-17)

## Scope Completed In This Pass
- Loans contract recovery for:
  - `/loans/how-much-can-i-borrow/`
  - `/loans/remortgage-switching/`
- Loans-first isolation plumbing and asset-manifest driven includes.
- ISS visual baseline reconciliation (`iss-design-001`, `iss-nav-top-001`).

## What Happened
1. Loans contract failures were fixed:
   - `how-much-can-i-borrow` method toggle/UI/state + scenario table behavior corrected.
   - `remortgage-switching` required horizon ticks, summary text, validation wording, and title alignment corrected.
2. Shared/route CSS loading was adjusted:
   - Route bundle generation and page generation were updated to reduce cross-route coupling and remove duplicate route CSS include paths.
   - Critical CSS generation was tuned, then corrected to keep shell-critical rules available for isolated loans pages.
3. ISS regressions were resolved:
   - Layout stability tests now pass.
   - Visual snapshots were rebaselined to intended current UI.
   - `iss-nav-top-001` contract was aligned with current top-nav DOM and baseline regenerated.
4. LCP validator reliability was corrected:
   - Invalid `NO_LCP`/null values no longer pass as `0ms`.
   - Budget validation now strictly requires real LCP values.

## Current Test Status
- `tests_specs/loans/e2e/how-much-can-borrow.spec.js` -> PASS
- `tests_specs/loans/e2e/remortgage-switching.spec.js` -> PASS
- `tests_specs/loans/e2e/remortgage-switching-logic.spec.js` -> PASS
- `npm run test:iss001` -> PASS
- `npx playwright test tests_specs/infrastructure/e2e/iss/iss-nav-top-001.spec.js` -> PASS
- `npm run test:lcp:loans` -> FAIL
  - Latest report: `test-results/performance/lcp-budgets-loans.json`
  - Failures: `20` profile failures (mostly desktop, plus some mobile credit-card/leasing routes).

## Remaining LCP Fail List (Latest)
- `/loans/how-much-can-i-borrow/` desktop
- `/loans/remortgage-switching/` desktop
- `/loans/buy-to-let/` desktop
- `/loans/offset-calculator/` desktop
- `/loans/interest-rate-change-calculator/` desktop
- `/loans/loan-to-value/` desktop
- `/loans/credit-card-repayment-payoff/` desktop + mobile
- `/loans/credit-card-minimum-payment/` desktop + mobile
- `/loans/balance-transfer-installment-plan/` desktop + mobile
- `/loans/credit-card-consolidation/` desktop + mobile
- `/loans/car-loan/` desktop
- `/loans/multiple-car-loan/` desktop
- `/loans/hire-purchase/` desktop
- `/loans/pcp-calculator/` desktop
- `/loans/leasing-calculator/` desktop + mobile

## Why The Release Is Not Ready
- Hard gate target is LCP `<= 2.5s` on both desktop and mobile for Loans routes.
- Current verified result breaches this on 20 route/profile checks.

## What Needs To Be Done Next
1. Desktop-first LCP reduction pass for Loans:
   - Trim top-nav/left-nav above-fold CSS and effects in initial critical path.
   - Reduce first-view DOM/CSS cost for calculator+explanation shell.
2. Credit-card + leasing mobile route optimization:
   - Route-level critical CSS minimization and non-critical defer tightening.
3. Re-run hard gates after each optimization batch:
   - `npm run test:lcp:loans`
   - `npm run test:iss001`
   - targeted loans e2e contracts
4. Update release signoff once LCP hard gate is green.

## Files Most Relevant To The Remaining Work
- `scripts/build-route-css-bundles.mjs`
- `scripts/generate-mpa-pages.js`
- `public/assets/css/core-shell.css`
- `public/assets/css/calculator.css`
- `public/assets/css/shared-calculator-ui.css`
- `public/config/asset-manifest.json`
- `scripts/validate-lcp-budgets.mjs`
- `scripts/lighthouse-target.mjs`

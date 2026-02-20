# Beacon Injection Audit Report

## Status Update - 2026-02-20 (REL-20260220-003)

- Action: Manual Cloudflare beacon include was **commented out (not removed)** across all currently detected beacon-bearing pages.
- Scope:
  - `public/**/index.html`: 108 files
  - `scripts/generate-mpa-pages.js`: 4 template insertion points updated to commented form
- Comment marker used:
  - `Cloudflare Web Analytics (manual beacon commented out for duplicate-beacon validation)`
- Validation:
  - 5-page random smoke check PASS
  - Verified no active `beacon.min.js` script after stripping HTML comments in sampled pages
- Governance evidence:
  - `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-20260220-003.md`
  - `requirements/universal-rules/Release Sign-Off Master Table.md`

- Audit date: 2026-02-19
- Repository: `calchowmuch`
- Build command used: `node scripts/generate-mpa-pages.js --all`

## Phase 1 - Static Repo Sweep

Queries audited:
- `static.cloudflareinsights.com/beacon.min.js`
- `data-cf-beacon`
- `48a13a09273b431a9628e50a21b15b57`
- `3aa03e0b39c54f8a8c3553a6b682091c`

### Classification

| File | Line | Token | Classification |
|---|---:|---|---|
| `scripts/generate-mpa-pages.js` | 1803 | `3aa03e0b39c54f8a8c3553a6b682091c` | template include + manual head include |
| `scripts/generate-mpa-pages.js` | 1875 | `3aa03e0b39c54f8a8c3553a6b682091c` | template include + manual head include |
| `scripts/generate-mpa-pages.js` | 1903 | `3aa03e0b39c54f8a8c3553a6b682091c` | template include + manual head include |
| `public/loans/how-much-can-borrow/index.html` | 18-19 | `3aa03e0b39c54f8a8c3553a6b682091c` | page-level include + manual head include |
| repo-wide search | - | `48a13a09273b431a9628e50a21b15b57` | not found in repo |

### Matched files (all repo matches for sweep queries)

```text
compliance/lighthouse-pilot/finance-future-value-of-annuity.json
compliance/lighthouse-pilot/finance-future-value.json
compliance/lighthouse-pilot/finance-present-value-of-annuity.json
compliance/lighthouse-pilot/finance-present-value.json
public/calculators/index.html
public/car-loan-calculators/auto-loan-calculator/index.html
public/car-loan-calculators/car-lease-calculator/index.html
public/car-loan-calculators/car-loan-calculator/index.html
public/car-loan-calculators/hire-purchase-calculator/index.html
public/car-loan-calculators/pcp-calculator/index.html
public/credit-card-calculators/balance-transfer-credit-card-calculator/index.html
public/credit-card-calculators/credit-card-consolidation-calculator/index.html
public/credit-card-calculators/credit-card-minimum-payment-calculator/index.html
public/credit-card-calculators/credit-card-payment-calculator/index.html
public/finance-calculators/compound-interest-calculator/index.html
public/finance-calculators/effective-annual-rate-calculator/index.html
public/finance-calculators/future-value-calculator/index.html
public/finance-calculators/future-value-of-annuity-calculator/index.html
public/finance-calculators/investment-growth-calculator/index.html
public/finance-calculators/monthly-savings-needed-calculator/index.html
public/finance-calculators/present-value-calculator/index.html
public/finance-calculators/present-value-of-annuity-calculator/index.html
public/finance-calculators/simple-interest-calculator/index.html
public/finance-calculators/time-to-savings-goal-calculator/index.html
public/index.html
public/loan-calculators/buy-to-let-mortgage-calculator/index.html
public/loan-calculators/how-much-can-i-borrow/index.html
public/loan-calculators/interest-rate-change-calculator/index.html
public/loan-calculators/ltv-calculator/index.html
public/loan-calculators/mortgage-calculator/index.html
public/loan-calculators/offset-mortgage-calculator/index.html
public/loan-calculators/remortgage-calculator/index.html
public/loans/balance-transfer-installment-plan/index.html
public/loans/buy-to-let/index.html
public/loans/car-loan/index.html
public/loans/credit-card-consolidation/index.html
public/loans/credit-card-minimum-payment/index.html
public/loans/credit-card-repayment-payoff/index.html
public/loans/hire-purchase/index.html
public/loans/home-loan/index.html
public/loans/how-much-can-borrow/index.html
public/loans/how-much-can-i-borrow/index.html
public/loans/interest-rate-change-calculator/index.html
public/loans/leasing-calculator/index.html
public/loans/loan-to-value/index.html
public/loans/multiple-car-loan/index.html
public/loans/offset-calculator/index.html
public/loans/pcp-calculator/index.html
public/loans/remortgage-switching/index.html
public/math/algebra/factoring/index.html
public/math/algebra/polynomial-operations/index.html
public/math/algebra/quadratic-equation/index.html
public/math/algebra/slope-distance/index.html
public/math/algebra/system-of-equations/index.html
public/math/basic/index.html
public/math/calculus/critical-points/index.html
public/math/calculus/derivative/index.html
public/math/calculus/integral/index.html
public/math/calculus/limit/index.html
public/math/calculus/series-convergence/index.html
public/math/confidence-interval/index.html
public/math/fraction-calculator/index.html
public/math/log/common-log/index.html
public/math/log/exponential-equations/index.html
public/math/log/log-properties/index.html
public/math/log/log-scale/index.html
public/math/log/natural-log/index.html
public/math/mean-median-mode-range/index.html
public/math/number-sequence/index.html
public/math/percentage-increase/index.html
public/math/permutation-combination/index.html
public/math/probability/index.html
public/math/sample-size/index.html
public/math/standard-deviation/index.html
public/math/statistics/anova/index.html
public/math/statistics/correlation/index.html
public/math/statistics/distribution/index.html
public/math/statistics/hypothesis-testing/index.html
public/math/statistics/index.html
public/math/statistics/regression-analysis/index.html
public/math/trigonometry/inverse-trig/index.html
public/math/trigonometry/law-of-sines-cosines/index.html
public/math/trigonometry/triangle-solver/index.html
public/math/trigonometry/trig-functions/index.html
public/math/trigonometry/unit-circle/index.html
public/math/z-score/index.html
public/percentage-calculators/commission-calculator/index.html
public/percentage-calculators/discount-calculator/index.html
public/percentage-calculators/margin-calculator/index.html
public/percentage-calculators/markup-calculator/index.html
public/percentage-calculators/percent-change-calculator/index.html
public/percentage-calculators/percent-to-fraction-decimal-calculator/index.html
public/percentage-calculators/percentage-composition-calculator/index.html
public/percentage-calculators/percentage-decrease-calculator/index.html
public/percentage-calculators/percentage-difference-calculator/index.html
public/percentage-calculators/percentage-finder-calculator/index.html
public/percentage-calculators/percentage-increase-calculator/index.html
public/percentage-calculators/percentage-of-a-number-calculator/index.html
public/percentage-calculators/reverse-percentage-calculator/index.html
public/sitemap/index.html
public/time-and-date/age-calculator/index.html
public/time-and-date/birthday-day-of-week/index.html
public/time-and-date/countdown-timer-generator/index.html
public/time-and-date/days-until-a-date-calculator/index.html
public/time-and-date/energy-based-nap-selector/index.html
public/time-and-date/nap-time-calculator/index.html
public/time-and-date/overtime-hours-calculator/index.html
public/time-and-date/power-nap-calculator/index.html
public/time-and-date/sleep-time-calculator/index.html
public/time-and-date/time-between-two-dates-calculator/index.html
public/time-and-date/wake-up-time-calculator/index.html
public/time-and-date/work-hours-calculator/index.html
scripts/generate-mpa-pages.js
```

### Raw match lines (file:line)

```text
scripts/generate-mpa-pages.js:1803:${structuredDataScript}${adsenseHeadScript}    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
scripts/generate-mpa-pages.js:1875:${adsenseHeadScript}    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
scripts/generate-mpa-pages.js:1903:  return `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <title>${title}</title>\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <meta name="description" content="${description}" />\n    <link rel="canonical" href="${canonical}" />\n    <meta name="robots" content="index,follow" />\n    <link rel="stylesheet" href="/assets/css/theme-premium-dark.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/base.css?v=${CSS_VERSION}" />\n    <link rel="stylesheet" href="/assets/css/gtep.css?v=${GTEP_CSS_VERSION}" />\n${adsenseHeadScript}    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->\n  </head>\n  <body class="gtep-body">\n    <div class="gtep-page">\n      <header class="gtep-header">\n        <span class="gtep-header-title">Calculate How Much</span>\n      </header>\n      <main class="gtep-main">\n        <div class="gtep-content">\n          ${bodyHtml}\n        </div>\n      </main>\n      ${buildGtepFooter()}\n    </div>\n  </body>\n</html>`;
compliance/lighthouse-pilot/finance-present-value.json:926:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-present-value.json:1816:                  "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-present-value.json:2685:            "name": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-present-value.json:3827:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-present-value.json:3921:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-present-value.json:5012:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-present-value.json:5749:                  "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-future-value.json:921:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-future-value.json:1807:                  "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-future-value.json:2676:            "name": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-future-value.json:3818:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-future-value.json:3912:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-future-value.json:5012:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-future-value.json:5774:                  "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-future-value-of-annuity.json:917:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-future-value-of-annuity.json:1807:                  "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-future-value-of-annuity.json:2853:            "name": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-future-value-of-annuity.json:3995:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-future-value-of-annuity.json:4089:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-future-value-of-annuity.json:5177:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-future-value-of-annuity.json:5938:                  "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-present-value-of-annuity.json:917:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-present-value-of-annuity.json:1819:                  "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-present-value-of-annuity.json:2780:            "name": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-present-value-of-annuity.json:3922:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-present-value-of-annuity.json:4016:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-present-value-of-annuity.json:5116:            "url": "https://static.cloudflareinsights.com/beacon.min.js",
compliance/lighthouse-pilot/finance-present-value-of-annuity.json:5905:                  "url": "https://static.cloudflareinsights.com/beacon.min.js",
public/credit-card-calculators/credit-card-minimum-payment-calculator/index.html:2142:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/credit-card-calculators/balance-transfer-credit-card-calculator/index.html:2143:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loan-calculators/ltv-calculator/index.html:1783:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/credit-card-calculators/credit-card-consolidation-calculator/index.html:2191:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loan-calculators/mortgage-calculator/index.html:26:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/credit-card-calculators/credit-card-payment-calculator/index.html:2186:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/sitemap/index.html:13:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loan-calculators/how-much-can-i-borrow/index.html:1723:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loan-calculators/remortgage-calculator/index.html:1732:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/time-and-date/age-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/time-and-date/time-between-two-dates-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loan-calculators/offset-mortgage-calculator/index.html:1771:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/time-and-date/power-nap-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loan-calculators/buy-to-let-mortgage-calculator/index.html:1742:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/time-and-date/energy-based-nap-selector/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loan-calculators/interest-rate-change-calculator/index.html:1771:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/time-and-date/countdown-timer-generator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/time-and-date/birthday-day-of-week/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/time-and-date/sleep-time-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/sample-size/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/car-loan-calculators/hire-purchase-calculator/index.html:1689:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/time-and-date/overtime-hours-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/time-and-date/days-until-a-date-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/car-loan-calculators/car-loan-calculator/index.html:1689:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/number-sequence/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/credit-card-repayment-payoff/index.html:2186:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/time-and-date/wake-up-time-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/car-loan-calculators/auto-loan-calculator/index.html:1689:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/confidence-interval/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/time-and-date/nap-time-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/how-much-can-i-borrow/index.html:26:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/car-loan-calculators/car-lease-calculator/index.html:1708:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/time-and-date/work-hours-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/loan-to-value/index.html:26:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/car-loan-calculators/pcp-calculator/index.html:1708:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/algebra/quadratic-equation/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/percentage-increase/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/algebra/polynomial-operations/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/balance-transfer-installment-plan/index.html:2143:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/log/exponential-equations/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/basic/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/standard-deviation/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/log/log-properties/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/fraction-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/home-loan/index.html:26:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/algebra/slope-distance/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/log/natural-log/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/trigonometry/unit-circle/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/calculus/derivative/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/log/common-log/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/algebra/system-of-equations/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/leasing-calculator/index.html:1708:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/finance-calculators/investment-growth-calculator/index.html:2180:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/statistics/distribution/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/trigonometry/trig-functions/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/calculus/critical-points/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/log/log-scale/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/algebra/factoring/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/statistics/regression-analysis/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/finance-calculators/present-value-of-annuity-calculator/index.html:2169:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/hire-purchase/index.html:1689:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/trigonometry/inverse-trig/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/statistics/anova/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/probability/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/calculus/series-convergence/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/finance-calculators/monthly-savings-needed-calculator/index.html:2162:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/car-loan/index.html:1689:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/remortgage-switching/index.html:26:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/mean-median-mode-range/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/statistics/correlation/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/trigonometry/triangle-solver/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/calculus/integral/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/finance-calculators/compound-interest-calculator/index.html:2162:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/finance-calculators/future-value-calculator/index.html:2169:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/how-much-can-borrow/index.html:18:      src="https://static.cloudflareinsights.com/beacon.min.js"
public/loans/how-much-can-borrow/index.html:19:      data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'
public/loans/buy-to-let/index.html:26:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/calculus/limit/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/trigonometry/law-of-sines-cosines/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/statistics/hypothesis-testing/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/pcp-calculator/index.html:1708:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/finance-calculators/simple-interest-calculator/index.html:2162:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/statistics/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/finance-calculators/time-to-savings-goal-calculator/index.html:2162:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/interest-rate-change-calculator/index.html:26:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/permutation-combination/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/offset-calculator/index.html:26:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/multiple-car-loan/index.html:1689:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/credit-card-minimum-payment/index.html:2142:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/math/z-score/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/finance-calculators/future-value-of-annuity-calculator/index.html:2169:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/finance-calculators/effective-annual-rate-calculator/index.html:2162:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/finance-calculators/present-value-calculator/index.html:2169:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/loans/credit-card-consolidation/index.html:2191:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/calculators/index.html:17:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/percentage-calculators/percentage-decrease-calculator/index.html:3935:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/percentage-calculators/discount-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/percentage-calculators/commission-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/percentage-calculators/percent-to-fraction-decimal-calculator/index.html:3930:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/percentage-calculators/margin-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/percentage-calculators/percent-change-calculator/index.html:3849:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/percentage-calculators/markup-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/percentage-calculators/percentage-difference-calculator/index.html:3851:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/percentage-calculators/percentage-finder-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/percentage-calculators/percentage-composition-calculator/index.html:4014:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/percentage-calculators/reverse-percentage-calculator/index.html:2372:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/percentage-calculators/percentage-of-a-number-calculator/index.html:25:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
public/percentage-calculators/percentage-increase-calculator/index.html:3935:    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "3aa03e0b39c54f8a8c3553a6b682091c"}'></script><!-- End Cloudflare Web Analytics -->
```

## Phase 2 - Built Output Verification

- Built output scanned: generated `public/**/index.html` excluding `public/calculators/**` source fragments.
- Result summary: `112` pages scanned, `0` duplicates, `0` unknown-source token pages.

| page | beacon_count | tokens_found | status |
|---|---:|---|---|
| `/car-loan-calculators/auto-loan-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/car-loan-calculators/car-lease-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/car-loan-calculators/car-loan-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/car-loan-calculators/hire-purchase-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/car-loan-calculators/pcp-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/contact-us/index.html` | 0 | `-` | OK |
| `/credit-card-calculators/balance-transfer-credit-card-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/credit-card-calculators/credit-card-consolidation-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/credit-card-calculators/credit-card-minimum-payment-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/credit-card-calculators/credit-card-payment-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/faq/index.html` | 0 | `-` | OK |
| `/faqs/index.html` | 0 | `-` | OK |
| `/finance-calculators/compound-interest-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/finance-calculators/effective-annual-rate-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/finance-calculators/future-value-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/finance-calculators/future-value-of-annuity-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/finance-calculators/investment-growth-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/finance-calculators/monthly-savings-needed-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/finance-calculators/present-value-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/finance-calculators/present-value-of-annuity-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/finance-calculators/simple-interest-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/finance-calculators/time-to-savings-goal-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loan-calculators/buy-to-let-mortgage-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loan-calculators/how-much-can-i-borrow/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loan-calculators/interest-rate-change-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loan-calculators/ltv-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loan-calculators/mortgage-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loan-calculators/offset-mortgage-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loan-calculators/remortgage-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/balance-transfer-installment-plan/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/buy-to-let/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/car-loan/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/credit-card-consolidation/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/credit-card-minimum-payment/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/credit-card-repayment-payoff/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/hire-purchase/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/home-loan/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/how-much-can-borrow/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/how-much-can-i-borrow/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/interest-rate-change-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/leasing-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/loan-to-value/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/multiple-car-loan/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/offset-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/pcp-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/loans/remortgage-switching/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/algebra/factoring/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/algebra/polynomial-operations/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/algebra/quadratic-equation/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/algebra/slope-distance/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/algebra/system-of-equations/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/basic/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/calculus/critical-points/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/calculus/derivative/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/calculus/integral/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/calculus/limit/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/calculus/series-convergence/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/confidence-interval/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/fraction-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/log/common-log/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/log/exponential-equations/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/log/log-properties/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/log/log-scale/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/log/natural-log/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/mean-median-mode-range/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/number-sequence/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/percentage-increase/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/permutation-combination/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/probability/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/sample-size/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/standard-deviation/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/statistics/anova/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/statistics/correlation/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/statistics/distribution/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/statistics/hypothesis-testing/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/statistics/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/statistics/regression-analysis/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/trigonometry/inverse-trig/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/trigonometry/law-of-sines-cosines/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/trigonometry/triangle-solver/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/trigonometry/trig-functions/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/trigonometry/unit-circle/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/math/z-score/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/percentage-calculators/commission-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/percentage-calculators/discount-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/percentage-calculators/margin-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/percentage-calculators/markup-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/percentage-calculators/percent-change-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/percentage-calculators/percent-to-fraction-decimal-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/percentage-calculators/percentage-composition-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/percentage-calculators/percentage-decrease-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/percentage-calculators/percentage-difference-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/percentage-calculators/percentage-finder-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/percentage-calculators/percentage-increase-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/percentage-calculators/percentage-of-a-number-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/percentage-calculators/reverse-percentage-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/privacy/index.html` | 0 | `-` | OK |
| `/sitemap/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/terms-and-conditions/index.html` | 0 | `-` | OK |
| `/time-and-date/age-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/time-and-date/birthday-day-of-week/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/time-and-date/countdown-timer-generator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/time-and-date/days-until-a-date-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/time-and-date/energy-based-nap-selector/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/time-and-date/nap-time-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/time-and-date/overtime-hours-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/time-and-date/power-nap-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/time-and-date/sleep-time-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/time-and-date/time-between-two-dates-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/time-and-date/wake-up-time-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |
| `/time-and-date/work-hours-calculator/index.html` | 1 | `3aa03e0b39c54f8a8c3553a6b682091c` | OK |

Status rules used:
- `OK`: exactly 1 beacon
- `DUPLICATE`: >1 beacon
- `UNKNOWN_SOURCE`: token exists in output but not found in repo sweep

## Live Environment Evidence (Diagnostic)

- Live source checked: `https://calchowmuch.com/sitemap.xml` (95 URLs crawled).
- Duplicate pages detected on live: `90`.
- Sample live duplicate evidence (both tokens in final HTML):
  - `https://calchowmuch.com/` -> tokens `3aa03e0b39c54f8a8c3553a6b682091c`, `48a13a09273b431a9628e50a21b15b57`
  - `https://calchowmuch.com/percentage-calculators/reverse-percentage-calculator/` -> tokens `3aa03e0b39c54f8a8c3553a6b682091c`, `48a13a09273b431a9628e50a21b15b57`
  - `https://calchowmuch.com/loan-calculators/mortgage-calculator/` -> tokens `3aa03e0b39c54f8a8c3553a6b682091c`, `48a13a09273b431a9628e50a21b15b57`

### Offending live pages (`DUPLICATE`)

```text
https://calchowmuch.com/
https://calchowmuch.com/calculators/
https://calchowmuch.com/privacy-policy/
https://calchowmuch.com/math/basic/
https://calchowmuch.com/percentage-calculators/percentage-increase-calculator/
https://calchowmuch.com/math/fraction-calculator/
https://calchowmuch.com/math/algebra/quadratic-equation/
https://calchowmuch.com/math/algebra/system-of-equations/
https://calchowmuch.com/math/algebra/polynomial-operations/
https://calchowmuch.com/math/algebra/factoring/
https://calchowmuch.com/math/algebra/slope-distance/
https://calchowmuch.com/math/trigonometry/unit-circle/
https://calchowmuch.com/math/trigonometry/triangle-solver/
https://calchowmuch.com/math/trigonometry/trig-functions/
https://calchowmuch.com/math/trigonometry/inverse-trig/
https://calchowmuch.com/math/trigonometry/law-of-sines-cosines/
https://calchowmuch.com/math/calculus/derivative/
https://calchowmuch.com/math/calculus/integral/
https://calchowmuch.com/math/calculus/limit/
https://calchowmuch.com/math/calculus/series-convergence/
https://calchowmuch.com/math/calculus/critical-points/
https://calchowmuch.com/math/log/natural-log/
https://calchowmuch.com/math/log/common-log/
https://calchowmuch.com/math/log/log-properties/
https://calchowmuch.com/math/log/exponential-equations/
https://calchowmuch.com/math/log/log-scale/
https://calchowmuch.com/math/mean-median-mode-range/
https://calchowmuch.com/math/standard-deviation/
https://calchowmuch.com/math/statistics/
https://calchowmuch.com/math/confidence-interval/
https://calchowmuch.com/math/z-score/
https://calchowmuch.com/math/sample-size/
https://calchowmuch.com/math/number-sequence/
https://calchowmuch.com/math/permutation-combination/
https://calchowmuch.com/math/probability/
https://calchowmuch.com/math/statistics/regression-analysis/
https://calchowmuch.com/math/statistics/anova/
https://calchowmuch.com/math/statistics/hypothesis-testing/
https://calchowmuch.com/math/statistics/correlation/
https://calchowmuch.com/math/statistics/distribution/
https://calchowmuch.com/loan-calculators/mortgage-calculator/
https://calchowmuch.com/loan-calculators/how-much-can-i-borrow/
https://calchowmuch.com/loan-calculators/remortgage-calculator/
https://calchowmuch.com/loan-calculators/buy-to-let-mortgage-calculator/
https://calchowmuch.com/loan-calculators/offset-mortgage-calculator/
https://calchowmuch.com/loan-calculators/interest-rate-change-calculator/
https://calchowmuch.com/loan-calculators/ltv-calculator/
https://calchowmuch.com/credit-card-calculators/credit-card-payment-calculator/
https://calchowmuch.com/credit-card-calculators/credit-card-minimum-payment-calculator/
https://calchowmuch.com/credit-card-calculators/balance-transfer-credit-card-calculator/
https://calchowmuch.com/credit-card-calculators/credit-card-consolidation-calculator/
https://calchowmuch.com/car-loan-calculators/car-loan-calculator/
https://calchowmuch.com/car-loan-calculators/auto-loan-calculator/
https://calchowmuch.com/car-loan-calculators/hire-purchase-calculator/
https://calchowmuch.com/car-loan-calculators/pcp-calculator/
https://calchowmuch.com/car-loan-calculators/car-lease-calculator/
https://calchowmuch.com/finance-calculators/present-value-calculator/
https://calchowmuch.com/finance-calculators/future-value-calculator/
https://calchowmuch.com/finance-calculators/present-value-of-annuity-calculator/
https://calchowmuch.com/finance-calculators/future-value-of-annuity-calculator/
https://calchowmuch.com/finance-calculators/simple-interest-calculator/
https://calchowmuch.com/finance-calculators/compound-interest-calculator/
https://calchowmuch.com/finance-calculators/effective-annual-rate-calculator/
https://calchowmuch.com/finance-calculators/investment-growth-calculator/
https://calchowmuch.com/finance-calculators/time-to-savings-goal-calculator/
https://calchowmuch.com/finance-calculators/monthly-savings-needed-calculator/
https://calchowmuch.com/time-and-date/sleep-time-calculator/
https://calchowmuch.com/time-and-date/wake-up-time-calculator/
https://calchowmuch.com/time-and-date/nap-time-calculator/
https://calchowmuch.com/time-and-date/power-nap-calculator/
https://calchowmuch.com/time-and-date/energy-based-nap-selector/
https://calchowmuch.com/time-and-date/work-hours-calculator/
https://calchowmuch.com/time-and-date/overtime-hours-calculator/
https://calchowmuch.com/time-and-date/time-between-two-dates-calculator/
https://calchowmuch.com/time-and-date/days-until-a-date-calculator/
https://calchowmuch.com/time-and-date/countdown-timer-generator/
https://calchowmuch.com/time-and-date/age-calculator/
https://calchowmuch.com/time-and-date/birthday-day-of-week/
https://calchowmuch.com/percentage-calculators/percent-change-calculator/
https://calchowmuch.com/percentage-calculators/percentage-difference-calculator/
https://calchowmuch.com/percentage-calculators/percentage-decrease-calculator/
https://calchowmuch.com/percentage-calculators/percentage-composition-calculator/
https://calchowmuch.com/percentage-calculators/reverse-percentage-calculator/
https://calchowmuch.com/percentage-calculators/percent-to-fraction-decimal-calculator/
https://calchowmuch.com/percentage-calculators/percentage-finder-calculator/
https://calchowmuch.com/percentage-calculators/percentage-of-a-number-calculator/
https://calchowmuch.com/percentage-calculators/commission-calculator/
https://calchowmuch.com/percentage-calculators/discount-calculator/
https://calchowmuch.com/percentage-calculators/margin-calculator/
https://calchowmuch.com/percentage-calculators/markup-calculator/
```

## Phase 3 - Root Cause Detection

- `48a13a09273b431a9628e50a21b15b57` is absent in repo source, but present in live final HTML.
- Classification: **Likely Cloudflare auto-injection**.
- Check path: `Cloudflare Dashboard -> Workers & Pages -> <Project> -> Metrics -> Web Analytics`.
- Do not remove code for `48a1...` in this repository unless the Cloudflare setting is changed first.

## Root Cause Summary

- Manual beacon `3aa03e0b39c54f8a8c3553a6b682091c` is injected by repository templates (`scripts/generate-mpa-pages.js`) and one explicit page-level include (`public/loans/how-much-can-borrow/index.html`).
- Second beacon `48a13a09273b431a9628e50a21b15b57` appears only after deployment in live HTML, consistent with Cloudflare Pages Web Analytics automatic injection.

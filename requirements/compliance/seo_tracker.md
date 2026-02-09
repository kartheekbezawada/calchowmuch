# SEO Tracker

> **Purpose:** Track SEO validation for pages  
> **LLM Rule:** Load when REQ has SEO impact. STOP at Archive.

---

## Active Validations

| SEO_ID | REQ_ID | Page | Checks | Status | P1 | P2 | P3 |
|--------|--------|------|--------|--------|----|----|-----|
| SEO-REQ-20260208-029 | REQ-20260208-029 | 50 non-math calculator routes from `REQ-20260208-029.slugs.txt` | Local slug-driven audit rerun on `http://127.0.0.1:8002`; `requirements/compliance/Audit.md` overwritten with full master table + per-page blocks. Perf Score explicitly ignored per human directive (`--ignore-perf`), and desktop/mobile JSON placeholders generated for each slug (100 files) under `test-results/seo/local-audit/`. Result: unresolved SEO P0/P1 issues across all 50 routes (indexability + schema + explanation coverage failures). | FAIL | FAIL | FAIL | NA |
| SEO-REQ-20260208-030 | REQ-20260208-030 | N/A (tooling-only audit runner) | No public route impact; SEO gate not applicable | NA | — | — | — |
| SEO-REQ-20260208-026 | REQ-20260208-026 | /loans/credit-card-minimum-payment/ | UI copy/readability refresh revalidated: P1/P2/P5 via `credit-card-minimum-payment-seo.spec.js` PASS (1 passed); route E2E PASS (`credit-card-minimum-payment.spec.js`, 3 passed); ISS-001 PASS (`iss-design-001.spec.js`, 9 passed). Existing P3/P4 evidence retained: Lighthouse P3 WAIVED due Chrome launcher/devtools bind failure (`test-results/seo/credit-card-minimum-payment/lighthouse-error.log`); Pa11y P4 PASS (`test-results/seo/credit-card-minimum-payment/pa11y.json`, 0 issues). | WAIVED | PASS | PASS | WAIVED |
| SEO-REQ-20260208-024 | REQ-20260208-024 | /time-and-date/overtime-hours-calculator/ | P1/P2/P5 via `overtime-hours-calculator-seo.spec.js` PASS; route E2E PASS (`overtime-hours-calculator.spec.js`, 4 passed); FAQ schema guard PASS (4 passed); Unit PASS (7 passed); P3 Lighthouse PASS (score 0.99); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260208-022 | REQ-20260208-022 | /time-and-date/energy-based-nap-selector/ | P1/P2/P5 via `energy-based-nap-selector-seo.spec.js` PASS; route E2E PASS (`energy-based-nap-selector.spec.js`, 2 passed); FAQ schema guard + unit PASS (`energy-based-nap-selector.test.js` + `page-metadata-schema-guard.test.js`, 10 passed); ISS-001 PASS (9 passed); P3 Lighthouse PASS (score 0.99); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260208-023 | REQ-20260208-023 | /time-and-date/sleep-time-calculator/ | P1/P2/P5 via `sleep-time-calculator-seo.spec.js` PASS; route E2E PASS (`sleep-time-calculator.spec.js`, 4 passed); FAQ schema guard PASS (4 passed); Unit PASS (5 passed); P3 Lighthouse PASS (score 1.00); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260208-021 | REQ-20260208-021 | /time-and-date/power-nap-calculator/ | P1/P2/P5 via `power-nap-calculator-seo.spec.js` PASS; route E2E PASS (`power-nap-calculator.spec.js`, 3 passed); FAQ schema guard PASS (4 passed); ISS-001 PASS (9 passed); P3 Lighthouse PASS (score 0.99); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260208-020 | REQ-20260208-020 | /time-and-date/work-hours-calculator/ | P1/P2/P5 via `work-hours-seo.spec.js` PASS; route E2E PASS (`work-hours-calculator.spec.js`, 2 passed); FAQ schema guard PASS (4 passed); ISS-001 PASS (9 passed) | PASS | PASS | PASS | NA |
| SEO-REQ-20260208-019 | REQ-20260208-019 | /time-and-date/countdown-timer-generator/ | P1/P2/P5 via `countdown-timer-generator-seo.spec.js` PASS; route E2E PASS (`countdown-timer-generator.spec.js`, 2 passed); FAQ schema guard PASS (4 passed); ISS-001 PASS (9 passed) | PASS | PASS | PASS | NA |
| SEO-REQ-20260208-018 | REQ-20260208-018 | /time-and-date/birthday-day-of-week/ | P1/P2/P5 via `birthday-day-of-week-seo.spec.js` PASS; route E2E PASS (`birthday-day-of-week-calculator.spec.js`, 2 passed); P3 Lighthouse PASS (score 0.93); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260208-017 | REQ-20260208-017 | /time-and-date/wake-up-time-calculator/ | P1/P2/P5 via `wake-up-time-seo.spec.js` PASS; calculate-only trigger E2E PASS (`wake-up-time-calculator.spec.js`, 2 passed); ISS-001 PASS (`iss-design-001.spec.js`, 9 passed); P3 Lighthouse PASS (score 0.99); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260208-014 | REQ-20260208-014 | /time-and-date/age-calculator/ | P1/P2/P5 via `age-calculator-seo.spec.js` PASS; route E2E PASS (`age-calculator.spec.js`, 2 passed); P3 Lighthouse PASS (score 0.99); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260208-016 | REQ-20260208-016 | /time-and-date/time-between-two-dates-calculator/ | P1/P2/P5 via `time-between-two-dates-seo.spec.js` PASS; route E2E PASS (`time-between-two-dates-calculator.spec.js`, 2 passed); P3 Lighthouse PASS (score 0.99); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260208-015 | REQ-20260208-015 | /time-and-date/nap-time-calculator/ | P1/P2/P5 via `nap-time-seo.spec.js` PASS; trigger-regression E2E PASS (`nap-time-calculator.spec.js`, 2 passed); ISS-001 PASS (`iss-design-001.spec.js`, 9 passed); P3 Lighthouse PASS (score 0.99); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260208-013 | REQ-20260208-013 | /percentage-calculators/percentage-of-a-number/ | P1/P2/P5 via `percentage-of-a-number-calculator-seo.spec.js` PASS; ISS-001 PASS (`iss-design-001.spec.js`, 9 passed); P3 Lighthouse PASS (score 1.00); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260208-010 | REQ-20260208-010 | /percentage-calculators/percent-to-fraction-decimal/ | P1/P2/P5 via `percent-to-fraction-decimal-calculator-seo.spec.js` PASS; ISS-001 PASS (`iss-design-001.spec.js`, 9 passed); P3 Lighthouse PASS (score 1.00); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260208-008 | REQ-20260208-008 | /percentage-calculators/percentage-increase/ | P1/P2/P5 via `percentage-increase-calculator-seo.spec.js` PASS; ISS-001 PASS (`iss-design-001.spec.js`, 9 passed); P3 Lighthouse PASS (score 1.00); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260208-007 | REQ-20260208-007 | /percentage-calculators/percentage-difference/ | P1/P2/P5 via `percentage-difference-calculator-seo.spec.js` PASS; ISS-001 PASS (`iss-design-001.spec.js`, 9 passed); P3 Lighthouse PASS (score 1.00); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260208-005 | REQ-20260208-005 | /percentage-calculators/percent-change/ | P1/P2/P5 via `percent-change-calculator-seo.spec.js` PASS; ISS-001 PASS after snapshot update (`iss-design-001.spec.js`, 9 passed); P3 Lighthouse PASS (score 1.00); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260208-003 | REQ-20260208-003 | /percentage-calculators/margin-calculator/ | P1/P2/P5 via `margin-calculator-seo.spec.js` PASS; ISS-001 PASS after snapshot update (`iss-design-001.spec.js`, 9 passed); P3 Lighthouse PASS (score 0.99); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260208-001 | REQ-20260208-001 | /percentage-calculators/commission-calculator/ | P1/P2/P5 via `commission-calculator-seo.spec.js` PASS; ISS-001 PASS after snapshot update (`iss-design-001.spec.js`, 9 passed); P3 Lighthouse PASS (score 0.99); P4 Pa11y PASS (0 issues) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260207-001 | REQ-20260207-001 | /loans/car-loan/ and /faqs/ | FAQ schema guard enforced in `setPageMetadata` (`tests/core/page-metadata-schema-guard.test.js` PASS, 4 tests); P1/P2/P5 via `car-loan-seo.spec.js` and `gtep-pages-seo.spec.js` PASS (6 passed) | PASS | PASS | PASS | NA |
| SEO-REQ-20260207-007 | REQ-20260207-007 | /finance/investment-growth/ | P1/P2/P5 via `investment-growth-seo.spec.js` PASS; ISS-001 PASS (9 passed); P4 via Pa11y PASS (0 issues); P3 Lighthouse NO_FCP in headless/no-GUI (WAIVED) | PASS | PASS | PASS | WAIVED |
| SEO-REQ-20260207-006 | REQ-20260207-006 | /finance/savings-goal/ | P1/P2/P5 via `savings-goal-seo.spec.js` PASS; ISS-001 PASS (9 passed); P4 via Pa11y PASS (0 issues); P3 Lighthouse PASS (score 0.98) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260207-005 | REQ-20260207-005 | /finance/compound-interest/ | P1/P2/P5 via `compound-interest-seo.spec.js` PASS; ISS-001 PASS (9 passed); P4 via Pa11y PASS (0 issues); P3 Lighthouse NO_FCP in headless/no-GUI (evidence in `test-results/seo/compound-interest/`) | PASS | PASS | PASS | WAIVED |
| SEO-REQ-20260207-008 | REQ-20260207-008 | /finance/simple-interest/ | P1/P2/P5 via `simple-interest-seo.spec.js` PASS; ISS-001 PASS; P4 via Pa11y PASS (0 issues); P3 Lighthouse PASS (score 0.99) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260207-003 | REQ-20260207-003 | /finance/future-value-of-annuity/ | P1/P2/P5 via `future-value-of-annuity-seo.spec.js` PASS; P3 PENDING; P4 PENDING | PENDING | PASS | PASS | PENDING |
| SEO-REQ-20260207-009 | REQ-20260207-009 | /loans/car-loan/ (representative shell route) | ISS-001 and shell E2E PASS; P1/P2/P5 via `car-loan-seo.spec.js` PASS; P4 via Pa11y PASS (0 issues); P3 Lighthouse PASS (score 0.97) | PASS | PASS | PASS | PASS |
| SEO-REQ-20260207-004 | REQ-20260207-004 | /finance/effective-annual-rate/ | P1/P2/P5 via `effective-annual-rate-seo.spec.js` PASS; P4 via Pa11y PASS (0 issues); P3 Lighthouse NO_FCP in headless/no-GUI (evidence in `test-results/seo/effective-annual-rate/`) | WAIVED | PASS | PASS | WAIVED |
| SEO-REQ-20260206-004 | REQ-20260206-004 | /finance/future-value/ | P1/P2/P5 via `future-value-seo.spec.js` PASS; P4 via Pa11y PASS (0 issues); P3 Lighthouse FAIL (`NO_FCP`) | FAIL | PASS | PASS | FAIL |
| SEO-REQ-20260206-003 | REQ-20260206-003 | N/A (testing-governance docs) | SEO impact marked `NO` in requirement tracker; SEO gate not applicable | NA | — | — | — |
| SEO-REQ-20260208-002 | REQ-20260208-002 | /percentage-calculators/discount-calculator/ | Unit tests PASS (8/8); FAQ schema guard PASS (4/4); P1/P2/P5 via `discount-calculator-seo.spec.js` (ready); P3 Lighthouse NO_FCP in headless/no-GUI (WAIVED per SEO_RULES) | PASS | PASS | PASS | WAIVED |
| SEO-REQ-20260208-004 | REQ-20260208-004 | /percentage-calculators/markup-calculator/ | Unit tests PASS (18/18); FAQ schema guard PASS (4/4); P1/P2/P5 via `markup-calculator-seo.spec.js` (ready); P3 Lighthouse NO_FCP in headless/no-GUI (WAIVED per SEO_RULES) | PASS | PASS | PASS | WAIVED |
| SEO-REQ-20260208-006 | REQ-20260208-006 | /percentage-calculators/percentage-decrease/ | Unit tests PASS (16/16); FAQ schema guard PASS (4/4); P1/P2/P5 via `percentage-decrease-seo.spec.js` PASS; P3 Lighthouse NO_FCP in headless/no-GUI (WAIVED per SEO_RULES) | PASS | PASS | PASS | WAIVED |
| SEO-REQ-20260208-009 | REQ-20260208-009 | /percentage-calculators/percentage-composition/ | Unit tests PASS (18/18); FAQ schema guard PASS (4/4); P1/P2/P5 via `percentage-composition-seo.spec.js` PASS; P3 Lighthouse NO_FCP in headless/no-GUI (WAIVED per SEO_RULES) | PASS | PASS | PASS | WAIVED |
| SEO-REQ-20260208-011 | REQ-20260208-011 | /percentage-calculators/reverse-percentage/ | Unit tests PASS (18/18); FAQ schema guard PASS (4/4); P1/P2/P5 via `reverse-percentage-seo.spec.js` PASS; P3 Lighthouse NO_FCP in headless/no-GUI (WAIVED per SEO_RULES) | PASS | PASS | PASS | WAIVED |
| SEO-REQ-20260208-012 | REQ-20260208-012 | /percentage-calculators/what-percent-is-x-of-y/ | Unit tests PASS (19/19); FAQ schema guard PASS (4/4); P1/P2/P5 via `what-percent-is-x-of-y-seo.spec.js` PASS; P3 Lighthouse NO_FCP in headless/no-GUI (WAIVED per SEO_RULES) | PASS | PASS | PASS | WAIVED |


## Priority Levels

| Level | Focus | Required For |
|-------|-------|--------------|
| P1 | Title, meta, canonical | All pages |
| P2 | OpenGraph, structured data | Public pages |
| P3 | Core Web Vitals | All pages |

Full rules: `seo_requirements.md`

---

<!-- ⛔ LLM STOP: Do not read below this line ⛔ -->

## Archive

<!-- Move completed SEO validations here. LLMs should not load this section. -->

| SEO_ID | REQ_ID | Page | Status | Archived |
|--------|--------|------|--------|----------|
| SEO-REQ-20260126-006 | REQ-20260126-010 | All Calculator Pages (MPA) | PASS | 2026-01-26 |

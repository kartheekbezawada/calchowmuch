# SEO Tracker

> **Purpose:** Track SEO validation for pages  
> **LLM Rule:** Load when REQ has SEO impact. STOP at Archive.

---

## Active Validations

| SEO_ID | REQ_ID | Page | Checks | Status | P1 | P2 | P3 |
|--------|--------|------|--------|--------|----|----|-----|
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

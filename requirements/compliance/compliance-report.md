# Compliance Report

> **Purpose:** Release gate — final verdict  
> **LLM Rule:** Read Active section only. STOP at Archive.

---

## Formula

```text
PASS = BUILD_PASS ∧ TEST_PASS ∧ SEO_OK ∧ ITERATIONS ≤ 25
```

---

## Active Checks

| REQ_ID | ITER_ID | Tests Required | Tests Run | Iterations | Verdict |
| ------ | ------- | -------------- | --------- | ---------- | ------- |
| REQ-20260208-026 | ITER-20260208-222056 | Credit card minimum payment UI copy + readability cleanup: pane title/label/note updates, scenario table removal, dynamic summary-value highlight chips, and plain-language floor wording | Lint (`npm run lint`); E2E (`credit-card-minimum-payment.spec.js`, 3 passed); SEO E2E (`credit-card-minimum-payment-seo.spec.js`, 1 passed); ISS-001 (`iss-design-001.spec.js`, 9 passed) | 1/25 | PASS |
| REQ-20260208-022 | ITER-20260208-195750 | New calculator Unit + route E2E + SEO-P1/P2/P5 + FAQ schema guard + ISS-001 + P3/P4 evidence | Lint (`npm run lint`); Unit (`energy-based-nap-selector.test.js` + `page-metadata-schema-guard.test.js`, 10 passed); E2E (`energy-based-nap-selector.spec.js`, 2 passed); SEO E2E (`energy-based-nap-selector-seo.spec.js`, 1 passed); ISS-001 (`iss-design-001.spec.js`, 9 passed); Lighthouse P3 PASS (`test-results/seo/energy-based-nap-selector/lighthouse-performance.json`); Pa11y P4 PASS (`test-results/seo/energy-based-nap-selector/pa11y.json`) | 1/25 | PASS |
| REQ-20260208-020 | ITER-20260208-194821 | Explanation pane standardization + SEO-P1/P2/P5 + FAQ schema guard + calculate-only route E2E + ISS-001 | Lint (`npm run lint`); FAQ guard (`page-metadata-schema-guard.test.js`, 4 passed); E2E (`work-hours-calculator.spec.js`, 2 passed); SEO E2E (`work-hours-seo.spec.js`, 1 passed); ISS-001 (`iss-design-001.spec.js`, 9 passed) | 1/25 | PASS |
| REQ-20260208-019 | ITER-20260208-194321 | SEO-P1/P2/P5 + FAQ schema guard + scoped route E2E + ISS-001 | Lint (`npm run lint`); FAQ guard (`page-metadata-schema-guard.test.js`, 4 passed); E2E (`countdown-timer-generator.spec.js`, 2 passed); SEO E2E (`countdown-timer-generator-seo.spec.js`, 1 passed); ISS-001 (`iss-design-001.spec.js`, 9 passed) | 1/25 | PASS |
| REQ-20260208-017 | ITER-20260208-193319 | Unit + FAQ schema guard + calculate-only E2E + SEO + ISS-001 + P3/P4 evidence | Lint (`npm run lint`); Unit (`wake-up-time-calculator.test.js` + `page-metadata-schema-guard.test.js`, 12 passed); E2E (`wake-up-time-calculator.spec.js`, 2 passed); SEO E2E (`wake-up-time-seo.spec.js`, 1 passed); ISS-001 (`iss-design-001.spec.js`, 9 passed); Lighthouse P3 PASS (`test-results/seo/wake-up-time-calculator/lighthouse-performance.json`); Pa11y P4 PASS (`test-results/seo/wake-up-time-calculator/pa11y.json`) | 1/25 | PASS |
| REQ-20260208-016 | ITER-20260208-192729 | SEO-P1/P2/P5 + FAQ schema guard + scoped route E2E + P3/P4 evidence | Lint (`npm run lint`); FAQ guard (`page-metadata-schema-guard.test.js`, 4 passed); E2E (`time-between-two-dates-calculator.spec.js`, 2 passed); SEO E2E (`time-between-two-dates-seo.spec.js`, 1 passed); Lighthouse P3 PASS (`test-results/seo/time-between-two-dates-calculator/lighthouse-performance.json`); Pa11y P4 PASS (`test-results/seo/time-between-two-dates-calculator/pa11y.json`) | 1/25 | PASS |
| REQ-20260208-015 | ITER-20260208-191901 | SEO-P1/P2/P5 + FAQ schema guard + route E2E trigger regression + ISS-001 + P3/P4 evidence | Lint (`npm run lint`); FAQ guard (`page-metadata-schema-guard.test.js`, 4 passed); E2E (`nap-time-calculator.spec.js`, 2 passed); SEO E2E (`nap-time-seo.spec.js`, 1 passed); ISS-001 (`iss-design-001.spec.js`, 9 passed); Lighthouse P3 PASS (`test-results/seo/nap-time-calculator/lighthouse-performance.json`); Pa11y P4 PASS (`test-results/seo/nap-time-calculator/pa11y.json`) | 1/25 | PASS |
| REQ-20260208-013 | ITER-20260207-231816 | Unit + FAQ schema guard + E2E + SEO + ISS-001 + P3/P4 evidence | Lint (`npm run lint`); Unit (`percentage-of-a-number-calculator.test.js`, 4 passed); FAQ guard (`page-metadata-schema-guard.test.js`, 4 passed); E2E (`percentage-of-a-number-calculator.spec.js`, 1 passed); SEO E2E (`percentage-of-a-number-calculator-seo.spec.js`, 1 passed); ISS-001 (`iss-design-001.spec.js`, 9 passed); Lighthouse P3 PASS (`test-results/seo/percentage-of-a-number/lighthouse-performance.json`); Pa11y P4 PASS (`test-results/seo/percentage-of-a-number/pa11y.json`) | 1/25 | PASS |
| REQ-20260208-010 | ITER-20260207-231035 | Unit + FAQ schema guard + E2E + SEO + ISS-001 + P3/P4 evidence | Lint (`npm run lint`); Unit (`percent-to-fraction-decimal-calculator.test.js`, 4 passed); FAQ guard (`page-metadata-schema-guard.test.js`, 4 passed); E2E (`percent-to-fraction-decimal-calculator.spec.js`, 1 passed); SEO E2E (`percent-to-fraction-decimal-calculator-seo.spec.js`, 1 passed); ISS-001 (`iss-design-001.spec.js`, 9 passed); Lighthouse P3 PASS (`test-results/seo/percent-to-fraction-decimal/lighthouse-performance.json`); Pa11y P4 PASS (`test-results/seo/percent-to-fraction-decimal/pa11y.json`) | 1/25 | PASS |
| REQ-20260208-008 | ITER-20260207-230036 | Unit + FAQ schema guard + E2E + SEO + ISS-001 + P3/P4 evidence | Lint (`npm run lint`); Unit (`percentage-increase-calculator.test.js`, 4 passed); FAQ guard (`page-metadata-schema-guard.test.js`, 4 passed); E2E (`percentage-increase-calculator.spec.js`, 1 passed); SEO E2E (`percentage-increase-calculator-seo.spec.js`, 1 passed); ISS-001 (`iss-design-001.spec.js`, 9 passed); Lighthouse P3 PASS (`test-results/seo/percentage-increase/lighthouse-performance.json`); Pa11y P4 PASS (`test-results/seo/percentage-increase/pa11y.json`) | 1/25 | PASS |
| REQ-20260208-007 | ITER-20260207-225318 | Unit + FAQ schema guard + E2E + SEO + ISS-001 + P3/P4 evidence | Lint (`npm run lint`); Unit (`percentage-difference-calculator.test.js`, 5 passed); FAQ guard (`page-metadata-schema-guard.test.js`, 4 passed); E2E (`percentage-difference-calculator.spec.js`, 2 passed); SEO E2E (`percentage-difference-calculator-seo.spec.js`, 1 passed); ISS-001 (`iss-design-001.spec.js`, 9 passed); Lighthouse P3 PASS (`test-results/seo/percentage-difference/lighthouse-performance.json`); Pa11y P4 PASS (`test-results/seo/percentage-difference/pa11y.json`) | 1/25 | PASS |
| REQ-20260208-005 | ITER-20260207-224953 | Unit + FAQ schema guard + E2E + SEO + ISS-001 + P3/P4 evidence | Lint (`npm run lint`); Unit (`percent-change-calculator.test.js`, 5 passed); FAQ guard (`page-metadata-schema-guard.test.js`, 4 passed); E2E (`percent-change-calculator.spec.js`, 1 passed); SEO E2E (`percent-change-calculator-seo.spec.js`, 1 passed); ISS-001 (`iss-design-001.spec.js`, 9 passed with snapshot updates); Lighthouse P3 PASS (`test-results/seo/percent-change/lighthouse-performance.json`); Pa11y P4 PASS (`test-results/seo/percent-change/pa11y.json`) | 1/25 | PASS |
| REQ-20260208-003 | ITER-20260207-223858 | Unit + FAQ schema guard + E2E + SEO + ISS-001 + P3/P4 evidence | Lint (`npm run lint`); Unit (`margin-calculator.test.js`, 5 passed); FAQ guard (`page-metadata-schema-guard.test.js`, 4 passed); E2E (`margin-calculator.spec.js`, 1 passed); SEO E2E (`margin-calculator-seo.spec.js`, 1 passed); ISS-001 (`iss-design-001.spec.js`, 9 passed with snapshot updates); Lighthouse P3 PASS (`test-results/seo/margin-calculator/lighthouse-performance.json`); Pa11y P4 PASS (`test-results/seo/margin-calculator/pa11y.json`) | 1/25 | PASS |
| REQ-20260208-001 | ITER-20260207-222403 | Unit + FAQ schema guard + E2E + SEO + ISS-001 + P3/P4 evidence | Lint (`npm run lint`); Unit (`commission-calculator.test.js`, 6 passed); FAQ guard (`page-metadata-schema-guard.test.js`, 4 passed); E2E (`commission-calculator.spec.js`, 1 passed); SEO E2E (`commission-calculator-seo.spec.js`, 1 passed); ISS-001 (`iss-design-001.spec.js`, 9 passed with snapshot updates); Lighthouse P3 PASS (`test-results/seo/commission-calculator/lighthouse-performance.json`); Pa11y P4 PASS (`test-results/seo/commission-calculator/pa11y.json`) | 1/25 | PASS |
| REQ-20260207-001 | ITER-20260207-215624 | SEO-P1 + SEO-P2 + FAQ schema isolation guard | Lint (`npm run lint`); Unit (`npx vitest run tests/core/page-metadata-schema-guard.test.js`, 4 passed); SEO E2E (`car-loan-seo.spec.js` + `gtep-pages-seo.spec.js`, 6 passed) | 1/25 | PASS |
| REQ-20260207-007 | ITER-20260207-130000 | Unit + E2E + SEO + ISS-001 + P3/P4 evidence | Unit (`npx vitest run tests/core/investment-growth-calculator.test.js`, 15 passed); E2E (`investment-growth-calculator.spec.js`, 1 passed); SEO E2E (`investment-growth-seo.spec.js`, 1 passed); ISS-001 (`npm run test:iss001`, 9 passed); Lighthouse P3 (NO_FCP, WAIVED); Pa11y P4 PASS (`test-results/seo/investment-growth/pa11y.json`) | 1/25 | PASS |
| REQ-20260207-006 | ITER-20260207-112035 | Unit + E2E + SEO + ISS-001 + P3/P4 evidence | Unit (`npx vitest run tests/core/savings-goal-calculator.test.js`, 5 passed); E2E (`savings-goal-calculator.spec.js`, 1 passed); SEO E2E (`savings-goal-seo.spec.js`, 1 passed); ISS-001 (`npm run test:iss001`, 9 passed); Lighthouse P3 PASS (`test-results/seo/savings-goal/lighthouse-performance.json`); Pa11y P4 PASS (`test-results/seo/savings-goal/pa11y.json`) | 11/25 | PASS |
| REQ-20260207-005 | ITER-20260207-120000 | Unit + E2E + SEO + ISS-001 + P3/P4 evidence | Unit (`npx vitest run tests/core/compound-interest-calculator.test.js`, 12 passed); E2E (`compound-interest-calculator.spec.js`, 1 passed); SEO E2E (`compound-interest-seo.spec.js`, 1 passed); ISS-001 (`npm run test:iss001`, 9 passed); Lighthouse P3 (NO_FCP, WAIVED); Pa11y P4 PASS (`test-results/seo/compound-interest/pa11y.json`) | 1/25 | PASS |
| REQ-20260207-008 | ITER-20260207-111221 | Unit + E2E + SEO + ISS-001 + P3/P4 evidence | Unit (`npx vitest run tests/core/simple-interest-calculator.test.js`, 5 passed); E2E (`simple-interest-calculator.spec.js`, 1 passed); SEO E2E (`simple-interest-seo.spec.js`, 1 passed); ISS-001 (`npm run test:iss001`, 9 passed); Lighthouse P3 PASS (`test-results/seo/simple-interest/lighthouse-performance.json`); Pa11y P4 PASS (`test-results/seo/simple-interest/pa11y.json`) | 11/25 | PASS |
| REQ-20260207-003 | ITER-20260207-111500 | Unit + E2E + SEO + ISS-001 + P3/P4 evidence | Unit (`npx vitest run tests/core/future-value-of-annuity-calculator.test.js`, 9 passed); E2E (`future-value-of-annuity-calculator.spec.js`, 1 passed); SEO E2E (`future-value-of-annuity-seo.spec.js`, 1 passed); ISS-001 (`npm run test:iss001`, 9 passed); P3 PENDING; P4 PENDING | 1/25 | PENDING |
| REQ-20260207-009 | ITER-20260207-105501 | ISS-001 + scoped E2E + SEO (P1/P2/P3/P4/P5) | ISS-001 (`iss-design-001.spec.js`, 9 passed with updated snapshots); E2E (`home-shell.spec.js`, 1 passed); SEO E2E (`car-loan-seo.spec.js`, 1 passed); Lighthouse P3 PASS (`test-results/seo/iss-001-shell/lighthouse-performance.json`); Pa11y P4 PASS (`test-results/seo/iss-001-shell/pa11y.json`) | 11/25 | PASS |
| REQ-20260207-004 | ITER-20260207-101227 | Unit + E2E + SEO + ISS-001 + P3/P4 evidence | Unit (`npx vitest run tests/core/effective-annual-rate-calculator.test.js`); E2E (`effective-annual-rate-calculator.spec.js`); SEO E2E (`effective-annual-rate-seo.spec.js`); ISS-001 (`npm run test:iss001`); P3 Lighthouse (NO_FCP, WAIVED); P4 Pa11y (`npx pa11y http://127.0.0.1:8002/finance/effective-annual-rate/ ...`) | 11/25 | PASS |
| REQ-20260206-003 | ITER-20260206-021115 | Unit + command-alignment verification | Unit (`npm run test`); E2E (`present-value-calculator.spec.js`); SEO E2E (`present-value-seo.spec.js`); ISS-001 + P3/P4 manual command runs executed as evidence (failures logged, non-blocking for docs-only REQ) | 1/25 | PASS |
| REQ-20260203-001 | ITER-20260203-214153 | E2E | E2E (requirements/specs/e2e/home-loan-calculator.spec.js) | 2/25 | PASS |
| REQ-20260128-019 | ITER-20260128-154622 | Unit + ISS-001 | Unit (requirements/specs/loans/loan-utils.test.js); ISS-001 (requirements/specs/e2e/iss-design-001.spec.js) | 2/25 | PASS |
| REQ-20260128-004 | ITER-20260128-101144 | E2E | E2E (requirements/specs/e2e/home-loan-calculator.spec.js) | 3/25 | PASS |
| REQ-20260128-015 | ITER-20260128-122745 | ISS-001 | ISS-001 (requirements/specs/e2e/iss-design-001.spec.js) | 2/25 | PASS |
| REQ-20260128-014 | ITER-20260128-121035 | ISS-001 | ISS-001 (requirements/specs/e2e/iss-design-001.spec.js) | 2/25 | PASS |
| REQ-20260128-002 | ITER-20260128-092323 | None | None | 1/25 | PASS |
| REQ-20260128-003 | ITER-20260128-093138 | E2E | E2E (requirements/specs/e2e/home-loan-calculator.spec.js) | 3/25 | PASS |
| REQ-20260128-001 | ITER-20260128-082355 | Unit + E2E | Unit (tests/loans/home-loan.test.js); E2E (requirements/specs/e2e/home-loan-calculator.spec.js) | 3/25 | PASS |
| REQ-20260127-013 | ITER-20260127-215418 | ISS-001 | ISS-001 (requirements/specs/e2e/iss-design-001.spec.js) | 2/25 | PASS |
| REQ-20260127-012 | ITER-20260127-203619 | ISS-001 + E2E | ISS-001 (requirements/specs/e2e/iss-design-001.spec.js, snapshots updated); E2E (requirements/specs/e2e/home-shell.spec.js) | 8/25 | PASS |
| REQ-20260127-011 | ITER-20260127-202322 | ISS-001 | ISS-001 (requirements/specs/e2e/iss-design-001.spec.js, snapshots updated) | 3/25 | PASS |
| REQ-20260127-010 | ITER-20260127-195428 | ISS-001 | ISS-001 (rollback) | 6/25 | FAIL |
| REQ-20260127-009 | ITER-20260127-193224 | ISS-001 | ISS-001 (requirements/specs/e2e/iss-design-001.spec.js, snapshots updated) | 3/25 | PASS |
| REQ-20260127-008 | ITER-20260127-185716 | ISS-001 | ISS-001 (requirements/specs/e2e/iss-design-001.spec.js) | 2/25 | PASS |
| REQ-20260127-006 | ITER-20260127-164722 | SEO Auto | SEO Auto (requirements/specs/e2e/car-loan-seo.spec.js) | 1/25 | PASS |
| REQ-20260127-005 | ITER-20260127-121647 | SEO Auto | SEO Auto (requirements/specs/e2e/gtep-pages-seo.spec.js) | 1/25 | PASS |
| REQ-20260127-004 | ITER-20260127-121111 | SEO Auto | SEO Auto (requirements/specs/e2e/gtep-pages-seo.spec.js) | 1/25 | PASS |
| REQ-20260127-003 | ITER-20260127-120145 | SEO Auto | SEO Auto (requirements/specs/e2e/gtep-pages-seo.spec.js) | 1/25 | PASS |
| REQ-20260127-002 | ITER-20260127-080207 | ISS-001 + E2E + SEO Auto | ISS-001 (requirements/specs/e2e/iss-design-001.spec.js, snapshots updated); E2E (requirements/specs/e2e/gtep-pages.spec.js); SEO Auto (requirements/specs/e2e/gtep-pages-seo.spec.js) | 1/25 | PASS |
| REQ-20260127-001 | ITER-20260127-014245 | Unit + E2E + SEO Auto | Unit (tests/core/countdown-timer-generator.test.js); E2E (requirements/specs/e2e/countdown-timer-generator.spec.js); SEO Auto (requirements/specs/e2e/countdown-timer-generator-seo.spec.js) | 2/25 | PASS |
| REQ-20260126-015 | ITER-20260126-235614 | Unit + E2E + SEO Auto | Unit (tests/core/overtime-hours-calculator.test.js); E2E (requirements/specs/e2e/overtime-hours-calculator.spec.js); SEO Auto (requirements/specs/e2e/overtime-hours-seo.spec.js) | 1/25 | PASS |
| REQ-20260126-014 | ITER-20260126-232505 | Unit + E2E + SEO Auto | Unit (tests/core/work-hours-calculator.test.js); E2E (requirements/specs/e2e/work-hours-calculator.spec.js); SEO Auto (requirements/specs/e2e/work-hours-seo.spec.js) | 1/25 | PASS |
| REQ-20260126-013 | ITER-20260126-230824 | Unit + E2E + SEO Auto | Unit (tests/core/nap-time-calculator.test.js); E2E (requirements/specs/e2e/nap-time-calculator.spec.js); SEO Auto (requirements/specs/e2e/nap-time-seo.spec.js) | 1/25 | PASS |
| REQ-20260126-012 | ITER-20260126-225438 | Unit + E2E + SEO Auto | Unit (tests/core/birthday-day-of-week.test.js); E2E (requirements/specs/e2e/birthday-day-of-week-calculator.spec.js); SEO Auto (requirements/specs/e2e/birthday-day-of-week-seo.spec.js) | 1/25 | PASS |
| REQ-20260126-011 | ITER-20260126-223254 | None (Archive/Cleanup) | None | 1/25 | PASS |
| REQ-20260126-009 | ITER-20260126-210621 | Unit + E2E + SEO Auto | Unit (tests/core/age-calculator.test.js); E2E (requirements/specs/e2e/age-calculator.spec.js); SEO Auto (requirements/specs/e2e/age-calculator-seo.spec.js) | 1/25 | PASS |
| REQ-20260126-008 | ITER-20260126-205123 | Unit + E2E + SEO Auto | Unit (tests/core/days-until-a-date-calculator.test.js); E2E (requirements/specs/e2e/days-until-a-date-calculator.spec.js); SEO Auto (requirements/specs/e2e/days-until-a-date-seo.spec.js) | 1/25 | PASS |
| REQ-20260126-007 | ITER-20260126-203351 | Unit + E2E + SEO Auto | Unit (tests/core/time-between-two-dates-calculator.test.js); E2E (requirements/specs/e2e/time-between-two-dates-calculator.spec.js); SEO Auto (requirements/specs/e2e/time-between-two-dates-seo.spec.js) | 1/25 | PASS |
| REQ-20260126-006 | ITER-20260126-195916 | Unit + E2E + SEO Auto | Unit (tests/core/wake-up-time-calculator.test.js); E2E (requirements/specs/e2e/wake-up-time-calculator.spec.js); SEO Auto (requirements/specs/e2e/wake-up-time-seo.spec.js) | 1/25 | PASS |
| REQ-20260126-005 | ITER-20260126-185212 | Unit + E2E + SEO Auto | Unit (tests/core/sleep-time-calculator.test.js); E2E (requirements/specs/e2e/sleep-time-calculator.spec.js); SEO Auto (requirements/specs/e2e/sleep-time-seo.spec.js) | 1/25 | PASS |
| REQ-20260126-004 | ITER-20260126-131858 | ISS-001 | ISS-001 (requirements/specs/e2e/iss-001-layout-stability.spec.js, snapshots updated) | 1/25 | PASS |
| REQ-20260126-003 | ITER-20260126-115903 | ISS-001 | ISS-001 (requirements/specs/e2e/iss-001-layout-stability.spec.js, snapshots updated) | 1/25 | PASS |
| REQ-20260126-002 | ITER-20260126-113856 | ISS-001 | ISS-001 (requirements/specs/e2e/iss-001-layout-stability.spec.js, snapshots updated) | 1/25 | PASS |
| REQ-20260126-001 | ITER-20260126-112255 | E2E | E2E (requirements/specs/e2e/remortgage-switching.spec.js) | 1/25 | PASS |
| REQ-20260125-100 | ITER-20260126-105223 | E2E | E2E (requirements/specs/e2e/remortgage-switching.spec.js) | 1/25 | PASS |
| REQ-20260125-007 | ITER-20260125-113300 | E2E | E2E (requirements/specs/e2e/home-shell.spec.js) | 2/25 | FAIL |
| REQ-20260125-006 | ITER-20260125-111500 | ISS-001 | ISS-001 (requirements/specs/e2e/iss-001-layout-stability.spec.js, snapshots updated) | 4/25 | PASS |
| REQ-20260125-005 | ITER-20260125-104000 | E2E | E2E (requirements/specs/e2e/home-shell.spec.js) | 2/25 | PASS |
| REQ-20260125-004 | ITER-20260125-101500 | E2E + SEO Auto | E2E (requirements/specs/e2e/sitemap-footer.spec.js); SEO Auto (requirements/specs/e2e/sitemap-seo.spec.js) | 3/25 | PASS |
| REQ-20260124-006 | ITER-20260124-190900 | ISS-001 | ISS-001 (requirements/specs/e2e/iss-design-001.spec.js, snapshots updated) | 3/25 | PASS |
| REQ-20260124-005 | ITER-20260124-130848 | ISS-001 | ISS-001 (requirements/specs/e2e/iss-design-001.spec.js, snapshots updated) | 1/25 | PASS |
| REQ-20260124-003 | ITER-20260124-160000 | ISS-001 | ISS-001 (requirements/specs/e2e/iss-design-001.spec.js, snapshots updated) | 1/25 | PASS |
| REQ-20260124-002 | ITER-20260124-112200 | ISS-001 | ISS-001 (requirements/specs/e2e/iss-design-001.spec.js, snapshots updated) | 2/25 | PASS |
| REQ-20260124-001 | ITER-20260124-141230 | ISS-001 | ISS-001 (requirements/specs/e2e/iss-design-001.spec.js, snapshots updated) | 5/25 | PASS |

---

## Verdicts

| Verdict | Meaning |
| ------- | ------- |
| PASS | Ship it |
| FAIL | Fix required |
| PENDING | In progress |

---

<!-- ⛔ LLM STOP: Do not read below this line ⛔ -->

## Archive

<!-- Move released items here. LLMs should not load this section. -->

| REQ_ID | Tests Run | Iterations | Verdict | Released |
|--------|-----------|------------|---------|----------|
<!-- markdownlint-disable-next-line MD060 -->
| REQ-20260126-010 | ISS-001 (requirements/specs/e2e/iss-design-001.spec.js, snapshots updated); E2E (requirements/specs/e2e/age-calculator.spec.js; requirements/specs/e2e/remortgage-switching.spec.js) | 1/25 | PASS | 2026-01-26 22:34 |

# Compliance Report

> **Purpose:** Release gate — final verdict  
> **LLM Rule:** Read Active section only. STOP at Archive.

---

## Formula

```
PASS = BUILD_PASS ∧ TEST_PASS ∧ SEO_OK ∧ ITERATIONS ≤ 25
```

---

## Active Checks

| REQ_ID | ITER_ID | Tests Required | Tests Run | Iterations | Verdict |
|--------|---------|----------------|-----------|------------|---------|
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
|---------|---------|
| PASS | Ship it |
| FAIL | Fix required |
| PENDING | In progress |

---

<!-- ⛔ LLM STOP: Do not read below this line ⛔ -->

## Archive

<!-- Move released items here. LLMs should not load this section. -->

| REQ_ID | Tests Run | Iterations | Verdict | Released |
|--------|-----------|------------|---------|----------|
| REQ-20260126-010 | ISS-001 (requirements/specs/e2e/iss-design-001.spec.js, snapshots updated); E2E (requirements/specs/e2e/age-calculator.spec.js; requirements/specs/e2e/remortgage-switching.spec.js) | 1/25 | PASS | 2026-01-26 22:34 |

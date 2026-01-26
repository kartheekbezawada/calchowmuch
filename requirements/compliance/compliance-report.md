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
| | | | | |

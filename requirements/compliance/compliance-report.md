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

# Testing Tracker

This document is the system of record for FSM test runs.

## FSM Test Status Definitions
- **RUNNING**: Test execution in progress (S8_TEST_RUNNING).
- **PASS**: Tests passed (S10_TEST_PASSED).
- **FAIL**: Tests failed (S9_TEST_FAILED_RETRYABLE).
- Legacy statuses (Not Started/Skip) apply only to the legacy backlog below.

---

## FSM Test Runs (Authoritative)

| Test Run ID | Build ID | Start Time | Status | Evidence/Notes |
|-------------|----------|------------|--------|----------------|

Notes:
- Use TEST-YYYYMMDD-HHMMSS for each run.
- Evidence should link to test logs/artifacts; include REQ link if helpful.

---

## Legacy Backlog (pre-FSM)

| Requirement ID | Testing Tracker ID | Test ID | Test Type | Component | Test Description | Status | Test Created Date | Test Executed Date | Pass/Fail | Notes |
|---------------|-------------------|---------|-----------|-----------|------------------|--------|-------------------|-------------------|-----------|-------|
| REQ-AUTO-001 | TTRK-AUTO-001 | TEST-AUTO-001 | Unit | Car Loan Calculator | Test car loan EMI calculation | Not Started | 2026-01-19 | - | - | auto-loan-utils.test.js |
| REQ-AUTO-001 | TTRK-AUTO-002 | TEST-AUTO-002 | E2E | Car Loan Calculator | Test car loan UI flow | Not Started | 2026-01-19 | - | - | car-loan.spec.js |
| REQ-AUTO-002 | TTRK-AUTO-003 | TEST-AUTO-003 | Unit | Multi-Car Loan | Test multi-loan comparison | Not Started | 2026-01-19 | - | - | auto-loan-utils.test.js |
| REQ-BTL-001 | TTRK-BTL-001 | TEST-BTL-001 | Unit | Buy-to-Let | Test BTL profitability calculation | Not Started | 2026-01-19 | - | - | buy-to-let-utils.test.js |
| REQ-BTL-001 | TTRK-BTL-002 | TEST-BTL-002 | E2E | Buy-to-Let | Test BTL UI flow | Not Started | 2026-01-19 | - | - | buy-to-let.spec.js |
| REQ-CC-001 | TTRK-CC-001 | TEST-CC-001 | Unit | CC Payoff | Test payoff calculation | Not Started | 2026-01-19 | - | - | credit-card-utils.test.js |
| REQ-CC-001 | TTRK-CC-002 | TEST-CC-002 | E2E | CC Payoff | Test payoff UI flow | Not Started | 2026-01-19 | - | - | credit-card.spec.js |
| REQ-CC-002 | TTRK-CC-003 | TEST-CC-003 | Unit | Minimum Payment | Test minimum payment logic | Not Started | 2026-01-19 | - | - | credit-card-utils.test.js |
| REQ-MTG-001 | TTRK-MTG-001 | TEST-MTG-001 | Unit | Mortgage | Test mortgage amortization | Not Started | 2026-01-19 | - | - | loan-utils.test.js |
| REQ-MTG-001 | TTRK-MTG-002 | TEST-MTG-002 | E2E | Mortgage | Test mortgage UI flow | Not Started | 2026-01-19 | - | - | mortgage.spec.js |
| REQ-BOR-001 | TTRK-BOR-001 | TEST-BOR-001 | Unit | Borrow Calculator | Test affordability calculation | Not Started | 2026-01-19 | - | - | borrow-utils.test.js |
| REQ-BOR-001 | TTRK-BOR-002 | TEST-BOR-002 | E2E | Borrow Calculator | Test borrow UI flow | Not Started | 2026-01-19 | - | - | how-much-can-borrow.spec.js |
| REQ-EMI-001 | TTRK-EMI-001 | TEST-EMI-001 | Unit | Loan EMI | Test EMI calculation | Not Started | 2026-01-19 | - | - | loan-utils.test.js |
| REQ-EMI-001 | TTRK-EMI-002 | TEST-EMI-002 | E2E | Loan EMI | Test EMI UI flow | Not Started | 2026-01-19 | - | - | loan-emi.spec.js |
| REQ-STAT-001 | TTRK-STAT-001 | TEST-STAT-001 | Unit | Standard Deviation | Test std dev calculation | Not Started | 2026-01-19 | - | - | stats.test.js |
| REQ-STAT-002 | TTRK-STAT-002 | TEST-STAT-002 | Unit | Number Sequence | Test sequence detection | Not Started | 2026-01-19 | - | - | stats.test.js |
| REQ-STAT-003 | TTRK-STAT-003 | TEST-STAT-003 | Unit | Sample Size | Test sample size calc | Not Started | 2026-01-19 | - | - | stats.test.js |
| REQ-STAT-004 | TTRK-STAT-004 | TEST-STAT-004 | Unit | Probability | Test probability calc | Not Started | 2026-01-19 | - | - | stats.test.js |
| REQ-STAT-005 | TTRK-STAT-005 | TEST-STAT-005 | Unit | Statistics | Test general stats | Not Started | 2026-01-19 | - | - | stats.test.js |
| REQ-STAT-006 | TTRK-STAT-006 | TEST-STAT-006 | Unit | Mean Median Mode Range | Test MMMR calculation | Not Started | 2026-01-19 | - | - | stats.test.js |
| REQ-STAT-007 | TTRK-STAT-007 | TEST-STAT-007 | Unit | Permutation Combination | Test nPr/nCr calculation | Not Started | 2026-01-19 | - | - | stats.test.js |
| REQ-STAT-008 | TTRK-STAT-008 | TEST-STAT-008 | Unit | Z-Score | Test z-score calculation | Not Started | 2026-01-19 | - | - | stats.test.js |
| REQ-STAT-009 | TTRK-STAT-009 | TEST-STAT-009 | Unit | Confidence Interval | Test CI calculation | Not Started | 2026-01-19 | - | - | stats.test.js |
| REQ-NAV-001 | TTRK-NAV-001 | TEST-NAV-001 | E2E | Navigation | Test nav hierarchy | Not Started | 2026-01-19 | - | - | navigation.spec.js |
| REQ-NAV-001 | TTRK-NAV-002 | TEST-NAV-002 | Regression | Layout Stability | Test CLS prevention | Not Started | 2026-01-19 | - | - | iss-001-layout-stability.spec.js |

---

## Test Types
- **Unit**: Function-level testing (Vitest)
- **E2E**: End-to-end testing (Playwright)
- **Integration**: Component integration testing
- **Regression**: Bug prevention testing
- **Performance**: Load/speed testing
- **Accessibility**: A11y compliance testing

---

## Coverage Requirements
- **Unit Tests**: Minimum 80% code coverage
- **E2E Tests**: 100% critical path coverage
- **Regression Tests**: All resolved issues must have prevention tests

---

## Test Results Summary

| Date | Total Tests | Not Started | Pass | Fail | Skip | Overall Pass Rate |
|------|-------------|-------------|------|------|------|------------------|
| 2026-01-19 | 25 | 25 | 0 | 0 | 0 | 0% |

---

## Template for New FSM Test Runs

```markdown
| TEST-YYYYMMDD-HHMMSS | BUILD-YYYYMMDD-HHMMSS | YYYY-MM-DD HH:MM:SS | RUNNING | [Evidence/Notes] |
```

---

## ID Conventions

| ID Type | Format | Example |
|---------|--------|---------|
| Test Run ID | TEST-YYYYMMDD-HHMMSS | TEST-20260119-152233 |
| Build ID (linked) | BUILD-YYYYMMDD-HHMMSS | BUILD-20260119-152233 |
| Requirement ID (linked) | REQ-YYYYMMDD-### | REQ-20260119-001 |

Legacy testing IDs (TTRK-*, TEST-[CAT]-*) apply only to the legacy backlog above.

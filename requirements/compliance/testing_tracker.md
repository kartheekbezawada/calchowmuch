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
| TEST-20260119-153209 | BUILD-20260119-140637 | 2026-01-19 15:32:14 | FAIL | Import path resolution failed in buy-to-let-utils.test.js |
| TEST-20260119-153426 | BUILD-20260119-140637 | 2026-01-19 15:34:33 | PASS | `npm run test -- buy-to-let-utils` (5 tests passed) |
| TEST-20260119-165247 | BUILD-20260119-140637 | 2026-01-19 16:52:41 | PASS | Windows `npm run test` (Vitest: 225 tests passed) |
| TEST-20260119-165247-E2E | BUILD-20260119-140637 | 2026-01-19 16:52:41 | FAIL | Windows `npm run test:e2e` failed (46 tests) across BOR/REMO/BTL suites; logs in `test-results/` |
| TEST-20260119-184219 | BUILD-20260119-182726 | 2026-01-19 18:42:22 | RUNNING | `npm run test` + `npm run test:e2e` (Linux/WSL) |
| TEST-20260119-184219 | BUILD-20260119-182726 | 2026-01-19 18:45:10 | FAIL | `npm run test` ok (235 tests); `npm run test:e2e` failed: missing `libnspr4.so` (Playwright deps), 86 tests failed |
| TEST-20260119-192244 | BUILD-20260119-192208 | 2026-01-19 19:24:34 | FAIL | `npm run test` ok (235 tests); `npm run test:e2e` failed (49 tests) across BOR/PERC/REMO/BTL/ISS-001 suites |
| TEST-20260119-200506 | BUILD-20260119-200425 | 2026-01-19 20:05:09 | RUNNING | `npm run test` + `npm run test:e2e` (WSL) |
| TEST-20260119-200506 | BUILD-20260119-200425 | 2026-01-19 20:06:26 | FAIL | `npm run test` ok (235 tests); `npm run test:e2e` failed (19 tests) across BOR/REMO/BTL/ISS-001 suites |
| TEST-20260119-201551 | BUILD-20260119-201520 | 2026-01-19 20:15:54 | RUNNING | `npm run test` + `npm run test:e2e` (WSL) |
| TEST-20260119-201551 | BUILD-20260119-201520 | 2026-01-19 20:16:50 | FAIL | `npm run test` ok (235 tests); `npm run test:e2e` failed (8 tests) across BOR/BTL/ISS-001 suites |
| TEST-20260119-203415 | BUILD-20260119-203342 | 2026-01-19 20:34:19 | RUNNING | `npm run test` + `npm run test:e2e` (WSL) |
| TEST-20260119-203815 | BUILD-20260119-203733 | 2026-01-19 20:38:19 | RUNNING | `npm run test` + `npm run test:e2e` (WSL) |
| TEST-20260119-203815 | BUILD-20260119-203733 | 2026-01-19 20:39:44 | FAIL | `npm run test` ok (235 tests); `npm run test:e2e` failed (8 tests) across BOR/BTL/ISS-001 suites |

Notes:
- Use TEST-YYYYMMDD-HHMMSS for each run.
- Evidence should link to test logs/artifacts; include REQ link if helpful.

---

## Current Test Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| Total FSM Test Runs | 12 | 100% |
| Passed | 3 | 25% |
| Failed | 9 | 75% |
| Running | 0 | 0% |

---

## Test Category Breakdown

| Category | Unit Tests | E2E Tests | Status |
|----------|------------|-----------|----------|
| Buy-to-Let | ✅ PASS | ❌ FAIL | Partial |
| Math/Percentage | ❌ Not Started | ❌ Not Started | Blocked |
| Core/Utils | ✅ PASS | N/A | Complete |

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

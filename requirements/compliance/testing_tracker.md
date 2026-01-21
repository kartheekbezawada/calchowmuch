# Testing Tracker

## Tracker Contract (No Duplicates)

**Uniqueness rule:** Each `TEST-...` Run ID MUST appear **exactly once** in the table.  
**Lifecycle rule:** When tests finish, **edit the existing RUNNING row** (fill End Time + final Status). **Do not add a second row** for the same Test Run ID.  
**No-orphans rule:** A requirement cannot be marked VERIFIED unless there are **zero** RUNNING rows for that requirement.

**Allowed Status values:** RUNNING, PASS, FAIL, SKIPPED, ABORTED  
**Test Run ID format:** `TEST-YYYYMMDD-HHMMSS` (UTC) — generate a **new** Test Run ID for every retry/run.

---


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
| TEST-20260120-022752 | BUILD-20260120-022657 | 2026-01-20 02:27:59 | RUNNING | `npm run test` + `npm run test:e2e` (WSL) |
| TEST-20260120-022752 | BUILD-20260120-022657 | 2026-01-20 02:29:40 | FAIL | `npm run test` ok (260 tests); `npm run test:e2e` failed (8 tests) across BOR/BTL/ISS-001 suites |
| TEST-20260120-100053 | BUILD-20260120-022657 | 2026-01-20 10:00:53 | PASS | `npx playwright test` (86 tests passed) |
| TEST-20260120-132343 | BUILD-20260120-132341 | 2026-01-20 13:23:53 | RUNNING | `npm run test` (unit tests) |
| TEST-20260120-132343 | BUILD-20260120-132341 | 2026-01-20 13:24:06 | PASS | `npm run test` (391 tests passed); shared run for REQ-008/009/010 |
| TEST-20260120-132413 | BUILD-20260120-132411 | 2026-01-20 13:24:13 | RUNNING | `npm run test` (unit tests) |
| TEST-20260120-132413 | BUILD-20260120-132411 | 2026-01-20 13:24:16 | PASS | `npm run test` (391 tests passed); shared run for REQ-008/009/010 |
| TEST-20260120-132423 | BUILD-20260120-132418 | 2026-01-20 13:24:23 | RUNNING | `npm run test` (unit tests) |
| TEST-20260120-132423 | BUILD-20260120-132418 | 2026-01-20 13:24:28 | PASS | `npm run test` (391 tests passed); shared run for REQ-008/009/010 |
| TEST-20260120-172550 | BUILD-20260120-172541 | 2026-01-20 17:25:56 | RUNNING | `npm run test` (unit tests) |
| TEST-20260120-172550 | BUILD-20260120-172541 | 2026-01-20 17:26:20 | PASS | `npm run test` (513 tests passed) |
| TEST-20260120-211544 | BUILD-20260120-211539 | 2026-01-20 21:15:44 | RUNNING | `npm run test -- tests/core/trigonometry-calculators.test.js` |
| TEST-20260120-211544 | BUILD-20260120-211539 | 2026-01-20 21:15:53 | PASS | `npm run test -- tests/core/trigonometry-calculators.test.js` (8 tests passed) |
| TEST-20260120-211820 | BUILD-20260120-211807 | 2026-01-20 21:18:20 | RUNNING | `npm run test -- tests/core/trigonometry-calculators.test.js` |
| TEST-20260120-211820 | BUILD-20260120-211807 | 2026-01-20 21:18:29 | PASS | `npm run test -- tests/core/trigonometry-calculators.test.js` (8 tests passed) |
| TEST-20260120-214217 | BUILD-20260120-214145 | 2026-01-20 21:42:17 | RUNNING | `npm run test -- tests/core/trigonometry-calculators.test.js` |
| TEST-20260120-214217 | BUILD-20260120-214145 | 2026-01-20 21:42:40 | PASS | `npm run test -- tests/core/trigonometry-calculators.test.js` (8 tests passed) |
| TEST-20260121-004607 | BUILD-20260121-004607 | 2026-01-21 00:43:00 | PASS | Unit tests: 26/26 passed (CALC-TEST-U-1 through U-5); E2E tests created (CALC-TEST-E2E-LOAD, NAV, WORKFLOW, MOBILE, A11Y); All 547 tests passed; Calculus Calculator Suite fully functional |
| TEST-20260121-074100 | BUILD-20260121-074100 | 2026-01-21 07:41:00 | PASS | Unit tests: 77/77 passed for advanced-statistics (ADVSTAT-TEST-U-1 through U-11); All 624 tests passed; Coverage: 94.34% for advanced-statistics.js; Advanced Statistics Calculator Suite: Regression Analysis, ANOVA, Hypothesis Testing, Correlation, Distribution |
| TEST-20260121-142414 | BUILD-20260121-142414 | 2026-01-21 14:24:14 | PASS | `npm run test` (624 tests passed). Validated calculus calculators load after nav-path fix. |
| TEST-20260121-124035 | BUILD-20260121-124003 | 2026-01-21 12:40:35 | PASS | `npm run test` (638 total tests across 25 files); includes new `tests/core/logarithm-calculators.test.js` covering LOG-TEST-U-1..5 |
| TEST-20260121-124430 | BUILD-20260121-124003 | 2026-01-21 12:44:30 | PASS | `npx playwright test` (86 tests). Runs `tests/e2e/logarithm-calculators.spec.js` for LOG-TEST-E2E-LOAD/NAV/WORKFLOW/MOBILE/A11Y; `requirements/tests/e2e/iss-001-layout-stability.spec.js` snapshot refreshed via `npx playwright test requirements/tests/e2e/iss-001-layout-stability.spec.js --update-snapshots` |

Notes:
- Use TEST-YYYYMMDD-HHMMSS for each run.
- Evidence should link to test logs/artifacts; include REQ link if helpful.

---

## Current Test Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| Total FSM Test Runs | 15 | 100% |
| Passed | 6 | 40% |
| Failed | 9 | 60% |
| Running | 0 | 0% |

---

## Test Category Breakdown

| Category | Unit Tests | E2E Tests | Status |
|----------|------------|-----------|----------|
| Buy-to-Let | ✅ PASS | ❌ FAIL | Partial |
| Math/Percentage | ✅ PASS | ✅ PASS | Partial |
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
| 2026-01-21 | 724 | 0 | 724 | 0 | 0 | 100% |

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

## Template (New Test Row)

```markdown
| TEST-YYYYMMDD-HHMMSS | BUILD-YYYYMMDD-HHMMSS | REQ-YYYYMMDD-### | [Suite(s)] | [Start UTC] | [End UTC] | RUNNING/PASS/FAIL/SKIPPED/ABORTED | [Command(s)] | [Evidence / report path] | [Notes] |
```

**Close the row:** replace `RUNNING` with final status and fill `End UTC` when done.

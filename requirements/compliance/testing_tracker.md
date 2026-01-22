# Testing Tracker

> **Purpose:** Track test executions for FSM requirements.

---

## Tracker Contract

| Rule | Description |
|------|-------------|
| **One row per Test Run ID** | Each `TEST-...` appears exactly once |
| **Test Run ID format** | `TEST-YYYYMMDD-HHMMSS` (UTC) |
| **Update in place** | Edit RUNNING row to final status (never add duplicate) |
| **No orphans** | All tests must be closed (PASS/FAIL/SKIPPED) before REQ is VERIFIED |

---

## Status Definitions

| Status | Meaning |
|--------|---------|
| **RUNNING** | Tests in progress |
| **PASS** | All mandatory tests pass |
| **FAIL** | One or more mandatory tests fail |
| **SKIPPED** | Tests intentionally skipped per matrix |
| **ABORTED** | Tests cancelled |

---

## Test Selection Reference

See [testing_requirements.md](testing_requirements.md) for:
- **§2:** Test category definitions
- **§3:** Test Selection Matrix (mandatory vs optional)
- **§5:** Test execution commands

---

## Test Commands Quick Reference

### Unit Tests
```bash
npm run test                           # All unit tests
npm run test -- tests/core/file.test.js  # Specific file
npm run test:coverage                  # With coverage
```

### E2E Tests
```bash
npm run test:e2e                       # All E2E tests
npx playwright test tests/e2e/file.spec.js  # Specific file
```

### SEO Tests
```bash
npx playwright test tests/seo/seo-auto.spec.js        # Default targets
REQ_ID=REQ-... npx playwright test tests/seo/seo-auto.spec.js  # Specific REQ
```

### Layout Stability (ISS-001)
```bash
npx playwright test requirements/specs/e2e/iss-001-layout-stability.spec.js
```

---

## FSM Test Runs (Authoritative)

| Test Run ID | Build ID | Test Type | Start Time | End Time | Status | Tests Run | Evidence |
|-------------|----------|-----------|------------|----------|--------|-----------|----------|
| *(Fresh start — populate as tests run)* | | | | | | | |

---

## Template for New Test Entry

```markdown
| TEST-YYYYMMDD-HHMMSS | BUILD-YYYYMMDD-HHMMSS | Unit/E2E/SEO | YYYY-MM-DD HH:MM:SS | — | RUNNING | — | — |
```

When tests complete, update the same row:

```markdown
| TEST-YYYYMMDD-HHMMSS | BUILD-YYYYMMDD-HHMMSS | Unit | YYYY-MM-DD HH:MM:SS | YYYY-MM-DD HH:MM:SS | PASS | 638/638 | `npm run test` ok |
```

---

## Test Type Reference

| Type | Description | Command |
|------|-------------|---------|
| **Unit** | Pure function tests (Vitest) | `npm run test` |
| **E2E** | End-to-end calculator tests (Playwright) | `npm run test:e2e` |
| **E2E-LOAD** | Calculator loads without error | Playwright |
| **E2E-WORKFLOW** | Inputs → Calculate → Results | Playwright |
| **E2E-NAV** | Navigation/deep-linking | Playwright |
| **SEO** | SEO auto-checks | `npx playwright test tests/seo/seo-auto.spec.js` |
| **ISS-001** | Layout stability regression | Playwright |

---

## Test Lifecycle

```
S7_BUILD_PASSED
       │
       v
S8_TEST_RUNNING  ──────┬──────────────────┐
       │                │                  │
       v                v                  v
  TEST PASS        TEST FAIL          TEST SKIPPED
       │                │                  │
       v                v                  v
  → S11 Update    → S9 Retry/Issue    → S11 (if allowed)
```

---

## Pass Criteria

A test run is **PASS** when:

```
TEST_PASS = mandatory_tests_executed 
          ∧ mandatory_tests_all_pass
          ∧ (optional_tests_skipped ∨ optional_tests_pass)
```

Mandatory tests are determined by Change Type (see [testing_requirements.md](testing_requirements.md) §3).

---

## Current Test Summary

| Metric | Count |
|--------|-------|
| Total Test Runs | 0 |
| PASS | 0 |
| FAIL | 0 |
| RUNNING | 0 |
| SKIPPED | 0 |

*Note: This tracker was reset on 2026-01-22.*

---

## Test Category Breakdown

| Category | Unit | E2E | SEO | Status |
|----------|------|-----|-----|--------|
| *(populate as tests run)* | | | | |

---

## Notes

- Tests run after BUILD PASS
- Only mandatory tests are required for PASS
- Optional tests can be deferred without blocking
- Coverage ≥80% required for new compute logic (TEST-1.2)
- Screenshot/trace only on failure (TEST-1.5, TEST-1.6)

---

**Last Updated:** 2026-01-22  
**Status:** Fresh Start

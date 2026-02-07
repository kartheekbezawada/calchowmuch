# Testing Tracker

> **Purpose:** Compact log of test runs  
> **LLM Rule:** Read Active section only. STOP at Archive.

---

## Active Tests

| TEST_ID | REQ_ID | ITER_ID | Type | Status | Iterations | Tests Run | Evidence |
|---------|--------|---------|------|--------|------------|-----------|----------|
| TEST-20260206-092811 | REQ-20260206-004 | ITER-20260206-091703 | SEO | PASS | 1/25 | `npx pa11y http://127.0.0.1:8002/finance/future-value/ --timeout 120000 --wait 1000 --reporter json` (exit 0, 0 issues) | iterations/ITER-20260206-091703.md |
| TEST-20260206-092744 | REQ-20260206-004 | ITER-20260206-091703 | SEO | FAIL | 1/25 | `CHROME_PATH=<WSL Chrome> npx lighthouse http://127.0.0.1:8002/finance/future-value/ --only-categories=performance` (`NO_FCP`) | iterations/ITER-20260206-091703.md |
| TEST-20260206-092130 | REQ-20260206-004 | ITER-20260206-091703 | ISS-001 | FAIL | 1/25 | `npm run test:iss001` (5 failed, 4 passed in `requirements/specs/e2e/iss-design-001.spec.js`) | iterations/ITER-20260206-091703.md |
| TEST-20260206-092111 | REQ-20260206-004 | ITER-20260206-091703 | SEO | PASS | 1/25 | `npm run test:e2e -- requirements/specs/e2e/future-value-seo.spec.js` (1 passed) | iterations/ITER-20260206-091703.md |
| TEST-20260206-092110 | REQ-20260206-004 | ITER-20260206-091703 | E2E | PASS | 1/25 | `npm run test:e2e -- requirements/specs/e2e/future-value-calculator.spec.js` (1 passed) | iterations/ITER-20260206-091703.md |
| TEST-20260206-092109 | REQ-20260206-004 | ITER-20260206-091703 | Unit | PASS | 1/25 | `npx vitest run tests/core/future-value-calculator.test.js` (4 passed) | iterations/ITER-20260206-091703.md |
| TEST-20260206-022156 | REQ-20260206-003 | ITER-20260206-021115 | ISS-001 | FAIL | 1/25 | `npm run test:iss001` (5 failed, 4 passed in `requirements/specs/e2e/iss-design-001.spec.js`) | iterations/ITER-20260206-021115.md |
| TEST-20260206-022233 | REQ-20260206-003 | ITER-20260206-021115 | SEO | FAIL | 1/25 | `npx lighthouse http://localhost:8002/finance/present-value/ --only-categories=performance` + `--only-categories=seo` (Unable to connect to Chrome) | iterations/ITER-20260206-021115.md |
| TEST-20260206-022331 | REQ-20260206-003 | ITER-20260206-021115 | SEO | FAIL | 1/25 | `npx pa11y http://localhost:8002/finance/present-value/ --reporter json` (Navigation timeout) | iterations/ITER-20260206-021115.md |
| TEST-20260206-021944 | REQ-20260206-003 | ITER-20260206-021115 | SEO | PASS | 1/25 | `npm run test:e2e -- requirements/specs/e2e/present-value-seo.spec.js` (1 passed) | iterations/ITER-20260206-021115.md |
| TEST-20260206-021742 | REQ-20260206-003 | ITER-20260206-021115 | E2E | PASS | 1/25 | `npm run test:e2e -- requirements/specs/e2e/present-value-calculator.spec.js` (1 passed) | iterations/ITER-20260206-021115.md |
| TEST-20260206-021505 | REQ-20260206-003 | ITER-20260206-021115 | Unit | PASS | 1/25 | `npm run test` (37 files passed, 2 skipped) | iterations/ITER-20260206-021115.md |
| TEST-20260206-020843 | REQ-20260206-001 | ITER-20260206-012439 | SEO | FAIL | 1/25 | `npx pa11y http://localhost:8002/finance/present-value/ --reporter json` (2 contrast errors) | iterations/ITER-20260206-012439.md |
| TEST-20260206-020842 | REQ-20260206-001 | ITER-20260206-012439 | SEO | FAIL | 1/25 | `npx lighthouse http://localhost:8002/finance/present-value/ --only-categories=performance` (Unable to connect to Chrome); `npx lighthouse http://localhost:8002/finance/present-value/ --only-categories=seo` (Unable to connect to Chrome) | iterations/ITER-20260206-012439.md |
| TEST-20260206-020841 | REQ-20260206-001 | ITER-20260206-012439 | SEO | PASS | 1/25 | requirements/specs/e2e/present-value-seo.spec.js (1 passed) | iterations/ITER-20260206-012439.md |
| TEST-20260206-020840 | REQ-20260206-001 | ITER-20260206-012439 | E2E | PASS | 1/25 | requirements/specs/e2e/present-value-calculator.spec.js (1 passed) | iterations/ITER-20260206-012439.md |
| TEST-20260206-020839 | REQ-20260206-001 | ITER-20260206-012439 | ISS-001 | FAIL | 1/25 | requirements/specs/e2e/iss-design-001.spec.js (9 failed: timeouts on /loans/car-loan) | iterations/ITER-20260206-012439.md |
| TEST-20260206-013835 | REQ-20260206-001 | ITER-20260206-012439 | Unit | PASS | 1/25 | tests/core/present-value-calculator.test.js (5 passed) | iterations/ITER-20260206-012439.md |

---

## Test Types (Quick Ref)

| Type | Command | When |
|------|---------|------|
| Unit | `npm run test` | Compute changes |
| E2E | `npm run test:e2e` | UI/flow changes |
| SEO | `npm run test:e2e -- requirements/specs/e2e/*-seo.spec.js` | New pages |
| ISS-001 | `npm run test:iss001` | Layout/CSS |

Full matrix: `requirements/universal-rules/TESTING_RULES.md`

---

<!-- ⛔ LLM STOP: Do not read below this line ⛔ -->

## Archive

<!-- Move completed tests here. LLMs should not load this section. -->

| TEST_ID | REQ_ID | Type | Status | Tests Run | Archived |
|---------|--------|------|--------|-----------|----------|
| TEST-20260126-222306 | REQ-20260126-010 | ISS-001 | COMPLETE | requirements/specs/e2e/iss-design-001.spec.js (snapshots updated) | 2026-01-26 22:34 |
| TEST-20260126-221055 | REQ-20260126-010 | ISS-001 | COMPLETE | requirements/specs/e2e/iss-design-001.spec.js (snapshots updated) | 2026-01-26 22:34 |
| TEST-20260126-221059 | REQ-20260126-010 | E2E | COMPLETE | requirements/specs/e2e/age-calculator.spec.js; requirements/specs/e2e/remortgage-switching.spec.js | 2026-01-26 22:34 |

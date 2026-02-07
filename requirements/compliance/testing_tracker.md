# Testing Tracker

> **Purpose:** Compact log of test runs  
> **LLM Rule:** Read Active section only. STOP at Archive.

---

## Active Tests

| TEST_ID | REQ_ID | ITER_ID | Type | Status | Iterations | Tests Run | Evidence |
| ------- | ------ | ------- | ---- | ------ | ---------- | --------- | -------- |
| TEST-20260207-130600 | REQ-20260207-007 | ITER-20260207-130000 | Unit | PASS | 1/25 | `npx vitest run tests/core/investment-growth-calculator.test.js` (15 passed) | iterations/ITER-20260207-130000.md |
| TEST-20260207-130700 | REQ-20260207-007 | ITER-20260207-130000 | E2E | PASS | 1/25 | `npm run test:e2e -- requirements/specs/e2e/investment-growth-calculator.spec.js` (1 passed) | iterations/ITER-20260207-130000.md |
| TEST-20260207-130800 | REQ-20260207-007 | ITER-20260207-130000 | SEO | PASS | 1/25 | `npm run test:e2e -- requirements/specs/e2e/investment-growth-seo.spec.js` (1 passed) | iterations/ITER-20260207-130000.md |
| TEST-20260207-130900 | REQ-20260207-007 | ITER-20260207-130000 | ISS-001 | PASS | 1/25 | `npm run test:iss001` (9 passed) | iterations/ITER-20260207-130000.md |
| TEST-20260207-131000 | REQ-20260207-007 | ITER-20260207-130000 | SEO | WAIVED | 1/25 | `CHROME_PATH=<WSL Playwright Chrome> npx lighthouse http://127.0.0.1:8002/finance/investment-growth/ --only-categories=performance --output=json` (NO_FCP, headless/no-GUI WSL) | iterations/ITER-20260207-130000.md |
| TEST-20260207-131100 | REQ-20260207-007 | ITER-20260207-130000 | SEO | PASS | 1/25 | `npx pa11y http://127.0.0.1:8002/finance/investment-growth/ --timeout 120000 --wait 1000 --reporter json` (exit 0, 0 issues) | test-results/seo/investment-growth/pa11y.json |
| TEST-20260207-112537 | REQ-20260207-006 | ITER-20260207-112035 | Unit | PASS | 5/25 | `npx vitest run tests/core/savings-goal-calculator.test.js` (5 passed) | iterations/ITER-20260207-112035.md |
| TEST-20260207-112544 | REQ-20260207-006 | ITER-20260207-112035 | E2E | PASS | 6/25 | `npm run test:e2e -- requirements/specs/e2e/savings-goal-calculator.spec.js` (1 passed) | iterations/ITER-20260207-112035.md |
| TEST-20260207-112549 | REQ-20260207-006 | ITER-20260207-112035 | SEO | PASS | 7/25 | `npm run test:e2e -- requirements/specs/e2e/savings-goal-seo.spec.js` (1 passed) | iterations/ITER-20260207-112035.md |
| TEST-20260207-112558 | REQ-20260207-006 | ITER-20260207-112035 | ISS-001 | PASS | 8/25 | `npm run test:iss001` (9 passed in `requirements/specs/e2e/iss-design-001.spec.js`) | iterations/ITER-20260207-112035.md |
| TEST-20260207-112623 | REQ-20260207-006 | ITER-20260207-112035 | SEO | PASS | 9/25 | `CHROME_PATH=<WSL Playwright Chrome> npx lighthouse http://127.0.0.1:8002/finance/savings-goal/ --only-categories=performance --output=json` (score 0.98; FCP 1.76s, LCP 2.00s, CLS 0.0015, TBT 0ms) | test-results/seo/savings-goal/lighthouse-performance.json |
| TEST-20260207-112642 | REQ-20260207-006 | ITER-20260207-112035 | SEO | PASS | 10/25 | `npx pa11y http://127.0.0.1:8002/finance/savings-goal/ --timeout 120000 --wait 1000 --reporter json` (exit 0, 0 issues) | test-results/seo/savings-goal/pa11y.json |
| TEST-20260207-120600 | REQ-20260207-005 | ITER-20260207-120000 | SEO | PASS | 1/25 | `npx pa11y http://127.0.0.1:8002/finance/compound-interest/ --timeout 120000 --wait 1000 --reporter json` (exit 0, 0 issues) | test-results/seo/compound-interest/pa11y.json |
| TEST-20260207-120500 | REQ-20260207-005 | ITER-20260207-120000 | SEO | WAIVED | 1/25 | `CHROME_PATH=<WSL Playwright Chrome> npx lighthouse http://127.0.0.1:8002/finance/compound-interest/ --only-categories=performance` (NO_FCP, headless/no-GUI WSL) | iterations/ITER-20260207-120000.md |
| TEST-20260207-120400 | REQ-20260207-005 | ITER-20260207-120000 | ISS-001 | PASS | 1/25 | `npm run test:iss001` (9 passed in `requirements/specs/e2e/iss-design-001.spec.js`) | iterations/ITER-20260207-120000.md |
| TEST-20260207-120300 | REQ-20260207-005 | ITER-20260207-120000 | SEO | PASS | 1/25 | `npm run test:e2e -- requirements/specs/e2e/compound-interest-seo.spec.js` (1 passed) | iterations/ITER-20260207-120000.md |
| TEST-20260207-120200 | REQ-20260207-005 | ITER-20260207-120000 | E2E | PASS | 1/25 | `npm run test:e2e -- requirements/specs/e2e/compound-interest-calculator.spec.js` (1 passed) | iterations/ITER-20260207-120000.md |
| TEST-20260207-120100 | REQ-20260207-005 | ITER-20260207-120000 | Unit | PASS | 1/25 | `npx vitest run tests/core/compound-interest-calculator.test.js` (12 passed) | iterations/ITER-20260207-120000.md |
| TEST-20260207-111623 | REQ-20260207-008 | ITER-20260207-111221 | Unit | PASS | 5/25 | `npx vitest run tests/core/simple-interest-calculator.test.js` (5 passed) | iterations/ITER-20260207-111221.md |
| TEST-20260207-111629 | REQ-20260207-008 | ITER-20260207-111221 | E2E | PASS | 6/25 | `npm run test:e2e -- requirements/specs/e2e/simple-interest-calculator.spec.js` (1 passed) | iterations/ITER-20260207-111221.md |
| TEST-20260207-111635 | REQ-20260207-008 | ITER-20260207-111221 | SEO | PASS | 7/25 | `npm run test:e2e -- requirements/specs/e2e/simple-interest-seo.spec.js` (1 passed) | iterations/ITER-20260207-111221.md |
| TEST-20260207-111641 | REQ-20260207-008 | ITER-20260207-111221 | ISS-001 | PASS | 8/25 | `npm run test:iss001` (9 passed in `requirements/specs/e2e/iss-design-001.spec.js`) | iterations/ITER-20260207-111221.md |
| TEST-20260207-111757 | REQ-20260207-008 | ITER-20260207-111221 | SEO | PASS | 9/25 | `CHROME_PATH=<WSL Playwright Chrome> npx lighthouse http://127.0.0.1:8002/finance/simple-interest/ --only-categories=performance --output=json` (score 0.99; FCP 1.58s, LCP 1.72s, CLS 0.0011, TBT 0ms) | test-results/seo/simple-interest/lighthouse-performance.json |
| TEST-20260207-111804 | REQ-20260207-008 | ITER-20260207-111221 | SEO | PASS | 10/25 | `npx pa11y http://127.0.0.1:8002/finance/simple-interest/ --timeout 120000 --wait 1000 --reporter json` (exit 0, 0 issues) | test-results/seo/simple-interest/pa11y.json |
| TEST-20260207-114500 | REQ-20260207-003 | ITER-20260207-111500 | ISS-001 | PASS | 1/25 | `npm run test:iss001` (9 passed in `requirements/specs/e2e/iss-design-001.spec.js`) | iterations/ITER-20260207-111500.md |
| TEST-20260207-114300 | REQ-20260207-003 | ITER-20260207-111500 | SEO | PASS | 1/25 | `npm run test:e2e -- requirements/specs/e2e/future-value-of-annuity-seo.spec.js` (1 passed) | iterations/ITER-20260207-111500.md |
| TEST-20260207-114200 | REQ-20260207-003 | ITER-20260207-111500 | E2E | PASS | 1/25 | `npm run test:e2e -- requirements/specs/e2e/future-value-of-annuity-calculator.spec.js` (1 passed) | iterations/ITER-20260207-111500.md |
| TEST-20260207-114100 | REQ-20260207-003 | ITER-20260207-111500 | Unit | PASS | 1/25 | `npx vitest run tests/core/future-value-of-annuity-calculator.test.js` (9 passed) | iterations/ITER-20260207-111500.md |
| TEST-20260207-110430 | REQ-20260207-004 | ITER-20260207-101227 | ISS-001 | PASS | 11/25 | `npm run test:iss001` (9 passed in `requirements/specs/e2e/iss-design-001.spec.js`) | iterations/ITER-20260207-101227.md |
| TEST-20260207-110241 | REQ-20260207-009 | ITER-20260207-105501 | SEO | PASS | 10/25 | `npx pa11y http://127.0.0.1:8002/loans/car-loan/ --timeout 120000 --wait 1000 --reporter json` (exit 0, 0 issues) | test-results/seo/iss-001-shell/pa11y.json |
| TEST-20260207-110240 | REQ-20260207-009 | ITER-20260207-105501 | SEO | PASS | 9/25 | `CHROME_PATH=<WSL Playwright Chrome> npx lighthouse http://127.0.0.1:8002/loans/car-loan/ --only-categories=performance --output=json` (score 0.97; FCP 1.61s, LCP 1.87s, CLS 0.083, TBT 0ms) | test-results/seo/iss-001-shell/lighthouse-performance.json |
| TEST-20260207-110212 | REQ-20260207-009 | ITER-20260207-105501 | SEO | PASS | 8/25 | `npm run test:e2e -- requirements/specs/e2e/car-loan-seo.spec.js` (1 passed) | iterations/ITER-20260207-105501.md |
| TEST-20260207-110208 | REQ-20260207-009 | ITER-20260207-105501 | E2E | PASS | 7/25 | `npm run test:e2e -- requirements/specs/e2e/home-shell.spec.js` (1 passed) | iterations/ITER-20260207-105501.md |
| TEST-20260207-110205 | REQ-20260207-009 | ITER-20260207-105501 | ISS-001 | PASS | 6/25 | `npm run test:iss001` (9 passed) | iterations/ITER-20260207-105501.md |
| TEST-20260207-110149 | REQ-20260207-009 | ITER-20260207-105501 | ISS-001 | PASS | 5/25 | `npx playwright test --update-snapshots=all requirements/specs/e2e/iss-design-001.spec.js` (9 passed; snapshots regenerated) | requirements/specs/e2e/iss-design-001.spec.js-snapshots/ |
| TEST-20260207-101720 | REQ-20260207-004 | ITER-20260207-101227 | SEO | PASS | 9/25 | `npx pa11y http://127.0.0.1:8002/finance/effective-annual-rate/ --timeout 120000 --wait 1000 --reporter json` (exit 0, 0 issues) | iterations/ITER-20260207-101227.md |
| TEST-20260207-101711 | REQ-20260207-004 | ITER-20260207-101227 | SEO | FAIL | 8/25 | `CHROME_PATH=<WSL Chrome> npx lighthouse http://127.0.0.1:8002/finance/effective-annual-rate/ --only-categories=performance` (NO_FCP) | iterations/ITER-20260207-101227.md |
| TEST-20260207-101617 | REQ-20260207-004 | ITER-20260207-101227 | ISS-001 | FAIL | 7/25 | `npm run test:iss001` (5 failed, 4 passed in `requirements/specs/e2e/iss-design-001.spec.js`) | iterations/ITER-20260207-101227.md |
| TEST-20260207-101558 | REQ-20260207-004 | ITER-20260207-101227 | SEO | PASS | 6/25 | `npm run test:e2e -- requirements/specs/e2e/effective-annual-rate-seo.spec.js` (1 passed) | iterations/ITER-20260207-101227.md |
| TEST-20260207-101556 | REQ-20260207-004 | ITER-20260207-101227 | E2E | PASS | 5/25 | `npm run test:e2e -- requirements/specs/e2e/effective-annual-rate-calculator.spec.js` (1 passed) | iterations/ITER-20260207-101227.md |
| TEST-20260207-101554 | REQ-20260207-004 | ITER-20260207-101227 | Unit | PASS | 4/25 | `npx vitest run tests/core/effective-annual-rate-calculator.test.js` (5 passed) | iterations/ITER-20260207-101227.md |
| TEST-20260207-095545 | REQ-20260207-002 | ITER-20260207-092141 | SEO | FAIL | 16/25 | `CHROME_PATH=<WSL Chrome> npx lighthouse http://127.0.0.1:8002/finance/present-value-of-annuity/ --only-categories=performance --chrome-flags="--headless=new --disable-background-timer-throttling --disable-renderer-backgrounding --disable-backgrounding-occluded-windows"` (NO_FCP) | iterations/ITER-20260207-092141.md |
| TEST-20260207-095323 | REQ-20260207-002 | ITER-20260207-092141 | SEO | FAIL | 15/25 | `CHROME_PATH=<WSL Chrome> npx lighthouse http://127.0.0.1:8002/finance/present-value-of-annuity/ --only-categories=performance --chrome-flags="--headless=old"` (NO_FCP) | iterations/ITER-20260207-092141.md |
| TEST-20260207-095322 | REQ-20260207-002 | ITER-20260207-092141 | SEO | FAIL | 15/25 | `CHROME_PATH=<WSL Chrome> npx lighthouse http://127.0.0.1:8002/finance/present-value-of-annuity/ --only-categories=performance --chrome-flags="--window-size=1365,940 --no-sandbox --disable-dev-shm-usage"` (NO_FCP) | iterations/ITER-20260207-092141.md |
| TEST-20260207-094319 | REQ-20260207-002 | ITER-20260207-092141 | SEO | PASS | 13/25 | `npm run test:e2e -- requirements/specs/e2e/present-value-of-annuity-seo.spec.js` (1 passed) | iterations/ITER-20260207-092141.md |
| TEST-20260207-093854 | REQ-20260207-002 | ITER-20260207-092141 | SEO | PASS | 10/25 | `npx pa11y http://127.0.0.1:8002/finance/present-value-of-annuity/ --timeout 120000 --wait 1000 --reporter json` (exit 0, 0 issues) | iterations/ITER-20260207-092141.md |
| TEST-20260207-093848 | REQ-20260207-002 | ITER-20260207-092141 | SEO | FAIL | 9/25 | `CHROME_PATH=<WSL Chrome> npx lighthouse http://127.0.0.1:8002/finance/present-value-of-annuity/ --only-categories=performance` (NO_FCP) | iterations/ITER-20260207-092141.md |
| TEST-20260207-093704 | REQ-20260207-002 | ITER-20260207-092141 | ISS-001 | FAIL | 8/25 | `npm run test:iss001` (5 failed, 4 passed in `requirements/specs/e2e/iss-design-001.spec.js`) | iterations/ITER-20260207-092141.md |
| TEST-20260207-093621 | REQ-20260207-002 | ITER-20260207-092141 | SEO | PASS | 7/25 | `npm run test:e2e -- requirements/specs/e2e/present-value-of-annuity-seo.spec.js` (1 passed) | iterations/ITER-20260207-092141.md |
| TEST-20260207-093550 | REQ-20260207-002 | ITER-20260207-092141 | E2E | PASS | 6/25 | `npm run test:e2e -- requirements/specs/e2e/present-value-of-annuity-calculator.spec.js` (1 passed) | iterations/ITER-20260207-092141.md |
| TEST-20260207-093514 | REQ-20260207-002 | ITER-20260207-092141 | Unit | PASS | 5/25 | `npx vitest run tests/core/present-value-of-annuity-calculator.test.js` (6 passed) | iterations/ITER-20260207-092141.md |
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
| ---- | ------- | ---- |
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
| ------- | ------ | ---- | ------ | --------- | -------- |
| TEST-20260126-222306 | REQ-20260126-010 | ISS-001 | COMPLETE | requirements/specs/e2e/iss-design-001.spec.js (snapshots updated) | 2026-01-26 22:34 |
| TEST-20260126-221055 | REQ-20260126-010 | ISS-001 | COMPLETE | requirements/specs/e2e/iss-design-001.spec.js (snapshots updated) | 2026-01-26 22:34 |
| TEST-20260126-221059 | REQ-20260126-010 | E2E | COMPLETE | requirements/specs/e2e/age-calculator.spec.js; requirements/specs/e2e/remortgage-switching.spec.js | 2026-01-26 22:34 |

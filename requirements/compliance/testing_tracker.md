# Testing Tracker

> **Purpose:** Compact log of test runs  
> **LLM Rule:** Read Active section only. STOP at Archive.

---

## Active Tests

| TEST_ID | REQ_ID | ITER_ID | Type | Status | Iterations | Tests Run | Evidence |
|---------|--------|---------|------|--------|------------|-----------|----------|
| TEST-20260126-201200 | REQ-20260126-006 | ITER-20260126-195916 | SEO | COMPLETE | 1/25 | requirements/specs/e2e/wake-up-time-seo.spec.js | iterations/ITER-20260126-195916.md |
| TEST-20260126-201130 | REQ-20260126-006 | ITER-20260126-195916 | E2E | COMPLETE | 1/25 | requirements/specs/e2e/wake-up-time-calculator.spec.js | iterations/ITER-20260126-195916.md |
| TEST-20260126-201100 | REQ-20260126-006 | ITER-20260126-195916 | Unit | COMPLETE | 1/25 | tests/core/wake-up-time-calculator.test.js | iterations/ITER-20260126-195916.md |
| TEST-20260126-191600 | REQ-20260126-005 | ITER-20260126-185212 | SEO | COMPLETE | 1/25 | requirements/specs/e2e/sleep-time-seo.spec.js | iterations/ITER-20260126-185212.md |
| TEST-20260126-191530 | REQ-20260126-005 | ITER-20260126-185212 | E2E | COMPLETE | 1/25 | requirements/specs/e2e/sleep-time-calculator.spec.js | iterations/ITER-20260126-185212.md |
| TEST-20260126-191500 | REQ-20260126-005 | ITER-20260126-185212 | Unit | COMPLETE | 1/25 | tests/core/sleep-time-calculator.test.js | iterations/ITER-20260126-185212.md |
| TEST-20260126-132348 | REQ-20260126-004 | ITER-20260126-131858 | ISS-001 | COMPLETE | 1/25 | requirements/specs/e2e/iss-001-layout-stability.spec.js (snapshots updated) | iterations/ITER-20260126-131858.md |
| TEST-20260126-120641 | REQ-20260126-003 | ITER-20260126-115903 | ISS-001 | COMPLETE | 1/25 | requirements/specs/e2e/iss-001-layout-stability.spec.js (snapshots updated) | iterations/ITER-20260126-115903.md |
| TEST-20260126-114000 | REQ-20260126-002 | ITER-20260126-113856 | ISS-001 | COMPLETE | 1/25 | requirements/specs/e2e/iss-001-layout-stability.spec.js (snapshots updated) | iterations/ITER-20260126-113856.md |
| TEST-20260126-112942 | REQ-20260126-001 | ITER-20260126-112255 | E2E | COMPLETE | 1/25 | requirements/specs/e2e/remortgage-switching.spec.js | iterations/ITER-20260126-112255.md |
| TEST-20260126-110222 | REQ-20260125-100 | ITER-20260126-105223 | E2E | COMPLETE | 1/25 | requirements/specs/e2e/remortgage-switching.spec.js | iterations/ITER-20260126-105223.md |
| TEST-20260125-114500 | REQ-20260125-007 | ITER-20260125-113300 | E2E | COMPLETE | 1/25 | requirements/specs/e2e/home-shell.spec.js | iterations/ITER-20260125-113300.md |
| TEST-20260125-112000 | REQ-20260125-006 | ITER-20260125-111500 | ISS-001 | COMPLETE | 1/25 | requirements/specs/e2e/iss-001-layout-stability.spec.js (update snapshots) | iterations/ITER-20260125-111500.md |
| TEST-20260125-105400 | REQ-20260125-005 | ITER-20260125-104000 | E2E | COMPLETE | 1/25 | requirements/specs/e2e/home-shell.spec.js | iterations/ITER-20260125-104000.md |
| TEST-20260125-102000 | REQ-20260125-004 | ITER-20260125-101500 | E2E | COMPLETE | 1/25 | requirements/specs/e2e/sitemap-footer.spec.js | iterations/ITER-20260125-101500.md |
| TEST-20260125-102200 | REQ-20260125-004 | ITER-20260125-101500 | SEO | COMPLETE | 1/25 | requirements/specs/e2e/sitemap-seo.spec.js | iterations/ITER-20260125-101500.md |
| TEST-20260124-191200 | REQ-20260124-006 | ITER-20260124-190900 | ISS-001 | COMPLETE | 2/25 | requirements/specs/e2e/iss-design-001.spec.js (update snapshots) | iterations/ITER-20260124-190900.md |
| TEST-20260124-131452 | REQ-20260124-005 | ITER-20260124-130848 | ISS-001 | COMPLETE | 1/25 | requirements/specs/e2e/iss-design-001.spec.js (update snapshots) | iterations/ITER-20260124-130848.md |
| TEST-20260124-183400 | REQ-20260124-004 | ITER-20260124-181500 | ISS-001 | COMPLETE | 1/25 | requirements/specs/e2e/iss-design-001.spec.js (update snapshots) | iterations/ITER-20260124-181500.md |
| TEST-20260124-160100 | REQ-20260124-003 | ITER-20260124-160000 | ISS-001 | COMPLETE | 1/25 | requirements/specs/e2e/iss-design-001.spec.js (update snapshots) | iterations/ITER-20260124-160000.md |
| TEST-20260124-112700 | REQ-20260124-002 | ITER-20260124-112200 | ISS-001 | COMPLETE | 1/25 | requirements/specs/e2e/iss-design-001.spec.js (update snapshots) | iterations/ITER-20260124-112200.md |
| TEST-20260124-141330 | REQ-20260124-001 | ITER-20260124-141230 | ISS-001 | COMPLETE | 3/25 | requirements/specs/e2e/iss-design-001.spec.js (update snapshots) | iterations/ITER-20260124-141230.md |

---

## Test Types (Quick Ref)

| Type | Command | When |
|------|---------|------|
| Unit | `npm run test:unit` | Compute changes |
| E2E | `npm run test:e2e` | UI/flow changes |
| SEO | `npm run test:seo` | New pages |
| ISS-001 | `npm run test:iss001` | Layout/CSS |

Full matrix: `testing_requirements.md`

---

<!-- ⛔ LLM STOP: Do not read below this line ⛔ -->

## Archive

<!-- Move completed tests here. LLMs should not load this section. -->

| TEST_ID | REQ_ID | Type | Status | Tests Run | Archived |
|---------|--------|------|--------|-----------|----------|
| | | | | | |

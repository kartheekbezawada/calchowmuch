# Testing Tracker

> **Purpose:** Compact log of test runs  
> **LLM Rule:** Read Active section only. STOP at Archive.

---

## Active Tests

| TEST_ID | REQ_ID | ITER_ID | Type | Status | Iterations | Tests Run | Evidence |
|---------|--------|---------|------|--------|------------|-----------|----------|
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

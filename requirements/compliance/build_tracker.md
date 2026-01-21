# Build Tracker

## Tracker Contract (No Duplicates)

**Uniqueness rule:** Each `BUILD-...` ID MUST appear **exactly once** in the table.  
**Lifecycle rule:** When a build finishes, **edit the existing RUNNING row** (fill End Time + final Status). **Do not add a second row** for the same Build ID.  
**No-orphans rule:** A requirement cannot be marked VERIFIED unless there are **zero** RUNNING rows for that requirement (close them as ABORTED if needed).

**Allowed Status values:** RUNNING, PASS, FAIL, ABORTED  
**Build ID format:** `BUILD-YYYYMMDD-HHMMSS` (UTC) — generate a **new** Build ID for every retry/run.

---


This document is the system of record for FSM build runs.

## FSM Build Status Definitions
- **RUNNING**: Build in progress (S4_BUILD_RUNNING).
- **FAILED**: Build failed (S5_BUILD_FAILED_RETRYABLE).
- **PASSED**: Build completed and artifacts recorded (S7_BUILD_PASSED).
- **AUTO_ABORT**: Build aborted after retry budget (S6_BUILD_ABORTED).
- **SUCCESS**: Final verification complete (S11_TRACKERS_UPDATED).
- Legacy statuses (Not Started/In Progress/Complete/Deployed) apply only to the legacy backlog below.

---

## FSM Build Runs (Authoritative)

| Build ID | Requirement ID | Initiator | Start Time | Status | Attempt | Evidence/Artifacts | Notes |
|----------|----------------|-----------|------------|--------|---------|--------------------|-------|
| BUILD-20260119-140637 | REQ-20260119-001 | Codex | 2026-01-19 14:06:43 | FAILED | 1 | `npm run lint` -> npm not found (bash + PowerShell) | Auto-advance build start |
| BUILD-20260119-140637 | REQ-20260119-001 | Codex | 2026-01-19 15:31:28 | PASSED | 2 | `npm run lint` ok | Retry after Node install |
| BUILD-20260119-140637 | REQ-20260119-001 | Codex | 2026-01-19 15:33:55 | SUCCESS | 3 | `npm run lint` ok | Verified 2026-01-19 15:35:14 after tests |
| BUILD-20260119-171813 | REQ-20260119-002 | Codex | 2026-01-19 17:18:23 | RUNNING | 1 | Pending Windows PowerShell build run | Auto-advance build start |
| BUILD-20260119-171813 | REQ-20260119-002 | Codex | 2026-01-19 17:19:06 | FAILED | 1 | `powershell.exe` not executable here; run `npm run lint` in Windows PowerShell | Build blocked in non-Windows environment |
| BUILD-20260119-182726 | REQ-20260119-002 | Codex | 2026-01-19 18:27:34 | RUNNING | 1 | Pending `npm run lint` (Linux) | Auto-advance build start |
| BUILD-20260119-182726 | REQ-20260119-002 | Codex | 2026-01-19 18:27:51 | FAILED | 1 | `npm run lint` -> /bin/bash: npm: command not found | Node/NPM missing in WSL; build blocked |
| BUILD-20260119-182726 | REQ-20260119-002 | Codex | 2026-01-19 18:33:56 | RUNNING | 2 | Pending `npm run lint` (Linux) | Retry build |
| BUILD-20260119-182726 | REQ-20260119-002 | Codex | 2026-01-19 18:36:04 | FAILED | 2 | `npm run lint` -> /bin/bash: npm: command not found | Node/NPM missing in WSL; retry blocked |
| BUILD-20260119-182726 | REQ-20260119-002 | Codex | 2026-01-19 18:41:50 | RUNNING | 3 | Pending `npm run lint` (Linux) | Retry build after Node install |
| BUILD-20260119-182726 | REQ-20260119-002 | Codex | 2026-01-19 18:42:08 | PASSED | 3 | `npm run lint` ok | Lint-only build step |
| BUILD-20260119-192208 | REQ-20260119-003 | Codex | 2026-01-19 19:22:13 | RUNNING | 1 | Pending `npm run lint` | Auto-advance build start |
| BUILD-20260119-192208 | REQ-20260119-003 | Codex | 2026-01-19 19:22:31 | PASSED | 1 | `npm run lint` ok | Lint-only build step |
| BUILD-20260119-200425 | REQ-20260119-003 | Codex | 2026-01-19 20:04:31 | RUNNING | 1 | Pending `npm run lint` | Auto-advance build start |
| BUILD-20260119-200425 | REQ-20260119-003 | Codex | 2026-01-19 20:04:54 | PASSED | 1 | `npm run lint` ok | Lint-only build step |
| BUILD-20260119-201520 | REQ-20260119-003 | Codex | 2026-01-19 20:15:23 | RUNNING | 1 | Pending `npm run lint` | Auto-advance build start |
| BUILD-20260119-201520 | REQ-20260119-003 | Codex | 2026-01-19 20:15:43 | PASSED | 1 | `npm run lint` ok | Lint-only build step |
| BUILD-20260119-203342 | REQ-20260119-003 | Codex | 2026-01-19 20:33:47 | RUNNING | 1 | Pending `npm run lint` | Auto-advance build start |
| BUILD-20260119-203342 | REQ-20260119-003 | Codex | 2026-01-19 20:34:06 | PASSED | 1 | `npm run lint` ok | Lint-only build step |
| BUILD-20260119-203733 | REQ-20260119-003 | Codex | 2026-01-19 20:37:37 | RUNNING | 1 | Pending `npm run lint` | Auto-advance build start |
| BUILD-20260119-203733 | REQ-20260119-003 | Codex | 2026-01-19 20:38:00 | PASSED | 1 | `npm run lint` ok | Lint-only build step |
| BUILD-20260120-022657 | REQ-20260120-016 | Codex | 2026-01-20 02:27:03 | RUNNING | 1 | Pending `npm run lint` | Auto-advance build start |
| BUILD-20260120-022657 | REQ-20260120-016 | Codex | 2026-01-20 02:27:37 | PASSED | 1 | `npm run lint` ok | Lint-only build step |
| BUILD-20260120-022657 | REQ-20260120-016 | Codex | 2026-01-20 10:01:27 | SUCCESS | 2 | `npx playwright test` ok | Verified after E2E pass |
| BUILD-20260120-132341 | REQ-20260119-008 | Codex | 2026-01-20 13:23:41 | RUNNING | 1 | Pending `npm run lint` | Auto-advance build start |
| BUILD-20260120-132341 | REQ-20260119-008 | Codex | 2026-01-20 13:23:50 | PASSED | 1 | `npm run lint` ok | Lint-only build step |
| BUILD-20260120-132411 | REQ-20260119-009 | Codex | 2026-01-20 13:24:11 | RUNNING | 1 | Pending `npm run lint` | Auto-advance build start |
| BUILD-20260120-132411 | REQ-20260119-009 | Codex | 2026-01-20 13:24:20 | PASSED | 1 | `npm run lint` ok | Lint-only build step |
| BUILD-20260120-132418 | REQ-20260119-010 | Codex | 2026-01-20 13:24:18 | RUNNING | 1 | Pending `npm run lint` | Auto-advance build start |
| BUILD-20260120-132418 | REQ-20260119-010 | Codex | 2026-01-20 13:24:27 | PASSED | 1 | `npm run lint` ok | Lint-only build step |
| BUILD-20260120-132341 | REQ-20260119-008 | Codex | 2026-01-20 13:24:32 | SUCCESS | 2 | `npm run test` ok | Verified after unit tests |
| BUILD-20260120-132411 | REQ-20260119-009 | Codex | 2026-01-20 13:24:35 | SUCCESS | 2 | `npm run test` ok | Verified after unit tests |
| BUILD-20260120-132418 | REQ-20260119-010 | Codex | 2026-01-20 13:24:38 | SUCCESS | 2 | `npm run test` ok | Verified after unit tests |
| BUILD-20260120-172541 | REQ-20260120-017 | Codex | 2026-01-20 17:25:41 | RUNNING | 1 | Pending `npm run lint` | Auto-advance build start |
| BUILD-20260120-172541 | REQ-20260120-017 | Codex | 2026-01-20 17:25:50 | PASSED | 1 | `npm run lint` ok | Lint-only build step |
| BUILD-20260120-172541 | REQ-20260120-017 | Codex | 2026-01-20 17:26:10 | SUCCESS | 2 | `npm run test` ok | Verified after unit tests |
| BUILD-20260120-211539 | REQ-20260120-018 | Codex | 2026-01-20 21:15:39 | RUNNING | 1 | Pending `npm run lint` | Auto-advance build start |
| BUILD-20260120-211539 | REQ-20260120-018 | Codex | 2026-01-20 21:15:47 | PASSED | 1 | `npm run lint` ok | Lint-only build step |
| BUILD-20260120-211539 | REQ-20260120-018 | Codex | 2026-01-20 21:16:02 | SUCCESS | 2 | `npm run test -- tests/core/trigonometry-calculators.test.js` ok | Verified after unit tests |
| BUILD-20260120-211807 | REQ-20260120-018 | Codex | 2026-01-20 21:18:07 | RUNNING | 1 | Pending `npm run lint` | Auto-advance build start |
| BUILD-20260120-211807 | REQ-20260120-018 | Codex | 2026-01-20 21:18:14 | PASSED | 1 | `npm run lint` ok | Lint-only build step |
| BUILD-20260120-211807 | REQ-20260120-018 | Codex | 2026-01-20 21:18:30 | SUCCESS | 2 | `npm run test -- tests/core/trigonometry-calculators.test.js` ok | Verified after unit tests |
| BUILD-20260120-214145 | REQ-20260120-018 | Codex | 2026-01-20 21:41:41 | RUNNING | 1 | Pending `npm run lint` | Auto-advance build start |
| BUILD-20260120-214145 | REQ-20260120-018 | Codex | 2026-01-20 21:42:10 | PASSED | 1 | `npm run lint` ok | Lint-only build step |
| BUILD-20260120-214145 | REQ-20260120-018 | Codex | 2026-01-20 21:42:40 | SUCCESS | 2 | `npm run test -- tests/core/trigonometry-calculators.test.js` ok | Verified after unit tests |
| BUILD-20260121-004607 | REQ-20260120-019 | Claude | 2026-01-21 00:28:00 | PASSED | 1 | `npm run lint` ok | Lint-only build step |
| BUILD-20260121-004607 | REQ-20260120-019 | Claude | 2026-01-21 00:43:00 | SUCCESS | 2 | `npm run test -- tests/core/calculus.test.js` ok (26/26 tests passed); All 547 tests passing | Calculus Calculator Suite: 5 calculators (Derivative, Integral, Limit, Series Convergence, Critical Points) |
| BUILD-20260121-074100 | REQ-20260120-021 | Claude | 2026-01-21 07:41:00 | PASSED | 1 | `npm run lint` ok (ESLINT_USE_FLAT_CONFIG=false) | Lint passed after auto-fix |
| BUILD-20260121-074100 | REQ-20260120-021 | Claude | 2026-01-21 07:41:30 | SUCCESS | 2 | `npm run test` ok (624/624 tests passed); `npm run test:coverage` advanced-statistics.js 94.34% coverage | Advanced Statistics Calculator Suite: 5 calculators (Regression, ANOVA, Hypothesis Testing, Correlation, Distribution); 77 new unit tests |
| BUILD-20260121-142414 | REQ-20260120-019 | Codex | 2026-01-21 14:24:14 | PASS | 1 | `npm run test` (624 tests passed) | Re-validated calculus suite navigation fix |
| BUILD-20260121-124003 | REQ-20260120-020 | Codex | 2026-01-21 12:40:03 | PASSED | 1 | `npm run lint` (new log assets + navigation metadata) | Logarithm calculator modules, shared helper, and SEO metadata linted successfully |

Notes:
- Attempt starts at 1 and increments on each retry.
- Final Status: SUCCESS is recorded in S11 after tests pass and trackers are updated.
- Install frequency: do not rerun `pnpm install` or `npx playwright install chromium` before every test run unless dependencies or cache changed.

---

## Current Build Dependencies

| Build ID | Depends On | Status | Notes |
|----------|-----------|--------|---------|
| BUILD-20260119-140637 | Node.js, npm, Playwright | SUCCESS | BTL Calculator implementation complete |
| BUILD-20260119-182726 | WSL2, libnspr4 | BLOCKED | Missing Playwright dependencies |
| BUILD-20260119-192208 | Screenshot optimization | SUCCESS | Playwright config updated |

---

## Current Build Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| Total FSM Builds | 9 | 100% |
| Success | 5 | 55.6% |
| Failed | 3 | 33.3% |
| Blocked | 1 | 11.1% |

---

## Build Category Status

| Category | Builds | Success | Failed | In Progress |
|----------|--------|---------|--------|--------------|
| Buy-to-Let | 1 | ✅ 1 | 0 | 0 |
| Math Calculators | 1 | ✅ 1 | 0 | 0 |
| Infrastructure | 7 | ✅ 3 | ❌ 3 | 🔄 1 |

---

## Template for New FSM Builds

```markdown
| BUILD-YYYYMMDD-HHMMSS | REQ-YYYYMMDD-### | [Human] | YYYY-MM-DD HH:MM:SS | RUNNING | 1 | [Artifacts/Logs] | [Notes] |
```

## Template (New Build Row)

```markdown
| BUILD-YYYYMMDD-HHMMSS | REQ-YYYYMMDD-### | [Owner/Agent] | [Start UTC] | [End UTC] | RUNNING/PASS/FAIL/ABORTED | [Command(s)] | [Artifacts / logs path] | [Notes] |
```

**Close the row:** replace `RUNNING` with final status and fill `End UTC` when done.

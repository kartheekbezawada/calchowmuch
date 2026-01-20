# Finite State Machine Workflow (Optimized)

## Purpose
Ship calculator changes with predictable quality. Every change must be traceable:
`REQ → BUILD → TEST → SEO → COMPLIANCE`.

## Fast Path for Agents (Read This, Not Everything)
- Work **diff-first**: open only the files you touched + the single relevant rules file.
- Do **not** reread whole trackers. Add/update **one** row for your run.
- **No duplicates**: Build/Test/Issue IDs appear once; close RUNNING rows by editing-in-place.
- **Compliance-report.md is mandatory**: one row per REQ; no merge without PASS (or explicit waiver).

---

## Roles (Strict)
- **Copilot (Claude)**: creates/edits requirements only. May add SEO placeholders. No build/test/issue/compliance writes.
- **Codex**: implements code, orchestrates build/test/SEO updates, and MUST update compliance-report.

---

## States
S0_IDLE → S1_REQUIREMENT_DRAFTED → S2_PREFLIGHT → S3_READY_TO_BUILD →  
S4_BUILD_RUNNING → (S5_BUILD_FAILED_RETRYABLE | S7_BUILD_PASSED) →  
S8_TEST_RUNNING → (S9_TEST_FAILED_RETRYABLE | S10_TEST_PASSED) →  
S11_TRACKERS_UPDATED → S12_SEO_CHECK → S13_RELEASE_READY → S0_IDLE  
(Any hard stop: S14_ESCALATED)

---

## Test Selection Matrix (Authoritative)

| Change Type | Required Tests (per TEST-1.*) | Optional/Deferred Tests |
|---|---|---|
| Any change scope (general rule) | Run E2E only for calculators you changed; untouched calculators do not need E2E unless it’s a full release sweep | Full‑sweep E2E is limited to 1 calculator per category |
| Calculator compute logic change | Unit tests for compute logic ({PREFIX}-TEST-U-*) per TEST-1.1; meet TEST-1.2 80% coverage | E2E only if UI/flow also changed |
| Calculator UI/flow change | *-TEST-E2E-LOAD, *-TEST-E2E-WORKFLOW for affected calculators | *-TEST-E2E-NAV, *-TEST-E2E-MOBILE, *-TEST-E2E-A11Y |
| Graph/table change (calculator-scoped only) | Unit/integration test validating data mapping; DOM structure check for table semantics (thead/tbody/tfoot) or graph container presence | *-TEST-E2E-WORKFLOW only if user interaction changed |
| Layout/CSS/shared shell change | ISS-001 regression E2E check (no layout shifts, scrollbars visible, no nav ping‑pong) | Full E2E suite |
| Navigation/config change | *-TEST-E2E-NAV for affected domain + ISS-001 | Full E2E suite |
| Accessibility-only change | *-TEST-E2E-A11Y for affected calculators | Full E2E suite |
| No UI changes (pure logic) | Unit tests only (TEST-1.1, TEST-1.2) | E2E skip |

Note: **“Full release sweep”** = run the full unit test suite plus E2E for only **1 representative calculator per category** (not every calculator).

---

## Tracker Update Contract (Hard Rules)
- **Build/Test rows are created once and then edited to close.** Never duplicate IDs.
- **RUNNING rows must be closed** (PASS/FAIL/ABORTED) before a REQ becomes VERIFIED.
- **Compliance-report is the gate**: each REQ gets exactly one row; update it at every stage.

---

## Steps (What Agents Actually Do)

### S1_REQUIREMENT_DRAFTED (Copilot)
- Create `REQ-YYYYMMDD-###`.
- Add row to `requirement_tracker.md` (Status: NEW).
- Add SEO placeholder row if page/scope changed (Status: PENDING).
- Stop.

### S2_PREFLIGHT (Codex)
- Verify REQ exists and is NEW.
- Confirm trackers exist.
- Decide required tests using the matrix.
- Pre-create **one** compliance-report row for this REQ (status NEW/UNVERIFIED).

### S4_BUILD_RUNNING (Codex + Human)
- Create `BUILD-YYYYMMDD-HHMMSS` row in build_tracker with Status RUNNING + Start time.
- Human runs build command(s).
- Close the same row with End time + PASS/FAIL.
- If FAIL: log issue + retry (new BUILD ID) up to budget.

### S8_TEST_RUNNING (Codex + Human)
- Create `TEST-YYYYMMDD-HHMMSS` row in testing_tracker with Status RUNNING + Start time.
- Human runs required tests.
- Close the same row with End time + PASS/FAIL/SKIPPED.
- If FAIL: create issue + retry (new TEST ID) or escalate.

### S11_TRACKERS_UPDATED (Codex)
- requirement_tracker: set REQ = VERIFIED (only if build/test rows are closed).
- compliance-report: update Build/Test IDs + statuses + evidence.
- issue_tracker: ensure any failures created issues.

### S12_SEO_CHECK (Codex)
- If SEO impacted: update the existing SEO row to PASS/FAIL and add evidence.
- If SEO missing: add placeholder PASS + create follow-up issue.

### S13_RELEASE_READY
- Merge allowed only if compliance-report row shows Overall Compliance = PASS (or waiver recorded).

---

## Required Output Per REQ (Minimum)
- 1 row in requirement_tracker (NEW → VERIFIED)
- 1 row in build_tracker (RUNNING → PASS/FAIL)
- 1 row in testing_tracker (RUNNING → PASS/FAIL/SKIPPED)
- 0–1 row in SEO tracker (PENDING → PASS/FAIL or N/A)
- 1 row in compliance-report (mandatory)

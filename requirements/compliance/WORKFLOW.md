# Compliance FSM Workflow (Optimized)

## Purpose

A deterministic, state-driven workflow that turns a **Requirement (REQ)** into a **Build (BUILD)**, a **Test Run (TEST)**, SEO validation (SEO), and a **filled Compliance Report row** — with evidence.

Workflow chain (authoritative):  
`requirement_tracker.md -> build_tracker.md -> testing_tracker.md -> seo_requirements.md -> compliance-report.md`

(See README for the same chain.)

---

## Actors (Who does what)

### Human (you)
- Chooses *what* to build and approves PRs.
- Runs commands locally only when Codex explicitly requests manual execution.

### Copilot / Claude (Requirements author)
- Creates and edits **requirements** (REQ entries) and **rules + test definitions** in build_rules.
- **Never** edits build/test/compliance trackers.

### Codex (Builder / Verifier)
- Implements changes, runs tests, updates trackers **only in allowed FSM states**, and **must update compliance-report.md**.

---

## System of Record (Files + permissions)

| File | Copilot | Codex | Notes |
|------|---------|-------|------|
| `requirement_tracker.md` | ✅ write | ✅ status-only in S11 | REQ is born here |
| `requirements/build_rules/**` | ✅ write | ✅ read | Rules + required test IDs live here |
| `build_tracker.md` | ❌ read | ✅ write | BUILD evidence lives here |
| `testing_tracker.md` | ❌ read | ✅ write | TEST evidence lives here |
| `seo_requirements.md` | ✅ write (placeholders) | ✅ write (S12) | SEO pass/fail evidence |
| `issue_tracker.md` | ✅ read | ✅ write (S6/S9/S12/S14) | Only issues created in-run are blockers |
| `compliance-report.md` | ❌ read | ✅ write (S11 and S13) | **Mandatory output** of every run |

---

## Deterministic ID Formats

- Requirement ID: `REQ-YYYYMMDD-###`
- Build ID: `BUILD-YYYYMMDD-HHMMSS`
- Test Run ID: `TEST-YYYYMMDD-HHMMSS`
- SEO ID:
  - Real: `SEO-...` (from `seo_requirements.md`)
  - Placeholder: `SEO-PENDING-REQ-XXXX` or `SEO-N/A`
- Issue ID: `ISSUE-YYYYMMDD-###`

---

## Core Rules (Non‑negotiable)

1) **Valid transitions only**  
No skipping states. No tracker edits outside the allowed state.

2) **Evidence required**  
Every PASS/FAIL in trackers must include the command run (or CI job link) and key output lines.

3) **Compliance row is mandatory**  
If `compliance-report.md` is not updated for the REQ, the run is **not** considered complete (no S13).

4) **Scope‑aware testing**  
We do not brute-force full E2E for everything. We test what changed, plus one small “release sweep” sample when needed.

---

## Test Policy (Authoritative)

**Change Type → Required vs Optional/Deferred tests**

| Change Type | Required Tests (per TEST-1.*) | Optional / Deferred |
|---|---|---|
| Any change scope (general rule) | Run E2E **only** for calculators you changed; untouched calculators do not need E2E unless it’s a full release sweep | Full‑sweep E2E is limited to **1 calculator per category** |
| Calculator compute logic change | Unit tests for compute logic (`{PREFIX}-TEST-U-*`) per **TEST-1.1**; meet **TEST-1.2** 80% coverage | E2E only if UI/flow also changed |
| Calculator UI/flow change | `{PREFIX}-TEST-E2E-LOAD`, `{PREFIX}-TEST-E2E-WORKFLOW` for affected calculators | `{PREFIX}-TEST-E2E-NAV`, `{PREFIX}-TEST-E2E-MOBILE`, `{PREFIX}-TEST-E2E-A11Y` |
| Graph/table change (calculator-scoped only) | Unit/integration test validating data mapping; DOM structure check for table semantics (`thead/tbody/tfoot`) or graph container presence | `{PREFIX}-TEST-E2E-WORKFLOW` only if user interaction changed |
| Layout/CSS/shared shell change | `ISS-001` regression E2E check (no layout shifts, scrollbars visible, no nav ping‑pong) | Full E2E suite |
| Navigation/config change | `{PREFIX}-TEST-E2E-NAV` for affected domain + `ISS-001` | Full E2E suite |
| Accessibility-only change | `{PREFIX}-TEST-E2E-A11Y` for affected calculators | Full E2E suite |
| No UI changes (pure logic) | Unit tests only (**TEST-1.1, TEST-1.2**) | E2E skip |

**Definition:** “Full release sweep” = run full unit test suite + E2E for **1 representative calculator per category** (not every calculator).

### TEST-1.* (Workflow-local definitions)
- **TEST-1.1**: Unit tests must cover changed compute logic paths and edge cases.
- **TEST-1.2**: Coverage must be **≥ 80%** for the touched logic module(s) (or project coverage if that’s how CI reports it).

---

## How tests are decided (no guesswork)

Copilot must record the **Change Type** inside the REQ (in Description or Notes).  
If missing, Codex defaults to **“Any change scope”** and enforces the required row above.

Copilot must define associated **Test IDs** in the relevant `requirements/build_rules/*` mapping table (5-column format).

Codex must execute the **Required Tests** and record results in `testing_tracker.md`.

---

## Auto‑Advance Mode (Default)

After S2_PREFLIGHT, Codex proceeds through the next legal state automatically unless blocked. Human only steps in for manual command execution when requested.

---

## FSM States (Single REQ run)

### S0_IDLE
- No active REQ.
- Trigger: Human asks Copilot to create a requirement.
- Transition: `EVT_NEW_REQUIREMENT_REQUEST` → S1

### S1_REQUIREMENT_DRAFTED (Owner: Copilot)
**Goal:** Create a REQ that is testable + traceable.
- Must append REQ to `requirement_tracker.md` with Status `NEW`.  
- Must update the relevant build_rules file:
  - Add REQ to the **Requirement ID Mapping** table (5 columns; bullet lists with `<br>`).
  - Include: Rule IDs and Test IDs.
- If SEO Impact is YES/UNKNOWN:
  - Add entry in `seo_requirements.md` with `SEO-PENDING-REQ-...` (or real SEO ID) and Status `PENDING`.
- Must declare **Change Type** (from the Test Policy table) in REQ Description/Notes.

Output: “REQ created. Ready for `EVT_START_BUILD REQ-...`”.

### S2_PREFLIGHT (Owner: Codex)
**Goal:** Ensure the run can be executed deterministically.
- Verify REQ exists and is `NEW`.
- Verify required tracker files exist; create from templates if missing.
- Verify build_rules mapping exists for the REQ (rules + test IDs).
- Create/ensure a **compliance-report row exists** for the REQ with “In Progress” statuses.

Transition: `EVT_PREFLIGHT_OK` → S3

### S3_READY_TO_BUILD (Owner: Codex)
- Confirm prerequisites (node/pnpm installed, deps installed, etc.)
Transition: `EVT_START_BUILD` → S4

### S4_BUILD_RUNNING (Owner: Codex)
- Create `BUILD-...` and append row in `build_tracker.md` with Status `RUNNING`.
- Implement changes.
- Run build steps (lint/build) as defined by repo scripts.

### S5_BUILD_FAILED_RETRYABLE
- Log failure (attempt++), capture error, create issue only if persistent.
- Transition: `EVT_RETRY_BUILD` → S4, or `EVT_ABORT_BUILD` → S6

### S6_BUILD_ABORTED
- Update build_tracker row to `AUTO_ABORT`.
- Create `ISSUE-...` with root cause + next action.
- Transition: `EVT_ESCALATE` → S14

### S7_BUILD_PASSED
- Update build_tracker row to `SUCCESS` with evidence.
Transition: `EVT_START_TESTS` → S8

### S8_TEST_RUNNING (Owner: Codex)
- Create `TEST-...` and append row in `testing_tracker.md` with Status `RUNNING`.
- Execute **Required Tests** per the Test Policy table (based on Change Type).
- Record commands + key output.

### S9_TEST_FAILED_RETRYABLE
- Update testing_tracker with FAIL evidence.
- Create `ISSUE-...` if not a one-off (or if it blocks release).
- Transition: `EVT_RETRY_FIX` → S2, or `EVT_ESCALATE` → S14

### S10_TEST_PASSED
- Update testing_tracker to `PASS` with evidence.
Transition: `EVT_UPDATE_TRACKERS` → S11

### S11_TRACKERS_UPDATED (Owner: Codex)
**Goal:** Lock traceability.
- Update `requirement_tracker.md` REQ Status to `VERIFIED`.
- Ensure SEO placeholder exists (if needed).
- **Update `compliance-report.md` row for the REQ**:
  - Fill Build ID/Status, Test ID/Status, SEO ID/Status, Universal Requirements Followed, Overall Compliance, Evidence/Notes.
- If any required field missing → **do not proceed**.

Transition: `EVT_RUN_SEO_CHECK` → S12

### S12_SEO_CHECK (Owner: Codex)
- If SEO Impact is NO → mark SEO as `SEO-N/A` and Status `PASS`.
- If SEO Impact is YES/UNKNOWN → validate SEO items and update `seo_requirements.md` (PASS/FAIL + evidence).
- If SEO fails → create issue and block release.

Transition: `EVT_SEO_OK` → S13 or `EVT_ESCALATE` → S14

### S13_RELEASE_READY (Owner: Codex)
- Finalize compliance row:
  - Set Overall Compliance = PASS only if REQ=VERIFIED, BUILD=SUCCESS, TEST=PASS, SEO=PASS/N-A, Universal=PASS.
- Output: “Release-ready for PR merge.”

### S14_ESCALATED
- Blocking issue exists; waiting for fix. Next fix restarts from S2.

---

## CI / PR Flow (Recommended default)

On every PR (Linux runner):
- Install deps (`pnpm install`)
- Run lint + unit tests
- Run E2E **only** for affected calculators (or the representative “full release sweep” sample when requested)
- Publish artifacts: Playwright report + coverage summary

A PR must not be merged unless the relevant CI jobs are green **and** the compliance-report row is updated for that REQ.

---

## Agent Optimization Rules (stop wasting cycles)

- **Context Pack rule:** Agents only read:
  1) the REQ row, 2) the referenced build_rules mapping, 3) the exact files they change, 4) relevant Universal rule IDs, 5) relevant tests.
- **No “global reread”:** no scanning the whole repo unless the change type is Layout/CSS/shared shell or Navigation/config.
- **Evidence-first:** If a step took time, it must show up as evidence in trackers — otherwise it didn’t happen.

---

## Command Contract (human → agents)

- “Copilot: create requirement for …”
- “EVT_START_BUILD REQ-YYYYMMDD-###”
- “Codex: process REQ-YYYYMMDD-###”
- “Codex: retry build” / “Codex: abort” / “Codex: check status”

Invalid transition response must be exactly:
`INVALID TRANSITION: current_state -> requested_state; required_state: X`

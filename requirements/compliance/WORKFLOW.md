# Compliance FSM Workflow

## Purpose

Define an unskippable, deterministic workflow where:
- Copilot only creates/updates requirement definitions.
- Codex only implements, validates, and updates trackers.
- Human triggers the flow once; Codex auto-advances through allowed states (no CI).
- The FSM prevents invalid transitions and out-of-order tracker writes.

## Actors

- HUMAN_TRIGGER: Initiates Copilot or Codex actions; runs commands only if Codex requests manual execution.
- COPILOT: Requirement authoring and ID assignment.
- CODEX: Implementation, local build/test orchestration, and tracker updates.

## System of Record (State Storage)

State is stored in Markdown trackers only (no hidden state). Required files in this folder:
- requirement_tracker.md
- build_tracker.md
- testing_tracker.md
- seo_requirements.md
- issue_tracker.md

If a required file is missing, Codex creates it using templates during S2_PREFLIGHT.

## Deterministic ID Formats

- Requirement ID: REQ-YYYYMMDD-###
- Build ID: BUILD-YYYYMMDD-HHMMSS
- Test Run ID: TEST-YYYYMMDD-HHMMSS
- SEO ID:
  - Real: SEO-... (from seo_requirements.md)
  - Placeholder: SEO-PENDING-REQ-XXXX or SEO-N/A
- Issue ID (only when created during this run): ISSUE-YYYYMMDD-###

## Core Rule: Valid Transition Only

- No tracker updates unless the FSM state permits it.
- No skipping states.
- No partial completion without logging.
- Invalid transition response must be:
  "INVALID TRANSITION: current_state -> requested_state; required_state: X"
  and stop.

## Auto-Advance Mode (Default)

After S2_PREFLIGHT, Codex automatically emits the next allowed EVT_* transition and proceeds unless blocked. The human does not need to type EVT_* commands unless they want to pause, override, or manually run a command.

## Finite-State Machine

### S0_IDLE
- Meaning: No active requirement being processed.
- Allowed triggers: Human asks Copilot to create a requirement.
- Transition: On EVT_NEW_REQUIREMENT_REQUEST -> S1_REQUIREMENT_DRAFTED

### S1_REQUIREMENT_DRAFTED
- Owner: COPILOT
- Guard: Requirement ID generated and appended to requirement_tracker.md with Status: NEW.
- Mandatory actions:
  - Add REQ entry to requirement_tracker.md with: ID, Title, Description, Owner, Scope/Pages, SEO Impact, Status: NEW.
  - If SEO Impact is YES/UNKNOWN, ensure seo_requirements.md has an entry:
    - SEO ID (real if known, else placeholder)
    - Status: PENDING
  - Update calculator-specific rules file in `requirements/build_rules/` (MANDATORY):
    - Add new REQ ID to the "Requirement ID Mapping" table using the **5-column format**:
      - Column 1: Requirement ID
      - Column 2: Calculator (or Component)
      - Column 3: Associated Rule IDs (bullet list with `<br>` separators)
      - Column 4: Associated Test IDs (bullet list with `<br>` separators)
      - Column 5: Date Created
    - Use bullet format: `• RULE-ID-1<br>• RULE-ID-2<br>• RULE-ID-3` (NOT comma-separated)
    - Add detailed rule definitions at end of file with rule IDs referenced in mapping table
    - Add test requirement definitions with test IDs referenced in mapping table
    - Location: `requirements/build_rules/loans/` or `requirements/build_rules/math/`
  - **MANDATORY DEFAULT TESTS** (MUST be included for ALL requirements):
    - `{PREFIX}-TEST-E2E-LOAD`: Playwright test - Calculator page loads correctly
    - `{PREFIX}-TEST-E2E-NAV`: Playwright test - Navigation and deep-linking works
    - `{PREFIX}-TEST-E2E-WORKFLOW`: Playwright test - Complete user workflow end-to-end
    - `{PREFIX}-TEST-E2E-MOBILE`: Playwright test - Mobile responsiveness
    - `{PREFIX}-TEST-E2E-A11Y`: Playwright test - Accessibility compliance
    - Additional requirement-specific tests as needed
- Copilot confirms: "REQ-YYYYMMDD-### created. Ready for EVT_START_BUILD."
- Transition: On **EVT_START_BUILD REQ-YYYYMMDD-###** -> S2_PREFLIGHT

### S2_PREFLIGHT
- Owner: CODEX
- Guard: Human explicitly triggers with **"EVT_START_BUILD REQ-YYYYMMDD-###"** command.
- This is the permission gate - Codex MUST NOT proceed without this trigger.
- Mandatory actions:
  - Confirm required files exist; if missing, create templates:
    - requirement_tracker.md (hard required; if missing and cannot be created -> stop)
    - build_tracker.md
    - testing_tracker.md
    - seo_requirements.md
    - issue_tracker.md
  - Verify the REQ exists and is NEW or UNVERIFIED.
  - Read build rules from `requirements/build_rules/` (loans/ or math/)
- Issue tracker rule (no-CI mode):
  - Existing issues are not in scope.
  - Only issues created during this FSM run count as active.
  - Codex must not pull in old issues to block progress.
- Transition: On EVT_PREFLIGHT_OK -> S3_READY_TO_BUILD

### S3_READY_TO_BUILD
- Owner: CODEX
- Meaning: All prerequisites satisfied; build can start.
- Transition: On EVT_START_BUILD -> S4_BUILD_RUNNING
- Default: Codex triggers EVT_START_BUILD immediately after S2_PREFLIGHT.

### S4_BUILD_RUNNING
- Owner: CODEX (runs commands by default)
- Entry actions:
  - Create Build ID.
  - Append to build_tracker.md:
    - Build ID, REQ ID, initiator (human or Codex), start time, Status: RUNNING, Attempt: 1
  - Run build commands (project-defined) or request manual execution if needed.
  - Record logs/artifacts link/paths.
- Transitions:
  - On EVT_BUILD_PASS -> S7_BUILD_PASSED
  - On EVT_BUILD_FAIL -> S5_BUILD_FAILED_RETRYABLE

### S5_BUILD_FAILED_RETRYABLE
- Owner: CODEX
- Guard: attempts < 10
- Actions:
  - Append attempt result in build_tracker.md.
  - Increment attempt counter.
  - If transient failure suspected -> retry.
  - If attempts == 10 -> transition to abort.
- Transitions:
  - If attempts < 10 and retry is appropriate -> S4_BUILD_RUNNING
  - If attempts >= 10 -> S6_BUILD_ABORTED

### S6_BUILD_ABORTED
- Owner: CODEX
- Entry actions:
  - Update build_tracker.md: Status: AUTO_ABORT.
  - Create a new issue in issue_tracker.md:
    - Root cause summary, logs, owner: Release Owner, priority: HIGH
- Transition: On EVT_ESCALATE -> S14_ESCALATED

### S7_BUILD_PASSED
- Owner: CODEX
- Entry actions:
  - Update build_tracker.md: Status: PASSED + artifact links.
- Transition: On EVT_START_TEST -> S8_TEST_RUNNING
- Default: Codex triggers EVT_START_TEST immediately after S7_BUILD_PASSED.

### S8_TEST_RUNNING
- Owner: CODEX (runs commands by default)
- Entry actions:
  - Create Test Run ID.
  - Append to testing_tracker.md:
    - Test Run ID, Build ID, start timestamp, Status: RUNNING
  - Run full test suite or request manual execution if needed.
  - Capture evidence.
- Transitions:
  - On EVT_TEST_PASS -> S10_TEST_PASSED
  - On EVT_TEST_FAIL -> S9_TEST_FAILED_RETRYABLE

### S9_TEST_FAILED_RETRYABLE
- Owner: CODEX
- Guard: build attempts remaining < 10 (shared retry budget) OR project-defined test-retry budget
- Actions:
  - Update testing_tracker.md: FAIL with evidence.
  - Create new issue in issue_tracker.md (only for this run).
  - Trigger rebuild attempt (counts toward retry limit).
- Transitions:
  - If retries remain -> S4_BUILD_RUNNING
  - If retries exhausted -> S14_ESCALATED

### S10_TEST_PASSED
- Owner: CODEX
- Entry actions:
  - Update testing_tracker.md: PASS + evidence links.
- Transition: On EVT_UPDATE_TRACKERS -> S11_TRACKERS_UPDATED

### S11_TRACKERS_UPDATED
- Owner: CODEX
- Mandatory actions:
  - build_tracker.md: Final Status: SUCCESS + verification timestamp.
  - requirement_tracker.md: Mark REQ as VERIFIED, link evidence (test/artifacts).
- Transition: On EVT_RUN_SEO_CHECK -> S12_SEO_CHECK

### S12_SEO_CHECK
- Owner: CODEX
- Actions:
  - Validate SEO items if they exist for the pages touched.
  - Missing SEO Page Rule (no-CI version):
    - If seo_requirements.md is missing OR relevant SEO items not present for changed pages:
      - Add placeholder entry in seo_requirements.md (or in requirement notes):
        - SEO Status: PASS
        - SEO ID: SEO-N/A or SEO-PENDING-REQ-XXXX
      - Create follow-up issue in issue_tracker.md assigned to SEO Owner.
    - If SEO items exist:
      - Mark PASS/FAIL in seo_requirements.md and link evidence.
  - SEO FAIL creates an issue but does not block release readiness.
- Transition: On EVT_SEO_DONE -> S13_RELEASE_READY

### S13_RELEASE_READY
- Meaning: Requirement implemented + verified + SEO handled (or placeholder created).
- Exit: Human can merge/release manually.
- Transition: On EVT_CLOSE -> S0_IDLE

### S14_ESCALATED
- Meaning: Workflow cannot continue without humans resolving issues.
- Entry actions:
  - Ensure issue is logged with owner, priority, and evidence.
  - Do not modify requirement status beyond UNVERIFIED.
- Transition: On EVT_FIX_AVAILABLE -> S2_PREFLIGHT (restart flow for same REQ)

## Transition Table (Quick Guardrail)

Allowed transitions only:
- S0 -> S1
- S1 -> S2
- S2 -> S3
- S3 -> S4
- S4 -> S5 or S7
- S5 -> S4 or S6
- S6 -> S14
- S7 -> S8
- S8 -> S9 or S10
- S9 -> S4 or S14
- S10 -> S11
- S11 -> S12
- S12 -> S13
- S13 -> S0
- S14 -> S2

Any other transition is INVALID.

## Agent Enforcement Rules

- Copilot is allowed to act only in:
  - S0_IDLE (receive request)
  - S1_REQUIREMENT_DRAFTED (write requirement + SEO placeholder only)
- If Copilot tries to update build/testing trackers -> INVALID.

- Codex is allowed to act only in S2 through S14.
- Codex must refuse to implement anything if the REQ has not been registered.

## "Next Time" Command Contract

When you say:
- "Copilot: create requirement ..."
  - Copilot must produce REQ-... and move state to S1.
- "Codex: process REQ-YYYYMMDD-###"
  - Codex must verify REQ exists and is NEW/UNVERIFIED.
  - Codex starts at S2_PREFLIGHT.
  - Codex follows transitions until S13 or S14.
  - Codex updates trackers only when allowed by state.

---

## Copilot (Claude) Workflow Summary

### Copilot Role
Copilot is responsible for **requirement authoring and ID assignment only**.

### Copilot Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COPILOT (CLAUDE) WORKFLOW                           │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │   S0_IDLE    │◄────────────────────────────────────────────────────┐
    │  (Waiting)   │                                                     │
    └──────┬───────┘                                                     │
           │                                                             │
           │ User: "Copilot: create requirement for [X]"                 │
           ▼                                                             │
    ┌──────────────────────────────────────────────────────────┐         │
    │              S1_REQUIREMENT_DRAFTED                       │         │
    │                                                          │         │
    │  1. Generate REQ-YYYYMMDD-###                            │         │
    │  2. Add to requirement_tracker.md (Status: NEW)          │         │
    │  3. Check SEO Impact:                                    │         │
    │     ├─ YES/UNKNOWN → Add SEO-PENDING-REQ-XXXX            │         │
    │     └─ NO → Skip SEO entry                               │         │
    │  4. Confirm to user: "Requirement registered"            │         │
    └──────────────────────────────────────────────────────────┘         │
           │                                                             │
           │ EVT_REQUIREMENT_REGISTERED                                  │
           ▼                                                             │
    ┌──────────────────────────────────────────────────────────┐         │
    │              HANDOFF TO CODEX                            │         │
    │                                                          │         │
    │  User: "Codex: process REQ-YYYYMMDD-###"                 │         │
    │  Copilot: STOP (Codex takes over from S2)                │         │
    └──────────────────────────────────────────────────────────┘         │
           │                                                             │
           │ ... Codex completes workflow ...                            │
           │                                                             │
           └─────────────────────────────────────────────────────────────┘
                              (Back to S0_IDLE)
```

### Copilot Allowed Actions

| State | Allowed Actions |
|-------|-----------------|
| S0_IDLE | Receive requirement requests |
| S1_REQUIREMENT_DRAFTED | Create REQ entry, add SEO placeholder, update calculator rules files |
| S2-S14 | ❌ NOT ALLOWED (Codex territory) |

### Copilot File Access

| File | Access Level |
|------|--------------|
| `requirement_tracker.md` | ✅ Add NEW entries |
| `seo_requirements.md` | ✅ Add PENDING entries |
| Calculator rules files in `requirements/build_rules/` | ✅ Update requirement mapping tables and add rule/test definitions |
| `build_tracker.md` | ❌ Read only |
| `testing_tracker.md` | ❌ Read only |
| `issue_tracker.md` | ❌ Read only |
| `compliance-report.md` | ❌ Read only |

### Requirement ID Mapping Table Template (MANDATORY FORMAT)

When Copilot creates/updates requirement mapping tables in build_rules files, ALWAYS use this exact 5-column format with bullet lists:

```markdown
| Requirement ID | Calculator | Associated Rule IDs | Associated Test IDs | Date Created |
|----------------|------------|---------------------|---------------------|---------------|
| REQ-YYYYMMDD-### | Calculator Name | • RULE-1<br>• RULE-2<br>• RULE-3 | • TEST-U-1<br>• TEST-E2E-1 | YYYY-MM-DD |
```

**Format Rules:**
- Column 3 (Rule IDs): Use bullet format `• RULE-ID<br>` for each rule, NOT comma-separated
- Column 4 (Test IDs): Use bullet format `• TEST-ID<br>` for each test, NOT comma-separated
- Every requirement MUST have associated test IDs defined
- `<br>` creates line breaks within the table cell for readability

### Copilot Commands

| User Command | Copilot Response |
|--------------|------------------|
| "Copilot: create requirement for [X]" | Generate REQ ID, update trackers and build_rules, confirm with "Ready for EVT_START_BUILD" |
| "Check requirements status" | List pending NEW requirements |

### Codex Trigger Command

| User Command | Codex Action |
|--------------|--------------|
| **"EVT_START_BUILD REQ-YYYYMMDD-###"** | Validate REQ exists, enter S2_PREFLIGHT, auto-advance through build/test/release |

---

## Codex Workflow Summary

### Codex Role
Codex is responsible for **implementation, build/test orchestration, and tracker updates**.

### Codex Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CODEX WORKFLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

    User: "Codex: process REQ-YYYYMMDD-###"
                    │
                    ▼
    ┌───────────────────────────────────────┐
    │           S2_PREFLIGHT                │
    │  • Verify REQ exists (NEW/UNVERIFIED) │
    │  • Check all tracker files exist      │
    │  • Create missing templates           │
    │  • No blocking issues from this run   │
    └───────────────┬───────────────────────┘
                    │ EVT_PREFLIGHT_OK
                    ▼
    ┌───────────────────────────────────────┐
    │         S3_READY_TO_BUILD             │
    │  • All prerequisites satisfied        │
    └───────────────┬───────────────────────┘
                    │ EVT_START_BUILD
                    ▼
    ┌───────────────────────────────────────┐         ┌─────────────────────┐
    │          S4_BUILD_RUNNING             │         │  S6_BUILD_ABORTED   │
    │  • Create BUILD-YYYYMMDD-HHMMSS       │         │  • Status: AUTO_ABORT│
    │  • Update build_tracker.md            │         │  • Create issue     │
    │  • Human runs build commands          │         │  • Escalate         │
    └───────────────┬───────────────────────┘         └──────────┬──────────┘
                    │                                            │
         ┌──────────┴──────────┐                                 │
         │                     │                                 ▼
    EVT_BUILD_PASS        EVT_BUILD_FAIL                 ┌───────────────┐
         │                     │                         │ S14_ESCALATED │
         │                     ▼                         │ • Log issue   │
         │         ┌───────────────────────┐             │ • Wait fix    │
         │         │ S5_BUILD_FAILED_RETRY │             └───────┬───────┘
         │         │ • Attempt < 10?       │                     │
         │         │ • Log attempt         │                     │
         │         └───────────┬───────────┘                     │
         │                     │                                 │
         │         ┌───────────┴───────────┐                     │
         │    Retry (< 10)          Exhausted (≥ 10)             │
         │         │                       │                     │
         │         └──────┐                └─────────────────────┤
         │                │                                      │
         │                ▼                                      │
         │    ┌───────────────────────┐                          │
         │    │   (Back to S4)        │                          │
         │    └───────────────────────┘                          │
         │                                                       │
         ▼                                                       │
    ┌───────────────────────────────────────┐                    │
    │          S7_BUILD_PASSED              │                    │
    │  • Status: PASSED                     │                    │
    │  • Record artifacts                   │                    │
    └───────────────┬───────────────────────┘                    │
                    │ EVT_START_TEST                             │
                    ▼                                            │
    ┌───────────────────────────────────────┐                    │
    │          S8_TEST_RUNNING              │                    │
    │  • Create TEST-YYYYMMDD-HHMMSS        │                    │
    │  • Update testing_tracker.md          │                    │
    │  • Human runs test suite              │                    │
    └───────────────┬───────────────────────┘                    │
                    │                                            │
         ┌──────────┴──────────┐                                 │
         │                     │                                 │
    EVT_TEST_PASS         EVT_TEST_FAIL                          │
         │                     │                                 │
         │                     ▼                                 │
         │         ┌───────────────────────┐                     │
         │         │ S9_TEST_FAILED_RETRY  │─────────────────────┤
         │         │ • Create issue        │   (if exhausted)    │
         │         │ • Retry → S4          │                     │
         │         └───────────────────────┘                     │
         │                                                       │
         ▼                                                       │
    ┌───────────────────────────────────────┐                    │
    │          S10_TEST_PASSED              │                    │
    │  • Status: PASS                       │                    │
    │  • Record evidence                    │                    │
    └───────────────┬───────────────────────┘                    │
                    │ EVT_UPDATE_TRACKERS                        │
                    ▼                                            │
    ┌───────────────────────────────────────┐                    │
    │        S11_TRACKERS_UPDATED           │                    │
    │  • build_tracker: SUCCESS             │                    │
    │  • requirement_tracker: VERIFIED      │                    │
    └───────────────┬───────────────────────┘                    │
                    │ EVT_RUN_SEO_CHECK                          │
                    ▼                                            │
    ┌───────────────────────────────────────┐                    │
    │          S12_SEO_CHECK                │                    │
    │  • Validate SEO items                 │                    │
    │  • Missing? Add placeholder + issue   │                    │
    │  • SEO FAIL → issue (no block)        │                    │
    └───────────────┬───────────────────────┘                    │
                    │ EVT_SEO_DONE                               │
                    ▼                                            │
    ┌───────────────────────────────────────┐                    │
    │         S13_RELEASE_READY             │                    │
    │  • All checks complete                │                    │
    │  • Human can merge/release            │                    │
    └───────────────┬───────────────────────┘                    │
                    │ EVT_CLOSE                                  │
                    ▼                                            │
    ┌───────────────────────────────────────┐                    │
    │           S0_IDLE                     │◄───────────────────┘
    │  (Cycle complete, ready for next)     │     EVT_FIX_AVAILABLE
    └───────────────────────────────────────┘     (restart from S2)
```

### Codex Allowed Actions

| State | Allowed Actions |
|-------|-----------------|
| S0_IDLE | ❌ NOT ALLOWED (Copilot territory) |
| S1_REQUIREMENT_DRAFTED | ❌ NOT ALLOWED (Copilot territory) |
| S2_PREFLIGHT | Verify REQ, check files, create templates |
| S3_READY_TO_BUILD | Confirm prerequisites |
| S4_BUILD_RUNNING | Create Build ID, update build_tracker, run build |
| S5_BUILD_FAILED_RETRYABLE | Log attempt, retry or escalate |
| S6_BUILD_ABORTED | Update status, create issue, escalate |
| S7_BUILD_PASSED | Update status, record artifacts |
| S8_TEST_RUNNING | Create Test ID, update testing_tracker, run tests |
| S9_TEST_FAILED_RETRYABLE | Create issue, retry or escalate |
| S10_TEST_PASSED | Update status, record evidence |
| S11_TRACKERS_UPDATED | Update all trackers to SUCCESS/VERIFIED |
| S12_SEO_CHECK | Validate SEO, add placeholders if needed |
| S13_RELEASE_READY | Confirm release readiness |
| S14_ESCALATED | Log issue, wait for fix |

### Codex File Access

| File | Access Level |
|------|--------------|
| `requirement_tracker.md` | ✅ Update status (VERIFIED) in S11 |
| `seo_requirements.md` | ✅ Update status (PASS/FAIL) in S12 |
| `build_tracker.md` | ✅ Full access (create, update) |
| `testing_tracker.md` | ✅ Full access (create, update) |
| `issue_tracker.md` | ✅ Create issues in S6, S9, S12, S14 |
| `compliance-report.md` | ✅ Update after S13 |

### Codex Retry Logic

```
┌─────────────────────────────────────────────────────────┐
│                    RETRY BUDGET: 10                     │
├─────────────────────────────────────────────────────────┤
│  Attempt 1  │ Build/Test fails → Retry                  │
│  Attempt 2  │ Build/Test fails → Retry                  │
│  ...        │ ...                                       │
│  Attempt 10 │ Build/Test fails → AUTO_ABORT → ESCALATE  │
└─────────────────────────────────────────────────────────┘
```

### Codex Commands

| User Command | Codex Response |
|--------------|----------------|
| "Codex: process REQ-YYYYMMDD-###" | Start S2_PREFLIGHT, follow FSM |
| "Codex: retry build" | Resume from S4_BUILD_RUNNING |
| "Codex: check status" | Report current FSM state |
| "Codex: abort" | Move to S14_ESCALATED |

---

## Combined Workflow Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     COMPLETE FSM WORKFLOW OVERVIEW                          │
└─────────────────────────────────────────────────────────────────────────────┘

  COPILOT TERRITORY                    CODEX TERRITORY
  ─────────────────                    ────────────────

  ┌─────────────┐                      
  │  S0_IDLE    │                      
  └──────┬──────┘                      
         │                             
         ▼                             
  ┌─────────────┐                      
  │ S1_DRAFTED  │──────────────────────┬───────────────────────────────────┐
  └─────────────┘                      │                                   │
                                       ▼                                   │
                                ┌─────────────┐                            │
                                │ S2_PREFLIGHT│                            │
                                └──────┬──────┘                            │
                                       │                                   │
                                       ▼                                   │
                                ┌─────────────┐                            │
                                │ S3_READY    │                            │
                                └──────┬──────┘                            │
                                       │                                   │
                         ┌─────────────┴─────────────┐                     │
                         ▼                           ▼                     │
                  ┌─────────────┐             ┌─────────────┐              │
                  │ S4_BUILD   │◄────────────│ S5_RETRY    │              │
                  └──────┬──────┘             └──────┬──────┘              │
                         │                           │                     │
                         │                           ▼                     │
                         │                    ┌─────────────┐              │
                         │                    │ S6_ABORT    │──────┐       │
                         │                    └─────────────┘      │       │
                         ▼                                         │       │
                  ┌─────────────┐                                  │       │
                  │ S7_PASSED   │                                  │       │
                  └──────┬──────┘                                  │       │
                         │                                         │       │
                         ▼                                         │       │
                  ┌─────────────┐             ┌─────────────┐      │       │
                  │ S8_TEST    │◄────────────│ S9_RETRY    │──────┤       │
                  └──────┬──────┘             └─────────────┘      │       │
                         │                                         │       │
                         ▼                                         │       │
                  ┌─────────────┐                                  │       │
                  │ S10_PASSED  │                                  │       │
                  └──────┬──────┘                                  │       │
                         │                                         │       │
                         ▼                                         │       │
                  ┌─────────────┐                                  │       │
                  │ S11_UPDATE  │                                  │       │
                  └──────┬──────┘                                  │       │
                         │                                         │       │
                         ▼                                         │       │
                  ┌─────────────┐                                  │       │
                  │ S12_SEO     │                                  │       │
                  └──────┬──────┘                                  │       │
                         │                                         │       │
                         ▼                                         ▼       │
                  ┌─────────────┐             ┌─────────────┐              │
                  │ S13_READY   │             │S14_ESCALATE │──────────────┘
                  └──────┬──────┘             └─────────────┘
                         │                           ▲
                         │                           │ EVT_FIX_AVAILABLE
                         │                           │ (restart from S2)
                         ▼                           │
                  ┌─────────────┐                    │
                  │  S0_IDLE    │────────────────────┘
                  └─────────────┘
```

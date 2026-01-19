# Agent Workflow Rules (Compliance FSM)

This repo uses a deterministic, unskippable FSM for requirements -> build -> test -> SEO -> release. Agents must follow these rules and the full state definitions in `requirements/compliance/WORKFLOW.md`.

---

## Actors

| Actor | Role | States Allowed |
|-------|------|----------------|
| **HUMAN_TRIGGER** | Initiates agents; provides EVT_START_BUILD command | All (trigger only) |
| **COPILOT** | Requirement authoring + ID assignment + rule definitions | S0_IDLE, S1_REQUIREMENT_DRAFTED |
| **CODEX** | Implementation + validation + tracker updates | S2_PREFLIGHT through S14_ESCALATED |

---

## System of Record (State Storage)

State is stored in Markdown trackers only (no hidden state). 

### Compliance Files:
- `requirements/compliance/requirement_tracker.md`
- `requirements/compliance/build_tracker.md`
- `requirements/compliance/testing_tracker.md`
- `requirements/compliance/seo_requirements.md`
- `requirements/compliance/issue_tracker.md`
- `requirements/compliance/WORKFLOW.md`

### Build Rules Files (Calculator-Specific Requirements):
- `requirements/build_rules/loans/` — All loan calculator rules
- `requirements/build_rules/math/` — All math calculator rules

If a required file is missing, Codex creates it using templates during S2_PREFLIGHT.

---

## Deterministic IDs

| ID Type | Format | Example |
|---------|--------|---------|
| Requirement ID | REQ-YYYYMMDD-### | REQ-20260119-001 |
| Build ID | BUILD-YYYYMMDD-HHMMSS | BUILD-20260119-143022 |
| Test Run ID | TEST-YYYYMMDD-HHMMSS | TEST-20260119-143055 |
| SEO ID | SEO-... or SEO-PENDING-REQ-XXXX | SEO-PENDING-REQ-20260119-001 |
| Issue ID | ISSUE-YYYYMMDD-### | ISSUE-20260119-001 |

---

## Copilot → Codex Handoff Protocol

### Step 1: Copilot Creates Requirement (S0 → S1)

User says: **"Copilot: create requirement for [X]"**

Copilot MUST:
1. Generate REQ ID (REQ-YYYYMMDD-###)
2. Add entry to `requirement_tracker.md` with Status: NEW
3. Add entry to `seo_requirements.md` if SEO Impact = YES/UNKNOWN
4. Update calculator-specific rules file in `requirements/build_rules/`:
   - Add to **5-column Requirement ID Mapping table** (bullet format)
   - Add detailed **rule definitions**
   - Add detailed **test definitions**
5. Confirm requirement is ready

### Step 2: Human Triggers Codex (S1 → S2)

User says exactly: **"EVT_START_BUILD REQ-YYYYMMDD-###"**

This is the **permission trigger** for Codex to begin processing.

### Step 3: Codex Auto-Advances (S2 → S13)

After receiving EVT_START_BUILD, Codex:
1. Enters S2_PREFLIGHT and validates requirements
2. Auto-advances through all states until completion or failure
3. Updates all trackers as permitted by each state
4. Returns to S0_IDLE when complete

---

## Requirement ID Mapping Table Format (MANDATORY)

When Copilot creates requirements in build_rules files, MUST use this exact 5-column format:

```markdown
| Requirement ID | Calculator | Associated Rule IDs | Associated Test IDs | Date Created |
|----------------|------------|---------------------|---------------------|---------------|
| REQ-YYYYMMDD-### | Calculator Name | • RULE-1<br>• RULE-2 | • {PREFIX}-TEST-E2E-LOAD<br>• {PREFIX}-TEST-E2E-NAV<br>• {PREFIX}-TEST-E2E-WORKFLOW<br>• {PREFIX}-TEST-E2E-MOBILE<br>• {PREFIX}-TEST-E2E-A11Y<br>• {PREFIX}-TEST-U-1 | YYYY-MM-DD |
```

**Format Rules:**
- Use bullet format `• RULE-ID<br>` for each rule (NOT comma-separated)
- Use bullet format `• TEST-ID<br>` for each test (NOT comma-separated)
- Every requirement MUST have associated test IDs defined

---

## Mandatory Default Playwright E2E Tests (ALL REQUIREMENTS)

**Every requirement MUST include these 5 default Playwright E2E tests:**

| Test ID Pattern | Test Name | Description |
|-----------------|-----------|-------------|
| `{PREFIX}-TEST-E2E-LOAD` | Page Load Test | Verify calculator page loads correctly, no console errors |
| `{PREFIX}-TEST-E2E-NAV` | Navigation Test | Verify navigation menu works, deep-linking functional |
| `{PREFIX}-TEST-E2E-WORKFLOW` | User Workflow Test | Complete end-to-end user journey through calculator |
| `{PREFIX}-TEST-E2E-MOBILE` | Mobile Responsive Test | Verify layout works on mobile viewports |
| `{PREFIX}-TEST-E2E-A11Y` | Accessibility Test | Verify ARIA labels, keyboard navigation, screen reader support |

**Plus requirement-specific tests:**
- Unit tests for calculation logic (`{PREFIX}-TEST-U-#`)
- Integration tests if needed (`{PREFIX}-TEST-I-#`)
- Additional E2E tests for specific features

**Example for Percentage Calculator (PREFIX = PERC):**
- PERC-TEST-E2E-LOAD
- PERC-TEST-E2E-NAV
- PERC-TEST-E2E-WORKFLOW
- PERC-TEST-E2E-MOBILE
- PERC-TEST-E2E-A11Y
- PERC-TEST-U-1 (Unit: calculation modes)
- PERC-TEST-U-2 (Unit: edge cases)

---

## Core Rule: Valid Transition Only

- No tracker updates unless the FSM state permits it.
- No skipping states.
- No partial completion without logging.
- Invalid transition response must be:
  ```
  INVALID TRANSITION: current_state -> requested_state; required_state: X
  ```
  and stop.

---

## FSM States (Summary)

```
S0_IDLE 
    ↓ (Copilot: create requirement)
S1_REQUIREMENT_DRAFTED
    ↓ (Human: EVT_START_BUILD REQ-XXX)
S2_PREFLIGHT → S3_READY_TO_BUILD → S4_BUILD_RUNNING
    ↓                                      ↓
    ↓                              S5_BUILD_FAILED_RETRYABLE ←→ S6_BUILD_ABORTED → S14_ESCALATED
    ↓                                      ↓
S7_BUILD_PASSED → S8_TEST_RUNNING
                        ↓
                S9_TEST_FAILED_RETRYABLE ←→ S14_ESCALATED
                        ↓
                S10_TEST_PASSED → S11_TRACKERS_UPDATED → S12_SEO_CHECK → S13_RELEASE_READY
                                                                              ↓
                                                                          S0_IDLE
```

See `requirements/compliance/WORKFLOW.md` for full definitions, guards, and actions.

---

## Transition Table (Guardrail)

| From State | Allowed Transitions |
|------------|---------------------|
| S0_IDLE | → S1_REQUIREMENT_DRAFTED |
| S1_REQUIREMENT_DRAFTED | → S2_PREFLIGHT (via EVT_START_BUILD) |
| S2_PREFLIGHT | → S3_READY_TO_BUILD |
| S3_READY_TO_BUILD | → S4_BUILD_RUNNING |
| S4_BUILD_RUNNING | → S5_BUILD_FAILED_RETRYABLE or S7_BUILD_PASSED |
| S5_BUILD_FAILED_RETRYABLE | → S4_BUILD_RUNNING (retry) or S6_BUILD_ABORTED |
| S6_BUILD_ABORTED | → S14_ESCALATED |
| S7_BUILD_PASSED | → S8_TEST_RUNNING |
| S8_TEST_RUNNING | → S9_TEST_FAILED_RETRYABLE or S10_TEST_PASSED |
| S9_TEST_FAILED_RETRYABLE | → S4_BUILD_RUNNING (fix) or S14_ESCALATED |
| S10_TEST_PASSED | → S11_TRACKERS_UPDATED |
| S11_TRACKERS_UPDATED | → S12_SEO_CHECK |
| S12_SEO_CHECK | → S13_RELEASE_READY |
| S13_RELEASE_READY | → S0_IDLE |
| S14_ESCALATED | → S2_PREFLIGHT (after manual fix) |

**Any other transition is INVALID.**

---

## Agent Enforcement Rules

### Copilot Boundaries:
- ✅ Allowed in: S0_IDLE, S1_REQUIREMENT_DRAFTED only
- ✅ Can write: requirement_tracker.md, seo_requirements.md, build_rules files
- ❌ Cannot: Enter S2+, update build/test trackers, run builds

### Codex Boundaries:
- ✅ Allowed in: S2_PREFLIGHT through S14_ESCALATED only
- ✅ Can write: All trackers (per state permissions)
- ❌ Cannot: Create requirements, act without EVT_START_BUILD trigger
- ❌ Must refuse: Implementation if REQ not registered

---

## Command Contract

### Copilot Commands:

| User Command | Copilot Action | Result |
|--------------|----------------|--------|
| "Copilot: create requirement for [X]" | Generate REQ-ID, update trackers and build_rules | State → S1 |
| "Check requirements status" | List pending NEW requirements | Info only |

### Codex Commands:

| User Command | Codex Action | Result |
|--------------|--------------|--------|
| **"EVT_START_BUILD REQ-YYYYMMDD-###"** | Validate REQ exists and is NEW/UNVERIFIED, enter S2_PREFLIGHT | Auto-advance begins |
| "Codex: status" | Report current state and progress | Info only |
| "Codex: abort" | Stop processing, escalate to S14 | State → S14 |

---

## Quick Reference: Complete Flow

```
1. User: "Copilot: create requirement for percentage calculator fix"
   
2. Copilot:
   - Generates REQ-20260119-002
   - Updates requirement_tracker.md (Status: NEW)
   - Updates seo_requirements.md (Status: PENDING)
   - Updates build_rules/math/MATH_SIMPLE_RULES.md:
     - Adds to 5-column mapping table
     - Adds rule definitions
     - Adds test definitions
   - Confirms: "REQ-20260119-002 created. Ready for EVT_START_BUILD."

3. User: "EVT_START_BUILD REQ-20260119-002"

4. Codex:
   - S2: Validates requirements exist
   - S3: Confirms ready to build
   - S4: Runs build commands
   - S7: Build passed
   - S8: Runs tests
   - S10: Tests passed
   - S11: Updates all trackers
   - S12: SEO check
   - S13: Release ready
   - Returns to S0_IDLE
   - Reports: "REQ-20260119-002 completed successfully."
```

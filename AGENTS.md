# AGENTS.md — Agent Operating Contract (Entry Point)

This repo uses a deterministic FSM to ship calculator changes with traceability:

**REQ → BUILD → TEST → SEO → COMPLIANCE**

**System of record lives in `requirements/compliance/`**.  
If this file conflicts with `requirements/compliance/WORKFLOW.md`, **WORKFLOW.md wins**.

---

## Actors (Strict)

| Actor | What they do | What they must NOT do |
|---|---|---|
| **HUMAN_TRIGGER** | Starts a run; executes local build/test commands; opens PR when ready | Write trackers (unless explicitly instructed) |
| **COPILOT (requirements)** | Writes requirements + build-rules; assigns IDs; creates SEO placeholders | Build/test; update build/test/issue/compliance trackers |
| **IMPLEMENTER (Claude Code or Codex)** | Implements code; orchestrates build/test; updates trackers + compliance-report; prepares PR | Create new REQs; start without trigger; skip compliance updates |

> **Claude Code and Codex are equivalent implementers**. Whichever you use must follow the same rules.

---

## Authoritative Files (State Storage)

All state is stored in Markdown files under `requirements/compliance/`:

- `requirements/compliance/WORKFLOW.md` (FSM rules + authoritative test matrix)
- `requirements/compliance/requirement_tracker.md`
- `requirements/compliance/build_tracker.md`
- `requirements/compliance/testing_tracker.md`
- `requirements/compliance/seo_requirements.md`
- `requirements/compliance/issue_tracker.md`
- `requirements/compliance/compliance-report.md` (**release gate**)

Calculator-specific rules live under:

- `requirements/rules/math/`
- `requirements/rules/loans/`
- (others as added)

---

## Deterministic IDs (Uniqueness Required)

| ID Type | Format | Example |
|---|---|---|
| Requirement | `REQ-YYYYMMDD-###` | `REQ-20260121-001` |
| Build Run | `BUILD-YYYYMMDD-HHMMSS` | `BUILD-20260121-142233` |
| Test Run | `TEST-YYYYMMDD-HHMMSS` | `TEST-20260121-142455` |
| SEO Item | `SEO-REQ-...` or `SEO-PENDING-REQ-...` | `SEO-PENDING-REQ-20260121-001` |
| Issue | `ISSUE-YYYYMMDD-###` | `ISSUE-20260121-003` |

Hard rules:
- **IDs must not be reused**
- **RUNNING rows must be closed by editing-in-place** (PASS/FAIL/ABORTED + end time)
- **No duplicate rows for the same ID**

---

## Command Contract (How Work Starts)

### Step 1 — Create Requirement (Copilot)
User command:
- `Copilot: create requirement for <X>`

Copilot must:
1. Create `REQ-...` and add to `requirement_tracker.md` (Status: NEW)
2. Add/update calculator rules in `requirements/rules/...`
3. Add SEO placeholder in `seo_requirements.md` if SEO impact is YES/UNKNOWN
4. Stop (Copilot does not build/test)

### Step 2 — Trigger Implementation (Human)
User command (permission trigger):
- `EVT_START_BUILD REQ-YYYYMMDD-###`

Implementer must refuse to proceed without this trigger.

---

## Test Policy (Do NOT invent defaults)

**The Test Selection Matrix in `requirements/compliance/WORKFLOW.md` is authoritative.**

- Do **not** assume “5 default E2E tests for every REQ”.
- E2E is **scoped to impacted calculators** unless it’s a release sweep sample.
- Required vs optional tests must be recorded in the compliance-report row.

---

## Local-first Development (Supported)

You may build/test locally before opening a PR.

Minimum expectation:
- Record **local build/test evidence** in trackers and in `compliance-report.md` as **LOCAL**.
- When a PR is later opened and CI runs, update compliance with **CI evidence** and finalize verdict.

**Definition:**
- **LOCAL PASS** = ready to promote to PR
- **FINAL PASS** = PR/CI validated; release-ready

---

## Mandatory Outputs Per REQ (Release Gate)

A REQ is not “done” until these exist and are closed:

- `requirement_tracker.md`: NEW → VERIFIED/CLOSED
- `build_tracker.md`: 1+ BUILD row(s) closed
- `testing_tracker.md`: required TEST rows closed
- `seo_requirements.md`: PASS/PENDING/NA (if applicable)
- `compliance-report.md`: **exactly one row per REQ**, filled with:
  - scope type + meaning/definition
  - mandatory tests + optional tests (and what ran)
  - evidence links/snippets
  - overall verdict: PASS / FAIL (or waiver recorded)

---

## Enforcement

- No tracker updates unless the FSM state permits it (see WORKFLOW).
- Any invalid transition must stop with:
  `INVALID TRANSITION: current_state -> requested_state; required_state: X`
- No merge/release without **compliance-report PASS** (or explicit waiver documented).

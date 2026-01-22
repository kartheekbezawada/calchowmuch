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

| File | Purpose |
|------|---------|
| `WORKFLOW.md` | FSM rules, state diagram |
| `testing_requirements.md` | **Test taxonomy, selection matrix, cost-based ordering** |
| `requirement_tracker.md` | REQ registry |
| `build_tracker.md` | Build execution log |
| `testing_tracker.md` | Test execution log |
| `seo_tracker.md` | SEO validation log |
| `seo_requirements.md` | SEO rule definitions (P1-P5) |
| `issue_tracker.md` | Issues found during FSM |
| `compliance-report.md` | **Release gate** |

Calculator-specific rules live under:

- `requirements/rules/math/`
- `requirements/rules/loans/`
- (others as added)

---

## Deterministic IDs (Uniqueness Required)

| ID Type | Format | Example |
|---|---|---|
| Requirement | `REQ-YYYYMMDD-###` | `REQ-20260122-001` |
| Build Run | `BUILD-YYYYMMDD-HHMMSS` | `BUILD-20260122-142233` |
| Test Run | `TEST-YYYYMMDD-HHMMSS` | `TEST-20260122-142455` |
| SEO Item | `SEO-REQ-YYYYMMDD-###` | `SEO-REQ-20260122-001` |
| Issue | `ISSUE-YYYYMMDD-###` | `ISSUE-20260122-003` |

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
3. Add SEO placeholder in `seo_tracker.md` if SEO impact is YES/UNKNOWN
4. Stop (Copilot does not build/test)

### Step 2 — Trigger Implementation (Human)
User command (permission trigger):
- `EVT_START_BUILD REQ-YYYYMMDD-###`

Implementer must refuse to proceed without this trigger.

---

## Test Policy (Use the Matrix)

**The Test Selection Matrix in `requirements/compliance/testing_requirements.md` is authoritative.**

Key principles:
- Select tests based on **Change Type** (see testing_requirements.md §3)
- Do **not** assume "5 default E2E tests for every REQ"
- E2E is **scoped to impacted calculators** — never run full E2E for single-calculator changes
- Unit tests are cheap; E2E is expensive — prefer unit tests when possible
- Required vs optional tests must be recorded in the compliance-report row

### Test Pyramid (Cost Order)
```
Unit (cheapest) → Integration → SEO Auto → ISS-001 → E2E (expensive) → Full Sweep (release only)
```

### Quick Reference

| Change Type | Unit | E2E | SEO | ISS-001 |
|-------------|:----:|:---:|:---:|:-------:|
| Compute logic change | ✅ | — | — | — |
| UI/flow change | — | ✅ | — | — |
| New calculator | ✅ | ✅ | ✅ | — |
| Layout/CSS change | — | — | — | ✅ |
| SEO/metadata change | — | — | ✅ | — |

See `testing_requirements.md` for full matrix.

---

## Compliance Formula

```
OVERALL_PASS = BUILD_PASS ∧ TEST_PASS ∧ (SEO_PASS ∨ SEO_NA) ∧ UNIVERSAL_RULES_PASS
```

Where:
- **BUILD_PASS:** `npm run lint` zero errors
- **TEST_PASS:** All mandatory tests pass (per test matrix)
- **SEO_PASS/NA:** P1 SEO rules validated or not applicable
- **UNIVERSAL_RULES_PASS:** No P0/P1 violations

See `compliance-report.md` for full formula definition.

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

A REQ is not "done" until these exist and are closed:

- `requirement_tracker.md`: NEW → VERIFIED/CLOSED
- `build_tracker.md`: 1+ BUILD row(s) closed (PASS)
- `testing_tracker.md`: required TEST rows closed (per test matrix)
- `seo_tracker.md`: PASS/NA (if applicable)
- `compliance-report.md`: **exactly one row per REQ**, filled with:
  - Change type
  - Mandatory tests + what ran
  - Evidence links/snippets
  - Overall verdict: PASS / FAIL (or waiver recorded)

---

## Enforcement

- No tracker updates unless the FSM state permits it (see WORKFLOW).
- Any invalid transition must stop with:
  `INVALID TRANSITION: current_state -> requested_state; required_state: X`
- No merge/release without **compliance-report PASS** (or explicit waiver documented).

---

## Related Documents

| Document | Location |
|----------|----------|
| Universal Requirements | `requirements/universal/UNIVERSAL_REQUIREMENTS.md` |
| Testing Requirements | `requirements/compliance/testing_requirements.md` |
| FSM Workflow | `requirements/compliance/WORKFLOW.md` |
| Compliance Report | `requirements/compliance/compliance-report.md` |
| Calculator Hierarchy | `requirements/universal/calculator-hierarchy.md` |

---

**Last Updated:** 2026-01-22

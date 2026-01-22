# Finite State Machine Workflow (Optimized)

## Purpose

Ship calculator changes with predictable quality. Every change must be traceable:
`REQ → BUILD → TEST → SEO → COMPLIANCE`.

## Fast Path for Agents (Read This, Not Everything)

- Work **diff-first**: open only the files you touched + the single relevant rules file.
- Do **not** reread whole trackers. Add/update **one** row for your run.
- **No duplicates**: Build/Test/Issue IDs appear once; close RUNNING rows by editing-in-place.
- **Compliance-report.md is mandatory**: one row per REQ; no release/merge without **PASS** (or explicit waiver recorded).

---

## Roles (Strict)

- **Copilot (Claude)**: creates/edits requirements only. May add SEO placeholders. **No build/test/issue/compliance writes.**
- **Codex**: implements code, orchestrates build/test/SEO updates, and **MUST** update compliance-report.
- Claude: implements code, orchestrates build/test/SEO updates, and **MUST** update compliance-report.

---

## Workflow Diagram (Authoritative)

```text
┌───────────────────────────────┐
│  S0: IDLE                      │
└───────────────┬───────────────┘
                │
                v
┌─────────────────────────────────────────────────────────────┐
│ S1: REQUIREMENT_DRAFTED (Copilot)                            │
│ - REQ created                                                │
│ - Change Type chosen                                         │
│ - impacted targets listed                                    │
└───────────────┬─────────────────────────────────────────────┘
                │
                v
┌─────────────────────────────────────────────────────────────┐
│ CHANGE BOX (Input Contract)                                  │
│ - scope definition satisfied (per matrix)                    │
│ - impacted + non-impacted targets explicit                   │
│ - acceptance criteria (pass/fail bullets)                    │
└───────────────┬─────────────────────────────────────────────┘
                │
                v
┌─────────────────────────────────────────────────────────────┐
│ S2: PREFLIGHT (Codex)                                        │
│ - derive mandatory/optional tests from matrix                │
│ - create compliance row (status NEW/UNVERIFIED)              │
└───────────────┬─────────────────────────────────────────────┘
                │
                v
┌─────────────────────────────────────────────────────────────┐
│ S4: BUILD_RUNNING (Human executes, Codex records)            │
│ - BUILD row RUNNING → PASS/FAIL + evidence                   │
└───────────────┬─────────────────────────────────────────────┘
                │
        ┌───────┴───────────┐
        │                   │
        v                   v
┌───────────────────┐  ┌──────────────────────────────────────┐
│ BUILD FAIL         │  │ BUILD PASS                             │
│ S5 retry / issue   │  │ proceed                                │
└─────────┬─────────┘  └──────────────────────┬─────────────────┘
          │                                    │
          └────────────────────────────────────┘
                                               v
┌─────────────────────────────────────────────────────────────┐
│ TESTS BOX (Auto-selected from matrix)                         │
│ - mandatory tests to run                                     │
│ - optional tests allowed to defer                            │
└───────────────┬─────────────────────────────────────────────┘
                │
                v
┌─────────────────────────────────────────────────────────────┐
│ S8: TEST_RUNNING (Human executes, Codex records)             │
│ - TEST row(s) RUNNING → PASS/FAIL/SKIPPED + evidence         │
└───────────────┬─────────────────────────────────────────────┘
                │
        ┌───────┴───────────┐
        │                   │
        v                   v
┌───────────────────┐  ┌──────────────────────────────────────┐
│ TEST FAIL          │  │ TEST PASS                              │
│ S9 retry / issue   │  │ proceed                                │
└─────────┬─────────┘  └──────────────────────┬─────────────────┘
          │                                    │
          └────────────────────────────────────┘
                                               v
┌─────────────────────────────────────────────────────────────┐
│ S11: TRACKERS UPDATED (Codex)                                │
│ - requirement_tracker VERIFIED                               │
│ - compliance-report updated with evidence + verdict          │
└───────────────┬─────────────────────────────────────────────┘
                │
                v
┌─────────────────────────────────────────────────────────────┐
│ S12: SEO CHECK (Codex, only if impacted)                      │
│ - seo_requirements row PASS/PENDING/NA + evidence             │
└───────────────┬─────────────────────────────────────────────┘
                │
                v
┌─────────────────────────────────────────────────────────────┐
│ S13: RELEASE READY (Gate)                                     │
│ - compliance Overall = PASS (or waiver)                       │
│ - local-first: LOCAL PASS = ready for PR                      │
│ - after CI: FINAL PASS = merge-ready                           │
└─────────────────────────────────────────────────────────────┘
```

---

## States

S0_IDLE → S1_REQUIREMENT_DRAFTED → S2_PREFLIGHT → S3_READY_TO_BUILD →
S4_BUILD_RUNNING → (S5_BUILD_FAILED_RETRYABLE | S7_BUILD_PASSED) →
S8_TEST_RUNNING → (S9_TEST_FAILED_RETRYABLE | S10_TEST_PASSED) →
S11_TRACKERS_UPDATED → S12_SEO_CHECK → S13_RELEASE_READY → S0_IDLE
(Any hard stop: S14_ESCALATED)

---

## Change Scope & Tests Matrix (Authoritative)


| Change Type (Scope)                  | Scope Definition (What this change*must* include / allow)                                                                                                                                  | Mandatory Tests (Must run)                                                                                                                           | Optional / Deferred Tests (Allowed to skip unless release sweep)                           |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **New calculator (new page/module)** | Adds a new calculator page/module with new compute logic and UI. Must define route/URL (if applicable), inputs/outputs, and explanation content if required by UX rules.                   | Unit tests for compute logic (`{PREFIX}-TEST-U-*`) per **TEST-1.1** + **TEST-1.2 ≥ 80%**; `*-TEST-E2E-LOAD`, `*-TEST-E2E-WORKFLOW` (new calculator) | `*-TEST-E2E-NAV` only if navigation/config updated; `*-TEST-E2E-MOBILE`, `*-TEST-E2E-A11Y` |
| **Calculator compute logic change**  | Changes calculation/validation/output logic only. Must not change UI layout/flow. Must update formula references and edge cases in tests.                                                  | Unit tests for changed compute logic (`{PREFIX}-TEST-U-*`) per **TEST-1.1** + **TEST-1.2 ≥ 80%**                                                    | E2E only if UI/flow also changed                                                           |
| **Calculator UI/flow change**        | Changes inputs, buttons, flow, results rendering, or interaction behavior. Compute logic may be unchanged. Must preserve universal UI constraints (scrollbars, sizing, no layout blow-up). | `*-TEST-E2E-LOAD`, `*-TEST-E2E-WORKFLOW` (affected calculators only)                                                                                 | `*-TEST-E2E-NAV`, `*-TEST-E2E-MOBILE`, `*-TEST-E2E-A11Y`                                   |
| **Graph change (calculator-scoped)** | Changes graph rendering, dataset mapping, or graph container behavior for a specific calculator. If interactive, must define expected interaction behavior.                                | Unit/integration test validating data mapping + graph container/render assertion                                                                     | `*-TEST-E2E-WORKFLOW` only if interaction changed                                          |
| **Table change (calculator-scoped)** | Changes table structure, formatting, scrolling, or data mapping for a specific calculator. Must maintain semantics (`thead/tbody/tfoot` where applicable) and required scroll containers.  | Unit/integration mapping test + DOM semantics/scroll assertions (table semantics + scrollbars)                                                       | `*-TEST-E2E-WORKFLOW` only if interaction changed                                          |
| **Shared reusable component change** | Changes a shared component (inputs/buttons/table component). Must list impacted calculators/components explicitly.                                                                         | Component unit/integration tests (events + semantics) +`*-TEST-E2E-LOAD` for **1–2 representative impacted calculators**                            | `*-TEST-E2E-WORKFLOW` only if interaction changed; `*-TEST-E2E-MOBILE`, `*-TEST-E2E-A11Y`  |
| **Layout/CSS/shared shell change**   | Changes global layout/CSS/shell used across calculators. Must preserve page max size and required scrollbars; no nav ping-pong.                                                            | **ISS-001** regression E2E (layout stability + scrollbars + nav)                                                                                     | Full E2E suite (release sweep only)                                                        |
| **Navigation/config change**         | Changes navigation.json/routes/deep-linking/highlighting rules. Must specify affected domain/category and URLs.                                                                            | `*-TEST-E2E-NAV` (affected domain) + **ISS-001**                                                                                                     | Full E2E suite (release sweep only)                                                        |
| **Accessibility-only change**        | Changes ARIA/labels/keyboard navigation without UI/logic change. Must specify affected pages/components.                                                                                   | `*-TEST-E2E-A11Y` (affected calculators/pages)                                                                                                       | Full E2E suite (release sweep only)                                                        |
| **SEO / metadata-only change**       | Changes titles/descriptions/canonical/sitemap/structured data only. Must list affected URLs and metadata fields.                                                                           | SEO validation (sitemap + structured data + metadata presence for impacted URLs)                                                                     | Post-deploy URL inspection (Search Console)                                                |
| **Content/explanation-only change**  | Changes explanation text/examples only; no UI/logic. Must not change calculation outputs.                                                                                                  | Build + lint (or simple page render check)                                                                                                           | E2E skip                                                                                   |
| **Dependency/tooling change**        | Changes Node/pnpm/Playwright/config. Must specify impacted scripts and environment expectations.                                                                                           | Build + unit tests + minimal smoke E2E (1 representative calculator)                                                                                 | Full suite (release sweep only)                                                            |
| **Analytics/Ads integration change** | Adds/modifies analytics/ads scripts or placements. Must guarantee no layout break and no interference with inputs/results.                                                                 | Render/no-console-errors check +**ISS-001** regression                                                                                               | `*-TEST-E2E-WORKFLOW` for 1 representative calculator if interaction risk                  |
| **Bugfix hot patch**                 | Small targeted fix with minimal blast radius. Must specify exact bug scenario and expected behavior.                                                                                       | Targeted unit test**or** targeted E2E (depending on bug type) + build PASS                                                                           | Anything else deferred                                                                     |
| **Full release sweep (definition)**  | Not a change type; a release mode. Must name representative calculator per category.                                                                                                       | Full unit test suite + E2E for**1 representative calculator per category**                                                                           | Not applicable                                                                             |

**General rule:** Run E2E only for calculators you changed. Untouched calculators do not need E2E unless it’s a full release sweep.

---

## Tracker Update Contract (Hard Rules)

- **Build/Test rows are created once and then edited to close.** Never duplicate IDs.
- **RUNNING rows must be closed** (PASS/FAIL/ABORTED/SKIPPED) before a REQ becomes VERIFIED.
- **Compliance-report is the gate**: each REQ gets exactly one row; update it at every stage.

---

## Steps (What Agents Actually Do)

### S1_REQUIREMENT_DRAFTED (Copilot)

- Create `REQ-YYYYMMDD-###`.
- In the REQ, set **Change Type** and list **impacted targets** explicitly.
- Add row to `requirement_tracker.md` (Status: NEW).
- **Update corresponding rules file** with specific rule definitions for the requirement (math: `requirements/rules/math/MATH_ADVANCED_RULES.md`, loans: `requirements/rules/loans/`, etc.).
- Add SEO placeholder row if page/URL/metadata scope changed (Status: PENDING).
- Stop.

### S2_PREFLIGHT (Codex)

- Verify REQ exists and is NEW.
- Decide required tests using the matrix.
- Pre-create **one** compliance-report row for this REQ (status NEW/UNVERIFIED).
- Confirm which commands HUMAN will run (build + required tests).

### S4_BUILD_RUNNING (Codex + Human)

- Create `BUILD-YYYYMMDD-HHMMSS` row in build_tracker with Status RUNNING + Start time.
- Human runs build command(s).
- Close the same row with End time + PASS/FAIL + evidence.
- If FAIL: create issue + retry (new BUILD ID) up to budget, else escalate.

### S8_TEST_RUNNING (Codex + Human)

- Create `TEST-YYYYMMDD-HHMMSS` row(s) in testing_tracker with Status RUNNING + Start time.
- Human runs **mandatory** tests derived from the matrix.
- Close the same row(s) with End time + PASS/FAIL/SKIPPED + evidence.
- If FAIL: create issue + retry (new TEST ID) or escalate.

### S11_TRACKERS_UPDATED (Codex)

- requirement_tracker: set REQ = VERIFIED **only if** build/test rows are closed and mandatory tests passed.
- compliance-report: update Build/Test IDs + statuses + evidence + overall verdict.
- issue_tracker: ensure failures created issues; close issues when resolved.

### S12_SEO_CHECK (Codex)

- If SEO impacted: update existing SEO row to PASS/PENDING/FAIL and add evidence.
- If SEO missing: add placeholder PENDING + create follow-up issue.

### S13_RELEASE_READY (Gate)

- Release/merge allowed only if compliance-report row shows Overall Compliance = **PASS** (or waiver recorded).
- **Local-first mode:** You may set **LOCAL PASS** to indicate “ready for PR”.
- **Final merge:** When a PR is opened and CI runs, add CI evidence and mark **FINAL PASS**.

---

## Required Output Per REQ (Minimum)

- 1 row in requirement_tracker (NEW → VERIFIED)
- 1 row in build_tracker (RUNNING → PASS/FAIL)
- 1+ row(s) in testing_tracker (RUNNING → PASS/FAIL/SKIPPED) for mandatory tests
- 0–1 row in seo_tracker (PENDING → PASS/PENDING/FAIL or N/A)
- 1 row in compliance-report (mandatory; must include evidence and verdict)

---

## Compliance Formula Reference

See [compliance-report.md](compliance-report.md) for the authoritative formula:

```
OVERALL_PASS = BUILD_PASS ∧ TEST_PASS ∧ (SEO_PASS ∨ SEO_NA) ∧ UNIVERSAL_RULES_PASS
```

See [testing_requirements.md](testing_requirements.md) for:
- Test pyramid (cost-based ordering)
- Test selection matrix by change type
- Test ID conventions
- Coverage requirements

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [testing_requirements.md](testing_requirements.md) | Test taxonomy, selection matrix, execution commands |
| [compliance-report.md](compliance-report.md) | Release gate, compliance formula, per-REQ verdicts |
| [requirement_tracker.md](requirement_tracker.md) | System of record for requirements |
| [build_tracker.md](build_tracker.md) | Build execution tracking |
| [testing_tracker.md](testing_tracker.md) | Test execution tracking |
| [seo_tracker.md](seo_tracker.md) | SEO validation tracking |
| [seo_requirements.md](seo_requirements.md) | SEO rule definitions (P1-P5) |
| [issue_tracker.md](issue_tracker.md) | Issues created during FSM runs |

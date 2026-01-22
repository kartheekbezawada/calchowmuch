# Compliance System

> **Purpose:** Deterministic, state-driven traceability from requirements to release.

---

## Quick Start

1. **Create requirement:** Copilot drafts in [requirement_tracker.md](requirement_tracker.md)
2. **Build:** Human runs `npm run lint`, Codex records in [build_tracker.md](build_tracker.md)
3. **Test:** Human runs tests, Codex records in [testing_tracker.md](testing_tracker.md)
4. **SEO:** If applicable, validate and record in [seo_tracker.md](seo_tracker.md)
5. **Compliance:** Update [compliance-report.md](compliance-report.md) with final verdict

---

## Document Overview

| Document | Purpose | Key Content |
|----------|---------|-------------|
| [WORKFLOW.md](WORKFLOW.md) | FSM workflow | State diagram, transitions, roles |
| [testing_requirements.md](testing_requirements.md) | **Test strategy** | Test pyramid, selection matrix, commands |
| [requirement_tracker.md](requirement_tracker.md) | Requirements | REQ registry, change types |
| [build_tracker.md](build_tracker.md) | Builds | Build execution log |
| [testing_tracker.md](testing_tracker.md) | Tests | Test execution log |
| [seo_tracker.md](seo_tracker.md) | SEO | SEO validation log |
| [seo_requirements.md](seo_requirements.md) | SEO rules | P1-P5 SEO rule definitions |
| [issue_tracker.md](issue_tracker.md) | Issues | Problems found during FSM |
| [compliance-report.md](compliance-report.md) | **Release gate** | Final per-REQ verdicts |

---

## Workflow Chain

```
requirement_tracker.md → build_tracker.md → testing_tracker.md → seo_tracker.md → compliance-report.md
       (REQ-...)            (BUILD-...)        (TEST-...)          (SEO-...)         (PASS/FAIL)
```

---

## ID Formats

| Type | Format | Example |
|------|--------|---------|
| Requirement | `REQ-YYYYMMDD-###` | `REQ-20260122-001` |
| Build | `BUILD-YYYYMMDD-HHMMSS` | `BUILD-20260122-143000` |
| Test Run | `TEST-YYYYMMDD-HHMMSS` | `TEST-20260122-143500` |
| SEO | `SEO-REQ-YYYYMMDD-###` | `SEO-REQ-20260122-001` |
| Issue | `ISSUE-YYYYMMDD-###` | `ISSUE-20260122-001` |

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

---

## Test Selection (Summary)

| Change Type | Unit | E2E | SEO | ISS-001 |
|-------------|:----:|:---:|:---:|:-------:|
| New calculator | ✅ | ✅ LOAD+WORKFLOW | ✅ | — |
| Compute logic change | ✅ | — | — | — |
| UI/flow change | — | ✅ LOAD+WORKFLOW | — | — |
| Layout/CSS change | — | — | — | ✅ |
| SEO/metadata change | — | — | ✅ | — |

See [testing_requirements.md](testing_requirements.md) for full matrix.

---

## Roles

| Role | Responsibilities | Does NOT do |
|------|------------------|-------------|
| **Copilot** | Create requirements, add SEO placeholders | Build, test, update compliance |
| **Codex/Claude** | Implement code, run tests, update all trackers | Create new REQs |
| **Human** | Trigger builds, execute commands, review | — |

---

## Key Rules

1. **No duplicates:** Each ID appears exactly once in its tracker
2. **Update in place:** Edit RUNNING rows to final status
3. **No orphans:** All RUNNING rows must be closed before REQ is VERIFIED
4. **Evidence required:** Every PASS/FAIL needs command output or test results
5. **One row per REQ:** Compliance report has exactly one row per requirement

---

## Related Documents

- [UNIVERSAL_REQUIREMENTS.md](../universal/UNIVERSAL_REQUIREMENTS.md) — Rule definitions (UI, FS, CS, TEST, SEO)
- [calculator-hierarchy.md](../universal/calculator-hierarchy.md) — Navigation structure
- [AGENTS.md](../../AGENTS.md) — Agent operating contract

---

**Last Updated:** 2026-01-22  
**Status:** Fresh Start

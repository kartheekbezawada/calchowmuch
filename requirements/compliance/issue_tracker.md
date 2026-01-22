# Issue Tracker

> **Purpose:** Track issues created during FSM runs (build failures, test failures, SEO failures).

---

## Tracker Contract

| Rule | Description |
|------|-------------|
| **One row per Issue ID** | Each `ISSUE-...` appears exactly once |
| **Issue ID format** | `ISSUE-YYYYMMDD-###` (sequential per date) |
| **Link to REQ/BUILD/TEST** | Every issue must reference triggering ID |

---

## Status Definitions

| Status | Meaning |
|--------|---------|
| **OPEN** | Issue identified, not yet addressed |
| **IN_PROGRESS** | Fix being implemented |
| **RESOLVED** | Fix applied and verified |
| **CLOSED** | Issue closed after successful re-test |
| **WONTFIX** | Issue acknowledged but not fixed (with justification) |

---

## Priority Definitions

| Priority | Meaning | SLA |
|----------|---------|-----|
| **P0** | Blocker — prevents release | Immediate |
| **P1** | Critical — must fix before release | Same day |
| **P2** | Important — should fix before release | Within sprint |
| **P3** | Minor — can defer | As time permits |

---

## FSM Issues Table (Authoritative)

| Issue ID | REQ ID | Trigger | Summary | Priority | Status | Created | Evidence |
|----------|--------|---------|---------|----------|--------|---------|----------|
| *(Fresh start — populate as issues occur)* | | | | | | | |

---

## Template for New Issue

```markdown
| ISSUE-YYYYMMDD-### | REQ-YYYYMMDD-### | BUILD/TEST-... | [Summary] | P1 | OPEN | YYYY-MM-DD | — |
```

### Field Definitions

| Field | Description | Values |
|-------|-------------|--------|
| Issue ID | Unique identifier | `ISSUE-YYYYMMDD-###` |
| REQ ID | Related requirement | `REQ-YYYYMMDD-###` |
| Trigger | Build/Test ID that found the issue | `BUILD-...` or `TEST-...` |
| Summary | Brief description | Free text |
| Priority | Severity | `P0`, `P1`, `P2`, `P3` |
| Status | Current state | See Status Definitions |
| Created | Date found | `YYYY-MM-DD` |
| Evidence | Error logs, screenshots | Free text or link |

---

## Issue Categories

| Category | Description | Example |
|----------|-------------|---------|
| **Build** | Lint/compile errors | Missing import |
| **Unit Test** | Unit test failures | Incorrect calculation |
| **E2E Test** | E2E test failures | Button not clickable |
| **SEO** | SEO validation failures | Missing canonical |
| **Layout** | UI/layout regressions | ISS-001 snapshot diff |
| **Config** | Configuration errors | Missing nav entry |

---

## Issue Resolution Flow

```
OPEN → IN_PROGRESS → RESOLVED → (retest) → CLOSED
                          │
                          └→ (retest fails) → OPEN (retry)
```

---

## Current Issue Summary

| Status | Count |
|--------|-------|
| OPEN | 0 |
| IN_PROGRESS | 0 |
| RESOLVED | 0 |
| CLOSED | 0 |
| **Total** | **0** |

*Note: This tracker was reset on 2026-01-22.*

---

## Issue by Priority

| Priority | OPEN | IN_PROGRESS | RESOLVED |
|----------|------|-------------|----------|
| P0 | 0 | 0 | 0 |
| P1 | 0 | 0 | 0 |
| P2 | 0 | 0 | 0 |
| P3 | 0 | 0 | 0 |

---

## Notes

- Every FAIL in build/test/SEO should create an issue
- Issues block REQ from becoming VERIFIED until resolved
- P0 issues block all releases
- Resolution must include evidence (re-run test IDs)

---

**Last Updated:** 2026-01-22  
**Status:** Fresh Start

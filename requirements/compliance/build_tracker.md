# Build Tracker

> **Purpose:** Track build executions for FSM requirements.

---

## Tracker Contract

| Rule | Description |
|------|-------------|
| **One row per Build ID** | Each `BUILD-...` appears exactly once |
| **Build ID format** | `BUILD-YYYYMMDD-HHMMSS` (UTC) |
| **Update in place** | Edit RUNNING row to final status (never add duplicate) |
| **No orphans** | All builds must be closed (PASS/FAIL/ABORTED) before REQ is VERIFIED |

---

## Status Definitions

| Status | Meaning |
|--------|---------|
| **RUNNING** | Build in progress |
| **PASS** | `npm run lint` completed with zero errors |
| **FAIL** | Build failed (linting errors, missing deps) |
| **ABORTED** | Build cancelled or retry budget exceeded |

---

## Build Command

```bash
npm run lint
```

A build **passes** when:
- ESLint reports zero errors
- No missing imports or dependencies
- Files are syntactically valid

---

## FSM Build Runs (Authoritative)

| Build ID | REQ ID | Initiator | Start Time | End Time | Status | Evidence |
|----------|--------|-----------|------------|----------|--------|----------|
| *(Fresh start — populate as builds run)* | | | | | | |

---

## Template for New Build Entry

```markdown
| BUILD-YYYYMMDD-HHMMSS | REQ-YYYYMMDD-### | Codex/Human | YYYY-MM-DD HH:MM:SS | — | RUNNING | — |
```

When build completes, update the same row:

```markdown
| BUILD-YYYYMMDD-HHMMSS | REQ-YYYYMMDD-### | Codex/Human | YYYY-MM-DD HH:MM:SS | YYYY-MM-DD HH:MM:SS | PASS | `npm run lint` ok |
```

---

## Build Lifecycle

```
S3_READY_TO_BUILD
       │
       v
S4_BUILD_RUNNING  ──────┬──────────────────┐
       │                │                  │
       v                v                  v
  BUILD PASS       BUILD FAIL         BUILD ABORTED
       │                │                  │
       v                v                  v
  → S7 Tests     → S5 Retry/Issue     → S14 Escalate
```

---

## Retry Rules

- On FAIL: Create issue, then retry with new Build ID
- Max 3 retries per REQ before escalation
- Each retry gets a **new** Build ID (never reuse)

---

## Current Build Summary

| Metric | Count |
|--------|-------|
| Total Builds | 0 |
| PASS | 0 |
| FAIL | 0 |
| RUNNING | 0 |
| ABORTED | 0 |

*Note: This tracker was reset on 2026-01-22.*

---

## Notes

- Build is a prerequisite for testing
- Install (`pnpm install`) is one-time per environment (per TEST-1.4)
- Do not re-run installs before every build

---

**Last Updated:** 2026-01-22  
**Status:** Fresh Start

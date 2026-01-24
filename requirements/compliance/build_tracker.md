# Build Tracker

> **Purpose:** Compact log of build runs  
> **LLM Rule:** Read Active section only. STOP at Archive.

---

## Active Builds

| BUILD_ID | REQ_ID | ITER_ID | Status | Iterations | Start | End | Evidence |
|----------|--------|---------|--------|------------|-------|-----|----------|
| BUILD-20260124-130848 | REQ-20260124-005 | ITER-20260124-130848 | COMPLETE | 1/25 | 2026-01-24 13:08 | 2026-01-24 13:14 | iterations/ITER-20260124-130848.md |
| BUILD-20260124-181500 | REQ-20260124-004 | ITER-20260124-181500 | COMPLETE | 2/25 | 2026-01-24 18:15 | 2026-01-24 18:34 | iterations/ITER-20260124-181500.md |
| BUILD-20260124-160000 | REQ-20260124-003 | ITER-20260124-160000 | COMPLETE | 1/25 | 2026-01-24 16:00 | 2026-01-24 16:05 | iterations/ITER-20260124-160000.md |
| BUILD-20260124-112200 | REQ-20260124-002 | ITER-20260124-112200 | COMPLETE | 1/25 | 2026-01-24 11:22 | 2026-01-24 11:26 | iterations/ITER-20260124-112200.md |
| BUILD-20260124-141230 | REQ-20260124-001 | ITER-20260124-141230 | COMPLETE | 2/25 | 2026-01-24 14:12 | 2026-01-24 14:19 | iterations/ITER-20260124-141230.md |
| BUILD-20260122-184300 | REQ-20260122-003 | ITER-20260122-184300 | COMPLETE | 12/25 | 2026-01-22 18:43 | 2026-01-22 18:57 | iterations/ITER-20260122-184300.md |

---

## Context Rule

```
⚠️ DO NOT load all iteration files
✅ Load only: iterations/{ITER_ID}.md for current REQ
```

---

<!-- ⛔ LLM STOP: Do not read below this line ⛔ -->

## Archive

<!-- Move completed builds here. LLMs should not load this section. -->

| BUILD_ID | REQ_ID | ITER_ID | Status | Iterations | Archived |
|----------|--------|---------|--------|------------|----------|
| | | | | | |

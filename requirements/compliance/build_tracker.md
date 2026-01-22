# Build Tracker

> **Purpose:** Compact log of build runs  
> **LLM Rule:** Read Active section only. STOP at Archive.

---

## Active Builds

| BUILD_ID | REQ_ID | ITER_ID | Status | Iterations | Start | End | Evidence |
|----------|--------|---------|--------|------------|-------|-----|----------|
| BUILD-20260122-180000 | REQ-20260122-001 | ITER-20260122-180000 | COMPLETE | 13/25 | 2026-01-22 18:00 | 2026-01-22 18:35 | iterations/ITER-20260122-180000.md |

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

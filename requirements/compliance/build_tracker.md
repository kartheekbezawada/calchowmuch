# Build Tracker

> **Purpose:** Compact log of build runs  
> **LLM Rule:** Read Active section only. STOP at Archive.

---

## Active Builds

| BUILD_ID | REQ_ID | ITER_ID | Status | Iterations | Start | End | Evidence |
|----------|--------|---------|--------|------------|-------|-----|----------|
| BUILD-20260206-021115 | REQ-20260206-003 | ITER-20260206-021115 | PASS | 1/25 | 2026-02-06 02:11:15 | 2026-02-06 02:24:37 | iterations/ITER-20260206-021115.md |
| BUILD-20260206-012439 | REQ-20260206-001 | ITER-20260206-012439 | PASS | 1/25 | 2026-02-06 01:24:39 | 2026-02-06 01:38:15 | iterations/ITER-20260206-012439.md |
| BUILD-20260203-214153 | REQ-20260203-001 | ITER-20260203-214153 | PASS | 1/25 | 2026-02-03 21:41:54 | 2026-02-03 21:44:24 | iterations/ITER-20260203-214153.md |
| BUILD-20260202-224155 | REQ-20260202-001 | ITER-20260202-224155 | PASS | 6/25 | 2026-02-02 22:41:55 | 2026-02-02 23:21:54 | iterations/ITER-20260202-224155.md |


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
| BUILD-20260126-221901 | REQ-20260126-010 | ITER-20260126-221901 | COMPLETE | 1/25 | 2026-01-26 22:34 |
| BUILD-20260126-212224 | REQ-20260126-010 | ITER-20260126-212224 | COMPLETE | 1/25 | 2026-01-26 22:34 |

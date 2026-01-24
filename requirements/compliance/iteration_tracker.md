# Iteration Tracker (Index)

> **Purpose:** Summary index of iteration sessions  
> **Detail Files:** `iterations/ITER-*.md` (one per session)  
> **LLM Rule:** Read Active section only. Load specific ITER file for current REQ.

---

## Active Sessions

| ITER_ID | REQ_ID | Status | Iterations | Phase | Log File |
|---------|--------|--------|------------|-------|----------|
| ITER-20260124-112200 | REQ-20260124-002 | COMPLETE | 2/25 | COMPLIANCE | iterations/ITER-20260124-112200.md |
| ITER-20260124-141230 | REQ-20260124-001 | COMPLETE | 5/25 | COMPLIANCE | iterations/ITER-20260124-141230.md |
| | | | | | |

**Example:**
```
| ITER-20260122-142233 | REQ-20260122-001 | RUNNING | 3/25 | BUILD | iterations/ITER-20260122-142233.md |
```

---

## LLM Loading Rule

```
✅ Read this index to find ITER_ID for your REQ
✅ Load only: iterations/{ITER_ID}.md for current REQ
❌ DO NOT load other ITER files
```

---

<!-- ⛔ LLM STOP: Do not read below this line ⛔ -->

## Archive

<!-- Move completed sessions here. LLMs should not load this section. -->

| ITER_ID | REQ_ID | Total | Final Status | Completed |
|---------|--------|-------|--------------|-----------|
| ITER-20260122-180000 | REQ-20260122-001 | 13/25 | COMPLETE | 2026-01-22 18:35 |
| ITER-20260122-183600 | REQ-20260122-002 | 6/25 | COMPLETE | 2026-01-22 18:42 |
| ITER-20260122-184300 | REQ-20260122-003 | 12/25 | COMPLETE | 2026-01-22 18:57 |

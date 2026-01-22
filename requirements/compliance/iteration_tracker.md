# Iteration Tracker (Index)

> **Purpose:** Summary index of iteration sessions  
> **Detail Files:** `iterations/ITER-*.md` (one per session)  
> **LLM Rule:** Read Active section only. Load specific ITER file for current REQ.

---

## Active Sessions

| ITER_ID | REQ_ID | Status | Iterations | Phase | Log File |
|---------|--------|--------|------------|-------|----------|
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
| | | | | |

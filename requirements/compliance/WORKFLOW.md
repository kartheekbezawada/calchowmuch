# Workflow - Finite State Machine

> **Purpose:** Defines states, transitions, and **LLM context rules**  
> **Ralph Lauren Loop:** Enabled (max 25 iterations)  
> **Last Updated:** 2026-01-22

---

## ⚠️ LLM Context Management (READ FIRST)

### What to Load at Start

```
ALWAYS LOAD (project rules):
├── ../universal/UNIVERSAL_REQUIREMENTS.md ← P0 rules, UI contract (load first!)

ALWAYS LOAD (workflow context):
├── WORKFLOW.md (this file) — understand the state machine
├── lessons_learned.md — CRITICAL: patterns from past failures
├── requirement_tracker.md — find the active REQ
├── build_tracker.md — check current status
└── testing_tracker.md — check test status

LOAD ON DEMAND (only when needed):
├── iterations/ITER-{id}.md — ONLY for current REQ's ITER_ID
├── testing_requirements.md — when selecting tests
├── seo_requirements.md — when SEO validation needed
└── issue_tracker.md — when creating/checking issues
```

### What NOT to Load

```
❌ All files in iterations/ folder
❌ Archived/completed iteration logs
❌ Historical compliance reports
❌ idea_tracker.md (unless creating ideas)
```

### Context Budget Rule

```
If starting work on REQ-20260122-001:
1. Read requirement_tracker.md → find REQ details
2. Read build_tracker.md → find ITER_ID (e.g., ITER-20260122-142233)
3. Read iterations/ITER-20260122-142233.md → understand current state
4. START WORK — don't read anything else
```

---

## State Diagram (Simplified)

```
IDLE → IDEA → REQ → BUILD ⟷ TEST → COMPLIANCE → COMPLETE
                         ↓              ↓
                       FAIL ──────→ ISSUE
```

---

## File Structure

```
requirements/compliance/
├── WORKFLOW.md              ← THIS FILE (always read)
├── requirement_tracker.md   ← Small, always read
├── build_tracker.md         ← Small, always read
├── testing_tracker.md       ← Small, always read
├── iteration_tracker.md     ← INDEX ONLY (small)
├── iterations/              ← DETAILED LOGS (read one at a time)
│   ├── _TEMPLATE.md
│   ├── ITER-20260122-142233.md
│   └── ITER-20260122-153045.md
├── compliance-report.md     ← Small
├── issue_tracker.md         ← Small, load on demand
├── idea_tracker.md          ← Small, load on demand
├── seo_tracker.md           ← Small, load on demand
├── testing_requirements.md  ← Reference, load when selecting tests
└── seo_requirements.md      ← Reference, load when SEO needed
```

---

## Ralph Lauren Loop

### Starting a Build

```
1. Human: EVT_START_BUILD REQ-20260122-001

2. LLM reads:
   - requirement_tracker.md → get REQ details
   - build_tracker.md → check no active build

3. LLM creates:
   - iterations/ITER-20260122-HHMMSS.md (new file)
   - Row in build_tracker.md (with ITER_ID)
   - Row in iteration_tracker.md (index entry)

4. LLM starts loop (working in iterations/ITER-*.md)
```

### During the Loop

```
Each iteration:
1. Run command (npm run lint / npm run test)
2. Log result in iterations/ITER-*.md
3. If FAIL and iterations < 25:
   - Read error from output
   - Fix code
   - Go to step 1
4. If PASS:
   - Update build_tracker/testing_tracker
   - Continue to next phase
```

### Iteration File Only Grows During Active Work

```
iterations/ITER-20260122-142233.md

| # | Phase | Action | Result | Error | Fix | Time |
|---|-------|--------|--------|-------|-----|------|
| 1 | BUILD | lint   | FAIL   | ...   | —   | ...  |
| 2 | BUILD | lint   | PASS   | —     | ... | ...  |
| 3 | TEST  | unit   | FAIL   | ...   | —   | ...  |
| 4 | TEST  | unit   | PASS   | —     | ... | ...  |

^ This file is ONLY read for REQ-20260122-001
^ Other REQs have their own ITER-*.md files
```

---

## ID Quick Reference

| ID | Format | Location |
|----|--------|----------|
| REQ | `REQ-YYYYMMDD-###` | requirement_tracker.md |
| BUILD | `BUILD-YYYYMMDD-HHMMSS` | build_tracker.md |
| TEST | `TEST-YYYYMMDD-HHMMSS` | testing_tracker.md |
| ITER | `ITER-YYYYMMDD-HHMMSS` | iterations/{ITER_ID}.md |
| ISSUE | `ISSUE-YYYYMMDD-###` | issue_tracker.md |

---

## Compliance Formula

```
PASS = BUILD_PASS ∧ TEST_PASS ∧ SEO_OK ∧ ITERATIONS ≤ 25
```

---

## Key Rules

1. **One ITER file per EVT_START_BUILD** — scoped to single REQ
2. **Iteration files are isolated** — don't pollute other REQs' context
3. **Index files stay small** — just pointers, no details
4. **Load on demand** — only read what's needed for current task
5. **Archive aggressively** — move completed work out of active sections

---

*Context is precious. Load only what you need.*

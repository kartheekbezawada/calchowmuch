# Compliance Tracking System v2

> **Optimized for LLM Context Efficiency**  
> **Parent:** `requirements/README.md` — see full folder structure  
> **Related:** `requirements/universal/` — project rules (load first!)  
> **Version:** 2.0  
> **Last Updated:** 2026-01-22

---

## 🎯 Design Goal: Minimal Context Load + Learning from History

This system is designed so LLMs:
1. Don't waste context reading irrelevant historical data
2. **Still learn from past failures** via curated `lessons_learned.md`

### The Problem (v1)
```
LLM starts work on REQ-001:
├── Reads iteration_tracker.md (500 lines of ALL iterations)
├── Reads build_tracker.md (100 rows of ALL builds)
├── 80% of context consumed before work starts
└── Less room for actual problem-solving
```

### The Solution (v2)
```
LLM starts work on REQ-001:
├── Reads lessons_learned.md (curated patterns - 150 lines)
├── Reads requirement_tracker.md (20 lines)
├── Reads build_tracker.md (10 lines active section)
├── Reads iterations/ITER-20260122-142233.md (ONLY this REQ's log)
├── 15% of context consumed
└── 85% available for work + knows past failure patterns
```

---

## 📁 File Structure

```
requirements/compliance/
│
├── 📋 ALWAYS LOAD (small, essential)
│   ├── WORKFLOW.md              ← Rules & state machine
│   ├── lessons_learned.md       ← PATTERNS FROM PAST FAILURES
│   ├── requirement_tracker.md   ← Active REQs only
│   ├── build_tracker.md         ← Active builds only
│   ├── testing_tracker.md       ← Active tests only
│   └── iteration_tracker.md     ← INDEX only (pointers)
│
├── 📂 iterations/               ← ONE FILE PER SESSION
│   ├── _TEMPLATE.md             ← Copy for new sessions
│   ├── ITER-20260122-142233.md  ← REQ-001's iterations
│   ├── ITER-20260122-153045.md  ← REQ-002's iterations
│   └── ...                      ← Each REQ gets own file
│
├── 📄 LOAD ON DEMAND (when needed)
│   ├── idea_tracker.md          ← Creating ideas
│   ├── issue_tracker.md         ← Problems/blockers
│   ├── seo_tracker.md           ← SEO validation
│   ├── compliance-report.md     ← Final verdicts
│   ├── testing_requirements.md  ← Test selection
│   └── seo_requirements.md      ← SEO rules
│
└── 📦 ARCHIVE (never load)
    └── (completed work in Archive sections)
```

---

## 🤖 LLM Loading Rules

### When Starting Work

```python
# Step 0: Load project rules (ALWAYS FIRST)
load("../universal/UNIVERSAL_REQUIREMENTS.md")  # ~2000 tokens - P0 rules

# Step 1: Understand workflow + past patterns
load("WORKFLOW.md")              # ~150 lines - state machine
load("lessons_learned.md")       # ~75 lines - past failure patterns
load("requirement_tracker.md")   # ~50 lines - find active REQ
load("build_tracker.md")         # ~30 lines - current status

# Step 2: Load specific context (ONLY for active REQ)
active_req = "REQ-20260122-001"
iter_id = lookup(build_tracker, active_req)  # → ITER-20260122-142233
load(f"iterations/{iter_id}.md")             # ~50 lines - THIS REQ only

# Step 3: DO NOT load
# ❌ iterations/ITER-20260122-153045.md (different REQ)
# ❌ Archive sections in any tracker
# ❌ Other REQs' iteration files
```

### During Work

```python
# Log iterations to the OPEN iteration file only
append(f"iterations/{iter_id}.md", new_iteration_row)

# Update trackers in-place (don't add new rows for same ID)
update(build_tracker, build_id, new_status)
```

### When Finishing

```python
# Update iteration file with final status
finalize(f"iterations/{iter_id}.md", total_iterations, "PASS")

# Update trackers
update(build_tracker, build_id, status="PASS", iterations="5/25")
update(compliance_report, req_id, verdict="PASS")

# Move to archive sections (optional, for cleanup)
archive(iteration_tracker, iter_id)
archive(build_tracker, build_id)
```

---

## 📊 Context Budget Comparison

| Scenario | v1 (bloated) | v2 (optimized) |
|----------|--------------|----------------|
| Starting fresh | ~2000 tokens | ~500 tokens |
| After 10 REQs | ~8000 tokens | ~500 tokens |
| After 50 REQs | ~35000 tokens | ~500 tokens |

**v2 stays constant** because historical iterations are isolated.

---

## 🔗 How IDs Link Together

```
REQ-20260122-001 (requirement_tracker.md)
       │
       ├──► BUILD-20260122-142233 (build_tracker.md)
       │           │
       │           └──► ITER-20260122-142233 ◄─── iterations/ITER-*.md
       │                       │
       ├──► TEST-20260122-142455 (testing_tracker.md)
       │           │
       │           └──► ITER-20260122-142233 (same session!)
       │
       └──► SEO-REQ-20260122-001 (seo_tracker.md, if needed)
```

**Key insight:** BUILD and TEST share the same ITER_ID because they're one continuous session.

---

## ✅ Quick Start for LLMs

```markdown
1. Read ../universal/UNIVERSAL_REQUIREMENTS.md (P0 rules - FIRST!)
2. Read WORKFLOW.md (understand state machine)
3. Read lessons_learned.md (avoid past mistakes)
4. Read requirement_tracker.md (find your REQ)
5. Read build_tracker.md (find ITER_ID)
6. Read iterations/{ITER_ID}.md (your working file)
7. START BUILDING — don't read anything else unless needed
```

---

## 🚫 Anti-Patterns

| Don't Do This | Do This Instead |
|---------------|-----------------|
| `load("iterations/*.md")` | `load("iterations/ITER-{specific}.md")` |
| Read all trackers at start | Read only active sections |
| Duplicate rows for same ID | Update in-place |
| Keep growing main trackers | Archive completed work |
| Log iterations in build_tracker | Log in iterations/ITER-*.md |

---

## 📝 Creating a New Iteration Session

When `EVT_START_BUILD REQ-YYYYMMDD-###` triggers:

```bash
1. Copy iterations/_TEMPLATE.md → iterations/ITER-{timestamp}.md
2. Fill in REQ_ID, BUILD_ID, Started time
3. Add row to iteration_tracker.md (index only)
4. Add row to build_tracker.md (with ITER_ID)
5. Begin Ralph Lauren Loop in the new ITER file
```

---

*Context is the LLM's working memory. Don't waste it on history.*

---

## 🧠 Knowledge Flow: How LLMs Learn from Past Failures

```
┌─────────────────────────────────────────────────────────────────┐
│                     DURING BUILD                                │
│  iterations/ITER-*.md ← detailed log of current session         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (if MAX_ITERATIONS or resolved issue)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AFTER RESOLUTION                            │
│  issue_tracker.md ← document what happened                      │
│         │                                                       │
│         └──► Extract pattern to lessons_learned.md              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FUTURE BUILDS                               │
│  LLM reads lessons_learned.md ← curated, actionable patterns    │
│  (NOT all historical iteration files)                           │
└─────────────────────────────────────────────────────────────────┘
```

### Why This Works

| Raw History | Curated Knowledge |
|-------------|-------------------|
| "Iteration 3: lint failed, unused var x in utils.ts:42" | "Unused variable → remove or prefix with `_`" |
| 500 lines of iteration logs | 150 lines of patterns |
| Context-heavy, specific to one session | Reusable across all future sessions |
| LLM must parse and understand | LLM gets direct fix instructions |

### Extraction Rule

When an issue is resolved, ask:
1. **Is this pattern likely to recur?** → Add to lessons_learned.md
2. **Is it project-specific?** → Add to calculator rules or environment notes
3. **Is it one-off?** → Just archive, don't extract
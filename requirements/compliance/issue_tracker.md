# Issue Tracker

> **Purpose:** Track problems and blockers  
> **LLM Rule:** Load when needed. STOP at Archive.  
> **Feeds Into:** `lessons_learned.md` (extract patterns when resolved)

---

## Active Issues

| ISSUE_ID | REQ_ID | ITER_ID | Title | Type | Severity | Status |
|----------|--------|---------|-------|------|----------|--------|
| ISSUE-20260125-001 | REQ-20260125-006 | ITER-20260125-111500 | ISS-NAV-TOP-001 visual regression failure when running full ISS suite | BUG | MEDIUM | OPEN |

---

## Types

| Type | When |
|------|------|
| MAX_ITERATIONS | 25 iterations exhausted |
| BLOCKER | Cannot proceed |
| BUG | Unexpected behavior |
| ENVIRONMENT | CI/local issues |

---

## After Resolving → Extract Pattern

Ask: "Will this recur?" If yes, add to `lessons_learned.md`:

```markdown
| Error | Fix |
|-------|-----|
| `exact error` | How we fixed it |
```

---

<!-- ⛔ LLM STOP: Do not read below this line ⛔ -->

## Archive

<!-- Move resolved issues here. LLMs should not load this section. -->

| ISSUE_ID | Title | Resolution | Pattern Extracted? | Resolved |
|----------|-------|------------|-------------------|----------|
| | | | ✅ / ❌ | |

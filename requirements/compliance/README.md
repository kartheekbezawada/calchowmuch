# Compliance System

> **Parent:** `requirements/README.md`
> **Related:** `requirements/universal-rules/` — load first

---

## Document Chain

All release governance follows a single chain:

```
Requirement Tracker → UNIVERSAL_REQUIREMENTS.md → Project Bible.md → RELEASE_CHECKLIST.md → RELEASE_SIGNOFF.md → Release Sign-Off Master Table.md
```

| Step | Document | Purpose |
|------|----------|---------|
| 1 | `requirement_tracker.md` | What needs to be done (REQ lifecycle) |
| 2 | `UNIVERSAL_REQUIREMENTS.md` | How it must be built (rules & constraints) |
| 3 | `Project Bible.md` | Why — strategy, design intent, SERP system |
| 4 | `RELEASE_CHECKLIST.md` | Pre-release gate — every item must pass |
| 5 | `RELEASE_SIGNOFF.md` | Per-release evidence — filled out per release candidate |
| 6 | `Release Sign-Off Master Table.md` | Historical record — one row per release |

All governance documents live under `requirements/universal-rules/` except `requirement_tracker.md` which lives here in `requirements/compliance/`.

---

## File Structure

```
requirements/compliance/
├── requirement_tracker.md       ← REQ lifecycle (NEW → COMPLETE)
├── lessons_learned.md           ← Curated patterns from past failures
├── calculator-migration-checklist.md
├── new-calculator-design-checklist.md
├── testing_requirements.md      ← Test selection guidance
├── seo_requirements.md          ← SEO rules
└── iterations/                  ← One file per build session
    ├── _TEMPLATE.md
    └── ITER-*.md

requirements/universal-rules/
├── UNIVERSAL_REQUIREMENTS.md    ← Authoritative rules
├── Project Bible.md             ← Strategy / design intent
├── RELEASE_CHECKLIST.md         ← Pre-release pass/fail gate
├── RELEASE_SIGNOFF.md           ← Per-release evidence template
└── Release Sign-Off Master Table.md ← Cumulative release ledger
```

---

## Release Flow

### Before Release

1. Read `requirement_tracker.md` — find the active REQ
2. Build against `UNIVERSAL_REQUIREMENTS.md` rules
3. Run through `RELEASE_CHECKLIST.md` — every HARD item must pass
4. Fill out `RELEASE_SIGNOFF.md` with evidence (test results, CWV data, SERP verification)

### Release Decision

- All HARD gates in checklist pass → **APPROVED**
- Any HARD blocker → **REJECTED**

### After Release

1. Add one row to `Release Sign-Off Master Table.md`
2. Post-release monitoring (Search Console CWV, indexing, structured data)

---

## Quick Start for LLMs

```
1. Read UNIVERSAL_REQUIREMENTS.md (P0 rules — always first)
2. Read requirement_tracker.md (find your REQ)
3. Read RELEASE_CHECKLIST.md (know what must pass)
4. START BUILDING
5. Fill RELEASE_SIGNOFF.md with evidence when done
```

---

*One chain. One checklist. One sign-off. No tracker sprawl.*

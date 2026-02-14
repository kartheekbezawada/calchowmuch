# Requirements — Folder Guide

> Start here. This file explains the folder structure and loading order.

---

## Folder Structure

```
requirements/
│
├── README.md                       ← THIS FILE (start here)
│
├── universal-rules/                ← PROJECT LAW (rarely changes)
│   ├── UNIVERSAL_REQUIREMENTS.md   ← P0: Master rules, UI contract, standards
│   ├── Project Bible.md            ← Strategy, design intent, SERP system
│   ├── RELEASE_CHECKLIST.md        ← Pre-release pass/fail gate
│   ├── RELEASE_SIGNOFF.md          ← Per-release evidence template
│   └── Release Sign-Off Master Table.md ← Cumulative release ledger
│
├── compliance/                     ← TRACKING & WORKFLOW
│   ├── requirement_tracker.md      ← Active requirements (REQ lifecycle)
│   ├── lessons_learned.md          ← Curated patterns from past failures
│   ├── calculator-migration-checklist.md
│   ├── new-calculator-design-checklist.md
│   ├── testing_requirements.md     ← Test selection guidance
│   ├── seo_requirements.md         ← SEO rules
│   └── iterations/                 ← One file per build session
│       ├── _TEMPLATE.md
│       └── ITER-*.md
│
└── rules/                          ← CALCULATOR-SPECIFIC (optional)
    ├── math/
    └── loans/
```

---

## Document Chain

```
Requirement Tracker → UNIVERSAL_REQUIREMENTS.md → Project Bible.md → RELEASE_CHECKLIST.md → RELEASE_SIGNOFF.md → Release Sign-Off Master Table.md
```

---

## LLM Loading Priority

### 1. Always Load First (Project Rules)

```
requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md
└── P0 rules, UI contract, coding standards, test requirements
```

### 2. Always Load for Build Work

```
requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md
requirements/compliance/lessons_learned.md
requirements/compliance/requirement_tracker.md
requirements/universal-rules/RELEASE_CHECKLIST.md
```

### 3. Load On Demand

| File | When to Load |
|------|--------------|
| `Project Bible.md` | Strategy/design intent questions |
| `RELEASE_SIGNOFF.md` | Filling out release evidence |
| `iterations/ITER-*.md` | Only for current REQ's session |
| `testing_requirements.md` | When selecting tests |
| `seo_requirements.md` | When SEO validation needed |
| `rules/{calculator}.md` | When working on specific calculator |

---

## Quick Reference

| Need To... | Read... |
|------------|---------|
| Know the rules | `universal-rules/UNIVERSAL_REQUIREMENTS.md` |
| Understand design intent | `universal-rules/Project Bible.md` |
| Start a build | `compliance/requirement_tracker.md` |
| Avoid past mistakes | `compliance/lessons_learned.md` |
| Check what must pass | `universal-rules/RELEASE_CHECKLIST.md` |
| Record release evidence | `universal-rules/RELEASE_SIGNOFF.md` |

**REQ Authoring Note:** For calculators with many inputs, mode toggles, or dynamic rows, requirements must include an explicit Calculation Pane Interaction Contract (control type, default mode, per-mode visibility, row parity, button-only trigger behavior).

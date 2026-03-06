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
│   ├── RELEASE_SIGNOFF.md          ← Release sign-off template (copy per release)
│   ├── requirement_tracker.md      ← Active requirements (REQ lifecycle)
│   ├── release-signoffs/           ← Per-release evidence files (RELEASE_SIGNOFF_{RELEASE_ID}.md)
│   └── Release Sign-Off Master Table.md ← Cumulative release ledger
│
└── rules/                          ← CALCULATOR-SPECIFIC (optional)
    ├── math/
    └── loans/
```

---

## Document Chain

```
Requirement Tracker → UNIVERSAL_REQUIREMENTS.md → Project Bible.md → RELEASE_CHECKLIST.md → RELEASE_SIGNOFF.md (template) → release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md → Release Sign-Off Master Table.md
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
requirements/universal-rules/requirement_tracker.md
requirements/universal-rules/RELEASE_CHECKLIST.md
```

### 3. Load On Demand

| File | When to Load |
|------|--------------|
| `Project Bible.md` | Strategy/design intent questions |
| `RELEASE_SIGNOFF.md` | Template for release sign-off evidence |
| `requirement_tracker.md` | Active REQ status and lifecycle |
| `UNIVERSAL_REQUIREMENTS.md` (`UR-SEO-040` to `UR-SEO-052`) | When SEO head metadata/schema validation is needed |
| `rules/{calculator}.md` | When working on specific calculator |

---

## Quick Reference

| Need To... | Read... |
|------------|---------|
| Know the rules | `universal-rules/UNIVERSAL_REQUIREMENTS.md` |
| Understand design intent | `universal-rules/Project Bible.md` |
| Start a build | `universal-rules/requirement_tracker.md` |
| Check what must pass | `universal-rules/RELEASE_CHECKLIST.md` |
| Record release evidence | `universal-rules/release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md` |

**REQ Authoring Note:** For calculators with many inputs, mode toggles, or dynamic rows, requirements must include an explicit Calculation Pane Interaction Contract (control type, default mode, per-mode visibility, row parity, button-only trigger behavior).

**Builder Metadata Note:** Page builders/templates must provide final SEO inputs to the reusable head generator contract: `canonicalUrl`, `seoTitle`, `seoDescription`, `h1`, `ogImageUrl`, and `isCalculatorPage`.

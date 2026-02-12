# Requirements Directory

> **Purpose:** All project requirements, rules, and tracking  
> **LLM Rule:** Read in priority order (see below)

---

## Folder Structure

```
requirements/
│
├── README.md                    ← THIS FILE (start here)
│
├── universal-rules/             ← PROJECT RULES (rarely changes)
│   ├── UNIVERSAL_REQUIREMENTS.md   ← P0: Master rules, UI contract, standards
│   └── (single-file authority: FSM + testing + SEO + UI contracts)
│
├── compliance/                  ← TRACKING & WORKFLOW (changes per REQ)
│   ├── lessons_learned.md          ← Curated patterns from past failures
│   ├── requirement_tracker.md      ← Active requirements
│   ├── build_tracker.md            ← Active builds
│   ├── testing_tracker.md          ← Active tests
│   ├── iteration_tracker.md        ← Index to iteration sessions
│   ├── iterations/                 ← One file per build session
│   │   ├── _TEMPLATE.md
│   │   └── ITER-*.md
│   ├── idea_tracker.md             ← Raw ideas
│   ├── issue_tracker.md            ← Problems & blockers
│   ├── seo_tracker.md              ← SEO validations
│   ├── compliance-report.md        ← Release gate
│   ├── testing_requirements.md     ← Legacy test matrix (defer to universal-rules/UNIVERSAL_REQUIREMENTS.md)
│   └── seo_requirements.md         ← Legacy SEO matrix (defer to universal-rules/UNIVERSAL_REQUIREMENTS.md)
│
└── rules/                       ← CALCULATOR-SPECIFIC (optional)
    ├── math/
    │   └── percentage-calculator.md
    └── loans/
        └── home-loan.md
```

---

## LLM Loading Priority

### 1. Always Load First (Project Rules)

```
requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md
└── P0 rules, UI contract, coding standards, test requirements
```

**Why:** These are non-negotiable rules. Violations = PR rejection.

### 2. Always Load for Build Work

```
requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md    ← State machine
requirements/compliance/lessons_learned.md  ← Past failure patterns
requirements/compliance/requirement_tracker.md
requirements/compliance/build_tracker.md
requirements/compliance/testing_tracker.md
```

### 3. Load On Demand

| File | When to Load |
|------|--------------|
| `iterations/ITER-*.md` | Only for current REQ's ITER_ID |
| `calculator-hierarchy.md` | When working on navigation |
| `testing_requirements.md` | When selecting tests |
| `seo_requirements.md` | When SEO validation needed |
| `rules/{calculator}.md` | When working on specific calculator |

---

## Quick Reference

| Need To... | Read... |
|------------|---------|
| Know the rules | `universal-rules/UNIVERSAL_REQUIREMENTS.md` |
| Start a build | `universal-rules/UNIVERSAL_REQUIREMENTS.md` |
| Avoid past mistakes | `compliance/lessons_learned.md` |
| Find active work | `compliance/requirement_tracker.md` |
| Check test matrix | `universal-rules/UNIVERSAL_REQUIREMENTS.md` |
| Validate SEO | `universal-rules/UNIVERSAL_REQUIREMENTS.md` |

**See also:** `universal-rules/UNIVERSAL_REQUIREMENTS.md` (mandatory Explanation Pane structure and table/FAQ standards)
**REQ Authoring Note:** For calculators with many inputs, mode toggles, or dynamic rows, requirements must include an explicit Calculation Pane Interaction Contract (control type, default mode, per-mode visibility, row parity, button-only trigger behavior).

---

## Archive Rule

All tracker files have:
```
## Active Section     ← LLM reads this
<!-- ⛔ LLM STOP -->
## Archive            ← LLM ignores this
```

This keeps context small even as project grows.

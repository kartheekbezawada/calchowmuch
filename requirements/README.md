# Requirements — Folder Guide

Start here. This file explains the current requirements structure and the loading order.

## Active Structure

```text
requirements/
├── README.md
└── universal-rules/
    ├── README.md
    ├── UNIVERSAL_REQUIREMENTS.md
    ├── CALCULATOR_BUILD_GUIDE.md
    ├── RELEASE_CHECKLIST.md
    ├── RELEASE_SIGNOFF.md
    ├── reference/
    ├── decisions/
    ├── incidents/
    ├── archive/
    ├── release-signoffs/
    └── salary-calculators-cluster-redesign/
```

## Active Document Set

These are the main files that define how work should be done:

| File | Role |
|---|---|
| `requirements/universal-rules/README.md` | Folder index and loading map |
| `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md` | Single authoritative rule file |
| `requirements/universal-rules/CALCULATOR_BUILD_GUIDE.md` | Practical calculator build guidance |
| `requirements/universal-rules/RELEASE_CHECKLIST.md` | Release pass/fail gate |
| `requirements/universal-rules/RELEASE_SIGNOFF.md` | Release evidence template |

## Loading Order

| Order | File or folder | When to load |
|---|---|---|
| 1 | `requirements/universal-rules/README.md` | First, to understand the folder and document roles |
| 2 | `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md` | Always |
| 3 | `requirements/universal-rules/CALCULATOR_BUILD_GUIDE.md` | When building or revising calculator UX, content, graphs, tables, or page structure |
| 4 | `requirements/universal-rules/RELEASE_CHECKLIST.md` | When validating release gates |
| 5 | `requirements/universal-rules/RELEASE_SIGNOFF.md` | When preparing release evidence |
| 6 | `requirements/universal-rules/reference/` | Only when a rule or checklist points to a support document |
| 7 | `requirements/universal-rules/decisions/` | When historical implementation decisions matter |
| 8 | `requirements/universal-rules/incidents/` | When tracing regressions or prior failures |
| 9 | `requirements/universal-rules/archive/legacy-notes/` | Only if HUMAN explicitly asks for legacy context |

## Quick Reference

| Need to... | Read... |
|---|---|
| Know the rules | `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md` |
| Understand the folder | `requirements/universal-rules/README.md` |
| Build a calculator page correctly | `requirements/universal-rules/CALCULATOR_BUILD_GUIDE.md` |
| Check what must pass before release | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Record release evidence | `requirements/universal-rules/RELEASE_SIGNOFF.md` and `requirements/universal-rules/release-signoffs/` |

## Notes

- `UNIVERSAL_REQUIREMENTS.md` remains the highest-precedence project law.
- `About Us.md` inside `requirements/universal-rules/` is not a governance file and is no longer used by the MPA generator as a build source.
- Additional special-case working documents may still exist at the top level of `requirements/universal-rules/`; treat `requirements/universal-rules/README.md` as the source of truth for how to classify them.
- Program-specific rollout material stays in its own subfolder, such as `salary-calculators-cluster-redesign/`.

REQ authoring note: for calculators with many inputs, mode toggles, or dynamic rows, requirements must include an explicit Calculation Pane Interaction Contract covering control type, default mode, per-mode visibility, row parity, and button-only trigger behavior.

Builder metadata note: page builders/templates must provide final SEO inputs to the reusable head generator contract: `canonicalUrl`, `seoTitle`, `seoDescription`, `h1`, `ogImageUrl`, and `isCalculatorPage`.

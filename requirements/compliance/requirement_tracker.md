# Requirement Tracker

> **Purpose:** System of record for FSM requirements. Every change starts with a requirement registered here.

---

## Tracker Contract

| Rule | Description |
|------|-------------|
| **One row per REQ** | Each Requirement ID appears exactly once |
| **REQ ID format** | `REQ-YYYYMMDD-###` |
| **Owner creates** | Copilot creates in S1_REQUIREMENT_DRAFTED |
| **Implementer verifies** | Codex/Claude updates to VERIFIED in S11 |

---

## Status Definitions

| Status | Meaning |
|--------|---------|
| **NEW** | Requirement registered, not yet implemented |
| **UNVERIFIED** | Implementation started, tests not yet complete |
| **VERIFIED** | All mandatory tests pass, ready for compliance |
| **CLOSED** | Merged/released |

---

## FSM Requirements Table (Authoritative)

| REQ ID | Title | Change Type | Scope/Pages | SEO Impact | Status | Date | Build Rules | Notes |
|--------|-------|-------------|-------------|------------|--------|------|-------------|-------|
| *(Fresh start — populate as REQs are created)* | | | | | | | | |

---

## Template for New Requirement

```markdown
| REQ-YYYYMMDD-### | [Title] | [Change Type] | [Scope/Pages] | YES/NO | NEW | YYYY-MM-DD | [rules file path] | — |
```

### Field Definitions

| Field | Description | Values |
|-------|-------------|--------|
| REQ ID | Unique identifier | `REQ-YYYYMMDD-###` |
| Title | Short descriptive title | Free text |
| Change Type | From [testing_requirements.md](testing_requirements.md) matrix | See Change Types below |
| Scope/Pages | Impacted files/pages | Path or description |
| SEO Impact | Does this change pages/URLs? | `YES`, `NO` |
| Status | Current state | `NEW`, `UNVERIFIED`, `VERIFIED`, `CLOSED` |
| Date | Creation date | `YYYY-MM-DD` |
| Build Rules | Path to rules file | `requirements/rules/{domain}/{FILE}.md` |
| Notes | Additional context | Free text |

---

## Change Types (from Test Matrix)

Select one when creating a requirement:

| Change Type | Description |
|-------------|-------------|
| **New calculator** | Adds a new calculator page/module with compute logic and UI |
| **Compute logic change** | Changes calculation/validation/output logic only |
| **UI/flow change** | Changes inputs, buttons, flow, results rendering |
| **Graph change** | Changes graph rendering, dataset mapping, container behavior |
| **Table change** | Changes table structure, formatting, scrolling, data mapping |
| **Shared component change** | Changes a shared component (inputs/buttons/table component) |
| **Layout/CSS/shell change** | Changes global layout/CSS/shell |
| **Navigation/config change** | Changes navigation.json/routes/deep-linking |
| **A11y-only change** | Changes ARIA/labels/keyboard navigation |
| **SEO/metadata-only change** | Changes titles/descriptions/canonical/sitemap/structured data |
| **Content/explanation-only** | Changes explanation text/examples only |
| **Dependency/tooling change** | Changes Node/pnpm/Playwright/config |
| **Bugfix hot patch** | Small targeted fix with minimal blast radius |

---

## Requirement Creation Process (S1)

When Copilot creates a requirement:

1. Assign `REQ-YYYYMMDD-###` (next available for that date)
2. Set **Change Type** from the list above
3. List **impacted targets** explicitly
4. Set **SEO Impact** = YES if page/URL changes
5. Add row to this tracker with Status = `NEW`
6. Add/update rules in `requirements/rules/{domain}/`
7. If SEO Impact = YES, add row to [seo_tracker.md](seo_tracker.md) with Status = `PENDING`
8. **STOP** — Copilot does not build/test

---

## Current Requirements Summary

| Status | Count |
|--------|-------|
| NEW | 0 |
| UNVERIFIED | 0 |
| VERIFIED | 0 |
| CLOSED | 0 |
| **Total** | **0** |

*Note: This tracker was reset on 2026-01-22.*

---

## Requirements by Category

| Category | NEW | VERIFIED | Total |
|----------|-----|----------|-------|
| Math Calculators | 0 | 0 | 0 |
| Loan Calculators | 0 | 0 | 0 |
| Layout/Shell | 0 | 0 | 0 |
| Navigation | 0 | 0 | 0 |
| Infrastructure | 0 | 0 | 0 |

---

## Notes

- Every implementation must start with a requirement registered here
- Change Type determines mandatory tests (see [testing_requirements.md](testing_requirements.md))
- SEO Impact = YES triggers seo_tracker entry
- Build rules define acceptance criteria

---

**Last Updated:** 2026-01-22  
**Status:** Fresh Start

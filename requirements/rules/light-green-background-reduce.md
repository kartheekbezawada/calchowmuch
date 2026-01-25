# Light Green Background Reduction Requirements

**REQ-ID:** REQ-20260124-007  
**Title:** Reduce Light Green Intensity  
**Type:** Visual Theme Update  
**Priority:** MEDIUM  
**Status:** COMPLETE  
**Created:** 2026-01-24

---

## Scope

**In Scope:** Global page and shell background color only.  
**Out of Scope:** Layout dimensions, pane ratios, typography, component styling, navigation hierarchy, calculator logic, input validation, build tooling.  
**Authority:** requirements/rules/light-green-background-plus-10-percent.md and universal UI contract (UI-3.1, UI-3.2).  
**Change Type:** Layout/CSS.

---

## Requirements

### BG-020 — Reduce Light Green Intensity

**Requirement**
- Reduce the current light green background intensity so the new color sits between the current background color and the lighter green baseline used before the +10% change.
- Apply the change only through shared CSS tokens in public/assets/css/base.css.
- Do not change any component or panel backgrounds beyond the page/shell background tokens.

**Acceptance Criteria**
- [x] `--page-bg` and `--shell-bg` updated to a lighter green value between current `#d4edda` and prior light green `#e8f5e9`.
- [x] No changes to layout sizing, spacing, or scroll behavior (UI-3.1, UI-3.2).
- [x] No changes to JavaScript, calculator HTML, or navigation configuration.

### BG-021 — Functional Guardrail

**Requirement**
- Theme updates must not alter any calculator functionality or interactions.

**Acceptance Criteria**
- [x] No edits to public/assets/js/** files.
- [x] No changes to calculator input, output, or navigation logic.

---

## Completion Checklist (for implementer)

- [x] `--page-bg` and `--shell-bg` adjusted to the new lighter green in public/assets/css/base.css.
- [x] Layout and component sizing unchanged.
- [x] No calculator logic changes.

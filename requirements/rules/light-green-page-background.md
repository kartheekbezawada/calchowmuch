# Light Green Page Background Requirements

**REQ-ID:** REQ-20260124-002  
**Title:** Light Green Page Background  
**Type:** Visual Theme Update  
**Priority:** MEDIUM  
**Status:** COMPLETE  
**Created:** 2026-01-24

---

## Scope

**In Scope:** Global page background color only.  
**Out of Scope:** Layout dimensions, pane ratios, typography, component styling, navigation hierarchy, calculator logic, input validation, build tooling.  
**Authority:** Universal UI Contract (UI-3.1, UI-3.2) and requirements/compliance/purple_theme.md for theme guardrails.  
**Change Type:** Layout/CSS.

---

## Requirements

### BG-001 — Page Background Color

**Requirement**
- Update the global page background color to a light green tone.
- Apply the change only through shared CSS tokens (public/assets/css/base.css) so it affects the entire shell without altering layout or component styles.
- Do not change panel, card, or input backgrounds unless explicitly required by this REQ.

**Acceptance Criteria**
- [x] `--page-bg` uses the new light green color value.
- [x] No changes to layout sizing, spacing, or scroll behavior (UI-3.1, UI-3.2).
- [x] No changes to JavaScript, calculator HTML, or navigation configuration.

### BG-002 — Functional Guardrail

**Requirement**
- Theme updates must not alter any calculator functionality or interactions.

**Acceptance Criteria**
- [x] No edits to public/assets/js/** files.
- [x] No changes to calculator input, output, or navigation logic.

---

## Completion Checklist (for implementer)

- [x] `--page-bg` updated to light green in public/assets/css/base.css.
- [x] Layout and component sizing unchanged.
- [x] No calculator logic changes.

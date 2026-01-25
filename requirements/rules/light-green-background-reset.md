# Light Green Background Reset Requirements

**REQ-ID:** REQ-20260125-002  
**Title:** Light Green Background Reset  
**Type:** Visual Theme Update  
**Priority:** MEDIUM  
**Status:** COMPLETE  
**Created:** 2026-01-25

---

## Scope

**In Scope:** Global page and shell background color only.  
**Out of Scope:** Layout dimensions, pane ratios, typography, component styling, navigation hierarchy, calculator logic, input validation, build tooling.  
**Authority:** Universal UI Contract (UI-3.1, UI-3.2).  
**Change Type:** Layout/CSS.

---

## Requirements

### BG-030 — Reset to Light Green

**Requirement**
- Update the current background color to a light green tone.
- Apply the change only through shared CSS tokens in public/assets/css/base.css.
- Do not change panel, card, input, or component backgrounds beyond the page/shell background tokens.

**Acceptance Criteria**
- [x] `--page-bg` and `--shell-bg` updated to a light green color relative to the current background.
- [x] No changes to layout sizing, spacing, or scroll behavior (UI-3.1, UI-3.2).
- [x] No changes to JavaScript, calculator HTML, or navigation configuration.

### BG-031 — Functional Guardrail

**Requirement**
- Theme updates must not alter any calculator functionality or interactions.

**Acceptance Criteria**
- [x] No edits to public/assets/js/** files.
- [x] No changes to calculator input, output, or navigation logic.

---

## Completion Checklist (for implementer)

- [x] `--page-bg` and `--shell-bg` updated to the light green tone in public/assets/css/base.css.
- [x] Layout and component sizing unchanged.
- [x] No calculator logic changes.

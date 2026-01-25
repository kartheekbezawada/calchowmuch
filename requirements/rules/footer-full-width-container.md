# Footer Full-Width Container Requirements

**REQ-ID:** REQ-20260125-003  
**Title:** Footer Full-Width Container  
**Type:** Layout/CSS Update  
**Priority:** MEDIUM  
**Status:** COMPLETE  
**Created:** 2026-01-25

---

## Scope

**In Scope:** Footer container width and horizontal alignment.  
**Out of Scope:** Footer content order, typography scale, link targets, navigation hierarchy, calculator logic, JS behavior.  
**Authority:** Universal UI Contract (UI-3.1, UI-3.2, UI-3.5).  
**Change Type:** Layout/CSS.

---

## Requirements

### FTR-020 — Full-Width Footer Box

**Requirement**
- Footer background container must span the full width of the viewport (edge-to-edge).
- Remove any left/right constraining that makes the footer appear inset or boxed.

**Acceptance Criteria**
- [x] Footer background stretches from left edge to right edge of the page at all viewport widths.
- [x] No visible left/right gutters on the footer background.
- [x] Footer remains aligned with the rest of the layout (UI-3.1, UI-3.2).

### FTR-021 — Inner Content Alignment

**Requirement**
- Keep footer content centered within the full-width container using the existing inner container pattern.
- Maintain consistent horizontal padding for footer content.

**Acceptance Criteria**
- [x] Link row remains centered and aligned.
- [x] Inner padding remains consistent with site layout.

### FTR-022 — Functional Guardrail

**Requirement**
- Footer layout changes must not alter calculator functionality or interactions.

**Acceptance Criteria**
- [x] No edits to public/assets/js/** files.
- [x] No changes to calculator input, output, or navigation logic.

---

## Completion Checklist (for implementer)

- [x] Footer background spans full page width.
- [x] Footer content remains centered with consistent padding.
- [x] No calculator logic changes.

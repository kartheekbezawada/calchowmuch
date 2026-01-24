# Subtle Panel Corner Radius Requirements

**REQ-ID:** REQ-20260124-006  
**Title:** Subtle Panel Corner Radius  
**Type:** UI Styling  
**Priority:** MEDIUM  
**Status:** NEW  
**Created:** 2026-01-24

---

## Scope

**In Scope:** Calculation pane, explanation pane, and adsense pane panels/cards across the static layout.  
**Out of Scope:** Layout sizing, pane ratios, navigation hierarchy, typography, colors, calculator logic, or any input/result behavior.  
**Authority:** Universal UI and layout rules in requirements/universal/UNIVERSAL_REQUIREMENTS.md.  
**Change Type:** Layout/CSS (reference: testing_requirements.md §3).

---

## Requirements

### UI-RADIUS-001 — Use Subtle Corner Radius

**Requirement**
- Replace any `rounded-lg` usage on panel/card containers for the calculation pane, explanation pane, and adsense pane with `rounded`.
- The visual intent is smaller, more subtle rounding than the current large-radius panels.

**Acceptance Criteria**
- [ ] Calculation pane panel/container uses `rounded` and does not use `rounded-lg`.
- [ ] Explanation pane panel/container uses `rounded` and does not use `rounded-lg`.
- [ ] Adsense pane panel/container uses `rounded` and does not use `rounded-lg`.

### UI-RADIUS-002 — Consistency Across Panes

**Requirement**
- All three panes must use the same corner-radius class to preserve a unified card style.

**Acceptance Criteria**
- [ ] No pane uses a different radius class than the others (no mixed `rounded` and `rounded-lg`).

### UI-RADIUS-003 — Guardrail

**Requirement**
- Do not modify any spacing, padding, shadow, border, width/height, or scroll behavior for these panes.

**Acceptance Criteria**
- [ ] Only the corner-radius class changes for the specified panes; no other layout or behavior changes are introduced.

---

## Completion Checklist (for implementer)

- [ ] Identify pane containers for calculation, explanation, and adsense.
- [ ] Replace `rounded-lg` with `rounded` on those containers only.
- [ ] Confirm no other CSS/layout changes were introduced.
- [ ] Update compliance trackers after implementation begins (per WORKFLOW).

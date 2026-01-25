# Grey Scrollbars for Navigation, Calculation, and Explanation

**REQ-ID:** REQ-20260125-006  
**Title:** Grey Scrollbars for Nav/Calc/Explanation  
**Type:** UI Styling  
**Priority:** MEDIUM  
**Status:** NEW  
**Created:** 2026-01-25

---

## Scope

**In Scope:** Navigation pane, calculation pane, and explanation pane scrollbars in the fixed three-column layout.  
**Out of Scope:** Table scrollbar styling (UTBL-*), ads pane scrollbars, layout sizing, typography, colors outside scrollbar tokens, calculator logic, or navigation hierarchy.  
**Authority:** Universal UI contract in requirements/universal/UNIVERSAL_REQUIREMENTS.md (UI-4.1, UI-4.2, UI-4.3).  
**Change Type:** Layout/CSS (reference: testing_requirements.md §3).

---

## Requirements

### UI-SCROLL-001 — Use Universal Grey Scrollbar Tokens

**Requirement**
- Apply universal scrollbar styling to the navigation pane, calculation pane, and explanation pane.
- Thumb, hover, track, width, and radius must match the universal tokens:
  - Thumb: `#94a3b8` (UI-4.1)
  - Thumb hover: `#64748b` (UI-4.1)
  - Track: `#f1f5f9` (UI-4.1)
  - Width: `8px` (UI-4.1)
  - Thumb radius: `4px` (UI-4.3)

**Acceptance Criteria**
- [ ] Navigation pane scrollbar matches UI-4.1/4.3 tokens.
- [ ] Calculation pane scrollbar matches UI-4.1/4.3 tokens.
- [ ] Explanation pane scrollbar matches UI-4.1/4.3 tokens.

### UI-SCROLL-002 — Always-Visible Scrollbars

**Requirement**
- Navigation, calculation, and explanation panes must keep `overflow-y: scroll` and `scrollbar-gutter: stable` (UI-4.2).

**Acceptance Criteria**
- [ ] All three panes retain always-visible scrollbars.
- [ ] No pane switches to `overflow-y: auto`.

### UI-SCROLL-003 — No Unrelated UI Changes

**Requirement**
- Do not change spacing, panel sizing, layout structure, or typography as part of this requirement.

**Acceptance Criteria**
- [ ] Only scrollbar styling is updated for the specified panes.
- [ ] No changes to layout height, pane widths, or page structure.

---

## Completion Checklist (for implementer)

- [ ] Identify scrollable containers for navigation, calculation pane, and explanation pane.
- [ ] Ensure scrollbar tokens match UI-4.1/4.3 in both WebKit and Firefox.
- [ ] Verify `overflow-y: scroll` + `scrollbar-gutter: stable` remain intact.
- [ ] Update compliance trackers after implementation begins (per WORKFLOW).

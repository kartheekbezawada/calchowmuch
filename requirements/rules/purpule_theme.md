# Purple Theme Refresh Requirements

**REQ-ID:** REQ-20260124-001  
**Title:** Purple Theme Refresh  
**Type:** Visual Theme Update  
**Priority:** MEDIUM  
**Status:** NEW  
**Created:** 2026-01-24

---

## Scope

**In Scope:** Global color tokens, typography accents, shadow and border variables, scrollbar styling.  
**Out of Scope:** Layout dimensions, pane ratios, navigation hierarchy, calculator logic, input validation, build tooling.  
**Authority:** requirements/compliance/purple_theme.md defines the canonical palette and spacing tokens.  
**Change Type:** Layout/CSS (reference: testing_requirements.md §3).

---

## Requirements

### THEME-001 — Global Palette Alignment

**Requirement**
- Replace existing accent and neutral colors with the palette documented in requirements/compliance/purple_theme.md.
- Apply the palette via shared CSS tokens in public/assets/css/base.css and public/assets/css/layout.css only when necessary to propagate theme changes platform-wide.
- Preserve accessibility: contrast ratios must continue to meet WCAG AA for body text and interactive states (UI-2.1, UI-2.3).

**Acceptance Criteria**
- [ ] Accent elements (primary buttons, active navigation) use purple range (#667eea through #764ba2).
- [ ] Neutral surfaces maintain legibility with updated navy and gray tones.
- [ ] No calculator-specific CSS duplicates global tokens (AP-2.2).

### THEME-002 — Layout Guardrail

**Requirement**
- Theme updates must not alter layout sizing, flex distributions, or fixed-height shell constraints (UI-3.1, UI-3.2).
- Calculators, navigation panes, and ads must retain current spacing, widths, and scroll behaviors.

**Acceptance Criteria**
- [ ] No changes to flex-basis, width, height, or gap values outside palette token substitutions.
- [ ] No regression in shell height or internal scroll containers (ARCH-1.1, ARCH-1.2, UI-3.2).

### THEME-003 — Functional Guardrail

**Requirement**
- JavaScript modules, calculators, and navigation logic must remain untouched except for class name adjustments strictly required for theme token adoption.
- Validate that compute outputs, button flows, and navigation interactions remain identical to the pre-theme state (PI-1.3).

**Acceptance Criteria**
- [ ] No modifications to public/assets/js/** logic files.
- [ ] No new or removed HTML inputs, buttons, or structural elements in calculators.
- [ ] Visual regression limited to color, typography, and shadow changes only.

### THEME-004 — Scrollbar Consistency

**Requirement**
- Update scrollbar styling to the purple theme while honoring universal scrollbar rules (UI-4.1 through UI-4.3).

**Acceptance Criteria**
- [ ] Scrollbar track and thumb colors match the theme palette.
- [ ] Scrollbars remain always visible with width and radius per universal rules.

---

## Completion Checklist (for implementer)

- [ ] Palette tokens updated per requirements/compliance/purple_theme.md.
- [ ] Layout dimensions unchanged (verified via spot-check of shell and calculator panes).
- [ ] No JavaScript or calculator HTML logic changes beyond theme class adjustments.
- [ ] Scrollbars themed without violating UI-4.* rules.
- [ ] Requirement added to compliance trackers before implementation begins.

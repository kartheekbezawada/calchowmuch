# System Font Stack + Typography Scale Requirements

**REQ-ID:** REQ-20260124-010  
**Title:** System Font Stack + Typography Scale  
**Type:** Visual Theme Update  
**Priority:** MEDIUM  
**Status:** COMPLETE  
**Created:** 2026-01-24

---

## Scope

**In Scope:** Global typography tokens and font weights/sizes.  
**Out of Scope:** Layout dimensions, navigation structure, calculator logic, input validation, SEO metadata, build tooling.  
**Authority:** Universal UI Contract (UI-1.2, UI-1.3, UI-3.1, UI-3.2).  
**Change Type:** Layout/CSS.

---

## Requirements

### TYPO-010 — System Font Stack Only

**Requirement**
- Use the Tailwind CSS default system font stack globally: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
- Do not import or reference any custom fonts.

**Acceptance Criteria**
- [x] Global font stack updated to the system font stack only.
- [x] No `@import`, `@font-face`, or external font links added.

### TYPO-011 — Font Weight Hierarchy

**Requirement**
- Headers/Titles: `font-bold` (700).
- Subheadings: `font-semibold` (600).
- Buttons & Navigation: `font-medium` (500).
- Body text: normal/default (400).

**Acceptance Criteria**
- [x] Typography rules map headers/titles to 700 weight.
- [x] Subheadings use 600 weight.
- [x] Buttons and navigation use 500 weight.
- [x] Body copy defaults to 400 weight.

### TYPO-012 — Text Size Scale

**Requirement**
- Main site title: `text-4xl`.
- Section headings: `text-2xl`.
- Subheadings: `text-xl`.
- Body text: `text-base` (default).
- Small text (sidebar, table data): `text-sm`.
- Tiny labels: `text-xs`.

**Acceptance Criteria**
- [x] Size tokens applied consistently to the site title, section headings, subheadings, body, small text, and tiny labels.
- [x] No custom font size tokens outside this scale for these elements.

### TYPO-013 — Examples (Verification)

**Requirement**
- "CALCULATE HOW MUCH" heading: `text-4xl font-bold`.
- "Hire Purchase Calculator": `text-2xl font-bold`.
- Button text: `font-medium`.
- Table data: `text-sm`.
- Footer links: `text-sm`.

**Acceptance Criteria**
- [x] Example elements match the specified sizes and weights in the implemented UI.

### TYPO-014 — Functional Guardrail

**Requirement**
- Typography updates must not alter calculator functionality or interactions.

**Acceptance Criteria**
- [x] No edits to public/assets/js/** files.
- [x] No changes to calculator input, output, or navigation logic.

---

## Completion Checklist (for implementer)

- [x] System font stack applied globally with no custom font imports.
- [x] Font weight hierarchy applied to headings, subheadings, buttons/nav, and body text.
- [x] Text size scale applied to title, headings, subheadings, body, small, and tiny labels.
- [x] Examples verified in UI.
- [x] No calculator logic changes.

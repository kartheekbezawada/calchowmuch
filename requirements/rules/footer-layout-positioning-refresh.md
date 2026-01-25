# Footer Layout & Positioning Refresh Requirements

**REQ-ID:** REQ-20260125-001  
**Title:** Footer Layout & Positioning Refresh  
**Type:** Layout/CSS Update  
**Priority:** MEDIUM  
**Status:** COMPLETE  
**Created:** 2026-01-25

---

## Scope

**In Scope:** Global footer layout, positioning, spacing, and link styling.  
**Out of Scope:** Header, navigation hierarchy, calculator content, JS logic, SEO metadata beyond footer link text.  
**Authority:** Universal UI Contract (UI-3.1, UI-3.2, UI-3.5).  
**Change Type:** Layout/CSS.

---

## Requirements

### FTR-010 — Footer Positioning (Flex Layout)

**Requirement**
- Footer must be anchored to the bottom of the page using flexbox.
- Parent container uses `min-h-screen flex flex-col`.
- Main content uses `flex-grow`.

**Acceptance Criteria**
- [x] Footer remains at bottom when content is short.
- [x] Footer does not overlap content when content is long.
- [x] Layout stability preserved (UI-3.1, UI-3.2).

### FTR-011 — Footer Container & Background

**Requirement**
- Full-width footer with white background (`bg-white`).
- Top border separator: `border-t border-gray-200` (1px solid `#e5e7eb`).
- Vertical padding: `py-4` (1rem top and bottom).
- Top margin: `mt-8` (2rem gap from main content).
- Inner container: `container mx-auto px-4` (centered with horizontal padding).

**Acceptance Criteria**
- [x] Footer background is white across full width.
- [x] 1px top border with `#e5e7eb` visible.
- [x] Spacing matches padding and margin values above.
- [x] Content centered with horizontal padding.

### FTR-012 — Content Layout

**Requirement**
- Use `flex justify-center items-center` to center links horizontally and vertically.
- Apply `gap-6` between elements.
- Single row of links with pipe separators.

**Acceptance Criteria**
- [x] Links are in one horizontal row with consistent spacing.
- [x] Pipe separators appear between each link.

### FTR-013 — Text Styling

**Requirement**
- Font size: `text-sm` (0.875rem).
- Text color: `text-gray-600` (`#4b5563`).
- Font weight: normal (default, not bold).

**Acceptance Criteria**
- [x] Footer text renders at `text-sm` and normal weight.
- [x] Text color equals `#4b5563`.

### FTR-014 — Links & Hover

**Requirement**
- Links are `<a>` tags for: Privacy, Terms & Conditions, Contact, FAQs.
- Default color: `text-gray-600`.
- Hover state: `hover:text-indigo-600` (change to `#4f46e5`).
- No underline.

**Acceptance Criteria**
- [x] Link order matches requirements.
- [x] Hover changes to `#4f46e5`.
- [x] Links render without underline.

### FTR-015 — Separators

**Requirement**
- Use pipe `|` separators in `<span>` tags between each link.
- Separator color matches `text-gray-600`.

**Acceptance Criteria**
- [x] Pipes appear only between links.
- [x] Pipe color matches `#4b5563`.

### FTR-016 — Footer Content (Exact Order)

**Requirement**
- Footer content order: `Privacy | Terms & Conditions | Contact | FAQs | © 2026 @CalcHowMuch`.

**Acceptance Criteria**
- [x] Footer content and order match exactly.

### FTR-017 — Functional Guardrail

**Requirement**
- Footer updates must not alter calculator functionality or interactions.

**Acceptance Criteria**
- [x] No edits to public/assets/js/** files.
- [x] No changes to calculator input, output, or navigation logic.

---

## Completion Checklist (for implementer)

- [x] Footer positioned at bottom via flex layout.
- [x] Background, border, margin, and padding match specified values.
- [x] Links, separators, and typography match specified styles.
- [x] Footer content order verified.
- [x] No calculator logic changes.

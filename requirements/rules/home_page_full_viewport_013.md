# Home Page Full-Viewport Layout Requirements

**REQ-ID:** REQ-20260127-013  
**Title:** Home page full-viewport layout (remove shell on /)  
**Type:** Site  
**Priority:** HIGH  
**Status:** NEW  
**Created:** 2026-01-27

---

## Context

This requirement ensures that the home page (/) receives the same full-viewport layout treatment that was implemented for calculator pages in REQ-20260127-011. The home page needs specific handling to remove outer shell constraints while maintaining its unique layout structure.

---

## Scope

**In Scope:** 
- Apply full-viewport width treatment to home page (/) specifically
- Remove outer page shell constraints that create left/right empty space on homepage
- Ensure homepage content spans 100% viewport width
- Preserve existing homepage layout structure and functionality
- Maintain consistency with calculator pages' full-viewport treatment

**Out of Scope:** 
- Changes to homepage content or functionality
- Header or footer modifications (handled by other requirements)
- Internal layout element changes
- Calculator page modifications (already complete in REQ-20260127-011)

**Authority:** This requirement extends the full-viewport layout pattern established in REQ-20260127-011 to the home page.  
**Change Type:** Layout/CSS (reference: testing_requirements.md §3).

---

## Requirements

### HOME-VIEWPORT-001 — Homepage Shell Constraint Removal

**Requirement**
- Remove or neutralize outer page shell constraints on homepage (/) that create empty space
- Apply same treatment as REQ-20260127-011 but specifically for homepage layout
- Ensure homepage spans 100% viewport width without horizontal empty space
- Maintain existing homepage layout structure and content organization

**Acceptance Criteria**
- Homepage content spans full viewport width
- No empty space on left or right sides of homepage
- Internal homepage layout elements maintain current dimensions and behavior
- Visual consistency with calculator pages' full-viewport treatment
- No horizontal scrollbars introduced

### HOME-VIEWPORT-002 — Layout Structure Preservation

**Requirement**
- Preserve homepage's unique layout structure while removing outer constraints
- Maintain navigation presentation and functionality
- Keep existing content organization and hierarchy
- Ensure responsive behavior works correctly at all viewport sizes

**Acceptance Criteria**  
- Homepage layout visually identical except for full-width span
- Navigation elements maintain current positioning and functionality
- Content sections maintain proper spacing and alignment
- Responsive breakpoints work correctly
- Typography and visual hierarchy unchanged

### HOME-VIEWPORT-003 — Header Integration Compatibility

**Requirement**
- Ensure homepage full-viewport layout works correctly with global header (REQ-20260127-012)
- Maintain proper spacing and layout relationships
- Verify no conflicts between homepage layout and global header implementation

**Acceptance Criteria**
- Homepage works correctly with global premium header
- No layout conflicts or visual issues
- Proper spacing maintained between header and homepage content
- Header functionality works correctly on homepage

---

## Technical Notes

**Implementation Pattern (from REQ-20260127-011):**
```css
/* Remove outer page constraints */
.page {
  width: 100vw;
  margin: 0;
  padding: 0;
  /* Remove max-width and centering */
}
```

**Homepage-Specific Considerations:**
- Homepage may have different layout structure than calculator pages
- Content sections may need individual width constraints while outer shell spans full viewport
- Navigation layout may differ from calculator page navigation

**Files Likely Affected:**
- `/public/index.html` (homepage structure)
- `/public/assets/css/layout.css` (homepage-specific styles)
- `/public/assets/css/base.css` (if page-level constraints exist)

**Consistency Requirements:**
- Implementation must match the pattern established in REQ-20260127-011
- Visual result should be consistent with calculator pages
- Same technical approach for constraint removal

---

## Relationship to Previous Requirements

**REQ-20260127-011 Reference:**
This requirement applies the same technical solution implemented for calculator pages to the homepage. The homepage was not explicitly included in REQ-20260127-011's scope, necessitating this separate requirement.

**REQ-20260127-012 Compatibility:**
Must work correctly with the global premium header bar implementation.

---

## Test Strategy

**Required Testing (per testing_requirements.md §3 - Layout/CSS):**
- Homepage visual regression testing
- Cross-browser compatibility testing
- Responsive behavior verification across viewport widths
- Header integration testing
- Content layout preservation verification

**Success Criteria:**
- Homepage spans full viewport width like calculator pages
- No empty horizontal space on homepage
- Layout structure and functionality preserved
- Header integration works correctly
- Responsive behavior maintains quality
- Performance metrics stable or improved

---

## Dependencies

**Upstream Dependencies:** 
- REQ-20260127-011 (provides technical pattern)
- REQ-20260127-012 (global header compatibility)

**Downstream Impact:**
- Homepage layout spans full viewport
- Consistency with calculator page experience
- User experience continuity across site

**Risk Assessment:** LOW - Applying proven pattern from REQ-20260127-011 to homepage with minimal risk since the technical approach is established.
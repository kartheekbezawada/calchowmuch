# Premium Dark Theme Global Default Requirements

**REQ-ID:** REQ-20260127-009  
**Title:** Enable premium-dark theme globally by default  
**Type:** Theme  
**Priority:** HIGH  
**Status:** NEW  
**Created:** 2026-01-27

---

## Scope

**In Scope:** 
- Making premium-dark theme the global default across all calculators and pages
- Removing individual theme CSS inclusions per page
- Ensuring consistent dark theme application sitewide
- Updating any theme-related build processes or configurations

**Out of Scope:** 
- Creating new theme variants
- Modifying existing premium-dark theme styling
- User theme switching functionality
- Calculator logic or functionality changes

**Authority:** This requirement defines the canonical approach for applying premium-dark theme globally.  
**Change Type:** Layout/CSS (reference: testing_requirements.md §3).

---

## Requirements

### THEME-GLOBAL-001 — Global Theme Integration

**Requirement**
- Integrate theme-premium-dark.css as the global default theme applied to all pages and calculators
- Remove individual `<link rel="stylesheet" href="/assets/css/theme-premium-dark.css?v=XXXXXX" />` inclusions from individual calculator and page HTML files
- Ensure theme is loaded through the base layout system rather than per-page inclusion
- Maintain all existing premium-dark styling and visual appearance

**Acceptance Criteria**
- All calculators render with premium-dark theme by default
- No individual page includes theme-premium-dark.css directly
- Theme loads once globally rather than per-page
- Visual appearance remains identical to current premium-dark implementation
- Page load performance is maintained or improved through reduced CSS duplication

### THEME-GLOBAL-002 — Layout System Integration

**Requirement**
- Integrate theme loading into the core layout system (base.css, layout.css, or page-shell.html)
- Ensure theme applies to all page types: calculators, content pages, and navigation
- Verify theme compatibility with existing layout components

**Acceptance Criteria**  
- Theme applies consistently across all page layouts
- Navigation, calculators, and content areas all use premium-dark styling
- No visual regressions in existing layouts
- Color scheme and gradient application remains consistent

### THEME-GLOBAL-003 — Build System Compatibility

**Requirement**
- Ensure global theme integration works with existing build processes
- Maintain cache versioning strategy for theme assets
- Update any theme-related configuration or metadata

**Acceptance Criteria**
- Theme assets load with proper cache versioning
- Build processes handle global theme correctly
- No build warnings or errors related to theme integration
- Static hosting continues to serve theme correctly

---

## Technical Notes

**Current Implementation:** Premium-dark theme exists as `/public/assets/css/theme-premium-dark.css` and is individually included on most calculator pages.

**Target Implementation:** Theme should be globally available and applied by default without requiring individual page inclusions.

**Files Likely Affected:**
- `/public/assets/css/base.css` (potential global integration point)
- `/public/layout/page-shell.html` (if used as layout template)  
- Individual calculator HTML files (removing theme links)
- Any build scripts that handle CSS compilation or versioning

**Compatibility Requirements:**
- Must work with existing MPA architecture
- Must maintain current visual appearance
- Must not break existing calculator functionality
- Must support static hosting deployment

---

## Test Strategy

**Required Testing (per testing_requirements.md §3 - Layout/CSS):**
- Visual regression testing across multiple calculators
- Cross-browser compatibility testing
- Page load performance verification
- CSS validation and accessibility checks

**Success Criteria:**
- All calculators maintain identical visual appearance
- Global theme loads correctly on all page types
- No CSS conflicts or rendering issues
- Performance metrics remain stable or improve

---

## Dependencies

**Upstream Dependencies:** None

**Downstream Impact:**
- All calculator pages will be affected
- Content pages may need theme application verification
- Navigation system should inherit global theme

**Risk Assessment:** LOW - This is primarily a refactoring change to improve maintainability rather than changing visual appearance.
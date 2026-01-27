# Remove Navigation Shell - Single Page Layout Requirements

**REQ-ID:** REQ-20260127-010  
**Title:** Remove navigation shell - single page layout  
**Type:** Site  
**Priority:** HIGH  
**Status:** NEW  
**Created:** 2026-01-27

---

## Scope

**In Scope:** 
- Remove header navigation structure (site-header)
- Remove top navigation bar (top-nav)
- Remove left navigation sidebar (left-nav)
- Remove three-column layout structure (layout-main)
- Maintain footer structure and functionality
- Convert to single-page layout with content taking full width
- Preserve all calculator functionality

**Out of Scope:** 
- Footer modification (footer remains as-is)
- Calculator logic changes
- Content or copy changes
- Theme modifications
- SEO metadata changes (beyond navigation removal impact)

**Authority:** This requirement defines the transition from multi-column navigation layout to single-page layout.  
**Change Type:** Layout/CSS + Architecture (reference: testing_requirements.md §3 + §2).

---

## Requirements

### LAYOUT-001 — Navigation Shell Removal

**Requirement**
- Remove `<header class="site-header">` element from all pages
- Remove `<nav class="top-nav">` navigation bar from all pages  
- Remove `<aside class="left-nav">` sidebar from all pages
- Remove `<main class="layout-main">` wrapper that creates three-column layout
- Preserve page structure: html > body > div.page > [content] > footer

**Acceptance Criteria**
- No site-header, top-nav, or left-nav elements present on any page
- Content area takes full available width minus margins
- Footer remains in its current position and functionality
- Page maintains semantic HTML structure
- All calculator content remains accessible and functional

### LAYOUT-002 — Single Page Content Layout

**Requirement**
- Convert calculator content areas to take full page width
- Maintain appropriate margins and padding for readability
- Ensure calculator inputs, outputs, and explanations remain properly styled
- Preserve content hierarchy and visual organization

**Acceptance Criteria**  
- Calculator content spans appropriate width (not uncomfortably wide)
- Text remains readable with proper line lengths
- Input/output areas maintain proper spacing and alignment
- Visual hierarchy remains clear and navigable
- Responsive behavior works across device sizes

### LAYOUT-003 — Footer Preservation

**Requirement**
- Keep footer exactly as currently implemented
- Maintain footer positioning, styling, and links
- Ensure footer works correctly with new single-page layout
- Preserve footer responsiveness and accessibility

**Acceptance Criteria**
- Footer appears identical to current implementation
- All footer links remain functional
- Footer positioning works correctly with new layout
- Footer responsive behavior unchanged
- Copyright and legal links remain accessible

### LAYOUT-004 — CSS and JavaScript Updates

**Requirement**
- Update layout.css to remove three-column layout styles
- Remove navigation-related JavaScript functionality (mpa-nav.js usage)
- Update calculator.css if needed for new layout
- Maintain theme compatibility with layout changes

**Acceptance Criteria**
- No unused CSS for removed navigation elements
- No JavaScript errors from missing navigation elements
- Theme styles apply correctly to new layout
- No visual regressions in calculator functionality
- Performance maintained or improved

---

## Technical Notes

**Current Layout Structure:**
```html
<div class="page">
  <header class="site-header">...</header>
  <nav class="top-nav">...</nav>
  <main class="layout-main">
    <aside class="left-nav">...</aside>
    <section class="calculator-section">...</section>
    <aside class="right-content">...</aside>
  </main>
  <footer>...</footer>
</div>
```

**Target Layout Structure:**
```html
<div class="page">
  <section class="calculator-section">...</section>
  <footer>...</footer>
</div>
```

**Files Likely Affected:**
- All calculator HTML files (removing navigation markup)
- `/public/index.html` (homepage layout)
- `/public/assets/css/layout.css` (removing navigation styles)
- `/public/assets/css/calculator.css` (adjusting for full width)
- Content pages that use navigation shell
- Any layout template files

**Navigation Replacement Strategy:**
Since navigation is being removed, consider:
- Internal linking within calculator content
- Breadcrumb or contextual navigation if needed
- Search engine discoverability without navigation structure

---

## SEO Impact Analysis

**Impact Areas:**
- Internal linking structure changes
- Navigation breadcrumbs removed
- Category-based organization no longer visible
- Site architecture simplification

**Required SEO Updates:**
- Update sitemap.xml if navigation affects URL structure
- Review internal linking strategy
- Consider adding contextual links within calculator content
- Monitor search engine crawling of simplified structure

---

## Test Strategy

**Required Testing (per testing_requirements.md):**
- **Layout/CSS Testing (§3):** Visual regression across all calculators
- **Architecture Testing (§2):** Functionality verification across affected pages
- Cross-browser compatibility testing
- Responsive design testing
- Performance impact measurement
- Accessibility testing (navigation removal impact)

**Success Criteria:**
- All calculators function identically without navigation shell
- Content displays properly across devices and browsers
- Footer remains functional and positioned correctly
- No broken layouts or visual artifacts
- Performance metrics stable or improved
- Accessibility standards maintained

---

## Dependencies

**Upstream Dependencies:** None

**Downstream Impact:**
- All calculator pages affected
- Homepage layout changed
- Content pages simplified
- Theme application may need adjustment
- JavaScript navigation code becomes unused

**Risk Assessment:** MEDIUM - Significant layout change affecting all pages, but functionality should remain intact since only navigation chrome is removed.
# Global Premium Header Bar with Brand and Search Requirements

**REQ-ID:** REQ-20260127-012  
**Title:** Global premium header bar with brand and search  
**Type:** Site  
**Priority:** HIGH  
**Status:** NEW  
**Created:** 2026-01-27

---

## Scope

**In Scope:** 
- Replace current large "CALCULATE HOW MUCH" page header with premium top header bar
- Apply to all calculator pages and landing/category pages  
- Create shared layout component (not per-page duplication)
- Implement three-section layout: brand/logo, center hero, search functionality
- Remove existing large title from page body content
- Maintain existing calculator pane layouts and functionality

**Out of Scope:** 
- Calculator logic changes
- Pane width/height modifications  
- Footer changes
- Theme system overhaul (work within existing CSS)
- Data collection or search logging

**Authority:** This requirement defines the replacement of page-level title headers with a global premium header bar.  
**Change Type:** Layout/CSS + UI/Flow (reference: testing_requirements.md §3 + §4).

---

## Requirements

### HEADER-001 — Header Bar Container Structure

**Requirement**
- Add fixed-height top bar with premium visual treatment:
  - **Height:** 72px fixed
  - **Background:** Dark premium tone with subtle transparency + blur effect
  - **Bottom border:** Soft line separator
  - **Width:** Full viewport width span
- Inner content container:
  - **Max width:** 1800px (or closest current site max container)  
  - **Horizontal padding:** 24px
  - **Vertical alignment:** Center all items within 72px bar
  - **Layout:** Left/center/right regions with space-between alignment

**Acceptance Criteria**
- Header bar appears consistently on all calculator and category pages
- Fixed 72px height maintained across viewport widths
- Premium visual styling matches existing dark theme
- Content properly constrained and centered
- No layout shifts introduced (CLS = 0)

### HEADER-002 — Left Section (Brand/Home Navigation)

**Requirement**
- **Logo button (clickable):**
  - Calculator icon inside rounded square
  - Gradient fill (blue → cyan matching theme)
  - Acts as Home navigation (routes to site homepage)
  - ARIA label: "Home"
- **Brand name text:**
  - Text: "CalcHowMuch"
  - Gradient text styling (blue → cyan)
  - Font weight: heavy/bold
- **Premium badge line:**
  - Small orange "sparkle/star" icon
  - Label: "Premium Calculator Suite"
  - Must be clickable and keyboard accessible
  - Routes to Home Loans category page (or Home Loans landing)

**Acceptance Criteria**
- Entire brand block present on all pages
- Logo and brand accessible with proper ARIA labels
- Premium badge clearly clickable with proper focus states
- Navigation routing works correctly
- Visual styling matches premium dark theme

### HEADER-003 — Center Section (Hero Title + Tagline)

**Requirement**
- **Main title:**
  - Text: "Calculate How Much"
  - Gradient text (blue → cyan → blue)
  - Smaller than current large all-caps title
  - Professional, refined appearance
- **Sub-title:**
  - Text: "Quick calculations for everyday numbers"
  - Small muted text styling
  - Positioned below main title

**Acceptance Criteria**
- Center hero integrated into top bar (not separate element)
- Existing large capital title removed from page body entirely
- New title does not affect pane sizes or layout below
- Gradient text styling consistent with theme
- Readable and accessible text contrast

### HEADER-004 — Right Section (Search Functionality)

**Requirement**
- **Search input field:**
  - Placeholder: "Search calculators…"
  - Rounded corners consistent with site design
  - Dark background with subtle border
  - Search icon inside input (left-aligned)
- **Search behavior:**
  - Filter calculator navigation items (minimum: left navigation list)
  - Purely client-side functionality
  - No data collection or query logging
  - Enter key selects top match OR does nothing (no layout break)

**Acceptance Criteria**
- Search input styled consistently with dark theme
- Search icon properly positioned and accessible
- Client-side filtering works correctly
- No network requests or data logging
- Enter key behavior defined and safe
- Search results update navigation dynamically

### HEADER-005 — Responsive Requirements

**Requirement**
- **Mobile behavior:**
  - Hamburger/menu icon may appear (optional)
  - Center hero may reduce font size or collapse tagline
  - Search may shrink or collapse to icon
  - Must not break layout at any viewport size
- **Desktop behavior:**
  - Left brand block, center hero, and right search visible together
  - Full layout maintained across desktop viewport widths

**Acceptance Criteria**
- Header responsive across all device sizes
- Mobile breakpoints handled gracefully
- Desktop layout maintains all three sections
- No horizontal scrollbars introduced
- Touch targets meet accessibility guidelines

### HEADER-006 — Layout Integration and Replacement

**Requirement**
- Remove existing large "CALCULATE HOW MUCH" title block from main content area
- Ensure no duplicated branding appears above panes after header implementation
- Header must be part of shared layout shell (not per-page markup)
- Must not alter existing pane layouts:
  - Pane widths/heights unchanged
  - Scroll behavior of panes unchanged  
  - Footer layout unchanged

**Acceptance Criteria**
- Old page title completely removed
- No branding duplication
- Header integrated into layout system
- Pane dimensions pixel-identical to current
- Footer positioning unchanged
- Scrollbar behavior preserved

---

## Technical Notes

**Visual Design Specifications:**
- **Header Height:** 72px fixed
- **Background:** Dark with transparency + blur
- **Typography:** Gradient blue → cyan for brand elements
- **Icons:** Calculator icon, search icon, premium star/sparkle
- **Layout:** CSS Grid or Flexbox with space-between
- **Responsive:** Mobile-first with desktop enhancements

**Integration Points:**
- Shared layout component (likely in `/public/layout/` or similar)
- CSS integration with existing theme system
- JavaScript for search functionality
- Navigation routing integration

**Files Likely Affected:**
- `/public/layout/header.html` (new component)
- `/public/assets/css/layout.css` (header styles)  
- All calculator HTML files (header inclusion, title removal)
- `/public/assets/js/` (search functionality)
- Navigation configuration files

**Search Implementation Notes:**
- Filter existing navigation data structure
- Use existing calculator metadata/registry if available
- Client-side JavaScript only
- No analytics or tracking
- Graceful fallback for JavaScript disabled

---

## Accessibility Requirements

**WCAG Compliance:**
- All interactive elements keyboard navigable
- Proper ARIA labels for logo and brand elements
- Color contrast meeting AA standards
- Focus indicators visible and clear
- Search input properly labeled

**Keyboard Navigation:**
- Tab order: logo → brand → search input
- Enter/Space activate clickable elements
- Search input supports standard keyboard interactions
- Premium badge accessible via keyboard

---

## Performance Requirements

**Core Web Vitals:**
- **CLS:** Must remain stable (no layout shifts)
- **LCP:** Header should not delay page content loading
- **FID:** Search interactions must be responsive

**Loading Requirements:**
- Header renders immediately with page
- Search functionality progressive enhancement
- Icons optimized for fast loading
- No render-blocking resources

---

## Test Strategy

**Required Testing (per testing_requirements.md):**
- **Layout/CSS Testing (§3):** Visual regression across all pages
- **UI/Flow Testing (§4):** Navigation and search interactions
- Cross-browser compatibility testing
- Responsive design testing (mobile/tablet/desktop)
- Accessibility testing (screen readers, keyboard navigation)
- Performance impact measurement

**Critical Validation Points:**
- Header appears consistently across all pages
- Old title completely removed from all pages
- Pane layouts unchanged after header integration
- Search functionality works correctly
- Navigation routing functions properly
- Mobile responsive behavior correct

**Success Criteria:**
- Premium header bar appears on all calculator pages
- Visual design matches provided specifications
- Search filters navigation items correctly
- No layout regressions in calculator panes
- Performance metrics maintained or improved
- Accessibility standards met

---

## Dependencies

**Upstream Dependencies:** None

**Downstream Impact:**
- All calculator and category pages affected (header addition)
- Existing large title removed from all pages
- Navigation system integration (search functionality)
- Layout system modification (shared header component)

**Risk Assessment:** MEDIUM - Significant UI change affecting all pages, but calculator functionality remains unchanged. Primary risk is layout integration and ensuring no regressions in pane behavior.
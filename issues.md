# Issues Log — calchowmuch

This document tracks issues, bugs, and regressions found during development. Each issue is catalogued with a unique ID for reference.

---

## Issue Table

| Issue ID | Category | Status | Severity | Description | Root Cause | Resolution | Date Found | Date Resolved |
|----------|----------|--------|----------|-------------|------------|------------|------------|---------------|
| ISS-001 | UI/Layout | Resolved | P1 | Bouncing UI elements when navigating between calculators | Multiple causes: (1) Scrollbar appearing/disappearing, (2) Button transitions included `transform` property causing micro-movements on state changes. | Phase 1: Added scrollbar CSS styling with `overflow-y: scroll` and `scrollbar-gutter: stable`. Phase 2: Removed `transform` from button transition properties in layout.css. Added Playwright e2e tests for layout stability regression (9 tests). | 2026-01-15 | 2026-01-17 |
| ISS-002 | UI/Scrollbar | Resolved | P2 | Scrollbar not always visible on Navigation, Calculation, and Explanation panes | Missing CSS scrollbar styling. Panes used `overflow-y: auto` which hides scrollbar when content doesn't overflow. | Changed to `overflow-y: scroll` and added custom scrollbar styles with always-visible thumb and track. | 2026-01-15 | 2026-01-15 |
| ISS-003 | UI/Scrollbar | Resolved | P2 | Scrollbar color (blue accent) not visually appealing on white background | Original requirement used accent color `#2563eb` for scrollbar thumb which was too bright/prominent. | Updated scrollbar thumb color to subtle gray `#94a3b8` (slate-400) and track to `#f1f5f9` (slate-100). Updated universal requirements. | 2026-01-15 | 2026-01-15 |
| ISS-004 | UI/Layout | Resolved | P1 | Calculation and Explanation panes oversized relative to the universal UI contract | Fixed min-height on `.center-column .panel` forced the panes taller than available shell height when header/nav rows grew. | Removed the forced min-height so the panes flex within the fixed-height shell. | 2026-01-16 | 2026-01-16 |

---

## Issue Categories

- **UI/Layout**: Layout shifts, element positioning, spacing issues
- **UI/Scrollbar**: Scrollbar visibility, styling, behavior
- **UI/Components**: Button, input, toggle issues
- **Navigation**: Navigation pane, routing, URL issues
- **Calculator**: Calculator-specific logic or UI issues
- **Performance**: Load time, rendering performance
- **SEO**: Meta tags, crawlability, URL structure

---

## Severity Levels

- **P0 Block**: Critical issue preventing use of application
- **P1 Fix**: High priority issue affecting user experience
- **P2 Suggest**: Medium priority improvement
- **P3 Minor**: Low priority, cosmetic issues

---

## Notes

- Issues should be referenced by ID in commits and PRs (e.g., "Fix ISS-001: Bouncing UI elements")
- Resolved issues should remain in the table for historical reference
- Root cause analysis helps prevent regression


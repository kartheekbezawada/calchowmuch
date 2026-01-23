# REQ-20260123-001: CalcHowMuch Universal Theme Shell

**Type:** Layout/CSS  
**Priority:** P0  
**Change Type:** Layout/CSS  
**SEO Impact:** Unknown  
**Source Artifact:** [requirements/compliance/calchowmuch-with-adsense (1).html](requirements/compliance/calchowmuch-with-adsense%20(1).html)

## Summary

Ship a site-wide theme shell that wraps every calculator page in the four-column layout, visual language, and behaviors demonstrated in the reference HTML while preserving all existing calculator functionality.

## Scope & Guardrails

- Applies to every document served from `public/calculators/` (including explanation panes) and the landing page shell.  
- Calculator logic, field IDs, events, and existing JS modules remain untouched; only container markup/CSS may change.  
- Ads are represented with production AdSense snippets when available; placeholders must remain styled if code is pending.  
- Navigation inventory must match `requirements/universal/calculator-hierarchy.md` exactly.

## Frozen Layout & Dimensions

| Zone | Width | Notes |
|------|-------|-------|
| Sidebar | 220px | Dark navy gradient background; vertical scrollbar always visible. |
| Calculator Card | 400px | Hosts calculator UI; gray scrollbar; height `calc(100vh - 175px)`. |
| Explanation Panel | 480px | Mirrors calculator card styling; gray scrollbar. |
| Ads Panel | 280px | Three stacked ad slots; purple scrollbar. |
| Total Shell | 1400px | Centered container with fixed width on desktop. |

All vertical panes share height and use `overflow-y: scroll` with `scrollbar-gutter: stable` to prevent layout shift.

## Structural Requirements

**Header**  
- Render hero background gradient exactly as supplied.  
- Include title “Calculate How Much”, subtitle copy, theme toggle, and settings icon.  
- Toggle uses sliding sun/moon glyph, animates knob, and updates `.theme-toggle.active` class.

**Category Tabs**  
- Math, Home Loan, Credit Cards, Auto Loans tabs render as pill buttons with icon spans.  
- Active tab inherits `.category-tab.active` styling; others respond to hover as in reference.

**Main Grid**  
- Implement `grid-template-columns: 220px 900px 280px`; middle column splits into calculator and explanation cards via nested grid.  
- Sidebar sections include search input, section headers with gradient, calculator list items with active styling, and maintain alphabetical order within groups.  
- Calculator and explanation cards accept existing markup without ID changes; embed calculator/explanation content directly inside provided containers.

**Ads Panel**  
- Provide three ad containers sized for 300x250, 300x280, 300x400 creatives (rendered at 260px width with padding).  
- Each slot labeled for replacement with production AdSense code.

**Footer**  
- Single-line layout with links: Privacy | Terms & Conditions | Contact | FAQs | © 2026 @CalcHowMuch.  
- Brand handle rendered in accent purple.

## Visual & Token Requirements

- Reuse palette exactly: header/sidebar navy gradients, accent purple `#667eea`/`#764ba2`, neutral grays as provided.  
- Typography defaults to Segoe UI/Tahoma stack as in reference.  
- Drop shadows, border radii, spacing, and hover states match reference CSS (copy declarations verbatim).  
- Scrollbars use supplied colors (purple for shell panes, gray for cards).  
- Theme toggle hover/focus states align with sample.

## Responsive Behavior

- ≥1440px: four-column desktop layout with fixed widths.  
- 768–1200px: sidebar and content stack vertically, ads panel hidden.  
- <768px: full vertical stacking; ensure calculator and explanation remain usable; theme toggle accessible.  
- No horizontal scrollbars at supported breakpoints.

## Non-Goals

- Do not rewrite calculator logic or IDs.  
- Do not introduce additional color tokens or breakpoints.  
- Do not alter copy unless accessibility requires aria labels.  
- Do not modify data fetching or JS modules outside theme toggle script.

## Acceptance Criteria

**Layout Shell**
- [ ] Each calculator page renders header, category tabs, sidebar, calculator card, explanation panel, ads panel, and footer as specified.  
- [ ] Grid widths and heights match table above on desktop; scrollbars remain visible at all times.  
- [ ] Calculator and explanation content slots preserve existing functionality.  
- [ ] Sidebar inventory matches calculator hierarchy with current page flagged using `.nav-item.active`.

**Interactions**
- [ ] Theme toggle animates knob, swaps sun/moon icons, and toggles `.active` class.  
- [ ] Category tabs expose hover/focus transitions; active tab styled per reference.  
- [ ] Sidebar links show hover padding shift and maintain keyboard focus outline.  
- [ ] Ads slots ready for AdSense code and retain layout if code omitted.

**Responsive**
- [ ] Desktop (1920px/1440px) holds four-column layout without overflow.  
- [ ] Tablet (1024px/768px) stacks content per reference and hides ads column.  
- [ ] Mobile (375px) delivers single-column flow with accessible controls.  
- [ ] No layout shift when scrollbars appear/disappear.

**Quality Gates**
- [ ] No console errors introduced by theme toggle script.  
- [ ] Existing Vitest/Playwright suites remain unaffected; manual smoke confirms at least one calculator end-to-end.  
- [ ] Documented deviations captured in `issue_tracker.md` if constraints block implementation.

## Definition of Done

- Requirement tracker row moved to VERIFIED/CLOSED with evidence in compliance report.  
- Build/test/SEO trackers updated per workflow.  
- All calculators share uniform shell while delivering prior behavior.  
- Reference HTML honored as canonical design contract.
Mark that tab as active


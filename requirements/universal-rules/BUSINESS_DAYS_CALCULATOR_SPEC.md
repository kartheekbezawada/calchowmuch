# Business Days Calculator Spec

> [!IMPORTANT]
> This document is the authoritative implementation source for future build work on `/time-and-date/business-days-calculator/`. If later notes conflict, this file wins unless `UNIVERSAL_REQUIREMENTS.md` or explicit HUMAN direction says otherwise.

## 1. Route Identity

| Field | Value |
| :--- | :--- |
| Calculator Name | Business Days Calculator |
| Primary Route | `/time-and-date/business-days-calculator/` |
| Cluster | `time-and-date` |
| Route Role | Exact-match intent page for business-day counting and date shifting |
| Core Promise | Count business days between dates or add/subtract business days from a start date |
| Content Bias | Lean, intent-first, utility-led |
| Adjacent Routes | `/time-and-date/time-between-two-dates-calculator/`, `/time-and-date/days-until-a-date-calculator/`, `/time-and-date/countdown-timer/` |

## 2. Goal and Success Criteria

### Goal
Create a standalone exact-match route that captures users who specifically want business-day logic rather than broad date-difference tooling.

### Success Criteria
- The page immediately answers one of two jobs:
  - count business days between two dates
  - find the resulting date after adding or subtracting business days
- The route clearly differentiates itself from broader date tools without duplicating their full scope.
- The route supports custom workweeks and preset observed holidays for the US and UK.
- Above the fold, the page provides a clean headline answer, supporting summary cards, and utility actions.
- The route stays lean in content depth and avoids bloated long-form explanation or heavy result tables.

## 3. Differentiation From Existing Routes

### Against Time Between Two Dates
- `Time Between Two Dates` is the broader duration tool.
- `Business Days Calculator` is the exact-match working-days tool.
- `Business Days Calculator` should foreground business-day logic first, not total days first.

### Against Days Until a Date
- `Days Until a Date` centers countdown intent.
- `Business Days Calculator` centers working-day planning and date shifting.
- The new route should not read like a countdown page with a checkbox.

### Against Countdown Timer
- `Countdown Timer` is live ticking event timing.
- `Business Days Calculator` is schedule and planning math.
- The new route may link to countdowns for deadline tracking, but not inherit countdown framing.

## 4. Canonical UX Contract

### Primary Modes
The page must treat the following as equal first-class modes:

1. `Count Between Dates`
2. `Add/Subtract Business Days`

### Default Mode
- Default mode on first load: `Count Between Dates`

### Input Model

#### Count Between Dates
- Start date
- End date
- Workweek selector with custom working-day control
- Holiday preset selector
- Optional include/exclude rule text where needed, but avoid unnecessary clutter

#### Add/Subtract Business Days
- Start date
- Positive or negative business-day offset
- Workweek selector with custom working-day control
- Holiday preset selector

### Workweek Model
- Users must be able to define a custom workweek.
- The model is not limited to Monday-Friday.
- The interface should make clear which weekdays count as working days.
- The default workweek should be standard Monday-Friday.

### Holiday Model
- V1 supports preset observed holidays for:
  - United States
  - United Kingdom
- The page should describe these as observed holiday presets, not fixed-date-only shortcuts.
- Holiday behavior must be treated as part of the core calculation contract, not an optional afterthought.

### Result Package
Above the fold the result area must include:
- One headline answer
- Compact summary cards
- Copy summary action
- Calendar export action

### Result Emphasis Rules
- In `Count Between Dates`, the main answer should foreground business-day count.
- In `Add/Subtract Business Days`, the result date and the business-day offset outcome should receive equal visual weight.

## 5. Above-the-Fold Content Contract

### Intent Positioning
The page should feel like an exact-match utility route, not a broad content article.

### Required Above-the-Fold Elements
- Clear H1 matching route intent
- One short answer-first intro
- Mode selector
- Essential inputs only
- Headline answer
- Summary cards
- One compact related-tools row
- Copy summary
- Calendar export

### Required Above-the-Fold Omissions
- No heavy table
- No large explanation block
- No stacked related-link modules
- No broad date-math clutter that competes with the main job

## 6. Content Contract

### Content Depth
- Lean intent-led page
- Minimal FAQ
- No heavy editorial build-out

### Required Explanation Structure
1. Answer-first intro
2. Short practical explanation of what counts as a business day on this route
3. Minimal FAQ
4. Trust and assumptions notes
5. Bottom related-tools area

### Explicit Non-Goals
- No large worked-example section
- No large result tables
- No long comparison essay
- No content bloat added only for word count

## 7. Style Contract

### Baseline
- Inherit the normal `time-and-date` cluster presentation baseline by default.

### Explicit Overrides
Only these areas should be explicitly overridden if needed:
- Above-the-fold layout density
- Result-area emphasis
- Compact related-tools row behavior
- Utility action visibility for copy and calendar export

### Style Constraints
- Keep the page visually light and intent-led.
- Do not introduce debt-style heavy editorial sections.
- Keep paragraphs short and functional.
- Keep lists rare and utility-driven.

## 8. Required Utility Actions

### Copy Summary
- Must provide a concise copy-ready summary of the current result.
- Copy output must reflect the current mode and the selected workweek and holiday preset logic where relevant.

### Calendar Export
- Must be part of the route contract.
- Calendar export is required even though the page is not a countdown page.
- Export should support deadline and scheduling workflows, not be framed as a social/share feature.

## 9. Trust, Notes, and Assumptions

The page must explicitly communicate:
- Which weekdays count as working days
- Which holiday preset is active
- That US/UK holiday presets are observed-holiday-based in v1
- That results depend on the selected workweek and holiday preset

The page should avoid:
- ambiguous “weekdays only” shorthand without context
- hidden assumptions in the result interpretation zone

## 10. SEO and Intent Notes

### Primary Search Intent
- business days calculator
- working days between dates
- add business days to date
- subtract business days from date

### Route Framing
- This is the exact-match landing page for business-day intent.
- Broader duration, countdown, and date-difference jobs should be linked out rather than absorbed into this page.

### Snippet Promise
Metadata and on-page opening should consistently promise:
- business-day count
- business-day date shifting
- custom workweek
- holiday presets

## 11. Acceptance Scenarios

### Core Scenarios
1. Count business days between two dates using the default Monday-Friday workweek.
2. Count business days between two dates using a custom workweek.
3. Add business days to a date using the US observed-holiday preset.
4. Subtract business days from a date using the UK observed-holiday preset.
5. Change workweek selection and see the result update after calculation.
6. Copy a result summary that reflects the active mode and logic.
7. Use calendar export from the resulting business-day outcome.

### UX Scenarios
1. The route opens in `Count Between Dates`.
2. The route above the fold is usable without scrolling into a large guide.
3. The route distinguishes itself clearly from adjacent time/date pages.
4. The result area is useful without any heavy data table.

## 12. Build Checklist

Use this checklist as the mandatory build gate for future implementation.

- [ ] Route is locked to `/time-and-date/business-days-calculator/`.
- [ ] The calculator is named `Business Days Calculator` throughout route, metadata, and page UI.
- [ ] `Count Between Dates` and `Add/Subtract Business Days` are both first-class modes.
- [ ] Default mode is `Count Between Dates`.
- [ ] Custom workweek support is present.
- [ ] US observed-holiday preset is specified and implemented.
- [ ] UK observed-holiday preset is specified and implemented.
- [ ] Headline answer is present above the fold.
- [ ] Summary cards are present above the fold.
- [ ] Copy summary action is present above the fold.
- [ ] Calendar export action is present above the fold.
- [ ] One compact related-tools row is present above the fold.
- [ ] No heavy result table is required or introduced.
- [ ] Content stays lean and intent-first.
- [ ] FAQ stays minimal.
- [ ] Trust notes explicitly describe workweek and holiday assumptions.
- [ ] Acceptance scenarios are satisfied.
- [ ] All internal-link behavior matches `BUSINESS_DAYS_CALCULATOR_LINK_PLAN.md`.

## 13. Implementation Notes

- Treat this route as a distinct intent page, not just a UI variant of an existing date calculator.
- If future work tries to expand this page into a broad date-difference explainer, reject that drift unless scope is explicitly widened.
- If future work needs richer content, that should be a new approved content expansion rather than a silent change to this contract.

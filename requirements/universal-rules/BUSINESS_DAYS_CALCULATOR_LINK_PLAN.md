# Business Days Calculator Link Plan

> [!IMPORTANT]
> This document is the authoritative internal-link and recirculation source for future build work on `/time-and-date/business-days-calculator/`. If later notes conflict, this file wins unless `UNIVERSAL_REQUIREMENTS.md` or explicit HUMAN direction says otherwise.

## 1. Route Identity

| Field | Value |
| :--- | :--- |
| Route | `/time-and-date/business-days-calculator/` |
| Calculator | Business Days Calculator |
| Link Plan Role | Circular-link architecture and anchor strategy |

## 2. Primary Circular Targets

The primary circular-link targets are:

1. `/time-and-date/time-between-two-dates-calculator/`
2. `/time-and-date/days-until-a-date-calculator/`
3. `/time-and-date/countdown-timer/`

These three routes are the core adjacent loop. They must be the main internal-link priority over weaker or broader cluster links.

## 3. Linking Strategy

### Page Role
`Business Days Calculator` is the exact-match business-day entry page in the time-and-date cluster.

### Link Objective
- Keep users inside the date-planning loop.
- Move users cleanly between:
  - business-day math
  - broader date-range math
  - deadline/countdown workflows

### Link Discipline
- Links must feel useful, not decorative.
- Link surfaces may repeat across the page, but repeated links must have context-specific anchor phrasing.
- Avoid duplicate anchor + target pairs inside the same section.

## 4. Above-the-Fold Link Placement

### Required Surface
- One compact related-tools row only

### Required Targets
The row should prioritize:
- `Time Between Two Dates Calculator`
- `Days Until a Date Calculator`
- `Countdown Timer`

### Above-the-Fold Rules
- Do not stack multiple related-link modules above the fold.
- Do not let the related row overpower the calculator UI.
- Keep anchor copy intent-led and concise.

## 5. In-Flow Contextual Linking

Contextual links should appear in short explanatory sections where they help the user switch jobs.

### When Explaining Broader Date Differences
Link to:
- `/time-and-date/time-between-two-dates-calculator/`

Use when the copy explains:
- total days
- weeks or months between dates
- broader date-duration questions beyond business-day logic

### When Explaining Countdowns or Deadline Tracking
Link to:
- `/time-and-date/days-until-a-date-calculator/`
- `/time-and-date/countdown-timer/`

Use when the copy explains:
- calendar countdowns
- days left until a deadline
- live event tracking

## 6. FAQ Link Placement

FAQ answers may link out when the question naturally expands into another route’s job.

Appropriate FAQ link situations:
- “I want total days, not just business days.”
- “I want a countdown until a deadline.”
- “I need a broader date difference tool.”

FAQ links should:
- stay natural inside the answer
- not flood every FAQ item
- use problem-solving anchor language

## 7. Bottom Related-Tools Block

### Required
- A bottom related-tools block is required.

### Purpose
- Catch users after the core answer is complete
- Encourage continuation into adjacent date-planning tools

### Priority Order
1. Time Between Two Dates Calculator
2. Days Until a Date Calculator
3. Countdown Timer

Secondary links may be added later only with explicit scope approval.

## 8. Anchor Strategy

### Anchor Rules
- Anchors must be intent-led.
- Anchors must describe the user job, not just the destination name.
- Avoid weak anchors such as:
  - `related calculator`
  - `click here`
  - `learn more`

### Preferred Anchor Themes

#### To Time Between Two Dates
- calculate full date difference
- compare total days and business days
- measure exact time between dates

#### To Days Until a Date
- count calendar days until a deadline
- switch to days-until countdown view
- track how many days are left

#### To Countdown Timer
- start a live countdown
- track a deadline in real time
- use a live event timer

## 9. Back-Link Expectations From Adjacent Routes

The following routes should eventually link back into `Business Days Calculator` where context allows:

### From Time Between Two Dates
- link when business-day counting is explained as a focused sub-job
- link when users need a dedicated working-days tool rather than a broader date-difference page

### From Days Until a Date
- link when users need working-day logic instead of calendar-day countdowns
- link when “weekdays only” intent would be better served by a dedicated route

### From Countdown Timer
- link when users are planning work deadlines rather than live event timing

## 10. Link Quality Rules

- Do not repeat the exact same anchor text to the exact same target within a single section.
- Do not create a large wall of links in a lean utility page.
- Do not let internal linking change the primary exact-match business-day intent of the route.
- Do not dilute the page with low-relevance cross-cluster links during initial implementation.

## 11. Verification Checklist

- [ ] Above the fold contains exactly one compact related-tools row.
- [ ] The above-fold row prioritizes the three primary circular targets.
- [ ] In-flow contextual links are tied to actual user-job transitions.
- [ ] FAQ links are present only where context warrants them.
- [ ] A bottom related-tools block is present.
- [ ] Anchor text is intent-led rather than generic.
- [ ] No duplicate anchor + target pair appears in the same section.
- [ ] Link plan remains tightly focused on the time-and-date circular loop.
- [ ] Future adjacent-page back-links are documented for reciprocal implementation.

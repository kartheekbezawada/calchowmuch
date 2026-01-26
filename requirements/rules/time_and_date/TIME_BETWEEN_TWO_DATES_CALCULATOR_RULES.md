# TIME_BETWEEN_TWO_DATES_CALCULATOR_RULES.md

**REQ_ID:** REQ-20260126-007  
**Title:** Time Between Two Dates Calculator (Time & Date)  
**Change Type:** New Calculator + SEO  

---

## 1. Page Metadata & Navigation

### Top Navigation
- Uses existing Time & Date top-nav button (same placement/styling/icon rules)

### Left Navigation
**Hierarchy:**
- Time & Date
  - Time Between Two Dates Calculator

### Routing
- **URL:** `/time-and-date/time-between-two-dates-calculator`
- **Deep linking must activate:**
  - Top nav: Time & Date
  - Left nav section expanded and Time Between Two Dates Calculator highlighted

### SEO Metadata
- **Title:** `Time Between Two Dates Calculator – Days, Weeks, Months, Years`
- **Meta Description:** `Calculate the time between two dates in days, weeks, months, and years. Simple, fast, and free time between dates calculator.`
- **H1:** `Time Between Two Dates Calculator`

---

## 2. Scope & General Characteristics

- Single dedicated calculator page
- Low-maintenance logic (no external data dependencies)
- Fast-loading, static-friendly
- No accounts, saved history, or personalization
- No legal/tax/medical advice

---

## 3. Calculation Pane (Interactive)

### Purpose
User selects two dates (and optionally times) and gets the duration between them.

### Inputs

**Mode toggle (no dropdowns):**
- Dates only (default)
- Date & time

**Start input:**
- Date picker (and time picker if mode = Date & time)

**End input:**
- Date picker (and time picker if mode = Date & time)

**Defaults:**
- Start = today
- End = today + 7 days

### Validation
- End must be ≥ Start
- Show clear inline error if invalid (no crashes)

### Outputs (Compact)
Always show a compact result summary (no large tables):
- Total difference in days
- Total difference in weeks (days ÷ 7)
- Total difference in months and years (calendar-aware, explained below)
- If Date & time mode: include hours and minutes totals

---

## 4. Core Logic (Fixed Rules)

### Definitions
- **"Days / hours / minutes"** = exact elapsed time based on timestamps
- **"Months / years"** = calendar-aware difference (varies by month length)

### Computation Rules

**If mode = Dates only:**
- Treat start as 00:00 and end as 00:00 in local time
- `totalDays = floor((endDate - startDate) / 24h)`

**If mode = Date & time:**
- Use full timestamp difference:
- `totalMinutes`, `totalHours`, `totalDays` derived from milliseconds delta

**Months/years calculation (calendar-aware):**
- Compute full years and remaining months using calendar month boundaries (not a fixed 30-day assumption)
- Also provide "total months" as years*12 + months

### Output Formatting
- No currency symbols anywhere
- Use clear labels: "Total days", "Total weeks", "Years and months", "Total hours", etc.

---

## 5. Explanation Pane (SEO & Content)

**Implementation rule:** The following headings + paragraphs must be used exactly as written. Codex may only:
- Add required container elements/classes to match the site shell
- Insert placeholders like `{START_DATE}` / `{END_DATE}` / `{MODE}` if supported
- No rewording

### H2: What is a Time Between Two Dates Calculator?

A Time Between Two Dates Calculator tells you how much time separates two dates. It can show the difference in days, weeks, and also in calendar months and years.

### H2: How This Time Between Two Dates Calculator Works

This calculator compares a start date and an end date and measures the elapsed time between them.

In Dates only mode, it treats each date as starting at midnight in your local time.

In Date & time mode, it measures the exact timestamp difference in minutes and hours as well.

### H2: Days vs Months (Why Results Can Differ)

Days and weeks are based on exact elapsed time. Months and years are based on the calendar. Because months have different lengths (28–31 days), "1 month" is not always the same as "30 days." That's why the calculator shows both styles of results.

### H2: Examples

If you select 1 January as the start date and 31 January as the end date, the result is 30 days.
If you select 1 January and 1 February, the result is usually 1 calendar month, even though the day count depends on the month length.

### H2: Assumptions and Limitations

This calculator uses your device's local time zone. Daylight saving time changes can affect hour-level differences in Date & time mode. Results are general calculations and do not replace professional advice for legal or contractual deadlines.

### H2: Frequently Asked Questions

**Why do months and days give different answers?**
Days count elapsed time, while months follow calendar boundaries. Month length changes throughout the year.

**Does the calculator include the start date?**
No. It calculates the time from the start date/time up to the end date/time.

**What happens if the end date is before the start date?**
The calculator will show an error and ask you to choose an end date that is after the start date.

**Does daylight saving time affect the result?**
It can affect results in Date & time mode, because a day can be 23 or 25 hours when clocks change.

### Structured Data
Add FAQPage structured data for the FAQ section.

---

## 6. UI & Layout Rules

- Must follow universal 3-pane layout and scrolling behavior
- Calculation pane: inputs + compact results only
- Explanation pane: text-only for v1
- No graphs/tables in v1
- No layout shifts or page height changes on interaction

---

## 7. Non-Goals (Explicit Exclusions)

- No holiday/business-day logic
- No "working days between dates" in v1
- No timezone selection UI (uses browser local time only)
- No export/print/share features in v1

---

## 8. Change Type
New Calculator (simple logic + new route + SEO content)

---

## Acceptance Criteria

**MUST HAVE:**
- [ ] URL routing: `/time-and-date/time-between-two-dates-calculator`
- [ ] Deep linking activates correct navigation states
- [ ] Mode toggle between "Dates only" and "Date & time"
- [ ] Date picker inputs with proper defaults
- [ ] Time picker inputs (when in Date & time mode)
- [ ] Input validation: End ≥ Start with clear error display
- [ ] Compact results showing days, weeks, calendar months/years
- [ ] Calendar-aware months/years calculation
- [ ] Exact content copy in explanation pane (verbatim)
- [ ] FAQPage structured data
- [ ] SEO metadata as specified
- [ ] No layout shifts during interaction

**SHOULD HAVE:**
- [ ] Responsive design for all viewport sizes
- [ ] Keyboard navigation support
- [ ] Accessibility compliance

**WON'T HAVE (v1):**
- Holiday/business day logic
- Timezone selection UI
- Export/print/share features
- Graphs or tables
- Working days calculations
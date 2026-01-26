# DAYS_UNTIL_A_DATE_CALCULATOR_RULES.md

**REQ_ID:** REQ-20260126-008  
**Title:** Days Until a Date Calculator (Time & Date)  
**Change Type:** New Calculator + SEO  

---

## 1. Page Metadata & Navigation

### Top Navigation
- Uses existing Time & Date top-nav button
- Same placement, size, color, and icon rules as other Time & Date calculators

### Left Navigation
**Hierarchy:**
- Time & Date
  - Days Until a Date Calculator

### Routing
- **URL:** `/time-and-date/days-until-a-date-calculator`
- **Deep linking must:**
  - Activate Time & Date in top nav
  - Highlight Days Until a Date Calculator in left nav

### SEO Metadata
- **Title:** `Days Until a Date Calculator – How Many Days Until`
- **Meta Description:** `Calculate how many days are left until a specific date. Simple, fast, and free days until a date calculator.`
- **H1:** `Days Until a Date Calculator`

---

## 2. Scope & General Characteristics

- Single dedicated calculator page
- Very low-maintenance logic
- Fast-loading, static-friendly
- No accounts, saved history, or personalization
- No legal, financial, or medical advice

---

## 3. Calculation Pane (Interactive)

### Purpose
User selects a future (or past) date and sees how many days remain until that date.

### Inputs
**Target date picker** (date only; no time)

**Defaults:**
- Target date = today + 30 days

### Validation
- Date must be valid
- Past dates allowed (see output behavior)

### Outputs (Compact)
**Primary result:**
- Total number of days until the selected date

**Secondary clarification (text only):**
- If date is in the future: "That's in X days."
- If date is today: "That date is today."
- If date is in the past: "That date was X days ago."

**No tables, no charts, no breakdowns in v1**

---

## 4. Core Logic (Fixed Rules)

### Definitions
- Calculation based on calendar days, not hours
- Uses local browser date

### Computation
- Normalize both dates to local midnight
- `differenceInDays = targetDate − today`
- If `differenceInDays > 0`: days until
- If `differenceInDays = 0`: today
- If `differenceInDays < 0`: days since (absolute value shown)

### Notes
- Daylight saving changes do not affect results (date-only logic)
- Do not include the current day twice (standard elapsed-day counting)

---

## 5. Explanation Pane (SEO & Content)

**Implementation rule:** The following text must be used exactly as written. Codex may only:
- Wrap content in required layout containers
- Insert placeholders like `{TARGET_DATE}` if supported
- No rewording or paraphrasing

### H2: What is a Days Until a Date Calculator?

A Days Until a Date Calculator tells you how many days remain between today and a specific date. It's commonly used for counting down to events, deadlines, holidays, or personal milestones.

### H2: How This Days Until Calculator Works

The calculator compares today's date with the date you select and counts the number of full calendar days between them. It uses dates only, not hours or minutes, so the result stays consistent regardless of time of day.

### H2: Examples

If today is 1 March and you select 15 March, the calculator shows 14 days until that date.
If you select today's date, the result shows that the date is today.
If you select a past date, the calculator shows how many days have passed since that date.

### H2: Assumptions and Limitations

This calculator:

Uses your device's local date

Counts calendar days only

Does not include business days or holidays

Results are general date calculations and should not be used for legal or contractual deadlines.

### H2: Frequently Asked Questions

**Does the calculator include today in the count?**
No. It counts the number of full days between today and the selected date.

**Can I use this for past dates?**
Yes. If the date is in the past, the calculator shows how many days have passed since then.

**Does daylight saving time affect the result?**
No. The calculator works with dates only, not hours.

**Is this suitable for deadlines or legal use?**
It's useful for planning, but always verify important deadlines with official sources.

### Structured Data
Add FAQPage structured data for the FAQ section.

---

## 6. UI & Layout Rules

- Must follow the universal calculator layout
- Calculation pane: inputs + single numeric result
- Explanation pane: text-only for v1
- Internal scrolling only
- No layout shift on interaction

---

## 7. Non-Goals (Explicit Exclusions)

- No countdown timer
- No hours/minutes breakdown
- No business-day or holiday logic
- No reminders, notifications, or exports

---

## 8. Change Type
New Calculator (very simple logic + new route + SEO content)

---

## Acceptance Criteria

**MUST HAVE:**
- [ ] URL routing: `/time-and-date/days-until-a-date-calculator`
- [ ] Deep linking activates correct navigation states
- [ ] Date picker input with proper default (today + 30 days)
- [ ] Input validation for valid dates
- [ ] Primary result showing days count
- [ ] Secondary clarification text based on date relationship
- [ ] Calendar-based day counting logic
- [ ] Handles future, present, and past dates correctly
- [ ] Exact content copy in explanation pane (verbatim)
- [ ] FAQPage structured data
- [ ] SEO metadata as specified
- [ ] No layout shifts during interaction

**SHOULD HAVE:**
- [ ] Responsive design for all viewport sizes
- [ ] Keyboard navigation support
- [ ] Accessibility compliance

**WON'T HAVE (v1):**
- Countdown timer functionality
- Hours/minutes breakdown
- Business day or holiday logic
- Reminders or notifications
- Export features
- Charts or graphs
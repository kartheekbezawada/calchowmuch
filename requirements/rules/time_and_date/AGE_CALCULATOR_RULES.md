# AGE_CALCULATOR_RULES.md

**REQ_ID:** REQ-20260126-009  
**Title:** Age Calculator (Time & Date)  
**Change Type:** New Calculator + SEO  

---

## 1. Page Metadata & Navigation

### Top Navigation
- Uses existing Time & Date top-nav button
- Same placement, size, color, and icon rules as other Time & Date calculators

### Left Navigation
**Hierarchy:**
- Time & Date
  - Age Calculator

### Routing
- **URL:** `/time-and-date/age-calculator`
- **Deep linking must:**
  - Activate Time & Date in top nav
  - Highlight Age Calculator in left nav

### SEO Metadata
- **Title:** `Age Calculator – Exact Age in Years, Months, and Days`
- **Meta Description:** `Calculate your exact age in years, months, and days based on your date of birth. Simple, fast, and free age calculator.`
- **H1:** `Age Calculator`

---

## 2. Scope & General Characteristics

- Single dedicated calculator page
- Very low-maintenance logic
- Fast-loading, static-friendly
- No accounts, saved history, or personalization
- No legal, medical, or official age verification claims

---

## 3. Calculation Pane (Interactive)

### Purpose
User enters a date of birth and optionally a comparison date to calculate exact age.

### Inputs
**Date of birth picker** (date only)

**Optional comparison date picker:**
- Label: Calculate age as of
- Default: today

**Defaults:**
- Date of birth: empty (required)
- Comparison date: today

### Validation
- Date of birth must be ≤ comparison date
- Clear inline error if invalid

### Outputs (Compact)
**Primary result:**
- Exact age displayed as: `X years, Y months, Z days`

**Secondary clarification (text only):**
- "That is your exact age as of {COMPARISON_DATE}."

**No tables, no charts, no breakdowns in v1**

---

## 4. Core Logic (Fixed Rules)

### Definitions
- Age calculated using calendar-aware differences, not fixed day counts
- Uses local browser date

### Computation Rules
- Calculate full years between birth date and comparison date
- Subtract full years to get remaining months
- Subtract full months to get remaining days
- Ensure:
  - Months range: 0–11
  - Days range: valid for the given month

### Notes
- Leap years must be handled correctly
- Month length variations (28–31 days) must be respected
- Do not approximate months as 30 days

---

## 5. Explanation Pane (SEO & Content)

**Implementation rule:** The following text must be used exactly as written. Codex may only:
- Wrap content in required layout containers
- Insert placeholders like `{DOB}` or `{AS_OF_DATE}` if supported
- No rewording

### H2: What is an Age Calculator?

An Age Calculator tells you your exact age in years, months, and days based on your date of birth. It provides a precise, calendar-based age rather than an approximation.

### H2: How This Age Calculator Works

The calculator compares your date of birth with a selected comparison date (usually today). It counts full years first, then full months, and finally the remaining days, using real calendar month lengths.

### H2: Examples

If your date of birth is 15 June 1990 and today is 1 September 2025, your age would be 35 years, 2 months, and 17 days.
If you choose a different comparison date, the calculator shows your age as of that specific day.

### H2: Assumptions and Limitations

This calculator:

Uses calendar dates, not average day counts

Correctly handles leap years and varying month lengths

Does not provide legal or official age verification

Results are general calculations and should not be used where official documentation is required.

### H2: Frequently Asked Questions

**How accurate is this age calculator?**
It is accurate to the calendar day, using real month lengths and leap years.

**Does it handle leap years correctly?**
Yes. February 29 is accounted for when calculating years, months, and days.

**Can I calculate my age on a past or future date?**
Yes. You can select a different "as of" date to see your age at that time.

**Why doesn't the calculator show hours or minutes?**
It focuses on exact calendar age, which is typically expressed in years, months, and days.

### Structured Data
Add FAQPage structured data for the FAQ section.

---

## 6. UI & Layout Rules

- Must follow the universal calculator layout
- Calculation pane: inputs + single compact result
- Explanation pane: text-only for v1
- Internal scrolling only
- No layout shifts on interaction

---

## 7. Non-Goals (Explicit Exclusions)

- No age verification for legal purposes
- No zodiac, numerology, or astrology features
- No time-of-day (hours/minutes/seconds) age calculation
- No data storage or sharing

---

## 8. Change Type
New Calculator (simple calendar logic + new route + SEO content)

---

## Acceptance Criteria

**MUST HAVE:**
- [ ] URL routing: `/time-and-date/age-calculator`
- [ ] Deep linking activates correct navigation states
- [ ] Date of birth picker input (required, date only)
- [ ] Optional comparison date picker with default to today
- [ ] Input validation: DOB ≤ comparison date with clear error display
- [ ] Primary result showing age as "X years, Y months, Z days"
- [ ] Secondary clarification text with comparison date
- [ ] Calendar-aware age calculation handling leap years and month variations
- [ ] Exact content copy in explanation pane (verbatim)
- [ ] FAQPage structured data
- [ ] SEO metadata as specified
- [ ] No layout shifts during interaction

**SHOULD HAVE:**
- [ ] Responsive design for all viewport sizes
- [ ] Keyboard navigation support
- [ ] Accessibility compliance

**WON'T HAVE (v1):**
- Age verification for legal purposes
- Zodiac or astrology features
- Time-of-day age calculations
- Data storage or sharing features
- Official age documentation claims
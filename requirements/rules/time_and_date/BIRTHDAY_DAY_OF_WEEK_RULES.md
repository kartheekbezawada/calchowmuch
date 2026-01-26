# BIRTHDAY_DAY_OF_WEEK_RULES.md

**REQ_ID:** REQ-20260126-012  
**Title:** Birthday Day-of-Week Calculator (Time & Date)  
**Change Type:** New Calculator + SEO  

---

## 1. Page Metadata & Navigation

### Top Navigation
- Uses existing Time & Date top-nav button (same placement/styling/icon rules)

### Left Navigation
**Hierarchy:**
- Time & Date
  - Birthday Day-of-Week

### Routing
- **URL:** `/time-and-date/birthday-day-of-week`
- **Deep linking must:**
  - Activate Time & Date in top nav
  - Highlight Birthday Day-of-Week in left nav

### SEO Metadata
- **Title:** `Birthday Day-of-Week Calculator – What Day Were You Born?`
- **Meta Description:** `Find the day of the week you were born on, and see what weekday your birthday falls on in any year. Simple, fast, and free.`
- **H1:** `Birthday Day-of-Week Calculator`

---

## 2. Scope & General Characteristics

- Single dedicated calculator page
- Very low-maintenance logic (calendar-based, evergreen)
- Fast-loading, static-friendly
- No accounts, saved history, or personalization
- No astrology, personality claims, or "meaning" presented as fact

---

## 3. Calculation Pane (Interactive)

### Purpose
User enters their birth date (and optionally a target year) to calculate:
- The weekday they were born on
- The weekday their birthday falls on in a chosen year

### Inputs
**Date of birth picker** (date only, required)

**Optional target year input:**
- Label: Birthday weekday in year
- Default: current year (local browser year)

### Validation
- DOB must be a valid date
- Year must be an integer in range 1600–2100
- Clear inline error messages (no alerts)

### Outputs (Compact)
**Primary result:**
- "You were born on: {BIRTH_WEEKDAY}"

**Secondary result (only if target year present/defaulted):**
- "In {TARGET_YEAR}, your birthday falls on: {TARGET_YEAR_WEEKDAY}"

**No tables, no charts, no graphs in v1**

---

## 4. Core Logic (Fixed Rules)

### Definitions
- Uses Gregorian calendar rules
- Uses local browser date for "current year" default

### Computation Rules
- Compute weekday for DOB date (e.g., Monday–Sunday)
- Compute weekday for birthday date in target year:
  - Same month/day as DOB
  - Target year from input/default

### Leap year handling
- If DOB is Feb 29:
  - For non-leap target years, birthday date must be treated as Feb 28 (explicit rule for determinism)

---

## 5. Explanation Pane (SEO & Content)

**Implementation rule:** The following text must be used exactly as written. Codex may only:
- Wrap content in required layout containers
- Insert placeholders like `{DOB}`, `{BIRTH_WEEKDAY}`, `{TARGET_YEAR}`, `{TARGET_YEAR_WEEKDAY}`
- No rewording

### H2: Your Birthday Weekday (A Simple Calendar Fact)

Your date of birth is a real point in time on the calendar. This calculator tells you the day of the week that date falls on. For example, if you entered {DOB}, you were born on {BIRTH_WEEKDAY}.

### H2: Why Your Birthday Falls on Different Weekdays

A year is not an exact number of whole weeks. Because of that, the weekday of a fixed date changes as years pass. Leap years add an extra day in February, which can shift weekdays differently over time.

### H2: Birthday Weekday in Another Year

If you choose a target year, the calculator tells you what weekday your birthday falls on in that year. For example, in {TARGET_YEAR} your birthday falls on {TARGET_YEAR_WEEKDAY}. This can help you plan parties, trips, or annual reminders.

### H2: Assumptions and Limitations

This calculator:

Uses standard calendar rules to determine weekdays

Handles leap years correctly

Treats February 29 birthdays as February 28 in non-leap years for target-year calculations

Does not provide astrology, personality traits, or predictions

### H2: Frequently Asked Questions

**Is the result accurate?**
Yes. The day-of-week is calculated using standard calendar rules for the date you enter.

**What if I was born on February 29?**
You were born on the weekday for February 29 in your birth year. For non-leap target years, this calculator uses February 28 for the birthday weekday.

**Can I check future or past years?**
Yes. Enter any target year from 1600 to 2100.

**Does this store my birthday?**
No. This runs in your browser and does not save your inputs.

### Structured Data
Add FAQPage structured data for the FAQ section.

---

## 6. UI & Layout Rules

- Must follow the universal calculator layout
- Calculation pane: inputs + compact results only
- Explanation pane: text-only for v1 (no tables, no graphs)
- Internal scrolling only
- No layout shifts on interaction

---

## 7. Non-Goals (Explicit Exclusions)

- No astrology, numerology, or zodiac features
- No "weekday personality" claims
- No social sharing buttons in v1
- No storage, accounts, or history
- No location/timezone adjustments (date-only)

---

## 8. Change Type
New Calculator (simple calendar logic + new route + SEO content)

---

## Acceptance Criteria

**MUST HAVE:**
- [ ] URL routing: `/time-and-date/birthday-day-of-week`
- [ ] Deep linking activates correct navigation states (top nav + left nav highlight)
- [ ] Date of birth picker input (required, date only)
- [ ] Optional target year input (default: current year)
- [ ] Validation errors are inline and clear (DOB valid; year 1600–2100)
- [ ] Output shows birth weekday
- [ ] Output shows target-year birthday weekday
- [ ] Leap year rules handled correctly, including Feb 29 handling rule
- [ ] Explanation pane content is verbatim as specified
- [ ] FAQPage structured data present
- [ ] SEO metadata as specified
- [ ] No layout shifts during interaction
- [ ] **MPA Architecture:** Standalone HTML page with full page reload navigation
- [ ] **Navigation:** Uses `<a href>` links, not JavaScript routing

**SHOULD HAVE:**
- [ ] Keyboard navigation support
- [ ] Accessibility: labels associated with inputs

**WON'T HAVE (v1):**
- Social sharing / download / print
- Astrology/personality content
- Time-of-day or timezone-based calculations
- Data storage or user accounts

---

## MPA Architecture Compliance

This calculator MUST follow the enforced MPA architecture as defined in UNIVERSAL_REQUIREMENTS.md:
- Standalone HTML document at `/time-and-date/birthday-day-of-week`
- Full page reload when navigating to/from this calculator
- No SPA routing, hash URLs, or dynamic content swapping
- Complete page shell with own ads, metadata, and navigation state
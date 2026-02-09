# REQ — Overtime Hours Calculator (SERP-Ready)

**Calculator Group:** Time & Date

**Calculator:** Overtime Hours Calculator

**Primary Question (Single-Question Rule):** "How many overtime hours did I work?"

**Status:** NEW (SERP-First Build)

**Type:** New calculator under Time & Date; simple factory-worker-friendly UI

**FSM Phase:** REQ

**Scope:** UI, Compute, Explanation Pane, SEO, JSON-LD, Sitemap, Testing

## 1. Purpose & Search Intent (SEO-Critical)

Users want a clear overtime breakdown for:

- Single shift, split shift, or weekly total
- overtime policy: Daily, Weekly, or Daily + Weekly
- breaks (minutes) and overnight shifts ("Ends next day")
- optional night hours classification and night overtime

Target user: a medium-skilled worker who needs fast, reliable results with minimal confusion.

## 2. SERP Keyword Set (MANDATORY)

**Primary:**

- overtime hours calculator
- overtime calculator
- calculate overtime hours
- overtime pay hours calculator (supporting—page does hours, not pay)

**Secondary:**

- daily overtime calculator
- weekly overtime calculator
- timesheet overtime calculator
- shift overtime calculator
- night shift overtime calculator

**Long-tail:**

- how many overtime hours did I work this week
- daily overtime after 8 hours calculator
- weekly overtime after 40 hours calculator
- calculate overtime with breaks and overnight shift

## 3. Category, Navigation, URL

- **Category:** Time & Date
- **Left-nav label:** Overtime Hours Calculator
- **Canonical URL:** `/time-and-date/overtime-hours-calculator/`

## 4. Calculation Pane (Simple, Clean, No Rounding)

### 4.1 H1 + Subtitle

**H1:** Overtime Hours Calculator

**Subtitle:** Split regular vs overtime hours for shifts or weekly totals (no rounding).

### 4.2 Mode (Required)

Segmented buttons:

- Single Shift
- Split Shift
- Weekly Shift

### 4.3 Overtime Rule (Required)

Segmented buttons:

- Daily overtime
- Weekly overtime
- Daily + Weekly

Include an info icon tooltip (non-blocking):

"Rules vary by employer/country. This calculator estimates hours only."

### 4.4 Inputs (Required)

**Daily regular limit (hours)** (number input, default 8)

- Accept decimals (e.g., 7.5)
- Min 0, Max 24
- No rounding in calculations

**Weekly regular limit (hours)** (number input, default 40)

- Accept decimals
- Min 0, Max 168
- No rounding

### 4.5 Shift Time Inputs (Required by mode)

**Single Shift:**

- Start time
- End time
- Ends next day (toggle)
- Break minutes (dropdown or stepper): 0 / 15 / 30 / 45 / 60 (and allow "Other" if your UI already supports it; otherwise keep fixed)

**Split Shift:**

Repeat shift block UI (2 blocks minimum; allow add/remove if your framework already supports without complexity):

- Shift 1: Start, End, Ends next day, Break minutes
- Shift 2: Start, End, Ends next day, Break minutes

**Weekly Shift:**

- Week range (date range picker) REQUIRED
- For each day, allow adding shift blocks (use minimal UI: 7-day list, each day expandable with "Add shift")
- Ends next day + break minutes per shift

### 4.6 Night Hours Tracking (Required toggle)

**Toggle:** Track night hours

When enabled show:

- Night window start time (default 22:00)
- Night window end time (default 06:00)
- Night overtime classification: automatic (no extra input)

### 4.7 Outputs (Must show after Calculate AND update live if your architecture supports)

Primary results (no rounding):

- Total hours
- Regular hours
- Overtime hours
- Night hours (if enabled)
- Night overtime hours (if enabled)

**CTA:** Calculate (keep for consistency even if live-update exists)

## 5. Overtime Rule Guidance Table (Must be shown in Explanation Pane + optionally small tooltip in UI)

| Overtime rule | What counts as overtime | Best for | Notes |
|---------------|------------------------|----------|-------|
| Daily overtime | Time above your daily regular limit | Long single days | Useful when you work very long shifts |
| Weekly overtime | Time above your weekly regular limit | Variable schedules | Common for weekly timesheets |
| Daily + Weekly | Overtime if you exceed either rule | Mixed schedules | Helps avoid missing overtime in unusual weeks |

## 6. Compute Logic (No Rounding; handles breaks, overnight, night hours)

### 6.1 Core Definitions

For each shift:

- `gross_minutes = duration(start, end, ends_next_day)`
- `paid_minutes = max(0, gross_minutes - break_minutes)`
- Convert to hours as `paid_hours = paid_minutes / 60` (keep full precision)

Weekly totals:

- `week_paid_hours = sum(paid_hours for all shifts in week)`

### 6.2 Regular vs Overtime by policy

**Policy A — Daily overtime:**

For each day:

- `daily_regular_hours = min(daily_paid_hours, DAILY_LIMIT)`
- `daily_overtime_hours = max(0, daily_paid_hours - DAILY_LIMIT)`

Weekly:

- `regular = sum(daily_regular_hours)`
- `overtime = sum(daily_overtime_hours)`

**Policy B — Weekly overtime:**

Weekly:

- `regular = min(week_paid_hours, WEEKLY_LIMIT)`
- `overtime = max(0, week_paid_hours - WEEKLY_LIMIT)`

**Policy C — Daily + Weekly:**

Step 1 (daily):

- compute `daily_overtime_hours` as in Policy A
- compute `daily_regular_total = sum(min(daily_paid_hours, DAILY_LIMIT))`

Step 2 (weekly):

- compute weekly overtime threshold using weekly limit against total paid hours:
- `weekly_overtime_hours = max(0, week_paid_hours - WEEKLY_LIMIT)`

Step 3 (final overtime):

- `overtime = max(sum(daily_overtime_hours), weekly_overtime_hours)`
- `regular = week_paid_hours - overtime`

Rationale: avoids missing overtime if either rule creates a higher overtime total.

### 6.3 Night Hours + Night Overtime

Night window default 22:00–06:00 (wraps midnight). For each shift:

- compute `night_paid_minutes = overlap` between paid working interval(s) and night window (subtract break proportionally—see below)

**Break handling for night:**

Simple rule (factory-worker-friendly and deterministic):

- Break minutes are removed from the middle of the shift (assume break occurs mid-shift).
- Compute paid interval as: [start, end] minus a break segment centered at shift midpoint.
- Use the resulting paid intervals for overlap with night window.

**Night overtime classification:**

When policy yields overtime hours for a day/week, allocate overtime to night hours proportionally:

- `night_overtime = min(night_hours, overtime)`, but if overtime spans multiple shifts/days, allocate by share of night hours in total hours:
- `night_overtime = overtime * (night_hours / total_hours)` (keep precision)

This keeps it simple and prevents complex per-minute overtime assignment.

Outputs:

- `night_hours`
- `night_overtime_hours`

### 6.4 Edge Rules

- If `paid_minutes < 0` after break: clamp to 0
- If start == end and ends_next_day off: treat as 0 duration (not 24h)
- If ends_next_day on and start == end: treat as 24h minus break (allowed)
- Validate limits: `daily_limit ≤ 24`, `weekly_limit ≤ 168`
- Never round displayed values; format with 2 decimals for display only (store full precision)

## 7. Explanation Pane (SERP-Ready, Dynamic Summary Emphasis)

### 7.1 H2 — Summary

Must include keywords naturally:

- overtime hours calculator
- daily overtime
- weekly overtime
- breaks
- night shift overtime
- ends next day

### 7.2 H3 — Quick Summary (Updates As You Change Inputs) (REQUIRED)

Text requirement:

"This summary updates automatically based on what you enter in the calculator. It shows your current mode, total hours, regular hours, overtime hours, and optional night overtime classification."

### 7.3 H3 — Current Calculation Summary (Dynamic Table) (REQUIRED)

| Field | Value |
|-------|-------|
| Mode | {Single Shift / Split Shift / Weekly Shift} |
| Overtime rule | {Daily / Weekly / Daily + Weekly} |
| Total hours | {TOTAL_HOURS} |
| Regular hours | {REGULAR_HOURS} |
| Overtime hours | {OVERTIME_HOURS} |
| Night hours (optional) | {NIGHT_HOURS or "—"} |
| Night overtime (optional) | {NIGHT_OVERTIME or "—"} |
| Week range (weekly mode only) | {WEEK_RANGE or "—"} |

### 7.4 H3 — What Counts as Overtime? (Required)

Include the overtime rule table exactly (Section 5).

### 7.5 H3 — How to Use This Calculator (Required; very clear)

Steps:

1. Choose mode (Single, Split, Weekly)
2. Choose overtime rule (Daily, Weekly, Daily + Weekly)
3. Enter regular limits (daily hours, weekly hours)
4. Enter shift times, mark "Ends next day" if overnight, and select break minutes
5. Enable "Track night hours" if you need night shift overtime classification
6. Click Calculate to see total, regular, overtime, and night overtime (if enabled)

### 7.6 H3 — How Overtime Is Calculated (Plain-language)

Explain:

- Total hours = worked time − unpaid breaks
- Daily policy uses daily limit per day
- Weekly policy uses weekly limit across the week
- Daily + Weekly uses whichever rule produces higher overtime so you don't miss overtime in mixed schedules

### 7.7 H3 — Night Hours & Overnight Shifts

Explain:

- Night window default 22:00–06:00
- "Ends next day" handles crossing midnight
- Night overtime is an estimate based on how much of your overtime falls in night hours (proportional)

### 7.8 FAQs (Exactly 10; boxed; must match JSON-LD)

**What is an overtime hours calculator?**
It calculates how many hours are regular vs overtime based on your shift times, breaks, and an overtime rule (daily, weekly, or both).

**What counts as overtime in daily overtime mode?**
Any time above your daily regular limit counts as overtime for that day.

**What counts as overtime in weekly overtime mode?**
Any time above your weekly regular limit counts as overtime for the week.

**What does "Daily + Weekly" overtime mean?**
It applies overtime if you exceed either the daily limit or the weekly limit, using whichever produces higher overtime.

**Does the calculator subtract unpaid breaks?**
Yes. Break minutes are subtracted before overtime is calculated.

**How do I calculate overtime for an overnight shift?**
Turn on "Ends next day" so the calculator correctly counts hours past midnight.

**Can I use this for split shifts?**
Yes. Split Shift mode totals multiple work blocks and applies overtime rules to the combined hours.

**Can I calculate weekly overtime from multiple days?**
Yes. Weekly Shift mode totals hours across the selected week range.

**How does night overtime work?**
When night tracking is enabled, the calculator estimates night hours and classifies a portion of overtime as night overtime.

**Why might my overtime hours differ from payroll?**
Payroll rules can include rounding, paid breaks, or local overtime laws; this calculator shows hours with no rounding based on your inputs.

## 8. SEO Metadata (Required)

**Title:** Overtime Hours Calculator – Daily & Weekly | CalcHowMuch

**Meta description (140–160 chars):**
Calculate overtime hours for single, split, or weekly shifts. Supports daily, weekly, and daily+weekly rules, breaks, overnight and night hours.

**H1:** Overtime Hours Calculator

**Canonical:** `https://calchowmuch.com/time-and-date/overtime-hours-calculator/`

## 9. Page-Scoped JSON-LD Bundle (Required)

### 9.1 WebPage

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Overtime Hours Calculator",
  "url": "https://calchowmuch.com/time-and-date/overtime-hours-calculator/",
  "description": "Calculate regular vs overtime hours for single, split, or weekly shifts with daily, weekly, or combined overtime rules, including breaks and night hours.",
  "inLanguage": "en"
}
</script>
```

### 9.2 SoftwareApplication

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Overtime Hours Calculator",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Timesheet Overtime Calculator",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/time-and-date/overtime-hours-calculator/",
  "description": "Free overtime hours calculator for daily, weekly, or daily+weekly overtime rules with breaks, overnight shifts, and night hours tracking.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "creator": { "@type": "Organization", "name": "CalcHowMuch" }
}
</script>
```

### 9.3 FAQPage

Use the exact 10 FAQs above verbatim.

### 9.4 BreadcrumbList

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/" },
    { "@type": "ListItem", "position": 2, "name": "Time & Date", "item": "https://calchowmuch.com/time-and-date/" },
    { "@type": "ListItem", "position": 3, "name": "Overtime Hours Calculator", "item": "https://calchowmuch.com/time-and-date/overtime-hours-calculator/" }
  ]
}
</script>
```

## 10. Schema Injection Guard (Required)

- No global/layout FAQPage injection
- Page-scoped FAQPage only when enabled for this page
- Global FAQ schema allowed only on `/faq`

## 11. Sitemap Update

```xml
<url>
  <loc>https://calchowmuch.com/time-and-date/overtime-hours-calculator/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.70</priority>
</url>
```

## 12. Testing Requirements

**Unit Tests:**

- Single shift: break + ends next day
- Split shift: two shifts same day
- Weekly: multiple days, sums correct
- Policy A/B/C overtime correctness
- Night overlap correctness for a night window that crosses midnight
- No rounding: assert exact decimals (within floating tolerance)

**E2E (Playwright):**

- Mode switching shows relevant inputs (weekly week-range appears only in weekly)
- Rule switching updates results
- Night tracking toggle shows night fields and results
- Explanation pane shows Quick Summary and dynamic table

**SEO Tests:**

- Title/meta/canonical present
- JSON-LD valid and unique
- FAQ count = 10 matches UI

**UI Regression:**

- Clean, minimal, readable controls (factory-worker-friendly)
- No hidden complexity; labels must be short and clear

## 13. Acceptance Criteria

- Supports Single, Split, Weekly modes
- Supports Daily, Weekly, Daily+Weekly overtime rules
- Break minutes, Ends next day supported
- Night hours + night overtime tracking supported
- No rounding in math; display formatting only
- Explanation pane includes Quick Summary + dynamic summary table + "How to use" + 10 FAQs + schema

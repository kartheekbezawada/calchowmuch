REQ — Work Hours Calculator (SERP-Ready Rebuild)

Calculator Group: Time & Date
Calculator: Work Hours Calculator
Primary Question (Single-Question Rule): “How many hours did I work?”
Status: REBUILD (SERP Upgrade)
Type: Calculator pane stays as-is; rebuild Explanation Pane + SEO package
FSM Phase: REQ
Scope: Explanation Pane, SEO metadata, JSON-LD, sitemap, tests (no UI layout changes)

1) Purpose & Search Intent (SEO-Critical)
1.1 User Intent

Users want to calculate:

total hours worked for a single shift

total hours for a split shift

total hours for a week

handle unpaid breaks

handle shifts that end next day (overnight)

1.2 Primary SEO Keywords (MANDATORY)

Must appear naturally in H1, title, meta description, Summary, and FAQs.

Primary

work hours calculator

hours worked calculator

calculate hours worked

shift hours calculator

Secondary

time card calculator

timesheet calculator

weekly hours calculator

break time calculator

overnight shift hours

Long-tail

how many hours did I work today

calculate hours worked with unpaid break

calculate overnight shift hours

split shift hours calculator

2) Calculator Pane (LOCKED — Use Existing UI Exactly)

You must NOT change layout or wording of the calculation pane. Current inputs/controls:

Mode: Single Shift / Split Shift / Weekly Total

Start time (time input)

End time (time input)

Ends next day (toggle)

Unpaid break (0 / 15 / 30 / 45 / 60)

CTA: Calculate

Helper text: “Enter your times and click Calculate.”

3) URL & Canonical

Canonical URL (REQUIRED):
/time-date/work-hours-calculator/

4) SERP Package (Page Meta)

Title: Work Hours Calculator – Calculate Hours Worked (With Breaks) | CalcHowMuch

Meta description (140–160 chars):
Calculate hours worked for a shift, split shift, or week. Includes unpaid breaks and overnight shifts (ends next day). Fast and free.

H1: Work Hours Calculator

Canonical: https://calchowmuch.com/time-date/work-hours-calculator/

5) Explanation Pane (REBUILD — must be crawlable HTML)

Explanation Pane must follow your standard:

H2 for main Summary

H3 for all subsections

Scenario Summary table driven by calculation pane inputs

Results table driven by computed outputs

Exactly 10 FAQs (boxed styling) and mirrored in FAQPage JSON-LD

5.1 H2 — Summary (SERP-first copy)

Must include these phrases naturally:

work hours calculator

calculate hours worked

unpaid break

overnight / ends next day

Required summary content:

One-paragraph definition: what it calculates and who uses it (employees, contractors, payroll)

Supports: single shift, split shift, weekly total

Handles breaks and overnight shifts

5.2 H3 — Scenario Summary (Dynamic Table)

Table rows (values populated from calculation pane):

Mode: {MODE}

Start time: {START_TIME}

End time: {END_TIME}

Ends next day: {YES/NO}

Unpaid break: {BREAK_MIN} minutes

For Split Shift / Weekly Total:

If your existing UI collects multiple shifts internally, the table should list each shift row (Shift 1, Shift 2, …) using the same fields.

5.3 H3 — Results Summary (Dynamic)

Short bullet list using computed values:

Total paid time: {TOTAL_PAID_HOURS} (hours/min)

Total unpaid break: {TOTAL_BREAK_MIN} minutes

Total shift duration (gross): {TOTAL_GROSS_HOURS} (hours/min)

5.4 H3 — Results Table (Dynamic)

Semantic table.

Columns (Single Shift):

Start

End

Ends next day

Break

Gross duration

Paid hours

Columns (Split Shift / Weekly Total):

Shift #

Start

End

Ends next day

Break

Paid hours
Footer row:

Weekly total paid hours

5.5 H3 — How to Calculate Hours Worked (Show the formula)

Explain logic in plain language:

Gross shift duration = end − start (plus 24h if ends next day)

Paid hours = gross duration − unpaid break

Weekly total = sum of paid hours across shifts

5.6 H3 — Examples (Use fixed sample values)

Include 2–3 examples for SERP:

Single shift with break

Overnight shift (ends next day)

Split shift (two blocks)

Examples must be hardcoded (not user inputs), but formatted clearly.

5.7 H3 — Common Payroll Notes (Non-legal)

Include:

This calculator estimates hours; payroll rounding rules vary

Overtime rules differ by employer/country

For official timesheets, confirm policy

5.8 H3 — FAQs (Exactly 10; boxed; must match JSON-LD)

Use these verbatim:

How do I calculate hours worked for a shift?
Subtract your start time from your end time to get the shift duration, then subtract any unpaid break time.

Does this work hours calculator include unpaid breaks?
Yes. You can select an unpaid break (0–60 minutes) and the calculator subtracts it from your total.

How do I calculate overnight shift hours?
Enable “Ends next day” so the calculator adds the extra hours past midnight before subtracting breaks.

What is the difference between gross hours and paid hours?
Gross hours are the total time between start and end; paid hours are gross hours minus unpaid breaks.

Can I calculate split shift hours?
Yes. Use Split Shift mode to add multiple work blocks and the calculator totals them.

Can I calculate weekly total hours worked?
Yes. Weekly Total mode adds up paid hours across all shifts in the week.

What if my break is paid instead of unpaid?
If your break is paid, set unpaid break to 0 so the calculator does not subtract it.

Does this calculator handle minutes correctly?
Yes. It calculates hours and minutes precisely based on the start and end times you enter.

Why don’t my results match my payslip exactly?
Payroll systems may apply rounding, time-clock rules, or overtime policies that differ from simple time subtraction.

Is this a timesheet or time card calculator?
It can be used like a simple timesheet calculator to estimate hours worked, but official reporting depends on your employer’s rules.

6) JSON-LD (Page-Scoped Bundle)
6.1 WebPage
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Work Hours Calculator",
  "url": "https://calchowmuch.com/time-date/work-hours-calculator/",
  "description": "Calculate hours worked for a shift, split shift, or week. Includes unpaid breaks and overnight shifts.",
  "inLanguage": "en"
}
</script>

6.2 SoftwareApplication
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Work Hours Calculator",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Timesheet Calculator",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/time-date/work-hours-calculator/",
  "description": "Free work hours calculator to total shift, split shift, or weekly hours worked with unpaid breaks and overnight shifts.",
  "browserRequirements": "Requires JavaScript enabled",
  "softwareVersion": "1.0",
  "creator": { "@type": "Organization", "name": "CalcHowMuch" },
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
</script>

6.3 FAQPage (Must match the 10 FAQs verbatim)

(Use the same FAQPage pattern you already use; inject the 10 questions/answers above exactly.)

6.4 BreadcrumbList
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/" },
    { "@type": "ListItem", "position": 2, "name": "Time & Date", "item": "https://calchowmuch.com/time-date/" },
    { "@type": "ListItem", "position": 3, "name": "Work Hours Calculator", "item": "https://calchowmuch.com/time-date/work-hours-calculator/" }
  ]
}
</script>

7) Schema Injection Guard (Required)

Do not inject FAQPage globally in layout

Only inject FAQPage when pageSchema.enableFAQ = true

Global FAQPage allowed only on /faq

8) Sitemap Update

Add / confirm:

<url>
  <loc>https://calchowmuch.com/time-date/work-hours-calculator/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.70</priority>
</url>

9) Testing Requirements
9.1 E2E (Playwright)

Mode switch works (Single / Split / Weekly)

Ends next day affects results for overnight case

Unpaid break subtracts correctly

Explanation pane renders + shows 10 FAQs

9.2 SEO Tests

Title/meta/canonical present

JSON-LD present: WebPage, SoftwareApplication, FAQPage, BreadcrumbList

FAQPage count = 10 and matches visible FAQ text

No duplicate FAQPage injected from layout

9.3 UI Regression (ISS-001)

No calculation pane layout changes

Only explanation pane content changes

10) Acceptance Criteria

Work Hours Calculator UI unchanged

Explanation pane fully rebuilt with dynamic summary + results table + formula + examples

Exactly 10 FAQs (boxed) and mirrored in JSON-LD

SERP-ready metadata and canonical

Sitemap entry present and indexable
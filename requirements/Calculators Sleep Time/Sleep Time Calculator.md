REQ — Sleep Time Calculator (SERP-Ready)

Calculator Group: Time & Date
Calculator: Sleep Time Calculator
Primary Question (Single-Question Rule): “What time should I go to bed (or wake up) based on sleep cycles?”
Status: REBUILD (SERP Upgrade)
Type: Existing layout preserved; SEO + copy + schema + logic hardening
FSM Phase: REQ
Scope: UI (no layout changes), Compute, Explanation Pane, SEO, JSON-LD, Sitemap, Testing

This requirement follows your established calculator REQ pattern and schema guard rules. 

Present Value of Annuity Calcul…

1) Purpose & Search Intent (SEO-Critical)
1.1 User Intent

Users want ideal bedtimes or wake-up times that align with typical sleep cycles (commonly approximated as 90 minutes per cycle) plus fall-asleep latency (commonly approximated as 15 minutes).

Two modes (same page):

Wake-up time → recommend bedtimes

Fall-asleep time → recommend wake-up times

1.2 Primary SEO Keywords (MANDATORY)

These keywords MUST appear naturally in: H1, title, meta description, explanation summary, and FAQ questions.

Primary keywords

sleep time calculator

sleep calculator

best time to sleep calculator

bedtime calculator

Secondary keywords

sleep cycle calculator

90 minute sleep cycle calculator

wake up time calculator (supporting term; do not change nav label)

ideal bedtime calculator

best time to wake up calculator

Long-tail / intent keywords

what time should I go to bed to wake up at {time}

what time should I wake up if I fall asleep at {time}

best bedtime for 6 hours / 7.5 hours / 9 hours sleep

how many sleep cycles do I need

2) Category & Navigation Requirements (No Layout Changes)
2.1 Top Navigation

Top nav button stays: Time & Date

2.2 Left Navigation (Time & Date)

Keep your existing structure and labels. Sleep Time Calculator remains selected item.

Example (do not rename items):

Sleep Time Calculator

Wake-Up Time Calculator

Nap Time Calculator

Work Hours Calculator

Overtime Hours Calculator

Time Between Two Dates

Days Until a Date

Countdown Timer Generator

Age Calculator

Birthday Day-of-Week

Rules:

Navigation remains config-driven

No layout changes (same component + styling)

3) URL & Page Model (SEO + MVP)
3.1 Canonical URL (REQUIRED)

/time-date/sleep-time-calculator/

3.2 Architecture

MPA (one calculator per page)

Explanation pane must be crawlable static HTML

No separate URLs for mode variants (avoid cannibalization)

4) Folder & File Structure (REQUIRED)

/public/calculators/time-date/sleep-time-calculator/

index.html — calculator shell + calculation pane + schema injection

module.js — compute logic + validation

explanation.html — static explanation pane (SEO-critical)

5) Calculation Pane Requirements (UI must remain visually the same)
5.1 H1 / H2 Copy

H1 (page): Sleep Time Calculator

Subtitle (under H1): Find ideal sleep or wake times using 90-minute sleep cycles.

5.2 Inputs (match your current layout)

Mode toggle (required)

Button A: “I want to wake up at…”

Button B: “I want to fall asleep at…”

Date & Time (required)

Date-time combined input (required)

OR split Date + Time inputs (as shown) (required)

Keep current UX (do not remove either if both currently shown)

Calculate CTA

Keep the same primary button placement and label: Calculate

5.3 Output (must exist even if currently not shown in screenshot)

After clicking Calculate, show a result list of recommended times in the Calculation Pane (below inputs), without changing layout structure:

4, 5, 6 cycles (default)

optionally also show 3 and 7 cycles as secondary (still same page; just list more rows)

Each recommendation row must show:

Recommended time (local time)

Cycle count (e.g., “5 cycles”)

Estimated sleep duration (e.g., “7h 30m”)

6) Calculator Engine (Logic)
6.1 Defaults (configurable constants)

CYCLE_MINUTES = 90

FALL_ASLEEP_MINUTES = 15

CYCLES_DEFAULT = [4,5,6]

CYCLES_EXTENDED = [3,4,5,6,7] (optional display; if shown, 4–6 visually primary)

6.2 Mode A — Wake-up time → Bedtimes

Given target wake datetime W:
For each cycles c:

total_sleep_minutes = c * 90

bedtime = W - total_sleep_minutes - FALL_ASLEEP_MINUTES

Return bedtimes sorted ascending by time.

6.3 Mode B — Fall-asleep time → Wake-up times

Given fall-asleep datetime S:
For each cycles c:

wake_time = S + (c * 90)

Optionally include a note that results assume you fall asleep at the selected time; if user selects “fall asleep at”, do not add 15 minutes (they already chose asleep time).

6.4 Input/Edge Rules

Must handle cross-day results correctly (date rollover)

If input is missing/invalid: show inline error and do not crash

Locale formatting: use user locale for time display (but keep consistent “HH:MM” UI formatting you already use)

Time zone: use browser local time zone

7) Explanation Pane (SEO-Critical; must follow your Universal Standard)
7.1 H2 — Summary (keyword-dense, natural)

Include Sleep Time Calculator, sleep cycles, 90-minute cycles, bedtime, wake-up time naturally.

Required content points:

What it does

Two modes (wake-up → bedtime, asleep → wake-up)

Assumptions (90 min cycle, 15 min fall-asleep for wake-up mode)

7.2 H3 — Scenario Summary (dynamic table)

Table rows must be populated from calculation pane + computed results:

Mode: {MODE_LABEL}

Selected date: {DATE}

Selected time: {TIME}

Assumed cycle length: 90 minutes

Fall-asleep buffer (only for Mode A): 15 minutes

Recommended options shown: {LIST_OF_CYCLES}

7.3 H3 — Results Table (dynamic)

A semantic table:

Columns:

Cycles

Recommended Bedtime / Wake Time (depends on mode)

Estimated Sleep Time (hours/minutes)

Notes (e.g., “includes 15 min to fall asleep” for Mode A only)

7.4 H3 — How the Sleep Time Calculator Works

Explain:

90-minute cycles approximation

Why waking at the end of a cycle can feel easier

Why fall-asleep buffer is applied only when targeting a wake-up time

7.5 H3 — Assumptions and Limitations

Must include:

Sleep cycles vary by person/night

Falling asleep time varies

Not medical advice; for sleep disorders consult a professional

7.6 H3 — FAQs (Exactly 10; boxed styling per your standard)

These 10 must be used verbatim in the UI and JSON-LD:

What is a sleep time calculator?
A sleep time calculator suggests bedtimes or wake-up times based on typical sleep cycles so you can aim to wake up between cycles.

How long is a typical sleep cycle?
A common estimate is about 90 minutes per sleep cycle, though it can vary by person and by night.

Why does the calculator use 15 minutes to fall asleep?
It adds a buffer to estimate the time it may take to fall asleep after getting into bed.

If I want to wake up at a certain time, what bedtime should I choose?
Pick a recommended bedtime that lines up with 4–6 sleep cycles before your wake-up time.

If I fall asleep at a certain time, what time should I wake up?
Choose a wake-up option that is 4–6 cycles (about 6–9 hours) after your fall-asleep time.

How many sleep cycles should I aim for?
Many people feel best with 5 or 6 cycles (about 7.5 to 9 hours), but needs vary.

Is 8 hours of sleep always the best target?
Not always—sleep quality and timing matter, and some people feel better with slightly more or less.

Does waking up during deep sleep matter?
Waking in the middle of a cycle can feel harder because you may be in deeper sleep; waking near the end of a cycle can feel easier.

Can I use this calculator for naps?
For naps, shorter options like 1–2 cycles are often used; a dedicated nap calculator can be more precise.

Is this sleep calculator medical advice?
No. It provides estimates based on averages; persistent sleep problems should be discussed with a healthcare professional.

8) SEO Metadata (Required)

Title: Sleep Time Calculator (90-Minute Sleep Cycles) – CalcHowMuch

Meta description (140–160 chars):
Calculate the best time to sleep or wake up using 90-minute sleep cycles. Get ideal bedtimes or wake-up times in seconds.

H1: Sleep Time Calculator

Canonical: https://calchowmuch.com/time-date/sleep-time-calculator/

9) Page-Scoped JSON-LD Bundle (Required)
9.1 WebPage
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Sleep Time Calculator",
  "url": "https://calchowmuch.com/time-date/sleep-time-calculator/",
  "description": "Calculate ideal bedtimes or wake-up times using 90-minute sleep cycles and a fall-asleep buffer.",
  "inLanguage": "en"
}
</script>

9.2 SoftwareApplication
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Sleep Time Calculator",
  "applicationCategory": "HealthApplication",
  "applicationSubCategory": "Sleep Cycle Calculator",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/time-date/sleep-time-calculator/",
  "description": "Free sleep time calculator to find ideal bedtimes or wake-up times based on 90-minute sleep cycles.",
  "browserRequirements": "Requires JavaScript enabled",
  "softwareVersion": "1.0",
  "creator": {
    "@type": "Organization",
    "name": "CalcHowMuch"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
</script>

9.3 FAQPage (Exactly 10; must match visible FAQs)
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a sleep time calculator?",
      "acceptedAnswer": { "@type": "Answer", "text": "A sleep time calculator suggests bedtimes or wake-up times based on typical sleep cycles so you can aim to wake up between cycles." }
    },
    {
      "@type": "Question",
      "name": "How long is a typical sleep cycle?",
      "acceptedAnswer": { "@type": "Answer", "text": "A common estimate is about 90 minutes per sleep cycle, though it can vary by person and by night." }
    },
    {
      "@type": "Question",
      "name": "Why does the calculator use 15 minutes to fall asleep?",
      "acceptedAnswer": { "@type": "Answer", "text": "It adds a buffer to estimate the time it may take to fall asleep after getting into bed." }
    },
    {
      "@type": "Question",
      "name": "If I want to wake up at a certain time, what bedtime should I choose?",
      "acceptedAnswer": { "@type": "Answer", "text": "Pick a recommended bedtime that lines up with 4–6 sleep cycles before your wake-up time." }
    },
    {
      "@type": "Question",
      "name": "If I fall asleep at a certain time, what time should I wake up?",
      "acceptedAnswer": { "@type": "Answer", "text": "Choose a wake-up option that is 4–6 cycles (about 6–9 hours) after your fall-asleep time." }
    },
    {
      "@type": "Question",
      "name": "How many sleep cycles should I aim for?",
      "acceptedAnswer": { "@type": "Answer", "text": "Many people feel best with 5 or 6 cycles (about 7.5 to 9 hours), but needs vary." }
    },
    {
      "@type": "Question",
      "name": "Is 8 hours of sleep always the best target?",
      "acceptedAnswer": { "@type": "Answer", "text": "Not always—sleep quality and timing matter, and some people feel better with slightly more or less." }
    },
    {
      "@type": "Question",
      "name": "Does waking up during deep sleep matter?",
      "acceptedAnswer": { "@type": "Answer", "text": "Waking in the middle of a cycle can feel harder because you may be in deeper sleep; waking near the end of a cycle can feel easier." }
    },
    {
      "@type": "Question",
      "name": "Can I use this calculator for naps?",
      "acceptedAnswer": { "@type": "Answer", "text": "For naps, shorter options like 1–2 cycles are often used; a dedicated nap calculator can be more precise." }
    },
    {
      "@type": "Question",
      "name": "Is this sleep calculator medical advice?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. It provides estimates based on averages; persistent sleep problems should be discussed with a healthcare professional." }
    }
  ]
}
</script>

9.4 BreadcrumbList
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/" },
    { "@type": "ListItem", "position": 2, "name": "Time & Date", "item": "https://calchowmuch.com/time-date/" },
    { "@type": "ListItem", "position": 3, "name": "Sleep Time Calculator", "item": "https://calchowmuch.com/time-date/sleep-time-calculator/" }
  ]
}
</script>

10) Schema Injection Guard (Required Pattern)

Implement a boolean flag pattern to prevent any global/layout FAQPage from leaking into calculator pages.

Requirement:

On this page: page-scoped FAQPage must exist

On layout/app shell: no global FAQPage injection

Site-wide FAQPage schema allowed only on /faq

11) Sitemap & Indexing Updates (Required)

Must update:

sitemap.xml add /time-date/sleep-time-calculator/

/sitemap page listing

public calculators index (if you maintain one)

left-nav config (ensure slug points to this canonical)

Recommended changefreq/priority:

calculator page: monthly / 0.70 (consistent with your current pattern)

12) Testing Requirements (Required)
12.1 Unit tests (module.js)

Mode A computation correctness (including fall-asleep buffer)

Mode B computation correctness

Cross-day rollover (e.g., wake 06:00 → bedtime previous day)

Invalid input handling

12.2 E2E (Playwright)

Toggle mode A/B changes labels/results correctly

Date/time entry works

Calculate produces results list

Explanation pane exists and contains 10 FAQs

12.3 SEO Tests

Title, meta description, canonical present

JSON-LD scripts present (WebPage, SoftwareApplication, FAQPage, BreadcrumbList)

FAQPage count = 10, matches visible FAQ text

No duplicate FAQPage from layout

12.4 ISS-001 UI Regression

No layout changes

Spacing/alignment unchanged

Buttons/inputs remain in same positions

13) Acceptance Criteria

Renders identically to current layout (only copy/SEO/logic/results added)

Produces correct recommended times for both modes

Explanation pane follows your standard with dynamic tables + 10 FAQs

Page-scoped JSON-LD passes Rich Results validation (no duplicate FAQPage)

Sitemap updated and page is indexable with canonical set
# REQ — Wake-Up Time Calculator (SERP-Ready)

**Calculator Group:** Time & Date

**Calculator:** Wake-Up Time Calculator

**Primary Question (Single-Question Rule):** "If I go to bed at a certain time, what time should I wake up?"

**Status:** REBUILD (SERP Upgrade)

**Type:** Existing layout preserved; SEO + copy + schema + logic hardening

**FSM Phase:** REQ

**Scope:** UI (no layout changes), Compute, Explanation Pane, SEO, JSON-LD, Sitemap, Testing

## 1. Purpose & Search Intent (SEO-Critical)

### 1.1 User Intent

Users want recommended wake-up times based on:

- a chosen bedtime ("I go to bed at…")
- typical sleep cycles (approx 90 minutes)
- an optional fall-asleep latency buffer (default 15 minutes)

This calculator is distinct from Sleep Time Calculator:

- Wake-Up Time Calculator: bedtime → wake-up options (forward direction)

### 1.2 Primary SEO Keywords (MANDATORY)

Must appear naturally in H1, title, meta description, explanation summary, and FAQ questions.

**Primary keywords**

- wake-up time calculator
- wake up time calculator
- wake up calculator
- sleep cycle wake up calculator

**Secondary keywords**

- sleep cycle calculator
- 90 minute sleep cycle calculator
- best time to wake up calculator
- bedtime to wake time calculator

**Long-tail / intent keywords**

- if I go to bed at {time} when should I wake up
- what time should I wake up if I sleep at {time}
- best wake up time for 6 hours / 7.5 hours / 9 hours sleep

## 2. Category & Navigation Requirements (No Layout Changes)

### 2.1 Top Navigation

Top nav button stays: Time & Date

### 2.2 Left Navigation (Time & Date)

Keep label exactly: Wake-Up Time Calculator
No renames, no reordering required for this REQ.

## 3. URL & Page Model (SEO + MVP)

### 3.1 Canonical URL (REQUIRED)

/time-date/wake-up-time-calculator/

### 3.2 Architecture

- One calculator per page (crawlable explanation pane)
- No separate URLs for variants (avoid cannibalization)

## 4. Folder & File Structure (REQUIRED)

/public/calculators/time-date/wake-up-time-calculator/

- index.html — calculator shell + calculation pane + schema injection
- module.js — compute logic + validation
- explanation.html — static explanation pane (SEO-critical)

## 5. Calculation Pane Requirements (UI must remain visually the same)

### 5.1 H1 / Subtitle Copy

**H1:** Wake-Up Time Calculator

**Subtitle:** Find ideal wake-up times using 90-minute sleep cycles.

### 5.2 Inputs (match your existing component layout)

**Required:**

- Date & Time picker(s) (as your UI already supports)
- Interpretation for this page: selected time represents "bedtime" (time you get into bed)

**Optional (if your layout already supports toggles/inputs without redesign):**

- Fall-asleep buffer: default 15 minutes (NOT required to expose as input if it changes layout; can remain an assumption)

**CTA:**

- Keep primary button label and position: Calculate

### 5.3 Output (Required)

After clicking Calculate, show a list of recommended wake-up options (below inputs, same pane):

- Default: 4, 5, 6 cycles (primary)
- Optional: include 3 and 7 as secondary

Each row must show:

- Wake-up time (local time)
- Cycle count (e.g., "5 cycles")
- Estimated sleep duration (e.g., "7h 30m")
- Note: "includes 15 min to fall asleep" (if buffer is applied)

## 6. Calculator Engine (Logic)

### 6.1 Defaults (configurable constants)

- CYCLE_MINUTES = 90
- FALL_ASLEEP_MINUTES = 15
- CYCLES_DEFAULT = [4,5,6]
- CYCLES_EXTENDED = [3,4,5,6,7] (optional display)

### 6.2 Bedtime → Wake-up times (single-mode)

Given bedtime datetime B (time user gets into bed):

- Assume actual sleep start time: S = B + FALL_ASLEEP_MINUTES
- For each cycle count c:
  - wake = S + (c * 90 minutes)
  - sleep_duration = c * 90 minutes (exclude latency)
  - time_in_bed = FALL_ASLEEP_MINUTES + sleep_duration (show optionally in notes)
- Return wake times ascending.

### 6.3 Input/Edge Rules

- Handle cross-day rollover correctly
- Local timezone formatting
- Invalid/missing input: inline error, no crash
- If user picks a time in the past (same day), do not block; results still compute (it's a planning tool)

## 7. Explanation Pane (SEO-Critical; must follow your Universal Standard)

### 7.1 H2 — Summary (keyword-dense, natural)

Must include naturally:

- "Wake-Up Time Calculator"
- "90-minute sleep cycles"
- "fall asleep"
- "recommended wake-up times"

### 7.2 H3 — Scenario Summary (dynamic table)

Populate from calculation pane + constants:

| Field | Value |
|-------|-------|
| Selected bedtime date: | {DATE} |
| Selected bedtime time: | {TIME} |
| Assumed time to fall asleep: | 15 minutes |
| Cycle length used: | 90 minutes |
| Options shown: | {CYCLES_LIST} |

### 7.3 H3 — Results Table (dynamic)

Semantic table:

| Cycles | Recommended Wake-Up Time | Estimated Sleep Time (hours/minutes) | Notes (e.g., "adds 15 min to fall asleep") |
|--------|--------------------------|--------------------------------------|---------------------------------------------|

### 7.4 H3 — How the Wake-Up Time Calculator Works

Explain:

- Most sleepers cycle through stages; 90 minutes is an average estimate
- Waking closer to a cycle boundary can feel easier
- Why the calculator adds a fall-asleep buffer to bedtime

### 7.5 H3 — Assumptions and Limitations

Must include:

- Sleep cycle length varies
- Fall-asleep time varies
- Not medical advice

### 7.6 H3 — FAQs (Exactly 10; boxed styling; MUST match JSON-LD)

Use these verbatim:

**What is a wake-up time calculator?**
A wake-up time calculator estimates ideal wake-up times based on a bedtime and typical sleep cycles.

**How does the wake up calculator work?**
It adds a fall-asleep buffer to your bedtime, then counts forward in 90-minute sleep cycles to suggest wake-up options.

**Why does it use 90-minute sleep cycles?**
Ninety minutes is a common average estimate for one sleep cycle, though real cycles vary.

**Why does it add 15 minutes to fall asleep?**
It approximates the time many people take to fall asleep after going to bed.

**How many sleep cycles should I aim for?**
Many people feel best with 5 or 6 cycles (about 7.5 to 9 hours), but needs differ.

**Is waking up at the end of a cycle important?**
Waking near the end of a cycle can feel easier than waking during deeper sleep stages.

**What if I fall asleep faster or slower than 15 minutes?**
Your best wake-up time may shift; treat the results as estimates and adjust based on your experience.

**Does this calculator guarantee I'll feel rested?**
No. Sleep quality, schedule consistency, stress, and health all affect how rested you feel.

**Can I use this calculator for shift work?**
Yes. Use your planned bedtime and pick the wake-up option that fits your schedule.

**Is this wake-up time calculator medical advice?**
No. It provides general estimates; persistent sleep issues should be discussed with a healthcare professional.

## 8. SEO Metadata (Required)

**Title:** Wake-Up Time Calculator (90-Minute Sleep Cycles) – CalcHowMuch

**Meta description (140–160 chars):**
Calculate the best time to wake up from your bedtime using 90-minute sleep cycles. Get ideal wake-up options in seconds.

**H1:** Wake-Up Time Calculator

**Canonical:** https://calchowmuch.com/time-date/wake-up-time-calculator/

## 9. Page-Scoped JSON-LD Bundle (Required)

### 9.1 WebPage

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Wake-Up Time Calculator",
  "url": "https://calchowmuch.com/time-date/wake-up-time-calculator/",
  "description": "Calculate ideal wake-up times from your bedtime using 90-minute sleep cycles and a fall-asleep buffer.",
  "inLanguage": "en"
}
```

### 9.2 SoftwareApplication

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Wake-Up Time Calculator",
  "applicationCategory": "HealthApplication",
  "applicationSubCategory": "Sleep Cycle Calculator",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/time-date/wake-up-time-calculator/",
  "description": "Free wake-up time calculator to find ideal wake-up options from a bedtime using 90-minute sleep cycles.",
  "browserRequirements": "Requires JavaScript enabled",
  "softwareVersion": "1.0",
  "creator": { "@type": "Organization", "name": "CalcHowMuch" },
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
```

### 9.3 FAQPage (Exactly 10; must match visible FAQs)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is a wake-up time calculator?", "acceptedAnswer": { "@type": "Answer", "text": "A wake-up time calculator estimates ideal wake-up times based on a bedtime and typical sleep cycles." } },
    { "@type": "Question", "name": "How does the wake up calculator work?", "acceptedAnswer": { "@type": "Answer", "text": "It adds a fall-asleep buffer to your bedtime, then counts forward in 90-minute sleep cycles to suggest wake-up options." } },
    { "@type": "Question", "name": "Why does it use 90-minute sleep cycles?", "acceptedAnswer": { "@type": "Answer", "text": "Ninety minutes is a common average estimate for one sleep cycle, though real cycles vary." } },
    { "@type": "Question", "name": "Why does it add 15 minutes to fall asleep?", "acceptedAnswer": { "@type": "Answer", "text": "It approximates the time many people take to fall asleep after going to bed." } },
    { "@type": "Question", "name": "How many sleep cycles should I aim for?", "acceptedAnswer": { "@type": "Answer", "text": "Many people feel best with 5 or 6 cycles (about 7.5 to 9 hours), but needs differ." } },
    { "@type": "Question", "name": "Is waking up at the end of a cycle important?", "acceptedAnswer": { "@type": "Answer", "text": "Waking near the end of a cycle can feel easier than waking during deeper sleep stages." } },
    { "@type": "Question", "name": "What if I fall asleep faster or slower than 15 minutes?", "acceptedAnswer": { "@type": "Answer", "text": "Your best wake-up time may shift; treat the results as estimates and adjust based on your experience." } },
    { "@type": "Question", "name": "Does this calculator guarantee I'll feel rested?", "acceptedAnswer": { "@type": "Answer", "text": "No. Sleep quality, schedule consistency, stress, and health all affect how rested you feel." } },
    { "@type": "Question", "name": "Can I use this calculator for shift work?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Use your planned bedtime and pick the wake-up option that fits your schedule." } },
    { "@type": "Question", "name": "Is this wake-up time calculator medical advice?", "acceptedAnswer": { "@type": "Answer", "text": "No. It provides general estimates; persistent sleep issues should be discussed with a healthcare professional." } }
  ]
}
```

### 9.4 BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/" },
    { "@type": "ListItem", "position": 2, "name": "Time & Date", "item": "https://calchowmuch.com/time-date/" },
    { "@type": "ListItem", "position": 3, "name": "Wake-Up Time Calculator", "item": "https://calchowmuch.com/time-date/wake-up-time-calculator/" }
  ]
}
```

## 10. Schema Injection Guard (Required Pattern)

- This page must inject only its page-scoped JSON-LD
- No global/layout FAQPage injection allowed (except /faq page)
- Guard implemented as a boolean flag (page-level "enable FAQ schema")

## 11. Sitemap & Indexing Updates (Required)

Update:

- sitemap.xml add /time-date/wake-up-time-calculator/
- /sitemap page list (if you have one)
- Navigation config: slug points to canonical

Recommended:

- <changefreq>monthly</changefreq>
- <priority>0.70</priority>

## 12. Testing Requirements (Required)

### 12.1 Unit tests (module.js)

- Adds 15-min fall-asleep buffer to bedtime
- Computes wake times for cycles correctly
- Cross-day rollover
- Invalid input handling

### 12.2 E2E (Playwright)

- Date/time entry
- Calculate produces results list
- Explanation pane renders + contains 10 FAQs
- JSON-LD exists and is valid

### 12.3 SEO Tests

- Title/meta/canonical present
- JSON-LD: WebPage, SoftwareApplication, FAQPage, BreadcrumbList
- FAQPage count = 10 and matches UI FAQ text
- No duplicate FAQPage from layout

### 12.4 ISS-001 UI Regression

- Layout unchanged (spacing/positions)
- Only content/results added within existing pane regions

## 13. Acceptance Criteria

- Same UI layout as current (no redesign)
- Correct wake-up options from bedtime using 90-min cycles + 15-min latency
- SERP-ready Explanation Pane with dynamic summary + results table
- Exactly 10 FAQs (UI + JSON-LD match)
- No duplicate FAQPage schema
- Sitemap updated with canonical URL

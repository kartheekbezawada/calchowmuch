# REQ — Time Between Two Dates Calculator (SERP-Ready Upgrade, No Content Changes)

**Calculator Group:** Time & Date

**Calculator:** Time Between Two Dates Calculator

**Primary Question (Single-Question Rule):** "How much time is between two dates (and times)?"

**Status:** SERP Upgrade (metadata + schema + indexing only)

**Constraints:** Keep calculation pane as-is. Keep explanation pane as-is (no wording edits).

**FSM Phase:** REQ

**Scope:** SEO metadata, JSON-LD, canonical, sitemap, testing, schema guard

## 1. SERP Intent & Keyword Targeting (No UI Copy Changes)

### 1.1 Target Queries

- time between two dates calculator
- date difference calculator
- days between two dates
- time difference calculator
- how many days between dates
- weeks between two dates
- months between two dates
- hours between two dates (date & time mode)

### 1.2 Content Rule

Do not rewrite headings, paragraphs, or FAQ wording in the explanation pane. SERP readiness must be achieved via:

- <title> / meta description
- canonical + OpenGraph/Twitter (optional)
- structured data (JSON-LD)
- sitemap and internal linking signals

## 2. Canonical URL (REQUIRED)

**Canonical URL:**
/time-and-date/time-between-two-dates/

**Canonical tag:**
https://calchowmuch.com/time-and-date/time-between-two-dates/

## 3. SEO Metadata (REQUIRED)

### 3.1 Title

Time Between Two Dates Calculator – Date Difference in Days, Weeks & Months | CalcHowMuch

### 3.2 Meta Description (140–160 chars)

Calculate the time between two dates and times. Get the difference in days, weeks, months, hours, and minutes with clear results.

### 3.3 On-page headings

Do not change existing H1/H2/H3.

## 4. Structured Data (JSON-LD) — Page-Scoped Only

### 4.1 WebPage

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Time Between Two Dates Calculator",
  "url": "https://calchowmuch.com/time-and-date/time-between-two-dates/",
  "description": "Calculate the difference between two dates (and times) in days, weeks, months, hours, and minutes.",
  "inLanguage": "en"
}
```

### 4.2 SoftwareApplication

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Time Between Two Dates Calculator",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/time-and-date/time-between-two-dates/",
  "description": "Free date difference calculator to find the time between two dates and times.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "creator": { "@type": "Organization", "name": "CalcHowMuch" }
}
```

### 4.3 FAQPage (MUST match the explanation pane exactly; no edits)

Inject these FAQs verbatim (same punctuation and wording). If the page has more FAQs than these, include all of them—do not add new questions.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why do months and days give different answers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Days count elapsed time, while months follow calendar boundaries. Month length changes throughout the year."
      }
    },
    {
      "@type": "Question",
      "name": "Does the calculator include the start date?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. It calculates the time from the start date/time up to the end date/time."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the end date is before the start date?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The calculator will show an error and ask you to choose an end date that is after the start date."
      }
    },
    {
      "@type": "Question",
      "name": "Does daylight saving time affect the result?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It can affect results in Date & time mode, because a day can be 23 or 25 hours when clocks change."
      }
    }
  ]
}
```

### 4.4 BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/" },
    { "@type": "ListItem", "position": 2, "name": "Time & Date", "item": "https://calchowmuch.com/time-and-date/" },
    { "@type": "ListItem", "position": 3, "name": "Time Between Two Dates Calculator", "item": "https://calchowmuch.com/time-and-date/time-between-two-dates/" }
  ]
}
```

## 5. Schema Injection Guard (REQUIRED)

Prevent duplicate FAQPage schema:

- Layout/app shell must not inject FAQPage.
- Page-level flag pattern:
  - pageSchema.enableFAQ = true for this page only
  - Others default false unless explicitly enabled
- /faq is the only page allowed to have a global FAQ index schema.

## 6. Sitemap Update (REQUIRED)

Add/confirm entry:

```xml
<url>
  <loc>https://calchowmuch.com/time-and-date/time-between-two-dates/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.70</priority>
</url>
```

## 7. Internal Linking (No content edits)

If your template already supports a "Related calculators" block (without changing layout), include links to:

- Countdown Timer Generator
- Days Until a Date
- Age Calculator

If no existing slot, skip.

## 8. SEO/QA Tests (REQUIRED)

### 8.1 SEO Assertions

- <title> matches Section 3.1
- meta description matches Section 3.2
- canonical matches Section 2
- JSON-LD present: WebPage, SoftwareApplication, FAQPage, BreadcrumbList
- FAQPage matches visible FAQs exactly
- No duplicate FAQPage scripts

### 8.2 E2E Assertions (Playwright)

- Existing calculation pane unchanged (snapshot)
- End date earlier than start shows error
- Date-only and date+time modes work (as per current behavior)

### 8.3 UI Regression (ISS-001)

- No visual changes to calculation pane or explanation pane

## 9. Acceptance Criteria

- Page is SERP-ready via metadata + schema + canonical + sitemap
- Explanation pane content unchanged
- FAQPage schema exactly mirrors existing FAQ text
- No duplicate structured data injections

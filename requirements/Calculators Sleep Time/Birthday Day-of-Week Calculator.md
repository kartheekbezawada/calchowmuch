# REQ — Birthday Day-of-Week Calculator (SERP-Ready Upgrade, No Content Changes)

**Calculator Group:** Time & Date

**Calculator:** Birthday Day-of-Week Calculator

**Primary Question (Single-Question Rule):** "What day of the week was (or will be) my birthday?"

**Status:** SERP Upgrade (metadata + schema + indexing only)

**Constraints:** Keep calculation pane as-is. Keep explanation pane as-is (no wording edits).

**FSM Phase:** REQ

**Scope:** SEO metadata, JSON-LD, canonical, sitemap, testing, schema guard

## 1. SERP Intent & Keyword Targeting (No UI Copy Changes)

### 1.1 Target Queries

- birthday day of the week calculator
- what day was I born
- day of week for birthday
- what day is my birthday
- day of week calculator for date
- birthday weekday calculator

### 1.2 Content Rule

Do not rewrite headings, paragraphs, or FAQ wording in the explanation pane. SERP readiness must be achieved via:

- `<title>` / meta description
- canonical
- structured data (JSON-LD)
- sitemap and internal linking signals

## 2. Canonical URL (REQUIRED)

**Canonical URL:** `/time-date/birthday-day-of-week/`

**Canonical tag:** `https://calchowmuch.com/time-date/birthday-day-of-week/`

## 3. SEO Metadata (REQUIRED)

### 3.1 Title

Birthday Day-of-Week Calculator – What Day Is Your Birthday? | CalcHowMuch

### 3.2 Meta Description (140–160 chars)

Find the day of the week for any birthday date—past or future. Instantly see what weekday you were born on or what day it falls on.

### 3.3 On-page headings

Do not change existing H1/H2/H3.

## 4. Structured Data (JSON-LD) — Page-Scoped Only

### 4.1 WebPage

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Birthday Day-of-Week Calculator",
  "url": "https://calchowmuch.com/time-date/birthday-day-of-week/",
  "description": "Calculate the day of the week for a birthday date in the past or future.",
  "inLanguage": "en"
}
</script>
```

### 4.2 SoftwareApplication

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Birthday Day-of-Week Calculator",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/time-date/birthday-day-of-week/",
  "description": "Free birthday weekday calculator to find what day of the week a birthday falls on.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "creator": { "@type": "Organization", "name": "CalcHowMuch" }
}
</script>
```

### 4.3 FAQPage (Required, but MUST be sourced from the existing explanation pane)

**Requirement:**

The page must inject an FAQPage JSON-LD script only if the explanation pane already contains FAQs.

The JSON-LD questions/answers must match the visible FAQ text verbatim (no edits, no additions).

**Implementation note:**

Since you did not paste the exact FAQ text for this page in this message, the agent must copy the FAQs directly from the existing explanation pane and inject them exactly.

If the current explanation pane has no FAQs, then:

- Do not inject FAQPage schema for this page.

### 4.4 BreadcrumbList

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/" },
    { "@type": "ListItem", "position": 2, "name": "Time & Date", "item": "https://calchowmuch.com/time-date/" },
    { "@type": "ListItem", "position": 3, "name": "Birthday Day-of-Week Calculator", "item": "https://calchowmuch.com/time-date/birthday-day-of-week/" }
  ]
}
</script>
```

## 5. Schema Injection Guard (REQUIRED)

Prevent duplicate FAQPage schema:

- Layout/app shell must not inject FAQPage.
- Page-level flag pattern: `pageSchema.enableFAQ = true` only when the page has FAQs in its explanation pane
- Others default false
- `/faq` is the only page allowed to have a global FAQ index schema.

## 6. Sitemap Update (REQUIRED)

Add/confirm entry:

```xml
<url>
  <loc>https://calchowmuch.com/time-date/birthday-day-of-week/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.70</priority>
</url>
```

## 7. Internal Linking (No content edits)

If your template already supports a "Related calculators" block (without changing layout), include links to:

- Age Calculator
- Time Between Two Dates Calculator
- Countdown Timer Generator

If no existing slot, skip.

## 8. SEO/QA Tests (REQUIRED)

### 8.1 SEO Assertions

- `<title>` matches Section 3.1
- meta description matches Section 3.2
- canonical matches Section 2
- JSON-LD present: WebPage, SoftwareApplication, BreadcrumbList
- If FAQs exist in the explanation pane: FAQPage schema present and matches verbatim
- No duplicate FAQPage scripts

### 8.2 E2E Assertions (Playwright)

- Calculation pane unchanged (snapshot)
- Entering a date returns a weekday reliably
- Past and future dates supported

### 8.3 UI Regression (ISS-001)

- No visual changes to calculation pane or explanation pane

## 9. Acceptance Criteria

- Page is SERP-ready via metadata + schema + canonical + sitemap
- Explanation pane content unchanged
- If FAQs exist, FAQPage schema mirrors them exactly; otherwise FAQPage schema is omitted
- No duplicate structured data injections

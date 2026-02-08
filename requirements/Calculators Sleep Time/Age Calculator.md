# REQ — Age Calculator (SERP-Ready Upgrade, No Content Changes)

**Calculator Group:** Time & Date

**Calculator:** Age Calculator

**Primary Question (Single-Question Rule):** "How old am I (in years, months, and days)?"

**Status:** SERP Upgrade (metadata + schema + indexing only)

**Constraints:** Keep calculation pane as-is. Keep explanation pane as-is (no wording edits).

**FSM Phase:** REQ

**Scope:** SEO metadata, JSON-LD, canonical, sitemap, testing, schema guard

## 1. SERP Intent & Keyword Targeting (No UI Copy Changes)

### 1.1 Target Queries

- age calculator
- how old am I
- birthday age calculator
- age in years months days
- calculate age from date of birth
- age on a specific date

### 1.2 Content Rule

Do not rewrite headings, paragraphs, or FAQ wording in the explanation pane. SERP readiness must be achieved via:

- `<title>` / meta description
- canonical
- structured data (JSON-LD)
- sitemap and internal linking signals

## 2. Canonical URL (REQUIRED)

**Canonical URL:** `/time-and-date/age-calculator/`

**Canonical tag:** `https://calchowmuch.com/time-and-date/age-calculator/`

## 3. SEO Metadata (REQUIRED)

### 3.1 Title

Age Calculator – Calculate Age in Years, Months & Days | CalcHowMuch

### 3.2 Meta Description (140–160 chars)

Calculate your exact age in years, months, and days. Handles leap years and real month lengths, and lets you check age on any date.

### 3.3 On-page headings

Do not change existing H1/H2/H3.

## 4. Structured Data (JSON-LD) — Page-Scoped Only

### 4.1 WebPage

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Age Calculator",
  "url": "https://calchowmuch.com/time-and-date/age-calculator/",
  "description": "Calculate age in years, months, and days from a date of birth, including leap years and real month lengths.",
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
  "name": "Age Calculator",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/time-and-date/age-calculator/",
  "description": "Free age calculator to compute age in years, months, and days, with leap-year support and an optional 'as of' date.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "creator": { "@type": "Organization", "name": "CalcHowMuch" }
}
</script>
```

### 4.3 FAQPage (MUST match the explanation pane exactly; no edits)

Inject these FAQs verbatim (same punctuation and wording). If the page has more FAQs than these, include all of them—do not add new questions.

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How accurate is this age calculator?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is accurate to the calendar day, using real month lengths and leap years."
      }
    },
    {
      "@type": "Question",
      "name": "Does it handle leap years correctly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. February 29 is accounted for when calculating years, months, and days."
      }
    },
    {
      "@type": "Question",
      "name": "Can I calculate my age on a past or future date?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. You can select a different \"as of\" date to see your age at that time."
      }
    },
    {
      "@type": "Question",
      "name": "Why doesn't the calculator show hours or minutes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It focuses on exact calendar age, which is typically expressed in years, months, and days."
      }
    }
  ]
}
</script>
```

### 4.4 BreadcrumbList

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/" },
    { "@type": "ListItem", "position": 2, "name": "Time & Date", "item": "https://calchowmuch.com/time-and-date/" },
    { "@type": "ListItem", "position": 3, "name": "Age Calculator", "item": "https://calchowmuch.com/time-and-date/age-calculator/" }
  ]
}
</script>
```

## 5. Schema Injection Guard (REQUIRED)

Prevent duplicate FAQPage schema:

- Layout/app shell must not inject FAQPage.
- Page-level flag pattern: `pageSchema.enableFAQ = true` for this page only
- Others default false unless explicitly enabled
- `/faq` is the only page allowed to have a global FAQ index schema.

## 6. Sitemap Update (REQUIRED)

Add/confirm entry:

```xml
<url>
  <loc>https://calchowmuch.com/time-and-date/age-calculator/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.70</priority>
</url>
```

## 7. Internal Linking (No content edits)

If your template already supports a "Related calculators" block (without changing layout), include links to:

- Birthday Day-of-Week
- Time Between Two Dates
- Days Until a Date

If no existing slot, skip.

## 8. SEO/QA Tests (REQUIRED)

### 8.1 SEO Assertions

- `<title>` matches Section 3.1
- meta description matches Section 3.2
- canonical matches Section 2
- JSON-LD present: WebPage, SoftwareApplication, FAQPage, BreadcrumbList
- FAQPage matches visible FAQs exactly
- No duplicate FAQPage scripts

### 8.2 E2E Assertions (Playwright)

- Existing calculation pane unchanged (snapshot)
- DOB + as-of date produces correct calendar age
- Leap year DOB cases supported (e.g., 2000-02-29)

### 8.3 UI Regression (ISS-001)

- No visual changes to calculation pane or explanation pane

## 9. Acceptance Criteria

- Page is SERP-ready via metadata + schema + canonical + sitemap
- Explanation pane content unchanged
- FAQPage schema exactly mirrors existing FAQ text
- No duplicate structured data injections

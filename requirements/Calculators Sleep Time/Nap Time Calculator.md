# REQ — Nap Time Calculator (SERP-Ready Upgrade, No Content Changes)

**Calculator Group:** Time & Date

**Calculator:** Nap Time Calculator

**Primary Question (Single-Question Rule):** "When should I wake up from a nap?"

**Status:** SERP Upgrade (metadata + schema + indexing only)

**Constraints:** Keep calculation pane as-is. Keep explanation pane as-is (no wording edits).

**FSM Phase:** REQ

**Scope:** SEO metadata, JSON-LD, canonical, sitemap, testing, schema guard

## 1. SERP Intent & Keyword Targeting (No UI Copy Changes)

### 1.1 Target Queries

- nap time calculator
- nap calculator
- best nap time
- power nap calculator
- when should I wake up from a nap
- nap length calculator
- nap wake up time

### 1.2 Content Rule

Do not rewrite or reorder:

- calculation pane
- explanation text
- headings
- FAQ wording

SERP readiness must be achieved only via metadata, schema, canonical, sitemap, and indexing signals.

## 2. Canonical URL (REQUIRED)

**Canonical URL:** `/time-and-date/nap-time-calculator/`

**Canonical tag:** `https://calchowmuch.com/time-and-date/nap-time-calculator/`

## 3. SEO Metadata (REQUIRED)

### 3.1 Title

Nap Time Calculator – Find the Best Time to Wake Up | CalcHowMuch

### 3.2 Meta Description (140–160 chars)

Calculate the best nap length and wake-up time. Plan quick naps, power naps, or longer naps without grogginess.

### 3.3 On-page Headings

Do not change existing H1/H2/H3.

## 4. Structured Data (JSON-LD) — Page-Scoped Only

### 4.1 WebPage

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Nap Time Calculator",
  "url": "https://calchowmuch.com/time-and-date/nap-time-calculator/",
  "description": "Calculate the best nap time and wake-up time based on different nap lengths.",
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
  "name": "Nap Time Calculator",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/time-and-date/nap-time-calculator/",
  "description": "Free nap time calculator to find ideal nap lengths and suggested wake-up times.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "creator": { "@type": "Organization", "name": "CalcHowMuch" }
}
</script>
```

### 4.3 FAQPage (MUST match the explanation pane exactly; no edits)

Inject these FAQs verbatim (same wording and punctuation). Do not add or remove questions.

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Which nap is best for work breaks?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Quick naps and power naps are usually the easiest to fit into a workday because they are shorter."
      }
    },
    {
      "@type": "Question",
      "name": "Why do I sometimes feel worse after a nap?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If you wake up during deeper sleep, you may feel groggy for a while. A shorter nap or a different nap length can help."
      }
    },
    {
      "@type": "Question",
      "name": "Will napping ruin my sleep at night?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Naps taken too late in the day can make it harder to fall asleep at night. If this happens, try a shorter nap or nap earlier."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best time of day to nap?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Many people prefer early afternoon. If you nap late, it may affect nighttime sleep."
      }
    },
    {
      "@type": "Question",
      "name": "Does the calculator set an alarm?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. It only suggests a wake-up time. You can set an alarm on your phone or device."
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
    { "@type": "ListItem", "position": 3, "name": "Nap Time Calculator", "item": "https://calchowmuch.com/time-and-date/nap-time-calculator/" }
  ]
}
</script>
```

## 5. Schema Injection Guard (REQUIRED)

Layout/app shell must not inject FAQPage.

**Page-level flag pattern:**

- `pageSchema.enableFAQ = true` for this page
- Default false for all others unless explicitly enabled
- `/faq` is the only page allowed to have a global FAQ index schema.

## 6. Sitemap Update (REQUIRED)

Add/confirm:

```xml
<url>
  <loc>https://calchowmuch.com/time-and-date/nap-time-calculator/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.70</priority>
</url>
```

## 7. Internal Linking (No content edits)

If your template already supports a "Related calculators" block, include links to:

- Power Nap Calculator
- Sleep Time Calculator
- Wake-Up Time Calculator

If no existing slot, skip.

## 8. SEO / QA Tests (REQUIRED)

### 8.1 SEO Assertions

- `<title>` matches Section 3.1
- meta description matches Section 3.2
- canonical matches Section 2
- JSON-LD present: WebPage, SoftwareApplication, FAQPage, BreadcrumbList
- FAQPage matches visible FAQs exactly
- No duplicate FAQPage scripts

### 8.2 E2E Assertions (Playwright)

- Calculation pane unchanged (snapshot)
- Selecting a nap start time produces wake-up suggestions (current behavior)
- No regressions in output logic

### 8.3 UI Regression (ISS-001)

- No visual changes to calculation pane
- No visual changes to explanation pane

## 9. Acceptance Criteria

- Page is fully SERP-ready via metadata + schema + canonical + sitemap
- Explanation pane content unchanged
- FAQPage schema mirrors existing FAQs exactly
- No duplicate structured data injections

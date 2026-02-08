REQ — Countdown Timer Generator (SERP-Ready Upgrade, No Content Changes)

Calculator Group: Time & Date
Calculator: Countdown Timer Generator
Primary Question (Single-Question Rule): “How much time is left until a specific date and time?”
Status: SERP Upgrade (metadata + schema + indexing only)
Constraints: Keep calculation pane as-is. Keep explanation pane as-is (no wording edits).
FSM Phase: REQ
Scope: SEO metadata, JSON-LD, canonical, sitemap, testing, schema guard

1) SERP Intent & Keyword Targeting (No UI Copy Changes)
1.1 Target Queries

countdown timer generator

countdown timer

countdown calculator

time until date calculator

days until a date and time

countdown to a date and time

event countdown timer

1.2 Content Rule

Do not rewrite headings, paragraphs, or FAQ wording in the explanation pane. SERP readiness must be achieved via:

<title> / meta description

canonical + OpenGraph/Twitter (optional)

structured data (JSON-LD)

sitemap and internal linking signals

2) Canonical URL (REQUIRED)

Canonical URL:
/time-date/countdown-timer-generator/

Canonical tag:
https://calchowmuch.com/time-date/countdown-timer-generator/

3) SEO Metadata (REQUIRED)
3.1 Title

Countdown Timer Generator – Countdown to Any Date & Time | CalcHowMuch

3.2 Meta Description (140–160 chars)

Create a countdown timer to any future date and time. See days, hours, minutes, and seconds remaining—fast, free, and accurate.

3.3 On-page headings

Do not change existing H1/H2/H3.

4) Structured Data (JSON-LD) — Page-Scoped Only
4.1 WebPage
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Countdown Timer Generator",
  "url": "https://calchowmuch.com/time-date/countdown-timer-generator/",
  "description": "Generate a countdown timer to a future date and time and see the time remaining in days, hours, minutes, and seconds.",
  "inLanguage": "en"
}
</script>

4.2 SoftwareApplication
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Countdown Timer Generator",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/time-date/countdown-timer-generator/",
  "description": "Free countdown timer generator to count down to any future date and time.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "creator": { "@type": "Organization", "name": "CalcHowMuch" }
}
</script>

4.3 FAQPage (MUST match the explanation pane exactly; no edits)

You provided these FAQs and they must be injected verbatim (same punctuation and wording). If the page has more FAQs than these, include all of them—do not add new questions.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does the countdown include the current second?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. It counts the full time remaining between now and the target time."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the target time is in the past?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The calculator will show an error and ask for a future date and time."
      }
    },
    {
      "@type": "Question",
      "name": "Will daylight saving time affect the countdown?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It can. The countdown uses your local time and will follow daylight saving changes."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use this for long term events?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The countdown will show days and hours remaining, even for dates months away."
      }
    }
  ]
}
</script>

4.4 BreadcrumbList
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/" },
    { "@type": "ListItem", "position": 2, "name": "Time & Date", "item": "https://calchowmuch.com/time-date/" },
    { "@type": "ListItem", "position": 3, "name": "Countdown Timer Generator", "item": "https://calchowmuch.com/time-date/countdown-timer-generator/" }
  ]
}
</script>

5) Schema Injection Guard (REQUIRED)

Because you are adding FAQPage schema, prevent duplicate FAQPage injection:

Layout/app shell must not inject FAQPage.

Page-level flag pattern:

pageSchema.enableFAQ = true for this page only

Other pages default false unless explicitly enabled

/faq page is the only place allowed to have a global FAQ index schema.

6) Sitemap Update (REQUIRED)

Add/confirm entry:

<url>
  <loc>https://calchowmuch.com/time-date/countdown-timer-generator/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.70</priority>
</url>

7) Internal Linking (No UI change, but add links where allowed)

Without editing the explanation text, you may:

Add “Related calculators” links block (if your template already has it) to:

Days Until a Date

Time Between Two Dates

Age Calculator
If there is no existing slot for related links, skip (do not add new layout sections).

8) SEO/QA Tests (REQUIRED)
8.1 SEO Assertions

<title> matches Section 3.1

<meta name="description"> matches Section 3.2

<link rel="canonical"> equals canonical URL

JSON-LD present: WebPage + SoftwareApplication + BreadcrumbList

FAQPage present and matches visible FAQ text exactly

No duplicate FAQPage scripts

8.2 E2E Assertions (Playwright)

Existing calculation pane unchanged (baseline snapshot)

Past target time shows error (as current behavior states)

Future target time renders countdown and updates

8.3 UI Regression (ISS-001)

No visual changes to calculation pane

No visual changes to explanation pane

9) Acceptance Criteria

Page becomes SERP-ready via metadata + schema + canonical + sitemap

Explanation pane content remains unchanged

FAQPage schema exactly mirrors existing FAQs (including the 4 provided)

No duplicate structured data injections across the site
REQ-20260206-001
Present Value (PV) Calculator — Finance Category
===============================================

## Status: NEW

- Type: Requirements spec + build/generation instructions
- FSM Phase: REQ
- Owner: Product / Platform
- Scope: UI, Compute, Navigation, SEO, Sitemap, Testing

### Repo Reality Check (AP-2.3)

As of 2026-02-06, the Present Value calculator implementation already exists at:

- `/public/calculators/finance/present-value/` (fragments + module)
- Navigation entry exists in `/public/config/navigation.json` under `finance → time-value-of-money → present-value`
- The build generator `/scripts/generate-mpa-pages.js` already has a `present-value` override and generates:
  - `/public/finance/present-value/index.html`
  - `/public/sitemap.xml`
  - `/public/sitemap/index.html`

This REQ documents the contract and the deterministic build steps so new Finance calculators can follow the same pattern.

## 1) Purpose & User Intent

### 1.1 Calculator Question (Single-Question Rule)

“What is the present value of a future amount of money?”

This calculator answers one focused financial question, aligned with Time Value of Money principles.

## 2) Category & Navigation Requirements

### 2.1 Top Navigation Category

Top Navigation Button: Finance

Category Status: Existing in `public/config/navigation.json`

Rules:

- Navigation MUST be config-driven via `public/config/navigation.json` (no hard-coded lists)
- Deep linking MUST activate the correct top nav category and highlight the active calculator
- Navigation between calculators MUST be full page loads (MPA)

## 3) URL & Page Model

Public URL:

- `/finance/present-value/`

Architecture:

- MPA (full page reload on navigation)
- One page = one calculator
- Explanation content is static HTML (crawlable)

## 4) Folder & File Structure

This project uses a generator that wraps calculator fragments into the full 3-column shell.

**Fragments (source-of-truth):**

```
/public/calculators/finance/present-value/
  ├── index.html          # Calculation pane fragment (NOT full page)
  ├── module.js           # Calculator UI + compute glue
  ├── explanation.html    # Explanation pane fragment
  └── calculator.css      # Optional per-calculator styling
```

**Generated output (do not hand-edit):**

```
/public/finance/present-value/index.html
```

## 5) Calculation Pane Requirements

### 5.1 Inputs (Core)

| Input | Type | Required |
| --- | --- | --- |
| Future Value (FV) | Number | Yes |
| Discount Rate (%) | Number | Yes |
| Time Period | Number | Yes |
| Period Type | Button Toggle (Years / Months) | Yes |

### 5.2 Optional Inputs (Progressive Disclosure)

| Input | Type |
| --- | --- |
| Compounding Frequency | Button Group (Annual, Semi-Annual, Quarterly, Monthly) |

Rules:

Optional inputs MUST NOT block calculation

Optional inputs MUST be behind disclosure

No dropdowns allowed

Calculation Pane MUST comply with ISS-UI-FDP rules

calculation_pane_rules

## 6) Calculator Engine (Logic)

### 6.1 Core Formula

PV = FV ÷ (1 + r)ⁿ

Where:

r = periodic discount rate

n = number of periods

### 6.2 Outputs

| Output | Required |
| --- | --- |
| Present Value (PV) | Yes |
| Effective Period Count | Yes |
| Applied Discount Rate | Yes |

Rules:

Validate divide-by-zero

Validate negative or empty inputs

No unhandled exceptions

UNIVERSAL_REQUIREMENTS

## 7) Explanation Pane (Mandatory)

Must implement Explanation Pane – Universal Standard exactly.

Required Sections (Order is fixed):

H2 — Summary

Based on your inputs for future value, discount rate, and time period, this calculator estimates the present value (PV) of the money you expect to receive in the future.
The result shows how much that future amount is worth today, after accounting for the time value of money.
This helps you compare future cash flows with today’s costs, investments, or alternatives.

H3 — Scenario Summary (table)

| Category | Value | Source |
| --- | --- | --- |
| Future Value | {FUTURE_VALUE} | Calculation Pane |
| Discount Rate | {DISCOUNT_RATE}% | Calculation Pane |
| Time Period | {TIME_PERIOD} {PERIOD_TYPE} | Calculation Pane |
| Compounding Frequency | {COMPOUNDING_FREQUENCY} | Calculation Pane |
| Present Value | {PRESENT_VALUE} | Calculator Engine |

H3 — Results Table

| Metric | Value | Unit | Explanation |
| --- | --- | --- | --- |
| Present Value (PV) | {PRESENT_VALUE} | Currency | Value of future money today |
| Future Value (FV) | {FUTURE_VALUE} | Currency | Amount received in future |
| Effective Periods | {TOTAL_PERIODS} | Periods | Total compounding periods |
| Applied Rate per Period | {PERIODIC_RATE}% | Percent | Discount rate per period |

H3 — Explanation

Present value represents what a future amount of money is worth in today’s terms.
Because money available now can be invested or used immediately, a future amount is usually worth less than the same amount today.

In your calculation, the future value is discounted using the selected discount rate and number of periods, producing the present value.
Higher discount rates or longer time periods reduce the present value, while lower rates or shorter periods increase it.

H3 — Frequently Asked Questions

<div class="faq-box"> <strong>Q: What is present value (PV)?</strong> A: Present value is the current worth of a future amount of money after accounting for the time value of money. </div>
<div class="faq-box"> <strong>Q: Why is present value lower than future value?</strong> A: Because money today can earn returns, a future amount is discounted to reflect lost earning potential. </div>
<div class="faq-box"> <strong>Q: What discount rate should I use?</strong> A: Use a rate that reflects inflation, investment returns, or the opportunity cost relevant to your decision. </div>
<div class="faq-box"> <strong>Q: How does the time period affect present value?</strong> A: Longer time periods increase discounting, which lowers the present value. </div>
<div class="faq-box"> <strong>Q: What is compounding frequency?</strong> A: It defines how often the discount rate is applied, such as annually or monthly. </div>
<div class="faq-box"> <strong>Q: Is present value used in investment decisions?</strong> A: Yes, it is commonly used to evaluate investments, loans, pensions, and future cash flows. </div>
<div class="faq-box"> <strong>Q: Can present value be higher than future value?</strong> A: No, with a positive discount rate, present value will always be lower than future value. </div>
<div class="faq-box"> <strong>Q: Does inflation affect present value?</strong> A: Yes, higher inflation increases discounting and reduces present value. </div>
<div class="faq-box"> <strong>Q: What happens if the discount rate is zero?</strong> A: The present value equals the future value because no discounting is applied. </div>
<div class="faq-box"> <strong>Q: Is this calculator suitable for loans and savings?</strong> A: Yes, it can be used for loans, savings goals, investments, and any future cash amount. </div>

Rules enforced by:

Explanation Pane Standard

explanation_pane_standard

Universal Table Rules (UTBL-*)

No extra headings allowed

## 9) Build / Generation Steps (What to run)

This repo uses a deterministic generator to:

- Normalize `public/config/navigation.json` URLs based on calculator folder locations
- Generate the full calculator shell pages under `/public/<category>/<calculator>/index.html`
- Regenerate `/public/sitemap.xml` and `/public/sitemap/index.html`

### 9.1 Create (or update) a calculator (pattern)

1) Create fragments:

- Create folder: `public/calculators/<category-id>/<calculator-id>/`
- Add:
  - `index.html` (calculation pane fragment)
  - `explanation.html` (explanation pane fragment)
  - `module.js`
  - Optional: `calculator.css`

2) Add nav entry:

- Update `public/config/navigation.json`:
  - Add the calculator under the correct `categories[].subcategories[].calculators[]`
  - Ensure `id` matches the folder name exactly

3) (Optional) add SEO override:

- Add an entry in `scripts/generate-mpa-pages.js` `CALCULATOR_OVERRIDES` for tighter Title/Description/H1.

4) Run generator:

- `node scripts/generate-mpa-pages.js`

### 9.2 Local preview

- `npm run serve`
- Open `http://localhost:8000/finance/present-value/`

### 9.3 Validation commands (implementer phase)

- `npm run lint`
- `npm test`
- `npm run format:check`

## 10) Implementation Reference (already exists)

If you’re implementing a new Finance calculator, copy these patterns:

- Present Value fragments: `public/calculators/finance/present-value/`
- TVM core function: `public/assets/js/core/time-value-utils.js` (`calculatePresentValue`, `resolveCompounding`)
- Metadata helper: `public/assets/js/core/ui.js` (`setPageMetadata`)
- Generator entrypoints:
  - `scripts/generate-mpa-pages.js` (shell + sitemap regeneration)
  - `public/config/navigation.json` (navigation source)

## 8) SEO Requirements (New Calculator Page)

### 8.1 Mandatory SEO Scope

This change is a new calculator + new category, therefore P1–P5 ALL REQUIRED.

SEO rules source:

SEO_RULES

FAQPage JSON-LD
===================
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is present value (PV)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Present value is the current worth of a future amount of money after accounting for the time value of money."
      }
    },
    {
      "@type": "Question",
      "name": "Why is present value lower than future value?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Because money available today can earn returns, a future amount is discounted to reflect lost earning potential."
      }
    },
    {
      "@type": "Question",
      "name": "What discount rate should I use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use a rate that reflects inflation, expected investment returns, or the opportunity cost relevant to your decision."
      }
    },
    {
      "@type": "Question",
      "name": "How does the time period affect present value?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Longer time periods increase discounting, which reduces the present value of a future amount."
      }
    },
    {
      "@type": "Question",
      "name": "What is compounding frequency?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Compounding frequency defines how often the discount rate is applied, such as annually, quarterly, or monthly."
      }
    },
    {
      "@type": "Question",
      "name": "Is present value used in investment decisions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, present value is widely used to evaluate investments, loans, pensions, and future cash flows."
      }
    },
    {
      "@type": "Question",
      "name": "Can present value be higher than future value?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, with a positive discount rate, present value will always be lower than future value."
      }
    },
    {
      "@type": "Question",
      "name": "Does inflation affect present value?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, higher inflation increases discounting and reduces the present value of future money."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the discount rate is zero?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If the discount rate is zero, the present value equals the future value because no discounting is applied."
      }
    },
    {
      "@type": "Question",
      "name": "Is this calculator suitable for loans and savings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, the present value calculator can be used for loans, savings goals, investments, and any future cash amount."
      }
    }
  ]
}
</script>
```
### 1) SoftwareApplication JSON-LD (Calculator-Specific)

Use exactly one SoftwareApplication schema per calculator page.

```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Present Value (PV) Calculator",
  "applicationCategory": "FinanceApplication",
  "applicationSubCategory": "Time Value of Money Calculator",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/finance/present-value/",
  "description": "Calculate the present value of a future amount using discount rate, time period, and compounding frequency.",
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
```

### 2) Full SEO-P2 Bundle (ALL Schemas Together)

This is the complete, recommended bundle for a calculator page.

All four schemas are required for SEO-P2 PASS.

Place together (order does not matter).

```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Present Value (PV) Calculator",
  "url": "https://calchowmuch.com/finance/present-value/",
  "description": "Estimate the present value of future money using discount rate and time period.",
  "inLanguage": "en"
}
</script>
```

Brad crumb list
============

```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://calchowmuch.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Finance",
      "item": "https://calchowmuch.com/finance/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Present Value (PV)",
      "item": "https://calchowmuch.com/finance/present-value/"
    }
  ]
}
</script>
### 8.2 Metadata

H1: Present Value Calculator

Title: Present Value (PV) Calculator – CalcHowMuch

Meta Description:

“Calculate how much your money could grow over time using interest rate and compounding. Fast, accurate Future Value calculator with clear results.”

### 8.3 Structured Data (Required)

Calculator page MUST include:

WebPage

SoftwareApplication

FAQPage

BreadcrumbList

Missing schema = SEO FAIL.

## 9) Sitemap & Indexing (Build-Blocking)

Must update:

sitemap.xml

Human-readable /sitemap page

public/calculators/index.html

Rules:

A calculator is LIVE if it appears in navigation

LIVE calculators MUST appear in sitemap


```

UNIVERSAL_REQUIREMENTS

## 10) Testing Requirements

Change type: New calculator + new category

Required Tests (No Exceptions):

| Test | Required |
| --- | --- |
| Unit (compute logic) | ✅ |
| ISS-001 (layout stability) | ✅ |
| E2E (navigation + calculator flow) | ✅ |
| SEO-P1 | ✅ |
| SEO-P2 | ✅ |
| SEO-P3 | ✅ |
| SEO-P4 | ✅ |
| SEO-P5 | ✅ |

Testing rules source:

TESTING_RULES

## 11) Workflow Enforcement

This requirement MUST follow FSM strictly:

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

No implementation before EVT_START_BUILD

One ITER file only

Max 25 iterations

Compliance PASS required for release

Workflow source:

WORKFLOW

## 12) Acceptance Criteria (Hard Gates)

This REQ is ACCEPTED ONLY IF:

- Finance category appears in top navigation
- Present Value (PV) appears in left navigation under Finance
- Calculator is standalone and crawlable
- Calculation Pane passes ISS-UI-FDP
- Explanation Pane matches universal structure exactly
- SEO P1–P5 all PASS
- Calculator appears in sitemap
- All required tests PASS
- Failure of any P0 rule = REQ FAIL

## 3) Lighthouse & Rich Results Validation Checklist

(Agent-Executable, Pass/Fail)

### 3.1 Google Rich Results Test (Structured Data)

Run:

https://search.google.com/test/rich-results

Checklist:

- No errors
- FAQPage detected
- SoftwareApplication detected
- BreadcrumbList detected
- No duplicate schema warnings
- URLs resolve correctly (no redirects)

FAIL if any required schema missing.

### 3.2 Lighthouse — Performance (SEO-P3)

Run:

npx lighthouse https://calchowmuch.com/finance/present-value/ --only-categories=performance

Thresholds:

- LCP < 2.5s
- CLS < 0.1
- TBT < 200ms
- FCP < 1.8s

FAIL blocks launch.

### 3.3 Lighthouse — SEO

Run:

npx lighthouse https://calchowmuch.com/finance/present-value/ --only-categories=seo

Checks:

- Single H1
- Meta description present
- Canonical correct
- Structured data detected
- Mobile viewport set

### 3.4 Accessibility (SEO-P4 Overlap)

Run:

npx pa11y https://calchowmuch.com/finance/present-value/

Must pass:

- Labels on all inputs
- Proper heading hierarchy
- Color contrast AA
- Focus visible
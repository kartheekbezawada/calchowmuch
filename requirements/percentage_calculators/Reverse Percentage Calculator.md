# REQ — Reverse Percentage Calculator (SERP-Ready)

Calculator Group: Percentage Calculators
Calculator: Reverse Percentage
Primary Question: “Y is X% of what number?” (also supports “Original price before discount”)
Status: NEW
Type: Brand-new calculator (Percentage Calculators → Reverse Percentage)
FSM Phase: REQ
Scope: UI, Compute, Navigation, SEO, Sitemap, Testing

## 1. Purpose & Search Intent (SEO-Critical)
### 1.1 Primary User Question (Single-Question Rule)

Y is X% of what number?

This page solves the reverse-percentage problem where you know:

a final value (Y)

a percentage (X)
and you need the original/base value.

Common use cases:

original price before a discount

finding the total when you only know a part and its percentage

reverse tax/markup style questions (when expressed as “final is X% of original”)

Scope Guard: This page must not include:

“X% of Y”

“X is what % of Y”

percentage increase/decrease/percent change (those are separate pages)

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords must appear in:

H1

title

meta description

explanation copy

FAQ questions

| Keyword Type | Keywords |
| --- | --- |
| Primary | reverse percentage calculator, Y is X% of what number |
| Secondary | find original value from percentage, original price before discount |
| Long-Tail / Intent | how to calculate reverse percentage, reverse discount calculator, calculate original price from discounted price |

## 2. Category & Navigation Requirements
### 2.1 Top-Level Category

Top navigation display name: Percentage Calculators

Category treated as its own top-level group

### 2.2 Left Navigation Structure
```
Percentage Calculators
├── Percentage of a Number
├── What Percent Is X of Y
├── Percentage Increase
├── Percentage Decrease
├── Percent Change
└── Reverse Percentage
```


#### Rules

Display name must be exactly: “Reverse Percentage”

Navigation must be config-driven

One calculator page per intent

## 3. URL & Page Model (SEO + MVP)
### 3.1 Canonical URL
/percentage-calculators/reverse-percentage/

### 3.2 Architecture

Multi-Page Application (MPA)

One calculator per page

Full page reload

Crawlable explanation pane

## 4. Folder & File Structure
```
/public/calculators/percentage-calculators/reverse-percentage/
├── index.html          # Calculator shell + calculation pane
├── module.js           # reverse percentage logic
└── explanation.html    # Static explanation pane (SEO-critical)
```

## 5. Page Metadata (SERP-Optimized)

H1

Reverse Percentage Calculator


Title

Reverse Percentage Calculator – CalcHowMuch


Meta Description (≤160 chars)

Find the original value when Y is X% of it. Use our free reverse percentage calculator for original price before discount and more.


Canonical

https://calchowmuch.com/percentage-calculators/reverse-percentage/

## 6. Calculation Pane Requirements
### 6.1 Heading

H2: Reverse Percentage Calculator

### 6.2 Inputs (Above the Fold)
| Section | Input | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Core | Percentage (X) | Number | Yes | Allow decimals (e.g., 12.5) |
| Core | Final Value (Y) | Number | Yes | Allow decimals; negative allowed (math valid) |

#### UI Rules

No dropdowns

No optional inputs

Labels must clearly communicate: “Y is X% of what number?”

Calculation updates on input change (or Calculate button if globally required)

Do not auto-round during typing

### 6.3 Outputs
| Output | Required | Notes |
| --- | --- | --- |
| Original Value (Base) | Yes | The number such that X% of it equals Y |
| Formula Used | Yes | Show Original = Y ÷ (X ÷ 100) |
| Check Value | Yes | Display “X% of Original = Y” as verification text/value |

## 7. Calculator Engine (Logic)
### 7.1 Authoritative Formula
Original = Y ÷ (X ÷ 100)
Original = (Y × 100) ÷ X


Where:

X = percentage

Y = final value (the part/result)

### 7.2 Validation Rules

Prevent divide-by-zero: if X = 0, original is undefined → show clear inline error state (no crash)

Accept decimals

Accept negative values (math valid)

No unhandled exceptions

Formatting must follow your site-wide output rules

## 8. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

### 8.1 H2 — Summary (Keyword-Dense, Natural)

Reverse percentage helps you find the original value when you know a final value and the percentage it represents.

This reverse percentage calculator answers “Y is X% of what number?” by dividing Y by X expressed as a fraction of 100.

It is commonly used to find the original price before discount, the original total from a percentage-based result, or the base value behind a percentage.

### 8.2 H3 — Scenario Summary (Dynamic Values)
| Category | Value | Source |
| --- | --- | --- |
| Percentage (X) | {PERCENT} | Calculation Pane |
| Final Value (Y) | {FINAL} | Calculation Pane |
| Original Value | {ORIGINAL} | Calculator Engine |

### 8.3 H3 — Results Table (Dynamic Values)
| Metric | Value | Explanation |
| --- | --- | --- |
| Percentage (X) | {PERCENT}% | Percentage of the original |
| Final Value (Y) | {FINAL} | The known result/value |
| Original Value | {ORIGINAL} | Base value before applying percent |
| Formula | Original = (Y × 100) ÷ X | Reverse percentage formula |
| Check | X% of Original = Y | Verification of result |

### 8.4 H3 — Explanation (SERP-Optimized)

To solve a reverse percentage, convert the percentage into a decimal by dividing by 100, then divide the final value by that decimal.

For example, if 60 is 20% of a number, then the original number is 60 ÷ 0.20 = 300.

This is also how you find an original price before a discount when the discounted price is known as a percentage of the original.

If the percentage is zero, the original value cannot be calculated because division by zero is not possible.

### 8.5 H3 — Frequently Asked Questions (Exactly 10)

Visible HTML FAQ content must match FAQPage JSON-LD text exactly.

What is reverse percentage?
Reverse percentage finds the original value when a final value is a known percentage of it.

How do you calculate “Y is X% of what number”?
Divide Y by (X ÷ 100).

What is the reverse percentage formula?
The formula is Original = (Y × 100) ÷ X.

How do I find the original price before discount?
If the discounted price is Y and it equals X% of the original, the original is (Y × 100) ÷ X.

What happens if the percentage is 0%?
The original value is undefined because division by zero is not possible.

Can I use decimal percentages like 12.5%?
Yes, decimal percentages work the same way.

Can the final value be negative?
Yes, negative values are supported mathematically.

How do I check if the result is correct?
Multiply the original value by X% and confirm it equals Y.

Is reverse percentage the same as percent change?
No, reverse percentage finds a base value, while percent change compares two values.

Where is reverse percentage used in real life?
It is used for discounts, taxes, price recovery, and finding totals from percentage-based values.

## 9. Structured Data (JSON-LD Bundle) — REQUIRED
### 9.1 WebPage (Required)
```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Reverse Percentage Calculator",
  "url": "https://calchowmuch.com/percentage-calculators/reverse-percentage/",
  "description": "Find the original value when Y is X% of it using our free reverse percentage calculator.",
  "inLanguage": "en"
}
</script>
```

### 9.2 SoftwareApplication (Required)
```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Reverse Percentage Calculator",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/percentage-calculators/reverse-percentage/",
  "description": "Free reverse percentage calculator to find the original value when a final value is a known percent of it.",
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

### 9.3 FAQPage (Required — Exactly 10, Page-Scoped Only)
```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is reverse percentage?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Reverse percentage finds the original value when a final value is a known percentage of it."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate “Y is X% of what number”?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Divide Y by (X ÷ 100)."
      }
    },
    {
      "@type": "Question",
      "name": "What is the reverse percentage formula?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The formula is Original = (Y × 100) ÷ X."
      }
    },
    {
      "@type": "Question",
      "name": "How do I find the original price before discount?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If the discounted price is Y and it equals X% of the original, the original is (Y × 100) ÷ X."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the percentage is 0%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The original value is undefined because division by zero is not possible."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use decimal percentages like 12.5%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, decimal percentages work the same way."
      }
    },
    {
      "@type": "Question",
      "name": "Can the final value be negative?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, negative values are supported mathematically."
      }
    },
    {
      "@type": "Question",
      "name": "How do I check if the result is correct?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Multiply the original value by X% and confirm it equals Y."
      }
    },
    {
      "@type": "Question",
      "name": "Is reverse percentage the same as percent change?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, reverse percentage finds a base value, while percent change compares two values."
      }
    },
    {
      "@type": "Question",
      "name": "Where is reverse percentage used in real life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is used for discounts, taxes, price recovery, and finding totals from percentage-based values."
      }
    }
  ]
}
</script>
```

### 9.4 BreadcrumbList (Required)
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
      "name": "Percentage Calculators",
      "item": "https://calchowmuch.com/percentage-calculators/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Reverse Percentage",
      "item": "https://calchowmuch.com/percentage-calculators/reverse-percentage/"
    }
  ]
}
</script>
```

## 10. Sitemap & Indexing

Must update:

sitemap.xml

/sitemap

public/calculators/index.html

## 11. Testing Requirements
| Test | Required |
| --- | --- |
| Unit (reverse percentage logic) | ✅ |
| ISS-001 (UI rules / layout regression) | ✅ |
| E2E | ✅ |
| SEO P1 → P5 | ✅ |

## 12. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

## 13. Acceptance Criteria

Correct original/base calculation for decimals and large values

Clear error handling when percentage (X) = 0

One intent, one result (reverse percentage only)

Explanation pane crawlable and matches universal standard

JSON-LD valid and page-scoped

Visible FAQs match FAQPage JSON-LD exactly

Sitemap updated and page discoverable

All tests passing with no P0 failures

# REQ — Percentage Increase Calculator (SERP-Ready)

Calculator Group: Percentage Calculators
Calculator: Percentage Increase
Primary Question: “What is the percentage increase from X to Y?”
Status: NEW
Type: Brand-new calculator (Percentage Calculators → Percentage Increase)
FSM Phase: REQ
Scope: UI, Compute, Navigation, SEO, Sitemap, Testing

## 1. Purpose & Search Intent (SEO-Critical)
### 1.1 Primary User Question (Single-Question Rule)

What is the percentage increase from original value X to new value Y?

Common use cases:

price changes and inflation comparisons

salary/bonus increases

business KPIs (growth rates)

grades, metrics, and performance tracking

Scope Guard: This page must not include percentage decrease, percent change combined mode, “X is what % of Y,” or “X% of Y.” Only increase intent.

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords must appear in:

H1

title

meta description

explanation copy

FAQ questions

| Keyword Type | Keywords |
| --- | --- |
| Primary | percentage increase calculator, percentage increase |
| Secondary | percent increase calculator, percentage increase formula |
| Long-Tail / Intent | how to calculate percentage increase, percentage increase from X to Y |

## 2. Category & Navigation Requirements
### 2.1 Top-Level Category

Top navigation display name: Percentage Calculators

Category treated as its own top-level group

### 2.2 Left Navigation Structure

```
Percentage Calculators
├── Percent Change
├── Percentage Difference
├── Percentage Increase
├── Percentage Decrease
├── Percentage Composition
├── Reverse Percentage
├── Percent to Fraction/Decimal
├── What Percent Is X of Y
├── Find Percentage of a Number
├── Commission Calculator
├── Discount Calculator
├── Margin Calculator
└── Markup Calculator
```



#### Rules

Display name must be exactly: “Percentage Increase”

Navigation must be config-driven

One calculator page per intent

## 3. URL & Page Model (SEO + MVP)
### 3.1 Canonical URL
/percentage-calculators/percentage-increase/

### 3.2 Architecture

Multi-Page Application (MPA)

One calculator per page

Full page reload

Crawlable explanation pane

## 4. Folder & File Structure
```
/public/calculators/percentage-calculators/percentage-increase/
├── index.html          # Calculator shell + calculation pane
├── module.js           # percentage increase logic
└── explanation.html    # Static explanation pane (SEO-critical)
```

## 5. Page Metadata (SERP-Optimized)

H1

Percentage Increase Calculator


Title

Percentage Increase Calculator – CalcHowMuch


Meta Description (≤160 chars)

Calculate percentage increase from an original value to a new value instantly. Use our free percent increase calculator and formula.


Canonical

https://calchowmuch.com/percentage-calculators/percentage-increase/

## 6. Calculation Pane Requirements
### 6.1 Heading

No inner H2 inside the calculation pane. Use only the page-level H1 title.

### 6.2 Inputs (Above the Fold)
| Section | Input | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Core | Original Value (X) | Number | Yes | Allow decimals; negative allowed (see validation rules) |
| Core | New Value (Y) | Number | Yes | Allow decimals; negative allowed (see validation rules) |

#### UI Rules

No dropdowns

No optional inputs

Labels must clearly communicate: “Percentage increase from X to Y”

Calculation updates on input change (or Calculate button if globally required)

Do not auto-round during typing

### 6.3 Outputs
| Output | Required | Notes |
| --- | --- | --- |
| Percentage Increase | Yes | Display with % sign |
| Increase Amount (Y − X) | Yes | Display numeric difference |
| Formula Used | Yes | Show ((Y − X) ÷ X) × 100 |

## 7. Calculator Engine (Logic)
### 7.1 Authoritative Formula
Increase Amount = Y − X
Percentage Increase = ((Y − X) ÷ X) × 100


Where:

X = original value

Y = new value

### 7.2 Validation Rules

Prevent divide-by-zero: if X = 0, percentage increase is undefined → show clear inline error state (no crash)

Allow decimals

Allow negative inputs (mathematically valid but can be counterintuitive; FAQ must clarify)

No unhandled exceptions

Formatting: follow your site-wide output formatting rules (decimals/rounding)

## 8. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

### 8.1 Summary Content (No Summary Heading Node)

A percentage increase shows how much a value has grown from an original amount to a new amount, expressed as a percentage of the original.

This percentage increase calculator finds the percent increase from X to Y by calculating the difference and dividing it by the original value, then multiplying by 100.

It is commonly used for price rises, salary increases, growth metrics, and comparing changes over time.

### 8.2 H3 — Scenario Summary (Dynamic Values)
| Category | Value | Source |
| --- | --- | --- |
| Original Value (X) | {ORIGINAL} | Calculation Pane |
| New Value (Y) | {NEW} | Calculation Pane |
| Increase Amount | {INCREASE_AMOUNT} | Calculator Engine |
| Percentage Increase | {PERCENT_INCREASE} | Calculator Engine |

### 8.3 H3 — Results Table (Dynamic Values)
| Metric | Value | Explanation |
| --- | --- | --- |
| Original Value (X) | {ORIGINAL} | Starting value |
| New Value (Y) | {NEW} | Ending value |
| Increase Amount | {INCREASE_AMOUNT} | Change in units (Y − X) |
| Percentage Increase | {PERCENT_INCREASE}% | Increase relative to original |
| Formula | ((Y − X) ÷ X) × 100 | Percent increase formula |

### 8.4 H3 — Explanation (SERP-Optimized)

To calculate percentage increase, first subtract the original value from the new value to get the increase amount. Then divide that increase by the original value and multiply by 100.

For example, if a value goes from 80 to 100, the increase is 20. Dividing 20 by 80 gives 0.25, and multiplying by 100 gives a 25% increase.

If the original value is zero, percentage increase cannot be calculated because division by zero is not possible.

### 8.5 H3 — Frequently Asked Questions (Exactly 10)

Visible HTML FAQ content must match FAQPage JSON-LD text exactly.

What is percentage increase?
Percentage increase is how much a value has grown compared to its original value, expressed as a percentage.

How do you calculate percentage increase from X to Y?
Subtract X from Y, divide by X, then multiply by 100.

What is the percentage increase formula?
The formula is ((Y − X) ÷ X) × 100.

What is the difference between increase amount and percentage increase?
Increase amount is Y − X, while percentage increase compares that change to the original value.

Can percentage increase be more than 100%?
Yes, if the increase is larger than the original value, the percentage increase exceeds 100%.

What happens if the original value is zero?
Percentage increase is undefined because you cannot divide by zero.

What if the new value is smaller than the original value?
Then the result is not an increase; it will produce a negative percentage, which indicates a decrease.

Can I use decimals for the original and new values?
Yes, the calculation works the same for decimal values.

Is percentage increase the same as percent change?
Not always; percent change can be increase or decrease, while percentage increase focuses on growth.

Where is percentage increase used in real life?
It is used for price rises, salary increases, growth rates, and comparing performance over time.

## 9. Structured Data (JSON-LD Bundle) — REQUIRED
### 9.1 WebPage (Required)
```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Percentage Increase Calculator",
  "url": "https://calchowmuch.com/percentage-calculators/percentage-increase/",
  "description": "Calculate percentage increase from an original value to a new value instantly using our free percent increase calculator.",
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
  "name": "Percentage Increase Calculator",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/percentage-calculators/percentage-increase/",
  "description": "Free percentage increase calculator to find the percent increase from an original value to a new value using a simple formula.",
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
      "name": "What is percentage increase?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Percentage increase is how much a value has grown compared to its original value, expressed as a percentage."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate percentage increase from X to Y?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Subtract X from Y, divide by X, then multiply by 100."
      }
    },
    {
      "@type": "Question",
      "name": "What is the percentage increase formula?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The formula is ((Y − X) ÷ X) × 100."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between increase amount and percentage increase?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Increase amount is Y − X, while percentage increase compares that change to the original value."
      }
    },
    {
      "@type": "Question",
      "name": "Can percentage increase be more than 100%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, if the increase is larger than the original value, the percentage increase exceeds 100%."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the original value is zero?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Percentage increase is undefined because you cannot divide by zero."
      }
    },
    {
      "@type": "Question",
      "name": "What if the new value is smaller than the original value?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Then the result is not an increase; it will produce a negative percentage, which indicates a decrease."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use decimals for the original and new values?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, the calculation works the same for decimal values."
      }
    },
    {
      "@type": "Question",
      "name": "Is percentage increase the same as percent change?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Not always; percent change can be increase or decrease, while percentage increase focuses on growth."
      }
    },
    {
      "@type": "Question",
      "name": "Where is percentage increase used in real life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is used for price rises, salary increases, growth rates, and comparing performance over time."
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
      "name": "Percentage Increase",
      "item": "https://calchowmuch.com/percentage-calculators/percentage-increase/"
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
| Unit (increase + percent increase logic) | ✅ |
| ISS-001 (UI rules / layout regression) | ✅ |
| E2E | ✅ |
| SEO P1 → P5 | ✅ |

## 12. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

## 13. Acceptance Criteria

Correct percent increase for decimals and large values

Clear error handling when original value (X) = 0

One intent, one result (increase-focused)

Explanation pane crawlable and matches universal standard

JSON-LD valid and page-scoped

Visible FAQs match FAQPage JSON-LD exactly

Sitemap updated and page discoverable

All tests passing with no P0 failures

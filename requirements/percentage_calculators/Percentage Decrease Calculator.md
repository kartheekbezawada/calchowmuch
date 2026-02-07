# REQ — Percentage Decrease Calculator (SERP-Ready)

Calculator Group: Percentage Calculators
Calculator: Percentage Decrease
Primary Question: “What is the percentage decrease from X to Y?”
Status: NEW
Type: Brand-new calculator (Percentage Calculators → Percentage Decrease)
FSM Phase: REQ
Scope: UI, Compute, Navigation, SEO, Sitemap, Testing

## 1. Purpose & Search Intent (SEO-Critical)
### 1.1 Primary User Question (Single-Question Rule)

What is the percentage decrease from original value X to new value Y?

Common use cases:

price drops and markdowns

cost reductions and savings

business KPI declines

performance decreases over time

Scope Guard: This page must not include percentage increase, combined percent change mode, “X is what % of Y,” or “X% of Y.” Only decrease intent.

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords must appear in:

H1

title

meta description

explanation copy

FAQ questions

| Keyword Type | Keywords |
| --- | --- |
| Primary | percentage decrease calculator, percentage decrease |
| Secondary | percent decrease calculator, percentage decrease formula |
| Long-Tail / Intent | how to calculate percentage decrease, percentage decrease from X to Y |

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

Display name must be exactly: “Percentage Decrease”

Navigation must be config-driven

One calculator page per intent

## 3. URL & Page Model (SEO + MVP)
### 3.1 Canonical URL
/percentage-calculators/percentage-decrease/

### 3.2 Architecture

Multi-Page Application (MPA)

One calculator per page

Full page reload

Crawlable explanation pane

## 4. Folder & File Structure
```
/public/calculators/percentage-calculators/percentage-decrease/
├── index.html          # Calculator shell + calculation pane
├── module.js           # percentage decrease logic
└── explanation.html    # Static explanation pane (SEO-critical)
```

## 5. Page Metadata (SERP-Optimized)

H1

Percentage Decrease Calculator


Title

Percentage Decrease Calculator – CalcHowMuch


Meta Description (≤160 chars)

Calculate percentage decrease from an original value to a new value instantly. Use our free percent decrease calculator and formula.


Canonical

https://calchowmuch.com/percentage-calculators/percentage-decrease/

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

Labels must clearly communicate: “Percentage decrease from X to Y”

Calculation updates on input change (or Calculate button if globally required)

Do not auto-round during typing

### 6.3 Outputs
| Output | Required | Notes |
| --- | --- | --- |
| Percentage Decrease | Yes | Display with % sign |
| Decrease Amount (X − Y) | Yes | Display numeric difference (positive when Y < X) |
| Formula Used | Yes | Show ((X − Y) ÷ X) × 100 |

## 7. Calculator Engine (Logic)
### 7.1 Authoritative Formula
Decrease Amount = X − Y
Percentage Decrease = ((X − Y) ÷ X) × 100


Where:

X = original value

Y = new value

### 7.2 Validation Rules

Prevent divide-by-zero: if X = 0, percentage decrease is undefined → show clear inline error state (no crash)

Allow decimals

Allow negative inputs (mathematically valid but can be counterintuitive; FAQ must clarify)

If Y > X, the computed result becomes negative (indicates an increase, not a decrease) → do not block, but FAQ and explanation must clarify interpretation

No unhandled exceptions

Formatting: follow site-wide output formatting rules

## 8. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

### 8.1 Summary Content (No Summary Heading Node)

A percentage decrease shows how much a value has fallen from an original amount to a new amount, expressed as a percentage of the original.

This percentage decrease calculator finds the percent decrease from X to Y by calculating the drop and dividing it by the original value, then multiplying by 100.

It is commonly used for price reductions, cost savings, KPI declines, and comparing decreases over time.

### 8.2 H3 — Scenario Summary (Dynamic Values)
| Category | Value | Source |
| --- | --- | --- |
| Original Value (X) | {ORIGINAL} | Calculation Pane |
| New Value (Y) | {NEW} | Calculation Pane |
| Decrease Amount | {DECREASE_AMOUNT} | Calculator Engine |
| Percentage Decrease | {PERCENT_DECREASE} | Calculator Engine |

### 8.3 H3 — Results Table (Dynamic Values)
| Metric | Value | Explanation |
| --- | --- | --- |
| Original Value (X) | {ORIGINAL} | Starting value |
| New Value (Y) | {NEW} | Ending value |
| Decrease Amount | {DECREASE_AMOUNT} | Change in units (X − Y) |
| Percentage Decrease | {PERCENT_DECREASE}% | Decrease relative to original |
| Formula | ((X − Y) ÷ X) × 100 | Percent decrease formula |

### 8.4 H3 — Explanation (SERP-Optimized)

To calculate percentage decrease, subtract the new value from the original value to get the decrease amount. Then divide that decrease by the original value and multiply by 100.

For example, if a value goes from 200 to 150, the decrease is 50. Dividing 50 by 200 gives 0.25, and multiplying by 100 gives a 25% decrease.

If the original value is zero, percentage decrease cannot be calculated because division by zero is not possible.

### 8.5 H3 — Frequently Asked Questions (Exactly 10)

Visible HTML FAQ content must match FAQPage JSON-LD text exactly.

What is percentage decrease?
Percentage decrease is how much a value has dropped compared to its original value, expressed as a percentage.

How do you calculate percentage decrease from X to Y?
Subtract Y from X, divide by X, then multiply by 100.

What is the percentage decrease formula?
The formula is ((X − Y) ÷ X) × 100.

What is the difference between decrease amount and percentage decrease?
Decrease amount is X − Y, while percentage decrease compares that change to the original value.

Can percentage decrease be more than 100%?
Yes, if the new value is negative and the original value is positive, the decrease can exceed 100% in magnitude.

What happens if the original value is zero?
Percentage decrease is undefined because you cannot divide by zero.

What if the new value is larger than the original value?
Then the result is negative, which indicates an increase rather than a decrease.

Can I use decimals for the original and new values?
Yes, the calculation works the same for decimal values.

Is percentage decrease the same as percent change?
Not always; percent change can be increase or decrease, while percentage decrease focuses on declines.

Where is percentage decrease used in real life?
It is used for discounts, markdowns, cost reductions, and tracking declines over time.

## 9. Structured Data (JSON-LD Bundle) — REQUIRED
### 9.1 WebPage (Required)
```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Percentage Decrease Calculator",
  "url": "https://calchowmuch.com/percentage-calculators/percentage-decrease/",
  "description": "Calculate percentage decrease from an original value to a new value instantly using our free percent decrease calculator.",
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
  "name": "Percentage Decrease Calculator",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/percentage-calculators/percentage-decrease/",
  "description": "Free percentage decrease calculator to find the percent decrease from an original value to a new value using a simple formula.",
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
      "name": "What is percentage decrease?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Percentage decrease is how much a value has dropped compared to its original value, expressed as a percentage."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate percentage decrease from X to Y?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Subtract Y from X, divide by X, then multiply by 100."
      }
    },
    {
      "@type": "Question",
      "name": "What is the percentage decrease formula?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The formula is ((X − Y) ÷ X) × 100."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between decrease amount and percentage decrease?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Decrease amount is X − Y, while percentage decrease compares that change to the original value."
      }
    },
    {
      "@type": "Question",
      "name": "Can percentage decrease be more than 100%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, if the new value is negative and the original value is positive, the decrease can exceed 100% in magnitude."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the original value is zero?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Percentage decrease is undefined because you cannot divide by zero."
      }
    },
    {
      "@type": "Question",
      "name": "What if the new value is larger than the original value?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Then the result is negative, which indicates an increase rather than a decrease."
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
      "name": "Is percentage decrease the same as percent change?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Not always; percent change can be increase or decrease, while percentage decrease focuses on declines."
      }
    },
    {
      "@type": "Question",
      "name": "Where is percentage decrease used in real life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is used for discounts, markdowns, cost reductions, and tracking declines over time."
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
      "name": "Percentage Decrease",
      "item": "https://calchowmuch.com/percentage-calculators/percentage-decrease/"
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
| Unit (decrease + percent decrease logic) | ✅ |
| ISS-001 (UI rules / layout regression) | ✅ |
| E2E | ✅ |
| SEO P1 → P5 | ✅ |

## 12. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

## 13. Acceptance Criteria

Correct percent decrease for decimals and large values

Clear error handling when original value (X) = 0

One intent, one result (decrease-focused)

Explanation pane crawlable and matches universal standard

JSON-LD valid and page-scoped

Visible FAQs match FAQPage JSON-LD exactly

Sitemap updated and page discoverable

All tests passing with no P0 failures

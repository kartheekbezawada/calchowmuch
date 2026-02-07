# REQ — Percent Change Calculator (SERP-Ready)

Calculator Group: Percentage Calculators
Calculator: Percent Change
Primary Question: “What is the percent change from A to B?” (with +/− sign)
Status: NEW
Type: Brand-new calculator (Percentage Calculators → Percent Change)
FSM Phase: REQ
Scope: UI, Compute, Navigation, SEO, Sitemap, Testing

## 1. Purpose & Search Intent (SEO-Critical)
### 1.1 Primary User Question (Single-Question Rule)

What is the percent change from A (original) to B (new), including whether it is an increase or decrease?

Common use cases:
- Price movement tracking
- KPIs and business metrics
- Salary changes (up or down)
- Grades / Scores comparisons
- Month-over-month / Year-over-year change

Scope Guard: This page is specifically “percent change” (increase or decrease with sign). It must not include separate modes for “X% of Y” or “X is what % of Y.” It may reference increase/decrease conceptually but must remain one percent-change tool.

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords must appear in:

H1
title
meta description
explanation copy
FAQ questions

| Keyword Type | Keywords |
| --- | --- |
| Primary | percent change calculator, percent change |
| Secondary | percentage change calculator, percent difference from A to B |
| Long-Tail / Intent | how to calculate percent change, percent change formula, percent change from A to B |

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
└── Percent Change
```


#### Rules

Display name must be exactly: “Percent Change”

Navigation must be config-driven

One calculator page per intent

## 3. URL & Page Model (SEO + MVP)
### 3.1 Canonical URL
/percentage-calculators/percent-change/

### 3.2 Architecture

Multi-Page Application (MPA)

One calculator per page

Full page reload

Crawlable explanation pane

## 4. Folder & File Structure
```
/public/calculators/percentage-calculators/percent-change/
├── index.html          # Calculator shell + calculation pane
├── module.js           # percent change logic (+/−)
└── explanation.html    # Static explanation pane (SEO-critical)
```

## 5. Page Metadata (SERP-Optimized)

H1

Percent Change Calculator


Title

Percent Change Calculator – CalcHowMuch


Meta Description (≤160 chars)

Calculate percent change from A to B with the correct +/− sign. Use our free percentage change calculator and formula instantly.


Canonical

https://calchowmuch.com/percentage-calculators/percent-change/

## 6. Calculation Pane Requirements
### 6.1 Heading

H2: Percent Change Calculator

### 6.2 Inputs (Above the Fold)
| Section | Input | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Core | Original Value (A) | Number | Yes | Allow decimals; negative allowed (see validation rules) |
| Core | New Value (B) | Number | Yes | Allow decimals; negative allowed (see validation rules) |

#### UI Rules

- No dropdowns
- No optional inputs
- Labels must clearly communicate: “Percent change from A to B”
- Calculation updates on input change (or Calculate button if globally required)
- Do not auto-round during typing

### 6.3 Outputs
| Output | Required | Notes |
| --- | --- | --- |
| Percent Change (with sign) | Yes | Must display “+” for increase, “−” for decrease, “0%” for no change |
| Change Amount (B − A) | Yes | Numeric difference (can be negative) |
| Direction Label | Yes | “Increase”, “Decrease”, or “No change” derived from sign |
| Formula Used | Yes | Show ((B − A) ÷ A) × 100 |

## 7. Calculator Engine (Logic)
### 7.1 Authoritative Formula
Change Amount = B − A
Percent Change = ((B − A) ÷ A) × 100


Sign rules:

If B > A → positive → show “+{value}%” and label “Increase”

If B < A → negative → show “−{value}%” and label “Decrease”

If B = A → “0%” and label “No change”

### 7.2 Validation Rules

Prevent divide-by-zero: if A = 0, percent change is undefined → show clear inline error state (no crash)

Allow decimals

Allow negative inputs (mathematically valid; explanation/FAQ must clarify)

No unhandled exceptions

Formatting must follow your site-wide output rules

## 8. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

### 8.1 H2 — Summary (Keyword-Dense, Natural)

Percent change shows how much a value has increased or decreased from an original amount to a new amount, expressed as a percentage of the original.

This percent change calculator computes the percentage change from A to B using the difference between the values and includes the correct + or − sign to indicate direction.

It is commonly used for prices, KPIs, growth rates, and tracking change over time.

### 8.2 H3 — Scenario Summary (Dynamic Values)
| Category | Value | Source |
| --- | --- | --- |
| Original Value (A) | {ORIGINAL} | Calculation Pane |
| New Value (B) | {NEW} | Calculation Pane |
| Change Amount | {CHANGE_AMOUNT} | Calculator Engine |
| Percent Change | {PERCENT_CHANGE_SIGNED} | Calculator Engine |
| Direction | {DIRECTION} | Calculator Engine |

### 8.3 H3 — Results Table (Dynamic Values)
| Metric | Value | Explanation |
| --- | --- | --- |
| Original Value (A) | {ORIGINAL} | Starting value |
| New Value (B) | {NEW} | Ending value |
| Change Amount | {CHANGE_AMOUNT} | Difference (B − A) |
| Percent Change | {PERCENT_CHANGE_SIGNED} | Percentage change with +/− sign |
| Direction | {DIRECTION} | Increase, decrease, or no change |
| Formula | ((B − A) ÷ A) × 100 | Percent change formula |

### 8.4 H3 — Explanation (SERP-Optimized)

To calculate percent change, subtract the original value from the new value to get the change amount. Then divide that change by the original value and multiply by 100.

If the result is positive, it is an increase and should be shown with a plus sign. If the result is negative, it is a decrease and should be shown with a minus sign.

For example, a change from 50 to 60 is a change of 10. Dividing 10 by 50 gives 0.2, and multiplying by 100 gives a +20% percent change.

If the original value is zero, percent change cannot be calculated because division by zero is not possible.

### 8.5 H3 — Frequently Asked Questions (Exactly 10)

Visible HTML FAQ content must match FAQPage JSON-LD text exactly.

What is percent change?
Percent change is the percentage increase or decrease from an original value to a new value.

How do you calculate percent change from A to B?
Subtract A from B, divide by A, then multiply by 100.

What is the percent change formula?
The formula is ((B − A) ÷ A) × 100.

Why does percent change include a plus or minus sign?
The sign shows whether the change is an increase or a decrease.

What does a negative percent change mean?
A negative percent change means the new value is lower than the original value.

Can percent change be greater than 100%?
Yes, if the change is larger than the original value, the percent change can exceed 100%.

What happens if the original value is zero?
Percent change is undefined because you cannot divide by zero.

Can I use decimals for A and B?
Yes, percent change works the same for decimal values.

Is percent change the same as percentage increase?
No, percentage increase only applies when the value goes up, while percent change can be increase or decrease.

Where is percent change used in real life?
It is used for tracking prices, KPIs, growth rates, and changes over time.

## 9. Structured Data (JSON-LD Bundle) — REQUIRED
### 9.1 WebPage (Required)
```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Percent Change Calculator",
  "url": "https://calchowmuch.com/percentage-calculators/percent-change/",
  "description": "Calculate percent change from A to B with the correct +/− sign using our free percentage change calculator.",
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
  "name": "Percent Change Calculator",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/percentage-calculators/percent-change/",
  "description": "Free percent change calculator to find the percentage change from an original value to a new value with the correct +/− sign.",
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
      "name": "What is percent change?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Percent change is the percentage increase or decrease from an original value to a new value."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate percent change from A to B?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Subtract A from B, divide by A, then multiply by 100."
      }
    },
    {
      "@type": "Question",
      "name": "What is the percent change formula?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The formula is ((B − A) ÷ A) × 100."
      }
    },
    {
      "@type": "Question",
      "name": "Why does percent change include a plus or minus sign?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The sign shows whether the change is an increase or a decrease."
      }
    },
    {
      "@type": "Question",
      "name": "What does a negative percent change mean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A negative percent change means the new value is lower than the original value."
      }
    },
    {
      "@type": "Question",
      "name": "Can percent change be greater than 100%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, if the change is larger than the original value, the percent change can exceed 100%."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the original value is zero?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Percent change is undefined because you cannot divide by zero."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use decimals for A and B?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, percent change works the same for decimal values."
      }
    },
    {
      "@type": "Question",
      "name": "Is percent change the same as percentage increase?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, percentage increase only applies when the value goes up, while percent change can be increase or decrease."
      }
    },
    {
      "@type": "Question",
      "name": "Where is percent change used in real life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is used for tracking prices, KPIs, growth rates, and changes over time."
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
      "name": "Percent Change",
      "item": "https://calchowmuch.com/percentage-calculators/percent-change/"
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
| Unit (percent change logic + sign) | ✅ |
| ISS-001 (UI rules / layout regression) | ✅ |
| E2E | ✅ |
| SEO P1 → P5 | ✅ |

## 12. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

## 13. Acceptance Criteria

Correct signed percent change for increases and decreases

“+” sign for positive, “−” sign for negative, “0%” for no change

Clear error handling when original value (A) = 0

One intent, one result (percent change with sign)

Explanation pane crawlable and matches universal standard

JSON-LD valid and page-scoped

Visible FAQs match FAQPage JSON-LD exactly

Sitemap updated and page discoverable

All tests passing with no P0 failures

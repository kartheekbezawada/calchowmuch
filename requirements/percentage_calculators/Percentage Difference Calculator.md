### 1.1 Primary User Question (Single-Question Rule)

What is the percentage difference between two values A and B, using a symmetric baseline?

This calculator measures how far apart two values are without choosing a direction (no “increase” or “decrease” framing). It is commonly used for:

comparing measurements, experimental results, or estimates

comparing prices or quotes when neither is treated as the original

error analysis and tolerance checks

symmetric comparisons where order should not matter

Scope Guard: This page must not be a “percent change” tool (which uses A as the original). It must not include percent increase/decrease modes or other percentage tools.

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords must appear in:

H1

title

meta description

explanation copy

FAQ questions

| Keyword Type | Keywords |
| --- | --- |
| Primary | percentage difference calculator, percentage difference |
| Secondary | percent difference calculator, percentage difference formula |
| Long-Tail / Intent | how to calculate percentage difference, percentage difference between two numbers, symmetric percent difference |

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
├── Reverse Percentage
└── Percentage Difference
```


#### Rules

Display name must be exactly: “Percentage Difference”

Navigation must be config-driven

One calculator page per intent

## 3. URL & Page Model (SEO + MVP)
### 3.1 Canonical URL
/percentage-calculators/percentage-difference/

### 3.2 Architecture

Multi-Page Application (MPA)

One calculator per page

Full page reload

Crawlable explanation pane

## 4. Folder & File Structure
```
/public/calculators/percentage-calculators/percentage-difference/
├── index.html          # Calculator shell + calculation pane
├── module.js           # percentage difference logic (symmetric)
└── explanation.html    # Static explanation pane (SEO-critical)
```

## 5. Page Metadata (SERP-Optimized)

H1

Percentage Difference Calculator


Title

Percentage Difference Calculator – CalcHowMuch


Meta Description (≤160 chars)

Calculate percentage difference between two values using a symmetric formula based on their average. Free percent difference calculator.


Canonical

https://calchowmuch.com/percentage-calculators/percentage-difference/

## 6. Calculation Pane Requirements
### 6.1 Heading

H2: Percentage Difference Calculator

### 6.2 Inputs (Above the Fold)
| Section | Input | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Core | Value A | Number | Yes | Allow decimals; negatives allowed |
| Core | Value B | Number | Yes | Allow decimals; negatives allowed |

#### UI Rules

No dropdowns

No optional inputs

Labels must clearly communicate: “Percentage difference between A and B”

Calculation updates on input change (or Calculate button if globally required)

Do not auto-round during typing

### 6.3 Outputs
| Output | Required | Notes |
| --- | --- | --- |
| Percentage Difference | Yes | Non-negative percent (symmetric); display with % sign |
| Absolute Difference \|A − B\| | Yes | Positive magnitude difference |
| Average Baseline ( ( \| A \| + \| |  |  |
| Formula Used | Yes | Show `( |

## 7. Calculator Engine (Logic)
### 7.1 Authoritative Formula (Symmetric Average Baseline)

To ensure the result is symmetric (A vs B same as B vs A) and non-negative:

Absolute Difference = |A − B|
Average Baseline = (|A| + |B|) ÷ 2
Percentage Difference = (Absolute Difference ÷ Average Baseline) × 100

### 7.2 Validation Rules

Prevent divide-by-zero: if Average Baseline = 0 (i.e., A = 0 and B = 0), percentage difference is undefined → show clear inline error state (no crash)

Accept decimals

Accept negatives (use absolute values in baseline as specified)

No unhandled exceptions

Formatting must follow site-wide output rules

## 8. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

### 8.1 H2 — Summary (Keyword-Dense, Natural)

Percentage difference shows how far apart two values are as a percentage of their average. It is a symmetric comparison, meaning swapping A and B gives the same result.

This percentage difference calculator uses the absolute difference between A and B and divides it by the average of their magnitudes, then multiplies by 100.

It is commonly used when neither value should be treated as the original, such as comparing measurements, estimates, or two prices.

### 8.2 H3 — Scenario Summary (Dynamic Values)
| Category | Value | Source |
| --- | --- | --- |
| Value A | {A} | Calculation Pane |
| Value B | {B} | Calculation Pane |
| Absolute Difference | {ABS_DIFF} | Calculator Engine |
| Average Baseline | {AVG_BASELINE} | Calculator Engine |
| Percentage Difference | {PCT_DIFF} | Calculator Engine |

### 8.3 H3 — Results Table (Dynamic Values)
| Metric | Value | Explanation |
| --- | --- | --- |
| Value A | {A} | First value |
| Value B | {B} | Second value |
| Absolute Difference | {ABS_DIFF} | Magnitude of difference \|A − B\| |
| Average Baseline | {AVG_BASELINE} | ( |
| Percentage Difference | {PCT_DIFF}% | Symmetric percent difference |
| Formula | `( \| A − B |  |

### 8.4 H3 — Explanation (SERP-Optimized)

To calculate percentage difference, first take the absolute difference between the two values. Then compute the average baseline using the average of their absolute values. Finally, divide the absolute difference by the average baseline and multiply by 100.

For example, if A is 80 and B is 100, the absolute difference is 20. The average baseline is (80 + 100) ÷ 2 = 90. The percentage difference is (20 ÷ 90) × 100 ≈ 22.22%.

If both values are zero, the average baseline is zero and the percentage difference cannot be calculated.

### 8.5 H3 — Frequently Asked Questions (Exactly 10)

Visible HTML FAQ content must match FAQPage JSON-LD text exactly.

What is percentage difference?
Percentage difference compares two values as a percentage of their average.

How do you calculate percentage difference between A and B?
Take |A − B|, divide by the average of |A| and |B|, then multiply by 100.

What is the percentage difference formula?
The formula is (|A − B| ÷ ((|A| + |B|) ÷ 2)) × 100.

Why is percentage difference symmetric?
Because it uses the absolute difference and an average baseline, so swapping A and B gives the same result.

How is percentage difference different from percent change?
Percent change uses an original value as the baseline, while percentage difference uses the average of both values.

Can percentage difference be greater than 100%?
Yes, if the difference is larger than the average baseline, the result can exceed 100%.

What happens if A and B are both zero?
The result is undefined because the average baseline is zero.

Can I use negative numbers?
Yes, the calculation works with negatives by using absolute values in the baseline.

Is percentage difference always positive?
Yes, it is non-negative because it uses the absolute difference.

Where is percentage difference used in real life?
It is used for comparing measurements, estimates, prices, and experimental results when neither is the original.

## 9. Structured Data (JSON-LD Bundle) — REQUIRED
### 9.1 WebPage (Required)
```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Percentage Difference Calculator",
  "url": "https://calchowmuch.com/percentage-calculators/percentage-difference/",
  "description": "Calculate percentage difference between two values using a symmetric formula based on their average.",
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
  "name": "Percentage Difference Calculator",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/percentage-calculators/percentage-difference/",
  "description": "Free percentage difference calculator to compare two values using a symmetric percent difference formula based on their average.",
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
      "name": "What is percentage difference?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Percentage difference compares two values as a percentage of their average."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate percentage difference between A and B?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Take |A − B|, divide by the average of |A| and |B|, then multiply by 100."
      }
    },
    {
      "@type": "Question",
      "name": "What is the percentage difference formula?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The formula is (|A − B| ÷ ((|A| + |B|) ÷ 2)) × 100."
      }
    },
    {
      "@type": "Question",
      "name": "Why is percentage difference symmetric?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Because it uses the absolute difference and an average baseline, so swapping A and B gives the same result."
      }
    },
    {
      "@type": "Question",
      "name": "How is percentage difference different from percent change?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Percent change uses an original value as the baseline, while percentage difference uses the average of both values."
      }
    },
    {
      "@type": "Question",
      "name": "Can percentage difference be greater than 100%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, if the difference is larger than the average baseline, the result can exceed 100%."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if A and B are both zero?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The result is undefined because the average baseline is zero."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use negative numbers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, the calculation works with negatives by using absolute values in the baseline."
      }
    },
    {
      "@type": "Question",
      "name": "Is percentage difference always positive?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, it is non-negative because it uses the absolute difference."
      }
    },
    {
      "@type": "Question",
      "name": "Where is percentage difference used in real life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is used for comparing measurements, estimates, prices, and experimental results when neither is the original."
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
      "name": "Percentage Difference",
      "item": "https://calchowmuch.com/percentage-calculators/percentage-difference/"
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
| Unit (symmetric percent difference logic) | ✅ |
| ISS-001 (UI rules / layout regression) | ✅ |
| E2E | ✅ |
| SEO P1 → P5 | ✅ |

## 12. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

## 13. Acceptance Criteria

Symmetric result: A vs B equals B vs A

Non-negative percentage difference output

Clear error handling when A = 0 and B = 0 (baseline zero)

One intent, one result (percentage difference only)

Explanation pane crawlable and matches universal standard

JSON-LD valid and page-scoped

Visible FAQs match FAQPage JSON-LD exactly

Sitemap updated and page discoverable

All tests passing with no P0 failures

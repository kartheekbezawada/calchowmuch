# REQ — Find Percentage of a Number Calculator (SERP-Ready)

Calculator Group: Percentage Calculators
Calculator: Percentage of a Number
Primary Question: “What is X% of Y?”
Status: NEW
Type: Brand-new calculator (Percentage Calculators → Find Percentage of a Number)
FSM Phase: REQ
Scope: UI, Compute, Navigation, SEO, Sitemap, Testing

## 1. Purpose & Search Intent (SEO-Critical)
### 1.1 Primary User Question (Single-Question Rule)

What is X% of Y?

This page answers one focused, high-intent question commonly used by:

students

shoppers (discounts)

budgeting and personal finance users

everyday math users

Scope Guard: This page must not include percentage increase/decrease, reverse percentages, “X is what % of Y,” or any other percentage tools.

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords must be explicitly supported in:

H1

title

meta description

explanation copy

FAQ questions

| Keyword Type | Keywords |
| --- | --- |
| Primary | Find Percentage of a Number, what is X% of Y |
| Secondary | percent of a number calculator, calculate percentage |
| Long-Tail / Intent | how to calculate X percent of Y, percentage calculation example |

## 2. Category & Navigation Requirements
### 2.1 Top-Level Category

Top navigation display name: Percentage Calculators

Category is treated as its own top-level group (not under Math)

### 2.2 Left Navigation Structure
```
Percentage Calculators
└── Find Percentage of a Number
```


#### Rules

Display name must be exactly: “Find Percentage of a Number”

Navigation must be config-driven

One calculator page per intent (no merged tools)

## 3. URL & Page Model (SEO + MVP)
### 3.1 Canonical URL
/percentage-calculators/percentage-of-a-number/

### 3.2 Architecture

Multi-Page Application (MPA)

One calculator per page

Full page reload

Crawlable explanation pane

## 4. Folder & File Structure
```
/public/calculators/percentage-calculators/percentage-of-a-number/
├── index.html          # Calculator shell + calculation pane
├── module.js           # % of a number logic
└── explanation.html    # Static explanation pane (SEO-critical)
```

## 5. Calculation Pane Requirements
### 5.1 Heading

H2: Find Percentage of a Number Calculator

### 5.2 Inputs (Above the Fold)
| Section | Input | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Core | Percentage (X) | Number | Yes | Allow decimals (e.g., 12.5) |
| Core | Number (Y) | Number | Yes | Allow negative values |

#### UI Rules

No dropdowns

No optional inputs

Labels must clearly communicate the intent: “What is X% of Y?”

Calculation must update on input change (or Calculate button if globally required by your UI standard)

Must support decimal entry without rounding the input during typing

### 5.3 Outputs
| Output | Required | Notes |
| --- | --- | --- |
| Result (X% of Y) | Yes | Display as a number; formatting rule applied consistently across site |
| Formula Used | Yes | Show (X ÷ 100) × Y |

## 6. Calculator Engine (Logic)
### 6.1 Authoritative Formula
Result = (X ÷ 100) × Y


Where:

X = percentage input

Y = number input

### 6.2 Validation Rules

Accept X = 0 and Y = 0

Accept negative X and/or negative Y

Accept decimal X and decimal Y

No divide-by-zero scenario exists for this formula, but input parsing must not throw

No unhandled exceptions

## 7. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly (layout, headings, table semantics, boxed FAQ styling rules).

### 7.1 H2 — Summary (Keyword-Dense, Natural)

The percentage of a number calculation shows how much a given percentage represents out of a total value.

This calculator answers the question “What is X% of Y?” by converting the percentage into a fraction of 100 and multiplying it by the number.

Percentage calculations are widely used for discounts, taxes, interest, grades, and everyday comparisons.

### 7.2 H3 — Scenario Summary (Dynamic Values)
| Category | Value | Source |
| --- | --- | --- |
| Percentage | {PERCENT} | Calculation Pane |
| Number | {NUMBER} | Calculation Pane |
| Result | {RESULT} | Calculator Engine |

### 7.3 H3 — Results Table (Dynamic Values)
| Metric | Value | Explanation |
| --- | --- | --- |
| Percentage | {PERCENT}% | Portion applied |
| Base Number | {NUMBER} | Total value |
| Result | {RESULT} | X percent of Y |
| Formula | (X ÷ 100) × Y | Percentage formula |

### 7.4 H3 — Explanation (SERP-Optimized)

To calculate the percentage of a number, divide the percentage by 100 to convert it into a decimal, then multiply it by the number.

For example, calculating 20% of 50 means multiplying 50 by 0.20, which equals 10.

This method works for whole numbers, decimals, values greater than 100%, and negative numbers.

### 7.5 H3 — Frequently Asked Questions (Exactly 10)

Visible HTML FAQ content must match FAQPage JSON-LD text exactly.

What does percentage of a number mean?
It means calculating how much a given percentage represents out of a total value.

How do you calculate X% of Y?
Divide X by 100 and multiply the result by Y.

What is the formula for percentage of a number?
The formula is (X ÷ 100) × Y.

Can percentages be greater than 100%?
Yes, percentages greater than 100% represent values larger than the original number.

Can the number be negative?
Yes, percentage calculations work with negative numbers.

Can percentages include decimals?
Yes, percentages can include decimal values such as 2.5% or 12.75%.

Is this calculator accurate for large numbers?
Yes, it accurately calculates percentages for both small and large numbers.

How are percentages used in real life?
Percentages are used for discounts, taxes, interest rates, grades, and financial comparisons.

What is 0% of a number?
Zero percent of any number is always zero.

Why do we divide by 100 in percentage calculations?
Because a percentage represents a fraction out of 100.

## 8. SEO Requirements (Top-Ranking Focus)
### 8.1 Metadata (Keyword-Optimized)

H1: Find Percentage of a NumberCalculator

Title: Find Percentage of a Number Calculator – CalcHowMuch

Meta Description: Calculate what X% of Y is instantly. Use our free Find Percentage of a Number calculator for fast, accurate results.

Canonical URL: https://calchowmuch.com/percentage-calculators/percentage-of-a-number/

## 9. Structured Data (JSON-LD Bundle) — REQUIRED
### 9.1 WebPage (Required)
```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Find Percentage of a Number Calculator",
  "url": "https://calchowmuch.com/percentage-calculators/find-percentage-of-a-number/",
  "description": "Calculate what X% of Y is instantly using our free Find Percentage of a Number calculator.",
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
  "name": "Find Percentage of a Number Calculator",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/percentage-calculators/find-percentage-of-a-number/",
  "description": "Free calculator to find what X percent of Y is using a simple percentage formula.",
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
      "name": "What does percentage of a number mean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It means calculating how much a given percentage represents out of a total value."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate X% of Y?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Divide X by 100 and multiply the result by Y."
      }
    },
    {
      "@type": "Question",
      "name": "What is the formula for percentage of a number?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The formula is (X ÷ 100) × Y."
      }
    },
    {
      "@type": "Question",
      "name": "Can percentages be greater than 100%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, percentages greater than 100% represent values larger than the original number."
      }
    },
    {
      "@type": "Question",
      "name": "Can the number be negative?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, percentage calculations work with negative numbers."
      }
    },
    {
      "@type": "Question",
      "name": "Can percentages include decimals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, percentages can include decimal values such as 2.5% or 12.75%."
      }
    },
    {
      "@type": "Question",
      "name": "Is this calculator accurate for large numbers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, it accurately calculates percentages for both small and large numbers."
      }
    },
    {
      "@type": "Question",
      "name": "How are percentages used in real life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Percentages are used for discounts, taxes, interest rates, grades, and financial comparisons."
      }
    },
    {
      "@type": "Question",
      "name": "What is 0% of a number?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Zero percent of any number is always zero."
      }
    },
    {
      "@type": "Question",
      "name": "Why do we divide by 100 in percentage calculations?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Because a percentage represents a fraction out of 100."
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
      "name": "Percentage of a Number",
      "item": "https://calchowmuch.com/percentage-calculators/find-percentage-of-a-number/"
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
| Unit (percentage logic) | ✅ |
| ISS-001 (UI rules / layout regression) | ✅ |
| E2E | ✅ |
| SEO P1 → P5 | ✅ |

## 12. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

## 13. Acceptance Criteria

Correct results for decimals, negatives, and large values

One intent, one result

Explanation pane crawlable and matches universal standard

JSON-LD bundle valid and page-scoped

Visible FAQs match FAQPage JSON-LD exactly

Sitemap updated and page discoverable

All tests passing with no P0 failures

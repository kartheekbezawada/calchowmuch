# REQ — What Percent Is X of Y Calculator (SERP-Ready)

Calculator Group: Percentage Calculators
Calculator: What Percent Is X of Y
Primary Question: “X is what % of Y?”
Status: NEW
Type: Brand-new calculator (Percentage Calculators → What Percent Is X of Y)
FSM Phase: REQ
Scope: UI, Compute, Navigation, SEO, Sitemap, Testing

## 1. Purpose & Search Intent (SEO-Critical)
### 1.1 Primary User Question (Single-Question Rule)

X is what percent of Y?

This page answers one focused, high-intent percentage question used by:

students (ratio-to-percent problems)

shoppers comparing discounts and values

budgeting/finance users comparing parts to totals

everyday math users

Scope Guard: This page must not include “X% of Y”, increase/decrease %, or reverse calculators beyond this one question.

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords must be explicitly supported in:

H1

title

meta description

explanation copy

FAQ questions

| Keyword Type | Keywords |
| --- | --- |
| Primary | what percent is X of Y, X is what percent of Y |
| Secondary | percent of calculator, percentage of a number reverse |
| Long-Tail / Intent | how to find what percent X is of Y, convert fraction to percent |

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

Display name must be exactly: “What Percent Is X of Y”

Navigation must be config-driven

One calculator page per intent

## 3. URL & Page Model (SEO + MVP)
### 3.1 Canonical URL
/percentage-calculators/what-percent-is-x-of-y/

### 3.2 Architecture

Multi-Page Application (MPA)

One calculator per page

Full page reload

Crawlable explanation pane

## 4. Folder & File Structure
```
/public/calculators/percentage-calculators/what-percent-is-x-of-y/
├── index.html          # Calculator shell + calculation pane
├── module.js           # what-percent logic
└── explanation.html    # Static explanation pane (SEO-critical)
```

## 5. Calculation Pane Requirements
### 5.1 Heading

No inner H2 inside the calculation pane. Use only the page-level H1 title.

### 5.2 Inputs (Above the Fold)
| Section | Input | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Core | Part (X) | Number | Yes | Allow decimals; negative allowed |
| Core | Whole / Total (Y) | Number | Yes | Allow decimals; negative allowed |

#### UI Rules

No dropdowns

No optional inputs

Labels must clearly communicate the intent: “X is what % of Y?”

Calculation updates on input change (or Calculate button if globally required)

Do not auto-round during typing

### 5.3 Outputs
| Output | Required | Notes |
| --- | --- | --- |
| Result Percentage | Yes | Display as percent with % sign |
| Formula Used | Yes | Show (X ÷ Y) × 100 |
| Ratio (Optional Display) | No | Only if you have a universal pattern; otherwise omit |

## 6. Calculator Engine (Logic)
### 6.1 Authoritative Formula
Percent = (X ÷ Y) × 100


Where:

X = part

Y = whole/total

### 6.2 Validation Rules

Prevent divide-by-zero: if Y = 0, show a clear inline error state (no crash)

Accept decimals

Accept negatives

No unhandled exceptions

Output formatting: keep consistent with site rules (e.g., trim trailing zeros; cap display decimals per your standard)

## 7. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

### 7.1 Summary Content (No Summary Heading Node)

The “what percent is X of Y” calculation tells you what percentage a part represents of a whole.

This calculator answers “X is what % of Y?” by dividing X by Y and multiplying by 100 to convert the ratio into a percentage.

This is useful for grades, completion rates, discounts, budgeting breakdowns, and comparing values.

### 7.2 H3 — Scenario Summary (Dynamic Values)
| Category | Value | Source |
| --- | --- | --- |
| Part (X) | {X} | Calculation Pane |
| Whole (Y) | {Y} | Calculation Pane |
| Result | {PERCENT_RESULT} | Calculator Engine |

### 7.3 H3 — Results Table (Dynamic Values)
| Metric | Value | Explanation |
| --- | --- | --- |
| Part (X) | {X} | Portion being compared |
| Whole (Y) | {Y} | Total value |
| Percentage | {PERCENT_RESULT}% | X as a percent of Y |
| Formula | (X ÷ Y) × 100 | Ratio-to-percent conversion |

### 7.4 H3 — Explanation (SERP-Optimized)

To find what percent X is of Y, divide X by Y to get a ratio, then multiply by 100 to convert it into a percentage.

For example, if X is 25 and Y is 200, then 25 ÷ 200 = 0.125, and 0.125 × 100 = 12.5%. That means 25 is 12.5% of 200.

If Y is zero, the percentage is undefined because you cannot divide by zero.

### 7.5 H3 — Frequently Asked Questions (Exactly 10)

Visible HTML FAQ content must match FAQPage JSON-LD text exactly.

What does “X is what percent of Y” mean?
It means finding the percentage that X represents out of Y.

How do you calculate what percent X is of Y?
Divide X by Y and multiply by 100.

What is the formula for “X is what % of Y”?
The formula is (X ÷ Y) × 100.

What happens if Y is zero?
The result is undefined because division by zero is not possible.

Can the result be greater than 100%?
Yes, if X is greater than Y, the percentage will be greater than 100%.

Can X or Y be negative?
Yes, negative values are supported, and the sign affects the percentage.

Can I use decimal numbers for X and Y?
Yes, decimals work the same way as whole numbers.

Is 50 out of 200 equal to 25%?
Yes, because (50 ÷ 200) × 100 = 25%.

How is this used in real life?
It is used for grades, progress tracking, budgeting categories, and comparing values.

Why do we multiply by 100?
Because percent means “per 100,” so multiplying by 100 converts a ratio into a percentage.

## 8. SEO Requirements (Top-Ranking Focus)
### 8.1 Metadata (Keyword-Optimized)

H1: What Percent Is X of Y Calculator

Title: What Percent Is X of Y Calculator – CalcHowMuch

Meta Description: Find what percent X is of Y instantly. Use our free “X is what % of Y” calculator with a simple ratio-to-percent formula.

Canonical URL: https://calchowmuch.com/percentage-calculators/what-percent-is-x-of-y/

## 9. Structured Data (JSON-LD Bundle) — REQUIRED
### 9.1 WebPage (Required)
```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "What Percent Is X of Y Calculator",
  "url": "https://calchowmuch.com/percentage-calculators/what-percent-is-x-of-y/",
  "description": "Find what percent X is of Y instantly using our free “X is what % of Y” calculator.",
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
  "name": "What Percent Is X of Y Calculator",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/percentage-calculators/what-percent-is-x-of-y/",
  "description": "Free calculator to find what percent X is of Y using a simple ratio-to-percent formula.",
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
      "name": "What does “X is what percent of Y” mean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It means finding the percentage that X represents out of Y."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate what percent X is of Y?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Divide X by Y and multiply by 100."
      }
    },
    {
      "@type": "Question",
      "name": "What is the formula for “X is what % of Y”?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The formula is (X ÷ Y) × 100."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if Y is zero?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The result is undefined because division by zero is not possible."
      }
    },
    {
      "@type": "Question",
      "name": "Can the result be greater than 100%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, if X is greater than Y, the percentage will be greater than 100%."
      }
    },
    {
      "@type": "Question",
      "name": "Can X or Y be negative?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, negative values are supported, and the sign affects the percentage."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use decimal numbers for X and Y?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, decimals work the same way as whole numbers."
      }
    },
    {
      "@type": "Question",
      "name": "Is 50 out of 200 equal to 25%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, because (50 ÷ 200) × 100 = 25%."
      }
    },
    {
      "@type": "Question",
      "name": "How is this used in real life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is used for grades, progress tracking, budgeting categories, and comparing values."
      }
    },
    {
      "@type": "Question",
      "name": "Why do we multiply by 100?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Because percent means “per 100,” so multiplying by 100 converts a ratio into a percentage."
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
      "name": "What Percent Is X of Y",
      "item": "https://calchowmuch.com/percentage-calculators/what-percent-is-x-of-y/"
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
| Unit (ratio-to-percent logic) | ✅ |
| ISS-001 (UI rules / layout regression) | ✅ |
| E2E | ✅ |
| SEO P1 → P5 | ✅ |

## 12. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

## 13. Acceptance Criteria

Correct percent output for decimals and negatives

Clear divide-by-zero behavior when Y = 0 (no crash)

One intent, one result

Explanation pane crawlable and matches universal standard

JSON-LD valid and page-scoped

Visible FAQs match FAQPage JSON-LD exactly

Sitemap updated and page discoverable

All tests passing with no P0 failures

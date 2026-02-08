# REQ — Margin Calculator (SERP-Ready)

Calculator Group: Percentage Calculators
Calculator: Margin Calculator
Primary Question: “What is the gross margin %?” (also outputs profit and selling price)
Status: NEW
Type: Brand-new calculator (Percentage Calculators → Margin Calculator)
FSM Phase: REQ
Scope: UI, Compute, Navigation, SEO, Sitemap, Testing

## 1. Purpose & Search Intent (SEO-Critical)
### 1.1 Primary User Question (Single-Question Rule)

This page supports one intent: gross margin, with closely-related outputs:
- Gross margin %
- Profit (amount)
- Selling price (when applicable)

To keep one intent while supporting common real-world usage, this calculator uses a mode toggle for margin scenarios.

##### Allowed Modes (same concept: gross margin)
- Cost + Price → Margin % and Profit
- Cost + Margin % → Selling Price and Profit

##### Common use cases:
- Retail / Product pricing
- Quotes and Invoicing
- Profitability checks
- Comparing product margins

Scope Guard: This page must not calculate markup % as the primary metric (markup is cost-based). Margin is price-based. Do not mix with discount/tax/percent change tools.

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords must appear in:

H1

title

meta description

explanation copy

FAQ questions

| Keyword Type | Keywords |
| --- | --- |
| Primary |margin, margin calculator, gross margin calculator |
| Secondary | gross margin percentage, profit margin calculator |
| Long-Tail / Intent | how to calculate gross margin, gross margin formula, calculate selling price from margin |

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

Display name must be exactly: “Margin Calculator”

Navigation must be config-driven

One calculator page per intent (gross margin only)

## 3. URL & Page Model (SEO + MVP)
### 3.1 Canonical URL
/percentage-calculators/margin-calculator/

### 3.2 Architecture

Multi-Page Application (MPA)

One calculator per page

Full page reload

Crawlable explanation pane

## 4. Folder & File Structure
```
/public/calculators/percentage-calculators/margin-calculator/
├── index.html          # Calculator shell + calculation pane
├── module.js           # margin logic + mode toggle
└── explanation.html    # Static explanation pane (SEO-critical)
```

## 5. Page Metadata (SERP-Optimized)

H1

Margin Calculator


Title

Margin Calculator – CalcHowMuch


Meta Description (≤160 chars)

Calculate gross margin %, profit, and selling price instantly. Use our free margin calculator with simple formulas for pricing and profit.


Canonical

https://calchowmuch.com/percentage-calculators/margin-calculator/

## 6. Calculation Pane Requirements
### 6.1 Heading

No inner H2 inside the calculation pane. Use only the page-level H1 title.

### 6.2 Mode Toggle (Required, Visible by Default)

Switch Toggle:

Cost + Price → Margin %

Cost + Margin % → Selling Price

#### Rules

Toggle is mandatory and visible by default

Switch OFF = Cost + Price mode; Switch ON = Cost + Margin % mode

Non-selected mode inputs must be hidden/disabled

Mode switch must preserve cost input where applicable unless your universal rules reset on mode change

### 6.3 Inputs (Above the Fold)
Mode A — Cost + Price → Margin % and Profit
| Section | Input | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Core | Cost (C) | Number | Yes | Allow decimals; recommended C ≥ 0 |
| Core | Selling Price (P) | Number | Yes | Allow decimals; recommended P ≥ 0 |

Mode B — Cost + Margin % → Selling Price and Profit
| Section | Input | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Core | Cost (C) | Number | Yes | Allow decimals; recommended C ≥ 0 |
| Core | Gross Margin % (G) | Number | Yes | Allow decimals; recommended range 0–99.99 |

#### UI Rules

No dropdowns

Initial prefilled result may render on page load

After input edits, recomputation must happen only on "Calculate Margin" click

No live recalculation on input change

Do not auto-round during typing

Must label margin explicitly as “gross margin % (based on selling price)”

### 6.4 Outputs (Both Modes)
| Output | Required | Notes |
| --- | --- | --- |
| Gross Margin % | Yes | Always show; in Mode B echoes input |
| Profit (Amount) | Yes | Profit = P − C |
| Selling Price (P) | Yes | In Mode A echoes input; in Mode B computed |
| Formula Used | Yes | Mode-specific formula string |

## 7. Calculator Engine (Logic)
### 7.1 Definitions (Gross Margin)

Profit = P − C

Gross Margin % = (Profit ÷ P) × 100

### 7.2 Mode A — Cost + Price → Margin %
Profit = P − C
Gross Margin % = ((P − C) ÷ P) × 100

### 7.3 Mode B — Cost + Margin % → Selling Price

Given gross margin percentage G:

Gross Margin Decimal = G ÷ 100
P = C ÷ (1 − Gross Margin Decimal)
Profit = P − C

### 7.4 Validation Rules

Prevent divide-by-zero: if P = 0 (Mode A), margin is undefined → show inline error (no crash)

Prevent divide-by-zero: if (1 − G/100) = 0 (i.e., G = 100%), selling price is undefined → show inline error (no crash)

Recommended UI validation: C ≥ 0, P ≥ 0, 0 ≤ G < 100

No unhandled exceptions

Formatting must follow site-wide output rules

## 8. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

### 8.1 Summary Content (No Summary Heading Node)

A margin calculator helps you find gross margin %, profit, and the selling price needed to reach a target margin.

Gross margin measures profit as a percentage of the selling price. This margin calculator can calculate gross margin % from cost and price, or calculate the selling price needed for a desired gross margin.

It is commonly used for pricing products, checking profitability, and planning margins in retail and business.

### 8.2 H3 — Scenario Summary (Dynamic Values)
| Category | Value | Source |
| --- | --- | --- |
| Mode | {MODE} | Calculation Pane |
| Cost (C) | {COST} | Calculation Pane |
| Selling Price (P) | {PRICE} | Input or Engine |
| Profit | {PROFIT} | Calculator Engine |
| Gross Margin % | {MARGIN_PERCENT} | Input or Engine |

### 8.3 H3 — Results Table (Dynamic Values)
| Metric | Value | Explanation |
| --- | --- | --- |
| Cost (C) | {COST} | Cost of the item |
| Selling Price (P) | {PRICE} | Price charged to customer |
| Profit | {PROFIT} | P − C |
| Gross Margin % | {MARGIN_PERCENT}% | Profit ÷ P × 100 |
| Formula | {FORMULA_USED} | Mode-specific margin formula |

### 8.4 H3 — Explanation (SERP-Optimized)

Gross margin shows how much of the selling price is profit after covering the cost. To calculate gross margin %, subtract cost from selling price to get profit, then divide profit by the selling price and multiply by 100.

For example, if cost is 60 and the selling price is 100, profit is 40 and gross margin is (40 ÷ 100) × 100 = 40%.

To find the selling price needed for a target gross margin, divide cost by (1 − margin). For example, if cost is 60 and the target margin is 40%, the selling price is 60 ÷ (1 − 0.40) = 100.

If the selling price is zero, margin cannot be calculated. If the margin is 100%, the selling price cannot be calculated because division by zero is not possible.

### 8.5 H3 — Frequently Asked Questions (Exactly 10)

Visible HTML FAQ content must match FAQPage JSON-LD text exactly.

What is gross margin?
Gross margin is profit expressed as a percentage of the selling price.

How do you calculate gross margin %?
Subtract cost from price, divide by price, then multiply by 100.

What is the gross margin formula?
The formula is ((P − C) ÷ P) × 100.

How do you calculate profit?
Profit equals selling price minus cost.

How do you calculate selling price from cost and margin %?
Divide cost by (1 − margin/100).

Is margin the same as markup?
No, margin is based on selling price, while markup is based on cost.

Can gross margin be negative?
Yes, if the selling price is lower than the cost, profit is negative and margin is negative.

What happens if the selling price is zero?
Gross margin is undefined because you cannot divide by zero.

Can margin be 100%?
A 100% margin would require zero cost or an undefined selling price in this formula.

Where is gross margin used in real life?
It is used for product pricing, profitability analysis, and business planning.

## 9. Structured Data (JSON-LD Bundle) — REQUIRED
### 9.1 WebPage (Required)
```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Margin Calculator",
  "url": "https://calchowmuch.com/percentage-calculators/margin-calculator/",
  "description": "Calculate gross margin %, profit, and selling price instantly using our free margin calculator.",
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
  "name": "Margin Calculator",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/percentage-calculators/margin-calculator/",
  "description": "Free margin calculator to compute gross margin percentage, profit, and selling price from cost and margin.",
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
      "name": "What is gross margin?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Gross margin is profit expressed as a percentage of the selling price."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate gross margin %?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Subtract cost from price, divide by price, then multiply by 100."
      }
    },
    {
      "@type": "Question",
      "name": "What is the gross margin formula?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The formula is ((P − C) ÷ P) × 100."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate profit?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Profit equals selling price minus cost."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate selling price from cost and margin %?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Divide cost by (1 − margin/100)."
      }
    },
    {
      "@type": "Question",
      "name": "Is margin the same as markup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, margin is based on selling price, while markup is based on cost."
      }
    },
    {
      "@type": "Question",
      "name": "Can gross margin be negative?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, if the selling price is lower than the cost, profit is negative and margin is negative."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the selling price is zero?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Gross margin is undefined because you cannot divide by zero."
      }
    },
    {
      "@type": "Question",
      "name": "Can margin be 100%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A 100% margin would require zero cost or an undefined selling price in this formula."
      }
    },
    {
      "@type": "Question",
      "name": "Where is gross margin used in real life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is used for product pricing, profitability analysis, and business planning."
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
      "name": "Margin Calculator",
      "item": "https://calchowmuch.com/percentage-calculators/margin-calculator/"
    }
  ]
}
</script>
```

## 10. Sitemap & Indexing

Must update:
- sitemap.xml
- /sitemap
- public/calculators/index.html

## 11. Testing Requirements
| Test | Required |
| --- | --- |
| Unit (mode A + mode B margin logic) | ✅ |
| ISS-001 (UI rules / layout regression) | ✅ |
| E2E (toggle + calculations) | ✅ |
| SEO P1 → P5 | ✅ |

## 12. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

## 13. Acceptance Criteria

- Mode toggle works and shows only relevant inputs
- Correct gross margin % and profit from cost + price
- Correct selling price from cost + margin %
- Clear error handling for P = 0 and margin = 100%
- Explanation pane crawlable and matches universal standard
- JSON-LD valid and page-scoped
- Visible FAQs match FAQPage JSON-LD exactly
- Sitemap updated and page discoverable
- All tests passing with no P0 failures

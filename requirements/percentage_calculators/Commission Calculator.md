# REQ — Commission Calculator (SERP-Ready)

Calculator Group: Percentage Calculators
Calculator: Commission Calculator
Primary Question: “How much commission do I earn on sales?” (commission % on sales; tiered optional)
Status: NEW
Type: Brand-new calculator (Percentage Calculators → Commission Calculator)
FSM Phase: REQ
Scope: UI, Compute, Navigation, SEO, Sitemap, Testing

## 1. Purpose & Search Intent (SEO-Critical)
### 1.1 Primary User Question (Single-Question Rule)

This page answers one intent: sales commission calculation, with two supported scenarios:

Flat commission % on total sales

Tiered commission (optional) where different sales portions have different rates

Common use cases:

sales roles (monthly/quarterly commission)

affiliate payouts

brokerage/agency commission estimates

quota-based commission plans

Scope Guard: This page must not include taxes, discount, markup/margin, or percent change. Only commission on sales.

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords must appear in:

H1

title

meta description

explanation copy

FAQ questions

| Keyword Type | Keywords |
| --- | --- |
| Primary | commission calculator, sales commission calculator |
| Secondary | commission percentage, calculate commission |
| Long-Tail / Intent | how to calculate commission, commission on sales, tiered commission calculator |

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

Display name must be exactly: “Commission Calculator”

Navigation must be config-driven

One calculator page per intent (commission)

## 3. URL & Page Model (SEO + MVP)
### 3.1 Canonical URL
/percentage-calculators/commission-calculator/

### 3.2 Architecture

Multi-Page Application (MPA)

One calculator per page

Full page reload

Crawlable explanation pane

## 4. Folder & File Structure
```
/public/calculators/percentage-calculators/commission-calculator/
├── index.html          # Calculator shell + calculation pane
├── module.js           # commission logic (flat + optional tiered)
└── explanation.html    # Static explanation pane (SEO-critical)
```

## 5. Page Metadata (SERP-Optimized)

H1

Commission Calculator


Title

Commission Calculator – CalcHowMuch


Meta Description (≤160 chars)

Calculate commission from sales using a flat rate or optional tiers. Free commission calculator for commission % on sales and earnings.


Canonical

https://calchowmuch.com/percentage-calculators/commission-calculator/

## 6. Calculation Pane Requirements
### 6.1 Heading

No inner H2 inside the calculation pane. Use only the page-level H1 title.

### 6.2 Mode Toggle (Required)

Switch Toggle:

Flat Commission %

Tiered Commission (Optional)

#### Rules

Flat mode is default

Tiered mode is optional but must be fully supported if enabled

Switch OFF = Flat mode; Switch ON = Tiered mode

Non-selected mode inputs must be hidden/disabled

Initial prefilled result may render on page load

After input edits, recomputation must happen only on "Calculate Commission" click

No live recalculation on input change

### 6.3 Inputs (Above the Fold)
Mode A — Flat Commission %
| Section | Input | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Core | Total Sales (S) | Number | Yes | Allow decimals; recommended S ≥ 0 |
| Core | Commission Rate % (R) | Number | Yes | Allow decimals; recommended R ≥ 0 |

Mode B — Tiered Commission (Optional)

Tiered commission uses one sales input plus tier rows.

| Section | Input | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Core | Total Sales (S) | Number | Yes | Allow decimals; recommended S ≥ 0 |
| Tier Rows | Tier Threshold + Rate | Repeating rows | Yes | Up to N tiers (recommend 3–6) |

Tier Row Model (each row)

Tier “Up to” amount (threshold) or “From–To” range (choose one standard)

Commission Rate % for that tier

Tiering Standard (recommended for simplicity)

Use “Up to” thresholds in ascending order
Example:

Up to 10,000 at 5%

Up to 25,000 at 7%

Above 25,000 at 10%

#### UI Rules

Add/Remove tier row buttons

Validate monotonic thresholds (ascending)

Do not auto-round during typing

Tier rows must use compact density: threshold + rate fields in one row block with Remove action aligned in the same row

Rows added via "Add Tier" must keep the same layout structure/class pattern as initial rows

### 6.4 Outputs (Both Modes)
| Output | Required | Notes |
| --- | --- | --- |
| Total Commission | Yes | Monetary/number output |
| Effective Commission Rate | Yes | Commission ÷ Sales × 100 |
| Breakdown (Tiered mode only) | Yes | Tier amount × tier rate for each tier |
| Formula Used | Yes | Mode-specific |

## 7. Calculator Engine (Logic)
### 7.1 Mode A — Flat Commission
Commission = S × (R ÷ 100)
Effective Rate = (Commission ÷ S) × 100

### 7.2 Mode B — Tiered Commission (Optional)

Compute per tier slice:

For each tier i:

Determine sales allocated to tier i (based on thresholds)

Tier Commission = Tier Sales × (Tier Rate ÷ 100)

Then:

Total Commission = Sum(Tier Commissions)
Effective Rate = (Total Commission ÷ S) × 100

### 7.3 Validation Rules

If S = 0: commission = 0, effective rate is undefined or 0 (choose one site-wide; recommended: show “0%” with note)

Negative values: do not crash; recommended UI validation should prevent negatives for normal use

Tier validation:

thresholds must be ascending

rates must be valid numbers

No unhandled exceptions

Formatting must follow site-wide output rules

## 8. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

### 8.1 Summary Content (No Summary Heading Node)

A commission calculator estimates how much commission you earn from sales based on a commission percentage.

This commission calculator supports a flat commission rate on total sales and an optional tiered commission plan where different sales ranges earn different rates.

It is useful for sales roles, affiliates, and anyone who needs to calculate commission earnings and effective commission rate.

### 8.2 H3 — Scenario Summary (Dynamic Values)
| Category | Value | Source |
| --- | --- | --- |
| Mode | {MODE} | Calculation Pane |
| Total Sales (S) | {SALES} | Calculation Pane |
| Commission Rate(s) | {RATES} | Calculation Pane |
| Total Commission | {COMMISSION} | Calculator Engine |
| Effective Rate | {EFFECTIVE_RATE} | Calculator Engine |

### 8.3 H3 — Results Table (Dynamic Values)
| Metric | Value | Explanation |
| --- | --- | --- |
| Total Sales | {SALES} | Sales amount used |
| Total Commission | {COMMISSION} | Total earnings from commission |
| Effective Rate | {EFFECTIVE_RATE}% | Commission ÷ Sales × 100 |
| Formula | {FORMULA_USED} | Mode-specific commission formula |

Tiered Mode Only — Breakdown Table

| Tier | Sales in Tier | Rate | Commission |
| --- | --- | --- | --- |
| {TIER_1} | {TIER_1_SALES} | {TIER_1_RATE}% | {TIER_1_COMM} |
| {TIER_2} | {TIER_2_SALES} | {TIER_2_RATE}% | {TIER_2_COMM} |
| {TIER_3} | {TIER_3_SALES} | {TIER_3_RATE}% | {TIER_3_COMM} |

(Include as many rows as configured tiers.)

### 8.4 H3 — Explanation (SERP-Optimized)

To calculate commission with a flat rate, multiply total sales by the commission percentage divided by 100.

For tiered commission, split the sales amount into ranges and apply each tier’s rate to the portion of sales in that tier. Add the tier commissions to get the total commission. The effective commission rate is total commission divided by total sales, expressed as a percentage.

### 8.5 H3 — Frequently Asked Questions (Exactly 10)

Visible HTML FAQ content must match FAQPage JSON-LD text exactly.

What is a commission calculator?
A commission calculator estimates how much commission you earn from sales using a commission rate.

How do you calculate commission from sales?
Multiply sales by the commission rate divided by 100.

What is the commission formula?
The formula is Commission = Sales × (Rate/100).

What is an effective commission rate?
It is total commission divided by total sales, expressed as a percentage.

How does tiered commission work?
Different portions of sales earn different commission rates based on tiers or ranges.

How do you calculate tiered commission?
Apply each tier rate to the sales amount in that tier and add the results.

Can commission be calculated with decimal rates like 7.5%?
Yes, decimal commission rates work the same way.

What happens if sales are zero?
Total commission is zero, and the effective rate may be shown as 0% or undefined depending on the method.

Is commission the same as profit?
No, commission is a payout based on sales, while profit depends on revenue minus costs.

Where are commission calculations used in real life?
They are used in sales compensation, affiliate programs, brokerage, and agency agreements.

## 9. Structured Data (JSON-LD Bundle) — REQUIRED
### 9.1 WebPage (Required)
```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Commission Calculator",
  "url": "https://calchowmuch.com/percentage-calculators/commission-calculator/",
  "description": "Calculate commission from sales using a flat rate or optional tiers with our free commission calculator.",
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
  "name": "Commission Calculator",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/percentage-calculators/commission-calculator/",
  "description": "Free commission calculator to compute commission earnings from sales using a commission percentage or tiered rates.",
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
      "name": "What is a commission calculator?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A commission calculator estimates how much commission you earn from sales using a commission rate."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate commission from sales?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Multiply sales by the commission rate divided by 100."
      }
    },
    {
      "@type": "Question",
      "name": "What is the commission formula?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The formula is Commission = Sales × (Rate/100)."
      }
    },
    {
      "@type": "Question",
      "name": "What is an effective commission rate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is total commission divided by total sales, expressed as a percentage."
      }
    },
    {
      "@type": "Question",
      "name": "How does tiered commission work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Different portions of sales earn different commission rates based on tiers or ranges."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate tiered commission?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Apply each tier rate to the sales amount in that tier and add the results."
      }
    },
    {
      "@type": "Question",
      "name": "Can commission be calculated with decimal rates like 7.5%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, decimal commission rates work the same way."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if sales are zero?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Total commission is zero, and the effective rate may be shown as 0% or undefined depending on the method."
      }
    },
    {
      "@type": "Question",
      "name": "Is commission the same as profit?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, commission is a payout based on sales, while profit depends on revenue minus costs."
      }
    },
    {
      "@type": "Question",
      "name": "Where are commission calculations used in real life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "They are used in sales compensation, affiliate programs, brokerage, and agency agreements."
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
      "name": "Commission Calculator",
      "item": "https://calchowmuch.com/percentage-calculators/commission-calculator/"
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
| Unit (flat + tiered commission logic) | ✅ |
| ISS-001 (UI rules / layout regression) | ✅ |
| E2E (toggle + tiers add/remove + calc) | ✅ |
| SEO P1 → P5 | ✅ |

## 12. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

## 13. Acceptance Criteria

Flat commission correct for decimals and large sales

Tiered commission correctly allocates sales across tiers

Effective rate correct in both modes

Tier validation prevents invalid threshold ordering (no crash)

Explanation pane crawlable and matches universal standard

JSON-LD valid and page-scoped

Visible FAQs match FAQPage JSON-LD exactly

Sitemap updated and page discoverable

All tests passing with no P0 failures

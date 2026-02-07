# REQ — Discount Calculator (SERP-Ready)

Calculator Group: Percentage Calculators
Calculator: Discount Calculator
Primary Question: “What is the price after X% off?” (and savings amount)
Status: NEW
Type: Brand-new calculator (Percentage Calculators → Discount Calculator)
FSM Phase: REQ
Scope: UI, Compute, Navigation, SEO, Sitemap, Testing

## 1. Purpose & Search Intent (SEO-Critical)
### 1.1 Primary User Question (Single-Question Rule)

What is the final price after a discount of X% on an original price P, and how much do I save?

Common use cases:

shopping discounts and sales

comparing offers and coupon deals

calculating savings quickly

budgeting for purchases

Scope Guard: This page must focus on “price after % off” + “savings amount.” It must not include tax/VAT, tips, markup, percent change, or reverse percentage tools.

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords must appear in:

H1

title

meta description

explanation copy

FAQ questions

| Keyword Type | Keywords |
| --- | --- |
| Primary | discount calculator, percentage discount calculator |
| Secondary | price after discount, savings calculator |
| Long-Tail / Intent | calculate price after % off, how to calculate discount price, how much do I save with X% off |

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
├── Percentage Difference
└── Discount Calculator
```


#### Rules

Display name must be exactly: “Discount Calculator”

Navigation must be config-driven

One calculator page per intent

## 3. URL & Page Model (SEO + MVP)
### 3.1 Canonical URL
/percentage-calculators/discount-calculator/

### 3.2 Architecture

Multi-Page Application (MPA)

One calculator per page

Full page reload

Crawlable explanation pane

## 4. Folder & File Structure
```
/public/calculators/percentage-calculators/discount-calculator/
├── index.html          # Calculator shell + calculation pane
├── module.js           # discount logic
└── explanation.html    # Static explanation pane (SEO-critical)
```

## 5. Page Metadata (SERP-Optimized)

H1

Discount Calculator


Title

Discount Calculator – CalcHowMuch


Meta Description (≤160 chars)

Calculate the price after X% off and your savings instantly. Use our free discount calculator for sale prices and deals.


Canonical

https://calchowmuch.com/percentage-calculators/discount-calculator/

## 6. Calculation Pane Requirements
### 6.1 Heading

H2: Discount Calculator

### 6.2 Inputs (Above the Fold)
| Section | Input | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Core | Original Price (P) | Number | Yes | Allow decimals; must be ≥ 0 for typical shopping use |
| Core | Discount Percent (X) | Number | Yes | Allow decimals; typical range 0–100 but do not hard-block >100 (see validation) |

#### UI Rules

No dropdowns

No optional inputs

Labels must clearly communicate: “Price after X% off”

Calculation updates on input change (or Calculate button if globally required)

Do not auto-round during typing

### 6.3 Outputs
| Output | Required | Notes |
| --- | --- | --- |
| Final Price (After Discount) | Yes | Display currency formatting consistent with site |
| Savings Amount | Yes | P − Final Price |
| Discount Amount | Yes | Same as savings amount (keep both only if you want both terms; otherwise show Savings Amount + label) |
| Formula Used | Yes | Show Final = P × (1 − X/100) |

## 7. Calculator Engine (Logic)
### 7.1 Authoritative Formulas
Discount Amount = P × (X ÷ 100)
Final Price = P − Discount Amount
Final Price = P × (1 − X ÷ 100)


Where:

P = original price

X = discount percent

### 7.2 Validation Rules

P must be a valid number; recommended UI validation: P ≥ 0

X must be a valid number; recommended UI validation: X ≥ 0

If X > 100, final price becomes negative; do not crash—either:

allow it (math-valid) and show negative output, or

show a warning message “Discount over 100% results in a negative price”

No unhandled exceptions

Formatting must follow site-wide output rules

## 8. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

### 8.1 H2 — Summary (Keyword-Dense, Natural)

A discount calculator shows the price after a percentage discount and how much you save compared to the original price.

This discount calculator finds the final sale price after X% off by calculating the discount amount and subtracting it from the original price.

It is useful for sales, coupons, promotions, and comparing deals quickly.

### 8.2 H3 — Scenario Summary (Dynamic Values)
| Category | Value | Source |
| --- | --- | --- |
| Original Price | {ORIGINAL_PRICE} | Calculation Pane |
| Discount Percent | {DISCOUNT_PERCENT} | Calculation Pane |
| Final Price | {FINAL_PRICE} | Calculator Engine |
| Savings Amount | {SAVINGS} | Calculator Engine |

### 8.3 H3 — Results Table (Dynamic Values)
| Metric | Value | Explanation |
| --- | --- | --- |
| Original Price | {ORIGINAL_PRICE} | Price before discount |
| Discount Percent | {DISCOUNT_PERCENT}% | Percentage off |
| Discount Amount | {DISCOUNT_AMOUNT} | Amount removed from the price |
| Final Price | {FINAL_PRICE} | Price after discount |
| Savings Amount | {SAVINGS} | Money saved |
| Formula | Final = P × (1 − X/100) | Discount formula |

### 8.4 H3 — Explanation (SERP-Optimized)

To calculate a discounted price, convert the discount percent into a decimal by dividing by 100, then multiply the original price by that discount rate to find the discount amount. Subtract the discount amount from the original price to get the final price.

For example, if an item costs 80 and it is 25% off, the discount amount is 80 × 0.25 = 20. The final price is 80 − 20 = 60, so you save 20.

If the discount percent is 0%, the final price is the same as the original price. If the discount percent is over 100%, the result becomes negative because the discount exceeds the original price.

### 8.5 H3 — Frequently Asked Questions (Exactly 10)

Visible HTML FAQ content must match FAQPage JSON-LD text exactly.

What is a discount calculator?
A discount calculator finds the final price after a percentage discount and the amount saved.

How do you calculate price after X% off?
Multiply the original price by (1 − X/100).

How do you calculate the discount amount?
Multiply the original price by X/100.

What is the discount formula?
The formula is Final = P × (1 − X/100).

How much do I save with a discount?
Savings equals the original price minus the final price.

What happens if the discount is 0%?
The final price stays the same as the original price.

Can the discount be more than 100%?
Mathematically yes, but it would produce a negative final price.

Can I use decimals like 12.5% off?
Yes, decimal discount percentages work the same way.

Is a discount the same as percent off?
Yes, percent off is another way to describe a percentage discount.

Where is a discount calculator used in real life?
It is used for shopping sales, coupons, promotions, and comparing deals.

## 9. Structured Data (JSON-LD Bundle) — REQUIRED
### 9.1 WebPage (Required)
```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Discount Calculator",
  "url": "https://calchowmuch.com/percentage-calculators/discount-calculator/",
  "description": "Calculate the price after X% off and your savings instantly using our free discount calculator.",
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
  "name": "Discount Calculator",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/percentage-calculators/discount-calculator/",
  "description": "Free discount calculator to find the final price after a percentage discount and the savings amount.",
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
      "name": "What is a discount calculator?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A discount calculator finds the final price after a percentage discount and the amount saved."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate price after X% off?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Multiply the original price by (1 − X/100)."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate the discount amount?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Multiply the original price by X/100."
      }
    },
    {
      "@type": "Question",
      "name": "What is the discount formula?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The formula is Final = P × (1 − X/100)."
      }
    },
    {
      "@type": "Question",
      "name": "How much do I save with a discount?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Savings equals the original price minus the final price."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the discount is 0%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The final price stays the same as the original price."
      }
    },
    {
      "@type": "Question",
      "name": "Can the discount be more than 100%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mathematically yes, but it would produce a negative final price."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use decimals like 12.5% off?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, decimal discount percentages work the same way."
      }
    },
    {
      "@type": "Question",
      "name": "Is a discount the same as percent off?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, percent off is another way to describe a percentage discount."
      }
    },
    {
      "@type": "Question",
      "name": "Where is a discount calculator used in real life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is used for shopping sales, coupons, promotions, and comparing deals."
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
      "name": "Discount Calculator",
      "item": "https://calchowmuch.com/percentage-calculators/discount-calculator/"
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
| Unit (discount + savings logic) | ✅ |
| ISS-001 (UI rules / layout regression) | ✅ |
| E2E | ✅ |
| SEO P1 → P5 | ✅ |

## 12. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

## 13. Acceptance Criteria

Correct final price and savings for decimals and large values

Clear handling for X = 0% and X > 100% (no crash)

One intent, one result (discount + savings only)

Explanation pane crawlable and matches universal standard

JSON-LD valid and page-scoped

Visible FAQs match FAQPage JSON-LD exactly

Sitemap updated and page discoverable

All tests passing with no P0 failures

REQ — Markup Calculator (SERP-Ready, Multi-Product + Basket / Weighted Average)

Calculator Group: Percentage Calculators
Calculator: Markup Calculator
Primary Question: “How do I calculate markup?” (cost → price with markup %, or price → markup %)
Secondary Capability: Multi-product markup + basket/weighted average markup
Status: NEW
Type: Brand-new calculator (Percentage Calculators → Markup Calculator)
FSM Phase: REQ
Scope: UI, Compute, Navigation, SEO, Sitemap, Testing

1. Purpose & Search Intent (SEO-Critical)
1.1 Primary User Question (Single-Question Rule)

This page supports one calculator intent: markup, with:

single-item markup (cost ↔ price ↔ markup %)

multi-product basket markup so users can evaluate multiple items and a combined result

These are the same business concept (markup), so they are allowed on one page with mode toggles and multi-item rows.

Common use cases:

retail pricing and product ranges

quoting and invoicing across multiple SKUs

estimating selling price from cost per item

checking markup % per item and for the total basket

weighted average markup across a set of products

Scope Guard: This page must not calculate profit margin % as the primary metric, sales tax, discount, percent change, or percentage difference. Only markup (cost-based).

1.2 Primary SEO Keywords (MANDATORY)

These keywords must appear in:

H1

title

meta description

explanation copy

FAQ questions

Keyword Type	Keywords
Primary	markup calculator, markup percentage
Secondary	calculate selling price from cost, calculate markup from cost and price
Long-Tail / Intent	how to calculate markup, markup formula, cost to price markup calculator, basket markup calculator, weighted average markup
2. Category & Navigation Requirements
2.1 Top-Level Category

Top navigation display name: Percentage Calculators
Category treated as its own top-level group

2.2 Left Navigation Structure

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



Rules

Display name must be exactly: “Markup Calculator”

Navigation must be config-driven

One calculator page per intent (markup only)

3. URL & Page Model (SEO + MVP)
3.1 Canonical URL

/percentage-calculators/markup-calculator/

3.2 Architecture

Multi-Page Application (MPA)

One calculator per page

Full page reload

Crawlable explanation pane

4. Folder & File Structure
/public/calculators/percentage-calculators/markup-calculator/
├── index.html          # Calculator shell + calculation pane
├── module.js           # markup logic + mode toggle + basket logic
└── explanation.html    # Static explanation pane (SEO-critical)

5. Page Metadata (SERP-Optimized)

H1
Markup Calculator

Title
Markup Calculator – CalcHowMuch

Meta Description (≤160 chars)
Calculate markup for one or multiple products. Get item markup %, basket markup, and weighted average markup from cost and price.

Canonical
https://calchowmuch.com/percentage-calculators/markup-calculator/

6. Calculation Pane Requirements
6.1 Heading

No inner H2 inside the calculation pane. Use only the page-level H1 title.

6.2 Mode Toggle (Required, Visible by Default)

Button Toggle (Primary):

Single Product

Multiple Products (Basket)

Within “Single Product” (Secondary toggle):

Cost → Price (given markup %)

Price → Markup % (given cost and price)

Within “Multiple Products (Basket)” (Secondary toggle):

Cost → Price (given markup % per row OR global markup %)

Price → Markup % (given cost and price per row)

Rules

Toggles are mandatory and visible by default

No dropdowns

Non-selected mode inputs must be hidden/disabled

Mode switch must preserve values where applicable (cost/price rows) unless universal rules reset

Must support adding/removing products in basket mode

6.3 Inputs (Above the Fold)
A) Single Product — Cost → Price (given markup %)
Section	Input	Type	Required	Notes
Core	Cost (C)	Number	Yes	Allow decimals; recommended C ≥ 0
Core	Markup Percent (M)	Number	Yes	Allow decimals; recommended M ≥ 0
B) Single Product — Price → Markup % (given cost and price)
Section	Input	Type	Required	Notes
Core	Cost (C)	Number	Yes	Allow decimals; recommended C ≥ 0
Core	Selling Price (P)	Number	Yes	Allow decimals; recommended P ≥ 0
C) Multiple Products (Basket) — Data Grid (Required)

Basket mode uses a repeatable product row table.

Basket Controls

Add Product Row

Remove Row

Clear All (optional if you have a universal reset)

Optional: “Apply one markup % to all rows” checkbox/toggle

Product Row Fields

Column	Field	Type	Required	Notes
1	Product Name (optional)	Text	No	For user readability only
2	Quantity (Q)	Number	Yes	Default 1; allow decimals only if you support weighted units
3	Cost (C)	Number	Yes	Per unit cost
4	Selling Price (P)	Number	Conditional	Required in “Price → Markup %” basket mode
5	Markup % (M)	Conditional	Required in “Cost → Price” basket mode unless global markup enabled	
6	Row Outputs	Computed	—	Row markup amount, row price, row totals

Basket Mode Variants (Allowed)

Basket Cost → Price

Each row has Cost + Markup % (+ optional quantity)

Selling Price per unit is computed

Basket Price → Markup %

Each row has Cost + Selling Price (+ optional quantity)

Markup % per row is computed

UI Rules (Basket)

Default rows: 3 rows (or 1 row if your universal pattern prefers minimal)

Input validation inline per row

Calculation updates on change

Do not auto-round during typing

Clear labeling: “Markup is based on cost (not selling price)”

If Quantity exists, all totals must use quantity

6.4 Outputs
Outputs — Single Product (Both Modes)
Output	Required	Notes
Markup Amount (P − C)	Yes	Currency/number
Selling Price (P)	Yes	Mode A computed; Mode B echo input
Markup Percent (based on cost)	Yes	Mode A echo input; Mode B computed
Formula Used	Yes	Mode-specific
Outputs — Multiple Products (Basket)

Per Row Outputs (Required)

Output	Required	Notes
Row Markup Amount (per unit)	Yes	P − C
Row Markup % (per unit)	Yes	((P − C) ÷ C) × 100
Row Price (per unit)	Yes	Computed in cost→price mode
Row Totals	Yes	Uses quantity: Total Cost, Total Price, Total Markup

Basket Summary Outputs (Required)

Output	Required	Notes
Total Quantity	Yes	Sum of Q
Total Cost	Yes	Σ(C × Q)
Total Selling Price	Yes	Σ(P × Q)
Total Markup Amount	Yes	Total Price − Total Cost
Basket Markup % (Weighted)	Yes	(Total Markup Amount ÷ Total Cost) × 100
Formula Used	Yes	Basket formulas

Definition Note (Basket / Weighted Average Markup)

Basket markup must be weighted by cost (and quantity), not a simple average of row percentages.

7. Calculator Engine (Logic)
7.1 Definitions (Must be consistent on page)

Single item:

Markup Amount = P − C

Markup % (on cost) = (Markup Amount ÷ C) × 100

Basket:

Row Total Cost = C × Q

Row Total Price = P × Q

Basket Total Cost = Σ(C × Q)

Basket Total Price = Σ(P × Q)

Basket Total Markup = Basket Total Price − Basket Total Cost

Basket Markup % (Weighted) = (Basket Total Markup ÷ Basket Total Cost) × 100

7.2 Single Product — Mode A (Cost → Price)

Markup Amount = C × (M ÷ 100)
Price (P) = C + Markup Amount
Price (P) = C × (1 + M ÷ 100)

7.3 Single Product — Mode B (Price → Markup %)

Markup Amount = P − C
Markup Percent (M) = ((P − C) ÷ C) × 100

7.4 Basket — Cost → Price (per row)

For each row i:

Pᵢ = Cᵢ × (1 + Mᵢ/100) (or Mglobal if enabled)

Row Total Costᵢ = Cᵢ × Qᵢ

Row Total Priceᵢ = Pᵢ × Qᵢ

Basket outputs computed via Σ totals.

7.5 Basket — Price → Markup % (per row)

For each row i:

Mᵢ = ((Pᵢ − Cᵢ) ÷ Cᵢ) × 100

Row Total Costᵢ = Cᵢ × Qᵢ

Row Total Priceᵢ = Pᵢ × Qᵢ

Basket outputs computed via Σ totals.

7.6 Validation Rules

Prevent divide-by-zero: if any row has C = 0 and you need markup % → row markup % undefined → show inline row error

Prevent divide-by-zero: if Basket Total Cost = 0 → basket markup % undefined → show clear inline error (no crash)

Recommended UI validation: C ≥ 0, P ≥ 0, M ≥ 0, Q > 0

No unhandled exceptions

Formatting must follow site-wide output rules

8. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

8.1 Summary Content (No Summary Heading Node)

A markup calculator helps you price products by adding a markup percentage to the cost, or by finding the markup percentage when you know the cost and selling price.

This markup calculator supports single-product markup and a multi-product basket so you can compare multiple items and see a weighted average markup across the total cost.

Markup is based on cost, not selling price, which makes it different from margin.

8.2 H3 — Scenario Summary (Dynamic Values)
Category	Value	Source
Mode	{MODE}	Calculation Pane
Products Count	{PRODUCT_COUNT}	Basket Grid
Total Cost	{TOTAL_COST}	Engine (Basket)
Total Price	{TOTAL_PRICE}	Engine (Basket)
Total Markup	{TOTAL_MARKUP}	Engine (Basket)
Basket Markup %	{BASKET_MARKUP_PERCENT}	Engine (Basket)

(For single mode, show single values and hide basket-only fields.)

8.3 H3 — Results Table (Dynamic Values)

Single Product Table

Metric	Value	Explanation
Cost (C)	{COST}	Base cost
Selling Price (P)	{PRICE}	Final selling price
Markup Amount	{MARKUP_AMOUNT}	P − C
Markup Percent	{MARKUP_PERCENT}%	Markup based on cost
Formula	{FORMULA_USED}	Mode-specific formula

Basket Summary Table

Metric	Value	Explanation
Products	{PRODUCT_COUNT}	Number of items in basket
Total Cost	{TOTAL_COST}	Σ(C × Q)
Total Price	{TOTAL_PRICE}	Σ(P × Q)
Total Markup	{TOTAL_MARKUP}	Total Price − Total Cost
Basket Markup %	{BASKET_MARKUP_PERCENT}%	(Total Markup ÷ Total Cost) × 100
Formula	(Total Price − Total Cost) ÷ Total Cost × 100	Weighted basket markup

(Optional: Show per-row breakdown table if your universal tables permit.)

8.4 H3 — Explanation (SERP-Optimized)

Markup is the amount added to cost to get selling price. Markup percentage is calculated relative to the cost.

For a single product, markup % can be used to calculate price from cost, or computed from cost and price.

For multiple products, basket markup uses totals so the result is weighted. Basket markup % is calculated by dividing the total markup amount (total price minus total cost) by the total cost and multiplying by 100.

If cost is zero for an item, markup % for that row cannot be calculated because division by zero is not possible.

8.5 H3 — Frequently Asked Questions (Exactly 10)

Visible HTML FAQ content must match FAQPage JSON-LD text exactly.

What is markup?
Markup is the amount added to cost to get the selling price.

How do you calculate selling price from cost and markup %?
Multiply the cost by (1 + markup/100).

How do you calculate markup % from cost and price?
Divide (price minus cost) by cost and multiply by 100.

What is basket markup?
Basket markup is the markup calculated across multiple products using total cost and total price.

How do you calculate weighted average markup?
Compute (total price minus total cost) divided by total cost, then multiply by 100.

Is basket markup the same as averaging the item markups?
No, basket markup is weighted by costs (and quantities), so it can differ from a simple average.

Can markup be negative?
Yes, if the selling price is lower than the cost, the markup is negative.

What happens if cost is zero?
Markup percent is undefined because you cannot divide by zero.

Is markup the same as profit margin?
No, markup is based on cost, while margin is based on selling price.

Where is markup used in real life?
Markup is used in retail pricing, quoting, invoicing, and setting prices for product ranges.

9. Structured Data (JSON-LD Bundle) — REQUIRED
9.1 WebPage (Required)
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Markup Calculator",
  "url": "https://calchowmuch.com/percentage-calculators/markup-calculator/",
  "description": "Calculate markup for single products or multiple products, including basket markup and weighted average markup from cost and price.",
  "inLanguage": "en"
}
</script>

9.2 SoftwareApplication (Required)
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Markup Calculator",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/percentage-calculators/markup-calculator/",
  "description": "Free markup calculator for single-item markup and multi-product basket markup, including weighted average markup from cost and price.",
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

9.3 FAQPage (Required — Exactly 10, Page-Scoped Only)
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is markup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Markup is the amount added to cost to get the selling price."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate selling price from cost and markup %?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Multiply the cost by (1 + markup/100)."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate markup % from cost and price?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Divide (price minus cost) by cost and multiply by 100."
      }
    },
    {
      "@type": "Question",
      "name": "What is basket markup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Basket markup is the markup calculated across multiple products using total cost and total price."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate weighted average markup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Compute (total price minus total cost) divided by total cost, then multiply by 100."
      }
    },
    {
      "@type": "Question",
      "name": "Is basket markup the same as averaging the item markups?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, basket markup is weighted by costs (and quantities), so it can differ from a simple average."
      }
    },
    {
      "@type": "Question",
      "name": "Can markup be negative?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, if the selling price is lower than the cost, the markup is negative."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if cost is zero?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Markup percent is undefined because you cannot divide by zero."
      }
    },
    {
      "@type": "Question",
      "name": "Is markup the same as profit margin?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, markup is based on cost, while margin is based on selling price."
      }
    },
    {
      "@type": "Question",
      "name": "Where is markup used in real life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Markup is used in retail pricing, quoting, invoicing, and setting prices for product ranges."
      }
    }
  ]
}
</script>

9.4 BreadcrumbList (Required)
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
      "name": "Markup Calculator",
      "item": "https://calchowmuch.com/percentage-calculators/markup-calculator/"
    }
  ]
}
</script>

10. Sitemap & Indexing

Must update:

sitemap.xml

/sitemap

public/calculators/index.html

11. Testing Requirements
Test	Required
Unit (single + basket + weighted markup logic)	✅
ISS-001 (UI rules / layout regression)	✅
E2E (toggle + add/remove rows + calc totals)	✅
SEO P1 → P5	✅
12. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

13. Acceptance Criteria

Single product mode works (both directions)

Basket mode supports multiple products with add/remove rows

Basket totals computed correctly with quantity

Basket markup % is weighted: (Total Price − Total Cost) ÷ Total Cost × 100

Clear per-row and basket-level error handling when cost is zero

Explanation pane crawlable and matches universal standard

JSON-LD valid and page-scoped

Visible FAQs match FAQPage JSON-LD exactly

Sitemap updated and page discoverable

All tests passing with no P0 failures
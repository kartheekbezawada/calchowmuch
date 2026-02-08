REQ — Percentage Composition / Share of Total Calculator (SERP-Ready)

Calculator Group: Percentage Calculators
Calculator: Percentage Composition (Share of Total)
Primary Question: “What percentage of the total is each item?” (plus remainder %)
Status: NEW
Type: Brand-new calculator (Percentage Calculators → Percentage Composition)
FSM Phase: REQ
Scope: UI, Compute, Navigation, SEO, Sitemap, Testing

1. Purpose & Search Intent (SEO-Critical)
1.1 Primary User Question (Single-Question Rule)

This page supports one intent: percentage composition / share of total:

each item’s value as a percentage of the total

optional remainder % (“Other”) when a known total is provided and items do not sum to it

Common use cases:

budget category shares

portfolio allocation

survey results breakdown

spending split across categories

analytics breakdown of components

Scope Guard: This page must not become a pie-chart tool or a statistics suite. It must not calculate percent change, markup/margin, discount, or ratio conversions. Only share-of-total.

1.2 Primary SEO Keywords (MANDATORY)

These keywords must appear in:

H1

title

meta description

explanation copy

FAQ questions

Keyword Type	Keywords
Primary	percentage composition calculator, share of total calculator
Secondary	percent of total, percentage breakdown
Long-Tail / Intent	calculate percentage share of total, each item as percent of total, remainder percentage
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

Display name must be exactly: “Percentage Composition”

Navigation must be config-driven

One calculator page per intent (share of total)

3. URL & Page Model (SEO + MVP)
3.1 Canonical URL
/percentage-calculators/percentage-composition/

3.2 Architecture

Multi-Page Application (MPA)

One calculator per page

Full page reload

Crawlable explanation pane

4. Folder & File Structure
/public/calculators/percentage-calculators/percentage-composition/
├── index.html          # Calculator shell + calculation pane
├── module.js           # composition logic + remainder
└── explanation.html    # Static explanation pane (SEO-critical)

5. Page Metadata (SERP-Optimized)

H1

Percentage Composition Calculator


Title

Percentage Composition Calculator – CalcHowMuch


Meta Description (≤160 chars)

Calculate each item’s share as a percent of the total. Get a full percentage breakdown and remainder % with our free composition calculator.


Canonical

https://calchowmuch.com/percentage-calculators/percentage-composition/

6. Calculation Pane Requirements
6.1 Heading

No inner H2 inside the calculation pane. Use only the page-level H1 title.

6.2 Mode Toggle (Required)

Switch Toggle:

Calculated Total (default)

Known Total (Show Remainder %)

Rules

Default: Calculated Total (switch OFF)

Switch ON must activate Known Total mode and show the Known Total (T) input

Switch OFF must activate Calculated Total mode and hide the Known Total (T) input

Non-selected mode inputs must be hidden/disabled

Basket-style multi-item input grid is required

6.3 Inputs (Above the Fold)
Multi-Item Grid (Required)

Form Density and Row Layout (Required)

Each item row must be compact and rendered in one row block

Name and Value fields must be side-by-side on desktop/tablet widths

Remove action must stay in the same row block as Name/Value

Rows added from "Add Item Row" must use the same compact layout/style

Mobile may stack fields for readability

Basket Controls

Add Item Row

Remove Row

Clear All (optional)

Default rows: 3 (or align with universal minimal default)

Row Fields

Column	Field	Type	Required	Notes
1	Item Name (optional)	Text	No	For readability only
2	Item Value	Number	Yes	Allow decimals; recommended ≥ 0
Known Total Mode (Additional Input)
Input	Type	Required	Notes
Total (T)	Number	Yes	Must be ≥ 0; used to compute remainder

Interaction Trigger Rule

Initial prefilled result may render on page load

After user input edits, output updates must happen only on "Calculate Composition" click

No live recalculation on input change

6.4 Outputs
Per Item (Required)
Output	Required	Notes
Item % of Total	Yes	(Item ÷ Total) × 100
Item Value	Yes	Echo input
Total Used	Yes	Display whether Total is “Sum of items” or “Known total”
Summary Outputs (Required)
Output	Required	Notes
Total (T)	Yes	Sum-of-items or Known total
Sum of Items	Yes	Σ item values
Remaining Value (Known Total mode)	Yes	T − Σ items
Remainder % (Known Total mode)	Yes	(Remaining ÷ T) × 100
Check: Total %	Yes	Items % sum (+ remainder %) should equal 100% (subject to rounding)
Formula Used	Yes	Show core formulas

Remainder Display Name

Use label: “Remainder (Other)” for remainder % and remaining value

7. Calculator Engine (Logic)
7.1 Core Formula

For each item i:

Item % = (ItemValueᵢ ÷ Total) × 100

7.2 Total Handling

Mode A — Calculated Total

Total = Σ ItemValueᵢ


Mode B — Known Total

Total = T (user input)
SumItems = Σ ItemValueᵢ
Remaining = Total − SumItems
Remainder % = (Remaining ÷ Total) × 100

7.3 Validation Rules

If Total = 0 → percentages undefined → show clear inline error (no crash)

In Known Total mode:

If SumItems > Total → Remaining becomes negative → show warning/error state (“Items exceed total”)

Recommend non-negative values for typical use; do not crash if user types negatives (math-valid but discouraged)

No unhandled exceptions

Formatting must follow site-wide output rules

8. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

8.1 Summary Content (No Summary Heading Node)

Percentage composition shows how each item contributes to a total as a percentage.

This percentage composition calculator computes each item’s share of total by dividing the item value by the total and multiplying by 100. If you provide a known total, it can also calculate the remainder (Other) percentage.

It is useful for budgets, allocations, category breakdowns, and any situation where you want a percentage split.

8.2 H3 — Scenario Summary (Dynamic Values)
Category	Value	Source
Items Count	{ITEMS_COUNT}	Grid
Total Used	{TOTAL_USED}	Mode
Total (T)	{TOTAL}	Engine
Sum of Items	{SUM_ITEMS}	Engine
Remainder %	{REMAINDER_PERCENT}	Engine (Known Total mode)
8.3 H3 — Results Table (Dynamic Values)

Per Item Table (repeat rows)

Item	Value	% of Total
{ITEM_1_NAME}	{ITEM_1_VALUE}	{ITEM_1_PERCENT}%
{ITEM_2_NAME}	{ITEM_2_VALUE}	{ITEM_2_PERCENT}%
{ITEM_3_NAME}	{ITEM_3_VALUE}	{ITEM_3_PERCENT}%

Known Total Mode Only — Remainder Row

Item	Value	% of Total
Remainder (Other)	{REMAINDER_VALUE}	{REMAINDER_PERCENT}%

Summary Row

Metric	Value	Explanation
Total	{TOTAL}	Total used for the calculation
Formula	(Item ÷ Total) × 100	Share-of-total formula
8.4 H3 — Explanation (SERP-Optimized)

To calculate each item’s percentage share, first determine the total. Then divide each item value by the total and multiply by 100.

If you already know the total (for example, a fixed budget), you can enter it to see the remainder value and remainder percentage. The remainder shows how much of the total is not covered by the listed items.

If the total is zero, percentages cannot be calculated because division by zero is not possible.

8.5 H3 — Frequently Asked Questions (Exactly 10)

Visible HTML FAQ content must match FAQPage JSON-LD text exactly.

What is percentage composition?
Percentage composition shows each item’s share of a total as a percentage.

How do you calculate percent of total for an item?
Divide the item value by the total and multiply by 100.

What is the share of total formula?
The formula is (Item ÷ Total) × 100.

What is remainder percentage?
Remainder percentage is the part of the total not covered by the listed items, expressed as a percent of the total.

How do you calculate remainder %?
Subtract the sum of items from the total, divide by the total, then multiply by 100.

What if the items already add up to the total?
Then the remainder is zero and the remainder percentage is 0%.

What if the items exceed the total?
The remainder becomes negative, which indicates the items are larger than the total.

Can I use decimals for item values?
Yes, decimals work the same way for percent of total.

Do the percentages always add up to 100%?
They should add up to 100% when using the same total, but rounding can cause small differences.

Where is percentage composition used in real life?
It is used for budgets, allocations, category breakdowns, and percent share reporting.

9. Structured Data (JSON-LD Bundle) — REQUIRED
9.1 WebPage (Required)
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Percentage Composition Calculator",
  "url": "https://calchowmuch.com/percentage-calculators/percentage-composition/",
  "description": "Calculate each item’s share of total as a percentage and compute remainder percentage using our free percentage composition calculator.",
  "inLanguage": "en"
}
</script>

9.2 SoftwareApplication (Required)
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Percentage Composition Calculator",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/percentage-calculators/percentage-composition/",
  "description": "Free percentage composition calculator to compute each item as a percent of total and calculate remainder percentage.",
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
      "name": "What is percentage composition?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Percentage composition shows each item’s share of a total as a percentage."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate percent of total for an item?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Divide the item value by the total and multiply by 100."
      }
    },
    {
      "@type": "Question",
      "name": "What is the share of total formula?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The formula is (Item ÷ Total) × 100."
      }
    },
    {
      "@type": "Question",
      "name": "What is remainder percentage?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Remainder percentage is the part of the total not covered by the listed items, expressed as a percent of the total."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate remainder %?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Subtract the sum of items from the total, divide by the total, then multiply by 100."
      }
    },
    {
      "@type": "Question",
      "name": "What if the items already add up to the total?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Then the remainder is zero and the remainder percentage is 0%."
      }
    },
    {
      "@type": "Question",
      "name": "What if the items exceed the total?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The remainder becomes negative, which indicates the items are larger than the total."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use decimals for item values?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, decimals work the same way for percent of total."
      }
    },
    {
      "@type": "Question",
      "name": "Do the percentages always add up to 100%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "They should add up to 100% when using the same total, but rounding can cause small differences."
      }
    },
    {
      "@type": "Question",
      "name": "Where is percentage composition used in real life?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is used for budgets, allocations, category breakdowns, and percent share reporting."
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
      "name": "Percentage Composition",
      "item": "https://calchowmuch.com/percentage-calculators/percentage-composition/"
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
Unit (item % + total + remainder logic)	✅
ISS-001 (UI rules / layout regression)	✅
E2E (add/remove items + known total + remainder)	✅
SEO P1 → P5	✅
12. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

13. Acceptance Criteria

Each item % computed correctly from the chosen total

Known Total mode computes remainder value and remainder % correctly

Clear error/warning when total is 0 or items exceed known total

Explanation pane crawlable and matches universal standard

JSON-LD valid and page-scoped

Visible FAQs match FAQPage JSON-LD exactly

Sitemap updated and page discoverable

All tests passing with no P0 failures

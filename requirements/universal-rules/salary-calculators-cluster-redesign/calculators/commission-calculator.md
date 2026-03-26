# Commission Calculator Child Route Spec

## Parent Plan

- `requirements/universal-rules/salary-calculators-cluster-redesign/ROLLOUT_PLAN.md`
- `requirements/universal-rules/salary-calculators-cluster-redesign/DESIGN_SYSTEM.md`

## Route

- `/salary-calculators/commission-calculator/`

## Route Intro

Use this Commission Calculator to estimate commission earnings from a sales amount and commission rate. It should support both simple commission-only use cases and an optional base-pay-plus-commission mode if that input is explicitly approved during implementation.

## Route Design Contract

- Inherit the shared salary design baseline from `DESIGN_SYSTEM.md`.
- Use the `earnings` route variant in a fully light, answer-first layout.
- Keep the hero result focused on commission earned only.
- Limit the first supporting result row to total earnings when base pay is supplied and effective commission rate.
- Keep optional base-pay logic visually quiet so the route still feels simple rather than payroll-like.

## SEO Metadata

- Page title: `Commission Calculator | Calculate Earnings From Sales Commission`
- H1: `Commission Calculator`
- Meta description: `Calculate commission earnings from sales and commission rate, with optional total earnings when base pay is included.`
- Canonical URL: `https://calchowmuch.com/salary-calculators/commission-calculator/`

## Search Intent

- Primary intent: utility and compensation estimate
- Searcher goal: estimate commission earned from sales
- SERP angle: direct commission calculator with optional total-earnings view

## Keyword Strategy

### Primary Keywords

- commission calculator
- sales commission calculator
- commission earnings calculator

### Secondary Keywords

- commission rate calculator
- sales pay calculator
- commission percentage calculator
- total commission calculator

## Breadcrumbs

- Home
- Salary Calculators
- Commission Calculator

### Breadcrumb JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"},
    {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"},
    {"@type": "ListItem", "position": 3, "name": "Commission Calculator", "item": "https://calchowmuch.com/salary-calculators/commission-calculator/"}
  ]
}
```

## Internal Calculator Mesh

- Parent hub: `/salary-calculators/`
- Related routes:
  - `/salary-calculators/bonus-calculator/`
  - `/salary-calculators/raise-calculator/`
  - `/salary-calculators/salary-calculator/`
  - `/salary-calculators/monthly-to-annual-salary-calculator/`

## Formula Table

| Output | Formula | Inputs | Notes |
|---|---|---|---|
| Commission | `salesAmount x commissionRate` | salesAmount, commissionRate | Primary result |
| Total earnings | `basePay + commission` | basePay, commission | Optional output |
| Commission rate | `commission / salesAmount x 100` | commission, salesAmount | Secondary output |

## Calculator Input-Output Schema

```yaml
calculatorId: commission-calculator
route: /salary-calculators/commission-calculator/
routeArchetype: calc_exp
designFamily: neutral
paneLayout: single
inputs:
  - id: sales_amount
    label: Sales amount
    type: currency
    required: true
  - id: commission_mode
    label: Commission mode
    type: radio-group
    required: true
    options: [rate, amount]
  - id: commission_rate
    label: Commission rate
    type: decimal
    requiredWhen: commission_mode = rate
  - id: commission_amount
    label: Commission amount
    type: currency
    requiredWhen: commission_mode = amount
  - id: base_pay
    label: Base pay
    type: currency
    requiredWhen: total earnings output is enabled
outputs:
  - id: commission_output
    label: Commission earned
    format: currency
  - id: total_earnings
    label: Total earnings
    format: currency
  - id: effective_commission_rate
    label: Effective commission rate
    format: percent
validation:
  - sales_amount > 0
  - commission_rate >= 0 when present
  - commission_amount >= 0 when present
  - base_pay >= 0 when present
```

## JSON-LD Package

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {"@type": "WebSite", "@id": "https://calchowmuch.com/#website", "url": "https://calchowmuch.com/", "name": "CalcHowMuch", "inLanguage": "en"},
    {"@type": "Organization", "@id": "https://calchowmuch.com/#organization", "name": "CalcHowMuch", "url": "https://calchowmuch.com/", "logo": {"@type": "ImageObject", "url": "https://calchowmuch.com/assets/images/og-default.png"}},
    {"@type": "WebPage", "@id": "https://calchowmuch.com/salary-calculators/commission-calculator/#webpage", "name": "Commission Calculator | Calculate Earnings From Sales Commission", "url": "https://calchowmuch.com/salary-calculators/commission-calculator/", "description": "Calculate commission earnings from sales and commission rate, with optional total earnings when base pay is included.", "isPartOf": {"@id": "https://calchowmuch.com/#website"}, "publisher": {"@id": "https://calchowmuch.com/#organization"}, "inLanguage": "en"},
    {"@type": "SoftwareApplication", "@id": "https://calchowmuch.com/salary-calculators/commission-calculator/#softwareapplication", "name": "Commission Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "url": "https://calchowmuch.com/salary-calculators/commission-calculator/", "description": "Estimate commission and optional total earnings from sales and commission inputs.", "inLanguage": "en", "provider": {"@id": "https://calchowmuch.com/#organization"}, "featureList": ["Commission estimate", "Effective commission rate", "Optional total earnings"], "keywords": "commission calculator, sales commission calculator, commission earnings calculator", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}},
    {"@type": "BreadcrumbList", "@id": "https://calchowmuch.com/salary-calculators/commission-calculator/#breadcrumbs", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"}, {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"}, {"@type": "ListItem", "position": 3, "name": "Commission Calculator", "item": "https://calchowmuch.com/salary-calculators/commission-calculator/"}]}
  ]
}
```

## FAQ Outline

1. How do you calculate commission?
2. Can I use a commission rate or a known commission amount?
3. Can I include base pay?
4. Does this show effective commission rate?
5. Does this include tax deductions?

## FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://calchowmuch.com/salary-calculators/commission-calculator/#faq",
  "mainEntity": [
    {"@type": "Question", "name": "How do you calculate commission?", "acceptedAnswer": {"@type": "Answer", "text": "Multiply the sales amount by the commission rate to estimate commission earned."}},
    {"@type": "Question", "name": "Can I use a commission rate or a known commission amount?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. The route can support either a rate-based input or a known commission amount."}},
    {"@type": "Question", "name": "Can I include base pay?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. If base pay is enabled for the route, total earnings can be shown as base pay plus commission."}},
    {"@type": "Question", "name": "Does this show effective commission rate?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. If commission and sales are known, the route can also show the effective commission percentage."}},
    {"@type": "Question", "name": "Does this include tax deductions?", "acceptedAnswer": {"@type": "Answer", "text": "No. It estimates gross commission earnings only."}}
  ]
}
```

## Search Snippet Intro

Calculate commission earnings from sales and commission rate, with optional total earnings when base pay is included. This route supports simple commission scenarios without requiring any industry-specific rules.

## Assumptions

- results are gross-pay estimates only
- rate mode calculates commission from sales amount and commission rate
- amount mode accepts a known commission amount directly
- total earnings is optional and depends on base pay being provided

## Input Defaults

- `commission_mode` recommended default: `rate`
- no hardcoded sales amount default
- keep the last valid mode during the current session where practical

## Rounding Rules

- display currency outputs to 2 decimal places
- display percent outputs to 2 decimal places when shown
- keep full precision internally until final formatting

## Validation Rules

- do not calculate if sales amount is missing or non-positive
- in rate mode, commission rate must be zero or greater
- in amount mode, commission amount must be zero or greater
- base pay must be zero or greater when total earnings output is enabled

## Edge Cases

- zero commission comparison scenarios
- small sales amounts with high commission rates
- known commission amount entered without rate mode
- optional base pay omitted while total earnings output is hidden

## Worked Example

- sales amount: `$50,000.00`
- commission mode: `rate`
- commission rate: `8`
- base pay: `$3,000.00`
- expected commission earned: `$4,000.00`
- expected total earnings: `$7,000.00`
- expected effective commission rate: `8.00%`

## Result Hierarchy

1. commission earned hero result
2. total earnings when base pay is supplied
3. effective commission rate
4. related tools and FAQ

## Explanation Section Outline

1. what a commission calculation shows
2. rate mode formula
3. known-amount mode behavior
4. worked example
5. gross-pay-only notes
6. FAQ

## Internal Linking Placement

- place bonus and raise links directly below the result block
- keep salary-calculator and monthly-to-annual links in the related tools block above FAQ
- include the parent hub link in the related tools area

## Schema Mapping Notes

- `Page title` maps to HTML `<title>`, `og:title`, and `twitter:title`
- `Meta description` maps to meta description, `og:description`, and `twitter:description`
- `Canonical URL` maps to the canonical link and `WebPage.url`
- `Route Intro` and `Search Snippet Intro` guide visible intro text and `WebPage.description`
- `SoftwareApplication.description` must stay aligned with commission estimate and optional total earnings use cases
- `Breadcrumbs` maps to visible breadcrumbs and `BreadcrumbList`
- visible FAQ content must match FAQ schema in meaning and preferably in exact text

## Content Guardrails

- do not imply tax withholding or net commission
- do not assume industry-specific commission plans or tiers
- do not require base pay when the core task is commission-only
- do not blur commission and bonus logic on the page

## Accessibility Notes

- radio-group mode selection must be keyboard operable
- only active mode inputs should be focusable when conditionally shown
- validation states must be announced programmatically
- result updates should be accessible to assistive technology

## QA Checklist

- title, meta description, and canonical URL match the spec
- visible breadcrumbs match `BreadcrumbList`
- visible FAQ content matches FAQ schema
- worked example returns `$4,000.00` commission and `$7,000.00` total earnings
- switching between rate and amount mode updates validation correctly
- invalid sales, rate, amount, or base-pay inputs block calculation cleanly

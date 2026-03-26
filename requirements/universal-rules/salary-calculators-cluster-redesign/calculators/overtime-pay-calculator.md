# Overtime Pay Calculator Child Route Spec

## Parent Plan

- `requirements/universal-rules/salary-calculators-cluster-redesign/ROLLOUT_PLAN.md`
- `requirements/universal-rules/salary-calculators-cluster-redesign/DESIGN_SYSTEM.md`

## Route

- `/salary-calculators/overtime-pay-calculator/`

## Route Intro

Use this Overtime Pay Calculator to estimate extra pay from overtime hours. It should help users quantify additional earnings from overtime work while keeping the multiplier fully editable so the page stays user-input driven instead of implying any fixed labor-law rule.

## Route Design Contract

- Inherit the shared salary design baseline from `DESIGN_SYSTEM.md`.
- Use the `earnings` route variant in a fully light, answer-first layout.
- Keep the hero result focused on overtime pay only.
- Limit the first supporting result row to total pay when base pay is supplied.
- Keep multiplier guidance short and calm so the route avoids legal or policy-heavy presentation.

## SEO Metadata

- Page title: `Overtime Pay Calculator | Estimate Extra Pay From Overtime Hours`
- H1: `Overtime Pay Calculator`
- Meta description: `Estimate overtime pay from your hourly rate, overtime hours, and overtime multiplier, with optional total-pay output.`
- Canonical URL: `https://calchowmuch.com/salary-calculators/overtime-pay-calculator/`

## Search Intent

- Primary intent: utility and earnings estimate
- Searcher goal: calculate extra pay from overtime hours quickly
- SERP angle: editable overtime multiplier, no hardcoded labor-law claims

## Keyword Strategy

### Primary Keywords

- overtime pay calculator
- overtime calculator
- overtime wage calculator

### Secondary Keywords

- extra pay calculator
- overtime rate calculator
- overtime earnings calculator
- overtime hourly pay calculator

## Breadcrumbs

- Home
- Salary Calculators
- Overtime Pay Calculator

### Breadcrumb JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"},
    {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"},
    {"@type": "ListItem", "position": 3, "name": "Overtime Pay Calculator", "item": "https://calchowmuch.com/salary-calculators/overtime-pay-calculator/"}
  ]
}
```

## Internal Calculator Mesh

- Parent hub: `/salary-calculators/`
- Related routes:
  - `/salary-calculators/weekly-pay-calculator/`
  - `/salary-calculators/hourly-to-salary-calculator/`
  - `/salary-calculators/salary-calculator/`
  - `/salary-calculators/raise-calculator/`

## Formula Table

| Output | Formula | Inputs | Notes |
|---|---|---|---|
| Overtime pay | `hourlyRate x overtimeHours x overtimeMultiplier` | hourlyRate, overtimeHours, overtimeMultiplier | Primary result |
| Total pay with overtime | `basePay + overtimePay` | basePay, overtimePay | Optional secondary output |

## Calculator Input-Output Schema

```yaml
calculatorId: overtime-pay-calculator
route: /salary-calculators/overtime-pay-calculator/
routeArchetype: calc_exp
designFamily: neutral
paneLayout: single
inputs:
  - id: hourly_rate
    label: Hourly rate
    type: currency
    required: true
  - id: overtime_hours
    label: Overtime hours
    type: number
    required: true
  - id: overtime_multiplier
    label: Overtime multiplier
    type: decimal
    required: true
    defaultValue: 1.5
  - id: base_pay
    label: Base pay for selected period
    type: currency
    requiredWhen: total pay output is shown
outputs:
  - id: overtime_pay
    label: Overtime pay
    format: currency
  - id: total_pay
    label: Total pay including overtime
    format: currency
validation:
  - hourly_rate > 0
  - overtime_hours >= 0
  - overtime_multiplier > 0
guardrails:
  - overtime_multiplier must remain editable
  - no jurisdiction-specific legal claim in default copy
```

## JSON-LD Package

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {"@type": "WebSite", "@id": "https://calchowmuch.com/#website", "url": "https://calchowmuch.com/", "name": "CalcHowMuch", "inLanguage": "en"},
    {"@type": "Organization", "@id": "https://calchowmuch.com/#organization", "name": "CalcHowMuch", "url": "https://calchowmuch.com/", "logo": {"@type": "ImageObject", "url": "https://calchowmuch.com/assets/images/og-default.png"}},
    {"@type": "WebPage", "@id": "https://calchowmuch.com/salary-calculators/overtime-pay-calculator/#webpage", "name": "Overtime Pay Calculator | Estimate Extra Pay From Overtime Hours", "url": "https://calchowmuch.com/salary-calculators/overtime-pay-calculator/", "description": "Estimate overtime pay from your hourly rate, overtime hours, and overtime multiplier, with optional total-pay output.", "isPartOf": {"@id": "https://calchowmuch.com/#website"}, "publisher": {"@id": "https://calchowmuch.com/#organization"}, "inLanguage": "en"},
    {"@type": "SoftwareApplication", "@id": "https://calchowmuch.com/salary-calculators/overtime-pay-calculator/#softwareapplication", "name": "Overtime Pay Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "url": "https://calchowmuch.com/salary-calculators/overtime-pay-calculator/", "description": "Estimate extra earnings from overtime hours using your own overtime multiplier.", "inLanguage": "en", "provider": {"@id": "https://calchowmuch.com/#organization"}, "featureList": ["Overtime pay estimate", "Editable overtime multiplier", "Optional total pay view"], "keywords": "overtime pay calculator, overtime calculator, overtime earnings calculator", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}},
    {"@type": "BreadcrumbList", "@id": "https://calchowmuch.com/salary-calculators/overtime-pay-calculator/#breadcrumbs", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"}, {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"}, {"@type": "ListItem", "position": 3, "name": "Overtime Pay Calculator", "item": "https://calchowmuch.com/salary-calculators/overtime-pay-calculator/"}]}
  ]
}
```

## FAQ Outline

1. How do you calculate overtime pay?
2. Why is the overtime multiplier editable?
3. Can I include total pay with overtime?
4. Does this route assume a legal overtime rule?
5. Does the result include tax deductions?

## FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://calchowmuch.com/salary-calculators/overtime-pay-calculator/#faq",
  "mainEntity": [
    {"@type": "Question", "name": "How do you calculate overtime pay?", "acceptedAnswer": {"@type": "Answer", "text": "Multiply the hourly rate by overtime hours and the overtime multiplier."}},
    {"@type": "Question", "name": "Why is the overtime multiplier editable?", "acceptedAnswer": {"@type": "Answer", "text": "Because overtime treatment can vary by employer or situation, so the page should let users supply their own multiplier instead of assuming a fixed rule."}},
    {"@type": "Question", "name": "Can I include total pay with overtime?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. If base pay is entered, the route can show total pay plus overtime."}},
    {"@type": "Question", "name": "Does this route assume a legal overtime rule?", "acceptedAnswer": {"@type": "Answer", "text": "No. It is a user-input calculator and should not imply a universal legal standard."}},
    {"@type": "Question", "name": "Does the result include tax deductions?", "acceptedAnswer": {"@type": "Answer", "text": "No. It estimates gross overtime pay only."}}
  ]
}
```

## Search Snippet Intro

Estimate overtime earnings from your hourly rate, overtime hours, and overtime multiplier, with optional total-pay output. This route stays low-maintenance by keeping the multiplier user-controlled instead of tied to a jurisdiction rule.

## Assumptions

- results are gross-pay estimates only
- overtime pay is calculated from hourly rate, overtime hours, and an editable multiplier
- total pay is only shown when base pay is provided
- the route does not assume any employer or legal overtime policy by default

## Input Defaults

- `overtime_multiplier` default: `1.5`
- `overtime_hours` can accept `0` for comparison states
- no hardcoded base pay default

## Rounding Rules

- display currency outputs to 2 decimal places
- keep internal precision until final display formatting

## Validation Rules

- do not calculate if hourly rate is missing or non-positive
- overtime hours must be zero or greater
- overtime multiplier must be positive
- total pay output requires a non-negative base pay when enabled

## Edge Cases

- zero overtime hours producing zero overtime pay
- multipliers above `2.0` entered intentionally by users
- base pay omitted while total-pay output is hidden
- users comparing the same overtime hours under different multipliers

## Worked Example

- hourly rate: `$25.00`
- overtime hours: `10`
- overtime multiplier: `1.5`
- base pay: `$1,000.00`
- expected overtime pay: `$375.00`
- expected total pay: `$1,375.00`

## Result Hierarchy

1. overtime pay hero result
2. total pay when base pay is supplied
3. related tools and FAQ

## Explanation Section Outline

1. what overtime pay means on this route
2. formula breakdown
3. why the multiplier stays editable
4. worked example
5. gross-pay-only and non-legal-claim notes
6. FAQ

## Internal Linking Placement

- place weekly-pay and hourly-to-salary links directly below the main result
- keep raise and salary-calculator links in the related block above FAQ
- surface the parent hub link near the intro or related tools block

## Schema Mapping Notes

- `Page title` maps to HTML `<title>`, `og:title`, and `twitter:title`
- `Meta description` maps to meta description, `og:description`, and `twitter:description`
- `Canonical URL` maps to the canonical link and `WebPage.url`
- `Route Intro` and `Search Snippet Intro` guide visible intro text and `WebPage.description`
- `SoftwareApplication.description` must mention editable multiplier logic without implying a legal standard
- `Breadcrumbs` maps to visible breadcrumbs and `BreadcrumbList`
- visible FAQ content must match FAQ schema in meaning and preferably in exact text

## Content Guardrails

- do not claim a universal overtime law or threshold
- do not frame the multiplier as fixed by default across all users
- do not imply net pay or deductions
- do not present base pay as required when only overtime pay is needed

## Accessibility Notes

- all inputs require persistent labels
- optional total-pay fields should appear in a predictable focus order
- validation states must be announced programmatically
- result updates should be accessible to assistive technology

## QA Checklist

- title, meta description, and canonical URL match the spec
- visible breadcrumbs match `BreadcrumbList`
- visible FAQ content matches FAQ schema
- worked example returns `$375.00` overtime pay and `$1,375.00` total pay
- multiplier remains editable in the interface
- invalid rate, hours, or multiplier values block calculation cleanly

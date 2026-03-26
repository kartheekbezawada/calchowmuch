# Weekly Pay Calculator Child Route Spec

## Parent Plan

- `requirements/universal-rules/salary-calculators-cluster-redesign/ROLLOUT_PLAN.md`
- `requirements/universal-rules/salary-calculators-cluster-redesign/DESIGN_SYSTEM.md`

## Route

- `/salary-calculators/weekly-pay-calculator/`

## Route Intro

Use this Weekly Pay Calculator to estimate weekly earnings from an hourly rate and hours worked. It should serve users who want a direct weekly-pay answer, with optional support for splitting regular hours and overtime hours when that mode is approved for implementation.

## Route Design Contract

- Inherit the shared salary design baseline from `DESIGN_SYSTEM.md`.
- Use the `earnings` route variant in a fully light, answer-first layout.
- Keep the hero result focused on weekly pay only.
- Limit the first supporting result row to annualized pay when enabled.
- If split-hours overtime mode is approved later, keep that mode visually quiet and subordinate to the main weekly-pay answer.

## SEO Metadata

- Page title: `Weekly Pay Calculator | Estimate Weekly Earnings From Hours and Rate`
- H1: `Weekly Pay Calculator`
- Meta description: `Estimate weekly pay from your hourly rate and hours worked, with optional support for regular and overtime hour splits.`
- Canonical URL: `https://calchowmuch.com/salary-calculators/weekly-pay-calculator/`

## Search Intent

- Primary intent: utility and schedule-based earnings estimate
- Searcher goal: find weekly pay from hourly work inputs
- SERP angle: direct weekly earnings estimate with optional overtime logic

## Keyword Strategy

### Primary Keywords

- weekly pay calculator
- weekly salary calculator
- weekly earnings calculator

### Secondary Keywords

- pay per week calculator
- hourly to weekly pay calculator
- weekly wage calculator
- weekly income calculator

## Breadcrumbs

- Home
- Salary Calculators
- Weekly Pay Calculator

### Breadcrumb JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"},
    {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"},
    {"@type": "ListItem", "position": 3, "name": "Weekly Pay Calculator", "item": "https://calchowmuch.com/salary-calculators/weekly-pay-calculator/"}
  ]
}
```

## Internal Calculator Mesh

- Parent hub: `/salary-calculators/`
- Related routes:
  - `/salary-calculators/hourly-to-salary-calculator/`
  - `/salary-calculators/salary-calculator/`
  - `/salary-calculators/overtime-pay-calculator/`
  - `/salary-calculators/salary-to-hourly-calculator/`

## Formula Table

| Output | Formula | Inputs | Notes |
|---|---|---|---|
| Weekly pay | `hourlyRate x totalWeeklyHours` | hourlyRate, totalWeeklyHours | Default primary formula |
| Weekly pay with overtime | `regularHours x hourlyRate + overtimeHours x hourlyRate x overtimeMultiplier` | regularHours, overtimeHours, hourlyRate, overtimeMultiplier | Optional mode |
| Annualized pay | `weeklyPay x weeksPerYear` | weeklyPay, weeksPerYear | Optional secondary output |

## Calculator Input-Output Schema

```yaml
calculatorId: weekly-pay-calculator
route: /salary-calculators/weekly-pay-calculator/
routeArchetype: calc_exp
designFamily: neutral
paneLayout: single
inputs:
  - id: hourly_rate
    label: Hourly rate
    type: currency
    required: true
  - id: total_weekly_hours
    label: Total weekly hours
    type: number
    requiredWhen: mode = standard
  - id: regular_hours
    label: Regular hours
    type: number
    requiredWhen: mode = split
  - id: overtime_hours
    label: Overtime hours
    type: number
    requiredWhen: mode = split
  - id: overtime_multiplier
    label: Overtime multiplier
    type: decimal
    requiredWhen: mode = split
    defaultValue: 1.5
  - id: weeks_per_year
    label: Weeks per year
    type: number
    requiredWhen: annualized output is shown
    defaultValue: 52
outputs:
  - id: weekly_pay
    label: Weekly pay
    format: currency
  - id: annualized_pay
    label: Annualized pay
    format: currency
validation:
  - hourly_rate > 0
  - total_weekly_hours > 0 when present
  - regular_hours >= 0 when present
  - overtime_hours >= 0 when present
  - overtime_multiplier > 0 when present
```

## JSON-LD Package

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {"@type": "WebSite", "@id": "https://calchowmuch.com/#website", "url": "https://calchowmuch.com/", "name": "CalcHowMuch", "inLanguage": "en"},
    {"@type": "Organization", "@id": "https://calchowmuch.com/#organization", "name": "CalcHowMuch", "url": "https://calchowmuch.com/", "logo": {"@type": "ImageObject", "url": "https://calchowmuch.com/assets/images/og-default.png"}},
    {"@type": "WebPage", "@id": "https://calchowmuch.com/salary-calculators/weekly-pay-calculator/#webpage", "name": "Weekly Pay Calculator | Estimate Weekly Earnings From Hours and Rate", "url": "https://calchowmuch.com/salary-calculators/weekly-pay-calculator/", "description": "Estimate weekly pay from your hourly rate and hours worked, with optional support for regular and overtime hour splits.", "isPartOf": {"@id": "https://calchowmuch.com/#website"}, "publisher": {"@id": "https://calchowmuch.com/#organization"}, "inLanguage": "en"},
    {"@type": "SoftwareApplication", "@id": "https://calchowmuch.com/salary-calculators/weekly-pay-calculator/#softwareapplication", "name": "Weekly Pay Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "url": "https://calchowmuch.com/salary-calculators/weekly-pay-calculator/", "description": "Estimate weekly earnings from hourly pay and worked hours.", "inLanguage": "en", "provider": {"@id": "https://calchowmuch.com/#organization"}, "featureList": ["Weekly pay estimate", "Optional overtime split", "Annualized pay view"], "keywords": "weekly pay calculator, weekly salary calculator, hourly to weekly pay", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}},
    {"@type": "BreadcrumbList", "@id": "https://calchowmuch.com/salary-calculators/weekly-pay-calculator/#breadcrumbs", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"}, {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"}, {"@type": "ListItem", "position": 3, "name": "Weekly Pay Calculator", "item": "https://calchowmuch.com/salary-calculators/weekly-pay-calculator/"}]}
  ]
}
```

## FAQ Outline

1. How do you calculate weekly pay?
2. Can this include overtime hours?
3. Can I annualize the weekly result?
4. Does this work for part-time schedules?
5. Does the result include tax deductions?

## FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://calchowmuch.com/salary-calculators/weekly-pay-calculator/#faq",
  "mainEntity": [
    {"@type": "Question", "name": "How do you calculate weekly pay?", "acceptedAnswer": {"@type": "Answer", "text": "Multiply the hourly rate by total weekly hours, or split regular and overtime hours if that mode is enabled."}},
    {"@type": "Question", "name": "Can this include overtime hours?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. A split-hours mode can estimate weekly pay using separate regular and overtime inputs plus an overtime multiplier."}},
    {"@type": "Question", "name": "Can I annualize the weekly result?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. The weekly result can be multiplied by weeks per year to estimate annualized pay."}},
    {"@type": "Question", "name": "Does this work for part-time schedules?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. The calculator works for any schedule as long as you enter the hours that match your workweek."}},
    {"@type": "Question", "name": "Does the result include tax deductions?", "acceptedAnswer": {"@type": "Answer", "text": "No. It estimates gross weekly pay only."}}
  ]
}
```

## Search Snippet Intro

Estimate weekly earnings from an hourly rate and hours worked, with optional support for split regular and overtime hours. This route stays flexible by treating overtime as an optional mode rather than a fixed assumption.

## Assumptions

- results are gross-pay estimates only
- standard mode uses hourly rate multiplied by total weekly hours
- split-hours mode uses separate regular and overtime inputs when enabled
- annualized output depends on weeks per year and is secondary to the weekly result

## Input Defaults

- `overtime_multiplier` default: `1.5` when split mode is enabled
- `weeks_per_year` default: `52` when annualized output is shown
- no hardcoded hourly rate default

## Rounding Rules

- display currency outputs to 2 decimal places
- retain full precision until final formatting

## Validation Rules

- do not calculate if hourly rate is missing or non-positive
- in standard mode, total weekly hours must be positive
- in split mode, regular hours and overtime hours must be zero or greater and multiplier must be positive
- if annualized output is shown, weeks per year must be positive

## Edge Cases

- part-time schedules with low weekly hours
- split mode with zero overtime hours
- unusually high overtime multipliers entered by the user
- weekly schedules that users want to annualize using fewer than 52 weeks

## Worked Example

- hourly rate: `$25.00`
- total weekly hours: `40`
- weeks per year: `52`
- expected weekly pay: `$1,000.00`
- expected annualized pay: `$52,000.00`

## Result Hierarchy

1. weekly pay hero result
2. annualized pay when enabled
3. related tools and FAQ

## Explanation Section Outline

1. what weekly pay means
2. standard formula breakdown
3. optional split-hours overtime model
4. worked example
5. gross-pay-only notes
6. FAQ

## Internal Linking Placement

- place overtime-pay and hourly-to-salary links directly below the result block
- keep the salary hub link in the related tools area above FAQ
- keep reverse conversion links close to the main result

## Schema Mapping Notes

- `Page title` maps to HTML `<title>`, `og:title`, and `twitter:title`
- `Meta description` maps to meta description, `og:description`, and `twitter:description`
- `Canonical URL` maps to the canonical link and `WebPage.url`
- `Route Intro` and `Search Snippet Intro` guide visible intro text and `WebPage.description`
- `SoftwareApplication.description` must remain focused on weekly earnings estimation
- `Breadcrumbs` maps to visible breadcrumbs and `BreadcrumbList`
- visible FAQ content must match FAQ schema in meaning and preferably in exact text

## Content Guardrails

- do not imply net pay or paycheck-after-tax results
- do not present split overtime mode as a universal legal rule
- do not hide that annualized output depends on weeks per year
- do not force overtime inputs in the default standard flow unless approved in implementation

## Accessibility Notes

- labels must remain persistent for all inputs
- mode changes must not trap keyboard focus
- validation errors must be tied to their fields
- result updates should be announced accessibly

## QA Checklist

- title, meta description, and canonical URL match the spec
- visible breadcrumbs match `BreadcrumbList`
- visible FAQ content matches FAQ schema
- standard worked example returns `$1,000.00` weekly and `$52,000.00` annualized
- split mode validation works when enabled
- invalid hour or multiplier values block calculation cleanly

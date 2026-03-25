# Hourly to Salary Calculator Child Route Spec

## Parent Plan

- `requirements/universal-rules/salary-calculators-cluster-redesign/ROLLOUT_PLAN.md`

## Route

- `/salary-calculators/hourly-to-salary-calculator/`

## Route Intro

Use this Hourly to Salary Calculator to estimate annual, monthly, biweekly, and weekly pay from an hourly rate. It is the exact-match route for users who start with an hourly wage and want a clean salary estimate based on their own hours-per-week and weeks-per-year assumptions.

## SEO Metadata

- Page title: `Hourly to Salary Calculator | Convert Hourly Pay to Annual Salary`
- H1: `Hourly to Salary Calculator`
- Meta description: `Convert an hourly wage into annual salary, monthly pay, biweekly pay, and weekly pay using your hours worked and weeks per year.`
- Canonical URL: `https://calchowmuch.com/salary-calculators/hourly-to-salary-calculator/`

## Search Intent

- Primary intent: exact-match conversion utility
- Searcher goal: turn hourly pay into annual salary and pay-period equivalents
- SERP angle: fast hourly wage conversion with editable schedule assumptions

## Keyword Strategy

### Primary Keywords

- hourly to salary calculator
- hourly wage to salary calculator
- hourly pay to annual salary

### Secondary Keywords

- convert hourly to yearly salary
- hourly to monthly salary
- hourly to weekly pay
- wage to annual income calculator

## Breadcrumbs

- Home
- Salary Calculators
- Hourly to Salary Calculator

### Breadcrumb JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"},
    {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"},
    {"@type": "ListItem", "position": 3, "name": "Hourly to Salary Calculator", "item": "https://calchowmuch.com/salary-calculators/hourly-to-salary-calculator/"}
  ]
}
```

## Internal Calculator Mesh

- Parent hub: `/salary-calculators/`
- Related routes:
  - `/salary-calculators/salary-calculator/`
  - `/salary-calculators/salary-to-hourly-calculator/`
  - `/salary-calculators/annual-to-monthly-salary-calculator/`
  - `/salary-calculators/weekly-pay-calculator/`
  - `/salary-calculators/overtime-pay-calculator/`

## Formula Table

| Output | Formula | Inputs | Notes |
|---|---|---|---|
| Annual salary | `hourlyRate x hoursPerWeek x weeksPerYear` | hourlyRate, hoursPerWeek, weeksPerYear | Primary result |
| Monthly pay | `annualSalary / 12` | annualSalary | Secondary result |
| Biweekly pay | `annualSalary / 26` | annualSalary | Assumes 26 periods |
| Weekly pay | `annualSalary / weeksPerYear` | annualSalary, weeksPerYear | Matches user schedule |

## Calculator Input-Output Schema

```yaml
calculatorId: hourly-to-salary-calculator
route: /salary-calculators/hourly-to-salary-calculator/
routeArchetype: calc_exp
designFamily: neutral
paneLayout: single
inputs:
  - id: hourly_rate
    label: Hourly rate
    type: currency
    required: true
  - id: hours_per_week
    label: Hours per week
    type: number
    required: true
  - id: weeks_per_year
    label: Weeks per year
    type: number
    required: true
    defaultValue: 52
outputs:
  - id: annual_salary
    label: Annual salary
    format: currency
  - id: monthly_pay
    label: Monthly pay
    format: currency
  - id: biweekly_pay
    label: Biweekly pay
    format: currency
  - id: weekly_pay
    label: Weekly pay
    format: currency
validation:
  - hourly_rate > 0
  - hours_per_week > 0
  - weeks_per_year > 0
```

## JSON-LD Package

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {"@type": "WebSite", "@id": "https://calchowmuch.com/#website", "url": "https://calchowmuch.com/", "name": "CalcHowMuch", "inLanguage": "en"},
    {"@type": "Organization", "@id": "https://calchowmuch.com/#organization", "name": "CalcHowMuch", "url": "https://calchowmuch.com/", "logo": {"@type": "ImageObject", "url": "https://calchowmuch.com/assets/images/og-default.png"}},
    {"@type": "WebPage", "@id": "https://calchowmuch.com/salary-calculators/hourly-to-salary-calculator/#webpage", "name": "Hourly to Salary Calculator | Convert Hourly Pay to Annual Salary", "url": "https://calchowmuch.com/salary-calculators/hourly-to-salary-calculator/", "description": "Convert an hourly wage into annual salary, monthly pay, biweekly pay, and weekly pay using your hours worked and weeks per year.", "isPartOf": {"@id": "https://calchowmuch.com/#website"}, "publisher": {"@id": "https://calchowmuch.com/#organization"}, "inLanguage": "en"},
    {"@type": "SoftwareApplication", "@id": "https://calchowmuch.com/salary-calculators/hourly-to-salary-calculator/#softwareapplication", "name": "Hourly to Salary Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "url": "https://calchowmuch.com/salary-calculators/hourly-to-salary-calculator/", "description": "Estimate annual salary and pay-period equivalents from an hourly wage.", "inLanguage": "en", "provider": {"@id": "https://calchowmuch.com/#organization"}, "featureList": ["Annual salary estimate", "Monthly pay estimate", "Biweekly pay estimate", "Weekly pay estimate"], "keywords": "hourly to salary calculator, hourly wage to salary, hourly pay to annual salary", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}},
    {"@type": "BreadcrumbList", "@id": "https://calchowmuch.com/salary-calculators/hourly-to-salary-calculator/#breadcrumbs", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"}, {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"}, {"@type": "ListItem", "position": 3, "name": "Hourly to Salary Calculator", "item": "https://calchowmuch.com/salary-calculators/hourly-to-salary-calculator/"}]}
  ]
}
```

## FAQ Outline

1. How do you convert hourly pay to annual salary?
2. What assumptions affect the result most?
3. Can I estimate monthly and biweekly pay too?
4. Does this calculator include overtime?
5. Does the result include taxes?

## FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://calchowmuch.com/salary-calculators/hourly-to-salary-calculator/#faq",
  "mainEntity": [
    {"@type": "Question", "name": "How do you convert hourly pay to annual salary?", "acceptedAnswer": {"@type": "Answer", "text": "Multiply the hourly rate by hours worked per week and weeks worked per year."}},
    {"@type": "Question", "name": "What assumptions affect the result most?", "acceptedAnswer": {"@type": "Answer", "text": "Hours per week and weeks per year are the main assumptions because they determine the total number of paid hours."}},
    {"@type": "Question", "name": "Can I estimate monthly and biweekly pay too?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. The route can also show monthly, biweekly, and weekly equivalents after calculating annual salary."}},
    {"@type": "Question", "name": "Does this calculator include overtime?", "acceptedAnswer": {"@type": "Answer", "text": "No. It is designed for standard hourly-to-salary conversion rather than overtime-specific rules."}},
    {"@type": "Question", "name": "Does the result include taxes?", "acceptedAnswer": {"@type": "Answer", "text": "No. The result is a gross-pay estimate before taxes and deductions."}}
  ]
}
```

## Search Snippet Intro

Convert an hourly wage into annual salary, monthly pay, biweekly pay, and weekly pay using your own work schedule assumptions. This route estimates gross pay only and keeps the schedule inputs editable.

## Assumptions

- results are gross-pay estimates only
- annual salary is based on user-entered hours per week and weeks per year
- biweekly output assumes 26 pay periods and monthly output assumes 12 months
- overtime is not included in the default formula for this route

## Input Defaults

- `hours_per_week` recommended default: `40`
- `weeks_per_year` default: `52`
- retain the last valid values during the active session when practical

## Rounding Rules

- display all currency outputs to 2 decimal places
- keep internal calculations at full precision until final display

## Validation Rules

- do not calculate if hourly rate is missing or non-positive
- do not calculate if hours per week or weeks per year are missing or non-positive
- show inline validation and keep the last valid result visible until corrected

## Edge Cases

- part-time schedules such as 20 hours per week
- non-standard work years such as 48 or 50 weeks per year
- unusually high or low hourly rates
- users comparing different work schedules with the same hourly rate

## Worked Example

- hourly rate: `$25.00`
- hours per week: `40`
- weeks per year: `52`
- expected annual salary: `$52,000.00`
- expected monthly pay: `$4,333.33`
- expected biweekly pay: `$2,000.00`
- expected weekly pay: `$1,000.00`

## Result Hierarchy

1. annual salary hero result
2. monthly pay
3. biweekly pay
4. weekly pay
5. related conversion tools and FAQ

## Explanation Section Outline

1. what hourly-to-salary conversion means
2. formula breakdown
3. why hours per week and weeks per year matter
4. worked example
5. gross-pay-only notes
6. FAQ

## Internal Linking Placement

- place reverse-conversion and weekly-pay links below the main result block
- keep one related calculators section above FAQ
- include the parent hub link near the intro or related-tools area

## Schema Mapping Notes

- `Page title` maps to HTML `<title>`, `og:title`, and `twitter:title`
- `Meta description` maps to meta description, `og:description`, and `twitter:description`
- `Canonical URL` maps to the canonical link and `WebPage.url`
- `Route Intro` and `Search Snippet Intro` guide visible intro text and `WebPage.description`
- `SoftwareApplication.description` must stay aligned with the core hourly-to-salary promise
- `Breadcrumbs` maps to visible breadcrumbs and `BreadcrumbList`
- visible FAQ questions and answers must match FAQ schema in meaning and ideally in exact text

## Content Guardrails

- do not describe this route as take-home pay or net pay
- do not imply overtime is included by default
- do not introduce tax, payroll, or legal compliance claims
- do not hardcode region-specific work schedules as universal defaults

## Accessibility Notes

- each input requires a persistent label
- validation errors must be announced and tied to the correct field
- result updates should be exposed through a live-region pattern or equivalent
- keyboard focus order must move logically from inputs to result to related links to FAQ

## QA Checklist

- title, meta description, and canonical URL match the spec
- visible breadcrumbs match `BreadcrumbList`
- visible FAQ content matches FAQ schema
- default values use `40` hours and `52` weeks if defaults are implemented
- worked example returns the expected outputs after rounding
- invalid inputs block calculation and display clear errors

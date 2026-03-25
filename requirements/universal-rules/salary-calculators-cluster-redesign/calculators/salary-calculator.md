# Salary Calculator Child Route Spec

## Parent Plan

- `requirements/universal-rules/salary-calculators-cluster-redesign/ROLLOUT_PLAN.md`

## Route

- `/salary-calculators/salary-calculator/`

## Route Intro

Use this Salary Calculator to convert a pay amount across hourly, daily, weekly, biweekly, monthly, and annual views. It should act as the cluster’s broad, answer-first conversion page for users who know one pay frequency and need to see the others.

## SEO Metadata

- Page title: `Salary Calculator | Convert Hourly, Daily, Weekly, Monthly and Annual Pay`
- H1: `Salary Calculator`
- Meta description: `Convert a salary or pay rate across hourly, daily, weekly, biweekly, monthly, and annual amounts using your work schedule assumptions.`
- Canonical URL: `https://calchowmuch.com/salary-calculators/salary-calculator/`

## Search Intent

- Primary intent: utility and broad conversion
- Searcher goal: turn one pay format into all major pay frequencies
- expected user inputs: known pay amount, pay frequency, and work schedule assumptions
- SERP angle: broad salary-conversion page with exact outputs and clear assumptions

## Search Snippet Intro

Convert a salary or pay amount into hourly, daily, weekly, biweekly, monthly, and annual views using your own work schedule assumptions. This route is designed for gross-pay comparisons, not tax withholding or payroll deductions.

## Keyword Strategy

### Primary Keywords

- salary calculator
- pay calculator
- salary conversion calculator

### Secondary Keywords

- annual salary calculator
- monthly salary calculator
- weekly salary calculator
- daily pay calculator
- biweekly pay calculator
- convert salary to hourly
- convert hourly to salary

## Breadcrumbs

- Home
- Salary Calculators
- Salary Calculator

### Breadcrumb JSON-LD

```json
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
      "name": "Salary Calculators",
      "item": "https://calchowmuch.com/salary-calculators/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Salary Calculator",
      "item": "https://calchowmuch.com/salary-calculators/salary-calculator/"
    }
  ]
}
```

## Internal Calculator Mesh

### Primary Links Out

- `/salary-calculators/hourly-to-salary-calculator/`
- `/salary-calculators/salary-to-hourly-calculator/`
- `/salary-calculators/annual-to-monthly-salary-calculator/`
- `/salary-calculators/monthly-to-annual-salary-calculator/`
- `/salary-calculators/weekly-pay-calculator/`
- `/salary-calculators/raise-calculator/`

### Parent and Cluster Links

- `/salary-calculators/`

### Link Placement Guidance

- place related conversion links immediately below the main result area
- keep one related-links block above FAQ for discovery continuity
- avoid pushing all related routes below the full FAQ section

## Formula Table

| Output | Formula | Inputs | Notes |
|---|---|---|---|
| Annual pay | `hourlyRate x hoursPerWeek x weeksPerYear` | hourlyRate, hoursPerWeek, weeksPerYear | Used when source frequency is hourly |
| Monthly pay | `annualPay / 12` | annualPay | Standard monthly conversion |
| Biweekly pay | `annualPay / 26` | annualPay | Uses 26 pay periods |
| Weekly pay | `annualPay / weeksPerYear` | annualPay, weeksPerYear | Default weeks should remain editable |
| Daily pay | `weeklyPay / daysPerWeek` | weeklyPay, daysPerWeek | Daily estimate based on user workdays |
| Hourly rate | `annualPay / weeksPerYear / hoursPerWeek` | annualPay, weeksPerYear, hoursPerWeek | Reverse conversion |

## Calculator Input-Output Schema

```yaml
calculatorId: salary-calculator
route: /salary-calculators/salary-calculator/
routeArchetype: calc_exp
designFamily: neutral
paneLayout: single
inputs:
  - id: pay_amount
    label: Pay amount
    type: currency
    required: true
  - id: pay_frequency
    label: Pay frequency
    type: radio-group
    required: true
    options: [hourly, daily, weekly, biweekly, monthly, annual]
  - id: hours_per_week
    label: Hours per week
    type: number
    requiredWhen: pay_frequency in [hourly, annual]
  - id: weeks_per_year
    label: Weeks per year
    type: number
    requiredWhen: pay_frequency in [hourly, annual, weekly]
    defaultValue: 52
  - id: days_per_week
    label: Days per week
    type: number
    requiredWhen: daily output is shown
    defaultValue: 5
outputs:
  - id: hourly_pay
    label: Hourly pay
    format: currency
  - id: daily_pay
    label: Daily pay
    format: currency
  - id: weekly_pay
    label: Weekly pay
    format: currency
  - id: biweekly_pay
    label: Biweekly pay
    format: currency
  - id: monthly_pay
    label: Monthly pay
    format: currency
  - id: annual_pay
    label: Annual pay
    format: currency
validation:
  - pay_amount > 0
  - hours_per_week > 0 when present
  - weeks_per_year > 0 when present
  - days_per_week between 1 and 7 when present
```

## Assumptions

- all results are gross-pay estimates only
- pay-period conversions rely on user-entered hours, days, and weeks assumptions
- monthly output uses 12 months and biweekly output uses 26 pay periods
- no taxes, deductions, bonuses, overtime, or payroll withholding are included unless entered on another dedicated route

## Input Defaults

- if implementation requires a starting frequency, default to `annual`
- `weeks_per_year` default is `52`
- `days_per_week` default is `5`
- persist the last valid entered assumptions during the current page session where practical

## Rounding Rules

- display all currency outputs to 2 decimal places
- if any percent value is shown, display it to 2 decimal places
- keep internal calculations at full precision until final display rounding

## Validation Rules

- do not calculate until all required inputs for the chosen frequency are valid
- reject negative pay, negative hours, negative days, and non-positive weeks per year
- show inline validation near the affected field and keep prior valid results visible until corrected
- prevent `days_per_week` values outside the `1` to `7` range

## Edge Cases

- part-time schedules with low weekly hours
- non-standard work years such as `50` or `48` weeks per year
- six-day or seven-day workweeks for daily pay estimates
- source frequency changes after a valid result has already been shown

## Worked Example

- input pay amount: `$25.00`
- input frequency: `hourly`
- hours per week: `40`
- weeks per year: `52`
- days per week: `5`
- expected annual pay: `$52,000.00`
- expected monthly pay: `$4,333.33`
- expected biweekly pay: `$2,000.00`
- expected weekly pay: `$1,000.00`
- expected daily pay: `$200.00`

## Result Hierarchy

1. hero result group showing the main conversion set
2. annual and monthly outputs emphasized first for broad salary intent
3. biweekly, weekly, daily, and hourly supporting outputs
4. related calculator links
5. FAQ and notes

## Explanation Section Outline

1. what this salary calculator does
2. how pay frequencies are converted
3. why hours, days, and weeks assumptions matter
4. worked example
5. important notes about gross pay and assumptions
6. FAQ

## JSON-LD Package

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://calchowmuch.com/#website",
      "url": "https://calchowmuch.com/",
      "name": "CalcHowMuch",
      "inLanguage": "en"
    },
    {
      "@type": "Organization",
      "@id": "https://calchowmuch.com/#organization",
      "name": "CalcHowMuch",
      "url": "https://calchowmuch.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://calchowmuch.com/assets/images/og-default.png"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://calchowmuch.com/salary-calculators/salary-calculator/#webpage",
      "name": "Salary Calculator | Convert Hourly, Daily, Weekly, Monthly and Annual Pay",
      "url": "https://calchowmuch.com/salary-calculators/salary-calculator/",
      "description": "Convert a salary or pay rate across hourly, daily, weekly, biweekly, monthly, and annual amounts using your work schedule assumptions.",
      "isPartOf": {
        "@id": "https://calchowmuch.com/#website"
      },
      "publisher": {
        "@id": "https://calchowmuch.com/#organization"
      },
      "inLanguage": "en"
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://calchowmuch.com/salary-calculators/salary-calculator/#softwareapplication",
      "name": "Salary Calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "url": "https://calchowmuch.com/salary-calculators/salary-calculator/",
      "description": "Convert pay across hourly, daily, weekly, biweekly, monthly, and annual salary formats.",
      "inLanguage": "en",
      "provider": {
        "@id": "https://calchowmuch.com/#organization"
      },
      "featureList": [
        "Hourly to annual conversion",
        "Annual to hourly conversion",
        "Monthly and biweekly views",
        "User-controlled work schedule assumptions"
      ],
      "keywords": "salary calculator, pay calculator, annual salary calculator, hourly salary conversion",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://calchowmuch.com/salary-calculators/salary-calculator/#breadcrumbs",
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
          "name": "Salary Calculators",
          "item": "https://calchowmuch.com/salary-calculators/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Salary Calculator",
          "item": "https://calchowmuch.com/salary-calculators/salary-calculator/"
        }
      ]
    }
  ]
}
```

## FAQ Outline

1. What does a salary calculator do?
2. Can I convert hourly pay to annual salary?
3. Can I estimate daily and weekly pay too?
4. Does this calculator include taxes or deductions?
5. Why do hours per week and weeks per year matter?

## FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://calchowmuch.com/salary-calculators/salary-calculator/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does a salary calculator do?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It converts a pay amount between hourly, daily, weekly, biweekly, monthly, and annual formats using your work schedule assumptions."
      }
    },
    {
      "@type": "Question",
      "name": "Can I convert hourly pay to annual salary?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The calculator can estimate annual pay from an hourly rate using your hours per week and weeks per year."
      }
    },
    {
      "@type": "Question",
      "name": "Can I estimate daily and weekly pay too?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The calculator can show daily, weekly, biweekly, monthly, and annual views from the same pay input."
      }
    },
    {
      "@type": "Question",
      "name": "Does this calculator include taxes or deductions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. This route estimates gross pay only and does not include tax withholding or payroll deductions."
      }
    },
    {
      "@type": "Question",
      "name": "Why do hours per week and weeks per year matter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Those assumptions determine how hourly and annual amounts are converted, so different schedules can change the result."
      }
    }
  ]
}
```

## Schema Mapping Notes

- `Page title` is the source of truth for HTML `<title>`, `og:title`, and `twitter:title`
- `Meta description` is the source of truth for meta description, `og:description`, and `twitter:description`
- `Canonical URL` is the source of truth for the canonical link and `WebPage.url`
- `Route Intro` and `Search Snippet Intro` guide visible intro copy and `WebPage.description`
- `SoftwareApplication.description` must remain a short calculator-purpose sentence that matches the visible calculator promise
- `Breadcrumbs` is the source of truth for visible breadcrumbs and `BreadcrumbList`
- visible FAQ questions and answers must match `FAQPage.mainEntity` exactly in meaning, and preferably exactly in text

## Content Guardrails

- do not imply take-home pay, net pay, or payroll deductions
- do not imply legal, tax, or employment advice
- do not introduce bonuses, overtime, or commission into this route’s default calculations
- do not change pay-period assumptions silently without surfacing them to the user

## Accessibility Notes

- every input must have a persistent visible label
- validation errors must be announced programmatically and remain associated with the relevant field
- result updates should be exposed through an accessible live region or equivalent result announcement pattern
- keyboard users must be able to reach inputs, calculate action, results, related links, and FAQ in a logical order

## QA Checklist

- title, meta description, and canonical URL match the spec exactly
- visible breadcrumb labels and schema breadcrumb labels match exactly
- visible FAQ content matches FAQ schema exactly
- default assumptions match `weeks_per_year = 52` and `days_per_week = 5`
- worked example returns the expected values after rounding
- invalid inputs block calculation and show clear errors
- related routes appear in the planned placement
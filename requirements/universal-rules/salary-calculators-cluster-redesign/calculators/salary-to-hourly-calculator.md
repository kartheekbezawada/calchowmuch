# Salary to Hourly Calculator Child Route Spec

## Parent Plan

- `requirements/universal-rules/salary-calculators-cluster-redesign/ROLLOUT_PLAN.md`

## Route

- `/salary-calculators/salary-to-hourly-calculator/`

## Route Intro

Use this Salary to Hourly Calculator to estimate an hourly rate from an annual salary. It is the reverse-conversion route for users who know their annual compensation and want to understand what it means as an hourly rate, weekly pay, biweekly pay, and monthly pay.

## SEO Metadata

- Page title: `Salary to Hourly Calculator | Convert Annual Salary to Hourly Pay`
- H1: `Salary to Hourly Calculator`
- Meta description: `Convert annual salary into hourly pay, weekly pay, biweekly pay, and monthly pay using your hours worked and weeks per year.`
- Canonical URL: `https://calchowmuch.com/salary-calculators/salary-to-hourly-calculator/`

## Search Intent

- Primary intent: exact-match reverse conversion utility
- Searcher goal: estimate an hourly rate from a salary figure
- SERP angle: annual salary to hourly conversion with editable schedule assumptions

## Keyword Strategy

### Primary Keywords

- salary to hourly calculator
- annual salary to hourly calculator
- annual pay to hourly rate

### Secondary Keywords

- hourly rate from salary
- salary to hourly wage
- yearly salary to hourly pay
- convert salary to hourly rate

## Breadcrumbs

- Home
- Salary Calculators
- Salary to Hourly Calculator

### Breadcrumb JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"},
    {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"},
    {"@type": "ListItem", "position": 3, "name": "Salary to Hourly Calculator", "item": "https://calchowmuch.com/salary-calculators/salary-to-hourly-calculator/"}
  ]
}
```

## Internal Calculator Mesh

- Parent hub: `/salary-calculators/`
- Related routes:
  - `/salary-calculators/salary-calculator/`
  - `/salary-calculators/hourly-to-salary-calculator/`
  - `/salary-calculators/annual-to-monthly-salary-calculator/`
  - `/salary-calculators/monthly-to-annual-salary-calculator/`
  - `/salary-calculators/weekly-pay-calculator/`

## Formula Table

| Output | Formula | Inputs | Notes |
|---|---|---|---|
| Hourly rate | `annualSalary / weeksPerYear / hoursPerWeek` | annualSalary, weeksPerYear, hoursPerWeek | Primary result |
| Weekly pay | `annualSalary / weeksPerYear` | annualSalary, weeksPerYear | Secondary result |
| Biweekly pay | `annualSalary / 26` | annualSalary | Assumes 26 pay periods |
| Monthly pay | `annualSalary / 12` | annualSalary | Standard conversion |

## Calculator Input-Output Schema

```yaml
calculatorId: salary-to-hourly-calculator
route: /salary-calculators/salary-to-hourly-calculator/
routeArchetype: calc_exp
designFamily: neutral
paneLayout: single
inputs:
  - id: annual_salary
    label: Annual salary
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
  - id: hourly_rate
    label: Hourly rate
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
validation:
  - annual_salary > 0
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
    {"@type": "WebPage", "@id": "https://calchowmuch.com/salary-calculators/salary-to-hourly-calculator/#webpage", "name": "Salary to Hourly Calculator | Convert Annual Salary to Hourly Pay", "url": "https://calchowmuch.com/salary-calculators/salary-to-hourly-calculator/", "description": "Convert annual salary into hourly pay, weekly pay, biweekly pay, and monthly pay using your hours worked and weeks per year.", "isPartOf": {"@id": "https://calchowmuch.com/#website"}, "publisher": {"@id": "https://calchowmuch.com/#organization"}, "inLanguage": "en"},
    {"@type": "SoftwareApplication", "@id": "https://calchowmuch.com/salary-calculators/salary-to-hourly-calculator/#softwareapplication", "name": "Salary to Hourly Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "url": "https://calchowmuch.com/salary-calculators/salary-to-hourly-calculator/", "description": "Estimate an hourly rate from an annual salary and work schedule assumptions.", "inLanguage": "en", "provider": {"@id": "https://calchowmuch.com/#organization"}, "featureList": ["Annual salary to hourly conversion", "Weekly pay estimate", "Biweekly pay estimate", "Monthly pay estimate"], "keywords": "salary to hourly calculator, annual salary to hourly pay, hourly rate from salary", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}},
    {"@type": "BreadcrumbList", "@id": "https://calchowmuch.com/salary-calculators/salary-to-hourly-calculator/#breadcrumbs", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"}, {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"}, {"@type": "ListItem", "position": 3, "name": "Salary to Hourly Calculator", "item": "https://calchowmuch.com/salary-calculators/salary-to-hourly-calculator/"}]}
  ]
}
```

## FAQ Outline

1. How do you convert salary to hourly pay?
2. Why does hours per week affect the result?
3. Can I also see weekly and monthly pay?
4. Does this work for part-time schedules?
5. Does this include taxes?

## FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://calchowmuch.com/salary-calculators/salary-to-hourly-calculator/#faq",
  "mainEntity": [
    {"@type": "Question", "name": "How do you convert salary to hourly pay?", "acceptedAnswer": {"@type": "Answer", "text": "Divide the annual salary by weeks worked per year and then divide again by hours worked per week."}},
    {"@type": "Question", "name": "Why does hours per week affect the result?", "acceptedAnswer": {"@type": "Answer", "text": "Because the same salary spread across more or fewer hours produces a different hourly rate."}},
    {"@type": "Question", "name": "Can I also see weekly and monthly pay?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. Weekly, biweekly, and monthly pay can be shown alongside the hourly estimate."}},
    {"@type": "Question", "name": "Does this work for part-time schedules?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. The calculation works for any schedule as long as you enter your own hours per week and weeks per year."}},
    {"@type": "Question", "name": "Does this include taxes?", "acceptedAnswer": {"@type": "Answer", "text": "No. The calculator estimates gross hourly pay only."}}
  ]
}
```

## Search Snippet Intro

Convert an annual salary into hourly pay, weekly pay, biweekly pay, and monthly pay using your own schedule assumptions. This route estimates gross earnings only and keeps workweek inputs editable.

## Assumptions

- results are gross-pay estimates only
- hourly rate depends on both hours per week and weeks per year
- monthly output assumes 12 months and biweekly output assumes 26 pay periods
- overtime, bonuses, and deductions are out of scope for this route

## Input Defaults

- `hours_per_week` recommended default: `40`
- `weeks_per_year` default: `52`
- keep the last valid schedule assumptions during the current session where practical

## Rounding Rules

- display all currency outputs to 2 decimal places
- keep internal calculations at full precision until final output formatting

## Validation Rules

- do not calculate if annual salary is missing or non-positive
- do not calculate if hours per week or weeks per year are missing or non-positive
- show inline validation and preserve the last valid result until correction

## Edge Cases

- part-time schedules with fewer weekly hours
- non-standard work years below 52 weeks
- annual salaries entered as round numbers with uneven monthly or hourly outputs
- users testing different schedules against the same salary

## Worked Example

- annual salary: `$52,000.00`
- hours per week: `40`
- weeks per year: `52`
- expected hourly rate: `$25.00`
- expected weekly pay: `$1,000.00`
- expected biweekly pay: `$2,000.00`
- expected monthly pay: `$4,333.33`

## Result Hierarchy

1. hourly rate hero result
2. weekly pay
3. biweekly pay
4. monthly pay
5. related conversion tools and FAQ

## Explanation Section Outline

1. what salary-to-hourly conversion means
2. formula breakdown
3. why schedule assumptions affect the hourly result
4. worked example
5. gross-pay-only notes
6. FAQ

## Internal Linking Placement

- place hourly-to-salary and salary hub links directly below the result group
- keep adjacent pay-frequency routes above FAQ
- avoid isolating related links below the full FAQ block

## Schema Mapping Notes

- `Page title` maps to HTML `<title>`, `og:title`, and `twitter:title`
- `Meta description` maps to meta description, `og:description`, and `twitter:description`
- `Canonical URL` maps to the canonical link and `WebPage.url`
- `Route Intro` and `Search Snippet Intro` guide visible intro text and `WebPage.description`
- `SoftwareApplication.description` must stay aligned with the reverse-conversion purpose
- `Breadcrumbs` maps to visible breadcrumbs and `BreadcrumbList`
- visible FAQ content must match FAQ schema in meaning and preferably in exact text

## Content Guardrails

- do not imply take-home pay or payroll deductions
- do not imply overtime is already embedded in annual salary
- do not add legal or tax framing
- do not hide the schedule assumptions that materially change the result

## Accessibility Notes

- every field must have a persistent label
- errors must be programmatically tied to the relevant input
- result changes should be announced to assistive technology
- keyboard users must be able to move from inputs to results and related links without traps

## QA Checklist

- title, meta description, and canonical URL match the spec
- visible breadcrumbs match `BreadcrumbList`
- visible FAQ content matches FAQ schema
- default values use `40` hours and `52` weeks if defaults are implemented
- worked example returns the expected outputs after rounding
- invalid inputs block calculation and show clear errors

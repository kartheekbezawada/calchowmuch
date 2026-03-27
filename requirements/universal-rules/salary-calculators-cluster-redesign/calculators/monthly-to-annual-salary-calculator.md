# Monthly to Annual Salary Calculator Child Route Spec

## Parent Plan

- `requirements/universal-rules/salary-calculators-cluster-redesign/ROLLOUT_PLAN.md`
- `requirements/universal-rules/salary-calculators-cluster-redesign/DESIGN_SYSTEM.md`

## Route

- `/salary-calculators/monthly-to-annual-salary-calculator/`

## Route Intro

Use this Monthly to Annual Salary Calculator to estimate yearly salary from a monthly pay figure. It serves users who want to reverse a monthly income into annual, biweekly, and weekly equivalents without introducing tax or payroll assumptions.

## Route Design Contract

- Inherit the shared salary design baseline from `DESIGN_SYSTEM.md`.
- Use the `conversion` route variant in a fully light, answer-first layout.
- Keep the hero result focused on annual salary only.
- Limit the first supporting result row to biweekly pay and weekly pay.
- Keep explanation, FAQ, and related calculators below the primary answer area.

## SEO Metadata

- Page title: `Monthly to Annual Salary Calculator | Convert Monthly Pay to Yearly Salary`
- H1: `Monthly to Annual Salary Calculator`
- Meta description: `Convert monthly salary into annual pay, with optional biweekly and weekly estimates based on your monthly income.`
- Canonical URL: `https://calchowmuch.com/salary-calculators/monthly-to-annual-salary-calculator/`

## Search Intent

- Primary intent: exact-match reverse pay-frequency conversion
- Searcher goal: estimate annual salary from monthly income
- SERP angle: direct monthly-to-yearly conversion with supporting pay-period views

## Keyword Strategy

### Primary Keywords

- monthly to annual salary calculator
- monthly salary to annual salary
- monthly pay to yearly salary

### Secondary Keywords

- annual salary from monthly income
- monthly income to annual income
- monthly pay to biweekly pay
- monthly pay to weekly pay

## Breadcrumbs

- Home
- Salary Calculators
- Monthly to Annual Salary Calculator

### Breadcrumb JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"},
    {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"},
    {"@type": "ListItem", "position": 3, "name": "Monthly to Annual Salary Calculator", "item": "https://calchowmuch.com/salary-calculators/monthly-to-annual-salary-calculator/"}
  ]
}
```

## Internal Calculator Mesh

- Parent hub: `/salary-calculators/`
- Related routes:
  - `/salary-calculators/annual-to-monthly-salary-calculator/`
  - `/salary-calculators/salary-calculator/`
  - `/salary-calculators/salary-to-hourly-calculator/`
  - `/salary-calculators/weekly-pay-calculator/`

## Formula Table

| Output | Formula | Inputs | Notes |
|---|---|---|---|
| Annual salary | `monthlySalary x 12` | monthlySalary | Primary result |
| Biweekly pay | `annualSalary / 26` | annualSalary | Optional secondary output |
| Weekly pay | `annualSalary / weeksPerYear` | annualSalary, weeksPerYear | Optional secondary output |

## Calculator Input-Output Schema

```yaml
calculatorId: monthly-to-annual-salary-calculator
route: /salary-calculators/monthly-to-annual-salary-calculator/
routeArchetype: calc_exp
designFamily: neutral
paneLayout: single
inputs:
  - id: monthly_salary
    label: Monthly salary
    type: currency
    required: true
  - id: weeks_per_year
    label: Weeks per year
    type: number
    requiredWhen: weekly output is shown
    defaultValue: 52
outputs:
  - id: annual_salary
    label: Annual salary
    format: currency
  - id: biweekly_pay
    label: Biweekly pay
    format: currency
  - id: weekly_pay
    label: Weekly pay
    format: currency
validation:
  - monthly_salary > 0
  - weeks_per_year > 0 when present
```

## JSON-LD Package

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {"@type": "WebSite", "@id": "https://calchowmuch.com/#website", "url": "https://calchowmuch.com/", "name": "CalcHowMuch", "inLanguage": "en"},
    {"@type": "Organization", "@id": "https://calchowmuch.com/#organization", "name": "CalcHowMuch", "url": "https://calchowmuch.com/", "logo": {"@type": "ImageObject", "url": "https://calchowmuch.com/assets/images/og-default.png"}},
    {"@type": "WebPage", "@id": "https://calchowmuch.com/salary-calculators/monthly-to-annual-salary-calculator/#webpage", "name": "Monthly to Annual Salary Calculator | Convert Monthly Pay to Yearly Salary", "url": "https://calchowmuch.com/salary-calculators/monthly-to-annual-salary-calculator/", "description": "Convert monthly salary into annual pay, with optional biweekly and weekly estimates based on your monthly income.", "isPartOf": {"@id": "https://calchowmuch.com/#website"}, "publisher": {"@id": "https://calchowmuch.com/#organization"}, "inLanguage": "en"},
    {"@type": "SoftwareApplication", "@id": "https://calchowmuch.com/salary-calculators/monthly-to-annual-salary-calculator/#softwareapplication", "name": "Monthly to Annual Salary Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "url": "https://calchowmuch.com/salary-calculators/monthly-to-annual-salary-calculator/", "description": "Convert monthly pay into yearly salary and related pay-period views.", "inLanguage": "en", "provider": {"@id": "https://calchowmuch.com/#organization"}, "featureList": ["Annual salary estimate", "Biweekly pay estimate", "Weekly pay estimate"], "keywords": "monthly to annual salary calculator, monthly pay to yearly salary, annual salary from monthly income", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}},
    {"@type": "BreadcrumbList", "@id": "https://calchowmuch.com/salary-calculators/monthly-to-annual-salary-calculator/#breadcrumbs", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"}, {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"}, {"@type": "ListItem", "position": 3, "name": "Monthly to Annual Salary Calculator", "item": "https://calchowmuch.com/salary-calculators/monthly-to-annual-salary-calculator/"}]}
  ]
}
```

## FAQ Outline

1. How do you convert monthly salary to annual pay?
2. Is yearly salary just monthly pay times 12?
3. Can this show weekly or biweekly pay too?
4. Does this include bonuses or overtime?
5. Does it show net income?

## FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://calchowmuch.com/salary-calculators/monthly-to-annual-salary-calculator/#faq",
  "mainEntity": [
    {"@type": "Question", "name": "How do you convert monthly salary to annual pay?", "acceptedAnswer": {"@type": "Answer", "text": "Multiply the monthly salary by 12 to estimate annual pay."}},
    {"@type": "Question", "name": "Is yearly salary just monthly pay times 12?", "acceptedAnswer": {"@type": "Answer", "text": "For a simple gross-pay estimate, yes. That is the standard monthly-to-annual conversion."}},
    {"@type": "Question", "name": "Can this show weekly or biweekly pay too?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. Weekly and biweekly views can be shown as supporting outputs."}},
    {"@type": "Question", "name": "Does this include bonuses or overtime?", "acceptedAnswer": {"@type": "Answer", "text": "No. The route converts the monthly pay figure you enter and does not automatically include bonus or overtime assumptions."}},
    {"@type": "Question", "name": "Does it show net income?", "acceptedAnswer": {"@type": "Answer", "text": "No. It estimates gross annual salary before taxes and deductions."}}
  ]
}
```

## Search Snippet Intro

Convert monthly pay into annual salary instantly, with optional weekly and biweekly views. This route focuses on gross pay only and keeps the supporting assumptions explicit.

## Assumptions

- results are gross-pay estimates only
- annual salary is calculated as monthly salary multiplied by 12
- biweekly output assumes 26 pay periods
- weekly output depends on user-entered weeks per year when shown

## Input Defaults

- `weeks_per_year` default: `52` when weekly output is enabled
- monthly salary field has no hardcoded monetary default

## Rounding Rules

- display all currency outputs to 2 decimal places
- keep internal precision until final output formatting

## Validation Rules

- do not calculate if monthly salary is missing or non-positive
- do not calculate weekly output if weeks per year is missing or non-positive
- preserve the last valid result while invalid entries are being corrected

## Edge Cases

- small monthly salaries
- monthly salaries that produce repeating annualized decimals only after downstream conversions
- non-standard work years for weekly output
- users comparing monthly income scenarios side by side

## Worked Example

- monthly salary: `$5,000.00`
- weeks per year: `52`
- expected annual salary: `$60,000.00`
- expected biweekly pay: `$2,307.69`
- expected weekly pay: `$1,153.85`

## Result Hierarchy

1. annual salary hero result
2. biweekly pay
3. weekly pay
4. related conversion tools and FAQ

## Explanation Section Outline

1. what monthly-to-annual conversion means
2. formula breakdown
3. why weekly output depends on work-year assumptions
4. worked example
5. gross-pay-only notes
6. FAQ

## Internal Linking Placement

- place the annual-to-monthly reverse route directly below results
- keep salary-calculator and weekly-pay links in the related links block above FAQ
- maintain a parent hub link in the related tools block

## Schema Mapping Notes

- `Page title` maps to HTML `<title>`, `og:title`, and `twitter:title`
- `Meta description` maps to meta description, `og:description`, and `twitter:description`
- `Canonical URL` maps to the canonical link and `WebPage.url`
- `Route Intro` and `Search Snippet Intro` guide visible intro text and `WebPage.description`
- `SoftwareApplication.description` must remain a short monthly-to-annual conversion summary
- `Breadcrumbs` maps to visible breadcrumbs and `BreadcrumbList`
- visible FAQ content must match FAQ schema in meaning and preferably in exact text

## Content Guardrails

- do not imply annual take-home pay or net pay
- do not introduce payroll deductions, tax rules, or bonus assumptions
- do not overstate weekly output precision when weeks per year is user-controlled
- do not present monthly salary as equivalent to paycheck timing

## Accessibility Notes

- input labels must remain visible and persistent
- validation states must be announced programmatically
- result updates should be accessible to assistive technology
- keyboard order must stay logical from inputs to results to related links to FAQ

## QA Checklist

- title, meta description, and canonical URL match the spec
- visible breadcrumbs match `BreadcrumbList`
- visible FAQ content matches FAQ schema in meaning and preferably in exact text
- `weeks_per_year` defaults to `52` if weekly output is enabled by default
- worked example returns the expected outputs after rounding
- invalid salary or weekly assumption states block calculation cleanly

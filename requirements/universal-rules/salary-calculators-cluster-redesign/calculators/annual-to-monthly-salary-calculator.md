# Annual to Monthly Salary Calculator Child Route Spec

## Parent Plan

- `requirements/universal-rules/salary-calculators-cluster-redesign/ROLLOUT_PLAN.md`
- `requirements/universal-rules/salary-calculators-cluster-redesign/DESIGN_SYSTEM.md`

## Route

- `/salary-calculators/annual-to-monthly-salary-calculator/`

## Route Intro

Use this Annual to Monthly Salary Calculator to turn yearly pay into a monthly income estimate. It is the exact route for users who know their annual salary and want a fast monthly figure, with optional supporting outputs for biweekly and weekly pay.

## Route Design Contract

- Inherit the shared salary design baseline from `DESIGN_SYSTEM.md`.
- Use the `conversion` route variant in a fully light, answer-first layout.
- Keep the first screen focused on one primary monthly-pay answer with minimal surrounding copy.
- Limit the first supporting result row to biweekly pay and weekly pay.
- Keep explanation, FAQ, and related calculators below the primary answer area.

## SEO Metadata

- Page title: `Annual to Monthly Salary Calculator | Convert Yearly Pay to Monthly`
- H1: `Annual to Monthly Salary Calculator`
- Meta description: `Convert annual salary into monthly pay, with optional biweekly and weekly estimates based on your yearly income.`
- Canonical URL: `https://calchowmuch.com/salary-calculators/annual-to-monthly-salary-calculator/`

## Search Intent

- Primary intent: exact-match pay-frequency conversion
- Searcher goal: get monthly pay from a yearly salary fast
- SERP angle: straightforward annual-to-monthly conversion with no tax complexity

## Keyword Strategy

### Primary Keywords

- annual to monthly salary calculator
- yearly to monthly salary calculator
- annual salary to monthly pay

### Secondary Keywords

- yearly income to monthly income
- monthly salary from annual pay
- annual pay to biweekly pay
- annual pay to weekly pay

## Breadcrumbs

- Home
- Salary Calculators
- Annual to Monthly Salary Calculator

### Breadcrumb JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"},
    {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"},
    {"@type": "ListItem", "position": 3, "name": "Annual to Monthly Salary Calculator", "item": "https://calchowmuch.com/salary-calculators/annual-to-monthly-salary-calculator/"}
  ]
}
```

## Internal Calculator Mesh

- Parent hub: `/salary-calculators/`
- Related routes:
  - `/salary-calculators/monthly-to-annual-salary-calculator/`
  - `/salary-calculators/salary-calculator/`
  - `/salary-calculators/salary-to-hourly-calculator/`
  - `/salary-calculators/weekly-pay-calculator/`

## Formula Table

| Output | Formula | Inputs | Notes |
|---|---|---|---|
| Monthly salary | `annualSalary / 12` | annualSalary | Primary result |
| Biweekly pay | `annualSalary / 26` | annualSalary | Optional secondary output |
| Weekly pay | `annualSalary / weeksPerYear` | annualSalary, weeksPerYear | Optional secondary output |

## Calculator Input-Output Schema

```yaml
calculatorId: annual-to-monthly-salary-calculator
route: /salary-calculators/annual-to-monthly-salary-calculator/
routeArchetype: calc_exp
designFamily: neutral
paneLayout: single
inputs:
  - id: annual_salary
    label: Annual salary
    type: currency
    required: true
  - id: weeks_per_year
    label: Weeks per year
    type: number
    requiredWhen: weekly output is shown
    defaultValue: 52
outputs:
  - id: monthly_salary
    label: Monthly salary
    format: currency
  - id: biweekly_pay
    label: Biweekly pay
    format: currency
  - id: weekly_pay
    label: Weekly pay
    format: currency
validation:
  - annual_salary > 0
  - weeks_per_year > 0 when present
```

## JSON-LD Package

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {"@type": "WebSite", "@id": "https://calchowmuch.com/#website", "url": "https://calchowmuch.com/", "name": "CalcHowMuch", "inLanguage": "en"},
    {"@type": "Organization", "@id": "https://calchowmuch.com/#organization", "name": "CalcHowMuch", "url": "https://calchowmuch.com/", "logo": {"@type": "ImageObject", "url": "https://calchowmuch.com/assets/images/og-default.png"}},
    {"@type": "WebPage", "@id": "https://calchowmuch.com/salary-calculators/annual-to-monthly-salary-calculator/#webpage", "name": "Annual to Monthly Salary Calculator | Convert Yearly Pay to Monthly", "url": "https://calchowmuch.com/salary-calculators/annual-to-monthly-salary-calculator/", "description": "Convert annual salary into monthly pay, with optional biweekly and weekly estimates based on your yearly income.", "isPartOf": {"@id": "https://calchowmuch.com/#website"}, "publisher": {"@id": "https://calchowmuch.com/#organization"}, "inLanguage": "en"},
    {"@type": "SoftwareApplication", "@id": "https://calchowmuch.com/salary-calculators/annual-to-monthly-salary-calculator/#softwareapplication", "name": "Annual to Monthly Salary Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "url": "https://calchowmuch.com/salary-calculators/annual-to-monthly-salary-calculator/", "description": "Convert yearly pay into monthly salary and related pay-period views.", "inLanguage": "en", "provider": {"@id": "https://calchowmuch.com/#organization"}, "featureList": ["Monthly salary estimate", "Biweekly pay estimate", "Weekly pay estimate"], "keywords": "annual to monthly salary calculator, yearly to monthly pay, annual salary to monthly income", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}},
    {"@type": "BreadcrumbList", "@id": "https://calchowmuch.com/salary-calculators/annual-to-monthly-salary-calculator/#breadcrumbs", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"}, {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"}, {"@type": "ListItem", "position": 3, "name": "Annual to Monthly Salary Calculator", "item": "https://calchowmuch.com/salary-calculators/annual-to-monthly-salary-calculator/"}]}
  ]
}
```

## FAQ Outline

1. How do you convert annual salary to monthly pay?
2. Is monthly pay just annual salary divided by 12?
3. Can I also estimate biweekly pay?
4. Does this show net monthly income?
5. Why might my paycheck differ from the monthly estimate?

## FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://calchowmuch.com/salary-calculators/annual-to-monthly-salary-calculator/#faq",
  "mainEntity": [
    {"@type": "Question", "name": "How do you convert annual salary to monthly pay?", "acceptedAnswer": {"@type": "Answer", "text": "Divide the annual salary by 12 to estimate monthly pay."}},
    {"@type": "Question", "name": "Is monthly pay just annual salary divided by 12?", "acceptedAnswer": {"@type": "Answer", "text": "For a simple gross-pay estimate, yes. Additional payroll deductions or irregular payments are not included here."}},
    {"@type": "Question", "name": "Can I also estimate biweekly pay?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. The route can also show biweekly and weekly pay views from the same annual salary input."}},
    {"@type": "Question", "name": "Does this show net monthly income?", "acceptedAnswer": {"@type": "Answer", "text": "No. It estimates gross monthly salary before taxes and deductions."}},
    {"@type": "Question", "name": "Why might my paycheck differ from the monthly estimate?", "acceptedAnswer": {"@type": "Answer", "text": "Actual paychecks can differ because of pay schedule timing, deductions, benefits, bonuses, and other payroll adjustments."}}
  ]
}
```

## Search Snippet Intro

Convert annual salary into a monthly pay estimate instantly, with optional weekly and biweekly views. This route focuses on gross pay only and keeps supporting schedule assumptions transparent.

## Assumptions

- results are gross-pay estimates only
- monthly output assumes 12 equal months
- biweekly output assumes 26 pay periods
- weekly output depends on user-entered weeks per year when shown

## Input Defaults

- `weeks_per_year` default: `52` when weekly output is enabled
- annual salary field has no hardcoded monetary default

## Rounding Rules

- display all currency outputs to 2 decimal places
- maintain full internal precision until final display formatting

## Validation Rules

- do not calculate if annual salary is missing or non-positive
- do not calculate weekly output if weeks per year is missing or non-positive
- keep prior valid results visible until invalid entries are corrected

## Edge Cases

- very low annual salary values
- non-standard work years when weekly output is enabled
- annual salaries that create repeating monthly decimals
- users who only need monthly output and ignore weekly support fields

## Worked Example

- annual salary: `$60,000.00`
- weeks per year: `52`
- expected monthly salary: `$5,000.00`
- expected biweekly pay: `$2,307.69`
- expected weekly pay: `$1,153.85`

## Result Hierarchy

1. monthly salary hero result
2. biweekly pay
3. weekly pay
4. related conversion tools and FAQ

## Explanation Section Outline

1. what annual-to-monthly conversion means
2. formula breakdown
3. why weekly output can differ with non-standard work years
4. worked example
5. gross-pay-only notes
6. FAQ

## Internal Linking Placement

- place reverse monthly-to-annual link directly below the result group
- keep salary-calculator and weekly-pay links in the related section above FAQ
- maintain a clear parent hub link in the related tools block

## Schema Mapping Notes

- `Page title` maps to HTML `<title>`, `og:title`, and `twitter:title`
- `Meta description` maps to meta description, `og:description`, and `twitter:description`
- `Canonical URL` maps to the canonical link and `WebPage.url`
- `Route Intro` and `Search Snippet Intro` guide visible intro text and `WebPage.description`
- `SoftwareApplication.description` must remain a short annual-to-monthly conversion summary
- `Breadcrumbs` maps to visible breadcrumbs and `BreadcrumbList`
- visible FAQ content must match FAQ schema in meaning and preferably in exact text

## Content Guardrails

- do not imply monthly paycheck equals take-home pay
- do not introduce taxes, deductions, or payroll rules
- do not overstate weekly output precision when weeks per year is user-controlled
- do not blur this route with bonus or overtime logic

## Accessibility Notes

- input labels must remain visible
- validation states must be announced programmatically
- result updates should be announced accessibly
- keyboard focus order must remain linear from inputs to results to related links to FAQ

## QA Checklist

- title, meta description, and canonical URL match the spec
- visible breadcrumbs match `BreadcrumbList`
- visible FAQ content matches FAQ schema
- `weeks_per_year` defaults to `52` if weekly output is enabled by default
- worked example returns the expected outputs after rounding
- invalid annual salary or weekly assumption states block calculation cleanly

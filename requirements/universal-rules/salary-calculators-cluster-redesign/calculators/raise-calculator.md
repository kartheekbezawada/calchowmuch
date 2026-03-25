# Raise Calculator Child Route Spec

## Parent Plan

- `requirements/universal-rules/salary-calculators-cluster-redesign/ROLLOUT_PLAN.md`

## Route

- `/salary-calculators/raise-calculator/`

## Route Intro

Use this Raise Calculator to estimate new pay after a raise. It should support both percentage-based raises and flat-amount raises so users can compare current pay, raise amount, and resulting salary in one place.

## SEO Metadata

- Page title: `Raise Calculator | Calculate New Salary After a Pay Raise`
- H1: `Raise Calculator`
- Meta description: `Calculate a new salary after a raise using either a percentage increase or a flat raise amount.`
- Canonical URL: `https://calchowmuch.com/salary-calculators/raise-calculator/`

## Search Intent

- Primary intent: utility and compensation planning
- Searcher goal: estimate new pay after a raise
- SERP angle: simple raise planning tool for percent or amount increases

## Keyword Strategy

### Primary Keywords

- raise calculator
- salary raise calculator
- pay raise calculator

### Secondary Keywords

- percentage raise calculator
- salary increase calculator
- new salary after raise
- pay increase calculator

## Breadcrumbs

- Home
- Salary Calculators
- Raise Calculator

### Breadcrumb JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"},
    {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"},
    {"@type": "ListItem", "position": 3, "name": "Raise Calculator", "item": "https://calchowmuch.com/salary-calculators/raise-calculator/"}
  ]
}
```

## Internal Calculator Mesh

- Parent hub: `/salary-calculators/`
- Related routes:
  - `/salary-calculators/bonus-calculator/`
  - `/salary-calculators/salary-calculator/`
  - `/salary-calculators/overtime-pay-calculator/`
  - `/salary-calculators/commission-calculator/`

## Formula Table

| Output | Formula | Inputs | Notes |
|---|---|---|---|
| Raise amount | `currentSalary x raisePercent` | currentSalary, raisePercent | Percent mode |
| New salary | `currentSalary + raiseAmount` | currentSalary, raiseAmount | Flat or computed raise |
| New salary percent mode | `currentSalary x (1 + raisePercent)` | currentSalary, raisePercent | Direct percent formula |
| Percent increase | `(newSalary - currentSalary) / currentSalary x 100` | currentSalary, newSalary | Secondary output |

## Calculator Input-Output Schema

```yaml
calculatorId: raise-calculator
route: /salary-calculators/raise-calculator/
routeArchetype: calc_exp
designFamily: neutral
paneLayout: single
inputs:
  - id: current_salary
    label: Current salary
    type: currency
    required: true
  - id: raise_mode
    label: Raise mode
    type: radio-group
    required: true
    options: [percent, amount]
  - id: raise_percent
    label: Raise percent
    type: decimal
    requiredWhen: raise_mode = percent
  - id: raise_amount
    label: Raise amount
    type: currency
    requiredWhen: raise_mode = amount
outputs:
  - id: new_salary
    label: New salary
    format: currency
  - id: raise_amount_output
    label: Raise amount
    format: currency
  - id: percent_increase
    label: Percent increase
    format: percent
validation:
  - current_salary > 0
  - raise_percent >= 0 when present
  - raise_amount >= 0 when present
```

## JSON-LD Package

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {"@type": "WebSite", "@id": "https://calchowmuch.com/#website", "url": "https://calchowmuch.com/", "name": "CalcHowMuch", "inLanguage": "en"},
    {"@type": "Organization", "@id": "https://calchowmuch.com/#organization", "name": "CalcHowMuch", "url": "https://calchowmuch.com/", "logo": {"@type": "ImageObject", "url": "https://calchowmuch.com/assets/images/og-default.png"}},
    {"@type": "WebPage", "@id": "https://calchowmuch.com/salary-calculators/raise-calculator/#webpage", "name": "Raise Calculator | Calculate New Salary After a Pay Raise", "url": "https://calchowmuch.com/salary-calculators/raise-calculator/", "description": "Calculate a new salary after a raise using either a percentage increase or a flat raise amount.", "isPartOf": {"@id": "https://calchowmuch.com/#website"}, "publisher": {"@id": "https://calchowmuch.com/#organization"}, "inLanguage": "en"},
    {"@type": "SoftwareApplication", "@id": "https://calchowmuch.com/salary-calculators/raise-calculator/#softwareapplication", "name": "Raise Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "url": "https://calchowmuch.com/salary-calculators/raise-calculator/", "description": "Estimate new pay after a raise using either a percentage or flat increase.", "inLanguage": "en", "provider": {"@id": "https://calchowmuch.com/#organization"}, "featureList": ["Percent raise mode", "Flat raise mode", "New salary estimate", "Raise amount and percent outputs"], "keywords": "raise calculator, salary raise calculator, pay raise calculator", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}},
    {"@type": "BreadcrumbList", "@id": "https://calchowmuch.com/salary-calculators/raise-calculator/#breadcrumbs", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"}, {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"}, {"@type": "ListItem", "position": 3, "name": "Raise Calculator", "item": "https://calchowmuch.com/salary-calculators/raise-calculator/"}]}
  ]
}
```

## FAQ Outline

1. How do you calculate a raise?
2. Can I use a percent raise or a flat raise amount?
3. Does this show my new salary after the raise?
4. Can I see the raise amount separately?
5. Does this include taxes?

## FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://calchowmuch.com/salary-calculators/raise-calculator/#faq",
  "mainEntity": [
    {"@type": "Question", "name": "How do you calculate a raise?", "acceptedAnswer": {"@type": "Answer", "text": "You can either add a flat raise amount to current salary or multiply current salary by the raise percentage."}},
    {"@type": "Question", "name": "Can I use a percent raise or a flat raise amount?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. The route should support both modes."}},
    {"@type": "Question", "name": "Does this show my new salary after the raise?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. The main result is the new salary after applying the raise."}},
    {"@type": "Question", "name": "Can I see the raise amount separately?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. The output should include the raise amount and the resulting percent increase."}},
    {"@type": "Question", "name": "Does this include taxes?", "acceptedAnswer": {"@type": "Answer", "text": "No. It estimates gross pay changes only."}}
  ]
}
```

## Search Snippet Intro

Estimate new salary after a raise using either a percentage increase or a flat raise amount. This route helps users compare current pay, raise size, and resulting salary in one view.

## Assumptions

- results are gross-pay estimates only
- percent mode calculates raise amount from current salary and raise percent
- amount mode adds a flat raise amount to current salary
- no tax or deduction logic is included

## Input Defaults

- `raise_mode` recommended default: `percent`
- no hardcoded current salary default
- keep the most recent valid mode selection during the current session where practical

## Rounding Rules

- display currency outputs to 2 decimal places
- display percent outputs to 2 decimal places when shown
- keep full precision internally until final formatting

## Validation Rules

- do not calculate if current salary is missing or non-positive
- in percent mode, raise percent must be zero or greater
- in amount mode, raise amount must be zero or greater
- keep the last valid result visible while invalid inputs are corrected

## Edge Cases

- zero raise scenarios used for comparison
- very small percentage raises
- large flat raises that materially change salary
- users switching between percent and amount mode after entering values

## Worked Example

- current salary: `$60,000.00`
- raise mode: `percent`
- raise percent: `5`
- expected raise amount: `$3,000.00`
- expected new salary: `$63,000.00`
- expected percent increase: `5.00%`

## Result Hierarchy

1. new salary hero result
2. raise amount
3. percent increase
4. related tools and FAQ

## Explanation Section Outline

1. what a raise calculation shows
2. percent mode formula
3. flat amount mode formula
4. worked example
5. gross-pay-only notes
6. FAQ

## Internal Linking Placement

- place bonus and commission links directly below the result group
- keep salary-calculator and overtime-pay links in the related tools block above FAQ
- include the salary hub link near the intro or related tools area

## Schema Mapping Notes

- `Page title` maps to HTML `<title>`, `og:title`, and `twitter:title`
- `Meta description` maps to meta description, `og:description`, and `twitter:description`
- `Canonical URL` maps to the canonical link and `WebPage.url`
- `Route Intro` and `Search Snippet Intro` guide visible intro text and `WebPage.description`
- `SoftwareApplication.description` must clearly cover both percent and amount raise modes
- `Breadcrumbs` maps to visible breadcrumbs and `BreadcrumbList`
- visible FAQ content must match FAQ schema in meaning and preferably in exact text

## Content Guardrails

- do not imply take-home pay or tax-adjusted salary
- do not assume raises are annual unless the UI says so explicitly
- do not hide the selected mode when presenting results
- do not mix bonus logic into this route

## Accessibility Notes

- radio-group mode selection must be fully keyboard operable
- only the active mode inputs should be focusable when conditionally shown
- validation states must be announced programmatically
- result updates should be accessible to assistive technology

## QA Checklist

- title, meta description, and canonical URL match the spec
- visible breadcrumbs match `BreadcrumbList`
- visible FAQ content matches FAQ schema
- worked example returns `$63,000.00` new salary and `$3,000.00` raise amount
- switching between percent and amount mode updates validation correctly
- invalid salary or raise inputs block calculation cleanly
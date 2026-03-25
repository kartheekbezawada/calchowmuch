# Bonus Calculator Child Route Spec

## Parent Plan

- `requirements/universal-rules/salary-calculators-cluster-redesign/ROLLOUT_PLAN.md`

## Route

- `/salary-calculators/bonus-calculator/`

## Route Intro

Use this Bonus Calculator to estimate bonus value and total compensation from either a bonus percentage or a flat bonus amount. It should help users compare salary-only pay with salary-plus-bonus compensation in one view.

## SEO Metadata

- Page title: `Bonus Calculator | Calculate Bonus as Amount or Percentage of Salary`
- H1: `Bonus Calculator`
- Meta description: `Calculate a bonus as a percentage of salary or as a flat amount, and estimate total compensation.`
- Canonical URL: `https://calchowmuch.com/salary-calculators/bonus-calculator/`

## Search Intent

- Primary intent: utility and compensation estimate
- Searcher goal: calculate bonus value and total pay
- SERP angle: bonus planning tool for percent and amount scenarios

## Keyword Strategy

### Primary Keywords

- bonus calculator
- salary bonus calculator
- annual bonus calculator

### Secondary Keywords

- bonus percentage calculator
- calculate bonus from salary
- total compensation calculator
- bonus amount calculator

## Breadcrumbs

- Home
- Salary Calculators
- Bonus Calculator

### Breadcrumb JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"},
    {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"},
    {"@type": "ListItem", "position": 3, "name": "Bonus Calculator", "item": "https://calchowmuch.com/salary-calculators/bonus-calculator/"}
  ]
}
```

## Internal Calculator Mesh

- Parent hub: `/salary-calculators/`
- Related routes:
  - `/salary-calculators/raise-calculator/`
  - `/salary-calculators/salary-calculator/`
  - `/salary-calculators/commission-calculator/`
  - `/salary-calculators/monthly-to-annual-salary-calculator/`

## Formula Table

| Output | Formula | Inputs | Notes |
|---|---|---|---|
| Bonus amount | `salary x bonusPercent` | salary, bonusPercent | Percent mode |
| Total compensation | `salary + bonusAmount` | salary, bonusAmount | Main combined output |
| Bonus percent | `bonusAmount / salary x 100` | bonusAmount, salary | Secondary output |

## Calculator Input-Output Schema

```yaml
calculatorId: bonus-calculator
route: /salary-calculators/bonus-calculator/
routeArchetype: calc_exp
designFamily: neutral
paneLayout: single
inputs:
  - id: salary_amount
    label: Salary amount
    type: currency
    required: true
  - id: bonus_mode
    label: Bonus mode
    type: radio-group
    required: true
    options: [percent, amount]
  - id: bonus_percent
    label: Bonus percent
    type: decimal
    requiredWhen: bonus_mode = percent
  - id: bonus_amount
    label: Bonus amount
    type: currency
    requiredWhen: bonus_mode = amount
outputs:
  - id: bonus_amount_output
    label: Bonus amount
    format: currency
  - id: total_compensation
    label: Total compensation
    format: currency
  - id: bonus_percent_output
    label: Bonus percent
    format: percent
validation:
  - salary_amount > 0
  - bonus_percent >= 0 when present
  - bonus_amount >= 0 when present
```

## JSON-LD Package

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {"@type": "WebSite", "@id": "https://calchowmuch.com/#website", "url": "https://calchowmuch.com/", "name": "CalcHowMuch", "inLanguage": "en"},
    {"@type": "Organization", "@id": "https://calchowmuch.com/#organization", "name": "CalcHowMuch", "url": "https://calchowmuch.com/", "logo": {"@type": "ImageObject", "url": "https://calchowmuch.com/assets/images/og-default.png"}},
    {"@type": "WebPage", "@id": "https://calchowmuch.com/salary-calculators/bonus-calculator/#webpage", "name": "Bonus Calculator | Calculate Bonus as Amount or Percentage of Salary", "url": "https://calchowmuch.com/salary-calculators/bonus-calculator/", "description": "Calculate a bonus as a percentage of salary or as a flat amount, and estimate total compensation.", "isPartOf": {"@id": "https://calchowmuch.com/#website"}, "publisher": {"@id": "https://calchowmuch.com/#organization"}, "inLanguage": "en"},
    {"@type": "SoftwareApplication", "@id": "https://calchowmuch.com/salary-calculators/bonus-calculator/#softwareapplication", "name": "Bonus Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "url": "https://calchowmuch.com/salary-calculators/bonus-calculator/", "description": "Estimate a bonus and total compensation from either a bonus percentage or flat amount.", "inLanguage": "en", "provider": {"@id": "https://calchowmuch.com/#organization"}, "featureList": ["Bonus percent mode", "Flat bonus mode", "Total compensation estimate"], "keywords": "bonus calculator, salary bonus calculator, annual bonus calculator", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}},
    {"@type": "BreadcrumbList", "@id": "https://calchowmuch.com/salary-calculators/bonus-calculator/#breadcrumbs", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchowmuch.com/"}, {"@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": "https://calchowmuch.com/salary-calculators/"}, {"@type": "ListItem", "position": 3, "name": "Bonus Calculator", "item": "https://calchowmuch.com/salary-calculators/bonus-calculator/"}]}
  ]
}
```

## FAQ Outline

1. How do you calculate a bonus from salary?
2. Can I use a percentage or a flat amount?
3. Does this show total compensation?
4. Can I reverse the bonus percent from a known bonus amount?
5. Does this include tax on bonuses?

## FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://calchowmuch.com/salary-calculators/bonus-calculator/#faq",
  "mainEntity": [
    {"@type": "Question", "name": "How do you calculate a bonus from salary?", "acceptedAnswer": {"@type": "Answer", "text": "Multiply salary by the bonus percentage, or enter a known bonus amount directly."}},
    {"@type": "Question", "name": "Can I use a percentage or a flat amount?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. The route should support both a percent-based bonus and a flat bonus amount."}},
    {"@type": "Question", "name": "Does this show total compensation?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. Total compensation is the base salary plus bonus amount."}},
    {"@type": "Question", "name": "Can I reverse the bonus percent from a known bonus amount?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. The route can show bonus percent as a secondary output when salary and bonus amount are known."}},
    {"@type": "Question", "name": "Does this include tax on bonuses?", "acceptedAnswer": {"@type": "Answer", "text": "No. It estimates gross bonus and total compensation only."}}
  ]
}
```

## Search Snippet Intro

Calculate a bonus as a percentage of salary or as a flat amount, then estimate total compensation in the same view. This route is built for straightforward gross bonus planning without tax assumptions.

## Assumptions

- results are gross-pay estimates only
- percent mode calculates bonus from salary and bonus percent
- amount mode accepts a known bonus amount directly
- total compensation equals salary plus bonus amount

## Input Defaults

- `bonus_mode` recommended default: `percent`
- no hardcoded salary default
- keep the last valid mode during the current session where practical

## Rounding Rules

- display currency outputs to 2 decimal places
- display percent outputs to 2 decimal places when shown
- retain full precision until final formatting

## Validation Rules

- do not calculate if salary amount is missing or non-positive
- in percent mode, bonus percent must be zero or greater
- in amount mode, bonus amount must be zero or greater
- preserve the last valid result while invalid inputs are corrected

## Edge Cases

- zero bonus comparison scenarios
- small salaries with large bonus percentages
- known flat bonus amounts entered without using percent mode
- users reverse-checking effective bonus percent from salary and amount

## Worked Example

- salary amount: `$60,000.00`
- bonus mode: `percent`
- bonus percent: `10`
- expected bonus amount: `$6,000.00`
- expected total compensation: `$66,000.00`
- expected bonus percent output: `10.00%`

## Result Hierarchy

1. bonus amount hero result
2. total compensation
3. bonus percent output
4. related tools and FAQ

## Explanation Section Outline

1. what a bonus calculation shows
2. percent mode formula
3. flat amount mode formula
4. worked example
5. gross-pay-only notes
6. FAQ

## Internal Linking Placement

- place raise and commission links directly below the result block
- keep salary-calculator and monthly-to-annual links in the related tools block above FAQ
- include the parent hub link in the related tools area

## Schema Mapping Notes

- `Page title` maps to HTML `<title>`, `og:title`, and `twitter:title`
- `Meta description` maps to meta description, `og:description`, and `twitter:description`
- `Canonical URL` maps to the canonical link and `WebPage.url`
- `Route Intro` and `Search Snippet Intro` guide visible intro text and `WebPage.description`
- `SoftwareApplication.description` must stay aligned with bonus amount and total compensation use cases
- `Breadcrumbs` maps to visible breadcrumbs and `BreadcrumbList`
- visible FAQ content must match FAQ schema in meaning and preferably in exact text

## Content Guardrails

- do not imply tax-withholding or net bonus results
- do not mix raise logic into the main calculation path
- do not assume all bonuses are annual unless the UI says so explicitly
- do not hide whether the result came from percent mode or amount mode

## Accessibility Notes

- radio-group mode selection must be keyboard operable
- only active mode inputs should be focusable when conditionally shown
- validation states must be announced programmatically
- result updates should be accessible to assistive technology

## QA Checklist

- title, meta description, and canonical URL match the spec
- visible breadcrumbs match `BreadcrumbList`
- visible FAQ content matches FAQ schema
- worked example returns `$6,000.00` bonus and `$66,000.00` total compensation
- switching between percent and amount mode updates validation correctly
- invalid salary or bonus inputs block calculation cleanly
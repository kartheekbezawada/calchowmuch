# Salary Calculators Hub Child Spec

## Parent Plan

- `requirements/universal-rules/salary-calculators-cluster-redesign/ROLLOUT_PLAN.md`

## Route

- `/salary-calculators/`

## Route Intro

The Salary Calculators hub is the cluster landing page for pay-conversion and earnings tools. It should quickly explain what users can calculate, surface the highest-demand salary routes first, and guide visitors into the exact calculator that matches their pay frequency or compensation question.

## SEO Metadata

- Page title: `Salary Calculators | Pay Conversion, Overtime, Bonus and Raise Tools`
- H1: `Salary Calculators`
- Meta description: `Explore salary calculators for hourly to salary conversion, annual and monthly pay, overtime, raises, bonuses, and commission estimates.`
- Canonical URL: `https://calchowmuch.com/salary-calculators/`

## Search Intent

- Primary intent: navigational plus commercial utility
- Searcher goal: find the right salary or pay calculator quickly
- Answer-first angle: show the core salary conversion tools first, then earnings-support tools
- Cluster role: hub page, not a formula-first calculator page

## Search Snippet Intro

Use these salary calculators to compare pay across hourly, weekly, monthly, and annual views, then estimate overtime, raises, bonuses, and commission. Start with the calculator that matches the pay question you want answered now.

## Keyword Strategy

### Primary Keywords

- salary calculators
- salary calculator
- pay calculator

### Secondary Keywords

- hourly to salary calculator
- salary to hourly calculator
- overtime pay calculator
- raise calculator
- bonus calculator
- commission calculator
- weekly pay calculator

## Breadcrumbs

- Home
- Salary Calculators

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
    }
  ]
}
```

## Internal Calculator Mesh

### Must Link To

- `/salary-calculators/salary-calculator/`
- `/salary-calculators/hourly-to-salary-calculator/`
- `/salary-calculators/salary-to-hourly-calculator/`
- `/salary-calculators/annual-to-monthly-salary-calculator/`
- `/salary-calculators/monthly-to-annual-salary-calculator/`
- `/salary-calculators/weekly-pay-calculator/`
- `/salary-calculators/overtime-pay-calculator/`
- `/salary-calculators/raise-calculator/`
- `/salary-calculators/bonus-calculator/`
- `/salary-calculators/commission-calculator/`

### Featured Order

1. salary-calculator
2. hourly-to-salary-calculator
3. salary-to-hourly-calculator
4. overtime-pay-calculator
5. raise-calculator

## Internal Linking Placement

- show the top five featured calculators in the hero or first route card group
- place the full calculator grid immediately after the intro and featured set
- keep FAQ below the full calculator grid so discovery is prioritized over informational copy

## Formula Table

| Item | Contract |
|---|---|
| Calculator logic | Not applicable by default |
| Route role | Cluster hub and discovery page |
| Conversion summary | Short, static answer-first summaries only |

## Calculator Input-Output Schema

```yaml
routeId: salary-calculators-hub
route: /salary-calculators/
pageType: cluster-hub
routeArchetype: content_shell
designFamily: neutral
paneLayout: single
calculatorLogic: none
inputs: []
outputs:
  - id: featured_routes
    label: Featured salary calculators
    format: route-list
  - id: all_routes
    label: All salary cluster routes
    format: route-grid
requiredSections:
  - cluster_intro
  - featured_routes
  - all_routes_grid
  - faq
  - related_clusters_optional
```

## Input Defaults

- no calculator inputs apply on this route
- featured order defaults to the five routes listed above
- all routes remain visible unless a route is explicitly withheld from launch

## Rounding Rules

- not applicable for the hub route because it does not compute numeric outputs

## Validation Rules

- do not render route cards for calculators that are not yet approved for release
- keep card label text, route URL, and schema labels synchronized
- if a route is excluded from launch, remove it from both visible UI and hub schema references

## Edge Cases

- cluster launches with fewer than all planned calculators live
- one calculator is temporarily withheld from sitemap or homepage discovery
- route order changes after keyword prioritization review

## Worked Example

- example user goal: convert an hourly wage into annual salary
- expected hub behavior: surface `Hourly to Salary Calculator` in the featured route set
- expected next step: user can navigate to the exact conversion route without scanning the full cluster list

## Result Hierarchy

1. cluster intro and answer-first utility summary
2. featured salary calculators
3. full salary calculator grid
4. FAQ
5. optional related cluster discovery

## Explanation Section Outline

1. short cluster intro
2. featured conversion calculators
3. earnings-support calculators
4. FAQ
5. optional notes on gross-pay-only scope

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
      "@type": "CollectionPage",
      "@id": "https://calchowmuch.com/salary-calculators/#webpage",
      "name": "Salary Calculators | Pay Conversion, Overtime, Bonus and Raise Tools",
      "url": "https://calchowmuch.com/salary-calculators/",
      "description": "Explore salary calculators for hourly to salary conversion, annual and monthly pay, overtime, raises, bonuses, and commission estimates.",
      "isPartOf": {
        "@id": "https://calchowmuch.com/#website"
      },
      "publisher": {
        "@id": "https://calchowmuch.com/#organization"
      },
      "inLanguage": "en"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://calchowmuch.com/salary-calculators/#breadcrumbs",
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
        }
      ]
    }
  ]
}
```

## FAQ Outline

1. What can I calculate with these salary calculators?
2. Which calculator should I use for hourly pay?
3. Do these calculators include tax deductions?
4. Can I compare weekly, monthly, and annual pay?
5. Are overtime, raise, and bonus calculations included in this cluster?

## FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://calchowmuch.com/salary-calculators/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can I calculate with these salary calculators?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can estimate pay conversions across hourly, weekly, monthly, and annual formats, plus overtime, raise, bonus, and commission scenarios."
      }
    },
    {
      "@type": "Question",
      "name": "Which calculator should I use for hourly pay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use the Hourly to Salary Calculator if you know your hourly rate, or the Salary to Hourly Calculator if you want to reverse an annual salary into an hourly estimate."
      }
    },
    {
      "@type": "Question",
      "name": "Do these calculators include tax deductions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. This cluster focuses on gross pay and compensation math, not tax withholding or jurisdiction-specific payroll rules."
      }
    },
    {
      "@type": "Question",
      "name": "Can I compare weekly, monthly, and annual pay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Several routes in the cluster convert the same pay amount into multiple pay frequencies so you can compare them side by side."
      }
    },
    {
      "@type": "Question",
      "name": "Are overtime, raise, and bonus calculations included in this cluster?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The cluster includes separate tools for overtime pay, raises, bonuses, and commission-based earnings."
      }
    }
  ]
}
```

## Schema Mapping Notes

- `Page title` is the source of truth for HTML `<title>`, `og:title`, and `twitter:title`
- `Meta description` is the source of truth for meta description, `og:description`, and `twitter:description`
- `Canonical URL` is the source of truth for the canonical link and `CollectionPage.url`
- `Route Intro` plus `Search Snippet Intro` are the source of truth for visible intro copy and collection-page summary language
- `Breadcrumbs` is the source of truth for both visible breadcrumb labels and `BreadcrumbList.itemListElement`
- visible FAQ questions and answers must match `FAQPage.mainEntity` exactly in meaning, and preferably exactly in text

## Content Guardrails

- do not present the hub as a tax or payroll rules page
- do not imply live salary data, legal advice, or pay compliance guidance
- do not link to unpublished calculators from visible UI or schema
- do not let the hub description drift away from gross-pay and earnings-math positioning

## Accessibility Notes

- featured route cards must be keyboard reachable in reading order
- route card headings must remain descriptive outside of visual styling
- breadcrumb links must stay visible to assistive technology and match schema labels
- FAQ accordions, if used, must expose expanded and collapsed states programmatically

## QA Checklist

- page title matches the spec exactly
- meta description matches the spec exactly
- canonical URL matches the route exactly
- featured route order matches the spec
- visible breadcrumbs match `BreadcrumbList`
- visible FAQ copy matches FAQ schema
- no unpublished route is present in visible UI or schema

## Build Notes

- this route is a hub page, not a primary calculator page
- JSON-LD can ship as one combined `@graph` block plus a separate FAQ block, or be merged into one `@graph` during implementation

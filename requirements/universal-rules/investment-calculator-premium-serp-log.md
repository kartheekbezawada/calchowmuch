# Investment Calculator Premium SERP Execution Log

Status: Approved for implementation  
Date: 2026-03-28  
Owner: Agent execution log  
Type: Planning + implementation checkpoint log  

> This document is a working implementation log for the new `Investment Calculator` route.
> It is not project law. Governance remains:
> `UNIVERSAL_REQUIREMENTS.md` -> `AGENTS.md` -> active companion docs.

## 1. Why This Exists

This log captures the approved implementation brief for the new finance route:

- New exact-match route: `/finance-calculators/investment-calculator/`
- Exact title tag: `Investment Calculator | Growth, Contributions & Returns`
- Premium editorial finance presentation
- 1500+ word SERP-ready explanation
- Mandatory inflation framing
- Mandatory simple-vs-compound multi-year comparison
- Mandatory charts, donut/pie, table, FAQ card layout, and delivery checklist

The purpose of this file is to preserve the full execution brief so work can resume later without
reconstructing product decisions from chat history.

## 2. Approved Scope Lock

### 2.1 Primary route

- `/finance-calculators/investment-calculator/`

### 2.2 Supporting routes allowed for deconfliction only

- `/finance-calculators/investment-growth-calculator/`
- `/finance-calculators/investment-return-calculator/`

### 2.3 Allowed implementation surfaces

- `content/calculators/finance-calculators/investment-calculator/**`
- `public/assets/js/calculators/finance-calculators/investment-calculator/**`
- `public/assets/css/calculators/finance-calculators/investment-calculator/**`
- `public/assets/js/core/time-value-utils.js`
- `tests_specs/finance/investment_release/**`
- `public/config/navigation.json`
- `config/clusters/route-ownership.json`
- `public/finance-calculators/investment-calculator/index.html`
- `content/calculators/finance-calculators/investment-growth-calculator/explanation.html`
- `content/calculators/finance-calculators/investment-return-calculator/explanation.html`
- `public/assets/js/calculators/finance-calculators/investment-growth-calculator/module.js`
- `public/assets/js/calculators/finance-calculators/investment-return-calculator/module.js`
- `public/finance-calculators/investment-growth-calculator/index.html`
- `public/finance-calculators/investment-return-calculator/index.html`
- `public/assets/css/route-bundles/**`
- `public/config/asset-manifest.json`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_*.md`

### 2.4 Forbidden surfaces

- Any non-finance calculator route
- `public/index.html`
- `clusters/**`
- Unrelated requirements docs
- Loan, credit-card, salary, pricing, math, or time-and-date calculators

### 2.5 Stop rule

If the implementation needs files outside this scope, or needs forbidden commands, stop and ask
before proceeding.

## 3. High-Level Product Contract

### 3.1 Core purpose

This route must become the primary broad-intent finance page for `investment calculator`, not a
thin clone of `investment-growth` and not a renamed version of `investment-return`.

### 3.2 Positioning

The new route is the broad planning tool. The two existing routes stay live with narrower roles:

- `investment-growth` = future value and inflation-planning
- `investment-return` = performance/CAGR/advanced-return-analysis
- `investment` = broad planning, long-horizon growth, inflation effect, and simple-vs-compound comparison

### 3.3 Market stance

- Global-neutral English
- Not US-only
- Not UK-leaning
- No region-specific jargon unless necessary for clarity

### 3.4 Tone and writing style

- Premium magazine voice
- Editorial and polished
- Story-led but not fluffy
- Practical, authoritative, and readable
- Must not read like a textbook
- Must not read like a generic SEO content farm page

## 4. Metadata and SERP Contract

### 4.1 Hard metadata requirements

- HTML title tag must be exactly:
  - `Investment Calculator | Growth, Contributions & Returns`
- H1 must be:
  - `Investment Calculator`
- Route must self-canonicalize to:
  - `https://calchowmuch.com/finance-calculators/investment-calculator/`
- `og:url` must equal canonical
- OG/Twitter titles and descriptions must align with the route intent
- Schema must include:
  - `SoftwareApplication`
  - `BreadcrumbList`
  - `FAQPage`

### 4.2 Primary keyword

- `investment calculator`

### 4.3 Secondary keyword cluster

- `how inflation affects investments`
- `simple vs compound investment`
- long-horizon investment growth comparisons

### 4.4 SERP structure requirements

The page should be written so it can support:

- answer-first snippets
- AI summary extraction
- question-led section matching
- formula-led educational search intent
- comparison-intent search behavior

Required content elements:

- direct intro answer paragraph
- direct inflation answer block
- direct simple-vs-compound answer block
- formula sections with plain-English definitions
- worked examples
- FAQ section in initial HTML

## 5. Calculator UX Contract

### 5.1 Visible core inputs

- Initial investment
- Expected annual return
- Years
- Recurring contribution

### 5.2 Advanced inputs

Advanced inputs must stay collapsed by default.

Allowed v1 advanced inputs:

- Compounding frequency
- Inflation rate
- Comparison contribution mode toggle

Explicitly excluded from v1:

- Tax settings
- Crash simulation
- Event rows
- Variable annual returns

### 5.3 Comparison contract

The page must always include a simple-vs-compound comparison.

Base logic:

- Use the same initial amount, rate, and years in both scenarios
- Provide a user toggle for contribution handling:
  - Lump sum only
  - Include recurring contributions

### 5.4 Required output stack

- Ending value
- Total contributions
- Total gains
- Simple-growth ending value
- Compound-growth ending value
- Compounding uplift
- Inflation-adjusted real value

### 5.5 Interaction rules

- Default render must show meaningful pre-populated results
- Recalculation must remain button-triggered
- Reset behavior must restore approved defaults
- Route must remain single-pane `calc_exp`
- Mobile layout must remain readable at `360px+`

## 6. Formula and Scenario Contract

### 6.1 Formula topics that must be explained

- Simple interest growth
- Compound growth
- Future value with recurring contributions
- Inflation-adjusted real value
- Compounding uplift between simple and compound scenarios

### 6.2 Formula explanation depth

This route requires full derivation depth, not a light summary.

That means the explanation must include:

- the displayed formula
- variable-by-variable meaning
- unit/period meaning
- why the formula changes between simple and compound cases
- how recurring contributions alter the output
- how inflation alters interpretation
- at least one worked example for each major formula family

### 6.3 Required scenario content

The explanation must explicitly cover:

- a long-horizon lump-sum-only comparison
- a recurring-contribution comparison
- a narrative explanation of why compounding widens over time
- a narrative explanation of how inflation can erase nominal gains in real terms

## 7. Content Contract

### 7.1 Word count

- Minimum target: 1500 words

### 7.2 Explanation order

Inside the SERP explanation block, the required order remains:

1. Intent-led `H2`
2. `How to Guide`
3. FAQ
4. `Important Notes`

`Important Notes` must be the final explanation section.

### 7.3 Required long-form sections

- Answer-first introduction
- How to use this calculator
- How does inflation affect an investment?
- Simple vs compound investment over many years
- Formula derivations and variable meanings
- Worked examples
- Practical decision guidance
- FAQ cards
- Important Notes

### 7.4 Content style rules

- Premium editorial rhythm
- Short paragraphs
- Tight transitions
- No filler
- No thin boilerplate
- No generic headings like `Explanation`
- Strong real-world interpretation language

## 8. Design and Visual Contract

### 8.1 Visual direction

- Premium finance magazine
- Denser and more refined than the current neutral finance defaults
- Stronger editorial hierarchy
- Cleaner chart and section framing
- Tighter FAQ spacing

### 8.2 Required visual package

- Line chart
- Donut/pie chart
- Comparison table

### 8.3 Line chart contract

The line chart must show:

- Nominal value
- Real inflation-adjusted value

The chart must be:

- readable at a glance
- visually sparse
- compact in legend treatment
- high-contrast between the two lines
- accessible with labels/tooltips
- supported by interpretation copy

### 8.4 Donut/pie contract

The donut/pie chart must show:

- Contributions vs growth

It must not be used for:

- inflation loss
- scenario gap

It must be paired with explanatory text that answers:

- How much of the final balance came from my money?
- How much came from investment growth?

### 8.5 Table contract

The table must support:

- lump-sum-only comparison
- recurring-contribution comparison

The table should help users compare:

- simple vs compound
- nominal vs real interpretation where appropriate
- long-horizon widening of the gap

## 9. Supporting Route Deconfliction Contract

### 9.1 Investment Growth route

This route should remain focused on:

- future value projection
- inflation-aware planning
- simpler growth forecasting

It should link to the new route when users need:

- broader planning
- simple-vs-compound comparison
- more editorial long-form explanation

### 9.2 Investment Return route

This route should remain focused on:

- CAGR
- performance analysis
- advanced-return framing

It should link to the new route when users need:

- broad planning intent
- inflation-led interpretation
- simpler planning scenarios instead of return-analysis depth

## 10. Code and File Expectations

### 10.1 New source roots expected

- `content/calculators/finance-calculators/investment-calculator/index.html`
- `content/calculators/finance-calculators/investment-calculator/explanation.html`
- `public/assets/js/calculators/finance-calculators/investment-calculator/module.js`
- `public/assets/css/calculators/finance-calculators/investment-calculator/calculator.css`

### 10.2 Likely shared logic surface

- `public/assets/js/core/time-value-utils.js`

Reason:

- existing investment-growth and investment-return tests already depend on this core finance math utility
- simple-vs-compound comparison logic should live in reusable finance math, not page-only DOM code

### 10.3 Generated output expected

- `public/finance-calculators/investment-calculator/index.html`

### 10.4 Config updates expected

- `public/config/navigation.json`
- `config/clusters/route-ownership.json`

### 10.5 Tests expected

- `tests_specs/finance/investment_release/unit.calc.test.js`
- `tests_specs/finance/investment_release/e2e.calc.spec.js`
- `tests_specs/finance/investment_release/seo.calc.spec.js`
- `tests_specs/finance/investment_release/cwv.calc.spec.js`
- `tests_specs/finance/investment_release/README.md`

## 11. Delivery Gates

### 11.1 Required commands

- `npm run lint`
- `npm run build:css:route-bundles`
- scoped route generation for the new route
- `CLUSTER=finance CALC=investment npm run test:calc:unit`
- `CLUSTER=finance CALC=investment npm run test:calc:e2e`
- `CLUSTER=finance CALC=investment npm run test:calc:seo`
- `CLUSTER=finance CALC=investment npm run test:calc:cwv`
- `CLUSTER=finance CALC=investment npm run test:schema:dedupe -- --scope=calc`
- `TARGET_ROUTE=/finance-calculators/investment-calculator/ npm run test:isolation:scope`
- `npm run test:cluster:contracts`

### 11.2 Release evidence expected

- release signoff file under `requirements/universal-rules/release-signoffs/`
- scoped test results
- CWV artifact path
- schema dedupe proof
- paneLayout proof
- sitemap presence proof
- homepage search discoverability proof

## 12. In-Depth Final Delivery Checklist

Use this checklist before calling the route ready.

### 12.1 Scope and route identity

- [ ] New route slug is exactly `/finance-calculators/investment-calculator/`
- [ ] Navigation entry id is correct
- [ ] Route ownership entry exists
- [ ] `routeArchetype` is `calc_exp`
- [ ] `designFamily` is `neutral`
- [ ] `paneLayout` is `single`
- [ ] No unrelated route edits slipped into scope

### 12.2 Metadata and schema

- [ ] Title tag is exactly `Investment Calculator | Growth, Contributions & Returns`
- [ ] H1 is `Investment Calculator`
- [ ] Meta description matches route intent and is not boilerplate
- [ ] Canonical is absolute HTTPS and self-referential
- [ ] `og:url` matches canonical
- [ ] OG and Twitter tags are populated
- [ ] `SoftwareApplication` schema matches route identity
- [ ] `FAQPage` schema matches final written FAQ
- [ ] Breadcrumbs resolve correctly
- [ ] No schema dedupe failures remain

### 12.3 Calculator behavior

- [ ] Default inputs render a meaningful default result
- [ ] Calculate button updates outputs correctly
- [ ] Reset restores defaults
- [ ] Advanced panel is collapsed by default
- [ ] Advanced panel opens without layout breakage
- [ ] Comparison is always present
- [ ] Contribution mode toggle works
- [ ] Lump-sum-only comparison works
- [ ] Recurring-contribution comparison works
- [ ] Zero-rate behavior is correct
- [ ] Zero-contribution behavior is correct
- [ ] Multi-year scenarios remain stable

### 12.4 Formula and scenario logic

- [ ] Simple-growth formula is correct
- [ ] Compound-growth formula is correct
- [ ] Contribution-inclusive projection is correct
- [ ] Inflation-adjusted real value is correct
- [ ] Compounding uplift is calculated correctly
- [ ] Formula derivations are internally consistent
- [ ] Worked examples match the implemented math

### 12.5 Explanation content

- [ ] Explanation has exactly one intent-led `H2`
- [ ] `How to Guide` exists
- [ ] FAQ exists
- [ ] `Important Notes` exists
- [ ] `Important Notes` is the final explanation section
- [ ] Word count reaches 1500+
- [ ] Inflation section exists
- [ ] Simple-vs-compound section exists
- [ ] Formula derivation section exists
- [ ] Worked examples exist
- [ ] Interpretation guidance exists
- [ ] No thin-content hard flags are triggered

### 12.6 Design and visuals

- [ ] Page reads as premium editorial finance, not generic neutral finance
- [ ] Result hierarchy is visually strong
- [ ] Section leads are tighter than current finance defaults
- [ ] FAQ cards have tighter gaps and remain readable
- [ ] Line chart renders nominal vs real clearly
- [ ] Donut/pie renders contributions vs growth clearly
- [ ] Comparison table is readable on desktop
- [ ] Comparison table is readable on mobile
- [ ] Chart legends are compact
- [ ] Tooltip or explanatory labels are accessible
- [ ] Visual modules include interpretation copy

### 12.7 Supporting-route deconfliction

- [ ] `investment-growth` remains future-value/inflation oriented
- [ ] `investment-return` remains return-analysis/CAGR oriented
- [ ] Both supporting routes link to the new route where appropriate
- [ ] The new route links back to both supporting routes where appropriate
- [ ] Route intent overlap is reduced, not increased

### 12.8 SEO discoverability

- [ ] New route appears in sitemap
- [ ] Homepage search discoverability passes
- [ ] Navigation keywords support the route intent
- [ ] Intro answer block is snippet-friendly
- [ ] Inflation answer block is explicit
- [ ] Simple-vs-compound answer block is explicit
- [ ] Formula-led headings are present for AI extraction

### 12.9 Test and release readiness

- [ ] Lint passes
- [ ] Scoped unit test passes
- [ ] Scoped e2e test passes
- [ ] Scoped SEO test passes
- [ ] Scoped CWV test passes
- [ ] Scoped schema dedupe passes
- [ ] Scoped isolation check passes
- [ ] Cluster contract check passes
- [ ] Release signoff file is created and filled

## 13. Current State at Time of Logging

At the time this log was created:

- The plan has been approved
- Implementation has not yet started
- No code changes for the new route have been made yet
- This file exists to preserve the implementation brief and delivery checklist


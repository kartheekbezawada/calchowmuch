# Finance Calculators Master Improvement Plan

This document will hold the cluster-wide improvement audit for the full Finance calculator experience. Its purpose is to evaluate the current Finance calculators across design quality, SEO strength, UX and conversion clarity, technical performance, and cluster strategy before any further route migration work resumes.

## Current Status

- SEO/SERP Wave 1 logged and implemented in source explanation content

## Scope

- All 11 Finance calculators in the cluster:
  - `present-value`
  - `future-value`
  - `present-value-of-annuity`
  - `future-value-of-annuity`
  - `effective-annual-rate`
  - `simple-interest`
  - `compound-interest`
  - `investment-growth`
  - `time-to-savings-goal`
  - `monthly-savings-needed`
  - `investment-return`

## Planned Sections

- Design system upgrades
- SEO improvements
- UX/conversion improvements
- Performance improvements
- Cluster strategy
- Prioritized roadmap
- Immediate quick wins

## SEO/SERP Wave 1

Objective:

- strengthen search intent alignment for every Finance calculator without changing calculator logic
- improve answer-first copy, use-case relevance, and finance-cluster internal linking
- keep existing FAQ/schema contracts stable while making on-page content more snippet-friendly

Implemented by calculator:

- `present-value`
  - added use cases for deferred lump sums, settlements, and future cash offers
  - added internal links to `future-value` and `present-value-of-annuity`
- `future-value`
  - clarified savings and investing accumulation intent
  - added internal links to `compound-interest` and `investment-growth`
- `present-value-of-annuity`
  - clarified pension, lease, and settlement-payment use cases
  - added internal links to `present-value` and `future-value-of-annuity`
- `future-value-of-annuity`
  - clarified retirement, sinking-fund, and recurring-savings intent
  - added internal links to `monthly-savings-needed` and `time-to-savings-goal`
- `effective-annual-rate`
  - clarified nominal-rate versus true annual-rate comparison intent
  - added internal links to `compound-interest` and `simple-interest`
- `simple-interest`
  - clarified short-term loan, trade-credit, and non-compounding use cases
  - added internal link to `compound-interest`
- `compound-interest`
  - strengthened long-horizon savings and investing framing
  - added internal links to `future-value` and `investment-growth`
- `investment-growth`
  - strengthened retirement, college-fund, and inflation-aware planning intent
  - added internal links to `investment-return` and `future-value`
- `time-to-savings-goal`
  - clarified real-world target use cases such as emergency funds and house deposits
  - added internal link to `monthly-savings-needed`
- `monthly-savings-needed`
  - clarified monthly-budget planning intent for deposits, tuition, travel, and other goals
  - added internal links to `time-to-savings-goal` and `future-value-of-annuity`
- `investment-return`
  - clarified CAGR, tax-aware, and inflation-aware portfolio analysis intent
  - added internal links to `investment-growth` and `compound-interest`

Implementation notes:

- titles and schema contracts remain stable in this wave to avoid unnecessary SERP-safe regressions
- changes are concentrated in explanation content where they improve relevance without risking calculator behavior
- future SEO wave can revisit title/meta testing after performance and CTR data is collected

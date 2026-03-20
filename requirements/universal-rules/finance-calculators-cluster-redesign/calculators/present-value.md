# `present-value` Route Brief

## Route

- `/finance-calculators/present-value-calculator/`

## Redesign Goals

- establish the Finance shell and shared visual language
- make present value readable in one glance
- remove dark shell, Home Loan wrapper, and breadcrumb leakage
- replace instant post-load recalculation with deliberate CTA-driven updates

## Current UX/UI Problems

- route still depends on the dark legacy shell and ads layout
- source fragment uses Home Loan wrapper naming
- breadcrumb/schema points Finance users to Home Loan
- explanation order is legacy and lacks the touched-route guide contract

## Target Layout And Hierarchy

- centered Finance page header with a short intro
- form card and answer-first result card as the first visual block
- concise scenario summary below the answer
- guide, FAQ, and Important Notes follow in calm editorial rhythm

## Implementation Notes

- replace Home Loan wrapper classes with Finance shared classes
- preserve calculator hooks, data attributes, and dynamic explanation bindings
- convert button groups and slider controls to stale-state plus Calculate flow

## Route-Level Tests

- `CLUSTER=finance CALC=present-value npm run test:calc:unit`
- `CLUSTER=finance CALC=present-value npm run test:calc:e2e`
- `CLUSTER=finance CALC=present-value npm run test:calc:seo`
- `CLUSTER=finance CALC=present-value npm run test:calc:cwv`
- `CLUSTER=finance CALC=present-value npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- scoped SEO content-quality artifact reports `warn=1`; no blocking failure, but the route should be reviewed again during the cluster content pass

## Final Status

- `Completed on 2026-03-20`

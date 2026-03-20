# `future-value` Route Brief

## Route

- `/finance-calculators/future-value-calculator/`

## Redesign Goals

- extend the reference Finance shell to future value with contribution hierarchy
- make ending value and contribution impact readable at a glance
- normalize period and compounding interactions

## Current UX/UI Problems

- route still depends on the dark shell
- source fragment still uses Home Loan wrapper naming
- route recalculates immediately after post-load edits
- explanation structure is legacy and not guide-first

## Target Layout And Hierarchy

- centered Finance page header
- form card grouped around starting value, rate, time, and contribution
- result panel leads with future value, then contribution and compounding context
- guide teaches how growth changes with time and compounding before FAQ

## Implementation Notes

- add precise entry for key slider-heavy fields if needed
- keep time and compounding button groups intact
- preserve all explanation data bindings

## Route-Level Tests

- `CLUSTER=finance CALC=future-value npm run test:calc:unit`
- `CLUSTER=finance CALC=future-value npm run test:calc:e2e`
- `CLUSTER=finance CALC=future-value npm run test:calc:seo`
- `CLUSTER=finance CALC=future-value npm run test:calc:cwv`
- `CLUSTER=finance CALC=future-value npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- scoped SEO content-quality artifact reports `warn=1`; no blocking failure, but the route should be reviewed again during the cluster content pass

## Final Status

- `Completed on 2026-03-20`

# `investment-growth` Route Brief

## Route

- `/finance-calculators/investment-growth-calculator/`

## Redesign Goals

- make future portfolio value and contribution impact readable in one glance
- establish a calmer long-horizon planning layout
- keep graph/table modules secondary to the answer

## Current UX/UI Problems

- route still depends on the dark shell
- source fragment still uses Home Loan wrapper naming
- slider-heavy inputs are dense and imprecise
- explanation structure is legacy and not guide-first

## Target Layout And Hierarchy

- answer-first hero with future value
- supporting metrics show contributions, gains, inflation, and time basis
- chart and schedule modules become a deliberate second layer
- guide explains inflation and contribution impact before FAQ

## Implementation Notes

- add precise entry for initial amount, return, contribution, and inflation where needed
- keep compounding and calculation hooks intact
- enforce graph and table readability contracts

## Route-Level Tests

- `CLUSTER=finance CALC=investment-growth npm run test:calc:unit`
- `CLUSTER=finance CALC=investment-growth npm run test:calc:e2e`
- `CLUSTER=finance CALC=investment-growth npm run test:calc:seo`
- `CLUSTER=finance CALC=investment-growth npm run test:calc:cwv`
- `CLUSTER=finance CALC=investment-growth npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- legacy E2E assertions still assume the old top navigation

## Final Status

- `Planned`

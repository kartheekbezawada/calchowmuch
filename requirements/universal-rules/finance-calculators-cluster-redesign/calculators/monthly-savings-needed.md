# `monthly-savings-needed` Route Brief

## Route

- `/finance-calculators/monthly-savings-needed-calculator/`

## Redesign Goals

- make the required monthly contribution obvious instantly
- reduce formula-first heaviness and improve planning clarity
- replace placeholder tests with real route-level coverage

## Current UX/UI Problems

- route still depends on the dark shell
- source fragment still uses Home Loan wrapper naming
- route recalculates immediately after post-load edits
- route-level unit and E2E suites are still placeholders

## Target Layout And Hierarchy

- answer-first hero with required monthly savings
- supporting metrics show goal, current balance, interest contribution, and time horizon
- guide explains how time and return change the target before FAQ

## Implementation Notes

- preserve compounding and timing button groups
- add precise entry for goal, current balance, time, and rate where needed
- replace placeholder unit and E2E coverage with real route assertions

## Route-Level Tests

- `CLUSTER=finance CALC=monthly-savings-needed npm run test:calc:unit`
- `CLUSTER=finance CALC=monthly-savings-needed npm run test:calc:e2e`
- `CLUSTER=finance CALC=monthly-savings-needed npm run test:calc:seo`
- `CLUSTER=finance CALC=monthly-savings-needed npm run test:calc:cwv`
- `CLUSTER=finance CALC=monthly-savings-needed npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- route-level unit and E2E suites are still placeholders

## Final Status

- `Planned`

# `time-to-savings-goal` Route Brief

## Route

- `/finance-calculators/time-to-savings-goal-calculator/`

## Redesign Goals

- make time-to-goal feel motivating and easy to understand
- reduce formula-first heaviness
- replace placeholder tests with real route-level coverage

## Current UX/UI Problems

- route still depends on the dark shell
- source fragment still uses Home Loan wrapper naming
- route recalculates immediately after post-load edits
- route-level unit and E2E suites are still placeholders

## Target Layout And Hierarchy

- answer-first hero with target timeline
- supporting metrics show total contributions, total interest, and timing basis
- guide explains what moves the goal sooner before FAQ

## Implementation Notes

- preserve compounding and timing button groups
- add precise entry for goal, current balance, contribution, and rate where needed
- replace placeholder unit and E2E coverage with real route assertions

## Route-Level Tests

- `CLUSTER=finance CALC=time-to-savings-goal npm run test:calc:unit`
- `CLUSTER=finance CALC=time-to-savings-goal npm run test:calc:e2e`
- `CLUSTER=finance CALC=time-to-savings-goal npm run test:calc:seo`
- `CLUSTER=finance CALC=time-to-savings-goal npm run test:calc:cwv`
- `CLUSTER=finance CALC=time-to-savings-goal npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- route-level unit and E2E suites are still placeholders

## Final Status

- `Planned`

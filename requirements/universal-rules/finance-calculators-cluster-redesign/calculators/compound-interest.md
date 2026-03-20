# `compound-interest` Route Brief

## Route

- `/finance-calculators/compound-interest-calculator/`

## Redesign Goals

- establish the Finance graph and table language
- make ending balance, contributions, and total interest easy to scan
- keep chart and projection tools calm and readable

## Current UX/UI Problems

- route still depends on the dark shell
- source fragment still uses Home Loan wrapper naming
- route recalculates immediately after post-load edits
- chart and table region carry dark dashboard heaviness

## Target Layout And Hierarchy

- answer-first hero with ending balance
- supporting metrics show contributions, total growth, and compounding basis
- growth visualization and projection table become deliberate secondary modules
- guide explains compounding and contributions before FAQ

## Implementation Notes

- preserve projection table, chart rendering, and scale toggles
- add precise entry for principal, rate, time, and contribution where needed
- enforce graph start-point and label readability contract

## Route-Level Tests

- `CLUSTER=finance CALC=compound-interest npm run test:calc:unit`
- `CLUSTER=finance CALC=compound-interest npm run test:calc:e2e`
- `CLUSTER=finance CALC=compound-interest npm run test:calc:seo`
- `CLUSTER=finance CALC=compound-interest npm run test:calc:cwv`
- `CLUSTER=finance CALC=compound-interest npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- legacy E2E assertions still assume the old top navigation

## Final Status

- `Planned`

# `simple-interest` Route Brief

## Route

- `/finance-calculators/simple-interest-calculator/`

## Redesign Goals

- make total interest and ending amount readable at a glance
- keep the route clean and high-trust
- remove inline dark-era styling and legacy shell leakage

## Current UX/UI Problems

- route still depends on the dark shell
- source fragment includes inline legacy styling and Home Loan wrapper naming
- route recalculates immediately after post-load edits
- explanation structure is legacy and not guide-first

## Target Layout And Hierarchy

- answer-first hero with total interest
- supporting metrics show ending amount, time basis, and years equivalent
- guide explains when simple interest is appropriate before FAQ

## Implementation Notes

- preserve time-unit and basis button groups
- move route presentation into shared Finance styling plus route CSS
- fix BreadcrumbList category and guide contract

## Route-Level Tests

- `CLUSTER=finance CALC=simple-interest npm run test:calc:unit`
- `CLUSTER=finance CALC=simple-interest npm run test:calc:e2e`
- `CLUSTER=finance CALC=simple-interest npm run test:calc:seo`
- `CLUSTER=finance CALC=simple-interest npm run test:calc:cwv`
- `CLUSTER=finance CALC=simple-interest npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- thin-content quality artifact reports `warn=1` with no blocking SEO failures

## Final Status

- `Completed on 2026-03-20`

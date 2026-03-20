# `effective-annual-rate` Route Brief

## Route

- `/finance-calculators/effective-annual-rate-calculator/`

## Redesign Goals

- make the true annual rate obvious instantly
- keep the route compact, educational, and premium
- remove shell clutter from the smallest Finance route

## Current UX/UI Problems

- route still depends on the dark shell
- source fragment still uses Home Loan wrapper naming
- breadcrumb/schema points to Home Loan
- explanation structure is legacy and not guide-first

## Target Layout And Hierarchy

- compact hero with one dominant EAR answer
- supporting metrics explain nominal rate, compounding, and difference
- guide teaches comparison logic before FAQ

## Implementation Notes

- preserve nominal-rate slider and compounding button group
- remove legacy shell assumptions from tests
- keep the route compact after shell removal

## Route-Level Tests

- `CLUSTER=finance CALC=effective-annual-rate npm run test:calc:unit`
- `CLUSTER=finance CALC=effective-annual-rate npm run test:calc:e2e`
- `CLUSTER=finance CALC=effective-annual-rate npm run test:calc:seo`
- `CLUSTER=finance CALC=effective-annual-rate npm run test:calc:cwv`
- `CLUSTER=finance CALC=effective-annual-rate npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- thin-content quality artifact reports `warn=1` with no blocking SEO failures

## Final Status

- `Completed on 2026-03-20`

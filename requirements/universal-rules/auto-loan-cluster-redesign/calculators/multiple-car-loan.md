# `multiple-car-loan` Route Brief

## Route

- `/car-loan-calculators/auto-loan-calculator/`

## Redesign Goals

- clarify A vs B vs combined comparison hierarchy
- make combined monthly payment the immediate answer
- keep comparison and amortization tables readable without clutter

## Current UX/UI Problems

- route still depends on the dark shell
- comparison structure feels visually flat
- source fragment still uses Home Loan wrapper naming
- slider-only inputs make precise comparison harder than it should be

## Target Layout And Hierarchy

- centered Auto Loan page header
- form card grouped as Loan A and Loan B with mirrored input rhythm
- result panel leads with combined payment, then combined interest and payoff horizon
- comparison table appears before the longer amortization schedule
- guide helps the user choose which offer is actually better

## Implementation Notes

- add precise entry for both loan amount and APR fields
- keep comparison table and monthly/yearly toggle contracts intact
- use shared cluster styling for comparison table and totals row

## Route-Level Tests

- `CLUSTER=auto-loans CALC=multiple-car-loan npm run test:calc:unit`
- `CLUSTER=auto-loans CALC=multiple-car-loan npm run test:calc:e2e`
- `CLUSTER=auto-loans CALC=multiple-car-loan npm run test:calc:seo`
- `CLUSTER=auto-loans CALC=multiple-car-loan npm run test:calc:cwv`
- `CLUSTER=auto-loans CALC=multiple-car-loan npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- none

## Final Status

- `Completed — 2026-03-19`

## Completion Notes

- Auto Loan shell applied and legacy shell assertions removed from route tests.
- Precise companion inputs added for both loan amounts, APRs, and terms.
- Scoped route gates passed: unit, E2E, SEO, CWV, and schema dedupe.

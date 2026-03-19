# `pcp-calculator` Route Brief

## Route

- `/car-loan-calculators/pcp-calculator/`

## Redesign Goals

- simplify GFV, final payment, and option-fee understanding
- reduce visual density without hiding important deferred-cost details
- keep the route premium and calm on mobile and desktop

## Current UX/UI Problems

- route still depends on the dark shell
- deferred-cost hierarchy is not strong enough for a dense route
- source fragment still uses Home Loan wrapper naming
- slider-only inputs make PCP scenario testing less precise than it should be

## Target Layout And Hierarchy

- answer-first hero with monthly PCP payment
- clear supporting metrics for GFV, final payment, and total payable
- cost-breakdown mode reads as a deliberate second-level detail
- guide emphasizes the end-of-term decision before FAQ

## Implementation Notes

- add precise entry for deposit, APR, term, GFV, and option fee
- preserve deposit-type and term-unit toggles
- preserve monthly, yearly, and cost table modes

## Route-Level Tests

- `CLUSTER=auto-loans CALC=pcp-calculator npm run test:calc:unit`
- `CLUSTER=auto-loans CALC=pcp-calculator npm run test:calc:e2e`
- `CLUSTER=auto-loans CALC=pcp-calculator npm run test:calc:seo`
- `CLUSTER=auto-loans CALC=pcp-calculator npm run test:calc:cwv`
- `CLUSTER=auto-loans CALC=pcp-calculator npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- none

## Final Status

- `Completed — 2026-03-19`

## Completion Notes

- Auto Loan shell applied and deferred-payment hierarchy simplified on the rebuilt route.
- Precise companion inputs added for deposit, APR, term, GFV, and option fee.
- Scoped route gates passed: unit, E2E, SEO, CWV, and schema dedupe.

# `hire-purchase` Route Brief

## Route

- `/car-loan-calculators/hire-purchase-calculator/`

## Redesign Goals

- explain balloon-payment tradeoffs more clearly
- keep monthly payment and total payable easy to compare
- modernize the route without losing financing nuance

## Current UX/UI Problems

- route still depends on the dark shell
- balloon-payment meaning can get buried under the generic result card pattern
- source fragment still uses Home Loan wrapper naming
- slider-only inputs reduce precision for deposit, APR, and balloon comparisons

## Target Layout And Hierarchy

- answer-first hero with monthly payment
- secondary metrics emphasize financed amount, balloon, and total payable
- amortization table remains one focused section
- guide explicitly teaches the balloon tradeoff before FAQ

## Implementation Notes

- add precise entry for price, deposit, APR, term, and balloon
- preserve term-unit toggle behavior
- keep table IDs and data attributes stable

## Route-Level Tests

- `CLUSTER=auto-loans CALC=hire-purchase npm run test:calc:unit`
- `CLUSTER=auto-loans CALC=hire-purchase npm run test:calc:e2e`
- `CLUSTER=auto-loans CALC=hire-purchase npm run test:calc:seo`
- `CLUSTER=auto-loans CALC=hire-purchase npm run test:calc:cwv`
- `CLUSTER=auto-loans CALC=hire-purchase npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- none

## Final Status

- `Completed — 2026-03-19`

## Completion Notes

- Auto Loan shell applied and the explanation contract moved to `#hp-auto-loan-explanation`.
- Precise companion inputs added for price, deposit, APR, term, and balloon.
- Scoped route gates passed: unit, E2E, SEO, CWV, and schema dedupe.

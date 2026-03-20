# `future-value-of-annuity` Route Brief

## Route

- `/finance-calculators/future-value-of-annuity-calculator/`

## Redesign Goals

- clarify how regular payments grow over time
- make ordinary vs due annuity differences obvious without clutter
- keep the route premium and calm on mobile and desktop

## Current UX/UI Problems

- route still depends on the dark shell
- source fragment still uses Home Loan wrapper naming
- annuity controls and result hierarchy feel heavier than needed
- explanation structure is legacy and not guide-first

## Target Layout And Hierarchy

- answer-first hero with future annuity value
- clear supporting metrics for payment, timing, and growth basis
- guide emphasizes timing and compounding before FAQ
- important notes end the page in a concise card

## Implementation Notes

- preserve payment, period, annuity-type, and compounding behavior
- add precise entry for slider-heavy fields if needed
- keep data bindings and FAQ parity stable

## Route-Level Tests

- `CLUSTER=finance CALC=future-value-of-annuity npm run test:calc:unit`
- `CLUSTER=finance CALC=future-value-of-annuity npm run test:calc:e2e`
- `CLUSTER=finance CALC=future-value-of-annuity npm run test:calc:seo`
- `CLUSTER=finance CALC=future-value-of-annuity npm run test:calc:cwv`
- `CLUSTER=finance CALC=future-value-of-annuity npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- thin-content quality artifact reports `warn=1` with no blocking SEO failures

## Final Status

- `Completed on 2026-03-20`

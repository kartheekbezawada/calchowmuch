# `present-value-of-annuity` Route Brief

## Route

- `/finance-calculators/present-value-of-annuity-calculator/`

## Redesign Goals

- clarify ordinary vs due annuity comparison
- make present value and discount context legible at a glance
- keep the route calm despite multiple toggles

## Current UX/UI Problems

- route still depends on the dark shell
- source fragment still uses Home Loan wrapper naming
- annuity comparison hierarchy feels visually flat
- explanation order is legacy and lacks the current guide contract

## Target Layout And Hierarchy

- answer-first hero with present value
- supporting metrics show payment, timing, and effective periods
- guide emphasizes ordinary vs due differences before FAQ
- important notes close the page with planning assumptions

## Implementation Notes

- preserve period, annuity-type, and compounding toggles
- add precise entry for payment, rate, and periods if needed
- preserve explanation bindings and FAQ parity

## Route-Level Tests

- `CLUSTER=finance CALC=present-value-of-annuity npm run test:calc:unit`
- `CLUSTER=finance CALC=present-value-of-annuity npm run test:calc:e2e`
- `CLUSTER=finance CALC=present-value-of-annuity npm run test:calc:seo`
- `CLUSTER=finance CALC=present-value-of-annuity npm run test:calc:cwv`
- `CLUSTER=finance CALC=present-value-of-annuity npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- thin-content quality artifact reports `warn=1` with no blocking SEO failures

## Final Status

- `Completed on 2026-03-20`

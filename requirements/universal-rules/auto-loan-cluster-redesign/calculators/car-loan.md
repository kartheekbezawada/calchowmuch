# `car-loan` Route Brief

## Route

- `/car-loan-calculators/car-loan-calculator/`

## Redesign Goals

- establish the Auto Loan shell and shared visual language
- make monthly payment and amount financed readable in one glance
- replace slider-only entry with precise, calm input control
- remove all dark, electric, and Home Loan carryover

## Current UX/UI Problems

- route still depends on the dark legacy shell and ads layout
- source fragment uses Home Loan wrapper naming
- electric slider styling feels visually heavy and inconsistent with the new system
- amount-financed inputs are dense and lack precise entry

## Target Layout And Hierarchy

- centered Auto Loan page header with a short intro
- form card on the left, answer-first result card on the right on desktop
- result stack leads with monthly payment, then amount financed and total cost
- amortization table follows in one clear block
- guide, FAQ, and important notes follow in calm rhythm

## Implementation Notes

- replace Home Loan wrapper classes with Auto Loan shared classes
- add precise companion inputs for price, deposit, trade-in, fees, tax, term, and APR where justified
- remove electric slider chrome and dark preview-card treatment
- keep all current calculation hooks, data attributes, and table IDs intact

## Route-Level Tests

- `CLUSTER=auto-loans CALC=car-loan npm run test:calc:unit`
- `CLUSTER=auto-loans CALC=car-loan npm run test:calc:e2e`
- `CLUSTER=auto-loans CALC=car-loan npm run test:calc:seo`
- `CLUSTER=auto-loans CALC=car-loan npm run test:calc:cwv`
- `CLUSTER=auto-loans CALC=car-loan npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- none

## Final Status

- `Completed — 2026-03-19`

## Completion Notes

- Auto Loan shell applied and Home Loan wrapper leakage removed.
- Precise companion inputs added for price, deposit, trade-in, fees, tax, APR, and term.
- Scoped route gates passed: unit, E2E, SEO, CWV, and schema dedupe.

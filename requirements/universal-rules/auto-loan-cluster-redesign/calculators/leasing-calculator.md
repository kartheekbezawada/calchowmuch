# `leasing-calculator` Route Brief

## Route

- `/car-loan-calculators/car-lease-calculator/`

## Redesign Goals

- make lease structure understandable at a glance
- reduce the current visual heaviness more than any other Auto Loan route
- keep residual, money factor, and total lease cost legible on mobile

## Current UX/UI Problems

- route still depends on the dark shell
- current styling is the most neon-heavy and visually busy in the Auto Loan cluster
- source fragment still uses Home Loan wrapper naming
- route density is high because it has multiple toggles and three table modes

## Target Layout And Hierarchy

- answer-first hero with estimated monthly lease payment
- supporting metrics surface residual, cap cost, finance charge, and total lease cost cleanly
- table controls stay compact and aligned
- cost-breakdown mode feels like a concise decision aid, not a spreadsheet

## Implementation Notes

- add precise entry for price, residual, term, money factor, and upfront payment
- preserve residual-type and term-unit toggles
- preserve monthly, yearly, and cost table modes
- audit mobile table behavior closely because this is the densest route

## Route-Level Tests

- `CLUSTER=auto-loans CALC=leasing-calculator npm run test:calc:unit`
- `CLUSTER=auto-loans CALC=leasing-calculator npm run test:calc:e2e`
- `CLUSTER=auto-loans CALC=leasing-calculator npm run test:calc:seo`
- `CLUSTER=auto-loans CALC=leasing-calculator npm run test:calc:cwv`
- `CLUSTER=auto-loans CALC=leasing-calculator npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- none

## Final Status

- `Completed — 2026-03-19`

## Completion Notes

- Auto Loan shell applied and the route no longer depends on the heavy legacy lease presentation.
- Precise companion inputs added for price, residual, term, money factor, and upfront payment.
- Scoped route gates passed: unit, E2E, SEO, CWV, and schema dedupe.

# `investment-return` Route Brief

## Route

- `/finance-calculators/investment-return-calculator/`

## Redesign Goals

- preserve advanced planning power while making the baseline answer easy to scan
- keep the densest Finance route calm and mobile-friendly
- align the route to the shared Finance system without dumbing it down

## Current UX/UI Problems

- route still depends on the dark shell
- source fragment still uses Home Loan wrapper naming
- breadcrumb/schema still point to Home Loan
- advanced controls and result modules feel visually heavier than needed

## Target Layout And Hierarchy

- answer-first hero with final portfolio value
- supporting metrics show contributions, profit, CAGR, real CAGR, tax, and EAR
- advanced mode remains secondary behind a clean baseline flow
- breakdown table and graph become structured secondary modules
- guide teaches scenario quality before FAQ

## Implementation Notes

- preserve advanced mode, event rows, crash simulation, graph behavior, and breakdown toggle
- keep existing button-only post-load calculation contract
- enforce graph and table readability contract on both annual and monthly modes

## Route-Level Tests

- `CLUSTER=finance CALC=investment-return npm run test:calc:unit`
- `CLUSTER=finance CALC=investment-return npm run test:calc:e2e`
- `CLUSTER=finance CALC=investment-return npm run test:calc:seo`
- `CLUSTER=finance CALC=investment-return npm run test:calc:cwv`
- `CLUSTER=finance CALC=investment-return npm run test:schema:dedupe -- --scope=calc`

## Open Issues

- none

## Final Status

- `Planned`

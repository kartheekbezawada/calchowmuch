# Home Loan Design Extension Plan

Date: 2026-03-19
Owner: Codex
Status: Approved for implementation

## Objective

Extend the newer polished calculator presentation used on the recent credit-card redesign to the full Home Loan design family while preserving:

- MPA navigation
- Existing calculator logic
- Existing route URLs
- Existing `calc_exp` single-pane structure
- Existing loan-shell DOM contract used by scoped tests

## Reference Assumption

The visual reference for this extension is the current credit-card redesign pattern, especially the family-level styling approach in:

- `public/calculators/credit-card-calculators/shared/cluster-light.css`
- `scripts/generate-mpa-pages.js`

This implementation adapts that pattern to Home Loan routes without replacing the current loan shell.

## Target Routes

- `/loan-calculators/mortgage-calculator/`
- `/loan-calculators/how-much-can-i-borrow/`
- `/loan-calculators/remortgage-calculator/`
- `/loan-calculators/buy-to-let-mortgage-calculator/`
- `/loan-calculators/offset-mortgage-calculator/`
- `/loan-calculators/interest-rate-change-calculator/`
- `/loan-calculators/ltv-calculator/`
- `/loan-calculators/personal-loan-calculator/`

## Implementation Strategy

1. Add a shared Home Loan family stylesheet at `public/calculators/loan-calculators/shared/cluster-light.css`.
2. Keep the existing loan shell, top nav, left nav, and single center panel contract unchanged.
3. Update the generator so Home Loan routes:
   - strip fragment-level `@import` duplication for route CSS
   - inline route CSS plus the new shared Home Loan family stylesheet in the page head
   - continue loading the existing global shell/theme/layout assets
4. Regenerate only the approved Home Loan routes with scoped generation.

## Design Direction

- Light, premium surfaces for the main panel and explanation sections
- Strong but restrained blue/cyan Home Loan accents
- Dark contrast preview/result cards to keep key figures prominent
- Cleaner slider, input, button, table, and FAQ presentation
- No new calculator inputs or interaction model changes

## Risk Controls

- Do not alter route metadata or sitemap state
- Do not widen scope outside approved Home Loan files
- Prefer CSS and generator integration over markup churn
- Preserve current IDs and semantic structure so scoped tests remain valid

## Verification Plan

- `npm run lint`
- Scoped generation for each approved route
- `CLUSTER=loans CALC=<calc> npm run test:calc:unit`
- `CLUSTER=loans CALC=<calc> npm run test:calc:e2e`
- `CLUSTER=loans CALC=<calc> npm run test:calc:seo`
- `CLUSTER=loans CALC=<calc> npm run test:calc:cwv`
- `CLUSTER=loans CALC=<calc> npm run test:schema:dedupe -- --scope=calc`
- `npm run test:cluster:contracts`
- `npm run test:isolation:scope`

## Deliverables

- Shared Home Loan family stylesheet
- Generator support for Home Loan family inline styling
- Regenerated Home Loan route HTML
- Release sign-off with scoped evidence

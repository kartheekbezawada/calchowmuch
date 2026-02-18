# URL Migration Plan (SEO/SERP + Sitemap Only)

## Scope
This document tracks URL-only migration waves. In scope: routes, redirects, sitemap, canonical/internal links, and SEO validation.

Out of scope: unit tests, performance/CWV, functional e2e, UI/formula changes.

## Wave A — Percentage (Completed)
Canonical route map (completed):
1. `/percentage-calculators/percent-change/` -> `/percentage-calculators/percent-change-calculator/`
2. `/percentage-calculators/percentage-difference/` -> `/percentage-calculators/percentage-difference-calculator/`
3. `/percentage-calculators/percentage-increase/` -> `/percentage-calculators/percentage-increase-calculator/`
4. `/percentage-calculators/percentage-decrease/` -> `/percentage-calculators/percentage-decrease-calculator/`
5. `/percentage-calculators/percentage-composition/` -> `/percentage-calculators/percentage-composition-calculator/`
6. `/percentage-calculators/reverse-percentage/` -> `/percentage-calculators/reverse-percentage-calculator/`
7. `/percentage-calculators/percent-to-fraction-decimal/` -> `/percentage-calculators/percent-to-fraction-decimal-calculator/`
8. `/percentage-calculators/what-percent-is-x-of-y/` -> `/percentage-calculators/percentage-finder-calculator/`
9. `/percentage-calculators/what-percent-is-calculator/` -> `/percentage-calculators/percentage-finder-calculator/`
10. `/percentage-calculators/percentage-of-a-number/` -> `/percentage-calculators/percentage-of-a-number-calculator/`

Legacy redirect:
- `/math/percentage-increase/` -> `/percentage-calculators/percentage-increase-calculator/`

## Wave B — Finance (`/finance-calculators/`) (Current)
Canonical route map:
1. `/finance/present-value/` -> `/finance-calculators/present-value-calculator/`
2. `/finance/future-value/` -> `/finance-calculators/future-value-calculator/`
3. `/finance/present-value-of-annuity/` -> `/finance-calculators/present-value-of-annuity-calculator/`
4. `/finance/future-value-of-annuity/` -> `/finance-calculators/future-value-of-annuity-calculator/`
5. `/finance/simple-interest/` -> `/finance-calculators/simple-interest-calculator/`
6. `/finance/compound-interest/` -> `/finance-calculators/compound-interest-calculator/`
7. `/finance/effective-annual-rate/` -> `/finance-calculators/effective-annual-rate-calculator/`
8. `/finance/investment-growth/` -> `/finance-calculators/investment-growth-calculator/`
9. `/finance/time-to-savings-goal/` -> `/finance-calculators/time-to-savings-goal-calculator/`
10. `/finance/monthly-savings-needed/` -> `/finance-calculators/monthly-savings-needed-calculator/`

Assumption:
- `public/calculators/finance/savings-goal/` remains out of scope.

## SEO Validation Commands
1. `CLUSTER=finance npm run test:cluster:seo`
2. `CLUSTER=finance CALC=present-value npm run test:calc:seo`
3. `CLUSTER=finance CALC=future-value npm run test:calc:seo`
4. `CLUSTER=finance CALC=present-value-of-annuity npm run test:calc:seo`
5. `CLUSTER=finance CALC=future-value-of-annuity npm run test:calc:seo`
6. `CLUSTER=finance CALC=simple-interest npm run test:calc:seo`
7. `CLUSTER=finance CALC=compound-interest npm run test:calc:seo`
8. `CLUSTER=finance CALC=effective-annual-rate npm run test:calc:seo`
9. `CLUSTER=finance CALC=investment-growth npm run test:calc:seo`
10. `CLUSTER=finance CALC=time-to-savings-goal npm run test:calc:seo`
11. `CLUSTER=finance CALC=monthly-savings-needed npm run test:calc:seo`
12. `npx playwright test tests_specs/infrastructure/e2e/sitemap-seo.spec.js`

# salary/annual-to-monthly-salary-calculator release

Scope: calculator-level release tests for `annual-to-monthly-salary-calculator` in cluster `salary`.

Commands:
- `CLUSTER=salary CALC=annual-to-monthly-salary-calculator npm run test:calc:unit`
- `CLUSTER=salary CALC=annual-to-monthly-salary-calculator npm run test:calc:e2e`
- `CLUSTER=salary CALC=annual-to-monthly-salary-calculator npm run test:calc:seo`
- `CLUSTER=salary CALC=annual-to-monthly-salary-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /salary-calculators/annual-to-monthly-salary-calculator/

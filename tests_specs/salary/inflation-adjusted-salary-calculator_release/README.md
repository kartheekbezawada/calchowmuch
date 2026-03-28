# salary/inflation-adjusted-salary-calculator release

Scope: calculator-level release tests for `inflation-adjusted-salary-calculator` in cluster `salary`.

Commands:
- `CLUSTER=salary CALC=inflation-adjusted-salary-calculator npm run test:calc:unit`
- `CLUSTER=salary CALC=inflation-adjusted-salary-calculator npm run test:calc:e2e`
- `CLUSTER=salary CALC=inflation-adjusted-salary-calculator npm run test:calc:seo`
- `CLUSTER=salary CALC=inflation-adjusted-salary-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /salary-calculators/inflation-adjusted-salary-calculator/

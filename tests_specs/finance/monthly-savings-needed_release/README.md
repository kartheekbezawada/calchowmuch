# finance/monthly-savings-needed release

Scope: calculator-level release tests for `monthly-savings-needed` in cluster `finance`.

Commands:
- `CLUSTER=finance CALC=monthly-savings-needed npm run test:calc:unit`
- `CLUSTER=finance CALC=monthly-savings-needed npm run test:calc:e2e`
- `CLUSTER=finance CALC=monthly-savings-needed npm run test:calc:seo`
- `CLUSTER=finance CALC=monthly-savings-needed npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /finance-calculators/monthly-savings-needed-calculator/

# salary/salary-calculator release

Scope: calculator-level release tests for `salary-calculator` in cluster `salary`.

Commands:
- `CLUSTER=salary CALC=salary-calculator npm run test:calc:unit`
- `CLUSTER=salary CALC=salary-calculator npm run test:calc:e2e`
- `CLUSTER=salary CALC=salary-calculator npm run test:calc:seo`
- `CLUSTER=salary CALC=salary-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /salary-calculators/salary-calculator/

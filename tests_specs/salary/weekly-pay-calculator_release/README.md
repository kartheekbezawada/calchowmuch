# salary/weekly-pay-calculator release

Scope: calculator-level release tests for `weekly-pay-calculator` in cluster `salary`.

Commands:
- `CLUSTER=salary CALC=weekly-pay-calculator npm run test:calc:unit`
- `CLUSTER=salary CALC=weekly-pay-calculator npm run test:calc:e2e`
- `CLUSTER=salary CALC=weekly-pay-calculator npm run test:calc:seo`
- `CLUSTER=salary CALC=weekly-pay-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /salary-calculators/weekly-pay-calculator/

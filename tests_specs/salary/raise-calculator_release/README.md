# salary/raise-calculator release

Scope: calculator-level release tests for `raise-calculator` in cluster `salary`.

Commands:
- `CLUSTER=salary CALC=raise-calculator npm run test:calc:unit`
- `CLUSTER=salary CALC=raise-calculator npm run test:calc:e2e`
- `CLUSTER=salary CALC=raise-calculator npm run test:calc:seo`
- `CLUSTER=salary CALC=raise-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /salary-calculators/raise-calculator/

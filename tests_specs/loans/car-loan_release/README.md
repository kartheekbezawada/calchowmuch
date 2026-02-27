# loans/car-loan release

Scope: calculator-level release tests for `car-loan` in cluster `loans`.

Commands:
- `CLUSTER=loans CALC=car-loan npm run test:calc:unit`
- `CLUSTER=loans CALC=car-loan npm run test:calc:e2e`
- `CLUSTER=loans CALC=car-loan npm run test:calc:seo`
- `CLUSTER=loans CALC=car-loan npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /car-loan-calculators/car-loan-calculator/

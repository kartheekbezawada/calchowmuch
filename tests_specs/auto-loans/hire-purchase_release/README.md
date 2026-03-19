# auto-loans/hire-purchase release

Scope: calculator-level release tests for `hire-purchase` in cluster `auto-loans`.

Commands:
- `CLUSTER=auto-loans CALC=hire-purchase npm run test:calc:unit`
- `CLUSTER=auto-loans CALC=hire-purchase npm run test:calc:e2e`
- `CLUSTER=auto-loans CALC=hire-purchase npm run test:calc:seo`
- `CLUSTER=auto-loans CALC=hire-purchase npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /car-loan-calculators/hire-purchase-calculator/

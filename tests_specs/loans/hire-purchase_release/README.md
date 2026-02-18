# loans/hire-purchase release

Scope: calculator-level release tests for `hire-purchase` in cluster `loans`.

Commands:
- `CLUSTER=loans CALC=hire-purchase npm run test:calc:unit`
- `CLUSTER=loans CALC=hire-purchase npm run test:calc:e2e`
- `CLUSTER=loans CALC=hire-purchase npm run test:calc:seo`
- `CLUSTER=loans CALC=hire-purchase npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /loans/hire-purchase/

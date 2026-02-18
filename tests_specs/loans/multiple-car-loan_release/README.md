# loans/multiple-car-loan release

Scope: calculator-level release tests for `multiple-car-loan` in cluster `loans`.

Commands:
- `CLUSTER=loans CALC=multiple-car-loan npm run test:calc:unit`
- `CLUSTER=loans CALC=multiple-car-loan npm run test:calc:e2e`
- `CLUSTER=loans CALC=multiple-car-loan npm run test:calc:seo`
- `CLUSTER=loans CALC=multiple-car-loan npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /loans/multiple-car-loan/

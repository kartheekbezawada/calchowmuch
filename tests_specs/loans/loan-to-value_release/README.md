# loans/loan-to-value release

Scope: calculator-level release tests for `loan-to-value` in cluster `loans`.

Commands:
- `CLUSTER=loans CALC=loan-to-value npm run test:calc:unit`
- `CLUSTER=loans CALC=loan-to-value npm run test:calc:e2e`
- `CLUSTER=loans CALC=loan-to-value npm run test:calc:seo`
- `CLUSTER=loans CALC=loan-to-value npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /loans/loan-to-value/

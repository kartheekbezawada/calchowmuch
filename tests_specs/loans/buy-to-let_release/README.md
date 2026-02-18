# loans/buy-to-let release

Scope: calculator-level release tests for `buy-to-let` in cluster `loans`.

Commands:
- `CLUSTER=loans CALC=buy-to-let npm run test:calc:unit`
- `CLUSTER=loans CALC=buy-to-let npm run test:calc:e2e`
- `CLUSTER=loans CALC=buy-to-let npm run test:calc:seo`
- `CLUSTER=loans CALC=buy-to-let npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /loans/buy-to-let/

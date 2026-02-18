# loans/pcp-calculator release

Scope: calculator-level release tests for `pcp-calculator` in cluster `loans`.

Commands:
- `CLUSTER=loans CALC=pcp-calculator npm run test:calc:unit`
- `CLUSTER=loans CALC=pcp-calculator npm run test:calc:e2e`
- `CLUSTER=loans CALC=pcp-calculator npm run test:calc:seo`
- `CLUSTER=loans CALC=pcp-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /loans/pcp-calculator/

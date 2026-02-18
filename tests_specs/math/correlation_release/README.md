# math/correlation release

Scope: calculator-level release tests for `correlation` in cluster `math`.

Commands:
- `CLUSTER=math CALC=correlation npm run test:calc:unit`
- `CLUSTER=math CALC=correlation npm run test:calc:e2e`
- `CLUSTER=math CALC=correlation npm run test:calc:seo`
- `CLUSTER=math CALC=correlation npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/statistics/correlation/

# math/derivative release

Scope: calculator-level release tests for `derivative` in cluster `math`.

Commands:
- `CLUSTER=math CALC=derivative npm run test:calc:unit`
- `CLUSTER=math CALC=derivative npm run test:calc:e2e`
- `CLUSTER=math CALC=derivative npm run test:calc:seo`
- `CLUSTER=math CALC=derivative npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/calculus/derivative/

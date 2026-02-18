# math/basic release

Scope: calculator-level release tests for `basic` in cluster `math`.

Commands:
- `CLUSTER=math CALC=basic npm run test:calc:unit`
- `CLUSTER=math CALC=basic npm run test:calc:e2e`
- `CLUSTER=math CALC=basic npm run test:calc:seo`
- `CLUSTER=math CALC=basic npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/basic/

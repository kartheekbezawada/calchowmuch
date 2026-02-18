# math/probability release

Scope: calculator-level release tests for `probability` in cluster `math`.

Commands:
- `CLUSTER=math CALC=probability npm run test:calc:unit`
- `CLUSTER=math CALC=probability npm run test:calc:e2e`
- `CLUSTER=math CALC=probability npm run test:calc:seo`
- `CLUSTER=math CALC=probability npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/probability/

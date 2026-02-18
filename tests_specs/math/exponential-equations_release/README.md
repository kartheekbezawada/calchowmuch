# math/exponential-equations release

Scope: calculator-level release tests for `exponential-equations` in cluster `math`.

Commands:
- `CLUSTER=math CALC=exponential-equations npm run test:calc:unit`
- `CLUSTER=math CALC=exponential-equations npm run test:calc:e2e`
- `CLUSTER=math CALC=exponential-equations npm run test:calc:seo`
- `CLUSTER=math CALC=exponential-equations npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/log/exponential-equations/

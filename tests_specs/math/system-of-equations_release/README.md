# math/system-of-equations release

Scope: calculator-level release tests for `system-of-equations` in cluster `math`.

Commands:
- `CLUSTER=math CALC=system-of-equations npm run test:calc:unit`
- `CLUSTER=math CALC=system-of-equations npm run test:calc:e2e`
- `CLUSTER=math CALC=system-of-equations npm run test:calc:seo`
- `CLUSTER=math CALC=system-of-equations npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/algebra/system-of-equations/

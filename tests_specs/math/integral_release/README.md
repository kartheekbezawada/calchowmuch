# math/integral release

Scope: calculator-level release tests for `integral` in cluster `math`.

Commands:
- `CLUSTER=math CALC=integral npm run test:calc:unit`
- `CLUSTER=math CALC=integral npm run test:calc:e2e`
- `CLUSTER=math CALC=integral npm run test:calc:seo`
- `CLUSTER=math CALC=integral npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/calculus/integral/

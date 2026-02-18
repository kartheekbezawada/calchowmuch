# math/critical-points release

Scope: calculator-level release tests for `critical-points` in cluster `math`.

Commands:
- `CLUSTER=math CALC=critical-points npm run test:calc:unit`
- `CLUSTER=math CALC=critical-points npm run test:calc:e2e`
- `CLUSTER=math CALC=critical-points npm run test:calc:seo`
- `CLUSTER=math CALC=critical-points npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/calculus/critical-points/

# math/triangle-solver release

Scope: calculator-level release tests for `triangle-solver` in cluster `math`.

Commands:
- `CLUSTER=math CALC=triangle-solver npm run test:calc:unit`
- `CLUSTER=math CALC=triangle-solver npm run test:calc:e2e`
- `CLUSTER=math CALC=triangle-solver npm run test:calc:seo`
- `CLUSTER=math CALC=triangle-solver npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/trigonometry/triangle-solver/

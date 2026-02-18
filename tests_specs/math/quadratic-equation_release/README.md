# math/quadratic-equation release

Scope: calculator-level release tests for `quadratic-equation` in cluster `math`.

Commands:
- `CLUSTER=math CALC=quadratic-equation npm run test:calc:unit`
- `CLUSTER=math CALC=quadratic-equation npm run test:calc:e2e`
- `CLUSTER=math CALC=quadratic-equation npm run test:calc:seo`
- `CLUSTER=math CALC=quadratic-equation npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/algebra/quadratic-equation/

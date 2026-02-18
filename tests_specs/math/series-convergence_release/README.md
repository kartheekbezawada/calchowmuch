# math/series-convergence release

Scope: calculator-level release tests for `series-convergence` in cluster `math`.

Commands:
- `CLUSTER=math CALC=series-convergence npm run test:calc:unit`
- `CLUSTER=math CALC=series-convergence npm run test:calc:e2e`
- `CLUSTER=math CALC=series-convergence npm run test:calc:seo`
- `CLUSTER=math CALC=series-convergence npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/calculus/series-convergence/

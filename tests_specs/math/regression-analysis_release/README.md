# math/regression-analysis release

Scope: calculator-level release tests for `regression-analysis` in cluster `math`.

Commands:
- `CLUSTER=math CALC=regression-analysis npm run test:calc:unit`
- `CLUSTER=math CALC=regression-analysis npm run test:calc:e2e`
- `CLUSTER=math CALC=regression-analysis npm run test:calc:seo`
- `CLUSTER=math CALC=regression-analysis npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/statistics/regression-analysis/

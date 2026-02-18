# math/mean-median-mode-range release

Scope: calculator-level release tests for `mean-median-mode-range` in cluster `math`.

Commands:
- `CLUSTER=math CALC=mean-median-mode-range npm run test:calc:unit`
- `CLUSTER=math CALC=mean-median-mode-range npm run test:calc:e2e`
- `CLUSTER=math CALC=mean-median-mode-range npm run test:calc:seo`
- `CLUSTER=math CALC=mean-median-mode-range npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/mean-median-mode-range/

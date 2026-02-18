# math/natural-log release

Scope: calculator-level release tests for `natural-log` in cluster `math`.

Commands:
- `CLUSTER=math CALC=natural-log npm run test:calc:unit`
- `CLUSTER=math CALC=natural-log npm run test:calc:e2e`
- `CLUSTER=math CALC=natural-log npm run test:calc:seo`
- `CLUSTER=math CALC=natural-log npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/log/natural-log/

# percentage/percentage-composition release

Scope: calculator-level release tests for `percentage-composition` in cluster `percentage`.

Commands:
- `CLUSTER=percentage CALC=percentage-composition npm run test:calc:unit`
- `CLUSTER=percentage CALC=percentage-composition npm run test:calc:e2e`
- `CLUSTER=percentage CALC=percentage-composition npm run test:calc:seo`
- `CLUSTER=percentage CALC=percentage-composition npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /percentage-calculators/percentage-composition/

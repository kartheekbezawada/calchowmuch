# percentage/reverse-percentage release

Scope: calculator-level release tests for `reverse-percentage` in cluster `percentage`.

Commands:
- `CLUSTER=percentage CALC=reverse-percentage npm run test:calc:unit`
- `CLUSTER=percentage CALC=reverse-percentage npm run test:calc:e2e`
- `CLUSTER=percentage CALC=reverse-percentage npm run test:calc:seo`
- `CLUSTER=percentage CALC=reverse-percentage npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /percentage-calculators/reverse-percentage-calculator/

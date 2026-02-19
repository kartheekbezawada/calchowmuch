# percentage/percentage-of-a-number release

Scope: calculator-level release tests for `percentage-of-a-number` in cluster `percentage`.

Commands:
- `CLUSTER=percentage CALC=percentage-of-a-number npm run test:calc:unit`
- `CLUSTER=percentage CALC=percentage-of-a-number npm run test:calc:e2e`
- `CLUSTER=percentage CALC=percentage-of-a-number npm run test:calc:seo`
- `CLUSTER=percentage CALC=percentage-of-a-number npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /percentage-calculators/percentage-of-a-number-calculator/

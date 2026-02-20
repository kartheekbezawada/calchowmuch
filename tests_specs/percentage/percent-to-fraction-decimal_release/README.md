# percentage/percent-to-fraction-decimal release

Scope: calculator-level release tests for `percent-to-fraction-decimal` in cluster `percentage`.

Commands:
- `CLUSTER=percentage CALC=percent-to-fraction-decimal npm run test:calc:unit`
- `CLUSTER=percentage CALC=percent-to-fraction-decimal npm run test:calc:e2e`
- `CLUSTER=percentage CALC=percent-to-fraction-decimal npm run test:calc:seo`
- `CLUSTER=percentage CALC=percent-to-fraction-decimal npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /percentage-calculators/percent-to-fraction-decimal-calculator/

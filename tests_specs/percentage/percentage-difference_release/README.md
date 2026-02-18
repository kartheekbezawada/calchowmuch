# percentage/percentage-difference release

Scope: calculator-level release tests for `percentage-difference` in cluster `percentage`.

Commands:
- `CLUSTER=percentage CALC=percentage-difference npm run test:calc:unit`
- `CLUSTER=percentage CALC=percentage-difference npm run test:calc:e2e`
- `CLUSTER=percentage CALC=percentage-difference npm run test:calc:seo`
- `CLUSTER=percentage CALC=percentage-difference npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /percentage-calculators/percentage-difference/

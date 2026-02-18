# math/percentage-increase release

Scope: calculator-level release tests for `percentage-increase` in cluster `math`.

Commands:
- `CLUSTER=math CALC=percentage-increase npm run test:calc:unit`
- `CLUSTER=math CALC=percentage-increase npm run test:calc:e2e`
- `CLUSTER=math CALC=percentage-increase npm run test:calc:seo`
- `CLUSTER=math CALC=percentage-increase npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /percentage-calculators/percentage-increase/

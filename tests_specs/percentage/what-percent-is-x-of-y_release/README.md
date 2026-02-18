# percentage/what-percent-is-x-of-y release

Scope: calculator-level release tests for `what-percent-is-x-of-y` in cluster `percentage`.

Commands:
- `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:unit`
- `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:e2e`
- `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:seo`
- `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /percentage-calculators/percentage-finder-calculator/

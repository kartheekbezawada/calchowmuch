# loans/remortgage-switching release

Scope: calculator-level release tests for `remortgage-switching` in cluster `loans`.

Commands:
- `CLUSTER=loans CALC=remortgage-switching npm run test:calc:unit`
- `CLUSTER=loans CALC=remortgage-switching npm run test:calc:e2e`
- `CLUSTER=loans CALC=remortgage-switching npm run test:calc:seo`
- `CLUSTER=loans CALC=remortgage-switching npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /loan-calculators/remortgage-calculator/

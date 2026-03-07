# loans/personal-loan release

Scope: calculator-level release tests for `personal-loan` in cluster `loans`.

Commands:
- `CLUSTER=loans CALC=personal-loan npm run test:calc:unit`
- `CLUSTER=loans CALC=personal-loan npm run test:calc:e2e`
- `CLUSTER=loans CALC=personal-loan npm run test:calc:seo`
- `CLUSTER=loans CALC=personal-loan npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /loan-calculators/personal-loan-calculator/

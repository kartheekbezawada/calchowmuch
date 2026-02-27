# loans/offset-calculator release

Scope: calculator-level release tests for `offset-calculator` in cluster `loans`.

Commands:
- `CLUSTER=loans CALC=offset-calculator npm run test:calc:unit`
- `CLUSTER=loans CALC=offset-calculator npm run test:calc:e2e`
- `CLUSTER=loans CALC=offset-calculator npm run test:calc:seo`
- `CLUSTER=loans CALC=offset-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /loan-calculators/offset-mortgage-calculator/

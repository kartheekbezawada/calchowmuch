# loans/how-much-can-i-borrow release

Scope: calculator-level release tests for `how-much-can-i-borrow` in cluster `loans`.

Commands:
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:unit`
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:e2e`
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:seo`
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /loan-calculators/how-much-can-i-borrow/

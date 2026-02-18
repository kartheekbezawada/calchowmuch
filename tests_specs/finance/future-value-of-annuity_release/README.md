# finance/future-value-of-annuity release

Scope: calculator-level release tests for `future-value-of-annuity` in cluster `finance`.

Commands:
- `CLUSTER=finance CALC=future-value-of-annuity npm run test:calc:unit`
- `CLUSTER=finance CALC=future-value-of-annuity npm run test:calc:e2e`
- `CLUSTER=finance CALC=future-value-of-annuity npm run test:calc:seo`
- `CLUSTER=finance CALC=future-value-of-annuity npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /finance/future-value-of-annuity/

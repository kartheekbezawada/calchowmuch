# finance/effective-annual-rate release

Scope: calculator-level release tests for `effective-annual-rate` in cluster `finance`.

Commands:
- `CLUSTER=finance CALC=effective-annual-rate npm run test:calc:unit`
- `CLUSTER=finance CALC=effective-annual-rate npm run test:calc:e2e`
- `CLUSTER=finance CALC=effective-annual-rate npm run test:calc:seo`
- `CLUSTER=finance CALC=effective-annual-rate npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /finance/effective-annual-rate/

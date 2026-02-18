# finance/simple-interest release

Scope: calculator-level release tests for `simple-interest` in cluster `finance`.

Commands:
- `CLUSTER=finance CALC=simple-interest npm run test:calc:unit`
- `CLUSTER=finance CALC=simple-interest npm run test:calc:e2e`
- `CLUSTER=finance CALC=simple-interest npm run test:calc:seo`
- `CLUSTER=finance CALC=simple-interest npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /finance/simple-interest/

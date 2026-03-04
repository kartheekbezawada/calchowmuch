# finance/present-value release

Scope: calculator-level release tests for `present-value` in cluster `finance`.

Commands:
- `CLUSTER=finance CALC=present-value npm run test:calc:unit`
- `CLUSTER=finance CALC=present-value npm run test:calc:e2e`
- `CLUSTER=finance CALC=present-value npm run test:calc:seo`
- `CLUSTER=finance CALC=present-value npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /finance-calculators/present-value-calculator/

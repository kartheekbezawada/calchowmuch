# finance/investment-growth release

Scope: calculator-level release tests for `investment-growth` in cluster `finance`.

Commands:
- `CLUSTER=finance CALC=investment-growth npm run test:calc:unit`
- `CLUSTER=finance CALC=investment-growth npm run test:calc:e2e`
- `CLUSTER=finance CALC=investment-growth npm run test:calc:seo`
- `CLUSTER=finance CALC=investment-growth npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /finance-calculators/investment-growth-calculator/

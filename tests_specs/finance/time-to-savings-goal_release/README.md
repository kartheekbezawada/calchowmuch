# finance/time-to-savings-goal release

Scope: calculator-level release tests for `time-to-savings-goal` in cluster `finance`.

Commands:
- `CLUSTER=finance CALC=time-to-savings-goal npm run test:calc:unit`
- `CLUSTER=finance CALC=time-to-savings-goal npm run test:calc:e2e`
- `CLUSTER=finance CALC=time-to-savings-goal npm run test:calc:seo`
- `CLUSTER=finance CALC=time-to-savings-goal npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /finance-calculators/time-to-savings-goal-calculator/

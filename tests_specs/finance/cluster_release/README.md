# finance cluster_release

Scope: cluster-level release tests for `finance`.

Commands:
- `CLUSTER=finance npm run test:cluster:unit`
- `CLUSTER=finance npm run test:cluster:e2e`
- `CLUSTER=finance npm run test:cluster:seo`
- `CLUSTER=finance npm run test:cluster:cwv`

Pass criteria:
- Unit/contracts pass
- Cluster E2E + SEO smoke pass
- Cluster CWV thresholds pass

Ownership: cluster release owner.

Routes:
- /finance-calculators/compound-interest-calculator/
- /finance-calculators/effective-annual-rate-calculator/
- /finance-calculators/future-value-of-annuity-calculator/
- /finance-calculators/future-value-calculator/
- /finance-calculators/investment-growth-calculator/
- /finance-calculators/investment-return-calculator/
- /finance-calculators/monthly-savings-needed-calculator/
- /finance-calculators/present-value-of-annuity-calculator/
- /finance-calculators/present-value-calculator/
- /finance-calculators/simple-interest-calculator/
- /finance-calculators/time-to-savings-goal-calculator/

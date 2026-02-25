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
- /finance/compound-interest/
- /finance/effective-annual-rate/
- /finance/future-value-of-annuity/
- /finance/future-value/
- /finance/investment-growth/
- /finance-calculators/investment-return-calculator/
- /finance/monthly-savings-needed/
- /finance/present-value-of-annuity/
- /finance/present-value/
- /finance/simple-interest/
- /finance/time-to-savings-goal/

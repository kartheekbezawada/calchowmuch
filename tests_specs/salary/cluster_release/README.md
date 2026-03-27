# salary cluster_release

Scope: cluster-level release tests for `salary`.

Commands:
- `CLUSTER=salary npm run test:cluster:unit`
- `CLUSTER=salary npm run test:cluster:e2e`
- `CLUSTER=salary npm run test:cluster:seo`
- `CLUSTER=salary npm run test:cluster:cwv`

Pass criteria:
- Unit/contracts pass
- Cluster E2E + SEO smoke pass
- Cluster CWV thresholds pass

Ownership: cluster release owner.

Routes:
- /salary-calculators/
- /salary-calculators/salary-calculator/
- /salary-calculators/hourly-to-salary-calculator/
- /salary-calculators/salary-to-hourly-calculator/
- /salary-calculators/annual-to-monthly-salary-calculator/
- /salary-calculators/monthly-to-annual-salary-calculator/
- /salary-calculators/weekly-pay-calculator/
- /salary-calculators/overtime-pay-calculator/
- /salary-calculators/raise-calculator/
- /salary-calculators/bonus-calculator/
- /salary-calculators/commission-calculator/

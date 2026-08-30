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

Routes (consolidated 2026-08, 11 calculators -> 4 + hub):
- /salary-calculators/
- /salary-calculators/salary-calculator/
- /salary-calculators/overtime-pay-calculator/
- /salary-calculators/raise-calculator/
- /salary-calculators/bonus-calculator/

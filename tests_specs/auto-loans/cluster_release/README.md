# auto-loans cluster_release

Scope: cluster-level release tests for `auto-loans`.

Commands:
- `CLUSTER=auto-loans npm run test:cluster:unit`
- `CLUSTER=auto-loans npm run test:cluster:e2e`
- `CLUSTER=auto-loans npm run test:cluster:seo`
- `CLUSTER=auto-loans npm run test:cluster:cwv`

Pass criteria:
- Unit/contracts pass
- Cluster E2E + SEO smoke pass
- Cluster CWV thresholds pass

Ownership: cluster release owner.

Routes:
- /car-loan-calculators/car-loan-calculator/
- /car-loan-calculators/auto-loan-calculator/
- /car-loan-calculators/hire-purchase-calculator/
- /car-loan-calculators/pcp-calculator/
- /car-loan-calculators/car-lease-calculator/

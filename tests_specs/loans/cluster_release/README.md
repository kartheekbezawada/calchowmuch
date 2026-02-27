# loans cluster_release

Scope: cluster-level release tests for `loans`.

Commands:
- `CLUSTER=loans npm run test:cluster:unit`
- `CLUSTER=loans npm run test:cluster:e2e`
- `CLUSTER=loans npm run test:cluster:seo`
- `CLUSTER=loans npm run test:cluster:cwv`

Pass criteria:
- Unit/contracts pass
- Cluster E2E + SEO smoke pass
- Cluster CWV thresholds pass

Ownership: cluster release owner.

Routes:
- /loan-calculators/buy-to-let-mortgage-calculator/
- /car-loan-calculators/car-loan-calculator/
- /car-loan-calculators/hire-purchase-calculator/
- /loan-calculators/mortgage-calculator/
- /loan-calculators/how-much-can-i-borrow/
- /loan-calculators/interest-rate-change-calculator/
- /car-loan-calculators/car-lease-calculator/
- /loan-calculators/ltv-calculator/
- /car-loan-calculators/auto-loan-calculator/
- /loan-calculators/offset-mortgage-calculator/
- /car-loan-calculators/pcp-calculator/
- /loan-calculators/remortgage-calculator/

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
- /loans/buy-to-let/
- /loans/car-loan/
- /loans/hire-purchase/
- /loans/home-loan/
- /loans/how-much-can-i-borrow/
- /loans/interest-rate-change-calculator/
- /loans/leasing-calculator/
- /loans/loan-to-value/
- /loans/multiple-car-loan/
- /loans/offset-calculator/
- /loans/pcp-calculator/
- /loans/remortgage-switching/

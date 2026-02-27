# credit-cards cluster_release

Scope: cluster-level release tests for `credit-cards`.

Commands:
- `CLUSTER=credit-cards npm run test:cluster:unit`
- `CLUSTER=credit-cards npm run test:cluster:e2e`
- `CLUSTER=credit-cards npm run test:cluster:seo`
- `CLUSTER=credit-cards npm run test:cluster:cwv`

Pass criteria:
- Unit/contracts pass
- Cluster E2E + SEO smoke pass
- Cluster CWV thresholds pass

Ownership: cluster release owner.

Routes:
- /credit-card-calculators/balance-transfer-credit-card-calculator/
- /credit-card-calculators/credit-card-consolidation-calculator/
- /credit-card-calculators/credit-card-minimum-payment-calculator/
- /credit-card-calculators/credit-card-payment-calculator/

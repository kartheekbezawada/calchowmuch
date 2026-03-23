# pricing cluster_release

Scope: cluster-level release tests for `pricing`.

Commands:
- `CLUSTER=pricing npm run test:cluster:unit`
- `CLUSTER=pricing npm run test:cluster:e2e`
- `CLUSTER=pricing npm run test:cluster:seo`
- `CLUSTER=pricing npm run test:cluster:cwv`

Pass criteria:
- Unit/contracts pass
- Cluster E2E + SEO smoke pass
- Cluster CWV thresholds pass

Ownership: cluster release owner.

Routes:
- /pricing-calculators/commission-calculator/
- /pricing-calculators/discount-calculator/
- /pricing-calculators/margin-calculator/
- /pricing-calculators/markup-calculator/

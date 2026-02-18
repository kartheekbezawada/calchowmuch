# percentage cluster_release

Scope: cluster-level release tests for `percentage`.

Commands:
- `CLUSTER=percentage npm run test:cluster:unit`
- `CLUSTER=percentage npm run test:cluster:e2e`
- `CLUSTER=percentage npm run test:cluster:seo`
- `CLUSTER=percentage npm run test:cluster:cwv`

Pass criteria:
- Unit/contracts pass
- Cluster E2E + SEO smoke pass
- Cluster CWV thresholds pass

Ownership: cluster release owner.

Routes:
- /percentage-calculators/commission-calculator/
- /percentage-calculators/discount-calculator/
- /percentage-calculators/margin-calculator/
- /percentage-calculators/markup-calculator/
- /percentage-calculators/percent-change/
- /percentage-calculators/percent-to-fraction-decimal/
- /percentage-calculators/percentage-composition/
- /percentage-calculators/percentage-decrease/
- /percentage-calculators/percentage-difference/
- /percentage-calculators/percentage-increase/
- /percentage-calculators/percentage-of-a-number/
- /percentage-calculators/reverse-percentage/
- /percentage-calculators/what-percent-is-x-of-y/

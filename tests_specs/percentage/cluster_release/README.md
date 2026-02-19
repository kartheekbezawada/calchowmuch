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
- /percentage-calculators/percent-change-calculator/
- /percentage-calculators/percent-to-fraction-decimal-calculator/
- /percentage-calculators/percentage-composition-calculator/
- /percentage-calculators/percentage-decrease-calculator/
- /percentage-calculators/percentage-difference-calculator/
- /percentage-calculators/percentage-increase-calculator/
- /percentage-calculators/percentage-of-a-number-calculator/
- /percentage-calculators/reverse-percentage-calculator/
- /percentage-calculators/percentage-finder-calculator/

# sleep-and-nap cluster_release

Scope: cluster-level release tests for `sleep-and-nap`.

Commands:
- `CLUSTER=sleep-and-nap npm run test:cluster:unit`
- `CLUSTER=sleep-and-nap npm run test:cluster:e2e`
- `CLUSTER=sleep-and-nap npm run test:cluster:seo`
- `CLUSTER=sleep-and-nap npm run test:cluster:cwv`

Pass criteria:
- Unit/contracts pass
- Cluster E2E + SEO smoke pass
- Cluster CWV thresholds pass

Ownership: cluster release owner.

Routes:
- /time-and-date/energy-based-nap-selector/
- /time-and-date/nap-time-calculator/
- /time-and-date/power-nap-calculator/
- /time-and-date/sleep-time-calculator/
- /time-and-date/wake-up-time-calculator/

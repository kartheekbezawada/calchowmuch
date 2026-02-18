# time-and-date cluster_release

Scope: cluster-level release tests for `time-and-date`.

Commands:
- `CLUSTER=time-and-date npm run test:cluster:unit`
- `CLUSTER=time-and-date npm run test:cluster:e2e`
- `CLUSTER=time-and-date npm run test:cluster:seo`
- `CLUSTER=time-and-date npm run test:cluster:cwv`

Pass criteria:
- Unit/contracts pass
- Cluster E2E + SEO smoke pass
- Cluster CWV thresholds pass

Ownership: cluster release owner.

Routes:
- /time-and-date/age-calculator/
- /time-and-date/birthday-day-of-week/
- /time-and-date/countdown-timer-generator/
- /time-and-date/days-until-a-date-calculator/
- /time-and-date/overtime-hours-calculator/
- /time-and-date/time-between-two-dates-calculator/
- /time-and-date/work-hours-calculator/

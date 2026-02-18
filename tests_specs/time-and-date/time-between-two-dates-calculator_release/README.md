# time-and-date/time-between-two-dates-calculator release

Scope: calculator-level release tests for `time-between-two-dates-calculator` in cluster `time-and-date`.

Commands:
- `CLUSTER=time-and-date CALC=time-between-two-dates-calculator npm run test:calc:unit`
- `CLUSTER=time-and-date CALC=time-between-two-dates-calculator npm run test:calc:e2e`
- `CLUSTER=time-and-date CALC=time-between-two-dates-calculator npm run test:calc:seo`
- `CLUSTER=time-and-date CALC=time-between-two-dates-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /time-and-date/time-between-two-dates-calculator/

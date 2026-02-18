# sleep-and-nap/sleep-time-calculator release

Scope: calculator-level release tests for `sleep-time-calculator` in cluster `sleep-and-nap`.

Commands:
- `CLUSTER=sleep-and-nap CALC=sleep-time-calculator npm run test:calc:unit`
- `CLUSTER=sleep-and-nap CALC=sleep-time-calculator npm run test:calc:e2e`
- `CLUSTER=sleep-and-nap CALC=sleep-time-calculator npm run test:calc:seo`
- `CLUSTER=sleep-and-nap CALC=sleep-time-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /time-and-date/sleep-time-calculator/

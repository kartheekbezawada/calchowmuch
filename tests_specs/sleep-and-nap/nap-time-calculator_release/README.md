# sleep-and-nap/nap-time-calculator release

Scope: calculator-level release tests for `nap-time-calculator` in cluster `sleep-and-nap`.

Commands:
- `CLUSTER=sleep-and-nap CALC=nap-time-calculator npm run test:calc:unit`
- `CLUSTER=sleep-and-nap CALC=nap-time-calculator npm run test:calc:e2e`
- `CLUSTER=sleep-and-nap CALC=nap-time-calculator npm run test:calc:seo`
- `CLUSTER=sleep-and-nap CALC=nap-time-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /time-and-date/nap-time-calculator/

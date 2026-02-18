# sleep-and-nap/power-nap-calculator release

Scope: calculator-level release tests for `power-nap-calculator` in cluster `sleep-and-nap`.

Commands:
- `CLUSTER=sleep-and-nap CALC=power-nap-calculator npm run test:calc:unit`
- `CLUSTER=sleep-and-nap CALC=power-nap-calculator npm run test:calc:e2e`
- `CLUSTER=sleep-and-nap CALC=power-nap-calculator npm run test:calc:seo`
- `CLUSTER=sleep-and-nap CALC=power-nap-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /time-and-date/power-nap-calculator/

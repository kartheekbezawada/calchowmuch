# sleep-and-nap/energy-based-nap-selector release

Scope: calculator-level release tests for `energy-based-nap-selector` in cluster `sleep-and-nap`.

Commands:
- `CLUSTER=sleep-and-nap CALC=energy-based-nap-selector npm run test:calc:unit`
- `CLUSTER=sleep-and-nap CALC=energy-based-nap-selector npm run test:calc:e2e`
- `CLUSTER=sleep-and-nap CALC=energy-based-nap-selector npm run test:calc:seo`
- `CLUSTER=sleep-and-nap CALC=energy-based-nap-selector npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /time-and-date/energy-based-nap-selector/

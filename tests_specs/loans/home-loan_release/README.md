# loans/home-loan release

Scope: calculator-level release tests for `home-loan` in cluster `loans`.

Commands:
- `CLUSTER=loans CALC=home-loan npm run test:calc:unit`
- `CLUSTER=loans CALC=home-loan npm run test:calc:e2e`
- `CLUSTER=loans CALC=home-loan npm run test:calc:seo`
- `CLUSTER=loans CALC=home-loan npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /loan-calculators/mortgage-calculator/

Cloudflare cache hardening (mortgage only):
- Versioned assets in route:
  - `/calculators/loan-calculators/mortgage-calculator/module.js?v=20260224`
  - `/calculators/loan-calculators/mortgage-calculator/mortgage-balance-chart.js?v=20260224`
  - `/calculators/loan-calculators/mortgage-calculator/calculator.css?v=20260224`
- Version token source:
  - `ROUTE_ASSET_VERSION` in `scripts/generate-mpa-pages.js` (override via env on deploy).
- Purge only these paths on release:
  - `/loan-calculators/mortgage-calculator/`
  - `/calculators/loan-calculators/mortgage-calculator/module.js`
  - `/calculators/loan-calculators/mortgage-calculator/mortgage-balance-chart.js`

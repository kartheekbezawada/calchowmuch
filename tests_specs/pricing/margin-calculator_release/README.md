# pricing/margin-calculator release

Scope: calculator-level release tests for `margin-calculator` in cluster `pricing`.

Commands:
- `CLUSTER=pricing CALC=margin-calculator npm run test:calc:unit`
- `CLUSTER=pricing CALC=margin-calculator npm run test:calc:e2e`
- `CLUSTER=pricing CALC=margin-calculator npm run test:calc:seo`
- `CLUSTER=pricing CALC=margin-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /pricing-calculators/margin-calculator/

# pricing/markup-calculator release

Scope: calculator-level release tests for `markup-calculator` in cluster `pricing`.

Commands:
- `CLUSTER=pricing CALC=markup-calculator npm run test:calc:unit`
- `CLUSTER=pricing CALC=markup-calculator npm run test:calc:e2e`
- `CLUSTER=pricing CALC=markup-calculator npm run test:calc:seo`
- `CLUSTER=pricing CALC=markup-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /pricing-calculators/markup-calculator/

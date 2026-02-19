# percentage/percentage-composition release

Scope: calculator-level release tests for `percentage-composition` in cluster `percentage`, including single-pane DOM contract and strict scoped CWV.

Commands:
- `CLUSTER=percentage CALC=percentage-composition npm run test:calc:unit`
- `CLUSTER=percentage CALC=percentage-composition npm run test:calc:e2e`
- `CLUSTER=percentage CALC=percentage-composition npm run test:calc:seo`
- `CLUSTER=percentage CALC=percentage-composition npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + single-pane UX structure checks pass
- SEO/schema/sitemap checks pass
- Strict scoped CWV budget passes

Ownership: percentage cluster calculator route owner.

Route:
- `/percentage-calculators/percentage-composition-calculator/`

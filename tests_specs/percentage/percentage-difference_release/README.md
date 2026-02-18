# percentage/percentage-difference release

Scope: calculator-level release tests for `percentage-difference` in cluster `percentage`.

Commands:
- `CLUSTER=percentage CALC=percentage-difference npm run test:calc:unit`
- `CLUSTER=percentage CALC=percentage-difference npm run test:calc:e2e`
- `CLUSTER=percentage CALC=percentage-difference npm run test:calc:seo`
- `CLUSTER=percentage CALC=percentage-difference npm run test:calc:cwv`

Pass criteria:
- Unit formula/edge-case tests pass.
- E2E behavior checks pass (symmetry + zero-baseline guard).
- Explanation UX contract is present (`pv-results-table`, `bor-faq-card`, no Scenario Summary).
- SEO/schema/sitemap checks pass.
- CWV scoped guard passes.

Ownership: percentage cluster calculator route owner.

Route:
- `/percentage-calculators/percentage-difference/`

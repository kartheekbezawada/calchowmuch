# math/fraction-calculator release

Scope: calculator-level release tests for `fraction-calculator` in cluster `math`.

Commands:
- `CLUSTER=math CALC=fraction-calculator npm run test:calc:unit`
- `CLUSTER=math CALC=fraction-calculator npm run test:calc:e2e`
- `CLUSTER=math CALC=fraction-calculator npm run test:calc:seo`
- `CLUSTER=math CALC=fraction-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass using shared calculator helpers
- E2E route flow verifies single-pane teaching UI
- SEO checks confirm metadata, JSON-LD parity, and sitemap coverage
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/fraction-calculator/

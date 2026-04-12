# time-and-date/business-days-calculator release

Scope: calculator-level release tests for `business-days-calculator` in cluster `time-and-date`.

Commands:
- `CLUSTER=time-and-date CALC=business-days-calculator npm run test:calc:unit`
- `CLUSTER=time-and-date CALC=business-days-calculator npm run test:calc:e2e`
- `CLUSTER=time-and-date CALC=business-days-calculator npm run test:calc:seo`
- `CLUSTER=time-and-date CALC=business-days-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass for business-day counting, shifting, and holiday presets
- E2E covers both modes, copy summary, and calendar export
- SEO verifies metadata, FAQ schema, single-pane layout, and sitemap presence
- CWV route guard passes

Route:
- /time-and-date/business-days-calculator/

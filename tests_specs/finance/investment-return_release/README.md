# finance/investment-return release

Scope: calculator-level release tests for `investment-return` in cluster `finance`.

Commands:
- `CLUSTER=finance CALC=investment-return npm run test:calc:unit`
- `CLUSTER=finance CALC=investment-return npm run test:calc:e2e`
- `CLUSTER=finance CALC=investment-return npm run test:calc:seo`
- `CLUSTER=finance CALC=investment-return npm run test:calc:cwv`

Pass criteria:
- Unit formula + validation + invariants pass
- E2E flow and advanced controls pass
- SEO metadata/schema/sitemap checks pass
- Scoped CWV route guard passes

Ownership: calculator route owner.

Route:
- /finance-calculators/investment-return-calculator/

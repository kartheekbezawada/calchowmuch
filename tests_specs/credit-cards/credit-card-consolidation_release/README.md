# credit-cards/credit-card-consolidation release

Scope: calculator-level release tests for `credit-card-consolidation` in cluster `credit-cards`.

Commands:
- `CLUSTER=credit-cards CALC=credit-card-consolidation npm run test:calc:unit`
- `CLUSTER=credit-cards CALC=credit-card-consolidation npm run test:calc:e2e`
- `CLUSTER=credit-cards CALC=credit-card-consolidation npm run test:calc:seo`
- `CLUSTER=credit-cards CALC=credit-card-consolidation npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /credit-card-calculators/credit-card-consolidation-calculator/

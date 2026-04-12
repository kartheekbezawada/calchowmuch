# credit-cards/debt-payoff-calculator release

Scope: calculator-level release tests for `debt-payoff-calculator` in cluster `credit-cards`.

Commands:
- `CLUSTER=credit-cards CALC=debt-payoff-calculator npm run test:calc:unit`
- `CLUSTER=credit-cards CALC=debt-payoff-calculator npm run test:calc:e2e`
- `CLUSTER=credit-cards CALC=debt-payoff-calculator npm run test:calc:seo`
- `CLUSTER=credit-cards CALC=debt-payoff-calculator npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass for snowball, avalanche, and goal-date solving
- E2E covers the answer-first result stage, dynamic debt rows, charts, table toggle, and copy summary
- SEO verifies metadata, FAQ schema, explanation structure, and sitemap presence
- CWV route guard passes

Route:
- /credit-card-calculators/debt-payoff-calculator/

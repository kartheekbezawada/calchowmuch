# credit-cards/balance-transfer-installment-plan release

Scope: calculator-level release tests for `balance-transfer-installment-plan` in cluster `credit-cards`.

Commands:
- `CLUSTER=credit-cards CALC=balance-transfer-installment-plan npm run test:calc:unit`
- `CLUSTER=credit-cards CALC=balance-transfer-installment-plan npm run test:calc:e2e`
- `CLUSTER=credit-cards CALC=balance-transfer-installment-plan npm run test:calc:seo`
- `CLUSTER=credit-cards CALC=balance-transfer-installment-plan npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /loans/balance-transfer-installment-plan/

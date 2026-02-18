# math/polynomial-operations release

Scope: calculator-level release tests for `polynomial-operations` in cluster `math`.

Commands:
- `CLUSTER=math CALC=polynomial-operations npm run test:calc:unit`
- `CLUSTER=math CALC=polynomial-operations npm run test:calc:e2e`
- `CLUSTER=math CALC=polynomial-operations npm run test:calc:seo`
- `CLUSTER=math CALC=polynomial-operations npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/algebra/polynomial-operations/

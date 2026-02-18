# math/number-sequence release

Scope: calculator-level release tests for `number-sequence` in cluster `math`.

Commands:
- `CLUSTER=math CALC=number-sequence npm run test:calc:unit`
- `CLUSTER=math CALC=number-sequence npm run test:calc:e2e`
- `CLUSTER=math CALC=number-sequence npm run test:calc:seo`
- `CLUSTER=math CALC=number-sequence npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/number-sequence/

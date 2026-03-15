# math/sample-size release

Scope: calculator-level release tests for `sample-size` in cluster `math`.

Commands:
- `CLUSTER=math CALC=sample-size npm run test:calc:unit`
- `CLUSTER=math CALC=sample-size npm run test:calc:e2e`
- `CLUSTER=math CALC=sample-size npm run test:calc:seo`
- `CLUSTER=math CALC=sample-size npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass for proportion, mean, finite-population correction, and validation
- E2E flow + SEO checks pass for single-pane layout, presets, schema, and explanation contract
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/sample-size/

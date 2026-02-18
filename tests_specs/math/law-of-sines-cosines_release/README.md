# math/law-of-sines-cosines release

Scope: calculator-level release tests for `law-of-sines-cosines` in cluster `math`.

Commands:
- `CLUSTER=math CALC=law-of-sines-cosines npm run test:calc:unit`
- `CLUSTER=math CALC=law-of-sines-cosines npm run test:calc:e2e`
- `CLUSTER=math CALC=law-of-sines-cosines npm run test:calc:seo`
- `CLUSTER=math CALC=law-of-sines-cosines npm run test:calc:cwv`

Pass criteria:
- Unit logic tests pass
- E2E flow + SEO checks pass
- CWV route guard passes

Ownership: calculator route owner.

Route:
- /math/trigonometry/law-of-sines-cosines/

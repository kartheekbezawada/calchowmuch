# Finance Calculators Cluster Execution Log

## 2026-03-20 — Rollout Start

Status:

- scope approved
- documentation pack started
- implementation not started yet at this entry

Scope:

- `present-value`
- `future-value`
- `present-value-of-annuity`
- `future-value-of-annuity`
- `effective-annual-rate`
- `simple-interest`
- `compound-interest`
- `investment-growth`
- `time-to-savings-goal`
- `monthly-savings-needed`
- `investment-return`

Allowed files:

- `requirements/universal-rules/finance-calculators-cluster-redesign/**`
- `public/calculators/finance-calculators/**`
- `public/finance-calculators/**`
- `content/calculators/finance-calculators/**`
- `public/assets/css/calculators/finance-calculators/**`
- `public/assets/js/calculators/finance-calculators/**`
- `public/calculators/finance/savings-goal/**`
- `scripts/generate-mpa-pages.js`
- `config/testing/test-scope-map.json`
- `tests_specs/finance/**`
- `config/clusters/route-ownership.json`
- `config/clusters/cluster-registry.json`
- `config/policy/global-navigation-spec.json`
- `clusters/homepage/config/navigation.json`
- `clusters/time-and-date/config/navigation.json`
- `clusters/percentage/config/navigation.json`
- `public/index.html`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-*-FINANCE-*.md`

Initial findings:

- Finance source content still lives in `content/calculators/finance-calculators/**` with CSS and JS split under `public/assets/**`.
- Generated Finance pages still load the legacy dark shell, top nav, left nav, ad column, and shared shell CSS.
- Finance source fragments still use Home Loan wrapper names such as `#calc-home-loan` and `.home-loan-ui`.
- Finance generated JSON-LD still points BreadcrumbList position 2 at `Home Loan` on multiple routes.
- `time-to-savings-goal` and `monthly-savings-needed` still have placeholder route-level unit and E2E coverage.
- `config/clusters/route-ownership.json` does not currently include the 11 Finance routes.
- `config/clusters/cluster-registry.json`, `config/policy/global-navigation-spec.json`, and cluster nav files still point Finance discoverability at stale `/finance/present-value/` paths.
- `public/index.html` links to a missing `/finance-calculators/savings-goal-calculator/` route.

Execution order:

1. `present-value`
2. `future-value`
3. `present-value-of-annuity`
4. `future-value-of-annuity`
5. `effective-annual-rate`
6. `simple-interest`
7. `compound-interest`
8. `investment-growth`
9. `time-to-savings-goal`
10. `monthly-savings-needed`
11. `investment-return`

Notes:

- This log is append-only.
- Each route completion entry must record files touched, what changed, evidence, test results, and notes.

## 2026-03-20 — Shared Foundation Completed

Status:

- completed

Changes:

- created the Finance redesign source tree at `public/calculators/finance-calculators/**`
- added shared Finance shell styling and UX helpers
- updated generator routing so migrated Finance routes render from the new source tree
- added Finance route ownership entries
- corrected stale Finance contract URLs in cluster registry and governed nav files
- corrected homepage discoverability link from the missing savings goal route
- split Finance structured data config away from the Home Loan schema path

Files touched:

- `scripts/generate-mpa-pages.js`
- `config/clusters/route-ownership.json`
- `config/clusters/cluster-registry.json`
- `config/policy/global-navigation-spec.json`
- `clusters/homepage/config/navigation.json`
- `clusters/time-and-date/config/navigation.json`
- `clusters/percentage/config/navigation.json`
- `public/index.html`
- `public/calculators/finance-calculators/shared/cluster-light.css`
- `public/calculators/finance-calculators/shared/cluster-ux.js`

Validation:

- `npm run test:cluster:contracts` -> pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` -> pass

Notes:

- Scoped SEO and schema tests emitted root report artifacts outside approved scope; those files were restored to their original baseline state immediately after verification.

## 2026-03-20 — Route Complete: `present-value`

Status:

- completed

Changes:

- migrated route source into `public/calculators/finance-calculators/present-value-calculator/`
- rebuilt the route with the Finance shell, precise text-entry companions, and button-only recalculation
- reordered explanation content to answer-first, `How to Guide`, FAQ, and `Important Notes`
- removed Home Loan wrapper leakage from the migrated source path
- replaced the legacy top-nav E2E expectation with migrated-shell and stale-result assertions

Files touched:

- `public/calculators/finance-calculators/present-value-calculator/index.html`
- `public/calculators/finance-calculators/present-value-calculator/explanation.html`
- `public/calculators/finance-calculators/present-value-calculator/calculator.css`
- `public/calculators/finance-calculators/present-value-calculator/module.js`
- `public/finance-calculators/present-value-calculator/index.html`
- `tests_specs/finance/present-value_release/e2e.calc.spec.js`

Validation:

- `TARGET_CALC_ID=present-value node scripts/generate-mpa-pages.js` -> pass
- `CLUSTER=finance CALC=present-value npm run test:calc:unit` -> pass
- `CLUSTER=finance CALC=present-value npm run test:calc:e2e` -> pass
- `CLUSTER=finance CALC=present-value npm run test:calc:seo` -> pass
- `CLUSTER=finance CALC=present-value npm run test:calc:cwv` -> pass
- `CLUSTER=finance CALC=present-value npm run test:schema:dedupe -- --scope=calc` -> pass

Notes:

- Thin-content quality artifact reported `warn=1` with no blocking SEO failures.

## 2026-03-20 — Route Complete: `future-value`

Status:

- completed

Changes:

- migrated route source into `public/calculators/finance-calculators/future-value-calculator/`
- extended the shared Finance shell to handle recurring contributions with precise text-entry companions
- changed post-load interaction to stale-state plus explicit Calculate
- reordered explanation content to answer-first, `How to Guide`, FAQ, and `Important Notes`
- replaced the legacy top-nav E2E expectation with migrated-shell and stale-result assertions

Files touched:

- `public/calculators/finance-calculators/future-value-calculator/index.html`
- `public/calculators/finance-calculators/future-value-calculator/explanation.html`
- `public/calculators/finance-calculators/future-value-calculator/calculator.css`
- `public/calculators/finance-calculators/future-value-calculator/module.js`
- `public/finance-calculators/future-value-calculator/index.html`
- `tests_specs/finance/future-value_release/e2e.calc.spec.js`

Validation:

- `TARGET_CALC_ID=future-value node scripts/generate-mpa-pages.js` -> pass
- `CLUSTER=finance CALC=future-value npm run test:calc:unit` -> pass
- `CLUSTER=finance CALC=future-value npm run test:calc:e2e` -> pass
- `CLUSTER=finance CALC=future-value npm run test:calc:seo` -> pass
- `CLUSTER=finance CALC=future-value npm run test:calc:cwv` -> pass
- `CLUSTER=finance CALC=future-value npm run test:schema:dedupe -- --scope=calc` -> pass

Notes:

- Thin-content quality artifact reported `warn=1` with no blocking SEO failures.

## 2026-03-20 — Route Complete: `present-value-of-annuity`

Status:

- completed

Changes:

- migrated route source into `public/calculators/finance-calculators/present-value-of-annuity-calculator/`
- rebuilt the route with the Finance shell, precise text-entry companions, and button-only recalculation after load
- reordered explanation content to answer-first, `How to Guide`, FAQ, and `Important Notes`
- removed Home Loan wrapper leakage from the migrated source path
- replaced the legacy top-nav E2E expectation with migrated-shell and stale-result assertions
- opted the generator into the route so it now renders from the Finance source-of-truth tree

Files touched:

- `public/calculators/finance-calculators/present-value-of-annuity-calculator/index.html`
- `public/calculators/finance-calculators/present-value-of-annuity-calculator/explanation.html`
- `public/calculators/finance-calculators/present-value-of-annuity-calculator/calculator.css`
- `public/calculators/finance-calculators/present-value-of-annuity-calculator/module.js`
- `public/finance-calculators/present-value-of-annuity-calculator/index.html`
- `tests_specs/finance/present-value-of-annuity_release/e2e.calc.spec.js`
- `scripts/generate-mpa-pages.js`

Validation:

- `TARGET_CALC_ID=present-value-of-annuity node scripts/generate-mpa-pages.js` -> pass
- `CLUSTER=finance CALC=present-value-of-annuity npm run test:calc:unit` -> pass
- `CLUSTER=finance CALC=present-value-of-annuity npm run test:calc:e2e` -> pass
- `CLUSTER=finance CALC=present-value-of-annuity npm run test:calc:seo` -> pass
- `CLUSTER=finance CALC=present-value-of-annuity npm run test:calc:cwv` -> pass
- `CLUSTER=finance CALC=present-value-of-annuity npm run test:schema:dedupe -- --scope=calc` -> pass
- `npm run test:cluster:contracts` -> pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` -> pass

Notes:

- Thin-content quality artifact reported `warn=1` with no blocking SEO failures.
- Root report artifacts emitted by scoped SEO/schema runs were restored to baseline immediately after verification.

## 2026-03-20 — Route Complete: `future-value-of-annuity`

Status:

- completed

Changes:

- migrated route source into `public/calculators/finance-calculators/future-value-of-annuity-calculator/`
- rebuilt the route with the Finance shell, precise text-entry companions, and button-only recalculation after load
- reordered explanation content to answer-first, `How to Guide`, FAQ, and `Important Notes`
- removed Home Loan wrapper leakage from the migrated source path
- replaced the legacy top-nav E2E expectation with migrated-shell and stale-result assertions
- opted the generator into the route so it now renders from the Finance source-of-truth tree

Files touched:

- `public/calculators/finance-calculators/future-value-of-annuity-calculator/index.html`
- `public/calculators/finance-calculators/future-value-of-annuity-calculator/explanation.html`
- `public/calculators/finance-calculators/future-value-of-annuity-calculator/calculator.css`
- `public/calculators/finance-calculators/future-value-of-annuity-calculator/module.js`
- `public/finance-calculators/future-value-of-annuity-calculator/index.html`
- `tests_specs/finance/future-value-of-annuity_release/e2e.calc.spec.js`
- `scripts/generate-mpa-pages.js`

Validation:

- `TARGET_CALC_ID=future-value-of-annuity node scripts/generate-mpa-pages.js` -> pass
- `CLUSTER=finance CALC=future-value-of-annuity npm run test:calc:unit` -> pass
- `CLUSTER=finance CALC=future-value-of-annuity npm run test:calc:e2e` -> pass
- `CLUSTER=finance CALC=future-value-of-annuity npm run test:calc:seo` -> pass
- `CLUSTER=finance CALC=future-value-of-annuity npm run test:calc:cwv` -> pass
- `CLUSTER=finance CALC=future-value-of-annuity npm run test:schema:dedupe -- --scope=calc` -> pass
- `npm run test:cluster:contracts` -> pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` -> pass

Notes:

- Thin-content quality artifact reported `warn=1` with no blocking SEO failures.
- Root report artifacts emitted by scoped SEO/schema runs were restored to baseline immediately after verification.

## 2026-03-20 — Route Complete: `effective-annual-rate`

Status:

- completed

Changes:

- migrated route source into `public/calculators/finance-calculators/effective-annual-rate-calculator/`
- rebuilt the route with the Finance shell, a precise nominal-rate companion input, and button-only recalculation after load
- reordered explanation content to answer-first, `How to Guide`, FAQ, and `Important Notes`
- removed Home Loan wrapper leakage from the migrated source path
- replaced the legacy top-nav E2E expectation with migrated-shell and stale-result assertions
- opted the generator into the route so it now renders from the Finance source-of-truth tree

Files touched:

- `public/calculators/finance-calculators/effective-annual-rate-calculator/index.html`
- `public/calculators/finance-calculators/effective-annual-rate-calculator/explanation.html`
- `public/calculators/finance-calculators/effective-annual-rate-calculator/calculator.css`
- `public/calculators/finance-calculators/effective-annual-rate-calculator/module.js`
- `public/finance-calculators/effective-annual-rate-calculator/index.html`
- `tests_specs/finance/effective-annual-rate_release/e2e.calc.spec.js`
- `scripts/generate-mpa-pages.js`

Validation:

- `TARGET_CALC_ID=effective-annual-rate node scripts/generate-mpa-pages.js` -> pass
- `CLUSTER=finance CALC=effective-annual-rate npm run test:calc:unit` -> pass
- `CLUSTER=finance CALC=effective-annual-rate npm run test:calc:e2e` -> pass
- `CLUSTER=finance CALC=effective-annual-rate npm run test:calc:seo` -> pass
- `CLUSTER=finance CALC=effective-annual-rate npm run test:calc:cwv` -> pass
- `CLUSTER=finance CALC=effective-annual-rate npm run test:schema:dedupe -- --scope=calc` -> pass
- `npm run test:cluster:contracts` -> pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` -> pass

Notes:

- Thin-content quality artifact reported `warn=1` with no blocking SEO failures.
- Root report artifacts emitted by scoped SEO/schema runs were restored to baseline immediately after verification.

## 2026-03-20 — Route Complete: `simple-interest`

Status:

- completed

Changes:

- migrated route source into `public/calculators/finance-calculators/simple-interest-calculator/`
- removed the legacy inline `<style>` block and rebuilt the route with the Finance shell, precise companion inputs, and button-only recalculation after load
- reordered explanation content to answer-first, `How to Guide`, FAQ, and `Important Notes`
- removed Home Loan wrapper leakage from the migrated source path
- replaced the legacy top-nav E2E expectation with migrated-shell and stale-result assertions
- opted the generator into the route so it now renders from the Finance source-of-truth tree

Files touched:

- `public/calculators/finance-calculators/simple-interest-calculator/index.html`
- `public/calculators/finance-calculators/simple-interest-calculator/explanation.html`
- `public/calculators/finance-calculators/simple-interest-calculator/calculator.css`
- `public/calculators/finance-calculators/simple-interest-calculator/module.js`
- `public/finance-calculators/simple-interest-calculator/index.html`
- `tests_specs/finance/simple-interest_release/e2e.calc.spec.js`
- `scripts/generate-mpa-pages.js`

Validation:

- `TARGET_CALC_ID=simple-interest node scripts/generate-mpa-pages.js` -> pass
- `CLUSTER=finance CALC=simple-interest npm run test:calc:unit` -> pass
- `CLUSTER=finance CALC=simple-interest npm run test:calc:e2e` -> pass
- `CLUSTER=finance CALC=simple-interest npm run test:calc:seo` -> pass
- `CLUSTER=finance CALC=simple-interest npm run test:calc:cwv` -> pass
- `CLUSTER=finance CALC=simple-interest npm run test:schema:dedupe -- --scope=calc` -> pass
- `npm run test:cluster:contracts` -> pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` -> pass

Notes:

- Initial SEO run failed because the route title used `and` instead of the required `&`; the metadata was corrected and the SEO gate was rerun to pass.
- Thin-content quality artifact reported `warn=1` with no blocking SEO failures.
- Root report artifacts emitted by scoped SEO/schema runs were restored to baseline immediately after verification.

## 2026-03-20 — Finance Master Improvement Audit Logged

Status:

- completed

Scope:

- documentation logging only

Changes:

- logged a new Finance-wide master improvement audit initiative in the redesign documentation set
- recorded that the audit covers both migrated and pending Finance calculators
- created the canonical stub document at `requirements/universal-rules/finance-calculators-cluster-redesign/FINANCE_CALCULATORS_MASTER_IMPROVEMENT_PLAN.md`
- did not start the audit body or execute any implementation decisions

Files touched:

- `requirements/universal-rules/finance-calculators-cluster-redesign/ACTION_PAGE.md`
- `requirements/universal-rules/finance-calculators-cluster-redesign/DECISION_LOG.md`
- `requirements/universal-rules/finance-calculators-cluster-redesign/EXECUTION_LOG.md`
- `requirements/universal-rules/finance-calculators-cluster-redesign/FINANCE_CALCULATORS_MASTER_IMPROVEMENT_PLAN.md`

Evidence base:

- existing finance redesign planning and route briefs
- migrated Finance route status and generated outputs already recorded in this log
- pending Finance route sequence and open delivery items from the action page
- existing Finance test coverage expectations and known gaps already tracked in the redesign program

Validation:

- no tests required for this documentation-only logging step

Notes:

- no code changes were made
- no calculator redesign work was started as part of this entry

---

## 2026-03-20 — Finance Result Card Regression Fix

Status:

- completed

Scope:

- released Finance preview-card regression fix for `investment-growth`, `time-to-savings-goal`, `monthly-savings-needed`, and `investment-return`

Changes:

- moved secondary result metrics out of the blue answer panel and into the standard `fi-metric-grid` layout on the four affected routes
- normalized the main answer value to the shared `mtg-result-value` pattern so the primary number renders at the intended large size
- updated route modules so preview metrics write into dedicated metric targets instead of rendering white text inside a light summary surface
- regenerated the four affected Finance routes after the source updates

Files touched:

- `public/calculators/finance-calculators/investment-growth-calculator/index.html`
- `public/calculators/finance-calculators/time-to-savings-goal-calculator/index.html`
- `public/calculators/finance-calculators/monthly-savings-needed-calculator/index.html`
- `public/calculators/finance-calculators/investment-return-calculator/index.html`
- `public/assets/js/calculators/finance-calculators/investment-growth-calculator/module.js`
- `public/assets/js/calculators/finance-calculators/time-to-savings-goal-calculator/module.js`
- `public/assets/js/calculators/finance-calculators/monthly-savings-needed-calculator/module.js`
- `public/assets/js/calculators/finance-calculators/investment-return-calculator/module.js`
- `public/finance-calculators/investment-growth-calculator/index.html`
- `public/finance-calculators/time-to-savings-goal-calculator/index.html`
- `public/finance-calculators/monthly-savings-needed-calculator/index.html`
- `public/finance-calculators/investment-return-calculator/index.html`

Validation:

- `TARGET_CALC_ID=investment-growth node scripts/generate-mpa-pages.js`
- `TARGET_CALC_ID=time-to-savings-goal node scripts/generate-mpa-pages.js`
- `TARGET_CALC_ID=monthly-savings-needed node scripts/generate-mpa-pages.js`
- `TARGET_CALC_ID=investment-return node scripts/generate-mpa-pages.js`
- `CLUSTER=finance CALC=investment-growth npm run test:calc:unit`
- `CLUSTER=finance CALC=investment-growth npm run test:calc:e2e`
- `CLUSTER=finance CALC=time-to-savings-goal npm run test:calc:unit`
- `CLUSTER=finance CALC=time-to-savings-goal npm run test:calc:e2e`
- `CLUSTER=finance CALC=monthly-savings-needed npm run test:calc:unit`
- `CLUSTER=finance CALC=monthly-savings-needed npm run test:calc:e2e`
- `CLUSTER=finance CALC=investment-return npm run test:calc:unit`
- `CLUSTER=finance CALC=investment-return npm run test:calc:e2e`

Notes:

- no shared Finance CSS changes were required
- no generator logic changes were required
- the fix was applied locally to the four approved routes only

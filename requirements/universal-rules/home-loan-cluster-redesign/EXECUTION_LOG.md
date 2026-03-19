# Home Loan Cluster Execution Log

## 2026-03-19 — Rollout Start

Status:

- redesign workspace created
- rollout order locked
- logging contract established
- implementation not started yet at this entry

Target order:

1. `how-much-can-i-borrow`
2. `home-loan`
3. `remortgage-switching`
4. `offset-calculator`
5. `interest-rate-change-calculator`
6. `loan-to-value`
7. `buy-to-let`
8. `personal-loan`

Planned evidence per route:

- baseline desktop screenshot
- baseline mobile screenshot
- final desktop screenshot
- final mobile screenshot
- scoped build/test results
- CWV artifact path
- schema dedupe artifact path
- notes on visual and contract changes

---

## 2026-03-19 — Route 1 Complete — `how-much-can-i-borrow`

Status:

- completed
- approved as the reference implementation for the Home Loan light shell

Files touched:

- `scripts/generate-mpa-pages.js`
- `public/calculators/loan-calculators/shared/cluster-light.css`
- `public/calculators/loan-calculators/how-much-can-i-borrow/calculator.css`
- `public/calculators/loan-calculators/how-much-can-i-borrow/index.html`
- `public/calculators/loan-calculators/how-much-can-i-borrow/explanation.html`
- `public/loan-calculators/how-much-can-i-borrow/index.html`
- `tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js`

What changed:

- Added the dedicated Home Loan cluster shell path in the generator with `hl-cluster-*` selectors.
- Opted `how-much-can-i-borrow` into the migration list so unfinished Home Loan routes remain on the old shell.
- Replaced the Home Loan shared stylesheet with the new light design system.
- Rewrote the route stylesheet to remove dark/neon/dashboard styling and make the answer-first layout calmer and cleaner.
- Removed fragment-level inline style delivery from the route and explanation source.
- Updated the release E2E suite to validate the new shell contract and to wait for the calculator root instead of brittle `networkidle`.

Evidence:

- Baseline desktop: `test-results/visual/home-loan-redesign/how-much-can-i-borrow/baseline/desktop.png`
- Baseline mobile: `test-results/visual/home-loan-redesign/how-much-can-i-borrow/baseline/mobile.png`
- Final desktop: `test-results/visual/home-loan-redesign/how-much-can-i-borrow/final/desktop.png`
- Final mobile: `test-results/visual/home-loan-redesign/how-much-can-i-borrow/final/mobile.png`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/how-much-can-i-borrow.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/how-much-can-i-borrow.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`
- SEO mojibake reports: `seo_mojibake_report.md`, `seo_mojibake_report.csv`

Test results:

- `TARGET_ROUTE=/loan-calculators/how-much-can-i-borrow/ node scripts/generate-mpa-pages.js` — pass
- `npm run lint` — pass
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:unit` — pass
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:schema:dedupe -- --scope=calc` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass

Notes:

- The repo port-probe path adds a long pre-test wait on the first free Playwright port; once the local server is up, the calculator suite itself runs quickly.
- The route now omits `top-nav`, `left-nav`, the ad pane, `theme-premium-dark.css`, and `shared-calculator-ui.css`.

---

## 2026-03-19 — Route 2 Complete — `home-loan`

Status:

- completed
- mortgage manual-route exception now matches the migrated Home Loan shell

Files touched:

- `scripts/generate-mpa-pages.js`
- `public/calculators/loan-calculators/mortgage-calculator/index.html`
- `public/calculators/loan-calculators/mortgage-calculator/calculator.css`
- `public/loan-calculators/mortgage-calculator/index.html`
- `tests_specs/loans/home-loan_release/e2e.calc.spec.js`
- `tests_specs/loans/home-loan_release/seo.calc.spec.js`

What changed:

- Added `home-loan` to the Home Loan migration list.
- Allowed the generator to render the manual mortgage route when it is explicitly opted into the redesign list, without changing the asset manifest.
- Scoped Home Loan FAQ extraction to the FAQ section so related-calculator cards no longer pollute schema generation.
- Removed fragment-level `@import` delivery from the mortgage source fragment.
- Replaced the empty mortgage route stylesheet with a route-specific light layout covering the form panel, snapshot panel, lifetime cards, graph block, and explanation rhythm.
- Updated the mortgage release suites to validate the new shell contract and use deterministic route-ready waits.

Evidence:

- Baseline desktop: `test-results/visual/home-loan-redesign/home-loan/baseline/desktop.png`
- Baseline mobile: `test-results/visual/home-loan-redesign/home-loan/baseline/mobile.png`
- Final desktop: `test-results/visual/home-loan-redesign/home-loan/final/desktop.png`
- Final mobile: `test-results/visual/home-loan-redesign/home-loan/final/mobile.png`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/home-loan.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/home-loan.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`
- SEO mojibake reports: `seo_mojibake_report.md`, `seo_mojibake_report.csv`

Test results:

- `TARGET_ROUTE=/loan-calculators/mortgage-calculator/ node scripts/generate-mpa-pages.js` — pass
- `CLUSTER=loans CALC=home-loan npm run test:calc:unit` — pass
- `CLUSTER=loans CALC=home-loan npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=home-loan npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=home-loan npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=home-loan npm run test:schema:dedupe -- --scope=calc` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass

Notes:

- Thin-content scoring returned `warn`, not `fail`, for mortgage. The route passed the SEO gate, but the warning should be included in the final sign-off.
- The generated mortgage page now omits `top-nav`, `left-nav`, the ad pane, `theme-premium-dark.css`, `layout.css`, `shared-calculator-ui.css`, and `mpa-nav.js`.

---

## 2026-03-19 — Route 3 Complete — `remortgage-switching`

Status:

- completed
- first fully generated follow-on route after the reference implementation

Files touched:

- `scripts/generate-mpa-pages.js`
- `public/calculators/loan-calculators/remortgage-calculator/index.html`
- `public/calculators/loan-calculators/remortgage-calculator/explanation.html`
- `public/calculators/loan-calculators/remortgage-calculator/calculator.css`
- `public/loan-calculators/remortgage-calculator/index.html`
- `tests_specs/loans/remortgage-switching_release/e2e.calc.spec.js`
- `tests_specs/loans/remortgage-switching_release/seo.calc.spec.js`

What changed:

- Added `remortgage-switching` to the Home Loan migration list.
- Removed fragment-level inline styling and `@import` delivery from the calculator and explanation source.
- Added stable explanation section IDs for route-level SEO and order checks.
- Replaced the electric remortgage route stylesheet with a light route-owned layout layered on top of the shared Home Loan system.
- Updated the E2E suite to validate the new shell contract and deterministic page-ready waits.
- Replaced the placeholder skipped SEO spec with a real route-level SEO/schema/FAQ/sitemap test.

Evidence:

- Baseline desktop: `test-results/visual/home-loan-redesign/remortgage-switching/baseline/desktop.png`
- Baseline mobile: `test-results/visual/home-loan-redesign/remortgage-switching/baseline/mobile.png`
- Final desktop: `test-results/visual/home-loan-redesign/remortgage-switching/final/desktop.png`
- Final mobile: `test-results/visual/home-loan-redesign/remortgage-switching/final/mobile.png`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/remortgage-switching.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/remortgage-switching.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`
- SEO mojibake reports: `seo_mojibake_report.md`, `seo_mojibake_report.csv`

Test results:

- `TARGET_ROUTE=/loan-calculators/remortgage-calculator/ node scripts/generate-mpa-pages.js` — pass
- `CLUSTER=loans CALC=remortgage-switching npm run test:calc:unit` — skipped by existing route suite
- `CLUSTER=loans CALC=remortgage-switching npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=remortgage-switching npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=remortgage-switching npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=remortgage-switching npm run test:schema:dedupe -- --scope=calc` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass

Notes:

- Thin-content scoring returned `warn`, not `fail`, for remortgage. Include that in the final sign-off.
- The regenerated page now omits the old shell, dark theme, ad pane, `layout.css`, `shared-calculator-ui.css`, and `mpa-nav.js`.

---

## 2026-03-19 — Route 4 Complete — `offset-calculator`

Status:

- completed
- mobile overflow corrected and locked by the route E2E gate

Files touched:

- `scripts/generate-mpa-pages.js`
- `public/calculators/loan-calculators/offset-mortgage-calculator/index.html`
- `public/calculators/loan-calculators/offset-mortgage-calculator/explanation.html`
- `public/calculators/loan-calculators/offset-mortgage-calculator/calculator.css`
- `public/loan-calculators/offset-mortgage-calculator/index.html`
- `tests_specs/loans/offset-calculator_release/e2e.calc.spec.js`
- `tests_specs/loans/offset-calculator_release/seo.calc.spec.js`

What changed:

- Added `offset-calculator` to the Home Loan migration list.
- Removed calculator-fragment inline styling and moved the route presentation into the route stylesheet.
- Added stable explanation section IDs for SEO and order verification.
- Replaced the dark-era offset stylesheet with a light route-owned layout for the form panel, result summary, lifetime totals, and guide tables.
- Updated the E2E suite to validate the new shell contract and deterministic route-ready waits.
- Replaced the placeholder skipped SEO spec with a real route-level SEO/schema/FAQ/sitemap test.
- Fixed mobile overflow by constraining offset guide/table wrappers so horizontal scroll stays inside the data containers.

Evidence:

- Baseline desktop: `test-results/visual/home-loan-redesign/offset-calculator/baseline/desktop.png`
- Baseline mobile: `test-results/visual/home-loan-redesign/offset-calculator/baseline/mobile.png`
- Final desktop: `test-results/visual/home-loan-redesign/offset-calculator/final/desktop.png`
- Final mobile: `test-results/visual/home-loan-redesign/offset-calculator/final/mobile.png`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/offset-calculator.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/offset-calculator.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`
- SEO mojibake reports: `seo_mojibake_report.md`, `seo_mojibake_report.csv`

Test results:

- `TARGET_ROUTE=/loan-calculators/offset-mortgage-calculator/ node scripts/generate-mpa-pages.js` — pass
- `CLUSTER=loans CALC=offset-calculator npm run test:calc:unit` — skipped by existing route suite
- `CLUSTER=loans CALC=offset-calculator npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=offset-calculator npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=offset-calculator npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=offset-calculator npm run test:schema:dedupe -- --scope=calc` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass

Notes:

- Thin-content scoring passed for this route.
- The regenerated page now omits the old shell, dark theme, ad pane, `layout.css`, `shared-calculator-ui.css`, and `mpa-nav.js`.

---

## 2026-03-19 — Ledger Closeout

Status:

- completed
- latest authoritative rollout state is closed and ready for merge

Closeout notes:

- Route 7 (`buy-to-let`), Route 8 (`personal-loan`), and final cluster verification/sign-off deltas are already recorded earlier in this ledger.
- This closeout entry exists to keep the final rollout state visible at the physical end of the file without rewriting prior log history.
- Refer to [ACTION_PAGE.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md) and [RELEASE_SIGNOFF_REL-20260319-HOME-LOAN-REDESIGN.md](/home/kartheek/calchowmuch/requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-20260319-HOME-LOAN-REDESIGN.md) for the final authoritative release state.

---

## 2026-03-19 — Enhancement Route 8 Complete — `personal-loan`

Status:

- completed
- personal-loan now matches the cluster precision-entry and result-reveal contract

Files touched:

- `public/calculators/loan-calculators/personal-loan-calculator/index.html`
- `public/calculators/loan-calculators/personal-loan-calculator/calculator.css`
- `public/calculators/loan-calculators/personal-loan-calculator/module.js`
- `public/loan-calculators/personal-loan-calculator/index.html`
- `tests_specs/loans/personal-loan_release/e2e.calc.spec.js`
- `requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md`
- `requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md`

What changed:

- Added precise companion inputs for loan amount, APR, and loan term so the route is no longer slider-only for its primary decisions.
- Removed pre-click recomputation from slider and precision edits while keeping the initial baseline calculation on load.
- Kept advanced fee and extra-payment inputs explicit behind the existing disclosure instead of adding more first-screen noise.
- Added an answer note under the primary payment card so the route explains the baseline payoff case separately from the extra-payment case.
- Added deliberate mobile result reveal and focus behavior for the personal-loan summary panel.
- Expanded the personal-loan E2E suite to cover precision-entry sync, button-only recalculation, reset-state sync, and mobile result reveal.
- Ran the grouped Playwright route pass to validate design-facing behavior in addition to the standard release gates.

Evidence:

- Grouped Playwright summary: `test-results/playwright/calc/loans/personal-loan/2026-03-19T20-08-05-100Z/playwright-all.summary.json`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/personal-loan.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/personal-loan.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`

Test results:

- `TARGET_ROUTE=/loan-calculators/personal-loan-calculator/ node scripts/generate-mpa-pages.js` — pass
- `npm run lint` — pass
- `CLUSTER=loans CALC=personal-loan npm run test:calc:unit` — pass
- `CLUSTER=loans CALC=personal-loan npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=personal-loan npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=personal-loan npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=personal-loan npm run test:schema:dedupe -- --scope=calc` — pass
- `CLUSTER=loans CALC=personal-loan npm run test:calc:playwright` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass

Notes:

- Thin-content scoring remains `warn`, not `fail`, for the personal-loan route in this enhancement pass.
- The route now keeps loan sizing and APR edits calm and explicit by waiting for the Calculate CTA before recomputing the answer state.

---

## 2026-03-19 — Final Enhancement Verification Complete

Status:

- completed
- Home Loan enhancement rollout is fully verified and signed off

What changed:

- Re-ran final cluster verification after route 8 closed: `npm run lint`, `npm run test:cluster:contracts`, `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope`, and `npm run test:iss001`.
- Confirmed the enhancement ledger now shows all 8 routes complete with precision-entry, result-reveal, and design-QA status marked `Pass`.
- Created the enhancement release sign-off for the completed Home Loan refinement pass.

Evidence:

- Action ledger: `requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md`
- Enhancement sign-off: `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-20260319-HOME-LOAN-ENHANCEMENT.md`
- Layout stability gate: `tests_specs/infrastructure/e2e/iss-design-001.spec.js`

Test results:

- `npm run lint` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass
- `npm run test:iss001` — pass

Notes:

- The enhancement rollout finishes with 8 completed route passes, 8 route-level CWV artifacts, 5 grouped Playwright summaries, 6 desktop/mobile screenshot proofs, and a final enhancement sign-off.
- Remaining non-blocking warnings are limited to the four thin-content `warn` artifacts already recorded in the sign-off.

---

## 2026-03-19 — Enhancement Pass Start

Status:

- scope approved
- enhancement plan logged
- implementation not started yet at this entry

Enhancement priorities:

1. result reveal after calculate
2. precision entry for slider-heavy routes
3. mobile first-screen density
4. answer-first hierarchy and related-next-step consistency
5. table/graph heaviness reduction where needed

Execution order:

1. `how-much-can-i-borrow`
2. `home-loan`
3. `remortgage-switching`
4. `offset-calculator`
5. `interest-rate-change-calculator`
6. `loan-to-value`
7. `buy-to-let`
8. `personal-loan`

---

## 2026-03-19 — Enhancement Route 1 Complete — `how-much-can-i-borrow`

Status:

- completed
- first enhancement route now sets the cluster pattern for precision entry and result reveal

Files touched:

- `requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md`
- `requirements/universal-rules/home-loan-cluster-redesign/DECISION_LOG.md`
- `requirements/universal-rules/home-loan-cluster-redesign/DESIGN_SYSTEM.md`
- `requirements/universal-rules/home-loan-cluster-redesign/ROLLOUT_PLAN.md`
- `requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md`
- `public/calculators/loan-calculators/shared/cluster-ux.js`
- `public/calculators/loan-calculators/how-much-can-i-borrow/index.html`
- `public/calculators/loan-calculators/how-much-can-i-borrow/calculator.css`
- `public/calculators/loan-calculators/how-much-can-i-borrow/module.js`
- `public/loan-calculators/how-much-can-i-borrow/index.html`
- `tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js`

What changed:

- Logged the enhancement pass in the existing Home Loan redesign ledger before implementation.
- Added a shared Home Loan interaction helper for range-fill, precision-input sync, and mobile result reveal.
- Added companion precise text inputs for the route’s core slider values.
- Moved deposit, rate, and term into a calmer `Loan assumptions` disclosure block to reduce first-screen depth.
- Kept the explicit Calculate CTA and removed pre-click recomputation from slider/precision edits.
- Added a clearer result summary note and focused mobile reveal behavior after calculate.
- Expanded route E2E coverage to lock the new precision-entry and mobile-reveal behavior.

Evidence:

- Enhancement desktop: `test-results/visual/home-loan-enhancement/how-much-can-i-borrow/desktop.png`
- Enhancement mobile: `test-results/visual/home-loan-enhancement/how-much-can-i-borrow/mobile.png`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/how-much-can-i-borrow.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/how-much-can-i-borrow.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`

Test results:

- `TARGET_ROUTE=/loan-calculators/how-much-can-i-borrow/ node scripts/generate-mpa-pages.js` — pass
- `npm run lint` — pass
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:unit` — pass
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:schema:dedupe -- --scope=calc` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass
- `npm run test:iss001` — pass

Notes:

- The route now conforms to the button-only calculation rule for post-load edits while preserving the initial baseline calculation on load.
- Mobile result reveal is now explicit and test-covered instead of relying on the user to scroll to the answer.

---

## 2026-03-19 — Enhancement Route 2 Complete — `home-loan`

Status:

- completed
- flagship mortgage route now matches the enhancement contract set by the first route

Files touched:

- `public/calculators/loan-calculators/mortgage-calculator/index.html`
- `public/calculators/loan-calculators/mortgage-calculator/calculator.css`
- `public/calculators/loan-calculators/mortgage-calculator/module.js`
- `public/loan-calculators/mortgage-calculator/index.html`
- `tests_specs/loans/home-loan_release/e2e.calc.spec.js`
- `requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md`
- `requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md`

What changed:

- Added precise companion inputs for price, down payment, term, and rate.
- Removed pre-click recalculation from the down-payment type toggle while keeping the initial baseline calculation on load.
- Added a clearer result note under the monthly payment card.
- Added deliberate mobile result reveal and focus behavior after calculate.
- Expanded the mortgage E2E suite to lock the new precision-entry and result-reveal behavior.

Evidence:

- Enhancement desktop: `test-results/visual/home-loan-enhancement/home-loan/desktop.png`
- Enhancement mobile: `test-results/visual/home-loan-enhancement/home-loan/mobile.png`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/home-loan.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/home-loan.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`

Test results:

- `TARGET_ROUTE=/loan-calculators/mortgage-calculator/ node scripts/generate-mpa-pages.js` — pass
- `CLUSTER=loans CALC=home-loan npm run test:calc:unit` — pass
- `CLUSTER=loans CALC=home-loan npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=home-loan npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=home-loan npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=home-loan npm run test:schema:dedupe -- --scope=calc` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass

Notes:

- Thin-content scoring remains `warn`, not `fail`, for mortgage.
- The mortgage route now shares the same precision/reveal interaction language as `how-much-can-i-borrow`.

---

## 2026-03-19 — Enhancement Route 3 Complete — `remortgage-switching`

Status:

- completed
- remortgage route now follows the same precision-entry and result-reveal contract as the first two routes

Files touched:

- `public/calculators/loan-calculators/remortgage-calculator/index.html`
- `public/calculators/loan-calculators/remortgage-calculator/calculator.css`
- `public/calculators/loan-calculators/remortgage-calculator/module.js`
- `public/loan-calculators/remortgage-calculator/index.html`
- `tests_specs/loans/remortgage-switching_release/e2e.calc.spec.js`
- `requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md`
- `requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md`

What changed:

- Added precise companion inputs for the current balance, current/new rates, current/new terms, and horizon slider.
- Removed pre-click recomputation from slider/precision edits while keeping the initial baseline calculation on load.
- Added deliberate mobile result reveal for the switching summary card.
- Expanded the remortgage E2E suite to cover the new precision-entry and mobile-reveal behavior.

Evidence:

- Enhancement desktop: `test-results/visual/home-loan-enhancement/remortgage-switching/desktop.png`
- Enhancement mobile: `test-results/visual/home-loan-enhancement/remortgage-switching/mobile.png`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/remortgage-switching.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/remortgage-switching.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`

Test results:

- `TARGET_ROUTE=/loan-calculators/remortgage-calculator/ node scripts/generate-mpa-pages.js` — pass
- `CLUSTER=loans CALC=remortgage-switching npm run test:calc:unit` — skipped by existing route suite
- `CLUSTER=loans CALC=remortgage-switching npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=remortgage-switching npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=remortgage-switching npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=remortgage-switching npm run test:schema:dedupe -- --scope=calc` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass

Notes:

- Thin-content scoring remains `warn`, not `fail`, for remortgage.
- The route no longer recomputes during slider movement; users now control recalculation explicitly through the CTA.

---

## 2026-03-19 — Enhancement Route 4 Complete — `offset-calculator`

Status:

- completed
- offset route now matches the cluster precision-entry and result-reveal contract

Files touched:

- `public/calculators/loan-calculators/offset-mortgage-calculator/index.html`
- `public/calculators/loan-calculators/offset-mortgage-calculator/calculator.css`
- `public/calculators/loan-calculators/offset-mortgage-calculator/module.js`
- `public/loan-calculators/offset-mortgage-calculator/index.html`
- `tests_specs/loans/offset-calculator_release/e2e.calc.spec.js`
- `requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md`
- `requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md`

What changed:

- Added precise companion inputs for mortgage balance, rate, term, offset savings, and monthly offset contribution.
- Removed pre-click recomputation from slider/precision edits and from the offset-mode toggle while keeping the initial baseline calculation on load.
- Added an answer note under the primary payment card so the page explains the offset effect in plain language.
- Added deliberate mobile result reveal and focus behavior for the offset summary card.
- Expanded the offset E2E suite to cover precision-entry sync, button-only recalculation, and mobile result reveal.
- Ran the grouped Playwright route pass to validate design-facing behavior in addition to the standard release gates.

Evidence:

- Grouped Playwright summary: `test-results/playwright/calc/loans/offset-calculator/2026-03-19T18-56-13-376Z/playwright-all.summary.json`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/offset-calculator.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/offset-calculator.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`

Test results:

- `TARGET_ROUTE=/loan-calculators/offset-mortgage-calculator/ node scripts/generate-mpa-pages.js` — pass
- `npm run lint` — pass
- `CLUSTER=loans CALC=offset-calculator npm run test:calc:unit` — skipped by existing route suite
- `CLUSTER=loans CALC=offset-calculator npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=offset-calculator npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=offset-calculator npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=offset-calculator npm run test:schema:dedupe -- --scope=calc` — pass
- `CLUSTER=loans CALC=offset-calculator npm run test:calc:playwright` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass

Notes:

- Thin-content scoring passed for the offset route in this enhancement pass.
- The route now requires an explicit Calculate action after edits, including offset-mode changes, which keeps the first-screen experience calmer and more predictable.

---

## 2026-03-19 — Enhancement Route 5 Complete — `interest-rate-change-calculator`

Status:

- completed
- rate-change route now matches the cluster precision-entry and result-reveal contract

Files touched:

- `public/calculators/loan-calculators/interest-rate-change-calculator/index.html`
- `public/calculators/loan-calculators/interest-rate-change-calculator/calculator.css`
- `public/calculators/loan-calculators/interest-rate-change-calculator/module.js`
- `public/loan-calculators/interest-rate-change-calculator/index.html`
- `tests_specs/loans/interest-rate-change-calculator_release/e2e.calc.spec.js`
- `requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md`
- `requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md`

What changed:

- Added precise companion inputs for loan balance, current rate, new rate, remaining term, and delayed change timing.
- Removed pre-click recomputation from slider/precision edits and from the rate-change timing toggle while keeping the initial baseline calculation on load.
- Added an answer note under the primary payment card so the route explains monthly and lifetime-interest impact in plain language.
- Added deliberate mobile result reveal and focus behavior for the updated payment summary.
- Expanded the rate-change E2E suite to cover precision-entry sync, button-only recalculation, and mobile result reveal.
- Ran the grouped Playwright route pass to validate design-facing behavior in addition to the standard release gates.

Evidence:

- Grouped Playwright summary: `test-results/playwright/calc/loans/interest-rate-change-calculator/2026-03-19T19-13-17-634Z/playwright-all.summary.json`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/interest-rate-change-calculator.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/interest-rate-change-calculator.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`

Test results:

- `TARGET_ROUTE=/loan-calculators/interest-rate-change-calculator/ node scripts/generate-mpa-pages.js` — pass
- `npm run lint` — pass
- `CLUSTER=loans CALC=interest-rate-change-calculator npm run test:calc:unit` — skipped by existing route suite
- `CLUSTER=loans CALC=interest-rate-change-calculator npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=interest-rate-change-calculator npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=interest-rate-change-calculator npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=interest-rate-change-calculator npm run test:schema:dedupe -- --scope=calc` — pass
- `CLUSTER=loans CALC=interest-rate-change-calculator npm run test:calc:playwright` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass

Notes:

- Thin-content scoring passed for the rate-change route in this enhancement pass.
- The route now keeps timing changes and precision edits calm and explicit by waiting for the Calculate CTA before recomputing.

---

## 2026-03-19 — Enhancement Route 6 Complete — `loan-to-value`

Status:

- completed
- LTV route now matches the cluster precision-entry and result-reveal contract

Files touched:

- `public/calculators/loan-calculators/ltv-calculator/index.html`
- `public/calculators/loan-calculators/ltv-calculator/calculator.css`
- `public/calculators/loan-calculators/ltv-calculator/module.js`
- `public/loan-calculators/ltv-calculator/index.html`
- `tests_specs/loans/loan-to-value_release/e2e.calc.spec.js`
- `requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md`
- `requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md`

What changed:

- Added precise companion inputs for property value, loan amount, deposit amount, and deposit percent.
- Removed pre-click recomputation from slider/precision edits and from both LTV mode toggles while keeping the initial baseline calculation on load.
- Removed the old debounced auto-calc path so the route now waits for the Calculate CTA after post-load edits.
- Added an answer note under the primary LTV card so the route explains deposit/equity coverage in plain language.
- Added deliberate mobile result reveal and focus behavior for the LTV snapshot.
- Expanded the LTV E2E suite to cover precision-entry sync, button-only recalculation, and mobile result reveal.
- Ran the grouped Playwright route pass to validate design-facing behavior in addition to the standard release gates.

Evidence:

- Grouped Playwright summary: `test-results/playwright/calc/loans/loan-to-value/2026-03-19T19-29-47-862Z/playwright-all.summary.json`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/loan-to-value.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/loan-to-value.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`

Test results:

- `TARGET_ROUTE=/loan-calculators/ltv-calculator/ node scripts/generate-mpa-pages.js` — pass
- `npm run lint` — pass
- `CLUSTER=loans CALC=loan-to-value npm run test:calc:unit` — skipped by existing route suite
- `CLUSTER=loans CALC=loan-to-value npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=loan-to-value npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=loan-to-value npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=loan-to-value npm run test:schema:dedupe -- --scope=calc` — pass
- `CLUSTER=loans CALC=loan-to-value npm run test:calc:playwright` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass

Notes:

- Thin-content scoring passed for the LTV route in this enhancement pass.
- The route now keeps loan/deposit mode changes calm and explicit by waiting for the Calculate CTA before recomputing the band and risk state.

---

## 2026-03-19 — Enhancement Route 7 Complete — `buy-to-let`

Status:

- completed
- buy-to-let route now matches the cluster precision-entry and result-reveal contract

Files touched:

- `public/calculators/loan-calculators/buy-to-let-mortgage-calculator/index.html`
- `public/calculators/loan-calculators/buy-to-let-mortgage-calculator/calculator.css`
- `public/calculators/loan-calculators/buy-to-let-mortgage-calculator/module.js`
- `public/loan-calculators/buy-to-let-mortgage-calculator/index.html`
- `tests_specs/loans/buy-to-let_release/e2e.calc.spec.js`
- `requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md`
- `requirements/universal-rules/home-loan-cluster-redesign/EXECUTION_LOG.md`

What changed:

- Added precise companion inputs for property price, monthly rent, deposit amount, deposit percent, interest rate, and term.
- Removed pre-click recomputation from slider/precision edits and from deposit, mortgage, vacancy, and rent-increase toggle groups while keeping the initial baseline calculation on load.
- Removed the old debounced auto-calc path so the route now waits for the Calculate CTA after post-load edits.
- Added an answer note under the primary cashflow card so the route explains direction and stress coverage in plain language.
- Added deliberate mobile result reveal and focus behavior for the buy-to-let result panel.
- Expanded the buy-to-let E2E suite to cover precision-entry sync and mobile result reveal.
- Ran the grouped Playwright route pass to validate design-facing behavior in addition to the standard release gates.

Evidence:

- Grouped Playwright summary: `test-results/playwright/calc/loans/buy-to-let/2026-03-19T19-48-11-591Z/playwright-all.summary.json`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/buy-to-let.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/buy-to-let.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`

Test results:

- `TARGET_ROUTE=/loan-calculators/buy-to-let-mortgage-calculator/ node scripts/generate-mpa-pages.js` — pass
- `npm run lint` — pass
- `CLUSTER=loans CALC=buy-to-let npm run test:calc:unit` — pass
- `CLUSTER=loans CALC=buy-to-let npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=buy-to-let npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=buy-to-let npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=buy-to-let npm run test:schema:dedupe -- --scope=calc` — pass
- `CLUSTER=loans CALC=buy-to-let npm run test:calc:playwright` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass

Notes:

- Thin-content scoring remains `warn`, not `fail`, for the buy-to-let route in this enhancement pass.
- The route now keeps deposit/mortgage strategy changes calm and explicit by waiting for the Calculate CTA before recomputing the cashflow outcome.

---

## 2026-03-19 — Route 7 Complete — `buy-to-let`

Status:

- completed
- buy-to-let route now matches the Home Loan light shell and keeps its projection-heavy flow readable on desktop and mobile

Files touched:

- `scripts/generate-mpa-pages.js`
- `public/calculators/loan-calculators/buy-to-let-mortgage-calculator/index.html`
- `public/calculators/loan-calculators/buy-to-let-mortgage-calculator/explanation.html`
- `public/calculators/loan-calculators/buy-to-let-mortgage-calculator/calculator.css`
- `public/loan-calculators/buy-to-let-mortgage-calculator/index.html`
- `tests_specs/loans/buy-to-let_release/e2e.calc.spec.js`
- `tests_specs/loans/buy-to-let_release/seo.calc.spec.js`

What changed:

- Added `buy-to-let` to the Home Loan migration list so the generated route uses the `hl-cluster-*` shell.
- Removed fragment-level inline styling and `@import` delivery from the calculator and explanation sources.
- Added stable explanation section IDs for summary, results, projection, guide, FAQ, and notes verification.
- Replaced the dark-era route stylesheet with a light route-owned layout for the form panel, sticky preview card, result metrics, projection table, FAQ, and notes stack.
- Updated the route E2E suite to validate the migrated shell contract, old-shell removal, FAQ count, and no-overflow behavior.
- Replaced the placeholder skipped SEO spec with a real metadata, schema, FAQ parity, sitemap, and section-order test.

Evidence:

- Baseline desktop: `test-results/visual/home-loan-redesign/buy-to-let/baseline/desktop.png`
- Baseline mobile: `test-results/visual/home-loan-redesign/buy-to-let/baseline/mobile.png`
- Final desktop: `test-results/visual/home-loan-redesign/buy-to-let/final/desktop.png`
- Final mobile: `test-results/visual/home-loan-redesign/buy-to-let/final/mobile.png`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/buy-to-let.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/buy-to-let.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`
- SEO mojibake reports: `seo_mojibake_report.md`, `seo_mojibake_report.csv`

Test results:

- `npm run lint` — pass
- `TARGET_ROUTE=/loan-calculators/buy-to-let-mortgage-calculator/ node scripts/generate-mpa-pages.js` — pass
- `CLUSTER=loans CALC=buy-to-let npm run test:calc:unit` — pass
- `CLUSTER=loans CALC=buy-to-let npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=buy-to-let npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=buy-to-let npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=buy-to-let npm run test:schema:dedupe -- --scope=calc` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass

Notes:

- Thin-content scoring returned `warn`, not `fail`, for this route.
- The regenerated page now omits the old shell, dark theme, ad pane, `layout.css`, `shared-calculator-ui.css`, and `mpa-nav.js`.

---

## 2026-03-19 — Route 8 Complete — `personal-loan`

Status:

- completed
- personal-loan route now matches the Home Loan light shell with a cleaner answer-first preview, light chart treatment, and premium table/FAQ rhythm

Files touched:

- `scripts/generate-mpa-pages.js`
- `public/calculators/loan-calculators/personal-loan-calculator/index.html`
- `public/calculators/loan-calculators/personal-loan-calculator/calculator.css`
- `public/loan-calculators/personal-loan-calculator/index.html`
- `tests_specs/loans/personal-loan_release/e2e.calc.spec.js`
- `tests_specs/loans/personal-loan_release/seo.calc.spec.js`

What changed:

- Added `personal-loan` to the Home Loan migration list so the route renders through the `hl-cluster-*` shell.
- Removed fragment-level inline styles and `@import` delivery from the calculator source.
- Replaced the route stylesheet with a light route-owned layout for the form panel, result snapshot, advanced options disclosure, chart, amortization table, FAQ cards, and notes treatment.
- Updated the route E2E suite to validate the migrated shell contract, no-old-shell condition, no-dark-theme condition, and no-overflow behavior.
- Strengthened the route SEO suite to validate the migrated shell load, no-dark-theme condition, and chart/table/how-to/FAQ/notes section order.
- Captured new desktop/mobile final evidence after calculation to confirm the layout remains balanced on both breakpoints.

Evidence:

- Baseline desktop: `test-results/visual/home-loan-redesign/personal-loan/baseline/desktop.png`
- Baseline mobile: `test-results/visual/home-loan-redesign/personal-loan/baseline/mobile.png`
- Final desktop: `test-results/visual/home-loan-redesign/personal-loan/final/desktop.png`
- Final mobile: `test-results/visual/home-loan-redesign/personal-loan/final/mobile.png`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/personal-loan.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/personal-loan.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`
- SEO mojibake reports: `seo_mojibake_report.md`, `seo_mojibake_report.csv`

Test results:

- `TARGET_ROUTE=/loan-calculators/personal-loan-calculator/ node scripts/generate-mpa-pages.js` — pass
- `npm run lint` — pass
- `CLUSTER=loans CALC=personal-loan npm run test:calc:unit` — pass
- `CLUSTER=loans CALC=personal-loan npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=personal-loan npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=personal-loan npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=personal-loan npm run test:schema:dedupe -- --scope=calc` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass

Notes:

- Thin-content scoring returned `warn`, not `fail`, for this route.
- Final desktop/mobile screenshots were reviewed after capture to confirm the migrated light shell, table toggle placement, chart legibility, and no-shell-clutter outcome.

---

## 2026-03-19 — Final Cluster Verification Complete

Status:

- completed
- Home Loan redesign rollout is fully verified and signed off

What changed:

- Re-ran final cluster verification after route 8 closed: `npm run lint`, `npm run test:cluster:contracts`, `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope`, and `npm run test:iss001`.
- Ran a generated-output audit across all 8 target routes to confirm the migrated `hl-cluster-page-shell`, `hl-cluster-panel`, `calculator-page-single hl-cluster-flow`, and removal of `top-nav`, `left-nav`, `ads-column`, `theme-premium-dark.css`, and `shared-calculator-ui.css`.
- Created the release sign-off for the completed redesign rollout.

Evidence:

- Action ledger: `requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md`
- Release sign-off: `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-20260319-HOME-LOAN-REDESIGN.md`
- Layout stability gate: `tests_specs/infrastructure/e2e/iss-design-001.spec.js`

Test results:

- `npm run lint` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass
- `npm run test:iss001` — pass

Notes:

- The rollout finishes with 8 migrated Home Loan routes, 8 route-level screenshot sets, 8 route-level CWV artifacts, and a final release sign-off.
- Remaining non-blocking warnings are limited to the four thin-content `warn` artifacts already recorded in the sign-off.

---

## 2026-03-19 — Route 5 Complete — `interest-rate-change-calculator`

Status:

- completed
- rate-change route now matches the Home Loan light shell and explanation rhythm

Files touched:

- `scripts/generate-mpa-pages.js`
- `public/calculators/loan-calculators/interest-rate-change-calculator/index.html`
- `public/calculators/loan-calculators/interest-rate-change-calculator/explanation.html`
- `public/calculators/loan-calculators/interest-rate-change-calculator/calculator.css`
- `public/loan-calculators/interest-rate-change-calculator/index.html`
- `tests_specs/loans/interest-rate-change-calculator_release/e2e.calc.spec.js`
- `tests_specs/loans/interest-rate-change-calculator_release/seo.calc.spec.js`

What changed:

- Added `interest-rate-change-calculator` to the Home Loan migration list so the generated route uses the new `hl-cluster-*` shell.
- Removed fragment-level inline style delivery and `@import` delivery from the calculator source.
- Added stable explanation section IDs for lifetime, amortization, FAQ, and order verification.
- Replaced the dark-era route stylesheet with a calmer light layout for the form panel, result card, snapshot matrix, lifetime donut block, guide tables, and notes block.
- Updated the E2E suite to validate the migrated shell contract, absence of old shell chrome, and no-overflow behavior.
- Replaced the placeholder skipped SEO spec with a real metadata, schema, FAQ parity, sitemap, and section-order test.

Evidence:

- Baseline desktop: `test-results/visual/home-loan-redesign/interest-rate-change-calculator/baseline/desktop.png`
- Baseline mobile: `test-results/visual/home-loan-redesign/interest-rate-change-calculator/baseline/mobile.png`
- Final desktop: `test-results/visual/home-loan-redesign/interest-rate-change-calculator/final/desktop.png`
- Final mobile: `test-results/visual/home-loan-redesign/interest-rate-change-calculator/final/mobile.png`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/interest-rate-change-calculator.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/interest-rate-change-calculator.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`
- SEO mojibake reports: `seo_mojibake_report.md`, `seo_mojibake_report.csv`

Test results:

- `TARGET_ROUTE=/loan-calculators/interest-rate-change-calculator/ node scripts/generate-mpa-pages.js` — pass
- `npm run lint` — pass
- `CLUSTER=loans CALC=interest-rate-change-calculator npm run test:calc:unit` — skipped by existing route suite
- `CLUSTER=loans CALC=interest-rate-change-calculator npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=interest-rate-change-calculator npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=interest-rate-change-calculator npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=interest-rate-change-calculator npm run test:schema:dedupe -- --scope=calc` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass

Notes:

- Thin-content scoring passed for this route.
- The regenerated page now omits the old shell, dark theme, ad pane, `layout.css`, `shared-calculator-ui.css`, and `mpa-nav.js`.

---

## 2026-03-19 — Route 6 Complete — `loan-to-value`

Status:

- completed
- LTV route now matches the Home Loan light shell and no longer pollutes FAQ schema with related-link cards

Files touched:

- `scripts/generate-mpa-pages.js`
- `public/calculators/loan-calculators/ltv-calculator/index.html`
- `public/calculators/loan-calculators/ltv-calculator/explanation.html`
- `public/calculators/loan-calculators/ltv-calculator/calculator.css`
- `public/loan-calculators/ltv-calculator/index.html`
- `tests_specs/loans/loan-to-value_release/e2e.calc.spec.js`
- `tests_specs/loans/loan-to-value_release/seo.calc.spec.js`

What changed:

- Added `loan-to-value` to the Home Loan migration list so the route renders through the `hl-cluster-*` shell.
- Removed fragment-level inline styles and `@import` delivery from the calculator source.
- Split the top related-calculator cards out of the FAQ card pattern into a dedicated related-links grid.
- Added stable explanation section IDs for lifetime, amortization, FAQ, and order verification.
- Replaced the dark-era stylesheet with a light route-owned layout for the input controls, result stack, risk/status pills, funding split, band tables, and notes block.
- Updated the route E2E suite to validate the migrated shell, mode-toggle visibility, table toggles, related/FAQ counts, and overflow behavior.
- Replaced the placeholder skipped SEO spec with a real metadata, schema, FAQ parity, sitemap, related-card, and section-order test.

Evidence:

- Baseline desktop: `test-results/visual/home-loan-redesign/loan-to-value/baseline/desktop.png`
- Baseline mobile: `test-results/visual/home-loan-redesign/loan-to-value/baseline/mobile.png`
- Final desktop: `test-results/visual/home-loan-redesign/loan-to-value/final/desktop.png`
- Final mobile: `test-results/visual/home-loan-redesign/loan-to-value/final/mobile.png`
- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/loan-to-value.json`
- Thin-content artifact: `test-results/content-quality/scoped/loans/loan-to-value.json`
- Schema dedupe reports: `schema_duplicates_report.md`, `schema_duplicates_report.csv`
- SEO mojibake reports: `seo_mojibake_report.md`, `seo_mojibake_report.csv`

Test results:

- `TARGET_ROUTE=/loan-calculators/ltv-calculator/ node scripts/generate-mpa-pages.js` — pass
- `npm run lint` — pass
- `CLUSTER=loans CALC=loan-to-value npm run test:calc:unit` — skipped by existing route suite
- `CLUSTER=loans CALC=loan-to-value npm run test:calc:e2e` — pass
- `CLUSTER=loans CALC=loan-to-value npm run test:calc:seo` — pass
- `CLUSTER=loans CALC=loan-to-value npm run test:calc:cwv` — pass
- `CLUSTER=loans CALC=loan-to-value npm run test:schema:dedupe -- --scope=calc` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass

Notes:

- Thin-content scoring passed for this route.
- The regenerated page now omits the old shell, dark theme, ad pane, `layout.css`, `shared-calculator-ui.css`, and `mpa-nav.js`.

---

## 2026-03-19 — Ledger Closeout

Status:

- completed
- latest authoritative rollout state is closed and ready for merge

Closeout notes:

- Route 7 (`buy-to-let`), Route 8 (`personal-loan`), and final cluster verification/sign-off deltas are already recorded earlier in this ledger.
- This closeout entry exists to keep the final rollout state visible at the physical end of the file without rewriting prior log history.
- Refer to [ACTION_PAGE.md](/home/kartheek/calchowmuch/requirements/universal-rules/home-loan-cluster-redesign/ACTION_PAGE.md) and [RELEASE_SIGNOFF_REL-20260319-HOME-LOAN-REDESIGN.md](/home/kartheek/calchowmuch/requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-20260319-HOME-LOAN-REDESIGN.md) for the final authoritative release state.

# Time & Date Cluster Execution Log

## 2026-03-21 — Rollout Start

Status:

- scope approved by HUMAN instruction for full-cluster redesign
- documentation pack started
- implementation not started yet at this entry

Scope:

- `age-calculator`
- `birthday-day-of-week`
- `days-until-a-date-calculator`
- `time-between-two-dates-calculator`
- `countdown-timer-generator`
- `work-hours-calculator`
- `overtime-hours-calculator`
- `sleep-time-calculator`
- `wake-up-time-calculator`
- `nap-time-calculator`
- `power-nap-calculator`
- `energy-based-nap-selector`

Allowed files:

- `requirements/universal-rules/time-and-date-cluster-redesign/**`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-*-TIME-AND-DATE-*.md`
- `public/calculators/time-and-date/**`
- `public/time-and-date/**`
- `scripts/generate-mpa-pages.js`
- `config/testing/test-scope-map.json`
- `config/clusters/route-ownership.json`
- `public/config/navigation.json`
- `clusters/time-and-date/config/navigation.json`
- `clusters/time-and-date/config/asset-manifest.json`
- `tests_specs/time-and-date/**`
- `tests_specs/sleep-and-nap/**`

Initial findings:

- generated Time & Date pages still load the legacy dark shell, top nav, left nav, and ads column
- generated routes still depend on dark shared CSS and old shell structure
- route source fragments still contain inline `@import` CSS delivery
- route maturity is uneven: Age, Time Between Two Dates, and Countdown have stronger internal structures than the rest
- route-level tests are split between `tests_specs/time-and-date/**` and `tests_specs/sleep-and-nap/**`
- the cluster does not yet have a shared light shell or shared Time & Date cluster stylesheet

Execution order:

1. `age-calculator`
2. `birthday-day-of-week`
3. `days-until-a-date-calculator`
4. `time-between-two-dates-calculator`
5. `countdown-timer-generator`
6. `work-hours-calculator`
7. `overtime-hours-calculator`
8. `sleep-time-calculator`
9. `wake-up-time-calculator`
10. `nap-time-calculator`
11. `power-nap-calculator`
12. `energy-based-nap-selector`

Notes:

- scoped SEO emitted a thin-content quality warning artifact, but the route passed its hard SEO gate and mojibake scan with zero findings

## 2026-03-22 — Route Complete: `energy-based-nap-selector`

Status:

- completed

Changes:

- corrected the primary-card visual differentiation test so it inspects the computed background image and color values instead of treating the string `none` as a visual state
- added explicit light-theme overrides for the primary recommendation card, alternative rows, warning surface, footer note, and explanation cards so the final cascade matches the redesigned Time & Date cluster
- aligned the SEO test with the route's actual calculator structured-data output, which serializes `WebPage` and `FAQPage` in `data-calculator-ld`

Files touched:

- `public/calculators/time-and-date/energy-based-nap-selector/calculator.css`
- `tests_specs/sleep-and-nap/energy-based-nap-selector_release/e2e.calc.spec.js`
- `tests_specs/sleep-and-nap/energy-based-nap-selector_release/seo.calc.spec.js`
- `public/time-and-date/energy-based-nap-selector/index.html`

Validation:

- `node scripts/generate-mpa-pages.js --calc-id energy-based-nap-selector` -> pass
- `CLUSTER=sleep-and-nap CALC=energy-based-nap-selector npm run test:calc:unit` -> pass
- `CLUSTER=sleep-and-nap CALC=energy-based-nap-selector npm run test:calc:e2e` -> pass
- `CLUSTER=sleep-and-nap CALC=energy-based-nap-selector npm run test:calc:seo` -> pass
- `CLUSTER=sleep-and-nap CALC=energy-based-nap-selector npm run test:calc:cwv` -> pass
- `CLUSTER=sleep-and-nap CALC=energy-based-nap-selector npm run test:schema:dedupe -- --scope=calc` -> pass
- `npm run lint:css-import` -> pass

Notes:

- scoped SEO emitted a thin-content quality warning artifact, but the route passed its hard SEO gate and mojibake scan with zero findings

## 2026-03-22 — Cluster Closeout: `time-and-date`

Status:

- completed

Changes:

- ran cluster-closeout validation for the full Time & Date rollout using the two scoped test suites that cover the migrated routes: `time-and-date` and `sleep-and-nap`
- confirmed that all 12 target routes in the action page are now complete and validated under the redesigned Time & Date shell

Validation:

- `npm run lint` -> pass
- `CLUSTER=time-and-date npm run test:cluster:unit` -> pass
- `CLUSTER=time-and-date npm run test:cluster:e2e` -> pass
- `CLUSTER=time-and-date npm run test:cluster:seo` -> pass
- `CLUSTER=time-and-date npm run test:cluster:cwv` -> pass
- `CLUSTER=time-and-date npm run test:schema:dedupe -- --scope=cluster` -> pass
- `CLUSTER=sleep-and-nap npm run test:cluster:unit` -> pass
- `CLUSTER=sleep-and-nap npm run test:cluster:e2e` -> pass
- `CLUSTER=sleep-and-nap npm run test:cluster:seo` -> pass
- `CLUSTER=sleep-and-nap npm run test:cluster:cwv` -> pass
- `CLUSTER=sleep-and-nap npm run test:schema:dedupe -- --scope=cluster` -> pass
- `npm run lint:css-import` -> pass

Notes:

- cluster-closeout log completed with no failure markers in the saved terminal transcript

## 2026-03-22 — Route Complete: `power-nap-calculator`

Status:

- completed

Changes:

- replaced the mixed dark/light route stylesheet with a clean light-shell implementation so the calculator surface and explanation match the redesigned Time & Date cluster
- fixed the release test that checked row highlighting so it compares actual computed background styles rather than treating the string `none` as a visual value
- validated that recommended nap rows are now visibly distinct while preserving the existing nap-duration logic and evening warning behavior

Files touched:

- `public/calculators/time-and-date/power-nap-calculator/calculator.css`
- `tests_specs/sleep-and-nap/power-nap-calculator_release/e2e.calc.spec.js`
- `public/time-and-date/power-nap-calculator/index.html`

Validation:

- `node scripts/generate-mpa-pages.js --calc-id power-nap-calculator` -> pass
- `CLUSTER=sleep-and-nap CALC=power-nap-calculator npm run test:calc:unit` -> pass
- `CLUSTER=sleep-and-nap CALC=power-nap-calculator npm run test:calc:e2e` -> pass
- `CLUSTER=sleep-and-nap CALC=power-nap-calculator npm run test:calc:seo` -> pass
- `CLUSTER=sleep-and-nap CALC=power-nap-calculator npm run test:calc:cwv` -> pass
- `CLUSTER=sleep-and-nap CALC=power-nap-calculator npm run test:schema:dedupe -- --scope=calc` -> pass
- `npm run lint:css-import` -> pass

Notes:

- scoped SEO emitted a thin-content quality warning artifact, but the route passed its hard SEO gate and mojibake scan with zero findings

## 2026-03-22 — Route Complete: `nap-time-calculator`

Status:

- completed

Changes:

- validated the migrated nap-time route on the dedicated Time & Date light shell with no top nav, left nav, or ads column
- confirmed the route explanation, FAQ schema, subgroup switcher, and generated public page already matched the release contract without additional source edits

Files touched:

- `public/time-and-date/nap-time-calculator/index.html`

Validation:

- `node scripts/generate-mpa-pages.js --calc-id nap-time-calculator` -> pass
- `CLUSTER=sleep-and-nap CALC=nap-time-calculator npm run test:calc:unit` -> pass
- `CLUSTER=sleep-and-nap CALC=nap-time-calculator npm run test:calc:e2e` -> pass
- `CLUSTER=sleep-and-nap CALC=nap-time-calculator npm run test:calc:seo` -> pass
- `CLUSTER=sleep-and-nap CALC=nap-time-calculator npm run test:calc:cwv` -> pass
- `CLUSTER=sleep-and-nap CALC=nap-time-calculator npm run test:schema:dedupe -- --scope=calc` -> pass
- `npm run lint:css-import` -> pass

Notes:

- scoped SEO emitted a thin-content quality warning artifact, but the route passed its hard SEO gate and mojibake scan with zero findings

- This log is append-only.
- Each route completion entry must record files touched, what changed, evidence, and test results.

## 2026-03-21 — Shared Foundation Completed

Status:

- completed

Changes:

- added the Time & Date redesign documentation pack
- added the shared Time & Date light cluster stylesheet and cluster UX helper
- added a dedicated Time & Date cluster shell branch in the generator
- added in-flow Time & Date related-calculator navigation for migrated routes
- kept the rollout opt-in so calculators can be released one at a time

Files touched:

- `requirements/universal-rules/time-and-date-cluster-redesign/ACTION_PAGE.md`
- `requirements/universal-rules/time-and-date-cluster-redesign/DESIGN_SYSTEM.md`
- `requirements/universal-rules/time-and-date-cluster-redesign/DECISION_LOG.md`
- `requirements/universal-rules/time-and-date-cluster-redesign/EXECUTION_LOG.md`
- `public/calculators/time-and-date/shared/cluster-light.css`
- `public/calculators/time-and-date/shared/cluster-ux.js`
- `scripts/generate-mpa-pages.js`

Validation:

- `get_errors` on the generator and shared cluster files -> pass

Notes:

- the opt-in rollout currently includes `age-calculator` first as the baseline route

## 2026-03-21 — Route Complete: `age-calculator`

Status:

- completed

Changes:

- removed inline route CSS/script tags from the source fragment so the route now relies on the Time & Date cluster shell delivery
- migrated the generated route to the dedicated Time & Date light shell with no top nav, left nav, or ads column
- rewrote the explanation block to the required order: answer-first H2, `How to Guide`, `FAQ`, and `Important Notes`
- aligned `Important Notes` with `Last updated`, `Accuracy`, `Disclaimer`, `Assumptions`, and the exact privacy line
- rethemed the route CSS from dark milestone styling into the shared Time & Date light design system
- updated route E2E and SEO assertions to the new shell and explanation contract

Files touched:

- `public/calculators/time-and-date/age-calculator/index.html`
- `public/calculators/time-and-date/age-calculator/explanation.html`
- `public/calculators/time-and-date/age-calculator/calculator.css`
- `public/time-and-date/age-calculator/index.html`
- `tests_specs/time-and-date/age-calculator_release/e2e.calc.spec.js`
- `tests_specs/time-and-date/age-calculator_release/seo.calc.spec.js`
- `scripts/generate-mpa-pages.js`

Validation:

- `TARGET_CALC_ID=age-calculator node scripts/generate-mpa-pages.js` -> pass
- `CLUSTER=time-and-date CALC=age-calculator npm run test:calc:unit` -> pass
- `npx playwright test tests_specs/time-and-date/age-calculator_release/e2e.calc.spec.js --reporter=line` -> pass
- `npx playwright test tests_specs/time-and-date/age-calculator_release/seo.calc.spec.js --reporter=line` -> pass
- `npx playwright test tests_specs/time-and-date/age-calculator_release/cwv.calc.spec.js --reporter=line` -> pass
- `CLUSTER=time-and-date CALC=age-calculator npm run test:schema:dedupe -- --scope=calc` -> pass

Notes:

- the generated public route now uses the new `td-cluster-page-shell` branch

## 2026-03-22 — Route Complete: `wake-up-time-calculator`

Status:

- completed

Changes:

- validated the migrated wake-up route on the dedicated Time & Date light shell with no top nav, left nav, or ads column
- corrected the sleep-tools route-switch release tests so they target the migrated cluster-switch markup instead of the retired route-switch selectors
- aligned the subgroup inventory assertion with the actual sleep-tools switcher, which intentionally renders the five sleep and nap tools rather than the full Time & Date catalog

Files touched:

- `tests_specs/sleep-and-nap/wake-up-time-calculator_release/e2e.calc.spec.js`

Validation:

- `node scripts/generate-mpa-pages.js --calc-id wake-up-time-calculator` -> pass
- `CLUSTER=sleep-and-nap CALC=wake-up-time-calculator npm run test:calc:unit` -> pass
- `CLUSTER=sleep-and-nap CALC=wake-up-time-calculator npm run test:calc:e2e` -> pass
- `CLUSTER=sleep-and-nap CALC=wake-up-time-calculator npm run test:calc:seo` -> pass
- `CLUSTER=sleep-and-nap CALC=wake-up-time-calculator npm run test:calc:cwv` -> pass
- `CLUSTER=sleep-and-nap CALC=wake-up-time-calculator npm run test:schema:dedupe -- --scope=calc` -> pass
- `npm run lint:css-import` -> pass

Notes:

- scoped SEO emitted a thin-content quality warning artifact, but the route passed its hard SEO gate and mojibake scan with zero findings

## 2026-03-22 — Route Complete: `sleep-time-calculator`

Status:

- completed

Changes:

- migrated the route to the dedicated Time & Date light shell with no top nav, left nav, or ads column
- rewrote the explanation block to the required order: answer-first H2, `How to Guide`, `FAQ`, and `Important Notes`
- replaced the route stylesheet with a shell-safe light editorial sleep-cycles design while preserving the calculator interaction model and result-card behavior
- updated the sleep route E2E and SEO assertions to the migrated shell contract and in-cluster route switch navigation
- widened the generator opt-in set so sleep-time now ships on the redesigned Time & Date shell

Files touched:

- `public/calculators/time-and-date/sleep-time-calculator/explanation.html`
- `public/calculators/time-and-date/sleep-time-calculator/calculator.css`
- `public/time-and-date/sleep-time-calculator/index.html`
- `tests_specs/sleep-and-nap/sleep-time-calculator_release/e2e.calc.spec.js`
- `tests_specs/sleep-and-nap/sleep-time-calculator_release/seo.calc.spec.js`
- `scripts/generate-mpa-pages.js`

Validation:

- `node scripts/generate-mpa-pages.js --calc-id sleep-time-calculator` -> pass
- `CLUSTER=sleep-and-nap CALC=sleep-time-calculator npm run test:calc:unit` -> pass
- `CLUSTER=sleep-and-nap CALC=sleep-time-calculator npm run test:calc:e2e` -> pass
- `CLUSTER=sleep-and-nap CALC=sleep-time-calculator npm run test:calc:seo` -> pass
- `CLUSTER=sleep-and-nap CALC=sleep-time-calculator npm run test:calc:cwv` -> pass
- `CLUSTER=sleep-and-nap CALC=sleep-time-calculator npm run test:schema:dedupe` -> pass
- `npm run lint:css-import` -> pass

Notes:

- sleep-route release tests run under the `sleep-and-nap` cluster scope even though the public route remains under `/time-and-date/`
- the generated public route now uses the new `td-cluster-page-shell` branch

## 2026-03-22 — Route Complete: `birthday-day-of-week`

Status:

- completed

Changes:

- removed inline route CSS/script tags from the source fragment so the route now relies on the Time & Date cluster shell delivery
- migrated the generated route to the dedicated Time & Date light shell with no top nav, left nav, or ads column
- rewrote the explanation block to the required order: answer-first H2, `How to Guide`, `FAQ`, and `Important Notes`
- preserved the module-driven birthday explanation fields while restoring missing spotlight metadata targets in the calculator markup
- rethemed the route CSS from dark milestone styling into the shared Time & Date light design system
- updated route E2E and SEO assertions to the new shell and explanation contract

Files touched:

- `public/calculators/time-and-date/birthday-day-of-week/index.html`
- `public/calculators/time-and-date/birthday-day-of-week/explanation.html`
- `public/calculators/time-and-date/birthday-day-of-week/calculator.css`
- `public/time-and-date/birthday-day-of-week/index.html`
- `tests_specs/time-and-date/birthday-day-of-week_release/e2e.calc.spec.js`
- `tests_specs/time-and-date/birthday-day-of-week_release/seo.calc.spec.js`
- `scripts/generate-mpa-pages.js`

Validation:

- `node scripts/generate-mpa-pages.js --calc-id birthday-day-of-week` -> pass
- `CLUSTER=time-and-date CALC=birthday-day-of-week npm run test:calc:unit` -> pass
- `CLUSTER=time-and-date CALC=birthday-day-of-week npm run test:calc:e2e` -> pass
- `CLUSTER=time-and-date CALC=birthday-day-of-week npm run test:calc:seo` -> pass
- `CLUSTER=time-and-date CALC=birthday-day-of-week npm run test:calc:cwv` -> pass
- `CLUSTER=time-and-date CALC=birthday-day-of-week npm run test:schema:dedupe -- --scope=calc` -> pass
- `npm run lint:css-import` -> pass

Notes:

- scoped SEO emitted a thin-content quality warning artifact, but the route passed its hard SEO gate and mojibake scan with zero findings
- the generated public route now uses the new `td-cluster-page-shell` branch

## 2026-03-22 — Route Complete: `time-between-two-dates-calculator`

Status:

- completed

Changes:

- removed inline route CSS/script tags from the source fragment so the route now relies on the Time & Date cluster shell delivery
- migrated the generated route to the dedicated Time & Date light shell with no top nav, left nav, or ads column
- aligned static generator metadata with the module's richer title and description so initial HTML and hydrated state match
- rewrote the explanation block to the required order: answer-first H2, `How to Guide`, `FAQ`, and `Important Notes`
- rethemed the route CSS from dark premium styling into the shared Time & Date light design system while keeping the calculator interaction model intact
- tightened the shared cluster switcher on narrow screens so long route names wrap instead of causing mobile overflow across migrated pages
- updated route E2E and SEO assertions to the new shell and explanation contract

Files touched:

- `public/calculators/time-and-date/time-between-two-dates-calculator/index.html`
- `public/calculators/time-and-date/time-between-two-dates-calculator/explanation.html`
- `public/calculators/time-and-date/time-between-two-dates-calculator/calculator.css`
- `public/calculators/time-and-date/shared/cluster-light.css`
- `public/time-and-date/time-between-two-dates-calculator/index.html`
- `tests_specs/time-and-date/time-between-two-dates-calculator_release/e2e.calc.spec.js`
- `tests_specs/time-and-date/time-between-two-dates-calculator_release/seo.calc.spec.js`
- `scripts/generate-mpa-pages.js`

Validation:

- `node scripts/generate-mpa-pages.js --calc-id time-between-two-dates-calculator` -> pass
- `CLUSTER=time-and-date CALC=time-between-two-dates-calculator npm run test:calc:unit` -> pass
- `CLUSTER=time-and-date CALC=time-between-two-dates-calculator npm run test:calc:e2e` -> pass
- `CLUSTER=time-and-date CALC=time-between-two-dates-calculator npm run test:calc:seo` -> pass
- `CLUSTER=time-and-date CALC=time-between-two-dates-calculator npm run test:calc:cwv` -> pass
- `CLUSTER=time-and-date CALC=time-between-two-dates-calculator npm run test:schema:dedupe -- --scope=calc` -> pass
- `npm run lint:css-import` -> pass

Notes:

- the shared mobile switch-chip wrapping fix applies to all migrated Time & Date routes
- scoped SEO emitted a thin-content quality warning artifact, but the route passed its hard SEO gate and mojibake scan with zero findings
- the generated public route now uses the new `td-cluster-page-shell` branch

## 2026-03-22 — Route Complete: `days-until-a-date-calculator`

Status:

- completed

Changes:

- rebuilt the route source fragment to match the existing module contract for mode switching, date range comparison, presets, breakdown cards, milestones, calendar export, and share-card actions
- removed inline route CSS/script tags from the source fragment so the route now relies on the Time & Date cluster shell delivery
- migrated the generated route to the dedicated Time & Date light shell with no top nav, left nav, or ads column
- rewrote the explanation block to the required order: answer-first H2, `How to Guide`, `FAQ`, and `Important Notes`
- aligned route metadata and test expectations with the route's current hydrated behavior and FAQ schema
- tightened the route CSS so it styles only the route internals and the new explanation cards, not the legacy global shell

Files touched:

- `public/calculators/time-and-date/days-until-a-date-calculator/index.html`
- `public/calculators/time-and-date/days-until-a-date-calculator/explanation.html`
- `public/calculators/time-and-date/days-until-a-date-calculator/calculator.css`
- `public/calculators/time-and-date/days-until-a-date-calculator/module.js`
- `public/time-and-date/days-until-a-date-calculator/index.html`
- `tests_specs/time-and-date/days-until-a-date-calculator_release/e2e.calc.spec.js`
- `tests_specs/time-and-date/days-until-a-date-calculator_release/seo.calc.spec.js`
- `scripts/generate-mpa-pages.js`

Validation:

- `node scripts/generate-mpa-pages.js --calc-id days-until-a-date-calculator` -> pass
- `CLUSTER=time-and-date CALC=days-until-a-date-calculator npm run test:calc:unit` -> pass
- `CLUSTER=time-and-date CALC=days-until-a-date-calculator npm run test:calc:e2e` -> pass
- `CLUSTER=time-and-date CALC=days-until-a-date-calculator npm run test:calc:seo` -> pass
- `CLUSTER=time-and-date CALC=days-until-a-date-calculator npm run test:calc:cwv` -> pass
- `CLUSTER=time-and-date CALC=days-until-a-date-calculator npm run test:schema:dedupe -- --scope=calc` -> pass
- `npm run lint:css-import` -> pass

Notes:

- scoped SEO emitted a thin-content quality warning artifact, but the route passed its hard SEO gate and mojibake scan with zero findings
- the generated public route now uses the new `td-cluster-page-shell` branch

## 2026-03-22 — Route Complete: `countdown-timer-generator`

Status:

- completed

Changes:

- removed inline route CSS/script tags from the source fragment so the route now relies on the Time & Date cluster shell delivery
- migrated the generated route to the dedicated Time & Date light shell with no top nav, left nav, or ads column
- rewrote the explanation block to the required order: answer-first H2, `How to Guide`, `FAQ`, and `Important Notes`
- rethemed the route CSS from dark countdown styling into the shared Time & Date light design system while keeping the timer, milestone, and share actions intact
- updated route E2E and SEO assertions to the new shell and explanation contract

Files touched:

- `public/calculators/time-and-date/countdown-timer-generator/index.html`
- `public/calculators/time-and-date/countdown-timer-generator/explanation.html`
- `public/calculators/time-and-date/countdown-timer-generator/calculator.css`
- `public/time-and-date/countdown-timer/index.html`
- `tests_specs/time-and-date/countdown-timer-generator_release/e2e.calc.spec.js`
- `tests_specs/time-and-date/countdown-timer-generator_release/seo.calc.spec.js`
- `scripts/generate-mpa-pages.js`

Validation:

- `node scripts/generate-mpa-pages.js --calc-id countdown-timer-generator` -> pass
- `CLUSTER=time-and-date CALC=countdown-timer-generator npm run test:calc:unit` -> pass
- `CLUSTER=time-and-date CALC=countdown-timer-generator npm run test:calc:e2e` -> pass
- `CLUSTER=time-and-date CALC=countdown-timer-generator npm run test:calc:seo` -> pass
- `CLUSTER=time-and-date CALC=countdown-timer-generator npm run test:calc:cwv` -> pass
- `CLUSTER=time-and-date CALC=countdown-timer-generator node scripts/schema-structured-data-dedupe.mjs` -> pass
- `npm run lint:css-import` -> pass

Notes:

- the generated public route now uses the new `td-cluster-page-shell` branch

## 2026-03-22 — Route Complete: `overtime-hours-calculator`

Status:

- completed

Changes:

- removed inline route CSS/script tags from the source fragment so the route now relies on the Time & Date cluster shell delivery
- migrated the generated route to the dedicated Time & Date light shell with no top nav, left nav, or ads column
- rewrote the explanation block to the required order: answer-first H2, `How to Guide`, `FAQ`, and `Important Notes` while preserving the live overtime summary placeholders
- rethemed the route CSS into the shared Time & Date light design system while preserving daily, weekly, split-shift, and night-overtime flows
- updated route E2E and SEO assertions to the new shell and explanation contract

Files touched:

- `public/calculators/time-and-date/overtime-hours-calculator/index.html`
- `public/calculators/time-and-date/overtime-hours-calculator/explanation.html`
- `public/calculators/time-and-date/overtime-hours-calculator/calculator.css`
- `public/time-and-date/overtime-hours-calculator/index.html`
- `tests_specs/time-and-date/overtime-hours-calculator_release/e2e.calc.spec.js`
- `tests_specs/time-and-date/overtime-hours-calculator_release/seo.calc.spec.js`
- `scripts/generate-mpa-pages.js`

Validation:

- `node scripts/generate-mpa-pages.js --calc-id overtime-hours-calculator` -> pass
- `CLUSTER=time-and-date CALC=overtime-hours-calculator npm run test:calc:unit` -> pass
- `CLUSTER=time-and-date CALC=overtime-hours-calculator npm run test:calc:e2e` -> pass
- `CLUSTER=time-and-date CALC=overtime-hours-calculator npm run test:calc:seo` -> pass
- `CLUSTER=time-and-date CALC=overtime-hours-calculator npm run test:calc:cwv` -> pass
- `CLUSTER=time-and-date CALC=overtime-hours-calculator node scripts/schema-structured-data-dedupe.mjs` -> pass
- `npm run lint:css-import` -> pass

Notes:

- the generated public route now uses the new `td-cluster-page-shell` branch

## 2026-03-22 — Route Complete: `work-hours-calculator`

Status:

- completed

Changes:

- removed inline route CSS/script tags from the source fragment so the route now relies on the Time & Date cluster shell delivery
- migrated the generated route to the dedicated Time & Date light shell with no top nav, left nav, or ads column
- rewrote the explanation block to the required order: answer-first H2, `How to Guide`, `FAQ`, and `Important Notes`
- rethemed the route CSS into the shared Time & Date light design system while preserving single-shift, split-shift, and weekly work-hour flows
- updated route E2E and SEO assertions to the new shell and explanation contract

Files touched:

- `public/calculators/time-and-date/work-hours-calculator/index.html`
- `public/calculators/time-and-date/work-hours-calculator/explanation.html`
- `public/calculators/time-and-date/work-hours-calculator/calculator.css`
- `public/time-and-date/work-hours-calculator/index.html`
- `tests_specs/time-and-date/work-hours-calculator_release/e2e.calc.spec.js`
- `tests_specs/time-and-date/work-hours-calculator_release/seo.calc.spec.js`
- `scripts/generate-mpa-pages.js`

Validation:

- `node scripts/generate-mpa-pages.js --calc-id work-hours-calculator` -> pass
- `CLUSTER=time-and-date CALC=work-hours-calculator npm run test:calc:unit` -> pass
- `CLUSTER=time-and-date CALC=work-hours-calculator npm run test:calc:e2e` -> pass
- `CLUSTER=time-and-date CALC=work-hours-calculator npm run test:calc:seo` -> pass
- `CLUSTER=time-and-date CALC=work-hours-calculator npm run test:calc:cwv` -> pass
- `CLUSTER=time-and-date CALC=work-hours-calculator node scripts/schema-structured-data-dedupe.mjs` -> pass
- `npm run lint:css-import` -> pass

Notes:

- the generated public route now uses the new `td-cluster-page-shell` branch
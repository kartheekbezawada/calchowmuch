# Finance Legacy Decommission Plan

## Objective
- Migrate all finance calculators from legacy source/runtime paths.
- Keep canonical URLs unchanged under `/finance-calculators/`.
- Remove legacy finance pages and code permanently.
- Enforce one-calculator-at-a-time execution with unit-first testing.

## Non-Goals
- No calculator UX redesign.
- No input/control changes.
- No canonical URL changes.
- No redirect-based migration.

## Scope And Safety Rules
- Work one finance calculator at a time.
- Do not edit unrelated calculators or shared files outside approved scope.
- Do not run heavy full-suite gates during per-calculator migration.
- Run calculator-scoped unit test after each calculator migration.
- Defer heavy gates to post-migration checkpoint.

## Master Calculator Checklist
| Order | Calculator ID | Route | Status | Unit Test |
|---|---|---|---|---|
| 1 | `present-value` | `/finance-calculators/present-value-calculator/` | Completed | Passed |
| 2 | `future-value` | `/finance-calculators/future-value-calculator/` | Completed | Passed |
| 3 | `present-value-of-annuity` | `/finance-calculators/present-value-of-annuity-calculator/` | Completed | Passed |
| 4 | `future-value-of-annuity` | `/finance-calculators/future-value-of-annuity-calculator/` | Completed | Passed |
| 5 | `simple-interest` | `/finance-calculators/simple-interest-calculator/` | Completed | Passed |
| 6 | `compound-interest` | `/finance-calculators/compound-interest-calculator/` | Completed | Passed |
| 7 | `effective-annual-rate` | `/finance-calculators/effective-annual-rate-calculator/` | Completed | Passed |
| 8 | `investment-growth` | `/finance-calculators/investment-growth-calculator/` | Completed | Passed |
| 9 | `investment-return` | `/finance-calculators/investment-return-calculator/` | Completed | Passed |
| 10 | `time-to-savings-goal` | `/finance-calculators/time-to-savings-goal-calculator/` | Completed | Skipped (spec skipped) |
| 11 | `monthly-savings-needed` | `/finance-calculators/monthly-savings-needed-calculator/` | Completed | Skipped (spec skipped) |

## Per-Calculator Execution Checklist
1. Confirm target calculator ID and route.
2. Move `index.html` and `explanation.html` into `content/calculators/finance-calculators/<slug>/`.
3. Move `module.js` into `public/assets/js/calculators/finance-calculators/<slug>/`.
4. Move `calculator.css` into `public/assets/css/calculators/finance-calculators/<slug>/`.
5. For `compound-interest`, move `ci-growth-chart.js` and update dynamic import path.
6. Regenerate scoped finance route.
7. Verify no legacy `@import` injection and no duplicate module loading.
8. Run scoped unit test for the calculator.
9. Delete legacy calculator folder under `public/calculators/finance-calculators/<slug>/`.
10. Mark checklist row as completed.

## Deferred Full-Gates Checkpoint Checklist
- [ ] Finance-scoped E2E checks.
- [ ] Finance-scoped SEO checks.
- [ ] Finance-scoped CWV checks.
- [ ] Finance-scoped schema dedupe.
- [ ] Cluster contracts/isolation checks.
- [ ] Fix and re-run until all deferred gates pass.

## Final Decommission Checklist
- [x] Remove `public/calculators/finance-calculators/` after all calculator migrations.
- [x] Confirm no `/calculators/finance-calculators/` references in finance canonical outputs and build manifests.
- [x] Add explicit `410 Gone` behavior for legacy finance URL space (`/calculators/finance-calculators/*`).
- [ ] Create final release sign-off document.
- [ ] Update `requirements/universal-rules/Release Sign-Off Master Table.md`.

## Evidence Links
- Final sign-off: `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_<ID>.md` (pending)
- Master table update: `requirements/universal-rules/Release Sign-Off Master Table.md` (pending)

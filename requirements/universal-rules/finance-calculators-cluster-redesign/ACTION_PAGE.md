# Finance Calculators Cluster Redesign Action Page

## Mission

Redesign the entire `finance` calculator family into a calm, premium, conversion-friendly light experience derived from the approved homepage direction and the shipped Credit Card, Home Loan, and Auto Loan redesigns.

Target routes:

- `/finance-calculators/present-value-calculator/`
- `/finance-calculators/future-value-calculator/`
- `/finance-calculators/present-value-of-annuity-calculator/`
- `/finance-calculators/future-value-of-annuity-calculator/`
- `/finance-calculators/effective-annual-rate-calculator/`
- `/finance-calculators/simple-interest-calculator/`
- `/finance-calculators/compound-interest-calculator/`
- `/finance-calculators/investment-growth-calculator/`
- `/finance-calculators/time-to-savings-goal-calculator/`
- `/finance-calculators/monthly-savings-needed-calculator/`
- `/finance-calculators/investment-return-calculator/`

Primary outcomes:

- remove the legacy dark shell, top nav, left nav, and ads column from migrated Finance routes
- remove Home Loan wrapper, breadcrumb, and brand-link leakage from Finance source fragments and generated output
- ship one distinct Finance light design family with calm analytical cues
- preserve calculator logic, route URLs, metadata, schema, FAQ parity, and MPA behavior
- migrate one calculator at a time with full documentation, evidence capture, and release logging

---

## Scope Contract

Target calculators:

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

Forbidden files and prefixes:

- `public/calculators/loan-calculators/**`
- `public/calculators/credit-card-calculators/**`
- `public/calculators/car-loan-calculators/**`
- `public/calculators/time-and-date/**`
- `public/calculators/percentage-calculators/**`
- `public/assets/css/theme-premium-dark.css`
- `public/assets/css/shared-calculator-ui.css`
- `public/assets/css/layout.css`
- `public/assets/js/core/mpa-nav.js`
- `public/config/navigation.json`
- `clusters/**` outside the three finance-linking nav files above
- `public/assets/core/**`

Allowed commands:

- `rg`, `find`, `sed`, `git status`
- scoped generation commands using `TARGET_ROUTE` or `TARGET_CALC_ID`
- scoped tests using `CLUSTER=finance`
- required final release gates from the redesign policy

Forbidden commands:

- destructive git commands
- full-site generation unless required for final redesign release gates
- edits outside the allowed file list without explicit scope expansion

Stop rule:

- if a fix requires files or commands outside the allowed set, stop, log the reason, and request explicit scope expansion

Out-of-scope violation rule:

- stop immediately
- revert only the agent's own out-of-scope edits
- record the root cause and corrective action in `EXECUTION_LOG.md`

---

## Locked Decisions

- [x] The homepage light design language is the visual parent system.
- [x] Credit Card, Home Loan, and Auto Loan redesigns are the documentation and delivery reference standard.
- [x] Finance routes will use a dedicated Finance cluster shell.
- [x] Finance routes will not render `top-nav`, `left-nav`, or the ads column after migration.
- [x] Finance routes will not load `theme-premium-dark.css` or rely on `shared-calculator-ui.css` after migration.
- [x] Work progresses one calculator at a time in the order defined below.
- [x] The next calculator starts only after the current calculator passes scoped build, tests, and design QA.
- [x] Finance route ownership entries will be added during this rollout.
- [x] Stale `/finance/` contract links will be corrected during this rollout.
- [x] Legacy savings-goal discoverability debt will be removed at cutover.
- [x] No per-calculator permission pauses are required during this approved rollout.
- [x] Unrelated worktree files are ignored unless they block the redesign.
- [x] Any accidental unrelated edits must be reverted immediately.
- [x] Logs are append-only and act as the anti-drift control center for the full rollout.

---

## Non-Negotiable Constraints

- Design-first, but never at the cost of broken logic, broken SEO, broken accessibility, or broken release policy.
- Preserve all calculator IDs, JS hooks, table IDs, chart IDs, CTA behavior, and route URLs unless a tracked contract change is required.
- Preserve H1, title, canonical, metadata, schema, FAQ meaning, and visible/schema parity.
- Preserve single-pane `calc_exp` behavior.
- Keep route-specific `calculator.css` files route-specific; shared Finance styling belongs in the Finance cluster stylesheet.
- Keep explanation content meaning intact; this is a design/system migration plus explanation-contract alignment, not a formula rewrite.
- Keep public navigation metadata as `designFamily: "neutral"` and `paneLayout: "single"`.
- The redesign must feel simple, premium, elegant, calm, easy to scan, mobile-friendly, SEO-safe, accessible, and conversion-friendly.
- Avoid clutter, noisy surfaces, heavy boxes, weak hierarchy, crowded FAQ sections, inconsistent spacing, and visually heavy dashboard patterns.

---

## Source Of Truth Map

### New source fragments

- `public/calculators/finance-calculators/*/index.html`
- `public/calculators/finance-calculators/*/explanation.html`
- `public/calculators/finance-calculators/*/calculator.css`
- `public/calculators/finance-calculators/*/module.js`

### Shared Finance layer

- `public/calculators/finance-calculators/shared/cluster-light.css`
- `public/calculators/finance-calculators/shared/cluster-ux.js`

### Generated outputs

- `public/finance-calculators/*/index.html`

### Transitional legacy finance sources to retire

- `content/calculators/finance-calculators/**`
- `public/assets/css/calculators/finance-calculators/**`
- `public/assets/js/calculators/finance-calculators/**`
- `public/calculators/finance/savings-goal/**`

### Generator / shell

- `scripts/generate-mpa-pages.js`

### Release tests

- `tests_specs/finance/cluster_release/*`
- `tests_specs/finance/*_release/*`

---

## Calculator Work Order

1. [x] `present-value`
2. [x] `future-value`
3. [x] `present-value-of-annuity`
4. [x] `future-value-of-annuity`
5. [x] `effective-annual-rate`
6. [x] `simple-interest`
7. [x] `compound-interest`
8. [x] `investment-growth`
9. [x] `time-to-savings-goal`
10. [x] `monthly-savings-needed`
11. [x] `investment-return`

---

## Per-Calculator Checklist

- [ ] Audit current source fragment, explanation, generated output, and tests.
- [ ] Capture baseline desktop screenshot.
- [ ] Capture baseline mobile screenshot.
- [ ] Finalize the route brief before implementation.
- [ ] Confirm no unrelated files are required.
- [ ] Apply the Finance cluster shell for this route.
- [ ] Remove Home Loan wrapper leakage and dark/neon/dashboard styling.
- [ ] Apply shared Finance light system styling.
- [ ] Add precise companion inputs for key slider-heavy fields where needed.
- [ ] Verify no `top-nav`, `left-nav`, or ad pane.
- [ ] Verify breadcrumb/schema no longer point Finance to Home Loan.
- [ ] Verify calculator remains single-flow and MPA-safe.
- [ ] Verify result hierarchy is answer-first and readable above the fold.
- [ ] Verify explanation order uses `How to Guide`, FAQ, and Important Notes.
- [ ] Verify `Important Notes` includes `Last updated`, `Accuracy`, disclaimer, `Assumptions`, and the exact privacy line.
- [ ] Verify table title and toggle contract on desktop and mobile.
- [ ] Verify table viewport, sticky header, and no page-level overflow.
- [ ] Verify graph readability, sizing, legend clarity, and data-integrity contract.
- [ ] Regenerate or rebuild the route.
- [ ] Run scoped unit gate.
- [ ] Run scoped E2E gate.
- [ ] Run scoped SEO gate.
- [ ] Run scoped CWV gate.
- [ ] Run scoped schema dedupe gate.
- [ ] Run required scoped contract/isolation checks.
- [ ] Capture final desktop screenshot.
- [ ] Capture final mobile screenshot.
- [ ] Record evidence and deltas in `EXECUTION_LOG.md`.
- [ ] Mark route complete here.

---

## Gate Status

| Route | Status | Build | Unit | E2E | SEO | CWV | Schema | Design QA |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `present-value` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `future-value` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `present-value-of-annuity` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `future-value-of-annuity` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `effective-annual-rate` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `simple-interest` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `compound-interest` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `investment-growth` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `time-to-savings-goal` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `monthly-savings-needed` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `investment-return` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |

---

## Cluster Final Checklist

- [x] All 11 routes completed in order.
- [x] All redesign logs updated with final route status.
- [x] Shared Finance shell is active for every target route.
- [x] Placeholder tests replaced for `time-to-savings-goal` and `monthly-savings-needed`.
- [x] Finance ownership and stale URL contracts are corrected.
- [ ] Legacy finance sources removed after cutover.
- [x] Final cluster verification completed.
- [x] Release sign-off created.
- [x] Cluster is ready to merge.

---

## Additional Workstream

### Finance Master Improvement Audit

- Status: `Logged / Pending Audit`
- Dependency: Remaining Finance route migrations should consume this audit before further migration resumes.
- Deliverable: `requirements/universal-rules/finance-calculators-cluster-redesign/FINANCE_CALCULATORS_MASTER_IMPROVEMENT_PLAN.md`

---

## Current Progress

- Shared Finance shell, generator routing, and ownership/nav contract fixes are active across all 11 target routes.
- `compound-interest`, `investment-growth`, `time-to-savings-goal`, `monthly-savings-needed`, and `investment-return` are now complete alongside the first six Finance routes.
- Scoped finance release gates passed under the clarified cluster-redesign policy: `lint`, `test:cluster:unit`, `test:cluster:e2e`, `test:cluster:seo`, `test:cluster:cwv`, scoped schema dedupe, cluster contracts, and isolation scope.
- Finance cluster sign-off has been created and the rollout is ready to merge for the approved scope.
- Legacy finance-source cleanup remains deferred follow-up work outside this release closeout.

# Auto Loan Cluster Redesign Action Page

## Mission

Redesign the entire `auto-loans` calculator family into a calm, premium, conversion-friendly light experience derived from the approved homepage direction, the shipped Credit Card redesign, and the shipped Home Loan redesign.

Target routes:

- `/car-loan-calculators/car-loan-calculator/`
- `/car-loan-calculators/auto-loan-calculator/`
- `/car-loan-calculators/hire-purchase-calculator/`
- `/car-loan-calculators/pcp-calculator/`
- `/car-loan-calculators/car-lease-calculator/`

Primary outcomes:

- remove the legacy dark shell, top nav, left nav, and ads column from migrated Auto Loan routes
- remove Home Loan naming and visual leakage from Auto Loan source fragments
- ship one distinct Auto Loan light design family with calm automotive cues
- preserve calculator logic, route URLs, metadata, schema, FAQ parity, and MPA behavior
- migrate one calculator at a time with full documentation, evidence capture, and release logging

---

## Scope Contract

Target calculators:

- `car-loan`
- `multiple-car-loan`
- `hire-purchase`
- `pcp-calculator`
- `leasing-calculator`

Allowed files:

- `requirements/universal-rules/auto-loan-cluster-redesign/**`
- `public/calculators/car-loan-calculators/**`
- `public/car-loan-calculators/**`
- `public/calculators/car-loan-calculators/shared/**`
- `scripts/generate-mpa-pages.js`
- `config/testing/test-scope-map.json`
- `tests_specs/auto-loans/**`
- `tests_specs/loans/**` for removing or repointing old Auto Loan release coverage
- `config/clusters/route-ownership.json`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-*-AUTO-LOAN-REDESIGN.md`

Forbidden files and prefixes:

- `public/calculators/loan-calculators/**` except shared test references already covered by the test-surface split
- `public/calculators/credit-card-calculators/**`
- `public/assets/css/theme-premium-dark.css`
- `public/assets/css/shared-calculator-ui.css`
- `public/assets/css/layout.css`
- `public/assets/js/core/mpa-nav.js`
- `config/clusters/cluster-registry.json`
- `clusters/**`

Allowed commands:

- `rg`, `find`, `sed`, `git status`
- scoped generation commands using `TARGET_ROUTE` or `TARGET_CALC_ID`
- scoped tests using `CLUSTER=auto-loans`
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
- [x] Credit Card and Home Loan redesigns are the documentation and delivery reference standard.
- [x] Auto Loan routes will use a dedicated Auto Loan cluster shell.
- [x] Auto Loan routes will not render `top-nav`, `left-nav`, or the ads column after migration.
- [x] Auto Loan routes will not load `theme-premium-dark.css` or rely on `shared-calculator-ui.css` after migration.
- [x] Work progresses one calculator at a time in the order defined below.
- [x] The next calculator starts only after the current calculator passes scoped build, tests, and design QA.
- [x] Auto Loan tests will be split from the mixed `loans` release surface into a dedicated `auto-loans` release surface.
- [x] Auto Loan route ownership entries will be added during this rollout.
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
- Keep route-specific `calculator.css` files route-specific; shared Auto Loan styling belongs in the Auto Loan cluster stylesheet.
- Keep explanation content meaning intact; this is a design/system migration, not a content rewrite.
- Keep public navigation metadata as `designFamily: "auto-loans"` and `paneLayout: "single"`.
- The redesign must feel simple, premium, elegant, calm, easy to scan, mobile-friendly, SEO-safe, accessible, and conversion-friendly.
- Avoid clutter, noisy surfaces, heavy boxes, weak hierarchy, crowded FAQ sections, inconsistent spacing, and visually heavy dashboard patterns.

---

## Source Of Truth Map

### Source fragments

- `public/calculators/car-loan-calculators/*/index.html`
- `public/calculators/car-loan-calculators/*/explanation.html`
- `public/calculators/car-loan-calculators/*/calculator.css`
- `public/calculators/car-loan-calculators/*/module.js`

### Shared Auto Loan layer

- `public/calculators/car-loan-calculators/shared/cluster-light.css`
- `public/calculators/car-loan-calculators/shared/cluster-ux.js`

### Generated outputs

- `public/car-loan-calculators/*/index.html`
- route-bundle output only if emitted by regeneration

### Generator / shell

- `scripts/generate-mpa-pages.js`

### Release tests

- `tests_specs/auto-loans/cluster_release/*`
- `tests_specs/auto-loans/car-loan_release/*`
- `tests_specs/auto-loans/multiple-car-loan_release/*`
- `tests_specs/auto-loans/hire-purchase_release/*`
- `tests_specs/auto-loans/pcp-calculator_release/*`
- `tests_specs/auto-loans/leasing-calculator_release/*`

### Transitional files to retire

- `tests_specs/loans/*_release/*` for the 5 Auto Loan calculators
- Auto Loan assertions inside `tests_specs/loans/cluster_release/*`
- Auto Loan mappings inside `config/testing/test-scope-map.json`

---

## Working Rules

### Design translation rule

The Auto Loan pages should feel like children of the homepage and siblings of the best shipped redesign work, not children of the current dark shell or Home Loan UI leftovers.

That means:

- same light page atmosphere
- same premium restraint
- strong answer-first hierarchy
- cleaner table rhythm
- intentional mobile-first spacing

That does not mean:

- cloning Home Loan visuals
- leaving Home Loan class names in place
- removing explanation, FAQ, or related guidance
- changing formulas without need

### Interaction rule

The cluster interaction contract is:

- initial baseline calculation may render on load
- slider edits, mode toggles, and precise field edits update visible controls only
- recalculation after load happens only after the primary CTA click
- key money and rate controls should support precise text entry, not slider-only input

### Drift-prevention rule

No spontaneous redesign branching.

Every calculator must inherit from the same shared Auto Loan shell and design system, then layer only route-specific differences where the calculator structure genuinely requires them.

---

## Calculator Work Order

### 1. Reference route

- [ ] `car-loan`

Reason:

- simplest baseline
- strong amount-financed and amortization narrative
- best place to prove shell removal, precise entry, and shared visual language first

### 2. Comparison route

- [ ] `multiple-car-loan`

Reason:

- proves comparison hierarchy
- proves combined table logic and summary framing

### 3. Balloon route

- [ ] `hire-purchase`

Reason:

- introduces deferred payment clarity
- expands the system beyond standard amortization

### 4. Deferred-value route

- [ ] `pcp-calculator`

Reason:

- high product complexity around GFV and final payment framing
- must feel simple without hiding important cost structure

### 5. Densest route

- [ ] `leasing-calculator`

Reason:

- most structurally complex
- multiple toggles and three table modes
- best final proof that the shared system handles density cleanly

---

## Per-Calculator Checklist

Use this same checklist for each route before moving on.

### Universal checklist

- [ ] Audit current source fragment, explanation, generated output, and tests.
- [ ] Capture baseline desktop screenshot.
- [ ] Capture baseline mobile screenshot.
- [ ] Finalize the route brief before implementation.
- [ ] Confirm no unrelated files are required.
- [ ] Apply the Auto Loan cluster shell for this route.
- [ ] Remove Home Loan class leakage and dark/neon/dashboard styling.
- [ ] Apply shared Auto Loan light system styling.
- [ ] Add precise companion inputs for key money/rate fields.
- [ ] Verify no `top-nav`, `left-nav`, or ad pane.
- [ ] Verify header and footer match the Auto Loan design system.
- [ ] Verify calculator remains single-flow and MPA-safe.
- [ ] Verify result hierarchy is answer-first and readable above the fold.
- [ ] Verify table title and toggle contract on desktop and mobile.
- [ ] Verify table viewport, sticky header, and no page-level overflow.
- [ ] Verify graphs, where present, satisfy readability and data-integrity contract.
- [ ] Verify FAQ and Important Notes presentation remains consistent.
- [ ] Regenerate the route.
- [ ] Run scoped unit gate.
- [ ] Run scoped E2E gate.
- [ ] Run scoped SEO gate.
- [ ] Run scoped CWV gate.
- [ ] Run scoped schema dedupe gate.
- [ ] Run required scoped contract and isolation checks.
- [ ] Capture final desktop screenshot.
- [ ] Capture final mobile screenshot.
- [ ] Record evidence and deltas in `EXECUTION_LOG.md`.
- [ ] Mark route complete here.

### Current rollout status

- [x] Auto Loan redesign folder created
- [x] Scope contract published
- [x] Shared Auto Loan shell active in `scripts/generate-mpa-pages.js`
- [x] Dedicated `auto-loans` scoped test surface created
- [x] Route ownership entries added for all 5 Auto Loan routes
- [x] `car-loan` redesign completed
- [x] `multiple-car-loan` redesign completed
- [x] `hire-purchase` redesign completed
- [x] `pcp-calculator` redesign completed
- [x] `leasing-calculator` redesign completed
- [ ] Auto Loan cluster release verification completed
- [x] Release sign-off created

Release-gate hold:

- `npm run lint` passed.
- `npm run test` passed.
- `npm run test:e2e` surfaced unrelated failures in `credit-cards` and `finance` suites, so repo-wide approval is blocked under the scope stop rule.
- `npm run test:cwv:all`, `npm run test:iss001`, and `npm run test:schema:dedupe` were not run after that out-of-scope failure.

### `car-loan` checklist

- [x] Replace slider-only key inputs with hybrid precise entry
- [x] Keep amount-financed and amortization story readable
- [x] Remove electric slider styling and dark/glass carryover
- [x] Preserve tax, fees, deposit, and trade-in result hooks
- [x] Preserve FAQ/schema/sitemap contracts

### `multiple-car-loan` checklist

- [x] Clarify the comparison hierarchy between Loan A, Loan B, and combined answer
- [x] Keep combined payment and combined interest immediately legible
- [x] Preserve comparison table plus monthly/yearly amortization toggles
- [x] Preserve FAQ/schema/sitemap contracts

### `hire-purchase` checklist

- [x] Make balloon-payment impact obvious without clutter
- [x] Preserve term-unit toggle and amortization tables
- [x] Keep total payable and final balloon readable above the fold
- [x] Preserve FAQ/schema/sitemap contracts

### `pcp-calculator` checklist

- [x] Make GFV, final payment, and option fee hierarchy simple to scan
- [x] Preserve deposit-type and term-unit toggles
- [x] Preserve monthly/yearly/cost table modes
- [x] Preserve FAQ/schema/sitemap contracts

### `leasing-calculator` checklist

- [x] Make residual, term, money factor, and total lease cost easy to understand
- [x] Preserve residual-type and term-unit toggles
- [x] Preserve monthly/yearly/cost table modes
- [x] Reduce the current visual heaviness more than any other Auto Loan route
- [x] Preserve FAQ/schema/sitemap contracts

---

## Required Gate Matrix

### During each calculator pass

- `CLUSTER=auto-loans CALC=<calc> npm run test:calc:unit`
- `CLUSTER=auto-loans CALC=<calc> npm run test:calc:e2e`
- `CLUSTER=auto-loans CALC=<calc> npm run test:calc:seo`
- `CLUSTER=auto-loans CALC=<calc> npm run test:calc:cwv`
- `CLUSTER=auto-loans CALC=<calc> npm run test:schema:dedupe -- --scope=calc`

### Cluster regression pass

- `CLUSTER=auto-loans npm run test:cluster:unit`
- `CLUSTER=auto-loans npm run test:cluster:e2e`
- `CLUSTER=auto-loans npm run test:cluster:seo`
- `CLUSTER=auto-loans npm run test:cluster:cwv`
- `npm run test:cluster:contracts`
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope`
- `CLUSTER=auto-loans npm run test:schema:dedupe -- --scope=cluster`

### Mandatory redesign release gates

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run test:cwv:all`
- `npm run test:iss001`
- `npm run test:schema:dedupe`

---

## Risk Register

### R-001 Shell removal breaks current test assumptions

Status:

- known

Affected area:

- current Auto Loan E2E specs still assert `.top-nav`, `.left-nav`, and legacy center-column structure

Response:

- redesign shell intentionally
- update tests to the new approved shell contract
- keep route semantics and metadata intact

### R-002 Mixed `loans` release surface hides Auto Loan regressions

Status:

- known

Response:

- split Auto Loan release coverage into `tests_specs/auto-loans/**`
- remove the 5 Auto Loan routes from the mixed `loans` cluster release surface

### R-003 Generated routes drift from source fragments

Status:

- known

Response:

- edit source fragments and generator only
- regenerate outputs
- do not treat built route HTML as the sole source of truth

### R-004 Precision-entry changes introduce behavior drift

Status:

- known

Response:

- keep load-time baseline behavior
- keep button-only post-load recalculation
- expand route E2E and unit coverage where needed

### R-005 Release contracts fail because route ownership is incomplete

Status:

- known

Response:

- add all 5 Auto Loan route ownership entries during the rollout
- include rollback fields and evidence in final sign-off

---

## Execution Log

- [x] Action page created
- [x] Cluster scope mapped
- [x] Source/build/test surfaces identified
- [x] Shared design system implemented
- [x] Reference route redesigned
- [x] Remaining calculators redesigned
- [ ] Full release gates passed
- [x] Release sign-off created

---

## Final Cluster Checklist

- [x] All 5 routes completed in order.
- [x] All redesign logs updated with final route status.
- [x] Shared Auto Loan shell is active for every target route.
- [x] No target route depends on the old dark shell, top nav, left nav, or ads column.
- [x] No target route carries Home Loan naming leakage in source or built output.
- [x] Dedicated `auto-loans` scoped tests are the active release surface.
- [x] Auto Loan route ownership entries exist for all 5 routes.
- [ ] Final cluster verification and release sign-off are complete.

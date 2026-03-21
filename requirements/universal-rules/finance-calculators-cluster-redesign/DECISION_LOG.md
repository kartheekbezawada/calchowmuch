# Finance Calculators Cluster Decision Log

## D-001

Decision:

- The Finance cluster will use the homepage light design language as its visual parent system, with a Finance-specific mineral and graphite accent layer.

Reason:

- This matches the approved redesign direction while keeping the cluster distinct from Home Loan, Auto Loans, and Credit Cards.

Impact:

- Shared spacing, shell rhythm, and premium restraint can be reused.
- Finance visuals must feel analytical and calm, not generic or cloned.

---

## D-002

Decision:

- Finance routes will use a dedicated Finance cluster shell instead of the legacy calculator shell.

Reason:

- The redesign explicitly removes the old shell-heavy experience for these routes.

Impact:

- `top-nav`, `left-nav`, and the ads column will not render for migrated Finance routes.
- Finance E2E contracts must move from legacy shell selectors to Finance cluster selectors.

---

## D-003

Decision:

- Finance routes will not load `theme-premium-dark.css` or rely on `shared-calculator-ui.css` after migration.

Reason:

- Both assets carry the dark-era styling and shell assumptions the redesign is replacing.

Impact:

- Finance CSS delivery is owned by the generator and the Finance shared cluster stylesheet.

---

## D-004

Decision:

- The rollout will proceed one calculator at a time using a fixed migration order.

Reason:

- Shared shell work is required, but unfinished routes must not flip to a partially migrated state without logs and test evidence.

Impact:

- The action page and execution log remain the authoritative source of progress and completion.

---

## D-005

Decision:

- `present-value` is the reference route for the Finance redesign.

Reason:

- It is the cleanest time-value route for proving shell removal, explanation contract fixes, and the shared Finance visual system first.

Impact:

- The shared Finance shell and cluster stylesheet must prove themselves there before the remaining routes are converted.

---

## D-006

Decision:

- Finance source fragments must stop using Home Loan wrapper names as part of this rollout.

Reason:

- The current source still exposes `#calc-home-loan`, `.home-loan-ui`, Home Loan brand links, and BreadcrumbList category leakage, which makes ownership unclear and harms UX/SEO trust.

Impact:

- Route source HTML, CSS, and generated output may adopt Finance-specific or neutral cluster wrappers while preserving required IDs and hooks.

---

## D-007

Decision:

- Finance interaction will follow the stable baseline rule used in the best redesign work: initial render may show baseline results, but post-load edits do not recalculate until the primary CTA is clicked.

Reason:

- This reduces layout shift and keeps the experience deliberate and easier to reason about.

Impact:

- Route modules may sync visible controls live, but should not recompute outputs before Calculate after the initial load.
- E2E tests must explicitly validate button-only post-load recalculation.

---

## D-008

Decision:

- Slider-heavy Finance routes should use hybrid slider-plus-precise-entry controls where exact value entry improves usability.

Reason:

- Exact financial entry is a usability requirement, especially on mobile and on routes like annuities, growth, and savings planning.

Impact:

- Route HTML, CSS, and JS may introduce companion precise entry fields while preserving button-only recalculation behavior.

---

## D-009

Decision:

- Table and graph contracts from the universal requirements are part of the redesign definition, not post-hoc QA only.

Reason:

- The user asked for calm, elegant, easy-to-scan pages, and the repo already defines concrete table and graph rules that directly shape that outcome.

Impact:

- Toggle alignment, fixed table viewports, sticky headers, graph label readability, and no page-level overflow are first-class design requirements for every converted route.

---

## D-010

Decision:

- Finance route ownership entries and stale `/finance/` contract links are in scope for this rollout.

Reason:

- Current route-ownership coverage omits the Finance public routes, and several contract files still point to obsolete `/finance/` URLs.

Impact:

- Add rollback-tagged entries to `config/clusters/route-ownership.json`.
- Update cluster registry and governed nav/policy sources to the live `/finance-calculators/` routes.

---

## D-011

Decision:

- The current legacy savings-goal source and the broken homepage savings-goal link are migration debt and must be retired during this rollout.

Reason:

- The live Finance cluster already uses `time-to-savings-goal` and `monthly-savings-needed`; leaving the stale savings-goal artifact creates discoverability drift.

Impact:

- Homepage finance discoverability must be corrected.
- `public/calculators/finance/savings-goal/**` is retired at cluster cutover.

---

## D-012

Decision:

- Shared interaction polish for Finance may be centralized in a Finance-owned helper file rather than duplicated route-by-route.

Reason:

- Range-fill behavior, precise-entry sync, stale-result handling, and mobile result reveal should stay consistent across the cluster.

Impact:

- `public/calculators/finance-calculators/shared/cluster-ux.js` owns cluster interaction helpers where reuse is justified.

---

## D-013

Decision:

- Finance structured data configuration is split from the Home Loan structured data path.

Reason:

- The legacy generator had Finance calculator IDs flowing through the Home Loan schema builder, which caused BreadcrumbList position 2 and related metadata to point at Home Loan.

Impact:

- Finance routes now use a Finance-specific structured data builder with `Finance` at breadcrumb position 2.
- Home Loan schema logic remains isolated to Home Loan calculators only.

---

## D-014

Decision:

- Finance generator cutover remains opt-in until each route is fully migrated.

Reason:

- The rollout standard requires one calculator at a time, and unfinished Finance routes must not inherit the new shell until their route source, tests, and logs are ready.

Impact:

- `scripts/generate-mpa-pages.js` prefers `public/calculators/finance-calculators/**` only for routes listed in the Finance redesign opt-in set.
- Untouched Finance routes continue to render from the legacy split source until their turn in the sequence.

---

## D-015

Decision:

- The Finance cluster is paused for a master improvement audit before continuing the remaining route migrations.
- The audit covers all 11 Finance calculators, including already migrated routes and routes still pending migration.
- The audit posture is trust-first, premium, SEO-strong, and reusable across the full cluster.
- No implementation decisions from the audit are being executed at this stage; this step is documentation logging only.

Reason:

- The current rollout has established the shared Finance shell and completed six route migrations, but the cluster still needs a system-level review of design quality, search performance, conversion clarity, and technical consistency before further execution.

Impact:

- Remaining calculator migrations should consume the audit before resuming implementation.
- The finance redesign documentation pack now needs a master audit artifact to track this workstream separately from route migration.

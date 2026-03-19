# Auto Loan Cluster Decision Log

## D-001

Decision:

- The Auto Loan cluster will use the homepage light design language as its visual parent system, with an Auto Loan-specific accent and hierarchy layer.

Reason:

- This matches the approved redesign direction while keeping the cluster distinct from Home Loan and Credit Cards.

Impact:

- Shared spacing, shell rhythm, and premium restraint can be reused.
- Auto Loan visuals must feel automotive and calm, not generic or cloned.

---

## D-002

Decision:

- Auto Loan routes will use a dedicated Auto Loan cluster shell instead of the legacy calculator shell.

Reason:

- The redesign explicitly removes the old shell-heavy experience for these routes.

Impact:

- `top-nav`, `left-nav`, and the ads column will not render for migrated Auto Loan routes.
- Auto Loan E2E contracts must move from legacy shell selectors to Auto Loan cluster selectors.

---

## D-003

Decision:

- Auto Loan routes will not load `theme-premium-dark.css` or rely on `shared-calculator-ui.css` after migration.

Reason:

- Both assets carry the dark-era styling and shell assumptions the redesign is replacing.

Impact:

- Auto Loan CSS delivery is owned by the generator and the Auto Loan shared cluster stylesheet.

---

## D-004

Decision:

- The rollout will proceed one calculator at a time using an opt-in migration list.

Reason:

- Shared shell work is required, but unfinished routes must not flip to a partially migrated state.

Impact:

- The generator will only apply the new Auto Loan shell to routes marked complete in the migration list.

---

## D-005

Decision:

- `car-loan` is the reference route for the Auto Loan redesign.

Reason:

- It is the cleanest baseline for shell removal, precise entry, amortization table treatment, and answer-first hierarchy.

Impact:

- The shared Auto Loan shell and cluster stylesheet must prove themselves there before the remaining routes are converted.

---

## D-006

Decision:

- Auto Loan source fragments must stop using Home Loan wrapper names as part of this rollout.

Reason:

- The current source still exposes `#calc-home-loan` and `.home-loan-ui`, which makes ownership unclear and invites future drift.

Impact:

- Route source HTML, CSS, and JS may adopt Auto Loan-specific or neutral shared cluster wrappers while preserving required IDs and hooks.

---

## D-007

Decision:

- Auto Loan interaction will follow the same stable baseline rule used in the best redesign work: initial render may show baseline results, but post-load edits do not recalculate until the primary CTA is clicked.

Reason:

- This reduces layout shift and keeps the experience deliberate and easier to reason about.

Impact:

- Route modules may sync visible controls live, but should not recompute outputs before calculate after the initial load.
- E2E tests must explicitly validate button-only post-load recalculation.

---

## D-008

Decision:

- Key Auto Loan money and rate inputs should use hybrid slider-plus-precise-entry controls rather than slider-only controls.

Reason:

- Exact financial entry is a usability requirement, especially on mobile and on dense routes like PCP and Leasing.

Impact:

- Route source HTML, CSS, and JS may introduce companion precise entry fields while preserving button-only recalculation behavior.

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

- Auto Loan release coverage will be split from the mixed `loans` release surface into a dedicated `auto-loans` release surface during this rollout.

Reason:

- Auto Loan already exists as a distinct cluster in navigation and registry, and release evidence should map 1:1 to the cluster being redesigned.

Impact:

- Create `tests_specs/auto-loans/**`.
- Remove the 5 Auto Loan routes from the `loans` cluster release scope and keep Home Loan release coverage separate.

---

## D-011

Decision:

- Route ownership entries for all 5 Auto Loan routes are in-scope for this rollout even though cluster registry settings remain unchanged.

Reason:

- Current route-ownership coverage does not include the Auto Loan public routes, which weakens release contract evidence.

Impact:

- Add rollback-tagged entries to `config/clusters/route-ownership.json`.
- Final sign-off must cite that ownership coverage.

---

## D-012

Decision:

- Shared interaction polish for Auto Loan may be centralized in an Auto Loan-owned helper file rather than duplicated route-by-route.

Reason:

- Range-fill behavior, precise-entry sync, and mobile result reveal should stay consistent across the cluster.

Impact:

- `public/calculators/car-loan-calculators/shared/cluster-ux.js` owns cluster interaction helpers where reuse is justified.

---

## D-013

Decision:

- Legacy Auto Loan release files under `tests_specs/loans/**` are migration debt and should be removed or repointed once the dedicated `auto-loans` surface is active.

Reason:

- The redesign should leave one authoritative test surface for the cluster, not two overlapping ones.

Impact:

- Old Auto Loan release files in the `loans` tree should not remain as the active source of truth after this rollout closes.

---

## D-014

Decision:

- The Auto Loan redesign can be closed as scope-complete while final repo-wide release approval remains blocked by unrelated global gate failures outside the approved Auto Loan surface.

Reason:

- `AGENTS.md` requires stopping when mandatory global gates fail outside declared scope instead of silently editing unrelated clusters.

Impact:

- Auto Loan route and cluster evidence can be logged as complete.
- Final release sign-off must record the blocked state and cite the unrelated failing suites and artifact paths.

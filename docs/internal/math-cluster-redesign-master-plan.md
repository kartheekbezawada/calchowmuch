# Math Cluster Redesign Master Plan

Status:

- Drafted on `2026-03-25`
- Scope approved for planning only
- Purpose: log the migration plan for all math calculators that still use the legacy dark shell in either single-pane or split layouts

## Objective

Move all legacy math calculators into the shipped new design system without repeating the layout, generator, CSS, content, and release mistakes seen in earlier migrations.

This plan is intentionally documentation-first. It does not execute implementation. It exists to lock the migration order, capture prior failures, define quality rules, and create an append-only operating reference for future math waves.

---

## What Counts As New Design

For this repo, the target state is the migrated `calc_exp` single-pane shell used by shipped redesigns.

Required characteristics:

- `paneLayout=single` for the target route, but this alone does not prove redesign completion
- answer-first structure with a strong result card and calmer supporting UI
- premium light presentation, not dark-theme carryover
- unified controls, spacing, surface styling, and typography rhythm
- mobile-first stacking without broken desktop hierarchy
- MPA-safe navigation using full-page `<a href>` behavior
- explanation content that follows the required contract and ordering
- preserved calculator logic, IDs, module hooks, metadata, FAQ meaning, and schema parity
- no legacy `theme-premium-dark.css` dependency for the migrated route shell
- no legacy `top-nav` or `left-nav` shell carryover on the migrated route

Old design / legacy state means one or more of the following:

- single-pane layout that still renders the dark shell, `top-nav`, or `left-nav`
- `paneLayout=split`
- split deck with left/right pane dependence
- dark-era or heavy shell styling
- non-unified controls or route-specific chrome fighting the shared shell
- weak answer emphasis
- outdated explanation structure or writing contract drift

Important rule:

- `paneLayout=single` is a layout/config signal, not proof that a route is already on the new design

---

## Current Math Migration State

## Confirmed New-Design Math Routes

At the time of this audit, there are no confirmed math routes on the new design.

Audit finding:

- the math routes currently inspected still load the dark shell and legacy navigation pattern, including `theme-premium-dark.css`, `top-nav`, and `left-nav`
- therefore, single-pane math routes should be treated as legacy single-pane routes, not as migrated reference implementations

## Legacy Single-Pane Math Routes

These routes already use `paneLayout=single`, but they are still part of the redesign scope because they retain legacy dark-shell characteristics:

- `/math/basic/`
- `/math/fraction-calculator/`
- `/math/algebra/quadratic-equation/`
- `/math/algebra/system-of-equations/`
- `/math/algebra/polynomial-operations/`
- `/math/algebra/factoring/`
- `/math/algebra/slope-distance/`
- `/math/trigonometry/unit-circle/`
- `/math/trigonometry/triangle-solver/`
- `/math/sample-size/`

### Legacy Single-Pane Count

- Total legacy single-pane math routes: `10`

## Legacy Split Math Routes

### Trigonometry

1. `/math/trigonometry/trig-functions/`
2. `/math/trigonometry/inverse-trig/`
3. `/math/trigonometry/law-of-sines-cosines/`

### Calculus

1. `/math/calculus/derivative/`
2. `/math/calculus/integral/`
3. `/math/calculus/limit/`
4. `/math/calculus/series-convergence/`
5. `/math/calculus/critical-points/`

### Log

1. `/math/log/natural-log/`
2. `/math/log/common-log/`
3. `/math/log/log-properties/`
4. `/math/log/exponential-equations/`
5. `/math/log/log-scale/`

### Statistics / Probability

1. `/math/mean-median-mode-range/`
2. `/math/standard-deviation/`
3. `/math/statistics/`
4. `/math/confidence-interval/`
5. `/math/z-score/`
6. `/math/number-sequence/`
7. `/math/permutation-combination/`
8. `/math/probability/`
9. `/math/statistics/regression-analysis/`
10. `/math/statistics/anova/`
11. `/math/statistics/hypothesis-testing/`
12. `/math/statistics/correlation/`
13. `/math/statistics/distribution/`

### Remaining Count

- Total legacy split math routes: `26`
- Total math routes still needing redesign: `36`

---

## Migration Goals

1. Remove the legacy shell from all math routes, including the current single-pane legacy subset.
2. Standardize all math routes on the shipped single-pane `calc_exp` experience.
3. Preserve all calculator behavior while improving clarity, reading flow, and answer emphasis.
4. Eliminate prior migration error patterns before they recur in the larger math set.
5. Keep every wave scoped, logged, and releasable with explicit evidence.

---

## Math Design Contract

This section defines what the math redesign must mean in practice. It exists so future waves do not interpret "new design" loosely.

## 1. Design Completion Definition

A math route is redesign-complete only when all of the following are true:

- the generated page no longer depends on the legacy dark shell
- the generated page no longer renders legacy `top-nav` or `left-nav`
- the route uses the approved answer-first single-pane shell
- result hierarchy, controls, typography, and supporting detail match the math design contract below
- the route passes design QA in generated output, not only in source fragments

`paneLayout=single` by itself is not redesign proof.

## 2. Visual Reference Rule

Until the first math route ships on the new design, math should borrow its quality bar from the approved light redesign families already shipped elsewhere in the repo.

Use those families as references for:

- calm surface treatment
- reduced chrome
- answer-first hierarchy
- spacing rhythm
- mobile stacking quality

Do not copy another cluster mechanically. Math needs its own shell decisions for dense notation, tables, graphs, and derivation-heavy outputs.

## 3. Shell Rules

Every migrated math route must follow these shell rules:

- no `theme-premium-dark.css` dependency for the route shell
- no legacy `top-nav`
- no legacy `left-nav`
- no legacy shell framing that keeps the route visually tied to the old dark calculator chrome
- one unified math redesign shell across the cluster unless a real functional exception is documented

## 4. Result-First Hierarchy

The first screen should answer the user’s question as early as the route allows.

Required hierarchy:

- primary result or result summary appears before deep supporting detail
- controls are easy to scan before interaction
- derivations, tables, graphs, and extra interpretation follow the main result rather than competing equally with it
- routes with multiple outputs should still present one obvious top-level answer summary

## 5. Desktop And Mobile Layout Rules

Desktop:

- preserve a clear answer-first hierarchy
- avoid overly heavy card stacks and fragmented panes
- do not reintroduce split-deck thinking inside a single-page shell

Mobile:

- collapse to one clear vertical flow
- no awkward sticky result behavior
- no horizontal overflow for equations, tables, or graphs
- controls, labels, and outputs must stay readable without zooming

## 6. Math-Specific Component Rules

The shell must support dense mathematical interfaces without losing clarity.

Components that need explicit treatment:

- expression input blocks
- coordinate and multi-field numeric inputs
- mode toggles and solver-type switches
- result summary cards
- derivation or explanation panels
- graphs and plotted output regions
- statistics tables and distribution summaries
- copy, share, reset, export, and secondary action surfaces

Component rule:

- the main answer must remain visually dominant even when the route contains graphs, tables, or derivation detail

## 7. Typography And Notation Rules

Math routes must remain readable under dense notation.

Required behavior:

- symbols, superscripts, fractions, and formula text remain legible on desktop and mobile
- long formulas wrap or scroll safely without breaking layout
- labels stay understandable even when notation is compact
- result text should feel precise, not decorative

## 8. Writing Style Rules

Math writing must be:

- direct
- instructional
- route-specific
- technically correct

Math writing must not become:

- generic marketing copy
- filler-heavy explanation text
- textbook-style over-explaining when the route intent is narrow
- repetitive copy pasted across similar routes without adaptation

## 9. Explanation Contract Tie-In

The content contract remains part of the design contract.

Required:

- intent-led `H2`
- `How to Guide`
- `FAQ`
- `Important Notes` as the final section
- exact note-key and privacy requirements already defined in this plan and checklist

## 10. Exception Rule

Any route that needs to diverge from the shared math redesign shell must log:

- the exact functional reason
- the minimum exception required
- the components affected
- why the shared shell could not handle the route safely

No exception should be made only for preference or stylistic experimentation.

## 11. Design QA Acceptance Criteria

No route is design-complete unless QA confirms:

- legacy shell markers are gone
- the main answer is obvious
- notation remains readable
- tables and graphs remain usable
- mobile layout is stable
- route-specific complexity does not overwhelm the first-screen hierarchy

## 12. Evidence Rule

Each redesign wave should capture:

- baseline visual evidence
- final visual evidence
- short notes on what changed visually and why

This keeps design review grounded in observable changes rather than subjective memory.

---

## Non-Negotiable Invariants

- No SPA behavior. All calculator navigation must remain MPA-safe.
- No logic regression. Migration is visual/systemic unless a route has a known runtime defect that blocks release.
- Preserve IDs, JS hooks, table IDs, chart IDs, export/share hooks, and DOM anchors unless a scoped contract change is approved.
- Preserve H1, title, canonical, route URL, metadata intent, and schema parity.
- Preserve FAQ meaning and visible/schema parity.
- Preserve `calc_exp` single-pane behavior on touched routes.
- Regenerate only the target route unless approved shared files are part of scope.
- Keep logs append-only.

---

## Logged Prior Migration Issues And Anti-Repeat Rules

This section is the main anti-regression ledger. Future math waves should treat every item below as a pre-flight warning.

## A. Generator And Scope Mistakes

### Issue A1: scoped commands reused stale terminal env vars

Observed pattern:

- scoped generator or test commands picked up old `TARGET_CALC_ID`, `TARGET_ROUTE`, `CLUSTER`, or `CALC` values from the shared shell

Rule:

- before each route change, explicitly clear or reset scope env vars
- never assume the terminal is clean

Prevention:

- log the exact scope vars used for the route before generation and tests

### Issue A2: migrated route registration was incomplete

Observed pattern:

- a route looked partially migrated, but generator or rollout config still pointed to legacy behavior
- previous percentage migration required both redesign ID registration and order registration

Rule:

- every math migration wave must verify all generator/config hooks needed for the route are updated together
- do not treat a route HTML edit as sufficient proof of migration

Prevention:

- include a generator/config verification step in the checklist before route generation

### Issue A3: scope quietly widened into shared files

Observed pattern:

- a route migration started as route-only, then drifted into generator, shared CSS, or contract changes without explicit logging

Rule:

- if shared files are needed, log them as shared-scope changes before editing
- if out-of-scope failures appear, stop and re-scope instead of silently broadening work

---

## B. CSS And Layout Failures

### Issue B0: `paneLayout=single` was incorrectly treated as redesign proof

Observed pattern:

- some math routes were assumed to be migrated because navigation config showed `paneLayout=single`
- audit of generated route output showed those pages still load `theme-premium-dark.css` and render legacy `top-nav` and `left-nav`

Rule:

- a math route is not considered migrated until the generated page itself drops legacy dark-shell dependencies and matches the approved new-design shell

Prevention:

- classify every route using the generated HTML and active shell markers, not config alone

### Issue B1: duplicated or concatenated CSS blocks corrupted routes

Observed pattern:

- prior redesign passes left duplicated route CSS blocks inside route stylesheets
- patching on top of corrupted CSS made the route less stable

Rule:

- if a math route stylesheet is already corrupted, rebuild the route stylesheet cleanly around preserved module hooks instead of stacking more patches onto damaged CSS

Prevention:

- inspect the full route stylesheet before migration
- prefer a full route-level stylesheet rewrite when corruption is obvious

### Issue B2: legacy shell chrome leaked back in

Observed pattern:

- old dark shell pieces, heavy borders, or split-deck assumptions reappeared after partial migration

Rule:

- migrated math routes must not reintroduce dark-era styling, split-shell chrome, or unrelated legacy surfaces

Prevention:

- design QA must explicitly verify absence of split-shell visual artifacts

### Issue B3: desktop/mobile hierarchy diverged

Observed pattern:

- some legacy layouts worked on desktop but collapsed badly on mobile, or sticky/result behavior became awkward on small screens

Rule:

- desktop should keep answer-first hierarchy; mobile should collapse to a clean single-column flow without sticky-card awkwardness or clipped controls

Prevention:

- every route needs desktop and mobile visual QA before release

### Issue B4: route-specific shells fought the shared migrated design

Observed pattern:

- old route-specific styling overpowered the shared shell and created inconsistent controls and spacing

Rule:

- shared math shell decisions must win over legacy route chrome
- route-specific CSS should only remain where the calculator truly needs unique functional presentation

---

## C. Runtime And Module Contract Failures

### Issue C1: layout changes broke module bindings

Observed pattern:

- moving UI pieces without preserving IDs/classes broke calculator logic or actions

Rule:

- preserve module-facing IDs, classes, data attributes, and action targets
- only move structure if the module relies on IDs rather than parent shape

Prevention:

- audit module queries before moving result, share, graph, or export surfaces

### Issue C2: some routes were route-source reconstruction cases, not simple shell swaps

Observed pattern:

- source fragments did not match the actual route behavior; a simple shell swap was not enough

Rule:

- classify each math route before migration:
  - simple shell migration
  - shell migration plus explanation rewrite
  - route-source reconstruction

Prevention:

- verify source fragments against module behavior and tests before committing to the route plan

### Issue C3: known runtime defects blocked migration flow

Observed pattern:

- algebra wave documentation already logged a runtime conflict on `quadratic-equation`

Rule:

- if a route has a blocking runtime bug, fix the root issue first, then continue the design migration

Prevention:

- run the route manually before polishing CSS

---

## D. Writing And Explanation Contract Failures

### Issue D1: explanation structure drifted from repo contract

Observed pattern:

- old or rewritten explanation blocks failed the required heading order or note structure

Rule:

- every migrated math route must keep the required explanation order:
  - intent-led `H2`
  - `How to Guide`
  - `FAQ`
  - `Important Notes` last

Prevention:

- validate heading order before SEO tests

### Issue D2: important note keys became inconsistent

Observed pattern:

- prior migrations needed exact note keys and exact privacy copy to satisfy content-quality rules

Rule:

- `Important Notes` must include:
  - `Last updated: <Month YYYY>`
  - `Accuracy`
  - `Disclaimer` or domain-equivalent approved label
  - `Assumptions`
  - exact privacy sentence: `All calculations run locally in your browser - no data is stored.`

Prevention:

- use a copy checklist instead of rewriting notes from memory

### Issue D3: writing became generic, verbose, or stylistically uneven

Observed pattern:

- some older calculator pages had weak result emphasis, stale explanation structure, or generic writing tone that did not fit the migrated product style

Rule:

- math writing should be direct, precise, and instructional
- avoid filler, vague marketing phrases, and repetitive explanation copy
- do not over-explain obvious algebra/calculus basics when the calculator intent is narrower

Prevention:

- write to the exact route intent
- keep examples concrete and inputs/output focused

### Issue D4: FAQ and visible/schema parity drifted

Observed pattern:

- redesign work sometimes updated visible FAQ structure without verifying schema parity

Rule:

- visible FAQ content and structured FAQ output must remain aligned

---

## E. QA, Validation, And Release Failures

### Issue E1: routes were visually improved before full route regeneration

Observed pattern:

- source looked updated but the public route was not regenerated or not verified after regeneration

Rule:

- regenerate the target route after each meaningful migration pass and verify the published output, not only the source fragment

### Issue E2: tests were deferred too long

Observed pattern:

- some redesign notes explicitly deferred tests, which is acceptable for design exploration but not for release-ready migration

Rule:

- math route migrations must be considered incomplete until scoped lint, unit, e2e, SEO, CWV, schema, and contract checks are recorded as applicable

### Issue E3: release evidence was fragmented

Observed pattern:

- status, sign-off, artifacts, and scope proof were not always centralized early enough

Rule:

- every wave must end with a single logged status update containing route, scope, commands, results, artifacts, and follow-ups

---

## Route Classification Before Execution

Before any implementation wave starts, each target route should be classified into one of these buckets:

### Type 1: straight shell migration

- layout is legacy split
- module contracts are simple
- explanation rewrite is moderate

### Type 2: shell migration plus content/test cleanup

- layout migration is straightforward
- explanation/test assets are outdated or placeholder quality

### Type 3: reconstruction route

- source fragments are incomplete, stale, or structurally inconsistent with the live module/test expectations
- route needs planned rebuild rather than incremental shell swaps

No route should enter implementation before this classification is logged.

---

## Recommended Wave Plan

The migration should proceed in domain-based waves so visual patterns, content conventions, and testing heuristics can be reused with minimal drift.

## Wave 0: Shared Baseline And Route Classification Lock

Purpose:

- verify all 36 math routes and classify each as legacy single-pane or legacy split
- confirm there are no current math routes that qualify as new-design references
- create per-route classification notes before implementation starts
- confirm shared shell strategy before touching high-count statistics pages

Deliverables:

- route inventory locked
- route classifications logged
- math-specific shared design decisions locked
- checklist copied for active use

## Wave 1: Simple Foundation Routes

Routes:

1. `basic`
2. `fraction-calculator`

Why first:

- smallest route group
- already single-pane, so the first wave can focus on replacing the legacy dark shell and navigation chrome without split-layout conversion noise
- useful for proving the math redesign shell on low-risk calculators before the larger domain waves

Wave exit criteria:

- both routes no longer load the legacy dark shell
- both routes preserve calculator behavior after shell replacement
- the first approved math redesign shell is stable enough to reuse

## Wave 2: Algebra Suite

Routes:

1. `quadratic-equation`
2. `system-of-equations`
3. `polynomial-operations`
4. `factoring`
5. `slope-distance`

Why next:

- already single-pane in config, but still legacy in generated output
- grouped domain with prior internal wave history, making it easier to reuse technical understanding while replacing the shell
- good point to validate that existing algebra release notes are not mistaken for redesign completion

Wave exit criteria:

- all five routes are on the new shell rather than only `paneLayout=single`
- answer/result hierarchy is consistent across the algebra family
- no legacy shell markers remain in generated output

## Wave 3: Trigonometry Suite

Routes:

1. `unit-circle`
2. `triangle-solver`
3. `trig-functions`
4. `inverse-trig`
5. `law-of-sines-cosines`

Why here:

- combines two legacy single-pane routes with three split legacy routes in one coherent domain wave
- allows shared trigonometry navigation, graphing, and triangle-input concerns to be handled together

Wave exit criteria:

- all five trigonometry routes share one consistent new shell
- graph, function, and triangle-entry surfaces remain usable on mobile and desktop

## Wave 4: Calculus Suite

Routes:

1. `derivative`
2. `integral`
3. `limit`
4. `series-convergence`
5. `critical-points`

Why grouped:

- shared expression-entry and symbolic-result patterns
- lets calculus-specific layout rules settle in one wave instead of splitting the same UX problems across multiple passes

Wave exit criteria:

- expression-entry remains legible
- answer emphasis improves without hiding key derivation or interpretation detail

## Wave 5: Log Cluster

Routes:

1. `natural-log`
2. `common-log`
3. `log-properties`
4. `exponential-equations`
5. `log-scale`

Why grouped:

- close visual and instructional similarity
- shared content rules can be reused across all five routes

Wave exit criteria:

- consistent formula-entry and result-readout treatment across the full log set
- no explanation drift between similar routes

## Wave 6: Statistics Core

Routes:

1. `mean-median-mode-range`
2. `standard-deviation`
3. `statistics`
4. `confidence-interval`
5. `z-score`
6. `sample-size`

Why before the rest of statistics:

- strongest shared input/result conventions
- lower complexity than model-based and multi-output statistics routes
- includes `sample-size`, which is currently single-pane legacy rather than truly migrated

Wave exit criteria:

- input tables and summary outputs feel unified
- descriptive-statistics writing tone is consistent and concise

## Wave 7: Counting And Probability

Routes:

1. `number-sequence`
2. `permutation-combination`
3. `probability`

Why separate:

- mixed UX patterns but still smaller than the advanced statistics set
- useful checkpoint before the heaviest data-analysis routes

Wave exit criteria:

- sequence/combinatorics/probability controls remain understandable on mobile

## Wave 8: Advanced Statistics

Routes:

1. `regression-analysis`
2. `anova`
3. `hypothesis-testing`
4. `correlation`
5. `distribution`

Why last:

- most likely to include tables, graphs, larger result sets, and explanation risk
- highest chance of route-specific exceptions or reconstruction work

Wave exit criteria:

- complex outputs remain readable inside the single-pane shell
- chart/table/summary blocks do not regress module behavior or overwhelm mobile layouts

---

## Per-Route Implementation Sequence

For each route in a wave, the work order should be:

1. Confirm route classification and exact allowed files.
2. Inspect module bindings, IDs, graph/table hooks, and export/share hooks.
3. Remove or replace legacy split-shell dependencies.
4. Convert route to single-pane layout.
5. Rebuild or normalize route CSS if corruption or duplication exists.
6. Improve answer-first hierarchy without reducing mathematical clarity.
7. Rewrite explanation content to contract.
8. Verify FAQ parity and note keys.
9. Regenerate only the target route.
10. Run scoped validation.
11. Log issues, artifacts, and follow-ups before moving to the next route.

---

## Writing Standards For Math Routes

- Lead with the problem the calculator solves, not generic textbook theory.
- Use direct instructional language.
- Keep examples short and route-specific.
- Do not use inflated marketing phrasing.
- Avoid repeating the same explanation pattern word-for-word across similar routes.
- Explain assumptions where the calculator simplifies real math/statistics workflows.
- Preserve technical correctness, especially for advanced statistics and calculus routes.
- Keep `Important Notes` structured and exact.

---

## Design QA Standards For Math Routes

- the primary answer must be visually obvious within the first screen when feasible
- math-expression input areas must remain readable and not cramped
- tables, graphs, and derivation/result sections must not compete equally for emphasis
- controls must feel unified across the cluster
- no dark-theme leftovers or split-pane artifacts may remain
- mobile layout must be fully usable without horizontal overflow
- answer cards must not become awkwardly sticky on small screens
- advanced routes may show more detail, but only after the main result is clear

---

## Test And Validation Expectations

Per route, expect the same scoped release pattern already used for shipped math algebra routes unless an approved release-mode change says otherwise.

Minimum expectations:

1. lint
2. scoped unit
3. scoped e2e
4. scoped SEO
5. scoped CWV
6. schema dedupe where applicable
7. isolation/contracts when shared files change

Every failure must be classified as one of:

- in-scope route defect
- approved shared-scope requirement
- unrelated baseline blocker requiring explicit escalation

---

## Logging Requirements

Each completed route or wave log should record:

- route name and URL
- route classification type
- allowed files and any approved shared files
- design issues found
- writing/content issues found
- runtime or module issues found
- fixes applied
- commands run
- artifacts produced
- open follow-ups
- release/sign-off reference when implementation occurs

Recommended append-only log headings for future updates:

1. Scope
2. Issues Found
3. Fixes Applied
4. Validation
5. Artifacts
6. Follow-Ups

---

## Definition Of Done

A math route migration is only done when all of the following are true:

- route is on the single-pane migrated shell
- no split-shell visual artifacts remain
- module behavior is intact
- explanation contract passes review
- note keys and privacy statement are exact
- mobile and desktop layouts both pass manual QA
- scoped validation has been run and logged
- issues and follow-ups are appended to the migration log

---

## Immediate Next Documentation Steps

1. Use the companion checklist in `docs/internal/math-cluster-migration-checklist.md` for every future route wave.
2. Use `docs/internal/math-cluster-wave-tracker.md` as the route-by-route execution ledger with status, owner, blockers, and wave progress.
3. When implementation begins, append route classifications and wave status entries instead of replacing this plan.
4. Treat this document as the anti-repeat source of truth for math migration work.

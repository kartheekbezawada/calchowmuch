# Math Cluster Redesign Master Plan

Status:

- Updated on `2026-03-26`
- Execution complete
- Purpose: govern the end-to-end migration of all 36 math calculators from legacy dark-shell delivery to redesign-complete state

## Program Summary

- Objective: migrate all 36 `/math/` routes to true redesign-complete state and onboard math from `legacy-shared` to governed math-cluster ownership with low regression risk.
- Program rule: `release passed` is historical release evidence only. It does not count as redesign completion.
- Completion truth: all 36 math routes are now redesign-complete, all `/math/` routes are cluster-owned by `math`, and the math cluster is ready to move from `migrating` to `isolated`.
- Program phases: `0A baseline`, `0B audit lock`, `1 pilot`, `2 stabilize`, `3-9 scale`, `10 final cleanup`.

## Authority And Context Refresh Protocol

Priority order:

1. `requirements/math-migration/MATH_MIGRATION_EXECUTION_CARD.md`
2. this master plan and `docs/internal/math-cluster-wave-tracker.md`
3. repo patterns and shipped redesign references
4. engineering judgment

Context refresh rules:

- The execution card is the highest authority for math migration execution.
- The execution card must be re-read before starting work.
- The execution card must be re-read after every `2-3` completed routes.
- The execution card must be re-read whenever switching waves.
- If uncertainty, ambiguity, or process drift is detected, reload the execution card immediately before continuing.

Execution pacing rule:

- Work one calculator at a time inside a wave.
- Do not start the next calculator until the current calculator fully passes Engineering, Design, SEO, and CWV gates.
- A wave may list `3-5` routes, but active implementation is strictly sequential.
- Once the current calculator is fully complete, continue directly to the next approved calculator without waiting for additional HUMAN permission.
- Only stop the sequence for a real blocker: failed gate, scope-breaking conflict, or evidence that the route must be reclassified as `type-3`.

## Non-Negotiable Definition Of Done

A route is `redesign-complete` only if all four gate groups pass.

### Engineering

- `calc_exp` route renders as single-pane in generated output.
- Light answer-first shell is present in generated output.
- No legacy dark markers remain: `theme-premium-dark.css`, legacy top nav, legacy left nav, legacy split-shell chrome.
- MPA `<a href>` navigation is preserved.
- Logic, hooks, IDs, schema intent, and calculator behavior are unchanged.
- Verification is based on generated HTML under `public/math/**/index.html`, not config alone.

### Design

- Design principle is `Simple Smooth Wow`.
- Clear hierarchy is enforced: primary answer -> secondary guidance -> advanced detail.
- No duplicate controls, no competing result blocks, no decorative noise.
- Advanced options are collapsed by default where density would otherwise clutter first screen.
- First screen is usable without scrolling on desktop and mobile.
- CLS-safe layout: no late shifts, no unstable card expansion, no awkward sticky-result behavior.

### SEO / Content

- 40-60 word snippet intro appears in static HTML directly under the intent-led `H2`.
- One scannable quick-answer structure appears early: bullets or a small table.
- Formula section exists when the route has a meaningful formula.
- Worked example exists.
- Visible FAQs exist in HTML.
- Internal links to related calculators exist.
- Static HTML contains JSON-LD for `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList`.
- Content is simple, human-readable, route-specific, and non-academic.

### CWV

- CLS `<= 0.10`.
- No late layout shifts after load or after calculate.
- No avoidable render-blocking issues that break first-screen usability.

Final rule:

- If Engineering fails, the route is not complete.
- If Design fails, the route is not complete.
- If SEO fails, the route is not complete.
- If CWV fails, the route is not complete.

## Source-Of-Truth Rules

1. Governance order is `UNIVERSAL_REQUIREMENTS -> AGENTS -> RELEASE_CHECKLIST -> MATH_MIGRATION_EXECUTION_CARD -> math migration docs -> generated output`.
2. Generated route HTML is redesign proof. Navigation/config only provides intended state.
3. Route inventory comes from `docs/internal/route-planner.md` and `docs/route-planner.csv`.
4. Route archetype and pane intent come from `public/config/navigation.json`.
5. Ownership state comes from `config/clusters/cluster-registry.json` and `config/clusters/route-ownership.json`.
6. Public discoverability proof comes from `public/sitemap.xml` and homepage-search contracts.
7. Logs and trackers are append-only.
8. No assumption is allowed where generated output or repo contracts can answer the question.

## Inventory Model And Exact Status Taxonomy

Each route row must carry these exact fields.

- `route`
- `calculatorId`
- `ownerState`: `legacy-shared` | `cluster-owned:math`
- `layoutState`: `legacy-single-dark` | `legacy-split-dark` | `redesign-complete`
- `migrationType`: `type-1` | `type-2` | `type-3`
- `auditStatus`: `not-audited` | `audited`
- `migrationStatus`: `planned` | `scope-approved` | `in-progress` | `blocked` | `qa-review` | `redesign-complete`
- `releaseStatus`: `not-run` | `release-passed-only` | `admin-approved`
- `engineeringGate`: `pending` | `pass` | `fail`
- `designGate`: `pending` | `pass` | `fail`
- `seoGate`: `pending` | `pass` | `fail`
- `cwvGate`: `pending` | `pass` | `fail`
- `wave`
- `owner`
- `allowedFiles`
- `approvedSharedFiles`
- `evidencePaths`
- `releaseId`
- `commitSha`
- `blockers`
- `notes`

Rules:

- `release-passed-only` is required for any route with historical sign-off but missing redesign proof.
- `redesign-complete` is valid only when all four gates are `pass`.
- If any one gate is `fail`, the route is not complete and the wave does not proceed.

## Program Structure And Wave Strategy

### Wave 0A: Math Cluster Baseline

- Create math-cluster governance baseline so math can migrate under contracts instead of remaining purely legacy-shared.
- Deliver math cluster config scaffolding, ownership model, nav/asset-manifest plan, and isolation/contract validation path.
- No route is counted complete in this wave.

### Wave 0B: Route Audit Lock

- Audit all 36 generated math routes.
- Confirm `10 single / 26 split`.
- Confirm actual legacy markers in generated output.
- Assign `type-1`, `type-2`, or `type-3` to every route.
- Mark prior algebra releases as `release-passed-only` unless generated-output proof says otherwise.

### Wave 1: Pilot

Routes:

- `basic`
- `fraction-calculator`
- `sample-size`

Rules:

- Pilot wave is approved as a three-route wave.
- Execution remains one calculator at a time.
- `basic` is the first active route.
- `fraction-calculator` does not start until `basic` is fully complete.
- `sample-size` does not start until `fraction-calculator` is fully complete.

Pilot exit:

- all three routes pass all four gate groups
- shared math shell decisions are stable
- no repeatable migration mistake remains unresolved

### Wave 2: Stabilize

- No new route starts until pilot findings are folded into checklist, templates, tracker language, and the execution card if needed.
- If any pilot regression or ambiguity exists, stop and fix process before scaling.

### Scale Waves

- Wave 3: `quadratic-equation`, `slope-distance`, `factoring`, `polynomial-operations`, `system-of-equations`
- Wave 4: `unit-circle`, `triangle-solver`, `trig-functions`, `inverse-trig`, `law-of-sines-cosines`
- Wave 5: `natural-log`, `common-log`, `log-properties`, `exponential-equations`, `log-scale`
- Wave 6: `derivative`, `integral`, `limit`, `critical-points`, `series-convergence`
- Wave 7: `mean-median-mode-range`, `standard-deviation`, `z-score`, `confidence-interval`
- Wave 8: `number-sequence`, `permutation-combination`, `probability`
- Wave 9: `statistics`, `correlation`, `regression-analysis`
- Wave 10: `distribution`, `anova`, `hypothesis-testing`

### Final Cleanup

- Finish any remaining ownership migration.
- Align trackers, sign-offs, route inventory, and cluster contracts.
- Flip math cluster to fully governed end-state only after all 36 routes are redesign-complete.

## Per-Route Execution Flow

1. Re-read the execution card if required by the context refresh protocol.
2. Inspect generated HTML output.
3. Inspect logic, hooks, IDs, and schema.
4. Inspect layout and CSS; explicitly detect legacy markers.
5. Inspect design quality: clutter, hierarchy, first-screen usability, duplicate UI, advanced-option sprawl.
6. Inspect SEO/content quality: thin content, missing snippet intro, missing formula/example/FAQ/internal links/schema.
7. Classify route as `type-1`, `type-2`, or `type-3`.
8. Apply only the required route changes:
   - fix shell
   - fix design
   - fix content only where needed
9. Validate parity:
   - logic unchanged
   - layout correct
   - content structure complete
10. Run checks:
   - engineering
   - design
   - SEO
   - CWV
11. Capture evidence.
12. Update tracker.
13. Do not proceed to the next route unless the current route fully passes.

## Per-Route Workflow Rules

- Publish scope and file intent in the active wave log before editing.
- Clear scoped env vars before generation/tests.
- Inspect module selectors before moving any DOM.
- Never trust config alone.
- Never rewrite business logic unless a blocking bug is already proven.
- Never break IDs/hooks.
- Never expand scope silently.
- Never inject schema via JS.
- Never keep thin content.
- Never leave legacy CSS or legacy shell markers behind.

## Documentation And Tracker Design

- Strategic source: `docs/internal/math-cluster-redesign-master-plan.md`
- Execution ledger: `docs/internal/math-cluster-wave-tracker.md`
- Reusable checklist: `docs/internal/math-cluster-migration-checklist.md`
- Highest execution authority: `requirements/math-migration/MATH_MIGRATION_EXECUTION_CARD.md`
- Inventory source: `docs/internal/route-planner.md` plus `docs/route-planner.csv`
- Release evidence: `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_<ID>.md`

Tracker rules:

- update route row first, then wave row
- maintain separate `migrationStatus` and `releaseStatus`
- store exact evidence paths
- do not delete resolved blocker history; replace with short outcome note
- append deltas only

## Minimal Templates

### Route Audit

```md
- Route:
- Layout: split | single
- Legacy markers:
- Design issues:
- SEO issues:
- Logic risk:
- Type: 1 | 2 | 3
- Notes:
```

### Wave Checklist

```md
- Routes:
- Approved scope:
- Migration done:
- Engineering pass:
- Design pass:
- SEO pass:
- CWV pass:
- Evidence:
- Status:
```

## Top 10 Mistakes To Avoid

1. Trusting config alone instead of generated output.
2. Treating `release passed` as `redesign complete`.
3. Leaving `theme-premium-dark.css` or old nav in generated HTML.
4. Preserving split-shell behavior on a touched `calc_exp` route.
5. Breaking hooks or IDs during layout cleanup.
6. Keeping duplicate or corrupted CSS instead of normalizing it.
7. Shipping thin content without snippet intro, example, FAQs, links, and static schema.
8. Injecting JSON-LD at runtime instead of shipping it in static HTML.
9. Advancing to the next route before the current route fully passes.
10. Ignoring CLS and first-screen usability while chasing visual polish.

# Cluster Isolation Migration Plan
## 95/5 Hybrid Model (Rule Reuse, Not Runtime File Reuse)

## Document Metadata
- Status: Planning baseline (implementation-ready)
- Scope: All calculator clusters across public routes
- Target Duration: 2 to 4 weeks
- Architecture Decision: 7 isolated clusters + tiny immutable shared core
- URL Policy: Keep existing public URLs unchanged

## 1) Problem Statement
Over multiple changes, we observed a repeating failure pattern:
1. A single shared shell/CSS/JS change affected many routes.
2. Rebuilding shared bundles changed hashed artifacts for unrelated routes.
3. Scoped generation occasionally left non-regenerated pages pointing to stale/deleted assets.
4. Result: header/footer/navigation regressions outside intended scope.

This is an architecture coupling issue caused by shared runtime/build ownership, not primarily a calculator module logic issue.

## 2) Why This Decision Was Taken
We are standardizing on this migration model because:
1. We need strict ownership isolation to stop cross-category breakage.
2. Universal rules must be reusable, but runtime files must be cluster-owned.
3. Absolute zero-share runtime duplication hurts cross-cluster cache reuse.
4. 95/5 hybrid gives high isolation with better customer performance than full duplication.

## 3) Decision Locks
These are final for this migration program:
1. Cluster boundary model: registry-driven clusters.
2. Build/runtime isolation: strict cluster ownership.
3. Shared runtime allowed only for immutable tiny core primitives.
4. Public URLs unchanged.
5. Visual parity required (no intentional header/footer/theme redesign during migration).
6. Rollout strategy: phased by cluster.
7. Release gates: standard gates remain active.
8. Any new cluster/category must follow this same approach by default.

## 4) Cluster Boundaries

| Cluster ID | Route Ownership |
|---|---|
| `math` | All `/math/**` |
| `home-loan` | `/loans/home-loan/`, `/loans/how-much-can-i-borrow/`, `/loans/remortgage-switching/`, `/loans/buy-to-let/`, `/loans/offset-calculator/`, `/loans/interest-rate-change-calculator/`, `/loans/loan-to-value/` |
| `credit-cards` | `/loans/credit-card-repayment-payoff/`, `/loans/credit-card-minimum-payment/`, `/loans/balance-transfer-installment-plan/`, `/loans/credit-card-consolidation/` |
| `auto-loans` | `/loans/car-loan/`, `/loans/multiple-car-loan/`, `/loans/hire-purchase/`, `/loans/pcp-calculator/`, `/loans/leasing-calculator/` |
| `finance` | All `/finance/**` |
| `time-and-date` | All `/time-and-date/**` |
| `percentage` | All `/percentage-calculators/**` |

Current calculator volume to migrate: 88 routes.

## 5) Current Shared Files Causing Coupling

| Shared Layer Today | Current File(s) |
|---|---|
| Shared layout shell | `public/layout/header.html`, `public/layout/footer.html` |
| Shared nav source | `public/config/navigation.json` |
| Shared global manifest | `public/config/asset-manifest.json` |
| Shared shell CSS | `public/assets/css/core-shell.css` |
| Shared theme/base/tokens | `public/assets/css/theme-premium-dark.css`, `public/assets/css/base.css`, `public/assets/css/core-tokens.css` |
| Shared calculator CSS | `public/assets/css/layout.css`, `public/assets/css/calculator.css`, `public/assets/css/shared-calculator-ui.css` |
| Shared shell JS | `public/assets/js/core-shell.js`, `public/assets/js/core/mpa-nav.js` |
| Shared global builders | `scripts/generate-mpa-pages.js`, `scripts/build-route-css-bundles.mjs` |

## 6) Target Architecture

## 6.1 Rule Reuse vs File Reuse
1. Universal requirements stay shared as governance rules.
2. Runtime/build files become cluster-owned.
3. No shared cluster UI/shell files after migration completion.

## 6.2 Tiny Immutable Shared Core (Allowed 5%)
Allowed shared runtime files only:
1. `public/assets/core/v1/primitives.css`
2. `public/assets/core/v1/primitives.js`

Core constraints:
1. No header/footer/nav/theme/layout ownership.
2. No cluster-specific selectors/logic.
3. Versioned immutable paths only (`/v1/`, `/v2/`), no in-place mutation.
4. Long-lived cache headers.

## 6.3 Cross-Cluster Links vs Imports
This is mandatory and explicit:
1. Allowed: cross-cluster navigation links via `<a href="...">`.
2. Prohibited: cross-cluster asset imports/references.

Examples:
- Allowed: `/loans/...` page linking to `/finance/...` as anchor navigation.
- Prohibited: `/loans/...` HTML loading `/assets/clusters/finance/...` CSS/JS.
- Prohibited: JS/CSS import from another cluster path.

## 7) Shell Contract (Cluster-Owned, Visual Parity Locked)
This contract prevents subtle drift while allowing separate implementations.

## 7.1 Required Shell Markup Hooks
Each cluster-owned shell must expose the following hooks:
1. Header root: `header.site-header[data-shell-header]`
2. Header inner: `.site-header-inner`
3. Brand logo link: `.brand-logo[data-brand-logo]`
4. Mobile toggle: `.mobile-menu-toggle[data-nav-toggle]`
5. Top nav root: `nav.top-nav[data-top-nav]`
6. Left nav root: `aside.left-nav[data-left-nav]`
7. Left nav content container: `#left-nav-content[data-left-nav-content]`
8. Footer root: `footer.site-footer[data-shell-footer]`

## 7.2 Required Interactive Hook Attributes
1. Primary nav toggle: `data-nav-toggle`
2. Subcategory toggle: `data-subcat-toggle`
3. Finance group toggle (if used): `data-fin-toggle`
4. Search input hook: `data-global-search`

## 7.3 Required ARIA Contract
1. Mobile nav toggle must have `aria-expanded`, `aria-controls`.
2. Top nav and left nav must have stable `aria-label` values.
3. Expand/collapse controls must keep `aria-expanded` synchronized.
4. Keyboard navigation and focus visibility behavior must stay parity-safe.

## 7.4 Layout Invariants (No Geometry Drift)
1. Header reserved height remains fixed per breakpoint.
2. Top nav and left nav containers must reserve stable layout space.
3. Footer reserved height remains stable.
4. Initial render must not shift shell geometry after CSS/JS hydration.

## 8) Single Source of Truth for Global Navigation Destinations
We will keep consistency without runtime file sharing:
1. Add policy-level nav spec: `policy/global-navigation-spec.json`.
2. Each cluster keeps its own `clusters/<id>/config/navigation.json`.
3. On multi-cluster nav changes, cluster nav files are updated intentionally from the policy spec.
4. CI enforces equivalence for global section destinations/labels across cluster nav files.

## 9) Build System Model (Chosen and Locked)
Chosen model: Model A (recommended).

Definition:
1. A root orchestration harness triggers cluster build commands.
2. Each cluster has its own independent generator/bundler/validator entry points.
3. Root harness is orchestration-only and does not contain cluster rendering logic.

Implication:
1. We avoid problematic shared generation logic.
2. We keep operational simplicity for CI/CD.

## 10) Asset Hashing and Retention Guarantees
To permanently prevent stale-manifest breakages:
1. Cluster assets must live under `public/assets/clusters/<clusterId>/<buildId>/...`.
2. Cluster manifest can only reference assets under its own cluster prefix (plus immutable core).
3. Assets are content-hash-addressed and immutable.
4. Old assets are retained for at least 3 releases and minimum 14 days.
5. Cleanup runs as explicit job only after manifest reachability validation across repo state.
6. Cleanup must never delete files still referenced by any active manifest.

## 11) Route-Level Isolation Fence (Generated HTML Assertion)
For each generated route HTML, validator must enforce:

Allowed asset prefixes:
1. `^/assets/core/v[0-9]+/`
2. `^/assets/clusters/<ownerClusterId>/`

Denied patterns:
1. `^/assets/clusters/(?!<ownerClusterId>/)`
2. `^/assets/css/` (legacy shared shell paths)
3. `^/assets/js/` (legacy shared shell paths)
4. Any reference to `public/layout/` content source

Outcome:
1. Route can only load owner-cluster assets + immutable core.

## 12) Concrete Repository Layout
```text
config/
  clusters/
    cluster-registry.json
    route-ownership.json
  policy/
    global-navigation-spec.json

clusters/
  <cluster-id>/
    config/
      navigation.json
      asset-manifest.json
    shell/
      header.html
      footer.html
      left-nav.html
      theme.css
      tokens.css
    assets/
      css/
      js/
    build/
      generate-pages.mjs
      build-route-css-bundles.mjs
      validate-isolation-scope.mjs
      validate-contracts.mjs

public/
  assets/
    core/
      v1/
        primitives.css
        primitives.js
    clusters/
      <cluster-id>/
        <buildId>/
          ...
```

## 13) Contracts and Schemas

## 13.1 `config/clusters/cluster-registry.json`
Required fields per cluster entry:
1. `clusterId`
2. `displayName`
3. `status` (`legacy|migrating|isolated`)
4. `routePrefixes`
5. `owners`

## 13.2 `config/clusters/route-ownership.json`
Required fields per route entry:
1. `route`
2. `calculatorId`
3. `activeOwnerClusterId`
4. `previousOwnerClusterId`
5. `rollbackTag`
6. `generationMode` (`cluster`)

## 13.3 `clusters/<id>/config/navigation.json`
Required fields:
1. `clusterId`
2. `sections[]`
3. `calculator links`
4. `global section destinations` (must match policy spec)

## 13.4 `clusters/<id>/config/asset-manifest.json`
Required fields per route entry:
1. `route`
2. `calculatorId`
3. `clusterId`
4. `css.core`
5. `css.route`
6. `css.critical`
7. `js.core`
8. `js.route`
9. `isolationBoundary`
10. `buildId`

## 14) CI Enforcement (Minimum Required)

## A) Route Ownership Enforcement
Fail when:
1. Any route appears zero times.
2. Any route appears more than once.
3. Any route entry misses `clusterId` or `calculatorId`.

## B) HTML Isolation Fence
Fail when generated HTML references:
1. Legacy shared shell assets.
2. Other cluster asset prefixes.
3. Paths outside owner cluster or immutable core.

## C) JS/CSS Import Graph Guard
Fail when:
1. Cluster JS imports outside cluster directory (except immutable core).
2. Cluster CSS `@import` or `url()` resolves outside cluster directory (except immutable core).

## D) Manifest Integrity Guard
Fail when:
1. Manifest references missing files.
2. Manifest references out-of-prefix assets.
3. Route owner cluster differs from asset cluster prefix.

## E) Global Navigation Spec Equivalence
Fail when:
1. Cluster navigation files diverge from `global-navigation-spec.json` on mandatory global destination fields.

## 15) Rollback Mechanism (Instant Operational Path)
Rollback is contract-driven, not commit-revert-driven.

Required fields in route ownership entries:
1. `activeOwnerClusterId`
2. `previousOwnerClusterId`
3. `rollbackTag`

Rollback operation:
1. Flip `activeOwnerClusterId` to `previousOwnerClusterId`.
2. Restore `rollbackTag` target build.
3. Regenerate affected cluster index/manifest only (or no-regenerate if immutable assets already present).

## 16) Migration Phases (Improved)

## Phase 0 — Program Freeze and Safety Guardrails
1. Freeze legacy shared shell changes except emergency fixes.
2. No deletion of existing shared assets before Phase 9.
3. No multi-cluster visual changes unless explicitly approved.

Exit criteria:
1. Route ownership map complete and approved.

## Phase 1 — Scaffolding + Contract Validation
1. Create cluster folder structure for all active clusters in `cluster-registry.json`.
2. Add JSON Schema files for registry/ownership/nav/manifest.
3. Add `validate-contracts.mjs` and run before any cluster build.

Exit criteria:
1. Contract validation passes for all clusters.

## Phase 2 — Build Isolation Framework
1. Add per-cluster generator/bundler/validator entry points.
2. Add root orchestration harness (orchestration only).
3. Enable cross-cluster guard as required status check on every PR.

Exit criteria:
1. Cluster builds run independently via cluster commands.

## Phase 3 — Credit Cards Cluster
1. Migrate complete shell + assets + build ownership.
2. Keep public URLs and visual parity unchanged.

Invariant:
1. Migration is complete in one PR set; no partial ownership.

## Phase 4 — Auto Loans Cluster
1. Migrate complete shell + assets + build ownership.
2. Enforce isolation fence and manifest integrity.

## Phase 5 — Home Loan Cluster
1. Migrate complete shell + assets + build ownership.
2. Remove manual-drift patterns from legacy flow.

## Phase 6 — Finance Cluster
1. Migrate complete shell + assets + build ownership.
2. Validate finance nav parity against global nav spec.

## Phase 7 — Percentage + Time-and-Date Clusters
1. Migrate both clusters fully with no partial split.

## Phase 8 — Math Cluster
1. Migrate largest cluster fully in staged PR set with strict invariants.

## Phase 9 — Legacy Shared Decommission
1. Produce deprecation matrix.
2. Remove legacy shared files or mark forbidden-by-CI.
3. Enforce denylist scans to ensure deprecated files are unused.

Deprecation matrix must include:
1. Removed files.
2. Retained-but-forbidden files.
3. CI search patterns proving no active references.

## 17) Tradeoff and Operating Policy
Tradeoff:
1. Header/footer/nav/theme duplication across clusters increases multi-cluster update effort.

Operating policy to keep this manageable:
1. Treat site-wide design changes as explicit multi-cluster campaigns.
2. Use one controlled PR per cluster (or controlled batch with parity checks).
3. Require parity checklist: visual snapshots + shell hook contract checks.
4. Introduce new immutable core versions only via explicit version bump and release note.

## 18) Test Cases and Scenarios

Isolation tests:
1. Change one route in a cluster; only owner-cluster artifacts may change.
2. Rebuild one cluster; no artifact under other cluster prefixes may change.

Fence tests:
1. Generated HTML must pass allowlist/denylist asset checks.
2. No legacy shared shell asset references remain.

Manifest tests:
1. Every manifest file exists and is readable.
2. Every referenced asset exists on disk.
3. Every route's assets belong to its owner cluster.

Navigation consistency tests:
1. Global destination links match policy spec across all cluster nav files.

Rollback tests:
1. Route ownership flip restores previous stable owner/build without cross-cluster rebuild.

## 19) Definition of Done
Migration is complete only when all are true:
1. Every calculator route has exactly one owner cluster.
2. Every generated route passes HTML isolation fence checks.
3. No route loads legacy shared shell/layout CSS/JS.
4. Every route loads only owner-cluster assets plus immutable core.
5. Cluster builds run independently.
6. Rebuilding one cluster cannot modify another cluster asset prefix.
7. Asset cleanup cannot delete files referenced by active manifests.
8. New cluster onboarding policy is active and enforced by CI.

## 20) New Cluster Onboarding Policy (Mandatory)
Any new cluster/category must:
1. Register in `cluster-registry.json`.
2. Define route ownership entries.
3. Implement cluster-owned shell/assets/build stack.
4. Use only immutable core for allowed shared runtime.
5. Pass all isolation contract, fence, and manifest checks before merge.

## 20.1 Single-Pane Layout Guard (Mandatory)
For calculator routes that include both calculation and explanation (`routeArchetype=calc_exp`):
1. Cluster onboarding must normalize route metadata to `paneLayout=single`.
2. Split-pane carryover is prohibited for newly onboarded or touched/migrated routes.
3. Legacy untouched split routes may remain only as temporary migration backlog and must be converted when touched.

## 21) Assumptions
1. MPA architecture remains unchanged.
2. Public URLs remain unchanged.
3. Visual shell parity is required during migration.
4. Universal rules are reused as governance; runtime files are not reused.
5. This plan is migration guidance only; implementation changes are tracked separately.

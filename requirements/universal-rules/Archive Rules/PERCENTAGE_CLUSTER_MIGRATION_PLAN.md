# Percentage Cluster Migration Plan

## 1) Purpose and Scope

This document is the execution plan for migrating Percentage calculators to cluster-owned architecture under Universal Requirements.

Wave 1 scope:
- Documentation + contracts bootstrap
- Migrate only `/percentage-calculators/percent-change/`

Rollout model:
- One-by-one migration for remaining Percentage calculators
- Public URL and public category label remain unchanged during migration

## 2) Governance Mapping (UR IDs)

- MPA navigation: `UR-NAV-001`, `UR-NAV-002`
- Navigation hierarchy/governed source: `UR-NAV-003`, `UR-NAV-004`
- Cluster boundaries and isolation: `UR-CLUSTER-001` to `UR-CLUSTER-020`
- Route ownership contract: `UR-CLUSTER-008`
- Cluster registry contract: `UR-CLUSTER-009`
- Per-cluster nav/asset contracts: `UR-CLUSTER-010`
- Isolation fence: `UR-CLUSTER-011`, `UR-CLUSTER-012`
- Global nav parity: `UR-CLUSTER-015`
- Cross-cluster guards in release gates: `UR-CLUSTER-017`
- Sitemap inclusion and infrastructure: `UR-SMAP-001`, `UR-SMAP-005`
- Factory pipeline: `UR-FLOW-001`, `UR-FLOW-010`, `UR-FLOW-011`, `UR-FLOW-012`, `UR-FLOW-013`

## 3) Current-State Gap Analysis

Detected in this repository branch:
- Missing `config/clusters/cluster-registry.json`
- Missing `config/clusters/route-ownership.json`
- Missing `clusters/percentage/config/navigation.json`
- Missing `clusters/percentage/config/asset-manifest.json`
- Missing `config/policy/global-navigation-spec.json`
- Missing `requirements/universal-rules/release-signoffs/`

Wave 1 includes bootstrapping these artifacts.

## 4) Target Architecture for Percentage Cluster

- Cluster ID: `percentage`
- Owner scope: all `/percentage-calculators/**`
- Public route behavior: unchanged URLs, MPA hard navigation with `<a href>`
- Runtime/build ownership: cluster-owned contracts and manifests
- Cross-cluster behavior: link-only allowed, runtime imports across clusters prohibited

## 5) Wave 1 Implementation Scope (Percent Change Only)

Target route:
- `/percentage-calculators/percent-change/`

Wave 1 changes:
- Redesign percent-change to new standard (present-value style baseline)
- Add route-specific calculator CSS
- Keep compute behavior and SEO semantics intact
- Add ownership + manifest contracts for this route
- Apply Wave 1 explanation harmonization patch:
  - Remove Scenario Summary section
  - Use present-value style Results Table design
  - Convert Explanation to bullet points + formula block + formula steps
  - Use present-value style FAQ card grid and color family

Out of scope:
- Migrating any other percentage calculator in this release
- Public category rename changes

### 5.1 Wave 1 UI Harmonization Patch

Accepted refinement for `/percentage-calculators/percent-change/` only:
- FAQ design and color aligned with present-value card-grid style
- Scenario Summary removed
- Results Table aligned with present-value table style
- Explanation rewritten as bullet-based formula walkthrough

Acceptance criteria:
- No Scenario Summary section exists on the page
- FAQ is rendered as card-grid style (not legacy faq-box blocks)
- Results table uses present-value style family
- Explanation includes bullet list, formula block, and formula steps

## 5.2 Wave 2 Implementation Scope (Percentage Difference)

Target route:
- `/percentage-calculators/percentage-difference/`

Wave 2 changes:
- Migrate calculator UI to the same modern theme/language as percent-change
- Add route-local CSS contract:
  - `public/calculators/percentage-calculators/percentage-difference/calculator.css`
- Remove legacy explanation structure:
  - remove Scenario Summary
  - replace `calculator-table` with `pv-results-table`
  - replace `faq-box` blocks with `bor-faq-grid` + `bor-faq-card`
- Keep percentage-difference compute behavior and FAQ schema semantics intact
- Add route-bundle/asset-manifest ownership for this route under percentage cluster

Wave 2 acceptance criteria:
- No Scenario Summary section exists on the page
- Results table uses `pv-results-table` style family
- FAQ renders as card-grid (`bor-faq-grid` with 10 cards)
- Explanation includes bullet list + formula block + ordered steps
- Scoped strict CWV artifact exists and passes:
  - `test-results/performance/scoped-cwv/percentage/percentage-difference.json`

## 5.3 Wave 3 Implementation Scope (Percentage Increase)

Target route:
- `/percentage-calculators/percentage-increase/`

Wave 3 changes:
- Migrate to cluster-owned single-pane architecture (`calc_exp` + `paneLayout=single`)
- Rebuild route UI with a distinct design language from percent-change while keeping platform patterns
- Add route-local CSS contract:
  - `public/calculators/percentage-calculators/percentage-increase/calculator.css`
- Remove legacy explanation structure:
  - remove Scenario Summary
  - replace legacy `calculator-table` with `pv-results-table`
  - replace `faq-box` blocks with `bor-faq-grid` + `bor-faq-card`
- Keep percentage-increase formula behavior, validation, and FAQ schema semantics intact
- Add route-bundle/asset-manifest ownership for this route under percentage cluster

Wave 3 acceptance criteria:
- Navigation contract uses `routeArchetype: "calc_exp"` and `paneLayout: "single"` for this route
- Combined pane is rendered (`panel-span-all` + `calculator-page-single`)
- No Scenario Summary section exists on the page
- Results table uses `pv-results-table` style family
- FAQ renders as card-grid (`bor-faq-grid` with 10 cards)
- Explanation includes bullet list + formula block + ordered steps
- Scoped strict CWV artifact exists and passes:
  - `test-results/performance/scoped-cwv/percentage/percentage-increase.json`

## 5.4 Wave 4 Implementation Scope (Percentage Decrease)

Target route:
- `/percentage-calculators/percentage-decrease/`

Wave 4 changes:
- Migrate to cluster-owned single-pane architecture (`calc_exp` + `paneLayout=single`)
- Rebuild route UI with a unique decline-focused visual language while preserving cluster patterns
- Add route-local CSS contract:
  - `public/calculators/percentage-calculators/percentage-decrease/calculator.css`
- Remove legacy explanation structure:
  - remove Scenario Summary
  - replace `calculator-table` with `pv-results-table`
  - replace `faq-box` blocks with `bor-faq-grid` + `bor-faq-card`
- Keep percentage-decrease formula behavior, guard behavior, and FAQ schema semantics intact
- Add route-bundle/asset-manifest ownership for this route under percentage cluster

Wave 4 acceptance criteria:
- Navigation contract uses `routeArchetype: "calc_exp"` and `paneLayout: "single"` for this route
- Combined pane is rendered (`panel-span-all` + `calculator-page-single`)
- No Scenario Summary section exists on the page
- Results table uses `pv-results-table` style family
- FAQ renders as card-grid (`bor-faq-grid` with 10 cards)
- Explanation includes bullet list + formula block + ordered steps
- Scoped strict CWV artifact exists and passes:
  - `test-results/performance/scoped-cwv/percentage/percentage-decrease.json`

## 5.5 Wave 5 Implementation Scope (Percentage Composition)

Target route:
- `/percentage-calculators/percentage-composition/`

Wave 5 changes:
- Migrate to cluster-owned single-pane architecture (`calc_exp` + `paneLayout=single`)
- Preserve full composition UX:
  - calculated total vs known total mode
  - dynamic add/remove item rows
  - remainder value and remainder percentage behavior
- Add route-local CSS contract:
  - `public/calculators/percentage-calculators/percentage-composition/calculator.css`
- Remove legacy explanation structure:
  - remove Scenario Summary
  - replace `calculator-table` with `pv-results-table`
  - replace `faq-box` blocks with `bor-faq-grid` + `bor-faq-card`
- Keep composition formula behavior and FAQ schema semantics intact
- Add route-bundle/asset-manifest ownership for this route under percentage cluster

Wave 5 acceptance criteria:
- Navigation contract uses `routeArchetype: "calc_exp"` and `paneLayout: "single"` for this route
- Combined pane is rendered (`panel-span-all` + `calculator-page-single`)
- No Scenario Summary section exists on the page
- Results table uses `pv-results-table` style family
- FAQ renders as card-grid (`bor-faq-grid` with 10 cards)
- Composition UX remains intact:
  - calculated mode works
  - known total mode works
  - add/remove row behavior works
  - remainder behavior works
- Scoped strict CWV artifact exists and passes:
  - `test-results/performance/scoped-cwv/percentage/percentage-composition.json`

## 6) File-by-File Change Map

Documentation/contracts:
- `requirements/universal-rules/PERCENTAGE_CLUSTER_MIGRATION_PLAN.md`
- `config/clusters/cluster-registry.json`
- `config/clusters/route-ownership.json`
- `clusters/percentage/config/navigation.json`
- `clusters/percentage/config/asset-manifest.json`
- `config/policy/global-navigation-spec.json`
- `scripts/validate-cluster-contracts.mjs`

Wave 1 route:
- `public/calculators/percentage-calculators/percent-change/index.html`
- `public/calculators/percentage-calculators/percent-change/module.js`
- `public/calculators/percentage-calculators/percent-change/explanation.html`
- `public/calculators/percentage-calculators/percent-change/calculator.css`
- `public/config/navigation.json`
- `public/config/asset-manifest.json`
- `scripts/build-route-css-bundles.mjs`
- `scripts/generate-mpa-pages.js` (generation wiring only if needed)

Release evidence:
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_<ID>.md`
- `requirements/universal-rules/Release Sign-Off Master Table.md`

## 7) Build/Test/Release Checklist Command Matrix

Build/update:
1. `npm run build:css:route-bundles`
2. `TARGET_ROUTE=/percentage-calculators/percent-change/ node scripts/generate-mpa-pages.js`

Scoped release gates (default for cluster/calculator releases):
1. `CLUSTER=percentage npm run test:cluster:unit`
2. `CLUSTER=percentage npm run test:cluster:e2e`
3. `CLUSTER=percentage npm run test:cluster:seo`
4. `CLUSTER=percentage npm run test:cluster:cwv`
5. `CLUSTER=percentage CALC=percent-change npm run test:calc:unit`
6. `CLUSTER=percentage CALC=percent-change npm run test:calc:e2e`
7. `CLUSTER=percentage CALC=percent-change npm run test:calc:seo`
8. `CLUSTER=percentage CALC=percent-change npm run test:calc:cwv`
9. `npm run test:isolation:scope`
10. `npm run test:cluster:contracts`

Global full-site gates (reserved for full-site releases only):
1. `npm run lint`
2. `npm run test`
3. `npm run test:e2e`
4. `npm run test:cwv:all`
5. `npm run test:iss001`

Rule: Any hard fail => fix and rerun failed gates.

## 8) Sign-Off Evidence and Artifacts

Required evidence in release sign-off:
- Checklist results (pass/fail)
- Test command outputs and scope
- CWV and Lighthouse governance fields
- Ownership/parity/isolation contract checks
- Sitemap evidence for `/percentage-calculators/percent-change/`

Artifacts:
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_<ID>.md`
- Master ledger update in `requirements/universal-rules/Release Sign-Off Master Table.md`

## 9) Rollback Model (Percent Change)

Ownership-driven rollback:
- Route: `/percentage-calculators/percent-change/`
- Rollback field source: `config/clusters/route-ownership.json`
- Procedure:
  1. Switch `activeOwnerClusterId` to `previousOwnerClusterId`
  2. Restore assets using `rollbackTag`
  3. Regenerate route HTML for target route only

## 10) Wave 2+ Template Checklist

For each next Percentage calculator:
1. Add route ownership entry with rollback fields
2. Add/update cluster asset manifest mapping
3. Migrate route UI to cluster pattern
4. Create/verify calculator release test folder:
   - `tests_specs/percentage/<calculator>_release/unit.calc.test.js`
   - `tests_specs/percentage/<calculator>_release/e2e.calc.spec.js`
   - `tests_specs/percentage/<calculator>_release/seo.calc.spec.js`
   - `tests_specs/percentage/<calculator>_release/cwv.calc.spec.js`
   - `tests_specs/percentage/<calculator>_release/README.md`
5. Regenerate target route only
6. Run required scoped release gates
7. Record sign-off evidence
8. Update master sign-off table

## 10.1 Wave N Calculator Onboarding SOP (Decision-Complete)

Required inputs (locked before implementation):
- `CLUSTER=percentage`
- `CALC=<slug>`
- `ROUTE=/percentage-calculators/<slug>/`

Mandatory files to add/update per calculator:
- UI route files:
  - `public/calculators/percentage-calculators/<slug>/index.html`
  - `public/calculators/percentage-calculators/<slug>/module.js`
  - `public/calculators/percentage-calculators/<slug>/explanation.html`
  - `public/calculators/percentage-calculators/<slug>/calculator.css`
- Test scope mapping:
  - `config/testing/test-scope-map.json` (unique `(cluster, calc)` + exact route)
- Calculator release test folder:
  - `tests_specs/percentage/<slug>_release/unit.calc.test.js`
  - `tests_specs/percentage/<slug>_release/e2e.calc.spec.js`
  - `tests_specs/percentage/<slug>_release/seo.calc.spec.js`
  - `tests_specs/percentage/<slug>_release/cwv.calc.spec.js`
  - `tests_specs/percentage/<slug>_release/README.md`
- Release evidence:
  - `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_<ID>.md`
  - `requirements/universal-rules/Release Sign-Off Master Table.md`

Build/regenerate contract:
1. `npm run build:css:route-bundles`
2. `TARGET_ROUTE=/percentage-calculators/<slug>/ node scripts/generate-mpa-pages.js`

Mandatory scoped gates (exact order):
1. `CLUSTER=percentage npm run test:cluster:unit`
2. `CLUSTER=percentage npm run test:cluster:e2e`
3. `CLUSTER=percentage npm run test:cluster:seo`
4. `CLUSTER=percentage npm run test:cluster:cwv`
5. `CLUSTER=percentage CALC=<slug> npm run test:calc:unit`
6. `CLUSTER=percentage CALC=<slug> npm run test:calc:e2e`
7. `CLUSTER=percentage CALC=<slug> npm run test:calc:seo`
8. `CLUSTER=percentage CALC=<slug> npm run test:calc:cwv`
9. `npm run test:isolation:scope`
10. `npm run test:cluster:contracts`

Hard block policy:
- Any gate failure blocks release.
- `test:calc:cwv` and `test:cluster:cwv` are hard blockers.
- Scoped CWV artifact is mandatory:
  - `test-results/performance/scoped-cwv/percentage/<slug>.json`
- No implicit scope expansion; cross-calculator edits require explicit scope declaration.

## 10.2 Universal Single-Pane Directive (Mandatory)

Effective policy for all next percentage calculator waves:
- `routeArchetype=calc_exp` must use `paneLayout=single`.
- No new split-pane migrations are allowed.

Transitional handling:
- Legacy untouched split routes may remain temporarily as migration debt.
- Any touched/migrated percentage route must be converted to single-pane before release signoff.

Wave acceptance criteria additions:
- Combined calculation + explanation rendered in one panel (`panel-span-all` + `calculator-page-single`).
- Navigation contract proof shows `paneLayout: "single"` for the target route.

## 11) Test Isolation Model (Adopted)

Cluster release folder:
- `tests_specs/percentage/cluster_release/`
- Required files:
  - `unit.cluster.test.js`
  - `contracts.cluster.test.js`
  - `e2e.cluster.spec.js`
  - `seo.cluster.spec.js`
  - `cwv.cluster.spec.js`
  - `README.md`

Calculator release folder:
- `tests_specs/percentage/<calculator>_release/`
- Required files:
  - `unit.calc.test.js`
  - `e2e.calc.spec.js`
  - `seo.calc.spec.js`
  - `cwv.calc.spec.js`
  - `README.md`

Runner isolation:
- `vitest.config.js` runs only `*.test.js`
- `playwright.config.js` runs only `*.spec.js`
- Scoped commands must fail fast if `CLUSTER` / `CALC` values are missing or invalid

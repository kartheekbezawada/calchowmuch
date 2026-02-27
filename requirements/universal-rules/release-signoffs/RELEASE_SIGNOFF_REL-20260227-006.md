# Release Sign-Off — REL-20260227-006

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260227-006 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Target |
| **Cluster ID(s)** | math |
| **Calculator ID (CALC)** | quadratic-equation |
| **Primary Route** | /math/algebra/quadratic-equation/ |
| **Route Archetype** | calc_exp |
| **Pane Layout Contract** | single |
| **Pane Layout Evidence Path** | public/config/navigation.json (`id: quadratic-equation` -> `paneLayout: single`) |
| **Ownership Snapshot Ref** | config/clusters/route-ownership.json |
| **Cluster Manifest Ref** | public/config/asset-manifest.json |
| **Rollback Contract Ref** | config/clusters/route-ownership.json |
| **Branch / Tag** | kartheek_devv |
| **Commit SHA** | d161ad7 |
| **Environment** | local static server (scoped Playwright/Vitest harness) |
| **thinContentMode (`soft`/`hard`)** | soft (pilotExcluded) |
| **thinContentScore** | N/A |
| **thinContentGrade** | N/A |
| **thinContentHardFlags** | none |
| **thinContentArtifactPath** | N/A (pilotExcluded summary emitted by scoped SEO runner) |
| **Owner** | Codex |
| **Date** | 2026-02-27 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **A1** | **Rendering** | Calculator UI + explanation render in single panel | Pass |
| **A2** | **CSS Arch** | Route-bundle critical/deferred CSS enabled for route | Pass |
| **A3** | **CLS Control** | Scoped strict CWV budget gate | Pass |
| **A4** | **JS Discipline** | Runtime bug fixed (`solveQuadratic` redeclaration removed) | Pass |
| **B1** | **Mobile Layout** | Single-column responsive behavior preserved | Pass |
| **C1** | **Field Metrics** | Scoped calc CWV hard budget gate | Pass |
| **I1** | **Metadata** | Title/description/canonical present | Pass |
| **I2** | **Schema** | Scoped schema dedupe for target route | Pass |
| **I3** | **Indexability** | Intent H2 + How to Guide + Notes + FAQ in initial HTML | Pass |
| **I4** | **Sitemap** | Route present in sitemap.xml | Pass |
| **NAV-PANE-1** | **Pane Layout** | `calc_exp` + `paneLayout=single` + combined panel contract | Pass |
| **J** | **Content** | Explanation contract updated with Last updated and FAQ block | Pass |

---

## 3) Evidence & Metrics

### Scoped Test Execution
- `npm run lint` -> Pass
- `CLUSTER=math CALC=quadratic-equation npm run test:calc:unit` -> Pass
- `CLUSTER=math CALC=quadratic-equation npm run test:calc:e2e` -> Pass
- `CLUSTER=math CALC=quadratic-equation npm run test:calc:seo` -> Pass
- `CLUSTER=math CALC=quadratic-equation npm run test:calc:cwv` -> Pass
- `CLUSTER=math CALC=quadratic-equation npm run test:schema:dedupe -- --scope=calc` -> Pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` -> Pass
- `npm run test:cluster:contracts` -> Pass

### Scoped CWV Strict Profiles (Calculator Release)
Artifact path: `test-results/performance/scoped-cwv/math/quadratic-equation.json`

- `mobile_strict`: CLS `0.000`, LCP `1164ms`, blocking CSS duration `0ms`, blocking CSS requests `0`
- `desktop_strict`: CLS `0.000`, LCP `1336ms`, blocking CSS duration `0ms`, blocking CSS requests `0`

### Shared Baseline Included in This Wave
- Added algebra route-bundle onboarding in `scripts/build-route-css-bundles.mjs`
- Added algebra route bundle pilot + single-pane/explanation overrides in `scripts/generate-mpa-pages.js`
- Regenerated route bundle manifest and asset manifest

### Exceptions
| ID | Issue | Severity | Owner |
| :--- | :--- | :--- | :--- |
| EX-REL-20260227-006-01 | Shared baseline prerequisite touched non-target route-bundle artifacts during rebuild | Low | Codex |

---

## 4) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex | Auto-generated evidence sign-off | 2026-02-27 |

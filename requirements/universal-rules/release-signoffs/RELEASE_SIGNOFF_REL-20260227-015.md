# Release Sign-Off — REL-20260227-015

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260227-015 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Target |
| **Cluster ID(s)** | math |
| **Calculator ID (CALC)** | system-of-equations |
| **Primary Route** | /math/algebra/system-of-equations/ |
| **Route Archetype** | calc_exp |
| **Pane Layout Contract** | single |
| **Pane Layout Evidence Path** | public/config/navigation.json (`id: system-of-equations` -> `paneLayout: single`) |
| **Ownership Snapshot Ref** | config/clusters/route-ownership.json |
| **Cluster Manifest Ref** | public/config/asset-manifest.json |
| **Rollback Contract Ref** | config/clusters/route-ownership.json |
| **Branch / Tag** | kartheek_devv |
| **Commit SHA** | TBD |
| **Environment** | local static server (scoped Playwright/Vitest harness) |
| **thinContentMode (`soft`/`hard`)** | soft (pilotExcluded) |
| **thinContentScore** | N/A |
| **thinContentGrade** | N/A |
| **thinContentHardFlags** | none |
| **thinContentArtifactPath** | `test-results/content-quality/scoped/math/system-of-equations.json` |
| **Owner** | Codex |
| **Date** | 2026-02-27 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **A1** | **Rendering** | Single-pane page renders with two-column algebra hero layout and right-side answer cards | Pass |
| **A2** | **CSS Arch** | No `@import`; route-scoped style bridge and calculator style contract preserved | Pass |
| **A3** | **CLS Control** | Scoped strict CWV budget gate | Pass |
| **A4** | **JS Discipline** | 2x2/3x3 solving flow + deterministic status handling validated | Pass |
| **B1** | **Mobile Layout** | Desktop two-column, mobile stacked behavior validated | Pass |
| **C1** | **Field Metrics** | Scoped calc CWV hard budget gate | Pass |
| **I1** | **Metadata** | Title/description/canonical present | Pass |
| **I2** | **Schema** | FAQPage JSON-LD present with 10 entities; scoped schema dedupe pass | Pass |
| **I3** | **Indexability** | Intent H2 + How to Guide + Important Notes + FAQ in initial HTML | Pass |
| **I4** | **Sitemap** | Route present in sitemap.xml | Pass |
| **NAV-PANE-1** | **Pane Layout** | `calc_exp` + `paneLayout=single` + combined panel contract | Pass |
| **J** | **Content** | Explanation upgraded to 10 calculator-specific FAQ cards with Last updated line | Pass |

---

## 3) Evidence & Metrics

### Scoped Test Execution
- `npm run lint` -> Pass
- `CLUSTER=math CALC=system-of-equations npm run test:calc:unit` -> Pass
- `CLUSTER=math CALC=system-of-equations npm run test:calc:e2e` -> Pass
- `CLUSTER=math CALC=system-of-equations npm run test:calc:seo` -> Pass
- `CLUSTER=math CALC=system-of-equations npm run test:calc:cwv` -> Pass
- `CLUSTER=math CALC=system-of-equations npm run test:schema:dedupe -- --scope=calc` -> Pass
- `npm run test:isolation:scope` -> Pass
- `npm run test:cluster:contracts` -> Pass

### Scoped CWV Strict Profiles (Calculator Release)
Artifact path: `test-results/performance/scoped-cwv/math/system-of-equations.json`

- `mobile_strict`: CLS `0.0000`, LCP `1160ms`, blocking CSS duration `0ms`, blocking CSS requests `0`
- `desktop_strict`: CLS `0.0000`, LCP `1304ms`, blocking CSS duration `0ms`, blocking CSS requests `0`

### Exceptions
| ID | Issue | Severity | Owner |
| :--- | :--- | :--- | :--- |
| EX-REL-20260227-015-01 | `test:isolation:scope` reported non-blocking route lookup skip for aggregate `algebra` source prefix | Low | Codex |

---

## 4) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex | Auto-generated evidence sign-off | 2026-02-27 |

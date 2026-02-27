# Release Sign-Off — REL-20260227-016

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260227-016 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Target |
| **Cluster ID(s)** | time-and-date |
| **Calculator ID (CALC)** | sleep-time-calculator |
| **Primary Route** | /time-and-date/sleep-time-calculator/ |
| **Route Archetype** | calc_exp |
| **Pane Layout Contract** | single |
| **Pane Layout Evidence Path** | public/config/navigation.json:768 (`id: sleep-time-calculator`, `routeArchetype: calc_exp`, `paneLayout: single`); public/time-and-date/sleep-time-calculator/index.html:4897,5025,5027 (`data-route-archetype="calc_exp"`, `panel-span-all`, `calculator-page-single`) |
| **Ownership Snapshot Ref** | config/clusters/route-ownership.json:13 |
| **Cluster Manifest Ref** | public/config/asset-manifest.json:569 |
| **Rollback Contract Ref** | config/clusters/route-ownership.json |
| **Branch / Tag** | kartheek_devv |
| **Commit SHA** | e95c5a0 |
| **Environment** | local static server (scoped Playwright/Vitest harness) |
| **thinContentMode (`soft`/`hard`)** | soft (pilotExcluded) |
| **thinContentScore** | N/A |
| **thinContentGrade** | N/A |
| **thinContentHardFlags** | none |
| **thinContentArtifactPath** | N/A |
| **Owner** | Codex |
| **Date** | 2026-02-27 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **A1** | **Rendering** | Calculator renders with single-pane contract and explanation/FAQ in initial HTML | Pass |
| **A2** | **CSS Arch** | Existing route bundle and critical CSS contract unchanged | Pass |
| **A3** | **CLS Control** | Scoped strict CWV profile pass | Pass |
| **A4** | **JS Discipline** | Existing calculate interaction behavior preserved | Pass |
| **B1** | **Mobile Layout** | Scoped e2e/cwv passes with no horizontal overflow regressions | Pass |
| **C1** | **Field Metrics** | Scoped calc CWV hard budgets pass | Pass |
| **I1** | **Metadata** | Title/description/canonical updated and valid | Pass |
| **I2** | **Schema** | WebPage + SoftwareApplication + FAQPage + BreadcrumbList present and dedupe pass (`changed=0`) | Pass |
| **I3** | **Indexability** | Explanation + FAQ remain in initial HTML | Pass |
| **I4** | **Sitemap** | Route present in sitemap.xml via scoped SEO gate | Pass |
| **NAV-PANE-1** | **Pane Layout** | `calc_exp` + `paneLayout=single` + combined panel contract rendered | Pass |
| **J** | **Content** | 10 FAQ entries remain visible and schema-aligned | Pass |

---

## 3) Evidence & Metrics

### Scoped Test Execution
- `npm run lint` -> Pass
- `CLUSTER=time-and-date CALC=sleep-time-calculator npm run test:calc:unit` -> Pass
- `CLUSTER=time-and-date CALC=sleep-time-calculator npm run test:calc:e2e` -> Pass
- `CLUSTER=time-and-date CALC=sleep-time-calculator npm run test:calc:seo` -> Pass
- `CLUSTER=time-and-date CALC=sleep-time-calculator npm run test:calc:cwv` -> Pass
- `CLUSTER=time-and-date CALC=sleep-time-calculator npm run test:schema:dedupe -- --scope=calc` -> Pass (`scanned=1 changed=0 parseErrors=0 unresolved=0`)
- `npm run test:isolation:scope -- --route=/time-and-date/sleep-time-calculator/` -> Pass
- `CLUSTER=time-and-date npm run test:cluster:contracts` -> Pass

### Scoped CWV Strict Profiles (Calculator Release)
Artifact path: `test-results/performance/scoped-cwv/time-and-date/sleep-time-calculator.json`

- `mobile_strict`: CLS `0.0000`, LCP `1276ms`, blocking CSS duration `0ms`, blocking CSS requests `0`
- `desktop_strict`: CLS `0.0058`, LCP `1580ms`, blocking CSS duration `0ms`, blocking CSS requests `0`

### Exceptions
| ID | Issue | Severity | Owner |
| :--- | :--- | :--- | :--- |
| EX-REL-20260227-016-01 | `test:isolation:scope` reports strict single-calculator artifact check skipped because no changed-calculator artifact was detected | Low | Codex |

---

## 4) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex | Auto-generated evidence sign-off | 2026-02-27 |

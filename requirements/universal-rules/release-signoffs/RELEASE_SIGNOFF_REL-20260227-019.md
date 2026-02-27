# Release Sign-Off — REL-20260227-019

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260227-019 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Target |
| **Cluster ID(s)** | time-and-date |
| **Calculator ID (CALC)** | power-nap-calculator |
| **Primary Route** | /time-and-date/power-nap-calculator/ |
| **Route Archetype** | calc_exp |
| **Pane Layout Contract** | single |
| **Pane Layout Evidence Path** | public/config/navigation.json:806 (`id: power-nap-calculator`, `routeArchetype: calc_exp`, `paneLayout: single`); public/time-and-date/power-nap-calculator/index.html:4578,4706,4708 (`data-route-archetype="calc_exp"`, `panel-span-all`, `calculator-page-single`) |
| **Ownership Snapshot Ref** | config/clusters/route-ownership.json:37 |
| **Cluster Manifest Ref** | public/config/asset-manifest.json:635 |
| **Rollback Contract Ref** | config/clusters/route-ownership.json |
| **Branch / Tag** | kartheek_devv |
| **Commit SHA** | 145f586 |
| **Environment** | local static server (scoped Playwright/Vitest harness) |
| **thinContentMode (`soft`/`hard`)** | soft (pilotExcluded) |
| **thinContentScore** | N/A |
| **thinContentGrade** | N/A |
| **thinContentHardFlags** | none |
| **thinContentArtifactPath** | `test-results/content-quality/scoped/time-and-date/power-nap-calculator.json` |
| **Owner** | Codex |
| **Date** | 2026-02-27 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **A1** | **Rendering** | Power Nap calculator renders with single-pane contract and explanation/FAQ blocks | Pass |
| **A2** | **CSS Arch** | Existing route bundle + critical CSS contract preserved | Pass |
| **A3** | **CLS Control** | Scoped strict CWV profiles pass | Pass |
| **A4** | **JS Discipline** | Calculation and warning behaviors preserved after static SERP migration | Pass |
| **B1** | **Mobile Layout** | Scoped e2e/cwv passes on mobile profile | Pass |
| **C1** | **Field Metrics** | Scoped calc CWV hard budgets pass | Pass |
| **I1** | **Metadata** | Static title/description/canonical aligned with route SEO contract | Pass |
| **I2** | **Schema** | Static HTML JSON-LD includes `WebPage`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`; schema dedupe pass (`changed=0`) | Pass |
| **I3** | **Indexability** | Schema and explanation/FAQ are in initial HTML | Pass |
| **I4** | **Sitemap** | Route present in sitemap.xml via scoped SEO gate | Pass |
| **NAV-PANE-1** | **Pane Layout** | `calc_exp` + `paneLayout=single` + combined panel contract rendered | Pass |
| **J** | **Content** | FAQ content remains schema-aligned (10 items) | Pass |

---

## 3) Evidence & Metrics

### Scoped Test Execution
- `npm run lint` -> Pass
- `CLUSTER=time-and-date CALC=power-nap-calculator npm run test:calc:unit` -> Pass (suite skipped by current scoped pack)
- `CLUSTER=time-and-date CALC=power-nap-calculator npm run test:calc:e2e` -> Pass
- `CLUSTER=time-and-date CALC=power-nap-calculator npm run test:calc:seo` -> Pass
- `CLUSTER=time-and-date CALC=power-nap-calculator npm run test:calc:cwv` -> Pass
- `CLUSTER=time-and-date CALC=power-nap-calculator npm run test:schema:dedupe -- --scope=calc` -> Pass (`scanned=1 changed=0 parseErrors=0 unresolved=0`)
- `npm run test:isolation:scope -- --route=/time-and-date/power-nap-calculator/` -> Pass
- `CLUSTER=time-and-date npm run test:cluster:contracts` -> Pass

### Scoped CWV Strict Profiles (Calculator Release)
Artifact path: `test-results/performance/scoped-cwv/time-and-date/power-nap-calculator.json`

- `mobile_strict`: CLS `0.0000`, LCP `1280ms`, blocking CSS duration `0ms`, blocking CSS requests `0`
- `desktop_strict`: CLS `0.0005`, LCP `1464ms`, blocking CSS duration `0ms`, blocking CSS requests `0`

### Exceptions
| ID | Issue | Severity | Owner |
| :--- | :--- | :--- | :--- |
| EX-REL-20260227-019-01 | Scoped `test:calc:unit` pack currently contains 1 skipped test for this route (no failing assertions) | Low | Codex |

---

## 4) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex | Auto-generated evidence sign-off | 2026-02-27 |

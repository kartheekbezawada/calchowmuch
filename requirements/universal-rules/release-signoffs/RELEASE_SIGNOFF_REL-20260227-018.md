# Release Sign-Off — REL-20260227-018

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260227-018 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Target |
| **Cluster ID(s)** | time-and-date |
| **Calculator ID (CALC)** | nap-time-calculator |
| **Primary Route** | /time-and-date/nap-time-calculator/ |
| **Route Archetype** | calc_exp |
| **Pane Layout Contract** | single |
| **Pane Layout Evidence Path** | public/config/navigation.json:792 (`id: nap-time-calculator`, `routeArchetype: calc_exp`, `paneLayout: single`); public/time-and-date/nap-time-calculator/index.html:4554,4682,4684 (`data-route-archetype="calc_exp"`, `panel-span-all`, `calculator-page-single`) |
| **Ownership Snapshot Ref** | config/clusters/route-ownership.json:29 |
| **Cluster Manifest Ref** | public/config/asset-manifest.json:613 |
| **Rollback Contract Ref** | config/clusters/route-ownership.json |
| **Branch / Tag** | kartheek_devv |
| **Commit SHA** | dfc0ebf |
| **Environment** | local static server (scoped Playwright/Vitest harness) |
| **thinContentMode (`soft`/`hard`)** | soft (pilotExcluded) |
| **thinContentScore** | N/A |
| **thinContentGrade** | N/A |
| **thinContentHardFlags** | none |
| **thinContentArtifactPath** | `test-results/content-quality/scoped/time-and-date/nap-time-calculator.json` |
| **Owner** | Codex |
| **Date** | 2026-02-27 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **A1** | **Rendering** | Calculator UI and explanation render with single-pane contract | Pass |
| **A2** | **CSS Arch** | Existing route bundle and critical CSS contract unchanged | Pass |
| **A3** | **CLS Control** | Scoped strict CWV profiles pass | Pass |
| **A4** | **JS Discipline** | Nap interaction behavior preserved after static SERP migration | Pass |
| **B1** | **Mobile Layout** | Scoped e2e/cwv pass on mobile profile | Pass |
| **C1** | **Field Metrics** | Scoped calc CWV hard budgets pass | Pass |
| **I1** | **Metadata** | Static title/description/canonical aligned with route SEO contract | Pass |
| **I2** | **Schema** | Static HTML JSON-LD includes `WebPage`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`; schema dedupe pass (`changed=0`) | Pass |
| **I3** | **Indexability** | Schema and explanation/FAQ are in initial HTML | Pass |
| **I4** | **Sitemap** | Route present in sitemap.xml via scoped SEO gate | Pass |
| **NAV-PANE-1** | **Pane Layout** | `calc_exp` + `paneLayout=single` + combined panel contract rendered | Pass |
| **J** | **Content** | FAQ content remains schema-aligned (5 items) | Pass |

---

## 3) Evidence & Metrics

### Scoped Test Execution
- `npm run lint` -> Pass
- `CLUSTER=time-and-date CALC=nap-time-calculator npm run test:calc:unit` -> Pass
- `CLUSTER=time-and-date CALC=nap-time-calculator npm run test:calc:e2e` -> Pass
- `CLUSTER=time-and-date CALC=nap-time-calculator npm run test:calc:seo` -> Pass
- `CLUSTER=time-and-date CALC=nap-time-calculator npm run test:calc:cwv` -> Pass
- `CLUSTER=time-and-date CALC=nap-time-calculator npm run test:schema:dedupe -- --scope=calc` -> Pass (`scanned=1 changed=0 parseErrors=0 unresolved=0`)
- `npm run test:isolation:scope -- --route=/time-and-date/nap-time-calculator/` -> Pass
- `CLUSTER=time-and-date npm run test:cluster:contracts` -> Pass

### Scoped CWV Strict Profiles (Calculator Release)
Artifact path: `test-results/performance/scoped-cwv/time-and-date/nap-time-calculator.json`

- `mobile_strict`: CLS `0.0000`, LCP `1188ms`, blocking CSS duration `0ms`, blocking CSS requests `0`
- `desktop_strict`: CLS `0.0008`, LCP `1420ms`, blocking CSS duration `0ms`, blocking CSS requests `0`

### Exceptions
| ID | Issue | Severity | Owner |
| :--- | :--- | :--- | :--- |
| — | None | — | — |

---

## 4) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex | Auto-generated evidence sign-off | 2026-02-27 |

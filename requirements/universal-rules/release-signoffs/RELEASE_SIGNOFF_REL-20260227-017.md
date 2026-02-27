# Release Sign-Off — REL-20260227-017

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260227-017 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Target |
| **Cluster ID(s)** | time-and-date |
| **Calculator ID (CALC)** | wake-up-time-calculator |
| **Primary Route** | /time-and-date/wake-up-time-calculator/ |
| **Route Archetype** | calc_exp |
| **Pane Layout Contract** | single |
| **Pane Layout Evidence Path** | public/config/navigation.json:782 (`id: wake-up-time-calculator`, `routeArchetype: calc_exp`, `paneLayout: single`); public/time-and-date/wake-up-time-calculator/index.html:4645,4773,4775 (`data-route-archetype="calc_exp"`, `panel-span-all`, `calculator-page-single`) |
| **Ownership Snapshot Ref** | config/clusters/route-ownership.json:21 |
| **Cluster Manifest Ref** | public/config/asset-manifest.json:591 |
| **Rollback Contract Ref** | config/clusters/route-ownership.json |
| **Branch / Tag** | kartheek_devv |
| **Commit SHA** | 961daff |
| **Environment** | local static server (scoped Playwright/Vitest harness) |
| **thinContentMode (`soft`/`hard`)** | soft (pilotExcluded) |
| **thinContentScore** | N/A |
| **thinContentGrade** | N/A |
| **thinContentHardFlags** | none |
| **thinContentArtifactPath** | `test-results/content-quality/scoped/time-and-date/wake-up-time-calculator.json` |
| **Owner** | Codex |
| **Date** | 2026-02-27 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **A1** | **Rendering** | Calculator UI and explanation render in single-pane contract | Pass |
| **A2** | **CSS Arch** | Existing route bundle/critical CSS contract unchanged | Pass |
| **A3** | **CLS Control** | Scoped strict CWV profiles pass | Pass |
| **A4** | **JS Discipline** | Calculator interaction behavior preserved after metadata/schema migration | Pass |
| **B1** | **Mobile Layout** | Scoped e2e/cwv passes under mobile profile | Pass |
| **C1** | **Field Metrics** | Scoped calc CWV hard budgets pass | Pass |
| **I1** | **Metadata** | Static title/description/canonical aligned with route SEO contract | Pass |
| **I2** | **Schema** | Static HTML JSON-LD includes `WebPage`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`; schema dedupe pass (`changed=0`) | Pass |
| **I3** | **Indexability** | Schema and content available in initial HTML (static-first) | Pass |
| **I4** | **Sitemap** | Route present in sitemap.xml via scoped SEO gate | Pass |
| **NAV-PANE-1** | **Pane Layout** | `calc_exp` + `paneLayout=single` + combined panel contract rendered | Pass |
| **J** | **Content** | 10 FAQ entries remain visible and schema-aligned | Pass |

---

## 3) Evidence & Metrics

### Scoped Test Execution
- `npm run lint` -> Pass
- `CLUSTER=time-and-date CALC=wake-up-time-calculator npm run test:calc:unit` -> Pass
- `CLUSTER=time-and-date CALC=wake-up-time-calculator npm run test:calc:e2e` -> Pass
- `CLUSTER=time-and-date CALC=wake-up-time-calculator npm run test:calc:seo` -> Pass
- `CLUSTER=time-and-date CALC=wake-up-time-calculator npm run test:calc:cwv` -> Pass
- `CLUSTER=time-and-date CALC=wake-up-time-calculator npm run test:schema:dedupe -- --scope=calc` -> Pass (`scanned=1 changed=0 parseErrors=0 unresolved=0`)
- `npm run test:isolation:scope -- --route=/time-and-date/wake-up-time-calculator/` -> Pass
- `CLUSTER=time-and-date npm run test:cluster:contracts` -> Pass

### Scoped CWV Strict Profiles (Calculator Release)
Artifact path: `test-results/performance/scoped-cwv/time-and-date/wake-up-time-calculator.json`

- `mobile_strict`: CLS `0.0000`, LCP `1260ms`, blocking CSS duration `0ms`, blocking CSS requests `0`
- `desktop_strict`: CLS `0.0010`, LCP `1332ms`, blocking CSS duration `0ms`, blocking CSS requests `0`

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

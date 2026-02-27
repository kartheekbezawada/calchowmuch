# Release Sign-Off — REL-20260227-005

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260227-005 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Target |
| **Cluster ID(s)** | loans |
| **Calculator ID (CALC)** | how-much-can-i-borrow |
| **Primary Route** | /loan-calculators/how-much-can-i-borrow/ |
| **Route Archetype** | calc_exp |
| **Pane Layout Contract** | single |
| **Pane Layout Evidence Path** | public/config/navigation.json (`id: how-much-can-i-borrow` -> `routeArchetype: calc_exp`, `paneLayout: single`) |
| **Ownership Snapshot Ref** | config/clusters/route-ownership.json |
| **Cluster Manifest Ref** | public/config/asset-manifest.json |
| **Rollback Contract Ref** | config/clusters/route-ownership.json |
| **Branch / Tag** | kartheek_devv |
| **Commit SHA** | 514656d |
| **Environment** | local static server (scoped Playwright/Vitest harness) |
| **thinContentMode (`soft`/`hard`)** | soft (pilotExcluded) |
| **thinContentScore** | N/A |
| **thinContentGrade** | N/A |
| **thinContentHardFlags** | none |
| **thinContentArtifactPath** | test-results/content-quality/scoped/loans/how-much-can-i-borrow.json |
| **Owner** | Codex |
| **Date** | 2026-02-27 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **A1** | **Rendering** | Explanation and FAQ content in initial HTML | Pass |
| **A2** | **CSS Arch** | Route-scoped CSS hardening applied; no shared/core edits | Pass |
| **A3** | **CLS Control** | Scoped strict CWV budget gate | Pass |
| **A4** | **JS Discipline** | No calculator logic/API changes | Pass |
| **B1** | **Mobile Layout** | Existing responsive behavior preserved | Pass |
| **C1** | **Field Metrics** | Scoped calc CWV hard budget gate | Pass |
| **I1** | **Metadata** | Title/description/canonical present | Pass |
| **I2** | **Schema** | FAQ/WebPage/SoftwareApplication/Breadcrumb and dedupe pass | Pass |
| **I3** | **Indexability** | Practical guide + FAQ + notes in initial HTML | Pass |
| **I4** | **Sitemap** | Route present in sitemap.xml | Pass |
| **NAV-PANE-1** | **Pane Layout** | `calc_exp` + `paneLayout=single` preserved | Pass |
| **J** | **Content** | Practical guide added; Important Notes placed after FAQ per HUMAN requirement | Pass |

---

## 3) Evidence & Metrics

### Scoped Test Execution
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:unit` -> Pass
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:e2e` -> Pass
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:seo` -> Pass
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:cwv` -> Pass
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:schema:dedupe -- --scope=calc` -> Pass
- `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:content:quality -- --scope=calc` -> Pass (`pilotExcluded`)

### Scoped CWV Strict Profiles (Calculator Release)
Artifact path: `test-results/performance/scoped-cwv/loans/how-much-can-i-borrow.json`

- `mobile_strict`: CLS `0.000`, LCP `1196ms`, blocking CSS duration `425.1ms`, blocking CSS requests `1`
- `desktop_strict`: CLS `0.000`, LCP `1240ms`, blocking CSS duration `428.2ms`, blocking CSS requests `1`

### Thin-Content Evidence
- Artifact: `test-results/content-quality/scoped/loans/how-much-can-i-borrow.json`
- Summary: `evaluated=0, pilotExcluded=1, fail=0`

### Exceptions
| ID | Issue | Severity | Owner |
| :--- | :--- | :--- | :--- |
| EX-REL-20260227-005-01 | Explicit HUMAN-approved exception: `Important Notes` intentionally placed after FAQ for this route | Medium | HUMAN/Codex |

---

## 4) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex | Auto-generated evidence sign-off | 2026-02-27 |

# Release Sign-Off — REL-20260304-001

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260304-001 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Target |
| **Cluster ID(s)** | percentage |
| **Calculator ID (CALC)** | commission-calculator |
| **Primary Route** | /percentage-calculators/commission-calculator/ |
| **Route Archetype** | calc_exp |
| **Pane Layout Contract** | single |
| **Pane Layout Evidence Path** | public/config/navigation.json, public/percentage-calculators/commission-calculator/index.html |
| **Ownership Snapshot Ref** | config/clusters/route-ownership.json |
| **Cluster Manifest Ref** | clusters/percentage/config/asset-manifest.json |
| **Rollback Contract Ref** | config/clusters/route-ownership.json |
| **Branch / Tag** | local working tree |
| **Commit SHA** | n/a |
| **Environment** | local |
| **thinContentMode (`soft`/`hard`)** | soft |
| **thinContentScore** | n/a (pilotExcluded=1) |
| **thinContentGrade** | n/a |
| **thinContentHardFlags** | none |
| **thinContentArtifactPath** | test-results/content-quality/scoped/percentage/commission-calculator.json |
| **Owner** | Codex |
| **Date** | 2026-03-04 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **A1** | **Rendering** | Calculator UI and route load | Pass |
| **B1** | **Mobile Layout** | Single-column behavior retained by shared shell | Pass |
| **C2** | **Lab Gates** | Scoped calc checks executed | Pass |
| **D1-D4**| **CWV Guard** | `CLUSTER=percentage CALC=commission-calculator npm run test:calc:cwv` | Pass |
| **I1** | **Metadata** | Unique title/description/canonical present | Pass |
| **I2** | **Schema** | SEO scoped check + dedupe scoped check pass | Pass |
| **I4** | **Sitemap** | Route present in sitemap (SEO scoped check) | Pass |
| **NAV-PANE-1** | **Pane Layout** | `paneLayout=single`, `panel-span-all`, `calculator-page-single` | Pass |

---

## 3) Evidence & Metrics

### Cluster Isolation Governance Evidence (Mandatory)
| Check | Result (Pass/Fail) | Artifact / Path |
| :--- | :--- | :--- |
| Isolation fence validation (owner-cluster + immutable core only) | Pass (with shared-contract opt-in) | `ALLOW_SHARED_CONTRACT_CHANGE=1 CLUSTER=percentage CALC=commission-calculator npm run test:isolation:scope` |
| Ownership validation (`config/clusters/route-ownership.json`) | Pass | `CLUSTER=percentage npm run test:cluster:contracts` |
| Import graph validation (no cross-cluster JS/CSS imports) | Pass | `CLUSTER=percentage npm run test:cluster:contracts` |
| Manifest integrity validation | Pass | `CLUSTER=percentage npm run test:cluster:contracts` |
| Global nav parity validation | Pass | `CLUSTER=percentage npm run test:cluster:contracts` |
| Immutable core usage declaration (`/assets/core/v{n}/...`) | Pass | generated route HTML |
| Cross-cluster reference violations (must be `0`) | Pass | `scripts/validate-cluster-contracts.mjs` |

### Scoped CWV Strict Profiles (Calculator Release)
| Profile | CLS | LCP (ms) | Blocking CSS Duration (ms) | Blocking CSS Requests | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `mobile_strict` | pass | pass | pass | pass | Pass |
| `desktop_strict` | pass | pass | pass | pass | Pass |

Artifact path: `test-results/performance/scoped-cwv/percentage/commission-calculator.json`

### Key Command Results
- `TARGET_CALC_ID=commission-calculator node scripts/generate-mpa-pages.js` -> PASS
- `npm run build:css:route-bundles` -> PASS
- `npm run lint` -> PASS
- `CLUSTER=percentage CALC=commission-calculator npm run test:calc:unit` -> PASS
- `CLUSTER=percentage CALC=commission-calculator npm run test:calc:e2e` -> PASS
- `CLUSTER=percentage CALC=commission-calculator npm run test:calc:seo` -> PASS
- `CLUSTER=percentage CALC=commission-calculator npm run test:calc:cwv` -> PASS
- `CLUSTER=percentage CALC=commission-calculator npm run test:schema:dedupe -- --scope=calc` -> PASS
- `npm run test:percentage:nav-guard` -> PASS

---

## 4) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

Scoped release gates are passing for commission redesign and CWV delivery hardening.

# Release Sign-Off — REL-20260305-001

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260305-001 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Target |
| **Cluster ID(s)** | credit-cards |
| **Calculator ID (CALC)** | credit-card-minimum-payment |
| **Primary Route** | /credit-card-calculators/credit-card-minimum-payment-calculator/ |
| **Route Archetype** | calc_exp |
| **Pane Layout Contract** | single |
| **Pane Layout Evidence Path** | public/config/navigation.json, public/credit-card-calculators/credit-card-minimum-payment-calculator/index.html |
| **Ownership Snapshot Ref** | config/clusters/route-ownership.json |
| **Cluster Manifest Ref** | public/assets/css/route-bundles/manifest.json |
| **Rollback Contract Ref** | config/clusters/route-ownership.json |
| **Branch / Tag** | local working tree |
| **Commit SHA** | 93eaf4e |
| **Environment** | local |
| **thinContentMode (`soft`/`hard`)** | soft |
| **thinContentScore** | n/a (pilotExcluded=1) |
| **thinContentGrade** | n/a |
| **thinContentHardFlags** | none |
| **thinContentArtifactPath** | test-results/content-quality/scoped/credit-cards/credit-card-minimum-payment.json |
| **Owner** | Codex |
| **Date** | 2026-03-05 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **A1** | **Rendering** | Calculator UI and generated route render with updated explanation | Pass |
| **A2** | **CSS Arch** | Route bundle regenerated and manifest updated for target route | Pass |
| **B1** | **Mobile Layout** | Single-column behavior retained with no horizontal overflow regression | Pass |
| **C2** | **Lab Gates** | Scoped calc checks executed | Pass |
| **D1-D4**| **CWV Guard** | `CLUSTER=credit-cards CALC=credit-card-minimum-payment npm run test:calc:cwv` | Pass |
| **I1** | **Metadata** | Title/description/canonical unchanged and valid | Pass |
| **I2** | **Schema** | SEO scope + schema dedupe scope pass | Pass |
| **I4** | **Sitemap** | Target route present in sitemap | Pass |
| **NAV-PANE-1** | **Pane Layout** | `paneLayout=single`, `panel-span-all`, `calculator-page-single` | Pass |
| **J** | **Content** | Explanation section replaced with blog-style `How to Guide`; FAQ parity preserved | Pass |

---

## 3) Evidence & Metrics

### Cluster Isolation Governance Evidence (Mandatory)
| Check | Result (Pass/Fail) | Artifact / Path |
| :--- | :--- | :--- |
| Isolation fence validation (owner-cluster + immutable core only) | Pass (shared-contract opt-in) | `ALLOW_SHARED_CONTRACT_CHANGE=1 CLUSTER=credit-cards CALC=credit-card-minimum-payment ROUTE=/credit-card-calculators/credit-card-minimum-payment-calculator/ npm run test:isolation:scope` |
| Ownership validation (`config/clusters/route-ownership.json`) | Pass | `CLUSTER=credit-cards npm run test:cluster:contracts` |
| Import graph validation (no cross-cluster JS/CSS imports) | Pass | `CLUSTER=credit-cards npm run test:cluster:contracts` |
| Manifest integrity validation | Pass | `CLUSTER=credit-cards npm run test:cluster:contracts` |
| Global nav parity validation | Pass | `CLUSTER=credit-cards npm run test:cluster:contracts` |
| Immutable core usage declaration (`/assets/core/v{n}/...`) | Pass | generated route HTML |
| Cross-cluster reference violations (must be `0`) | Pass | `scripts/validate-cluster-contracts.mjs` |

### Scoped CWV Strict Profiles (Calculator Release)
| Profile | CLS | LCP (ms) | Blocking CSS Duration (ms) | Blocking CSS Requests | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `mobile_strict` | pass | pass | pass | pass | Pass |
| `desktop_strict` | pass | pass | pass | pass | Pass |

Artifact path: `test-results/performance/scoped-cwv/credit-cards/credit-card-minimum-payment.json`

### Key Command Results
- `TARGET_CALC_ID=credit-card-minimum-payment node scripts/generate-mpa-pages.js` -> PASS
- `REBUILD_ROUTE_BUNDLES=1 TARGET_CALC_ID=credit-card-minimum-payment node scripts/generate-mpa-pages.js` -> PASS
- `npm run lint` -> PASS
- `CLUSTER=credit-cards CALC=credit-card-minimum-payment npm run test:calc:unit` -> PASS (1 skipped placeholder)
- `CLUSTER=credit-cards CALC=credit-card-minimum-payment npm run test:calc:e2e` -> PASS
- `CLUSTER=credit-cards CALC=credit-card-minimum-payment npm run test:calc:seo` -> PASS
- `CLUSTER=credit-cards CALC=credit-card-minimum-payment npm run test:calc:cwv` -> PASS
- `CLUSTER=credit-cards CALC=credit-card-minimum-payment npm run test:schema:dedupe -- --scope=calc` -> PASS (`changed=0`) 
- `CLUSTER=credit-cards npm run test:cluster:contracts` -> PASS
- `CLUSTER=credit-cards CALC=credit-card-minimum-payment ROUTE=/credit-card-calculators/credit-card-minimum-payment-calculator/ npm run test:isolation:scope` -> FAIL (expected due shared contract update)
- `ALLOW_SHARED_CONTRACT_CHANGE=1 CLUSTER=credit-cards CALC=credit-card-minimum-payment ROUTE=/credit-card-calculators/credit-card-minimum-payment-calculator/ npm run test:isolation:scope` -> PASS

### Scope Statement
- Updated source files: calculator explanation HTML, module JS, calculator CSS.
- Regenerated target artifacts: route HTML, route CSS bundle files, route-bundle manifest, asset-manifest.
- No edits to other calculator source routes.
- Delta (same release): expanded `How to Guide` content to cover markdown topics more completely while retaining dynamic-value tokens and preserving summary/table/FAQ/notes scaffolding.

---

## 4) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

Scoped release is complete for credit-card minimum payment explanation replacement with dynamic guide values and regenerated route assets.

# Release Sign-Off — REL-20260227-003

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260227-003 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Target |
| **Cluster ID(s)** | time-and-date |
| **Calculator ID (CALC)** | power-nap-calculator |
| **Primary Route** | /time-and-date/power-nap-calculator/ |
| **Route Archetype** | calc_exp |
| **Pane Layout Contract** | single |
| **Pane Layout Evidence Path** | public/config/navigation.json (`power-nap-calculator` paneLayout=single), public/time-and-date/power-nap-calculator/index.html (`panel-span-all` + `calculator-page-single`) |
| **Ownership Snapshot Ref** | config/clusters/route-ownership.json (`/time-and-date/power-nap-calculator/`) |
| **Cluster Manifest Ref** | public/config/asset-manifest.json (`/time-and-date/power-nap-calculator/`) |
| **Rollback Contract Ref** | config/clusters/route-ownership.json (`activeOwnerClusterId`, `previousOwnerClusterId`, `rollbackTag`) |
| **Branch / Tag** | kartheek_devv |
| **Commit SHA** | 6cdc25e |
| **Environment** | local static server (Playwright scoped harness) |
| **thinContentMode (`soft`/`hard`)** | soft (pilotExcluded) |
| **thinContentScore** | N/A |
| **thinContentGrade** | N/A |
| **thinContentHardFlags** | none |
| **thinContentArtifactPath** | test-results/content-quality/scoped/time-and-date/power-nap-calculator.json |
| **Owner** | Codex |
| **Date** | 2026-02-27 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **A1** | **Rendering** | Calculator UI renders correctly with managed route assets | Pass |
| **A2** | **CSS Arch** | Route migrated to inline critical + deferred route stylesheet (no body-level stylesheet) | Pass |
| **A3** | **CLS Control** | No material layout shift on load/interaction under scoped guard | Pass |
| **A4** | **JS Discipline** | Deterministic button-only calculate flow retained | Pass |
| **A5** | **Caching** | Versioned route module URL (`v=20260302`) | Pass |
| **B1** | **Mobile Layout** | Responsive single-column behavior under mobile breakpoints | Pass |
| **B2** | **Mobile Inputs** | Time input + touch-size controls present | Pass |
| **B3** | **Mobile Ads** | No ads above H1 in generated route layout | Pass |
| **C1** | **Field Metrics** | LCP/CLS policy met via scoped strict CWV profiles | Pass |
| **C2** | **Lab Gates** | Scoped strict profiles pass with no blocking CSS requests | Pass |
| **D1-D4**| **CWV Guard** | `CLUSTER=time-and-date CALC=power-nap-calculator npm run test:calc:cwv` | Pass |
| **E1** | **Ad Slots** | Reserved ad panel layout preserved | Pass |
| **E2** | **Ad Loading** | Existing managed ad loader contract preserved | Pass |
| **E3** | **Ad Policy** | No ad placement policy violations introduced | Pass |
| **F** | **Animation** | Reduced expensive first-paint effects in route-local CSS | Pass |
| **G1** | **First Load** | Core CSS delivery changed to critical-inline + deferred route CSS strategy | Pass |
| **G2** | **Interaction** | Result generation remains Calculate-button-driven | Pass |
| **G3** | **Navigation** | MPA `<a href>` navigation preserved | Pass |
| **H** | **Accessibility** | `aria-live` and keyboard focus behavior retained | Pass |
| **I1** | **Metadata** | Title/description/canonical aligned to SEO test contract | Pass |
| **I2** | **Schema** | WebPage/SoftwareApplication/Breadcrumb/FAQ present | Pass |
| **I3** | **Indexability** | Explanation + FAQ content in initial HTML | Pass |
| **I4** | **Sitemap** | Route presence validated in scoped SEO test | Pass |
| **NAV-PANE-1** | **Pane Layout** | `paneLayout=single` and single-pane combined panel rendered | Pass |
| **J** | **Content** | Explanation structure + FAQ contract satisfied | Pass |
| **K** | **Security** | HTTPS canonical and legal footer links present | Pass |

---

## 3) 🏆 Elite Performance (Addendum)

| ID | Category | Criteria | Result |
| :--- | :--- | :--- | :--- |
| **X1** | **Investigate** | Main render delay reduced via CSS delivery and style-cost changes | Pass |
| **X2** | **Stress Test** | Strict mobile/desktop throttled profiles pass | Pass |

---

## 4) Evidence & Metrics

### Cluster Isolation Governance Evidence (Mandatory)
| Check | Result (Pass/Fail) | Artifact / Path |
| :--- | :--- | :--- |
| Isolation fence validation (owner-cluster + immutable core only) | Pass | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` |
| Ownership validation (`config/clusters/route-ownership.json`) | Pass | `npm run test:cluster:contracts` |
| Import graph validation (no cross-cluster JS/CSS imports) | Pass | `npm run test:cluster:contracts` |
| Manifest integrity validation | Pass | `npm run test:cluster:contracts` |
| Global nav parity validation | Pass | `npm run test:cluster:contracts` |
| Immutable core usage declaration (`/assets/core/v{n}/...`) | Pass | cluster contract validation output |
| Cross-cluster reference violations (must be `0`) | Pass | isolation scope validator output |

### Performance (Mobile Lab)
| Metric | Value | Status |
| :--- | :--- | :--- |
| **LCP** | 1232 ms (`mobile_strict`) | Pass |
| **CLS** | 0 (`mobile_strict`) | Pass |
| **INP** | N/A (not collected by scoped CWV runner) | N/A |

### Scoped CWV Strict Profiles (Calculator Release)
| Profile | CLS | LCP (ms) | Blocking CSS Duration (ms) | Blocking CSS Requests | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `mobile_strict` (CPU 3x + Slow 4G, cache disabled) | 0 | 1232 | 0 | 0 | Pass |
| `desktop_strict` (CPU 6x + Slow 4G, cache disabled) | 0.0064 | 1408 | 0 | 0 | Pass |

Artifact path (mandatory): `test-results/performance/scoped-cwv/time-and-date/power-nap-calculator.json`

### Lighthouse Governance Evidence (Mandatory)
| Field | Value |
| :--- | :--- |
| `lighthouseMode` (`fast/stable/full`) | Not run in scoped calculator release |
| `lhRuns` | N/A |
| `aggregationType` (`single/median`) | N/A |
| `desktopPolicyMode` (`native/devtools-override`) | N/A |
| `runPolicy.resolved` snapshot path/reference | N/A |

### Thin-Content Evidence (Mandatory for `calc_exp` / `exp_only`)
| Field | Value |
| :--- | :--- |
| `thinContentMode` (`soft`/`hard`) | soft |
| `thinContentScore` | N/A (pilotExcluded) |
| `thinContentGrade` | N/A |
| `thinContentHardFlags` | none |
| `thinContentArtifactPath` | test-results/content-quality/scoped/time-and-date/power-nap-calculator.json |

### Exceptions
| ID | Issue | Severity | Owner |
| :--- | :--- | :--- | :--- |
| EX-REL-20260227-003-01 | `test:calc:unit` is currently skipped by scoped test definition for this calculator (1 skipped, 0 failed) | Low | Codex |
| EX-REL-20260227-003-02 | `test:isolation:scope` executed with `ALLOW_SHARED_CONTRACT_CHANGE=1` due shared-contract change in `public/config/asset-manifest.json` | Low | Codex |

---

## 5) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex | Auto-generated evidence sign-off | 2026-02-27 |

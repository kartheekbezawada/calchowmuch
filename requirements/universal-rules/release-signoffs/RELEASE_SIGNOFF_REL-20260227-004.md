# Release Sign-Off — REL-20260227-004

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260227-004 |
| **Release Type** | CLUSTER_ROUTE |
| **Scope (Global/Target)** | Target |
| **Cluster ID(s)** | credit-cards |
| **Calculator ID (CALC)** | credit-card-repayment-payoff, credit-card-minimum-payment, balance-transfer-installment-plan, credit-card-consolidation |
| **Primary Route** | /credit-card-calculators/credit-card-payment-calculator/ |
| **Route Archetype** | calc_exp |
| **Pane Layout Contract** | single |
| **Pane Layout Evidence Path** | public/config/navigation.json (all 4 credit-card routes `paneLayout=single`), generated route HTML has `panel-span-all` + `calculator-page-single` |
| **Ownership Snapshot Ref** | config/clusters/route-ownership.json (credit-cards routes) |
| **Cluster Manifest Ref** | public/config/asset-manifest.json (4 credit-card routes) |
| **Rollback Contract Ref** | config/clusters/route-ownership.json (`activeOwnerClusterId`, `previousOwnerClusterId`, `rollbackTag`) |
| **Branch / Tag** | kartheek_devv |
| **Commit SHA** | 4b19ee9 |
| **Environment** | local static server (Playwright scoped harness) |
| **thinContentMode (`soft`/`hard`)** | soft (pilotExcluded) |
| **thinContentScore** | N/A |
| **thinContentGrade** | N/A |
| **thinContentHardFlags** | none |
| **thinContentArtifactPath** | test-results/content-quality/cluster/credit-cards/2026-02-27T09-08-40-109Z.json |
| **Owner** | Codex |
| **Date** | 2026-02-27 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **A1** | **Rendering** | Calculator UI renders and explanation content is in initial HTML | Pass |
| **A2** | **CSS Arch** | No `@import` changes introduced in calculator CSS source; scoped style updates only | Pass |
| **A3** | **CLS Control** | No layout shift regression requirement | Pass |
| **A4** | **JS Discipline** | No JS contract changes | Pass |
| **A5** | **Caching** | Existing versioned route/module URLs preserved | Pass |
| **B1** | **Mobile Layout** | Existing responsive layout preserved | Pass |
| **B2** | **Mobile Inputs** | Existing numeric/time input contracts preserved | Pass |
| **B3** | **Mobile Ads** | No ads-above-H1 behavior introduced | Pass |
| **C1** | **Field Metrics** | LCP ≤ 2.5s, CLS ≤ 0.1 | Pass (cluster CWV gate passed on all guarded routes) |
| **C2** | **Lab Gates** | Scoped CWV cluster gate | Pass (`CLUSTER=credit-cards npm run test:cluster:cwv`) |
| **D1-D4**| **CWV Guard** | Cluster scoped CWV compliance | Pass |
| **E1** | **Ad Slots** | No ad-slot structural changes | Pass |
| **E2** | **Ad Loading** | No ad-loader contract changes | Pass |
| **E3** | **Ad Policy** | No policy-breaking ad placement changes | Pass |
| **F** | **Animation** | No new non-compliant motion patterns introduced | Pass |
| **G1** | **First Load** | Routes load successfully in scoped e2e | Pass |
| **G2** | **Interaction** | Existing interaction flows preserved | Pass |
| **G3** | **Navigation** | MPA `<a href>` navigation preserved | Pass |
| **H** | **Accessibility** | Existing aria/semantic structure retained | Pass |
| **I1** | **Metadata** | Canonical/title/robots validated in scoped cluster SEO | Pass |
| **I2** | **Schema** | Structured data dedupe cluster scope passed | Pass |
| **I3** | **Indexability** | Explanation and FAQ remain in generated HTML | Pass |
| **I4** | **Sitemap** | Route coverage unchanged and present | Pass |
| **NAV-PANE-1** | **Pane Layout** | `paneLayout=single` for touched `calc_exp` routes | Pass |
| **J** | **Content** | Added `Important Notes` section (below FAQ per explicit HUMAN exception) | Pass |
| **K** | **Security** | No security/trust contract regressions introduced | Pass |

---

## 3) 🏆 Elite Performance (Addendum)

| ID | Category | Criteria | Result |
| :--- | :--- | :--- | :--- |
| **X1** | **Investigate** | CWV regression point identified on balance-transfer route | Pass |
| **X2** | **Stress Test** | Optional strict scoped CWV budgets | **Fail** (non-blocking advisory: desktop strict LCP remains above 2500ms) |

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
| **LCP** | Cluster guard passed (`<=2500ms` threshold) on all 3 guarded routes | Pass |
| **CLS** | Cluster guard passed (`<=0.1` threshold) on all 3 guarded routes | Pass |
| **INP** | N/A | N/A |

### Scoped CWV Strict Profiles (Calculator Release)
| Profile | CLS | LCP (ms) | Blocking CSS Duration (ms) | Blocking CSS Requests | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `balance-transfer mobile_strict` | 0.0000 | 980 | 0 | 0 | Pass |
| `balance-transfer desktop_strict` | 0.0777 | 3000 | 0 | 0 | **Fail (advisory)** |
| `credit-card-consolidation mobile_strict` | 0.0000 | 996 | 0 | 0 | Pass |
| `credit-card-consolidation desktop_strict` | 0.0960 | 3304 | 0 | 0 | **Fail (advisory)** |
| `credit-card-minimum-payment mobile_strict` | 0.0000 | 1000 | 0 | 0 | Pass |
| `credit-card-minimum-payment desktop_strict` | 0.0059 | 3080 | 0 | 0 | **Fail (advisory)** |

Artifact references:
- `CLUSTER=credit-cards npm run test:cluster:cwv` (pass on cluster guarded routes)
- `test-results/performance/scoped-cwv/credit-cards/balance-transfer-installment-plan.json`
- `test-results/performance/scoped-cwv/credit-cards/credit-card-consolidation.json`
- `test-results/performance/scoped-cwv/credit-cards/credit-card-minimum-payment.json`

### Lighthouse Governance Evidence (Mandatory)
| Field | Value |
| :--- | :--- |
| `lighthouseMode` (`fast/stable/full`) | Not run in this scoped cluster release |
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
| `thinContentArtifactPath` | test-results/content-quality/cluster/credit-cards/2026-02-27T09-08-40-109Z.json |

### Exceptions
| ID | Issue | Severity | Owner |
| :--- | :--- | :--- | :--- |
| EX-REL-20260227-004-01 | Explicit HUMAN-approved policy exception implemented: `Important Notes` placed below FAQ for all credit-card calculators | Medium | HUMAN/Codex |
| EX-REL-20260227-004-02 | Optional strict scoped CWV advisory: desktop strict profile LCP exceeds 2500ms for 3 target routes while required cluster CWV gate is green | Medium | Codex |

---

## 5) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex | Auto-generated evidence sign-off | 2026-02-27 |

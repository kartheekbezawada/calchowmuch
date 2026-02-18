# Release Sign-Off — REL-20260218-003

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260218-003 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Scoped Only (percentage cluster + percentage-increase calculator) |
| **Cluster ID(s)** | percentage |
| **Calculator ID (CALC)** | percentage-increase |
| **Primary Route** | /percentage-calculators/percentage-increase/ |
| **Ownership Snapshot Ref** | `config/clusters/route-ownership.json` |
| **Cluster Manifest Ref** | `clusters/percentage/config/asset-manifest.json` |
| **Rollback Contract Ref** | `config/clusters/route-ownership.json` |
| **Branch / Tag** | local working branch |
| **Commit SHA** | working tree (no commit in this sign-off step) |
| **Environment** | local |
| **Owner** | Codex agent |
| **Date** | 2026-02-18 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| A1 | Rendering | Target route generated and renders | Pass |
| A2 | CSS Arch | Route bundles built for target route | Pass |
| A3 | Pane Layout | `calc_exp` route uses `paneLayout: single` | Pass |
| A4 | DOM Contract | Combined pane + modern explanation contract present | Pass |
| C1 | Field Metrics | Scoped calculator CWV thresholds | Pass |
| D1-D4 | CWV Guard | `CLUSTER=percentage CALC=percentage-increase npm run test:calc:cwv` | Pass |
| I1 | Metadata | Scoped SEO gate passed | Pass |
| I2 | Schema | Scoped SEO gate validated FAQ/WebPage/SoftwareApplication/Breadcrumb | Pass |
| I4 | Sitemap | Scoped SEO gate confirmed sitemap contains route | Pass |
| GOV-1 | Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass |
| GOV-2 | Cluster Contracts | `npm run test:cluster:contracts` | Pass |

---

## 3) Scoped Command Evidence (Mandatory)

| Command | Result | Notes |
| :--- | :--- | :--- |
| `npm run build:css:route-bundles` | Pass | Route bundle manifest regenerated including percentage-increase |
| `TARGET_ROUTE=/percentage-calculators/percentage-increase/ node scripts/generate-mpa-pages.js` | Pass | Scoped generation complete for target route |
| `CLUSTER=percentage npm run test:cluster:unit` | Pass | 2 files, 11 tests passed |
| `CLUSTER=percentage npm run test:cluster:e2e` | Pass | 1 spec passed |
| `CLUSTER=percentage npm run test:cluster:seo` | Pass | 1 spec passed |
| `CLUSTER=percentage npm run test:cluster:cwv` | Pass | 1 spec passed |
| `CLUSTER=percentage CALC=percentage-increase npm run test:calc:unit` | Pass | 1 file, 5 tests passed |
| `CLUSTER=percentage CALC=percentage-increase npm run test:calc:e2e` | Pass | 2 specs passed |
| `CLUSTER=percentage CALC=percentage-increase npm run test:calc:seo` | Pass | Metadata/schema/sitemap + explanation parity checks passed |
| `CLUSTER=percentage CALC=percentage-increase npm run test:calc:cwv` | Pass | Strict mobile+desktop scoped CWV guard passed; artifact generated |
| `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | Shared-contract change mode used as required |
| `npm run test:cluster:contracts` | Pass | Cluster contract validation passed |

---

## 4) Manual Acceptance Evidence

### UI structure checks
| Check | Result | Evidence |
| :--- | :--- | :--- |
| Single-pane combined layout present | Pass | `public/percentage-calculators/percentage-increase/index.html` includes `panel-span-all` and `calculator-page-single` |
| Scenario Summary section absent | Pass | No `Scenario Summary` in generated route |
| Results table uses PV style family | Pass | `#pct-inc-explanation .pv-results-table` present |
| FAQ uses card-grid style | Pass | 10 `.bor-faq-card` present |
| Explanation uses bullets + formula + steps | Pass | `ul.pv-explanation-list`, `.pv-formula-block`, `ol.pv-formula-steps` present |

### Functional samples
| Case | Result | Evidence |
| :--- | :--- | :--- |
| 80 -> 100 => +25.00% | Pass | `PINC-TEST-E2E-1` |
| 100 -> 80 => -20.00% | Pass | `PINC-TEST-E2E-1` |
| 0 -> 100 guard | Pass | `PINC-TEST-E2E-2` |

### SEO/schema parity
| Check | Result | Evidence |
| :--- | :--- | :--- |
| Title/meta/canonical present | Pass | `PINC-TEST-SEO-1` |
| FAQ count 10 | Pass | `PINC-TEST-SEO-1` |
| JSON-LD contains FAQ/WebPage/SoftwareApplication/Breadcrumb | Pass | `PINC-TEST-SEO-1` |
| Sitemap includes route | Pass | `PINC-TEST-SEO-1` |

---

## 5) Performance (Scoped CWV)

Artifact: `test-results/performance/scoped-cwv/percentage/percentage-increase.json`

| Profile | CLS | LCP (ms) | Blocking CSS Duration (ms) | Blocking CSS Requests | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `mobile_strict` (CPU 3x + Slow 4G, cache disabled) | 0.00 | 1216 | 0 | 0 | Pass |
| `desktop_strict` (CPU 6x + Slow 4G, cache disabled) | 0.00 | 1400 | 0 | 0 | Pass |

---

## 6) Exceptions

No active exceptions.

---

## 7) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

Release decision basis:
1. Scoped cluster and calculator gates passed.
2. Scoped CWV hard blockers passed.
3. Isolation scope (shared-contract mode) + cluster contracts passed.

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-18 |

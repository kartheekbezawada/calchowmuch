# Release Sign-Off — REL-20260219-011

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260219-011 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Scoped Only (percentage cluster + percent-to-fraction-decimal calculator) |
| **Cluster ID(s)** | percentage |
| **Calculator ID (CALC)** | percent-to-fraction-decimal |
| **Primary Route** | /percentage-calculators/percent-to-fraction-decimal-calculator/ |
| **Route Archetype** | calc_exp |
| **Pane Layout Contract** | single |
| **Pane Layout Evidence Path** | `public/config/navigation.json`, `public/percentage-calculators/percent-to-fraction-decimal-calculator/index.html` |
| **Ownership Snapshot Ref** | `config/clusters/route-ownership.json` |
| **Cluster Manifest Ref** | `clusters/percentage/config/asset-manifest.json` |
| **Rollback Contract Ref** | `config/clusters/route-ownership.json` (`rollbackTag=pre-percent-to-fraction-decimal-wave7-20260219`) |
| **Branch / Tag** | local working branch |
| **Commit SHA** | working tree (no commit in sign-off step) |
| **Environment** | local |
| **Owner** | Codex agent |
| **Date** | 2026-02-19 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| A1 | Rendering | Target route generated and renders | Pass |
| A2 | CSS Arch | Route bundle + critical CSS contract generated; no `@import` | Pass |
| A3 | Pane Layout | `calc_exp` route uses `paneLayout: single` | Pass |
| A4 | DOM Contract | Combined pane contract present (`panel-span-all`, `calculator-page-single`) | Pass |
| C1 | Field Metrics | Scoped calculator CWV thresholds | Pass |
| D1-D4 | CWV Guard | `CLUSTER=percentage CALC=percent-to-fraction-decimal npm run test:calc:cwv` | Pass |
| I1 | Metadata | Scoped SEO gate passed | Pass |
| I2 | Schema | Scoped SEO gate validated FAQ/WebPage/SoftwareApplication/Breadcrumb | Pass |
| I4 | Sitemap | Scoped SEO gate confirmed sitemap contains route | Pass |
| GOV-1 | Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass |
| GOV-2 | Cluster Contracts | `npm run test:cluster:contracts` | Pass |

---

## 3) Scoped Command Evidence (Mandatory)

| Command | Result | Notes |
| :--- | :--- | :--- |
| `npm run build:css:route-bundles` | Pass | Route bundles regenerated including percent-to-fraction-decimal |
| `GENERATE_ALL_ROUTES=1 node scripts/generate-mpa-pages.js` | Pass | Generated public route + manifests |
| `CLUSTER=percentage CALC=percent-to-fraction-decimal npm run test:calc:unit` | Pass | 1 file, 4 tests passed |
| `CLUSTER=percentage CALC=percent-to-fraction-decimal npm run test:calc:e2e` | Pass | 2 specs passed |
| `CLUSTER=percentage CALC=percent-to-fraction-decimal npm run test:calc:seo` | Pass | Metadata/schema/sitemap checks passed |
| `CLUSTER=percentage CALC=percent-to-fraction-decimal npm run test:calc:cwv` | Pass | Scoped CWV guard + budget validator passed |
| `CLUSTER=percentage npm run test:cluster:unit` | Pass | 2 files, 11 tests passed |
| `CLUSTER=percentage npm run test:cluster:e2e` | Pass | 1 spec passed |
| `CLUSTER=percentage npm run test:cluster:seo` | Pass | 1 spec passed |
| `CLUSTER=percentage npm run test:cluster:cwv` | Pass | 1 spec passed |
| `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | Shared-contract mode used for approved shared files |
| `npm run test:cluster:contracts` | Pass | Cluster contract validation passed |

---

## 4) Manual Acceptance Evidence

### UI structure checks
| Check | Result | Evidence |
| :--- | :--- | :--- |
| Single-pane combined layout present | Pass | `public/percentage-calculators/percent-to-fraction-decimal-calculator/index.html` contains `panel-span-all` + `calculator-page-single` |
| Modern explanation table present | Pass | `#ptfd-explanation .pv-results-table` rendered |
| FAQ card-grid present (10 cards) | Pass | `#ptfd-explanation .bor-faq-card` count = 10 |
| Legacy explanation artifacts removed | Pass | No `Scenario Summary` text and no `#ptfd-explanation .faq-box` |

### Functional samples
| Case | Result | Evidence |
| :--- | :--- | :--- |
| `12.5% -> decimal 0.125, fraction 1/8` | Pass | `PTFD-TEST-E2E-1` |
| `-25 -> decimal -0.25, fraction -1/4` | Pass | `PTFD-TEST-E2E-1` |
| Invalid input guard copy | Pass | `PTFD-TEST-E2E-2` |

### SEO/schema parity
| Check | Result | Evidence |
| :--- | :--- | :--- |
| Title/meta/canonical present | Pass | `PTFD-TEST-SEO-1` |
| FAQ count 10 | Pass | `PTFD-TEST-SEO-1` |
| JSON-LD contains FAQ/WebPage/SoftwareApplication/Breadcrumb | Pass | `PTFD-TEST-SEO-1` |
| Sitemap includes route | Pass | `PTFD-TEST-SEO-1` |

---

## 5) Performance (Scoped CWV)

Artifact: `test-results/performance/scoped-cwv/percentage/percent-to-fraction-decimal.json`

| Profile | CLS | LCP (ms) | Blocking CSS Duration (ms) | Blocking CSS Requests | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `mobile_strict` (CPU 3x + Slow 4G, cache disabled) | 0.0016 | 1156 | 0 | 0 | Pass |
| `desktop_strict` (CPU 6x + Slow 4G, cache disabled) | 0.0067 | 1444 | 0 | 0 | Pass |

---

## 6) Scope Contract Evidence

Approved target and deltas implemented:
- onboarding: route ownership + percentage cluster asset manifest + cluster nav route URL,
- navigation contract: `paneLayout` migrated to `single` for `percent-to-fraction-decimal`,
- redesign: calculator fragment, explanation fragment, module wiring, route-level calculator CSS,
- generated outputs: route bundles/manifests + generated public route page.

---

## 7) Exceptions

No active release exceptions.

---

## 8) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

Release decision basis:
1. Target route onboarding completed in ownership + manifest + nav contracts.
2. Full redesign shipped with single-pane migration and updated explanation UX contract.
3. Scoped calc/cluster/governance gates passed with CWV artifact evidence.

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-19 |

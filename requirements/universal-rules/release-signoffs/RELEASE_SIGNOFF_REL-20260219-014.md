# Release Sign-Off — REL-20260219-014

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260219-014 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Scoped Only (percentage cluster + percentage-finder-calculator) |
| **Cluster ID(s)** | percentage |
| **Calculator ID (CALC)** | what-percent-is-x-of-y |
| **Primary Route** | /percentage-calculators/percentage-finder-calculator/ |
| **Route Archetype** | calc_exp |
| **Pane Layout Contract** | single |
| **Pane Layout Evidence Path** | `public/config/navigation.json`, `public/percentage-calculators/percentage-finder-calculator/index.html` |
| **Ownership Snapshot Ref** | `config/clusters/route-ownership.json` |
| **Cluster Manifest Ref** | `clusters/percentage/config/asset-manifest.json` |
| **Rollback Contract Ref** | `config/clusters/route-ownership.json` (`rollbackTag=pre-what-percent-is-x-of-y-wave8-20260219`) |
| **Branch / Tag** | local working branch |
| **Commit SHA** | `f8f177e` |
| **Environment** | local |
| **Owner** | Codex agent |
| **Date** | 2026-02-19 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| A1 | Rendering | Target route renders with calc + explanation content | Pass |
| A2 | CSS Arch | Route-level CSS contract enabled via manifest/deferred loading | Pass |
| A3 | Pane Layout | `calc_exp` route uses `paneLayout: single` | Pass |
| A4 | DOM Contract | Combined panel contract present (`panel-span-all`, `calculator-page-single`) | Pass |
| C1 | Field Metrics | Scoped calculator CWV thresholds | Pass |
| D1-D4 | CWV Guard | `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:cwv` | Pass |
| I1 | Metadata | Scoped SEO gate passed | Pass |
| I2 | Schema | Scoped SEO gate validated FAQ/WebPage/SoftwareApplication/Breadcrumb | Pass |
| I4 | Sitemap | Scoped SEO gate confirmed route in sitemap | Pass |
| GOV-1 | Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass |
| GOV-2 | Cluster Contracts | `npm run test:cluster:contracts` | Pass |

---

## 3) Scoped Command Evidence (Mandatory)

| Command | Result | Notes |
| :--- | :--- | :--- |
| `npm run build:css:route-bundles` | Pass | Route bundle manifest refreshed |
| `TARGET_ROUTE=/percentage-calculators/percentage-finder-calculator/ node scripts/generate-mpa-pages.js` | Pass | Regenerated target route after single-pane/manifest updates |
| `CLUSTER=percentage npm run test:cluster:unit` | Pass | 2 files, 11 tests passed |
| `CLUSTER=percentage npm run test:cluster:e2e` | Pass | 1 spec passed |
| `CLUSTER=percentage npm run test:cluster:seo` | Pass | 1 spec passed |
| `CLUSTER=percentage npm run test:cluster:cwv` | Pass | 1 spec passed |
| `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:unit` | Pass | 1 file, 19 tests passed |
| `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:e2e` | Pass | 2 specs passed |
| `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:seo` | Pass | Metadata/schema/sitemap checks passed |
| `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:cwv` | Pass | Scoped CWV guard + strict profile budget validator passed |
| `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | Shared-contract mode used for approved shared contract files |
| `npm run test:cluster:contracts` | Pass | Cluster contract validation passed |

---

## 4) Manual Acceptance Evidence

### UI structure checks
| Check | Result | Evidence |
| :--- | :--- | :--- |
| Single-pane combined layout present | Pass | `public/percentage-calculators/percentage-finder-calculator/index.html` contains `panel-span-all` + `calculator-page-single` |
| Migrated explanation table present | Pass | `#wpxy-explanation .pv-results-table` rendered |
| FAQ card-grid present (10 cards) | Pass | `#wpxy-explanation .bor-faq-card` count = 10 |
| Legacy explanation artifacts removed | Pass | No `Scenario Summary` text and no `#wpxy-explanation .faq-box` |

### Functional samples
| Case | Result | Evidence |
| :--- | :--- | :--- |
| `25` of `200` returns `12.50%` | Pass | `WPXY-TEST-E2E-1` |
| Invalid inputs show validation copy | Pass | `WPXY-TEST-E2E-2` |
| `Y = 0` triggers undefined guard | Pass | `WPXY-TEST-E2E-2` |

### SEO/schema parity
| Check | Result | Evidence |
| :--- | :--- | :--- |
| Title/meta/canonical present | Pass | `WPXY-TEST-SEO-1` |
| JSON-LD includes FAQ/WebPage/SoftwareApplication/Breadcrumb | Pass | `WPXY-TEST-SEO-1` |
| FAQ count = 10 | Pass | `WPXY-TEST-SEO-1` |
| Sitemap includes route | Pass | `WPXY-TEST-SEO-1` |

---

## 5) Performance (Scoped CWV)

Artifact: `test-results/performance/scoped-cwv/percentage/what-percent-is-x-of-y.json`

| Profile | CLS | LCP (ms) | Blocking CSS Duration (ms) | Blocking CSS Requests | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `mobile_strict` (CPU 3x + Slow 4G, cache disabled) | 0.0000 | 536 | 0 | 0 | Pass |
| `desktop_strict` (CPU 6x + Slow 4G, cache disabled) | 0.0059 | 0 | 0 | 0 | Pass |

---

## 6) Scope Contract Evidence

In-scope changes delivered for `percentage-finder-calculator` onboarding:
- route ownership contract entry added,
- percentage cluster navigation URL canonicalized to finder route,
- percentage cluster asset-manifest route contract added,
- public navigation paneLayout set to `single` for `what-percent-is-x-of-y`,
- calculator explanation migrated to modern table/FAQ-card structure with route CSS,
- calculator e2e scope replaced from skipped placeholder to active assertions,
- target route regenerated and validated with scoped gates.

Approved scope expansion used:
- `scripts/generate-mpa-pages.js` updated to enforce single-pane generation for `what-percent-is-x-of-y` to keep output durable.

Note:
- Unrelated dirty files existed in the working tree and were explicitly ignored per HUMAN instruction.

---

## 7) Exceptions

No active release exceptions.

---

## 8) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

Release decision basis:
1. Target route is onboarded into percentage ownership + cluster manifest contracts.
2. Single-pane contract is enforced and verified in generated HTML + E2E coverage.
3. Scoped cluster/calc/governance gates pass with strict CWV artifact evidence.

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-19 |

# Release Sign-Off — REL-20260218-001

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260218-001 |
| **Release Type** | CLUSTER_ROUTE |
| **Scope (Global/Target)** | Scoped Only (percentage cluster + percent-change calculator) |
| **Cluster ID(s)** | percentage |
| **Calculator ID (CALC)** | percent-change |
| **Primary Route** | /percentage-calculators/percent-change/ |
| **Ownership Snapshot Ref** | `config/clusters/route-ownership.json` |
| **Cluster Manifest Ref** | `clusters/percentage/config/asset-manifest.json` |
| **Rollback Contract Ref** | `config/clusters/route-ownership.json` (`previousOwnerClusterId=legacy-shared`, `rollbackTag=pre-percentage-wave1-20260218`) |
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
| A3 | CLS Control | Scoped calculator CWV CLS <= 0.10 | Pass |
| A4 | JS Discipline | Scoped e2e flow stable | Pass |
| B1 | Mobile Layout | No regressions detected in scoped tests | Pass |
| C1 | Field Metrics | Scoped calculator CWV thresholds | Pass |
| D1-D4 | CWV Guard | `CLUSTER=percentage CALC=percent-change npm run test:calc:cwv` | Pass |
| I1 | Metadata | Scoped SEO gate passed | Pass |
| I2 | Schema | Scoped SEO gate validated FAQ/WebPage/SoftwareApplication/Breadcrumb | Pass |
| I4 | Sitemap | Scoped SEO gate confirmed sitemap contains route | Pass |
| GOV-1 | Isolation Scope | `npm run test:isolation:scope` | Pass |
| GOV-2 | Cluster Contracts | `npm run test:cluster:contracts` | Pass |

---

## 3) Scoped Command Evidence (Mandatory)

| Command | Result | Notes |
| :--- | :--- | :--- |
| `npm run build:css:route-bundles` | Pass | Route bundle manifest regenerated |
| `TARGET_ROUTE=/percentage-calculators/percent-change/ node scripts/generate-mpa-pages.js` | Pass | Scoped generation complete for 1 route |
| `CLUSTER=percentage npm run test:cluster:unit` | Pass | 2 files, 11 tests passed |
| `CLUSTER=percentage npm run test:cluster:e2e` | Pass | 1 spec passed (after clearing stale port 8001 process) |
| `CLUSTER=percentage npm run test:cluster:seo` | Pass | 1 spec passed |
| `CLUSTER=percentage npm run test:cluster:cwv` | Pass | 1 spec passed |
| `CLUSTER=percentage CALC=percent-change npm run test:calc:unit` | Pass | 1 file, 5 tests passed |
| `CLUSTER=percentage CALC=percent-change npm run test:calc:e2e` | Pass | Functional scenario checks passed |
| `CLUSTER=percentage CALC=percent-change npm run test:calc:seo` | Pass | Metadata/schema/sitemap checks passed |
| `CLUSTER=percentage CALC=percent-change npm run test:calc:cwv` | Pass | Strict mobile+desktop scoped CWV guard passed; artifact generated |
| `npm run test:isolation:scope` | Pass | Isolation scope validator passed |
| `npm run test:cluster:contracts` | Pass | Cluster contract validation passed |

---

## 4) Manual Acceptance Evidence

### UI structure checks
| Check | Result | Evidence |
| :--- | :--- | :--- |
| Scenario Summary section absent | Pass | `SCENARIO_SUMMARY_ABSENT` check on source + generated route |
| Results table uses PV style family | Pass | `table.pv-results-table` present |
| FAQ uses card-grid style | Pass | `.bor-faq-grid` + 10 `.bor-faq-card` present |
| Explanation uses bullets + formula + steps | Pass | `ul.pv-explanation-list`, `.pv-formula-block`, `ol.pv-formula-steps` present |

### Functional samples
| Case | Result | Evidence |
| :--- | :--- | :--- |
| 50 -> 60 => +20.00% Increase | Pass | `PCHG-TEST-E2E-1` |
| 100 -> 80 => -20.00% Decrease | Pass | `PCHG-TEST-E2E-1` |
| 0 -> 80 guard | Pass | `PCHG-TEST-E2E-1` |

### SEO/schema parity
| Check | Result | Evidence |
| :--- | :--- | :--- |
| Title/meta/canonical present | Pass | `PCHG-TEST-SEO-1` |
| FAQ count 10 | Pass | `PCHG-TEST-SEO-1` |
| JSON-LD contains FAQ/WebPage/SoftwareApplication/Breadcrumb | Pass | `PCHG-TEST-SEO-1` |
| Sitemap includes route | Pass | `PCHG-TEST-SEO-1` |

---

## 5) Cluster Isolation Governance Evidence

| Check | Result (Pass/Fail) | Artifact / Path |
| :--- | :--- | :--- |
| Ownership validation | Pass | `config/clusters/route-ownership.json` |
| Rollback contract presence | Pass | `config/clusters/route-ownership.json` |
| Cluster registry presence | Pass | `config/clusters/cluster-registry.json` |
| Cluster manifest presence | Pass | `clusters/percentage/config/asset-manifest.json` |
| Cluster nav presence | Pass | `clusters/percentage/config/navigation.json` |
| Cluster contract validator | Pass | `npm run test:cluster:contracts` |
| Isolation scope validator | Pass | `npm run test:isolation:scope` |

---

## 6) Performance (Scoped CWV)

Artifact: `test-results/performance/scoped-cwv/percentage/percent-change.json`

| Profile | CLS | LCP (ms) | Blocking CSS Duration (ms) | Blocking CSS Requests | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `mobile_strict` (CPU 3x + Slow 4G, cache disabled) | 0.00 | 1128 | 0 | 0 | Pass |
| `desktop_strict` (CPU 6x + Slow 4G, cache disabled) | 0.00 | 1352 | 0 | 0 | Pass |

---

## 7) Exceptions

No active exceptions.

---

## 8) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

Release decision basis:
1. Scoped cluster and calculator gates passed.
2. Scoped CWV hard blockers passed.
3. Isolation scope + cluster contracts passed.

Rollback readiness:
- Route ownership rollback fields are present (`previousOwnerClusterId`, `rollbackTag`) in `config/clusters/route-ownership.json`.

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-18 |

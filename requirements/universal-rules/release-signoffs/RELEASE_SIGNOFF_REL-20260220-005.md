# Release Sign-Off — REL-20260220-005

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260220-005 |
| **Release Type** | CLUSTER_SHARED |
| **Scope (Global/Target)** | Scoped Only (`time-and-date` cluster groundwork contracts) |
| **Cluster ID(s)** | time-and-date |
| **Calculator ID (CALC)** | N/A (groundwork release) |
| **Primary Route** | `/time-and-date/**` (12 routes ownership bootstrap) |
| **Ownership Snapshot Ref** | `config/clusters/route-ownership.json` |
| **Cluster Manifest Ref** | `clusters/time-and-date/config/asset-manifest.json` |
| **Navigation Contract Ref** | `clusters/time-and-date/config/navigation.json` |
| **Branch / Tag** | local working branch |
| **Commit SHA** | `d7466f5` |
| **Environment** | local |
| **Owner** | Codex agent |
| **Date** | 2026-02-20 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| GOV-1 | Cluster Registry | `time-and-date` set to `migrating` + `contractsEnabled=true` + explicit homepage intent | Pass |
| GOV-2 | Route Ownership | All 12 `/time-and-date/**` routes have ownership + rollback contract fields | Pass |
| GOV-3 | Cluster Nav Contract | `clusters/time-and-date/config/navigation.json` exists with global parity destinations | Pass |
| GOV-4 | Cluster Asset Manifest | `clusters/time-and-date/config/asset-manifest.json` exists with route-level ownership entries | Pass |
| GOV-5 | Scoped Scope Map | `time-and-date` test scope normalized to include all 12 calculators | Pass |
| GOV-6 | Contract Validator | `npm run test:cluster:contracts` | Pass |
| SEO-1 | Sitemap Coverage | All 12 `/time-and-date/**` routes present in `public/sitemap.xml` | Pass |

---

## 3) Scoped Command Evidence (Mandatory)

| Command | Result | Notes |
| :--- | :--- | :--- |
| `npm run test:cluster:contracts` | Pass | `Cluster contract validation passed.` |
| `CLUSTER=time-and-date npm run test:cluster:unit` | Pass | 1 passed, 1 skipped (`unit.cluster.test.js` skipped) |
| `CLUSTER=time-and-date npm run test:cluster:e2e` | Pass | 1 spec passed |
| `CLUSTER=time-and-date npm run test:cluster:seo` | Pass | 1 spec passed |
| `CLUSTER=time-and-date npm run test:cluster:cwv` | Pass | 1 spec passed |
| `CLUSTER=time-and-date npm run test:schema:dedupe -- --scope=cluster` | Pass | scanned=12 changed=0 parseErrors=0 unresolved=0 |

---

## 4) Manual Acceptance Evidence

| Check | Result | Evidence |
| :--- | :--- | :--- |
| All 12 routes are in ownership contract | Pass | `config/clusters/route-ownership.json` |
| All 12 routes are in cluster manifest | Pass | `clusters/time-and-date/config/asset-manifest.json` |
| All 12 routes are in scoped test map | Pass | `config/testing/test-scope-map.json` |
| All 12 routes are in sitemap | Pass | `public/sitemap.xml` (manual verification, missing=0) |

---

## 5) Scope Contract Evidence

Delivered only within approved groundwork scope:
- Added migration doc: `requirements/universal-rules/TIME_AND_DATE_CLUSTER_MIGRATION_PLAN.md`
- Updated registry/ownership/scope-map contracts
- Added `clusters/time-and-date/config/navigation.json`
- Added `clusters/time-and-date/config/asset-manifest.json`
- No calculator route UI/module/template files were modified

---

## 6) Exceptions

No active release exceptions.

---

## 7) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

Release decision basis:
1. `time-and-date` cluster contracts are now fully bootstrapped and validated.
2. Scoped cluster governance gates passed.
3. Sitemap and URL continuity are preserved for all 12 routes.

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-20 |

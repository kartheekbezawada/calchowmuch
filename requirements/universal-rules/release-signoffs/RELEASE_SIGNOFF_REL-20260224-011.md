# Release Sign-Off — REL-20260224-011

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260224-011 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Mortgage calculator scoped release process |
| **Cluster ID(s)** | `loans` |
| **Calculator ID (CALC)** | `home-loan` |
| **Primary Route** | `/loan-calculators/mortgage-calculator/` |
| **Route Archetype** | `calc_exp` |
| **Pane Layout Contract** | `single` |
| **Pane Layout Evidence Path** | `public/loan-calculators/mortgage-calculator/index.html` (`panel-span-all`, `calculator-page-single`) |
| **Ownership Snapshot Ref** | `config/clusters/route-ownership.json` |
| **Cluster Manifest Ref** | `clusters/loans/config/asset-manifest.json` |
| **Rollback Contract Ref** | Revert scoped mortgage files + this sign-off entry |
| **Branch / Tag** | `main` |
| **Commit SHA** | `badb651` |
| **Environment** | local |
| **Owner** | Codex agent |
| **Date** | 2026-02-24 |

---

## 2) Scoped Gate Results

| Gate | Command | Result |
| :--- | :--- | :--- |
| Build | `TARGET_CALC_ID=home-loan node scripts/generate-mpa-pages.js` | Pass (manual route skip reported by generator) |
| Calc Unit | `CLUSTER=loans CALC=home-loan npm run test:calc:unit` | Pass |
| Calc E2E | `CLUSTER=loans CALC=home-loan npm run test:calc:e2e` | Pass |
| Calc SEO | `CLUSTER=loans CALC=home-loan npm run test:calc:seo` | Pass (placeholder spec skipped) |
| Calc CWV | `CLUSTER=loans CALC=home-loan npm run test:calc:cwv` | Pass |
| Cluster Unit | `CLUSTER=loans npm run test:cluster:unit` | Pass |
| Cluster E2E | `CLUSTER=loans npm run test:cluster:e2e` | **Fail** |
| Cluster SEO | `CLUSTER=loans npm run test:cluster:seo` | Pass |
| Cluster CWV | `CLUSTER=loans npm run test:cluster:cwv` | **Fail** |
| Isolation Scope | `npm run test:isolation:scope` | **Fail** |
| Isolation Scope (shared-contract opt-in) | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass (strict check skipped by policy flag) |
| Cluster Contracts | `npm run test:cluster:contracts` | Pass |
| Schema Dedupe (calc scope) | `CLUSTER=loans CALC=home-loan npm run test:schema:dedupe -- --scope=calc` | Pass |

---

## 3) Key Evidence

- Scoped CWV artifact: `test-results/performance/scoped-cwv/loans/home-loan.json`
  - `mobile_strict`: CLS `0`, LCP `1756ms`, blocking CSS duration `234.5ms`, requests `1`
  - `desktop_strict`: CLS `0`, LCP `2032ms`, blocking CSS duration `227.5ms`, requests `1`
- Cluster E2E failure artifact:
  - `test-results/loans-cluster_release-e2e.-b8c5f-le-H1-and-no-console-errors-chromium/error-context.md`
- Cluster CWV failure artifact:
  - `test-results/loans-cluster_release-cwv.-abe45--satisfy-CLS-LCP-thresholds-chromium/error-context.md`

---

## 4) Hard-Blocker Details

1. `test:cluster:e2e` failed due console/runtime errors on representative non-target routes (`/loans/buy-to-let/`, `/loans/car-loan/`) with 404 module/css assets.
2. `test:cluster:cwv` failed on non-target route `/loans/car-loan/` with CLS `0.1258` (> `0.10` threshold).
3. `test:isolation:scope` failed without override because shared-contract files are currently modified in the working tree; it passes only with `ALLOW_SHARED_CONTRACT_CHANGE=1`.

---

## 5) Final Sign-Off

**Decision:** [ ] APPROVED / [x] REJECTED

Release decision basis:
1. Target mortgage calculator scoped gates (`calc:*`) pass after E2E spec alignment to current UX.
2. Mandatory `CLUSTER_ROUTE_SINGLE_CALC` hard gates are not fully green because cluster-level E2E and CWV gates fail.
3. Release is not merge-ready until cluster hard blockers are resolved or scope/release policy is explicitly changed by HUMAN.

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-24 |


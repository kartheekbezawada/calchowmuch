# Release Sign-Off — REL-20260224-012

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260224-012 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | How Much Can I Borrow calculator scoped release process |
| **Cluster ID(s)** | `loans` |
| **Calculator ID (CALC)** | `how-much-can-i-borrow` |
| **Primary Route** | `/loan-calculators/how-much-can-i-borrow/` |
| **Route Archetype** | `calc_exp` |
| **Pane Layout Contract** | `single` |
| **Pane Layout Evidence Path** | `public/loan-calculators/how-much-can-i-borrow/index.html` (`panel-span-all`, `calculator-page-single`) |
| **Ownership Snapshot Ref** | `config/clusters/route-ownership.json` |
| **Cluster Manifest Ref** | `clusters/loans/config/asset-manifest.json` |
| **Rollback Contract Ref** | Revert scoped test-pack edits + this sign-off entry |
| **Branch / Tag** | `main` |
| **Commit SHA** | `6c4db9c` |
| **Environment** | local |
| **thinContentMode (`soft`/`hard`)** | `hard` |
| **thinContentScore** | `63` |
| **thinContentGrade** | `Weak` |
| **thinContentHardFlags** | `No worked example detected`; `Content similarity above 80%` |
| **thinContentArtifactPath** | `test-results/content-quality/scoped/loans/how-much-can-i-borrow.json` |
| **Owner** | Codex agent |
| **Date** | 2026-02-24 |

---

## 2) Scoped Gate Results

| Gate | Command | Result |
| :--- | :--- | :--- |
| Calc Unit | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:unit` | Pass |
| Calc E2E | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:e2e` | Pass |
| Calc SEO + Thin Content Hard Mode | `CLUSTER=loans CALC=how-much-can-i-borrow THIN_CONTENT_MODE=hard THIN_CONTENT_SOFT_PILOT_ONLY=0 npm run test:calc:seo` | **Fail** (SEO assertions pass, thin-content hard gate fails) |
| Calc CWV | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:cwv` | **Fail** (strict scoped CWV budget) |
| Cluster Unit | `CLUSTER=loans npm run test:cluster:unit` | Pass |
| Cluster E2E | `CLUSTER=loans npm run test:cluster:e2e` | **Fail** |
| Cluster SEO | `CLUSTER=loans npm run test:cluster:seo` | Pass |
| Cluster CWV | `CLUSTER=loans npm run test:cluster:cwv` | **Fail** |
| Cluster Contracts | `CLUSTER=loans npm run test:cluster:contracts` | Pass |

---

## 3) Key Evidence

- Thin-content hard-mode result for `/loan-calculators/how-much-can-i-borrow/`:
  - Score: `63` (`Weak`), threshold `70`, status `fail`
  - Flags: missing required `How to Guide -> Important Notes -> FAQ` sequence; edge-case coverage partial; overlap risk
  - Hard flags: no worked example; similarity >80%
- Scoped CWV strict report path: `test-results/performance/scoped-cwv/loans/how-much-can-i-borrow.json`
  - `mobile_strict`: CLS `0`, LCP `1264ms`, blocking CSS duration `1160.9ms`, requests `3` (fail)
  - `desktop_strict`: CLS `0.0777`, LCP `1356ms`, blocking CSS duration `1170.7ms`, requests `3` (fail)
- Cluster E2E failure: representative routes produce console/runtime 404s on legacy `/calculators/loans/.../{calculator.css,module.js}` asset paths.
- Cluster CWV failure: `/loans/car-loan/` CLS `0.1258` exceeds `0.10` threshold.

---

## 4) Hard-Blocker Details

1. Thin-content hard gate fails for target route (`63 < 70`) with hard flags present.
2. Scoped calc strict CWV budget fails due blocking CSS duration and request-count limits.
3. Mandatory cluster E2E hard gate fails with 404 console errors on representative non-target loan routes.
4. Mandatory cluster CWV hard gate fails on `/loans/car-loan/` CLS threshold breach.

---

## 5) Final Sign-Off

**Decision:** [ ] APPROVED / [x] REJECTED

Release decision basis:
1. Target calc unit/e2e/seo assertions are green after canonical-route test-pack normalization and placeholder removal.
2. HARD release gates are not fully green (`calc:seo` thin-content hard fail, `calc:cwv`, `cluster:e2e`, `cluster:cwv`).
3. Release is not merge-ready until hard blockers are resolved or release policy/scope is explicitly changed by HUMAN.

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-24 |

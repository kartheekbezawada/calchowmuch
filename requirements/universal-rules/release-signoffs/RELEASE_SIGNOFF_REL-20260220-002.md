# Release Sign-Off — REL-20260220-002

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260220-002 |
| **Release Type** | HOMEPAGE_CLUSTER_CUTOVER |
| **Scope (Global/Target)** | Official homepage cutover to `/` + dynamic cluster cards + homepage cluster governance contracts |
| **Cluster ID(s)** | `homepage` (+ registry-governed clusters rendered as cards) |
| **Calculator ID (CALC)** | `homepage-root`, `homepage-preview` |
| **Primary Route** | `/` |
| **Route Archetype** | `content_shell` metadata on standalone homepage markup |
| **Pane Layout Contract** | Standalone homepage (no top-nav / left-nav / center-pane / ads-pane) |
| **Pane Layout Evidence Path** | `public/index.html`, `public/loans/homepage-preview/index.html` |
| **Ownership Snapshot Ref** | `config/clusters/route-ownership.json` |
| **Cluster Manifest Ref** | `clusters/homepage/config/asset-manifest.json`, `clusters/homepage/config/navigation.json` |
| **Rollback Contract Ref** | Reassign `/` and `/loans/homepage-preview/` ownership rows back to prior cluster and regenerate pages |
| **Branch / Tag** | local working branch |
| **Commit SHA** | N/A (uncommitted workspace) |
| **Environment** | local |
| **Owner** | Codex agent |
| **Date** | 2026-02-20 |

---

## 2) Scope Contract Evidence

Implemented blueprint coverage:
- Cluster onboarding: `homepage` in `config/clusters/cluster-registry.json` and ownership rows in `config/clusters/route-ownership.json`
- Cluster contracts: `clusters/homepage/config/navigation.json`, `clusters/homepage/config/asset-manifest.json`
- Official route generation: standalone `/` and `/loans/homepage-preview/` in `scripts/generate-mpa-pages.js`
- Dynamic cards: registry + navigation join in `public/assets/js/homepage-preview.js`
- Motion/responsive styling and hidden-card fix in `public/assets/css/homepage-preview.css`
- Governance updates in universal requirements/checklist/project docs
- Validator modernization in `scripts/validate-cluster-contracts.mjs`
- E2E coverage updates in homepage/home-shell/ISS specs

---

## 3) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| A1 | Homepage Rendering | `/` serves standalone redesigned homepage with hero/search/cards | Pass |
| A2 | Preview Parity | `/loans/homepage-preview/` parity with noindex + canonical self-reference | Pass |
| A3 | Dynamic Data Contract | Cards generated from cluster-registry + navigation join, excluding `homepage` | Pass |
| A4 | Search Contract | Header search filters cluster cards and route links | Pass |
| A5 | UI Contract | Equal card sizing, no internal card scrollbars, bouncy motion + reduced-motion fallback | Pass |
| G1 | Cluster Contracts | `homepage` contracts + registry/ownership validator checks | Pass |
| T1 | `npm run lint` | Mandatory gate | Pass |
| T2 | `npm run test` | Mandatory gate | Pass |
| T3 | `npm run test:e2e` | Mandatory gate | Fail |
| T4 | `npm run test:cwv:all` | Mandatory gate | Fail |
| T5 | `npm run test:iss001` | Mandatory gate | Fail |
| T6 | `npm run test:schema:dedupe` | Mandatory gate | Pass |
| T7 | `npm run test:cluster:contracts` | Governance gate | Pass |
| T8 | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Isolation gate | Pass |

---

## 4) Command Evidence

| Command | Result | Notes |
| :--- | :--- | :--- |
| `npm run build:css:route-bundles` | Pass | Route CSS bundles and manifest generated |
| `GENERATE_ALL_ROUTES=1 node scripts/generate-mpa-pages.js` | Pass | Regenerated `/`, preview route, and published `public/config/clusters/cluster-registry.json` |
| `npx playwright test tests_specs/infrastructure/e2e/home-shell.spec.js tests_specs/infrastructure/e2e/homepage-preview.spec.js --workers=1` | Pass | Homepage cutover specs: `6 passed` |
| `npm run lint` | Pass | ESLint clean |
| `npm run test` | Pass | Vitest: `61 passed`, `48 skipped` |
| `npm run test:e2e` | Fail | Broad pre-existing failures across legacy routes/modules and unrelated calculators; run terminated after consistent global failures (exit `143`) |
| `npm run test:cwv:all` | Fail | Global CWV guard failed: `40` route checks violating thresholds; report at `test-results/performance/cls-guard-all-calculators.json` |
| `npm run test:iss001` | Fail | Visual baseline mismatch in `iss-design-001` (`layout-initial.png`) plus unrelated route/module 404s |
| `npm run test:schema:dedupe` | Pass | `scanned=204 changed=0 parseErrors=0 unresolved=0` |
| `npm run test:cluster:contracts` | Pass | `Cluster contract validation passed.` |
| `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | strict single-calc artifact check skipped; `shared contract changes: 6` |

---

## 5) Implemented Files

- `config/clusters/cluster-registry.json`
- `config/clusters/route-ownership.json`
- `clusters/homepage/config/navigation.json`
- `clusters/homepage/config/asset-manifest.json`
- `scripts/generate-mpa-pages.js`
- `scripts/validate-cluster-contracts.mjs`
- `public/assets/js/homepage-preview.js`
- `public/assets/css/homepage-preview.css`
- `public/index.html`
- `public/loans/homepage-preview/index.html`
- `public/config/clusters/cluster-registry.json`
- `tests_specs/infrastructure/e2e/home-shell.spec.js`
- `tests_specs/infrastructure/e2e/homepage-preview.spec.js`
- `tests_specs/infrastructure/e2e/iss/iss-nav-top-001.spec.js`
- `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md`
- `requirements/universal-rules/Project Bible.md`
- `requirements/universal-rules/cluster_migration_plane.md`
- `requirements/universal-rules/RELEASE_CHECKLIST.md`

---

## 6) Exceptions

Blocking global-gate failures are outside homepage-cutover scope and include:
- legacy path/module 404 mismatches in unrelated calculators,
- pre-existing CWV budget violations across many routes,
- existing ISS visual baseline mismatch in infrastructure snapshot test.

Homepage-specific cutover behavior and targeted homepage E2E checks pass.

---

## 7) Final Sign-Off

**Decision:** [ ] APPROVED / [x] REJECTED

Release decision basis:
1. Homepage cluster cutover implementation is complete and functional on `/` and preview.
2. Mandatory global gates remain red (`test:e2e`, `test:cwv:all`, `test:iss001`), so release is not ready to merge.

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-20 |

# Release Sign-Off — REL-20260221-010

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260221-010 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Scoped Only (`finance` / `compound-interest`) |
| **Cluster ID(s)** | finance |
| **Calculator ID (CALC)** | compound-interest |
| **Primary Route** | `/finance-calculators/compound-interest-calculator/` |
| **Route Archetype** | `calc_exp` |
| **Pane Layout Contract** | `single` |
| **Pane Layout Evidence Path** | `public/config/navigation.json` (compound-interest entry), `public/finance-calculators/compound-interest-calculator/index.html` (`panel-span-all`, `calculator-page-single`) |
| **Ownership Snapshot Ref** | `config/clusters/route-ownership.json` (finance routes not yet listed; no ownership contract change in this release) |
| **Cluster Manifest Ref** | `public/config/asset-manifest.json` |
| **Rollback Contract Ref** | N/A (no route ownership contract mutation in this scoped calculator release) |
| **Branch / Tag** | local working branch |
| **Commit SHA** | `61bed17` |
| **Environment** | local |
| **Owner** | Codex agent |
| **Date** | 2026-02-21 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result |
| :--- | :--- | :--- | :--- |
| PERF-1 | Scoped CWV | LCP <= 2500ms (mobile/desktop strict) | Pass |
| PERF-2 | Scoped CWV | Blocking CSS requests <= 1 | Pass |
| PERF-3 | Scoped CWV | Blocking CSS duration <= 800ms | Pass |
| PERF-4 | Scoped CWV | CLS <= 0.10 (mobile/desktop strict) | Pass |
| UX-1 | Mobile UX | Screenshot + tap targets >= 48px | Pass |
| UX-2 | Accessibility UX | Keyboard/focus + live region + zoom guards | Pass |
| UX-3 | Interaction Guard | Long-task, latency, nav stability guards | Pass |
| UX-4 | Above-Fold Guard | No above-the-fold mutation regressions | Pass |
| FUNC-1 | Scoped Calc Unit | `test:calc:unit` | Pass |
| FUNC-2 | Scoped Calc E2E | Calculator interaction + new graph controls | Pass |
| SEO-1 | Scoped Calc SEO | Canonical/meta/schema + sitemap check | Pass |
| DATA-1 | Schema Dedupe | No calc-scope structured-data duplicates | Pass |
| GOV-1 | Cluster Contracts | `npm run test:cluster:contracts` | Pass |
| GOV-2 | Isolation Scope | `npm run test:isolation:scope` | Pass (non-blocking skip message) |
| NAV-PANE-1 | Pane Layout | `calc_exp` + `paneLayout=single` + single-pane render classes | Pass |

---

## 3) Scoped Command Evidence (Mandatory)

| Step | Command | Result | Notes |
| :--- | :--- | :--- | :--- |
| 1 | `node scripts/build-route-css-bundles.mjs` | Pass | Route-bundle assets regenerated |
| 2 | `TARGET_ROUTE=/finance-calculators/compound-interest-calculator/ node scripts/generate-mpa-pages.js` | Pass | Scoped generation complete for target route |
| 3 | `npm run test:cluster:contracts` | Pass | Cluster contracts validation passed |
| 4 | `CLUSTER=finance CALC=compound-interest npm run test:calc:unit` | Pass | 12 tests passed |
| 5 | `CLUSTER=finance CALC=compound-interest npm run test:calc:e2e` | Pass | Route behavior + chart controls validated |
| 6 | `CLUSTER=finance CALC=compound-interest npm run test:calc:seo` | Pass | Canonical/schema/sitemap checks passed |
| 7 | `CLUSTER=finance CALC=compound-interest npm run test:calc:cwv` | Pass | CWV spec + strict scoped budget reporter passed |
| 8 | `CLUSTER=finance CALC=compound-interest npm run test:schema:dedupe -- --scope=calc` | Pass | `scanned=1`, `unresolved=0` |
| 9 | `npm run test:isolation:scope` | Pass | Lookup-missing skip for this calc id (no failure) |
| 10 | `PW_WORKERS_LOCAL=1 PW_WEB_SERVER_PORT=8017 PW_BASE_URL=http://localhost:8017 TARGET_ROUTE=/finance-calculators/compound-interest-calculator/ npx playwright test tests_specs/infrastructure/e2e/mobile-ux.spec.js --update-snapshots` | Pass | Added new baseline snapshot |
| 11 | `PW_WORKERS_LOCAL=1 PW_WEB_SERVER_PORT=8017 PW_BASE_URL=http://localhost:8017 TARGET_ROUTE=/finance-calculators/compound-interest-calculator/ npm run test:mobile:ux` | Pass | 2 passed |
| 12 | `PW_WORKERS_LOCAL=1 PW_WEB_SERVER_PORT=8017 PW_BASE_URL=http://localhost:8017 TARGET_ROUTE=/finance-calculators/compound-interest-calculator/ npm run test:accessibility:ux` | Pass | 3 passed |
| 13 | `PW_WORKERS_LOCAL=1 PW_WEB_SERVER_PORT=8018 PW_BASE_URL=http://localhost:8018 TARGET_ROUTE=/finance-calculators/compound-interest-calculator/ npm run test:interaction:guard` | Pass | 3 passed |
| 14 | `PW_WORKERS_LOCAL=1 PW_WEB_SERVER_PORT=8019 PW_BASE_URL=http://localhost:8019 TARGET_ROUTE=/finance-calculators/compound-interest-calculator/ npm run test:above-fold` | Pass | 1 passed |

---

## 4) CWV / Performance Evidence

Artifact: `test-results/performance/scoped-cwv/finance/compound-interest.json`

- `mobile_strict`: `cls=0.0246`, `lcpMs=1908`, `blockingCssRequests=0`, `blockingCssDurationMs=0`
- `desktop_strict`: `cls=0.0266`, `lcpMs=780`, `blockingCssRequests=0`, `blockingCssDurationMs=0`

Result: strict scoped thresholds satisfied.

---

## 5) Scope + UX Evidence

Implemented and verified within scoped files:
- `public/calculators/finance-calculators/compound-interest-calculator/explanation.html`
- `public/calculators/finance-calculators/compound-interest-calculator/module.js`
- `public/calculators/finance-calculators/compound-interest-calculator/calculator.css`
- `public/calculators/finance-calculators/compound-interest-calculator/ci-growth-chart.js` (new)
- `tests_specs/finance/compound-interest_release/e2e.calc.spec.js`
- `tests_specs/finance/compound-interest_release/cwv.calc.spec.js` (canonical route fix)
- Generated route and bundle artifacts for compound-interest only.

Added graph UX:
- New `Growth Visualization` section below Explanation.
- Smooth line (balance vs time) + stacked area (principal/contributions vs interest).
- Linear/log scale toggle.
- Deferred chart hydration (after first paint + near viewport/idle) to protect above-the-fold responsiveness.
- Distinct color separation for principal (violet) and interest (amber) areas.

Snapshot baseline added:
- `tests_specs/infrastructure/e2e/mobile-ux.spec.js-snapshots/mobile-finance-calculators-compound-interest-calculator-chromium-linux.png`

---

## 6) Exceptions / Risks

- `test:isolation:scope` emits: `route lookup missing for compound-interest-calculator, skipping strict check.`
  This is non-blocking in current tooling for this route and did not fail the gate.
- No active release blockers remain.

---

## 7) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

Release decision basis:
1. Scoped calculator gates (`unit`, `e2e`, `seo`, `cwv`) are all passing.
2. Strict scoped CWV budgets pass with CLS restored well below threshold.
3. Infra UX gates (`mobile`, `accessibility`, `interaction`, `above-fold`) are passing.
4. Route archetype and pane-layout single-pane contract remain compliant.

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-21 |

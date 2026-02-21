# Release Sign-Off — REL-20260220-009

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260220-009 |
| **Release Type** | CLUSTER_NAVIGATION_MIGRATION |
| **Scope (Global/Target)** | Scoped Only (`time-and-date` cluster left-navigation migration) |
| **Cluster ID(s)** | time-and-date |
| **Primary Routes** | `/time-and-date/sleep-time-calculator/`, `/time-and-date/wake-up-time-calculator/`, `/time-and-date/nap-time-calculator/`, `/time-and-date/power-nap-calculator/`, `/time-and-date/energy-based-nap-selector/`, `/time-and-date/work-hours-calculator/`, `/time-and-date/overtime-hours-calculator/`, `/time-and-date/time-between-two-dates-calculator/`, `/time-and-date/days-until-a-date-calculator/`, `/time-and-date/countdown-timer-generator/`, `/time-and-date/age-calculator/`, `/time-and-date/birthday-day-of-week/` |
| **Navigation Contract Ref** | `public/config/navigation.json` |
| **Nav Render Contract Ref** | `scripts/generate-mpa-pages.js` |
| **Asset Contract Ref** | `public/config/asset-manifest.json` |
| **Route Bundle Manifest Ref** | `public/assets/css/route-bundles/manifest.json` |
| **CWV Artifact Ref** | `test-results/performance/scoped-cwv/time-and-date/sleep-time-calculator.json` |
| **Snapshot Ref** | `tests_specs/infrastructure/e2e/mobile-ux.spec.js-snapshots/mobile-time-and-date-sleep-time-calculator-chromium-linux.png` |
| **Branch / Tag** | local working branch |
| **Commit SHA** | uncommitted working tree |
| **Environment** | local |
| **Owner** | Codex agent |
| **Date** | 2026-02-21 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result |
| :--- | :--- | :--- | :--- |
| NAV-1 | Navigation Data | Time-and-date regrouped into 4 accordion sections | Pass |
| NAV-2 | Navigation UI | Time-and-date routes render finance-style `fin-nav-*` accordion | Pass |
| NAV-3 | Readability | Long calculator labels wrap (no truncation) | Pass |
| TEST-1 | Cluster Contracts | `npm run test:cluster:contracts` | Pass |
| TEST-2 | Cluster Unit | `CLUSTER=time-and-date npm run test:cluster:unit` | Pass |
| TEST-3 | Cluster E2E | `CLUSTER=time-and-date npm run test:cluster:e2e` | Pass |
| TEST-4 | Cluster SEO | `CLUSTER=time-and-date npm run test:cluster:seo` | Pass |
| TEST-5 | Cluster CWV | `CLUSTER=time-and-date npm run test:cluster:cwv` | Pass |
| TEST-6 | Sleep route mobile UX | `npm run test:mobile:ux` (scoped TARGET_ROUTE) | Pass |
| TEST-7 | Sleep route interaction | `npm run test:interaction:guard` (scoped TARGET_ROUTE) | Pass |
| TEST-8 | Sleep route accessibility | `npm run test:accessibility:ux` (scoped TARGET_ROUTE) | Pass |
| TEST-9 | Sleep route above-fold | `npm run test:above-fold` (scoped TARGET_ROUTE) | Pass |
| TEST-10 | Sleep route calc E2E/SEO/CWV | scoped calc suites | Pass |
| META-1 | URL continuity | No route URL or canonical churn from nav migration | Pass |

---

## 3) Command Evidence

| Step | Command | Result | Notes |
| :--- | :--- | :--- | :--- |
| 1 | `npm run test:cluster:contracts` | Pass | Cluster contracts valid |
| 2 | `CLUSTER=time-and-date npm run test:cluster:unit` | Pass | 1 passed, 1 skipped |
| 3 | `CLUSTER=time-and-date npm run test:cluster:e2e` | Pass | Cluster smoke passed |
| 4 | `CLUSTER=time-and-date npm run test:cluster:seo` | Pass | Cluster SEO smoke passed |
| 5 | `CLUSTER=time-and-date npm run test:cluster:cwv` | Pass | Cluster CWV guard passed |
| 6 | `CLUSTER=sleep-and-nap npm run test:cluster:e2e` | N/A | Invalid cluster key in repo (`sleep-and-nap` removed); see step 7/8 replacement |
| 7 | `CLUSTER=time-and-date CALC=sleep-time-calculator npm run test:calc:e2e` | Pass | Updated `fin-nav-item` contract validated |
| 8 | `CLUSTER=time-and-date CALC=wake-up-time-calculator npm run test:calc:e2e` | Pass | Updated `fin-nav-item` contract validated |
| 9 | `CLUSTER=time-and-date CALC=sleep-time-calculator npm run test:calc:seo` | Pass | SEO parity intact |
| 10 | `CLUSTER=time-and-date CALC=sleep-time-calculator npm run test:calc:cwv` | Pass | Strict scoped CWV artifact generated |
| 11 | `PW_WEB_SERVER_PORT=8017 PW_BASE_URL=http://localhost:8017 TARGET_ROUTE=/time-and-date/sleep-time-calculator/ npm run test:interaction:guard` | Pass | 3 passed |
| 12 | `PW_WEB_SERVER_PORT=8017 PW_BASE_URL=http://localhost:8017 TARGET_ROUTE=/time-and-date/sleep-time-calculator/ npx playwright test tests_specs/infrastructure/e2e/mobile-ux.spec.js --update-snapshots` | Pass | Snapshot regenerated after deterministic capture hook |
| 13 | `PW_WEB_SERVER_PORT=8017 PW_BASE_URL=http://localhost:8017 TARGET_ROUTE=/time-and-date/sleep-time-calculator/ npm run test:mobile:ux` | Pass | 2 passed |
| 14 | `PW_WEB_SERVER_PORT=8017 PW_BASE_URL=http://localhost:8017 TARGET_ROUTE=/time-and-date/sleep-time-calculator/ npm run test:accessibility:ux` | Pass | 3 passed |
| 15 | `PW_WEB_SERVER_PORT=8017 PW_BASE_URL=http://localhost:8017 TARGET_ROUTE=/time-and-date/sleep-time-calculator/ npm run test:above-fold` | Pass | 1 passed |

Additional notes:
- Optional expanded calc E2E sweep across all 12 routes detected one pre-existing non-nav assertion mismatch in `work-hours-calculator` explanation heading count; this was not part of required nav rollout gates and was not modified in this release.

---

## 4) CWV / Performance Evidence

From `test-results/performance/scoped-cwv/time-and-date/sleep-time-calculator.json`:
- `mobile_strict`: `lcpMs=1192`, `blockingCssRequests=0`, `blockingCssDurationMs=0`, `cls=0`
- `desktop_strict`: `lcpMs=1352`, `blockingCssRequests=0`, `blockingCssDurationMs=0`, `cls=0.0058`

Result: strict scoped thresholds satisfied for the navigation-touched verification route.

---

## 5) Contract & UX Evidence

- `public/config/navigation.json` now groups Time & Date into:
  - `sleep-time` (5 links)
  - `work-hours` (2 links)
  - `date-time` (3 links)
  - `age-calculator` (2 links)
- `scripts/generate-mpa-pages.js` now renders Time & Date left-nav via finance-style structure (`fin-nav-container`, `fin-nav-group`, `fin-nav-toggle`, `fin-nav-items`, `fin-nav-item`) with:
  - `data-fin-nav="true"`
  - `data-fin-nav-cluster="time-and-date"`
- Scoped CSS in `public/assets/css/core-shell.css` and `public/assets/css/layout.css` enables multiline, readable calculator labels for Time & Date without clipping.
- E2E selector contract migrated from `.nav-item` to `.fin-nav-item` in Time & Date and Sleep/Nap release specs.

---

## 6) Exceptions / Risks

- `sleep-and-nap` is not a valid cluster key in current scope resolver; nav rollout evidence uses cluster-level `time-and-date` plus calc-level sleep/wake suites for equivalent coverage.
- Mobile screenshot for sleep route required deterministic pre-capture state in `tests_specs/infrastructure/e2e/mobile-ux.spec.js` to prevent minute-to-minute clock/text drift from creating flaky diffs.

---

## 7) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

Release decision basis:
1. Navigation migration scope completed across all 12 Time & Date routes.
2. Required cluster and scoped infra gates passed.
3. Selector migration and accordion behavior are validated by updated E2E coverage.
4. URL/canonical continuity preserved.

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-21 |

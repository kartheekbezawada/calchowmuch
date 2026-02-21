# Release Sign-Off — REL-20260220-008

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260220-008 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Scope (Global/Target)** | Scoped Only (`time-and-date` / `nap-time-calculator`) |
| **Cluster ID(s)** | time-and-date |
| **Calculator ID (CALC)** | nap-time-calculator |
| **Primary Route** | `/time-and-date/nap-time-calculator/` |
| **Navigation Contract Ref** | `public/config/navigation.json` |
| **Asset Contract Ref** | `public/config/asset-manifest.json` |
| **CWV Artifact Ref** | `test-results/performance/scoped-cwv/time-and-date/nap-time-calculator.json` |
| **Snapshot Ref** | `tests_specs/infrastructure/e2e/mobile-ux.spec.js-snapshots/mobile-time-and-date-nap-time-calculator-chromium-linux.png` |
| **Branch / Tag** | local working branch |
| **Commit SHA** | `c258f84` |
| **Environment** | local |
| **Owner** | Codex agent |
| **Date** | 2026-02-20 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result |
| :--- | :--- | :--- | :--- |
| PERF-1 | Scoped CWV | LCP <= 2500ms (mobile/desktop strict) | Pass |
| PERF-2 | Scoped CWV | Blocking CSS requests <= 1 | Pass |
| PERF-3 | Scoped CWV | Blocking CSS duration <= 800ms | Pass |
| UX-1 | Mobile UX | Tap targets >= 48px, no overflow, snapshot baseline | Pass |
| UX-2 | Interaction Guard | Interaction latency + long-task + nav stability | Pass |
| UX-3 | Above-Fold Guard | No above-the-fold mutation regressions | Pass |
| FUNC-1 | Scoped Calc Unit | `test:calc:unit` | Pass |
| FUNC-2 | Scoped Calc E2E | Updated locked UX contract | Pass |
| SEO-1 | Scoped Calc SEO | Canonical/meta/schema + sitemap check | Pass |
| DATA-1 | Schema Dedupe | No calc-scope structured-data duplicates | Pass |
| GOV-1 | Cluster Contracts | `npm run test:cluster:contracts` | Pass |
| META-1 | Route Metadata | `routeArchetype=calc_exp` + `paneLayout=single` | Pass |

---

## 3) Scoped Command Evidence (Mandatory)

| Step | Command | Result | Notes |
| :--- | :--- | :--- | :--- |
| 1 | `npm run test:cluster:contracts` | Pass | Cluster contract validation passed |
| 2 | `CLUSTER=time-and-date CALC=nap-time-calculator npm run test:calc:unit` | Pass | 1 file, 5 tests passed |
| 3 | `CLUSTER=time-and-date CALC=nap-time-calculator npm run test:calc:e2e` | Pass | 2 passed |
| 4 | `CLUSTER=time-and-date CALC=nap-time-calculator npm run test:calc:seo` | Pass | 1 passed |
| 5 | `CLUSTER=time-and-date CALC=nap-time-calculator npm run test:calc:cwv` | Pass | Playwright CWV spec passed |
| 6 | `CLUSTER=time-and-date CALC=nap-time-calculator npm run test:schema:dedupe -- --scope=calc` | Pass | scanned=1 changed=0 parseErrors=0 unresolved=0 |
| 7 | `PW_WORKERS_LOCAL=1 PW_WEB_SERVER_PORT=8017 PW_BASE_URL=http://localhost:8017 TARGET_ROUTE=/time-and-date/nap-time-calculator/ npm run test:mobile:ux` | Pass | 2 passed |
| 8 | `PW_WORKERS_LOCAL=1 PW_WEB_SERVER_PORT=8017 PW_BASE_URL=http://localhost:8017 TARGET_ROUTE=/time-and-date/nap-time-calculator/ npm run test:accessibility:ux` | Pass | 3 passed |
| 9 | `PW_WORKERS_LOCAL=1 PW_WEB_SERVER_PORT=8017 PW_BASE_URL=http://localhost:8017 TARGET_ROUTE=/time-and-date/nap-time-calculator/ npm run test:interaction:guard` | Pass | 3 passed |
| 10 | `PW_WORKERS_LOCAL=1 PW_WEB_SERVER_PORT=8017 PW_BASE_URL=http://localhost:8017 TARGET_ROUTE=/time-and-date/nap-time-calculator/ npm run test:above-fold` | Pass | 1 passed |

Additional evidence commands:
- `PW_WORKERS_LOCAL=1 PW_WEB_SERVER_PORT=8017 PW_BASE_URL=http://localhost:8017 TARGET_ROUTE=/time-and-date/nap-time-calculator/ npx playwright test tests_specs/infrastructure/e2e/mobile-ux.spec.js --update-snapshots`
- `CLUSTER=time-and-date CALC=nap-time-calculator node scripts/validate-scoped-cwv-budgets.mjs`

---

## 4) CWV Hardening Evidence

### Baseline note
- Pre-hardening strict CWV baseline for nap route was not captured in a persisted artifact during this wave.
- Hard release criteria are enforced against the scoped strict artifact below.

### After (scoped CWV artifact)
From `test-results/performance/scoped-cwv/time-and-date/nap-time-calculator.json`:
- `mobile_strict`: `lcpMs=1144`, `blockingCssRequests=0`, `blockingCssDurationMs=0`, `cls=0`
- `desktop_strict`: `lcpMs=1372`, `blockingCssRequests=0`, `blockingCssDurationMs=0`, `cls=0.0005`

### Delivery contract outcome
- Nap route is manifest-owned for CSS/JS delivery:
  - `css.critical`: `/assets/css/route-bundles/time-and-date-nap-time-calculator.critical.04eae115.css`
  - no blocking head stylesheet links on the generated route
  - `topNavStatic=false`, `deferCoreCss=true`

---

## 5) UX + Contract Parity Evidence

- Twilight Zen redesign delivered with two-card layout (left calculator, right answer cards).
- Default answer cards are visible on first load with initialized values.
- Input model is time-first only; no advanced date controls shown in UI.
- Calculate button/Enter triggers updates; input edits alone do not auto-recompute.
- Hidden interaction-proxy IDs are present and route-scoped hidden (`#nap-latency-proxy`, `#nap-calc`, `#nap-result`).
- Navigation metadata for nap route is single-pane:
  - `routeArchetype: "calc_exp"`
  - `paneLayout: "single"`
- SEO/schema parity preserved; FAQ schema remains valid.

---

## 6) Scope Contract Evidence

Implemented within approved files only:
- Nap route implementation files (`index.html`, `calculator.css`, `module.js`, `explanation.html`)
- Route bundle config and generated bundle/manifest outputs
- Nap scoped E2E contract
- Nap mobile snapshot baseline
- Release sign-off artifacts

No other calculator route implementation files were modified.

---

## 7) Exceptions / Risks

No active release exceptions.

---

## 8) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

Release decision basis:
1. Scoped strict CWV budgets pass (`blockingCssRequests=0`, `blockingCssDurationMs=0`, LCP under budget on both profiles).
2. Mobile, accessibility, interaction, and above-fold hard gates pass.
3. Scoped unit/e2e/seo/schema and cluster contract gates pass.
4. Route metadata and URL continuity remain compliant (`calc_exp` + `paneLayout=single`, canonical URL unchanged).

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-20 |

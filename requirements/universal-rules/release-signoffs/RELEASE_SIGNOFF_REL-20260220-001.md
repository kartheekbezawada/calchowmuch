# Release Sign-Off — REL-20260220-001

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260220-001 |
| **Release Type** | REDESIGN_PREVIEW |
| **Scope (Global/Target)** | Homepage redesign prototype route + standalone assets/tests |
| **Cluster ID(s)** | loans (preview route only) |
| **Calculator ID (CALC)** | N/A (preview shell route) |
| **Primary Route** | `/loans/homepage-preview/` |
| **Route Archetype** | N/A (standalone preview page) |
| **Pane Layout Contract** | Standalone (no top nav / left nav / center shell pane / ad pane) |
| **Pane Layout Evidence Path** | `public/loans/homepage-preview/index.html` |
| **Ownership Snapshot Ref** | `config/clusters/route-ownership.json` (unchanged) |
| **Cluster Manifest Ref** | N/A |
| **Rollback Contract Ref** | Remove preview files from this release scope |
| **Branch / Tag** | local working branch |
| **Commit SHA** | N/A (uncommitted workspace) |
| **Environment** | local |
| **Owner** | Codex agent |
| **Date** | 2026-02-20 |

---

## 2) Scope Contract Evidence

Approved implementation scope (no expansion):
- `public/loans/homepage-preview/index.html`
- `public/assets/css/homepage-preview.css`
- `public/assets/js/homepage-preview.js`
- `tests_specs/infrastructure/e2e/homepage-preview.spec.js`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-20260220-001.md`
- `requirements/universal-rules/Release Sign-Off Master Table.md`

Out-of-scope/core/shared files were not edited.

---

## 3) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| A1 | Preview Rendering | Standalone preview loads with redesigned structure | Pass |
| A2 | Create-Own Removal | No "Create Your Own" modal/button/FAB logic present | Pass |
| A3 | Data Coverage | Category cards and route links sourced from `public/config/navigation.json` | Pass |
| A4 | Search UX | In-page filter works across category/route cards | Pass |
| A5 | Motion/Responsive | Bouncy/floaty cards + reduced motion fallback + no horizontal overflow in new preview tests | Pass |
| T1 | `npm run lint` | Mandatory redesign gate | Pass |
| T2 | `npm run test` | Mandatory redesign gate | Pass |
| T3 | `npm run test:e2e` | Mandatory redesign gate | Fail |
| T4 | `npm run test:cwv:all` | Mandatory redesign gate | Fail |
| T5 | `npm run test:iss001` | Mandatory redesign gate | Fail |
| T6 | `npm run test:schema:dedupe` | Mandatory redesign gate | Pass |

---

## 4) Command Evidence

| Command | Result | Notes |
| :--- | :--- | :--- |
| `npm run lint` | Pass | ESLint passed (`public/assets/js`) |
| `npm run test` | Pass | Vitest passed (`61 passed`, `48 skipped`) |
| `PW_WEB_SERVER_PORT=8013 PW_BASE_URL=http://localhost:8013 npm run test:e2e` | Fail | Full Playwright suite completed with `93 failed`, `217 passed`, `97 skipped`; includes broad pre-existing failures outside preview scope |
| `PW_WEB_SERVER_PORT=8011 PW_BASE_URL=http://localhost:8011 npm run test:cwv:all` | Fail | Global CWV guard failed (`tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js`) with CLS/LCP violations in stress checks |
| `PW_WEB_SERVER_PORT=8012 PW_BASE_URL=http://localhost:8012 npm run test:iss001` | Fail | ISS-001 failed visual snapshot (`layout-initial.png` mismatch: `76024` pixels different) |
| `npm run test:schema:dedupe` | Pass | `[schema:dedupe] scanned=204 changed=0 parseErrors=0 unresolved=0` |

Homepage preview-specific E2E checks:
- `tests_specs/infrastructure/e2e/homepage-preview.spec.js` all scenarios passed in full E2E run:
  - loads standalone layout with no shell panes,
  - renders category/route links,
  - search filtering behavior,
  - responsive no-overflow checks.

---

## 5) Implemented Files

- `public/loans/homepage-preview/index.html`
- `public/assets/css/homepage-preview.css`
- `public/assets/js/homepage-preview.js`
- `tests_specs/infrastructure/e2e/homepage-preview.spec.js`

Key delivered contracts:
- New preview route: `/loans/homepage-preview/`
- Noindex/canonical applied on preview route
- Required test hooks present:
  - `#homepage-preview-search`
  - `[data-category-card]`
  - `[data-category-id]`
  - `[data-route-link]`

---

## 6) Exceptions

Mandatory global gates are red due broad existing regressions outside this preview-only scope, including legacy module path 404s, CWV budget failures, and ISS visual baseline mismatch.

Per scope contract, no out-of-scope fixes were applied.

---

## 7) Final Sign-Off

**Decision:** [ ] APPROVED / [x] REJECTED

Release decision basis:
1. Preview implementation is complete and preview-specific tests pass.
2. Required global redesign gates are not green (`test:e2e`, `test:cwv:all`, `test:iss001`), so release cannot be marked ready.

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-20 |

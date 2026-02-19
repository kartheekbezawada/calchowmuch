# Release Sign-Off — REL-20260219-012

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260219-012 |
| **Release Type** | INFRA |
| **Scope (Global/Target)** | Port governance policy + test-runner automation + expanded test-suite repair |
| **Cluster ID(s)** | N/A |
| **Calculator ID (CALC)** | N/A |
| **Primary Route** | N/A (infra/tooling + governance) |
| **Route Archetype** | N/A |
| **Pane Layout Contract** | N/A |
| **Pane Layout Evidence Path** | N/A |
| **Ownership Snapshot Ref** | `config/clusters/route-ownership.json` (unchanged) |
| **Cluster Manifest Ref** | N/A |
| **Rollback Contract Ref** | Revert infra/doc changes in this release scope |
| **Branch / Tag** | local working branch |
| **Commit SHA** | `04b8da4` |
| **Environment** | local |
| **Owner** | Codex agent |
| **Date** | 2026-02-19 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| A1 | Rendering | Infra-only change (no direct route rendering change) | Pass |
| A2 | CSS Arch | No CSS architecture change in this release scope | Pass |
| B1 | Port Policy | Canonical policy-as-code file exists and validates | Pass |
| B2 | Port Automation | Runner scripts allocate/release ports via governed utility | Pass |
| B3 | Port Guardrails | Fixed admin `8000` reserved; automation uses dynamic ranges | Pass |
| T1 | `npm run lint` | Required gate | Pass |
| T2 | `npm run test` | Required gate | Pass |
| T3 | `npm run test:e2e` | Required gate | Fail |
| T4 | `npm run test:cwv:all` | Required gate | Fail |
| T5 | `npm run test:iss001` | Required gate | Fail |

---

## 3) Command Evidence

| Command | Result | Notes |
| :--- | :--- | :--- |
| `npm run lint` | Pass | ESLint passed (`public/assets/js`) |
| `npm run test` | Pass | Vitest suite passed after repairing malformed imports + finance path assertions |
| `npm run test:e2e` | Fail | Global Playwright suite shows widespread existing regressions and missing legacy module paths (multiple 404s under `/calculators/loans/...`) |
| `npm run test:cwv:all` | Fail | Non-passing global CWV run; server startup/route integrity instability observed during full-crawl guard execution |
| `npm run test:iss001` | Fail | 8 passed, 1 failed (`layout-initial.png` visual regression mismatch, 76024 differing pixels) |
| `node scripts/ports.mjs list` | Pass | Managed status rendered; admin port visibility + dynamic ranges visible |
| `node scripts/ports.mjs next-free --group=playwright` | Pass | Returned governed free dynamic port |
| `node scripts/ports.mjs acquire --group=playwright --ttl=60` | Pass | Lease created with `leaseId` and selected port |

---

## 4) Port Governance Evidence

Implemented artifacts:
- Decision record: `requirements/universal-rules/decisions/PORT_GOVERNANCE_DECISION_2026-02-19.md`
- Canonical policy: `config/ports.json`
- Allocator utility: `scripts/ports.mjs`

Integrated runner surfaces:
- `playwright.config.js` now consumes `PW_WEB_SERVER_PORT` / `PW_BASE_URL`.
- `scripts/run-scoped-tests.mjs` allocates/releases Playwright ports and forwards scoped base URL.
- `scripts/lighthouse-target.mjs` allocates/releases from lighthouse range when `LH_BASE_URL` is not provided.
- `scripts/validate-scoped-cwv-budgets.mjs` allocates/releases from scoped-cwv range when `SCOPED_CWV_BASE_URL` is not provided.

Governance updates:
- Added `UR-DEV-PORT-001..005` in `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md`.
- Added Port Governance HARD checks in `requirements/universal-rules/RELEASE_CHECKLIST.md`.

---

## 5) Expanded Scope Repair Evidence

Out-of-scope test failures were approved for scope expansion and fixed:
- `tests_specs/math/cluster_release/unit.cluster.test.js`: repaired malformed import block.
- `tests_specs/loans/cluster_release/unit.cluster.test.js`: repaired malformed import block.
- `tests_specs/finance/cluster_release/unit.cluster.test.js`: updated path assumptions from `/finance/*` to `/finance-calculators/*`.

Validation result:
- `npm run test` changed from failing to passing.

---

## 6) Exceptions

Global release gates remain failing due pre-existing broader-suite regressions outside this infra feature change (not introduced by port governance changes).

---

## 7) Final Sign-Off

**Decision:** [ ] APPROVED / [x] REJECTED

Release decision basis:
1. Implementation work for port governance is complete and validated at unit/tooling level.
2. Mandatory global release gates are not fully green (`test:e2e`, `test:cwv:all`, `test:iss001`), so merge readiness is blocked.

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-19 |

# Release Sign-Off — REL-20260225-001

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260225-001 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC (ADMIN OVERRIDE) |
| **Scope (Global/Target)** | Investment Return calculator scoped release prep |
| **Cluster ID(s)** | `finance` |
| **Calculator ID (CALC)** | `investment-return` |
| **Primary Route** | `/finance-calculators/investment-return-calculator/` |
| **Route Archetype** | `calc_exp` |
| **Pane Layout Contract** | `single` |
| **Pane Layout Evidence Path** | `public/finance-calculators/investment-return-calculator/index.html` |
| **Ownership Snapshot Ref** | `config/clusters/route-ownership.json` |
| **Cluster Manifest Ref** | `public/assets/css/route-bundles/manifest.json` |
| **Rollback Contract Ref** | Revert scoped calculator files + sign-off entry |
| **Branch / Tag** | `main` |
| **Commit SHA** | `d41fdc8` |
| **Environment** | local |
| **thinContentMode (`soft`/`hard`)** | `soft` (pilot excluded) |
| **thinContentScore** | N/A |
| **thinContentGrade** | N/A |
| **thinContentHardFlags** | N/A |
| **thinContentArtifactPath** | N/A |
| **Owner** | Codex agent |
| **Date** | 2026-02-25 |

---

## 2) Scoped Gate Results (Target Calculator)

| Gate | Command | Result |
| :--- | :--- | :--- |
| Calc Unit | `CLUSTER=finance CALC=investment-return npm run test:calc:unit` | Pass |
| Calc E2E | `CLUSTER=finance CALC=investment-return npm run test:calc:e2e` | Pass |
| Calc SEO | `CLUSTER=finance CALC=investment-return npm run test:calc:seo` | Pass |
| Calc CWV | `CLUSTER=finance CALC=investment-return npm run test:calc:cwv` | Pass |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass |
| Cluster Contracts | `npm run test:cluster:contracts` | Pass |

---

## 3) Global ONBOARDING Gate Status (Observed)

| Gate | Command | Result |
| :--- | :--- | :--- |
| Lint | `npm run lint` | Pass |
| Unit (global) | `npm run test` | Fail (unrelated baseline: `sleep-and-nap` cluster contract expectation) |
| E2E (global) | `npm run test:e2e` | Fail (multiple unrelated baseline failures outside target scope) |
| CWV all (global) | `npm run test:cwv:all` | Not completed cleanly due concurrent baseline failures in global suites |
| ISS-001 | `npm run test:iss001` | Fail (infra baseline: ads-column timeout + visual snapshot diff) |
| Schema dedupe | `npm run test:schema:dedupe` | Pass |

---

## 4) Key Evidence

- Scoped CWV artifact: `test-results/performance/scoped-cwv/finance/investment-return.json`
  - `mobile_strict`: CLS `0`, LCP `888ms`, blocking CSS duration `0ms`, requests `0` (pass)
  - `desktop_strict`: CLS `0`, LCP `1008ms`, blocking CSS duration `0ms`, requests `0` (pass)
- Scoped release route generated: `public/finance-calculators/investment-return-calculator/index.html`
- Canonical routing + sitemap + redirect + nav updated for investment-return route.

---

## 5) Exceptions

| ID | Issue | Severity | Owner |
| :--- | :--- | :--- | :--- |
| EX-ADMIN-001 | Full ONBOARDING global hard gates are not all green due unrelated baseline failures outside `finance/investment-return` scope. | High | HUMAN/Project |
| EX-ADMIN-002 | Release prep continued under explicit `ADMIN` override instruction. | High | HUMAN |

---

## 6) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

Release decision basis:
1. Target calculator implementation and scoped hard checks for `finance/investment-return` are green.
2. Full global ONBOARDING gates remain red due known unrelated baseline failures.
3. Approval is recorded under explicit one-message `ADMIN` override from HUMAN.

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-25 |

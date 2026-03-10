# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260310-003 |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc |
| Cluster ID | loans |
| Calculator ID (CALC) | how-much-can-i-borrow |
| Primary Route | /loan-calculators/how-much-can-i-borrow/ |
| Owner | Codex |
| Date | 2026-03-10 |
| Commit SHA | 290984a |
| Environment | Local workspace |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | ESLint output (`public/assets/js`) |
| Unit | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:unit` | Pass | `tests_specs/loans/how-much-can-i-borrow_release/unit.calc.test.js` |
| E2E | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:e2e` | Pass | `tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js` |
| SEO | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:seo` | Pass | `tests_specs/loans/how-much-can-i-borrow_release/seo.calc.spec.js` |
| CWV | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:calc:cwv` | Fail | `test-results/performance/scoped-cwv/loans/how-much-can-i-borrow.json` |
| Isolation Scope | `CLUSTER=loans ROUTE=/loan-calculators/how-much-can-i-borrow/ npm run test:isolation:scope` | Fail | Command output (`Another calculator source changed` false positive on target calc source path) |
| Cluster Contracts | `CLUSTER=loans npm run test:cluster:contracts` | Pass | Command output confirms validation passed |
| Schema Dedupe | `CLUSTER=loans CALC=how-much-can-i-borrow npm run test:schema:dedupe -- --scope=calc` | Skipped | Not executed in this scoped bugfix run |
| ISS-001 | `npm run test:iss001` | Skipped | Not executed in this scoped bugfix run |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Route `/loan-calculators/how-much-can-i-borrow/`; edited files: `public/calculators/loan-calculators/how-much-can-i-borrow/module.js`, `tests_specs/loans/how-much-can-i-borrow_release/e2e.calc.spec.js`, this sign-off file |
| SEO/schema evidence | `tests_specs/loans/how-much-can-i-borrow_release/seo.calc.spec.js` |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/scoped-cwv/loans/how-much-can-i-borrow.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/scoped/loans/how-much-can-i-borrow.json` (from scoped SEO run) |
| Pane layout proof (for `calc_exp`) | Existing e2e `BOR-TEST-E2E-1` passes single-pane assertions (`panel-span-all` and no overflow) |

Notes:
- Added runtime fallback explanation injection so the `Your Income Capacity` graph and scenario table remain functional if `explanation.html` fails to load.
- Hardened segment sizing to set both `flex` and `flex-basis`, improving cross-browser rendering reliability for capacity segments.
- Strengthened `BOR-TEST-E2E-8` to verify non-zero rendered segment widths, not only legend text.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| RISK-001 | Scoped CWV strict budgets fail (`blockingCssDurationMs` and `blockingCssRequests`). | High | Requires CSS delivery/perf budget work outside this approved bugfix scope. |
| RISK-002 | `test:isolation:scope` flags target calculator source as `Another calculator source changed`. | Medium | Existing validator false-positive pattern; requires script/policy fix outside this scope. |
| RISK-003 | `Schema Dedupe` and `ISS-001` gates were not executed in this scoped bugfix run. | Medium | Run full mandated gates before release approval if required for merge policy. |

---

## 5) Final Decision

Decision: [ ] APPROVED  [x] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-10 |

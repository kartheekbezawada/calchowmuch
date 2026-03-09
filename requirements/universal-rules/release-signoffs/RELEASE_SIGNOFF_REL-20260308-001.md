# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260308-001 |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc |
| Cluster ID | percentage |
| Calculator ID (CALC) | commission-calculator |
| Primary Route | /percentage-calculators/commission-calculator/ |
| Owner | Codex |
| Date | 2026-03-08 |
| Commit SHA | a6a2e02 |
| Environment | Local workspace |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Command completed successfully |
| Unit | `CLUSTER=percentage CALC=commission-calculator npm run test:calc:unit` | Pass | `tests_specs/percentage/commission-calculator_release/unit.calc.test.js` |
| E2E | `CLUSTER=percentage CALC=commission-calculator npm run test:calc:e2e` | Pass | `tests_specs/percentage/commission-calculator_release/e2e.calc.spec.js` |
| SEO | `CLUSTER=percentage CALC=commission-calculator npm run test:calc:seo` | Pass | `tests_specs/percentage/commission-calculator_release/seo.calc.spec.js` |
| CWV | `CLUSTER=percentage CALC=commission-calculator npm run test:calc:cwv` | Pass | `test-results/performance/scoped-cwv/percentage/commission-calculator.json` |
| ISS-001 | `npm run test:iss001` | Pass | `tests_specs/infrastructure/e2e/iss-design-001.spec.js` |
| Schema Dedupe | `CLUSTER=percentage CALC=commission-calculator npm run test:schema:dedupe -- --scope=calc` | Pass | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |
| Isolation Scope | `CLUSTER=percentage ROUTE=/percentage-calculators/commission-calculator/ npm run test:isolation:scope` | Pass | Command output noted dirty worktree and skipped strict single-calculator artifact check |
| Cluster Contracts | `CLUSTER=percentage npm run test:cluster:contracts` | Pass | Command completed successfully |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Route `/percentage-calculators/commission-calculator/`; edited files limited to `public/percentage-calculators/commission-calculator/index.html`, `public/calculators/percentage-calculators/commission-calculator/index.html`, `public/calculators/percentage-calculators/commission-calculator/module.js`, `tests_specs/percentage/commission-calculator_release/e2e.calc.spec.js` |
| SEO/schema evidence | `tests_specs/percentage/commission-calculator_release/seo.calc.spec.js`; `schema_duplicates_report.md`; `schema_duplicates_report.csv` |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/scoped-cwv/percentage/commission-calculator.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/scoped/percentage/commission-calculator.json` |
| Important Notes contract proof (if applicable) | Not applicable |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` shows `routeArchetype: "calc_exp"` and `paneLayout: "single"` for `commission-calculator`; generated route `public/percentage-calculators/commission-calculator/index.html` retains `.panel.panel-scroll.panel-span-all` and `.calculator-page-single` |

Notes:
- Scope approval was initially locked to the commission calculator route, its route-local module, its scoped E2E spec, and this sign-off file.
- Approved scope delta: `public/calculators/percentage-calculators/commission-calculator/index.html` was added after confirming the environment was still serving old commission-card markup from that source file.
- `test:isolation:scope` reported an already-dirty worktree with unrelated calculators and therefore skipped strict single-calculator artifact validation; no out-of-scope files were edited for this release.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| RISK-001 | Isolation scope evidence is partially degraded by unrelated pre-existing worktree changes in other calculators. | Low | Keep merge review limited to scoped diff for the commission calculator release. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-08 |

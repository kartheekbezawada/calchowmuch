# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260328-SALARY-INFLATION-ADJUSTED-SALARY` |
| Release Type | `CLUSTER_ROUTE_SINGLE_CALC` |
| Scope (Global/Cluster/Calc/Route) | `Calc` |
| Cluster ID | `salary` |
| Calculator ID (CALC) | `inflation-adjusted-salary-calculator` |
| Primary Route | `/salary-calculators/inflation-adjusted-salary-calculator/` |
| Owner | `Codex` |
| Date | `2026-03-28` |
| Commit SHA | `c30a9dd15b79f2080b05e2308fe0d2a1163201f4` |
| Environment | `Local` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | command output |
| Unit | `CLUSTER=salary CALC=inflation-adjusted-salary-calculator npm run test:calc:unit` | Pass | `tests_specs/salary/inflation-adjusted-salary-calculator_release/unit.calc.test.js` |
| E2E | `CLUSTER=salary CALC=inflation-adjusted-salary-calculator npm run test:calc:e2e` | Pass | `tests_specs/salary/inflation-adjusted-salary-calculator_release/e2e.calc.spec.js` |
| SEO | `CLUSTER=salary CALC=inflation-adjusted-salary-calculator npm run test:calc:seo` | Pass | `tests_specs/salary/inflation-adjusted-salary-calculator_release/seo.calc.spec.js` |
| CWV | `CLUSTER=salary CALC=inflation-adjusted-salary-calculator npm run test:calc:cwv` | Pass | `test-results/performance/scoped-cwv/salary/inflation-adjusted-salary-calculator.json` |
| ISS-001 | `npm run test:iss001` (if applicable) | Skipped | not required for this single-calculator salary release |
| Schema Dedupe | `CLUSTER=salary CALC=inflation-adjusted-salary-calculator npm run test:schema:dedupe -- --scope=calc` | Pass | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |
| Thin Content | `CLUSTER=salary CALC=inflation-adjusted-salary-calculator npm run test:content:quality -- --scope=calc` | Pass | `test-results/content-quality/scoped/salary/inflation-adjusted-salary-calculator.json` |
| Cluster Contracts | `CLUSTER=salary npm run test:cluster:contracts` | Pass | command output |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | command output |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | `public/salary-calculators/inflation-adjusted-salary-calculator/index.html`, `CLUSTER=salary`, `CALC=inflation-adjusted-salary-calculator`, `ROUTE=/salary-calculators/inflation-adjusted-salary-calculator/` |
| Homepage search verification keyword(s) | `inflation adjusted salary calculator`, `real salary calculator`, `salary raise vs inflation` via `CLUSTER=salary npm run test:cluster:contracts` |
| SEO/schema evidence | `public/salary-calculators/inflation-adjusted-salary-calculator/index.html`, `seo_mojibake_report.md`, `seo_mojibake_report.csv` |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/scoped-cwv/salary/inflation-adjusted-salary-calculator.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `test-results/content-quality/scoped/salary/inflation-adjusted-salary-calculator.json` |
| Important Notes contract proof (if applicable) | `public/calculators/salary-calculators/inflation-adjusted-salary-calculator/explanation.html` and generated output at `public/salary-calculators/inflation-adjusted-salary-calculator/index.html` |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json`, `public/salary-calculators/inflation-adjusted-salary-calculator/index.html` |
| Mobile layout verification | Manual Playwright mobile probe against `public/salary-calculators/inflation-adjusted-salary-calculator/index.html`: `innerWidth=437`, `scrollWidth=437`, `hasPageOverflow=false`, `shellWidth=358` |
| Mobile table verification | Manual Playwright probe and screenshot confirmed the explanation table stacks into labeled cards on small screens with no page overflow. |

Notes:
- The route ships as `calc_exp` with `paneLayout=single`.
- Shared-contract isolation required the explicit opt-in flag because onboarding this route touched salary navigation, ownership, asset manifest, rollout docs, and the generator override table.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| `IAS-CONTENT-001` | Thin-content scorer now passes with score `78` (`Acceptable`), but still flags FAQ specificity and edge-case coverage as improvement opportunities. | Low | Expand calculator-specific FAQ coverage and edge-case guidance in a follow-up content pass. |
| `IAS-SEO-LOG-001` | SEO/content-quality scripts emit a non-blocking jsdom CSS parse log while still returning success. | Low | Treat as repo-level tooling noise unless the parser warning is promoted to a failing condition later. |
| `IAS-GEN-001` | Scoped regeneration is currently blocked by a missing repo file: `requirements/universal-rules/AdSense code snippet.md`. | Low | Restore the missing generator dependency, then rerun scoped generation to replace the direct sync applied to the generated route file. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-28` |

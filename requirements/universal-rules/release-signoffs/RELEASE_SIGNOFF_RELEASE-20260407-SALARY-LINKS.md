## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | RELEASE-20260407-SALARY-LINKS |
| Release Type | CLUSTER_ROUTE |
| Scope (Global/Cluster/Calc/Route) | Cluster |
| Cluster ID | salary |
| Calculator ID (CALC) | N/A (cluster scope) |
| Primary Route | /salary-calculators/salary-calculator/ |
| Owner | Codex |
| Date | 2026-04-07 |
| Commit SHA | aa65fe136d4dc7b5b4677563faa2022679831591 |
| Environment | Local workspace |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | No repo artifact emitted; command passed in execution log. |
| Unit | `CLUSTER=salary npm run test:cluster:unit` | Pass | No repo artifact emitted; command passed in execution log. |
| E2E | `CLUSTER=salary npm run test:cluster:e2e` | Pass | No repo artifact emitted; command passed in execution log. |
| SEO | `CLUSTER=salary npm run test:cluster:seo` | Pass | No repo artifact emitted; command passed in execution log. Latest shared Playwright HTML report: `playwright-report/index.html`. |
| CWV | `CLUSTER=salary npm run test:cluster:cwv` | Pass | Latest Playwright HTML report: `playwright-report/index.html`; last-run marker: `test-results/.last-run.json`. |
| ISS-001 | `npm run test:iss001` (if applicable) | Skipped | Not required for this scoped cluster-route release per release-mode/scope matrix used for cluster releases. |

Additional required scoped gates executed:

- `npm run test:cluster:contracts` -> Pass
- `npm run test:isolation:scope` -> Pass

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Approved scope limited edits to: `public/salary-calculators/salary-calculator/index.html`, `public/salary-calculators/salary-to-hourly-calculator/index.html`, `public/salary-calculators/weekly-pay-calculator/index.html`, `public/salary-calculators/bonus-calculator/index.html`, `public/salary-calculators/commission-calculator/index.html`. Affected routes: `/salary-calculators/salary-calculator/`, `/salary-calculators/salary-to-hourly-calculator/`, `/salary-calculators/weekly-pay-calculator/`, `/salary-calculators/bonus-calculator/`, `/salary-calculators/commission-calculator/`. Scope approval recorded in assistant/user exchange before edits. |
| Homepage search verification keyword(s) | Verified by `npm run test:cluster:contracts` -> `npm run test:homepage:search:contracts`. Cluster keywords covered by governed navigation entries include `salary calculator`, `salary to hourly calculator`, `weekly pay calculator`, `bonus calculator`, `commission calculator`. |
| SEO evidence | `CLUSTER=salary npm run test:cluster:seo` passed in execution log. Note: command also emitted existing jsdom CSS parse warnings from unrelated routes, but did not fail the gate. |
| CWV artifact (`scoped-cwv` or global) | Cluster-level CWV runner did not emit a dedicated `scoped-cwv` JSON artifact in this workspace. Pass status captured in execution log. Latest Playwright report artifact: `playwright-report/index.html`; status marker: `test-results/.last-run.json`. |
| Thin-content artifact (if `calc_exp` / `exp_only`) | Cluster SEO runner invoked thin-content scoring during execution, but no file was emitted under `test-results/content-quality/` in this workspace. Gate still exited pass; see execution log note above. |
| Important Notes contract proof (if applicable) | N/A |
| Pane layout proof (for `calc_exp`) | Navigation contract: `public/config/navigation.json` shows `paneLayout: "single"` for salary cluster calc routes around the entries starting at the `salary-calculator` block. Generated HTML proof: edited routes retain `panel-span-all` and `calculator-page-single` in `public/salary-calculators/salary-calculator/index.html`, `public/salary-calculators/salary-to-hourly-calculator/index.html`, `public/salary-calculators/weekly-pay-calculator/index.html`, `public/salary-calculators/bonus-calculator/index.html`, and `public/salary-calculators/commission-calculator/index.html`. |

Notes:

- This release is content-only. No JS, shared runtime, navigation config, or asset manifest files were changed.
- Internal-link implementation added crawlable body-copy links plus related-card adjustments to strengthen cluster hubs without changing MPA navigation behavior.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| RISK-001 | Cluster SEO command emitted existing jsdom CSS parse warnings from unrelated routes during the pass run. | Low | Treat as tooling debt unless it starts failing scoped SEO gates. |
| RISK-002 | Current cluster-level per-type Playwright runners do not emit dedicated summary JSON or thin-content artifact files in this workspace, which weakens evidence traceability. | Medium | Follow up on `scripts/run-scoped-tests.mjs` / content-quality artifact emission so scoped releases always leave stable file artifacts. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-04-07 |

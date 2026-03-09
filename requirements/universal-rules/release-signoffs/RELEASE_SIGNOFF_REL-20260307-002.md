# Release Sign-Off (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260307-002 |
| Release Type | CLUSTER_ROUTE |
| Scope (Global/Cluster/Calc/Route) | Cluster |
| Cluster ID | loans |
| Calculator ID (CALC) | home-loan, how-much-can-i-borrow, remortgage-switching, loan-to-value, hire-purchase |
| Primary Route | /loan-calculators/mortgage-calculator/ |
| Owner | Codex |
| Date | 2026-03-07 |
| Commit SHA | a6a2e02 |
| Environment | Local (Playwright + Node) |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260307-002/logs/01-lint.log` |
| Cluster Unit | `CLUSTER=loans npm run test:cluster:unit` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260307-002/logs/02-cluster-unit.log` |
| Cluster E2E | `CLUSTER=loans npm run test:cluster:e2e` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260307-002/logs/03-cluster-e2e.log` |
| Cluster SEO | `CLUSTER=loans npm run test:cluster:seo` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260307-002/logs/04-cluster-seo.log` |
| Hire Purchase CWV | `CLUSTER=loans CALC=hire-purchase npm run test:calc:cwv` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260307-002/logs/05a-hire-purchase-cwv.log` |
| Cluster CWV | `CLUSTER=loans npm run test:cluster:cwv` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260307-002/logs/05-cluster-cwv.log` |
| Cluster Contracts | `CLUSTER=loans npm run test:cluster:contracts` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260307-002/logs/06-cluster-contracts.log` |
| Isolation Scope | `npm run test:isolation:scope` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260307-002/logs/07-isolation-scope.log` |
| Schema Dedupe | `CLUSTER=loans npm run test:schema:dedupe -- --scope=cluster` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260307-002/logs/08-schema-dedupe.log` |
| ISS-001 | `npm run test:iss001` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260307-002/logs/09-iss001.log` |
| Scoped Page Generation | `TARGET_CALC_ID=<calc> node scripts/generate-mpa-pages.js` for `home-loan`, `how-much-can-i-borrow`, `remortgage-switching`, `loan-to-value` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260307-002/logs/10-regenerate-loan-routes.log` |
| Cluster E2E (post-generation) | `CLUSTER=loans npm run test:cluster:e2e` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260307-002/logs/11-cluster-e2e-after-regenerate.log` |
| Cluster SEO (post-generation) | `CLUSTER=loans npm run test:cluster:seo` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260307-002/logs/12-cluster-seo-after-regenerate.log` |
| Cluster E2E (highlighted backlinks) | `CLUSTER=loans npm run test:cluster:e2e` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260307-002/logs/13-cluster-e2e-highlighted-links.log` |
| Cluster SEO (highlighted backlinks) | `CLUSTER=loans npm run test:cluster:seo` | Pass | `requirements/universal-rules/release-signoffs/artifacts/REL-20260307-002/logs/14-cluster-seo-highlighted-links.log` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Approved scope statement | Initial scope: backlink copy in four loan explanation files. Approved scope delta: investigate/fix unrelated loans-cluster CWV failure on hire-purchase route. |
| Changed files | `public/calculators/loan-calculators/mortgage-calculator/explanation.html`, `public/calculators/loan-calculators/ltv-calculator/explanation.html`, `public/calculators/loan-calculators/how-much-can-i-borrow/explanation.html`, `public/calculators/loan-calculators/remortgage-calculator/explanation.html`, `public/car-loan-calculators/hire-purchase-calculator/index.html`, `public/loan-calculators/mortgage-calculator/index.html`, `public/loan-calculators/ltv-calculator/index.html`, `public/loan-calculators/how-much-can-i-borrow/index.html`, `public/loan-calculators/remortgage-calculator/index.html`, `requirements/universal-rules/CALCULATOR_BACKLINK_MATRIX.md` |
| Scoped route proof (target route + scope lock) | Loans cluster scope confirmed by `config/testing/test-scope-map.json` (`home-loan`, `how-much-can-i-borrow`, `remortgage-switching`, `loan-to-value`, `hire-purchase`) and gate logs `02` through `12`. |
| SEO/schema evidence | `04-cluster-seo.log` shows cluster SEO pass with no mojibake findings; `08-schema-dedupe.log` shows `parseErrors=0 unresolved=0`. |
| CWV evidence | `05a-hire-purchase-cwv.log` verifies the repaired route passes calculator-scoped CWV; `05-cluster-cwv.log` verifies the loans cluster passes after the fix. |
| Thin-content artifact | `04-cluster-seo.log` records the generated thin-content summary for the loans cluster. |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json:493`, `:509`, `:517`, `:549` declare `routeArchetype: "calc_exp"` and `paneLayout: "single"`; generated routes contain `panel-span-all` and `calculator-page-single` in `public/loan-calculators/mortgage-calculator/index.html:202`, `public/loan-calculators/how-much-can-i-borrow/index.html:1838`, `public/loan-calculators/remortgage-calculator/index.html:1847`, `public/loan-calculators/ltv-calculator/index.html:1898`. |
| CWV remediation proof | `public/car-loan-calculators/hire-purchase-calculator/index.html:2133` adds the CSS visibility guard and async stylesheet release script used to eliminate the load-time CLS spike. |
| Public route generation proof | Regenerated public outputs for `ltv`, `how-much-can-i-borrow`, and `remortgage` via `10-regenerate-loan-routes.log`; manual mortgage public route updated directly because generator reports `SKIP (manual): loan-calculators/mortgage-calculator`. |
| Backlink matrix proof | `requirements/universal-rules/CALCULATOR_BACKLINK_MATRIX.md` documents the current mortgage/LTV/borrow/remortgage backlink map. |

Notes:
- The original loans-cluster CWV run failed on `/car-loan-calculators/hire-purchase-calculator/` with CLS `0.1544` above the `0.1` threshold. The page-level CSS load guard fixed that regression and the scoped plus cluster reruns both passed.
- This release is content-led on the mortgage/LTV/borrow/remortgage pages, with one approved scope-expansion fix on the hire-purchase public route to satisfy the loans cluster CWV gate.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-SEO-WARN-001 | Cluster SEO emitted thin-content warnings across loans routes, but did not fail the gate. | Low | Leave for a separate content-depth pass; not introduced by this change. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-07 |

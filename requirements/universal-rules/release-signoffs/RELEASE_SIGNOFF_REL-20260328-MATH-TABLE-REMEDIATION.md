# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field                             | Value                                 |
| :-------------------------------- | :------------------------------------ |
| Release ID                        | `REL-20260328-MATH-TABLE-REMEDIATION` |
| Release Type                      | `CLUSTER_SHARED`                      |
| Scope (Global/Cluster/Calc/Route) | `Cluster`                             |
| Cluster ID                        | `math`                                |
| Calculator ID (CALC)              | `MULTI_ROUTE`                         |
| Primary Route                     | `/math/permutation-combination/`      |
| Owner                             | `Codex`                               |
| Date                              | `2026-03-28`                          |
| Commit SHA                        | `bfbf26ca`                            |
| Environment                       | `local workspace`                     |

---

## 2) Gates Executed

| Gate              | Command                                                      | Result (Pass/Fail/Skipped) | Evidence Path                                                                                                             |
| :---------------- | :----------------------------------------------------------- | :------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| Lint              | `npm run lint`                                               | Pass                       | Console run on `2026-03-28`                                                                                               |
| Unit              | `CLUSTER=math npm run test:cluster:unit`                     | Pass                       | Console run on `2026-03-28`                                                                                               |
| E2E               | `CLUSTER=math npm run test:cluster:e2e`                      | Pass                       | Console run on `2026-03-28`                                                                                               |
| SEO               | `CLUSTER=math npm run test:cluster:seo`                      | Pass                       | Console run on `2026-03-28`                                                                                               |
| CWV               | `CLUSTER=math npm run test:cluster:cwv`                      | Pass                       | Console run on `2026-03-28`                                                                                               |
| ISS-001           | `npm run test:iss001`                                        | Fail                       | `test-results/infrastructure-e2e-iss-des-82101-imensions-during-navigation-chromium/` and sibling ISS-001 failure folders |
| Schema Dedupe     | `CLUSTER=math npm run test:schema:dedupe -- --scope=cluster` | Pass                       | Console run on `2026-03-28`                                                                                               |
| Cluster Contracts | `CLUSTER=math npm run test:cluster:contracts`                | Pass                       | Console run on `2026-03-28`                                                                                               |
| Isolation Scope   | `npm run test:isolation:scope`                               | Pass                       | Console run on `2026-03-28`                                                                                               |

---

## 3) Required Evidence

| Evidence                                           | Path / Notes                                                                                        |
| :------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| Release checklist reference                        | `requirements/universal-rules/RELEASE_CHECKLIST.md`                                                 |
| Scoped route proof (target route + scope lock)     | `requirements/universal-rules/math-table-remediation-log.md`                                        |
| Homepage search verification keyword(s)            | Covered by `CLUSTER=math npm run test:cluster:contracts` / homepage-search validation pass          |
| SEO/schema evidence                                | `requirements/universal-rules/math-table-remediation-log.md` plus schema dedupe console pass        |
| CWV artifact (`scoped-cwv` or global)              | Current scoped harness emitted console-only pass output; no persisted artifact path was generated   |
| Thin-content artifact (if `calc_exp` / `exp_only`) | Not part of this remediation pass                                                                   |
| Important Notes contract proof (if applicable)     | Not changed in this remediation pass                                                                |
| Pane layout proof (for `calc_exp`)                 | Existing route archetypes were not modified; this pass touched table semantics/mobile behavior only |
| Before/after screenshot evidence                   | `tmp/math-table-remediation/baseline/` and `tmp/math-table-remediation/after/`                      |
| Route audit summary                                | `tmp/math-table-remediation/final-audit.json`                                                       |

---

## 4) Exceptions / Known Risks

| ID            | Description                                                                                                                                                                                             | Severity | Mitigation / Follow-up                                                                                                               |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| EX-ISS001-001 | Global `ISS-001` fails because the suite expects legacy shell selectors (`.left-nav`, `.center-column`, `.ads-column`) and a different full-page baseline snapshot than the touched math routes render. | High     | Investigate or scope-adjust the global `ISS-001` harness before claiming release readiness.                                          |
| EX-GEN-001    | Scoped route regeneration via `scripts/generate-mpa-pages.js` is blocked by a missing out-of-scope file: `requirements/universal-rules/AdSense code snippet.md`.                                        | Medium   | Fix generator dependency in a separate approved scope. Built math outputs were synced directly under `public/math/**` for this pass. |

---

## 5) Final Decision

Decision: [ ] APPROVED [x] REJECTED

| Role  | Name    | Date         |
| :---- | :------ | :----------- |
| Owner | `Codex` | `2026-03-28` |

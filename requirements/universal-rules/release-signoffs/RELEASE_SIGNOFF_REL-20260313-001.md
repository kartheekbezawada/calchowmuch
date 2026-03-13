# Release Sign-Off — REL-20260313-001

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260313-001 |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc |
| Cluster ID | time-and-date |
| Calculator ID (CALC) | countdown-timer-generator |
| Primary Route | /time-and-date/countdown-timer-generator/ |
| Owner | Codex |
| Date | 2026-03-13 |
| Commit SHA | e04db35 |
| Environment | Local |

---

## 2) Approved Scope Contract

Approved target: `time-and-date` cluster, `countdown-timer-generator`, route `/time-and-date/countdown-timer-generator/`.

In-scope files changed for this release:
- `public/calculators/time-and-date/countdown-timer-generator/calculator.css`
- `public/calculators/time-and-date/countdown-timer-generator/index.html`
- `public/calculators/time-and-date/countdown-timer-generator/module.js`
- `public/time-and-date/countdown-timer-generator/index.html`
- `tests_specs/time-and-date/countdown-timer-generator_release/e2e.calc.spec.js`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-20260313-001.md`

Scope delta approved by HUMAN during this task:
- Expanded scope to include test update in `tests_specs/time-and-date/countdown-timer-generator_release/e2e.calc.spec.js` after initial E2E failure.

---

## 3) Build Summary

- Replaced dynamic holiday-preset flow with static `Region + Event` dropdown flow for the countdown input card.
- Applied requested region list restriction: only `United States`, `United Kingdom`, `Canada`.
- Synced both route HTML variants (`/calculators/...` source + generated `/time-and-date/...`).
- Updated scoped E2E to validate the new static region/event flow.
- Preserved centered footer status text: `Live updates Every Second`.

---

## 4) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Command output |
| Unit | `CLUSTER=time-and-date CALC=countdown-timer-generator npm run test:calc:unit` | Pass | `tests_specs/time-and-date/countdown-timer-generator_release/unit.calc.test.js` |
| E2E | `CLUSTER=time-and-date CALC=countdown-timer-generator npm run test:calc:e2e` | Pass | `tests_specs/time-and-date/countdown-timer-generator_release/e2e.calc.spec.js` |
| SEO | `CLUSTER=time-and-date CALC=countdown-timer-generator npm run test:calc:seo` | Pass | `tests_specs/time-and-date/countdown-timer-generator_release/seo.calc.spec.js` |
| CWV | `CLUSTER=time-and-date CALC=countdown-timer-generator npm run test:calc:cwv` | **Fail** | `test-results/performance/scoped-cwv/time-and-date/countdown-timer-generator.json` |
| ISS-001 | `npm run test:iss001` | Pass | `tests_specs/infrastructure/e2e/iss-design-001.spec.js` |
| Schema Dedupe | `CLUSTER=time-and-date CALC=countdown-timer-generator npm run test:schema:dedupe -- --scope=calc` | Pass | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |
| Isolation Scope | `npm run test:isolation:scope` | Pass | Command output |
| Cluster Contracts | `npm run test:cluster:contracts` | Pass | Command output |
| Scope Validation | `npm run scope:route -- --calc=countdown-timer-generator` | Fail (known script behavior) | See Exceptions |

---

## 5) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | `config/clusters/route-ownership.json` route `/time-and-date/countdown-timer-generator/` |
| SEO/schema evidence | `tests_specs/time-and-date/countdown-timer-generator_release/seo.calc.spec.js`; `schema_duplicates_report.md`; `schema_duplicates_report.csv`; mojibake check output (`findings=0`) |
| CWV artifact | `test-results/performance/scoped-cwv/time-and-date/countdown-timer-generator.json` |
| Thin-content artifact | `test-results/content-quality/scoped/time-and-date/countdown-timer-generator.json` |
| Pane layout proof (for `calc_exp`) | `public/config/navigation.json` (`routeArchetype: calc_exp`, `paneLayout: single` for countdown route); `public/time-and-date/countdown-timer-generator/index.html` contains `.panel.panel-scroll.panel-span-all` + `.calculator-page-single` |

---

## 6) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-REL-20260313-001-01 | Scoped CWV budget failed for target calculator (`blockingCssRequests=5 > 1`, blocking CSS duration ~2.8-2.9s > 800ms on strict profiles). | High | Requires CSS delivery/bundle optimization for this route/cluster before release approval. |
| EX-REL-20260313-001-02 | `scope:route` reports out-of-scope files (`schema_duplicates_report.*`, `seo_mojibake_report.md`) due script using `git diff HEAD~1...HEAD`; this reflects commit-range history, not current working-tree scope edits. | Medium | Keep route-scope locked by explicit file list above; use this sign-off as authoritative scope evidence. |
| EX-REL-20260313-001-03 | Pre-existing untracked prototype file outside release scope: `requirements/Calculators Sleep Time/design.jsx`. | Low | Excluded from this release scope; no production route behavior depends on it. |

---

## 7) Final Decision

Decision: [ ] APPROVED  [x] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-13 |

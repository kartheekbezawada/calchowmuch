# Release Sign-Off — REL-20260311-004

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260311-004 |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc |
| Cluster ID | percentage |
| Calculator ID (CALC) | what-percent-is-x-of-y |
| Primary Route | /percentage-calculators/percentage-finder-calculator/ |
| Owner | Codex |
| Date | 2026-03-11 |
| Commit SHA | Working tree (uncommitted) |
| Environment | Local |

---

## 2) Approved Scope Contract

Approved target: percentage cluster, `what-percent-is-x-of-y`, route `/percentage-calculators/percentage-finder-calculator/`.

In-scope files changed for this release:
- `public/calculators/percentage-calculators/percentage-finder-calculator/calculator.css`
- `public/calculators/percentage-calculators/percentage-finder-calculator/index.html`
- `public/calculators/percentage-calculators/percentage-finder-calculator/module.js`
- `public/percentage-calculators/percentage-finder-calculator/index.html`
- `tests_specs/percentage/what-percent-is-x-of-y_release/e2e.calc.spec.js`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-20260311-004.md`

---

## 3) Build + Generation Evidence

- Scoped generation command executed:
  - `REBUILD_ROUTE_BUNDLES=1 TARGET_CALC_ID=what-percent-is-x-of-y node scripts/generate-mpa-pages.js`
- Generator side effect touched shared bundle manifest files outside approved scope (`public/assets/css/route-bundles/*`, `public/config/asset-manifest.json`).
- Corrective action taken immediately:
  - Reverted those out-of-scope files and removed generated out-of-scope bundle artifacts.
  - Final working tree for this release contains only approved in-scope files.

---

## 4) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Scope Validation | `npm run scope:route -- --calc=what-percent-is-x-of-y` | Fail (pre-existing unrelated dirty files outside release scope) | See Exceptions |
| Unit | `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:unit` | Pass | `tests_specs/percentage/what-percent-is-x-of-y_release/unit.calc.test.js` |
| E2E | `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:e2e` | Pass | `tests_specs/percentage/what-percent-is-x-of-y_release/e2e.calc.spec.js` |
| SEO | `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:seo` | Pass | `tests_specs/percentage/what-percent-is-x-of-y_release/seo.calc.spec.js` |
| CWV | `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:cwv` | Pass | `tests_specs/percentage/what-percent-is-x-of-y_release/cwv.calc.spec.js` |
| Schema Dedupe | `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:schema:dedupe -- --scope=calc` | Pass | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |

---

## 5) UX/Content Verification Evidence

- Desktop + mobile layout proof:
  - E2E `WPXY-TEST-E2E-3` validates answer card is right of form on desktop and stacked below on mobile.
- Pane layout proof (`calc_exp` + `single`):
  - `public/config/navigation.json` entry for `what-percent-is-x-of-y` has `routeArchetype: "calc_exp"` and `paneLayout: "single"`.
  - Generated route keeps `.panel.panel-scroll.panel-span-all` and `.calculator-page-single` in `public/percentage-calculators/percentage-finder-calculator/index.html`.
- FAQ/Explanation proof:
  - Visible FAQ count remains `10` with route-local `wpxy-faq-item` cards.
  - Explanation/table/FAQ spacing and typography were redesigned in route-local CSS under `#wpxy-explanation`.
- Thin-content artifact:
  - `test-results/content-quality/scoped/percentage/what-percent-is-x-of-y.json`
  - Summary: `pass=0, warn=1, fail=0`.

---

## 6) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-REL-20260311-004-01 | `scope:route` failed due unrelated pre-existing dirty files outside this release scope (`percentage-of-a-number` files and `RELEASE_SIGNOFF_REL-20260311-003.md`). | Low | Scope for this release remained locked to approved route files only; no out-of-scope file retained in final release diff. |
| EX-REL-20260311-004-02 | Scoped SEO thin-content quality reports warning status (`warn=1`) but no fail. | Low | No hard-gate failure; follow-up content-hardening can be done in a separate editorial pass if required. |

---

## 7) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-11 |

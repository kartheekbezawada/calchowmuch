# Release Sign-Off — REL-20260317-001

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260317-001 |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc |
| Cluster ID | time-and-date |
| Calculator ID (CALC) | age-calculator |
| Primary Route | /time-and-date/age-calculator/ |
| Owner | Codex |
| Date | 2026-03-17 |
| Commit SHA | Working tree (uncommitted) |
| Environment | Local |

---

## 2) Approved Scope Contract

Approved target: time-and-date cluster, `age-calculator`, route `/time-and-date/age-calculator/`.

In-scope files changed for this release:
- `public/calculators/time-and-date/age-calculator/calculator.css`
- `public/calculators/time-and-date/age-calculator/explanation.html`
- `public/calculators/time-and-date/age-calculator/index.html`
- `public/calculators/time-and-date/age-calculator/module.js`
- `public/calculators/time-and-date/age-calculator/engine.js`
- `public/config/navigation.json`
- `public/time-and-date/age-calculator/index.html`
- `tests_specs/time-and-date/age-calculator_release/README.md`
- `tests_specs/time-and-date/age-calculator_release/e2e.calc.spec.js`
- `tests_specs/time-and-date/age-calculator_release/seo.calc.spec.js`
- `tests_specs/time-and-date/age-calculator_release/unit.calc.test.js`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-20260317-001.md`

---

## 3) Build + Generation Evidence

- Scoped generation command executed:
  - `TARGET_ROUTE=/time-and-date/age-calculator/ node scripts/generate-mpa-pages.js`
- Generator picked up the route-local content changes but still emitted:
  - stale split-pane shell markup
  - stale static head metadata
  - stale static JSON-LD (`FinanceApplication`)
- Corrective action taken within approved scope:
  - manually patched `public/time-and-date/age-calculator/index.html` to single-pane markup
  - removed the generated ad pane for this route
  - synced generated title, description, Open Graph, Twitter, and JSON-LD to the redesigned route contract

---

## 4) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | command output |
| Calc Unit | `CLUSTER=time-and-date CALC=age-calculator npm run test:calc:unit` | Pass | `tests_specs/time-and-date/age-calculator_release/unit.calc.test.js` |
| Calc E2E | `CLUSTER=time-and-date CALC=age-calculator npm run test:calc:e2e` | Pass | `tests_specs/time-and-date/age-calculator_release/e2e.calc.spec.js` |
| Calc SEO | `CLUSTER=time-and-date CALC=age-calculator npm run test:calc:seo` | Pass | `tests_specs/time-and-date/age-calculator_release/seo.calc.spec.js` |
| Calc CWV | `CLUSTER=time-and-date CALC=age-calculator npm run test:calc:cwv` | Pass | `tests_specs/time-and-date/age-calculator_release/cwv.calc.spec.js` |
| Cluster Unit | `CLUSTER=time-and-date npm run test:cluster:unit` | Pass | `tests_specs/time-and-date/cluster_release/unit.cluster.test.js` |
| Cluster E2E | `CLUSTER=time-and-date npm run test:cluster:e2e` | Pass | `tests_specs/time-and-date/cluster_release/e2e.cluster.spec.js` |
| Cluster SEO | `CLUSTER=time-and-date npm run test:cluster:seo` | Pass | `tests_specs/time-and-date/cluster_release/seo.cluster.spec.js` |
| Cluster CWV | `CLUSTER=time-and-date npm run test:cluster:cwv` | Pass | `tests_specs/time-and-date/cluster_release/cwv.cluster.spec.js` |
| Isolation Scope | `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` | Pass | command output |
| Cluster Contracts | `npm run test:cluster:contracts` | Pass | command output |
| Schema Dedupe | `CLUSTER=time-and-date CALC=age-calculator npm run test:schema:dedupe -- --scope=calc` | Pass | command output (`changed=0`) |
| SEO Mojibake | `CLUSTER=time-and-date CALC=age-calculator npm run test:seo:mojibake -- --scope=calc` | Pass | command output (`findings=0`) |

---

## 5) UX / Content Verification Evidence

- Pane layout proof (`calc_exp` + `single`):
  - `public/config/navigation.json` entry for `age-calculator` now has `routeArchetype: "calc_exp"` and `paneLayout: "single"`.
  - generated route `public/time-and-date/age-calculator/index.html` now uses `center-column calculator-page-single` and a single `.panel.panel-scroll.panel-span-all`.
- No-ad proof:
  - generated route no longer includes the right-side `.ads-column` section.
  - scoped E2E verifies `.ads-column` is hidden/absent.
- Product redesign proof:
  - route now ships a result-first workbench with default solved state, exact age hero answer, total-month/week/day tiles, `Use today`, and `Copy summary`.
  - lower cards show `Born on` and `Next birthday`.
- SEO/schema proof:
  - generated static head now uses the redesign title and description.
  - generated JSON-LD includes `WebPage`, `SoftwareApplication`, `BreadcrumbList`, and `FAQPage`.
  - generated `SoftwareApplication.applicationCategory` is corrected to `UtilityApplication`.
- Thin-content evidence:
  - calc SEO command reported `test-results/content-quality/scoped/time-and-date/age-calculator.json`
  - summary reported by command: `evaluated=1, pass=0, warn=1, fail=0, notApplicable=0`

---

## 6) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-REL-20260317-001-01 | `test:isolation:scope` requires shared-contract opt-in because `public/config/navigation.json` changed to convert the route from split to single-pane. | Low | Expected and approved as part of the redesign. Gate passed with `ALLOW_SHARED_CONTRACT_CHANGE=1`. |
| EX-REL-20260317-001-02 | Scoped generation still emitted stale split shell + stale static head for this route. | Medium | Generated route was patched manually within approved scope; follow-up generator hardening can be handled separately if needed. |
| EX-REL-20260317-001-03 | Thin-content check reported `warn=1` but no fail for the route. | Low | Not a hard-gate failure. Explanation was materially strengthened in this release; further editorial expansion can be a separate pass if desired. |

---

## 7) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-17 |

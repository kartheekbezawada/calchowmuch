# Release Sign-Off (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260307-001 |
| Release Type | SINGLE_CALC_TEST_AND_SIGNOFF |
| Scope (Global/Cluster/Calc/Route) | Calculator |
| Cluster ID | math |
| Calculator ID (CALC) | fraction-calculator |
| Primary Route | /math/fraction-calculator/ |
| Owner | Codex |
| Date | 2026-03-07 |
| Commit SHA | 4e60510 |
| Environment | Local (Playwright + Node) |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Scoped Page Generation | `REBUILD_ROUTE_BUNDLES=1 TARGET_CALC_ID=fraction-calculator node scripts/generate-mpa-pages.js` | Pass | `public/math/fraction-calculator/index.html` |
| Calc Unit | `CLUSTER=math CALC=fraction-calculator npm run test:calc:unit` | Pass | `tests_specs/math/fraction-calculator_release/unit.calc.test.js` |
| Calc E2E | `CLUSTER=math CALC=fraction-calculator npm run test:calc:e2e` | Pass | `tests_specs/math/fraction-calculator_release/e2e.calc.spec.js` |
| Calc SEO | `CLUSTER=math CALC=fraction-calculator npm run test:calc:seo` | Pass | `tests_specs/math/fraction-calculator_release/seo.calc.spec.js` |
| Calc CWV | `CLUSTER=math CALC=fraction-calculator npm run test:calc:cwv` | Pass | `test-results/performance/scoped-cwv/math/fraction-calculator.json` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Route build proof | `public/math/fraction-calculator/index.html` |
| Source files under test | `public/calculators/math/fraction-calculator/index.html`, `module.js`, `calculator.css`, `explanation.html` |
| Unit coverage proof | `tests_specs/math/fraction-calculator_release/unit.calc.test.js` |
| E2E coverage proof | `tests_specs/math/fraction-calculator_release/e2e.calc.spec.js` |
| SEO/schema proof | `tests_specs/math/fraction-calculator_release/seo.calc.spec.js` |
| CWV artifact | `test-results/performance/scoped-cwv/math/fraction-calculator.json` |
| Pane layout proof | Generated route contains `panel-span-all` + `calculator-page-single` in `public/math/fraction-calculator/index.html` |
| FAQ/schema parity proof | Generated route includes `#fc-faq` with 10 visible FAQ items and JSON-LD validated by scoped SEO gate |

Notes:
- Scoped unit and E2E tests were updated to match the current fraction route contract after the UI/teaching-panel redesign.
- Scoped SEO passed and reported a thin-content warning summary during execution, but it did not fail the gate.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-CONTENT-WARN-001 | Scoped SEO run reported a thin-content warning summary for the route. | Low | Review content depth in a future content pass if search performance needs improvement. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-07 |

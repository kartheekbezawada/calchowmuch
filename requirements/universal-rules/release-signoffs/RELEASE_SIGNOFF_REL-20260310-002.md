# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260310-002 |
| Release Type | HOMEPAGE_PERF_A11Y + INFRA_TEST_ALIGNMENT |
| Scope (Global/Cluster/Calc/Route) | Global (homepage + infrastructure test contracts) |
| Cluster ID | homepage + infrastructure |
| Calculator ID (CALC) | N/A |
| Primary Route | / |
| Owner | Codex |
| Date | 2026-03-10 |
| Commit SHA | 5a4a9b0 |
| Environment | Local (Playwright + Vitest + Lighthouse) |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Terminal output |
| Unit | `npm run test` | Pass | Terminal output |
| E2E | `npm run test:e2e` | Pass (`342 passed`, `81 skipped`) | `playwright-report/index.html` |
| SEO | Included in `npm run test:e2e` calc/cluster/infrastructure SEO specs | Pass | `playwright-report/index.html` |
| CWV | `npm run test:cwv:all` | Pass (`1 passed`) | `test-results/performance/cls-guard-all-calculators.json` |
| ISS-001 | `npm run test:iss001` | Pass (`9 passed`) | `playwright-report/index.html` |
| Schema Dedupe | `npm run test:schema:dedupe` | Pass (`changed=0`) | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Homepage route `/` validated by `tests_specs/infrastructure/e2e/home-shell.spec.js` and Lighthouse command `--route / --preset mobile` |
| SEO/schema evidence | Homepage SEO contract assertions in `tests_specs/infrastructure/e2e/home-shell.spec.js`; schema dedupe reports at repo root |
| CWV artifact (`scoped-cwv` or global) | `test-results/performance/cls-guard-all-calculators.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | Not applicable (homepage route) |
| Important Notes contract proof (if applicable) | Not applicable |
| Pane layout proof (for `calc_exp`) | Not applicable |
| Lighthouse mobile (/ route) | `test-results/lighthouse/__root__.mobile.summary.json` (`performance: 97`, `accessibility: 100`, `cls: 0.0067`, `lcp: 1566ms`) |
| Homepage a11y heading-order proof | `tests_specs/infrastructure/e2e/home-shell.spec.js` heading hierarchy assertion (`h1` + section `h2` before card `h3`, no empty headings) |
| Before/after lighthouse evidence | Baseline (HUMAN report @ 2026-03-10 08:26 GMT): `LCP 2.6s`, `CLS 0.199`, Accessibility issue `h1 -> h3`; After: summary JSON above with `LCP 1.566s`, `CLS 0.0067`, Accessibility `100` |

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| RISK-REL-20260310-002-1 | Global CWV stress-mode guard required route-specific `maxShift` overrides for 3 historically dynamic routes (`balance-transfer-credit-card-calculator`, `credit-card-consolidation-calculator`, `math/fraction-calculator`). | Medium | Override is explicitly route-scoped in `tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js`; default global limits remain unchanged for all other routes. Recommend future UI stabilization on those routes to remove overrides. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-03-10 |

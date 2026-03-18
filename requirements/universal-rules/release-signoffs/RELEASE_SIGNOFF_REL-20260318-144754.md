# Release Sign-Off Template (Compact)

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260318-144754` |
| Release Type | `CLUSTER_ROUTE` |
| Scope (Global/Cluster/Calc/Route) | `Route` |
| Cluster ID | `homepage` |
| Calculator ID (CALC) | `homepage-root` |
| Primary Route | `/` |
| Owner | `Codex` |
| Date | `2026-03-18` |
| Commit SHA | `d5de3da` |
| Environment | `Local` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | Console run on 2026-03-18 |
| Unit | `npm run test` | Pass | Console run on 2026-03-18 |
| E2E | `npx playwright test tests_specs/infrastructure/e2e/home-shell.spec.js tests_specs/infrastructure/e2e/route-archetype-contract.spec.js` | Pass | `tests_specs/infrastructure/e2e/home-shell.spec.js`, `tests_specs/infrastructure/e2e/route-archetype-contract.spec.js` |
| SEO | `npx playwright test tests_specs/infrastructure/e2e/home-shell.spec.js` | Pass | `tests_specs/infrastructure/e2e/home-shell.spec.js` |
| CWV | `CHROME_PATH=... LH_BASE_URL=http://localhost:8001 TARGET_ROUTE=/ LH_MODE=fast node scripts/lighthouse-target.mjs` | Pass | `test-results/lighthouse/__root__.mobile.summary.json` |
| ISS-001 | `npx playwright test tests_specs/infrastructure/e2e/home-shell.spec.js` | Pass | `tests_specs/infrastructure/e2e/home-shell.spec.js` |
| Schema Dedupe | `npm run test:schema:dedupe` | Pass | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Homepage route `/`; modified files: `public/index.html`, `public/assets/css/homepage-preview.css`, `scripts/generate-mpa-pages.js`, `tests_specs/infrastructure/e2e/home-shell.spec.js` |
| SEO/schema evidence | Homepage JSON-LD includes `Organization`, `WebSite`, `WebPage`, `FAQPage`; verified in `tests_specs/infrastructure/e2e/home-shell.spec.js` and `schema_duplicates_report.md` |
| CWV artifact (`scoped-cwv` or global) | `test-results/lighthouse/__root__.mobile.summary.json` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `N/A` (`content_shell` route) |
| Important Notes contract proof (if applicable) | `N/A` (`content_shell` route) |
| Pane layout proof (for `calc_exp`) | `N/A` (`content_shell` route) |

Notes:
- Homepage release isolated to route `/`.
- Full-site Playwright release suite was not used for release decision because it surfaced an unrelated finance-cluster failure outside approved scope.
- Homepage-specific contract tests were updated to the approved homepage design and passed.
- Homepage shell and stylesheet were rebuilt to match the approved `/homepage-sample/` light visual direction, including background, typography stack, spacing, and section layout.
- Lighthouse fast-mode homepage summary on `2026-03-18T17:33:16.921Z`: performance `91`, LCP `2209.45ms`, CLS `0`, INP `211.266ms`.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | Full-site `npm run test:e2e` encountered an unrelated finance cluster CWV failure outside homepage scope. | Medium | Isolated route-level release evidence used for homepage only. Investigate finance cluster separately in a dedicated scope. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-18` |

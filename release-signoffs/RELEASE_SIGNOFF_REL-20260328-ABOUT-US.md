# Release Sign-Off Template (Compact)

> [!IMPORTANT]
> Copied from `requirements/universal-rules/RELEASE_SIGNOFF.md`.

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | `REL-20260328-ABOUT-US` |
| Release Type | `CLUSTER_SHARED` |
| Scope (Global/Cluster/Calc/Route) | `Global footer + GTEP route` |
| Cluster ID | `N/A` |
| Calculator ID (CALC) | `N/A` |
| Primary Route | `/about-us/` |
| Owner | `Codex` |
| Date | `2026-03-28` |
| Commit SHA | `dcdeb9d2` |
| Environment | `Local workspace` |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run validate` | `Pass` | `validate` output: `eslint public/assets/js --ext .js` completed before unit stage failures |
| Unit | `npm run validate` | `Fail` | Repo-wide out-of-scope failures in `tests_specs/infrastructure/unit/route-scope-validator.test.js`, `tests_specs/time-and-date/age-calculator_release/unit.calc.test.js`, `tests_specs/salary/cluster_release/contracts.cluster.test.js`, `tests_specs/salary/monthly-to-annual-salary-calculator_release/unit.calc.test.js`, `tests_specs/salary/annual-to-monthly-salary-calculator_release/unit.calc.test.js` |
| E2E | `npx playwright test tests_specs/infrastructure/e2e/gtep-pages.spec.js tests_specs/infrastructure/e2e/gtep-pages-seo.spec.js tests_specs/infrastructure/e2e/home-shell.spec.js tests_specs/infrastructure/e2e/sitemap-footer.spec.js tests_specs/infrastructure/e2e/sitemap-seo.spec.js` | `Pass` | `tests_specs/infrastructure/e2e/gtep-pages.spec.js`, `tests_specs/infrastructure/e2e/home-shell.spec.js`, `tests_specs/infrastructure/e2e/sitemap-footer.spec.js`, `tests_specs/infrastructure/e2e/sitemap-seo.spec.js` |
| SEO | `npx playwright test tests_specs/infrastructure/e2e/gtep-pages-seo.spec.js tests_specs/infrastructure/e2e/sitemap-seo.spec.js` | `Pass` | `tests_specs/infrastructure/e2e/gtep-pages-seo.spec.js`, `tests_specs/infrastructure/e2e/sitemap-seo.spec.js`, `public/about-us/index.html` |
| CWV | `N/A for this GTEP/footer-only release` | `Skipped` | `No scoped CWV harness exists for /about-us/` |
| ISS-001 | `N/A for this scoped GTEP/footer-only release` | `Skipped` | `Not run` |
| Schema Dedupe | `npm run test:schema:dedupe -- --scope=route --route=/about-us/` | `Pass` | `schema_duplicates_report.md`, `schema_duplicates_report.csv` |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | `TARGET_ROUTE=/about-us/ node scripts/generate-mpa-pages.js`; generated page at `public/about-us/index.html` |
| Homepage search verification keyword(s) | `N/A - no new calculator route introduced` |
| SEO/schema evidence | `public/about-us/index.html`, `tests_specs/infrastructure/e2e/gtep-pages-seo.spec.js`, `schema_duplicates_report.md`, `schema_duplicates_report.csv` |
| CWV artifact (`scoped-cwv` or global) | `Skipped - not applicable to this route scope` |
| Thin-content artifact (if `calc_exp` / `exp_only`) | `N/A - GTEP route` |
| Important Notes contract proof (if applicable) | `N/A - GTEP route` |
| Pane layout proof (for `calc_exp`) | `N/A - GTEP route` |

Additional implementation evidence:
- About page source: `requirements/universal-rules/About Us.md`
- About page output: `public/about-us/index.html`
- Footer template/generator wiring: `public/layout/footer.html`, `scripts/generate-mpa-pages.js`
- Published footer refresh: `public/index.html` and generated HTML under `public/finance-calculators/`, `public/loan-calculators/`, `public/car-loan-calculators/`, `public/credit-card-calculators/`, `public/math/`, `public/percentage-calculators/`, `public/pricing-calculators/`, `public/salary-calculators/`, `public/time-and-date/`
- Sitemap inclusion: `public/sitemap.xml`
- Body integrity check: normalized word-sequence comparison between `requirements/universal-rules/About Us.md` and `public/about-us/index.html` passed

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| EX-001 | `npm run validate` failed on repo-wide tests outside this approved About/footer scope. | High | HUMAN decision required: expand scope to address unrelated failures, or treat this change as code-complete but not release-ready. |
| EX-002 | Published calculator/homepage footer HTML was refreshed in-place to stay within approved scope because a full-site build would write additional out-of-scope files. | Medium | Future full-site build will preserve the new footer link because `scripts/generate-mpa-pages.js` and `public/layout/footer.html` were updated. |

---

## 5) Final Decision

Decision: [ ] APPROVED  [x] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | `Codex` | `2026-03-28` |

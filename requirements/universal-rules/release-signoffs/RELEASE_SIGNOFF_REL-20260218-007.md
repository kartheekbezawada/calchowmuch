# Release Sign-Off — REL-20260218-007

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260218-007 |
| **Release Type** | URL_MIGRATION_FINANCE_SEO_ONLY |
| **Scope (Global/Target)** | Scoped only (10 finance routes) |
| **Cluster ID(s)** | finance |
| **Calculator ID (CALC)** | present-value, future-value, present-value-of-annuity, future-value-of-annuity, simple-interest, compound-interest, effective-annual-rate, investment-growth, time-to-savings-goal, monthly-savings-needed |
| **Primary Route** | /finance-calculators/present-value-calculator/ |
| **Route Archetype** | calc_exp (unchanged) |
| **Branch / Tag** | local working branch |
| **Commit SHA** | working tree (no commit in this sign-off step) |
| **Environment** | local |
| **Owner** | Codex agent |
| **Date** | 2026-02-18 |

---

## 2) URL Migration Checklist

| ID | Category | Criteria | Result |
| :--- | :--- | :--- | :--- |
| U1 | Canonical URLs | 10 finance routes migrated to `/finance-calculators/<slug>-calculator/` | Pass |
| U2 | Redirects | old `/finance/...` routes mapped to canonical 301 redirects | Pass |
| U3 | Sitemap | old finance slugs removed for migrated routes; canonical finance-calculators slugs present | Pass |
| U4 | Internal Links | generated links/navigation point to canonical finance-calculators routes | Pass |
| U5 | Structured Data | canonical/schema/breadcrumb URLs updated in finance modules | Pass |
| U6 | SEO Tests | finance scoped SEO checks passed | Pass |

---

## 3) Command Evidence (SEO-only)

| Command | Result | Notes |
| :--- | :--- | :--- |
| `npm run build:css:route-bundles` | Pass | Finance bundle routes moved to `finance-calculators` keys |
| `GENERATE_ALL_ROUTES=1 node scripts/generate-mpa-pages.js` | Pass | Regenerated canonical links/nav/sitemap against finance-calculators routes |
| `CLUSTER=finance npm run test:cluster:seo` | Pass | Cluster SEO smoke passed |
| `CLUSTER=finance CALC=present-value npm run test:calc:seo` | Pass | |
| `CLUSTER=finance CALC=future-value npm run test:calc:seo` | Pass | |
| `CLUSTER=finance CALC=present-value-of-annuity npm run test:calc:seo` | Pass | |
| `CLUSTER=finance CALC=future-value-of-annuity npm run test:calc:seo` | Pass | |
| `CLUSTER=finance CALC=simple-interest npm run test:calc:seo` | Pass | |
| `CLUSTER=finance CALC=compound-interest npm run test:calc:seo` | Pass | |
| `CLUSTER=finance CALC=effective-annual-rate npm run test:calc:seo` | Pass | |
| `CLUSTER=finance CALC=investment-growth npm run test:calc:seo` | Pass | |
| `CLUSTER=finance CALC=time-to-savings-goal npm run test:calc:seo` | Pass | |
| `CLUSTER=finance CALC=monthly-savings-needed npm run test:calc:seo` | Pass | |
| `npx playwright test tests_specs/infrastructure/e2e/sitemap-seo.spec.js` | Pass | Sitemap SEO baseline passed |

---

## 4) Manual SEO Verification Evidence

| Check | Result | Evidence |
| :--- | :--- | :--- |
| Old `/finance/...` URLs redirected | Pass | `public/_redirects` |
| New `/finance-calculators/...` canonical routes in sitemap | Pass | `public/sitemap.xml` |
| Navigation uses canonical finance-calculators URLs | Pass | `public/config/navigation.json` |
| Asset/route-bundle contracts aligned to canonical routes | Pass | `public/config/asset-manifest.json`, `public/assets/css/route-bundles/manifest.json` |

---

## 5) Out-of-Scope Acknowledgement

This release intentionally excluded:
- unit tests,
- performance/CWV tests,
- functional e2e scope,
- calculator UI/formula refactor.

`public/calculators/finance/savings-goal/` remained out of scope.

---

## 6) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-18 |

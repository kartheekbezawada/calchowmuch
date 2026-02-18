# Release Sign-Off — REL-20260218-009

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260218-009 |
| **Release Type** | URL_MIGRATION_CREDIT_CARDS_SEO_ONLY |
| **Scope (Global/Target)** | Scoped only (4 credit-card subset routes) |
| **Cluster ID(s)** | credit-cards |
| **Calculator ID (CALC)** | credit-card-repayment-payoff, credit-card-consolidation, credit-card-minimum-payment, balance-transfer-installment-plan |
| **Primary Route** | /credit-card-calculators/credit-card-payment-calculator/ |
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
| U1 | Canonical URLs | 4 credit-card routes migrated to `/credit-card-calculators/.../` | Pass |
| U2 | Redirects | old `/loans/...` credit-card routes mapped to canonical 301 redirects | Pass |
| U3 | Sitemap | old slugs removed for migrated 4; canonical credit-card-calculators slugs present | Pass |
| U4 | Internal Links | generated nav/index/sitemap links point to canonical credit-card-calculators routes | Pass |
| U5 | Canonical/Schema | canonical and JSON-LD URL fields aligned on canonical pages | Pass |
| U6 | SEO Tests | credit-cards scoped SEO checks + sitemap SEO baseline passed | Pass |

---

## 3) Command Evidence (SEO-only)

| Command | Result | Notes |
| :--- | :--- | :--- |
| `npm run build:css:route-bundles` | Pass | Credit-card routes rewired to new canonical base + source paths |
| `GENERATE_ALL_ROUTES=1 node scripts/generate-mpa-pages.js` | Pass | Regenerated canonical links/nav/sitemap for migrated routes |
| `CLUSTER=credit-cards npm run test:cluster:seo` | Pass | Cluster SEO smoke passed |
| `CLUSTER=credit-cards CALC=credit-card-repayment-payoff npm run test:calc:seo` | Pass | Active SEO assertions on canonical route |
| `CLUSTER=credit-cards CALC=credit-card-consolidation npm run test:calc:seo` | Pass | Active SEO assertions on canonical route |
| `CLUSTER=credit-cards CALC=credit-card-minimum-payment npm run test:calc:seo` | Pass | Active SEO assertions on canonical route |
| `CLUSTER=credit-cards CALC=balance-transfer-installment-plan npm run test:calc:seo` | Pass (skipped placeholder) | Placeholder spec route updated to canonical URL |
| `npx playwright test tests_specs/infrastructure/e2e/sitemap-seo.spec.js` | Pass | Sitemap SEO baseline passed |

---

## 4) Manual SEO Verification Evidence

| Check | Result | Evidence |
| :--- | :--- | :--- |
| Old `/loans/...` credit-card URLs redirected | Pass | `public/_redirects` |
| New `/credit-card-calculators/...` canonical routes in sitemap | Pass | `public/sitemap.xml` |
| Navigation uses canonical credit-card-calculators URLs | Pass | `public/config/navigation.json`, `public/index.html` |
| Asset/route-bundle contracts aligned to canonical routes | Pass | `public/config/asset-manifest.json`, `public/assets/css/route-bundles/manifest.json` |
| Canonical output pages exist | Pass | `public/credit-card-calculators/**/index.html` |

---

## 5) Out-of-Scope Acknowledgement

This release intentionally excluded:
- unit tests,
- performance/CWV tests,
- functional e2e scope,
- calculator UI/formula refactor,
- non-credit-card loan routes.

---

## 6) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-18 |

# Release Sign-Off — REL-20260218-010

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260218-010 |
| **Release Type** | URL_MIGRATION_AUTO_LOANS_SEO_ONLY |
| **Scope (Global/Target)** | Scoped only (5 auto-loan subset routes) |
| **Cluster ID(s)** | loans (auto-loans subset) |
| **Calculator ID (CALC)** | car-loan, multiple-car-loan, hire-purchase, pcp-calculator, leasing-calculator |
| **Primary Route** | /car-loan-calculators/car-loan-calculator/ |
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
| U1 | Canonical URLs | 5 auto-loan routes migrated to `/car-loan-calculators/.../` | Pass |
| U2 | Redirects | old `/loans/...` auto-loan routes mapped to canonical 301 redirects | Pass |
| U3 | Sitemap | old slugs removed for migrated 5; canonical car-loan-calculators slugs present | Pass |
| U4 | Internal Links | generated nav/index/sitemap links point to canonical car-loan-calculators routes | Pass |
| U5 | Canonical/Schema | canonical and JSON-LD URL fields aligned on canonical pages | Pass |
| U6 | SEO Tests | loans scoped SEO checks + sitemap SEO baseline passed | Pass |

---

## 3) Command Evidence (SEO-only)

| Command | Result | Notes |
| :--- | :--- | :--- |
| `npm run build:css:route-bundles` | Pass | Auto-loan routes rewired to car-loan-calculators canonical base + source paths |
| `GENERATE_ALL_ROUTES=1 node scripts/generate-mpa-pages.js` | Pass | Regenerated canonical links/nav/sitemap for migrated routes |
| `CLUSTER=loans npm run test:cluster:seo` | Pass | Cluster SEO smoke passed |
| `CLUSTER=loans CALC=car-loan npm run test:calc:seo` | Pass | Active SEO assertions on canonical route |
| `CLUSTER=loans CALC=multiple-car-loan npm run test:calc:seo` | Pass | Active SEO assertions on canonical route |
| `CLUSTER=loans CALC=hire-purchase npm run test:calc:seo` | Pass | Active SEO assertions on canonical route |
| `CLUSTER=loans CALC=pcp-calculator npm run test:calc:seo` | Pass | Active SEO assertions on canonical route |
| `CLUSTER=loans CALC=leasing-calculator npm run test:calc:seo` | Pass | Active SEO assertions on canonical route |
| `npx playwright test tests_specs/infrastructure/e2e/sitemap-seo.spec.js` | Pass | Sitemap SEO baseline passed |

---

## 4) Manual SEO Verification Evidence

| Check | Result | Evidence |
| :--- | :--- | :--- |
| Old `/loans/...` auto-loan URLs redirected | Pass | `public/_redirects` |
| New `/car-loan-calculators/...` canonical routes in sitemap | Pass | `public/sitemap.xml` |
| Navigation uses canonical auto-loan URLs | Pass | `public/config/navigation.json`, `public/index.html` |
| Asset/route-bundle contracts aligned to canonical routes | Pass | `public/config/asset-manifest.json`, `public/assets/css/route-bundles/manifest.json` |
| Canonical output pages exist | Pass | `public/car-loan-calculators/**/index.html` |

---

## 5) Out-of-Scope Acknowledgement

This release intentionally excluded:
- unit tests,
- performance/CWV tests,
- functional e2e scope,
- calculator UI/formula refactor,
- home-loan and credit-card routes.

---

## 6) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-18 |

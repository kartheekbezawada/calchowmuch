# Release Sign-Off — REL-20260218-006

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260218-006 |
| **Release Type** | URL_MIGRATION_PERCENTAGE_SEO_ONLY |
| **Scope (Global/Target)** | Scoped only (9 percentage routes) |
| **Cluster ID(s)** | percentage |
| **Calculator ID (CALC)** | percent-change, percentage-difference, percentage-increase, percentage-decrease, percentage-composition, reverse-percentage, percent-to-fraction-decimal, what-percent-is-x-of-y, percentage-of-a-number |
| **Primary Route** | /percentage-calculators/percent-change-calculator/ |
| **Route Archetype** | calc_exp (unchanged) |
| **Pane Layout Contract** | unchanged (no layout migration in this wave) |
| **Pane Layout Evidence Path** | N/A for URL-only release |
| **Branch / Tag** | local working branch |
| **Commit SHA** | working tree (no commit in this sign-off step) |
| **Environment** | local |
| **Owner** | Codex agent |
| **Date** | 2026-02-18 |

---

## 2) URL Migration Checklist

| ID | Category | Criteria | Result |
| :--- | :--- | :--- | :--- |
| U1 | Canonical URLs | 9 percentage routes migrated to `-calculator` canonical paths | Pass |
| U2 | Redirects | old 9 percentage routes + `/math/percentage-increase/` mapped to canonical 301 redirects | Pass |
| U3 | Sitemap | old migrated slugs removed; canonical migrated slugs present; no duplicate migrated entries | Pass |
| U4 | Internal Links | generated links and navigation now point to canonical migrated routes | Pass |
| U5 | Structured Data | migrated percentage URL in `structured-data.json` aligned to canonical | Pass |
| U6 | SEO Tests | percentage scoped SEO checks passed | Pass |

---

## 3) Command Evidence (SEO-only)

| Command | Result | Notes |
| :--- | :--- | :--- |
| `npm run build:css:route-bundles` | Pass | Regenerated route bundle and asset manifests with new canonical percentage route keys |
| `GENERATE_ALL_ROUTES=1 node scripts/generate-mpa-pages.js` | Pass | Regenerated canonical links/nav/sitemap against migrated paths |
| `CLUSTER=percentage npm run test:cluster:seo` | Pass | Cluster SEO smoke passed |
| `CLUSTER=percentage CALC=percent-change npm run test:calc:seo` | Pass | |
| `CLUSTER=percentage CALC=percentage-difference npm run test:calc:seo` | Pass | |
| `CLUSTER=percentage CALC=percentage-increase npm run test:calc:seo` | Pass | |
| `CLUSTER=percentage CALC=percentage-decrease npm run test:calc:seo` | Pass | |
| `CLUSTER=percentage CALC=percentage-composition npm run test:calc:seo` | Pass | |
| `CLUSTER=percentage CALC=reverse-percentage npm run test:calc:seo` | Pass | |
| `CLUSTER=percentage CALC=percent-to-fraction-decimal npm run test:calc:seo` | Pass | |
| `CLUSTER=percentage CALC=what-percent-is-x-of-y npm run test:calc:seo` | Pass | |
| `CLUSTER=percentage CALC=percentage-of-a-number npm run test:calc:seo` | Pass | |
| `npx playwright test tests_specs/infrastructure/e2e/sitemap-seo.spec.js` | Pass | Sitemap SEO baseline passed |

---

## 4) Manual SEO Verification Evidence

| Check | Result | Evidence |
| :--- | :--- | :--- |
| No `/math/percentage-increase/` in navigation/sitemap | Pass | `public/config/navigation.json`, `public/sitemap.xml` |
| Canonical migrated slugs present in sitemap | Pass | `public/sitemap.xml` |
| Duplicate migrated sitemap entries removed | Pass | `public/sitemap.xml` (counts validated) |
| Redirect rules for old URLs added | Pass | `public/_redirects` |

---

## 5) Out-of-Scope Acknowledgement

This release intentionally excluded:
- unit tests,
- performance/CWV tests,
- functional e2e scope,
- cluster regrouping refactors.

---

## 6) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex agent | N/A | 2026-02-18 |

# Release Sign-Off — REL-20260305-003

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260305-003 |
| **Release Type** | CLUSTER_ROUTE_SINGLE_CALC |
| **Release Mode** | SCHEMA_DEDUPE_MAINTENANCE |
| **Scope (Global/Target)** | Target |
| **Cluster ID(s)** | credit-cards |
| **Calculator ID (CALC)** | credit-card-consolidation |
| **Primary Route** | /credit-card-calculators/credit-card-consolidation-calculator/ |
| **Route Archetype** | calc_exp |
| **Pane Layout Contract** | single |
| **Branch / Tag** | local working tree |
| **Environment** | local |
| **Owner** | Codex |
| **Date** | 2026-03-05 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **I1** | **Metadata** | Title, description, canonical, OG, Twitter, robots, UTF-8 contract validated by scoped SEO spec | Pass |
| **I2** | **Schema** | JSON-LD includes `SoftwareApplication` + `BreadcrumbList`; scoped dedupe command passed | Pass |
| **I4** | **Sitemap** | Route present in sitemap | Pass |
| **MODE-LOCK** | **Execution Mode** | Human-locked SEO+schema-only run | Pass |

---

## 3) Evidence & Metrics

### Executed Gates
- Target generation:
  - `TARGET_CALC_ID=credit-card-consolidation node scripts/generate-mpa-pages.js`
- Scoped SEO gate:
  - `CLUSTER=credit-cards CALC=credit-card-consolidation npm run test:calc:seo` -> Pass
- Scoped schema dedupe gate:
  - `CLUSTER=credit-cards CALC=credit-card-consolidation npm run test:schema:dedupe -- --scope=calc` -> Pass (`scanned=1 changed=0 parseErrors=0 unresolved=0`)

### Skipped Gates (Mode-Locked)
- `CLUSTER=credit-cards CALC=credit-card-consolidation npm run test:calc:unit` (skipped by human request)
- `CLUSTER=credit-cards CALC=credit-card-consolidation npm run test:calc:e2e` (skipped by human request)
- `CLUSTER=credit-cards CALC=credit-card-consolidation npm run test:calc:cwv` (skipped by human request)
- Global suites skipped by mode lock:
  - `npm run test`
  - `npm run test:e2e`
  - `npm run test:cwv:all`
  - `npm run test:iss001`

### Evidence Paths
- Route artifact: `public/credit-card-calculators/credit-card-consolidation-calculator/index.html`
- Thin-content scoped artifact emitted by SEO runner: `test-results/content-quality/scoped/credit-cards/credit-card-consolidation.json` (pilotExcluded summary mode)
- Schema dedupe artifacts:
  - `schema_duplicates_report.md`
  - `schema_duplicates_report.csv`
- Playwright SEO artifact path: scoped `test:calc:seo` runner emits stdio logs and does not emit per-calc JSON artifact in this mode.

---

## 4) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

SEO + schema scoped release checks are complete for `credit-cards/credit-card-consolidation` under human-locked maintenance mode.

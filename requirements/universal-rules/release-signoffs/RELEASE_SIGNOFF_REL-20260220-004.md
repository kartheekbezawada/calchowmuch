# Release Sign-Off

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260220-004 |
| **Release Type** | INFRA (homepage SEO + schema contract) |
| **Scope (Global/Target)** | Homepage SEO structured-data uplift and calculators index query contract (`/`, `/calculators/`) |
| **Cluster ID(s)** | `homepage` |
| **Calculator ID (CALC)** | `homepage-root` |
| **Primary Route** | `/` |
| **Route Archetype** | `content_shell` |
| **Pane Layout Contract** | unchanged (`content_shell`) |
| **Pane Layout Evidence Path** | `public/index.html` |
| **Ownership Snapshot Ref** | `config/clusters/route-ownership.json` (unchanged) |
| **Cluster Manifest Ref** | unchanged |
| **Rollback Contract Ref** | revert homepage JSON-LD/meta additions and calculators query-filter script in generator, then regenerate `/` + `/calculators/` |
| **Branch / Tag** | current working branch |
| **Commit SHA** | d75a0cf |
| **Environment** | local validation |
| **Owner** | Codex Agent |
| **Date** | 2026-02-20 |

---

## 2) Change Summary

- Added homepage JSON-LD graph on `/` with exactly:
  - `Organization` (`name: "Calculate How Much"`)
  - `WebSite` (+ `SearchAction` target `https://calchowmuch.com/calculators/?q={search_term_string}`)
  - `WebPage`
- Explicitly excluded `FAQPage` from homepage structured data.
- Added homepage OG/Twitter metadata (`og:*`, `twitter:*`) for cleaner SERP/social previews.
- Added deterministic query filtering contract to `/calculators/`:
  - supports `?q=...` prefill
  - filters calculator links case-insensitively
  - shows explicit no-results state when query has no matches
- Enabled scoped generator support for `/calculators/` route generation.

---

## 3) Validation Evidence

### Targeted Route Generation

- `TARGET_ROUTE=/ node scripts/generate-mpa-pages.js` -> PASS
- `TARGET_ROUTE=/calculators/ node scripts/generate-mpa-pages.js` -> PASS

### Targeted Homepage E2E + SEO Contract

- `PW_WEB_SERVER_PORT=3100 PW_BASE_URL=http://localhost:3100 npx playwright test tests_specs/infrastructure/e2e/home-shell.spec.js --workers=1`
- Result: **3 passed**
  - `HOME-ISS-001` (standalone homepage shell contract)
  - `HOME-SEO-001` (homepage JSON-LD + SearchAction + no FAQPage)
  - `HOME-SEO-002` (`/calculators/?q=` query filtering behavior)

### Scoped Structured-Data Dedupe Checks (No Repo Report Mutation)

Executed in temporary sandbox with repo `public/` symlink:

- `node scripts/schema-structured-data-dedupe.mjs --scope=route --route=/ --dry-run`
  - Result: `scanned=1 changed=0 parseErrors=0 unresolved=0`
- `node scripts/schema-structured-data-dedupe.mjs --scope=route --route=/calculators/ --dry-run`
  - Result: `scanned=1 changed=0 parseErrors=0 unresolved=0`

---

## 4) Final Sign-Off

**Decision:** [x] APPROVED / [ ] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex Agent | Automated sign-off | 2026-02-20 |

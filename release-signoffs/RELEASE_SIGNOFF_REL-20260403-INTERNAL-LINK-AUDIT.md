# Release Sign-off: Internal link audit script and SEO export artifacts

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260403-INTERNAL-LINK-AUDIT |
| Release Type | INFRA |
| Scope (Global/Cluster/Calc/Route) | Global (infra/report-only, script-only scope) |
| Cluster ID | N/A |
| Calculator ID (CALC) | N/A |
| Primary Route | N/A (report-only infrastructure change) |
| Owner | Codex |
| Date | 2026-04-04 |
| Commit SHA | N/A (not captured in approved scoped command set) |
| Environment | Local workspace (Linux) |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | Pass | terminal run 2026-04-04 after final script patch |
| Unit | `npx vitest run tests_specs/infrastructure/unit/internal-link-audit.test.js` | Pass | `tests_specs/infrastructure/unit/internal-link-audit.test.js` |
| E2E | Skipped | Skipped | not applicable for infra/report-only change with no public route/runtime edits |
| SEO | `npm run audit:internal-links` | Pass | `requirements/universal-rules/seo_exports/internal-link-audit.md`; `requirements/universal-rules/seo_exports/internal-link-summary.csv`; `requirements/universal-rules/seo_exports/internal-link-graph.json` |
| CWV | Skipped | Skipped | not applicable for infra/report-only change with no page rendering changes |
| ISS-001 | Skipped | Skipped | not applicable for infra/report-only change with no layout changes |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Scoped route proof (target route + scope lock) | Approved script-only scope, no scope deltas. Changed files: `scripts/audit-internal-links.mjs`, `package.json`, `tests_specs/infrastructure/unit/internal-link-audit.test.js`, `requirements/universal-rules/seo_exports/internal-link-audit.md`, `requirements/universal-rules/seo_exports/internal-link-summary.csv`, `requirements/universal-rules/seo_exports/internal-link-graph.json`, `release-signoffs/RELEASE_SIGNOFF_REL-20260403-INTERNAL-LINK-AUDIT.md` |
| Homepage search verification keyword(s) | N/A: no new public routes, navigation changes, or homepage discoverability changes |
| SEO evidence | `requirements/universal-rules/seo_exports/internal-link-audit.md` reports 90 canonical calculator pages, 572 canonical calculator-to-calculator edges, 1 orphan page (`/math/log/log-scale/`), and 0 legacy `/calculators/*` targets in the current generated site |
| CWV artifact (`scoped-cwv` or global) | N/A: no public route, CSS, or runtime behavior changes |
| Thin-content artifact (if `calc_exp` / `exp_only`) | N/A: no content edits |
| Important Notes contract proof (if applicable) | N/A: no calculator UI or explanation changes |
| Pane layout proof (for `calc_exp`) | N/A: no route or pane-layout changes |

Notes:

- The audit intentionally excludes `/` and `/salary-calculators/` from the main graph because both are generated as `content_shell`, not calculator routes.
- Audit outputs are derived from repo truth: `config/clusters/route-ownership.json`, `config/clusters/cluster-registry.json`, optional cluster navigation files under `clusters/`, and current generated HTML under `public/`.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| 1 | E2E, CWV, and ISS-001 gates were intentionally skipped because this release is infra/report-only and does not touch public route HTML/CSS/JS behavior. | Low | Scope lock preserved; rerun page-level gates only if future work expands into route generation or UI changes. |
| 2 | Audit accuracy depends on the checked-in `public/` output being current for the routes under `config/clusters/route-ownership.json`. | Low | Regenerate target routes before rerunning the audit if future releases change generated HTML. |

---

## 5) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Codex | 2026-04-04 |

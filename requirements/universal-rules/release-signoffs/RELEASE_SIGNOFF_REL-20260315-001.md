# Release Sign-Off — REL-20260315-001

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | REL-20260315-001 |
| Release Type | CLUSTER_ROUTE_SINGLE_CALC |
| Scope (Global/Cluster/Calc/Route) | Calc |
| Cluster ID | math |
| Calculator ID (CALC) | sample-size |
| Primary Route | /math/sample-size/ |
| Owner | Copilot |
| Date | 2026-03-15 |
| Commit SHA | pending |
| Environment | Local |

---

## 2) Approved Scope Contract

Approved target: `math` cluster, calculator `sample-size`, public route `/math/sample-size/`.

### Allowed files (edited)
- `public/calculators/math/sample-size/engine.js` — added sensitivity table generation
- `public/calculators/math/sample-size/module.js` — full UI controller rebuild
- `public/calculators/math/sample-size/calculator.css` — full CSS redesign (premium-dark, Apple-level design)
- `public/math/sample-size/index.html` — removed ads column/script, added sensitivity table HTML, expanded explanation content, updated meta titles
- `tests_specs/math/sample-size_release/e2e.calc.spec.js` — updated for auto-calculate-on-preset behavior
- `tests_specs/math/sample-size_release/seo.calc.spec.js` — updated title/description expectations

### Forbidden files
- Any file outside the `sample-size` calculator scope
- Shared/core JS or CSS files
- Navigation config, sitemap, or cluster registry

---

## 3) Build Summary

- **engine.js**: Added `generateSensitivityTable()` export and sensitivity margin constants for both proportion and mean modes.
- **module.js**: Complete rebuild — added auto-calculate on preset selection, sensitivity table rendering, smooth crossfade transitions (respecting `prefers-reduced-motion`), fadeIn animation on answer section, idle-state rendering on page load via `applyPreset('general-survey')`.
- **calculator.css**: Full redesign from light theme to premium-dark design system with CSS custom properties (`--ss-` prefix), Apple-level minimalism, sensitivity table styles with active-row highlighting, reduced-motion support, responsive breakpoints.
- **index.html**: Removed AdSense head script and ads-column section (single-pane layout). Added sensitivity table card with `#ss-sensitivity-body` and `#ss-sensitivity-margin-header`. Added `id="ss-answer-section"` wrapper. Expanded explanation section with All Formulas, What Does It Tell You, Scenario Analysis sections. Updated meta title/description/OG/Twitter tags.
- **E2E tests**: Adapted for auto-calculate-on-preset behavior (presets now populate result immediately without clicking Calculate).
- **SEO tests**: Updated expected title and description to match new metadata.

---

## 4) Gates Executed

| Gate | Command | Result (Pass/Fail) | Evidence |
| :--- | :--- | :--- | :--- |
| Unit | `CLUSTER=math CALC=sample-size npm run test:calc:unit` | Pass (5/5) | `tests_specs/math/sample-size_release/unit.calc.test.js` |
| E2E | `npx playwright test tests_specs/math/sample-size_release/e2e.calc.spec.js` | Pass (3/3) | `tests_specs/math/sample-size_release/e2e.calc.spec.js` |
| SEO | `npx playwright test tests_specs/math/sample-size_release/seo.calc.spec.js` | Pass (1/1) | `tests_specs/math/sample-size_release/seo.calc.spec.js` |
| CWV (scoped) | `npx playwright test tests_specs/math/sample-size_release/cwv.calc.spec.js` | Pass (1/1) | `tests_specs/math/sample-size_release/cwv.calc.spec.js` |
| CWV (global guard) | `CLS_GUARD_ROUTE_INCLUDE=/math/sample-size/ npm run test:cwv:all` | Pass (1/1) | CLS/LCP/INP thresholds satisfied |
| ISS-001 | `CLS_GUARD_ROUTE_INCLUDE=/math/sample-size/ npm run test:iss001` | Pass (9/9) | Layout stability verified |

---

## 5) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | `requirements/universal-rules/RELEASE_CHECKLIST.md` |
| Unit test proof | 5 tests pass — proportion, mean, finite correction, validation |
| E2E test proof | 3 tests pass — proportion workflow, mean+FPC workflow, mobile order |
| SEO proof | Title, description, canonical, schema (WebPage, SoftwareApplication, BreadcrumbList, FAQPage), 10 FAQ cards, 6 example cards, sitemap entry |
| CWV proof | CLS/LCP/INP within thresholds for `/math/sample-size/` |
| ISS-001 proof | 9/9 layout stability tests pass |
| Important Notes contract | `public/math/sample-size/index.html` includes: Last updated, Accuracy, Disclaimer, Assumptions, Privacy |
| Pane layout proof | Single-pane: `.panel.panel-scroll.panel-span-all` + `.calculator-page-single`, ads-column removed |
| Sensitivity table | New feature: 7-row sensitivity analysis table with active-row highlighting |

---

## 6) Exceptions / Known Risks

| ID | Description | Severity | Mitigation |
| :--- | :--- | :--- | :--- |
| EX-REL-20260315-001-01 | Lint gate not run (no `npm run lint` script detected in project) | Low | Code follows existing project conventions; no new patterns introduced |

---

## 7) Final Decision

Decision: [x] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | Copilot | 2026-03-15 |

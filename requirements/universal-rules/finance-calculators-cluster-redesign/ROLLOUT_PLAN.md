# Finance Calculators Cluster Rollout Plan

Status:

- Started on `2026-03-20`

## Objective

Convert the full Finance calculator family into a light, premium, Apple-calibre product experience while preserving logic, MPA behavior, SEO structure, accessibility, and release compliance.

---

## Execution Sequence

### Phase 0: Documentation lock

- create redesign workspace
- create action page
- create decision log
- create design system
- create rollout plan
- create execution log
- create calculator briefs
- lock the approved scope contract in the ledger

### Phase 1: Shared migration architecture

- move finance source ownership into `public/calculators/finance-calculators/**`
- add Finance shared cluster CSS and interaction ownership
- add Finance cluster shell path in the generator
- add Finance route ownership entries
- fix stale `/finance/` contract links to `/finance-calculators/`
- correct homepage finance discoverability and broken savings-goal link
- keep legacy finance sources intact until cluster cutover is complete

### Phase 2: Route-by-route conversion

Route order:

1. `present-value`
2. `future-value`
3. `present-value-of-annuity`
4. `future-value-of-annuity`
5. `effective-annual-rate`
6. `simple-interest`
7. `compound-interest`
8. `investment-growth`
9. `time-to-savings-goal`
10. `monthly-savings-needed`
11. `investment-return`

For each route:

- audit source and tests
- capture baseline desktop and mobile evidence
- finalize the route brief
- redesign shell and route CSS
- remove Home Loan wrapper leakage
- add precise entry and button-only recalculation where needed
- rebuild and regenerate only the target route
- run scoped unit, E2E, SEO, CWV, schema, and contract gates
- capture final desktop and mobile evidence
- update logs
- mark complete

### Phase 3: Cluster finish

- remove obsolete finance legacy sources after all routes pass
- run Finance cluster verification
- run final redesign release gates
- create release sign-off
- ready-to-merge report

---

## Acceptance Criteria Per Route

- route is on the Finance cluster shell
- no top nav, left nav, or ads pane
- no premium-dark CSS on the page
- no page-level horizontal overflow at desktop or mobile
- calculator remains single-pane and MPA-safe
- post-load edits do not recalculate until Calculate click
- key slider-heavy controls support precise entry where needed
- tables meet the required viewport, toggle, and sticky-header contract
- graphs, where present, meet readability and data-integrity contract
- breadcrumb/schema no longer point Finance routes at Home Loan
- FAQ and Important Notes remain schema-aligned and design-consistent
- touched explanation sections satisfy the current answer-first guide contract
- scoped release gates pass

---

## Evidence Model

Per route, collect:

- baseline desktop screenshot
- baseline mobile screenshot
- final desktop screenshot
- final mobile screenshot
- scoped CWV artifact
- thin-content artifact
- schema dedupe reports
- route log entry with files touched and test results

Cluster finish evidence:

- `route-ownership.json` includes all 11 Finance routes
- stale `/finance/` contract links are removed from governed config sources
- final release sign-off cites pane-layout proof from navigation and built output

---

## Final Completion Standard

The rollout is complete only when:

- all 11 routes share the new Finance shell and light design language
- no target route depends on the old shell
- no target route visually carries dark, neon, or dashboard styling
- no target route keeps Home Loan breadcrumb or wrapper leakage
- placeholder test coverage for `time-to-savings-goal` and `monthly-savings-needed` is replaced
- logs are current and complete
- legacy finance sources are deleted after cutover
- final release verification passes or any out-of-scope blocker is recorded in sign-off
- release sign-off is created

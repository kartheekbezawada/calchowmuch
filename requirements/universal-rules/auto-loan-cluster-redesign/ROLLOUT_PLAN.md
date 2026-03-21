# Auto Loan Cluster Rollout Plan

Status:

- Started on `2026-03-19`

## Objective

Convert the full Auto Loan calculator family into a light, premium, Apple-caliber product experience while preserving logic, MPA behavior, SEO structure, accessibility, and release compliance.

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

- add Auto Loan opt-in migration list
- add Auto Loan cluster shell path in generator
- add Auto Loan shared cluster CSS and interaction ownership
- split Auto Loan release tests into a dedicated `auto-loans` surface
- add Auto Loan route ownership entries
- keep unfinished routes on the old shell until their turn

### Phase 2: Route-by-route conversion

Route order:

1. `car-loan`
2. `multiple-car-loan`
3. `hire-purchase`
4. `pcp-calculator`
5. `leasing-calculator`

For each route:

- audit source and tests
- capture baseline desktop and mobile evidence
- finalize the route brief
- redesign shell and route CSS
- remove Home Loan naming leakage
- add precise entry and button-only recalculation contract
- rebuild and regenerate only the target route
- run scoped unit, E2E, SEO, CWV, schema, and contract gates
- capture final desktop and mobile evidence
- update logs
- mark complete

### Phase 3: Cluster finish

- remove obsolete Auto Loan release leftovers under the old `loans` surface
- run Auto Loan cluster verification
- run final redesign release gates
- create release sign-off
- ready-to-merge report

---

## Acceptance Criteria Per Route

- route is on the Auto Loan cluster shell
- no top nav, left nav, or ads pane
- no premium-dark CSS on the page
- no page-level horizontal overflow at desktop or mobile
- calculator remains single-pane and MPA-safe
- key money and rate controls support precise entry
- post-load edits do not recalculate until Calculate click
- tables meet the required viewport, toggle, and sticky-header contract
- graphs, where present, meet readability and data-integrity contract
- FAQ and important notes remain schema-aligned and design-consistent
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
- SEO mojibake reports
- route log entry with files touched and test results

Cluster finish evidence:

- dedicated `auto-loans` cluster test surface exists and passes
- `route-ownership.json` includes all 5 Auto Loan routes
- final release sign-off cites pane-layout proof from navigation and built output

---

## Final Completion Standard

The rollout is complete only when:

- all 5 routes share the new Auto Loan shell and light design language
- no target route depends on the old shell
- no target route visually carries dark or neon styling
- no target route keeps Home Loan naming leakage in source or built output
- dedicated `auto-loans` route and cluster tests are the active release surface
- Auto Loan route ownership coverage is complete
- logs are current and complete
- final release verification passes
- release sign-off is created

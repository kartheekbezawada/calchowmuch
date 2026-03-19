# Home Loan Cluster Rollout Plan

Status:

- Started on `2026-03-19`

## Objective

Convert the full Home Loan calculator family into a light, premium, Apple-like product experience while preserving logic, MPA behavior, SEO structure, accessibility, and release compliance.

---

## Execution Sequence

### Phase 0: Logging lock

- create redesign workspace
- create action page
- create decision log
- create design system
- create rollout plan
- create execution log
- replace stale draft plan with a pointer

### Phase 1: Shared migration architecture

- add Home Loan opt-in migration list
- add Home Loan cluster shell path in generator
- add Home Loan shared cluster CSS ownership
- keep unfinished routes on the old shell until their turn

### Phase 2: Route-by-route conversion

Route order:

1. `how-much-can-i-borrow`
2. `home-loan`
3. `remortgage-switching`
4. `offset-calculator`
5. `interest-rate-change-calculator`
6. `loan-to-value`
7. `buy-to-let`
8. `personal-loan`

For each route:

- audit source and tests
- capture baseline desktop/mobile evidence
- redesign shell and route CSS
- rebuild/regenerate
- run scoped unit/e2e/seo/cwv/schema/contract gates
- capture final desktop/mobile evidence
- update logs
- mark complete

### Phase 3: Cluster finish

- final cluster verification
- release sign-off
- ready-to-merge report

---

## Acceptance Criteria Per Route

- route is on the Home Loan cluster shell
- no top nav, left nav, or ads pane
- no premium-dark CSS on the page
- no page-level horizontal overflow at desktop or mobile
- calculator remains single-pane and MPA-safe
- tables meet the required viewport/toggle/sticky-header contract
- graphs meet readability and data-integrity contract
- FAQ and notes remain schema-aligned and design-consistent
- scoped release gates pass

---

## Final Completion Standard

The rollout is complete only when:

- all 8 routes share the new Home Loan shell and light design language
- no target route depends on the old shell
- no target route visually carries dark/neon styling
- logs are current and complete
- final release verification passes
- release sign-off is created

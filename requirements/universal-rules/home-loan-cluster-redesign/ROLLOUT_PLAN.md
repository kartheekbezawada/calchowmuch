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

---

## 2026-03-19 Enhancement Pass

Status:

- approved for execution after the initial redesign release
- scope remains the same 8 Home Loan routes

## Enhancement Objective

Refine the shipped Home Loan cluster so the experience feels lighter, faster, and more precise for real customers, especially on mobile.

Primary enhancement outcomes:

- bring the main calculate action back into the first-screen flow on mobile where possible
- reveal and focus the result summary more intentionally after calculate
- improve precise value entry for slider-heavy routes
- reduce table-first heaviness on the densest routes
- normalize explanation rhythm, related-next-step patterns, and answer-first hierarchy

## Enhancement Execution Sequence

Route order:

1. `how-much-can-i-borrow`
2. `home-loan`
3. `remortgage-switching`
4. `offset-calculator`
5. `interest-rate-change-calculator`
6. `loan-to-value`
7. `buy-to-let`
8. `personal-loan`

For each route in this pass:

- log baseline enhancement issues and target outcome
- implement mobile result-reveal polish
- implement precision-input improvements if the route is slider-heavy
- tighten first-screen density and progressive disclosure
- improve result summary hierarchy and related-next-step clarity
- regenerate the route
- run scoped release gates
- update the execution log and action page

## Enhancement Acceptance Criteria

- calculate CTA remains easy to reach on mobile
- result reveal feels deliberate after calculate
- touched routes do not rely on slider-only precision for key money/rate values
- no new page-level overflow is introduced
- tables and graphs still satisfy the universal contract
- FAQ, notes, and related sections remain SEO/schema safe
- route-by-route gates pass before the next calculator begins

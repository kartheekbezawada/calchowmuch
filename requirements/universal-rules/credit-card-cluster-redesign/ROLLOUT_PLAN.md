# Credit Card Cluster Rollout Plan

Status:

- Completed on `2026-03-18`
- Route-by-route redesign and cluster release verification finished
- Table refinement pass completed on `2026-03-18`

## Rollout Objective

Finish the entire credit-card calculator cluster in one continuous redesign rollout while working one calculator at a time.

This plan assumes:

- no permission pauses between calculators in this cluster
- content stays intact
- layout/design is the focus
- the current shell navigation pattern is intentionally removed for this cluster

---

## Execution Sequence

### Phase 0: Documentation lock

- create redesign folder
- create action page
- create design system
- create rollout plan
- create decision log

### Phase 1: Shared architecture

- identify the generator and shell paths that currently inject top/left navigation
- define the new credit-card shell contract
- identify which infra tests must be updated to the new shell behavior
- decide the shared CSS structure for the cluster

### Phase 2: Reference calculator

Target:

- `credit-card-payment-calculator`

Files likely involved:

- source fragment `index.html`
- source fragment `explanation.html`
- source route `calculator.css`
- route `module.js` only if structure/hook changes require safe adaptation
- generator if shell markup changes
- calc-specific E2E/SEO/CWV tests
- generated output route

Goal:

- lock the new design system into a real route
- validate that shell removal and homepage-style light layout work in production output

### Phase 3: Minimum payment calculator

Target:

- `credit-card-minimum-payment-calculator`

Priority:

- preserve slider logic
- preserve default computed state
- improve readability of yearly table and provider note

### Phase 4: Balance transfer calculator

Target:

- `balance-transfer-credit-card-calculator`

Priority:

- preserve scenario sliders
- improve promo / fee / post-promo cost clarity
- rebuild comparison presentation

### Phase 5: Consolidation calculator

Target:

- `credit-card-consolidation-calculator`

Priority:

- preserve advanced options
- preserve toggleable yearly/monthly tables
- preserve sticky header behavior
- improve recommendation clarity

### Phase 6: Cluster regression

- run cluster unit/e2e/seo/cwv
- run redesign-required release gates
- generate signoff

---

## File Strategy

### Source-first rule

Edit source fragments first:

- `public/calculators/credit-card-calculators/**`
- `scripts/generate-mpa-pages.js`

Then regenerate:

- `public/credit-card-calculators/**`
- `public/assets/css/route-bundles/**`

### Shared shell rule

If top-nav / left-nav removal is implemented at the generator level, update:

- generator markup
- affected test contracts
- generated credit-card routes

Do not leave the old shell concept in place and only hide it cosmetically.

---

## Test Strategy

### Calculator-level gates after each route

- calculator unit
- calculator E2E
- calculator SEO
- calculator CWV

### Cluster-level gates after all four routes

- cluster unit
- cluster E2E
- cluster SEO
- cluster CWV

### Final redesign gates

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run test:cwv:all`
- `npm run test:iss001`
- `npm run test:schema:dedupe`

---

## Known Contract Changes

The redesign is expected to intentionally invalidate some old test assumptions.

Expected changes:

- old top-nav assumptions removed for credit-card routes
- old left-nav assumptions removed for credit-card routes
- old shell-centric structure assertions may need updating

Unchanged contracts:

- H1
- title/meta/canonical
- schema presence
- FAQ parity
- route URLs
- calculator logic

---

## Completion Standard

The rollout is complete only when:

- all 4 calculators share the new homepage-derived light system
- no credit-card route uses the old dark shell experience
- no credit-card route depends on the old top/left nav pattern
- all repayment / scenario / guide tables share the lighter cluster table language
- calc-level and cluster-level tests pass
- redesign-required release gates pass
- signoff is created

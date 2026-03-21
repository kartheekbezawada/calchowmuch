# Credit Card Cluster Decision Log

## D-001

Decision:

- The credit-card cluster will use the homepage light design language as its visual parent system.

Reason:

- The homepage direction is already approved and aligns with the desired premium, calm, trustworthy look.

Impact:

- Shared color, spacing, surface, and typography direction can be reused.

---

## D-002

Decision:

- The existing top-nav and left-nav shell pattern will be removed from credit-card calculator routes.

Reason:

- The user explicitly rejected the current shell navigation pattern.
- It fights the desired focused landing-page experience.

Impact:

- Generator and test contract changes are expected.

---

## D-003

Decision:

- This rollout is design/layout only, not a content rewrite.

Reason:

- User instruction.

Impact:

- content meaning must remain stable
- FAQ content/schema parity must remain stable
- explanation copy changes are not part of this rollout unless structural wrapping is required

---

## D-004

Decision:

- Work one calculator at a time, but complete the whole cluster in one delivery stream.

Reason:

- User instruction
- reduces drift

Impact:

- documentation must be updated after each calculator
- partially completed calculators in the worktree are acceptable while progressing through the cluster

---

## D-005

Decision:

- The payment calculator is the reference implementation.

Reason:

- good baseline route
- strong test coverage
- CWV sensitivity makes it a useful benchmark

Impact:

- design system should prove itself there first

---

## D-006

Decision:

- Source fragments and generator are the primary implementation layer.

Reason:

- generated route HTML is derived output

Impact:

- do not hand-maintain only built route files
- regenerate output after source changes

---

## D-007

Decision:

- A dedicated universal-rules redesign folder is the anti-drift workspace for this build.

Reason:

- user requested a deep action page and checklist system

Impact:

- action page becomes the working checklist
- this folder must be kept updated throughout the rollout

---

## D-008

Decision:

- Credit-card routes will inline their cluster CSS in generated HTML instead of loading multiple external stylesheets.

Reason:

- The redesigned shell introduced four blocking CSS requests per route.
- Scoped CWV budgets for this cluster require at most one blocking CSS request.
- Inlining the route CSS at generation time removes the shared bottleneck across all four routes without adding a second asset pipeline.

Impact:

- `scripts/generate-mpa-pages.js` owns CSS assembly for the cluster shell
- generated credit-card routes should show `blockingCssRequests = 0` in scoped CWV reports

---

## D-009

Decision:

- Prefer placeholder-first rendering over async auto-population on load when a calculator route would otherwise introduce measurable layout shift.

Reason:

- The payment calculator generated post-load content expansion in the explanation and summary regions.
- The redesign should feel stable and calm, matching the homepage direction.

Impact:

- calculator modules may initialize inputs and placeholders on load, then render computed outputs only after an explicit user action
- affected E2E contracts must be updated to reflect the new stable-first behavior

---

## D-010

Decision:

- The payment calculator is now the locked reference implementation for shell, visual tone, and CWV approach.

Reason:

- It passes scoped E2E, SEO, and CWV after the light-shell migration.

Impact:

- minimum payment, balance transfer, and consolidation should inherit the same shell/CWV strategy

---

## D-011

Decision:

- The credit-card cluster will use one shared table system owned by the cluster stylesheet instead of route-by-route table redesigns.

Reason:

- The four calculators all expose tables with different data shapes, but the visual problem is shared: the tables feel too flat and too dense.
- A single table layer keeps the cluster cohesive and reduces drift.

Impact:

- `cluster-light.css` owns the table container, sticky header, row wash, hover, placeholder, and numeric-alignment rules
- generated credit-card routes inherit the same table treatment after regeneration
- only route-specific table overrides should remain where content wrapping genuinely differs

---

## D-012

Decision:

- The payment calculator yearly payoff snapshot uses an Excel-style route-specific table variant instead of the softer shared cluster table style.

Reason:

- The shared cluster table system was still too soft for this table and did not match the intended spreadsheet-like readability.
- The payment route also needed a stronger alignment override because shared numeric-column rules were still winning the cascade.

Impact:

- the payment table uses a flat grid, light header fill, alternating rows, centered content, and no forced horizontal scrollbar
- route-scoped overrides are allowed when the shared cluster system is directionally correct but not final for a specific table

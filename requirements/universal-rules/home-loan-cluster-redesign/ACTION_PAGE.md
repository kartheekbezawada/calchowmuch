# Home Loan Cluster Redesign Action Page

## Mission

Redesign the full Home Loan calculator family into a premium light product experience derived from the approved homepage direction and the shipped credit-card redesign.

Target routes:

- `/loan-calculators/how-much-can-i-borrow/`
- `/loan-calculators/mortgage-calculator/`
- `/loan-calculators/remortgage-calculator/`
- `/loan-calculators/offset-mortgage-calculator/`
- `/loan-calculators/interest-rate-change-calculator/`
- `/loan-calculators/ltv-calculator/`
- `/loan-calculators/buy-to-let-mortgage-calculator/`
- `/loan-calculators/personal-loan-calculator/`

Primary outcome:

- remove dark theme carryover
- remove top nav, left nav, and ad pane from these routes
- ship one calm, premium, Apple-like light design family
- preserve calculator logic, route URLs, metadata, schema, FAQ parity, and MPA behavior

---

## Locked Decisions

- [x] The homepage light design language is the visual parent system.
- [x] Credit-card redesign learnings are the implementation reference for shell, spacing, and component quality.
- [x] Home Loan routes will use a dedicated cluster shell.
- [x] Home Loan routes will not render `top-nav`, `left-nav`, or the ads column.
- [x] Home Loan routes will not load `theme-premium-dark.css`.
- [x] Home Loan routes will not rely on `shared-calculator-ui.css` for the redesign.
- [x] Work progresses one calculator at a time in the order defined below.
- [x] The next calculator starts only after the current calculator passes scoped build, tests, and design QA.
- [x] No per-calculator permission pauses are required during this rollout.
- [x] Unrelated worktree files are ignored unless they block the redesign.
- [x] Any accidental unrelated edits must be reverted immediately.
- [x] Logs are append-only and act as the anti-drift control center for the full rollout.

---

## Non-Negotiable Constraints

- Design-first, but never at the cost of broken logic, broken SEO, broken accessibility, or broken release policy.
- Preserve all calculator IDs, JS hooks, table IDs, chart IDs, and CTA behavior unless a tracked contract change is required.
- Preserve H1, title, canonical, metadata, and schema.
- Preserve FAQ content and visible/schema parity.
- Preserve single-pane `calc_exp` behavior.
- Keep route-specific `calculator.css` files route-specific; shared cluster design belongs in the Home Loan cluster stylesheet.
- Keep explanation content meaning intact; this is a design/system migration, not a content rewrite.

---

## Route Order

1. [x] `how-much-can-i-borrow`
2. [x] `home-loan` / mortgage
3. [x] `remortgage-switching`
4. [x] `offset-calculator`
5. [x] `interest-rate-change-calculator`
6. [x] `loan-to-value`
7. [x] `buy-to-let`
8. [x] `personal-loan`

---

## Per-Route Checklist

Use this exact checklist for each route before moving on.

- [ ] Audit current source fragment, explanation, generated output, and tests.
- [ ] Capture baseline desktop screenshot.
- [ ] Capture baseline mobile screenshot.
- [ ] Confirm no unrelated files are required.
- [ ] Apply the Home Loan cluster shell for this route.
- [ ] Remove dark, neon, dashboard, or shell-era styling.
- [ ] Apply shared Home Loan light system styling.
- [ ] Verify no `top-nav`, `left-nav`, or ad pane.
- [ ] Verify header and footer match the cluster design system.
- [ ] Verify calculator remains single-flow and MPA-safe.
- [ ] Verify result hierarchy is answer-first and readable above the fold.
- [ ] Verify table title and toggle contract on desktop and mobile.
- [ ] Verify table viewport, sticky header, and no page-level overflow.
- [ ] Verify graph readability, sizing, legend clarity, and data-integrity contract.
- [ ] Verify FAQ and Important Notes presentation remains consistent.
- [ ] Regenerate or rebuild the route.
- [ ] Run scoped unit gate.
- [ ] Run scoped E2E gate.
- [ ] Run scoped SEO gate.
- [ ] Run scoped CWV gate.
- [ ] Run scoped schema dedupe gate.
- [ ] Run required scoped contract/isolation checks.
- [ ] Capture final desktop screenshot.
- [ ] Capture final mobile screenshot.
- [ ] Record evidence and deltas in `EXECUTION_LOG.md`.
- [ ] Mark route complete here.

---

## Gate Status

| Route | Status | Build | Unit | E2E | SEO | CWV | Schema | Design QA |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `how-much-can-i-borrow` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `home-loan` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `remortgage-switching` | Complete | Pass | Skipped | Pass | Pass | Pass | Pass | Pass |
| `offset-calculator` | Complete | Pass | Skipped | Pass | Pass | Pass | Pass | Pass |
| `interest-rate-change-calculator` | Complete | Pass | Skipped | Pass | Pass | Pass | Pass | Pass |
| `loan-to-value` | Complete | Pass | Skipped | Pass | Pass | Pass | Pass | Pass |
| `buy-to-let` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `personal-loan` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |

---

## Completed Route Notes

### `how-much-can-i-borrow`

- Migrated to the new Home Loan cluster shell and shared light design system.
- Final evidence captured:
  - `test-results/visual/home-loan-redesign/how-much-can-i-borrow/baseline/desktop.png`
  - `test-results/visual/home-loan-redesign/how-much-can-i-borrow/baseline/mobile.png`
  - `test-results/visual/home-loan-redesign/how-much-can-i-borrow/final/desktop.png`
  - `test-results/visual/home-loan-redesign/how-much-can-i-borrow/final/mobile.png`
- Shared-contract validation required the repo opt-in flag:
  - `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope`

### `home-loan`

- Migrated the manual mortgage route through the same Home Loan shell by allowing the generator to render the manual fragment set when it is explicitly in the redesign migration list.
- Final evidence captured:
  - `test-results/visual/home-loan-redesign/home-loan/baseline/desktop.png`
  - `test-results/visual/home-loan-redesign/home-loan/baseline/mobile.png`
  - `test-results/visual/home-loan-redesign/home-loan/final/desktop.png`
  - `test-results/visual/home-loan-redesign/home-loan/final/mobile.png`
- Shared-contract validation required the repo opt-in flag:
  - `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope`

### `remortgage-switching`

- Migrated the route to the Home Loan cluster shell and replaced fragment-level inline styling with route-owned CSS plus the shared cluster light system.
- Final evidence captured:
  - `test-results/visual/home-loan-redesign/remortgage-switching/baseline/desktop.png`
  - `test-results/visual/home-loan-redesign/remortgage-switching/baseline/mobile.png`
  - `test-results/visual/home-loan-redesign/remortgage-switching/final/desktop.png`
  - `test-results/visual/home-loan-redesign/remortgage-switching/final/mobile.png`
- The scoped unit suite remains a repo-level skip for this route; all route-level release gates still passed.
- Shared-contract validation required the repo opt-in flag:
  - `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope`

### `offset-calculator`

- Migrated the route to the Home Loan cluster shell and moved its layout/styling out of fragment markup into the route stylesheet.
- Final evidence captured:
  - `test-results/visual/home-loan-redesign/offset-calculator/baseline/desktop.png`
  - `test-results/visual/home-loan-redesign/offset-calculator/baseline/mobile.png`
  - `test-results/visual/home-loan-redesign/offset-calculator/final/desktop.png`
  - `test-results/visual/home-loan-redesign/offset-calculator/final/mobile.png`
- The scoped unit suite remains a repo-level skip for this route; all route-level release gates still passed.
- Shared-contract validation required the repo opt-in flag:
  - `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope`

### `interest-rate-change-calculator`

- Migrated the route to the Home Loan cluster shell and replaced fragment-delivered dark styling with route-owned light CSS for the calculator panel, snapshot grid, lifetime module, guide tables, and notes treatment.
- Final evidence captured:
  - `test-results/visual/home-loan-redesign/interest-rate-change-calculator/baseline/desktop.png`
  - `test-results/visual/home-loan-redesign/interest-rate-change-calculator/baseline/mobile.png`
  - `test-results/visual/home-loan-redesign/interest-rate-change-calculator/final/desktop.png`
  - `test-results/visual/home-loan-redesign/interest-rate-change-calculator/final/mobile.png`
- The scoped unit suite remains a repo-level skip for this route; all route-level release gates still passed.
- Shared-contract validation required the repo opt-in flag:
  - `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope`

### `loan-to-value`

- Migrated the route to the Home Loan cluster shell, split the top related calculators out of the FAQ pattern, and replaced the route’s dark-era presentation with a light LTV-specific layout.
- Final evidence captured:
  - `test-results/visual/home-loan-redesign/loan-to-value/baseline/desktop.png`
  - `test-results/visual/home-loan-redesign/loan-to-value/baseline/mobile.png`
  - `test-results/visual/home-loan-redesign/loan-to-value/final/desktop.png`
  - `test-results/visual/home-loan-redesign/loan-to-value/final/mobile.png`
- The scoped unit suite remains a repo-level skip for this route; all route-level release gates still passed.
- Shared-contract validation required the repo opt-in flag:
  - `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope`

### `buy-to-let`

- Migrated the route to the Home Loan cluster shell and replaced fragment-delivered dark styling with a calm light layout for the form, preview card, result stack, FAQ, and projection table.
- Final evidence captured:
  - `test-results/visual/home-loan-redesign/buy-to-let/baseline/desktop.png`
  - `test-results/visual/home-loan-redesign/buy-to-let/baseline/mobile.png`
  - `test-results/visual/home-loan-redesign/buy-to-let/final/desktop.png`
  - `test-results/visual/home-loan-redesign/buy-to-let/final/mobile.png`
- Thin-content scoring returned `warn`, not `fail`, for this route. Include that in the final sign-off.
- Shared-contract validation required the repo opt-in flag:
  - `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope`

### `personal-loan`

- Migrated the route to the Home Loan cluster shell and replaced its dark-era inline/route styling with a light product layout for the form, answer-first payment snapshot, chart, amortization table, FAQ, and notes treatment.
- Final evidence captured:
  - `test-results/visual/home-loan-redesign/personal-loan/baseline/desktop.png`
  - `test-results/visual/home-loan-redesign/personal-loan/baseline/mobile.png`
  - `test-results/visual/home-loan-redesign/personal-loan/final/desktop.png`
  - `test-results/visual/home-loan-redesign/personal-loan/final/mobile.png`
- Thin-content scoring returned `warn`, not `fail`, for this route. Include that in the final sign-off.
- Shared-contract validation required the repo opt-in flag:
  - `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope`

---

## Final Cluster Checklist

- [x] All 8 routes completed in order.
- [x] All redesign logs updated with final route status.
- [x] Shared Home Loan shell is active for every target route.
- [x] Mortgage manual route matches the generated routes visually and structurally.
- [x] Final cluster verification completed.
- [x] Release sign-off created.
- [x] Cluster is ready to merge.

# Home Loan Cluster Decision Log

## D-001

Decision:

- The Home Loan cluster will use the homepage light design language as its visual parent system.

Reason:

- This direction is already approved and aligns with the requested Apple-like, premium, calm product feel.

Impact:

- Shared spacing, hierarchy, surface treatment, and shell language can be reused instead of inventing a new family.

---

## D-002

Decision:

- Home Loan routes will use a dedicated cluster shell instead of the default calculator shell.

Reason:

- The redesign explicitly removes the old shell-heavy experience for these routes.

Impact:

- `top-nav`, `left-nav`, and the ads column will not render for migrated Home Loan routes.
- Route tests must move from old shell selectors to Home Loan cluster selectors.

---

## D-003

Decision:

- Home Loan routes will not load `theme-premium-dark.css` or `shared-calculator-ui.css`.

Reason:

- Both assets carry dark-era styling and shared cross-cluster assumptions that conflict with the redesign.

Impact:

- Home Loan CSS delivery is owned by the generator and the Home Loan cluster stylesheet.

---

## D-004

Decision:

- The rollout will proceed one calculator at a time using an opt-in migration list.

Reason:

- Shared shell work is required, but the rollout must not flip unfinished routes into a partially migrated state.

Impact:

- The generator will only apply the new Home Loan shell to routes marked complete in the migration list.

---

## D-005

Decision:

- `how-much-can-i-borrow` is the reference route for the Home Loan redesign.

Reason:

- It is a generated route, already acts as the cluster typography/content baseline, and is the cleanest place to prove the shell and design system first.

Impact:

- The shared Home Loan shell and cluster stylesheet should be validated there before mortgage and the remaining routes are converted.

---

## D-006

Decision:

- Existing explanation-embedded related-calculator blocks will be preserved and restyled rather than duplicated by a new generator-injected related section.

Reason:

- These routes already contain internal-link blocks inside explanation content.

Impact:

- Related-calculator cohesion is solved in shared CSS, not by adding duplicate content.

---

## D-007

Decision:

- Table and graph contracts from the universal requirements are part of the redesign definition, not post-hoc QA only.

Reason:

- The design brief prioritizes calm, premium pages, but the repo also has explicit graph/table contracts that directly affect visual quality.

Impact:

- Table viewport, sticky header, no page overflow, graph label readability, and start-point integrity are first-class design requirements for every converted route.

---

## D-008

Decision:

- Mortgage remains a manual-route exception during this rollout.

Reason:

- The asset manifest still marks `/loan-calculators/mortgage-calculator/` as `generationMode: "manual"`.

Impact:

- Mortgage will be updated to the same shell and visual contract without changing the manifest during this rollout.

---

## D-009

Decision:

- Home Loan release suites should wait for the migrated calculator root, not `networkidle`, when validating redesigned routes.

Reason:

- The redesigned pages still include third-party tags in the document head, and `networkidle` introduces avoidable false stalls that are unrelated to calculator readiness.

Impact:

- Route-level E2E suites can remain strict about layout, content, and flow while becoming more deterministic for the rollout.

---

## D-010

Decision:

- Shared generator changes in this rollout require the repo’s explicit shared-contract isolation opt-in during verification.

Reason:

- The Home Loan migration is intentionally introducing a new cluster shell path in `scripts/generate-mpa-pages.js`, which the isolation guard correctly treats as a shared-contract change.

Impact:

- Run `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` during rollout verification until the migration is complete.

---

## D-011

Decision:

- Home Loan structured-data FAQ extraction must prefer the explicit FAQ section when one exists.

Reason:

- The mortgage explanation uses the same FAQ card component for both related-calculator cards and actual FAQ cards, and whole-document parsing over-counts the FAQ set.

Impact:

- Home Loan schema generation now reflects only the FAQ section and remains aligned with visible FAQ content.

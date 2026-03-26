# Salary Calculators Cluster Action Page

## Mission

Launch the new `salary-calculators` cluster as an evergreen pay-conversion and earnings-math product area that captures high-intent salary queries without introducing tax-band, payroll-rule, or jurisdiction-maintenance debt.

Target routes:

- `/salary-calculators/`
- `/salary-calculators/salary-calculator/`
- `/salary-calculators/hourly-to-salary-calculator/`
- `/salary-calculators/salary-to-hourly-calculator/`
- `/salary-calculators/annual-to-monthly-salary-calculator/`
- `/salary-calculators/monthly-to-annual-salary-calculator/`
- `/salary-calculators/weekly-pay-calculator/`
- `/salary-calculators/overtime-pay-calculator/`
- `/salary-calculators/raise-calculator/`
- `/salary-calculators/bonus-calculator/`
- `/salary-calculators/commission-calculator/`

Primary outcomes:

- ship a dedicated salary cluster hub plus 10 salary calculator routes
- preserve MPA navigation, route URLs, and single-pane `calc_exp` behavior on calculator pages
- keep formulas evergreen, user-input driven, and free of threshold-maintenance dependencies
- onboard the cluster into route ownership, cluster contracts, homepage discoverability, and sitemap governance
- release the cluster through scoped gates and sign-off evidence, not ad hoc route launches

---

## Scope Contract

Target calculators:

- `salary-calculator`
- `hourly-to-salary-calculator`
- `salary-to-hourly-calculator`
- `annual-to-monthly-salary-calculator`
- `monthly-to-annual-salary-calculator`
- `weekly-pay-calculator`
- `overtime-pay-calculator`
- `raise-calculator`
- `bonus-calculator`
- `commission-calculator`

Allowed files:

- `requirements/universal-rules/salary-calculators-cluster-redesign/**`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-*-SALARY-*.md`
- `public/calculators/salary-calculators/**`
- `public/salary-calculators/**`
- `content/calculators/salary-calculators/**`
- `public/assets/css/calculators/salary-calculators/**`
- `public/assets/js/calculators/salary-calculators/**`
- `scripts/generate-mpa-pages.js`
- `scripts/generate-sitemap.js`
- `config/testing/test-scope-map.json`
- `config/clusters/route-ownership.json`
- `config/clusters/cluster-registry.json`
- `clusters/salary/config/navigation.json`
- `clusters/salary/config/asset-manifest.json`
- `clusters/homepage/config/navigation.json`
- `public/config/navigation.json`
- `public/index.html`
- `public/sitemap.xml`
- `tests_specs/salary/**`

Forbidden files and prefixes:

- `public/calculators/finance-calculators/**`
- `public/calculators/loan-calculators/**`
- `public/calculators/car-loan-calculators/**`
- `public/calculators/credit-card-calculators/**`
- `public/calculators/percentage-calculators/**`
- `public/calculators/time-and-date/**`
- `clusters/**` outside the salary cluster files and homepage navigation file listed above
- `public/assets/core/**`
- unrelated shared shell/runtime files unless later approved explicitly

Allowed commands:

- `rg`, `find`, `sed`, `git status`
- scoped generation commands using `TARGET_ROUTE` or `TARGET_CALC_ID`
- scoped tests using `CLUSTER=salary`
- required release-gate commands defined in `RELEASE_PLAN.md`

Forbidden commands:

- destructive git commands
- unrelated full-site generation
- unrelated full-site test runs
- edits outside the allowed file list without explicit scope expansion

Stop rule:

- if a fix requires files or commands outside the allowed set, stop and request explicit scope expansion

Out-of-scope violation rule:

- stop immediately
- revert only the agent's own out-of-scope edits
- record root cause and corrective action in `EXECUTION_LOG.md`

---

## Locked Decisions

- [x] The cluster is salary-conversion and earnings-math focused, not a tax or payroll-rules cluster.
- [x] The hub route ships before or alongside the first calculator release and remains the cluster discovery anchor.
- [x] Calculator routes use `routeArchetype: calc_exp` and `paneLayout: single` unless a later approved requirement states otherwise.
- [x] Work proceeds in the route order defined below.
- [x] The next route starts only after the current route clears its scoped build, tests, and evidence requirements.
- [x] Overtime logic remains user-input driven through an editable multiplier.
- [x] Raise, bonus, and commission logic remain formula-driven and must not imply payroll compliance.
- [x] No per-route silent scope expansion is allowed.
- [x] Logs are append-only and act as the anti-drift source of truth for the rollout.

---

## Non-Negotiable Constraints

- Preserve MPA navigation and route URLs.
- Preserve single-pane `calc_exp` behavior for every touched calculator route.
- Preserve title, canonical, metadata, schema parity, and FAQ meaning.
- Keep all maintenance-sensitive values user-entered rather than hardcoded.
- Do not introduce tax withholding, net-pay, labor-law, or payroll-compliance claims.
- Keep route-specific styling and logic route-owned or cluster-owned; do not borrow runtime assets from other clusters.
- Keep the hub and child pages internally linked according to the approved mesh.
- The cluster must feel simple, clear, task-first, and mobile-safe.

---

## Source Of Truth Map

### Planning and execution docs

- `requirements/universal-rules/salary-calculators-cluster-redesign/DESIGN_SYSTEM.md`
- `requirements/universal-rules/salary-calculators-cluster-redesign/ROLLOUT_PLAN.md`
- `requirements/universal-rules/salary-calculators-cluster-redesign/ACTION_PAGE.md`
- `requirements/universal-rules/salary-calculators-cluster-redesign/RELEASE_PLAN.md`
- `requirements/universal-rules/salary-calculators-cluster-redesign/calculators/*.md`

### Route source targets

- `public/calculators/salary-calculators/*/index.html`
- `public/calculators/salary-calculators/*/explanation.html`
- `public/calculators/salary-calculators/*/calculator.css`
- `public/calculators/salary-calculators/*/module.js`

### Shared cluster layer

- `public/calculators/salary-calculators/shared/**`

### Generated outputs

- `public/salary-calculators/*/index.html`

### Cluster contracts

- `config/clusters/route-ownership.json`
- `config/clusters/cluster-registry.json`
- `clusters/salary/config/navigation.json`
- `clusters/salary/config/asset-manifest.json`

### Release evidence and tests

- `tests_specs/salary/**`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-*-SALARY-*.md`

---

## Calculator Work Order

1. [x] cluster bootstrap and hub
2. [x] `salary-calculator`
3. [x] `hourly-to-salary-calculator`
4. [x] `salary-to-hourly-calculator`
5. [x] `annual-to-monthly-salary-calculator`
6. [x] `monthly-to-annual-salary-calculator`
7. [x] `weekly-pay-calculator`
8. [x] `overtime-pay-calculator`
9. [x] `raise-calculator`
10. [x] `bonus-calculator`
11. [x] `commission-calculator`

---

## Per-Route Checklist

- [ ] Confirm the route brief is complete and implementation-ready.
- [ ] Confirm the route inherits the salary cluster design system and the correct route variant.
- [ ] Audit source fragment, generated output target, and required tests.
- [ ] Confirm the route remains inside the approved salary scope.
- [ ] Implement route UI and logic using the child route brief as the execution contract.
- [ ] Verify result hierarchy matches the route brief.
- [ ] Verify explanation outline, FAQ parity, and schema mapping notes are honored.
- [ ] Verify no tax, deduction, or jurisdiction-claim drift has been introduced.
- [ ] Regenerate the route.
- [ ] Run the scoped gate set defined in `RELEASE_PLAN.md`.
- [ ] Capture route evidence and append the result to `EXECUTION_LOG.md`.
- [ ] Mark the route complete here.

---

## Gate Status

| Route | Status | Build | Unit | E2E | SEO | CWV | Schema | Design QA |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `cluster-bootstrap-and-hub` | Completed | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `salary-calculator` | Completed | Pass | Covered by cluster release | Covered by cluster release | Covered by cluster release | Covered by cluster release | Pass | Pass |
| `hourly-to-salary-calculator` | Completed | Pass | Covered by cluster release | Covered by cluster release | Covered by cluster release | Covered by cluster release | Pass | Pass |
| `salary-to-hourly-calculator` | Completed | Pass | Covered by cluster release | Covered by cluster release | Covered by cluster release | Covered by cluster release | Pass | Pass |
| `annual-to-monthly-salary-calculator` | Completed | Pass | Covered by cluster release | Covered by cluster release | Covered by cluster release | Covered by cluster release | Pass | Pass |
| `monthly-to-annual-salary-calculator` | Completed | Pass | Covered by cluster release | Covered by cluster release | Covered by cluster release | Covered by cluster release | Pass | Pass |
| `weekly-pay-calculator` | Completed | Pass | Covered by cluster release | Covered by cluster release | Covered by cluster release | Covered by cluster release | Pass | Pass |
| `overtime-pay-calculator` | Completed | Pass | Covered by cluster release | Covered by cluster release | Covered by cluster release | Covered by cluster release | Pass | Pass |
| `raise-calculator` | Completed | Pass | Covered by cluster release | Covered by cluster release | Covered by cluster release | Covered by cluster release | Pass | Pass |
| `bonus-calculator` | Completed | Pass | Covered by cluster release | Covered by cluster release | Covered by cluster release | Covered by cluster release | Pass | Pass |
| `commission-calculator` | Completed | Pass | Covered by cluster release | Covered by cluster release | Covered by cluster release | Covered by cluster release | Pass | Pass |

---

## Cluster Final Checklist

- [x] Cluster contracts are in place.
- [x] Hub route is live and discoverable.
- [x] All 10 calculator routes are implemented in the approved order.
- [x] Internal linking matches the route briefs and hub plan.
- [x] Homepage search discoverability contract passes.
- [x] Sitemap coverage is complete.
- [x] All required release gates pass.
- [x] Release sign-off is created.
- [x] Cluster is ready to merge.

---

## Latest Delta

- 2026-03-26: Salary cluster rollout completed as a cluster-scope shared-contract release.
- Generated outputs now exist for `/salary-calculators/` plus all 10 child routes under `public/salary-calculators/**`.
- Salary cluster release tests now exist under `tests_specs/salary/**` for future single-calculator releases, while this rollout was verified with the cluster gate set.
- Passed gates:
  - `npm run lint`
  - `CLUSTER=salary npm run test:cluster:unit`
  - `CLUSTER=salary npm run test:cluster:e2e`
  - `CLUSTER=salary npm run test:cluster:seo`
  - `CLUSTER=salary npm run test:cluster:cwv`
  - `CLUSTER=salary npm run test:schema:dedupe -- --scope=cluster`
  - `CLUSTER=salary npm run test:cluster:contracts`
  - `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope`
- Release sign-off: `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-20260326-SALARY-CLUSTER-ROLLOUT.md`

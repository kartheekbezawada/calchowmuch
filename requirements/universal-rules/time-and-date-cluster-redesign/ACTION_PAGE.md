# Time & Date Cluster Redesign Action Page

## Mission

Redesign the full `time-and-date` calculator cluster into a calm, editorial, task-first light experience that prioritizes clarity, rhythm, and immediate utility over shell chrome.

Target routes:

- `/time-and-date/age-calculator/`
- `/time-and-date/birthday-day-of-week/`
- `/time-and-date/days-until-a-date-calculator/`
- `/time-and-date/time-between-two-dates-calculator/`
- `/time-and-date/countdown-timer/`
- `/time-and-date/work-hours-calculator/`
- `/time-and-date/overtime-hours-calculator/`
- `/time-and-date/sleep-time-calculator/`
- `/time-and-date/wake-up-time-calculator/`
- `/time-and-date/nap-time-calculator/`
- `/time-and-date/power-nap-calculator/`
- `/time-and-date/energy-based-nap-selector/`

Primary outcomes:

- remove the legacy dark shell, top nav, left nav, and ads column from migrated Time & Date routes
- move the cluster into a dedicated Time & Date light shell and shared design layer
- preserve MPA behavior, route URLs, route ownership, and single-pane `calc_exp` layout
- preserve calculator logic, metadata, schema, FAQ parity, and explanation-order requirements
- migrate and release one calculator at a time with documentation, tests, and sign-off evidence

## Scope Contract

Target calculators:

- `age-calculator`
- `birthday-day-of-week`
- `days-until-a-date-calculator`
- `time-between-two-dates-calculator`
- `countdown-timer-generator`
- `work-hours-calculator`
- `overtime-hours-calculator`
- `sleep-time-calculator`
- `wake-up-time-calculator`
- `nap-time-calculator`
- `power-nap-calculator`
- `energy-based-nap-selector`

Allowed files:

- `requirements/universal-rules/time-and-date-cluster-redesign/**`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-*-TIME-AND-DATE-*.md`
- `public/calculators/time-and-date/**`
- `public/time-and-date/**`
- `scripts/generate-mpa-pages.js`
- `config/testing/test-scope-map.json`
- `config/clusters/route-ownership.json`
- `public/config/navigation.json`
- `clusters/time-and-date/config/navigation.json`
- `clusters/time-and-date/config/asset-manifest.json`
- `tests_specs/time-and-date/**`
- `tests_specs/sleep-and-nap/**`

Forbidden files and prefixes:

- `public/calculators/finance-calculators/**`
- `public/calculators/loan-calculators/**`
- `public/calculators/car-loan-calculators/**`
- `public/calculators/credit-card-calculators/**`
- `public/calculators/percentage-calculators/**`
- `public/assets/core/**`
- shared global shell assets outside direct Time & Date migration needs

Allowed commands:

- `rg`, `sed`, `find`, `git status`
- scoped generation commands using `TARGET_CALC_ID` or `TARGET_ROUTE`
- scoped tests using `CLUSTER=time-and-date`
- route-specific Playwright runs for mapped Time & Date release dirs
- final release-gate commands required by the policy

Forbidden commands:

- destructive git commands
- unrelated full-site test runs
- edits outside the allowed file list without explicit scope expansion

Stop rule:

- if a fix requires files or commands outside the allowed set, stop and request explicit scope expansion

Out-of-scope violation rule:

- stop immediately
- revert only the agent's own out-of-scope edits
- record root cause and corrective action in `EXECUTION_LOG.md`

## Locked Decisions

- [x] The new Time & Date cluster will use a dedicated light cluster shell.
- [x] Migrated Time & Date routes will not render top nav, left nav, or ads column.
- [x] Work will proceed one calculator at a time in the route order below.
- [x] Age Calculator is the baseline route for the redesign system.
- [x] Sleep, work, planning, and milestone tools may differ in accent and tone, but they must share one system.
- [x] Post-load edits must not recompute until the primary CTA is clicked unless the route has a justified live-state requirement after a deliberate start action.
- [x] Logs are append-only and act as the anti-drift source of truth.

## Non-Negotiable Constraints

- Preserve MPA navigation and route URLs.
- Preserve single-pane `calc_exp` layout on all touched routes.
- Keep answer-first result hierarchy.
- Preserve FAQ/schema parity and explanation ordering requirements.
- Do not reintroduce top nav, left nav, ads column, or dark shell styling on migrated Time & Date routes.
- Route-specific `calculator.css` stays route-specific; shared cluster design belongs in the cluster shared stylesheet.
- The cluster should feel calm, precise, human, easy to scan, and strong on mobile.

## Source Of Truth Map

### Route source

- `public/calculators/time-and-date/*/index.html`
- `public/calculators/time-and-date/*/explanation.html`
- `public/calculators/time-and-date/*/calculator.css`
- `public/calculators/time-and-date/*/module.js`

### Shared cluster layer

- `public/calculators/time-and-date/shared/cluster-light.css`
- `public/calculators/time-and-date/shared/cluster-ux.js`

### Generated outputs

- `public/time-and-date/*/index.html`

### Generator / contracts

- `scripts/generate-mpa-pages.js`
- `clusters/time-and-date/config/navigation.json`
- `config/testing/test-scope-map.json`

## Calculator Work Order

1. [x] `age-calculator`
2. [x] `birthday-day-of-week`
3. [x] `days-until-a-date-calculator`
4. [x] `time-between-two-dates-calculator`
5. [x] `countdown-timer-generator`
6. [x] `work-hours-calculator`
7. [x] `overtime-hours-calculator`
8. [x] `sleep-time-calculator`
9. [x] `wake-up-time-calculator`
10. [x] `nap-time-calculator`
11. [x] `power-nap-calculator`
12. [x] `energy-based-nap-selector`

## Per-Calculator Checklist

- [ ] Audit source fragment, generated output, and tests.
- [ ] Apply the Time & Date cluster shell.
- [ ] Remove legacy shell chrome and dark theme dependence.
- [ ] Align result hierarchy and explanation flow.
- [ ] Verify no `@import` remains in route CSS delivery.
- [ ] Regenerate the route.
- [ ] Run scoped unit gate.
- [ ] Run scoped E2E gate.
- [ ] Run scoped SEO gate.
- [ ] Run scoped CWV gate.
- [ ] Run scoped schema dedupe gate.
- [ ] Record evidence in `EXECUTION_LOG.md`.

## Gate Status

| Route | Status | Build | Unit | E2E | SEO | CWV | Schema | Design QA |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `age-calculator` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `birthday-day-of-week` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `days-until-a-date-calculator` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `time-between-two-dates-calculator` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `countdown-timer-generator` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `work-hours-calculator` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `overtime-hours-calculator` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `sleep-time-calculator` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `wake-up-time-calculator` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `nap-time-calculator` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `power-nap-calculator` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `energy-based-nap-selector` | Complete | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
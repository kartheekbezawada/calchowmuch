# Credit Card Cluster Redesign Action Page

## Mission

Redesign the entire `credit-cards` calculator cluster in one rollout using the approved homepage light-theme design direction.

Cluster routes:

- `/credit-card-calculators/credit-card-payment-calculator/`
- `/credit-card-calculators/credit-card-minimum-payment-calculator/`
- `/credit-card-calculators/balance-transfer-credit-card-calculator/`
- `/credit-card-calculators/credit-card-consolidation-calculator/`

Primary goal:

- remove the current dark, shell-heavy, Home-Loan-derived experience
- replace it with a clean homepage-style light system
- keep calculator logic and content intact
- deliver the whole cluster without drift

---

## Locked Decisions

- [x] Use the homepage design choice as the visual parent system.
- [x] Do not keep the existing dark credit-card/Home-Loan visual carryover.
- [x] Do not keep the existing top calculator shell navigation on these routes.
- [x] Do not keep the existing left calculator shell navigation on these routes.
- [x] Do not rewrite calculator content for this rollout.
- [x] Do not change calculator formulas or business logic unless required to preserve existing behavior.
- [x] Preserve route URLs, SEO metadata, schema, FAQ parity, and sitemap coverage.
- [x] Preserve all required visible content sections already enforced by tests.
- [x] Execute one calculator at a time, but finish the full cluster in one build stream.
- [x] Ignore unrelated worktree files unless they directly block the credit-card rollout.
- [x] If a non-credit-card file is accidentally touched, revert that change before continuing.
- [x] Treat this folder as the anti-drift control center for the redesign.

---

## Non-Negotiable Constraints

- Content freeze:
  - existing calculator meaning stays the same
  - existing explanation meaning stays the same
  - existing FAQ content/schema parity stays intact
- Design-only mandate:
  - change layout
  - change spacing
  - change typography
  - change hierarchy
  - change surfaces
  - change results presentation
  - change table presentation
  - change overall shell structure
- Logic safety:
  - preserve IDs used by modules/tests unless an intentional, tracked contract update is required
- SEO safety:
  - H1, title, meta, canonical, Open Graph, Twitter, FAQ schema, BreadcrumbList, SoftwareApplication, and sitemap presence must remain valid

---

## Source of Truth Map

### Source fragments

- `public/calculators/credit-card-calculators/*/index.html`
- `public/calculators/credit-card-calculators/*/explanation.html`
- `public/calculators/credit-card-calculators/*/calculator.css`
- `public/calculators/credit-card-calculators/*/module.js`

### Generated outputs

- `public/credit-card-calculators/*/index.html`
- `public/assets/css/route-bundles/credit-card-calculators-*.css`

### Generator / shell

- `scripts/generate-mpa-pages.js`

### Release tests

- `tests_specs/credit-cards/cluster_release/*`
- `tests_specs/credit-cards/credit-card-repayment-payoff_release/*`
- `tests_specs/credit-cards/credit-card-minimum-payment_release/*`
- `tests_specs/credit-cards/balance-transfer-installment-plan_release/*`
- `tests_specs/credit-cards/credit-card-consolidation_release/*`

### Likely infra tests affected by shell removal

- tests asserting `.top-nav`
- tests asserting `.left-nav`
- tests asserting `.center-column` / `.panel-span-all` shell structure

---

## Working Rules

### Design translation rule

The calculator pages should feel like children of the homepage, not children of the current calculator shell.

That means:

- same light page atmosphere
- same restrained premium feel
- same spacing rhythm
- same white-card language
- same quiet visual confidence

That does not mean:

- turning calculators into the homepage
- removing calculator-specific functionality
- removing explanation, FAQ, or related-calculator content

### Navigation rule

The old shell navigation pattern is removed for this cluster:

- remove top category nav from these routes
- remove left calculator nav from these routes
- replace navigation discoverability with:
  - cleaner page structure
  - related calculators section
  - breadcrumb/schema continuity
  - homepage-style header/footer language where appropriate

### Drift-prevention rule

No spontaneous redesign branching.

Every calculator must inherit from the same shared design system and follow the same shell principles.

---

## Calculator Work Order

### 1. Reference Page

- [x] `credit-card-payment-calculator`

Reason:

- strongest baseline for a reference implementation
- existing E2E + SEO coverage
- historically sensitive route for CWV/CLS

### 2. Second Pass

- [ ] `credit-card-minimum-payment-calculator`

Reason:

- similar payoff/summary pattern
- uses sliders plus yearly table
- good second validation for the shared system

### 3. Third Pass

- [ ] `balance-transfer-credit-card-calculator`

Reason:

- adds comparison/savings framing
- expands the system for scenario snapshot UI

### 4. Fourth Pass

- [ ] `credit-card-consolidation-calculator`

Reason:

- most structurally complex
- advanced options, dual-table view, recommendation framing

---

## Per-Calculator Checklist

Use this same checklist for each route.

### Universal checklist

- [ ] Audit current source fragment structure
- [ ] Audit current explanation structure
- [ ] Audit current calculator IDs and result hooks
- [ ] Audit current calc-specific E2E and SEO tests
- [ ] Remove dark route-specific carryover styling
- [ ] Apply shared light cluster design system
- [ ] Remove top-nav dependency from the page shell
- [ ] Remove left-nav dependency from the page shell
- [ ] Rebuild calculator-above-the-fold layout
- [ ] Rebuild results summary hierarchy
- [ ] Rebuild table presentation for scan clarity
- [ ] Rebuild FAQ presentation without changing FAQ content
- [ ] Rebuild related-calculator section using consistent cluster styling
- [ ] Preserve all required IDs/hooks for JS unless intentionally migrated
- [ ] Preserve metadata/schema/FAQ parity
- [ ] Regenerate route output
- [ ] Run calculator-level unit/e2e/seo/cwv gates
- [ ] Update action docs with completion status

### Current rollout status

- [x] Shared credit-card light shell is active in `scripts/generate-mpa-pages.js`
- [x] Credit-card routes now inline cluster CSS during generation to eliminate blocking CSS requests
- [x] Payment calculator has been rebuilt as the reference route
- [x] Payment calculator scoped E2E passed
- [x] Payment calculator scoped SEO passed
- [x] Payment calculator scoped CWV passed
- [x] Minimum payment calculator redesign completed
- [x] Balance transfer calculator redesign completed
- [x] Consolidation calculator redesign completed
- [x] Cluster-wide table refinement completed in shared cluster CSS
- [x] Cluster-level release verification completed
- [x] Release sign-off created

### Payment calculator checklist

- [x] Inputs remain balance / APR / monthly payment / extra payment
- [x] Result list still surfaces the 7 tested result lines
- [x] Payoff table remains readable and non-overwhelming
- [x] `#cc-payoff-explanation` still exposes 10 FAQ items
- [x] No horizontal overflow
- [x] Old top-nav dependency removed
- [x] Old left-nav dependency removed
- [x] Related calculator links added in the new shell
- [x] Blocking CSS requests reduced to zero in scoped CWV
- [x] Layout shift eliminated in scoped CWV

### Minimum payment checklist

- [x] Sliders remain intact with current ranges and floor logic
- [x] Provider note remains visible
- [x] Placeholder-first load state is stabilized without async layout shift
- [x] Yearly payoff table remains present and readable
- [x] `#cc-min-explanation` still exposes 10 FAQ items and expected sections
- [x] No horizontal overflow
- [x] Old top-nav dependency removed
- [x] Old left-nav dependency removed
- [x] Related calculator links added in the new shell
- [x] Calculator-level unit scope completed
- [x] Calculator-level SEO scope passed
- [x] Calculator-level E2E scope passed
- [x] Calculator-level CWV scope passed

### Balance transfer checklist

- [x] Range controls remain intact
- [x] Transfer snapshot still reads clearly
- [x] Outcome card remains calculation-first
- [x] Savings framing becomes easier to scan
- [x] FAQ/schema/sitemap contracts remain valid
- [x] Placeholder-first load state is stabilized without async layout shift
- [x] Real route-level E2E contract added in place of skipped placeholder
- [x] Calculator-level unit scope completed
- [x] Calculator-level SEO scope passed
- [x] Calculator-level E2E scope passed
- [x] Calculator-level CWV scope passed

### Consolidation checklist

- [x] Slider controls remain intact
- [x] Advanced options remain accessible
- [x] Monthly/yearly toggle remains usable
- [x] Sticky table header behavior remains intact
- [x] Recommendation/result summary becomes clearer
- [x] `#cc-con-explanation` still exposes 10 FAQ items and required headings
- [x] Placeholder-first load state is stabilized without async layout shift
- [x] Old top-nav dependency removed
- [x] Old left-nav dependency removed
- [x] Related calculator links added in the new shell
- [x] Calculator-level unit scope completed
- [x] Calculator-level SEO scope passed
- [x] Calculator-level E2E scope passed
- [x] Calculator-level CWV scope passed

### Table refinement checklist

- [x] Audit all table-bearing routes in the cluster
- [x] Keep the table redesign in shared cluster CSS instead of per-route duplication
- [x] Preserve sticky headers for payoff and amortization tables
- [x] Add clearer header hierarchy for dense schedule data
- [x] Add alternating row background for repayment scanability
- [x] Add hover scan aid for desktop without changing mobile behavior
- [x] Keep numeric-heavy schedule columns right-aligned
- [x] Keep balance-transfer scenario summary mixed-alignment for readability
- [x] Keep consolidation guide tables wrapped for longer explanatory content
- [x] Keep placeholder rows intentional and readable
- [x] Remove unnecessary horizontal-scroll UI from all four table-bearing routes
- [x] Convert mobile tables into structured row cards instead of scroll containers
- [x] Add clearer spacing between consolidation example tables
- [x] Add breathing room around consolidation amortization toggle controls
- [x] Regenerate all four built routes after the shared CSS update
- [x] Re-run redesign verification gates after the table pass
- [x] Log the final reusable Excel-style table variant for future reuse
- [x] Roll the Excel-style table variant across all credit-card calculators

---

## Required Gate Matrix

### During each calculator pass

- `CLUSTER=credit-cards CALC=<calc> npm run test:calc:unit`
- `CLUSTER=credit-cards CALC=<calc> npm run test:calc:e2e`
- `CLUSTER=credit-cards CALC=<calc> npm run test:calc:seo`
- `CLUSTER=credit-cards CALC=<calc> npm run test:calc:cwv`

### Cluster regression pass

- `CLUSTER=credit-cards npm run test:cluster:unit`
- `CLUSTER=credit-cards npm run test:cluster:e2e`
- `CLUSTER=credit-cards npm run test:cluster:seo`
- `CLUSTER=credit-cards npm run test:cluster:cwv`

### Mandatory redesign release gates

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run test:cwv:all`
- `npm run test:iss001`
- `npm run test:schema:dedupe`

---

## Risk Register

### R-001 Shell removal breaks current test assumptions

Status:

- known

Affected area:

- top-nav / left-nav / center-column expectations in calc and infra tests

Response:

- redesign shell intentionally
- update tests to the new approved shell contract
- keep route semantics and metadata intact

### R-002 Generated routes drift from source fragments

Status:

- known

Response:

- edit source fragments and generator only
- regenerate outputs
- do not treat built route HTML as the sole source of truth

### R-003 CWV regression during light redesign

Status:

- known

Response:

- avoid large layout shifts
- keep above-the-fold structure stable
- prefer CSS-only presentation
- validate per route and cluster

### R-004 Content drift during layout rewrite

Status:

- known

Response:

- keep explanation/FAQ meaning unchanged
- layout and structure only
- track checklist completion after each calculator

---

## Execution Log

- [x] Action page created
- [x] Cluster scope mapped
- [x] Source/build/test surfaces identified
- [x] Shared design system implemented
- [x] Reference page redesigned
- [x] Remaining calculators redesigned
- [x] Full release gates passed
- [x] Release signoff created
- [x] Table refinement pass documented and verified

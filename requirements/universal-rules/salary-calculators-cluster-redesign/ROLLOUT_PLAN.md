# Salary Calculators Cluster Rollout Plan

Status:

- Drafted on `2026-03-25`
- Scope approved for planning only
- Implementation planning handoff docs defined in `ACTION_PAGE.md` and `RELEASE_PLAN.md`

## Objective

Create a new `salary-calculators` cluster that captures broad salary and pay-conversion search intent without introducing tax-threshold, payroll-rule, or jurisdiction-maintenance debt.

The cluster should:

- target evergreen salary and pay math queries
- stay MPA-safe and cluster-governed
- avoid built-in tax thresholds, withholding rules, and country-specific compliance logic
- support strong internal linking from a single salary hub into exact-match long-tail calculator pages

---

## Cluster Positioning

### Primary cluster name

- `salary-calculators`

### Cluster role

- evergreen salary conversion and earnings math
- search-friendly hub for pay-frequency and compensation utility pages
- future parent area for adjacent earnings tools

### Explicit non-goals for initial rollout

- no income tax calculator
- no take-home pay calculator with hardcoded tax bands
- no payroll deduction engine
- no country-specific PAYE, withholding, VAT, or GST logic
- no live-data dependencies

---

## Proposed Route Set

### Cluster hub

1. `/salary-calculators/`

### Core conversion and earnings calculators

1. `/salary-calculators/salary-calculator/`
2. `/salary-calculators/hourly-to-salary-calculator/`
3. `/salary-calculators/salary-to-hourly-calculator/`
4. `/salary-calculators/annual-to-monthly-salary-calculator/`
5. `/salary-calculators/monthly-to-annual-salary-calculator/`
6. `/salary-calculators/weekly-pay-calculator/`
7. `/salary-calculators/overtime-pay-calculator/`
8. `/salary-calculators/raise-calculator/`
9. `/salary-calculators/bonus-calculator/`
10. `/salary-calculators/commission-calculator/`
11. `/salary-calculators/inflation-adjusted-salary-calculator/`

---

## Search Intent Model

### Head term

- salary calculator

### Exact-match long-tail support

- hourly to salary calculator
- salary to hourly calculator
- annual to monthly salary calculator
- monthly to annual salary calculator
- weekly pay calculator
- overtime pay calculator
- raise calculator
- bonus calculator
- commission calculator
- inflation adjusted salary calculator

### Query strategy

- use the hub to target broad intent and cluster discovery
- use child pages to target exact-use-case queries
- cross-link closely related conversion pages to strengthen topical relevance

---

## Product Rules For This Cluster

- formulas must remain evergreen
- all changing inputs must be user-provided
- no hardcoded tax thresholds or government bands
- no region-specific claims unless a separate scoped requirement is approved later
- each route must preserve full page reload navigation with static `<a href>` links
- each modified or new calculator route must ship as `calc_exp` with `paneLayout=single`
- inflation-adjusted salary comparisons must remain user-input driven and must not depend on live inflation feeds unless separately approved

---

## Execution Sequence

### Phase 0: Cluster definition and governance

- register the new salary cluster in the cluster governance model
- define route ownership and cluster contracts
- define the shared salary cluster design system before child-route implementation begins
- create cluster-local navigation and asset manifest files
- define homepage discoverability expectations
- confirm sitemap coverage for every public route

### Phase 1: Hub and IA foundation

- create the cluster hub at `/salary-calculators/`
- define hub copy, route cards, and salary cluster linking logic
- lock the answer-first light design baseline in `DESIGN_SYSTEM.md`
- define page order and related-calculator linking rules
- define SEO titles, H1s, and answer-first intros for each route

### Phase 2: Core conversion suite

Build the highest-leverage conversion pages first:

1. `salary-calculator`
2. `hourly-to-salary-calculator`
3. `salary-to-hourly-calculator`
4. `annual-to-monthly-salary-calculator`
5. `monthly-to-annual-salary-calculator`

For each route:

- define formula and input contract
- inherit the salary cluster design system and route-variant rules
- implement calculator UI and explanation content
- add cluster navigation links
- generate the public route output
- run scoped validation for the route and cluster contract

### Phase 3: Earnings expansion pages

Build the supporting earnings calculators:

1. `weekly-pay-calculator`
2. `overtime-pay-calculator`
3. `raise-calculator`
4. `bonus-calculator`
5. `commission-calculator`

For each route:

- keep logic user-input driven
- inherit the salary cluster design system and route-variant rules
- avoid region-specific labor-law assumptions
- define output summaries and worked examples
- link back to the hub and to 2 to 4 relevant sibling pages

### Phase 4: Cluster integration

- add salary cluster discoverability to governed navigation
- ensure homepage search includes the new routes unless explicitly excluded
- ensure public sitemap coverage for the hub and all live routes
- verify no cross-cluster runtime leakage

### Phase 5: Release readiness

- run scoped lint and contract validation
- run scoped unit coverage for touched routes
- run scoped e2e coverage for hub and representative calculators
- run scoped CWV and SEO checks required by release mode
- create release sign-off when implementation is actually executed

---

## Recommended Build Order

The expected implementation order is:

1. cluster bootstrap and hub: `/salary-calculators/`
2. `salary-calculator`
3. `hourly-to-salary-calculator`
4. `salary-to-hourly-calculator`
5. `annual-to-monthly-salary-calculator`
6. `monthly-to-annual-salary-calculator`
7. `weekly-pay-calculator`
8. `overtime-pay-calculator`
9. `raise-calculator`
10. `bonus-calculator`
11. `commission-calculator`

Reasoning:

- establish cluster ownership, hub discovery, and governed navigation first
- lead with highest-demand conversion pages
- establish the hub and conversion core first
- add supporting earnings pages after the core linking structure exists

---

## Calculator Logic Boundaries

### Salary calculator

- converts across annual, monthly, biweekly, weekly, daily, and hourly pay
- uses user-entered hours per week and weeks per year where needed
- does not estimate tax or deductions

### Hourly to salary calculator

- hourly rate x hours per week x weeks per year
- optional overtime excluded from the default formula

### Salary to hourly calculator

- annual salary divided by weeks per year and hours per week

### Annual to monthly salary calculator

- annual salary divided by 12

### Monthly to annual salary calculator

- monthly pay multiplied by 12

### Weekly pay calculator

- hourly rate x total weekly hours
- optional regular and overtime hour split allowed if approved in the implementation scope

### Overtime pay calculator

- user enters hourly rate, overtime hours, and overtime multiplier
- no labor-law defaults beyond a clearly editable multiplier

### Raise calculator

- current pay plus raise amount or raise percent

### Bonus calculator

- fixed bonus or percent-of-salary bonus

### Commission calculator

- sales amount x commission rate
- optional base pay input can be added only if explicitly approved during implementation scope

---

## Internal Linking Plan

### Hub links to

- all salary cluster routes
- strongest prominence for the top five conversion pages

### Each child route links to

- the salary hub
- 2 to 4 highly related sibling routes

### Suggested sibling linking pairs

- `hourly-to-salary-calculator` <-> `salary-to-hourly-calculator`
- `annual-to-monthly-salary-calculator` <-> `monthly-to-annual-salary-calculator`
- `salary-calculator` <-> all core conversion pages
- `overtime-pay-calculator` <-> `weekly-pay-calculator`
- `raise-calculator` <-> `bonus-calculator` <-> `salary-calculator`

---

## Content and UX Requirements

- answer-first hero with calculator immediately visible
- concise intro that explains what the route calculates
- worked example below the primary result when useful
- FAQ and notes separated from the core calculation area
- no region-specific promises unless separately approved
- clear labels for hours-per-week, weeks-per-year, and overtime multiplier inputs

---

## Child Route Specs

The rollout plan is the parent planning document. Route-level SEO, schema, IA, and build specs live in dedicated child files under:

- `requirements/universal-rules/salary-calculators-cluster-redesign/calculators/`

### Child spec index

- cluster hub: `calculators/salary-calculators-hub.md`
- `salary-calculator`: `calculators/salary-calculator.md`
- `hourly-to-salary-calculator`: `calculators/hourly-to-salary-calculator.md`
- `salary-to-hourly-calculator`: `calculators/salary-to-hourly-calculator.md`
- `annual-to-monthly-salary-calculator`: `calculators/annual-to-monthly-salary-calculator.md`
- `monthly-to-annual-salary-calculator`: `calculators/monthly-to-annual-salary-calculator.md`
- `weekly-pay-calculator`: `calculators/weekly-pay-calculator.md`
- `overtime-pay-calculator`: `calculators/overtime-pay-calculator.md`
- `raise-calculator`: `calculators/raise-calculator.md`
- `bonus-calculator`: `calculators/bonus-calculator.md`
- `commission-calculator`: `calculators/commission-calculator.md`

### Child spec contract

Each child file is the route-level implementation brief and must include:

- route intro
- page title and H1
- meta description
- search intent
- canonical URL
- primary and secondary keywords
- breadcrumb plan
- JSON-LD package
- FAQ outline
- FAQ schema block
- internal calculator mesh
- formula table
- build-facing input-output schema

### Implementation-ready route sections

Each child file must also include the route-execution sections required for implementation handoff:

- search snippet intro
- assumptions
- input defaults
- rounding rules
- validation rules
- edge cases
- worked example
- result hierarchy
- explanation section outline
- schema mapping notes
- content guardrails
- accessibility notes
- QA checklist

### Parent and child separation

- parent plan owns cluster scope, sequence, risks, and rollout governance
- child files own route-specific SEO, content, schema, internal linking, and formula contracts
- implementation should reference the child file for route-level execution details

### Implementation handoff docs

The parent rollout doc is not the execution checklist by itself. Implementation should also use:

- `requirements/universal-rules/salary-calculators-cluster-redesign/ACTION_PAGE.md` for scope, allowed files, route order, and per-route execution tracking
- `requirements/universal-rules/salary-calculators-cluster-redesign/RELEASE_PLAN.md` for release batching, gate selection, evidence expectations, and sign-off planning

Implementation should not begin from route briefs alone. Use the parent plan for strategy, the action page for delivery control, and the release plan for gate execution.

---

## Acceptance Criteria Per Route

- route is discoverable from the salary cluster hub
- route remains MPA-safe with static link navigation
- route is single-pane if it is a `calc_exp` calculator
- calculator logic is deterministic and user-input driven
- no threshold-maintenance dependency is introduced
- explanation content matches the implemented formula
- route is covered by governed navigation and sitemap
- scoped test and validation gates pass during implementation release work

---

## Cluster Completion Standard

The cluster rollout is complete only when:

- the hub route is live
- all 10 calculator routes are live
- internal linking is complete and intentional
- sitemap coverage is complete
- homepage search discoverability is compliant
- cluster contracts and route ownership are in place
- implementation release gates pass and release sign-off is created

---

## Risks and Watchouts

- broad salary intent can drift into tax-intent if page copy is not disciplined
- overtime assumptions can become jurisdiction-specific if defaults are presented as rules
- commission and bonus pages must stay formula-driven and not imply payroll compliance
- the cluster should not silently borrow pricing or percentage cluster runtime assets

---

## Future Expansion Options

Only after separate approval and maintenance commitment:

- take-home pay calculators by country
- income tax calculators by country
- paycheck calculators by pay frequency and jurisdiction
- contractor day-rate and freelancer rate calculators

---

## Summary

The `salary-calculators` cluster should start as an evergreen salary and earnings-math cluster, not a payroll-rules cluster. The implementation priority is the conversion core first, then earnings support pages, then low-maintenance decision tools such as inflation-adjusted salary comparison, and only after that any future rules-heavy expansion with separate scope and maintenance approval.

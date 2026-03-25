# Salary Calculators Release Plan

## Purpose

This document translates the repository release policy into a practical release sequence for the `salary-calculators` cluster.

Use it with:

- `ROLLOUT_PLAN.md` for strategy and route order
- `ACTION_PAGE.md` for scope control and route execution tracking
- child route briefs under `calculators/*.md` for route-level implementation details
- `requirements/universal-rules/RELEASE_CHECKLIST.md` for the authoritative gate rules

---

## Default Release Strategy

Use the smallest valid release scope that matches the actual change.

### Preferred sequence

1. cluster bootstrap and hub release
2. one calculator release at a time in the approved work order
3. optional final cluster sweep only if a later shared-cluster change touches multiple salary routes intentionally

### Default release mode

- cluster bootstrap: `ONBOARDING`
- first-time calculator launches: `NEW_BUILD`
- later fixes to already released salary routes: `STANDARD` unless the change materially redesigns the route

### Scope promotion rule

Start as a single-calculator release whenever possible.

Promote the release to cluster scope if any of the following are true:

- shared salary cluster shell or runtime is changed intentionally
- cluster navigation or asset-manifest changes affect multiple salary routes
- route ownership or cluster registry changes are bundled with multiple route launches
- the hub and multiple child routes must be released together for contract integrity

---

## Release Batches

## Batch 0: Cluster Bootstrap and Hub

Release type:

- `CLUSTER_ROUTE`

Release scope:

- cluster

Release mode:

- `ONBOARDING`

Intended contents:

- salary cluster governance and ownership contracts
- hub route `/salary-calculators/`
- cluster navigation and asset-manifest scaffolding
- homepage discoverability and sitemap integration for the hub

Required gates:

- `npm run lint`
- `CLUSTER=salary npm run test:cluster:unit`
- `CLUSTER=salary npm run test:cluster:e2e`
- `CLUSTER=salary npm run test:cluster:seo`
- `CLUSTER=salary npm run test:cluster:cwv`
- `CLUSTER=salary npm run test:schema:dedupe -- --scope=cluster`
- `CLUSTER=salary npm run test:cluster:contracts`
- `npm run test:isolation:scope`

Required evidence:

- cluster registry proof
- route ownership proof
- hub route proof
- homepage search discoverability proof
- sitemap proof for the hub
- sign-off file with cluster scope statement

---

## Batch 1-10: Single Calculator Launches

Release type:

- `CLUSTER_ROUTE_SINGLE_CALC`

Release scope:

- single calculator

Release mode:

- `NEW_BUILD`

Applies to:

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

Required scope lock fields:

- `CLUSTER=salary`
- `CALC=<calculator-id>`
- `ROUTE=<route-path>`

Required gates:

- `npm run lint`
- `CLUSTER=salary CALC=<calculator-id> npm run test:calc:unit`
- `CLUSTER=salary CALC=<calculator-id> npm run test:calc:e2e`
- `CLUSTER=salary CALC=<calculator-id> npm run test:calc:seo`
- `CLUSTER=salary CALC=<calculator-id> npm run test:calc:cwv`
- `CLUSTER=salary CALC=<calculator-id> npm run test:schema:dedupe -- --scope=calc`
- `CLUSTER=salary npm run test:cluster:contracts`
- `npm run test:isolation:scope`

Required evidence:

- child route brief path
- route ownership proof for the released route
- pane-layout proof for `calc_exp`
- homepage search keyword proof for the released route
- sitemap proof for the released route
- scoped CWV artifact path
- schema dedupe report paths
- sign-off file with the exact calculator scope lock

---

## Optional Batch 11: Cluster Sweep

Use this only if a later approved change intentionally affects multiple salary routes through shared cluster files.

Release type:

- `CLUSTER_ROUTE`

Release mode:

- `STANDARD` or `REDESIGN`, depending on the change

Required gates:

- `npm run lint`
- `CLUSTER=salary npm run test:cluster:unit`
- `CLUSTER=salary npm run test:cluster:e2e`
- `CLUSTER=salary npm run test:cluster:seo`
- `CLUSTER=salary npm run test:cluster:cwv`
- `CLUSTER=salary npm run test:schema:dedupe -- --scope=cluster`
- `CLUSTER=salary npm run test:cluster:contracts`
- `npm run test:isolation:scope`

---

## Route Release Order

1. `/salary-calculators/`
2. `/salary-calculators/salary-calculator/`
3. `/salary-calculators/hourly-to-salary-calculator/`
4. `/salary-calculators/salary-to-hourly-calculator/`
5. `/salary-calculators/annual-to-monthly-salary-calculator/`
6. `/salary-calculators/monthly-to-annual-salary-calculator/`
7. `/salary-calculators/weekly-pay-calculator/`
8. `/salary-calculators/overtime-pay-calculator/`
9. `/salary-calculators/raise-calculator/`
10. `/salary-calculators/bonus-calculator/`
11. `/salary-calculators/commission-calculator/`

This order is mandatory unless scope is re-approved.

---

## Release-ID Plan

Suggested sign-off IDs:

- `REL-YYYYMMDD-SALARY-CLUSTER-BOOTSTRAP`
- `REL-YYYYMMDD-SALARY-SALARY-CALCULATOR`
- `REL-YYYYMMDD-SALARY-HOURLY-TO-SALARY`
- `REL-YYYYMMDD-SALARY-SALARY-TO-HOURLY`
- `REL-YYYYMMDD-SALARY-ANNUAL-TO-MONTHLY`
- `REL-YYYYMMDD-SALARY-MONTHLY-TO-ANNUAL`
- `REL-YYYYMMDD-SALARY-WEEKLY-PAY`
- `REL-YYYYMMDD-SALARY-OVERTIME-PAY`
- `REL-YYYYMMDD-SALARY-RAISE`
- `REL-YYYYMMDD-SALARY-BONUS`
- `REL-YYYYMMDD-SALARY-COMMISSION`

---

## Release Checklist Mapping

Every salary release sign-off should record:

- release ID
- release type
- scope statement
- cluster ID `salary`
- calculator ID when applicable
- primary route
- release mode
- exact gates run
- evidence paths
- exceptions or known risks
- final decision

Use the repository sign-off pattern shown in existing cluster sign-offs. Do not merge without a filled sign-off.

---

## Evidence Checklist

Every salary route release should attach or reference the following evidence:

- approved scope statement
- route brief path used during implementation
- generated route output path
- route ownership proof
- navigation metadata proof
- pane-layout proof for `calc_exp`
- homepage search discoverability proof
- sitemap entry proof
- schema dedupe reports
- CWV evidence path
- SEO evidence path
- any release exceptions with mitigation notes

---

## Release Stop Conditions

Stop and re-scope before release if any of the following occurs:

- the route requires files outside the approved salary scope
- a shared salary change affects multiple routes unintentionally
- homepage discoverability or sitemap integration requires broader cluster edits than declared
- the target route cannot satisfy `paneLayout=single`
- the route logic drifts into tax, withholding, or jurisdiction-claim behavior

If the scope changes, update `ACTION_PAGE.md` first and obtain explicit approval before continuing.
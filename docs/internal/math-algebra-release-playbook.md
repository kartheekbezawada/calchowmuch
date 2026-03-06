# Math Algebra Autonomous Release Playbook

## Purpose
This playbook defines the exact unattended execution model for the 5 algebra calculator waves:

1. quadratic-equation
2. slope-distance
3. factoring
4. polynomial-operations
5. system-of-equations

The queue runs end-to-end with no waiting between waves.

## Execution Policy

### Wave Order (Locked)
Run only in this order:

1. `quadratic-equation`
2. `slope-distance`
3. `factoring`
4. `polynomial-operations`
5. `system-of-equations`

### Per-Wave Completion States
Each wave must end as exactly one of:

- `passed`
- `failed`
- `admin-approved`

### Commit Policy
- One commit per wave.
- Do not amend commits.
- Keep commits route-scoped except for approved shared baseline changes.

## ADMIN Policy
Use `ADMIN` only when a wave is blocked by non-target/global baseline constraints and target quality evidence is complete.

Valid `ADMIN` triggers:

1. Mandatory hard gate fails due to known non-target/global baseline breakage.
2. Scope governance mismatch would halt queue despite target route readiness.
3. Tooling/governance mismatch blocks release while target route evidence is complete.

When `ADMIN` is used:

1. Mark wave as `admin-approved`.
2. Record exact failed gate and reason in sign-off.
3. Add explicit `ADMIN` note in master table.
4. Continue to next wave.

## Mandatory Build Rules Per Wave

1. Fix runtime/logic issues for target calculator.
2. Maintain MPA behavior (`<a href>` hard navigation).
3. Enforce single-pane for touched `calc_exp` route.
4. Ensure explanation block order:
   - Intent-led `H2`
   - `How to Guide` (`H3`)
   - `FAQ` (`H3`)
   - `Important Notes` (`H3`) as final section with required keys:
     - `Last updated: <Month YYYY>`
     - `Accuracy`
     - disclaimer label (`Financial disclaimer`/`Health disclaimer`/`Disclaimer`)
     - `Assumptions`
     - exact `Privacy` statement
5. Replace placeholder test packs with real scoped tests (`unit`, `e2e`, `seo`).
6. Regenerate only target route.

## Required Gate Commands Per Wave

Run exactly:

1. `npm run lint`
2. `CLUSTER=math CALC=<calc> npm run test:calc:unit`
3. `CLUSTER=math CALC=<calc> npm run test:calc:e2e`
4. `CLUSTER=math CALC=<calc> npm run test:calc:seo`
5. `CLUSTER=math CALC=<calc> npm run test:calc:cwv`
6. `CLUSTER=math CALC=<calc> npm run test:schema:dedupe -- --scope=calc`
7. `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` (only when shared files changed)
8. `npm run test:cluster:contracts`

If in-scope failures happen, fix and re-run.

## Shared CWV Baseline Prerequisite
Before wave 1, onboard algebra routes to route-bundle critical/deferred CSS flow so strict scoped CWV can pass.

Checklist:

1. Update route-bundle configuration for algebra routes.
2. Update MPA generator overrides for single-pane + explanation heading suppression.
3. Rebuild route bundle artifacts and manifests.
4. Confirm target route uses route-bundle CSS path.

## Release Evidence Per Wave

1. Create sign-off file:
   - `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-YYYYMMDD-XXX.md`
2. Update master table:
   - `requirements/universal-rules/Release Sign-Off Master Table.md`
3. Update queue tracker:
   - `docs/internal/math-algebra-wave-status.md`
4. Commit wave changes.

## Final Queue Output
After wave 5, publish matrix with:

- calculator
- status (`passed` / `failed` / `admin-approved`)
- release ID
- commit SHA
- gate summary
- artifact paths
- follow-up actions (only for `failed` / `admin-approved`)

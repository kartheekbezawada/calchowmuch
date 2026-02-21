# Time-and-Date Cluster Migration Plan

## 1) Purpose and Scope

This document is the execution plan for migrating Time-and-Date calculators to cluster-owned architecture under Universal Requirements.

Groundwork scope:
- Documentation + contracts bootstrap for all `/time-and-date/**` routes
- No calculator UI redesign in this release

Rollout model:
- One-by-one migration for calculator onboarding waves
- Public URLs remain unchanged

## 2) Governance Mapping (UR IDs)

- MPA navigation: `UR-NAV-001`, `UR-NAV-002`
- Route archetype + pane policy: `UR-NAV-030` to `UR-NAV-038`
- Cluster boundaries and isolation: `UR-CLUSTER-001` to `UR-CLUSTER-021`
- Route ownership contract: `UR-CLUSTER-008`
- Cluster registry contract: `UR-CLUSTER-009`
- Per-cluster nav/asset contracts: `UR-CLUSTER-010`
- Isolation fence: `UR-CLUSTER-011`, `UR-CLUSTER-012`
- Global nav parity: `UR-CLUSTER-015`
- Cross-cluster guards in release gates: `UR-CLUSTER-017`
- New cluster/category onboarding default: `UR-CLUSTER-018`
- Sitemap inclusion and infrastructure: `UR-SMAP-001`, `UR-SMAP-003`, `UR-SMAP-005`
- Scoped release gates: `UR-TEST-045`, `UR-TEST-046`, `UR-TEST-047`, `UR-TEST-052`
- Factory pipeline: `UR-FLOW-001`, `UR-FLOW-010`, `UR-FLOW-011`, `UR-FLOW-012`, `UR-FLOW-013`

## 3) Current-State Gap Analysis

Current status in this repository:
- `time-and-date` exists in `config/clusters/cluster-registry.json` but is `legacy` with `contractsEnabled=false`
- `config/clusters/route-ownership.json` has no `/time-and-date/**` ownership entries
- `clusters/time-and-date/config/navigation.json` is missing
- `clusters/time-and-date/config/asset-manifest.json` is missing
- `config/testing/test-scope-map.json` is split between `sleep-and-nap` and `time-and-date`

Groundwork closes these gaps and normalizes scope to a single cluster owner.

## 4) Target Architecture for Time-and-Date Cluster

- Cluster ID: `time-and-date`
- Owner scope: all `/time-and-date/**` calculators (12 routes)
- Public route behavior: unchanged URLs, MPA hard navigation with `<a href>`
- Runtime/build ownership: cluster-owned contracts and manifests
- Cross-cluster behavior: link-only allowed, runtime imports across clusters prohibited

## 5) Wave Model

### 5.1 Wave 0 (Groundwork)

Wave 0 changes:
- Add migration documentation and contract baseline
- Enable registry contracts for `time-and-date`
- Create cluster-local navigation + asset manifest contracts
- Add ownership entries for all 12 routes
- Normalize scoped test map under `CLUSTER=time-and-date`

Out of scope for Wave 0:
- Per-calculator UI redesign
- URL changes
- Shared generator rewiring

### 5.2 Wave 1 (First Calculator Onboarding)

Target route:
- `/time-and-date/age-calculator/`

Wave 1 intent:
- Migrate route to isolated cluster-owned pattern
- Enforce `calc_exp` + `paneLayout=single`
- Preserve existing compute logic and SEO semantics
- Keep URL unchanged

Subsequent waves onboard remaining routes one calculator at a time.

## 6) Routes In Scope (Cluster Contract Ownership)

1. `/time-and-date/sleep-time-calculator/`
2. `/time-and-date/wake-up-time-calculator/`
3. `/time-and-date/nap-time-calculator/`
4. `/time-and-date/power-nap-calculator/`
5. `/time-and-date/energy-based-nap-selector/`
6. `/time-and-date/work-hours-calculator/`
7. `/time-and-date/overtime-hours-calculator/`
8. `/time-and-date/time-between-two-dates-calculator/`
9. `/time-and-date/days-until-a-date-calculator/`
10. `/time-and-date/countdown-timer-generator/`
11. `/time-and-date/age-calculator/`
12. `/time-and-date/birthday-day-of-week/`

## 7) File-by-File Change Map

Documentation/contracts:
- `requirements/universal-rules/TIME_AND_DATE_CLUSTER_MIGRATION_PLAN.md`
- `config/clusters/cluster-registry.json`
- `config/clusters/route-ownership.json`
- `clusters/time-and-date/config/navigation.json`
- `clusters/time-and-date/config/asset-manifest.json`
- `config/testing/test-scope-map.json`

Release evidence:
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_<ID>.md`
- `requirements/universal-rules/Release Sign-Off Master Table.md`

## 8) Build/Test/Release Checklist Command Matrix

Scoped cluster gates for groundwork release:
1. `npm run test:cluster:contracts`
2. `CLUSTER=time-and-date npm run test:cluster:unit`
3. `CLUSTER=time-and-date npm run test:cluster:e2e`
4. `CLUSTER=time-and-date npm run test:cluster:seo`
5. `CLUSTER=time-and-date npm run test:cluster:cwv`
6. `CLUSTER=time-and-date npm run test:schema:dedupe -- --scope=cluster`

Wave 1 calc gates (post-groundwork merge):
1. `CLUSTER=time-and-date CALC=age-calculator npm run test:calc:unit`
2. `CLUSTER=time-and-date CALC=age-calculator npm run test:calc:e2e`
3. `CLUSTER=time-and-date CALC=age-calculator npm run test:calc:seo`
4. `CLUSTER=time-and-date CALC=age-calculator npm run test:calc:cwv`

## 9) Sign-Off Artifacts

Required evidence in release sign-off:
- Checklist results and command evidence
- Contract validation evidence (`test:cluster:contracts`)
- Scoped test evidence for `CLUSTER=time-and-date`
- Sitemap evidence for all 12 `/time-and-date/**` routes
- Scope statement and any approved scope deltas

Artifacts:
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_<ID>.md`
- `requirements/universal-rules/Release Sign-Off Master Table.md`

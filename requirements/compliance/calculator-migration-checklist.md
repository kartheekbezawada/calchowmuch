# Migration Checklist (Legacy Calculator -> New Design System)

## Scope
Applies to existing public routes being migrated from legacy implementation to the current design/compliance baseline.

This checklist is mandatory for migration workstreams and produces deterministic PASS/FAIL evidence.

## Usage Contract

Required inputs:

- `REQ_ID`
- Route (`/category/calculator-slug/`)
- Source calculator path (legacy implementation)
- Target module/fragment paths
- `routeArchetype` and `designFamily`
- Pane declarations (`Calculation Pane: REQUIRED|OMITTED`, `Explanation Pane: REQUIRED|OMITTED`)
- Pane omission rationale when any pane is omitted
- Navigation category + left-nav label target
- Sitemap target (`/sitemap/` entry and XML coverage)

Expected output:

- Migration Verdict: `PASS` or `FAIL`
- Blocking issues (if any)
- Evidence links/paths for each required gate

## Canonical Gate Table Format
Use this exact format for every checklist run.

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |

## Group A - Baseline Inventory and Parity Lock

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-A1 | P0 | UR-AP-003 | Compare legacy route behavior to migration scope notes | Baseline inventory exists for inputs/outputs/nav/SEO/schema and pane contracts | Migration notes or REQ delta section |
| MIG-A2 | P0 | UR-NAV-030..033 | Validate migration governance contract | Target archetype/family and pane declarations are explicit; omissions include rationale and replacement contract | REQ header + migration contract |
| MIG-A3 | P1 | UR-TEST-034 | Capture pre-migration visual evidence | Before-state desktop/mobile evidence captured for regression comparison | Screenshot refs |

## Group B - Shell and Routing Integrity (MPA)

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-B1 | P0 | UR-NAV-001, UR-NAV-002 | Inspect nav markup and runtime behavior | Navigation uses static `<a href>` links with full reloads | Route E2E nav run + HTML snippet |
| MIG-B2 | P0 | UR-NAV-003, UR-NAV-004 | Validate hierarchy/pathing | Route remains in correct hierarchy and nav source of truth | Navigation config evidence |
| MIG-B3 | P0 | UR-NAV-035, UR-NAV-036 | Validate route metadata and fragment contract | Generated page exposes body metadata and required archetype fragments exist | Generated HTML + file tree evidence |

## Group C - New Design Adoption

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-C1 | P0 | UR-UI-001..003 | Inspect CSS imports/token usage | Route inherits global theme and shared tokens; no duplicate per-page theme load | HTML/CSS evidence |
| MIG-C2 | P0 | UR-UI-030..033 | Inspect design family implementation | Route reflects declared design family while preserving shared shell standards | CSS/token evidence |
| MIG-C3 | P1 | UR-UI-034, UR-UI-035 | Verify design evidence | Desktop/mobile screenshots and token/class proof are attached | Screenshot + diff refs |

## Group D - Interaction Contract

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-D1 | P0 | UR-UI-012 | Control audit for calc archetypes | No prohibited dropdown mode controls for calculator interactions (or valid `N/A`) | DOM check |
| MIG-D2 | P0 | UR-UI-020, UR-UI-021 | Trigger regression test | Post-load edits do not recompute before Calculate click (or valid `N/A`) | Route E2E trigger evidence |
| MIG-D3 | P0 | UR-UI-022 | Dense/multi-mode determinism check | Mode controls/default mapping and dynamic row behavior remain deterministic | REQ contract + E2E evidence |
| MIG-D4 | P0 | UR-NAV-033, UR-CHK-005 | Pane omission legality check | Omitted panes are explicitly documented and justified; implicit omission is not allowed | Checklist rationale + REQ proof |

## Group E - Explanation Contract / Omission Compliance

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-E1 | P0 | UR-EXP-001..003 | Inspect explanation structure | Required section order and heading hierarchy pass when explanation pane exists | Explanation HTML + E2E |
| MIG-E2 | P0 | UR-EXP-010, UR-EXP-011 | Validate dynamic content | Summary/tables reference runtime values (no static placeholders) when explanation exists | Runtime capture |
| MIG-E3 | P0 | UR-EXP-012, UR-EXP-013 | FAQ contract check | FAQ baseline/parity is correct when FAQ exists | DOM + schema parity evidence |
| MIG-E4 | P0 | UR-NAV-033 | Omitted explanation pane gate | For archetypes without explanation pane, checklist records `N/A` with replacement content evidence | Checklist `N/A` rationale |

## Group F - SEO / Schema / Static HTML

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-F1 | P0 | UR-SEO-001..003 | Execute P1 checks | Title/meta/H1/robots/canonical contracts pass | SEO E2E output |
| MIG-F2 | P0 | UR-SEO-010 | Validate archetype-aware schema set | Required schema types by archetype are present | Schema report |
| MIG-F3 | P0 | UR-SEO-011 | Validate FAQ three-place check when required | Static JSON-LD + module + visible FAQ parity passes when FAQPage is required | Schema parity evidence |
| MIG-F4 | P0 | UR-SEO-012 | Validate failure conditions | No missing required schema type and no invalid JSON-LD | Validation output |

## Group G - Sitemap and Navigation Coverage

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-G1 | P0 | UR-SMAP-002, UR-SMAP-005 | Confirm live/reachable classification and REQ criterion | Route is live/reachable and REQ includes sitemap acceptance criterion | REQ + nav evidence |
| MIG-G2 | P0 | UR-SMAP-001, UR-SMAP-004 | Verify `/sitemap/` coverage | Migrated route appears in human sitemap and is not omitted | Sitemap evidence |
| MIG-G3 | P1 | UR-SMAP-006, UR-SEO-022 | Validate XML sitemap + robots linkage | `sitemap.xml` coverage and crawlability remain valid | XML + robots evidence |

## Group H - Test Evidence Minimums

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-H1 | P0 | UR-TEST-030..033 | Execute mandatory test matrix by archetype | Required suites pass; non-applicable suites are marked `N/A` with rationale | Test outputs + checklist notes |
| MIG-H2 | P0 | UR-TEST-035 | Execute archetype contract E2E | Body metadata and pane presence/absence match declared archetype | `route-archetype-contract.spec.js` output |
| MIG-H3 | P0 | UR-TEST-004 | Execute schema guard | Schema guard passes for migrated scope | Vitest output |
| MIG-H4 | P1 | UR-TEST-034, UR-TEST-003 | Run ISS-001 when triggered | ISS-001 passes for shell/layout-impacting changes | ISS-001 output |
| MIG-H5 | P0 | UR-TEST-013 | Run trigger regression where applicable | Finance/Percentage trigger contract passes when in scope | E2E output |

## Group I - Compliance Artifact Completion

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-I1 | P0 | UR-FSM-011, UR-TEST-020 | Check `build_tracker.md` and `testing_tracker.md` | Build and required tests are recorded with correct IDs/statuses | Tracker row refs |
| MIG-I2 | P0 | UR-SEO-031 | Check `seo_tracker.md` | SEO status is PASS/WAIVED/NA with required evidence | Tracker row ref |
| MIG-I3 | P0 | UR-FSM-032, UR-DOD-005 | Check `compliance-report.md` | Exactly one compliance row exists for REQ and reflects executed evidence | Compliance row ref |
| MIG-I4 | P0 | UR-CHK-003..005 | Verify checklist quality gate | Checklist includes pass/fail, artifacts, screenshot evidence, and required omission rationales | Completed checklist artifact |

## Hard Fail Conditions

Any of the following is an automatic `FAIL`:

- Missing sitemap coverage for a live/public route
- Any unresolved P0 violation in this checklist
- Missing required evidence artifact for a required gate
- Missing archetype/design-family declaration evidence
- Pane omission without explicit rationale and replacement content evidence
- Missing required desktop/mobile design screenshot evidence

## Completion Block (Required)

- Migration Verdict: `PASS | FAIL`
- Blocking Issues:
- REQ_ID:
- ITER_ID:
- Reviewer:
- Date (YYYY-MM-DD):
- Evidence Index:

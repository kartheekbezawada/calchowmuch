# New Calculator Checklist (New Design Baseline)

## Scope
Applies to brand-new public routes built on the new design baseline.

This checklist is mandatory for every new route and is a release gate.

## Usage Contract

Required inputs:

- `REQ_ID`
- Route slug and canonical URL
- `routeArchetype` (`calc_exp | calc_only | exp_only | content_shell`)
- `designFamily` (`home-loan | auto-loans | credit-cards | neutral`)
- Pane declaration (`Calculation Pane: REQUIRED|OMITTED`, `Explanation Pane: REQUIRED|OMITTED`)
- Pane omission rationale (required when any pane is omitted)
- Category mapping (top-nav domain, left-nav placement, navigation config path)
- Required schema set for the route
- Target implementation files/fragments (`index.html`, `explanation.html`, `content.html`, `module.js`, tests)

Expected output:

- Launch Readiness: `PASS` or `FAIL`
- Blocking gaps and owners
- Evidence links/paths for each required gate

## Canonical Gate Table Format
Use this exact format for every checklist run.

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |

## Group A - Requirement Completeness Gate

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-A1 | P0 | UR-DC-003, UR-FSM-010 | Review REQ structure before implementation | REQ defines purpose, route, archetype, family, input/output contracts, SEO/schema, tests, and acceptance criteria | REQ reference |
| NEW-A2 | P0 | UR-NAV-030..033 | Verify route governance contract | REQ declares archetype/family and explicitly states pane presence/omission with rationale | REQ header block |
| NEW-A3 | P0 | UR-SMAP-005 | Validate REQ acceptance criteria | REQ explicitly includes sitemap inclusion criterion | REQ acceptance section |
| NEW-A4 | P1 | UR-UI-034, UR-UI-035 | Verify evidence plan in REQ | REQ includes required desktop/mobile screenshot evidence requirement | REQ evidence section |

## Group B - File / Folder Scaffolding and Module Boundaries

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-B1 | P0 | UR-NAV-036 | Validate fragment contract by archetype | Required fragments exist for selected archetype (`calc_exp`, `calc_only`, `exp_only`, `content_shell`) | File tree evidence |
| NEW-B2 | P0 | UR-NAV-005 | Review ownership boundaries | Shell logic is not duplicated in route module; route logic stays route-scoped | Changed file list |
| NEW-B3 | P1 | UR-NAV-006 | Inspect shared utility usage | Shared utilities are reused; no avoidable duplication in route files | Diff + utility reference |
| NEW-B4 | P0 | UR-NAV-035 | Inspect generated HTML output | `<body>` contains `data-route-archetype` and `data-design-family` values matching REQ/navigation metadata | Generated HTML snippet |

## Group C - UI Baseline (New Design Contract)

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-C1 | P0 | UR-UI-001..003 | Inspect style/token usage | Route inherits global premium-dark and shared tokens without per-page theme duplication | HTML/CSS evidence |
| NEW-C2 | P0 | UR-UI-030..033 | Inspect family styling contract | Visual direction matches selected design family without breaking shared shell/legibility | CSS/token evidence |
| NEW-C3 | P0 | UR-UI-012 | Control audit for calc archetypes | No `<select>` controls used for calculator mode interactions (or valid `N/A` when no calc pane) | DOM check |
| NEW-C4 | P0 | UR-UI-020..022 | Trigger-behavior test | Post-load edits do not recompute until Calculate click for calc archetypes (or valid `N/A`) | Route E2E evidence |
| NEW-C5 | P1 | UR-UI-034, UR-UI-035 | Design proof audit | Desktop + mobile screenshots plus token/class proof are attached | Screenshot + diff references |

## Group D - Explanation Contract / Pane Omission Gate

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-D1 | P0 | UR-EXP-001..003 | Inspect explanation structure | Mandatory heading/section order is correct for archetypes with explanation pane | Explanation HTML proof |
| NEW-D2 | P0 | UR-EXP-010, UR-EXP-011 | Validate dynamic explanation content | Summary/tables reflect runtime inputs and outputs for explanation archetypes | Runtime output capture |
| NEW-D3 | P0 | UR-EXP-012, UR-EXP-013 | FAQ contract check | FAQ count/pattern and parity requirements are met when FAQ exists | DOM + schema parity evidence |
| NEW-D4 | P0 | UR-NAV-033, UR-CHK-005 | Pane omission check | If explanation is omitted, checklist marks `N/A` with rationale and replacement content contract evidence | Checklist `N/A` rationale + REQ proof |

## Group E - SEO P1/P2/P5 + P3 Waiver Handling

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-E1 | P0 | UR-SEO-001..003 | Execute SEO P1 checks | Title/meta/canonical/H1/lang/viewport/robots pass | SEO E2E output |
| NEW-E2 | P0 | UR-SEO-010 | Validate archetype-aware schema set | Required schema types by archetype are present in static source | Schema report |
| NEW-E3 | P0 | UR-SEO-011, UR-SEO-012 | Execute FAQ/schema parity checks | FAQ three-place check passes when FAQPage is required; no invalid required-gap | Source + validation output |
| NEW-E4 | P0 | UR-SEO-022, UR-SMAP-001..006 | Execute crawl/indexing checks | Sitemap + robots + canonical governance pass | SEO tracker evidence |
| NEW-E5 | P1 | UR-SEO-020 | Attempt Lighthouse and record outcome | P3 is PASS or WAIVED only with policy-compliant evidence | Lighthouse output or waiver |

## Group F - Schema Contract (Archetype-Aware)

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-F1 | P0 | UR-SEO-010 | Validate required type presence | Archetype-required types exist (`WebPage`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage` where required) | Schema report |
| NEW-F2 | P0 | UR-SEO-010, UR-SEO-012 | Validate SoftwareApplication usage | Calculator archetypes contain required SoftwareApplication schema; non-calculator archetypes are not forced to add it | Schema report |
| NEW-F3 | P0 | UR-SEO-011 | FAQ conditional check | FAQPage is required only when visible FAQ exists; if required, parity passes | DOM + JSON-LD evidence |
| NEW-F4 | P0 | UR-SEO-012 | Validate JSON-LD integrity | JSON-LD is syntactically valid and contains no required-type violations | Validation output |

## Group G - Navigation, Sitemap, and Reachability Gate

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-G1 | P0 | UR-NAV-001..004 | Validate navigation integration | Route is reachable through the correct category and MPA nav hierarchy | Navigation config diff |
| NEW-G2 | P0 | UR-SMAP-001..004 | Validate sitemap coverage | Route appears in `/sitemap/` and is not omitted from live coverage | Sitemap evidence |
| NEW-G3 | P0 | UR-SMAP-002 | Direct URL reachability check | Public route is reachable and correctly classified as live | Route load evidence |

## Group H - Mandatory Test Minimums (Archetype Matrix)

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-H1 | P0 | UR-TEST-030..033 | Run required test bundle by archetype | Mandatory suites for selected archetype pass; non-applicable suites are `N/A` with rationale | Test outputs + checklist notes |
| NEW-H2 | P0 | UR-TEST-035 | Run archetype compliance E2E | Body metadata and pane presence/absence match declared archetype/family | `route-archetype-contract.spec.js` output |
| NEW-H3 | P0 | UR-TEST-004 | Run schema guard suite | Schema guard passes for route scope | Vitest output |
| NEW-H4 | P1 | UR-TEST-034, UR-TEST-003 | Run ISS-001 when triggered | ISS-001 passes for shell/layout-impacting changes | `npm run test:iss001` evidence |
| NEW-H5 | P0 | UR-TEST-013 | Run trigger regression when applicable | Finance/Percentage trigger contract tests pass when in scope | E2E output |

## Group I - Compliance Artifact Completion

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-I1 | P0 | UR-FSM-011, UR-TEST-020 | Check `RELEASE_SIGNOFF.md` Sections 4–5 | Build and test evidence recorded in release sign-off | Sign-off sections |
| NEW-I2 | P0 | UR-SEO-031 | Check `RELEASE_SIGNOFF.md` Section 8 | SERP readiness verified (metadata, schema, indexability) | Sign-off section |
| NEW-I3 | P0 | UR-FSM-032, UR-DOD-005 | Check `Release Sign-Off Master Table.md` | One row exists for this release with APPROVED status | Master table row |
| NEW-I4 | P0 | UR-CHK-003..005 | Verify checklist completion quality | All required gates contain pass/fail, artifacts, and `N/A` rationale where used | Completed checklist artifact |

## Hard Fail Conditions

Any of the following is an automatic `FAIL`:

- Missing `routeArchetype`/`designFamily` declaration or mismatch with implementation
- Pane omission without explicit rationale and replacement content contract evidence
- Missing required schema types for declared archetype
- Missing sitemap inclusion for a live/public route
- Missing required test evidence for mandatory suites
- Missing required desktop/mobile design screenshots
- Any unresolved P0 violation in this checklist

## Completion Block (Required)

- Launch Readiness: `PASS | FAIL`
- Blocking Gaps:
- Gap Owner(s):
- REQ_ID:
- ITER_ID:
- Reviewer:
- Date (YYYY-MM-DD):
- Evidence Index:

# New Calculator Checklist (New Design Baseline)

## Scope
Applies to brand-new public calculator routes built on the current platform baseline.

This checklist is mandatory for any new calculator requirement and is used as a release gate.

## Usage Contract

Required inputs:

- `REQ_ID`
- Route slug and canonical URL
- Category mapping (top-nav domain, left-nav placement, navigation config path)
- Required schema set for the page
- Target implementation files (`index.html`, `module.js`, `explanation.html`, tests)

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
| NEW-A1 | P0 | WORKFLOW REQ gate, AP-2.3 | Review REQ structure before implementation | REQ defines purpose, route, inputs, outputs, validations, SEO metadata, schema, tests, and acceptance criteria | REQ reference |
| NEW-A2 | P0 | UI-2.7, ISS-UI-FDP-010/011 | Inspect REQ interaction contract for dense/multi-mode routes | REQ includes mode control type, default mode, field visibility mapping, and dynamic-row parity contract when applicable | REQ interaction contract section |
| NEW-A3 | P0 | DOC-SITEMAP-5 | Validate REQ acceptance criteria | REQ explicitly includes sitemap inclusion criterion | REQ acceptance criteria section |

## Group B - File / Folder Scaffolding and Module Boundaries

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-B1 | P0 | FS-3.1 | Validate file scaffolding | Route has required calculator files and follows folder contract | File tree evidence |
| NEW-B2 | P0 | ARCH-2.1, ARCH-2.3 | Review ownership boundaries | Shell logic is not duplicated in calculator module; calculator logic remains route-scoped | Changed file list |
| NEW-B3 | P1 | CS-1.2, CS-3.3 | Inspect shared utility usage | Shared utilities are reused; no avoidable duplication in route files | Diff + utility reference |

## Group C - UI Baseline (New Design Contract)

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-C1 | P0 | UI-1.1, UNIVERSAL_REQUIREMENTS.md | Inspect style/token usage | Route inherits premium-dark theme and shared tokens without per-page theme duplication | HTML/CSS evidence |
| NEW-C2 | P0 | UI-2.5 | Control audit | No dropdown/select controls used for calculator interaction | DOM check |
| NEW-C3 | P0 | UI-2.6, ISS-UI-FDP-008 | Trigger-behavior test | Results/explanation updates are Calculate-click driven after page-load baseline | Route E2E trigger evidence |
| NEW-C4 | P0 | UI-2.3, ISS-UI-FDP-006 | Input/label audit | All inputs have explicit labels and valid constraints | DOM check + E2E |

## Group D - Explanation Pane Mandatory Contract

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-D1 | P0 | UI-EXP-PANE-STD, EXP-STRUCT-1..4 | Inspect explanation structure | Mandatory section order and heading hierarchy are exact | Explanation HTML proof |
| NEW-D2 | P0 | EXP-SUM-2, EXP-RES-4 | Validate dynamic content | Summary and result tables reflect real calculator inputs/outputs | Runtime output capture |
| NEW-D3 | P0 | EXP-FAQ-1 | FAQ count check | Exactly 10 FAQs exist for calculator route | DOM count evidence |

## Group E - SEO P1/P2/P5 + P3 Waiver Handling

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-E1 | P0 | SEO-P1 | Execute SEO P1 checks | Title, meta description, canonical, H1, lang, viewport, robots pass | SEO E2E output |
| NEW-E2 | P0 | SEO-P2, UNIVERSAL_REQUIREMENTS.md (Three-Place Check) | Execute static/schema checks | Required JSON-LD present in static HTML and validated | Source + schema validation output |
| NEW-E3 | P0 | SEO-P5, DOC-SITEMAP-* | Execute crawl/indexing checks | Sitemap + robots + canonical governance pass | SEO tracker evidence |
| NEW-E4 | P1 | SEO-P3 waiver policy | Attempt Lighthouse and record outcome | P3 is PASS or WAIVED only with policy-compliant evidence | Lighthouse output or waiver evidence |

## Group F - Schema Contract (Calculator Page)

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-F1 | P0 | SEO-P2 required schema | Validate type presence | WebPage, SoftwareApplication, BreadcrumbList, FAQPage (as required) present | Schema report |
| NEW-F2 | P0 | SEO-P2 SoftwareApplication cardinality | Validate schema cardinality | Exactly one SoftwareApplication block for route | Schema report |
| NEW-F3 | P0 | SEO-P2 FAQ parity | Compare FAQ text sources | FAQ content/count matches visible HTML, static JSON-LD, and module metadata | Parity evidence |

## Group G - Navigation, Sitemap, and Reachability Gate

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-G1 | P0 | UNAV-HIER-1, DOC-1.4 | Validate navigation integration | Route is reachable through correct category and left-nav placement | Navigation config diff |
| NEW-G2 | P0 | DOC-SITEMAP-1..4 | Validate human sitemap coverage | Route appears in `/sitemap/` and is not omitted from live coverage | Sitemap evidence |
| NEW-G3 | P0 | DOC-SITEMAP-2 | Direct URL check | Public route is reachable and classified as live | Route load evidence |

## Group H - Mandatory Test Minimums

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-H1 | P0 | TEST-1.1, TEST-1.2 | Run unit tests | Compute logic tests pass and satisfy baseline expectations | Unit output |
| NEW-H2 | P0 | UNIVERSAL_REQUIREMENTS.md (change-type matrix) | Run route E2E workflow | Primary calculator user flow passes | E2E output |
| NEW-H3 | P0 | TEST-1.8 | Run FAQ schema guard | Schema guard test passes for route | Vitest output |
| NEW-H4 | P0 | SEO-P1/P2/P5 | Run route SEO tests | Route SEO checks pass for required priorities | SEO E2E output |
| NEW-H5 | P1 | TEST-1.3 | Run ISS-001 when triggered | ISS-001 passes for layout/shell-impacting changes | ISS-001 output |

## Group I - Compliance Tracker Completion

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| NEW-I1 | P0 | WORKFLOW BUILD/TEST | Check build/testing trackers | Build and executed tests are logged with correct IDs/statuses | Tracker row refs |
| NEW-I2 | P0 | WORKFLOW SEO | Check seo tracker | SEO status and evidence are recorded (PASS/WAIVED/NA only per policy) | Tracker row ref |
| NEW-I3 | P0 | WORKFLOW COMPLIANCE | Check compliance report | Exactly one compliance row exists for the REQ and reflects actual execution | Compliance row ref |

## Hard Fail Conditions

Any of the following is an automatic `FAIL`:

- Missing required schema types for calculator page
- Missing sitemap inclusion for a live/public route
- Missing required test evidence for mandatory suites
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

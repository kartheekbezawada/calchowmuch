# Migration Checklist (Legacy Calculator -> New Design System)

## Scope
Applies to existing public calculator routes being migrated from legacy implementation to the current design and compliance baseline.

This checklist is mandatory for migration workstreams and is designed to produce deterministic PASS/FAIL evidence.

## Usage Contract

Required inputs:

- `REQ_ID`
- Route (`/category/calculator-slug/`)
- Source calculator path (legacy implementation)
- Target module paths (HTML, `module.js`, explanation, shared utilities)
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
| MIG-A1 | P0 | AP-2.3 | Compare legacy route behavior to migration scope notes | Baseline inventory exists for inputs, outputs, nav state, SEO metadata, and explanation sections | Migration notes file or REQ section |
| MIG-A2 | P0 | AP-2.3 | Review compute contract before/after | Compute formulas and validation behavior are explicitly marked retained or intentionally changed in REQ | REQ delta section + unit test diff |
| MIG-A3 | P1 | TEST-1.3 | Capture pre-migration UI evidence | Before-state layout/interaction evidence captured for regression comparison | Screenshot links or E2E baseline artifacts |

## Group B - Shell and Routing Integrity (MPA)

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-B1 | P0 | NAV-MPA-1, NAV-MPA-2 | Inspect top-nav/left-nav markup and runtime navigation | Navigation uses static `<a href>` links and full page reloads | Route E2E nav run + HTML snippet |
| MIG-B2 | P0 | NAV-MPA-3 | Search for SPA/router patterns in route scope | No SPA routing libraries or client-side route interception | `rg` output in iteration evidence |
| MIG-B3 | P1 | FS-3.1 | Validate calculator path contract | Route uses expected calculator file/module boundaries | File tree + changed file list |

## Group C - New Design Adoption

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-C1 | P0 | UI-1.1, UNIVERSAL_REQUIREMENTS.md | Inspect page CSS imports/tokens | Premium-dark theme is inherited from shared theme load; no per-page duplicate theme link | HTML head + CSS import evidence |
| MIG-C2 | P0 | UI-2.1, UI-2.3 | Inspect component classes | Shared calculator classes/tokens used for buttons/inputs; labels present | DOM snapshot + CSS class evidence |
| MIG-C3 | P1 | CS-3.1, CS-3.3 | Review CSS ownership | No unnecessary page-local layout duplication when shared styles exist | Changed CSS diff |

## Group D - Interaction Contract

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-D1 | P0 | UI-2.5 | Inspect controls and run route workflow | No `<select>` dropdowns for calculator mode/control patterns | Route E2E + DOM check |
| MIG-D2 | P0 | UI-2.6, ISS-UI-FDP-008 | Run calculate-trigger regression on migrated route | Post-load input edits do not recompute until Calculate click | Route E2E trigger test |
| MIG-D3 | P0 | UI-2.7, ISS-UI-FDP-010 | Validate requirement and implementation for dense/multi-mode routes | Control type, default mode, visibility mapping, and trigger behavior are deterministic and aligned | REQ contract + E2E evidence |
| MIG-D4 | P1 | ISS-UI-FDP-011 | Test Add/Remove row behavior where applicable | Dynamic rows preserve initial row density/layout parity | Route E2E + screenshot evidence |

## Group E - Explanation Pane Standard Compliance

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-E1 | P0 | UI-EXP-PANE-STD, EXP-STRUCT-1..4 | Inspect explanation HTML structure | Required section order and heading hierarchy are correct | Explanation HTML snippet + route E2E |
| MIG-E2 | P0 | EXP-SUM-2, EXP-SCEN-3, EXP-RES-4 | Validate dynamic tokens/results | Summary/tables reference real input/output values (no static placeholder results) | Calculation run capture |
| MIG-E3 | P0 | EXP-FAQ-1 | Count FAQs and compare with schema | Exactly 10 FAQs rendered for calculator route | DOM check + schema guard evidence |

## Group F - SEO / Schema / Static HTML

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-F1 | P0 | SEO-P1.8 | View raw HTML source | Static robots meta exists: `index,follow` | Source capture or SEO E2E |
| MIG-F2 | P0 | SEO-P1.3 | Validate canonical tag | Canonical exists once, absolute, production domain | SEO E2E output |
| MIG-F3 | P0 | SEO-P1.4 | Heading audit | Exactly one H1 on route | SEO E2E output |
| MIG-F4 | P0 | SEO-P2.6, SEO-P2.7 | Validate JSON-LD types | WebPage, SoftwareApplication, BreadcrumbList, FAQPage (when required) present and valid | Schema guard + SEO E2E |
| MIG-F5 | P0 | UNIVERSAL_REQUIREMENTS.md (Three-Place Check + FAQ parity) | Cross-compare FAQ/body/module schema | FAQ text/count parity across visible HTML, static JSON-LD, module metadata | Schema parity evidence |

## Group G - Sitemap and Navigation Coverage

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-G1 | P0 | DOC-SITEMAP-2, DOC-SITEMAP-5 | Confirm public reachability and REQ acceptance criteria | Route is explicitly marked live/reachable and REQ includes sitemap acceptance criterion | REQ + nav config evidence |
| MIG-G2 | P0 | DOC-SITEMAP-1, DOC-SITEMAP-4 | Verify `/sitemap/` coverage | Migrated route appears in human-readable sitemap | Sitemap E2E or HTML proof |
| MIG-G3 | P1 | SEO-P5-SITEMAP | Validate XML sitemap + robots linkage | `sitemap.xml` contains route and remains crawlable | XML and robots validation evidence |

## Group H - Test Evidence Minimums

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-H1 | P0 | TEST-1.1, TEST-1.2 | Execute required unit tests when compute changes exist | Required unit tests pass for changed logic | Test command output |
| MIG-H2 | P0 | UNIVERSAL_REQUIREMENTS.md (change-type matrix) | Execute route-scoped E2E workflow | Route E2E passes for affected user flows | E2E run output |
| MIG-H3 | P0 | TEST-1.8, SEO-P1/P2/P5 | Execute schema guard + SEO checks | Schema guard and route SEO validations pass | Vitest + SEO E2E output |
| MIG-H4 | P1 | TEST-1.3 | Run ISS-001 when layout/shell changes are in scope | ISS-001 passes when triggered | `npm run test:iss001` evidence |
| MIG-H5 | P0 | WORKFLOW trigger gate + UNIVERSAL_REQUIREMENTS.md | Run button-only trigger regression when Finance/Percentage scope applies | Trigger regression spec passes when applicable | `button-only-recalc-finance-percentage.spec.js` output |

## Group I - Compliance Artifact Completion

| Check ID | Severity | Source Rule(s) | Verification Method | Pass Criteria | Evidence Artifact |
| --- | --- | --- | --- | --- | --- |
| MIG-I1 | P0 | WORKFLOW BUILD/TEST | Check `build_tracker.md` and `testing_tracker.md` | Build and required tests are recorded with correct IDs/statuses | Tracker row references |
| MIG-I2 | P0 | WORKFLOW SEO | Check `seo_tracker.md` | SEO status is PASS/WAIVED/NA with required evidence | Tracker row reference |
| MIG-I3 | P0 | WORKFLOW COMPLIANCE | Check `compliance-report.md` | Exactly one compliance row exists for REQ and reflects executed evidence | Compliance row reference |
| MIG-I4 | P1 | AP-2.3 | Check iteration log traceability | Iteration log captures commands, outcomes, and blocking issues | Iteration file reference |

## Hard Fail Conditions

Any of the following is an automatic `FAIL`:

- Missing sitemap coverage for a live/public route (`DOC-SITEMAP-*`)
- Any unresolved P0 violation in this checklist
- Missing required evidence artifact for a required gate

## Completion Block (Required)

- Migration Verdict: `PASS | FAIL`
- Blocking Issues:
- REQ_ID:
- ITER_ID:
- Reviewer:
- Date (YYYY-MM-DD):
- Evidence Index:

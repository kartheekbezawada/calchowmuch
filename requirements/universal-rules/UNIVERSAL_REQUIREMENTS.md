# Universal Requirements — Single Source of Truth

## Document Metadata

| Field | Value |
| --- | --- |
| Status | Authoritative (sole active governance file) |
| Scope | All public routes, calculator modules, shared shell, SEO/testing/release gates |
| Canonical Path | `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md` |
| Version | 3.3 (AdSense governance + controlled ad-slot standard + mobile nav requirements) |
| Last Updated | 2026-02-13 |

This is the only active governance file under `requirements/universal-rules/`.
All previously separate rule modules are merged here and re-numbered with the `UR-*` scheme.

---

## 0) Document Control

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-DC-001 | This file is the single source of truth for universal governance. | P0 |
| UR-DC-002 | Rules apply to all calculator/public-route work unless explicitly scoped as excluded. | P0 |
| UR-DC-003 | Rule IDs are mandatory in reviews, trackers, issues, and compliance evidence. | P1 |
| UR-DC-004 | If older docs conflict, this file governs. | P0 |

---

### 1) FSM and State Machine (Merged Workflow)

#### 1.1 FSM Model

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-FSM-001 | Required state flow is `REQ -> BUILD -> TEST -> SEO -> COMPLIANCE -> COMPLETE`. | P0 |
| UR-FSM-002 | Invalid transitions must stop immediately. | P0 |
| UR-FSM-003 | One active iteration file per build start event. | P0 |
| UR-FSM-004 | Max iterations per build session is 25; limit breach must transition to ISSUE. | P0 |

### 1.2 Build Trigger and Session Start

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-FSM-010 | BUILD starts only with human trigger: `EVT_START_BUILD REQ-YYYYMMDD-###` unless ADMIN override is active. | P0 |
| UR-FSM-011 | BUILD must create/use exactly one ITER log and corresponding BUILD row. | P0 |
| UR-FSM-012 | Build gates include lint/compile sanity before progressing to test execution. | P0 |

### 1.3 Auto-Test Mode

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-FSM-020 | After BUILD PASS, required tests must start immediately without extra human confirmation. | P0 |
| UR-FSM-021 | During BUILD in Auto-Test Mode, writing `testing_tracker.md` is allowed for executed tests. | P0 |
| UR-FSM-022 | TEST FAIL returns to BUILD; TEST PASS advances to SEO or COMPLIANCE as applicable. | P0 |

### 1.4 SEO and Compliance Gates

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-FSM-030 | SEO gate is required for all calculator/public-route-impacting changes. | P0 |
| UR-FSM-031 | COMPLIANCE PASS requires BUILD PASS, TEST PASS, and SEO PASS/WAIVED/NA per policy. | P0 |
| UR-FSM-032 | Exactly one compliance row per REQ is required for completion. | P0 |
| UR-FSM-033 | No merge/release without COMPLIANCE PASS. | P0 |

### 1.5 Allowed Files by State

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-FSM-040 | REQ state scope: AGENTS + this file + active requirement row(s). | P0 |
| UR-FSM-041 | BUILD state scope: REQ scope + build tracker + active iter + affected implementation/test files. | P0 |
| UR-FSM-042 | TEST state scope: BUILD scope + testing tracker + required test artifacts. | P0 |
| UR-FSM-043 | SEO state scope: TEST scope + seo tracker + affected SEO artifacts. | P0 |
| UR-FSM-044 | COMPLIANCE state scope: prior scope + compliance report row update. | P0 |

### 1.6 Deterministic IDs

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-FSM-050 | ID patterns are mandatory: `REQ-*`, `BUILD-*`, `TEST-*`, `ITER-*`, `ISSUE-*`; IDs must be unique and never reused. | P0 |

---

## 2) Authority and Precedence

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-AP-001 | AGENTS contract and this document are authoritative law. | P0 |
| UR-AP-002 | This document governs implementation standards; AGENTS governs operating contract/roles/override semantics. | P0 |
| UR-AP-003 | Tracker and documentation updates must reflect repository truth. | P1 |

---

## 3) MPA Navigation and Architecture

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-NAV-001 | Calculator navigation must use static `<a href>` links and full page reloads. | P0 |
| UR-NAV-002 | SPA routing for calculator navigation is not allowed. | P0 |
| UR-NAV-003 | Navigation hierarchy must align with `requirements/site-structure/calculator-hierarchy.md`. | P0 |
| UR-NAV-004 | Live calculators must exist in `public/config/navigation.json` for nav visibility. | P0 |
| UR-NAV-005 | Layout shell owns shared regions; calculator-specific compute logic must stay in calculator modules. | P0 |
| UR-NAV-006 | Shared utility logic belongs in `/public/assets/js/core/`; avoid duplication in route modules. | P1 |

### 3.1 Excluded Page Types (GTEP)

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-NAV-020 | GTEP pages are standalone HTML and must not use calculator shell panes. | P0 |
| UR-NAV-021 | GTEP pages must not load calculator-specific JS modules. | P0 |
| UR-NAV-022 | GTEP pages must remain crawlable with lightweight header/footer patterns. | P0 |

### 3.2 Mobile Responsiveness and Navigation
| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-NAV-025 | Mobile navigation (< 860px) must use a hamburger menu pattern with a slide-out drawer or overlay. | P0 |
| UR-NAV-026 | The mobile menu toggle must be accessible in the top header and visible on all mobile pages. | P0 |
| UR-NAV-027 | The left navigation sidebar must be hidden by default on mobile and only appear when toggled. | P0 |
| UR-NAV-028 | Opening the mobile menu must add a backdrop that closes the menu when clicked (click-outside behavior). | P0 |

### 3.3 Route Archetype and Metadata Contract

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-NAV-030 | Every calculator route entry in `public/config/navigation.json` must declare `routeArchetype`, `designFamily`, and `paneLayout`. | P0 |
| UR-NAV-031 | Allowed `routeArchetype` values are `calc_exp`, `calc_only`, `exp_only`, `content_shell`. | P0 |
| UR-NAV-032 | Allowed `designFamily` values are `home-loan`, `auto-loans`, `credit-cards`, `neutral`. | P0 |
| UR-NAV-033 | Pane omission is legal only when archetype explicitly omits that pane and the REQ states omission rationale and replacement content contract. | P0 |
| UR-NAV-034 | Legacy routes missing metadata must default to `routeArchetype=calc_exp` and inferred `designFamily` without breaking existing pages. | P0 |
| UR-NAV-035 | Page generation must emit `data-route-archetype` and `data-design-family` on `<body>`. | P0 |
| UR-NAV-036 | Fragment loading is archetype-bound: `calc_exp` requires `index.html` + `explanation.html`; `calc_only` requires `index.html`; `exp_only` requires `explanation.html`; `content_shell` requires `content.html`. | P0 |

### 3.4 Archetype Behavior Matrix

| Archetype | Calculation Pane | Explanation Pane | Allowed `paneLayout` |
| --- | --- | --- | --- |
| `calc_exp` | Required | Required | `single` or `split` |
| `calc_only` | Required | Omitted | `single` |
| `exp_only` | Omitted | Required | `single` |
| `content_shell` | Omitted | Omitted | `single` |

---

## 4) Theme and UI Core

### 4.1 Theme Tokens and Defaults

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-UI-001 | Premium-dark is the global default theme for shell/content/calculator surfaces. | P0 |
| UR-UI-002 | Shared theme tokens are mandatory; ad-hoc route palettes are not allowed. | P0 |
| UR-UI-003 | Theme is loaded once globally via shared base stylesheet; per-page duplicate theme link tags are disallowed. | P0 |

### 4.2 Component and Input Rules

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-UI-010 | Shared `.calculator-button` styles are mandatory for primary/secondary actions. | P0 |
| UR-UI-011 | Inputs must have labels and deterministic validation. | P0 |
| UR-UI-012 | Control dropdowns (`<select>`) are disallowed for calculator mode interactions. | P0 |
| UR-UI-013 | Input values are constrained to 12 characters (via `maxlength` or JS validation by input type). | P1 |

### 4.3 Trigger and Dense-Form Contract

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-UI-020 | Button-only calculate behavior is mandatory after page-load baseline for calculators with explicit Calculate CTA. | P0 |
| UR-UI-021 | Input edits/mode toggles/add-remove rows may change state/visibility but must not recompute before Calculate click. | P0 |
| UR-UI-022 | Dense/multi-mode calculators require explicit mode control type, default mode, visibility mapping, and dynamic-row parity. | P0 |

### 4.4 New Design Philosophy and Design Families

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-UI-030 | New design philosophy is mandatory: high-impact visual identity, simple interaction model, smooth motion, and glassmorphism-like depth via shared tokens/components. | P0 |
| UR-UI-031 | `designFamily` controls accent style and micro-visual language, while shared shell structure and usability standards remain unchanged. | P0 |
| UR-UI-032 | Family-level styling must be token-driven; route CSS must not hardcode conflicting palette systems that bypass shared tokens. | P0 |
| UR-UI-033 | `home-loan`, `auto-loans`, and `credit-cards` families may vary accent and card treatments, but must preserve accessibility, readability, and deterministic layout behavior. | P0 |
| UR-UI-034 | New or migrated routes must provide desktop and mobile screenshot evidence showing design-family compliance. | P1 |
| UR-UI-035 | Design-family evidence must include token/class proof plus screenshot references in iteration/compliance artifacts. | P1 |
| UR-UI-036 | Design family must not change MPA behavior, semantic landmarks, or required keyboard/focus behavior. | P0 |

---

## 5) Calculation Pane Contract

Applicability: applies only to archetypes that include a calculation pane (`calc_exp`, `calc_only`).

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-CALC-001 | Core required inputs must be accessible without mandatory pane scroll. | P0 |
| UR-CALC-002 | Optional inputs must not block primary calculation completion. | P0 |
| UR-CALC-003 | Progressive disclosure is required when input density exceeds comfortable first-view bounds. | P0 |
| UR-CALC-004 | Density optimizations must preserve clarity, labels, and touch usability. | P0 |
| UR-CALC-005 | Interaction must not cause unstable row shifts in core input region. | P0 |
| UR-CALC-006 | Dynamic Add/Remove rows must preserve initial row structure parity. | P1 |
| UR-CALC-007 | Calculation pane updates must satisfy ISS layout stability requirements when triggered by change type. | P1 |

---

## 6) Explanation Pane Contract

Applicability: applies only to archetypes that include an explanation pane (`calc_exp`, `exp_only`).

### 6.1 Mandatory Structure

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-EXP-001 | Explanation section order is fixed: H2 Summary, H3 Scenario Summary, H3 Results Table, H3 Explanation, H3 FAQ. | P0 |
| UR-EXP-002 | Only one H2 in explanation pane; all other pane section headings are H3. | P0 |
| UR-EXP-003 | No extra heading levels/sections inside explanation pane unless explicitly approved by requirement. | P0 |

### 6.2 Dynamic Content and FAQ

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-EXP-010 | Summary must be dynamic and reference meaningful inputs and outputs. | P0 |
| UR-EXP-011 | Scenario and result tables must be output-driven, not static placeholders. | P0 |
| UR-EXP-012 | Default FAQ baseline is 10 items for calculator explanation panes unless REQ explicitly scopes otherwise. | P0 |
| UR-EXP-013 | FAQ layout and text parity requirements must align with schema and visible content. | P0 |

### 6.3 Table Baseline

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-EXP-020 | Explanation tables must use semantic HTML (`table/thead/tbody/tfoot`) and full grid consistency. | P0 |
| UR-EXP-021 | Table styling must remain within shared theme/table standards; route-specific conflicting border systems are disallowed. | P0 |

---

## 7) SEO Governance (P1-P5)

### 7.1 P1 Critical SEO

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-SEO-001 | Unique title (35-61 chars proxy), unique meta description (110-165 chars proxy), exactly one H1, canonical, viewport, lang, robots are mandatory. | P0 |
| UR-SEO-002 | Robots tag must exist in static HTML source: `<meta name="robots" content="index,follow">`. | P0 |
| UR-SEO-003 | Canonical must be absolute and use production canonical domain. | P0 |

### 7.2 P2 Structured Data and Social

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-SEO-010 | Schema set is archetype-aware: calculator routes require WebPage + SoftwareApplication + BreadcrumbList; FAQPage is required only when visible FAQs exist on the route. | P0 |
| UR-SEO-011 | FAQ three-place schema check is mandatory when FAQPage is required: static HTML JSON-LD, module metadata parity, and visible FAQ parity. | P0 |
| UR-SEO-012 | Missing required schema type, required FAQ parity mismatch, or invalid JSON-LD is a FAIL. | P0 |

### 7.3 P3/P4/P5 Governance

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-SEO-020 | P3 performance checks must be attempted for applicable changes; WAIVED allowed only under documented policy evidence. | P1 |
| UR-SEO-021 | P4 accessibility/SEO overlap checks are mandatory where matrix requires. | P1 |
| UR-SEO-022 | P5 infrastructure checks include sitemap/robots/canonical domain governance and redirect hygiene. | P0 |

### 7.4 Deterministic PASS/FAIL

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-SEO-030 | Required priority failure or missing required evidence is overall SEO FAIL. | P0 |
| UR-SEO-031 | SEO results must be recorded in `requirements/compliance/seo_tracker.md`. | P0 |

---

## 8) Testing Governance

### 8.1 Canonical Suites and Commands

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-TEST-001 | Unit tests: `npm run test`. | P0 |
| UR-TEST-002 | E2E tests: `npm run test:e2e` (scope by affected routes). | P0 |
| UR-TEST-003 | ISS-001 stability: `npm run test:iss001` when layout/shell impacted. | P1 |
| UR-TEST-004 | FAQ schema guard must run for calculator builds where applicable. | P0 |
| UR-TEST-005 | Global CWV guard must run before calculator/public-route releases: `npm run test:cwv:all` (or `npm run test:cls:all` alias). Any route check above CLS 0.10, single-shift 0.05, LCP 2500ms, or INP proxy 200ms is TEST FAIL. | P0 |
| UR-TEST-006 | CWV guard evidence artifact is mandatory at `test-results/performance/cls-guard-all-calculators.json` and must include normal + stress mode results. | P0 |

### 8.2 Change-Type Matrix

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-TEST-010 | New calculator requires unit + route E2E + SEO checks + schema guard (+ ISS-001 when layout touched). | P0 |
| UR-TEST-011 | Compute-only change requires unit coverage; E2E optional unless flow/UI changed. | P1 |
| UR-TEST-012 | Navigation/shell change requires targeted nav E2E and ISS-001. | P0 |
| UR-TEST-013 | Finance/Percentage trigger behavior changes require button-only regression spec evidence. | P0 |
| UR-TEST-014 | Any release touching calculator/public routes must include all-calculator CWV guard evidence artifact from `test-results/performance/cls-guard-all-calculators.json`. | P0 |

### 8.3 Evidence Recording

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-TEST-020 | Test execution evidence must be recorded in `testing_tracker.md` and iteration logs. | P0 |
| UR-TEST-021 | Required-vs-executed coverage must be reflected in `compliance-report.md`. | P0 |

### 8.4 Archetype Test Matrix

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-TEST-030 | `calc_exp` routes require calc-flow E2E, explanation/FAQ assertions, SEO E2E, schema guard, and unit tests as applicable. | P0 |
| UR-TEST-031 | `calc_only` routes require calc-flow E2E, trigger contract checks, SEO/schema checks; explanation-pane tests must be marked `N/A` with rationale. | P0 |
| UR-TEST-032 | `exp_only` routes require explanation-content assertions, SEO/schema checks; calculation-pane tests must be marked `N/A` with rationale. | P0 |
| UR-TEST-033 | `content_shell` routes require shell/nav/search/SEO/sitemap assertions; calc/exp pane tests must be marked `N/A` with rationale. | P0 |
| UR-TEST-034 | Any archetype that changes shell/layout dimensions must run ISS-001. | P1 |
| UR-TEST-035 | Archetype compliance E2E must assert body metadata (`data-route-archetype`, `data-design-family`) and pane presence/absence parity. | P0 |

---

## 9) Header Contract

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-HDR-001 | Header must use semantic `<header role="banner">` above shell regions. | P0 |
| UR-HDR-002 | Site title must link to root `/` and match canonical copy. | P0 |
| UR-HDR-003 | Primary nav actions use static anchors and full reload behavior. | P0 |
| UR-HDR-004 | Header search behavior must not auto-navigate on typing; deterministic filtering behavior only. | P0 |
| UR-HDR-005 | Header must remain token-driven and preserve fixed shell height constraints. | P1 |

---

## 10) Footer Contract

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-FTR-001 | Footer uses semantic `<footer role="contentinfo">`. | P0 |
| UR-FTR-002 | Footer includes canonical legal links (Privacy, Terms, Contact, FAQs, Sitemap) with static anchors. | P0 |
| UR-FTR-003 | Footer must not create JS-driven nav duplication or additional panes. | P0 |
| UR-FTR-004 | Footer links must appear on sitemap-covered routes and remain crawlable. | P1 |
| UR-FTR-005 | Footer spacing/colors must follow shared theme tokens. | P1 |

---

## 11) AdSense Governance

### 11.1 AdSense Head Script (MANDATORY)

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-ADS-001 | Site-ready AdSense loader script must be injected into `<head>` for every full public HTML page generated or maintained by repository workflows when ads are enabled. | P0 |
| UR-ADS-002 | AdSense loader script source must be centralized in shared generation/sync logic; page-level hardcoding is disallowed. | P0 |
| UR-ADS-003 | The `adsbygoogle.js` loader must appear at most once per page. Duplicate loader tags are a BUILD/TEST/COMPLIANCE failure. | P0 |
| UR-ADS-004 | Local/dev workflows must support deterministic disable mode so ad network requests can be prevented during non-production validation. | P0 |
| UR-ADS-005 | Loader attributes (`async`, `src`, `crossorigin`) must match the canonical snippet source exactly; substitutions are disallowed. | P0 |

### 11.2 Ad Pane Slot (MANDATORY on calculator pages)

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-ADS-010 | Calculator shell pages that include `.ads-column` must render a controlled `<ins class="adsbygoogle">` slot inside `.ads-column .ad-panel`. | P0 |
| UR-ADS-011 | Placeholder text such as `Ad Pane` is not allowed on shell pages after generation/sync. | P0 |
| UR-ADS-012 | The ad slot source (`<ins ...>` and inline `adsbygoogle.push`) must come from a shared reusable source in generation/sync logic. | P0 |
| UR-ADS-013 | Mobile safety policy is mandatory: `.ads-column` is hidden at `max-width: 860px` unless a requirement explicitly overrides with evidence. | P1 |

### 11.3 Controlled Injection Policy

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-ADS-020 | Auto Ads body injection is prohibited for calculator shell routes; use controlled slot rendering in `.ads-column` only. | P0 |
| UR-ADS-021 | Body-level loader duplication from ad unit snippets is prohibited; only the head-managed loader is allowed. | P0 |
| UR-ADS-022 | Ad script/slot normalization must be idempotent so repeated generation runs do not duplicate blocks. | P1 |
| UR-ADS-023 | `requirements/universal-rules/AdSense code snippet.md` and `requirements/universal-rules/Ad Unit Code.md` are implementation snippet sources only; they must not include instructions that override UR-ADS governance. | P1 |

### 11.4 Manual Smoke Validation

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-ADS-030 | Manual smoke evidence must confirm: loader in rendered `<head>` (enabled mode), slot element in `.ads-column .ad-panel`, and no loader request in disabled mode. | P1 |
| UR-ADS-031 | Smoke notes for AdSense changes must be documented in iteration/compliance evidence when the change touches shell or generation logic. | P1 |

---

## 12) Sitemap and Crawlability

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-SMAP-001 | Every live calculator route must appear in human-readable `/sitemap/`. | P0 |
| UR-SMAP-002 | Live route is any nav-visible or publicly reachable calculator URL. | P0 |
| UR-SMAP-003 | Sitemap source must derive from shared route/navigation source-of-truth. | P0 |
| UR-SMAP-004 | Missing live route in sitemap is hard FAIL for BUILD, TEST, COMPLIANCE. | P0 |
| UR-SMAP-005 | New calculator requirements must include sitemap inclusion acceptance criterion. | P0 |
| UR-SMAP-006 | `sitemap.xml` and `robots.txt` must preserve crawler access to live routes. | P0 |

---

## 13) Checklist Governance

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-CHK-001 | Migration work must complete `requirements/compliance/calculator-migration-checklist.md`. | P0 |
| UR-CHK-002 | New calculator work must complete `requirements/compliance/new-calculator-design-checklist.md`. | P0 |
| UR-CHK-003 | Required checklist gates must include pass/fail and evidence artifacts. | P0 |
| UR-CHK-004 | Missing required checklist evidence is a compliance failure. | P0 |
| UR-CHK-005 | Missing archetype/design-family declaration evidence, pane omission rationale, or required screenshot evidence is a compliance failure. | P0 |

---

## 14) Never-Do Rules

| Rule ID | Never Do This | Severity |
| --- | --- | --- |
| UR-NEVER-001 | Bypass required state gates and mark work complete anyway. | P0 |
| UR-NEVER-002 | Merge/release with unresolved P0 governance violations. | P0 |
| UR-NEVER-003 | Introduce SPA routing for calculator navigation. | P0 |
| UR-NEVER-004 | Reintroduce calculator shell into GTEP pages. | P0 |
| UR-NEVER-005 | Omit required tracker/compliance evidence for mandatory gates. | P0 |
| UR-NEVER-006 | Commit machine-specific cache/profile/path artifacts in tracked governance files. | P0 |

---

## 15) Definition of Done

| Rule ID | Criterion | Required |
| --- | --- | --- |
| UR-DOD-001 | Scope implemented and behavior aligned with this document. | Yes |
| UR-DOD-002 | Required tests executed and recorded. | Yes |
| UR-DOD-003 | SEO gate result valid (PASS/WAIVED/NA per policy) with evidence. | Yes |
| UR-DOD-004 | Required checklists completed with evidence. | Yes |
| UR-DOD-005 | Compliance report row finalized and consistent with executed evidence. | Yes |

---

## 16) Maintenance Protocol

| Rule ID | Requirement | Severity |
| --- | --- | --- |
| UR-MAINT-001 | New universal rules must be added only in this file; no new standalone universal rule files. | P0 |
| UR-MAINT-002 | New rules must receive next available `UR-<SECTION>-<NNN>` ID in section order. | P1 |
| UR-MAINT-003 | Any rule rename/re-number requires compatibility map update in this document. | P0 |
| UR-MAINT-004 | Deprecated/legacy references must be resolved in the same change that introduces new canonical guidance. | P1 |

---

## 17) Compatibility and Migration Map

### 17.1 Source Files Merged

- `requirements/universal-rules/WORKFLOW.md`
- `requirements/universal-rules/SEO_RULES.md`
- `requirements/universal-rules/TESTING_RULES.md`
- `requirements/universal-rules/THEME_RULES.md`
- `requirements/universal-rules/HEADER_RULES.md`
- `requirements/universal-rules/FOOTER_RULES.md`
- `requirements/universal-rules/calculation_pane_rules.md`
- `requirements/universal-rules/explanation_pane_standard.md`

### 17.2 Rule Family Mapping

| Old Rule ID / Family | New Rule ID Range | Source File | Semantic Status |
| --- | --- | --- | --- |
| DC-0.* | UR-DC-001..004 | UNIVERSAL_REQUIREMENTS.md (previous) | unchanged |
| AP-2.* | UR-AP-001..003 | UNIVERSAL_REQUIREMENTS.md (previous) | unchanged |
| NAV-MPA-* | UR-NAV-001..003 | UNIVERSAL_REQUIREMENTS.md (previous) | unchanged |
| EXCL-1.* | UR-NAV-020..022 | UNIVERSAL_REQUIREMENTS.md (previous) | merged |
| Route metadata/archetype governance | UR-NAV-030..036 | consolidated universal model | new |
| UI-2.5 / UI-2.6 / UI-2.7 | UR-UI-012 / UR-UI-020 / UR-UI-022 | UNIVERSAL + THEME + CALC sources | unchanged/tightened |
| New design-family governance | UR-UI-030..036 | consolidated universal model | new |
| UUI-FDP-* + ISS-UI-FDP-* | UR-CALC-001..007 + UR-UI-020..022 | calculation_pane_rules.md | conditionalized/tightened |
| EXP-* + UTBL-* (explanation scope) | UR-EXP-001..021 | explanation_pane_standard.md | conditionalized/tightened |
| P1.*..P5.* (SEO families) | UR-SEO-001..031 | SEO_RULES.md | merged/tightened |
| TEST-1.* and matrix rules | UR-TEST-001..035 | TESTING_RULES.md | merged/tightened |
| HDR-* | UR-HDR-001..005 | HEADER_RULES.md | merged |
| FTR-* | UR-FTR-001..005 | FOOTER_RULES.md | merged |
| ADS / monetization slot governance | UR-ADS-001..031 | AdSense snippet policy + shell ad slot governance | new |
| DOC-SITEMAP-* | UR-SMAP-001..006 | UNIVERSAL + FOOTER + SEO sources | unchanged/tightened |
| CHK-* | UR-CHK-001..005 | universal/checklist governance | tightened |
| NEVER-* | UR-NEVER-001..006 | UNIVERSAL_REQUIREMENTS.md (previous) | merged |
| DOD-* | UR-DOD-001..005 | UNIVERSAL_REQUIREMENTS.md (previous) | merged |

### 17.3 Legacy Reference Policy

- Legacy rule IDs may appear in historical REQs/tests/tracker logs.
- New work must cite only `UR-*` IDs.
- Any active non-archive document referencing removed standalone rule files must be updated to this file.

### 17.4 Migration Report Entry

| Field | Value |
| --- | --- |
| Migration Date | 2026-02-12 |
| Change Type | Universal governance consolidation + archetype/design-family contract |
| Legacy Files Moved | `WORKFLOW.md`, `SEO_RULES.md`, `TESTING_RULES.md`, `THEME_RULES.md`, `HEADER_RULES.md`, `FOOTER_RULES.md`, `calculation_pane_rules.md`, `explanation_pane_standard.md` -> `requirements/Archive/universal-rules/` |
| Rule ID Transition | Legacy families remapped to `UR-*` scheme per section 17.2; `UR-CALC-*` and `UR-EXP-*` applicability is now archetype-bound |
| Active Governance File | `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md` |

---

## 18) Reference Pointers

- Site copy: `requirements/site-structure/SITE_COPY.md`
- Navigation hierarchy: `requirements/site-structure/calculator-hierarchy.md`
- Compliance trackers: `requirements/compliance/`
- MPA generator: `scripts/generate-mpa-pages.js`

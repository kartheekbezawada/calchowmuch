# Universal Requirements — Single Source of Truth

## Document Metadata

- **Status:** Authoritative (sole active governance file)
- **Scope:** All public routes, calculator modules, shared shell, SEO/testing/release gates
- **Canonical Path:** `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md`
- **Version:** 4.0 (Cluster + calculator scoped test isolation governance)
- **Last Updated:** 2026-02-18

This is the only active governance file under `requirements/universal-rules/`. All previously separate rule modules are merged here and re-numbered with the `UR-*` scheme.

---

## 0) Document Control

- **UR-DC-001 (P0):** This file is the single source of truth for universal governance.
- **UR-DC-002 (P0):** Rules apply to all calculator/public-route work unless explicitly scoped as excluded.
- **UR-DC-003 (P1):** Rule IDs are mandatory in reviews, trackers, issues, and compliance evidence.
- **UR-DC-004 (P0):** If older docs conflict, this file governs.

---

## 1) Factory Pipeline (Simplified Workflow)

### 1.1 Core Pipeline

- **UR-FLOW-001 (P0):** Architecture is a linear pipeline: `REQUIREMENT -> BUILD -> RELEASE CHECKLIST -> RELEASE SIGN-OFF -> READY`.
- **UR-FLOW-002 (P0):** The complex FSM (`REQ->BUILD->TEST->SEO->COMPLIANCE`) is deprecated.
- **UR-FLOW-003 (P0):** Human provides requirement; Agent performs Build -> Checklist -> Sign-off; Human merges.
- **UR-FLOW-004 (P0):** Visual workflow definitions are in `WORKFLOW_DIAGRAMS.md`.

### 1.2 Step Definitions

- **UR-FLOW-010 (P0): Build:** Implement code, sitemap coverage, local verification.
- **UR-FLOW-011 (P0): Release Checklist:** Execute ALL gates (`lint`, `unit`, `e2e`, `cwv:all`, `iss-001`) per `RELEASE_CHECKLIST.md`.
- **UR-FLOW-012 (P0): Release Sign-off:** Create `release-signoffs/RELEASE_SIGNOFF_{ID}.md` and update Master Table per `RELEASE_SIGNOFF.md`.
- **UR-FLOW-013 (P0): Ready:** Agent confirms "Ready to merge". Agent does NOT merge.

### 1.3 ADMIN Override

- **UR-FLOW-020 (P0):** Keyword `ADMIN` in message supersedes all workflow constraints.
- **UR-FLOW-021 (P0):** ADMIN mode skips gates but must not violate platform safety/security.

---

## 2) Authority and Precedence

- **UR-AP-001 (P0):** AGENTS contract and this document are authoritative law.
- **UR-AP-002 (P0):** This document governs implementation standards; AGENTS governs operating contract/roles/override semantics.
- **UR-AP-003 (P1):** Tracker and documentation updates must reflect repository truth.

### 2.1 Scope Contract Protocol (Agent/Copilot Mandatory)

- **UR-SCOPE-001 (P0):** Before any implementation, any Agent/Copilot must publish a Scope Contract for the current task.
- **UR-SCOPE-002 (P0):** Scope Contract must include all of the following:
  - Target calculator(s) and route(s)
  - Allowed file list (explicit paths)
  - Forbidden file list (explicit paths or prefixes)
  - Allowed commands
  - Forbidden commands
  - Exact stop rule for out-of-scope requirements
- **UR-SCOPE-003 (P0):** Agent/Copilot must not edit files until HUMAN explicitly approves the declared Scope Contract.
- **UR-SCOPE-004 (P0):** If implementation requires any file/command outside approved scope, Agent/Copilot must stop and request explicit approval before proceeding.
- **UR-SCOPE-005 (P0):** Silent scope expansion is prohibited.
- **UR-SCOPE-006 (P0):** If a scope violation occurs, Agent/Copilot must stop immediately, revert its own out-of-scope edits, and report root cause + corrective action.
- **UR-SCOPE-007 (P0):** Shared/core files (for example shell, shared CSS/JS, generators, manifests) are treated as forbidden by default unless explicitly listed as allowed in the approved Scope Contract.
- **UR-SCOPE-008 (P0):** Release evidence must include the approved scope statement and any approved scope-change deltas.

---

## 3) MPA Navigation and Architecture

- **UR-NAV-001 (P0):** Calculator navigation must use static `<a href>` links and full page reloads.
- **UR-NAV-002 (P0):** SPA routing for calculator navigation is not allowed.
- **UR-NAV-003 (P0):** Navigation hierarchy must align with `requirements/site-structure/calculator-hierarchy.md`.
- **UR-NAV-004 (P0):** Live calculators must exist in a governed navigation source for nav visibility. Legacy shared source `public/config/navigation.json` is superseded by cluster-local navigation contracts under `UR-CLUSTER-010`.
- **UR-NAV-005 (P0):** Layout shell ownership is cluster-scoped for isolated routes (`UR-CLUSTER-001`, `UR-CLUSTER-007`). Shared shell ownership applies only to legacy non-migrated routes.
- **UR-NAV-006 (P1):** Shared utility logic under `/public/assets/js/core/` is superseded for isolated routes by cluster-owned runtime logic plus immutable core constraints (`UR-CLUSTER-006`, `UR-CLUSTER-010`).

### 3.1 Excluded Page Types (GTEP)

- **UR-NAV-020 (P0):** GTEP pages are standalone HTML and must not use calculator shell panes.
- **UR-NAV-021 (P0):** GTEP pages must not load calculator-specific JS modules.
- **UR-NAV-022 (P0):** GTEP pages must remain crawlable with lightweight header/footer patterns.
- **UR-NAV-023 (P0):** GTEP included routes are `/sitemap/`, `/privacy/`, `/terms-and-conditions/`, `/contact-us/`, `/faqs/`; these routes are explicitly excluded from calculator-shell requirements.
- **UR-NAV-024 (P0):** GTEP pages must use single-column content-first layout with no top category nav, no left nav, no calc pane, no explanation pane, and no ad pane.

### 3.2 Mobile Responsiveness and Navigation

- **UR-NAV-025 (P0):** Mobile navigation (< 860px) must use a hamburger menu pattern with a slide-out drawer or overlay.
- **UR-NAV-026 (P0):** The mobile menu toggle must be accessible in the top header and visible on all mobile pages.
- **UR-NAV-027 (P0):** The left navigation sidebar must be hidden by default on mobile and only appear when toggled.
- **UR-NAV-028 (P0):** Opening the mobile menu must add a backdrop that closes the menu when clicked (click-outside behavior).

### 3.3 Route Archetype and Metadata Contract

- **UR-NAV-030 (P0):** Every calculator route entry in `public/config/navigation.json` must declare `routeArchetype`, `designFamily`, and `paneLayout`.
- **UR-NAV-031 (P0):** Allowed `routeArchetype` values are `calc_exp`, `calc_only`, `exp_only`, `content_shell`.
- **UR-NAV-032 (P0):** Allowed `designFamily` values are `home-loan`, `auto-loans`, `credit-cards`, `neutral`.
- **UR-NAV-033 (P0):** Pane omission is legal only when archetype explicitly omits that pane and the REQ states omission rationale and replacement content contract.
- **UR-NAV-034 (P0):** Legacy routes missing metadata must default to `routeArchetype=calc_exp` and inferred `designFamily` without breaking existing pages.
- **UR-NAV-035 (P0):** Page generation must emit `data-route-archetype` and `data-design-family` on `<body>`.
- **UR-NAV-036 (P0):** Fragment loading is archetype-bound: `calc_exp` requires `index.html` + `explanation.html`; `calc_only` requires `index.html`; `exp_only` requires `explanation.html`; `content_shell` requires `content.html`.
- **UR-NAV-037 (P0):** `calc_exp` routes must declare `paneLayout=single`; `paneLayout=split` is disallowed for new or modified calculator routes.
- **UR-NAV-038 (P1):** Legacy split routes may exist temporarily as migration debt, but any touched/migrated calculator route must be converted to `paneLayout=single` before release signoff.

### 3.4 Archetype Behavior Matrix

- **`calc_exp`:** Calc Pane (Req) + Exp Pane (Req). Layout: `single` only.
- **`calc_only`:** Calc Pane (Req) + Exp Pane (Omitted). Layout: `single`.
- **`exp_only`:** Calc Pane (Omitted) + Exp Pane (Req). Layout: `single`.
- **`content_shell`:** Calc Pane (Omitted) + Exp Pane (Omitted). Layout: `single`.

### 3.5 Cluster Isolation Governance

- **UR-CLUSTER-001 (P0):** Rule reuse is global; runtime/build files are cluster-owned.
- **UR-CLUSTER-002 (P0):** The 7-cluster boundary model is canonical: `math`, `home-loan`, `credit-cards`, `auto-loans`, `finance`, `time-and-date`, `percentage`.
- **UR-CLUSTER-003 (P0):** Public URL structure must remain unchanged during cluster migration unless explicitly approved.
- **UR-CLUSTER-004 (P0):** Cross-cluster linking via static anchors (`<a href>`) is allowed.
- **UR-CLUSTER-005 (P0):** Cross-cluster runtime imports/references are prohibited (CSS/JS/HTML asset references into another cluster prefix).
- **UR-CLUSTER-006 (P0):** Allowed shared runtime is limited to immutable core assets under `/assets/core/v{n}/...`.
- **UR-CLUSTER-007 (P0):** Cluster-owned shell contract is mandatory and must preserve required DOM hooks, ARIA behavior, and layout invariants.
- **UR-CLUSTER-008 (P0):** Route ownership contract is mandatory via `config/clusters/route-ownership.json` with required ownership and rollback fields.
- **UR-CLUSTER-009 (P0):** Cluster registry contract is mandatory via `config/clusters/cluster-registry.json`.
- **UR-CLUSTER-010 (P0):** Per-cluster configuration contracts are mandatory: `clusters/<cluster-id>/config/navigation.json` and `clusters/<cluster-id>/config/asset-manifest.json`.
- **UR-CLUSTER-011 (P0):** Generated route HTML must satisfy an isolation fence: allow only owner-cluster assets and immutable core prefixes.
- **UR-CLUSTER-012 (P0):** Route assets must resolve only to owner cluster prefix or immutable core prefix.
- **UR-CLUSTER-013 (P0):** Cluster asset hashing must be immutable; cleanup must be manifest-aware and safe against referenced asset deletion.
- **UR-CLUSTER-014 (P0):** Rollback contract fields are required per route ownership entry: `activeOwnerClusterId`, `previousOwnerClusterId`, `rollbackTag`.
- **UR-CLUSTER-015 (P0):** Global navigation destination parity must be enforced across cluster nav files using a policy-level global navigation spec.
- **UR-CLUSTER-016 (P0):** Cluster build entry points must be independent; root harness is orchestration-only and must not reintroduce shared rendering logic.
- **UR-CLUSTER-017 (P0):** Cross-cluster guard checks are mandatory release gates (ownership integrity, isolation fence, import graph, manifest integrity, nav parity).
- **UR-CLUSTER-018 (P0):** Any new calculator cluster/category must follow this cluster-isolation approach by default.
- **UR-CLUSTER-019 (P0):** Legacy shared shell/runtime files are forbidden for isolated routes after decommission phase completion.
- **UR-CLUSTER-020 (P0):** Exceptions to cluster isolation require explicit approval, documented rationale, and signoff evidence.

### 3.5.1 Cluster Contract Field Baseline (Normative)

- **Route ownership contract (`config/clusters/route-ownership.json`) minimum fields:** `route`, `calculatorId`, `activeOwnerClusterId`, `previousOwnerClusterId`, `rollbackTag`.
- **Cluster registry contract (`config/clusters/cluster-registry.json`) minimum fields:** `clusterId`, `displayName`, `status`, `routePrefixes`, `owners`.
- **Per-cluster navigation contract:** `clusters/<cluster-id>/config/navigation.json` must include cluster-local sections plus required global-destination parity fields.
- **Per-cluster asset manifest contract:** `clusters/<cluster-id>/config/asset-manifest.json` must include route-level CSS/JS ownership mappings and isolation boundary metadata.

### 3.6 Superseded Legacy Shared Assumptions (Traceability)

- **By `UR-CLUSTER-*`:** `UR-NAV-004`, `UR-NAV-005`, `UR-NAV-006`.
- **By `UR-CLUSTER-*`:** `UR-UI-003`.
- **By `UR-CLUSTER-*`:** `UR-CSS-002`, `UR-CSS-003`, `UR-CSS-005`, `UR-CSS-006`, `UR-CSS-009`.
- **By `UR-CLUSTER-*`:** `UR-ADS-002`, `UR-ADS-012`.
- **By `UR-CLUSTER-*`:** `UR-SMAP-003`.

---

## 4) Theme and UI Core

### 4.1 Theme Tokens and Defaults

- **UR-UI-001 (P0):** Premium-dark is the global default theme for shell/content/calculator surfaces.
- **UR-UI-002 (P0):** Shared theme tokens are mandatory; ad-hoc route palettes are not allowed.
- **UR-UI-003 (P0):** Theme delivery for isolated routes is cluster-owned under `UR-CLUSTER-001` and `UR-CLUSTER-010`; global shared base theme loading is superseded for isolated routes.

### 4.2 Component and Input Rules

- **UR-UI-010 (P0):** Shared `.calculator-button` styles are mandatory for primary/secondary actions.
- **UR-UI-011 (P0):** Inputs must have labels and deterministic validation.
- **UR-UI-012 (P0):** Control dropdowns (`<select>`) are disallowed for calculator mode interactions.
- **UR-UI-013 (P1):** Input values are constrained to 12 characters (via `maxlength` or JS validation by input type).

### 4.3 Trigger and Dense-Form Contract

- **UR-UI-020 (P0):** Button-only calculate behavior is mandatory after page-load baseline for calculators with explicit Calculate CTA.
- **UR-UI-021 (P0):** Input edits/mode toggles/add-remove rows may change state/visibility but must not recompute before Calculate click.
- **UR-UI-022 (P0):** Dense/multi-mode calculators require explicit mode control type, default mode, visibility mapping, and dynamic-row parity.

### 4.4 Design Token Reference Defaults

> **Note:** Values below are reference defaults. Individual calculator requirements may specify different values.

- **Theme Flag:** `data-theme="premium-dark"` on `<html>`/`<body>`.
- **Primary Brand:** `--color-blue-600` (#2563eb), `--color-cyan-600` (#0891b2).
- **Semantic:** `--color-green-500`, `--color-orange-500`, `--color-red-500`, `--color-violet-500`.
- **Slate:** `--color-slate-50` to `--color-slate-950`.
- **Dark Backgrounds:** `--color-blue-900`, `--color-blue-950`.
- **Gradients:**
  - Page: `--gradient-bg-main` (slate-900 mixed)
  - Card: `--gradient-bg-card` (glass)
  - Brand: `--gradient-brand-primary` (blue->cyan)
  - Result: `--gradient-result-card`
- **Shadows:** `--shadow-sm` ... `--shadow-2xl`; `--shadow-glow-blue/cyan`.
- **Typography:** `--font-sans` (System stack); `--text-xs` to `--text-6xl`; `--font-normal` (400) to `--font-black` (900).
- **Spacing:** `--space-1` (4px) to `--space-20` (80px).
- **Radius:** `--radius-none` to `--radius-full` (9999px).
- **Layout:** Max width `1800px`; Header `72px`; Nav `60px`; Footer `48px`; Gap `10px`.
- **Grid:** 12 cols. Spans: Left(2) / Calc(3) / Exp(5) / Ads(2).
- **Z-Index:** Base(0) -> Dropdown(10) -> Sticky(20) -> Fixed(30) -> Modal(40) -> Popover(50) -> Tooltip(60).
- **Transitions:** Fast(150ms), Base(300ms), Slow(500ms).

#### 4.4.11 Layout Hard-Lock During Theme-Only Changes

- **Constraints:** Grid column definitions, pane heights, `overflow-y` regions, header/footer heights, and DOM structure MUST remain identical.
- **Fix:** If visual changes break layout, revert and restyle using only CSS tokens.

### 4.5 Design Philosophy and Design Families

- **UR-UI-030 (P0):** High-impact visual identity, simple interaction model, smooth motion, glassmorphism.
- **UR-UI-031 (P0):** `designFamily` controls accent/micro-visuals; shared shell structure remains unchanged.
- **UR-UI-032 (P0):** Family styling must be token-driven; no hardcoded conflicting palettes.
- **UR-UI-033 (P0):** Families (`home-loan`, `auto-loans`, etc.) must preserve accessibility and deterministic layout.
- **UR-UI-034 (P1):** New/migrated routes must provide design-family compliance screenshots (desktop/mobile).
- **UR-UI-035 (P1):** Evidence must include token/class proof and references in artifacts.
- **UR-UI-036 (P0):** Design family must not change MPA behavior, semantic landmarks, or keyboard/focus behavior.

### 4.6 CSS Architecture and Loading Rules

- **UR-CSS-001 (P0):** `@import` is **prohibited** in all calculator CSS files. Enforced by `npm run lint:css-import`.
- **UR-CSS-002 (P0):** Shared layout source requirement is superseded for isolated routes by cluster-owned CSS contracts (`UR-CLUSTER-010`); `@import` prohibition still applies.
- **UR-CSS-003 (P0):** Shared generator-managed CSS delivery is superseded for isolated routes by cluster-owned build entry points (`UR-CLUSTER-016`).
- **UR-CSS-004 (P0):** `calculator.css` contains **only page-specific overrides**.
- **UR-CSS-005 (P0):** CSS load order for isolated routes is cluster-scoped and must satisfy isolation fence constraints (`UR-CLUSTER-011`, `UR-CLUSTER-012`).
- **UR-CSS-006 (P0):** Legacy shared cross-route CSS ownership is superseded for isolated routes; each route must load only owner-cluster CSS contracts (except immutable core under `UR-CLUSTER-006`).
- **UR-CSS-007 (P1):** Blocking budget: ≤ 5 `<link>` tags for standard routes; approved route-bundle routes require exactly 1 blocking stylesheet link.
- **UR-CSS-008 (P0):** `npm run validate` fails on any `@import`.
- **UR-CSS-009 (P1):** Route bundle manifests must map route -> hashed CSS output per owner cluster and comply with immutable retention rules (`UR-CLUSTER-013`).

---

## 5) Calculation Pane Contract

Applicability: `calc_exp`, `calc_only`.

- **UR-CALC-001 (P0):** Core inputs accessible without mandatory scroll.
- **UR-CALC-002 (P0):** Optional inputs must not block primary completion.
- **UR-CALC-003 (P0):** Progressive disclosure required for high density.
- **UR-CALC-004 (P0):** Optimizations must preserve clarity/touch usability.
- **UR-CALC-005 (P0):** Interaction must not cause unstable row shifts.
- **UR-CALC-006 (P1):** Dynamic Add/Remove rows must preserve parity.
- **UR-CALC-007 (P1):** Updates must satisfy ISS layout stability.

---

## 6) Explanation Pane Contract

Applicability: `calc_exp`, `exp_only`.

### 6.1 Mandatory Structure

- **UR-EXP-001 (P0):** Order: H2 Summary, H3 Scenario, H3 Results, H3 Expl, H3 FAQ.
- **UR-EXP-002 (P0):** Only one H2 (Summary); others are H3.
- **UR-EXP-003 (P0):** No extra heading levels/sections without approval.

### 6.2 Dynamic Content and FAQ

- **UR-EXP-010 (P0):** Summary must be dynamic (inputs/outputs).
- **UR-EXP-011 (P0):** Tables must be output-driven, not static.
- **UR-EXP-012 (P0):** Default FAQ baseline: 10 items.
- **UR-EXP-013 (P0):** FAQ layout/text must align with schema.

### 6.3 Table Baseline

- **UR-EXP-020 (P0):** Use semantic HTML (`table/thead/tbody/tfoot`) and full grid consistency.
- **UR-EXP-021 (P0):** Styling must align with shared theme; no conflicting borders.

---

## 7) SEO Governance (P1-P5)

### 7.1 P1 Critical SEO

- **UR-SEO-001 (P0):** Unique title (35-61ch), meta description (110-165ch), one H1, canonical, viewport, lang, robots.
- **UR-SEO-002 (P0):** Static HTML Robots: `<meta name="robots" content="index,follow">`.
- **UR-SEO-003 (P0):** Canonical must be absolute and production domain.

### 7.2 P2 Structured Data and Social

- **UR-SEO-010 (P0):** Schema: `WebPage` + `SoftwareApplication` + `BreadcrumbList`. `FAQPage` if FAQs exist.
- **UR-SEO-011 (P0):** FAQ 3-way parity: JSON-LD <-> Meta <-> Visible.
- **UR-SEO-012 (P0):** Schema types or validation failure is FAIL.

### 7.3 P3/P4/P5 Governance

- **UR-SEO-020 (P1):** P3 performance checks mandatory (WAIVED requires strict policy).
- **UR-SEO-021 (P1):** P4 accessibility/SEO overlap checks mandatory.
- **UR-SEO-022 (P0):** P5 infrastructure (sitemap/redirects) mandatory.

### 7.4 Deterministic PASS/FAIL

- **UR-SEO-030 (P0):** Priority failure/missing evidence = SEO FAIL.
- **UR-SEO-031 (P0):** SEO results must be recorded in Release Sign-off.

---

## 8) Testing Governance

### 8.1 Canonical Suites

- **UR-TEST-001 (P0):** Unit: `npm run test`.
- **UR-TEST-002 (P0):** E2E: `npm run test:e2e`.
- **UR-TEST-003 (P1):** ISS-001: `npm run test:iss001` (layout stability).
- **UR-TEST-004 (P0):** FAQ schema guard.
- **UR-TEST-005 (P0):** CWV Guard: `test:cwv:target` (Targeted) or `test:cwv:all` (Global). (Fail if: CLS > 0.10, LCP > 2.5s).
- **UR-TEST-006 (P0):** Artifact: `test-results/performance/cls-guard-all-calculators.json`.

### 8.2 Change-Type Matrix

- **UR-TEST-010 (P0):** New Calc: Unit + Route E2E + SEO + Schema + ISS-001.
- **UR-TEST-011 (P1):** Compute: Unit. E2E optional.
- **UR-TEST-012 (P0):** Nav/Shell: Nav E2E + ISS-001.
- **UR-TEST-013 (P0):** Finance/Trigger: Button-only regression.
- **UR-TEST-014 (P0):** Feature Release: Targeted CWV guard (`TARGET={scope}`). Global Release: All-calc CWV guard.

### 8.3 Evidence Recording

- **UR-TEST-020 (P0):** Record execution evidence in Release Sign-off.
- **UR-TEST-021 (P0):** Record coverage (Required vs Executed).

### 8.4 Archetype Test Matrix

- **UR-TEST-030 (P0):** `calc_exp`: E2E, SEO, Schema, Unit.
- **UR-TEST-031 (P0):** `calc_only`: E2E, Trigger, SEO. Exp N/A.
- **UR-TEST-032 (P0):** `exp_only`: Content assertions, SEO. Calc N/A.
- **UR-TEST-033 (P0):** `content_shell`: Shell/Nav/SEO. Panes N/A.
- **UR-TEST-034 (P1):** Layout change? Run ISS-001.
- **UR-TEST-035 (P0):** Compliance E2E must assert body metadata.

### 8.5 Cluster & Calculator Scoped Test Isolation

- **UR-TEST-040 (P0):** Test folder architecture is mandatory: `tests_specs/{cluster}/cluster_release/` and `tests_specs/{cluster}/{calculator}_release/`.
- **UR-TEST-041 (P0):** Cluster release folder must contain exactly these baseline files: `unit.cluster.test.js`, `contracts.cluster.test.js`, `e2e.cluster.spec.js`, `seo.cluster.spec.js`, `cwv.cluster.spec.js`, `README.md`.
- **UR-TEST-042 (P0):** Calculator release folder must contain exactly these baseline files: `unit.calc.test.js`, `e2e.calc.spec.js`, `seo.calc.spec.js`, `cwv.calc.spec.js`, `README.md`.
- **UR-TEST-043 (P0):** Unit runner isolation is mandatory: `npm run test` must execute only `*.test.js`; Playwright `*.spec.js` files are forbidden in Vitest runs.
- **UR-TEST-044 (P0):** E2E runner isolation is mandatory: `npm run test:e2e` must execute only `*.spec.js`; Vitest `*.test.js` files are forbidden in Playwright runs.
- **UR-TEST-045 (P0):** Scoped cluster commands are first-class release gates: `test:cluster:unit`, `test:cluster:e2e`, `test:cluster:seo`, `test:cluster:cwv`; each requires `CLUSTER`.
- **UR-TEST-046 (P0):** Scoped calculator commands are first-class release gates: `test:calc:unit`, `test:calc:e2e`, `test:calc:seo`, `test:calc:cwv`; each requires `CLUSTER` and `CALC`.
- **UR-TEST-047 (P0):** Scoped commands must fail fast with deterministic error text for missing/invalid `CLUSTER`/`CALC` values.
- **UR-TEST-048 (P0):** Global commands (`test`, `test:e2e`, `test:cwv:all`, `test:iss001`) are reserved for full-site releases and are not default for cluster/calculator releases.
- **UR-TEST-049 (P0):** `test:calc:cwv` is a hard blocker and must run calibrated first-time-user profiles with cache disabled: `mobile_strict` (CPU 3x + Slow 4G) and `desktop_strict` (CPU 6x + Slow 4G).
- **UR-TEST-050 (P0):** Scoped calculator CWV budgets are enforced by `requirements/universal-rules/CWV_SCOPED_BUDGETS.json`; defaults are `CLS <= 0.10`, `LCP <= 2500ms`, and render-blocking CSS duration `<= 800ms`.
- **UR-TEST-051 (P0):** Render-blocking CSS budget breach in any strict profile is a hard fail for calculator release (`test:calc:cwv`).
- **UR-TEST-052 (P0):** Scoped CWV artifact is mandatory evidence: `test-results/performance/scoped-cwv/{cluster}/{calc}.json`.
- **UR-TEST-RUNNER-001 (P0):** Runner refactors for startup-cost elimination are allowed only if legacy commands remain available for at least one release cycle, rollback path exists, evidence artifacts remain auditable, and scope/debug dry-run mode is provided.

### 8.6 Lighthouse Efficiency + Determinism Governance

- **UR-TEST-LH-001 (P0):** Test-tooling changes must be small-diff and flag-driven; broad refactors require explicit approval.
- **UR-TEST-LH-002 (P0):** Default Lighthouse gate category is `performance`.
- **UR-TEST-LH-003 (P0):** Mixed-content scan is opt-in only via `LH_SCAN_MIXED_CONTENT=1`.
- **UR-TEST-LH-004 (P1):** Server auto-start bypass is allowed via `LH_ASSUME_SERVER_RUNNING=1`.
- **UR-TEST-LH-005 (P0):** Mobile Lighthouse runs must include explicit `--form-factor=mobile` and `--throttling-method=devtools`.
- **UR-TEST-LH-006 (P0):** Desktop Lighthouse runs default to native desktop preset behavior with `--form-factor=desktop` and `--screenEmulation.disabled`; devtools throttling is not default.
- **UR-TEST-LH-007 (P0):** Pre-release Lighthouse gate requires `LH_RUNS=3` with median aggregation for LCP/CLS/INP/performance score.
- **UR-TEST-LH-008 (P1):** Warm-up run is optional via `LH_WARMUP_RUN=1`.
- **UR-TEST-LH-009 (P1):** Weekly full audit (`performance,accessibility,best-practices` + mixed-content scan) is track-only and non-blocking for release.
- **UR-TEST-LH-010 (P0):** Release evidence must include Lighthouse mode, `LH_RUNS`, aggregation type, resolved policy snapshot, and desktop policy mode; missing fields are hard fail.
- **UR-TEST-LH-011 (P0):** Policy precedence is mandatory: defaults from `requirements/universal-rules/lighthouse_policy.json`, then allowed environment overrides, then explicitly permitted CLI flags. Summary JSON must include `runPolicy.resolved`.
- **UR-TEST-SCOPE-001 (P0):** PR Lighthouse gates must use exactly one `TARGET_ROUTE` or policy-approved golden set; full-site Lighthouse scans are disallowed in PR release gates by default.

### 8.7 Testing Efficiency and Code-Diff Strategy

- **UR-TEST-EFF-001 (P0):** Code-diff strategy is mandatory for testing-tooling changes: no broad refactor/reorganization and no function/file renames unless explicitly approved.
- **UR-TEST-EFF-002 (P0):** New testing-tool behavior must be flag-driven and default-safe; when flags are unset, approved baseline behavior must remain intact.
- **UR-TEST-EFF-003 (P1):** Slow checks must remain opt-in by default outside full-audit mode (e.g., mixed-content scanning via `LH_SCAN_MIXED_CONTENT=1`).
- **UR-TEST-EFF-004 (P1):** Local run-time optimizations may use `LH_ASSUME_SERVER_RUNNING=1` and `LH_WARMUP_RUN=1` when allowed by policy and declared in release evidence.
- **UR-TEST-EFF-005 (P0):** Release/perf gate operation must use policy modes (`fast`, `stable`, `full`) with explicit `LH_MODE`, `LH_RUNS`, categories, and aggregation declaration.
- **UR-TEST-EFF-006 (P1):** Test-efficiency changes should record before/after runtime evidence for target route(s) to track CI time and cost impact.
- **UR-TEST-EFF-007 (P0):** If rationale documents conflict with runtime policy, `requirements/universal-rules/lighthouse_policy.json` and `UR-TEST-LH-*` rules take precedence.

---

## 9) Header Contract

- **UR-HDR-001 (P0):** Semantic `<header role="banner">`.
- **UR-HDR-002 (P0):** Site title links to `/`, matches canonical.
- **UR-HDR-003 (P0):** Primary nav: static anchors, full reload.
- **UR-HDR-004 (P0):** Search: no auto-nav; filtering only.
- **UR-HDR-005 (P1):** Token-driven, fixed height.

---

## 10) Footer Contract

- **UR-FTR-001 (P0):** Semantic `<footer role="contentinfo">`.
- **UR-FTR-002 (P0):** Canonical legal links (Privacy, Terms, Contact, FAQs, Sitemap).
- **UR-FTR-003 (P0):** No JS-driven nav.
- **UR-FTR-004 (P1):** Links must be crawlable.
- **UR-FTR-005 (P1):** Spacing/colors match tokens.

---

## 11) AdSense Governance

### 11.1 AdSense Head Script (MANDATORY)

- **UR-ADS-001 (P0):** Loader injected into `<head>` unconditionally.
- **UR-ADS-002 (P0):** Loader centralization in shared generation logic is superseded for isolated routes by cluster-owned generation contracts (`UR-CLUSTER-010`, `UR-CLUSTER-016`).
- **UR-ADS-003 (P0):** Max one loader per page.
- **UR-ADS-004 (P0):** Env vars deprecated. Code always present.
- **UR-ADS-005 (P0):** Attributes must match canonical snippet.
- **UR-ADS-006 (P0):** Canonical loader snippet must use `async`, `crossorigin="anonymous"`, and source `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1063975431106361`.
- **UR-ADS-007 (P0):** Head loader must not be hardcoded manually in per-route templates; it must come from governed shell/build ownership for the owning route/cluster.

### 11.2 Ad Pane Slot (MANDATORY)

- **UR-ADS-010 (P0):** `.ads-column` must render controlled `<ins>` slot.
- **UR-ADS-011 (P0):** No placeholder text.
- **UR-ADS-012 (P0):** Slot source centralization is superseded for isolated routes by cluster-owned shell/runtime contracts (`UR-CLUSTER-007`, `UR-CLUSTER-010`).
- **UR-ADS-013 (P1):** Mobile safety: `.ads-column` hidden at max-width 860px (unless overridden).
- **UR-ADS-014 (P0):** Controlled ad-unit contract must include `class="adsbygoogle"`, `style="display:block"`, `data-ad-client="ca-pub-1063975431106361"`, `data-ad-format="auto"`, and `data-full-width-responsive="true"`.
- **UR-ADS-015 (P0):** Default right-pane responsive unit must use `data-ad-slot="3901083802"` unless an approved route/cluster override contract is documented in release evidence.
- **UR-ADS-016 (P0):** Slot activation script must use `(adsbygoogle = window.adsbygoogle || []).push({});` exactly once per rendered slot.

### 11.3 Controlled Injection Policy

- **UR-ADS-020 (P0):** Auto Ads body injection PROHIBITED for calculator shell.
- **UR-ADS-021 (P0):** No body-level loader duplication.
- **UR-ADS-022 (P1):** Injection must be idempotent.
- **UR-ADS-023 (P1):** Canonical snippet source docs are archived rationale only; normative enforcement is defined by `UR-ADS-*` rules in this file.

### 11.4 Manual Smoke Validation

- **UR-ADS-030 (P1):** Confirm: Loader in `<head>`, Slot in `.ads-column`.
- **UR-ADS-031 (P1):** Document smoke notes for shell changes.

---

## 12) Sitemap and Crawlability

- **UR-SMAP-001 (P0):** Live calc routes must contain human-readable `/sitemap/`.
- **UR-SMAP-002 (P0):** Live = nav-visible or publicly reachable.
- **UR-SMAP-003 (P0):** Sitemap source may be composed from cluster navigation contracts and route ownership contracts; single shared nav source is superseded for isolated routes (`UR-CLUSTER-010`, `UR-CLUSTER-015`).
- **UR-SMAP-004 (P0):** Missing route = Hard FAIL.
- **UR-SMAP-005 (P0):** New calc must have sitemap criteria.
- **UR-SMAP-006 (P0):** `xml` and `robots.txt` must preserve access.

---

## 13) Checklist Governance

- **UR-CHK-001 (P0):** Migration work: `calculator-migration-checklist.md`.
- **UR-CHK-002 (P0):** New Calc work: `new-calculator-design-checklist.md`.
- **UR-CHK-003 (P0):** Gates must include evidence.
- **UR-CHK-004 (P0):** Missing evidence = Compliance Failure.
- **UR-CHK-005 (P0):** Missing archetype/screenshot evidence = Failure.

---

## 14) Never-Do Rules

- **UR-NEVER-001 (P0):** Bypass required gates.
- **UR-NEVER-002 (P0):** Merge with P0 violations.
- **UR-NEVER-003 (P0):** Introduce SPA routing for calcs.
- **UR-NEVER-004 (P0):** Put calc shell in GTEP.
- **UR-NEVER-005 (P0):** Omit compliance evidence.
- **UR-NEVER-006 (P0):** Commit machine-specific paths/cache.

---

## 15) Definition of Done

- **UR-DOD-001:** Implementation aligned with UR info.
- **UR-DOD-002:** Tests executed/recorded.
- **UR-DOD-003:** SEO gate PASS/WAIVED.
- **UR-DOD-004:** Checklists completed.
- **UR-DOD-005:** Compliance report finalized.

---

## 16) Maintenance Protocol

- **UR-MAINT-001 (P0):** New rules added ONLY here.
- **UR-MAINT-002 (P1):** Use next available ID.
- **UR-MAINT-003 (P0):** Renames require map update.
- **UR-MAINT-004 (P1):** Resolve legacy refs immediately.

---

## 17) Compatibility and Migration Map

**Merged:** Workflow, SEO, Testing, Theme, Header, Footer, Calc Pane, Expl Pane.

- **DC-0.\*** -> \*_UR-DC_
- **AP-2.\*** -> \*_UR-AP_
- **NAV-MPA** -> \*_UR-NAV_
- **EXCL/UI/UUI** -> \*_UR-NAV/UR-UI/UR-CALC_
- **EXP/UTBL** -> \*_UR-EXP_
- **P1..P5** -> \*_UR-SEO_
- **TEST-1** -> \*_UR-TEST_
- **HDR/FTR** -> \*_UR-HDR/UR-FTR_
- **ADS** -> \*_UR-ADS_
- **DOC/CHK/NEVER/DOD** -> \*_UR-SMAP/UR-CHK/UR-NEVER/UR-DOD_

Use only `UR-*` IDs for new work.

---

## 18) Site Copy Contract

- **UR-COPY-001 (P0):** Values defined here are verbatim.
- **UR-COPY-002 (P0):** No punctuation/casing changes.
- **UR-COPY-003 (P1):** Changes require test updates.

**Canonical Values:**

- `SITE_TITLE`: `Calculate How Much`
- `SITE_TAGLINE`: `Calculate how much you need, spend, afford.`

---

## 19) Reference Pointers

- **Nav:** `requirements/site-structure/calculator-hierarchy.md`
- **Comp:** `requirements/compliance/`
- **Gen:** `scripts/generate-mpa-pages.js`
- **LH Policy:** `requirements/universal-rules/lighthouse_policy.json`
- **Archived Testing Rationale (non-authoritative):** `requirements/universal-rules/Archive Rules/code_diff_.md`, `requirements/universal-rules/Archive Rules/performance_improvements.md`
- **Archived AdSense Rationale (non-authoritative):** `requirements/universal-rules/Archive Rules/AdSense code snippet.md`, `requirements/universal-rules/Archive Rules/Ad Unit Code.md`

---

## 20) GTEP Canonical Contract

- **UR-GTEP-001 (P0):** Plain HTML, no calc state.
- **UR-GTEP-002 (P0):** Unique Title/Desc, H1, Canonical, Robots.
- **UR-GTEP-003 (P0):** Simple footer legal links.
- **UR-GTEP-004 (P0):** HTML sitemap from nav config.
- **UR-GTEP-005 (P0):** No ad pane, no calc scripts.

**Routes:** `/sitemap/`, `/privacy/`, `/terms-and-conditions/`, `/contact-us/`, `/faqs/`.
**Testing:** Assert no shell regions, h1 exists, legal links exist.

---

## 21) Privacy Policy Canonical Content Contract

- **UR-PRIV-001 (P0):** Content governed here (preserve meaning).
- **UR-PRIV-002 (P0):** Disclose Cloudflare + AdSense.
- **UR-PRIV-003 (P0):** No account needed, no data sale.
- **UR-PRIV-004 (P0):** EEA/UK/CH consent obligations.

**Sections:** 1. Date, 2. Scope, 3. No Login, 4. 3rd Party, 5. Cookies/Consent, 6. Analytics, 7. Input Warning, 8. Retention, 9. Choices, 10. Update, 11. Liability.

---

## 22) Terms & Conditions Canonical Content Contract

- **UR-TERM-001 (P0):** Content governed here.
- **UR-TERM-002 (P0):** Estimates only; not prof advice.
- **UR-TERM-003 (P0):** As-is, liability, 3rd party disclaimers.
- **UR-TERM-004 (P0):** Ad/Cookie/Consent disclosures.

**Sections:** 1. Date, 2. Accept, 3. Purpose, 4. No Advice, 5. Estimates, 6. As-Is, 7. Liability, 8. Ads, 9. Consent, 10. External Links, 11. IP, 12. Indemnity, 13. Changes, 14. Law.

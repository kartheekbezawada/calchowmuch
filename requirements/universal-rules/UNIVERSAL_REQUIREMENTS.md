# Universal Requirements — Single Source of Truth

## Document Metadata

- **Status:** Authoritative (sole active governance file)
- **Scope:** All public routes, calculator modules, shared shell, SEO/testing/release gates
- **Canonical Path:** `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md`
- **Version:** 4.6 (Graph/Table UX contract standardization)
- **Last Updated:** 2026-03-07

This is the only active governance file under `requirements/universal-rules/`. All previously separate rule modules are merged here and re-numbered with the `UR-*` scheme. The folder map and companion-document loading order live in `requirements/universal-rules/README.md`.

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
- **UR-FLOW-011 (P0): Release Checklist:** Execute release gates per `RELEASE_CHECKLIST.md` release-mode and release-scope matrix. `SCHEMA_DEDUPE_MAINTENANCE` requires `test:schema:dedupe`. `NEW_BUILD|ONBOARDING|REDESIGN` require scoped gates for cluster/calculator releases and full global gates only for explicit full-site releases.
- **UR-FLOW-012 (P0): Release Sign-off:** Create `release-signoffs/RELEASE_SIGNOFF_{ID}.md` per `RELEASE_SIGNOFF.md`; Master Table updates are optional historical logging.
- **UR-FLOW-013 (P0): Ready:** Agent confirms "Ready to merge". Agent does NOT merge.

### 1.3 ADMIN Override

- **UR-FLOW-020 (P0):** Keyword `ADMIN` in message supersedes all workflow constraints.
- **UR-FLOW-021 (P0):** ADMIN mode skips gates but must not violate platform safety/security.

### 1.4 Interaction Efficiency Modes

- **UR-FLOW-022 (P1):** Agent may use interaction modes (`STANDARD`, `MAX`) for response efficiency.
- **UR-FLOW-023 (P0):** Interaction modes must not relax mandatory release gates or safety constraints.
- **UR-FLOW-024 (P1):** Mode-switch command syntax and semantics are governed by `AGENTS.md`.

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
- **UR-CLUSTER-002 (P0):** The cluster boundary model is registry-driven; active clusters are sourced from `config/clusters/cluster-registry.json`.
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
- **UR-CLUSTER-021 (P0):** Homepage discoverability is registry-driven: clusters with `showOnHomepage !== false` must be renderable on `/` from cluster registry plus governed route sources (`navigation` and/or cluster `routePrefixes` fallback).
- **UR-CLUSTER-022 (P0):** Homepage search discoverability is route-driven by default: every newly released public calculator route must be discoverable from `/` search via governed route sources (`config/clusters/route-ownership.json` plus cluster navigation and/or approved governed fallback). Route-level exclusion is allowed only via machine-readable route-ownership metadata plus explicit approval, documented rationale, and signoff evidence.

### 3.5.1 Cluster Contract Field Baseline (Normative)

- **Route ownership contract (`config/clusters/route-ownership.json`) minimum fields:** `route`, `calculatorId`, `activeOwnerClusterId`, `previousOwnerClusterId`, `rollbackTag`.
- **Route ownership optional homepage-search governance fields:** `homepageSearchExcluded` (boolean, default `false`), `homepageSearchExclusionReason` (required when excluded), `homepageSearchExclusionEvidence` (required when excluded).

  Example excluded route entry:

  ```json
  {
    "route": "/finance-calculators/example-calculator/",
    "calculatorId": "example-calculator",
    "activeOwnerClusterId": "finance",
    "previousOwnerClusterId": "legacy-shared",
    "rollbackTag": "pre-example-release",
    "homepageSearchExcluded": true,
    "homepageSearchExclusionReason": "Temporarily withheld pending coordinated navigation/content launch.",
    "homepageSearchExclusionEvidence": "RELEASE_SIGNOFF_REL-YYYYMMDD-EXAMPLE"
  }
  ```

- **Cluster registry contract (`config/clusters/cluster-registry.json`) minimum fields:** `clusterId`, `displayName`, `status`, `routePrefixes`, `owners`. Optional governance fields: `showOnHomepage` (default `true`), `contractsEnabled` (default `false`).
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

### 4.6 Graph/Table UX Contract (Mandatory for Routes That Include Graphs or Tables)

- **UR-UI-040 (P0):** Routes with graphs/tables must comply with `requirements/universal-rules/CALCULATOR_BUILD_GUIDE.md` sections `5.8`, `5.9`, and `5.10`.
- **UR-UI-041 (P0):** Graph start-point integrity is mandatory: period `0` must represent true opening value; synthetic start spikes are release fail.
- **UR-UI-042 (P0):** Axis labels/ticks must not overlap, clip, or overflow at desktop and mobile widths.
- **UR-UI-043 (P0):** Graph metadata/legend presentation must be compact; large boxed KPI blocks above graph are disallowed unless explicitly required by REQ.
- **UR-UI-044 (P0):** Table viewport must be fixed height with internal scroll for overflow data; dynamic table height growth is disallowed.
- **UR-UI-045 (P0):** On desktop/tablet, table title and Yearly/Monthly toggle must share one row with toggle right-aligned; mobile may wrap cleanly.
- **UR-UI-046 (P0):** Yearly/Monthly toggle must be segmented with clear active/inactive states and keyboard focus visibility.
- **UR-UI-047 (P0):** Data truncation caps (for example first N years/months only) are forbidden unless explicitly requested by calculator requirement.

### 4.7 CSS Architecture and Loading Rules

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

- **UR-EXP-001 (P0):** For every `calc_exp` and `exp_only` route, default SERP explanation block order is mandatory: Intent-led heading (`H2`) -> `How to Guide` (`H3`) -> `FAQ` (`H3`) -> `Important Notes` (`H3`).
- **UR-EXP-002 (P0):** The explanation `H2` must use the calculator's intent/topic (example: `Mortgage Complete Practical Guide`); generic headings like `Explanation` or `Calculator Explanation` are forbidden.
- **UR-EXP-003 (P0):** Only one `H2` is allowed in the explanation pane.
- **UR-EXP-004 (P0):** `How to Guide`, FAQ, and `Important Notes` sections are mandatory. `Important Notes` must appear after FAQ and must be the final explanation section.
- **UR-EXP-005 (P0):** `Important Notes` must include a visible `Last updated: <Month YYYY>` line, and this month/year must be refreshed whenever the calculator page content is updated in a release.
- **UR-EXP-006 (P0):** No extra heading hierarchy or section insertion between required blocks without explicit REQ approval.

### 6.2 Dynamic Content and FAQ

- **UR-EXP-010 (P0):** Intent-led section content must be output-aware and calculator-specific (not generic filler copy).
- **UR-EXP-011 (P0):** Tables must be output-driven, not static.
- **UR-EXP-012 (P0):** Default FAQ baseline: 10 items.
- **UR-EXP-013 (P0):** FAQ layout/text must align with schema.
- **UR-EXP-014 (P0):** `How to Guide` must use scannable, actionable steps (ordered list or bullets).
- **UR-EXP-015 (P0):** `Important Notes` must include required key lines: `Last updated`, `Accuracy`, calculator-relevant `Disclaimer` (label may vary), calculator-specific `Assumptions`, and `Privacy`.
- **UR-EXP-016 (P0):** `Privacy` line inside `Important Notes` must match exactly: `All calculations run locally in your browser - no data is stored.`
- **UR-EXP-017 (P0):** For newly built or touched `calc_exp` and `exp_only` routes, the intent-led `H2` must act as the main question/topic and be followed immediately by one short-answer paragraph (`40-50` words, about `250-300` characters), then one additional short paragraph.
- **UR-EXP-018 (P0):** For newly built or touched `calc_exp` and `exp_only` routes, `How to Guide` content must include at least one scannable list (`ul`/`ol`) and one small comparison table when comparison improves understanding. Paragraph + table is the preferred default calculator explanation pattern.
- **UR-EXP-019 (P0):** For newly built or touched `calc_exp` and `exp_only` routes, content after the answer-first block must expand into deeper explanation with worked examples, formulas (with variable meanings/units), and FAQ coverage aligned to specific user intent.

### 6.3 Table Baseline

- **UR-EXP-020 (P0):** Use semantic HTML (`table/thead/tbody/tfoot`) and full grid consistency.
- **UR-EXP-021 (P0):** Styling must align with shared theme; no conflicting borders.

### 6.4 Graph and Visual Output Contract

- **UR-EXP-030 (P0):** If a calculator renders a graph/chart, it must be in a dedicated section with a descriptive heading.
- **UR-EXP-031 (P0):** Graph axes must have readable labels and units/time basis where applicable.
- **UR-EXP-032 (P0):** Multi-series charts must provide clear legend labels that do not occlude important data.
- **UR-EXP-033 (P0):** Series styling must remain visually distinguishable (color/line treatment) in both desktop and mobile views.
- **UR-EXP-034 (P1):** Interactive charts should expose tooltip/focus values with period + value.
- **UR-EXP-035 (P0):** Graph rendering must not clip labels or create horizontal overflow on mobile.
- **UR-EXP-036 (P0):** Output insight sections (for example totals tables, amortization tables, graph modules, result interpretation cards) may appear before the required SERP explanation block from `UR-EXP-001`.
- **UR-EXP-037 (P0):** Output-first ordering does not relax required sequence inside the SERP explanation block. Required sequence is `How to Guide` -> FAQ -> `Important Notes`, with `Important Notes` as the last explanation section.
- **UR-EXP-038 (P0):** `Important Notes` placement exceptions are not allowed. Route-level overrides that move `Important Notes` above FAQ or away from final position are forbidden.
- **UR-EXP-039 (P0):** Route tests and release evidence must assert both required order and required `Important Notes` keys (`Last updated`, `Accuracy`, disclaimer, `Assumptions`, `Privacy`).
- **UR-EXP-040 (P0):** `Important Notes` must render as a bullet list (`ul`/`ol`) inside a dedicated notes visual treatment (card/section container) that is visually distinct yet theme-consistent.
- **UR-EXP-041 (P0):** Default SERP guide typography contract is `H3: 16px`, `H4: 14px`, body/list text `14px`; any typography deviation requires explicit REQ approval.
- **UR-EXP-042 (P0):** SERP guide and notes must inherit the route calculator font stack by default. `Important Notes` key labels (`Last updated`, `Accuracy`, disclaimer label, `Assumptions`, `Privacy`) must use `rgba(186, 230, 253, 0.98)`.
- **UR-EXP-043 (P0):** Universal guide/notes baseline for touched routes must match the `How Much Can I Borrow` style contract (heading hierarchy, type scale, line rhythm, and notes marker treatment) unless an explicit REQ-approved override is documented.
- **UR-EXP-044 (P0):** Guide writing style must remain concise and intent-led: short paragraphs, scannable lists/tables, and question-led subheadings tied to calculator behavior; filler/marketing prose is forbidden.
- **UR-EXP-045 (P0):** Deviation policy is strict: any route-level SERP guide/notes style override must include REQ approval plus release evidence describing the rationale and exact variance from baseline.
- **UR-EXP-046 (P1):** Migration audit rubric for legacy routes must be maintained and used for deterministic pass/fail alignment during style harmonization campaigns.

---

## 7) SEO Governance (P1-P5)

### 7.1 P1 Critical SEO

- **UR-SEO-001 (P0):** Baseline metadata presence is mandatory: one unique `<title>`, one unique `<meta name="description">`, one `<h1>`, one canonical URL, viewport, `lang`, and robots in initial HTML. Detailed title/description formatting and quality rules are governed by `UR-SEO-040` to `UR-SEO-052`.
- **UR-SEO-002 (P0):** Static HTML Robots: `<meta name="robots" content="index,follow">`.
- **UR-SEO-003 (P0):** Canonical must be absolute and production domain.
- **UR-SEO-004 (P0):** `calc_exp` and `exp_only` routes must include required explanation blocks from `UR-EXP-001` to `UR-EXP-005` in initial HTML. For newly built or touched routes in release scope, answer-first guide requirements from `UR-EXP-017` to `UR-EXP-019` are also mandatory.
- **UR-SEO-005 (P0):** Missing Intent-led heading, `How to Guide`, `Important Notes`, or FAQ on applicable routes is SEO FAIL.

### 7.2 P2 Structured Data and Social

- **UR-SEO-010 (P0):** Calculator-page schema minimum is `SoftwareApplication` + `BreadcrumbList`. `WebPage` is allowed when route/page architecture uses it. `FAQPage` is optional and allowed only when visible FAQs exist and parity rules pass.
- **UR-SEO-011 (P0):** FAQ 3-way parity: JSON-LD <-> Meta <-> Visible.
- **UR-SEO-012 (P0):** Schema types or validation failure is FAIL.
- **UR-SEO-013 (P0):** Per-page uniqueness is mandatory for `FAQPage`, `BreadcrumbList`, and `SoftwareApplication` (max one each per URL).
- **UR-SEO-014 (P0):** Structured-data dedupe evidence is mandatory for schema-dedupe releases: `schema_duplicates_report.md` and `schema_duplicates_report.csv`.
- **UR-SEO-015 (P0):** Structured-data dedupe governance is defined in `requirements/universal-rules/reference/SCHEMA_DEDUPE_GUARDRAIL.md`; runtime/build behavior must conform.

### 7.3 P3/P4/P5 Governance

- **UR-SEO-020 (P1):** P3 performance checks mandatory (WAIVED requires strict policy).
- **UR-SEO-021 (P1):** P4 accessibility/SEO overlap checks mandatory.
- **UR-SEO-022 (P0):** P5 infrastructure (sitemap/redirects) mandatory.

### 7.4 Deterministic PASS/FAIL

- **UR-SEO-030 (P0):** Priority failure/missing evidence = SEO FAIL.
- **UR-SEO-031 (P0):** SEO results must be recorded in Release Sign-off.
- **UR-SEO-032 (P0):** Thin-content quality scoring is mandatory for `calc_exp` and `exp_only` routes through `test:content:quality` with weighted model `Core Value 40 + Depth 25 + Uniqueness 15 + Trust 10 + Structure 10`.
- **UR-SEO-033 (P0):** Thin-content hard flags are mandatory checks: missing result interpretation guidance, missing worked example, explanation content `<150` words, similarity `>80%`, boilerplate FAQ pattern, tool-only minimal context risk, and `Important Notes` contract failures (order, required keys, privacy statement exact match, `Last updated` format).
- **UR-SEO-034 (P0):** Phase-1 rollout is `soft` mode for scoped SEO runs. Soft mode is non-blocking and must still produce evidence artifacts for all evaluated routes in scope.
- **UR-SEO-035 (P0):** Phase-2 rollout is `hard` mode; release fails if thin-content score is `<70` or any hard flag is present. Mode transition must be explicit in release sign-off evidence.

### 7.5 SEO Head Metadata and Structured Data Standard

Supersedes note: `UR-SEO-040` to `UR-SEO-051` supersede older generic SEO wording where conflicts exist. These rules apply to all calculator clusters and calculator routes unless an explicit HUMAN-approved exemption is documented in release evidence.

- **UR-SEO-040 (P0):** Applicability + inheritance.
  - Requirement: Every indexable calculator page must comply with `UR-SEO-041` to `UR-SEO-051`; cluster-level requirements inherit these rules by default.
  - Acceptance criteria: Compliance evidence references these IDs for calculator releases and scoped SEO/schema checks.
  - Failure conditions: Missing inheritance or missing evidence linkage for calculator releases is SEO governance failure.
- **UR-SEO-041 (P0):** Title tag standard.
  - Requirement: Output exactly one unique `<title>` using `<Primary Keyword> – <Main Benefit> | CalcHowMuch`; primary keyword must appear at the start. No ellipsis (`...` or `…`), no placeholder terms (`Online Calculator`, `Free Tool`) unless explicitly approved, and no encoding artifacts (for example `â€“`).
  - Acceptance criteria: One title per page; no duplicates across canonical calculator pages; human-readable CTR-oriented title; no mojibake.
  - Failure conditions: Missing/duplicate title, ellipsis, placeholder-only boilerplate, or encoding artifact in title.
- **UR-SEO-042 (P0):** Meta description standard.
  - Requirement: Output exactly one unique meta description that is independently authored and never equal to title text. Description must explain what the calculator estimates and key inputs/results; no ellipsis and no generic boilerplate patterns.
  - Acceptance criteria: One description per page; title and description differ; content aligns with visible page purpose and search intent.
  - Failure conditions: Description missing/duplicated, equals title, contains ellipsis, or uses disallowed generic template copy.
- **UR-SEO-043 (P0):** OG and Twitter metadata standard.
  - Requirement: `og:title`/`twitter:title` must mirror final resolved SEO title (or approved close equivalent). `og:description`/`twitter:description` must mirror final resolved meta description (or approved close equivalent). `twitter:card` must be `summary_large_image`, and `og:image` + `twitter:image` must use approved assets.
  - Acceptance criteria: Social metadata values are synchronized with final resolved SEO metadata and contain no placeholder/truncated values.
  - Failure conditions: OG/Twitter title/description drift from resolved SEO values, invalid card type, or non-approved image assets.
- **UR-SEO-044 (P0):** Canonical standard.
  - Requirement: Every indexable calculator page must emit exactly one canonical URL that is absolute HTTPS and uses host `calchowmuch.com`; self-canonical pages must match source URL. `og:url` must equal canonical.
  - Acceptance criteria: Canonical is absolute, unique per page, production-hosted, and aligned with `og:url`.
  - Failure conditions: Relative canonical, mismatched `og:url`, duplicate canonical conflicts, or non-production host canonical.
- **UR-SEO-045 (P0):** Structured data standard.
  - Requirement: Calculator pages must include valid parseable JSON-LD with `SoftwareApplication` and `BreadcrumbList`. `FAQPage` is optional and only permitted when visible FAQ content exists and matches exactly. Global `WebSite` is site-level and must not be duplicated as per-calculator page schema.
  - Acceptance criteria: `has_schema_jsonld=TRUE`, `has_breadcrumb_schema=TRUE`, `has_softwareapp_schema=TRUE`; breadcrumb names are human-readable Title Case; FAQ parity holds when FAQPage exists.
  - Failure conditions: Missing calculator schema minimums, invalid JSON-LD, FAQ schema without visible FAQ parity, or per-page duplicate `WebSite` injection.
- **UR-SEO-046 (P0):** Calculator-page detection standard.
  - Requirement: Treat route as calculator page when pathname contains `-calculators/`, or pathname ends with `-calculator/`, or explicit metadata flag `calculator=true`.
  - Acceptance criteria: All detected calculator pages receive calculator-schema requirements automatically; non-calculator pages do not receive incorrect calculator schema.
  - Failure conditions: False negatives (calculator pages missing required schema) or false positives (non-calculator pages receiving calculator schema).
- **UR-SEO-047 (P0):** UTF-8 and encoding standard.
  - Requirement: Emit `<meta charset="utf-8">` on all indexable pages. Build/export/runtime metadata output must preserve UTF-8 and must not emit mojibake (`â€“`, `â€™`, `â€œ`). Title separator strategy must be consistent (approved en dash or approved hyphen strategy).
  - Acceptance criteria: No encoding artifacts in HTML source, rendered browser metadata, or SEO export artifacts.
  - Failure conditions: Missing charset tag, mojibake in metadata/JSON-LD, or inconsistent separator strategy.
- **UR-SEO-048 (P0):** No generic placeholder copy standard.
  - Requirement: Disallow generic placeholder SEO metadata in production unless explicitly approved, including `Online Calculator`, `Free Tool`, `calculator with fast inputs and clear results`, `provides explanations, examples, and assumptions`, and repeated cluster boilerplate unrelated to route intent.
  - Acceptance criteria: Metadata is page-specific, intent-specific, and reflects actual calculator behavior.
  - Failure conditions: Presence of disallowed placeholder strings or broad repeated boilerplate across unrelated calculators.
- **UR-SEO-049 (P0):** Head generator standard.
  - Requirement: SEO head tags must be generated from one reusable generator/template entrypoint with explicit inputs: `canonicalUrl`, `seoTitle`, `seoDescription`, `h1`, `ogImageUrl`, `isCalculatorPage`.
  - Acceptance criteria: One code path emits required tags (`charset`, `title`, `description`, canonical, OG set, Twitter set, robots) with no per-page drift.
  - Failure conditions: Multiple divergent head generation paths, derived description from title text, or truncated UI label reuse for SEO fields.
- **UR-SEO-050 (P0):** Runtime metadata sync standard.
  - Requirement: Runtime metadata update behavior (including `setPageMetadata`) must use final resolved title/description/canonical, apply UTF-8-safe sanitization, and mirror OG/Twitter from resolved values.
  - Acceptance criteria: Runtime-updated metadata remains aligned with initial contract rules and does not reintroduce ellipsis or encoding defects.
  - Failure conditions: Runtime divergence from resolved metadata contract or reintroduction of disallowed artifacts.
- **UR-SEO-051 (P0):** QA/audit standard and fail conditions.
  - Requirement: Every SEO audit/release check must validate title, description, canonical, H1, JSON-LD presence, `SoftwareApplication` + `BreadcrumbList` on calculator pages, no duplicate title/description/canonical, no ellipsis/artifacts, sitemap inclusion, and LOW_WORD_COUNT exception policy handling.
  - Acceptance criteria: SEO CSV export passes required checks and emits issues-only output for failures; critical metadata/schema failures are hard fail or prominently blocking warnings per release mode.
  - Failure conditions: Any critical metadata/schema check failure without approved exception evidence.
- **UR-SEO-052 (P1):** Worked example contract (canonical examples).
  - Requirement: Keep canonical examples for implementation guidance aligned with this standard.
  - Acceptance criteria:
    - Credit Card Minimum Payment example:
      - Title: `Credit Card Minimum Payment Calculator – Payoff Time & Interest | CalcHowMuch`
      - Description: `Estimate how long it takes to pay off a credit card when making minimum payments. See payoff timeline, total interest, and payment schedule.`
      - H1: `Credit Card Minimum Payment Calculator`
      - SoftwareApplication name: `Credit Card Minimum Payment Calculator`
      - Breadcrumb: `Home > Credit Card Calculators > Credit Card Minimum Payment Calculator`
    - Car Loan Calculator example:
      - Title: `Car Loan Calculator – Monthly Payment & Interest | CalcHowMuch`
      - Description: `Calculate car loan monthly payments, interest cost, and payoff schedule. Adjust loan amount, APR, and term to see total loan cost.`
      - H1: `Car Loan Calculator`
      - SoftwareApplication name: `Car Loan Calculator`
      - Breadcrumb: `Home > Car Loan Calculators > Car Loan Calculator`
  - Failure conditions: Canonical examples drift from enforced standard or encode deprecated placeholder patterns.
- **UR-SEO-053 (P0):** For newly built or touched calculator routes, SEO content must prioritize question-led long-tail intent (`how to`, `what is`, `why does`, `can I`) instead of relying only on broad head terms.
  - Acceptance criteria: Visible guide/FAQ headings and copy include intent-specific question patterns tied to calculator behavior.
  - Failure conditions: Content targets only broad generic terms and misses clear question-based intent coverage.
- **UR-SEO-054 (P0):** For routes explicitly designated as "Snippet Hub" in requirement/release scope, content depth must be `1500+` words and include multiple answer blocks, images with descriptive alt text, and coverage of multiple related questions on one page.
  - Acceptance criteria: Snippet Hub designation evidence exists and all depth/structure/image-alt requirements pass.
  - Failure conditions: Designated Snippet Hub route missing depth threshold, answer-block density, alt text, or related-question coverage.
- **UR-SEO-055 (P0):** For any new URL or URL-path change in release scope, calculator URLs must remain short, human-readable, and limited to `1-3` subfolders (example: `/loan-calculators/mortgage-overpayment-calculator/`).
  - Acceptance criteria: Introduced/changed route path is clean, concise, and within depth limit.
  - Failure conditions: New/changed URL path is long, messy, or exceeds approved depth without explicit HUMAN approval.

---

## 8) Testing Governance

### 8.1 Canonical Suites

- **UR-TEST-001 (P0):** Unit: `npm run test`.
- **UR-TEST-002 (P0):** E2E: `npm run test:e2e`.
- **UR-TEST-003 (P1):** ISS-001: `npm run test:iss001` (layout stability).
- **UR-TEST-004 (P0):** FAQ schema guard.
- **UR-TEST-005 (P0):** CWV Guard: `test:cwv:target` (Targeted) or `test:cwv:all` (Global). (Fail if: CLS > 0.10, LCP > 2.5s).
- **UR-TEST-006 (P0):** Artifact: `test-results/performance/cls-guard-all-calculators.json`.
- **UR-TEST-007 (P0):** Structured-data dedupe guard: `npm run test:schema:dedupe`.
- **UR-TEST-008 (P0):** `test:schema:dedupe` must support scope modes: `full-repo`, `cluster`, `single-calculator`, and optional `route`.
- **UR-TEST-009 (P0):** `test:schema:dedupe` is mandatory for schema-dedupe maintenance releases; parse errors or unresolved duplicates are hard fail.

### 8.2 Change-Type Matrix

- **UR-TEST-010 (P0):** New Calc: Unit + Route E2E + SEO + Schema + ISS-001.
- **UR-TEST-011 (P1):** Compute: Unit. E2E optional.
- **UR-TEST-012 (P0):** Nav/Shell: Nav E2E + ISS-001.
- **UR-TEST-013 (P0):** Finance/Trigger: Button-only regression.
- **UR-TEST-014 (P0):** Feature Release: Targeted CWV guard (`TARGET={scope}`). Global Release: All-calc CWV guard.
- **UR-TEST-015 (P0):** Release mode `SCHEMA_DEDUPE_MAINTENANCE`: mandatory gate is `npm run test:schema:dedupe`; other global gates are optional unless promoted by HUMAN.
- **UR-TEST-016 (P0):** Release modes `NEW_BUILD`, `ONBOARDING`, and `REDESIGN` must follow the release-scope matrix in `RELEASE_CHECKLIST.md`: cluster/calculator releases run scoped gates (`test:cluster:*`, `test:calc:*`, scoped `test:schema:dedupe`, plus required cluster-contract/isolation checks), while explicit full-site releases run the global suite (`lint`, `test`, `test:e2e`, `test:cwv:all`, `test:iss001`, `test:schema:dedupe`).

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
- **UR-TEST-036 (P0):** `calc_exp` and `exp_only` route tests must assert required explanation section presence/order (`Intent-led H2` -> `How to Guide` -> FAQ -> `Important Notes`) with `Important Notes` as final section, plus required key lines (`Last updated`, `Accuracy`, disclaimer, `Assumptions`, `Privacy`).
- **UR-TEST-037 (P0):** If a route includes graphs/charts, tests must assert graph readability basics: labeled axes, legible legend, and no horizontal overflow at mobile width.
- **UR-TEST-038 (P0):** Graph route tests must assert period-0 data correctness (no synthetic start spike) and tooltip clamping inside chart container.
- **UR-TEST-039 (P0):** Table route tests must assert fixed viewport height + internal scroll behavior, and heading/toggle same-row contract on desktop width.

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
- **UR-TEST-050 (P0):** Scoped calculator CWV budgets are enforced by `config/testing/CWV_SCOPED_BUDGETS.json`; defaults are `CLS <= 0.10`, `LCP <= 2500ms`, and render-blocking CSS duration `<= 800ms`.
- **UR-TEST-051 (P0):** Render-blocking CSS budget breach in any strict profile is a hard fail for calculator release (`test:calc:cwv`).
- **UR-TEST-052 (P0):** Scoped CWV artifact is mandatory evidence: `test-results/performance/scoped-cwv/{cluster}/{calc}.json`.
- **UR-TEST-053 (P0):** Thin-content scorer command is mandatory and must support scope modes: `npm run test:content:quality -- --scope=full|cluster|calc|route [--route=/path/]`.
- **UR-TEST-054 (P0):** Scoped SEO commands must execute thin-content scoring after Playwright SEO specs: `test:calc:seo` runs scope `calc`; `test:cluster:seo` runs scope `cluster`.
- **UR-TEST-055 (P0):** Thin-content scoped calc artifact is mandatory evidence path: `test-results/content-quality/scoped/{cluster}/{calc}.json`.
- **UR-TEST-056 (P0):** Thin-content scorer behavior is mode-driven: `soft` mode records warnings without blocking; `hard` mode blocks on score `<70` or any hard flag.
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
- **UR-TEST-LH-011 (P0):** Policy precedence is mandatory: defaults from `config/testing/lighthouse_policy.json`, then allowed environment overrides, then explicitly permitted CLI flags. Summary JSON must include `runPolicy.resolved`.
- **UR-TEST-SCOPE-001 (P0):** PR Lighthouse gates must use exactly one `TARGET_ROUTE` or policy-approved golden set; full-site Lighthouse scans are disallowed in PR release gates by default.

### 8.7 Testing Efficiency and Code-Diff Strategy

- **UR-TEST-EFF-001 (P0):** Code-diff strategy is mandatory for testing-tooling changes: no broad refactor/reorganization and no function/file renames unless explicitly approved.
- **UR-TEST-EFF-002 (P0):** New testing-tool behavior must be flag-driven and default-safe; when flags are unset, approved baseline behavior must remain intact.
- **UR-TEST-EFF-003 (P1):** Slow checks must remain opt-in by default outside full-audit mode (e.g., mixed-content scanning via `LH_SCAN_MIXED_CONTENT=1`).
- **UR-TEST-EFF-004 (P1):** Local run-time optimizations may use `LH_ASSUME_SERVER_RUNNING=1` and `LH_WARMUP_RUN=1` when allowed by policy and declared in release evidence.
- **UR-TEST-EFF-005 (P0):** Release/perf gate operation must use policy modes (`fast`, `stable`, `full`) with explicit `LH_MODE`, `LH_RUNS`, categories, and aggregation declaration.
- **UR-TEST-EFF-006 (P1):** Test-efficiency changes should record before/after runtime evidence for target route(s) to track CI time and cost impact.
- **UR-TEST-EFF-007 (P0):** If rationale documents conflict with runtime policy, `config/testing/lighthouse_policy.json` and `UR-TEST-LH-*` rules take precedence.

### 8.8 Port Governance for Local/CI Test Servers

- **UR-DEV-PORT-001 (P1):** All scripts that start local web servers for tests/audits must use governed port policy from `config/ports.json` (fixed policy port or approved managed range allocation).
- **UR-DEV-PORT-002 (P0):** Automation must not hardcode unmanaged startup ports for Playwright/Lighthouse/scoped CWV flows; port selection must be policy-driven.
- **UR-DEV-PORT-003 (P0):** Managed dynamic pool size must not exceed `maxManagedPorts` (currently 200) in `config/ports.json`.
- **UR-DEV-PORT-004 (P0):** Port lease lifecycle is mandatory for automation (`acquire` before run, `release` after run/failure) with stale-lease cleanup support.
- **UR-DEV-PORT-005 (P0):** Fixed admin port `8000` is reserved for manual/admin use. If a requested fixed/preferred port is busy, automation must fall back to the approved dynamic range and emit conflict diagnostics (requested port, PID, process, selected fallback).

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

- **Folder Map:** `requirements/universal-rules/README.md`
- **Build Guide:** `requirements/universal-rules/CALCULATOR_BUILD_GUIDE.md`
- **Schema Dedupe Reference:** `requirements/universal-rules/reference/SCHEMA_DEDUPE_GUARDRAIL.md`
- **Nav:** `requirements/site-structure/calculator-hierarchy.md`
- **Comp:** `requirements/compliance/`
- **Gen:** `scripts/generate-mpa-pages.js`
- **LH Policy:** `config/testing/lighthouse_policy.json`
- **Archived Legacy Notes (non-authoritative):** `requirements/universal-rules/archive/legacy-notes/`

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

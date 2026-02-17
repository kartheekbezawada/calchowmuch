# Universal Requirements — Single Source of Truth

## Document Metadata

- **Status:** Authoritative (sole active governance file)
- **Scope:** All public routes, calculator modules, shared shell, SEO/testing/release gates
- **Canonical Path:** `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md`
- **Version:** 3.6 (Lighthouse policy-as-code + scoped gate governance)
- **Last Updated:** 2026-02-17

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

---

## 3) MPA Navigation and Architecture

- **UR-NAV-001 (P0):** Calculator navigation must use static `<a href>` links and full page reloads.
- **UR-NAV-002 (P0):** SPA routing for calculator navigation is not allowed.
- **UR-NAV-003 (P0):** Navigation hierarchy must align with `requirements/site-structure/calculator-hierarchy.md`.
- **UR-NAV-004 (P0):** Live calculators must exist in `public/config/navigation.json` for nav visibility.
- **UR-NAV-005 (P0):** Layout shell owns shared regions; calculator-specific compute logic must stay in calculator modules.
- **UR-NAV-006 (P1):** Shared utility logic belongs in `/public/assets/js/core/`; avoid duplication in route modules.

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

### 3.4 Archetype Behavior Matrix

- **`calc_exp`:** Calc Pane (Req) + Exp Pane (Req). Layout: `single` or `split`.
- **`calc_only`:** Calc Pane (Req) + Exp Pane (Omitted). Layout: `single`.
- **`exp_only`:** Calc Pane (Omitted) + Exp Pane (Req). Layout: `single`.
- **`content_shell`:** Calc Pane (Omitted) + Exp Pane (Omitted). Layout: `single`.

---

## 4) Theme and UI Core

### 4.1 Theme Tokens and Defaults

- **UR-UI-001 (P0):** Premium-dark is the global default theme for shell/content/calculator surfaces.
- **UR-UI-002 (P0):** Shared theme tokens are mandatory; ad-hoc route palettes are not allowed.
- **UR-UI-003 (P0):** Theme is loaded once globally via shared base stylesheet; per-page duplicate theme link tags are disallowed.

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
- **UR-CSS-002 (P0):** Shared layout rules must be sourced from `/assets/css/shared-calculator-ui.css`; delivery may be direct `<link>` or generated route bundle, never `@import`.
- **UR-CSS-003 (P0):** Generator manages shared CSS delivery links (direct shared link or route bundle); source HTML must NOT add shared CSS links/imports.
- **UR-CSS-004 (P0):** `calculator.css` contains **only page-specific overrides**.
- **UR-CSS-005 (P0):** CSS load/concat order must remain: `theme` -> `base` -> `layout` -> `calc` -> `shared-ui` -> `style`.
- **UR-CSS-006 (P0):** Do NOT copy CSS from other calculators (e.g., Home Loan). Use shared rules + overrides.
- **UR-CSS-007 (P1):** Blocking budget: ≤ 5 `<link>` tags for standard routes; approved route-bundle routes require exactly 1 blocking stylesheet link.
- **UR-CSS-008 (P0):** `npm run validate` fails on any `@import`.
- **UR-CSS-009 (P1):** Route-bundle manifests must map route -> hashed CSS output and declare ordered source files used to build each bundle.

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

### 8.5 Lighthouse Efficiency + Determinism Governance

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
- **UR-ADS-002 (P0):** Loader centralized in shared generation logic.
- **UR-ADS-003 (P0):** Max one loader per page.
- **UR-ADS-004 (P0):** Env vars deprecated. Code always present.
- **UR-ADS-005 (P0):** Attributes must match canonical snippet.

### 11.2 Ad Pane Slot (MANDATORY)

- **UR-ADS-010 (P0):** `.ads-column` must render controlled `<ins>` slot.
- **UR-ADS-011 (P0):** No placeholder text.
- **UR-ADS-012 (P0):** Slot source from shared reusable logic.
- **UR-ADS-013 (P1):** Mobile safety: `.ads-column` hidden at max-width 860px (unless overridden).

### 11.3 Controlled Injection Policy

- **UR-ADS-020 (P0):** Auto Ads body injection PROHIBITED for calculator shell.
- **UR-ADS-021 (P0):** No body-level loader duplication.
- **UR-ADS-022 (P1):** Injection must be idempotent.
- **UR-ADS-023 (P1):** Snippet docs are for reference only.

### 11.4 Manual Smoke Validation

- **UR-ADS-030 (P1):** Confirm: Loader in `<head>`, Slot in `.ads-column`.
- **UR-ADS-031 (P1):** Document smoke notes for shell changes.

---

## 12) Sitemap and Crawlability

- **UR-SMAP-001 (P0):** Live calc routes must contain human-readable `/sitemap/`.
- **UR-SMAP-002 (P0):** Live = nav-visible or publicly reachable.
- **UR-SMAP-003 (P0):** Source from shared nav.
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

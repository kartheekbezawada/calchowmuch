# Release Checklist — CalcHowMuch.com

> [!IMPORTANT]
> **Goal: 1 Million Unique Users / Month | 5 Million Page Views / Month | AdSense Revenue | Zero Google Penalties**

RELEASE CHECKLIST — CalcHowMuch.com (TOP 1% DOMINANCE EDITION)

Purpose: One release gate for every change that can impact SEO, Core Web Vitals, AdSense, or UX stability.
Rule: Every HARD item must pass before merge/release.

0. Release Header (REQUIRED)

Release ID: RELEASE-YYYYMMDD-XXX

Owner: {NAME}

Date: {YYYY-MM-DD}

Change Type (pick one): CLUSTER_ROUTE | CLUSTER_SHARED | IMMUTABLE_CORE | INFRA
Legacy alias accepted during transition: SINGLE_CALCULATOR -> CLUSTER_ROUTE, CATEGORY -> CLUSTER_ROUTE, GLOBAL_SHARED -> CLUSTER_SHARED

Release Mode (pick one): SCHEMA_DEDUPE_MAINTENANCE | NEW_BUILD | ONBOARDING | REDESIGN | STANDARD

Primary Target Route (MANDATORY): {ROUTE_SLUG}
Example: /finance/present-value-of-annuity/

0.1 Release Mode Gate Matrix (HARD)

`SCHEMA_DEDUPE_MAINTENANCE`

HARD: Mandatory gate is `npm run test:schema:dedupe`.

HARD: Other global gates (`npm run lint`, `npm run test`, `npm run test:e2e`, `npm run test:cwv:all`, `npm run test:iss001`) are optional unless HUMAN explicitly promotes them.

`NEW_BUILD | ONBOARDING | REDESIGN`

HARD: Full release gates are mandatory:

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run test:cwv:all`
- `npm run test:iss001`
- `npm run test:schema:dedupe`

1. HARD vs SOFT Policy (DO NOT EDIT)
   HARD (Blocks Release)

If any HARD item fails → STOP → fix → re-run gates.

SOFT (Release Allowed With Follow-up)

SOFT items can ship only if:

No HARD failures exist, AND

The SOFT item is recorded in sign-off with a follow-up ticket.

2. Scope Rules (MANDATORY)
   2.1 Scope declaration

HARD: List exact routes affected (1+), plus exact files to be changed before coding.

HARD: If the file list changes, scope must be re-declared in the PR/agent log.

2.2 Scope expansion rule

HARD: If a failure occurs outside declared scope, do NOT widen scope silently.

Either fix only if it is a shared root cause introduced by this change, OR

Raise a follow-up ticket.

HARD: MPA generation must be scope-targeted by default (`TARGET_ROUTE` or `TARGET_CALC_ID`). Full-site generation is allowed only with explicit release intent (`--all` / `GENERATE_ALL_ROUTES=1`).

- [ ] **UI changes require approval**: new inputs/controls/UX elements must be approved before implementation.
- [ ] **File change preview**: confirm intended file list before edits; if it changes, re-confirm.

2.3 Cluster Isolation Governance Checks (HARD)

HARD: Ownership validation passes (`config/clusters/route-ownership.json`): every released route appears exactly once with valid owner and calculator identity.

HARD: HTML isolation fence passes for released routes: only owner-cluster assets (`/assets/clusters/<owner>/...`) plus immutable core (`/assets/core/v{n}/...`) are referenced.

HARD: Import graph guard passes: JS/CSS imports must not escape owner cluster scope except immutable core.

HARD: Manifest integrity passes: every referenced asset exists and resolves under allowed prefixes only.

HARD: Global navigation parity passes: required global destination fields in `clusters/<cluster-id>/config/navigation.json` match policy spec.

HARD: Rollback contract presence passes for all changed routes: `activeOwnerClusterId`, `previousOwnerClusterId`, `rollbackTag`.

HARD: New cluster/category onboarding must include full contract compliance (`config/clusters/cluster-registry.json`, route ownership entries, cluster nav, cluster asset manifest, isolation fence evidence).

HARD: Homepage discoverability contract must pass for onboarding/cluster changes: clusters with `showOnHomepage !== false` must render on `/` via registry + governed route sources, and `showOnHomepage` intent must be explicitly set/validated in registry updates.

3. TESTING POLICY — DEFAULT = ONE CALCULATOR (MANDATORY)

Goal: Avoid universal tests touching every calculator.
Default: Test exactly one calculator route — the route you changed.

3.1 Required test scope selection (pick one)

A) SINGLE_CALCULATOR (default, 95% of changes)

Scope = exactly 1 route: {ROUTE_SLUG}

B) CATEGORY (only if changes affect multiple calculators in one category)

Scope = CATEGORY_SET:{category} (e.g., finance)

C) CLUSTER_SHARED (only if one change intentionally affects multiple routes/clusters via approved shared contract updates)

Scope = GOLDEN_SET (fixed small set of representative routes)

D) INFRA (only for build tooling, caching, deployments)

Scope = GOLDEN_SET + 1 real page from top-traffic category

3.1.1 Scoped command matrix (HARD)

HARD: Cluster releases must use only scoped cluster commands:

- `CLUSTER={cluster} npm run test:cluster:unit`
- `CLUSTER={cluster} npm run test:cluster:e2e`
- `CLUSTER={cluster} npm run test:cluster:seo`
- `CLUSTER={cluster} npm run test:cluster:cwv`

HARD: Single-calculator releases must use only scoped calculator commands:

- `CLUSTER={cluster} CALC={calculator} npm run test:calc:unit`
- `CLUSTER={cluster} CALC={calculator} npm run test:calc:e2e`
- `CLUSTER={cluster} CALC={calculator} npm run test:calc:seo`
- `CLUSTER={cluster} CALC={calculator} npm run test:calc:cwv`

HARD: Scoped runs must fail fast for missing/invalid `CLUSTER` / `CALC`.

HARD: Global commands (`npm run test`, `npm run test:e2e`, `npm run test:cwv:all`, `npm run test:iss001`) are reserved for full-site releases only.

HARD: Grouped scoped wrappers may be used as additive optimizations while legacy scoped commands remain available for rollback:

- `CLUSTER={cluster} npm run test:cluster:playwright`
- `CLUSTER={cluster} CALC={calculator} npm run test:calc:playwright`

HARD: Grouped scoped runs must emit machine-readable summary evidence:

- `test-results/playwright/<scope>/<timestamp>/playwright-all.summary.json`

3.1.2 Calculator Release Type (HARD)

Release Type: `CLUSTER_ROUTE_SINGLE_CALC`

Required scope lock fields:
- `CLUSTER={cluster}`
- `CALC={calculator}`
- `ROUTE={route}`

HARD: `CLUSTER_ROUTE_SINGLE_CALC` releases must run only scoped gates:
- `test:cluster:*`
- `test:calc:*`
- `test:isolation:scope`
- `test:cluster:contracts`

HARD: Do not run global full-site suites by default for this release type.

HARD: Attach scoped CWV artifact path in sign-off:
- `test-results/performance/scoped-cwv/{cluster}/{calculator}.json`

3.1.3 Pane Layout Contract (HARD)

Applies to `CLUSTER_ROUTE_SINGLE_CALC` and cluster migration releases.

HARD: If target route uses `routeArchetype=calc_exp`, navigation contract must declare:
- `paneLayout: "single"`

HARD: Generated route must render combined single-pane contract for `calc_exp`:
- `panel-span-all`
- `calculator-page-single`

HARD: `paneLayout: "split"` on any touched target route is release fail.

HARD: Sign-off evidence must include path + snippet proof from:
- `public/config/navigation.json`
- generated route HTML (`public/<route>/index.html`)

3.1.4 Structured Data Dedupe Gate (HARD)

HARD: Structured-data dedupe command contract:

- `npm run test:schema:dedupe -- --scope=full` (full repo)
- `CLUSTER={cluster} npm run test:schema:dedupe -- --scope=cluster` (cluster scope)
- `CLUSTER={cluster} CALC={calculator} npm run test:schema:dedupe -- --scope=calc` (single calculator)
- `npm run test:schema:dedupe -- --scope=route --route=/path/` (optional single route)

HARD: If no explicit scope argument is provided, default scope is full repo.

HARD: Fail release on parse errors or unresolved duplicates for `FAQPage`, `BreadcrumbList`, `SoftwareApplication`.

HARD: Dedupe run must emit both report artifacts at repository root:

- `schema_duplicates_report.md`
- `schema_duplicates_report.csv`

Policy source: `requirements/universal-rules/SCHEMA_DEDUPE_GUARDRAIL.md`.

3.2 HARD rule: universal “all calculators” runs are not allowed by default

HARD: Performance tests must not crawl every calculator by default.

HARD: If the test harness currently touches all calculators automatically, it must be refactored to accept an explicit route list.

3.3 Implementation requirement for test scripts (HARD)

HARD: npm run test:cwv must require an explicit target input:

TARGET_ROUTE=/finance/present-value-of-annuity/ (single)

TARGET_SET=finance (category)

TARGET_SET=golden (cluster shared)

If no target is provided → FAIL FAST.

3.4 Golden Set (CLUSTER_SHARED) — fixed list (REQUIRED)

Define a small representative set (10–20 max) that covers:

2-column calculator UI

1-column mobile layout

slider-heavy calculator

table-heavy results

long FAQ page

at least one page per major category

Store at: compliance/golden_routes.json

3.5 Lighthouse Mode Matrix (MANDATORY)

HARD: The selected Lighthouse mode must be declared in release evidence and must match policy.

FAST Gate (PR default)

- `LH_MODE=fast`
- `LH_CATEGORIES=performance`
- `LH_RUNS=1`
- `LH_SCAN_MIXED_CONTENT=0`
- `LH_ASSUME_SERVER_RUNNING=1`

STABLE Pre-release

- `LH_MODE=stable`
- `LH_CATEGORIES=performance`
- `LH_RUNS=3`
- `LH_WARMUP_RUN=1`
- `LH_SCAN_MIXED_CONTENT=0`

FULL Weekly Audit (track-only)

- `LH_MODE=full`
- `LH_CATEGORIES=performance,accessibility,best-practices`
- `LH_RUNS=1`
- `LH_SCAN_MIXED_CONTENT=1`

HARD: `config/testing/lighthouse_policy.json` is the canonical runtime policy source.

3.6 Test Tooling Diff-Discipline Checks (HARD for tooling changes)

Applicable when change touches Lighthouse/CWV tooling, policy wiring, or test execution scripts.

HARD: Changes must be small-diff (no broad refactor/restructure/renames) unless explicitly approved in scope.

HARD: New behavior must be env-flag-driven and default-safe, with no implicit release gate behavior drift.

HARD: Release evidence must declare selected mode and optional flags used (`LH_SCAN_MIXED_CONTENT`, `LH_ASSUME_SERVER_RUNNING`, `LH_WARMUP_RUN`, `LH_DESKTOP_THROTTLING`).

HARD: `stable` pre-release mode requires `LH_RUNS=3` with median aggregation.

SOFT: Include before/after runtime note for target route(s) when efficiency-oriented tooling changes are introduced.

3.7 Port Governance Checks (HARD for server-start tooling changes)

Applicable when change touches Playwright webServer startup, Lighthouse target runner, scoped CWV server startup, or related execution wrappers.

HARD: Managed port policy file exists and is canonical:
- `config/ports.json`

HARD: New/changed server-start commands must be policy-driven (fixed policy port or approved managed range allocation); unmanaged hardcoded ports are disallowed.

HARD: Automation must not consume fixed admin port `8000` by default.

HARD: Release evidence must include port lease lifecycle proof (acquire + release) and conflict diagnostics when fallback occurs (requested port, PID, process, selected fallback).

4. Pre-Release Command Gate (MANDATORY)

HARD: npm run validate passes (lint + format + unit tests + css-import lint).

HARD: No runtime CSS @import anywhere.

HARD (route-bundle pilots): `npm run build:css:route-bundles && npm run verify:css:route-bundles`.

5. CRITICAL RENDERING PATH GUARD — HARD (TOP 1% RULE)

Objective: Calculator hero and primary inputs must render immediately without waiting for external CSS.

5.1 Blocking CSS Budget — STRICT

HARD: Preferred blocking stylesheets: 0

HARD: Maximum blocking stylesheets: 1

HARD: Approved route-bundle pilot routes must use inline critical CSS + deferred full bundle.
Blocking CSS count target: 0.
Fallback allowance: 1 tiny blocking critical stylesheet only (with justification).

Approved finance route-bundle pilot routes:

- `/finance/present-value/`
- `/finance/future-value/`
- `/finance/future-value-of-annuity/`
- `/finance/present-value-of-annuity/`

HARD: Emergency ceiling: 2 (requires written justification + screenshots)

If >2 blocking CSS files → HARD FAIL

5.2 Blocking time budget (Mobile lab)

HARD: Total blocking CSS (download + parse) ≤ 800ms

HARD: 800–1000ms allowed only with justification + mitigation plan

HARD: >1000ms → HARD FAIL

5.3 Mandatory Critical CSS Inlining

HARD: Inline critical above-the-fold CSS inside <head><style>...</style></head>

HARD: Page remains structurally correct if external CSS is disabled (header + hero + calculator shell still usable)

HARD: No blank screen waiting for CSS

HARD: No FOUC that changes layout geometry of hero/inputs

Critical CSS MUST include only:

:root variables needed above fold

base reset required for layout geometry

header shell structure

calculator hero/container + input-row skeleton

H1 typography above the fold

Critical CSS MUST NOT include:

full theme styling

FAQ/explanation/footer styles

hover effects, animations

below-the-fold layout rules

5.4 Non-critical CSS Deferral — mandatory pattern

For non-bundle routes, all non-critical CSS must use:

<link rel="stylesheet" href="/path/to/style.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="/path/to/style.css"></noscript>

For approved route-bundle pilot routes, emit:

- inline critical CSS block (`<style data-route-critical="true">`)
- deferred full route bundle link (`media="print"` + `onload`)
- `<noscript>` blocking fallback for the full bundle

5.5 Render-blocking detection gate (DevTools/Lighthouse)

HARD: No unexpected render-blocking requests besides allowed blocking CSS

HARD: For route-bundle pilot routes in inline-critical mode, render-blocking CSS count must be 0
(or 1 tiny blocking critical stylesheet when fallback mode is documented).

HARD: No CSS dependency chains

HARD: Lighthouse “Eliminate render-blocking resources” estimated savings:

> 800ms → HARD FAIL

300–800ms → SOFT (must investigate)

<300ms → OK

5.6 Above-the-fold mutation guard (Automation)

HARD: No DOM insertions above the fold after initial load baseline.

Run: TARGET_ROUTE={route} npm run test:above-fold

6. Layout Stability Guard (CLS) — HARD

HARD: No visible layout shift during:

initial load

results/table render

FAQ/explanation render

nav open/close

ad fill/no-fill

font load

HARD: Reserve space using min-height/placeholders for:

ad slots

result tables

explanation + FAQ sections (if they expand)

icons/images

Release thresholds (target):

HARD: CLS ≤ 0.10 (P75 target)

HARD: Any single shift > 0.05 → HARD FAIL

7. Interaction Guard (INP risk) — HARD

HARD: No long tasks (>50ms) on input/slider interaction path

HARD: Slider drag stress test (10 seconds) remains smooth

HARD: No layout thrash on input events

HARD: Non-essential scripts deferred/lazy-loaded

8. Performance Targets — HARD (LAB GATE)
   8.1 Mobile lab profile (required)

Device: 375×667

CPU: 4× slowdown

Network: Slow 3G

8.2 Desktop lab profile (required)

1280×720, no throttling

8.2.1 Lighthouse execution policy (required)

HARD (Mobile): Explicit `--form-factor=mobile` and `--throttling-method=devtools` required.

HARD (Desktop default): Native desktop preset policy with `--form-factor=desktop` and `--screenEmulation.disabled`.

HARD (Desktop override): `LH_DESKTOP_THROTTLING=devtools` is allowed only when documented in sign-off evidence.

8.3 Pass/Fail thresholds (lab proxy)

HARD: LCP ≤ 2500ms

HARD: Mobile FCP ≤ 1800ms

HARD: INP proxy ≤ 200ms

HARD: CLS ≤ 0.10

9. CWV Guard Automation — HARD (SCOPED ONLY)
   9.1 Run scoped CWV guard

HARD (calculator release): `CLUSTER={cluster} CALC={calculator} npm run test:calc:cwv`

HARD: Scoped CWV run must execute both strict first-time-user profiles with cache disabled:
- `mobile_strict`: CPU 3x + Slow 4G
- `desktop_strict`: CPU 6x + Slow 4G

HARD: Render-blocking CSS budget must pass in strict CWV artifact:
- blocking CSS duration <= 800ms
- blocking CSS request count <= configured threshold

Produces (mandatory evidence): `test-results/performance/scoped-cwv/{cluster}/{calculator}.json`

HARD: PR gates must pass exactly one `TARGET_ROUTE` or policy-approved `GOLDEN_SET` routes.

HARD: Full-site Lighthouse/CWV scans are disallowed in PR gates by default.

9.2 Regression rules

HARD: CLS regression >20% vs baseline for the same route → FAIL

HARD: LCP regression >30% vs baseline → FAIL

9.3 Full-site runs (optional, never default)

SOFT/OPTIONAL: npm run test:cwv:all

Only allowed if change type = INFRA and release owner requests it.

9.4 Weekly FULL audit handling (track-only)

SOFT: Weekly FULL audit failures create/update tracking issue using policy noise controls.

SOFT: Weekly FULL audit failures are non-blocking for release unless separately promoted to HARD by human decision.

10. Ads & AdSense Compliance — HARD
    10.1 Slot reservation (CLS prevention)

HARD: Each ad slot has breakpoint-specific min-height

HARD: Slot never collapses to 0 height on load/no-fill

HARD: Ad scripts load after initial calculator render (idle)

10.2 Mobile policy

HARD: No ads above the calculator H1 on mobile

HARD: Max 1 ad visible above-the-fold on mobile

HARD: Ads never overlap inputs/results or controls

10.3 Loader correctness

HARD: Exactly one AdSense loader script in <head>

HARD: Loader snippet must match canonical contract:
`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1063975431106361" crossorigin="anonymous"></script>`

HARD: Body ad unit snippet must match controlled contract:
`<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-1063975431106361" data-ad-slot="3901083802" data-ad-format="auto" data-full-width-responsive="true"></ins>`
and slot activation `(adsbygoogle = window.adsbygoogle || []).push({});` must execute once per slot.

HARD: Canonical snippet rationale files are archived under `requirements/universal-rules/Archive Rules/`; release validation must enforce governance contracts, not ad-hoc snippet variants.

11. Mobile & Tablet UX — HARD
    11.1 Layout

HARD: Mobile = single column calculator layout

HARD: No horizontal overflow at 375px or 768px

HARD: Tap targets ≥ 48×48px

Automation: TARGET_ROUTE={route} npm run test:mobile:ux

Evidence: mobile screenshot + tap target checks (Playwright snapshots)

11.2 Inputs

HARD: Numeric inputs use inputmode="decimal"/numeric

HARD: min/max/step present where applicable

11.3 Navigation

HARD: Subcategories collapsed by default

HARD: Direct-entry page opens only its own category/subcategory

HARD: Nav toggle causes zero CLS

12. Accessibility — HARD

HARD: Keyboard navigable (Tab/Shift+Tab/Enter/Space)

HARD: Visible focus states

HARD: Results container uses aria-live="polite"

HARD: Works at 200% zoom without horizontal overflow

Automation: TARGET_ROUTE={route} CHROME_PATH=/snap/bin/chromium npm run test:lighthouse:target
Note: Headless Chromium flags are defined in scripts/lighthouse-target.mjs (expects CHROME_PATH; uses --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage).

Automation: TARGET_ROUTE={route} npm run test:accessibility:ux

13. SERP Readiness — HARD
    13.1 Metadata integrity

HARD: Unique <title> and <meta name="description">

HARD: Exactly one <h1>

HARD: Correct absolute canonical URL

13.2 Structured data hygiene

HARD: Required JSON-LD present:

WebPage

SoftwareApplication

BreadcrumbList

HARD: FAQ parity (3-way match):

visible FAQ

JSON-LD FAQ

module metadata FAQ (if applicable)

HARD: Per-page uniqueness for target schema types is mandatory:

- `FAQPage` max 1
- `BreadcrumbList` max 1
- `SoftwareApplication` max 1

13.3 Indexability

HARD: Explanation + FAQs exist in initial HTML (not JS-only)

HARD: Page crawlable without JS

13.4 Calculator Content Structure (Intent-Led) — HARD

Applies to `calc_exp` and `exp_only` routes.

HARD: Output insight sections (for example totals, amortization tables, graphs, result cards) may appear before the required SERP explanation block. Default SERP block order remains unchanged unless route-level exception is explicitly approved.

HARD: Explanation heading must be intent-led (calculator purpose/topic), not generic labels like `Explanation` or `Calculator Explanation`.

HARD: Default required section order must be visible in initial HTML:
- Intent-led heading
- `How to Guide`
- `Important Notes`
- FAQ

HARD: If route-level order exception is used (for example `FAQ -> Important Notes`), release evidence must include:
- explicit HUMAN requirement statement
- exact route and approved order
- route test assertions proving that approved order

HARD: `Important Notes` must include `Last updated: <Month YYYY>`.

HARD: SERP guide + Important Notes style consistency must be validated for touched calculators:
- existing explanation card/container pattern reused (no new design system by default)
- guide typography baseline preserved (`H3 16px`, `H4 14px`, body/list `14px`) unless REQ override is approved
- font family inherited from calculator theme (no isolated font swap)
- heading/subheading colors reuse route accent token/color used by calculator data surfaces

HARD: FAQ count and visible FAQ content must remain schema-aligned.

13.4.1 Thin-Content Quality Scoring — HARD

Applies to `calc_exp` and `exp_only` routes.

HARD: Run thin-content scorer and attach artifact evidence:

- `npm run test:content:quality -- --scope=calc` for scoped calculator release
- `npm run test:content:quality -- --scope=cluster` for scoped cluster release

HARD: Weighted scoring model is fixed: `Core Value 40 + Depth 25 + Uniqueness 15 + Trust 10 + Structure 10`.

HARD: In `soft` mode, thin-content score warnings do not block release but artifact evidence is mandatory.

HARD: In `hard` mode, release fails when:

- score `<70`, or
- any hard flag is raised (`no interpretation`, `no worked example`, `explanation <150 words`, `similarity >80%`, `boilerplate FAQ`, `tool-only minimal context`).

13.5 Graph Readability (When Graph Exists) — HARD

HARD: Graph/chart must have readable axis labels with units/time basis where applicable.

HARD: Multi-series graphs must use legible legend labels and legend placement must not cover key data traces.

HARD: Text/labels/tooltips must remain readable on desktop and at 375px mobile width.

HARD: Graph area must not create horizontal overflow.

13.6 Sitemap

HARD: Route present in public/sitemap.xml

HARD: Regenerate sitemap after route changes

14. Security & Trust — MANUAL ANNEX (NON-BLOCKING)

Manual Annex: HTTPS only, no mixed content

Manual Annex: Privacy/Terms/Contact pages exist and are linked

Automation: TARGET_ROUTE={route} CHROME_PATH=/snap/bin/chromium npm run test:lighthouse:target
Note: Headless Chromium flags are defined in scripts/lighthouse-target.mjs (expects CHROME_PATH; uses --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage).

15. Post-Release Monitoring — REQUIRED

Within 24–72 hours:

HARD: Search Console coverage stable

HARD: No indexing anomalies for the released route(s)

SOFT: Monitor AdSense policy center

16. Sign-off Evidence — REQUIRED

Create: release-signoffs/RELEASE*SIGNOFF*{RELEASE_ID}.md

Must include:

Target scope chosen (single/category/golden) + justification

Routes tested list (exact)

Blocking CSS count + time (mobile)

Lighthouse render-blocking savings (ms)

Route-bundle manifest proof + single blocking CSS request evidence (pilot routes)

Lighthouse accessibility score + mixed content scan summary

LCP element selector + value (mobile + desktop)

CLS value + any shift screenshots if present

CWV guard artifact summary

Ads validation notes (mobile policy + no CLS)

AdSense loader snippet compliance proof (head snippet exact-match evidence)

Ad unit snippet compliance proof (`<ins>` attributes + single `push({})` activation)

SERP validation notes (canonical + schema + FAQ parity)

Intent-led content structure validation notes (default section order or approved route exception + `Last updated` evidence)

SERP guide/notes style consistency notes (typography baseline + font inheritance + heading/subheading color consistency)

Thin-content scoring notes (`thinContentMode`, score, grade, hard flags)

Thin-content artifact path (`test-results/content-quality/scoped/{cluster}/{calc}.json` or scoped cluster artifact path)

Graph readability validation notes (if graph exists)

Structured data dedupe run details (scope + command used + summary counts)

Structured data dedupe artifacts attached:
- `schema_duplicates_report.md`
- `schema_duplicates_report.csv`

Mobile UX artifacts (screenshots + tap target check results)

Above-the-fold mutation guard result

Accessibility UX automation (keyboard traversal + focus visibility + 200% zoom)

Interaction guard automation (long task + latency + nav stability)

Lighthouse mode used (`fast` | `stable` | `full`)

`LH_RUNS` value

Aggregation type (`single` | `median`)

Desktop policy mode (`native` | `devtools-override`)

Resolved policy snapshot (`runPolicy.resolved`) from Lighthouse summary

Test-tooling small-diff compliance declaration (required when tooling files changed)

Optional Lighthouse flags used (`LH_SCAN_MIXED_CONTENT`, `LH_ASSUME_SERVER_RUNNING`, `LH_WARMUP_RUN`, `LH_DESKTOP_THROTTLING`)

HARD: Missing any Lighthouse governance evidence field above = checklist failure.

17. Manual Annex (Non-Blocking)

These items require staging/prod or ad fill and are recorded as Manual Annex only.
They do not block local automation or checklist pass.

Annex items:

- Ads policy & placement (E1–E3, B3)
- HTTPS validation & mixed content in staging/prod (K)
- Caching headers (A5) — Cloudflare-managed

18. Release Decision Rules (FINAL)
    HARD BLOCKERS (DO NOT RELEASE)

Any HARD checkbox unchecked

CLS > 0.10 or single shift > 0.05

LCP > 2500ms (lab proxy) for target route

Render-blocking savings >800ms

Ads violate mobile policy or cause CLS

Missing explanation/FAQ in initial HTML

Test scope not explicitly declared

Missing Lighthouse governance evidence fields (`lighthouseMode`, `lhRuns`, `aggregationType`, `desktopPolicyMode`, `runPolicy.resolved`)

SOFT SIGNALS (Release allowed)

Minor Lighthouse dip with no CWV regressions

Minor visual polish issues not impacting layout geometry

Non-critical warnings recorded with follow-up ticket

Weekly FULL audit track-only issue open with no active HARD gate regression in release scope

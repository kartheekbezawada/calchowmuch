# 🚀 Release Checklist — CalcHowMuch.com

> [!IMPORTANT]
> **Goal: 1 Million Unique Users / Month | 5 Million Page Views / Month | AdSense Revenue | Zero Google Penalties**
>
> This is the single release gate. Every change touching layout, CSS, JS, navigation, calculators, explanation/FAQ, ads, fonts, or shared UI components **must pass every HARD item** before merge.

> [!NOTE]
> **Authoritative references:**
> - `UNIVERSAL_REQUIREMENTS.md` — rule IDs (UR-CSS-xxx, UR-SEO-xxx, UR-TEST-xxx)
> - `Project Bible.md` — strategy, design intent, AdSense safety
> - `AGENTS.md` — agent operating contract, document chain
> - Sign-off: `release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md`

---

## 📑 Table of Contents

- [A) Pre-Release (Dev) — Must Pass](#a-pre-release-dev--must-pass)
- [B) Mobile & Tablet Release Checks](#b-mobile--tablet-release-checks--must-pass)
- [C) Performance Metrics](#c-performance-metrics--must-pass)
- [D) CWV Guard (Global Automated Gate)](#d-cwv-guard-global-automated-gate--mandatory)
- [E) Ads & AdSense Compliance](#e-ads--adsense-compliance--must-pass)
- [F) Animation & Visual Effects](#f-animation--visual-effects--must-pass)
- [G) Manual Regression Scenarios](#g-manual-regression-scenarios--must-pass)
- [H) Accessibility](#h-accessibility--must-pass)
- [I) SERP Readiness](#i-serp-readiness--must-pass)
- [J) Content Quality](#j-content-quality--must-pass)
- [K) Security & Trust](#k-security--trust--must-pass)
- [L) CWV Guard — Test Commands](#l-cwv-guard--test-commands-must-pass)
- [M) Observability (Post-Release)](#m-observability-post-release)
- [N) Sign-off Evidence](#n-sign-off-evidence--required)
- [O) Release Decision Rules](#o-release-decision-rules)
- [Elite Performance Checklist (Addendum)](#elite-performance-checklist--calculator-pages-addendum)

---

## 🛠️ A) Pre-Release (Dev) — Must Pass

### A1) Above-the-fold rendering order
- [ ] Calculator UI renders immediately; ads must never block first render.
- [ ] Initial state/results visible without waiting for ad scripts, late CSS, or JS hydration.
- [ ] No runtime injection adds new content above the fold after load (ads/nav/banners).
- [ ] Above-the-fold content is present in initial HTML — no JS-required content for primary calculator UI.

### A2) CSS architecture (systemic CLS prevention) — refs: UR-CSS-001..008
> [!WARNING]
> **Hard rules:**
> - No runtime CSS `@import` anywhere. Must pass: `npm run lint:css-import`.
> - Shared UI styles delivered via direct `<link>` in `<head>`, not via `@import`. (UR-CSS-002)
> - Per-calculator CSS contains only page-specific overrides. (UR-CSS-004)
> - Do NOT copy CSS from another calculator. Shared rules come from `shared-calculator-ui.css`. (UR-CSS-006)

**Critical layout rule:**
- [ ] Layout-critical selectors (hero/grid/form panel/slider rows) must be present in earliest CSS.

**Render-blocking guidance:**
- [ ] Total blocking CSS budget: **≤ 5** `<link rel="stylesheet">` tags in `<head>`. (UR-CSS-007)
- [ ] Record blocking CSS list in sign-off (Section N).

### A3) Layout stability (CLS control)
- [ ] No visible layout shift when results/tables appear, FAQs/explanation render, nav opens/closes, ads load, or images/icons appear.
- [ ] Use reserved space (placeholders/min-height) to avoid shifts.
- [ ] Ad slot no-fill behavior must not cause layout shifts.

### A4) JavaScript discipline (INP protection)
- [ ] No heavy computation on input/slider events.
- [ ] No long tasks (>50ms) on the interaction path.
- [ ] Non-essential scripts are deferred/lazy-loaded.
- [ ] Rapid slider drags + fast typing remain smooth (test for 5–10s).

### A5) Caching readiness (Cloudflare + browser)
- [ ] Static assets are cacheable long-term using versioning.
- [ ] `Cache-Control` for static assets supports long caching; use `immutable` where appropriate.

---

## 📱 B) Mobile & Tablet Release Checks — Must Pass

> [!NOTE]
> **Mobile-first indexing:** mobile failures directly harm ranking.

### B1) Layout & navigation (375px / 768px)
- [ ] Mobile is single-column calculator layout.
- [ ] Burger/left navigation does not cause CLS.
- [ ] Tap targets are usable (≥48×48px) with adequate spacing.
- [ ] No horizontal overflow on any calculator page.

### B2) Inputs on mobile
- [ ] Numeric inputs show numeric keyboard (`inputmode="decimal"`/`numeric`).
- [ ] `min`/`max`/`step` provided where applicable.

### B3) Ads on mobile — refs: Project Bible §17
- [ ] **No ads above the calculator H1 on mobile.** (Hard rule)
- [ ] Ads do not overlap inputs/results or interactive elements.
- [ ] Ads do not resize after render in ways that cause CLS.

---

## 📊 C) Performance Metrics — Must Pass

> [!TIP]
> Pre-release: lab gates + regression prevention. Field (CrUX) data is authoritative after rollout.

### C1) Field targets (P75 — ranking-impacting)

| Metric | Good (P75) | Warning | Fail |
| :--- | :--- | :--- | :--- |
| **LCP** | ≤ 2.5s | 2.5–4s | > 4s |
| **FCP** | ≤ 1.8s | 1.8–3s | > 3s |
| **INP** | ≤ 200ms | 200–500ms | > 500ms |
| **CLS** | ≤ 0.10 | 0.10–0.25 | > 0.25 |

### C2) Lab gates (pre-release)
- [ ] **Desktop:** (1280×720, no throttling).
- [ ] **Mobile:** (375×667, CPU 4×, Slow 3G).

**Checks:**
- [ ] No visible layout shifts in filmstrip/trace.
- [ ] No long tasks near first interaction.
- [ ] Justify any resource on the critical path in DevTools.

---

## 🛡️ D) CWV Guard (Global Automated Gate) — Mandatory

> [!NOTE]
> refs: UR-TEST-005, UR-TEST-006, UR-TEST-014

### D1) Route scope
- [ ] All calculator routes from `public/config/navigation.json`.

### D2) Execution
- [ ] **Command:** `npm run test:cwv:all`.
- [ ] **Artifact:** `test-results/performance/cls-guard-all-calculators.json`.

### D3) Release policy
| Metric | HARD FAIL (Blocks Release) | SOFT WARNING (Investigate) |
| :--- | :--- | :--- |
| **CLS** | > 0.10 | 0.05 – 0.10 |
| **Single Shift**| > 0.05 | - |
| **LCP** | > 2500ms | 2000 – 2500ms |
| **INP Proxy** | > 200ms | 150 – 200ms |
| **Mobile FCP** | > 1800ms | 1500 – 1800ms |

### D4) Baseline regression policy
- [ ] Flag >20% CLS increase vs baseline.
- [ ] Flag median LCP > 30% above site median.

---

## 💰 E) Ads & AdSense Compliance — Must Pass

> [!CAUTION]
> AdSense policy violations will suspend revenue. Treat as critical.

### E1) Slot reservation (CLS prevention)
- [ ] Each ad slot reserves `min-height` per breakpoint.
- [ ] Slot never collapses to 0 height on load/no-fill.

### E2) Load timing & correctness
- [ ] Ads load after initial calculator render (`requestIdleCallback`).
- [ ] Exactly one AdSense loader `<script>` in `<head>`.

### E3) AdSense policy (hard rules)
- [ ] No ads above H1 on mobile.
- [ ] Max one ad unit visible above the fold on mobile.
- [ ] No ads that mimic calculator UI or overlap inputs/results.

---

## ✨ F) Animation & Visual Effects — Must Pass
- [ ] Use only `opacity`/`transform` for animations.
- [ ] No layout-property animations (`height`/`width`/`top`/`left`).
- [ ] Respect `prefers-reduced-motion`.

---

## 🔍 G) Manual Regression Scenarios — Must Pass

### G1) First load
- [ ] No visible jump or FOUC.
- [ ] Calculator usable within 3s on throttled mobile.

### G2) Interaction
- [ ] Rapid slider drag (5–10s): no lag.
- [ ] Mode toggles: no layout snap/reflow flicker.

### G3) Navigation
- [ ] Subcategories collapsed by default.
- [ ] Navigation uses full-page `<a href>` links.

---

## ♿ H) Accessibility — Must Pass
- [ ] Keyboard navigable (Tab/Shift+Tab/Enter/Space).
- [ ] `aria-live="polite"` on result containers.
- [ ] No `<select>` dropdowns for mode toggles — use button groups.
- [ ] Usable at 200% zoom without horizontal overflow.

---

## 🌐 I) SERP Readiness — Must Pass

> [!NOTE]
> refs: UR-SEO-001..031

### I1) Metadata integrity
- [ ] Unique `<title>` (35–61 chars) and `<meta name="description">` (110–165 chars).
- [ ] Exactly one `<h1>` per page.
- [ ] Correct absolute canonical URL.

### I2) Structured data hygiene
- [ ] Required schema: `WebPage`, `SoftwareApplication`, `BreadcrumbList`.
- [ ] FAQ three-place parity: JSON-LD ↔ module metadata ↔ visible FAQ.
- [ ] Validate via Rich Results Test.

### I3) Content indexability
- [ ] Explanation + FAQs in initial HTML (not JS-only).
- [ ] Page crawlable without JS.

### I4) Sitemap coverage (P0)
- [ ] Every route appears in `public/sitemap.xml`.
- [ ] Run `node scripts/generate-sitemap.js` after route changes.

---

## ✍️ J) Content Quality — Must Pass
- [ ] Explanation section present (formula, inputs, interpretation).
- [ ] At least one worked example or scenario table.
- [ ] FAQ section with 3+ realistic user questions.

---

## 🔒 K) Security & Trust — Must Pass
- [ ] Site served over HTTPS; no mixed content.
- [ ] Privacy policy, terms, and contact pages exist and are linked.

---

## ⌨️ L) CWV Guard — Test Commands (must pass)
- `npm run validate` — runs lint + lint:css-import + test + format:check.
- `npm run test:cwv:all` — CWV guard for all calculator routes.
- `npm run test:iss001` — Layout/shell stability.

---

## 👁️ M) Observability (Post-Release)
- [ ] 24–72 hours: Search Console coverage stable.
- [ ] Monthly: monitor AdSense policy center.

---

## ✅ N) Sign-off Evidence — Required

Record in `release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md`:
1. CWV guard artifact summary.
2. FCP/LCP/CLS/INP (mobile + desktop) per affected calculator.
3. DevTools "render-blocking resources" review.
4. LCP element selector/text.
5. Stress-mode trace screenshots.
6. SEO verification results.

---

## 🛑 O) Release Decision Rules

**HARD blockers (DO NOT RELEASE):**
- [ ] CWV guard hard fail.
- [ ] Ads violate AdSense/Better Ads rules or cause layout shifts.
- [ ] Interaction jank (INP risk).
- [ ] Metadata/canonical/schema integrity failures.
- [ ] Explanation/FAQ missing from initial HTML.

**SOFT signals (Release allowed with follow-up):**
- [ ] Minor Lighthouse dip with no CWV regressions.
- [ ] Minor visual polish issues.

---

## 🏆 Elite Performance Checklist — Calculator Pages (Addendum)

### X1) Render-Blocking Optimization (Hard Requirement)
**Objective:** Eliminate all render-blocking resources that delay First Contentful Paint (FCP) and Largest Contentful Paint (LCP).

#### [ ] 1. Inline Critical CSS
*   **Action:** Extract essential CSS required to render the "Above-the-Fold" content (Header, Hero Section, Calculator Inputs).
*   **Implementation:** Place this CSS directly into the `<head>` within a `<style>...</style>` block.
*   **Must Include:**
    *   CSS Variables (`:root { ... }` from `theme-*.css`).
    *   CSS Resets (`* { box-sizing: border-box }` from `base.css`).
    *   Layout Skeleton (`.page`, `.site-header`, `.layout-main` from `layout.css`).
    *   Hero/Input Styles (`.calculator-ui`, `.mtg-hero` from `shared-calculator-ui.css`).
    *   Typography for H1/H2 visible on load.
    *   **Verify:** The page looks "correct" (layout-wise) even if you disable external stylesheets.

#### [ ] 2. Defer Non-Critical Stylesheets
*   **Action:** Load all other CSS files asynchronously to prevent render blocking.
*   **Pattern:** Use the following HTML pattern for *every* external stylesheet that isn't critical:
    ```html
    <link rel="stylesheet" href="/path/to/style.css" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="/path/to/style.css"></noscript>
    ```
*   **Files to Defer:** `layout.css` (full), `shared-calculator-ui.css` (full), `base.css`, `theme-premium-dark.css`.

#### [ ] 3. Eliminate `@import`
*   **Action:** Search for `@import` in all CSS files using `grep -r "@import" public/assets/css`.
*   **Why:** `@import` causes sequential network requests (chains), delaying render.
*   **Fix:** Replace any `@import` with standard `<link>` tags in HTML or inline the rules directly.

#### [ ] 4. Preload Hygiene
*   **Action:** Use `<link rel="preload">` for high-priority resources discovered later in the waterfall.
*   **Targets:**
    *   Critical Fonts (e.g., `inter-v12-latin-700.woff2` if used in H1/Hero).
    *   Hero Images (if LCP element is an image).
*   **Code:** `<link rel="preload" href="..." as="font" type="font/woff2" crossorigin>`

### X2) Stress Validation (Mobile + Desktop)
**Objective:** Verify performance under constrained conditions to simulate real-world low-end devices.

#### [ ] 1. Configure DevTools
*   Open Chrome DevTools (`F12`).
*   Go to **Performance** tab.
*   Click **Capture Settings** (Gear icon at top right of pane).
*   **Network:** Set to `Slow 3G`.
*   **CPU:** Set to `4x slowdown`.

#### [ ] 2. Run Test & Analyze
*   Start profiling (Reload button).
*   Wait for profile to finish (~10-15s).
*   Locate **LCP** marker in the "Timings" track. Hover to read the exact time.

#### [ ] 3. Success Criteria
*   **Elite Target:** Stress LCP ≤ **2.5s**.
*   **Acceptable:** Stress LCP ≤ **3.0s** (Only if Normal LCP < 1.0s).
*   **Fail:** Stress LCP > 3.0s (Requires optimization).

#### [ ] 4. Documentation
*   Record the exact Stress LCP value (e.g., "2.64s") in the release sign-off document.

---

## 📝 Summary
Every item protects search traffic, revenue, and user trust. Follow strictly.

# Known Issues — Home Loan Calculator

> **Purpose**: Log resolved issues so future agents don't re-spend computation solving them.
> Each entry captures what broke, how it was diagnosed, and the exact fix applied.

---

## Issue Master Table

| Issue ID | Problem | Severity | Status | Resolution |
|:---------|:--------|:---------|:-------|:-----------|
| KI-001 | mpa-nav.js ESLint curly-brace errors | LOW | RESOLVED | Added curly braces to single-line if/else |
| KI-002 | Unit test import path wrong (2 levels vs 3) | LOW | RESOLVED | Changed `../../` to `../../../` |
| KI-003 | Summary card CLS — no min-height | MEDIUM | RESOLVED | Added `min-height: 80px` to `.mtg-summary-card` |
| KI-004 | Table scrollbar CLS — overflow:auto | MEDIUM | RESOLVED | Changed to `overflow-y: scroll` on `.table-scroll` |
| KI-005 | Forced reflow from void offsetWidth | LOW | RESOLVED | Replaced with `requestAnimationFrame` |
| KI-006 | CSS loading CLS vs LCP tradeoff (8 iterations) | HIGH | RESOLVED | Inline critical CSS + async full CSS + preload theme |
| KI-007 | base.css @import chain adds ~380ms | HIGH | RESOLVED | `<link rel="preload">` for theme-premium-dark.css |
| KI-008 | Title too long (61 chars, limit 60) | LOW | RESOLVED | Shortened to 53 chars |
| KI-009 | No visible parent category link | MEDIUM | RESOLVED | Added breadcrumb nav above H1 |
| KI-010 | @import in base.css causes CSS waterfall for all pages | HIGH | RESOLVED | Removed @import, added theme as direct `<link>` |
| KI-011 | Global calculator.css render-blocking on home-loan | MEDIUM | RESOLVED | Made async via preload+swap (critical CSS inlined) |
| KI-012 | MPA generator overwrites manually-optimized pages | HIGH | RESOLVED | Added MANUAL_PAGES skip set in generator |
| KI-013 | 3-deep CSS @import waterfall causes CLS 0.479 on 15 pages | CRITICAL | RESOLVED | Extracted shared CSS, removed all @import chains, added lint guard |

---

## Detailed Entries

### KI-001 — mpa-nav.js ESLint Curly-Brace Errors

**The Problem**: `npm run lint` failed with 2 ESLint `curly` rule violations in `public/assets/js/core/mpa-nav.js` at lines 26 and 33. Single-line `if`/`else` blocks without curly braces.

**Tests**: `npm run lint`

**How the issue is resolved**: Added curly braces `{}` around both single-line `if` and `else` blocks at lines 26 and 33 in `mpa-nav.js`.

---

### KI-002 — Unit Test Import Path Wrong

**The Problem**: `tests_specs/loans/unit/home-loan.test.js` used `../../public/assets/js/core/` (2 levels up) but the file is 3 levels deep from the project root.

**Tests**: `npx vitest run tests_specs/loans/unit/home-loan.test.js`

**How the issue is resolved**: Changed import from `../../public/assets/js/core/loan-utils.js` to `../../../public/assets/js/core/loan-utils.js` (3 levels up).

---

### KI-003 — Summary Card CLS (No min-height)

**The Problem**: `.mtg-summary-card` elements in the home loan results area have no min-height. When results populate, the cards expand from 0 height, causing a cumulative layout shift.

**Tests**: CLS guard stress mode (`CLS_GUARD_ROUTE_INCLUDE="/loans/home-loan/" npx playwright test e2e-cls-guard`)

**How the issue is resolved**: Added `min-height: 80px` to `.mtg-summary-card` in `public/calculators/loans/home-loan/calculator.css`. This reserves vertical space before content renders.

---

### KI-004 — Table Scrollbar CLS (overflow:auto)

**The Problem**: `.table-scroll` container used `overflow: auto`. When amortization table content exceeds the container width, the scrollbar appears dynamically, causing a layout shift as the scrollbar takes space.

**Tests**: CLS guard stress mode

**How the issue is resolved**: Changed `overflow: auto` to `overflow-y: scroll` on `.table-scroll` in `public/calculators/loans/home-loan/calculator.css`. The scrollbar gutter is always reserved, eliminating the appearance shift.

---

### KI-005 — Forced Reflow from void offsetWidth

**The Problem**: `public/calculators/loans/home-loan/module.js` used `void element.offsetWidth` to trigger animation restarts. Reading `offsetWidth` forces a synchronous reflow/layout recalculation, which can contribute to layout instability and jank.

**Tests**: CLS deep audit (manual code review)

**How the issue is resolved**: Replaced `void element.offsetWidth` with `requestAnimationFrame(() => { ... })` to defer the animation class re-application to the next paint frame. No synchronous reflow triggered.

---

### KI-006 — CSS Loading CLS vs LCP Tradeoff (HIGH COMPUTATION COST)

> **⚠️ This issue consumed 8 CLS guard iterations to resolve. Do NOT re-explore alternative CSS loading strategies without reading this entry first.**

**The Problem**: The home loan calculator has a large `calculator.css` file (911 lines) specific to its UI. Loading it affects both CLS and LCP in opposite directions:

| Approach Tried | CLS | LCP (Stress) | Verdict |
|:---------------|:----|:-------------|:--------|
| `@import` in body | 0.18 | ~1200ms | CLS FAIL — @import delays render, content shifts |
| `<link>` in `<head>` (render-blocking) | 0.00 | 2900ms | LCP FAIL — extra blocking CSS adds ~400ms |
| Inline ALL CSS in `<style>` | 0.00 | ~2600ms | LCP marginal — too much inlined CSS |
| **Inline critical CSS + async full CSS** | **0.0166** | **2448ms** | **PASS** — this is the solution |

**Tests**: `CLS_GUARD_ROUTE_INCLUDE="/loans/home-loan/" npx playwright test e2e-cls-guard` — must pass both normal and stress mode.

**How the issue is resolved**: Three-part strategy in `public/loans/home-loan/index.html`:

1. **Inline critical layout CSS**: ~25 rules covering `.calculator-page-single`, `.home-loan-ui`, `.mtg-hero`, `.mtg-summary-card`, `.is-hidden`, etc. are placed in a `<style>` block in `<head>`. These rules prevent layout shifts during initial render.

2. **Async load full CSS**: The full `calculator.css` is loaded with the print-media trick:
   ```html
   <link rel="stylesheet" href="/calculators/loans/home-loan/calculator.css?v=20260127"
         media="print" onload="this.media='all'" />
   <noscript><link rel="stylesheet" href="/calculators/loans/home-loan/calculator.css?v=20260127" /></noscript>
   ```
   This makes it non-render-blocking. The `onload` switches it to `all` once loaded.

3. **Preload theme CSS** (see KI-007 below): Eliminates the @import chain bottleneck.

**Key insight**: You cannot simply add `calculator.css` as a render-blocking `<link>` in the head — the extra ~400ms on 3G pushes LCP past 2500ms. But you also cannot omit it from initial render or load it late — that causes CLS. The inline + async pattern is the only approach that satisfies both constraints simultaneously under stress conditions (4× CPU, 3G, 200ms CSS delay).

---

### KI-007 — base.css @import Chain Adds ~380ms

**The Problem**: `base.css` contains `@import url('theme-premium-dark.css')`. CSS @imports are sequential — the browser must download and parse `base.css` before it discovers and starts downloading `theme-premium-dark.css`. On slow networks (3G), this adds ~380ms to the critical path, which combined with other CSS files pushed LCP to ~2900ms.

**Tests**: CLS guard stress mode — LCP threshold is 2500ms.

**How the issue is resolved**: Added a `<link rel="preload">` hint in the `<head>` of `public/loans/home-loan/index.html`:
```html
<link rel="preload" href="/assets/css/theme-premium-dark.css?v=20260127" as="style" />
```
This tells the browser to start fetching `theme-premium-dark.css` immediately in parallel with `base.css`, rather than waiting for the @import to be discovered. Reduced LCP from ~2900ms to ~2448ms under stress.

**Why not remove the @import from base.css?**: `base.css` is shared across all pages. Removing the @import would require adding `<link>` tags for the theme CSS to every page. The preload approach is surgical — it fixes the problem for this page without modifying shared infrastructure.

---

### KI-008 — Title Too Long (61 chars)

**The Problem**: Original title was `"Home Loan Calculator | Mortgage Payment Planner | CalcHowMuch"` — 61 characters, exceeding the recommended ≤60 character limit for SERP display.

**Tests**: SERP readiness audit (automated 36-point check)

**How the issue is resolved**: Shortened to `"Home Loan Calculator | Mortgage Planner | CalcHowMuch"` — 53 characters. Removed "Payment" from "Mortgage Payment Planner" since "Mortgage Planner" still captures the primary intent. Updated `og:title`, `twitter:title`, and schema `name` to match.

---

### KI-009 — No Visible Parent Category Link

**The Problem**: The home loan calculator page had no visible link to its parent category (`/loans/`). The left navigation showed the category structure, but there was no in-content breadcrumb or parent link visible to crawlers and users in the main content area.

**Tests**: SERP readiness audit — I4 (Internal Linking) check for parent category link.

**How the issue is resolved**: Added a breadcrumb `<nav>` element above the H1 in `public/loans/home-loan/index.html`:
```html
<nav aria-label="Breadcrumb" style="margin-bottom:0.25rem;font-size:0.97em">
  <a href="/" style="color:#2563eb">Home</a>
  <span aria-hidden="true"> › </span>
  <a href="/loans/" style="color:#2563eb">Loans</a>
  <span aria-hidden="true"> › </span>
  <span>Home Loan Calculator</span>
</nav>
```
This provides both a visible breadcrumb trail for users and crawlable internal links for search engines.

---

### KI-010 — @import in base.css Causes CSS Waterfall for All Pages (HIGH COMPUTATION COST)

> **⚠️ This is a systemic fix affecting ALL pages. Do NOT revert without understanding the full impact.**

**The Problem**: `public/assets/css/base.css` had `@import url('/assets/css/theme-premium-dark.css')` as its first line. CSS `@import` is sequential — the browser must download and parse `base.css` before it discovers and starts fetching `theme-premium-dark.css`. On slow networks (3G with 4× CPU throttle), this waterfall added ~380ms to the critical rendering path, pushing LCP dangerously close to or beyond the 2500ms threshold.

**Tests**: CLS guard stress mode — `CLS_GUARD_ROUTE_INCLUDE="/loans/home-loan/" npx playwright test cls-guard-all-calculators`

**How the issue is resolved**: Three coordinated changes:

1. **Removed `@import` from `public/assets/css/base.css`** — replaced with a comment explaining the new loading pattern.

2. **Updated `scripts/generate-mpa-pages.js`** — all 3 template functions (calculator pages, calculators index, GTEP pages) now emit `<link rel="stylesheet" href="/assets/css/theme-premium-dark.css">` as a direct `<link>` before `base.css`. This enables parallel download.

3. **Added `MANUAL_PAGES` skip set** in the generator (see KI-012) to prevent overwriting manually-optimized pages like home-loan.

**Result**: LCP stress dropped from ~2900ms (before any optimization) to 2432ms. The @import waterfall is completely eliminated for all pages site-wide.

---

### KI-011 — Global calculator.css Render-Blocking on Home-Loan Page

**The Problem**: `/assets/css/calculator.css` (the shared global calculator stylesheet) was loaded as a render-blocking `<link rel="stylesheet">` in the home-loan page `<head>`. Combined with 3 other blocking CSS files, this pushed LCP higher under stress conditions.

**Tests**: CLS guard stress mode + Chrome DevTools Performance panel (Lighthouse "Render blocking requests" audit).

**How the issue is resolved**: Changed from blocking to async using the preload+swap pattern in `public/loans/home-loan/index.html`:
```html
<link rel="preload" href="/assets/css/calculator.css?v=20260127" as="style"
      onload="this.onload=null;this.rel='stylesheet'" />
<noscript><link rel="stylesheet" href="/assets/css/calculator.css?v=20260127" /></noscript>
```
This works because the critical calculator layout rules (`.calculator-page-single`, `.home-loan-ui`, `.mtg-hero`, button groups, input rows, etc.) are already inlined in the `<style>` block. The global calculator.css provides non-critical shared component styling that can load async without causing CLS.

**Important**: This optimization is only safe for pages that have inlined critical CSS. Other generated pages still load calculator.css as render-blocking.

---

### KI-012 — MPA Generator Overwrites Manually-Optimized Pages

**The Problem**: Running `node scripts/generate-mpa-pages.js` unconditionally regenerates ALL calculator pages, including `loans/home-loan`. Since the home-loan page has manual performance optimizations (inlined critical CSS, async loading patterns, breadcrumb nav, shortened title, etc.), the generator overwrites all of these with the default template.

**Tests**: Discovered when running the generator to update theme CSS links — the home-loan page was overwritten and lost all optimizations.

**How the issue is resolved**: Added a `MANUAL_PAGES` skip set in `scripts/generate-mpa-pages.js`:
```javascript
const MANUAL_PAGES = new Set(['loans/home-loan']);
```
Pages in this set are logged as `SKIP (manual)` during generation and their `index.html` is not overwritten. When adding new manually-optimized pages in the future, add their relative path to this set.

**Warning**: If the generator template changes (e.g., new navigation structure, new ad slots, new schema), manually-maintained pages must be updated by hand to match.

---

### KI-013 — 3-Deep CSS @import Waterfall Causes CLS 0.479 on 15 Pages

**The Problem**: Cloudflare field data showed CLS P75 = 0.479 on `/finance/present-value/` (4.8× over Google's 0.10 threshold). Root cause: a 3-deep CSS `@import` waterfall chain: `finance/*/calculator.css → car-loan/calculator.css → home-loan/calculator.css`. The browser couldn't discover the 911-line home-loan CSS until after downloading two intermediate files, adding ~1500ms on 3G connections. This caused the `.mtg-hero` grid layout to arrive late, snapping the form from full-width to 2-column grid — a massive visible layout shift. 15 calculator pages (10 finance + 5 loan) were affected.

**Tests**: `npm run test:cwv:all` (CLS guard on all 87 routes, normal + stress modes)

**How the issue was resolved**:
1. Created `/assets/css/shared-calculator-ui.css` (~1000 lines) — contains all shared home-loan UI rules + car-loan's reusable slider/grid rules scoped to `.home-loan-ui`
2. Stubbed `home-loan/calculator.css` to empty (file kept for no-404 on existing links)
3. Removed `@import` from all 15 calculator CSS files (5 loan, 10 finance)
4. Updated MPA generator to add `<link>` for shared CSS on all generated pages
5. Updated home-loan manual page with blocking shared CSS `<link>`
6. Added `npm run lint:css-import` guard to prevent future @import usage
7. Added guard to `validate` pipeline

**Post-fix CLS results** (all 16 affected routes):
- Normal mode: CLS 0.000 on 11/16 routes, max CLS 0.011 (car-loan)
- Stress mode (4× CPU, 3G): max CLS 0.014 (time-to-savings-goal)
- Present-value specifically: CLS 0.000 (normal), 0.003 (stress) — down from field 0.479

**Visual regression accepted**: Finance calculators lost car-loan's `#calc-home-loan .mtg-form-panel { gap: 1.25rem }` override, falling back to home-loan's default `gap: 1.65rem`. This is a negligible spacing difference, not CLS-related.

# CSS @import Elimination — Migration Plan

> **Purpose**: Eliminate all CSS `@import` chains in calculator stylesheets to fix CLS 0.479 on 15 calculator pages.
> **Created**: 2026-02-15
> **Status**: COMPLETED (2026-02-15)
> **Priority**: P0 — Cloudflare field data shows CLS 0.479 on `/finance/present-value/` (threshold: 0.10)

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Current State](#2-current-state)
3. [Dependency Graph](#3-dependency-graph)
4. [Solution Design](#4-solution-design)
5. [CSS Loading — Before vs After](#5-css-loading--before-vs-after)
6. [Execution Steps](#6-execution-steps)
7. [Step Details](#7-step-details)
8. [Affected Files Inventory](#8-affected-files-inventory)
9. [Cloudflare / Caching Strategy](#9-cloudflare--caching-strategy)
10. [Expected Impact](#10-expected-impact)
11. [What This Does NOT Include](#11-what-this-does-not-include)
12. [Validation Checklist](#12-validation-checklist)
13. [Rollback Plan](#13-rollback-plan)
14. [References](#14-references)

---

## 1. Problem Statement

### Cloudflare Field Data (captured 2026-02-15)

```
Metric:     CLS - P75 = 0.479
Page:       calchowmuch.com /finance/present-value/
DOM Element: div.calculator-ui.home-loan-ui > section.mtg-hero > div.mtg-form-panel > div.input-row.slider-row

Layout Shift:
  Previous: { width: 1321px, height: 120px, top: 226px }
  Current:  { width: 744px,  height: 103px, top: 279px }
```

**Root cause**: The `.mtg-hero` grid layout is defined in `home-loan/calculator.css` (910 lines), loaded via a 3-deep CSS `@import` waterfall. On slow connections, the grid definition arrives ~1500ms late, causing the element to snap from full-width to 2-column grid — a massive visible shift.

### Why it matters

- CLS 0.479 is **4.8× over Google's threshold** (0.10)
- Google uses CLS as a ranking signal — this hurts SEO for 15 calculator pages
- Target: 1M unique visitors/month — every page must have good CWV
- 15 out of 90 calculator pages are affected (17% of the site)

---

## 2. Current State

| Fact | Value |
|:---|:---|
| Total calculator pages | 90 |
| Calculator CSS files with `@import` | **15** |
| Calculator CSS files without `@import` | 15 (clean) |
| Calculators with no `calculator.css` | ~60 (use global CSS only) |
| @import chain depth | Max **2 hops** |
| Root CSS being shared | `home-loan/calculator.css` (910 lines) |
| Intermediary CSS | `car-loan/calculator.css` (142 lines) |
| Global CSS files (blocking) | 4: theme, base, layout, calculator |
| Build step | None — static HTML via `generate-mpa-pages.js` |
| Cache strategy | `?v=20260127` query strings + Cloudflare edge |

### Global CSS file sizes

| File | Lines | Purpose |
|:---|:---|:---|
| `theme-premium-dark.css` | 335 | CSS custom properties (colors, gradients) |
| `base.css` | 78 | Reset, `box-sizing`, scrollbar, `:root` vars |
| `layout.css` | 1274 | Page shell, header, nav, footer, columns |
| `calculator.css` | 777 | Shared calculator form components |
| **Total** | **2464** | |

---

## 3. Dependency Graph

```
home-loan/calculator.css (910 lines = shared UI library)
│
├─ 1-hop (5 loan calculators — @import home-loan directly):
│  ├── car-loan/calculator.css (142 lines)
│  ├── pcp-calculator/calculator.css
│  ├── multiple-car-loan/calculator.css
│  ├── hire-purchase/calculator.css
│  └── leasing-calculator/calculator.css
│
└─ 2-hop via car-loan (10 finance calculators — @import car-loan → home-loan):
   ├── compound-interest/calculator.css
   ├── simple-interest/calculator.css
   ├── future-value/calculator.css
   ├── future-value-of-annuity/calculator.css
   ├── present-value/calculator.css          ← CLOUDFLARE CLS 0.479
   ├── present-value-of-annuity/calculator.css
   ├── effective-annual-rate/calculator.css
   ├── investment-growth/calculator.css
   ├── monthly-savings-needed/calculator.css
   └── time-to-savings-goal/calculator.css
```

---

## 4. Solution Design

### New file: `public/assets/css/shared-calculator-ui.css`

Extract reusable layout rules from `home-loan/calculator.css` into a new shared CSS file:

**What goes into shared file (~500-600 lines)**:
- `.home-loan-ui` base layout (flex column)
- `.mtg-hero` grid (2-column form + preview)
- `.mtg-form-panel` grid layout
- `.input-row`, `.slider-row` flex layouts
- `.slider-header` flex layout
- `.button-group` pill styles
- `.advanced-options` details/summary
- `.advanced-pair` / `.advanced-stack` grids
- `.mtg-action-row` button container
- `.mtg-preview-panel` / `.mtg-preview-main` layout
- `.mtg-result-card` / `.mtg-summary-card` structure
- `.mtg-snapshot-list` / `.mtg-snapshot-row`
- `.mtg-tabs` / `.mtg-tab-btn` tab strip
- `.mtg-pane` / `.table-scroll` table containers
- `.schedule-table` full table styles
- All responsive breakpoints (`@media`) for above
- `.is-hidden` utility class

**What stays in `home-loan/calculator.css` (~300-400 lines)**:
- `#calc-home-loan` scoped rules only
- Home-loan-specific colors, animations
- Home-loan-specific result formatting
- Any rule that starts with `#calc-home-loan` and is NOT used by other calculators

**What stays in `car-loan/calculator.css` (~142 lines, minus @import)**:
- `#calc-car-loan` scoped overrides only
- Car-loan-specific badge styles, multi-car grid, etc.

**Each of the 15 calculator CSS files**:
- Remove `@import` line
- Keep only `#calc-{name}` scoped overrides

### Generator update

Add one `<link>` tag in the MPA generator for calculators that use the shared UI pattern:

```html
<link rel="stylesheet" href="/assets/css/shared-calculator-ui.css?v=${CSS_VERSION}" />
```

Detection: add it for any calculator whose `calculator.css` previously imported from the chain, OR whose HTML uses `.home-loan-ui` / `.mtg-hero` classes.

---

## 5. CSS Loading — Before vs After

### Before (present-value, worst case — 3-deep waterfall)

```
[BLOCKING] theme-premium-dark.css ──────────────►
[BLOCKING] base.css ────────────────────────────►
[BLOCKING] layout.css ──────────────────────────►
[BLOCKING] calculator.css ──────────────────────►
           ↓ page HTML parsed, finds page-specific CSS link
           [BLOCKING] present-value/calculator.css ────────►
                      ↓ parsed, discovers @import car-loan
                      [BLOCKING] car-loan/calculator.css ────────►
                                 ↓ parsed, discovers @import home-loan
                                 [BLOCKING] home-loan/calculator.css ────────►
                                            ↓ FINALLY renders .mtg-hero grid
```

**Total depth: 7 sequential CSS loads. ~1500ms+ wasted on 3G.**

### After (zero waterfall)

```
[PARALLEL] theme-premium-dark.css ──────────────►
[PARALLEL] base.css ────────────────────────────►
[PARALLEL] layout.css ──────────────────────────►
[PARALLEL] calculator.css ──────────────────────►
[PARALLEL] shared-calculator-ui.css ────────────►  ← NEW (contains .mtg-hero grid)
           ↓ ALL arrive together, first render has correct grid layout
           [ASYNC or tiny blocking] present-value/calculator.css ──► (page overrides only, ~50 lines)
```

**Total depth: 5 parallel + 1 tiny. Zero waterfall.**

---

## 6. Execution Steps

| Step | Description | Status | Depends On |
|:---|:---|:---|:---|
| 1 | Analyze home-loan/calculator.css — identify shared vs specific rules | NOT STARTED | — |
| 2 | Create `shared-calculator-ui.css` with extracted shared rules | NOT STARTED | Step 1 |
| 3 | Trim `home-loan/calculator.css` to home-loan-specific only | NOT STARTED | Step 2 |
| 4 | Trim `car-loan/calculator.css` — remove @import, keep overrides | NOT STARTED | Step 2 |
| 5 | Remove @import from remaining 13 calculator CSS files | NOT STARTED | Step 2 |
| 6 | Update MPA generator to add `<link>` for shared-calculator-ui.css | NOT STARTED | Step 2 |
| 7 | Update home-loan manual page to use shared CSS `<link>` | NOT STARTED | Step 2 |
| 8 | Add @import lint guard to `npm run lint` | NOT STARTED | Step 5 |
| 9 | Regenerate all pages (except manual pages) | NOT STARTED | Steps 3-6 |
| 10 | Run CLS guard on ALL 15 affected routes (normal + stress) | NOT STARTED | Step 9 |
| 11 | Run CLS guard on home-loan (regression check) | NOT STARTED | Step 9 |
| 12 | Run E2E tests for affected calculators | NOT STARTED | Step 9 |
| 13 | Run full lint + unit tests | NOT STARTED | Step 8 |
| 14 | Format all modified files (Prettier) | NOT STARTED | Step 9 |
| 15 | Document rule in UNIVERSAL_REQUIREMENTS.md | NOT STARTED | Step 10 |
| 16 | Update known_issues.md with KI-013 | NOT STARTED | Step 10 |
| 17 | Update release sign-off | NOT STARTED | All steps |

---

## 7. Step Details

### Step 1: Analyze home-loan/calculator.css

**Goal**: Classify every rule as SHARED or HOME-LOAN-SPECIFIC.

**Shared** = any rule that:
- Uses classes like `.mtg-hero`, `.mtg-form-panel`, `.slider-row`, `.button-group`, `.schedule-table`, etc. WITHOUT the `#calc-home-loan` prefix
- OR is scoped to `#calc-home-loan` but the same class is used by other calculators with their own `#calc-*` prefix

**Home-loan-specific** = any rule that:
- Is scoped to `#calc-home-loan` AND uses classes unique to home-loan (e.g., `.mtg-mortgage-type`, home-loan-specific animations)

**How to identify**: Check which classes from home-loan CSS appear in other calculators' HTML:
```bash
# Extract class names from home-loan CSS
grep -oP '\.[a-zA-Z][\w-]+' public/calculators/loans/home-loan/calculator.css | sort -u

# Check which appear in other calculator HTML files
for cls in $(above); do
  grep -rl "$cls" public/calculators/ --include="*.html" | grep -v home-loan
done
```

### Step 2: Create shared-calculator-ui.css

**Location**: `public/assets/css/shared-calculator-ui.css`

**Structure**:
```css
/* ═══════════════════════════════════════════════
   shared-calculator-ui.css
   Shared layout rules for calculator UI families:
   home-loan, car-loan, finance
   
   DO NOT add @import to this file.
   DO NOT add page-specific (#calc-*) rules here.
   ═══════════════════════════════════════════════ */

/* ── Hero grid (form + preview) ── */
.home-loan-ui { ... }
.mtg-hero { ... }

/* ── Form panel ── */
.mtg-form-panel { ... }
.input-row { ... }
.slider-row { ... }

/* ── Button groups ── */
.button-group (within calc context) { ... }

/* ── Results ── */
.mtg-preview-panel { ... }
.mtg-result-card { ... }
.mtg-summary-card { ... }

/* ── Tables ── */
.mtg-tabs { ... }
.schedule-table { ... }

/* ── Responsive ── */
@media (max-width: 1220px) { ... }
@media (max-width: 900px) { ... }
@media (max-width: 600px) { ... }
```

### Step 3: Trim home-loan/calculator.css

Remove all rules that were extracted to shared file. Keep only `#calc-home-loan`-scoped rules that are unique to home-loan.

**Verification**: Home-loan page must look identical before and after.

### Step 4-5: Remove @import from 15 files

For each file:
1. Delete the `@import url('...');` line
2. Keep all remaining rules (these are page-specific overrides)
3. Verify no rule depends on a class defined in the imported file that wasn't extracted to shared

**Files to modify (15 total)**:

1-hop (remove `@import url('/calculators/loans/home-loan/calculator.css')`):
- `loans/car-loan/calculator.css`
- `loans/pcp-calculator/calculator.css`
- `loans/multiple-car-loan/calculator.css`
- `loans/hire-purchase/calculator.css`
- `loans/leasing-calculator/calculator.css`

2-hop (remove `@import url('/calculators/loans/car-loan/calculator.css')`):
- `finance/compound-interest/calculator.css`
- `finance/simple-interest/calculator.css`
- `finance/future-value/calculator.css`
- `finance/future-value-of-annuity/calculator.css`
- `finance/present-value/calculator.css`
- `finance/present-value-of-annuity/calculator.css`
- `finance/effective-annual-rate/calculator.css`
- `finance/investment-growth/calculator.css`
- `finance/monthly-savings-needed/calculator.css`
- `finance/time-to-savings-goal/calculator.css`

### Step 6: Update MPA generator

In `scripts/generate-mpa-pages.js`, add shared-calculator-ui.css link.

**Detection logic**: The generator already knows each calculator's `designFamily`. Add the shared CSS for any calculator that uses `home-loan` or `auto-loans` design family, OR any calculator whose HTML contains `.home-loan-ui` or `.mtg-hero`.

Alternative (simpler): Add it for ALL calculators. 500 lines of CSS costs ~15KB uncompressed (~3KB gzipped). On Cloudflare edge with long cache, this is negligible.

**Template change** (3 locations in generator):
```javascript
// Before:
<link rel="stylesheet" href="/assets/css/calculator.css?v=${CSS_VERSION}" />

// After:
<link rel="stylesheet" href="/assets/css/calculator.css?v=${CSS_VERSION}" />
<link rel="stylesheet" href="/assets/css/shared-calculator-ui.css?v=${CSS_VERSION}" />
```

### Step 7: Update home-loan manual page

The home-loan page is manually maintained (in `MANUAL_PAGES` skip list). Must add `<link>` for shared CSS manually. Also update the inlined critical CSS if any moved rules are part of it.

### Step 8: Add @import lint guard

Add to ESLint config or as a script check in `npm run lint`:

```bash
# Add to package.json scripts or as a pre-test check
grep -r "@import" public/calculators/ --include="*.css" && echo "FAIL: @import found in calculator CSS" && exit 1 || echo "PASS: No @import in calculator CSS"
```

### Step 9: Regenerate pages

```bash
node scripts/generate-mpa-pages.js
```

Verify home-loan page was skipped (MANUAL_PAGES list).

### Step 10-11: CLS guard testing

```bash
# Test all 15 affected routes
CLS_GUARD_ROUTE_INCLUDE="/finance/|/loans/car-loan/|/loans/pcp-calculator/|/loans/multiple-car-loan/|/loans/hire-purchase/|/loans/leasing-calculator/" \
  npx playwright test cls-guard-all-calculators

# Regression check on home-loan
CLS_GUARD_ROUTE_INCLUDE="/loans/home-loan/" \
  npx playwright test cls-guard-all-calculators
```

**Pass criteria**:
- CLS ≤ 0.10 (all routes, both modes)
- maxShift ≤ 0.05 (all routes, both modes)
- LCP ≤ 2500ms (all routes, both modes)
- LCP stress ≤ 2300ms WARNING threshold
- INP ≤ 200ms (all routes, both modes)

### Step 12-14: Standard gates

```bash
npx playwright test          # E2E tests
npm run lint                 # Lint (includes new @import guard)
npx vitest run               # Unit tests
npx prettier --write ...     # Format
```

---

## 8. Affected Files Inventory

### Files to CREATE

| File | Purpose | Est. Lines |
|:---|:---|:---|
| `public/assets/css/shared-calculator-ui.css` | Shared calculator UI layout rules | ~500-600 |

### Files to MODIFY

| File | Change | Est. Impact |
|:---|:---|:---|
| `public/calculators/loans/home-loan/calculator.css` | Remove shared rules (extracted to shared file) | -500 lines |
| `public/calculators/loans/car-loan/calculator.css` | Remove `@import` line 1 | -1 line |
| `public/calculators/loans/pcp-calculator/calculator.css` | Remove `@import` line 1 | -1 line |
| `public/calculators/loans/multiple-car-loan/calculator.css` | Remove `@import` line 1 | -1 line |
| `public/calculators/loans/hire-purchase/calculator.css` | Remove `@import` line 1 | -1 line |
| `public/calculators/loans/leasing-calculator/calculator.css` | Remove `@import` line 1 | -1 line |
| `public/calculators/finance/compound-interest/calculator.css` | Remove `@import` line 1 | -1 line |
| `public/calculators/finance/simple-interest/calculator.css` | Remove `@import` line 1 | -1 line |
| `public/calculators/finance/future-value/calculator.css` | Remove `@import` line 1 | -1 line |
| `public/calculators/finance/future-value-of-annuity/calculator.css` | Remove `@import` line 1 | -1 line |
| `public/calculators/finance/present-value/calculator.css` | Remove `@import` line 1 | -1 line |
| `public/calculators/finance/present-value-of-annuity/calculator.css` | Remove `@import` line 1 | -1 line |
| `public/calculators/finance/effective-annual-rate/calculator.css` | Remove `@import` line 1 | -1 line |
| `public/calculators/finance/investment-growth/calculator.css` | Remove `@import` line 1 | -1 line |
| `public/calculators/finance/monthly-savings-needed/calculator.css` | Remove `@import` line 1 | -1 line |
| `public/calculators/finance/time-to-savings-goal/calculator.css` | Remove `@import` line 1 | -1 line |
| `scripts/generate-mpa-pages.js` | Add `<link>` for shared-calculator-ui.css | +3 lines |
| `public/loans/home-loan/index.html` | Add `<link>` for shared CSS, update inlined critical CSS | ~5 lines |
| `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md` | Add CSS architecture rule | ~10 lines |
| `requirements/universal-rules/known_issues.md` | Add KI-013 entry | ~30 lines |

### Files REGENERATED (by generator, no manual edits)

All 90 calculator MPA pages in `public/` will be regenerated with the new `<link>` tag. Home-loan is skipped (MANUAL_PAGES).

---

## 9. Cloudflare / Caching Strategy

> Target: 1M unique visitors/month, millions of page views

| Asset | Cache TTL | Strategy | Cloudflare Behavior |
|:---|:---|:---|:---|
| `shared-calculator-ui.css?v=YYYYMMDD` | 1 year (immutable) | Versioned query string | Cached at edge POP globally; 99.9% cache hit rate |
| `theme-premium-dark.css?v=YYYYMMDD` | 1 year | Same | Same |
| `base.css?v=YYYYMMDD` | 1 year | Same | Same |
| `layout.css?v=YYYYMMDD` | 1 year | Same | Same |
| `calculator.css?v=YYYYMMDD` | 1 year | Same | Same |
| Page-specific `calculator.css` | 1 year | Tiny (~50-200 lines) | Same |
| HTML pages | 5 min + stale-while-revalidate | Content can change | Edge serves stale while revalidating |

**At 1M visitors/month**: After first visitor per Cloudflare POP region, all subsequent visitors get **0ms CSS latency** from edge cache. With ~300 Cloudflare POPs globally, essentially all CSS will be served from edge within hours of deployment.

**Cache invalidation**: Bump `?v=` version in generator when CSS changes → new URL → new cache entry → old expires naturally.

---

## 10. Expected Impact

| Metric | Before (present-value) | Expected After | Threshold |
|:---|:---|:---|:---|
| CLS (field) | **0.479** | < 0.05 | ≤ 0.10 |
| LCP (stress) | Est. >3s | < 2300ms | ≤ 2500ms |
| Blocking CSS files | 7 (sequential) | 5 (parallel) | ≤ 3 ideal |
| CSS waterfall depth | 3 hops | 0 hops | 0 |
| Pages at risk | 15 | 0 | 0 |
| Google CWV status | "Poor" (CLS) | "Good" | "Good" |

### SEO impact estimate

- 15 pages currently have "Poor" CWV → will move to "Good"
- Google CWV is a ranking signal (not dominant, but a tiebreaker)
- With 1M visitors/month target, even small ranking improvements = significant traffic

---

## 11. What This Does NOT Include

| Suggestion (from ChatGPT) | Verdict | Reason |
|:---|:---|:---|
| Content-hashed filenames | **Skip** | `?v=` query strings achieve same cache-busting; no build tooling needed |
| CSS bundler/manifest | **Skip** | Generator already controls `<link>` tags; one more line is simpler than a build pipeline |
| Bundle size budgets | **Skip for now** | Only 1 shared file; add if CSS proliferates later |
| Local minification | **Skip** | Cloudflare auto-minifies CSS at edge (free tier includes this) |
| Critical CSS inlining for all pages | **Skip** | Only needed for home-loan (already done); shared CSS is small enough to block without LCP issues |

---

## 12. Validation Checklist

### After Step 2 (shared file created)

- [ ] `shared-calculator-ui.css` contains all shared layout rules
- [ ] No `#calc-home-loan`-specific rules in shared file
- [ ] No `@import` in shared file

### After Step 5 (all @import removed)

- [ ] `grep -r "@import" public/calculators/ --include="*.css"` returns 0 matches
- [ ] Each calculator CSS contains only `#calc-{name}` scoped overrides

### After Step 9 (pages regenerated)

- [ ] All generated pages have `<link>` for `shared-calculator-ui.css`
- [ ] Home-loan manual page has `<link>` for shared CSS
- [ ] `grep -r "shared-calculator-ui" public/loans/ public/finance/ | wc -l` ≥ 15

### After Step 10 (CLS guard)

- [ ] All 15 affected routes: CLS ≤ 0.10 (normal + stress)
- [ ] All 15 affected routes: LCP ≤ 2500ms (normal + stress)
- [ ] All 15 affected routes: LCP stress ≤ 2300ms (WARNING threshold)
- [ ] Home-loan regression check: all metrics still pass
- [ ] No new violations in guard JSON report

### After Step 13 (standard gates)

- [ ] `npm run lint` — PASS (includes @import guard)
- [ ] `npx vitest run` — all unit tests PASS
- [ ] `npx playwright test` — all E2E tests PASS
- [ ] `npx prettier --check` — all files formatted

---

## 13. Rollback Plan

If CLS guard fails after migration:

1. **Revert shared CSS extraction**: `git checkout -- public/assets/css/`
2. **Revert @import removal**: `git checkout -- public/calculators/`
3. **Revert generator**: `git checkout -- scripts/generate-mpa-pages.js`
4. **Regenerate pages**: `node scripts/generate-mpa-pages.js`
5. **Re-run CLS guard** to confirm rollback is clean

All changes are in tracked files — `git diff` shows full scope. No database, no config changes, no infra changes.

---

## 14. References

| Document | Relevance |
|:---|:---|
| `requirements/universal-rules/known_issues.md` | KI-006, KI-007, KI-010, KI-011 — previous CSS performance fixes |
| `requirements/universal-rules/RELEASE_CHECKLIST.md` | A1 CSS discipline checks (added 2026-02-15) |
| `requirements/universal-rules/RELEASE_SIGNOFF.md` | §4.2 CSS evidence table, §8.3 LCP stress margin |
| `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-20260215-001.md` | Home-loan release evidence |
| Cloudflare RUM data | CLS 0.479 on `/finance/present-value/` |

---

## Decisions Log

| Date | Decision | Rationale |
|:---|:---|:---|
| 2026-02-15 | Extract shared CSS instead of bundler | No build step exists; extraction achieves same parallel loading with zero new tooling |
| 2026-02-15 | Add shared CSS for ALL calculators (not just affected 15) | 3KB gzipped is negligible; simpler than detection logic; prevents future @import temptation |
| 2026-02-15 | Skip content-hashed filenames | `?v=` query strings already work; Cloudflare handles caching |
| 2026-02-15 | Skip local minification | Cloudflare auto-minifies at edge |

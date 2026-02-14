# Release Checklist — Performance + Mobile + CWV + Ads (Release Gate)

Use this checklist for every change that touches: layout, CSS, JS, nav, calculators, explanation pane, ads, fonts, or shared components.

## A) Pre-Release (Dev) — Must Pass

### A1) Rendering order (above-the-fold)
- [ ] Calculator UI renders without waiting for ad scripts.
- [ ] Initial results (or initial state) are visible immediately after first render.
- [ ] No runtime injection adds content above the fold after load (especially ads/nav).

### A2) Layout stability (CLS control)
- [ ] No visible layout shift when:
  - fonts load
  - results/table appear
  - FAQs render
  - nav expands/collapses
  - ads load
- [ ] All ad slots have reserved space at every breakpoint (see Section D).

### A3) JavaScript discipline (INP protection)
- [ ] No heavy computation on slider/input events (no long tasks on interaction path).
- [ ] Non-essential scripts are deferred/lazy-loaded.
- [ ] Interaction remains smooth during rapid slider drags and fast typing.

### A4) Caching readiness
- [ ] Static assets are long-TTL cached (versioned/immutable where applicable).
- [ ] HTML caching strategy is configured to maintain high cache hit without serving stale critical content.
- [ ] Cache headers verified for: HTML, CSS, JS, fonts, images.

## B) Mobile & Tablet Release Checks — Must Pass

### B1) Layout & navigation
- [ ] Mobile uses single-column calculator layout.
- [ ] Burger navigation works and does not cause main content CLS when opened/closed.
- [ ] Tap targets meet usability: spacing, size, clear highlight for expand/collapse.

### B2) Inputs on mobile
- [ ] Numeric inputs use numeric keyboard where relevant.
- [ ] min/max/step present where applicable.
- [ ] No input jank: slider drag remains responsive.

### B3) Ads on mobile
- [ ] Ads do not overlap inputs/results.
- [ ] Ads do not push content unexpectedly.
- [ ] Ads do not change height after render (no late resizing causing CLS).

## C) Performance Metrics (Budgets) — Must Pass

### C1) Field targets (release intent)
Target CWV thresholds (75th percentile):
- **LCP** ≤ 2.5s
- **INP** ≤ 200ms
- **CLS** ≤ 0.1

*Note: Field metrics update after release; pre-release must use lab proxies and known regressions prevention.*

### C2) Lab gates (pre-release)
Run Lighthouse locally (mobile profile) on key pages:
- Category hub page
- 2–3 top calculators
- One heavy explanation/table calculator

**Checks:**
- [ ] No CLS warnings or obvious layout shifts in filmstrip.
- [ ] No large blocking tasks around first interaction.
- [ ] Above-the-fold content renders quickly (no ad-induced delay).

### C3) Core Web Vitals Regression — CWV Guard (Global & Automated)

**Objective**: Prevent layout instability on critical pages before release.

**Route Scope (Mandatory)**:
- All calculator routes from `public/config/navigation.json`

**Release Policy (Automated Lab Checks):**
1.  **HARD FAIL** (Release Blocked):
  - Any calculator route **CLS > 0.10**.
    - Any single layout shift contribution **> 0.05**.
  - Any calculator route **LCP > 2.5s**.
  - Any calculator route **INP proxy > 200ms**.
2.  **SOFT WARNING** (Investigation Required):
    - CLS between **0.05** and **0.10**.
  - LCP between **2.0s** and **2.5s**.
  - INP proxy between **150ms** and **200ms**.
    - New layout shift contributor appears vs baseline.

**Baseline Tracking (Phase 7):**
- **Storage**: Last known good CLS stored in `tests/performance/baselines.json`.
- **Regression Policy**: Flag any **> 20% increase** in CLS vs baseline, even if total score is under threshold.

**Execution Mode**:
- Must run in **WSL** (Linux environment).
- Must run in two modes:
    - **Mode A (Normal)**: Standard load.
    - **Mode B (Stress)**: Slow CSS, Slow Fonts, CPU Throttle.
- Required command: `npm run test:cwv:all` (or `npm run test:cls:all` alias)
- Required evidence artifact: `test-results/performance/cls-guard-all-calculators.json`

**Root Cause Analysis Heuristics** (If Guard Fails):
- [ ] Late CSS load / FOUC?
- [ ] Webfont metric swap?
- [ ] Slider/component resize post-mount?
- [ ] Breakpoint/class toggles after hydration?
- [ ] Image/icon missing reserved dimensions?
- [ ] Ad container collapse?

### D1) Slot reservation
For every ad placement:
- [ ] Slot container has min-height reserved per breakpoint.
- [ ] Slot container is present in initial layout (not injected later above fold).
- [ ] Slot container does not collapse to 0 height.
- [ ] If no ad fills, slot still preserves layout (or collapses only below fold with no CLS impact).

### D2) Load timing
- [ ] Ads load after:
  - initial render, AND
  - idle window OR first meaningful interaction
- [ ] Ad scripts are not render-blocking.
- [ ] Exactly one AdSense loader exists in `<head>` and no ad unit/body snippet duplicates the loader.

### D3) Placement stability
- [ ] No “auto” placements that dynamically add new slots in unpredictable places.
- [ ] No ad refresh behavior that changes slot height.
- [ ] Sticky ad behavior (if any) does not cover inputs or cause layout shift.

## E) Animation & Visual Effects — Must Pass

- [ ] Animations only use opacity and transform.
- [ ] No animation uses layout properties (height/width/top/left) that can cause reflow.
- [ ] Glassmorphism above fold is lightweight (no large blur on big surfaces).
- [ ] Hover effects do not trigger layout changes.

## F) Regression Scenarios — Must Pass

Test these manually on mobile + desktop:

### F1) First load
- [ ] Page loads with no visible jump.
- [ ] Results render without pushing content unexpectedly.
- [ ] Ads appear without shifting content.

### F2) User interaction
- [ ] Rapid slider drag for 5–10 seconds: no lag, no freezing.
- [ ] Fast typing in numeric fields: no input delay.
- [ ] Toggling month/year or modes: no layout jump, no reflow flicker.

### F3) Navigation behavior
- [ ] Left nav: subcategories collapsed by default.
- [ ] Landing directly on a calculator URL expands only the correct subcategory.
- [ ] Expand/collapse does not shift the main content pane.

## G) Observability (Post-Release Verification) — Required

Within 24–72 hours (or next available CWV/rum cycle):
- [ ] Check Search Console CWV:
  - no new “poor” URL groups
  - no CLS regression group created
- [ ] Check RUM dashboard (if enabled):
  - LCP distribution stable
  - INP stable
  - CLS stable

## H) Release Decision Rules

### HARD blockers (do not release)
1. Any CLS regression above 0.1 on representative devices/tests
2. Ads causing visible layout shift
3. Input lag/jank that affects interaction (INP risk)
4. Render blocked by ads or non-essential scripts

### SOFT signals (can release with a follow-up ticket)
1. Slight Lighthouse score dip but no CWV proxy regressions
2. Minor visual polish issues that do not affect CWV
3. Non-critical asset caching improvements pending

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
- [ ] Ad implementation matches canonical snippet sources: `requirements/universal-rules/AdSense code snippet.md` (head loader) and `requirements/universal-rules/Ad Unit Code.md` (body slot only).

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

## I) SERP Readiness — Must Pass (All Calculators)

Applies to **every calculator page** touched in this release AND a sample of untouched pages to guard against shared-layout regressions. Derived from Project Bible §8 (SERP-Ready System).

### I1) Metadata Integrity
- [ ] Every calculator page has a **unique, keyword-aligned `<title>`** (no two pages share the same title).
- [ ] Every calculator page has a **meta description tightly aligned to primary search intent**.
- [ ] Every calculator page has a **single, clean canonical URL** matching the served page.
- [ ] No duplicate or conflicting meta tags on any page.

### I2) Structured Data Hygiene
- [ ] JSON-LD is **page-scoped only** (no global schema injected across all pages).
- [ ] No duplicate `FAQPage` schema output on any page.
- [ ] JSON-LD content **matches visible page content exactly** (FAQ answers, descriptions).
- [ ] Schema validates in **Google Rich Results Test** (no errors).
- [ ] Only the safe schema set is used: `WebPage`, `SoftwareApplication`, `FAQPage` (when visible), `BreadcrumbList`.
- [ ] No `HowTo`, `Review`, `AggregateRating`, or `Product` schema types unless supported by visible content.

### I3) Content Indexability
- [ ] **Explanation section** is present in initial HTML (not JS-injected).
- [ ] **FAQs** are present in initial HTML (not JS-rendered).
- [ ] **Key formulas** (if applicable) are present in initial HTML.
- [ ] **Primary headings** (H1, H2) are present in initial HTML.
- [ ] Page is **fully crawlable without JavaScript execution**.
- [ ] No critical content gated behind tabs, hydration, or user interaction.

### I4) Internal Linking Architecture
- [ ] Category page links to each calculator page within it.
- [ ] Each calculator links back to its **parent category**.
- [ ] Each calculator links to **closely related calculators**.
- [ ] Each calculator links to **reverse/comparison variants** (when applicable).
- [ ] All internal links are **visible in HTML** (not JS-injected late).

### I5) Intent Coverage
- [ ] **Primary intent** is reflected in: title, H1, opening paragraph, and meta description.
- [ ] **3–5 secondary intents** are addressed via explanation sections, scenario tables, FAQ coverage, or related calculator links.
- [ ] **Long-tail variants** are naturally covered through varied phrasing, structured headings, and natural language explanations.
- [ ] No keyword stuffing.

### I6) Scenario & What-If Content (Finance / Percentage Cluster Only)
- [ ] Scenario summary tables or worked examples are present.
- [ ] Step-by-step breakdowns or practical interpretation text are included.
- [ ] "What-if" exploratory prompts are present in initial HTML (e.g., "What if the rate increases?").

*Skip I6 for pure math calculators that have no finance/percentage context.*

### I7) SERP Readiness Gate (Pass/Fail — Hard Block)

A page is SERP-ready **only if all** of the following are true:

- [ ] Metadata is unique and intent-aligned
- [ ] Canonical is correct
- [ ] No duplicate schema output
- [ ] JSON-LD is page-scoped and valid
- [ ] Explanation and FAQs exist in initial HTML
- [ ] Internal links are present and crawlable
- [ ] Primary + secondary intents are clearly covered
- [ ] Scenario content exists (finance/percentage cluster)
- [ ] Related/reverse calculators are linked where applicable
- [ ] Page renders cleanly on mobile without CLS issues

**Failure of any mandatory item blocks release.**

## J) Observability (Post-Release Verification) — Required

Within 24–72 hours (or next available CWV/rum cycle):
- [ ] Check Search Console CWV:
  - no new "poor" URL groups
  - no CLS regression group created
- [ ] Check RUM dashboard (if enabled):
  - LCP distribution stable
  - INP stable
  - CLS stable
- [ ] Check Search Console **Indexing**:
  - no new "Excluded" or "Error" pages
  - no soft 404 regressions
  - indexed vs submitted gap stable
- [ ] Check Search Console **Enhancements**:
  - no new structured data errors/warnings
  - FAQ rich results still appearing (if applicable)

## K) Release Decision Rules

### HARD blockers (do not release)
1. Any CLS regression above 0.1 on representative devices/tests
2. Ads causing visible layout shift
3. Input lag/jank that affects interaction (INP risk)
4. Render blocked by ads or non-essential scripts
5. Missing or duplicate `<title>` / meta description on any calculator page
6. Broken or incorrect canonical URL
7. JSON-LD schema not matching visible page content
8. Explanation or FAQ content missing from initial HTML (JS-only rendering)
9. Duplicate `FAQPage` schema output on any page

### SOFT signals (can release with a follow-up ticket)
1. Slight Lighthouse score dip but no CWV proxy regressions
2. Minor visual polish issues that do not affect CWV
3. Non-critical asset caching improvements pending

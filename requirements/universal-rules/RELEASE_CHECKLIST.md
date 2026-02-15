# Release Checklist — CalcHowMuch.com

> **Goal: 1 Million Unique Users / Month | 5 Million Page Views / Month | AdSense Revenue | Zero Google Penalties**
>
> This is the single release gate. Every change touching layout, CSS, JS, navigation, calculators,
> explanation/FAQ, ads, fonts, or shared UI components **must pass every HARD item** before merge.
> No back-and-forth. Release means release.
>
> **Authoritative references:**
>
> - `UNIVERSAL_REQUIREMENTS.md` — rule IDs (UR-CSS-xxx, UR-SEO-xxx, UR-TEST-xxx)
> - `Project Bible.md` — strategy, design intent, AdSense safety
> - `AGENTS.md` — agent operating contract, document chain
> - Sign-off destination: `release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md`

---

## A) Pre-Release (Dev) — Must Pass

### A1) Above-the-fold rendering order

- Calculator UI renders immediately; ads must never block first render.
- Initial state/results visible without waiting for ad scripts, late CSS, or JS hydration.
- No runtime injection adds new content above the fold after load (ads/nav/banners).
- Above-the-fold content is present in initial HTML — no JS-required content for primary calculator UI.

### A2) CSS architecture (systemic CLS prevention) — refs: UR-CSS-001..008

**Hard rules:**

- No runtime CSS `@import` anywhere (including calculator-specific CSS). Must pass: `npm run lint:css-import`.
- Shared UI styles delivered via direct `<link>` in `<head>`, not via importing another calculator's CSS. (UR-CSS-002)
- Per-calculator CSS contains only page-specific overrides — no copying shared library rules. (UR-CSS-004)
- When using `.home-loan-ui` design family: do NOT copy CSS from another calculator. Shared rules come from `shared-calculator-ui.css`. (UR-CSS-006)

**Critical layout rule:**

- Layout-critical selectors (hero/grid/form panel/slider rows) must be present in earliest CSS applied before first paint so the page does not "snap" later.

**Render-blocking guidance:**

- Do not introduce new blocking CSS unless justified as layout-critical.
- If DevTools shows "render-blocking resources," confirm: no waterfall chain exists; total blocking CSS remains small; layout is stable (CLS clean).
- Render-blocking CSS budget: ≤ 5 `<link rel="stylesheet">` tags in `<head>`. (UR-CSS-007)
- Record blocking CSS list in sign-off (Section N).

### A3) Layout stability (CLS control)

- No visible layout shift when results/tables appear, FAQs/explanation render, nav opens/closes, ads load, or images/icons appear.
- Any layout changes must use reserved space (placeholders/min-height) to avoid shifts.
- Ad slot no-fill behavior must not cause layout shifts.

### A4) JavaScript discipline (INP protection)

- No heavy computation on input/slider events.
- No long tasks (>50ms) on the interaction path.
- Non-essential scripts are deferred/lazy-loaded.
- Rapid slider drags + fast typing remain smooth (test for 5–10s).

### A5) Caching readiness (Cloudflare + browser)

- Static assets (CSS/JS/images/fonts) are cacheable long-term using versioning (query string or stable filenames).
- Cache-Control for static assets supports long caching; use `immutable` where appropriate.
- HTML caching rules do not serve stale critical content.

---

## B) Mobile & Tablet Release Checks — Must Pass

> Mobile-first indexing: mobile failures directly harm ranking.

### B1) Layout & navigation (mobile 375px, tablet 768px)

- Mobile is single-column calculator layout.
- Burger/left navigation does not cause CLS when opened/closed.
- Tap targets are usable (≥48×48px) with adequate spacing.
- No horizontal overflow on any calculator page.

### B2) Inputs on mobile

- Numeric inputs show numeric keyboard where relevant (`inputmode="decimal"`/`numeric`).
- `min`/`max`/`step` provided where applicable.
- No input jank under rapid interaction.

### B3) Ads on mobile — refs: Project Bible §17

- No ads above the calculator H1 on mobile. (hard rule)
- Ads do not overlap inputs/results or cover interactive elements.
- Ads do not resize after render in ways that cause CLS.
- Ad density complies with Better Ads Standards.

---

## C) Performance Metrics — Must Pass

### C1) Field targets (P75 — ranking-impacting)

| Metric | Good (P75) |  Warning  |  Fail   |
| ------ | ---------: | :-------: | :-----: |
| LCP    |     ≤ 2.5s |  2.5–4s   |  > 4s   |
| FCP    |     ≤ 1.8s |  1.8–3s   |  > 3s   |
| INP    |    ≤ 200ms |  200–500  | > 500ms |
| CLS    |     ≤ 0.10 | 0.10–0.25 | > 0.25  |

> Pre-release: lab gates + regression prevention. Field (CrUX) data is authoritative after rollout.

### C2) Lab gates (pre-release)

Run for each affected page:

- Desktop (1280×720, no throttling) — sanity check.
- Mobile (375×667, CPU 4×, Slow 3G) — release-relevant.

Checks:

- No visible layout shifts in filmstrip/trace.
- No long tasks near first interaction.
- Above-the-fold content renders quickly without ad-induced delay.
- Review DevTools "render-blocking resources" and justify any resource on the critical path.

---

## D) CWV Guard (Global Automated Gate) — Mandatory

> refs: UR-TEST-005, UR-TEST-006, UR-TEST-014

### D1) Route scope

All calculator routes from `public/config/navigation.json` (global coverage — no cherry-picking).

### D2) Execution

- Run in WSL/Linux.
- Modes: Normal and Stress (slow CSS/fonts + CPU throttle).
- Command: `npm run test:cwv:all`.
- Artifact: `test-results/performance/cls-guard-all-calculators.json`.
- Guard spec: `tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js`.

### D3) Release policy

**HARD FAIL (blocks release):**

- Any route CLS > 0.10.
- Any single shift > 0.05.
- Any route LCP > 2500ms.
- Any route INP proxy > 200ms.
- Any mobile FCP > 1800ms.

**SOFT WARNING (investigate before sign-off):**

- CLS 0.05–0.10.
- LCP 2000–2500ms.
- FCP 1500–1800ms.
- INP proxy 150–200ms.
- New CLS contributor vs baseline.

**Stress safety margin:** Stress LCP > 2300ms ⇒ investigate (fragility risk).

### D4) Baseline regression policy

- Track last-known-good metrics.
- Flag >20% CLS increase vs baseline even if under threshold.
- Flag any route whose median LCP > 30% above site median.

### D5) Root-cause heuristics

- Late CSS load / FOUC.
- Breakpoint/class toggles after load.
- Component/slider resize post-mount.
- Missing reserved dimensions.
- Ad container collapse/resize.
- Forced synchronous layout during init.

---

## E) Ads & AdSense Compliance — Must Pass

> Google/AdSense policy violations will suspend revenue; Better Ads violations cause Chrome filtering. Treat as critical.

### E1) Slot reservation (CLS prevention)

- Each ad slot reserves `min-height` per breakpoint.
- Slot container exists in initial HTML (not injected above fold later).
- Slot never collapses to 0 height on load/no-fill.

### E2) Load timing & correctness

- Ads load after initial calculator render (`requestIdleCallback` or idle handler).
- Ad scripts are async/deferred; not render-blocking.
- Exactly one AdSense loader `<script>` in `<head>`; no duplicates.
- Slot code matches canonical AdSense snippets.

### E3) AdSense policy (hard rules)

- No ads above H1 on mobile.
- No more than one ad unit visible above the fold on mobile.
- No ads that mimic calculator UI.
- No ads overlapping inputs/results.
- No auto-refresh of ad units.
- No ads on thin-content pages.

### E4) Better Ads Standards

- No pop-ups or prestitials.
- No large sticky ads covering >30% of viewport on mobile.
- No auto-playing video with sound.

### E5) Placement stability

- No unpredictable auto placements that insert above the fold.
- No refresh behavior that changes slot height.
- Right-column ad pane is constant and non-interfering.

---

## F) Animation & Visual Effects — Must Pass

- Use only `opacity`/`transform` for animations.
- No layout-property animations (`height`/`width`/`top`/`left`).
- Respect `prefers-reduced-motion`.
- Use `will-change` sparingly.

---

## G) Manual Regression Scenarios — Must Pass

### G1) First load (mobile + desktop)

- No visible jump or FOUC.
- Results render without pushing content unexpectedly.
- Ads load without shifting content.
- Calculator usable within 3s on throttled mobile.

### G2) Interaction

- Rapid slider drag for 5–10s: no lag/freezing.
- Fast typing: no input delay.
- Mode toggles: no layout snap/reflow flicker.
- Calculate click: result appears without visible reflow.

### G3) Navigation

- Subcategories collapsed by default.
- Direct landing expands only the correct subcategory.
- Expand/collapse does not shift main content.
- Navigation uses full-page `<a href>` links (MPA architecture).

---

## H) Accessibility — Must Pass

- Keyboard navigable (Tab/Shift+Tab/Enter/Space).
- Inputs have associated `<label>` or `aria-label`.
- Color contrast meets WCAG AA for normal text.
- `aria-live="polite"` on result containers.
- `aria-pressed` on button-group toggles.
- No `<select>` dropdowns for mode toggles — use button groups.
- Usable at 200% zoom without horizontal overflow.

---

## I) SERP Readiness — Must Pass

> refs: UR-SEO-001..031

### I1) Metadata integrity

- Unique, intent-aligned `<title>` (35–61 chars) and `<meta name="description">` (110–165 chars).
- Exactly one `<h1>` per page.
- Correct absolute canonical URL.
- `<meta name="robots" content="index,follow">` present in static HTML.
- `<meta name="viewport">` present; `lang` on `<html>`.

### I2) Structured data hygiene

- JSON-LD page-scoped only.
- Required schema: `WebPage`, `SoftwareApplication`, `BreadcrumbList`.
- `FAQPage` only when visible FAQs exist; no duplicates.
- FAQ three-place parity: JSON-LD ↔ module metadata ↔ visible FAQ.
- Validate via Rich Results Test.

### I3) Content indexability

- Explanation + FAQs in initial HTML (not JS-only).
- Headings and example formulas present in HTML.
- Page crawlable without JS.

### I4) Internal linking

- Category ↔ calculator links present in HTML.
- Related calculators cross-linked.
- BreadcrumbList schema matches visible breadcrumbs.

### I5) Intent coverage

- Primary intent reflected in title/H1/intro/meta.
- Secondary intents covered via explanation/scenarios/FAQs.
- No keyword stuffing; helpful content only.

### I6) Sitemap coverage (P0)

- Every calculator visible in navigation or reachable via URL appears in `public/sitemap.xml`.
- No dead URLs in sitemap; sitemap uses canonical URLs.
- Run `node scripts/generate-sitemap.js` after route changes.

---

## J) Content Quality — Must Pass

- Explanation section present (how formula works, inputs, interpretation).
- At least one worked example or scenario table.
- FAQ section with 3+ realistic user questions.
- Unique explanatory content per calculator (no thin duplicates).
- No hidden text or cloaking.

---

## K) Security & Trust — Must Pass

- Site served over HTTPS; no mixed content.
- No external scripts from untrusted origins.
- Privacy policy, terms, and contact pages exist and are linked.
- No malware or deceptive patterns.

---

## L) CWV Guard — Test Commands (must pass)

- `npm run test` — unit tests (every release).
- `npm run test:e2e` — scoped E2E (every release affecting routes).
- `npm run lint:css-import` — no `@import` (every release).
- `npm run lint` — ESLint.
- `npm run format:check` — Prettier.
- `npm run test:cwv:all` — CWV guard for all calculator routes (artifact required).
- `npm run test:iss001` — shell stability when layout/shell is changed.
- `npm run validate` — runs lint + lint:css-import + test + format:check.

All tests must pass before sign-off.

---

## M) Observability (Post-Release)

- 24–72 hours: Search Console indexing/coverage stable; no new structured data errors.
- Within next CrUX window: confirm no new "poor" CWV URL groups; track P75 mobile CWV trend.
- Monthly: monitor AdSense policy center and Search Console manual actions.

---

## N) Sign-off Evidence — Required

Record in `release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md`:

- CWV guard artifact summary (Normal + Stress for all affected routes).
- FCP/LCP/CLS/INP (mobile + desktop) recorded per affected calculator.
- DevTools "render-blocking resources" review (justification list).
- LCP element selector/text for each affected calculator.
- Stress-mode trace screenshots and notes.
- SEO verification results (Rich Results Test, schema check).
- Any SOFT warnings + decision notes.

Add one row to `Release Sign-Off Master Table.md` linking the sign-off file.

---

## O) Release Decision Rules

**HARD blockers (do not release):**

- CWV guard hard fail (any metric over threshold).
- Ads cause visible layout shift or violate AdSense/Better Ads rules.
- Ads above H1 on mobile.
- Duplicate AdSense loaders or modified slot snippets.
- Interaction jank (INP risk) or render blocked by ads/scripts.
- Metadata/canonical/schema integrity failures or duplicate FAQ schema.
- Explanation/FAQ missing from initial HTML.
- Missing sitemap entry for new/changed route.
- Accessibility failures (keyboard navigation broken, missing aria-live on results).

**SOFT signals (release allowed with follow-up ticket):**

- Minor Lighthouse dip with no CWV regressions.
- Minor visual polish issues not affecting CWV.
- Non-critical caching improvements pending.

---

# Elite Performance Checklist — Calculator Pages (Addendum)

> Use this deep-dive when optimizing LCP margin or investigating regressions for calculator routes.

## Objective

Maximize stress-mode LCP safety margin for calculator pages without over-engineering CSS. Target: stress-mode LCP ≤ 2300ms.

### Investigation — Must be performed (mobile + desktop)

- Identify LCP element from Performance trace; record selector/text.
- Confirm LCP element is deterministic and belongs to hero/calculator area.
- Measure FCP and hero paint readiness; target mobile FCP ≤ 1800ms.
- Verify no late CSS/JS required to render hero.
- Check for forced reflows or long tasks before LCP.

### Rendering & Delivery

- Ensure layout-critical CSS rules are in earliest CSS; no `@import` chains.
- Defer non-essential scripts until after first paint.
- Ensure sliders/inputs do not cause layout changes on mount.

### Stress validation

- Run Normal + Stress (CPU 4× + Slow 3G) on mobile and desktop.
- Pass criteria: LCP ≤ 2500ms; CLS ≤ 0.05; INP ≤ 200ms; preferred stress LCP ≤ 2300ms.

### Anti-overengineering

- Do not merge all CSS, add a bundler, or inline large CSS blobs.
- Keep MPA architecture and no SPA conversions.

---

## Summary — Why this matters

Every item protects: search traffic (ranking), ad revenue (AdSense safety), and user trust (engagement and repeat visits). Follow the checklist strictly — failures at scale cause severe traffic and revenue loss.

---

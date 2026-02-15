Release Checklist — Performance + Mobile + CWV + Ads (Release Gate)

Use this checklist for any change touching layout, CSS, JS, navigation, calculators, explanation/FAQ, ads, fonts, or shared UI components.

A) Pre-Release (Dev) — Must Pass
A1) Above-the-fold rendering order

Calculator UI renders immediately; ads must never block first render.

Initial state/results visible without waiting for:

ad scripts

late CSS

JS hydration

No runtime injection adds new content above the fold after load (ads/nav/banners).

A2) CSS architecture (systemic CLS prevention)

Hard rules

No runtime CSS @import anywhere (including calculator-specific CSS).

Must pass: npm run lint:css-import

Shared UI styles must be delivered via direct <link> in <head>, not via importing another calculator’s CSS.

Per-calculator CSS must contain only page-specific overrides (no copying shared library rules).

Critical layout rule

Layout-critical selectors (hero/grid/form panel/slider rows) must be present in the earliest CSS applied before first paint so the page does not “snap” later.

Render-blocking guidance (not a hard file-count gate)

Do not introduce new blocking CSS unless justified as layout-critical.

If DevTools shows “render-blocking resources,” confirm:

no waterfall chain exists

total blocking CSS remains small

layout is stable (CLS clean)

Keep a note of blocking CSS list in sign-off (see Section H).

A3) Layout stability (CLS control)

No visible layout shift when:

results/tables appear

FAQs/explanation render

nav opens/closes

ads load

images/icons appear

Any layout changes must use reserved space (placeholders/min-height) to avoid shifts.

A4) JavaScript discipline (INP protection)

No heavy computation on input/slider events.

No long tasks on the interaction path.

Non-essential scripts are deferred/lazy-loaded.

Rapid slider drags + fast typing remain smooth.

A5) Caching readiness (Cloudflare + browser)

Static assets (CSS/JS/images/fonts) are cacheable long-term using versioning (query string or hashed filenames).

Add/verify Cache-Control for static assets supports long caching; use immutable where appropriate.

HTML caching rules do not serve stale critical content.

B) Mobile & Tablet Release Checks — Must Pass
B1) Layout & navigation

Mobile is single-column calculator layout.

Burger/left navigation does not cause CLS when opened/closed.

Tap targets are usable: spacing, size, and clear expand/collapse affordance.

B2) Inputs on mobile

Numeric inputs show numeric keyboard where relevant.

min/max/step present where applicable.

No input jank under rapid interaction.

B3) Ads on mobile

Ads do not overlap inputs/results.

Ads do not push content unexpectedly.

Ads do not resize after render in a way that causes CLS.

C) Performance Metrics — Must Pass
C1) Field targets (release intent)

Google CWV thresholds (P75 field):

LCP ≤ 2.5s

INP ≤ 200ms

CLS ≤ 0.10

Note: field metrics update later; pre-release relies on lab gates + regression prevention.

C2) Lab gates (pre-release)

Run two lab modes on key pages:

Desktop (no throttling): sanity check

Mobile simulation (CPU throttle + slow network): release-relevant

Checks:

No visible layout shifts in filmstrip/trace.

No long tasks near first interaction.

Above-the-fold content renders quickly without ad-induced delay.

DevTools “render-blocking resources” is reviewed: anything listed must be:

truly layout-critical, or

moved off the critical path.

D) CWV Guard (Global Automated Gate) — Mandatory
D1) Route scope

All calculator routes from navigation config (global coverage).

D2) Execution

Must run in WSL/Linux.

Must run two modes:

Normal

Stress (slow CSS/fonts + CPU throttle)

Required command: npm run test:cwv:all

Required artifact: test-results/performance/cls-guard-all-calculators.json

D3) Release policy

HARD FAIL (blocks release)

Any route CLS > 0.10

Any single shift > 0.05

Any route LCP > 2.5s

Any route INP proxy > 200ms

SOFT WARNING (investigate before sign-off)

CLS 0.05–0.10

LCP 2.0–2.5s

INP proxy 150–200ms

New CLS contributor vs baseline

Stress safety margin warning

Stress LCP > 2300ms ⇒ warning (fragility risk). Investigate critical-path CSS and late layout rules.

D4) Baseline regression policy

Track last-known-good metrics.

Flag >20% CLS increase vs baseline even if still under threshold.

D5) Root-cause heuristics if guard fails

Late CSS load / FOUC?

Breakpoint/class toggles after load?

Component/slider resize post-mount?

Missing reserved dimensions?

Ad container collapse/resize?

E) Ads (Must Pass)
E1) Slot reservation

Each slot reserves min-height per breakpoint.

Slot container exists in initial layout (not injected above fold later).

Slot does not collapse to 0 height.

No-fill behavior must not cause layout shifts.

E2) Load timing and correctness

Ads load after initial render (idle window or first meaningful interaction).

Ad scripts are not render-blocking.

Exactly one AdSense loader in <head>. No duplicate loaders.

Slot code matches canonical snippets.

E3) Placement stability

No unpredictable auto placements that insert above fold.

No refresh behavior that changes slot height.

Sticky ads (if any) do not cover inputs or cause CLS.

F) Animation & Visual Effects — Must Pass

Animations use only opacity/transform.

No layout-property animations (height/width/top/left).

Heavy blur/glass effects above fold must be lightweight.

G) Manual Regression Scenarios — Must Pass
G1) First load

No visible jump.

Results render without pushing content unexpectedly.

Ads appear without shifting content.

G2) Interaction

Rapid slider drag 5–10 seconds: no lag/freezing.

Fast typing: no input delay.

Mode toggles: no layout snap/reflow flicker.

G3) Navigation

Subcategories collapsed by default.

Direct landing expands only the correct subcategory.

Expand/collapse does not shift main content pane.

H) Sign-off Evidence (Required)

Record in the release sign-off:

CWV guard artifact summary (Normal + Stress for affected routes)

A screenshot or note of DevTools “render-blocking resources” review (why each critical resource is justified)

Any SOFT warnings + decision notes

I) SERP Readiness — Must Pass
I1) Metadata integrity

Unique, intent-aligned title and meta description per calculator.

Correct canonical.

No duplicate/conflicting meta tags.

I2) Structured data hygiene

JSON-LD is page-scoped only (no global schema injection).

No duplicate FAQPage output.

Schema matches visible content.

Validate in Rich Results Test.

I3) Content indexability

Explanation + FAQs present in initial HTML (not JS-only).

Headings and formulas present in HTML.

Crawlable without JS.

I4) Internal linking

Category links to calculators; calculators link back to category.

Related calculators linked.

Links visible in HTML.

I5) Intent coverage

Primary intent reflected in title/H1/intro/meta.

Secondary intents covered via explanation/scenarios/FAQs.

No keyword stuffing.

J) Observability (Post-Release) — Required

Within 24–72 hours:

Search Console indexing/coverage stable (no new errors/excluded spikes).

Enhancements stable (no new structured data errors).

Within the next CWV field window (CrUX/Search Console CWV refresh cycles):

Confirm no new “poor” CWV groups created.

Track P75 mobile CWV trend (this is the SEO truth).

K) Release Decision Rules

HARD blockers (do not release)

CWV guard hard fail.

Ads cause visible layout shift.

Interaction jank (INP risk).

Render blocked by ads/non-essential scripts.

Metadata/canonical/schema integrity failures.

Explanation/FAQ missing from initial HTML.

Duplicate FAQ schema.

SOFT signals (release allowed with follow-up ticket)

Minor Lighthouse score dip with no CWV regressions.

Minor visual polish issues not affecting CWV.

Non-critical caching improvements pending (e.g., immutable header refinement).


🎯 Elite Performance Checklist — Calculator Pages
Objective

Improve stress-mode LCP margin for calculator pages without over-engineering the CSS architecture.

A) Investigation — Must Be Performed
A1) LCP identification

 Identify the current LCP element from Performance trace.

 Confirm the LCP element belongs to the expected hero/calculator area.

 Record the selector/text of the LCP element in the sign-off.

Pass condition: LCP element is deterministic and above-the-fold.

A2) Paint readiness timing

 Measure when the hero/calculator container first becomes paintable.

 Verify the container does not depend on late CSS or JS.

 Confirm no “flash then snap” behavior in filmstrip.

Pass condition: hero appears fully styled on first paint.

A3) Layout-critical CSS delivery

 All layout-critical rules (hero/grid/form/slider layout) are present in earliest CSS.

 No runtime CSS @import anywhere.

 No CSS dependency chains reintroduced.

 Shared UI CSS is loaded via direct <link> (not via another calculator).

Pass condition: no layout snap after CSS arrival.

A4) Style recalculation safety

 Confirm no late style recalculation delays hero render.

 Verify no class toggles or JS mutations affect above-the-fold layout.

 Ensure hero container size is stable on first layout pass.

Pass condition: no expensive style/layout work before LCP.

A5) Main-thread pre-LCP audit

 Check Performance trace for long tasks before LCP.

 Ensure calculator logic does not run heavy computation on load.

 Confirm slider/input initialization does not trigger forced layout loops.

 Defer non-essential scripts until after first paint or idle.

Pass condition: no long tasks before LCP.

B) Rendering Optimization — Above-the-Fold Efficiency
B1) Hero/LCP container efficiency

 Above-the-fold calculator container has minimal style complexity.

 Hero text/container is not hidden then revealed later.

 Hero has stable height and spacing from first paint.

 No large layout recalculation occurs before LCP.

Goal: earlier LCP paint.

B2) Slider and input safety

 Sliders do not trigger expensive layout work on first render.

 Input components do not resize containers post-mount.

 No forced reflow patterns (read → write → read) during init.

Goal: avoid hidden layout cost.

C) Network & Delivery Checks
C1) CSS integrity

 CSS files are cache-friendly and versioned.

 No accidental CSS dependency chains exist.

 Render-blocking CSS list reviewed and justified.

 Total blocking CSS remains small and parallelizable.

C2) Script discipline

 No third-party scripts run before first paint.

 Ads and analytics are deferred appropriately.

 No synchronous third-party work blocks render.

C3) HTML readiness

 HTML response is cache-friendly and stable.

 Above-the-fold content is present in initial HTML.

 No JS-required content for primary calculator UI.

D) Stress Mode Validation — Mandatory

Run:

Mode A: Normal

Mode B: Stress (CPU throttle + slow network)

D1) Hard pass criteria

 LCP ≤ 2500 ms

 CLS ≤ 0.05

 INP proxy ≤ 200 ms

 No new render-blocking regressions

D2) Safety margin target (recommended)

 Stress LCP ≤ 2300 ms (preferred buffer)

If between 2300–2500 ms → investigate but may pass.

E) Explicit Anti-Overengineering Rules (Do Not Violate)

Claude must NOT:

 Merge all CSS into one file

 Introduce a bundler pipeline

 Add blanket preload hacks

 Inline large CSS blocks blindly

 Optimize desktop at the expense of mobile

 Reintroduce CSS sharing via @import

F) Final Sign-Off Evidence

For each affected calculator:

 LCP element recorded

 Stress metrics recorded

 Render-blocking review completed

 No visual regressions above the fold

 CWV guard artifact attached

🟢 Final Position

This checklist now focuses purely on:

render pipeline health

layout determinism

main-thread discipline

stress LCP margin

…and leaves visual design freedom (including glassmorphism) fully under your control.
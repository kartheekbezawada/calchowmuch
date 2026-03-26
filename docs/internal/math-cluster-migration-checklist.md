# Math Cluster Migration Checklist

Use this checklist for every math route. The execution card remains the highest authority.

## Mandatory Context Refresh

- [ ] `requirements/math-migration/MATH_MIGRATION_EXECUTION_CARD.md` was re-read before work started.
- [ ] If this is route `3`, `6`, `9`, or a wave switch, the execution card was re-read again before continuing.
- [ ] Definition Of Done was re-validated against Engineering, Design, SEO, and CWV rules.
- [ ] One-calculator-at-a-time execution is being followed.

## Shared Pre-Flight

- [ ] Target route URL and calculator ID are logged.
- [ ] Current wave is logged.
- [ ] Route classification is logged or confirmed.
- [ ] Generated HTML was inspected before edits.
- [ ] Logic, hooks, IDs, and schema were inspected before edits.
- [ ] Layout and CSS were inspected for legacy markers.
- [ ] Design quality was inspected for clutter, hierarchy, first-screen usability, and duplicate UI.
- [ ] SEO/content was inspected for thin content, missing structure, and missing static schema.
- [ ] Scope vars were cleared or reset before generation/tests.

## Route Classification

- [ ] `Type 1` selected for shell-only migration.
- [ ] `Type 2` selected for shell plus cleanup.
- [ ] `Type 3` selected for rebuild.
- [ ] Classification reason logged.

Only one classification can be selected.

## Engineering Gate

- [ ] Route is single-pane `calc_exp` in generated output.
- [ ] Light answer-first shell is present.
- [ ] `theme-premium-dark.css` is absent from generated output.
- [ ] Legacy top nav is absent from generated output.
- [ ] Legacy left nav is absent from generated output.
- [ ] MPA `<a href>` navigation is preserved.
- [ ] Logic remains unchanged.
- [ ] Hooks remain unchanged.
- [ ] IDs remain unchanged.
- [ ] Schema intent remains unchanged.

## Design Gate

- [ ] `Simple Smooth Wow` standard is met.
- [ ] Primary answer is visually dominant.
- [ ] Secondary guidance follows the primary answer.
- [ ] Advanced detail is demoted below core action and answer.
- [ ] No duplicate controls remain.
- [ ] No competing result blocks remain.
- [ ] Advanced options are collapsed where density would clutter the first screen.
- [ ] First screen is usable on desktop.
- [ ] First screen is usable on mobile.
- [ ] No CLS-prone card expansion or awkward sticky-result behavior remains.
- [ ] No horizontal overflow remains on narrow screens.

## SEO / Content Gate

- [ ] 40-60 word snippet intro exists in static HTML.
- [ ] A quick-answer bullet list or table exists near the top.
- [ ] Formula section exists when applicable.
- [ ] Worked example exists.
- [ ] FAQ section is visible in HTML.
- [ ] Internal links to related calculators exist.
- [ ] JSON-LD is present in static HTML.
- [ ] JSON-LD includes `WebPage`.
- [ ] JSON-LD includes `SoftwareApplication`.
- [ ] JSON-LD includes `FAQPage`.
- [ ] JSON-LD includes `BreadcrumbList`.
- [ ] Content is simple, human-readable, and route-specific.

## CSS Integrity

- [ ] Route CSS was inspected before editing.
- [ ] No duplicated CSS blocks remain.
- [ ] No concatenated legacy CSS remains.
- [ ] Corrupted stylesheets were normalized instead of patched blindly.
- [ ] Legacy shell chrome was not reintroduced via route CSS.

## Module Safety

- [ ] DOM moves were checked against actual module selectors.
- [ ] Chart or table targets still exist when applicable.
- [ ] Runtime smoke test passed after layout work.
- [ ] No binding breakage remains.

## Generation And Verification

- [ ] Only the current route was regenerated.
- [ ] Generated public output was reviewed after regeneration.
- [ ] Generated output proves redesign state.
- [ ] Generated output does not reintroduce legacy shell markup.
- [ ] Generated output contains the required static HTML schema.

## Validation

- [ ] `npm run lint`
- [ ] scoped unit tests
- [ ] scoped e2e tests
- [ ] scoped SEO tests
- [ ] scoped CWV tests
- [ ] schema dedupe validation where applicable
- [ ] isolation/contracts checks when shared files changed
- [ ] any failing gate was fixed and re-run before route completion

## Logging

- [ ] Route audit captured.
- [ ] Files changed captured.
- [ ] Validation commands captured.
- [ ] Evidence paths captured.
- [ ] Tracker updated.
- [ ] Release sign-off reference added when implementation occurs.

## Stop Rules

- [ ] Stop if a fix requires forbidden files not yet in scope.
- [ ] Stop if a failure needs cross-route edits that would widen scope unexpectedly.
- [ ] Stop if generated output diverges from source intent in a way that suggests `Type 3`.
- [ ] Stop if Engineering, Design, SEO, or CWV fails.
- [ ] Stop before moving to the next route unless the current route fully passes.

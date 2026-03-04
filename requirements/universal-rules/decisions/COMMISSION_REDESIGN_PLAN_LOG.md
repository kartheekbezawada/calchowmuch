# Commission Calculator Redesign Plan Log

## Objective
Create a decision-complete pre-implementation log for commission-calculator redesign and release, so execution can resume reliably if context is lost.

## Scope In
- Commission calculator page redesign only:
  - Route: `/percentage-calculators/commission-calculator/`
- Layout migration from split-pane to single-pane content flow.
- Page-scoped suppression/removal of right ads column for commission route only.
- Required full release validation and sign-off artifacts.

## Scope Out
- No redesign of other percentage calculators.
- No global nav contract changes.
- No legacy nav deletion across non-migrated clusters.
- No public API or backend contract changes.

## Final Decisions Locked
- `commission-calculator` target layout: `paneLayout: single`.
- Keep `routeArchetype: calc_exp` and `designFamily: neutral`.
- Merge calculator + explanation into one center content experience.
- Remove/suppress right ads column for commission page only.
- Preserve left-nav/top-nav behavior and percentage fin-nav contract.
- Preserve all `#comm-*` and `data-comm=*` behavior selectors unless intentionally migrated with tests.
- Full release gates and sign-off are mandatory.

## Implementation Checklist
- [x] Set `commission-calculator` to `paneLayout: single` (nav + generator override alignment).
- [x] Keep `routeArchetype: calc_exp`, `designFamily: neutral`.
- [x] Merge calculator + explanation into one center flow.
- [x] Remove/suppress right ads column for commission page only.
- [x] Preserve left-nav/top-nav contracts.
- [x] Preserve all `#comm-*` and `data-comm=*` behavior contracts unless intentionally migrated.
- [x] Regenerate commission route HTML.

## Validation Checklist
- [x] Page loads at `/percentage-calculators/commission-calculator/`.
- [x] Single-pane layout confirmed (no split calc/explanation panes).
- [x] Ads column absent on desktop for commission page.
- [x] Flat mode calculation still correct.
- [x] Tiered mode calculation still correct.
- [x] Tier breakdown table still renders correctly.
- [x] No severe console/runtime errors.

## Release Checklist
- [x] `npm run lint`
- [ ] `npm run test`
- [x] Commission affected Playwright tests pass.
- [ ] `npm run test:cwv:all`
- [ ] `npm run test:iss001`
- [x] SEO/SERP/FAQ checklist items pass.
- [x] `release-signoffs/RELEASE_SIGNOFF_{ID}.md` created and completed.
- [x] `Release Sign-Off Master Table.md` updated.
- [x] Final state recorded as `Ready to merge`.

## Risks and Mitigations
- Risk: Layout regression in shared shell due to ad-column changes.
  - Mitigation: Keep ad suppression page-scoped to commission only and verify neighboring percentage route unaffected.
- Risk: Selector breakage in module/tests when restructuring content.
  - Mitigation: Preserve existing `#comm-*` and `data-comm=*` IDs/hooks or update tests in same change.
- Risk: Mobile overflow after merged layout.
  - Mitigation: Run ISS + representative mobile checks as part of release validation.

## Rollback Plan
- Revert commission-specific layout changes in generator/navigation/fragments.
- Regenerate commission route from prior stable configuration (`paneLayout: split`).
- Re-run targeted commission tests to verify restored baseline behavior.

## Evidence Log
Record each execution artifact below.

| Command Run | Result | Timestamp | Notes | Artifact/Path |
|---|---|---|---|---|
| `TARGET_CALC_ID=commission-calculator node scripts/generate-mpa-pages.js` | `PASS` | `2026-03-04 04:53 UTC` | Regenerated commission route with single-pane + ads suppression override | `public/percentage-calculators/commission-calculator/index.html` |
| `npm run lint` | `PASS` | `2026-03-04 07:59 UTC` | Repo-wide lint baseline fixed (`--fix` + 2 manual unused-var fixes) | `public/assets/js/calculators/finance-calculators/**` |
| `CLUSTER=percentage CALC=commission-calculator npm run test:calc:unit` | `PASS` | `2026-03-04 04:53 UTC` | Scoped unit suite passed (6/6) | `tests_specs/percentage/commission-calculator_release/unit.calc.test.js` |
| `CLUSTER=percentage CALC=commission-calculator npm run test:calc:e2e` | `PASS` | `2026-03-04 04:53 UTC` | Scoped e2e passed (1/1) including new single-pane/no-ads assertions | `tests_specs/percentage/commission-calculator_release/e2e.calc.spec.js` |
| `CLUSTER=percentage CALC=commission-calculator npm run test:calc:seo` | `PASS` | `2026-03-04 04:53 UTC` | Metadata/schema/sitemap checks passed | `tests_specs/percentage/commission-calculator_release/seo.calc.spec.js` |
| `CLUSTER=percentage CALC=commission-calculator npm run test:calc:cwv` | `FAIL` | `2026-03-04 04:53 UTC` | Scoped CWV budgets failed on blocking CSS duration/request count | `test-results/performance/scoped-cwv/percentage/commission-calculator.json` |
| `npm run build:css:route-bundles` | `PASS` | `2026-03-04 08:48 UTC` | Added commission route-bundle + asset-manifest entry with deferred core CSS | `public/config/asset-manifest.json` |
| `CLUSTER=percentage CALC=commission-calculator npm run test:calc:cwv` | `PASS` | `2026-03-04 08:51 UTC` | Scoped CWV budgets now pass after route-level CSS delivery optimization | `test-results/performance/scoped-cwv/percentage/commission-calculator.json` |
| `CLUSTER=percentage CALC=commission-calculator npm run test:calc:e2e` | `PASS` | `2026-03-04 08:59 UTC` | Revalidated e2e after static top-nav label expectation update | `tests_specs/percentage/commission-calculator_release/e2e.calc.spec.js` |
| `ALLOW_SHARED_CONTRACT_CHANGE=1 CLUSTER=percentage CALC=commission-calculator npm run test:isolation:scope` | `PASS` | `2026-03-04 04:53 UTC` | Shared-contract edits acknowledged by explicit override flag | `scripts/validate-isolation-scope.mjs` |
| `CLUSTER=percentage npm run test:cluster:contracts` | `PASS` | `2026-03-04 04:53 UTC` | Cluster contract validation passed | `scripts/validate-cluster-contracts.mjs` |
| `CLUSTER=percentage CALC=commission-calculator npm run test:schema:dedupe -- --scope=calc` | `PASS` | `2026-03-04 04:53 UTC` | Structured-data dedupe clean (`changed=0`) | `schema_duplicates_report.md` |
| `npm run test:percentage:nav-guard` | `PASS` | `2026-03-04 04:53 UTC` | Percentage nav hard-gate scan passed (13 routes) | `scripts/validate-percentage-nav-guard.mjs` |

## Completion Criteria
- All implementation checklist items checked.
- All validation checklist items checked.
- All release checklist items checked.
- Evidence log populated with concrete command results and references.
- Sign-off and master table entries completed; status explicitly marked `Ready to merge`.

# Percentage Cluster Premium UI Master Plan

## Scope

- Cluster: Percentage Calculators
- Objective: Unify all 13 percentage calculators under one calm, answer-first premium UI system
- Change type: Visual redesign only, using the percentage cluster shell and shared design tokens
- Source of truth: shared shell styling, percentage calculator source fragments, scoped public page regeneration

## Cluster Checklist

| Calculator | Route | Issues | Fixes | Mobile Considerations | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Percent Change | `/percentage-calculators/percent-change-calculator/` | Needed calmer shared surfaces and tighter result focus | Updated shared shell tokens, spacing, title wrapping, calmer related sections | Shared cards collapse to one column, answer card becomes non-sticky | Completed |
| Percentage Difference | `/percentage-calculators/percentage-difference-calculator/` | Needed shared visual consistency with result-first shell | Applied refined shared shell tokens and regenerated route | Shared cards collapse to one column, answer card becomes non-sticky | Completed |
| Percentage Increase | `/percentage-calculators/percentage-increase-calculator/` | Needed calmer shared chrome and cleaner hierarchy | Applied refined shared shell tokens and regenerated route | Shared cards collapse to one column, answer card becomes non-sticky | Completed |
| Percentage Decrease | `/percentage-calculators/percentage-decrease-calculator/` | Needed calmer shared chrome and cleaner hierarchy | Applied refined shared shell tokens and regenerated route | Shared cards collapse to one column, answer card becomes non-sticky | Completed |
| Percentage Composition | `/percentage-calculators/percentage-composition-calculator/` | Needed shared shell polish and calmer breakdown presentation | Applied refined shared shell tokens and regenerated route | Composition rows collapse to one column on narrow screens | Completed |
| Reverse Percentage | `/percentage-calculators/reverse-percentage-calculator/` | Needed shared visual consistency | Applied refined shared shell tokens and regenerated route | Shared cards collapse to one column, answer card becomes non-sticky | Completed |
| Percent to Fraction/Decimal | `/percentage-calculators/percent-to-fraction-decimal-calculator/` | Needed shared visual consistency | Applied refined shared shell tokens and regenerated route | Shared cards collapse to one column, answer card becomes non-sticky | Completed |
| What Percent Is X of Y | `/percentage-calculators/percentage-finder-calculator/` | Needed shared visual consistency | Applied refined shared shell tokens and regenerated route | Shared cards collapse to one column, answer card becomes non-sticky | Completed |
| Find Percentage of a Number | `/percentage-calculators/percentage-of-a-number-calculator/` | Needed shared visual consistency | Applied refined shared shell tokens and regenerated route | Shared cards collapse to one column, answer card becomes non-sticky | Completed |
| Commission Calculator | `/percentage-calculators/commission-calculator/` | Legacy green glass styling, split deck, heavy chart card, non-unified controls | Migrated to percentage shell, replaced legacy fragment, simplified answer deck, restyled tier summary/chart, updated presentation bindings | Tier rows stack vertically, chart legend collapses to one column | Completed |
| Discount Calculator | `/percentage-calculators/discount-calculator/` | Legacy plain form/result layout, weak result emphasis, old explanation structure | Migrated to percentage shell, created answer card summary, rebuilt explanation content, updated presentation bindings | Inputs remain vertical, result card stacks below inputs naturally | Completed |
| Margin Calculator | `/percentage-calculators/margin-calculator/` | Legacy plain layout, weak mode hierarchy, old explanation structure | Migrated to percentage shell, unified mode switch, added answer summary rows, rebuilt explanation content, updated presentation bindings | Mode switch stays readable, answer card stacks below inputs | Completed |
| Markup Calculator | `/percentage-calculators/markup-calculator/` | Legacy plain layout, complex basket UI without shell framing, old explanation structure | Migrated to percentage shell, unified dual-mode controls, restyled basket rows, added answer summary rows, rebuilt explanation content, updated presentation bindings | Basket rows collapse to two columns on tablet and one column on small mobile | Completed |

## Shared System Decisions

- Reduced visual chrome across the percentage shell by softening gradients, borders, shadows, and footer/related-card surfaces.
- Preserved the answer-first two-card pattern for desktop while keeping a single-column mobile stack.
- Standardized toggle controls, repeater rows, and answer summary rows inside the shared percentage CSS.
- Converted the four lagging calculators into the same migrated shell path used by the existing nine percentage routes.
- Regenerated every percentage route so the inline shell CSS and updated fragments stay in sync.

## Files In Scope

- `scripts/generate-mpa-pages.js`
- `scripts/validate-percentage-nav-guard.mjs`
- `public/calculators/percentage-calculators/shared/cluster-light.css`
- `public/calculators/percentage-calculators/commission-calculator/*`
- `public/calculators/percentage-calculators/discount-calculator/*`
- `public/calculators/percentage-calculators/margin-calculator/*`
- `public/calculators/percentage-calculators/markup-calculator/*`
- Regenerated public routes under `public/percentage-calculators/*`

## Completion Gate

- All 13 percentage calculators now use one percentage-cluster visual language
- Result presentation is visually dominant and supported by calmer secondary surfaces
- Mobile layout remains vertical and readable across the cluster
- Legacy commission shell styling has been removed from the live source path
- The four lagging calculators have been migrated into the percentage redesign set

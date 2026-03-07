# Fraction Calculator Execution Checklist

## Phase 1. Requirement Freeze
- [x] Requirement document created in `requirements/Calculators Math/Fraction Calculator.md`
- [x] Route locked to `/math/fraction-calculator/`
- [x] Calculator ID locked to `fraction-calculator`
- [x] Target audience locked to high-school students
- [x] v1 mode scope locked to add, subtract, multiply, divide, simplify, convert
- [x] Route contract locked to `calc_exp + neutral + single`

## Phase 2. Route / Layout Migration
- [x] `public/config/navigation.json` updates fraction calculator to `paneLayout=single`
- [x] Legacy split-pane implementation is removed from the calculator fragment
- [x] Inline `@import` pattern is removed from the fragment
- [x] Generated route reflects the single-pane contract

## Phase 3. Fraction Engine And Step Logic
- [x] Shared fraction helpers exported from `module.js`
- [x] Add mode shows LCD, equivalent fractions, combine step, simplify step
- [x] Subtract mode shows LCD, equivalent fractions, combine step, simplify step
- [x] Multiply mode shows multiply-top / multiply-bottom steps
- [x] Divide mode shows reciprocal step before multiply
- [x] Simplify mode shows GCD and divide-both-sides step
- [x] Convert mode shows improper-to-mixed and mixed-to-improper steps
- [x] Negative values supported correctly
- [x] Denominator-zero errors shown in plain English

## Phase 4. UI And Design Implementation
- [x] Teacher-style single-pane workspace implemented
- [x] Mode tabs are visually clear and keyboard reachable
- [x] Result area shows final answer, simplest form, steps, and teacher note
- [x] Default solved example is visible on first load
- [x] No graph or finance-style dashboard patterns remain
- [x] Mobile layout stays readable

## Phase 5. Explanation And FAQ Rebuild
- [x] Explanation is fully rewritten in simple English
- [x] Explanation order follows `H2 -> Intent -> Complete Practical Guide -> FAQ -> Important Notes`
- [x] No redundant `How to Guide` heading remains
- [x] 10 visible FAQ cards are present
- [x] No mojibake or corrupted symbols remain

## Phase 6. SEO / Schema Wiring
- [x] Title matches requirement document
- [x] Meta description matches requirement document
- [x] Canonical matches production route
- [x] `WebPage` JSON-LD present
- [x] `SoftwareApplication` JSON-LD present
- [x] `BreadcrumbList` JSON-LD present and accurate
- [x] `FAQPage` JSON-LD present and matches visible FAQ count

## Phase 7. Test Replacement And Expansion
- [x] Unit tests import shared helpers instead of duplicating the engine
- [x] Placeholder E2E test replaced with real route coverage
- [x] Placeholder SEO test replaced with real metadata/schema coverage
- [x] CWV guard retained and passing

## Phase 8. Scoped Generation And Verification
- [x] Scoped fraction route generation completed
- [x] Generated route output updated in `public/math/fraction-calculator/index.html`
- [x] `CLUSTER=math CALC=fraction-calculator npm run test:calc:unit` passes
- [x] `CLUSTER=math CALC=fraction-calculator npm run test:calc:e2e` passes
- [x] `CLUSTER=math CALC=fraction-calculator npm run test:calc:seo` passes
- [x] `CLUSTER=math CALC=fraction-calculator npm run test:calc:cwv` passes
- [x] Route is ready for release sign-off / merge handoff

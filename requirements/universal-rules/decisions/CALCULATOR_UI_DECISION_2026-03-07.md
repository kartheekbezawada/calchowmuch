# Calculator UI Decision Log - 2026-03-07

## Decision ID
- DEC-UI-20260307-001

## Scope
- Personal Loan calculator route: `/loan-calculators/personal-loan-calculator/`

## Decisions
1. Advanced options summary line must be compact:
- `Advanced Options` and `Optional` appear in the same row (single-line summary) with one caret state indicator.

2. Guide heading spacing after table:
- Add explicit vertical spacing before `Personal Loan Complete Practical Guide` so the heading does not visually touch the amortization table area.

## Why
- Improves scanability and visual hierarchy.
- Reduces clutter and avoids cramped transitions between table and long-form explanation content.
- Creates a repeatable UI standard for future calculator builds.

## Implementation Reference
- `public/calculators/loan-calculators/personal-loan-calculator/calculator.css`
  - `#calc-personal-loan .advanced-summary-copy`
  - `#loan-personal-explanation h2`

## Governance Link
- `requirements/universal-rules/CALCULATOR_BUILD_GUIDE.md`
  - Advanced disclosure compact one-row rule
  - Graph/table and spacing quality standards

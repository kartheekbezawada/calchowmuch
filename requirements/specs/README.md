# Requirement Specs

This directory hosts the human-readable acceptance criteria that mirror the automated tests under `tests/`.
Each specification is grouped by calculator or feature so reviewers can see the expected outcomes before running the tests.

## Structure

- `calculators/` — acceptance specs for individual calculators (how-much-can-borrow, remortgage, percentage, etc.).
- `core/`, `loans/`, `finance_tests/`, `e2e/` — feature-specific requirements that inform broader test suites.

## Writing a Spec

1. Copy the naming pattern from the automated test that the spec documents (`<feature>.spec.js`).
2. Explain the user journey, edge cases, and acceptance criteria in plain English (section headings, bullet lists, tables, etc.).
3. Keep references to the matching automated tests so readers can map requirements to code.

## Running the Matching Tests

Trigger the automated suites from the project root:

```
npm test
npm run test:e2e
```

The specs in this folder are intentionally descriptive, while the executables live under `tests/`.
Use this README as the starting point when you add or update acceptance coverage.

## Reference Outputs

Expected output artifacts (screenshots, tables, example results) live under `requirements/expected_results/` so testers know what the application should produce.

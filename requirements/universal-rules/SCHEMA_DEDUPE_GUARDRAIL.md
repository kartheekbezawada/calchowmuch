# Structured Data Dedupe Guardrail

## 1) Purpose

Prevent duplicate JSON-LD target schema types on a single URL and provide deterministic build-time enforcement with machine-readable artifacts.

## 2) Target Schema Types (Mandatory)

- `FAQPage`
- `BreadcrumbList`
- `SoftwareApplication`

Per-page rule: each target type must appear at most once in final HTML.

## 3) Command Contract

Primary command:

- `npm run test:schema:dedupe`

Scoped execution:

- Full repo: `npm run test:schema:dedupe -- --scope=full`
- Cluster: `CLUSTER=<cluster> npm run test:schema:dedupe -- --scope=cluster`
- Single calculator: `CLUSTER=<cluster> CALC=<calc> npm run test:schema:dedupe -- --scope=calc`
- Optional single route: `npm run test:schema:dedupe -- --scope=route --route=/some/path/`

Default behavior:

- No `--scope` value means full repo scope.

## 4) Scope Modes

- `full-repo`: all generated `public/**/index.html`.
- `cluster`: routes owned by `CLUSTER`.
- `single-calculator`: one calculator resolved by `CLUSTER` + `CALC`.
- `route` (optional): one explicit route path.

Scope alias support:

- `full-repo` -> `full`
- `single-calculator` -> `calc`

## 5) Parser and Normalization Rules

For each HTML page:

1. Extract every `<script type="application/ld+json">` block.
2. Parse JSON with try/catch and mark parse failures.
3. Normalize schema nodes from:
   - single object root
   - array root
   - object/array entries containing `@graph`
4. Count `@type` for target types, including `@type` arrays.
5. Record per type:
   - containing block indexes
   - snippets:
     - `FAQPage`: first 1-2 question names
     - `BreadcrumbList`: breadcrumb names
     - `SoftwareApplication`: `name` and/or `applicationCategory`

## 6) Auto-Dedupe Policy

When duplicates are detected:

- Keep first occurrence per target type on that page.
- Remove later duplicates for target types.
- Preserve all non-target schema types.
- Preserve parseable JSON-LD blocks and script ordering.

## 7) Report Artifacts (Repository Root)

- `schema_duplicates_report.md`
- `schema_duplicates_report.csv`

Per-page reporting includes:

- file path and derived URL
- JSON-LD block count
- target counts (pre-fix and post-fix)
- blocks containing each target type
- snippets
- status and action

## 8) Status and Fail Conditions

Page statuses:

- `OK`: no parse errors; no duplicate target types after dedupe.
- `DUPLICATE`: duplicates still remain after dedupe attempt.
- `PARSE_ERROR`: at least one JSON-LD block is invalid JSON.

Build/test gate result:

- PASS: all pages `OK` (auto-fix allowed).
- FAIL: any `PARSE_ERROR` or `DUPLICATE`.

## 9) Release Mode Matrix

`SCHEMA_DEDUPE_MAINTENANCE`:

- Mandatory: `npm run test:schema:dedupe`
- Optional unless promoted by HUMAN: `lint`, `test`, `test:e2e`, `test:cwv:all`, `test:iss001`

`NEW_BUILD | ONBOARDING | REDESIGN`:

- Mandatory full gates:
  - `npm run lint`
  - `npm run test`
  - `npm run test:e2e`
  - `npm run test:cwv:all`
  - `npm run test:iss001`
  - `npm run test:schema:dedupe`

## 10) Sign-off Evidence Requirements

Release sign-off must include:

- selected dedupe scope mode
- exact command executed
- summary (`scanned`, `changed`, `parseErrors`, `unresolved`)
- attached/generated artifacts:
  - `schema_duplicates_report.md`
  - `schema_duplicates_report.csv`

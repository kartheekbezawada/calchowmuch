# Math Cluster Migration Checklist

Use this checklist for every future math calculator migration wave. Copy the relevant sections into the active working note for the route or wave, then mark each item explicitly.

## Shared Pre-Flight Checklist

- [ ] Scope is approved and lists exact allowed files.
- [ ] Target route URL, calculator ID, and route classification type are logged.
- [ ] Existing math routes in the same subdomain were reviewed, along with approved non-math redesign references if math has no valid migrated reference route yet.
- [ ] Terminal scope vars were cleared or reset before running any scoped command.
- [ ] Shared-file changes, if any, were declared before editing.
- [ ] The target route was manually opened once before design work starts.
- [ ] Module bindings, IDs, chart hooks, table hooks, and share/export hooks were inspected.
- [ ] Route stylesheet was checked for duplicated, concatenated, or obviously corrupted CSS blocks.
- [ ] Existing explanation structure and FAQ/schema parity were reviewed.

## Route Classification Checklist

- [ ] Classified as `Type 1: straight shell migration`.
- [ ] Classified as `Type 2: shell migration plus content/test cleanup`.
- [ ] Classified as `Type 3: reconstruction route`.
- [ ] Classification reason was logged.

Only one route classification should be selected.

## Design Migration Checklist

- [ ] The `Math Design Contract` section in the master plan was reviewed before design work started.
- [ ] Legacy shell state identified correctly as either `single-pane legacy` or `split legacy`.
- [ ] The route was not treated as migrated solely because `paneLayout=single`.
- [ ] `paneLayout=single` target confirmed for the route.
- [ ] Legacy dark shell markers to remove were identified explicitly.
- [ ] Main result is answer-first and visually stronger than supporting detail.
- [ ] No dark-era shell styling remains.
- [ ] No top-nav/left-nav/ad-column carryover remains if the route previously depended on shell chrome.
- [ ] Controls use the migrated visual language and do not fight the shared shell.
- [ ] Route-specific graphs, tables, derivations, and secondary actions were placed under a clear result hierarchy.
- [ ] Desktop layout preserves hierarchy without becoming visually heavy.
- [ ] Mobile layout collapses to a clean single-column flow.
- [ ] Small-screen result behavior is usable and not awkwardly sticky.
- [ ] Tables, graphs, and secondary detail do not overshadow the main answer.
- [ ] No horizontal overflow occurs on narrow screens.
- [ ] Long formulas, notation, and dense labels remain readable.

## CSS Integrity Checklist

- [ ] Route CSS was inspected before editing.
- [ ] No duplicated CSS blocks remain.
- [ ] No concatenated legacy route blocks remain.
- [ ] If CSS was already corrupted, the stylesheet was rebuilt cleanly instead of incrementally patched.
- [ ] Route-specific CSS only covers functional differences, not legacy shell chrome.

## Module Safety Checklist

- [ ] All required IDs were preserved.
- [ ] All required classes/data hooks were preserved.
- [ ] Chart/table/render targets still exist.
- [ ] Share/export actions still bind correctly.
- [ ] Layout moves were checked against actual module queries.
- [ ] Manual smoke test confirms no runtime break after layout changes.
- [ ] Any blocking runtime issue was fixed before polishing work continued.

## Content And Writing Checklist

- [ ] Writing follows the math design contract, not only the content contract.
- [ ] The route keeps an intent-led `H2`.
- [ ] `How to Guide` section exists.
- [ ] `FAQ` section exists.
- [ ] `Important Notes` is the last section.
- [ ] `Last updated: <Month YYYY>` exists.
- [ ] `Accuracy` note exists.
- [ ] `Disclaimer` or approved domain-specific disclaimer label exists.
- [ ] `Assumptions` note exists.
- [ ] Exact privacy sentence exists: `All calculations run locally in your browser - no data is stored.`
- [ ] Writing is direct, technical, and route-specific.
- [ ] Writing avoids filler and generic product copy.
- [ ] Explanation does not over-teach unrelated theory.
- [ ] FAQ meaning matches visible content and schema intent.
- [ ] Worked examples, if present, use route-relevant numbers.

## Anti-Repeat Issue Checklist

- [ ] No stale env var risk remains for generation/tests.
- [ ] No generator/config registration step was skipped.
- [ ] No silent scope widening occurred.
- [ ] No route was classified as migrated using config alone; generated output and shell markers were checked.
- [ ] No legacy split layout artifact remains.
- [ ] No legacy single-pane dark-shell artifact remains.
- [ ] No duplicated or corrupted CSS block remains.
- [ ] No route-specific shell override reintroduced legacy styling.
- [ ] No module binding was broken by markup movement.
- [ ] No route-source mismatch was ignored; reconstruction was chosen if needed.
- [ ] No explanation contract drift remains.
- [ ] No note-key inconsistency remains.
- [ ] No visible/schema FAQ mismatch remains.
- [ ] No route was treated as finished before regenerated output was checked.

## Generation And Verification Checklist

- [ ] Only the approved route was regenerated.
- [ ] Generated public output was reviewed after regeneration.
- [ ] Generated route still renders single-pane as intended.
- [ ] Generated explanation/order matches source intent.
- [ ] Generated output does not reintroduce legacy shell markup.

## Testing Checklist

- [ ] Lint completed.
- [ ] Scoped unit tests completed.
- [ ] Scoped e2e tests completed.
- [ ] Scoped SEO tests completed.
- [ ] Scoped CWV tests completed.
- [ ] Schema dedupe validation completed where applicable.
- [ ] Isolation/contracts checks completed when shared files changed.
- [ ] Any failure was classified as in-scope, shared-scope, or unrelated baseline.
- [ ] In-scope failures were fixed and re-run.

## Design QA Checklist

- [ ] Desktop screenshot/review completed.
- [ ] Mobile screenshot/review completed.
- [ ] Baseline and final visual evidence were captured or logged.
- [ ] Main answer is visible and clear without visual hunting.
- [ ] Math notation/expressions remain legible.
- [ ] Tables and graphs remain readable.
- [ ] Legacy shell markers are absent in the generated route output.
- [ ] Control labels and helper text remain clear.
- [ ] Related/explanation/supporting sections do not crowd the hero/result zone.

## Logging Checklist

- [ ] Route scope was logged.
- [ ] Files changed were logged.
- [ ] Route classification was logged.
- [ ] Issues found were logged.
- [ ] Fixes applied were logged.
- [ ] Validation commands were logged.
- [ ] Artifact paths were logged.
- [ ] Follow-up items were logged.
- [ ] Wave status tracker was updated when implementation happens.
- [ ] Release sign-off reference was added when implementation happens.

## Stop-And-Ask Conditions

- [ ] Stop if the fix requires forbidden files.
- [ ] Stop if tests fail outside approved scope and need extra edits.
- [ ] Stop if the route is clearly a reconstruction case but scope assumed a simple shell migration.
- [ ] Stop if generator/shared-shell changes are required but were not pre-approved.
- [ ] Stop if module behavior depends on markup structure that cannot be safely preserved within scope.

## Route Sign-Off Template

Use this compact template in the active wave log:

### Scope

- Route:
- URL:
- Classification:
- Allowed files:
- Approved shared files:

### Issues Found

- Design:
- Writing/content:
- Runtime/module:
- CSS/layout:

### Fixes Applied

-

### Validation

- Commands run:
- Result:

### Artifacts

-

### Follow-Ups

-

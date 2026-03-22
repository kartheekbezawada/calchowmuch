# Finance Cluster KT Handoff

## Purpose

This document is the handoff note for another coding agent to continue Finance calculator work without rediscovering the redesign system, source-of-truth files, rollout rules, and current state.

---

## What Was Done

- The Finance calculator family was moved from the old dark shell-driven design to a new light premium Finance design system.
- The main Finance routes now use the new source tree under `public/calculators/finance-calculators/**`.
- Generated public Finance routes live under `public/finance-calculators/**`.
- Shared Finance design and UX were introduced:
  - `public/calculators/finance-calculators/shared/cluster-light.css`
  - `public/calculators/finance-calculators/shared/cluster-ux.js`
- Generator support was added so Finance migrated routes render from the new Finance source tree instead of the legacy split source.
- Finance route discoverability, ownership, schema direction, and scoped test mapping were updated.
- The Finance cluster rollout was closed out and documented.
- A new `inflation` calculator was added later and wired into Finance navigation, tests, generator config, homepage discovery, and release signoff.
- Cloudflare build/deploy issues were fixed by adding:
  - `build` script in `package.json`
  - `build:css:route-bundles` script in `package.json`
  - `scripts/sync-route-bundle-manifests.mjs`

---

## Design Intent

The new Finance design should feel:

- light
- premium
- calm
- intentional
- analytical but not corporate
- easy to scan
- mobile-friendly

It should not feel:

- dark
- neon
- dashboard-heavy
- shell-driven
- cluttered
- boxy

Key design rules:

- no `top-nav`, `left-nav`, or ads column on migrated Finance routes
- centered single-column layout
- strong answer-first result hierarchy
- short calm intro
- generous spacing and section separation
- explanation order stays: answer-first summary, `How to Guide`, `FAQ`, `Important Notes`
- post-load edits should not recalculate until `Calculate`

Primary design reference:

- `requirements/universal-rules/finance-calculators-cluster-redesign/DESIGN_SYSTEM.md`

---

## Important Documents

Read these first:

- `AGENTS.md`
- `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md`
- `requirements/universal-rules/finance-calculators-cluster-redesign/ACTION_PAGE.md`
- `requirements/universal-rules/finance-calculators-cluster-redesign/DESIGN_SYSTEM.md`
- `requirements/universal-rules/finance-calculators-cluster-redesign/DECISION_LOG.md`
- `requirements/universal-rules/finance-calculators-cluster-redesign/ROLLOUT_PLAN.md`
- `requirements/universal-rules/finance-calculators-cluster-redesign/EXECUTION_LOG.md`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-20260320-FINANCE-CLUSTER-REDESIGN.md`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-20260321-INFLATION.md`

---

## Source Of Truth

### New Finance route source

- `public/calculators/finance-calculators/*/index.html`
- `public/calculators/finance-calculators/*/explanation.html`
- `public/calculators/finance-calculators/*/calculator.css`
- `public/calculators/finance-calculators/*/module.js`

### Shared Finance layer

- `public/calculators/finance-calculators/shared/cluster-light.css`
- `public/calculators/finance-calculators/shared/cluster-ux.js`

### Generated public output

- `public/finance-calculators/*/index.html`

### Generator

- `scripts/generate-mpa-pages.js`

### Finance route and test wiring

- `public/config/navigation.json`
- `config/clusters/route-ownership.json`
- `config/testing/test-scope-map.json`

---

## Current Finance Route Set

Core cluster redesign set:

1. `present-value`
2. `future-value`
3. `present-value-of-annuity`
4. `future-value-of-annuity`
5. `effective-annual-rate`
6. `simple-interest`
7. `compound-interest`
8. `investment-growth`
9. `time-to-savings-goal`
10. `monthly-savings-needed`
11. `investment-return`

Added afterward:

- `inflation`

Inflation-specific release test folder:

- `tests_specs/finance/inflation_release`

---

## Best Route References

Use these as implementation references:

- `public/calculators/finance-calculators/present-value-calculator/`
  - clean baseline migration example
- `public/calculators/finance-calculators/inflation-calculator/`
  - richer modern Finance route with scenario content, charts, SEO/schema work, and homepage discoverability wiring

---

## How To Add Or Migrate A Finance Calculator

1. Create a route folder under `public/calculators/finance-calculators/<route>/`
2. Add:
   - `index.html`
   - `explanation.html`
   - `calculator.css`
   - `module.js`
3. Reuse the shared Finance shell and class structure rather than the old shell.
4. Keep:
   - MPA route behavior
   - single-pane layout
   - calculator logic contracts
   - metadata/schema parity
   - FAQ visible/schema parity
5. Add route wiring in:
   - `public/config/navigation.json`
   - `config/clusters/route-ownership.json`
   - `config/testing/test-scope-map.json`
   - `scripts/generate-mpa-pages.js`
6. Add scoped tests under `tests_specs/finance/<calc>_release/`
7. Generate the route and run scoped tests.

---

## Commands The Next Agent Will Need

Generate one calculator:

```bash
TARGET_CALC_ID=<id> node scripts/generate-mpa-pages.js
```

Generate one route:

```bash
TARGET_ROUTE=/finance-calculators/<slug>/ node scripts/generate-mpa-pages.js
```

Full production build:

```bash
npm run build
```

Repair stale route-bundle manifests:

```bash
npm run build:css:route-bundles
```

Scoped unit test:

```bash
CLUSTER=finance CALC=<id> npm run test:calc:unit
```

Scoped Playwright bundle:

```bash
CLUSTER=finance CALC=<id> npm run test:calc:playwright
```

Schema dedupe:

```bash
CLUSTER=finance CALC=<id> npm run test:schema:dedupe -- --scope=calc
```

---

## Known Legacy Debt Still Present

These old source locations still exist and should be treated as cleanup debt until explicitly retired:

- `content/calculators/finance-calculators/**`
- `public/assets/css/calculators/finance-calculators/**`
- `public/assets/js/calculators/finance-calculators/**`
- `public/calculators/finance/savings-goal/**`

Do not delete them blindly. Confirm generator and test references first.

---

## Important Governance Notes

- Finance redesign work was done under scoped route/cluster rollout governance.
- `ACTION_PAGE.md` and `EXECUTION_LOG.md` are the authoritative redesign-control documents.
- Logs are append-only.
- If continuing migration or cleanup, update the redesign docs pack rather than creating disconnected notes.
- If working under strict scope rules, declare the file scope before edits.

---

## Handoff Summary

If another agent is taking over:

- start with `ACTION_PAGE.md`
- then read `DESIGN_SYSTEM.md`
- then read the latest entries in `EXECUTION_LOG.md`
- use `present-value` as the baseline migration example
- use `inflation` as the most feature-rich Finance reference
- treat legacy Finance source paths as cleanup debt, not source-of-truth
- use `npm run build` for deploy validation


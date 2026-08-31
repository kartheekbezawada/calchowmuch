# Salary Cluster SEO Consolidation — Execution Checklist

Full rationale + matrix: the plan file. This is the working checklist. Tick items as done; keep
the **Progress log** at the bottom current.

**Target:** 12 routes → 6 (hub + `salary-calculator`, `annual-to-monthly-salary-calculator`
[reframed as the pay converter], `overtime-pay-calculator`, `raise-calculator`,
`bonus-calculator`). Retire 6, all 301'd.

**Sequence:** Phase A (content) ships first → wait ~1–2 weeks / one crawl cycle → Phase B
(removals + 301s) in one PR → Phase C (monitor 4–8 weeks). **Do not start Phase B early.**

---

## Global rules (apply to every page touched)

- **Metadata triple must stay byte-identical.** A page's title / description / H1 live in THREE
  places that must match exactly:
  1. `scripts/generate-mpa-pages.js` → `CALCULATOR_OVERRIDES['<id>']` (~line 364+)
  2. `public/calculators/salary-calculators/<id>/module.js` → `buildSalaryMetadata({...})`
  3. `tests_specs/salary/shared/config.js` → `SALARY_CALCULATOR_CONFIGS['<id>']`
  Change one → change all three, or the SEO spec fails.
- **FAQ appears TWICE and must be synced.** The static build extracts FAQ JSON-LD from
  `explanation.html` (`sal-faq-grid` articles); `<id>/module.js` also has a hardcoded
  `FAQ_SCHEMA` that `setPageMetadata` swaps into `script[data-calculator-ld]` at runtime. If you
  rewrite the explanation FAQ, mirror the same questions into `module.js` `FAQ_SCHEMA` or a
  JS-rendering crawler sees stale questions. (No test catches this — it's a quality gap.)
- **`explanation.html` structure contract** (enforced by `scripts/content-quality-thin-score.mjs`):
  - Section order: **How to Guide → Frequently Asked Questions → Important Notes**, Important Notes
    **last**.
  - Important Notes `<ul>` must contain keys: `Last updated:`, `Accuracy:`, `Disclaimer:`,
    `Assumptions:`, `Privacy:`.
  - Privacy line **exact**: `All calculations run locally in your browser - no data is stored.`
  - Last-updated format **exact**: `Last updated: <Month YYYY>` → use **`August 2026`** on every
    page touched now.
  - FAQ markup: `<div class="sal-faq-grid">` containing only
    `<article class="sal-related-card"><h3>Question?</h3><p>Answer.</p></article>` — **no nested
    `<div>`, one `<p>` per article** (the generator's FAQ→JSON-LD regex is non-greedy and takes
    the first `<p>`). Need ≥ 4; aim for **8–10**.
- **Thin-score target** (`node scripts/content-quality-thin-score.mjs --scope=route --route <r> --dry-run`):
  score ≥ 70, **0 hard flags**, `maxSimilarity` < 60% (ideally < 45%). Levers: unique intro ≥ 100
  words with the calculator's own terms; a "worked example" heading + ≥ 3 numbers; interpretation
  language ("what this means", "compare", "trade-off", "scenario"); ≥ 8 route-specific FAQs;
  tips ("consider", "compare", "reduce", "save"); edge cases ("zero", "minimum", "maximum",
  "lump sum", "variable"); no hype words; 300–1800 words total.
- **Regenerate after every fragment edit:**
  `node scripts/generate-mpa-pages.js --route /salary-calculators/<id>/` (PowerShell, not Git Bash
  — Bash mangles the leading-slash arg).
- **Per-page verification:** `git diff` the fragment + built page; run the route thin-score;
  `CLUSTER=salary CALC=<id> npm run test:calc:seo` (or at least eyeball title/desc unchanged).

---

## Phase A — content (one page at a time, no redirects)

### A1 · `bonus-calculator` — rewrite explanation (thin → unique)  ✅ DONE 2026-08-30
- [x] Rewrote `public/calculators/salary-calculators/bonus-calculator/explanation.html`:
      unique intro, How-to, interpret table, **Worked example** (percent vs flat), "A bonus is not
      a raise", "When a bonus flatters an offer", edge cases (0 bonus, bonus > salary, multiple,
      reverse-solve), 9 bonus-specific FAQs, Important Notes (`Last updated: August 2026`).
- [x] Dropped the shared "Grow Your Wealth" paragraph; framed distinct from `raise-calculator`
      (incentive/variable/one-off/contingent vs permanent/compounding).
- [x] Related block → `raise-calculator`, `salary-calculator`, `overtime-pay-calculator`, hub.
- [x] Title/desc/H1 unchanged — no metadata-triple change.
- [x] Regenerated. **Thin-score: 95 / "Strong", 0 hard flags, maxSimilarity 29.2%** (was ~high
      vs raise), 1353 words, 9 FAQ entries in FAQPage JSON-LD. `bonus-calculator_release` +
      `contracts.cluster` vitest green.

### A2 · `overtime-pay-calculator` — rewrite explanation  ✅ DONE 2026-08-30
- [x] Rewrote `.../overtime-pay-calculator/explanation.html` — 607 → 1325 words. Unique intro;
      regular-rate + multiplier explainer (1.5× / 2× / straight time / exempt); **worked example**
      ($25/hr, 10 OT hrs, 1.5× → $375, +$1,000 base = $1,375; 2× → $500/$1,500); "is the extra
      hour worth it"; edge cases (0 OT, partial hours, no base pay, high multiplier, multi-tier);
      9 overtime-specific FAQs (incl. the "taxed higher?" myth, exempt employees, blended rate).
- [x] Absorbed `weekly-pay`'s overtime framing — "Weekly pay with overtime" section + FAQ so the
      Phase-B `weekly-pay` 301 lands on relevant content.
- [x] Related block → `salary-calculator`, `raise-calculator`, `bonus-calculator`, hub.
- [x] Regenerated. **Thin-score: 97 / "Strong"**, 0 hard flags, maxSimilarity 34.9% (vs the new
      bonus page). 9 FAQ entries in FAQPage JSON-LD. Title unchanged. `overtime-pay-calculator_release`
      vitest green.

### A3 · `raise-calculator` — rewrite explanation + absorb inflation intent  ✅ DONE 2026-08-30
- [x] Rewrote `.../raise-calculator/explanation.html` — 603 → 1303 words. Unique intro;
      percent-vs-dollars explainer; **worked example** ($60k +5% → $63k; flat $4k → $64k / 6.67%);
      **"Is the raise real? Checking it against inflation"** (keep-pace formula + worked example:
      $60k→$63k, 4% inflation → $62,400 keep-pace, ~$600 real, ~$60,577 today's dollars);
      "raises compound; bonuses don't"; edge cases (freeze, large, reverse, multi-year); 9 FAQs
      mixing raise + inflation questions.
- [x] Metadata triple updated (all 3 sources) → title `Raise Calculator | New Salary, Raise
      Percentage and Value After Inflation`; description reworked. `navigation.json` keywords
      (both copies) += "raise vs inflation", "real salary raise", "salary increase calculator".
      `FAQ_SCHEMA` in module.js synced to the 9 new questions. `featureList` += "Raise vs
      inflation check".
- [ ] **Deferred (A3b):** the interactive "vs inflation" *mode* (inflation rate + years inputs on
      the calculator itself). Inflation is covered as content + keywords now, which is what makes
      the Phase-B `inflation-adjusted` → `raise-calculator` 301 land well. Decide in Phase B
      whether the interactive input is still worth adding.
- [x] Regenerated. **Thin-score: 93 / "Strong"**, 0 hard flags, maxSimilarity 39.8% (vs bonus).
      9 FAQ entries in FAQPage JSON-LD. Metadata triple consistent across all 3 sources.
      `raise/bonus/overtime_release` + `cluster` + `page-metadata-schema-guard` vitest green (19).

### A2b/A1b · retroactive FAQ_SCHEMA sync  ✅ DONE 2026-08-30
- [x] `bonus-calculator/module.js` + `overtime-pay-calculator/module.js` `FAQ_SCHEMA` updated to
      match their rewritten explanation FAQs (the JS-vs-non-JS drift noted in Global rules).
      Both regenerated (`?v=` bumped).

### A4 · `annual-to-monthly-salary-calculator` — reframe as the pay converter  ✅ DONE 2026-08-30
- [x] `index.html` fully rewritten — mode bar, tax panels, pay sheet, typeahead all removed.
      Now: pay-amount + source-frequency chip group (annual/monthly/biweekly/weekly/daily/hourly)
      + schedule inputs → hero = monthly, support cards = annual/biweekly/weekly/daily/hourly.
- [x] `module.js` rewritten (~1330 → ~190 lines) — drops all `uk/us/ca-engine` imports, uses
      `calculateSalaryConversion` from `salary-utils.js`. `FAQ_SCHEMA` = 9 converter FAQs.
- [x] `explanation.html` rewritten — ~2,580 (1,800 duplicated) → 1,234 unique words on pay-period
      conversion. Absorbed FAQs from hourly-to-salary / monthly-to-annual / weekly-pay.
- [x] Metadata triple → title `Annual to Monthly Salary Calculator | Convert Hourly, Weekly,
      Monthly and Annual Pay`; description reworked. `SALARY_SCHEMA_CONFIG` featureList/keywords
      de-taxed. `navigation.json` (both copies) += hourly-to-salary / salary-to-hourly /
      monthly-to-annual / weekly-pay / pay-converter keywords.
- [x] `config.js` runE2E rewritten (no tax modes; asserts frequency picker present, no `.sal-mode-bar`,
      no `#salary-paysheet`; annual→monthly, monthly→annual, hourly→annual conversions).
      `unit.calc.test.js` rewritten to cover `calculateSalaryConversion` (old test hit
      `calculateAnnualToMonthly`, now unused, and had a pre-existing float-precision failure).
- [x] Regenerated. **Thin-score 95/Strong**, 0 hard flags, similarity 35%. **E2E + SEO + CWV +
      unit all green** (verified with chromium against a local server). `module.js` syntax OK.
- [ ] Optional cleanup: `annual-to-monthly-salary-calculator/calculator.css` still carries the
      dead tax-mode selectors (mode-bar, paysheet, typeahead, opt-chips…). Inlined, ~12KB, CWV
      still passes — trim later or during Phase B.
- Note: `route-scope-validator.test.js` fails with a `SyntaxError` in this Windows env — confirmed
  **pre-existing** (fails on clean HEAD), not caused by these changes.

### A5 · `salary-calculator` — narrow to take-home  ✅ DONE 2026-08-30
- [x] Description reworded (dropped the "convert gross pay between…" clause) across the metadata
      triple. Title kept (already take-home-led). `navigation.json` keywords (both) swapped
      "salary conversion calculator" → "take home pay calculator" / "paycheck calculator".
      Regenerated; SEO + E2E + CWV green.

### A6 · Hub — reposition  ✅ DONE 2026-08-30
- [x] `content.html` rewritten: ~500-word editorial intro ("which calculator do you need",
      gross vs take-home, the monthly ÷12 / biweekly ÷26 / four-weekly ÷13 trap), grouped card
      list of the 5 survivors. The old 2-step JS picker (with its dead route maps) removed.
- [x] `ItemList` JSON-LD of the 5 calculators added to the hub's `CollectionPage` `@graph`,
      generated from `SALARY_CLUSTER_REDESIGN_ORDER`.
- [x] Hub title/description reworded (metadata triple + `SALARY_HUB_*` in config.js); nav
      keywords (both) → "salary calculators" / "pay calculator tools" (dropped the singular
      head terms so the flagship owns them).

### A7 · Internal linking  ✅ DONE (as part of A1–A4)
- [x] Every survivor's `explanation.html` related block links only survivors + hub; the hub links
      all 5. `salary-calculator` unchanged (links out to credit-card tools by design).
- [ ] Deferred: a config-driven `buildSalaryRelatedCalculatorsHtml` in the generator — nice-to-have,
      not blocking.

---

## Phase B — removals + 301s  ✅ DONE 2026-08-30 (merged with Phase A per "do all phases")

> Original plan sequenced this ≥1–2 weeks after Phase A. Done together at the user's instruction;
> low risk because the 6 retired routes have ~no organic traffic per the user's GSC read.

### B1 · `public/_redirects`  ✅
- [x] 25 lines added above the `/calculators/salary-calculators/*` splat: for each of the 6
      retired routes, the bare path, trailing-slash, `/index.html`, and legacy
      `/calculators/salary-calculators/<old>/*` variants → their 301 target.

### B2 · Delete pages  ✅
- [x] `rm -rf` the 6 fragment dirs (`public/calculators/salary-calculators/<old>/`), 6 built dirs
      (`public/salary-calculators/<old>/`), 6 `tests_specs/salary/<old>_release/`. The two
      ~1,330-line forked `module.js` files are gone with them.

### B3 · Configs  ✅
- [x] `public/config/navigation.json`, `clusters/salary/config/navigation.json`,
      `public/config/asset-manifest.json`, `clusters/salary/config/asset-manifest.json`,
      `config/clusters/route-ownership.json`, `config/testing/test-scope-map.json` — 6 entries
      removed from each; all JSON re-validated.

### B4 · Generator  ✅
- [x] `SALARY_CLUSTER_REDESIGN_ORDER` (11 → 5 + hub), `CALCULATOR_OVERRIDES` (6 blocks),
      `SALARY_SCHEMA_CONFIG` (`monthly-to-annual` block), `ROUTE_SPECIFIC_OVERRIDES` (commission,
      now `{}`). Homepage `seo-block` links repointed to survivors.

### B5 · Hub + explanations  ✅ (done in A6 / A1–A4)

### B6 · Tests  ✅
- [x] `contracts.cluster.test.js` `toHaveLength(11)` → `5` + route asserts repointed.
- [x] `route-scope-validator.test.js` `toHaveLength(90)` → `84`.
- [x] `config.js` `SALARY_CALCULATOR_CONFIGS` pruned to 5 + `SALARY_HUB_*` updated.
- [x] `home-shell.spec.js` commission-link assertion → `bonus-calculator`.
- [x] 6 `_release` dirs deleted.

### B7 · Sitemap  ✅
- [x] `node scripts/generate-sitemap.js` → `public/sitemap.xml` (108 URLs, 5 salary calc routes + hub).

### B8 · Verify  ✅ (local)
- [x] `npm run build` — retired routes not generated; 56 files deleted; ~23k lines removed.
- [x] **All 18 salary Playwright tests green** (e2e + seo + cwv per survivor + cluster smoke).
      **24 salary/infra vitest green.** `validate-cluster-contracts` ✅,
      `validate-homepage-search-discoverability` ✅.
- [x] Pre-existing failures confirmed on clean HEAD (not caused here): 3 `.mjs`-import vitest
      files + `home-shell.spec.js:154` + `route-archetype-contract.spec.js:40` +
      one float-precision unit test.
- [ ] **Not done (needs deploy):** live `curl -I` of each retired URL → `301` + `Location`
      (Cloudflare `_redirects` can't be tested against the local `python -m http.server`).
- [ ] **Not done:** nothing committed or deployed yet. Submit sitemap to GSC after deploy.

---

## Phase C — monitor (4–8 weeks)

- [ ] Watch `annual-to-monthly` holds its conversion rankings after losing the tax UI.
- [ ] Watch `salary-calculator` holds after the `<title>` change.
- [ ] Watch the 4 retired-conversion URLs' old queries land on the converter.
- [ ] GSC Coverage: retired URLs → "Redirect", not "Error".

---

## Progress log

- 2026-08-30 — Checklist created. Matrix + plan approved (12 → 6, content-first).
- 2026-08-30 — `npm ci` run (deps were absent). **`node_modules` now installed.**
- 2026-08-30 — Infra note: `scripts/content-quality-thin-score.mjs` main() does not run when
  invoked directly on Windows (ESM entry-point path check `path.resolve(argv[1])` vs the
  file-URL pathname mismatch). Scored A1 by importing `analyzeHtmlDocument` / `scoreAnalyzedPage`
  from a helper (`scratchpad/score.mjs`) — strip `<style>` blocks first (installed jsdom throws
  on the inlined CSS). Worth a one-line fix to the script's entry guard later.
- 2026-08-30 — **A1 done.** `bonus-calculator` explanation rewritten: 606 → 1353 words,
  thin-score **95 (Strong)**, 0 hard flags, similarity 29% (was fighting `raise-calculator`).
- 2026-08-30 — **A2 done.** `overtime-pay-calculator` explanation: 607 → 1325 words, thin-score
  **97 (Strong)**. Absorbed weekly-pay's overtime framing.
- 2026-08-30 — **A3 done.** `raise-calculator` explanation: 603 → 1303 words, thin-score
  **93 (Strong)**. Metadata retargeted to include "raise vs inflation" / "real salary" across the
  metadata triple + both `navigation.json` copies + `SALARY_CALCULATOR_CONFIGS`. Interactive
  inflation *mode* deferred (A3b). Found + fixed: FAQ appears in two places (explanation +
  module.js `FAQ_SCHEMA`) and drifts on JS render — synced for A1/A2/A3.
- 2026-08-30 — **A4 done.** `annual-to-monthly` reframed: `index.html` + `module.js` rewritten
  (~1,330 → ~190 lines), tax modes removed, now a gross pay-period converter with a
  source-frequency picker. Explanation 2,580 → 1,234 words, thin-score 95. E2E/SEO/CWV green.
  `unit.calc.test.js` rewritten (old one hit an unused fn + a pre-existing float-precision bug).
- 2026-08-30 — **A5 + A6 done.** `salary-calculator` description de-conversioned; hub `content.html`
  rewritten (editorial intro, 5-card list, JS picker removed), `ItemList` schema added, hub
  metadata/keywords repositioned off the head term.
- 2026-08-30 — **Phase B done** (merged with A per "do all phases, don't stop"). 11 calculators
  → 5 + hub. 6 routes retired with 301s in `_redirects`; removed from 6 config files, the
  generator, all tests, sitemap; 56 files deleted (~23k lines, incl. the 2 forked controllers).
  **All 18 salary Playwright + 24 salary/infra vitest green.** `validate-cluster-contracts` +
  `validate-homepage-search-discoverability` pass.
- 2026-08-30 — **Prettier version drift note.** `npm ci` installed prettier 3.8.1; repo devDep
  is `^3.2.4`. `npx prettier --check` in this env flags almost every file, incl. committed
  `shared/tax-engine/*.js` on clean HEAD. Do **not** `prettier --write` broadly here — it
  rewrites files to 3.8 style. The 5 survivor `module.js` files are kept as minimal hand diffs;
  the rewritten `explanation.html` / `content.html` / `annual-to-monthly` files carry 3.8
  wrapping (cosmetic; a `npm run format` with the repo's prettier will normalise). All FAQ
  extraction + thin-score still pass.
- 2026-08-30 — **Final thin-scores (all Strong, 0 hard flags, similarity < 45%):**
  salary-calculator 98 · annual-to-monthly 95 · overtime-pay 97 · raise 93 · bonus 95.
- **Still NOT done:** nothing committed or deployed. After deploy: `curl -I` each retired URL
  for the 301 (untestable locally — Cloudflare `_redirects`), submit sitemap to GSC, then
  Phase C monitoring (4–8 weeks). `annual-to-monthly/calculator.css` still has dead tax-mode
  selectors (harmless, ~12KB inlined) — trim when convenient. Run `npm run format` (repo
  prettier) before committing.
- 2026-08-31 — **Requirements pass #1–2** (spec Part IV §60–§61): "Pay amount" → **"Gross salary"**
  on `salary-calculator`; **4-weekly** frequency on `salary-calculator` + `annual-to-monthly`
  (chip, result card, copy summary; `salary-utils` + `pay-frequency` carry `fourWeekly`).
- 2026-08-31 — **Requirements pass #3–6 done** (spec Part IV §62–§65) on `salary-calculator`:
  - **§62 Deductions section** — new always-visible itemised "Deductions" card (Income Tax / NI /
    pension / student loan · Federal / State / SS / Medicare / 401(k) · Federal / Provincial / CPP
    / EI / QPIP…), driven by new common-layer `shared/tax-engine/deduction-rows.js`.
  - **§63 Optional Extra Payments** — the single "+ Bonus" chip replaced by **+ Overtime /
    + Bonus / + Commission / + Other extra pay**, each with a frequency basis; the old
    bonus-lands-on-one-payday behaviour dropped (extras spread evenly).
  - **§64 Overtime, 3 methods** — Fixed amount · Overtime rate × hours · % of a chosen gross
    basis (hourly/weekly/4-weekly/monthly/annual).
  - **§65 Extra-payment frequency** — one-off / weekly / 4-weekly / monthly / annual, annualised
    by new common-layer `shared/tax-engine/extra-payments.js`.
  - New tests: `tests_specs/infrastructure/unit/{extra-payments,deduction-rows}.test.js` (13).
    `salary-calculator` E2E rewritten for the new sections. **30 salary/module vitest + 150
    tax-engine vitest + 19 salary Playwright green.** Thin-score 98 (unchanged).
- **§66 / #7 (common vs country layer): partial.** The two new modules + the already-pure engines
  are the common layer; the full plugin registry / tax-year awareness / conformance suite
  (spec Part II §18–§29) remains the phased build.
- 2026-08-31 — **`salary-calculator/explanation.html` synced to the new UI.** Step 4 regrouped
  (Deductions to add / Optional extra payments / Pay schedule); Step 5 gains the itemised
  Deductions-section + 4-weekly-card paragraph; "How bonuses are taxed" → "How overtime, bonuses
  and commission are handled" (3 overtime methods, frequency annualisation, even pay-sheet
  spread); pay-sheet + Assumptions notes de-bonus-payday'd. FAQ: "How is a bonus taxed?" →
  "How are overtime, bonuses and commission taxed?" + new "How do I enter overtime?"; paydays
  FAQ de-bonus'd. `module.js` `FAQ_ITEMS`/`FAQ_SCHEMA` mirrored. Regenerated. **Thin-score 98
  (Strong), 0 hard flags, 21 FAQ, similarity 22.8%; 1267 vitest + 18 salary Playwright green.**
- 2026-08-31 — **`annual-to-monthly-salary-calculator` also retired** (cluster now **4 calculators
  + hub**, was 5). User: "no point having another Annual to Monthly Salary Calculator — remove it
  and add the keywords to the salary calculator." Its conversion intent is fully covered by
  `salary-calculator`'s Gross Pay mode.
  - 301: `annual-to-monthly-salary-calculator` (+ `/index.html`, `/calculators/...*`) →
    `/salary-calculators/salary-calculator/`. The 4 earlier conversion 301s (hourly-to-salary,
    salary-to-hourly, monthly-to-annual, weekly-pay) were **repointed** from annual-to-monthly to
    salary-calculator so no redirect chains.
  - Keywords folded into `salary-calculator` (both `navigation.json` copies + `SALARY_SCHEMA_CONFIG`):
    annual to monthly / monthly to annual / hourly to salary / salary to hourly / weekly pay /
    pay converter / yearly to monthly. featureList gained a conversion line.
  - Removed from: generator (`SALARY_CLUSTER_REDESIGN_ORDER`, `CALCULATOR_OVERRIDES`,
    `SALARY_SCHEMA_CONFIG`), both `navigation.json` + `asset-manifest.json`, `route-ownership.json`,
    `test-scope-map.json`, hub `content.html`, homepage seo-block, sitemap, `public/calculators/index.html`.
  - Deleted: fragment dir, built dir, `tests_specs/salary/annual-to-monthly-salary-calculator_release/`.
    `calculateSalaryConversion` coverage moved to `unit.cluster.test.js` (SALARY-CLUSTER-U-6).
  - Tests: `contracts.cluster` 5→4, `route-scope-validator` 84→83, `config.js` hub copy "Five"→"Four".
  - **Bonus fix:** the `--all` regen also corrected `public/calculators/index.html` and the homepage
    seo-block, which the prior consolidation commit had left pointing at now-301'd salary routes.
- 2026-08-31 — **`salary-calculator` re-pointed at the conversion intent** after 28-day GSC data
  showed the cluster's demand is ~7:1 pay-period conversion (weekly / annual-to-monthly / biweekly)
  over take-home, and that the Aug 25 rebuild into a take-home-first page dropped it from position
  ~11 to ~53 while `annual-to-monthly` (the remaining converter) rose to page 1 — which we then
  301'd into the demoted page. Fix, keeping the single-page model:
  - **Title** (metadata triple + module.js): `Salary Calculator | Annual to Monthly, Weekly Pay & Take-Home`.
    Description + `appDescription` + `SALARY_SCHEMA_CONFIG` softwareDescription/featureList/keywords
    lead with conversion.
  - **"Gross Pay" mode removed.** Mode bar is now 3 country toggles (UK / United States / Canada),
    none active by default → the page opens as a plain pay-period converter. Clicking an active
    country toggles it back off. `mode='gross'` kept internally as the no-country sentinel; the mode
    bar is hand-wired (setupButtonGroup can't express "nothing selected").
  - **Explanation reworked**: intro + How-to steps reframed (no "modes"); the `sal-gross-only`
    section rewritten as "How to convert a salary between pay periods" with a **conversion-factor
    table** and worked examples hitting the real long-tail (`annual to monthly`, `biweekly to
    monthly`, `hourly to salary`, `daily rate from annual salary UK`, `$X a year is how much a
    month`); **tables added** to all three country worked examples (UK £60k, US $100k CA-vs-TX,
    CA $60k AB-vs-QC); 3 new conversion FAQs (mirrored into module.js `FAQ_ITEMS`).
  - `.sal-guide-table` given real CSS (was unstyled). E2E updated for the toggle-off flow.
  - **1265 vitest + 15 salary Playwright green; thin-score 98/Strong (6,013 words, 24 FAQ, 0 hard
    flags, similarity 22.6%); CWV green.**
- **#7 full framework — NOT attempted in-session and not doable in one.** Per-period statutory
  withholding (IRS Pub 15-T, HMRC cumulative PAYE, CRA T4127), year-keyed tax-data dirs,
  contribution-limit + employer-contribution models, tax-saving panel and the conformance suite
  each need real government tables sourced and human-verified (spec §29 governance requires
  sign-off on tax data). This is the multi-PR program in spec Part II — track it there, not here.
- **overtime-pay / raise / bonus calculators: intentionally NOT given the §60–§65 treatment.**
  Requirement #1–#7 scopes to "country-specific salary calculators"; these three are generic
  gross-pay tools with no tax modes, deductions, or pay frequency. Adding a Gross-salary label /
  4-weekly / extra-payments UI to them would be scope creep with regression risk and no user need.
- 2026-08-31 — **`salary-calculator` results/interaction redesign** (separate round, plan file
  `salary-calculato-width-is-too-mutable-alpaca.md`). Shell-only — no metadata, no shared CSS, no
  generator change.
  - **Route widened 1120 → 1200px** (`.sal-cluster-center-column:has(#calc-salary-calculator)`),
    frequency chips tightened → the 7 pay-frequency chips now sit on one row; explanation prose
    capped at 1000px so it doesn't inherit the width.
  - **Result eyebrow forced to one line** (`white-space:nowrap`, 0.04em/10px).
  - **Calculation is now Calculate-button-gated.** Opens on a fixed Annual 100,000 baseline;
    nothing — salary, frequency, optional fields, *or a mode switch* — moves the figure until
    Calculate is pressed. `markDirty`/live-recalc removed; `markStale` dims the answer + lifts the
    button + shows `#salary-stale-hint`. Mode switch still relabels + shows country controls +
    seeds the default jurisdiction (no calc). Pay-sheet cadence toggle + first-pay-date re-render
    the sheet from `lastResult` only. `calcPending` retries a Calculate that was waiting on a
    tax-data fetch.
  - **Status chip removed; Copy summary moved to the top-right** of the answer card. New visible
    `#salary-summary-panel` — figure first and large, per-period line, then the breakdown /
    assumptions / next-paydays block at the bottom; the clipboard text (`serializeSummary`) follows
    the same order.
  - **New highlighted `#salary-paysheet-jump`** button (tax modes only) that smooth-scrolls to the
    pay sheet.
  - `config.js` salary-calculator `runE2E` extended (baseline + stale-gate assertions, Calculate
    clicks after the england re-click). **1267 vitest + 18 salary Playwright green; thin-score 98;
    CWV (LCP/CLS) green.**

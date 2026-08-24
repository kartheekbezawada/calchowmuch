# Salary Calculator — Build Checklist (Authoritative)

This is the single source of truth for building the country-aware salary/take-home-pay
calculator. Update checkboxes as work lands — this file tracks status; the other three docs in
this folder hold the detailed reasoning:

- `salary-calculator-tax-engine-spec.md` — architecture, tax rules, data model
- `salary-calculator-ui-design-spec.md` — layout, interaction, content structure
- `salary-calculator-functional-test-spec.md` — concrete UK/US test matrices
- `salary-calculator-qa-test-strategy.md` — broader QA framework
- `mockup/salary-calculator-mockup.html` — clickable design mockup (serve on :8090)

**Hard rule: nothing in Phase 6 or 7 happens until you've reviewed the page running locally.**
No deploy before sign-off.

---

## 📍 RESUME HERE — current status

> **Read this section first if you're picking this up in a new session.** Update it at the end
> of every work session so the next one can start cold without re-reading the whole conversation.

**Last updated:** 2026-08-24
**Current phase:** **Phase 1 complete for UK. Phase 2 complete for UK.**
**Next action:** Build `tax-data/us/` — `federal-income-tax.json` and `fica.json` first, then the
51 state files. The generic progressive-tax algorithm is now proven against UK data, so the US
work is data entry + a state-shape schema rather than new algorithm design.

**Work completed so far:**

- Planning/docs + a clickable UI mockup (design settled, no known outstanding items).
- **UK tax data** — 4 JSON tables under
  `public/calculators/salary-calculators/shared/tax-data/uk/`. All carry spec §11.1 metadata and
  are **deliberately `lastVerified: null`** — see the verification gate in Phase 1.
- **Tax engine** — `shared/tax-engine/{progressive-tax,pay-frequency,uk-engine}.js`. Pure,
  data-injected, no DOM. 54 unit tests passing.
- **`scripts/validate-tax-data.mjs`** — structural validator + `--strict` pre-ship gate.
- Test tooling installed and verified (`fast-check`, `@axe-core/playwright`, `lighthouse`), and
  several Windows-compatibility bugs in the repo's test scripts fixed (`python3` → `python`,
  `/dev/null` → `nul`, hardcoded `/tmp` path, Lighthouse Chrome auto-detection).

**Nothing is wired into the live page yet.** The engine exists and is tested; the existing
gross-only `salary-calculator` page is untouched and still shipping its current behaviour.

**Design is settled** — see `salary-calculator-ui-design-spec.md` and the mockup. Layout,
interaction model, pay-sheet table shape, and long-form content structure are all decided and
visually reviewed. Latest revision (2026-08-24) split the explanation into nine cards and made
the UK/US deduction cards follow the mode toggle — details in design spec §8.1–8.2.

**Mockup has no known outstanding items.** The USA local-tax disclaimer, the always-visible pay
sheet, mode-driven results rendering and the weekend-adjustment rule all landed 2026-08-24.

**Known environment issues to be aware of:**
- Lighthouse audits hang in this dev environment (Chrome itself works standalone; it's the
  Lighthouse↔DevTools connection). Run that gate elsewhere until root-caused.
- 5 pre-existing unrelated test failures are the accepted `npm run test` baseline — 3
  infrastructure syntax/import errors + 2 salary floating-point precision assertions. If you see
  exactly 5 failures, nothing is broken.
- WSL is installed but non-functional here (no nested virtualization). Use Windows-side tooling.

### How to work through this checklist

Build **one item at a time**, in phase order. After each meaningful unit of work:

1. Tick the checkbox(es) completed.
2. Update the "Current phase" / "Next action" lines above.
3. Note anything surprising under "Notes & decisions log" at the bottom.

Phases 1 and 2 (data + engine) are pure logic with no UI dependency, so they're safely
resumable and independently testable — do them first. Phase 3 (UI) depends on Phase 2's result
object shape being settled.

---

## Decisions (resolved 2026-08-23)

- [x] **URL structure** — single page at `/salary-calculators/salary-calculator/`. No separate
      country routes. Mode/country chosen via on-page toggle.
- [x] **Replace vs. new route** — replaces the existing page. Gross Pay becomes a third toggle
      option alongside UK and USA, so today's gross-only behaviour is preserved as a mode rather
      than a separate page. Toggle: **`Gross Pay` · `UK` · `USA`**.
- [x] **US state coverage** — all 50 states + DC at launch. No phased rollout.
- [x] **Tax coverage** — include state income tax **and** other taxes that reduce take-home pay
      (see sub-decision below — this reverses the earlier "local taxes deferred" assumption from
      spec §8.8).

### ✅ Sub-decision resolved: scope of "other taxes" — **B2 chosen**

**Decided 2026-08-23: statewide-only. No local/municipal income tax in V1.**

- **Bucket A — state payroll taxes: INCLUDED.** SDI, PFML, and employee-side SUI where they
  apply (~10–15 states). These are statewide, single-rate, well-documented, and materially
  affect take-home in large states like CA and NJ.
- **Bucket B — local/municipal income tax: EXCLUDED from V1.** Requires the disclaimer to be
  shown, per tax-engine spec §8.8.

**Consequence to be honest about:** results will be noticeably high for users in cities with
local income tax — NYC and Yonkers, Philadelphia and other PA municipalities, most Ohio cities,
Maryland counties, Detroit, St. Louis, Kansas City, Louisville, Birmingham. For an NYC earner
this can overstate take-home by several thousand dollars a year. This is an accepted, disclosed
V1 limitation, not an oversight — the disclaimer must be visible in the UI, not buried in
footer text.

**Revisit trigger:** if GSC data later shows meaningful traffic from local-tax queries
("nyc paycheck calculator", "philadelphia salary calculator"), reopen this as a V2 candidate
using the B1 approach (major jurisdictions + custom-rate override).

<details>
<summary>Original options considered (kept for context)</summary>

Your answer expands V1 beyond federal + FICA + state income tax. Splitting it into two buckets,
because they differ enormously in difficulty:

**Bucket A — state-level payroll taxes. Tractable, recommend including in V1.**
Roughly 10–15 states, each well-documented with a single statewide rate/wage-base:

- State Disability Insurance (SDI) — CA, NJ, NY, RI, HI
- Paid Family & Medical Leave (PFML) — CA, NJ, NY, WA, MA, CT, OR, CO, and others
- Employee-side State Unemployment Insurance (SUI) — AK, NJ, PA

These materially affect take-home (e.g. CA SDI is a real percentage off every paycheck), and
omitting them would make the calculator visibly wrong for large states.

**Bucket B — local/municipal income taxes. Genuinely hard, needs a call.**
Thousands of taxing jurisdictions: PA alone has ~2,500 municipalities, OH has ~600 cities, plus
NYC/Yonkers, MD county-level, MI cities, IN counties, KY, MO (St. Louis / Kansas City), AL.
There is no single authoritative free dataset — this is the "do not create hundreds of thin
entries without verified data" risk the spec warns about.

Options that were on the table:

- **B1** — cover the ~15 highest-population jurisdictions (NYC, Yonkers, Philadelphia,
  Pittsburgh, Detroit, Columbus, Cleveland, Cincinnati, Baltimore + MD counties, St. Louis,
  Kansas City, Wilmington, Birmingham, Louisville, Indianapolis) + an optional "custom local tax
  rate %" field for everyone else.
- **B2 — CHOSEN.** Statewide-only, no local tax, disclaimer shown.
- **B3** — attempt full local coverage. Rejected: the data doesn't exist in a reliably maintained
  free form, and stale local rates would silently produce wrong numbers.

</details>

---

## Phase 1 — Tax Data

> **Location:** `public/calculators/salary-calculators/shared/tax-data/`, mirroring where
> `salary-utils.js` already lives. Served statically and fetched on demand, so the 51 state files
> never enter the initial payload. Already covered by the `/calculators/*` noindex header.

- [x] Create `tax-data/` directory (spec §11.5 layout, minus `us/local/` per B2)
- [x] `uk/income-tax.json` — rUK + Scotland band sets, PA taper. **Bands are in TAXABLE-INCOME
      space, not gross.** Forced by the taper: at 125,140 gross the allowance is nil, so the
      top threshold is 125,140 in *both* spaces while lower thresholds are `gross − 12,570`.
      Subtracting the allowance from the top threshold is the easy mistake here
- [x] `uk/national-insurance.json` — Class 1 employee. Bands are on **gross** earnings with their
      own thresholds, deliberately not sharing a field with the Personal Allowance even though
      both currently read 12,570
- [x] `uk/student-loans.json` — Plans 1/2/4/5 + Postgraduate
- [x] `uk/pension.json` — three relief methods with their tax/NI effects encoded as flags
- [ ] `us/federal-income-tax.json` — 2026 brackets, all 4 filing statuses
- [ ] `us/fica.json` — Social Security wage base, Medicare rate, Additional Medicare threshold
- [ ] `us/states/*.json` — **all 50 states + DC (51 files)**; each matches spec §8.6/§11.6 schema
      (structure, brackets, standard deduction, exemptions, source, last-verified). Includes the
      9 no-income-tax states as explicit `"taxStructure": "none"` files, not omissions
- [ ] `us/payroll-taxes.json` — state SDI / PFML / employee-SUI rates and wage bases (Bucket A).
      Per-state, versioned like every other table
- [x] ~~`us/local/*.json`~~ — **not built. B2 decision: no local tax data in V1.** The `us/local/`
      directory from spec §11.5's layout is intentionally omitted
- [x] Every tax table has `taxYear`, `effectiveFrom`, `effectiveTo`, `source`, `lastVerified`
      (spec §11.1). Done for the 4 UK files; the same shape is required of every US file
- [x] Tax-data schema validation script — `scripts/validate-tax-data.mjs`. Checks rates are
      fractions in 0–1, band boundaries are contiguous (a gap silently under-taxes, an overlap
      silently double-taxes), the PA taper is internally consistent, auto-enrolment percentages
      sum correctly, and exactly one pension relief method is default

### ⛔ Verification gate — nothing ships until this passes

```bash
node scripts/validate-tax-data.mjs            # structural, warns on unverified
node scripts/validate-tax-data.mjs --strict   # pre-ship gate, FAILS on unverified
```

**Strict mode currently exits 1** — every UK table carries `lastVerified: null`. That is
deliberate, not an oversight. Each file also carries a `verification` block with a confidence
rating and a note saying what needs checking:

| File | Confidence | What needs confirming |
|---|---|---|
| `income-tax.json` (rUK) | high | Thresholds are frozen to April 2028, so 2026/27 should equal 2025/26. Confirm on gov.uk |
| `income-tax.json` (Scotland) | **low** | **Values are 2025/26.** Scottish bands are set annually by the Scottish Budget and the starter/basic thresholds are routinely uprated. Replace from gov.scot |
| `national-insurance.json` | medium-high | 8%/2% structure has held since April 2024 and reconciles exactly to 3,210.60 on a 60,000 salary. Confirm no rate change |
| `student-loans.json` | **low** | **Values are 2025/26.** Plan 1/2/4 thresholds uprate annually. A wrong threshold moves the result by hundreds a year |
| `pension.json` | medium | Confirm the qualifying earnings band for 2026/27 |

- [ ] **Confirm all five against their official sources, set `lastVerified` and flip
      `verification.status` to `verified`.** Until then `--strict` blocks the build

- [ ] Wire `validate-tax-data.mjs --strict` into the pre-deploy gate so this cannot be forgotten

## Phase 2 — Calculation Engine

> **Location:** `public/calculators/salary-calculators/shared/tax-engine/`. Every function is
> pure and takes tax data as a **parameter** — nothing fetches, nothing touches the DOM. That is
> what makes it runnable in Node under vitest, and it is the enforcement mechanism for spec §17
> rather than just a convention.

- [x] Generic `calculateProgressiveTax(income, bands)` — `progressive-tax.js`. One
      implementation for UK Income Tax, UK NI, and later US federal + every state.
      **Bands are absolute boundaries on whatever income measure the caller passes**, which is
      what lets it serve Income Tax (post-allowance income, bands from 0) and NI (gross earnings,
      bands from 12,570) without special-casing either
- [x] `calculateTaperedAllowance` + `calculateThresholdTax` alongside it — the taper and the
      flat-rate-above-threshold shapes are not band schedules and pretending otherwise hides them
- [x] `pay-frequency.js` — `toAnnual` / `fromAnnual` / `periodsPerYear`, everything normalised
      through an annual figure
- [x] `UKTaxEngine` — `uk-engine.js`, England/Wales/NI vs. Scotland via band sets
- [ ] Canonical `SalaryInput` model (spec §3) — currently an informal JSDoc typedef per engine;
      formalise once the US engine exists and the shared shape is actually known
- [ ] `GrossOnlyEngine` — the existing gross-pay conversion path, preserved as its own mode so
      the current behaviour survives the rewrite unchanged
- [ ] `USTaxEngine` — Federal → FICA → State income tax → State payroll taxes (SDI/PFML/SUI).
      Each a separate composable layer, not one monolith. **No local-tax layer in V1 (B2)** —
      but leave the pipeline able to accept one later without restructuring
- [ ] Local-tax disclaimer surfaced whenever USA mode is active (spec §8.8): *"Local income taxes
      may not be included in this estimate."* Must not silently present the result as exact
- [x] Pay-frequency normalization, including 4-weekly as `annual / 13` (spec **§4**).
      **Note on what §4 actually guards against:** `monthly × 12 / 13` is algebraically
      identical to `annual / 13`, so the real hazard is *rounding* — deriving 4-weekly from a
      monthly figure already rounded for display drifts the answer. Test pins 55,000 (which does
      not divide cleanly by 12) and asserts the two paths differ
- [x] Bonus model — `calculateUkBonusImpact`, net-with minus net-without. Test proves it is not
      `bonus × marginal rate`: at 100k + 10k bonus the true rate is **62%** (40% band + 2% NI +
      20% from losing 5,000 of Personal Allowance), which the naive method misses entirely
- [x] Pension handling (UK) — all three relief methods, each with different arithmetic:
      net-pay reduces taxable income only; salary sacrifice reduces taxable income **and** NIable
      earnings (worth 60/yr more at 60k); relief-at-source reduces neither and costs the employee
      only 80% of the nominal contribution out of net pay
- [x] Student loan handling (UK) — undergraduate plan and postgraduate loan apply
      **simultaneously**, and selecting `postgraduate` as the plan must not double-count
- [ ] Pre-tax/post-tax deduction flags per deduction (`pre_tax_federal`, `pre_tax_fica`, etc. —
      US, spec §8.9)
- [ ] Pay-date schedule engine: biweekly, 4-weekly, monthly with month-end rule, optional
      working-day adjustment (spec §5–§9)
- [ ] Pay-schedule result includes the **net amount per period**, not only dates — the UI pay
      sheet needs `{ date, grossAmount, netAmount, isBonusPeriod }` per row (extends spec **§5**,
      whose shape currently returns dates only)
- [x] Effective tax rate + marginal rate as **separate fields** (spec §12). `effectiveRate` is
      all deductions over gross; `marginalRate` is the Income Tax band on the next pound. Test
      asserts they differ
- [x] Tax breakdown array, band-by-band (spec **§13**) — with a test that the band amounts sum back
      to the income and the band taxes sum to the total
- [x] `isInAllowanceTaper` flag exposed so the UI can explain a distorted marginal rate rather
      than showing a number the user cannot reconcile
- [ ] Calculation result object formally matches the spec **§7.6** output list — close but not
      audited field by field yet
- [x] Architecture check: **UI layer contains zero tax logic** — engine is pure, data-injected,
      no DOM, no fetch. 54 unit tests run in Node with no browser

**Tests:** `tests_specs/infrastructure/unit/uk-tax-engine.test.js` — 54 passing. Pinned against
the mockup's own figures (60,000 England → 11,432 income tax, 3,210.60 NI) so the engine and the
design cannot silently diverge.

## Phase 3 — UI/UX

> Design settled and mockup-reviewed 2026-08-23. Build against
> `salary-calculator-ui-design-spec.md` + `mockup/salary-calculator-mockup.html` — those hold the
> exact spacing, colours, column widths and markup patterns. Items below are the task list.

- [ ] Fixed column widths — left input card `470px`, results card fills remainder; **neither
      resizes** when optional panels open/close
- [ ] Results card sticky (`top: 96px`); single-column stack + sticky disabled below 1080px
- [ ] Roomier spacing per design spec §2 (container 1400px, card padding 32px, inputs 48px)

- [ ] Mode toggle: **`Gross Pay` · `UK` · `USA`** — chip-button pattern already used for pay
      frequency, no new component. `Gross Pay` hides all tax/region controls entirely and
      reproduces today's behaviour exactly
- [ ] UK region selector (England/Wales/NI/Scotland) — same chip pattern
- [ ] US state selector — searchable/typeahead combobox, not a 51-item native `<select>`
- [ ] No silent default country/region/state — stays unselected until the user picks
- [ ] Only pay amount + frequency + country + region/state visible by default
- [ ] Optional features as reveal-chips: `+ Bonus` `+ Pension` `+ Student loan` `+ Pay schedule`
      — each opens just its own 1–2 fields, nothing else
- [ ] Results shown as a compact stacked bar (gross → tax → NI/FICA → deductions → net), reusing
      the existing `.graph-panel` / `.graph-bars` / `.graph-legend` CSS already in the codebase
- [ ] "See how this was calculated" — collapsed by default, expands to the band-by-band
      breakdown (spec §13's transparency requirement, delivered as progressive disclosure)
- [ ] **Pay sheet is visible by default** — not gated behind `+ Pay schedule`. It renders on
      first paint and after every calculation, using a first pay date that **defaults to the next
      Friday**, with a dismissable-by-action note saying the date is assumed and linking to the
      `+ Pay schedule` panel. `+ Pay schedule` *refines* the sheet, it does not unlock it.
      (Reversed 2026-08-24 — gating it meant most visitors would never find the feature)
- [ ] Pay sheet rows carry the money, not just dates, with weekday shown — the question being
      answered is "when do I get paid, and how much?"
- [ ] **Pay sheet deduction column headers come from the active mode**, never fixed strings:
      UK `Income tax`/`NI`/`Pension`, USA `Federal + state tax`/`FICA`/`401(k)`
- [ ] Gross Pay mode still gets a pay sheet — degraded to `#`/`Pay date`/`Gross`. Hide the
      deduction columns in **CSS** (`#paySheet.is-gross [data-col="tax"]`), not JS, so it survives
      every re-render
- [ ] Sheet frequency defaults per country (UK monthly, USA bi-weekly) until the user picks one;
      after that their choice persists across mode changes
- [ ] Pay sheet shows the next 12 paydays by default, with total periods/year stated
- [ ] Bonus payment date, if set, is reflected in the matching pay-sheet row (that row shows the
      higher amount) rather than being silently averaged across all rows
- [ ] Pay sheet included in Copy summary output
- [ ] Weekend-adjustment rule surfaced in the UI (`Previous` / `Next` / `No adjustment`) **and
      actually applied to the generated dates**, with a `MOVED` marker on shifted rows.
      **Step each period from the unadjusted base date and adjust only for display** — adjusting
      in place compounds the shift and the schedule drifts further out every period
- [ ] **Results card is fully model-driven** — bar, legend, period cards, breakdown bands,
      effective-rate pill and pay-sheet headers all come from one per-mode object, so currency,
      terminology and figures change together. Assert `gross − tax − insurance − pension === net`
      and that the itemised bands sum to the legend total (design spec §6.1)
- [ ] Dates render in the mode's locale — `en-GB` for UK, `en-US` for USA
- [ ] **Local-tax disclaimer visible in the results card in USA mode** (`data-only="us"`), placed
      next to the number rather than in footer text — see design spec §6
- [ ] Currency: `formatCurrency(value, currency)` already exists and already handles symbol +
      commas + 2 decimals — just pass `'GBP'`/`'USD'` based on selected country
- [ ] Fix the static/no-JS placeholder numbers to also carry the currency symbol (currently
      missing on the pre-JS fallback only)
- [ ] Result cards/support-grid expand to use freed horizontal space once the input side
      collapses down to chips
- [ ] Copy summary button retained; copied text includes country/region and tax figures, not
      just gross/net
- [ ] Mobile responsive pass on every new control (typeahead, chips, collapsibles)
- [ ] Keyboard navigation + focus management for chips, typeahead, and collapsibles; labels and
      ARIA where needed

## Phase 4 — Content & SEO

- [ ] **Long-form explanation content, 2,000–5,000 words** (mockup draft is ~2,619 — usable as a
      starting point, needs fact-checking against real rates before ship)
- [ ] **One card per section, not one long card** — nine `<section class="card">` siblings, each
      opening with an `<h2>` matching its TOC entry, `<h3>` subsections inside. Exact card list in
      design spec §8.1
- [ ] **UK / US deduction cards are mode-gated** via the same `data-only="uk|us"` attribute the
      input controls already use, so `applyMode()` drives them with no extra JS. Also gate their
      TOC entries and the country-specific worked examples (design spec §8.2)
- [ ] Each country card carries a `.card-tag` pill (`UK MODE` / `USA MODE`) beside its title so
      the appear/disappear behaviour is self-explanatory
- [ ] **Hide with `display: none` — never conditionally render or lazy-inject.** Both country
      sections must stay in the DOM in every mode. Removing the inactive one would roughly halve
      the indexable word count and is also invisible to `content-quality-thin-score.mjs`, which
      parses static HTML and would still pass while the live page regressed
- [ ] Content ordering follows the repo's enforced contract: `How to Guide` → `FAQ` →
      `Important Notes` **last** — validated by `scripts/content-quality-thin-score.mjs`
      (`validateRequiredBlockOrder`); wrong order is a hard content-quality failure.
      Note the check is `importantNotesIndex === headingCount - 1`, so **no heading of any level
      may follow Important Notes** — splitting into cards does not relax this
- [ ] US deductions card includes the `Local and city income taxes` subsection + callout naming
      the excluded jurisdictions (B2 decision). This is the *explanatory* disclaimer; the short
      results-card line required by design spec §6 is a separate Phase 3 item
- [ ] `Important Notes` contains all 5 required keys (`Last updated:` with `Month YYYY`,
      `Accuracy:`, `Disclaimer:`, `Assumptions:`, `Privacy:`) plus the privacy line verbatim:
      *"All calculations run locally in your browser - no data is stored."*
- [ ] Content includes a full "How to use this calculator" walkthrough (6 steps per design spec §8)
- [ ] Run the thin-content scorer against the built page and confirm it scores ≥70 with zero hard
      flags (existing page currently scores 94 — don't regress it)
- [ ] Title / meta description / H1 updated to reflect take-home-pay capability (current copy
      explicitly says "gross pay only" — that FAQ answer must change)
- [ ] JSON-LD structured data updated for the new page shape
- [ ] Disclaimer text added verbatim per spec §14 (general + UK-specific + US-specific lines)
- [ ] Internal links from sibling salary calculators and the cluster hub updated if URL
      structure changes
- [ ] Sitemap coverage confirmed for any new routes

## Phase 5 — Testing

Full detail in the two companion docs — this is the checklist view.

- [ ] Golden regression cases created (`uk-2026-27.json`, `us-2026.json`)
- [ ] Tax-data schema validation tests wired into CI
- [ ] Boundary tests for every threshold (ideally auto-generated from tax-data, not hand-written)
- [ ] UK functional matrix: salary boundaries × 4 regions
- [ ] US functional matrix: states × 4 filing statuses × salary levels
- [ ] Critical 4-weekly test (£52,000 → exact expected values, spec §2.4)
- [ ] Pay-date tests: biweekly, 4-weekly, month-end, leap year, UK tax-year boundary (5/6 April)
- [ ] Regression/state-leakage tests: state switch, country switch, frequency switch, bonus
      toggle, deduction toggle — each must return to its exact original result
- [ ] Cross-frequency consistency invariants (`weekly × 52 ≈ annual`, etc.)
- [ ] Property-based tests using `fast-check` (now installed) — random salaries, invariant checks
- [ ] Automated accessibility scan using `@axe-core/playwright` (now installed)
- [ ] Playwright E2E: full UK flow, full US flow, state-switch flow
- [ ] Privacy test — intercept network requests, confirm nothing is sent server-side
- [ ] Copy summary test
- [ ] Visual regression screenshots for key states (UK, Scotland, US, California, bonus, error)
- [ ] Lighthouse performance check — **known broken in this dev environment** (Lighthouse's
      Chrome DevTools connection hangs here even though Chrome itself works fine standalone); run
      this gate in CI or another machine until that's root-caused

## Phase 6 — Local Verification (required before anything ships)

- [ ] Full page built and served locally
- [ ] Manual walkthrough: UK England, standard salary
- [ ] Manual walkthrough: UK Scotland (confirm different result from England at same salary)
- [ ] Manual walkthrough: US California
- [ ] Manual walkthrough: US Texas (no state income tax — confirm result differs correctly)
- [ ] Manual walkthrough: bonus scenario
- [ ] Manual walkthrough: pension + student loan combined
- [ ] **You review the running local build and sign off** — explicit stop here, no exceptions
- [ ] `npm run lint` clean
- [ ] `npm run test` — baseline unchanged (currently 5 known pre-existing failures, unrelated)
- [ ] `npm run test:e2e` — new suite passing
- [ ] CWV budget check (CLS/LCP/INP)

## Phase 7 — Deploy Readiness

- [ ] Fix logged per this repo's existing tracking convention (`seo_fixes/` and/or
      `release-signoffs/`)
- [ ] Final review with you
- [ ] Merge

---

## Notes & decisions log

Append anything a future session would otherwise have to rediscover — decisions made, dead ends
hit, values verified against a source, things that turned out harder than expected. Newest at
the bottom, dated.

- **2026-08-23** — Docs created. No build work started. Test tooling installed and verified;
  Windows script-compatibility bugs fixed (see "Known environment issues" above).
- **2026-08-23** — Decisions resolved: single URL with `Gross Pay · UK · USA` toggle; replaces
  existing page (gross-only preserved as a mode); all 50 states + DC; tax coverage expanded to
  include state payroll taxes (SDI/PFML/SUI) and — pending Bucket B choice — local income taxes.
  This reverses spec §8.8's "local taxes deferred to V1+" assumption; when Bucket B is decided,
  update spec §8.8 to match so the two docs don't contradict each other.
- **2026-08-23** — UI mockup built and reviewed (`mockup/salary-calculator-mockup.html`, served
  on :8090). Design decisions captured in `salary-calculator-ui-design-spec.md`. Key calls:
  fixed 470px left column that never resizes, sticky results card, wider/roomier spacing, pay
  sheet as a proper `<table>` at the bottom with an independent frequency toggle, bonus landing
  on a specific month rather than averaged, and a ~2,456-word long-form content section following
  the repo's enforced `How to Guide → FAQ → Important Notes` ordering.
  Mockup deliberately lives outside `public/` and carries `noindex` — it must never ship.
- **2026-08-23** — Two design questions still open: exact left-column width (470px provisional),
  and whether the pay sheet should be printable/CSV-exportable.
- **2026-08-23** — **Bucket B resolved: B2 — statewide-only, no local/municipal income tax in
  V1.** Tax-engine spec §8.8 rewritten from conditional ("can be omitted") to definitive, so the
  two docs now agree. Accepted consequence: take-home is overstated for NYC/Yonkers,
  Philadelphia and PA municipalities, Ohio cities, Maryland counties, Detroit, St. Louis, Kansas
  City, Louisville, Birmingham — several thousand dollars a year for a NYC earner. This is
  disclosed, not hidden: a visible local-tax disclaimer is now a required UI element in USA mode
  (added to design spec §6 — **not yet in the mockup**). The engine must still keep a local-tax
  layer slot so B1 can be added later without restructuring. Revisit if GSC shows traffic on
  local-tax queries.
- **2026-08-24** — **Explanation restructured from one long card into nine sibling cards**, each
  titled with an `<h2>` matching its TOC entry (design spec §8.1). The `UK deductions explained`
  and `US deductions explained` cards are now **mode-gated** — they reuse the existing
  `data-only="uk|us"` attribute, so `applyMode()` already drives them and no new JS was written.
  Their TOC entries and the country-specific worked examples are gated the same way; Gross Pay
  mode shows neither country card and gets a short substitute line in the examples card so it is
  never empty. A `.card-tag` pill (`UK MODE` / `USA MODE`) labels each country card.
  Verified: `validateRequiredBlockOrder` still returns `isValid: true` — Important Notes is
  heading 38 of 38. Word count is ~2,619 in the DOM, ~2,183 visible in UK mode / ~2,170 in USA /
  ~1,826 in Gross. **The gap between those numbers is the whole risk here**: hiding is CSS-only
  and must stay that way, because the thin-content scorer parses static HTML and would happily
  pass a build that had stripped half the copy out of the live DOM.
  Also added to the US card while there: a `Local and city income taxes` subsection + callout
  naming the jurisdictions B2 excludes. That satisfies the explanatory half of the B2 disclaimer
  duty; the short results-card line (design spec §6) is **still outstanding** — it sits far below
  the fold, so it does not cover the at-a-glance case.
- **2026-08-24** — **Pay sheet un-gated.** It was only rendered once `+ Pay schedule` was
  enabled, so calculating produced no pay sheet at all — the feature was effectively invisible.
  It now renders from first paint using a default first payday of the next Friday, with a note
  saying the date is assumed and a link that opens the schedule panel. `+ Pay schedule` refines
  rather than unlocks. Gross Pay mode keeps the sheet in degraded form (`#`/`Pay date`/`Gross`),
  with the deduction columns hidden in CSS so re-renders can't undo it.
  Three further defects surfaced while verifying that and were fixed in the same pass:
  1. **The results card was hard-coded UK.** Switching to USA changed only the hero number —
     legend, period cards and breakdown kept `£`, `NI` and `Personal allowance`. Everything is
     now rendered from a per-mode `MODEL` object (design spec §6.1) so currency, terminology and
     figures move together. Both models are asserted internally consistent:
     `gross − tax − ins − pen === net`, and the breakdown bands sum to the legend total.
  2. **The weekend-adjustment chips did nothing.** The sheet cheerfully printed `Sat 28 Nov` while
     the selected rule read "Previous working day". Now applied, with a `MOVED` pill. Watch the
     compounding trap: adjust a *copy* for display and keep stepping from the true base date.
  3. **Dates were `en-GB` in both modes.** Now locale-switched.
  The USA local-tax disclaimer is also **now done** — amber band under the deduction bar, gated
  `data-only="us"`, linking down to the full jurisdiction list. That closes the last B2 item.
- **2026-08-24** — **Build started. Phase 1 + Phase 2 done for the UK.** Four tax tables, three
  engine modules, a validator, and 54 unit tests. Full `npx vitest run` still shows exactly the
  known 5-failure baseline, so nothing existing regressed.
  Things worth not rediscovering:
  1. **Income tax bands are stored in taxable-income space, NI bands in gross space.** They
     cannot share a convention. The Personal Allowance taper is why: at 125,140 gross the
     allowance is nil, so the additional-rate threshold is 125,140 in *both* spaces while every
     lower threshold is `gross − 12,570`. Subtracting 12,570 from the top threshold is the
     obvious-looking error and it silently overtaxes high earners.
  2. `calculateProgressiveTax` takes **absolute** band boundaries on whatever income measure is
     passed in. That one decision is what lets Income Tax and NI share an implementation despite
     having unrelated thresholds.
  3. **Spec §4's 4-weekly warning is really about rounding.** `monthly × 12 / 13` is
     algebraically identical to `annual / 13`; the drift comes from deriving it off a monthly
     figure already rounded for display. My first test asserted the two were equal and therefore
     proved nothing — rewritten to pin 55,000 and assert they differ.
  4. **Pension relief method is not cosmetic.** Salary sacrifice reduces NIable earnings and net
     pay arrangement does not (60/yr at a 60k salary); relief at source reduces neither and costs
     the employee only 80% of the contribution. Encoded as flags in `pension.json` so the engine
     reads behaviour from data rather than branching on a method name.
  5. Bonus at the taper: 100k + 10k bonus is taxed at an effective **62%**, not the 40% a
     marginal-rate calculation would report. This is the case that justifies the whole
     net-with-minus-net-without approach.
  **Tax figures are NOT verified.** All four tables are `lastVerified: null` and `--strict`
  exits 1. Scottish bands and student-loan thresholds are 2025/26 values and are the two most
  likely to be wrong for 2026/27. See the verification gate table in Phase 1.

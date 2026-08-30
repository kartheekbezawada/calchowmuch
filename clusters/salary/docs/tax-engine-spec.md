# Salary Calculator — Tax Engine Specification

**Status:** living document. Part I describes the engine **as built today**; Part II specifies the
**target multi-country payroll framework**; Part III covers data governance.

**Canonical location:** `clusters/salary/docs/tax-engine-spec.md` (committed). Code comments and
`scripts/validate-tax-data.mjs` reference this file by section number (e.g. "spec §8.9").

**Consumers today:** `salary-calculator` only. The `annual-to-monthly-salary-calculator` and
`monthly-to-annual-salary-calculator` forks were both retired in the 2026-08 consolidation (301'd
into `salary-calculator`, whose Gross Pay mode covers the pay-period conversion intent).

---

## Part I — Current contract (as built)

### §1 Scope and principles

1. The engine computes **employee take-home pay** for a stated gross salary in a supported country.
   Employer-side costs are out of scope in Part I (Part II §24 adds an opt-in employer view).
2. Four modes exist: `gross` (pay-period conversion, no tax), `uk`, `us`, `canada`.
3. Estimates only. Withholding is approximated (§5.3); local/municipal taxes are excluded (§8.8);
   contribution limits are not enforced (Part II §23).

### §5 Pay-date schedule engine

Module: `shared/tax-engine/pay-schedule.js`. Pure — no DOM, no clock reads except an explicit
`from`/`firstPayDate` argument.

- **§5.1** `generatePaySchedule({ firstPayDate, frequency, annualGross, annualNet, deductions[],
  periods = 12, weekendRule, bonusMonthIndex, bonusGross, bonusNet })` →
  `{ frequency, periodsPerYear, weekendRule, firstPayDate, rows[], totals }`.
  Each row: `{ index, date, movedOffWeekend, isBonusPeriod, gross, net, deductions[] }`.
  `frequency` ∈ `weekly | biweekly | fourWeekly | monthly` (calendar stepping is defined only for
  these).
- **§5.2 Monthly rule.** `addMonthsClamped` clamps to the last valid day — a 31st-of-month payroll
  pays on 28/29 Feb, never rolls into March.
- **§5.3 Withholding model (current).** `perPeriodGross = annualGross / periodsPerYear`;
  `perPeriodNet = annualNet / periodsPerYear`; each deduction `annualAmount / periodsPerYear`.
  Every regular period is **identical**. This is an approximation — Part II §25 replaces it with
  real per-period statutory withholding.
- **§5.4 Bonus.** Lands on **one** payday (`bonusMonthIndex`, matched on the weekend-**adjusted**
  month), never smeared. `bonusDeductionTotal = bonusGross − bonusNet` is apportioned across the
  deduction columns in proportion to their regular size (all onto column 0 if there are none).
- **§5.5 Weekend rule.** `previous | next | none`. `adjustForWeekend` returns a new Date and never
  mutates; the caller must keep stepping from the **unadjusted** base so shifts do not compound.

### §8 US take-home engine

Module: `shared/tax-engine/us-engine.js`. Exports `calculateUsTakeHome(input, taxData)` and
`calculateUsBonusImpact(input, taxData)`.

`input`: `{ grossAnnual, filingStatus?, bonus?, pretaxDeductions? }`.
`taxData`: `{ federal, fica, state, payroll }` (assembled by the caller from
`us/federal-income-tax.json`, `us/fica.json`, `us/states/<XX>.json`, `us/payroll-taxes.json`).

Layered, in order, each a separate step: **Federal → FICA → State income → State payroll.**

- **§8.1 Filing statuses.** `single | marriedFilingJointly | marriedFilingSeparately |
  headOfHousehold`. All four **must** be present in `us/federal-income-tax.json` (validator
  enforces). Unknown status → `RangeError`.
- **§8.2 Federal taxable income** = `max(0, gross − pretaxDeductions − standardDeduction)`, then
  `calculateProgressiveTax` over `federalStatus.bands`.
- **§8.3 FICA** = Social Security (`rate` up to `wageBase`) + Medicare (`rate`, `wageBase: null` =
  uncapped) + Additional Medicare (`rate` above a **flat** `withholdingThreshold` of 200,000
  regardless of status — the per-status `liabilityThresholds` in the data are reconciled on the
  return, not at withholding, and are **currently unused**).
- **§8.4 State income tax.** `taxStructure` ∈ `none | flat | graduated`. Most state files carry
  `single` only; other statuses **fall back to `single`** and the fallback is disclosed via
  `result.assumptions[]`. Taxable = `max(0, (gross − pretaxDeductions) − (standardDeduction +
  personalExemption))`.
- **§8.5 State payroll taxes (SDI / PFML).** Only modelled for states present in
  `us/payroll-taxes.json` (`CA`, `NJ`, `NY` today). States in `notModelled.jurisdictions` set
  `hasUnmodelledProgram: true` and add an assumption string. Each contribution is a
  wage-capped flat rate.
- **§8.8 No local / municipal income tax (B2 decision).** `localTaxExcluded: true` on **every**
  US result. The pipeline keeps a slot for it. The UI must disclose this next to the figure.
- **§8.9 Pre-tax deductions and FICA.** `pretaxDeductions` (a single annual dollar figure) reduces
  the **federal** and **state** taxable base but **not** the FICA base — `calculateFica` is passed
  raw `gross`. It is also added into `totalDeductions` (money that left the paycheck). **Limitation:**
  there is exactly one pre-tax behaviour, so a traditional 401(k) (FICA-taxable) and an HSA/FSA via
  a Section-125 cafeteria plan (FICA-exempt) are modelled identically. There is no post-tax
  deduction input and no Roth/after-tax path. Part II §22 fixes this.

### §9 UK take-home engine

Module: `shared/tax-engine/uk-engine.js`. Exports `calculateUkTakeHome`, `calculateUkBonusImpact`.

`input`: `{ grossAnnual, region?, bonus?, pensionPercent?, pensionReliefMethod?, pensionBasis?,
studentLoanPlan?, hasPostgraduateLoan? }`.
`taxData`: `{ incomeTax, nationalInsurance, studentLoans, pension }`.

Order of operations (**not arbitrary**):

1. **Pension** first — the relief method decides what Income Tax and NI are charged on.
   `net-pay-arrangement` reduces taxable income, not NIable; `salary-sacrifice` reduces both;
   `relief-at-source` reduces neither and costs the employee `contribution × (1 −
   basicRateReliefReclaimedByScheme)` out of net.
2. **Personal Allowance** — `calculateTaperedAllowance` against income **after** pension relief
   (taper: £1 per £2 above £100,000, gone by £125,140).
3. **Income Tax** — `calculateProgressiveTax` over the region's band set (`rUK` or `scotland`;
   `regions.<key>.bandSet`). Unknown region → `RangeError`.
4. **National Insurance** — its own base, its own thresholds (only salary sacrifice reduces it).
   Independent of steps 2–3.
5. **Student loans** — `calculateThresholdTax` on gross. An undergraduate plan and a postgraduate
   loan stack. Unknown plan → `RangeError`.

### §10 Precision and rounding

Engines carry **full floating-point precision** end to end. Rounding to currency happens **only at
the presentation layer**. Tests pin money with `Math.round(n * 100) / 100`; band-math internals
are asserted with `toBeCloseTo(x, 9)`.

### §11 Tax-data files

Root: `public/calculators/salary-calculators/shared/tax-data/`. JSON, `fetch`-ed at runtime
(never bundled), so the 51 US state files can grow without touching the initial payload.

- **§11.1 Metadata envelope (required on every file).** `country`, `dataset`, `taxYear`,
  `effectiveFrom` (ISO date), `effectiveTo` (ISO date, `> effectiveFrom`), `currency`,
  `source`, `lastVerified` (ISO date or `null`). Optional: `verification { status, verifiedOn,
  confidence, source, note }`, `notes[]`.
- **§11.2 Layout (current).** `uk/{income-tax,national-insurance,student-loans,pension}.json`;
  `us/{federal-income-tax,fica,payroll-taxes}.json` + `us/states/<XX>.json` (50 states + DC);
  `ca.json` (single file: `federal` + `cpp` + `ei` + `provinces.<XX>` for all 13). Part II §21
  moves everything under `<country>/<year>/`.
- **§11.3 Band schedules.** Absolute boundaries: `{ id, name, rate (fraction), from (inclusive),
  to (exclusive, `null` = unbounded) }`. Contiguous and ascending (`band.to === next.from`);
  exactly one open top band. The **same** `calculateProgressiveTax` serves UK Income Tax, UK NI,
  US federal, every US state, CA federal and CA provincial. Non-schedule mechanics that would be
  obscured by forcing them into a band table are kept as their own primitives:
  `calculateThresholdTax` (flat rate above a threshold — UK student loans, some US states),
  `calculateTaperedAllowance` (income-tested phase-out — UK Personal Allowance, CA BPA taper),
  and the CA-only surtax / health-premium steps in `ca-engine.js`.
- **§11.4 `source`** must be an official government URL (`https?://…`).

### §12 Marginal rate vs effective rate

These are **different numbers** and must never be conflated into one figure a user cannot
reconcile against their own bracket.

- **Effective rate** = `totalDeductions / gross`.
- **Marginal rate** = the rate of the last band that received income (`calculateProgressiveTax`).
- Federal and state/provincial marginal rates are reported as **separate fields**
  (`marginalRate`, `stateMarginalRate` / `provincialMarginalRate`, `combinedMarginalRate`).
- Engines surface `isInAllowanceTaper` / `isInBpaTaper` so the UI can warn when a taper distorts
  the marginal band.

### §13 Canada take-home engine

Module: `shared/tax-engine/ca-engine.js`. Exports `calculateCaTakeHome`, `calculateCaBonusImpact`.

`input`: `{ grossAnnual, province?, bonus? }` (**no deduction parameter beyond `bonus`** — no
RRSP/FHSA; Part II §22 adds them).
`taxData`: `{ federal, cpp, ei, province }` where `province` is `caData.provinces[<code>]`.

Layered: **Federal income tax → CPP (+CPP2) → EI → Provincial/territorial tax (+ Ontario surtax /
health premium).**

- **§13.1 BPA is a non-refundable credit, not a deduction.** Full bracket tax is charged on
  un-reduced taxable income first, then `tapered BPA × lowest band rate` is subtracted from tax
  owing (federal **and** provincial). Modelling it as a pre-bracket deduction (the UK/US way)
  produces a materially wrong number. `calculateTaperedAllowance` is still the right primitive for
  the taper **shape**; only what happens to the tapered amount afterwards differs.
- **§13.2 CPP/CPP2.** Base contribution between `exemption` and `ceiling` (YMPE); optional second
  tier between that ceiling and a higher one (YAMPE). Employee-only rates.
- **§13.3 EI.** Flat rate to `maxInsurableEarnings`; $0 marginal above.
- **§13.4 Quebec.** `province.province === 'QC'` swaps two of the four lines: QPP instead of CPP,
  reduced-rate EI (`province.eiReduced`) + a separate QPIP premium (`province.qpip`), plus a
  federal abatement (`federalTax.total × quebecAbatementRate`). Quebec is **not** "just another
  province" — two deduction lines read from a different config object.
- **§13.5 Ontario.** Optional `surtax` (tax-on-tax, escalating tiers, after provincial BPA credit)
  and `healthPremium` (income-tested step function, capped). Absent for every other jurisdiction.

### §17 Layering — engine purity

- The engine contains **zero DOM and zero `fetch`**. Tax data is **injected** by the caller.
  This keeps every engine unit-testable in Node without a browser or network.
- The inverse also holds: **the UI layer contains zero tax logic.** *(Part I violates the spirit
  of this — `module.js` holds currency formatting, `segmentsFor` normalisation, and three
  `renderBands` variants. Part II §18–§20 moves all of it behind the country registry.)*

### §33 Bonus impact

Computed as **take-home with the bonus minus take-home without it** — two full engine runs. Never
`bonus × marginalRate`: the naive method ignores the bonus crossing a band boundary and ignores
the Personal Allowance / BPA taper entirely, which is exactly where it is most wrong. Each engine
exports `calculate<X>BonusImpact` returning `{ withBonus, withoutBonus, grossBonus, netBonus,
deductedFromBonus, effectiveBonusRate }`.

### §47 Pay-frequency normalisation

Module: `shared/tax-engine/pay-frequency.js`. Everything normalises to an **annual** figure and
converts back out from there (chaining conversions accumulates error).

- `PERIODS_PER_YEAR = { annual: 1, monthly: 12, fourWeekly: 13, biweekly: 26, weekly: 52 }`.
- **4-weekly pay is `annual / 13`**, not `monthly × 12 / 13`. The wrong form is arithmetically
  close, which is what makes it dangerous — it never reconciles against a real payslip and
  misrepresents that the money arrives as 13 payments, not 12 redistributed.
- `daily` and `hourly` depend on the user's `{ hoursPerWeek, weeksPerYear, daysPerWeek }` schedule
  and so are deliberately **not** in `PERIODS_PER_YEAR`.
- Unknown frequency → `RangeError`.

### §50 Current result shapes (reference)

All engines share a common contract the UI relies on: `country`, `currency`, `gross`, `netAnnual`,
`totalDeductions`, `effectiveRate`, `marginalRate`. Everything else is country-shaped and read
behind `result.country ===` branches. Full shapes:

- **gross** — `gross-engine.js`: UK shape with tax fields zeroed, `country: null`, `mode: 'gross'`,
  plus `periods` (`fromAnnual` output).
- **UK** — `{ country:'UK', currency:'GBP', taxYear, region{key,name,bandSet}, gross, baseSalary,
  bonus, personalAllowance{allowance,reducedBy,isTapered}, taxableIncome,
  incomeTax{total,breakdown,marginalRate}, nationalInsurance{total,breakdown}, studentLoans{entries,total},
  pension{…,takeHomeCost}, totalDeductions, netAnnual, effectiveRate, marginalRate, isInAllowanceTaper }`.
- **US** — `{ country:'US', currency:'USD', taxYear, state{code,name,structure}|null, filingStatus,
  gross, baseSalary, bonus, pretaxDeductions, standardDeduction, federalTaxableIncome,
  federalTax{total,breakdown,marginalRate}, fica{total,socialSecurity,medicare,additionalMedicare,breakdown},
  stateTax{total,breakdown,marginalRate,taxableIncome,deductionApplied,structure,usedFilingStatus},
  statePayrollTaxes{total,entries,hasUnmodelledProgram}, totalDeductions, netAnnual, effectiveRate,
  marginalRate, stateMarginalRate, combinedMarginalRate, localTaxExcluded, assumptions[] }`.
- **CA** — `{ country:'CA', currency:'CAD', taxYear, province{code,name}, gross, baseSalary, bonus,
  federalTax{taxableIncome,grossTax,breakdown,marginalRate,bpa{…},abatement,payable,total},
  cpp{base,secondTier,total,breakdown}|null, qpp{…}|null, ei{amount,maxInsurableEarnings,rate},
  qpip{…}|null, provincialTax{…,surtax,healthPremium,total}, totalDeductions, netAnnual,
  effectiveRate, marginalRate, provincialMarginalRate, combinedMarginalRate, isInBpaTaper }`.

---

## Part II — Target: multi-country payroll framework

Goal: an **open-ended plugin framework**. Core holds only country-agnostic primitives. Every
country is a self-contained module that passes a conformance suite (§29). Adding a country must
require **no edits to core, the UI, or the generator** — only a new module and its data files.

### §18 Pipeline

```text
UI (schema-driven, ONE code path — no per-country branching)
    │  PayrollInput { country, taxYear, jurisdiction, frequency, gross, filingStatus?,
    │                 preTax[], postTax[], employer{}, bonus{}, schedule{} }
    ▼
Country Registry → Country Module  (countries/<code>.js)
    │   meta · fieldSchema · deductionSchema · jurisdictions() ·
    │   loadData(year, jurisdiction) · engine(input, data) · withholding(input, data, calendar)
    ▼
Core primitives (country-agnostic, no country names anywhere):
    progressive-tax · tapered-allowance · threshold-tax · credit-taper ·
    ceiling-tracker · period-withholding helpers · contribution-limit resolver ·
    pay-schedule (calendar only)
    ▼
Tax Data  tax-data/<country>/<year>/<dataset>.json   (§21, envelope unchanged from §11.1)
    ▼
Normalized PayrollResult (§26) — identical shape for every country
    ▼
Renderers, all schema-driven (never `if country ===`):
    result card · bands breakdown · dynamic pay sheet (§27) · tax-saving panel (§28) · CSV / copy
```

### §19 De-fork the controllers *(Phase 0 — DONE via consolidation)*

~~`annual-to-monthly-salary-calculator/module.js` and `monthly-to-annual-salary-calculator/module.js`
are ~1330-line near-verbatim copies of `salary-calculator/module.js`.~~ Both forks were **deleted**
in the 2026-08 consolidation rather than de-forked — there is now a single salary-calculator
controller, so all Part II architecture lands there directly with no factory extraction needed.

### §20 Country module contract

`countries/<code>.js` default-exports:

```text
{
  meta: { code, label, currency, locale, jurisdictionLabel, defaultJurisdiction, availableYears[] },
  fieldSchema:     FieldDef[]      // which inputs to render, order, validation, visibility rules
  deductionSchema: DeductionDef[]  // §22 — pre-tax / tax / post-tax column definitions
  jurisdictions(data): { code, name }[]           // states / regions / provinces
  loadData(year, jurisdictionCode): Promise<data> // resolves year-keyed JSON, §21
  engine(input, data): PayrollResult              // annual figures, §26
  withholding(input, data, calendar): PeriodRow[] // §25 — per-period statutory withholding
}
```

- `FieldDef`: `{ id, kind: 'number'|'select'|'chip-group'|'typeahead'|'checkbox', label, hint?,
  default, options?, min?, max?, step?, showWhen?, group: 'core'|'optional', limitId? }`.
- The registry (`shared/tax-engine/country-registry.js`) exposes `getCountry(code)`,
  `listCountries()`, `getCountryForYear(code, year)`.
- `gross` is a country module too (no jurisdiction, empty `deductionSchema`, identity withholding).

### §21 Tax-year resolution and data layout

- Data moves to `tax-data/<country>/<year>/<dataset>.json`
  (e.g. `tax-data/us/2026/federal-income-tax.json`, `tax-data/us/2026/states/CA.json`,
  `tax-data/ca/2026/federal.json` + `…/provinces/ON.json`). Envelope (§11.1) unchanged.
- `loadData(year, jurisdiction)` resolves the year directory. A requested year with no data
  **falls back to the latest available year** and the result carries a `dataYearFallback` note the
  UI must surface.
- Resolution chain: **country → year → jurisdiction → thresholds / limits / withholding tables.**
- UI: a tax-year `<select>` (default = country's current tax year). `year` flows
  `PayrollInput → registry → loadData`. The hard-coded "2026" disclaimer string is replaced by the
  loaded `taxYear` / `effectiveFrom..effectiveTo`.
- Validator: walk year directories; assert no overlapping `effectiveFrom..effectiveTo` within one
  `country/dataset`.

### §22 Structured pre-tax / post-tax model

Replaces the single US `pretaxDeductions` number and the CA "nothing".

`DeductionDef`: `{ id, label, category: 'preTax' | 'postTax', accountKind?, limitId?,
reducesFederalTaxable, reducesStateOrProvincialTaxable, reducesFica (US), reducesNiable (UK),
employerContributable }`.

`PayrollInput.preTax[]` / `postTax[]` items: `{ id, amount }` (or `{ id, percent }` resolved to an
amount by the engine). Engines compute **each tax base from the schema flags**, not a fixed rule:

- **US** preTax: `traditional401k` (FICA-taxable, defers federal+state), `hsa` / `fsa`
  (Section-125: FICA-**exempt**, defers federal+state), `healthInsurancePreTax` (Section-125),
  `otherPreTax`. postTax: `roth401k`, `unionDues`, `garnishment`, `otherPostTax`.
- **CA** preTax: `rrsp`, `fhsa`, `rpp` (all defer federal+provincial; none affect CPP/EI).
  postTax: `otherPostTax`.
- **UK**: keep the three pension relief methods (they already encode the flags); add generic
  `otherPreTax` / `otherPostTax`.

`segmentsFor()` (the current 4-bucket collapse) is deleted — the UI sums by `deductionSchema`
category instead.

### §23 Contribution limits

- New dataset `tax-data/<country>/<year>/contribution-limits.json`:
  `{ <accountId>: { annualLimit, catchUpLimit?, catchUpAge?, combinedEmployeeEmployerLimit?,
  basis?: 'flat' | 'percentOfEarnedIncome', percent?, carryForward? } }`.
  US: 401(k) 402(g), HSA self / family, FSA, IRA. CA: RRSP (18% of prior-year earned income + a
  dollar cap), FHSA (annual + lifetime). UK: annual allowance + taper (data already present in
  `pension.json`, currently unused).
- Core `resolveContributionLimit(accountId, input, limitsData)` → `{ annualLimit, applied,
  remaining, wasCapped }`. The engine caps each contribution at its limit and returns
  `limits[] = { accountId, requested, applied, annualLimit, remaining, wasCapped }`.
- UI: per open account show **Annual limit / Your contribution / Remaining**; when the entered
  amount exceeds the limit, warn and clamp (this is the "$100k salary → $100k 401(k)" guard).
- Validator: dataset check for `contribution-limits`.

### §24 Employer contributions

- `fieldSchema` optional inputs per `employerContributable` account: a **match formula**
  (e.g. 50% up to 6% of gross) or a flat employer amount.
- The engine treats employer money as money that **does not reduce net pay**. It feeds
  `result.employer[] = { accountId, amount }` and the **combined** employee+employer limit check
  (§23).
- New result line "Retirement account this year" = employee contribution + employer contribution.
- The pay sheet stays **employee cash-flow only**; employer figures live in the summary / analysis
  area, clearly labelled as employer-funded.

### §25 Per-period statutory withholding

Replaces §5.3's flat "annual ÷ periods".

- Core `ceiling-tracker`: given a running year-to-date wage total and a set of ceilings (US SS
  wage base, CA CPP/EI ceilings), returns the contributory amount for the current period and the
  YTD carry. Periods **before** a ceiling is reached withhold the full rate; the period that
  **crosses** it withholds a partial amount; periods after withhold nothing for that line.
- `withholding(input, data, calendar)` per country module:
  - **US** — IRS Pub 15-T **percentage method**: annualise the period's taxable wage, apply the
    W-4-adjusted bracket table, divide back. Supplemental wages (the bonus row) use the **flat
    22%** rate (`tax-data/us/<year>/withholding.json`).
  - **UK** — cumulative PAYE: at month *n*, recompute tax due on YTD taxable pay against *n*/12 of
    the allowances and bands, withhold the difference from what was already withheld. (This is why
    a pay rise mid-year produces an uneven catch-up.)
  - **CA** — CRA T4127 formula (annualisation method) for federal + provincial; CPP/EI via the
    ceiling-tracker.
- Output `PayrollResult.perPeriod[]` — **non-uniform** rows. `generatePaySchedule` consumes these
  directly instead of dividing evenly (its calendar logic — §5.2, §5.4, §5.5 — is unchanged).
- **Reconciliation invariant:** `Σ perPeriod[i].<line>` equals the annual engine figure for that
  line, within rounding tolerance. Enforced by the conformance suite (§29) and `withholding.test.js`.

### §26 Normalized `PayrollResult`

Every country's `engine()` returns the **same shape**:

```text
{
  country, currency, taxYear, jurisdiction: { code, name },
  gross, baseSalary, bonus,
  preTax:  [ { id, label, amount, category:'preTax',  taxTreatment:{…flags} } ],
  taxableBases: { federal, stateOrProvincial, fica?, niable? },     // country fills what applies
  taxes:   [ { id, label, amount, breakdown?, marginalRate? } ],    // ordered for display
  postTax: [ { id, label, amount, category:'postTax' } ],
  totalDeductions, netAnnual, effectiveRate,
  marginalRate, secondaryMarginalRate?, combinedMarginalRate?,
  employer: [ { accountId, amount } ],
  limits:  [ { accountId, requested, applied, annualLimit, remaining, wasCapped } ],
  savings: [ { accountId, contribution, marginalRatesUsed, estimatedTaxSaved, breakdown } ],  // §28
  perPeriod: PeriodRow[],                                            // §25
  notes: string[],            // supersedes `assumptions[]`; dataYearFallback, filing-status fallback, localTaxExcluded, tapers
  flags: { localTaxExcluded?, inTaper?, … }
}
```

Country-specific detail (e.g. UK `personalAllowance`, CA `bpa`, US `standardDeduction`) lives
inside the relevant `taxes[]` entry's `breakdown`, not as a top-level branch.

### §27 Dynamic country-specific pay sheet

- Columns are generated from `deductionSchema` + `taxes[]`:
  `#`, `Pay date`, `Gross`, …one column per pre-tax account…, …one per tax line…, `Post-Tax`, `Net`.
  No irrelevant columns (USA shows 401(k)/HSA/Health Ins/Federal/State/SS/Medicare/Other; Canada
  shows RRSP/FHSA/Federal/Provincial/CPP/EI/Other).
- The current `setHead(th:nth-child(n))` relabel + fixed 3-cell `<tbody>`/`<tfoot>` template is
  replaced by a schema-driven builder. Gross mode = `Gross` only.
- `generatePaySchedule`'s `deductions` argument becomes the full typed list.
- Excel-grid styling (`calculator.css`) must not assume a fixed column count.
- **CSV export** of the pay sheet (header + per-period rows + totals).
- CLS: the pay-sheet container reserves height; must pass `iss-001-layout-stability.spec.js` and
  `cls-guard-all-calculators.spec.js` (CLS ≤ 0.1).

### §28 Tax-saving analysis

- Engine returns `savings[] = { accountId, contribution, marginalRatesUsed: { federal, state,
  fica?/ni? }, estimatedTaxSaved, breakdown: { federal, stateOrProvincial, fica?/ni? } }`.
  `estimatedTaxSaved` = contribution × the marginal rates it **actually offsets** (a US HSA also
  offsets FICA; a Roth 401(k) offsets nothing → 0).
- New results panel: `gross → pre-tax → taxable → taxes → net`, then **"Total estimated tax
  savings from your contributions"** with the per-account breakdown. Reuses `.sal-band` styling.
- `copySummary()` gains a savings line.

### §29 Conformance suite

`tests_specs/infrastructure/unit/country-conformance.test.js` runs the **same** assertions against
**every** registered country module:

1. `meta` has all required keys; `currency` is a valid ISO code; `availableYears` non-empty.
2. `fieldSchema` / `deductionSchema` entries match their type definitions; every `limitId` /
   `showWhen` reference resolves.
3. `loadData(latestYear, defaultJurisdiction)` resolves; returned data passes the §11.1 envelope
   check for every file it touches.
4. `engine()` returns a `PayrollResult` (§26) with every required key and correct value types.
5. **Reconciliation:** `gross − totalDeductions === netAnnual` (± 0.01);
   `Σ taxes + Σ preTax(cash) + Σ postTax === totalDeductions`.
6. **Band contiguity** for every schedule the module loads.
7. **Limit capping:** a contribution above its `annualLimit` produces `wasCapped: true` and
   `applied === annualLimit`.
8. **Withholding reconciliation** (§25): `Σ perPeriod[i].<line> ≈ annual <line>`.
9. `bonusImpact` (if exported) equals `withBonus.netAnnual − withoutBonus.netAnnual`.

A country module is not "done" until it is green here **and** its data files pass
`validate-tax-data.mjs --strict`.

---

## Part III — Data governance

### §40 Directory & envelope conventions

- One file per `(country, year, dataset)`. Path `tax-data/<country>/<year>/<dataset>.json`
  (jurisdiction sub-files under `…/<year>/states/` or `…/<year>/provinces/`).
- Envelope per §11.1. `dataset` values are a closed vocabulary the validator switches on
  (`income-tax`, `national-insurance`, `student-loans`, `pension`, `federal-income-tax`, `fica`,
  `us-state-income-tax`, `payroll-taxes`, `ca-tax-data` / `federal`, `province`, plus the new
  `contribution-limits`, `withholding`).
- All monetary thresholds are **annual** and in the file's `currency`. Rates are fractions.

### §41 Verification workflow

- `node scripts/validate-tax-data.mjs` — structural. **Wire into `npm run validate`** (Phase 0).
- `node scripts/validate-tax-data.mjs --strict` — the **pre-ship release gate**. Requires
  `lastVerified` non-null on every file and `verification.status === 'verified'`, except
  `us/states/*`, `us/payroll-taxes*` and the CA file(s) which may be `aggregated-source` **if**
  they carry a `verification.note`. Document this in `AGENTS.md` §3.
- Every rate/threshold change records what was checked, against which official URL, on what date,
  in `verification.note`.

### §42 Annual update runbook

For each supported country, once a year when the new tax year's figures are published:

1. Copy `tax-data/<country>/<prev>/` → `tax-data/<country>/<next>/`.
2. Update every rate / threshold / limit / withholding table against the official source; set
   `taxYear`, `effectiveFrom`, `effectiveTo`, `source`, `lastVerified`, `verification`.
3. Add `<next>` to the country module's `meta.availableYears`.
4. `validate-tax-data.mjs --strict` green; conformance suite (§29) green for that country.
5. Update the pinned reference figures in `tests_specs/infrastructure/unit/<country>-tax-engine.test.js`
   and `tests_specs/salary/shared/config.js` for the new default year.
6. Release checklist per `AGENTS.md`.

---

## Appendix A — Implementation phase map

| Phase | Sections | Deliverable |
|---|---|---|
| 0 | §19, §41 | Spec (this doc), `validate-tax-data` wired into `npm run validate`, engine/data cache-busting, controller de-fork |
| 1 | §18, §20, §26 (shape only) | Country registry + `countries/{gross,us,uk,ca}.js`; UI de-hardcoded; pure refactor, all pinned tests green |
| 2 | §21 | Year-keyed data tree, `loadData(year,…)`, year selector |
| 3 | §22, §26 | Structured pre/post-tax model; engines consume typed buckets; `segmentsFor` deleted |
| 4 | §23 | Contribution limits dataset + resolver + UI |
| 5 | §24 | Employer contributions |
| 6 | §25 | Per-period statutory withholding |
| 7 | §27 | Dynamic pay-sheet columns + CSV |
| 8 | §28 | Tax-saving analysis panel |
| 9 | §29, §42 | Conformance suite green for a 4th country added as a pure module; data verification pass |

---

## Part IV — UI requirements (2026-08-31 requirements pass)

**Status:** §60–§65 are **shipped on `salary-calculator`** (§61 also on the converter). §66 is
partly done — `shared/tax-engine/extra-payments.js` and `deduction-rows.js` are real common-layer
modules and the engines are already pure/data-injected, but the full plugin registry (Part II
§18–§20, tax-year awareness §21, conformance suite §29) is still the phased build.

Common-layer modules added: `shared/tax-engine/extra-payments.js` (§63–§65 resolver),
`shared/tax-engine/deduction-rows.js` (§62 result → itemised rows). Tests:
`tests_specs/infrastructure/unit/{extra-payments,deduction-rows}.test.js`.

### §60 Label — "Gross Salary"

The pay-amount input, and every reference to it in summaries, the assumptions line, the copy
summary and the explanation, reads **"Gross salary"** (not "Pay amount"). Applies to every
country calculator. *(Done: `salary-calculator`. The gross converter keeps "Pay amount" since its
input may be an hourly/weekly rate, not a salary.)*

### §61 Pay frequency — 4-weekly is a first-class option

Frequency options, in order: **Hourly · Daily · Weekly · 4-weekly · Biweekly/Fortnightly ·
Monthly · Annual**. 4-weekly = annual ÷ 13 (13 payments a year); never a monthly figure adjusted
(§47). The results panel shows a 4-weekly figure and the **Copy Summary includes a 4-weekly line
for every country**. Core-layer helpers (`pay-frequency.js`, `salary-utils.toAnnualPay` /
`convertAnnualPay`) all carry `fourWeekly`. *(Done on the two frequency-driven calculators.)*

### §62 Deductions section (country-specific)

A dedicated **Deductions** section listing the deductions that actually apply to the selected
country, each as its own line — not one generic "deductions" bucket. This is §22's
`deductionSchema` rendered as a visible, itemised section:
- **UK:** Income Tax · Employee National Insurance · Workplace pension · Student loan · Other
- **US:** Federal income tax · State income tax (where applicable) · Social Security · Medicare ·
  401(k) / retirement · Other
- **CA:** Federal income tax · Provincial/territorial income tax · CPP · EI · Pension/RRSP · Other

### §63 Optional Extra Payments section

A separate **Optional Extra Payments** section, off by default, that adds income on top of the
gross salary without changing the base figure unless the user opts in:
- Overtime pay (§64) · Bonus pay · Commission pay · Other extra pay
- Each extra payment carries a **frequency basis** (§65).

### §64 Overtime — three calculation methods (user-selected)

- **A · Fixed amount** — user enters a flat overtime figure (e.g. £500).
- **B · Hourly rate × hours** — overtime pay = overtime hourly rate × overtime hours
  (e.g. £25 × 10 = £250).
- **C · Percentage of gross** — user picks a gross-pay basis (hourly / weekly / 4-weekly / monthly
  / annual gross) and a percentage; overtime pay = that gross × percentage
  (e.g. monthly gross £4,000 × 10% = £400).

### §65 Extra-payment frequency basis

For each applicable extra payment, the user selects the basis: **hourly / weekly / 4-weekly /
monthly / annual gross**. The engine converts the entered amount to the correct annual (and
per-period) equivalent via the core frequency helpers before folding it into the calculation.

### §66 Consistency

§60–§65 are **common-layer** behaviour — implemented once in `salary-calculator-core` /
the country registry (§19–§20), inherited by every current and future country calculator. The
country layer supplies only the payroll rules (§62's exact deduction set, tax/NI/CPP math). Adding
a country must not require re-implementing gross salary, frequency, 4-weekly, overtime, bonus,
commission, generic deductions or copy summary.

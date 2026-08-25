# Salary Calculator — Net Pay & Tax Engine Specification

## 1. Objective

Extend the existing gross-pay Salary Calculator into a country-aware salary and take-home-pay
calculator supporting:

1. United Kingdom
2. United States

The calculator must support:

- Gross salary/pay
- Net salary/pay
- Income tax
- Social/payroll taxes
- Optional deductions
- Optional bonuses
- Multiple pay frequencies
- Pay-date schedules
- Annual, monthly, weekly, and per-pay-period summaries
- Country-specific taxation (UK regional, US federal + state)
- Historical/current tax-year configuration
- Client-side calculation only
- No personal financial data transmitted or stored

The calculator should remain an **estimation tool**, not payroll software or tax-return software.

---

## 2. Core Architecture

Separate the application into four layers.

### Layer 1 — Salary Input

Normalise all user input into an annualised gross compensation model.

Inputs may be: hourly, daily, weekly, biweekly, 4-weekly, monthly, or annual. The existing
calculator already performs this normalisation.

Add support for: bonus, commission, other taxable income, and optional deductions.

### Layer 2 — Tax Engine

The tax engine receives a normalised annual compensation model and calculates:

```
gross income → taxable income → income tax → payroll/social taxes → deductions → credits → net annual income
```

Then converts the annual result into the requested pay frequency.

The tax engine must be country-specific:

```
TaxEngine
 ├── UKTaxEngine
 │    ├── EnglandWalesNI
 │    └── Scotland
 └── USTaxEngine
      ├── FederalTax
      ├── FICA
      ├── StateTax
      └── LocalTax
```

Do **not** implement US tax logic directly inside UI components.

### Layer 3 — Pay Schedule

See Section 5.

### Layer 4 — Presentation

The UI consumes the calculation result and pay schedule; it must not contain tax logic itself
(see Section 22, Architecture Principle).

---

## 3. Canonical Salary Model

Create one canonical internal representation:

```
SalaryInput {
  country,
  taxYear,
  grossAnnualSalary,
  bonus,
  commission,
  otherTaxableIncome,
  payFrequency,
  paySchedule,
  filingStatus,
  location,
  deductions,
  allowances,
  dependents
}
```

The calculation engine should operate primarily on annual values.

---

## 4. Pay Frequency

Supported frequencies and their period counts:

| Frequency | Periods/year | Definition |
|---|---|---|
| Hourly | — | Rate × hours |
| Daily | — | Rate × days |
| Weekly | 52 | — |
| Biweekly | 26 | Every 14 days |
| 4-weekly | 13 | Every 28 days — **must not** be treated as equivalent to biweekly |
| Monthly | 12 | Normally one payment per calendar month |
| Annual | 1 | — |

**Implemented** — `shared/tax-engine/pay-frequency.js`. Everything normalises through an annual
figure; chained conversions (monthly → weekly → hourly) accumulate error.

Hourly and Daily have no fixed period count because there is no fixed number of working hours in
a year — they resolve against the user's `{ hoursPerWeek, weeksPerYear, daysPerWeek }` schedule.

**On the 4-weekly rule.** Compute it as `annual / 13`. Note precisely what the hazard is:
`monthly × 12 / 13` is *algebraically identical* to `annual / 13`, so the two are not different
formulas. The failure is **rounding** — deriving 4-weekly from a monthly figure that has already
been rounded to pence for display drifts the answer. On a £55,000 salary the displayed monthly
£4,583.33 yields £4,230.77 via that route against £4,230.7692… computed directly.

Keep full precision internally and round only at the presentation layer (§10). The unit test
pins £55,000 specifically because it does not divide cleanly by 12, and asserts the two paths
produce different numbers — an earlier version of that test compared the two algebraically
identical expressions and therefore proved nothing.

---

## 5. Pay-Date Schedule Engine

This is an important new feature. The calculator should not merely calculate "£X per month" —
it should optionally show "your next 12 expected pay dates," with the schedule configurable by
the user.

Required inputs (depending on frequency): pay schedule type, pay date anchor, first pay date,
day of month.

### Biweekly

Input: first pay date. Generate `firstPayDate`, `firstPayDate + 14 days`, `+28 days`, etc.

Example: `01/09/2026 → 15/09/2026 → 29/09/2026 → 13/10/2026 → …`

The engine should also generate: next 12 dates, number of pay periods in the tax/calendar year,
current pay period, and annual number of periods. Do not assume every employer's biweekly
schedule begins on the same date.

### 4-Weekly

Generate `firstPayDate`, `+28 days`, `+56 days`, etc. — normally 13 pay periods/year. This
distinction is important for UK users.

### Monthly

Allow a configured pay day (e.g. day 25 → `25 January, 25 February, 25 March, …`).

Handle months where the selected date does not exist (e.g. day 31). Default rule: **last valid
day of month** (`31 January, 28 February, 31 March, 30 April, …`). Allow future support for:
last working day, last calendar day, specific weekday, specific business day.

### Working-Day Adjustment

Optional setting: if payday falls on a weekend, adjust to previous working day, next working
day, or no adjustment. Do not include bank-holiday calculations in V1 unless reliable holiday
data is available.

---

## 6. Bonus Model

Bonus must be optional. Support: no bonus, fixed annual bonus, percentage of salary, one-off
bonus, multiple bonuses. For V1: bonus amount + bonus payment date.

Example: base salary £60,000 + bonus £10,000 = gross compensation £70,000.

The tax engine must distinguish **regular salary** from **additional taxable compensation**,
because paycheck withholding can differ from annual tax liability.

### Bonus Display

Show: base salary, bonus, total gross compensation, estimated tax, estimated net income. Also
provide: net salary without bonus, net salary including bonus, estimated net bonus. This
directly answers the common question *"how much of my £10,000 bonus will I actually receive?"*

### Bonus Tax Treatment

The engine should calculate two views:

- **Annualized view:** salary + bonus → annual tax liability → annual net.
- **Bonus impact view:** net without bonus, net with bonus, difference.

```
Estimated net bonus = net with bonus − net without bonus
```

This avoids incorrectly assuming `bonus × marginal tax rate` is the final answer.

**Implemented** — `calculateUkBonusImpact()` runs the full engine twice, once with the bonus and
once without, and reports the difference. Returns `{ grossBonus, netBonus, deductedFromBonus,
effectiveBonusRate }` alongside both full result objects.

**Why running it twice is worth the cost.** Two worked cases from the unit tests:

| Case | Naive `bonus × marginal` | Actual | What the naive method misses |
|---|---|---|---|
| £60,000 + £10,000 | 40% | **42%** | 2% NI above the Upper Earnings Limit |
| £100,000 + £10,000 | 40% | **62%** | 2% NI **and** 20% from losing £5,000 of Personal Allowance |

The second case is the one that justifies the approach. A user earning £100,000 who receives a
£10,000 bonus keeps £3,800 of it. A marginal-rate calculation tells them £6,000 — a £2,200 error
on a figure they will check against their payslip.

Both cases are pinned in `tests_specs/infrastructure/unit/uk-tax-engine.test.js`.

---

## 7. UK Tax Engine

### 7.1 Regions

Must support England, Wales, Northern Ireland, and Scotland as separate regions — **do not use
one UK tax table**. England, Wales, and Northern Ireland generally share the same main Income
Tax bands, while Scotland has separate Scottish Income Tax bands.

### 7.2 Tax Year

UK tax year runs 6 April → 5 April (e.g. 2026/27 = 6 April 2026 – 5 April 2027).

The current 2026/27 Personal Allowance is **£12,570**. The Personal Allowance begins tapering
above £100,000 and can reach zero at £125,140.

Do not hard-code these values into calculation functions — store them in tax-data configuration
(see Section 9).

### 7.3 Income Tax Data Model

The actual calculation must read from a data table, not hard-coded conditionals.

**Bands are stored in TAXABLE-INCOME space, not gross-salary space.** This was decided during
implementation (2026-08-24) and supersedes the gross-bound example this section originally
carried (`lower_bound: 12570, upper_bound: 50270`).

| Field | Example (rUK basic rate) |
|---|---|
| id | `basic` |
| name | Basic rate |
| rate | 0.2 |
| from | 0 |
| to | 37700 |

**Why taxable-income space is the only correct choice:** the Personal Allowance tapers away
between £100,000 and £125,140 of gross income. Gross-space band boundaries are therefore not
constant — the £50,270 higher-rate threshold only holds for someone receiving the full £12,570
allowance. Taxable-income boundaries are constant for everyone.

**The trap this creates**, which must be understood before editing `income-tax.json`: converting
a quoted gross threshold to taxable space is `gross − 12,570` **only below the taper**. At
£125,140 the allowance is already nil, so taxable income equals gross income and the
additional-rate threshold is £125,140 in *both* spaces. Subtracting £12,570 from the top
threshold is the natural-looking mistake and it silently overtaxes every additional-rate payer.

The same reasoning applies to the six Scottish bands.

Implemented as `bandSets` (`rUK`, `scotland`) with `regions` mapping onto them, so England, Wales
and Northern Ireland share one definition rather than being duplicated three times.

### 7.4 National Insurance

Table: `uk_ni_rates` with fields `tax_year`, `category`, `lower_threshold`, `upper_threshold`,
`rate`. Do not calculate NI by simply applying one flat percentage to gross salary.

For standard employee Class 1 NI: 8% between the Primary Threshold and the Upper Earnings Limit,
2% above the UEL.

**NI bands are stored in GROSS-EARNINGS space** — the opposite convention to Income Tax (§7.3).
This is not an inconsistency to be tidied up. NI has its own thresholds and is calculated
entirely independently of the Personal Allowance; there is no "taxable income" concept in NI.
The generic algorithm (§11.3) supports both because it takes absolute boundaries on whatever
income measure the caller passes in.

**Use the annualised thresholds (£12,570 / £50,270), not the weekly ones.** HMRC publishes both,
and they do not reconcile: £242/week × 52 = £12,584 and £967/week × 52 = £50,284, neither of
which equals the annual figure. The weekly values are rounded for payroll runs. An annual-basis
calculator must use the annual thresholds or its results will not match an annual P60.

**Keep the Primary Threshold as its own field even though it currently equals the Personal
Allowance.** The two being both £12,570 is a coincidence of policy, not a shared value, and they
can diverge in any Budget. Deriving one from the other creates a bug that appears years later.

### 7.5 Optional UK Inputs

- **Pension:** contribution %, contribution amount, relief method.
- **Student loan:** None, Plan 1, Plan 2, Plan 4, Plan 5, Postgraduate. Student-loan
  calculations should be isolated from normal Income Tax/NI.
- **Other deductions:** other pre-tax deductions, other post-tax deductions.

#### 7.5.1 Pension relief method is not a label — it changes the arithmetic

A "salary sacrifice flag" is not sufficient; there are three methods with three different
outcomes for the same contribution percentage. Encoded as behaviour flags in `pension.json` so
the engine reads from data rather than branching on a method name:

| Method | Reduces taxable income | Reduces NIable earnings | Cost to take-home |
|---|---|---|---|
| Net pay arrangement *(default)* | yes | no | full contribution |
| Salary sacrifice | yes | **yes** | full contribution |
| Relief at source | no | no | **80%** of contribution |

Consequences that must be preserved:

- Salary sacrifice beats a net pay arrangement at the same percentage, because it also cuts the
  NI bill — £60/yr on a £60,000 salary contributing 5%, since the sacrificed £3,000 sits above
  the Upper Earnings Limit where NI is 2%.
- Relief at source is paid out of *net* pay and the scheme reclaims 20% basic-rate relief, so
  take-home falls by only 80% of the nominal contribution. Higher-rate relief is claimed
  separately through Self Assessment and **must not** appear in take-home pay.

Treating all three as "a percentage off gross" gives a wrong answer in two of the three cases.

#### 7.5.2 Student loans

Repayment is a percentage of gross income above a plan threshold, calculated independently of
Income Tax and NI.

A borrower can hold **an undergraduate plan and a postgraduate loan at the same time**, and both
are deducted. Plan selection is therefore not mutually exclusive with the postgraduate flag —
but selecting `postgraduate` *as* the plan while also setting the flag must not double-count.

### 7.6 UK Output

Display: gross annual salary, bonus, taxable income, Income Tax, National Insurance, pension,
student loan, other deductions, estimated annual/monthly/4-weekly/biweekly/weekly/daily/hourly
net salary. Also display: effective tax rate, total deductions, take-home percentage.

### 7.7 UK Calculation Explanation

Provide a calculation-basis section:

```
Gross salary
− Income Tax
− National Insurance
− Pension
− Student Loan
− Other deductions
= Estimated take-home pay
```

For income tax, show the bands actually used, e.g.:

```
Personal Allowance: £12,570 @ 0%
Basic-rate income:  £37,700 @ 20%
Higher-rate income: £X @ 40%
```

This makes the calculator auditable.

---

## 8. US Tax Engine

Treat the USA as a separate tax system with this calculation pipeline:

```
Gross wages → Pre-tax deductions → Federal taxable income → Federal income tax →
Social Security → Medicare → Additional Medicare Tax → State income tax →
Local income tax → Post-tax deductions → Net pay
```

### 8.1 Filing Status

Support: Single, Married Filing Jointly, Married Filing Separately, Head of Household. Do not
assume Single by default internally — the UI may default to Single, but the engine itself
should not.

### 8.2 Federal Tax Data

Table: `us_federal_income_tax_brackets` with fields `tax_year`, `filing_status`, `lower_bound`,
`upper_bound`, `rate`.

For 2026, the federal individual rates remain: 10%, 12%, 22%, 24%, 32%, 35%, 37%.

2026 standard deductions: Single $16,100 · Married Filing Jointly $32,200 · Head of Household
$24,150. Store as versioned tax data rather than hard-coding.

### 8.3 FICA

Separate tables: `us_social_security`, `us_medicare`, `us_additional_medicare`.

- Social Security needs: `rate`, `wage_base`, `tax_year`.
- Medicare needs: employee rate, additional Medicare threshold, additional Medicare rate.

Do not treat FICA as a state tax.

### 8.4 State Selection

Required input: state (all 50 states + District of Columbia). The state drives the state tax
engine.

### 8.5 State Tax Data

Do **not** write `if (state === "California") else if (state === "New York") …`. Instead create
`us_state_tax_rules` and `us_state_tax_brackets` tables:

| Field |
|---|
| state |
| tax_year |
| tax_structure (`none` \| `flat` \| `graduated`) |
| filing_status |
| lower_bound |
| upper_bound |
| rate |
| standard_deduction |
| personal_exemption |
| dependent_exemption |

This is necessary because US states have very different structures — for 2026, some states have
no individual income tax, some have flat rates, and others have graduated brackets.

### 8.6 US State Tax Table

Populate a master table with at minimum: state name, state code, tax year, whether income tax
exists, tax structure, single/married brackets, standard deductions, personal/dependent
exemptions, supported credits, source, and last-verified date.

Do not assume every state follows federal taxable income. The 2026 Tax Foundation dataset is
useful as a **research/data inventory**, but state tax calculations should ultimately be
validated against individual state tax authorities.

### 8.7 State Tax Complexity

The data model must support states with: no income tax, flat income tax, graduated income tax,
state-specific deductions/exemptions/credits, federal-tax deductibility, different filing
thresholds, special high-income taxes, and local income taxes. Do not design the schema around
a single `state_rate` field — that will fail for many states.

### 8.8 Local Taxes — excluded from V1 (decided 2026-08-23)

**V1 decision: no local/municipal income tax. Statewide calculations only.**

The architecture must still treat local tax as its own layer (`Federal + State + Local`) so it
can be added later without restructuring the pipeline — but no local tax data ships in V1, and
`tax-data/us/local/` is not created. Do not assume `State = Local`.

If added later, the schema should support: `state`, `county`, `city`, `local_tax_rate`,
`local_tax_type`.

**Required in V1:** the estimate must clearly state *"Local income taxes may not be included in
this estimate."* whenever USA mode is active. This must be visible in the UI near the result, not
buried in footer text. Do not silently present the result as exact.

**Known limitation being accepted:** take-home will be overstated for users in jurisdictions with
local income tax — NYC/Yonkers, Philadelphia and other PA municipalities, most Ohio cities,
Maryland counties, Detroit, St. Louis, Kansas City, Louisville, Birmingham. For a NYC earner this
can be several thousand dollars a year. This is a disclosed limitation, not a bug.

### 8.9 Payroll Deductions

Optional inputs: 401(k), 403(b), HSA, FSA, health/dental/vision insurance, other pre-tax
deductions, other post-tax deductions. Each deduction needs: `name`, `amount`, `frequency`,
`pre_tax_federal`, `pre_tax_state`, `pre_tax_fica`, `post_tax` — so the calculation engine can
determine which taxes each deduction affects.

### 8.10 Dependents

Support number of qualifying children and number of other dependents. Do not simply subtract a
generic "dependent amount" — credits should be represented independently (see 8.11).

### 8.11 Tax Credits

Design the engine so credits can be added independently:

```
FederalTax
 ├── StandardDeduction
 ├── TaxBrackets
 ├── ChildTaxCredit
 ├── OtherCredits
 └── FinalFederalTax
```

Do not hard-code credits into the bracket calculation.

---

## 9. Annual Tax vs. Payroll Withholding

Important distinction: the calculator should separate **estimated annual tax liability** from
**estimated paycheck withholding** — these are not necessarily identical.

The primary calculator should calculate estimated annual take-home pay, then divide the annual
result according to pay frequency. A future version may implement actual IRS paycheck
withholding methodology.

### Paycheck Mode

Two conceptual modes:

- **Annual estimate:** annual gross, annual taxes, annual net.
- **Paycheck estimate:** gross per paycheck, taxes per paycheck, net per paycheck.

For V1, paycheck mode may derive from annual calculations. Label it clearly as *"Estimated
paycheck amount,"* not *"Exact payroll withholding."*

---

## 10. Currency & Rounding

Country automatically determines currency: UK → GBP (£), USA → USD ($). All internal
calculations should use numeric values without currency symbols; formatting happens at the
presentation layer.

Use full precision internally; only round when displaying (e.g. £62,450.32, $84,231.77). Do not
round every intermediate tax calculation.

---

## 11. Tax Data Versioning & Sources

### 11.1 Versioning (mandatory)

Every tax table needs: `country`, `tax_year`, `effective_from`, `effective_to`, `source`,
`last_verified`.

```
UK: tax_year 2026/27, effective_from 2026-04-06, effective_to 2027-04-05
US: tax_year 2026,    effective_from 2026-01-01, effective_to 2026-12-31
```

### 11.2 Do Not Hard-Code Tax Rates

Bad: `if (salary > 50270) tax = salary * 0.4;`

Good: read from a data table (`taxData.getBands({ country: "UK", region: "England", taxYear: "2026/27" })`)
and run a generic progressive-tax algorithm against it.

### 11.3 Generic Progressive Tax Algorithm

**Implemented** — `shared/tax-engine/progressive-tax.js`.

```js
calculateProgressiveTax(income, bands)
  -> { total, breakdown: [{ id, name, rate, from, to, amountInBand, tax }], marginalRate }
```

`bands` is an array of `{ id, name, rate, from, to }`, where `to: null` marks the unbounded top
band. One implementation serves UK Income Tax, UK NI, and later US federal + every state.

**The design decision that makes reuse possible:** `from`/`to` are **absolute boundaries on
whatever income measure the caller passes in**, not offsets from a threshold. That single choice
lets the same function serve two incompatible conventions without branching:

| Caller | `income` argument | Bands start at |
|---|---|---|
| UK Income Tax | income after the Personal Allowance | 0 |
| UK National Insurance | gross earnings | 12,570 (Primary Threshold) |

Expressing NI as "offsets from a threshold" is where hand-rolled implementations go wrong,
because NI's thresholds have nothing to do with the Income Tax allowance.

`marginalRate` is the rate of the last band that actually received income — the rate on the next
pound earned. It is returned alongside the total specifically so the presentation layer can keep
it distinct from the effective rate (§12).

Two shapes deliberately live beside it rather than being forced into the band schedule:

- `calculateThresholdTax(income, threshold, rate)` — flat rate above a threshold. UK student
  loans, and several US states.
- `calculateTaperedAllowance(income, { amount, taper })` — an allowance that phases out. The UK
  Personal Allowance, and the same shape as several US state exemption phase-outs.

Pretending either is a progressive band schedule obscures what is happening and makes the taper
in particular impossible to explain to the user.

### 11.4 Data Sources

**UK:** HMRC/GOV.UK is the primary source for Income Tax rates, allowances, regional bands, and
National Insurance rates/thresholds (2026/27).

**USA federal:** IRS — Revenue Procedures, tax tables, payroll publications, withholding
publications. The IRS's 2026 inflation-adjustment guidance documents the federal brackets and
standard deductions.

**USA state:** each state's Department of Revenue (or equivalent authority) and official tax
forms/instructions, cross-checked against the Tax Foundation's 2026 state dataset (brackets,
rates, standard deductions, exemptions) as a data-inventory starting point — not a substitute
for state-authority validation.

### 11.5 Data File Layout (as built)

Root: `public/calculators/salary-calculators/shared/tax-data/`

Chosen to sit beside `salary-utils.js`, which the cluster already shares. Served statically and
fetched on demand, so the 51 state files never enter the initial payload. Already covered by the
`/calculators/*` noindex header, so the raw JSON cannot be indexed.

```text
shared/tax-data/
├── uk/                          ← built 2026-08-24
│   ├── income-tax.json          band sets: rUK + scotland, PA taper
│   ├── national-insurance.json  Class 1 employee
│   ├── student-loans.json       Plans 1/2/4/5 + Postgraduate
│   └── pension.json             3 relief methods, auto-enrolment
└── us/                          ← not yet built
    ├── federal-income-tax.json
    ├── fica.json
    ├── payroll-taxes.json       state SDI / PFML / employee-SUI (Bucket A)
    └── states/
        ├── AL.json
        └── ...                  all 50 + DC, including the 9 no-tax states
                                 as explicit "taxStructure": "none" files
```

`us/local/` is **deliberately absent** — see §8.8 (B2 decision).

Do not put all US tax data into one enormous JavaScript file.

### 11.7 Validation (mandatory before ship)

`scripts/validate-tax-data.mjs` enforces this section mechanically.

```bash
node scripts/validate-tax-data.mjs            # structural; warns on unverified tables
node scripts/validate-tax-data.mjs --strict   # pre-ship gate; FAILS on unverified tables
```

Structural checks: §11.1 metadata present, `source` is a URL, rates are fractions in 0–1 (catches
`20` entered for 20%), band boundaries **contiguous and non-overlapping**, top band unbounded,
PA taper internally consistent, auto-enrolment percentages sum, exactly one default pension
relief method.

Band contiguity is checked because neither failure mode throws on its own — a gap silently
under-taxes and an overlap silently double-taxes. Both produce a plausible wrong number.

Strict mode additionally requires `lastVerified` to be a real date and
`verification.status === "verified"`. **A table whose figures have not been confirmed against
its official source carries `lastVerified: null` and blocks the build.** This is the enforcement
mechanism for §11.2 and §11.4 — a confidently-presented wrong tax figure is worse than no
calculator at all.

### 11.6 US State JSON Example

```json
{
  "state": "CA",
  "name": "California",
  "taxYear": 2026,
  "taxStructure": "graduated",
  "filingStatuses": {
    "single": { "standardDeduction": 5540, "brackets": [] },
    "marriedFilingJointly": { "standardDeduction": 11080, "brackets": [] }
  },
  "credits": [],
  "specialRules": [],
  "source": "...",
  "lastVerified": "2026-..."
}
```

Actual bracket values should be populated from validated 2026 data.

---

## 12. Effective Tax Rate & Marginal Rate

```
effectiveTaxRate = (total tax / gross taxable compensation) × 100
```

Also provide total deductions and take-home percentage. Do not call the effective tax rate the
user's marginal tax rate — where possible, show marginal rate separately (e.g. *"Effective tax
rate: 27.4%, marginal income-tax rate: 40%"*). This is particularly useful for UK and US users.

---

## 13. Calculation Explanation

Every result must be explainable:

```
Gross income − pre-tax deductions = taxable income
Taxable income − income tax − payroll taxes − state/local taxes − other deductions = estimated take-home
```

The exact components depend on country.

The existing calculator's "Calculation basis" concept is a strong foundation for this — for the
new version, make it substantially more powerful: users should be able to expand the result and
see which tax bands were applied, how much income landed in each band, each deduction, and the
resulting effective tax rate. This is what will make the calculator feel trustworthy rather than
a black box.

---

## 14. Disclaimer

The calculator should clearly state:

> This calculator provides an estimate of take-home pay based on the information and tax rules
> selected. Actual payroll deductions may differ because of employer payroll settings, benefits,
> deductions, tax elections, credits, local taxes and other circumstances. It is not tax or
> financial advice.

For USA, add: *"State and local tax treatment can vary by jurisdiction."*
For UK, add: *"PAYE, National Insurance, pension, student loan and other deductions may vary
from the estimate."*

---

## 15. SEO Requirements

Create separate country pages, for example:

```
/salary-calculators/salary-calculator/
/salary-calculators/uk-salary-calculator/
/salary-calculators/us-salary-calculator/
```

Potential supporting pages: `/uk-tax-calculator/`, `/us-tax-calculator/`,
`/uk-take-home-pay-calculator/`, `/us-take-home-pay-calculator/`.

Do not create hundreds of thin state pages automatically without meaningful unique content.

---

## 16. Performance & Privacy

The calculator must remain entirely client-side: no API calls for calculation, no database, no
server-side calculation. Tax data should be bundled/static. Target **< 50 ms** for normal
calculations on modern desktop hardware.

Maintain the existing privacy model: no salary, name, email, address, or tax information should
be transmitted to the server merely to calculate a result. Everything runs locally in the
browser.

---

## 17. Architecture Principle

The most important implementation principle:

```
UI → Salary Normalisation → Country Tax Engine → Tax Data → Calculation Result → Pay Schedule → UI
```

**Not:** `UI → hundreds of tax conditions`.

---

## 18. Future Extensibility

The architecture should make these possible later without rewriting the salary calculator:
Canada, Australia, Ireland, Germany, India. Each new country should implement a
`CountryTaxEngine` against the same interface.

For the USA specifically, the architecture should be even more data-driven than a naive
implementation: Federal → State → Local, each its own rules layer. The 2026 state landscape
alone spans no-income-tax, flat-tax, and graduated-tax states, several with unusual
deductions/exemptions — so state calculators should not be hand-written one-by-one. Instead,
build the calculation engine generically against a structured `tax-data/us/states/*.json`
dataset:

```
salary → normalise to annual → bonus + taxable compensation → pre-tax deductions →
Federal tax engine → FICA → State tax engine → Local tax engine (if supported) →
post-tax deductions → annual net → pay-frequency conversion → pay-date schedule
```

This is far more maintainable when tax rates change year over year — updates become a data
change, not a logic rewrite.

---

## 19. V1 Scope

### Must Have — UK

England, Wales, Scotland, Northern Ireland · Income Tax · National Insurance · Pension ·
Student loan · Bonus · All pay frequencies · Pay-date schedule

### Must Have — USA

Federal income tax · FICA · All 50 states + DC · Filing status · Standard deductions · State
brackets · State deductions/exemptions · Bonus · Pay-date schedule · Major pre-tax deductions

### Nice to Have — USA

Local taxes · 401(k) · HSA · FSA · Health insurance · Dependents · Tax credits

### Future

Full payroll withholding · Business/self-employed calculations · Capital gains · Investment
income · Multiple jobs · Spouse income · Detailed W-4 modelling · UK salary sacrifice · UK
benefits-in-kind · Employer costs

---

## 20. Critical Product Decision

Do not try to make the first version an exact payroll engine. The product should position
itself as an **estimated take-home pay calculator**, not an **exact tax calculator**. The
calculation should be transparent, deterministic, and data-driven.

---

## 21. Implementation Sequence

Before writing calculation code:

1. Define the canonical salary model.
2. Define the tax-engine interfaces.
3. Define the tax-data schemas.
4. Separate UK and US tax engines.
5. Implement the generic progressive-tax calculation.
6. Implement UK tax rules.
7. Implement US federal rules.
8. Implement US state rules using data files.
9. Implement bonus handling.
10. Implement pay-frequency conversion.
11. Implement pay-date scheduling.
12. Implement calculation explanations.
13. Add automated boundary tests.
14. Only then integrate the UI.

The UI layer should consume the calculation result and must **not** contain tax logic. Tax
rates, thresholds, brackets, deductions, and exemptions must be represented as versioned data —
do not invent tax rates. When tax data is uncertain, flag the field for verification rather than
guessing.

The implementation must clearly distinguish:

- **Tax liability** from **payroll withholding**
- **Annual net income** from **per-paycheck net income**

The final calculator should provide a transparent calculation breakdown so a user can understand
exactly how gross salary became estimated take-home pay.

---

## 22. Implementation Status

Updated 2026-08-24. The build checklist
(`salary-calculator-build-checklist.md`) is the authoritative task list; this section maps spec
sections onto what actually exists so a reader of *this* document knows which parts are still
design and which are code.

### 22.1 Built

| Artifact | Covers |
|---|---|
| `shared/tax-engine/progressive-tax.js` | §11.3 — `calculateProgressiveTax`, `calculateThresholdTax`, `calculateTaperedAllowance` |
| `shared/tax-engine/pay-frequency.js` | §4 — `toAnnual`, `fromAnnual`, `periodsPerYear` |
| `shared/tax-engine/uk-engine.js` | §7 — `calculateUkTakeHome`, `calculateUkBonusImpact` |
| `shared/tax-data/uk/*.json` (4 files) | §7.3, §7.4, §7.5, §11.1, §11.5 |
| `scripts/validate-tax-data.mjs` | §11.7 — structural checks + `--strict` pre-ship gate |
| `tests_specs/infrastructure/unit/uk-tax-engine.test.js` | §13 boundary tests — 54 passing |

Against §21's implementation sequence: steps 5, 6, 9, 10 are done for the UK, step 13 is done for
what exists, and step 3 is done for UK schemas.

### 22.2 Not built

- **US engine and US tax data** (§8) — federal, FICA, 51 state files, state payroll taxes.
  The generic algorithm is proven, so this is data entry against a state schema (§11.6) rather
  than new algorithm design.
- **Pay-date schedule engine** (§5) — biweekly/4-weekly/monthly generation, month-end rule,
  working-day adjustment. The behaviour is fully specified and demonstrated in the UI mockup, but
  the mockup's version is throwaway JS, not engine code. Per §5's requirement plus the UI's pay
  sheet, the result rows must carry `{ date, grossAmount, netAmount, isBonusPeriod }`, not dates
  alone.
- **`GrossOnlyEngine`** — the existing gross-pay conversion path, to be preserved as its own mode.
- **Canonical `SalaryInput` model** (§3) — currently an informal JSDoc typedef on each engine.
  Deliberately deferred until the US engine exists and the genuinely shared shape is known rather
  than guessed.
- **UI integration** (§21 step 14) — nothing is wired into the live page. The existing gross-only
  `salary-calculator` page is untouched.

### 22.3 Tax figures are NOT verified

`node scripts/validate-tax-data.mjs --strict` **currently exits 1.** All four UK tables carry
`lastVerified: null`, which is deliberate and follows §21's instruction to *"flag the field for
verification rather than guessing."*

Each file carries a `verification` block with a confidence rating:

| Table | Confidence | Needs |
|---|---|---|
| `income-tax.json` — rUK bands | high | Thresholds frozen to April 2028, so 2026/27 should equal 2025/26. Confirm on gov.uk |
| `income-tax.json` — **Scotland bands** | **low** | **Values are 2025/26.** Scottish rates are set annually by the Scottish Budget and starter/basic thresholds are routinely uprated. Replace from gov.scot |
| `national-insurance.json` | medium-high | 8%/2% structure has held since April 2024 and reconciles exactly to £3,210.60 on £60,000. Confirm no rate change |
| `student-loans.json` | **low** | **Values are 2025/26.** Plan 1/2/4 thresholds uprate annually; a wrong threshold moves the result by hundreds a year |
| `pension.json` | medium | Confirm the qualifying earnings band for 2026/27 |

Nothing ships until each is confirmed against its §11.4 source, `lastVerified` is set to a real
date, and `verification.status` is flipped to `verified`.

### 22.4 Corrections this section records

Two things in this spec were wrong or underspecified and have been amended in place rather than
left to be rediscovered:

1. **§7.3** originally showed Income Tax bands with gross bounds (`12570`–`50270`). That cannot
   work once the Personal Allowance taper is modelled. Rewritten to taxable-income space, with
   the boundary-conversion trap spelled out.
2. **§4's 4-weekly warning** was stated as "use `annual / 13`, never `monthly × 12 / 13`". Those
   two expressions are algebraically identical; the real hazard is rounding an intermediate
   monthly figure. Restated accurately. The first version of the corresponding unit test asserted
   the two expressions were equal and therefore proved nothing — it has been rewritten.

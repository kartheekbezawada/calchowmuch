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

Table: `uk_income_tax_bands`

| Field | Example |
|---|---|
| tax_year | 2026/27 |
| region | England |
| band_name | Basic |
| lower_bound | 12570 |
| upper_bound | 50270 |
| rate | 0.20 |

The actual calculation must read from this data table, not hard-coded conditionals.

### 7.4 National Insurance

Table: `uk_ni_rates` with fields `tax_year`, `category`, `lower_threshold`, `upper_threshold`,
`rate`.

For standard employee Class 1 NI, 2026/27 uses 8% between £242/week and £967/week, and 2% above
£967/week. Also support annualised equivalents where appropriate. Do not calculate NI by simply
applying one flat percentage to gross salary.

### 7.5 Optional UK Inputs

- **Pension:** contribution %, contribution amount, salary sacrifice flag.
- **Student loan:** None, Plan 1, Plan 2, Plan 4, Plan 5, Postgraduate. Student-loan
  calculations should be isolated from normal Income Tax/NI.
- **Other deductions:** other pre-tax deductions, other post-tax deductions.

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

The engine should support a reusable `calculateProgressiveTax(taxableIncome, brackets)`
function, where `brackets` is an array of `{ lower, upper, rate }` objects. This same algorithm
is reused for UK, US federal, US states, and future countries.

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

### 11.5 Recommended Data File Layout

```
tax-data/
├── uk/
│   ├── income-tax.json
│   ├── national-insurance.json
│   ├── student-loans.json
│   └── pension.json
└── us/
    ├── federal-income-tax.json
    ├── fica.json
    ├── states/
    │   ├── AL.json
    │   ├── AK.json
    │   ├── AZ.json
    │   └── ...
    └── local/
```

Do not put all US tax data into one enormous JavaScript file.

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

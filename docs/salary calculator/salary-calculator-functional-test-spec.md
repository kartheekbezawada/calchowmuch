# Salary Calculator — Functional Test Specification

Companion document to `salary-calculator-tax-engine-spec.md`. Covers the concrete functional
test matrices for the UK/US net-pay feature. For the broader QA framework (regression,
property-based, performance, security, CI/CD), see `salary-calculator-qa-test-strategy.md`.

## 1. Why Functional Testing Matters Most Here

For this calculator, functional testing is arguably more important than unit testing, because
the dangerous failures are not JavaScript bugs — they're cases where the calculator produces a
**plausible-looking but incorrect** take-home salary.

Functional tests should exercise the complete flow, not individual functions in isolation:

```
User input → Validation → Salary normalisation → Tax calculation → Deductions →
Bonus → Net salary → Pay-frequency conversion → Pay-date schedule → Displayed result
```

---

## 2. UK Functional Test Matrix

### 2.1 Basic Salary Boundaries

| Scenario | Input | Expected behaviour |
|---|---|---|
| Low salary | £10,000 | Correct tax/NI treatment |
| Personal allowance boundary | £12,570 | No income tax |
| Just above allowance | £12,571 | Tax begins |
| Basic-rate boundary | £50,270 | Correct band transition |
| Just above basic rate | £50,271 | Higher-rate calculation begins |
| Standard salary | £60,000 | Correct PAYE/NI |
| Taper start | £100,000 | Personal allowance taper begins |
| Taper end | £125,140 | Personal allowance reaches zero |
| Additional rate | £150,000 | Additional-rate calculation |

Boundary tests are particularly important.

### 2.2 Region Tests

The same salary must be tested against England, Wales, Northern Ireland, and Scotland. Example:

```
Select England → enter £60,000 → calculate
Select Scotland → enter £60,000 → calculate
Verify: results differ appropriately
```

### 2.3 Pay Frequency Tests

For a fixed annual salary of £60,000, test hourly, daily, weekly, biweekly, 4-weekly, monthly,
and annual. The system should correctly normalise them back to the same annual gross
compensation, subject to schedule assumptions:

```
Weekly   = £60,000 / 52
Biweekly = £60,000 / 26
4-weekly = £60,000 / 13
Monthly  = £60,000 / 12
```

Then verify the net calculations for each.

### 2.4 Critical 4-Weekly Test

This deserves its own dedicated test. Given annual salary = £52,000, expected:

```
Weekly   = £1,000
Biweekly = £2,000
4-weekly = £4,000
Monthly  = £4,333.33
```

Do **not** accidentally calculate `4-weekly = monthly × 12 / 13` with incorrect rounding or
frequency assumptions — 4-weekly pay is 13 periods of `annual / 13`, not derived from monthly.

### 2.5 Bonus Tests

| Case | Salary | Bonus | What to verify |
|---|---|---|---|
| No bonus | £60,000 | £0 | Baseline |
| Fixed bonus | £60,000 | £10,000 | gross/net with vs. without bonus, net bonus |
| Large bonus (multi-band) | £60,000 | £100,000 | Movement through multiple tax bands |
| Bonus equals salary | £60,000 | £60,000 | — |

### 2.6 Pension Tests

Test: no pension, 5%, 10%, fixed £ amount. For each, verify gross, taxable income, tax, NI,
pension, and net. Also test salary sacrifice separately if supported.

### 2.7 Student Loan Tests

Separate functional suites for: no student loan, Plan 1, Plan 2, Plan 4, Plan 5, Postgraduate.
For each, test salaries below threshold, exactly at threshold, £1 above threshold, and a high
salary — this is exactly the kind of boundary that can produce plausible-but-wrong results.

---

## 3. US Functional Test Matrix

### 3.1 Scale

At minimum: 50 states + DC, each tested across Single / Married Filing Jointly / Married Filing
Separately / Head of Household, across several salary levels. That's a baseline matrix of
roughly **51 × 4 × salary scenarios** before even testing deductions and bonuses.

### 3.2 Federal Boundary Levels

Test: $10,000, $16,100, $25,000, $50,000, $100,000, $200,000, $400,000, $1,000,000 — then test
the exact federal bracket boundaries. The important question isn't "does $100,000 work?" — it's
"does $99,999 → $100,000 → $100,001 behave correctly?"

### 3.3 State Functional Tests

Classify every state first: `NO_INCOME_TAX`, `FLAT_TAX`, `GRADUATED_TAX`, `SPECIAL_RULES`. Test
one representative case per class, but the production suite should cover every state.
Particularly useful representative states (materially different structures): California, Texas,
Florida, New York, New Jersey, Pennsylvania, Illinois, Massachusetts, Washington, Tennessee.

### 3.4 State Selection / Switching Test

```
Enter $100,000, State = California → Calculate
Change state = Texas → Calculate
Verify: Federal tax remains consistent, FICA remains consistent, State tax changes, Net pay changes
```

The calculator must not retain California's tax rules after switching to Texas.

### 3.5 Filing Status Tests

For $100,000, test Single / MFJ / MFS / HOH and verify the federal calculation changes
appropriately. Repeat for selected states.

### 3.6 FICA Tests

Test salaries around the Social Security wage base: below, exactly at, above, and significantly
above — verify Social Security taxation stops/changes at the right threshold. Then test Medicare
at below/exactly/above the Additional Medicare threshold.

### 3.7 Deduction Tests

For a $100,000 salary, test: no deductions, 401(k), HSA, FSA, health insurance, multiple
deductions combined. Verify the correct tax bases change — e.g. a deduction flagged
`pre_tax_federal: true, pre_tax_fica: false` must affect federal taxable income but **not**
FICA. This is exactly why the deduction data model needs those flags (see tax engine spec §8.9).

---

## 4. Pay-Date Functional Tests

Test separately from taxation.

- **Biweekly:** first payday 4 Sep 2026 → expect `4 Sep, 18 Sep, 2 Oct, 16 Oct, 30 Oct, …`
- **4-weekly:** `4 Sep, 2 Oct, 30 Oct, 27 Nov, …` — verify dates are exactly 28 days apart.
- **Monthly:** pay day 25 → `25 Jan, 25 Feb, 25 Mar, …`
- **Month-end (critical):** pay day 31 → `31 January, 28 February, 31 March, 30 April, …` under
  the "last valid day of month" rule. Also test "previous working day" / "next working day"
  rules if those features exist.
- **Leap year:** test 29 February in leap years and 28 February in non-leap years — the date
  engine should never generate an invalid date.
- **Tax-year boundary (UK, important):** test 5 April → 6 April, since the UK tax year changes
  on 6 April (e.g. 5 April 2027 → tax year 2026/27; 6 April 2027 → 2027/28). For the US, test
  31 December → 1 January transitioning tax years.
- **Bonus date:** test bonus paid same date as salary, mid-year, end of year, and at the
  tax-year boundary (UK: 5 April vs. 6 April).

---

## 5. Input Validation Tests

Test: empty salary, zero salary, negative salary, text input, decimal salary, very large salary,
negative bonus, negative deduction, invalid date, missing US state, missing filing status.
Expected behaviour must be explicitly defined — e.g. `salary = -1000` should produce a
validation error and no calculation, **not** `Net salary = £-1000`.

---

## 6. Regression / State-Leakage Tests

These catch a classic bug class: stale state leaking between calculations.

- **State switching regression:** California → Texas → New York → Florida → California. The
  final California result must exactly match the original California result.
- **Country switching regression:** UK → USA → UK. The final UK result must exactly match the
  initial UK result — catches stale tax-engine state.
- **Frequency switching regression:** Annual → Monthly → Weekly → Biweekly → 4-weekly → Annual.
  The annualised salary must remain consistent throughout.
- **Bonus toggle regression:** Bonus OFF → ON → OFF. The final result must exactly match the
  original no-bonus result.
- **Deduction toggle regression:** Pension OFF → ON → OFF. Results must return to the original
  state.

---

## 7. Calculation Invariants

Verify basic invariants hold across all scenarios:

```
grossAnnual >= 0
tax >= 0
netAnnual >= 0
netAnnual <= grossAnnual + non-taxable adjustments
```

And cross-frequency reconciliation (allow only explicitly documented rounding differences):

```
biweekly × 26 ≈ annual
4weekly × 13 ≈ annual
monthly × 12 ≈ annual
weekly × 52 ≈ annual
```

### 7.1 Cross-Frequency Consistency Test

For £60,000: calculate net annual once, then calculate monthly/weekly/biweekly/4-weekly net
independently. The totals should reconcile against the annual figure as above. This single test
catches a large class of bugs.

---

## 8. UI / Playwright E2E Tests

### 8.1 UK Flow

```
Navigate to UK salary calculator → Select England → Enter £60,000 → Select Annual → Click Calculate
Verify: Gross = £60,000, Income tax exists, NI exists, Net salary exists

Then: Change to Scotland → Verify result changes
Then: Add £10,000 bonus → Verify gross increases, tax changes, net increases
```

### 8.2 US Flow

```
Navigate to US salary calculator → Select California → Select Single → Enter $100,000 → Calculate
Verify: Federal tax displayed, Social Security displayed, Medicare displayed,
        California tax displayed, Net salary displayed

Then: Change state to Texas
Verify: Federal tax ≈ unchanged, FICA ≈ unchanged, State tax changes, Net changes
```

---

## 9. Accessibility Functional Tests

Since this is a public calculator, test keyboard navigation, labels, focus, buttons, select
controls, error messages, and ARIA where necessary. At minimum, a user should be able to
complete the calculator without a mouse.

---

## 10. Copy Summary Test

The existing calculator has a "Copy summary" feature — keep it. Functional test: calculate a
salary, click Copy Summary, read the clipboard, and verify it contains salary, tax, deductions,
net, frequency, and country — enough information to make sense outside the website.

---

## 11. Privacy Functional Test

Because the calculator explicitly promises client-side processing, test that promise directly
with Playwright: intercept network requests, enter a salary, calculate, and verify **no**
salary/tax data is sent to the server. This is a product requirement, not merely a technical
optimisation.

---

## 12. Responsive Functional Testing

Test at desktop, tablet, and mobile — but functional behaviour matters more than pixel-perfect
layout here. Verify at each breakpoint: can the user enter salary, select state, select
frequency, see the result, expand the calculation, and copy the result?

---

## 13. Test Data / File Architecture

```
tests/
├── unit/
│   ├── tax/
│   ├── salary/
│   └── dates/
├── integration/
│   ├── uk/
│   ├── us/
│   ├── bonus/
│   └── deductions/
├── functional/
│   ├── uk-salary.spec.ts
│   ├── uk-scotland.spec.ts
│   ├── uk-pay-schedule.spec.ts
│   ├── us-federal.spec.ts
│   ├── us-states.spec.ts
│   ├── us-filing-status.spec.ts
│   ├── bonus.spec.ts
│   ├── deductions.spec.ts
│   └── country-switching.spec.ts
└── fixtures/
    ├── uk/
    └── us/
```

---

## 14. Golden Test Cases — The Most Important Test Category

Create a permanent golden test dataset:

```
golden-cases/
    uk-2026-27.json
    us-2026.json
```

Each case:

```json
{
  "input": { "country": "UK", "region": "England", "salary": 60000, "frequency": "annual" },
  "expected": { "grossAnnual": 60000, "incomeTax": "...", "nationalInsurance": "...", "netAnnual": "..." },
  "source": "...",
  "verifiedDate": "..."
}
```

Every change to the tax engine should run against these cases. This is essential for catching
regressions when tax years roll over (e.g. 2026 → 2027) — you want to know immediately if a
change accidentally broke a prior year's calculations.

---

## 15. Where This Fits in the Overall Testing Levels

```
┌──────────────────┐
│  Playwright E2E  │  User behaviour
└────────┬─────────┘
┌────────▼─────────┐
│ Integration Tests│  Tax + salary
└────────┬─────────┘
┌────────▼─────────┐
│ Functional Tax   │  Golden cases
└────────┬─────────┘
┌────────▼─────────┐
│   Unit Tests     │  Algorithms/Data
└──────────────────┘
```

For this project, integration tests and golden functional cases should carry more weight than a
large volume of small unit tests. The fundamental question every test in this document serves:
*given this exact salary, country, state, tax year, filing status, bonus, and deductions, does
CalcHowMuch produce the correct result?* That's the test that matters to the user.

This fits naturally into the existing CalcHowMuch stack (Playwright + Vitest) rather than
introducing a new framework.
